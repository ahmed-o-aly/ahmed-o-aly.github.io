import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
import vm from "node:vm";
const require = createRequire(import.meta.url);
const { roadAssignmentStatus, roadDirectionPresentation } = require("../assets/js/udes-v2-app.js");
const noTrips = { loadABVehicles: 0, loadBAVehicles: 0, loadABPassengers: 0, loadBAPassengers: 0 };
assert.equal(roadAssignmentStatus({ ...noTrips, loadBearing: false }), "capacity-excluded", "unmeasured access links are never labeled unused");
assert.equal(roadAssignmentStatus({ ...noTrips, contextOnly: true }), "context");
assert.equal(roadAssignmentStatus({ ...noTrips, modelVisible: false }), "context");
assert.equal(roadAssignmentStatus(noTrips), "unassigned", "only complete, zero assignment is unassigned");
assert.equal(roadAssignmentStatus({ ...noTrips, loadBAPassengers: 30 }), "transit-only");
assert.equal(roadAssignmentStatus({ ...noTrips, loadABVehicles: 20, loadBAPassengers: 30 }), "assigned-car");
assert.equal(roadAssignmentStatus({ ...noTrips, loadABVehicles: 20, loadBAPassengers: undefined }), "unavailable");
assert.equal(roadAssignmentStatus({}), "unavailable");

// One-way closure comes from explicit topology, not a zero load/capacity or a
// missing time. Recorded zero demand remains a valid count in either direction.
{
  const road = {
    id: "road-edge-0921",
    allowAB: true,
    allowBA: false,
    travelTimeABMin: 1.2,
    travelTimeBAMin: null,
    travelTimeMinutes: 1.2,
    volumeCapacityAB: 0.112,
    volumeCapacityBA: 0,
    loadABVehicles: 100,
    loadBAVehicles: 0,
  };
  assert.deepEqual(roadDirectionPresentation(road, 1), { status: "open", time: "1.20 min", loadRatio: "11.2%", assignedVehicles: "100" });
  assert.deepEqual(roadDirectionPresentation(road, -1), { status: "closed", time: "Closed", loadRatio: "Closed", assignedVehicles: "0" });
  const emptyAllowed = { allowBA: true, travelTimeBAMin: 0, volumeCapacityBA: 0, loadBAVehicles: 0 };
  assert.deepEqual(roadDirectionPresentation(emptyAllowed, -1), { status: "open", time: "0.00 min", loadRatio: "0.0%", assignedVehicles: "0" });
  const unknown = { capacityVehiclesBA: 0, bidirectional: false, travelTimeBAMin: 1.2, volumeCapacityBA: 0, loadBAVehicles: 0 };
  assert.deepEqual(roadDirectionPresentation(unknown, -1), {
    status: "unavailable",
    time: "Unavailable",
    loadRatio: "Unavailable",
    assignedVehicles: "0",
  });
  assert.equal(
    roadDirectionPresentation({ allowBA: true, travelTimeMinutes: 1.2 }, -1).time,
    "Unavailable",
    "combined time cannot stand in for an unobserved direction"
  );
  assert.equal(roadDirectionPresentation({ allowBA: true, volumeCapacityBA: null }, -1).loadRatio, "Unavailable");
  assert.equal(roadDirectionPresentation({ allowBA: true, travelTimeBAMin: Infinity }, -1).time, "Unavailable");
  assert.equal(roadDirectionPresentation({ allowBA: false }, -1).assignedVehicles, "Unavailable", "closure does not fabricate a missing count");
  assert.equal(roadDirectionPresentation({ oneway: "reverse" }, 1).status, "closed");
  assert.equal(roadDirectionPresentation({ oneway: "forward" }, -1).status, "closed");
  assert.equal(roadDirectionPresentation({ bidirectional: true, ...emptyAllowed }, -1).status, "open");

  // Execute the actual tooltip and link-inspector rendering branches with a
  // snapshot whose forbidden-direction time is null, as serialized by the worker.
  const source = readFileSync(new URL("../assets/js/udes-v2-app.js", import.meta.url), "utf8");
  const section = (name, next) => {
    const start = source.indexOf(`  function ${name}(`);
    const end = source.indexOf(`  function ${next}(`, start);
    assert.ok(start >= 0 && end > start);
    return source.slice(start, end);
  };
  let inspectorHtml = "";
  const context = {
    roadAssignmentStatus,
    roadDirectionPresentation,
    state: { selected: { id: road.id } },
    ui: {},
    $: () => ({}),
    roadSnapshot: () => road,
    roadFeature: () => ({ properties: { allowAB: true, allowBA: false } }),
    agentNavigation: () => "",
    historyBars: () => "",
    bindAgentNavigation: () => {},
    renderStablePanel: (_panel, _key, html) => {
      inspectorHtml = html;
    },
  };
  vm.runInNewContext(
    [
      section("valueAt", "zoneLabel"),
      section("formatNumber", "formatAed"),
      section("escapeHtml", "statechart"),
      section("metricRows", "agentNavigation"),
      section("roadTooltipHtml", "renderMapStatus"),
      section("renderInspection", "renderEmptyInspection"),
      "globalThis.tooltip = roadTooltipHtml; globalThis.inspect = renderInspection;",
    ].join("\n"),
    context
  );
  const tooltip = context.tooltip({ properties: { id: road.id, name: "E12" } });
  assert.match(tooltip, /A→B 11\.2% · B→A Closed/);
  assert.match(tooltip, /100 \/ 0 assigned vehicles/);
  context.inspect("link", road);
  assert.match(inspectorHtml, /Modeled time A→B \/ B→A<\/dt><dd>1\.20 min \/ Closed/);
  assert.match(inspectorHtml, /Work-trip road load A→B \/ B→A<\/dt><dd>11\.2% \/ Closed/);
  assert.match(inspectorHtml, /Assigned vehicles A→B \/ B→A<\/dt><dd>100 \/ 0/);
}
const {
  directionalStreams,
  measurePath,
  pointAlong,
  visiblePathRanges,
  pointAlongVisible,
  allocateFlowSymbols,
  flowPixelsPerSecond,
  createLayer,
} = require("../assets/js/udes-v2-road-flow.js");
const features = ["used", "empty", "context", "access", "oneway"].map((id) => ({
  id,
  properties: { id },
  geometry: {
    type: "LineString",
    coordinates: [
      [54, 24],
      [54.1, 24.1],
    ],
  },
}));
const links = [
  { id: "used", loadABVehicles: 120, loadBAVehicles: 40, volumeCapacityAB: 0.9, volumeCapacityBA: 0.3 },
  { id: "empty", loadABVehicles: 0, loadBAVehicles: 0 },
  { id: "context", loadABVehicles: 99, contextOnly: true },
  { id: "access", loadABVehicles: 99, loadBearing: false },
  { id: "oneway", loadABVehicles: 60, loadBAVehicles: 60, allowBA: false },
];
const streams = directionalStreams(features, links);
const reverseOnly = directionalStreams(
  [{ ...features[0], properties: { id: "reverse", allowAB: false, allowBA: true } }],
  [{ id: "reverse", bidirectional: false, loadABVehicles: 0, loadBAVehicles: 80 }]
);
assert.deepEqual(
  reverseOnly.map((stream) => [stream.direction, stream.volume]),
  [[-1, 80]],
  "reverse-only real roads retain assigned flow even when worker snapshots omit direction flags"
);
assert.deepEqual(
  streams.map((s) => [s.id, s.volume]),
  [
    ["used:1", 120],
    ["used:-1", 40],
    ["oneway:1", 60],
  ]
);
assert.equal(streams[0].load, 0.9);
const path = measurePath([
  { x: 0, y: 0 },
  { x: 10, y: 0 },
  { x: 10, y: 30 },
]);
assert.equal(path.total, 40);
assert.deepEqual(pointAlong(path, 0.5), { x: 10, y: 10, angle: Math.PI / 2 });
assert.equal(
  pointAlong(
    measurePath([
      { x: 0, y: 0 },
      { x: 0, y: 0 },
    ]),
    0.5
  ),
  null
);
assert.equal(pointAlong(path, 1).y, 30);

const roadPath = (id, points, volume = 100) => ({ id, volume, direction: 1, speedKmh: 40, ...measurePath(points) });
const crossing = roadPath("crossing", [
  { x: -100, y: 50 },
  { x: 200, y: 50 },
]);
const visible = visiblePathRanges(crossing, { width: 100, height: 100 });
assert.deepEqual(
  visible,
  { visibleRanges: [{ start: 100, end: 200 }], visibleLength: 100 },
  "crossing roads remain visible even when both source vertices lie outside the viewport"
);
assert.deepEqual(pointAlongVisible({ ...crossing, ...visible }, 0.25), { x: 25, y: 50, angle: 0 });
assert.deepEqual(pointAlongVisible({ ...crossing, ...visible }, 0.75), { x: 75, y: 50, angle: 0 });
const disconnectedView = roadPath("leaves-and-returns", [
  { x: -10, y: 10 },
  { x: 10, y: 10 },
  { x: 110, y: 10 },
  { x: 110, y: 90 },
  { x: 90, y: 90 },
  { x: -10, y: 90 },
]);
const clipped = { ...disconnectedView, ...visiblePathRanges(disconnectedView, { width: 100, height: 100 }) };
assert.equal(clipped.visibleRanges.length, 2);
assert.equal(clipped.visibleLength, 200);
assert.deepEqual(
  pointAlongVisible(clipped, 0.75),
  { x: 50, y: 90, angle: Math.PI },
  "sampling across an offscreen gap never invents a connecting line"
);
const outside = roadPath(
  "outside",
  [
    { x: -20, y: 0 },
    { x: -20, y: 100 },
  ],
  1000000
);
assert.equal(visiblePathRanges(outside, { width: 100, height: 100 }).visibleLength, 0);

const viewport = { width: 1000, height: 600 };
const denseRoads = Array.from({ length: 100 }, (_, index) =>
  roadPath("road-" + index, [
    { x: 100, y: index * 5 },
    { x: 160, y: index * 5 },
  ])
);
const allocated = allocateFlowSymbols(denseRoads, viewport);
const symbolTotal = (paths) => paths.reduce((total, path) => total + path.symbolCount, 0);
assert.equal(symbolTotal(allocated), 33, "dense short roads share a sparse viewport budget instead of each receiving an arrow");
assert.ok(allocated.length < denseRoads.length / 2);
assert.ok(allocated.every((path) => Number.isInteger(path.symbolCount) && path.symbolCount > 0));
assert.equal(symbolTotal(allocateFlowSymbols(denseRoads, viewport, { maxSymbols: 7 })), 7, "a tighter budget is respected exactly");
assert.deepEqual(allocateFlowSymbols(denseRoads, viewport, { maxSymbols: 0 }), []);
assert.deepEqual(
  allocateFlowSymbols(
    denseRoads.map((path) => ({ ...path, volume: 0 })),
    viewport
  ),
  [],
  "sampling never creates demand"
);
const tinyRoads = Array.from({ length: 100 }, (_, index) =>
  roadPath("tiny-" + index, [
    { x: 10, y: index },
    { x: 30, y: index },
  ])
);
assert.deepEqual(allocateFlowSymbols(tinyRoads, viewport), [], "tiny physical edge fragments receive no forced symbol");
const countsById = (paths) => paths.map((path) => [path.id, path.symbolCount]).sort(([a], [b]) => a.localeCompare(b));
assert.deepEqual(
  countsById(allocateFlowSymbols([...denseRoads].reverse(), viewport)),
  countsById(allocated),
  "stable sampling does not depend on graph ordering"
);
assert.deepEqual(
  countsById(allocateFlowSymbols([...denseRoads, outside], viewport)),
  countsById(allocated),
  "offscreen high demand consumes no visible budget and does not dilute visible demand"
);
const demandRoads = [
  roadPath(
    "high",
    [
      { x: 0, y: 10 },
      { x: 1800, y: 10 },
    ],
    100
  ),
  roadPath(
    "low",
    [
      { x: 0, y: 20 },
      { x: 1800, y: 20 },
    ],
    1
  ),
];
assert.deepEqual(
  countsById(allocateFlowSymbols(demandRoads, { width: 2000, height: 600 }, { maxSymbols: 3 })),
  [
    ["high", 2],
    ["low", 1],
  ],
  "relative demand controls allocation when visible length is equal"
);
assert.equal(
  symbolTotal(allocateFlowSymbols([...denseRoads, ...demandRoads], { width: 10000, height: 10000 })),
  43,
  "ample viewport space does not force the entire symbol budget to be filled"
);
const longOffscreenApproach = roadPath("approach", [
  { x: -10000, y: 50 },
  { x: 100, y: 50 },
]);
assert.equal(
  symbolTotal(allocateFlowSymbols([longOffscreenApproach], { width: 100, height: 100 }, { maxSymbols: 20 })),
  1,
  "only the visible portion determines density"
);
for (const speed of [1, 30, 60, 120]) {
  assert.ok(Math.abs(flowPixelsPerSecond(speed) / (12 + speed * 0.36) - 0.35) < 1e-12, "motion is 65 percent slower at each modeled speed");
}
assert.ok(flowPixelsPerSecond(30) < flowPixelsPerSecond(60), "slower modeled roads still move more slowly");

const manyLongRoads = Array.from({ length: 500 }, (_, index) =>
  roadPath("long-" + index, [
    { x: 0, y: index },
    { x: 1000, y: index },
  ])
);
assert.equal(
  symbolTotal(allocateFlowSymbols(manyLongRoads, { width: 10000, height: 10000 })),
  80,
  "large displays still have a hard global symbol ceiling"
);

// Reduced-motion users keep a static direction sample. Exercise the real draw
// method with a canvas substitute, including reverse-direction movement.
const previousMatchMedia = globalThis.matchMedia;
const previousAnimationFrame = globalThis.requestAnimationFrame;
try {
  const motion = { matches: true };
  const positions = [];
  let scheduledFrames = 0;
  globalThis.matchMedia = () => motion;
  globalThis.requestAnimationFrame = () => ++scheduledFrames;
  const layer = createLayer({
    Layer: {
      extend: (methods) =>
        class {
          constructor() {
            Object.assign(this, methods);
            this.initialize();
          }
        },
    },
  });
  layer.map = { getSize: () => ({ x: 100, y: 100 }) };
  layer.paths = [{ ...crossing, ...visible, direction: -1, phase: 0.5, speedKmh: 40, symbolCount: 1 }];
  layer.previousTime = null;
  layer.context = Object.fromEntries(
    ["clearRect", "save", "rotate", "beginPath", "moveTo", "lineTo", "stroke", "restore"].map((name) => [name, () => {}])
  );
  layer.context.translate = (x, y) => positions.push({ x, y });
  layer.draw(0);
  layer.draw(100);
  assert.deepEqual(positions[0], positions[1], "reduced motion produces static arrows");
  assert.equal(scheduledFrames, 0, "reduced motion does not request an animation loop");
  motion.matches = false;
  layer.previousTime = null;
  layer.elapsed = 0;
  layer.draw(0);
  layer.draw(100);
  assert.ok(Math.abs(positions[3].x - positions[2].x + flowPixelsPerSecond(40) * 0.1) < 1e-9, "reverse streams move backward at the calmer speed");
  assert.equal(scheduledFrames, 2);
} finally {
  if (previousMatchMedia === undefined) delete globalThis.matchMedia;
  else globalThis.matchMedia = previousMatchMedia;
  if (previousAnimationFrame === undefined) delete globalThis.requestAnimationFrame;
  else globalThis.requestAnimationFrame = previousAnimationFrame;
}
console.log(
  "Road-flow checks passed: actual demand/directions, road interpolation, viewport clipping, stable sparse symbol budgets, and calmer speed."
);
