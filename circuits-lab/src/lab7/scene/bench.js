import * as THREE from "three";
import { BENCH } from "./room.js";
import { createBoard, BOARD } from "./board.js";
import { mm } from "../design/tokens.js";

/**
 * What stands on the U: the trainer board front-centre, instruments on the wings.
 *
 * Source on the left wing, measurement on the right, the board the student
 * actually wires directly in front of them. Signal flows left to right, the same
 * way it flows in the schematic, so leads stop crossing by arrangement rather
 * than by routing tricks.
 */

const TOP = BENCH.height;

/** Offsets on one segment of the U, in metres. */
export const LAYOUT = Object.freeze({
  // Source on the left, measurement on the right, in one row across the back;
  // the board front-centre. Offsets are from the bench centre, in metres.
  supply: { segment: "centre", x: -0.5, z: -0.2 },
  generator: { segment: "centre", x: -0.2, z: -0.2 },
  scope: { segment: "centre", x: 0.16, z: -0.2 },
  meter: { segment: "centre", x: 0.47, z: -0.2 },
  board: { segment: "centre", x: 0, z: 0.2 },
});

export function createBench({ scene, parts, materials, register, segments }) {
  const group = new THREE.Group();
  group.name = "benchtop";
  scene.add(group);
  const on = (spot) => segments.get(spot.segment) ?? group;

  const board = createBoard({ parts, materials, register });
  board.group.position.set(LAYOUT.board.x, TOP, LAYOUT.board.z);
  on(LAYOUT.board).add(board.group);

  function placeInstrument(entry, spot) {
    entry.group.position.set(spot.x, TOP, spot.z);
    on(spot).add(entry.group);
  }

  return {
    group,
    board,
    terminals: board.terminals,
    modules: board.modules,
    placeInstrument,
    applyConfiguration: (configuration) => board.applyConfiguration(configuration),
    contactOf: (id) => board.contactOf(id),
    update: (state) => board.update(state),
    dispose() {
      board.dispose();
      group.removeFromParent();
    },
  };
}
