import { gates, rotate } from "./state.js";
export const MAX_GATES = 8;
export class GateSequence {
  constructor() {
    this.queue = [];
    this.base = [0, 0, 1];
    this.restart();
  }
  restart() {
    this.cursor = 0;
    this.snapshots = [];
    this.status = "idle";
    this.single = false;
    return [...this.base];
  }
  capture(vector) {
    this.base = [...vector];
    return this.restart();
  }
  editable() {
    return this.status === "idle" || this.status === "complete";
  }
  append(gate, vector) {
    if (!gates[gate] || !this.editable() || this.queue.length >= MAX_GATES) return false;
    if (!this.queue.length) this.base = [...vector];
    this.queue.push(gate);
    this.restart();
    return true;
  }
  remove(index) {
    if (!this.editable() || index < 0 || index >= this.queue.length) return false;
    this.queue.splice(index, 1);
    this.restart();
    return true;
  }
  clear() {
    this.queue = [];
    return this.restart();
  }
  begin(single = false) {
    if (!this.queue.length) return null;
    if (this.status === "complete") this.restart();
    this.single = single;
    this.status = "running";
    return this.queue[this.cursor];
  }
  pause() {
    if (this.status === "running") this.status = "paused";
  }
  finish(vector) {
    this.snapshots.push([...vector]);
    this.cursor++;
    this.status = this.cursor === this.queue.length ? "complete" : this.single ? "paused" : "running";
  }
  expected() {
    return this.queue.reduce((v, g) => rotate(v, gates[g].axis, gates[g].angle), [...this.base]);
  }
}
