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
