import { test } from "node:test";
import assert from "node:assert/strict";
import { createPanelLayout, panelHitTest, panelSliderValue, PANEL_SIZE } from "../src/panel-layout.js";
const state = {
  ready: true,
  groups: Array.from({ length: 11 }, (_, i) => ({ id: "g" + i, title: "Equipment " + i })),
  selected: { id: "g0", title: "A complete device", copy: "Function", evidence: "Evidence" },
  tourIndex: 0,
  tourLength: 6,
  appearance: "presentation",
  transformer: true,
  explosion: 0.2,
};
test("every panel tab has separated hit areas and bounded controls", () => {
  for (const tab of ["learn", "equipment", "view"]) {
    const layout = createPanelLayout(state, { tab });
    for (const c of layout.controls) {
      assert.ok(c.x >= 0 && c.y >= 0 && c.x + c.width <= 800 && c.y + c.height <= 920);
      assert.equal(panelHitTest(layout, { x: (c.x + c.width / 2) / 800, y: 1 - (c.y + c.height / 2) / 920 })?.id, c.id);
      for (const other of layout.controls.filter((o) => o !== c)) {
        const overlap = c.x < other.x + other.width && c.x + c.width > other.x && c.y < other.y + other.height && c.y + c.height > other.y;
        assert.equal(overlap, false, `${c.id} overlaps ${other.id}`);
      }
    }
  }
});
test("equipment pagination reaches the last complete device", () => {
  const layout = createPanelLayout(state, { tab: "equipment", page: 2 });
  assert.ok(layout.controls.some((c) => c.value === "g10"));
  assert.equal(layout.controls.find((c) => c.id === "next-page").enabled, false);
});
test("separation slider endpoints and out-of-panel hits are bounded", () => {
  const slider = createPanelLayout(state, { tab: "view" }).controls.find((c) => c.id === "explosion");
  assert.equal(panelSliderValue(slider, { x: 0, y: 0 }), 0);
  assert.equal(panelSliderValue(slider, { x: 1, y: 0 }), 1);
  assert.equal(panelHitTest({ controls: [] }, { x: NaN, y: 0 }), null);
  assert.equal(PANEL_SIZE.metersWide, 0.68);
});
