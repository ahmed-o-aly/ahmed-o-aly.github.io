import test from "node:test";
import assert from "node:assert/strict";
import * as THREE from "three";
import { commonSocketPosition, createTerminalSocketAllocator, wireSocketKey } from "../src/terminal-sockets.js";
import { nearestTerminal } from "../src/interaction.js";

const groundResources = [
  wireSocketKey("signal-", "gnd", "gnd"),
  wireSocketKey("plus-", "gnd", "gnd"),
  wireSocketKey("minus+", "gnd", "gnd"),
  wireSocketKey("op+", "gnd", "gnd"),
  "probe:black",
  "probe:ch1Ground",
  "probe:ch2Ground",
];

test("default amplifier ground leads and probes occupy separate deterministic posts", () => {
  const first = createTerminalSocketAllocator(),
    second = createTerminalSocketAllocator();
  const slots = groundResources.map((key) => first.resolve("gnd", key, groundResources));
  assert.equal(new Set(slots).size, 7);
  assert.ok(slots.every((slot) => slot < 8));
  for (const key of [...groundResources].reverse())
    assert.equal(second.resolve("gnd", key, [...groundResources].reverse()), first.resolve("gnd", key, groundResources));
  assert.equal(wireSocketKey("gnd", "signal-", "gnd"), wireSocketKey("signal-", "gnd", "gnd"));
});

test("pickup, another connection and release do not move other attached leads", () => {
  const allocator = createTerminalSocketAllocator();
  const before = new Map(groundResources.map((key) => [key, allocator.resolve("gnd", key, groundResources)]));
  const active = groundResources.filter((key) => key !== "probe:black");
  for (const key of active) assert.equal(allocator.resolve("gnd", key, active), before.get(key));
  const added = [...active, "probe:red"];
  assert.equal(allocator.resolve("gnd", "probe:red", added), before.get("probe:black"));
  for (const key of active) assert.equal(allocator.resolve("gnd", key, added), before.get(key));
});

test("a released probe may use the chosen free post without displacing an occupied post", () => {
  const allocator = createTerminalSocketAllocator(),
    keys = ["probe:red", "probe:ch2"];
  const red = allocator.resolve("out", "probe:red", keys),
    ch2 = allocator.resolve("out", "probe:ch2", keys);
  assert.equal(allocator.prefer("out", "probe:red", ch2, keys), red);
  assert.equal(allocator.prefer("out", "probe:red", 2, keys), 2);
  assert.equal(allocator.resolve("out", "probe:ch2", keys), ch2);
  assert.equal(allocator.resolve("out", "probe:red", keys), 2);
});

test("every visible bus post snaps to the original semantic node using its actual position", () => {
  const posts = ["gnd", "out"].flatMap((id) =>
    Array.from({ length: id === "gnd" ? 8 : 3 }, (_, socket) => {
      const p = commonSocketPosition(id, socket);
      return { id, socket, position: new THREE.Vector3(p.x * 0.36, 0.88072, p.z * 0.36 - 0.77) };
    })
  );
  for (const post of posts) {
    const nearest = nearestTerminal(post.position.clone().add(new THREE.Vector3(0.003, 0.005, 0)), posts);
    assert.equal(nearest.id, post.id);
    assert.equal(nearest.socket, post.socket);
  }
  assert.equal(new Set(posts.map((post) => post.position.toArray().join(","))).size, posts.length);
});

test("extra exploratory contacts receive separate posts rather than stacked endpoints", () => {
  const allocator = createTerminalSocketAllocator(),
    keys = Array.from({ length: 10 }, (_, i) => `wire:extra-${i}|gnd:gnd`);
  const positions = keys.map((key) => commonSocketPosition("gnd", allocator.resolve("gnd", key, keys)));
  assert.equal(new Set(positions.map((p) => `${p.x},${p.z}`)).size, keys.length);
});

test("reconnecting a wire preserves its fixed socket with old, new or overlapping resource lists", () => {
  const from = groundResources[0];
  const to = wireSocketKey("new-return", "gnd", "gnd");
  const added = wireSocketKey("another-return", "gnd", "gnd");
  for (const phase of ["before", "after", "handoff"]) {
    const allocator = createTerminalSocketAllocator();
    allocator.prefer("gnd", from, 7, groundResources);
    const before = new Map(groundResources.map((key) => [key, allocator.resolve("gnd", key, groundResources)]));
    const after = [...groundResources.filter((key) => key !== from), to, added];
    const resources = phase === "before" ? [...groundResources, added] : phase === "after" ? after : [...after, from];
    const originalResources = [...resources];

    assert.equal(allocator.transfer("gnd", from, to, resources), 7, phase);
    assert.deepEqual(resources, originalResources, "the caller's live resource list remains unchanged");
    assert.equal(allocator.resolve("gnd", to, after), before.get(from));
    for (const key of groundResources.filter((key) => key !== from))
      assert.equal(allocator.resolve("gnd", key, after), before.get(key), `${phase}: ${key}`);
    assert.equal(new Set(after.map((key) => allocator.resolve("gnd", key, after))).size, after.length);
  }
});

test("socket zero and same-pair reconnection stay fixed, and other electrical nodes remain independent", () => {
  const allocator = createTerminalSocketAllocator();
  const from = wireSocketKey("out", "load-a", "out");
  const to = wireSocketKey("out", "other-load", "out");
  const resources = [from, "probe:red", "probe:ch2"];
  const groundBefore = new Map(groundResources.map((key) => [key, allocator.resolve("gnd", key, groundResources)]));
  assert.equal(allocator.resolve("out", from, resources), 0);
  assert.equal(allocator.transfer("out", from, wireSocketKey("load-a", "out", "out"), resources), 0);
  assert.equal(allocator.transfer("out", from, to, resources), 0);
  const after = [to, "probe:red", "probe:ch2"];
  assert.equal(allocator.resolve("out", to, after), 0);
  assert.equal(allocator.resolve("out", "probe:red", after), 2);
  assert.equal(allocator.resolve("out", "probe:ch2", after), 1);
  for (const key of groundResources) assert.equal(allocator.resolve("gnd", key, groundResources), groundBefore.get(key));
});

test("missing or already occupied transfer targets fail without moving any connection", () => {
  const allocator = createTerminalSocketAllocator();
  const before = new Map(groundResources.map((key) => [key, allocator.resolve("gnd", key, groundResources)]));
  assert.equal(allocator.transfer("gnd", groundResources[0], groundResources[1], []), null);
  assert.equal(allocator.transfer("gnd", "wire:missing:gnd", "wire:new:gnd", []), null);
  assert.equal(allocator.transfer("unknown-node", groundResources[0], "wire:new:gnd", []), null);
  for (const key of groundResources) assert.equal(allocator.resolve("gnd", key, groundResources), before.get(key));
});

test("two independent reconnects preserve both fixed sockets and can be transferred back", () => {
  const allocator = createTerminalSocketAllocator();
  const before = new Map(groundResources.map((key) => [key, allocator.resolve("gnd", key, groundResources)]));
  const fromA = groundResources[0],
    fromB = groundResources[1];
  const toA = wireSocketKey("replacement-a", "gnd", "gnd"),
    toB = wireSocketKey("replacement-b", "gnd", "gnd");
  const first = groundResources.map((key) => (key === fromA ? toA : key));
  assert.equal(allocator.transfer("gnd", fromA, toA, first), before.get(fromA));
  const second = first.map((key) => (key === fromB ? toB : key));
  assert.equal(allocator.transfer("gnd", fromB, toB, second), before.get(fromB));
  assert.equal(allocator.resolve("gnd", toA, second), before.get(fromA));
  assert.equal(allocator.transfer("gnd", toB, fromB, first), before.get(fromB));
  assert.equal(allocator.transfer("gnd", toA, fromA, groundResources), before.get(fromA));
  for (const key of groundResources) assert.equal(allocator.resolve("gnd", key, groundResources), before.get(key));
});
