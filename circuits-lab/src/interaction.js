import * as THREE from "three";

const TAU = Math.PI * 2;
export function signedTwistAngle(deltaQuaternion, axis) {
  const unit = axis.clone().normalize();
  let angle = 2 * Math.atan2(deltaQuaternion.x * unit.x + deltaQuaternion.y * unit.y + deltaQuaternion.z * unit.z, deltaQuaternion.w);
  while (angle > Math.PI) angle -= TAU;
  while (angle < -Math.PI) angle += TAU;
  return angle;
}

/** Probe models run from the metal tip at local Y=0 toward the handle along +Y. */
export function probeGripPose(handPosition, controllerQuaternion, pickupQuaternion, probeLength = 0.168) {
  // Calibrate away the controller's pickup pose once. Later wrist turns remain relative
  // to that pose, so the probe starts tip-down without continually forcing it upright.
  const quaternion = controllerQuaternion.clone().multiply(pickupQuaternion.clone().invert()).normalize();
  const gripDistance = Math.min(probeLength * 0.6, 0.1);
  const handleOffset = new THREE.Vector3(0, gripDistance, 0).applyQuaternion(quaternion);
  return { position: handPosition.clone().sub(handleOffset), quaternion };
}

export function nearestTerminal(position, terminals, radius = 0.055) {
  if (!position) return null;
  let nearest = null,
    distance = radius;
  for (const terminal of terminals) {
    const next = position.distanceTo(terminal.position);
    if (next <= distance) {
      nearest = terminal;
      distance = next;
    }
  }
  return nearest;
}

/** Input-independent circuit manipulation. Rendering only follows these holds. */
export function createDirectInteraction({
  getModel = () => ({}),
  getTerminals = () => [],
  onProbe = () => {},
  onConnect = () => {},
  onDisconnect = () => {},
  onChange = () => {},
  onAction = () => {},
  onGraphCursor = () => {},
  onHold = () => {},
  snapRadius = 0.055,
} = {}) {
  const holds = new Map(),
    blocked = new Set(),
    resources = new Map();
  function begin(input, target, sample = {}) {
    if (!target || blocked.has(input) || holds.has(input)) return false;
    const resource = target.resource || `${target.kind}:${target.channel || target.id}`;
    if (resources.has(resource)) return false;
    const model = getModel();
    const hold = {
      input,
      target,
      resource,
      position: sample.position?.clone(),
      startPosition: sample.position?.clone(),
      turn: 0,
      lastValue: undefined,
    };
    if (target.kind === "dial") {
      hold.startValue = model.parameters?.[target.parameter];
      hold.values = target.values || model.options?.[target.parameter];
      if (!hold.values && !Number.isFinite(hold.startValue)) return false;
      if (hold.values && !hold.values.includes(hold.startValue)) hold.startValue = hold.values[0];
      hold.lastValue = hold.startValue;
    }
    holds.set(input, hold);
    resources.set(resource, input);
    onHold("start", hold);
    // Removing the physical contact opens the measurement/circuit immediately.
    if (target.kind === "probe") onProbe(target.channel, null);
    if (target.kind === "plug" && Number.isInteger(target.wireIndex)) onDisconnect(target.wireIndex);
    if (target.kind === "button" || target.kind === "switch") onAction(target.action);
    if (target.kind === "screen" && Number.isFinite(sample.fraction))
      onGraphCursor(THREE.MathUtils.clamp(sample.fraction, 0, 1), sample.panelIndex || 0);
    return true;
  }
  function move(input, sample = {}) {
    const hold = holds.get(input);
    if (!hold) return false;
    if (sample.position) hold.position = sample.position.clone();
    if (sample.quaternion) hold.quaternion = sample.quaternion.clone();
    if (hold.target.kind === "dial" && Number.isFinite(sample.turn)) {
      hold.turn += sample.turn;
      const target = hold.target;
      let value;
      if (hold.values?.length) {
        const delta = Math.round(hold.turn / (target.detentRadians || Math.PI / 12));
        const index = THREE.MathUtils.clamp(hold.values.indexOf(hold.startValue) + delta, 0, hold.values.length - 1);
        value = hold.values[index];
      } else {
        const step = target.step || 1;
        value = THREE.MathUtils.clamp(
          hold.startValue + Math.round(hold.turn / (target.detentRadians || Math.PI / 12)) * step,
          target.min ?? -Infinity,
          target.max ?? Infinity
        );
        value = Number(value.toPrecision(12));
      }
      if (value !== hold.lastValue) {
        hold.lastValue = value;
        onChange(target.parameter, value);
      }
    }
    if (hold.target.kind === "screen" && Number.isFinite(sample.fraction))
      onGraphCursor(THREE.MathUtils.clamp(sample.fraction, 0, 1), sample.panelIndex || 0);
    onHold("move", hold);
    return true;
  }
  function finish(input, sample = {}, cancelled = false) {
    blocked.delete(input);
    const hold = holds.get(input);
    if (!hold) return null;
    if (sample.position) hold.position = sample.position.clone();
    holds.delete(input);
    resources.delete(hold.resource);
    const terminal = cancelled ? null : nearestTerminal(hold.position, getTerminals(), snapRadius);
    let result = { kind: cancelled ? "cancelled" : "released", terminal: null };
    if (hold.target.kind === "probe") {
      onProbe(hold.target.channel, terminal?.id || null);
      result = { kind: terminal ? "connected" : "loose", terminal: terminal?.id || null };
    }
    if (hold.target.kind === "terminal" || hold.target.kind === "plug") {
      const from = hold.target.from || hold.target.terminal;
      if (!cancelled && terminal && terminal.id !== from) {
        onConnect(from, terminal.id);
        result = { kind: "connected", terminal: terminal.id };
      } else {
        const barelyMoved = hold.startPosition && hold.position && hold.startPosition.distanceTo(hold.position) < 0.018;
        result = { kind: hold.target.kind === "terminal" && barelyMoved ? "cancelled" : "loose", terminal: null };
      }
    }
    onHold("end", hold, result);
    return result;
  }
  function cancelAll() {
    const inputs = [...holds.keys()];
    for (const input of inputs) {
      finish(input, {}, true);
      blocked.add(input);
    }
  }
  return {
    begin,
    move,
    end: (input, sample) => finish(input, sample),
    cancelAll,
    release(input) {
      blocked.delete(input);
    },
    block(input) {
      if (holds.has(input)) finish(input, {}, true);
      blocked.add(input);
    },
    hold: (input) => holds.get(input),
    holds,
    isHeld: (resource) => resources.has(resource),
  };
}

export function constrainMovement(
  position,
  delta,
  { bounds = { minX: -3.2, maxX: 3.2, minZ: -3.8, maxZ: 2.4 }, obstacles = [], radius = 0.19 } = {}
) {
  const result = position.clone();
  const steps = Math.max(1, Math.ceil(Math.hypot(delta.x, delta.z) / 0.04));
  const dx = delta.x / steps,
    dz = delta.z / steps;
  const penetration = (x, z, box) => {
    const edges = [x - (box.minX - radius), box.maxX + radius - x, z - (box.minZ - radius), box.maxZ + radius - z];
    return Math.max(0, Math.min(...edges));
  };
  // Tracking may place a head inside a virtual obstacle. Always permit movement that exits it.
  const blocked = (x, z) =>
    obstacles.some((box) => {
      const next = penetration(x, z, box),
        previous = penetration(result.x, result.z, box);
      if (next <= 0) return false;
      if (previous <= 0) return true;
      if (next < previous - 1e-10) return false;
      const cx = (box.minX + box.maxX) / 2,
        cz = (box.minZ + box.maxZ) / 2;
      const before = (result.x - cx) ** 2 + (result.z - cz) ** 2,
        after = (x - cx) ** 2 + (z - cz) ** 2;
      return next > previous + 1e-10 || after <= before + 1e-10;
    });
  for (let i = 0; i < steps; i++) {
    const x = THREE.MathUtils.clamp(result.x + dx, bounds.minX + radius, bounds.maxX - radius);
    if (!blocked(x, result.z)) result.x = x;
    const z = THREE.MathUtils.clamp(result.z + dz, bounds.minZ + radius, bounds.maxZ - radius);
    if (!blocked(result.x, z)) result.z = z;
  }
  return result;
}

export function snapTurnRig(rig, headWorld, angle) {
  const turn = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), angle);
  rig.position.sub(headWorld).applyQuaternion(turn).add(headWorld);
  rig.quaternion.premultiply(turn);
  rig.updateMatrixWorld(true);
}

/** Smooth left-stick movement and right-stick snap turn; axes must return to neutral after suspension. */
export function createLocomotion({ speed = 0.8, snapAngle = Math.PI / 6, ...collision } = {}) {
  let armed = false,
    snapLatched = false;
  return {
    reset() {
      armed = false;
      snapLatched = true;
    },
    update({ rig, headPosition, headQuaternion, left = [0, 0], right = 0, dt = 0, enabled = true }) {
      if (!enabled) {
        armed = false;
        snapLatched = true;
        return false;
      }
      const neutral = Math.max(Math.abs(left[0] || 0), Math.abs(left[1] || 0), Math.abs(right)) < 0.2;
      if (!armed) {
        if (!neutral) return false;
        armed = true;
      }
      if (Math.abs(right) < 0.25) snapLatched = false;
      let turn = 0;
      if (Math.abs(right) > 0.7 && !snapLatched) {
        turn = -Math.sign(right) * snapAngle;
        snapTurnRig(rig, headPosition, turn);
        snapLatched = true;
      }
      const x = Math.abs(left[0] || 0) > 0.18 ? left[0] : 0,
        y = Math.abs(left[1] || 0) > 0.18 ? left[1] : 0;
      if (!x && !y) return false;
      const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(headQuaternion).applyAxisAngle(new THREE.Vector3(0, 1, 0), turn);
      forward.y = 0;
      if (forward.lengthSq() < 0.001) forward.set(0, 0, -1);
      else forward.normalize();
      const side = new THREE.Vector3(-forward.z, 0, forward.x);
      const delta = side.multiplyScalar(x).addScaledVector(forward, -y);
      if (delta.length() > 1) delta.normalize();
      delta.multiplyScalar(speed * THREE.MathUtils.clamp(dt, 0, 0.05));
      const next = constrainMovement(headPosition, delta, collision);
      rig.position.add(next.sub(headPosition));
      rig.updateMatrixWorld(true);
      return true;
    },
  };
}
