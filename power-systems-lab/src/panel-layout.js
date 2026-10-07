export const PANEL_SIZE = Object.freeze({ width: 800, height: 920, metersWide: 0.68, metersHigh: 0.782 });
export const PAGE_SIZE = 5;
export const colors = {
  paper: "#f7f4ed",
  ink: "#282b27",
  muted: "#65675e",
  blue: "#9b5036",
  border: "#d6d1c5",
  soft: "#eee9df",
  selected: "#e7ded1",
};
export const clamp = (v, min, max) => Math.min(max, Math.max(min, Number.isFinite(v) ? v : min));
export function createPanelLayout(state, { tab = "learn", page = 0 } = {}) {
  const controls = [],
    texts = [],
    ready = state.ready !== false;
  const button = (id, label, x, y, width, height, p = {}) => controls.push({ id, type: "button", label, x, y, width, height, enabled: ready, ...p });
  const text = (label, x, y, p = {}) => texts.push({ label, x, y, size: 26, ...p });
  const row = (id, label, y, p = {}) => button(id, label, 36, y, 728, 62, p);
  text("Power Systems Lab", 36, 49, { size: 33, weight: 600 });
  text(state.transformer ? "Transformer · local inspection" : "Distribution substation", 36, 90, { size: 23, color: colors.muted });
  button("close", "×", 692, 20, 72, 58, { enabled: true, action: "close-panel", size: 38 });
  ["learn", "equipment", "view"].forEach((value, i) =>
    button("tab-" + value, value[0].toUpperCase() + value.slice(1), 36 + i * 248, 125, 232, 62, {
      tab: value,
      selected: tab === value,
      enabled: true,
    })
  );
  if (tab === "learn") {
    text(state.selected?.title || "Loading model…", 36, 244, { size: 30, weight: 600, width: 728, lines: 2, lineHeight: 36 });
    text(state.selected?.status || "", 36, 325, { size: 22, color: colors.blue, width: 728, lines: 2 });
    text(state.tourPrompt || state.selected?.copy || "", 36, 390, { size: 25, width: 728, lines: 5, lineHeight: 34 });
    text(state.selected?.evidence || "", 36, 585, { size: 23, color: colors.muted, width: 728, lines: 3, lineHeight: 30 });
    button("previous", "‹ Tour", 36, 706, 224, 62, { action: "previous-tour" });
    button("next", "Tour ›", 540, 706, 224, 62, { action: "next-tour" });
    text(`${state.tourIndex + 1} / ${state.tourLength}`, 400, 746, { align: "center", color: colors.muted });
    text("Trigger selects · grip holds the model", 36, 815, { size: 22, color: colors.muted });
  } else if (tab === "equipment") {
    text("Inspect a complete device", 36, 240, { weight: 600 });
    const groups = state.groups || [],
      last = Math.max(0, Math.ceil(groups.length / PAGE_SIZE) - 1),
      p = clamp(page, 0, last);
    groups
      .slice(p * PAGE_SIZE, (p + 1) * PAGE_SIZE)
      .forEach((g, i) =>
        row("equipment-" + g.id, g.title, 270 + i * 82, { key: "equipment", value: g.id, selected: state.selected?.id === g.id, size: 24, lines: 2 })
      );
    button("previous-page", "‹ Previous", 36, 737, 224, 62, { page: p - 1, enabled: p > 0 });
    button("next-page", "Next ›", 540, 737, 224, 62, { page: p + 1, enabled: p < last });
    text(`${p + 1} / ${last + 1}`, 400, 775, { align: "center", color: colors.muted });
    text("Candidates retain their uncertainty labels.", 36, 827, { size: 22, color: colors.muted });
  } else {
    button("isolate", state.isolated ? "Show context" : "Isolate selected", 36, 242, 352, 62, { action: "isolate", selected: state.isolated });
    button("focus", "Bring closer", 412, 242, 352, 62, { action: "focus" });
    button("tabletop", "Tabletop", 36, 324, 352, 62, { action: "tabletop" });
    button("room", "Room size", 412, 324, 352, 62, { action: "room" });
    row("appearance", state.appearance === "source" ? "Use material finishes" : "View source appearance", 406, {
      key: "appearance",
      value: state.appearance === "source" ? "presentation" : "source",
    });
    if (state.transformer) {
      button("open", state.opened ? "Close enclosure" : "Open enclosure", 36, 488, 352, 62, { action: "open", selected: state.opened });
      button("core", "Core + coils", 412, 488, 352, 62, { action: "core" });
      text("Illustrative separation", 36, 600, { size: 24 });
      text(`${Math.round((state.explosion || 0) * 100)}%`, 764, 600, { size: 24, align: "right", color: colors.blue });
      controls.push({
        id: "explosion",
        type: "slider",
        x: 36,
        y: 620,
        width: 728,
        height: 66,
        min: 0,
        max: 1,
        step: 0.01,
        value: state.explosion || 0,
        enabled: ready,
      });
      text("Placement study · no removal sequence", 36, 727, { size: 22, color: colors.muted });
    } else {
      text("Left stick: move · right stick: turn", 36, 534, { size: 26 });
      text("One grip: move and rotate the model.\nTwo grips: rotate and scale together.\nYou can navigate while holding it.", 36, 590, {
        size: 25,
        width: 728,
        lines: 4,
        lineHeight: 38,
      });
    }
    text("X / right stick click: summon this panel", 36, 814, { size: 22, color: colors.muted });
  }
  button("recenter", "Reset view", 36, 850, 300, 50, { action: "recenter", size: 24 });
  text("Y: reset · trigger: select", 764, 880, { size: 22, align: "right", color: colors.muted });
  return { controls, texts };
}
export function panelHitTest(layout, uv) {
  if (!uv || !Number.isFinite(uv.x) || !Number.isFinite(uv.y) || uv.x < 0 || uv.x > 1 || uv.y < 0 || uv.y > 1) return null;
  const x = uv.x * PANEL_SIZE.width,
    y = (1 - uv.y) * PANEL_SIZE.height;
  return layout.controls.find((c) => x >= c.x && x <= c.x + c.width && y >= c.y && y <= c.y + c.height) || null;
}
export function panelSliderValue(c, uv) {
  const ratio = clamp((uv.x * PANEL_SIZE.width - c.x - 16) / (c.width - 32), 0, 1);
  return Number(clamp(c.min + Math.round((ratio * (c.max - c.min)) / c.step) * c.step, c.min, c.max).toFixed(4));
}
