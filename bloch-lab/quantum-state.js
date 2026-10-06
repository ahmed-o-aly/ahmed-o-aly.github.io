const TAU = Math.PI * 2;
const POLE_EPSILON = 1e-10;

export const PRESET_STATES = Object.freeze({
  ket0: Object.freeze({ label: "|0⟩", theta: 0, phi: 0 }),
  ket1: Object.freeze({ label: "|1⟩", theta: Math.PI, phi: 0 }),
  plus: Object.freeze({ label: "|+⟩", theta: Math.PI / 2, phi: 0 }),
  minus: Object.freeze({ label: "|−⟩", theta: Math.PI / 2, phi: Math.PI }),
  plusI: Object.freeze({ label: "|+i⟩", theta: Math.PI / 2, phi: Math.PI / 2 }),
  minusI: Object.freeze({
    label: "|−i⟩",
    theta: Math.PI / 2,
    phi: (3 * Math.PI) / 2,
  }),
});

export function normalizeAngles(theta, phi) {
  if (!Number.isFinite(theta) || !Number.isFinite(phi)) {
    throw new TypeError("Bloch angles must be finite numbers.");
  }

  return {
    theta: Math.min(Math.PI, Math.max(0, theta)),
    phi: ((phi % TAU) + TAU) % TAU,
  };
}

export function blochCoordinates(theta, phi) {
  const angles = normalizeAngles(theta, phi);
  const sinTheta = Math.sin(angles.theta);
  return {
    x: sinTheta * Math.cos(angles.phi),
    y: sinTheta * Math.sin(angles.phi),
    z: Math.cos(angles.theta),
  };
}

export function stateAmplitudes(theta, phi) {
  const angles = normalizeAngles(theta, phi);
  const betaMagnitude = Math.sin(angles.theta / 2);
  return {
    alpha: Math.cos(angles.theta / 2),
    betaReal: betaMagnitude * Math.cos(angles.phi),
    betaImag: betaMagnitude * Math.sin(angles.phi),
  };
}

export function measurementProbabilities(theta) {
  if (!Number.isFinite(theta)) {
    throw new TypeError("Theta must be a finite number.");
  }
  const clampedTheta = Math.min(Math.PI, Math.max(0, theta));
  const p0 = Math.cos(clampedTheta / 2) ** 2;
  return { p0, p1: 1 - p0 };
}

export function formatState(theta, phi) {
  const angles = normalizeAngles(theta, phi);
  if (angles.theta < POLE_EPSILON) return "|0⟩";
  if (Math.PI - angles.theta < POLE_EPSILON) {
    return "|1⟩";
  }

  const alpha = Math.cos(angles.theta / 2).toFixed(3);
  const beta = Math.sin(angles.theta / 2).toFixed(3);
  return `≈ ${alpha}|0⟩ + e^(i${angles.phi.toFixed(3)})${beta}|1⟩`;
}
