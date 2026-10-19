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
  supply: { segment: "left", x: -0.16, z: -0.06 },
  generator: { segment: "left", x: 0.16, z: -0.06 },
  scope: { segment: "right", x: -0.16, z: -0.06 },
  meter: { segment: "right", x: 0.16, z: -0.06 },
  board: { segment: "centre", x: 0, z: 0.04 },
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
    chip: board.chipAnchor,
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
