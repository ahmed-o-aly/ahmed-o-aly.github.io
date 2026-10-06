import * as THREE from "three";
// Adapted from Protein Structures' captureGesture: controller-relative one-hand
// offset; two-hand midpoint, direction and distance. No quantum state is stored here.
export class ViewGesture {
  constructor(object, min = 0.5, max = 1.8) {
    this.object = object;
    this.min = min;
    this.max = max;
    this.hands = new Map();
  }
  begin(id, matrix) {
    this.hands.set(id, matrix.clone());
    this.capture();
  }
  end(id) {
    this.hands.delete(id);
    this.capture();
  }
  clear() {
    this.hands.clear();
    this.start = null;
  }
  capture() {
    const poses = [...this.hands.values()];
    if (!poses.length) {
      this.start = null;
      return;
    }
    this.object.updateWorldMatrix(true, false);
    if (poses.length === 1) {
      this.start = {
        offset: poses[0].clone().invert().multiply(this.object.matrixWorld),
      };
      return;
    }
    const a = new THREE.Vector3().setFromMatrixPosition(poses[0]),
      b = new THREE.Vector3().setFromMatrixPosition(poses[1]);
    this.start = {
      position: this.object.position.clone(),
      quaternion: this.object.quaternion.clone(),
      scale: this.object.scale.x,
      midpoint: a.clone().add(b).multiplyScalar(0.5),
      direction: b.clone().sub(a).normalize(),
      distance: Math.max(0.08, a.distanceTo(b)),
    };
  }
  update(poses) {
    for (const [id, matrix] of poses)
      if (this.hands.has(id)) this.hands.set(id, matrix.clone());
    if (!this.start) return;
    const values = [...this.hands.values()];
    if (values.length === 1) {
      const world = values[0].clone().multiply(this.start.offset);
      if (this.object.parent) {
        this.object.parent.updateWorldMatrix(true, false);
        world.premultiply(this.object.parent.matrixWorld.clone().invert());
      }
      world.decompose(
        this.object.position,
        this.object.quaternion,
        this.object.scale,
      );
    } else {
      const a = new THREE.Vector3().setFromMatrixPosition(values[0]),
        b = new THREE.Vector3().setFromMatrixPosition(values[1]),
        distance = a.distanceTo(b);
      if (distance < 0.08) return;
      const midpoint = a.clone().add(b).multiplyScalar(0.5),
        delta = new THREE.Quaternion().setFromUnitVectors(
          this.start.direction,
          b.clone().sub(a).normalize(),
        );
      const scale = THREE.MathUtils.clamp(
          (this.start.scale * distance) / this.start.distance,
          this.min,
          this.max,
        ),
        ratio = scale / this.start.scale;
      this.object.position
        .copy(this.start.position)
        .sub(this.start.midpoint)
        .applyQuaternion(delta)
        .multiplyScalar(ratio)
        .add(midpoint);
      this.object.quaternion.copy(delta).multiply(this.start.quaternion);
      this.object.scale.setScalar(scale);
    }
    this.object.updateMatrixWorld(true);
  }
}
// Analytic surface selection has no mesh front-face or tessellation restriction.
export function spherePick(ray, object, radius) {
  object.updateWorldMatrix(true, false);
  const sphere = new THREE.Sphere(
    object.getWorldPosition(new THREE.Vector3()),
    radius * object.getWorldScale(new THREE.Vector3()).x,
  );
  return ray.intersectSphere(sphere, new THREE.Vector3());
}
export class ComfortNavigation {
  constructor() {
    this.reset();
  }
  reset() {
    this.armed = false;
    this.stepHeld = false;
    this.turnHeld = false;
    this.smooth = false;
  }
  update(rig, head, left = [0, 0], right = 0, dt = 0, enabled = true) {
    if (!enabled) {
      this.armed = false;
      return;
    }
    if (Math.max(...left.map(Math.abs), Math.abs(right)) < 0.2) {
      this.armed = true;
      this.stepHeld = false;
      this.turnHeld = false;
    }
    if (!this.armed) return;
    if (Math.abs(right) < 0.25) this.turnHeld = false;
    if (Math.hypot(...left) < 0.25) this.stepHeld = false;
    if (Math.abs(right) > 0.7 && !this.turnHeld) {
      const q = new THREE.Quaternion().setFromAxisAngle(
        new THREE.Vector3(0, 1, 0),
        (-Math.sign(right) * Math.PI) / 6,
      );
      const pivot = head.getWorldPosition(new THREE.Vector3());
      rig.position.sub(pivot).applyQuaternion(q).add(pivot);
      rig.quaternion.premultiply(q);
      rig.updateMatrixWorld(true);
      this.turnHeld = true;
    }
    const magnitude = Math.hypot(...left);
    if (magnitude < 0.65 || (!this.smooth && this.stepHeld)) return;
    const forward = head.getWorldDirection(new THREE.Vector3());
    forward.y = 0;
    if (forward.lengthSq() < 0.001) return;
    forward.normalize();
    const across = new THREE.Vector3(-forward.z, 0, forward.x);
    const amount = this.smooth ? 0.65 * Math.min(0.05, Math.max(0, dt)) : 0.4;
    rig.position
      .addScaledVector(across, (left[0] / magnitude) * amount)
      .addScaledVector(forward, (-left[1] / magnitude) * amount);
    rig.updateMatrixWorld(true);
    this.stepHeld = true;
  }
}
