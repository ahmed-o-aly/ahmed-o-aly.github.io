import { probability, formatProbability } from "./learning.js";
export const lessonSteps = {
  start: {
    title: "One arrow. Two possible results.",
    context:
      "This arrow describes a qubit’s preparation. Z measures along the vertical axis, with results labeled 0 or 1. Pointing up predicts every result will be 0. The arrow maps possibilities; it is not a moving particle.",
    next: "Measure the upright preparation",
    operation: "sample",
    after: "up-observed",
  },
  "up-observed": {
    title: "Certain means every copy agrees.",
    context:
      "Every dot measured a newly prepared copy: all gave 0. The blue arrow stays because it is the preparation we repeat for each copy.",
    next: "Now tilt the arrow",
    operation: "tilt",
    after: "tilt",
  },
  tilt: {
    title: "Change the preparation.",
    context:
      "Hold the trigger on the sphere and move the arrow away from the top. On desktop, drag the sphere. Watch the tilt angle and the chance bar change together.",
    next: "Predict from this tilted arrow",
    operation: "advance",
    after: "chance",
  },
  chance: {
    title: "Chance before counting.",
    context:
      "The bar predicts the chance of 0 for each copy. Before sampling, predict roughly how many of 100 copies will give 0. A chance is not a guarantee for a whole batch.",
    next: "Sample 100 copies at this tilt",
    operation: "sample",
    after: "sampled",
  },
  sampled: {
    title: "Prediction and observation are different.",
    context:
      "The blue bar is the predicted chance. The dots and brown bar are actual counts. Repeating with fresh copies gives different counts; more copies make the frequency more stable.",
    next: "Turn sideways at the same tilt",
    operation: "advance",
    after: "turn-phase",
  },
  "turn-phase": {
    title: "Direction can change without height changing.",
    context:
      "A quarter-turn around Z moves the arrow sideways while keeping its tilt. Predict: will the Z chance change? Watch the angle and blue bar during the turn.",
    next: "Turn a quarter-turn around Z",
    operation: "gate:S",
    after: "phase-shown",
  },
  "phase-shown": {
    title: "Same height, same Z chance.",
    context:
      "The direction changed, but the chance of 0 did not. Z reads height, so it cannot see this sideways change. That extra direction is called relative phase.",
    next: "Next: how two rotations combine",
    operation: "prepare",
    after: "undo-first",
  },
  "undo-first": {
    title: "Can a rotation undo itself?",
    context:
      "Start again at the top. H is a half-turn around the slanted axis. Apply it once and watch the arrow move to equal chances of 0 and 1.",
    next: "Apply the first H turn",
    operation: "gate:H",
    after: "undo-second",
  },
  "undo-second": {
    title: "Halfway: two outcomes are equally likely.",
    context:
      "The first H made a 50/50 preparation. Apply the same H again. Predict whether the arrow returns to the top before watching the trail.",
    next: "Apply H again",
    operation: "gate:H",
    after: "undo-result",
  },
  "undo-result": {
    title: "Two H turns return to certain 0.",
    context:
      "The full path returns to the top: H then H gives 0 with certainty. Now try a Z turn between them. This tests whether a sideways change can affect a later rotation.",
    next: "Start again with the first H",
    operation: "prepare:H",
    after: "phase-middle",
  },
  "phase-middle": {
    title: "Change direction before the return turn.",
    context:
      "We have the same 50/50 starting point as before. This Z turn changes the sideways direction while keeping the chance 50/50. No copy is being measured here.",
    next: "Apply the middle Z turn",
    operation: "gate:Z",
    after: "phase-last",
  },
  "phase-last": {
    title: "The bar stayed 50/50. The arrow did not.",
    context:
      "Z moved the arrow to the opposite side. The grey arrow marks its earlier direction. Apply H now: the same return turn acts on a different preparation.",
    next: "Apply the final H turn",
    operation: "gate:H",
    after: "phase-result",
  },
  "phase-result": {
    title: "A sideways change became a different outcome.",
    context:
      "H then H returned to 0. H then Z then H points down, so every Z measurement now gives 1. The middle Z changed how the two H turns combined: this is interference.",
    next: "Measure this certain-1 preparation",
    operation: "sample",
    after: "phase-measured",
  },
  "phase-measured": {
    title: "The copies confirm the new preparation.",
    context:
      "Every fresh copy gave 1. The difference came from rotations, not a measurement between them. Next, test whether changing the order of rotations also changes direction.",
    next: "Next: does rotation order matter?",
    operation: "prepare",
    after: "order-start",
  },
  "order-start": {
    title: "Do the same turns in a different order.",
    context:
      "From the top, first apply H, then Z. Watch the two path segments. Z keeps the final chance 50/50, but changes which side the arrow points toward.",
    next: "First H, then Z",
    operation: "program:HZ",
    after: "order-reverse",
  },
  "order-reverse": {
    title: "Keep that direction as a comparison.",
    context:
      "The grey arrow saves the H-then-Z result. Start at the top again, but reverse the order. Predict whether Z-then-H reaches the same direction.",
    next: "Reverse it: first Z, then H",
    operation: "program:ZH",
    after: "order-check",
  },
  "order-check": {
    title: "Same Z chance does not mean the same state.",
    context:
      "Both results have 50/50 Z chances, yet point in opposite X directions. A measurement along X can distinguish them. The purple arrow shows this new measurement axis.",
    next: "Measure Z-then-H copies along X",
    operation: "sample:X",
    after: "order-plus",
  },
  "order-plus": {
    title: "X sees what Z could not see.",
    context:
      "The Z-then-H copies all gave + along X. Now measure the saved H-then-Z preparation along X. It points the other way, so predict the opposite outcome.",
    next: "Measure H-then-Z copies along X",
    operation: "sample:minus",
    after: "order-result",
  },
  "order-result": {
    title: "Order changed the preparation.",
    context:
      "H-then-Z gave − along X; Z-then-H gave +. Their Z chances were identical. A qubit needs both tilt and sideways direction to describe all measurement chances.",
    next: "Restart the guided path",
    operation: "restart",
    after: "start",
  },
};
export class GuidedLesson {
  constructor() {
    this.reset();
  }
  reset() {
    this.stage = "start";
    this.active = true;
    this.totals = [0, 0];
    this.prepared = null;
    this.expected = null;
    this.last = null;
    this.waiting = null;
  }
  step() {
    return lessonSteps[this.stage];
  }
  begin(vector) {
    const s = this.step();
    if (this.waiting) return null;
    if (
      this.stage === "tilt" &&
      (Math.acos(Math.max(-1, Math.min(1, vector[2]))) < Math.PI / 18 ||
        Math.abs(vector[2]) > 0.985)
    )
      return null;
    this.waiting = s.after;
    return s.operation;
  }
  finish() {
    if (!this.waiting) return false;
    this.stage = this.waiting;
    this.waiting = null;
    return true;
  }
  record(vector, basis, counts) {
    const same =
      this.prepared &&
      this.prepared.basis === basis &&
      this.prepared.vector.every((x, i) => Math.abs(x - vector[i]) < 1e-7);
    if (!same) this.totals = [0, 0];
    this.prepared = { vector: [...vector], basis };
    this.expected = probability(vector, basis);
    this.totals = this.totals.map((n, i) => n + counts[i]);
    this.last = [...counts];
  }
  observation() {
    if (!this.last) return "No copies measured yet.";
    const n = this.totals[0] + this.totals[1],
      zero = this.prepared.basis === "Z" ? "0" : "+";
    return `Chance: ${formatProbability(this.expected)} ${zero}. Observed: ${
      this.totals[0]
    }/${n} = ${formatProbability(this.totals[0] / n)} ${zero}.`;
  }
}
