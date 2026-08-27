(() => {
  const root = document.querySelector("[data-udes-v2-root]");
  if (!root) return;

  const $ = (selector, scope = root) => scope.querySelector(selector);
  const $$ = (selector, scope = root) => Array.from(scope.querySelectorAll(selector));
  const DAY_MS = 24 * 60 * 60 * 1000;
  const palette = {
    ink: "#1d2a2a",
    muted: "#6b7774",
    line: "#d8dedb",
    green: "#236b5b",
    greenSoft: "#9fc4b8",
    teal: "#2f7f85",
    blue: "#557fa3",
    amber: "#b27936",
    red: "#ad594f",
    sand: "#c8b78f",
    surface: "#f6f7f4",
  };

  const state = {
    dataset: null,
    geo: { zones: null, roads: null, stops: null },
    worker: null,
    referenceWorker: null,
    snapshot: null,
    referenceSnapshot: null,
    history: [],
    referenceHistory: [],
    map: null,
    mapMode: "network",
    layers: { zones: null, roads: null, stops: null, selection: null },
    selected: { kind: "city", id: null, index: { citizen: 0, enterprise: 0, link: 0 } },
    scenario: "reference",
    compare: true,
    playing: false,
    busy: false,
    speed: 1,
    horizonMonths: 120,
    elapsedDays: 0,
    seed: 240124,
    charts: new Map(),
    resizeObserver: null,
    requestCounter: 0,
    playTimer: null,
    pendingConfigurationReset: null,
    pendingModelReset: false,
  };

  const presets = {
    reference: {
      transitFareAed: 2,
      transitSpeedKmh: 28,
      roadCapacityMultiplier: 1,
      carCostPerKmAed: 0.35,
      housingCapacityMultiplier: 1,
      businessCapacityMultiplier: 1,
      rentPressureMultiplier: 1,
      placeQuality: 0.82,
      waitingNetIncomeAed: 1500,
      acceptableCommuteRoundTripMin: 60,
      extremeCommuteRoundTripMin: 90,
      enterpriseTargetMargin: 0.12,
    },
    transit: {
      transitFareAed: 1,
      transitSpeedKmh: 36,
      roadCapacityMultiplier: 1,
      carCostPerKmAed: 0.45,
      housingCapacityMultiplier: 1.05,
      businessCapacityMultiplier: 1,
      rentPressureMultiplier: 0.99,
      placeQuality: 0.84,
      waitingNetIncomeAed: 1500,
      acceptableCommuteRoundTripMin: 60,
      extremeCommuteRoundTripMin: 90,
      enterpriseTargetMargin: 0.12,
    },
    housing: {
      transitFareAed: 2,
      transitSpeedKmh: 31,
      roadCapacityMultiplier: 1,
      carCostPerKmAed: 0.35,
      housingCapacityMultiplier: 1.3,
      businessCapacityMultiplier: 1.08,
      rentPressureMultiplier: 0.96,
      placeQuality: 0.86,
      waitingNetIncomeAed: 1500,
      acceptableCommuteRoundTripMin: 60,
      extremeCommuteRoundTripMin: 90,
      enterpriseTargetMargin: 0.12,
    },
    balanced: {
      transitFareAed: 1.5,
      transitSpeedKmh: 35,
      roadCapacityMultiplier: 1.1,
      carCostPerKmAed: 0.45,
      housingCapacityMultiplier: 1.2,
      businessCapacityMultiplier: 1.15,
      rentPressureMultiplier: 0.97,
      placeQuality: 0.9,
      waitingNetIncomeAed: 1750,
      acceptableCommuteRoundTripMin: 60,
      extremeCommuteRoundTripMin: 90,
      enterpriseTargetMargin: 0.12,
    },
  };

  const ui = {
    live: $("[data-udes-v2-live-status]"),
    runtime: $("[data-udes-v2-runtime-state]"),
    date: $("[data-udes-v2-date]"),
    progress: $("[data-udes-v2-progress]"),
    progressLabel: $("[data-udes-v2-progress-label]"),
    horizonLabel: $("[data-udes-v2-horizon-label]"),
    play: $("[data-udes-v2-action='play']"),
    playLabel: $("[data-udes-v2-play-label]"),
    zoneSelect: $("[data-udes-v2-focus-zone]"),
    horizon: $("[data-udes-v2-horizon]"),
    seed: $("[data-udes-v2-seed]"),
    selectionName: $("[data-udes-v2-selection-name]"),
    selectionId: $("[data-udes-v2-selection-id]"),
    mapStatus: $("[data-udes-v2-map-status]"),
    mapLegend: $("[data-udes-v2-map-legend]"),
  };

  class WorkerClient {
    constructor(url, onProgress) {
      this.worker = new Worker(url);
      this.pending = new Map();
      this.onProgress = onProgress;
      this.worker.addEventListener("message", (event) => this.receive(event.data));
      this.worker.addEventListener("error", (event) => {
        const error = new Error(event.message || "The simulation worker stopped unexpectedly.");
        this.pending.forEach(({ reject }) => reject(error));
        this.pending.clear();
      });
    }

    request(type, payload = {}) {
      const requestId = `v2-${++state.requestCounter}`;
      return new Promise((resolve, reject) => {
        this.pending.set(requestId, { resolve, reject });
        this.worker.postMessage({ type, requestId, payload });
      });
    }

    receive(message) {
      if (message.type === "progress") {
        this.onProgress?.(message.payload || message);
        return;
      }
      const pending = this.pending.get(message.requestId);
      if (!pending) return;
      this.pending.delete(message.requestId);
      if (message.type === "error") {
        pending.reject(new Error(message.payload?.message || "Simulation request failed."));
      } else {
        pending.resolve(message.payload || message);
      }
    }

    terminate() {
      this.worker.terminate();
    }
  }

  function announce(message) {
    if (ui.live) ui.live.textContent = message;
  }

  function setRuntime(label, mode = "ready") {
    root.dataset.udesV2State = mode;
    if (!ui.runtime) return;
    ui.runtime.lastChild.textContent = ` ${label}`;
  }

  function resolveAsset(path, baseUrl) {
    if (!path) return null;
    if (/^https?:\/\//i.test(path)) return path;
    if (path.startsWith("/")) {
      const base = document.body.dataset.baseurl || "";
      return `${base}${path}`.replace(/\/{2,}/g, "/");
    }
    return new URL(path, new URL(baseUrl, window.location.href)).toString();
  }

  async function fetchJson(url, optional = false) {
    try {
      const response = await fetch(url, { credentials: "same-origin" });
      if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
      return await response.json();
    } catch (error) {
      if (optional) return null;
      throw new Error(`Could not load ${url}: ${error.message}`);
    }
  }

  function workerDataset(dataset) {
    return {
      schemaVersion: dataset.schemaVersion,
      zones: dataset.zones,
      links: dataset.roadGraph?.edges || dataset.links || [],
      nodes: dataset.roadGraph?.nodes || [],
      transit: dataset.transit,
      calibration: dataset.calibration,
      assumptions: dataset.assumptions,
    };
  }

  async function loadData() {
    const modelUrl = root.dataset.modelUrl;
    if (!modelUrl) throw new Error("The v2 model URL is missing from the page.");
    const resolvedModelUrl = resolveAsset(modelUrl, window.location.href);
    const dataset = await fetchJson(resolvedModelUrl);
    const files = dataset.files || dataset.geometryFiles || {};
    const [zones, roads, stops] = await Promise.all([
      fetchJson(resolveAsset(files.zones || "zones.geojson", resolvedModelUrl), true),
      fetchJson(resolveAsset(files.roads || "roads.geojson", resolvedModelUrl), true),
      fetchJson(resolveAsset(files.transitStops || files.stops || "transit-stops.geojson", resolvedModelUrl), true),
    ]);
    state.dataset = dataset;
    state.geo = { zones, roads, stops };
    state.seed = Number(ui.seed?.value || dataset.calibration?.seed || 240124);
    populateZoneSelect();
  }

  function populateZoneSelect() {
    if (!ui.zoneSelect) return;
    ui.zoneSelect.replaceChildren();
    const all = document.createElement("option");
    all.value = "city";
    all.textContent = "Greater Abu Dhabi City";
    ui.zoneSelect.append(all);
    for (const zone of state.dataset.zones || []) {
      const option = document.createElement("option");
      option.value = zone.id;
      option.textContent = zone.name;
      ui.zoneSelect.append(option);
    }
    state.selected.kind = "city";
    state.selected.id = null;
    ui.zoneSelect.value = "city";
    const scopeLabel = $(".udes-v2-section-heading span", ui.zoneSelect.closest(".udes-v2-control-section"));
    if (scopeLabel) scopeLabel.textContent = `${state.dataset.zones?.length || 0} districts`;
  }

  function currentPatch() {
    const values = {};
    for (const input of $$("[data-udes-v2-lever]")) values[input.dataset.udesV2Lever] = Number(input.value);
    return {
      transitFareAed: values.transitFare,
      transitSpeedKmh: values.transitSpeed,
      roadCapacityMultiplier: values.roadCapacity / 100,
      carCostPerKmAed: values.carCost,
      housingCapacityMultiplier: values.housing / 100,
      businessCapacityMultiplier: values.business / 100,
      rentPressureMultiplier: values.rentPressure / 100,
      placeQuality: values.placeQuality / 100,
      waitingNetIncomeAed: values.incomeBuffer,
      acceptableCommuteRoundTripMin: values.acceptableCommute,
      extremeCommuteRoundTripMin: values.extremeCommute,
      enterpriseTargetMargin: values.targetMargin / 100,
      focusZoneId: ui.zoneSelect?.value === "city" ? null : ui.zoneSelect?.value,
      scenario: state.scenario,
    };
  }

  function structuralConfig() {
    return {
      startDate: state.dataset?.calibration?.baseDate || "2024-01-01",
      calibrationLabel: "Greater Abu Dhabi City calibrated scenario baseline — not a forecast",
      endogenousEnterpriseDynamics: true,
    };
  }

  function setLever(name, value) {
    const input = $(`[data-udes-v2-lever='${name}']`);
    if (!input) return;
    const transformed = {
      transitFare: value.transitFareAed,
      transitSpeed: value.transitSpeedKmh,
      roadCapacity: value.roadCapacityMultiplier * 100,
      carCost: value.carCostPerKmAed,
      housing: value.housingCapacityMultiplier * 100,
      business: value.businessCapacityMultiplier * 100,
      rentPressure: value.rentPressureMultiplier * 100,
      placeQuality: value.placeQuality * 100,
      incomeBuffer: value.waitingNetIncomeAed,
      acceptableCommute: value.acceptableCommuteRoundTripMin,
      extremeCommute: value.extremeCommuteRoundTripMin,
      targetMargin: value.enterpriseTargetMargin * 100,
    }[name];
    if (Number.isFinite(transformed)) input.value = transformed;
    updateLeverOutput(input);
  }

  function applyPreset(name, configure = true) {
    const preset = presets[name] || presets.reference;
    state.scenario = name;
    for (const button of $$("[data-udes-v2-scenario]")) {
      button.setAttribute("aria-pressed", String(button.dataset.udesV2Scenario === name));
    }
    for (const lever of $$("[data-udes-v2-lever]")) setLever(lever.dataset.udesV2Lever, preset);
    if (configure && state.worker) configureModel(true);
  }

  function markCustomScenario() {
    state.scenario = "custom";
    for (const button of $$("[data-udes-v2-scenario]")) button.setAttribute("aria-pressed", "false");
  }

  function updateLeverOutput(input) {
    const name = input.dataset.udesV2Lever;
    const output = $(`[data-udes-v2-output='${name}']`);
    if (!output) return;
    const value = Number(input.value);
    const labels = {
      transitFare: `AED ${value.toFixed(2)}`,
      transitSpeed: `${value.toFixed(0)} km/h`,
      roadCapacity: `${value.toFixed(0)}%`,
      carCost: `AED ${value.toFixed(2)}`,
      housing: `${value.toFixed(0)}%`,
      business: `${value.toFixed(0)}%`,
      rentPressure: value === 100 ? "Neutral" : `${value > 100 ? "+" : ""}${value - 100}%`,
      placeQuality: (value / 100).toFixed(2),
      incomeBuffer: `AED ${formatNumber(value)}`,
      acceptableCommute: `${value.toFixed(0)} min`,
      extremeCommute: `${value.toFixed(0)} min`,
      targetMargin: `${value.toFixed(0)}%`,
    };
    output.value = labels[name] || String(value);
    output.textContent = output.value;
  }

  function snapshotFrom(reply) {
    return reply?.snapshot || reply?.payload?.snapshot || reply;
  }

  async function startWorkers() {
    const workerUrl = resolveAsset(root.dataset.workerUrl, window.location.href);
    if (!workerUrl) throw new Error("The v2 worker URL is missing from the page.");
    state.worker?.terminate();
    state.referenceWorker?.terminate();
    state.worker = new WorkerClient(workerUrl, renderProgress);
    state.referenceWorker = new WorkerClient(workerUrl);
    const data = workerDataset(state.dataset);
    const referenceConfig = { ...structuralConfig(), ...presets.reference, scenario: "reference" };
    const activeConfig = { ...structuralConfig(), ...currentPatch(), scenario: state.scenario };
    const [active, reference] = await Promise.all([
      state.worker.request("init", { data, config: activeConfig, seed: state.seed }),
      state.referenceWorker.request("init", { data, config: referenceConfig, seed: state.seed }),
    ]);
    state.snapshot = snapshotFrom(active);
    state.referenceSnapshot = snapshotFrom(reference);
    state.elapsedDays = modelDay(state.snapshot);
    state.history = [];
    state.referenceHistory = [];
    recordHistory(state.snapshot, state.history);
    recordHistory(state.referenceSnapshot, state.referenceHistory);
    renderAll();
    setRuntime("Ready", "ready");
    announce("Agent model initialized with the reference comparison ready.");
  }

  async function configureModel(reset = false) {
    if (!state.worker) return;
    if (state.busy) {
      state.pendingConfigurationReset = Boolean(state.pendingConfigurationReset || reset);
      announce("Input change queued for the next model boundary.");
      return;
    }
    state.busy = true;
    setRuntime(reset ? "Rebuilding agents" : "Applying inputs", "busy");
    try {
      const reply = await state.worker.request("configure", { patch: currentPatch(), reset });
      state.snapshot = snapshotFrom(reply);
      if (reset) {
        const reference = await state.referenceWorker.request("reset", { seed: state.seed });
        state.referenceSnapshot = snapshotFrom(reference);
        state.history = [];
        state.referenceHistory = [];
      }
      state.elapsedDays = modelDay(state.snapshot);
      recordHistory(state.snapshot, state.history);
      recordHistory(state.referenceSnapshot, state.referenceHistory);
      renderAll();
      announce(`${scenarioLabel(state.scenario)} inputs applied.`);
    } catch (error) {
      handleError(error);
    } finally {
      state.busy = false;
      setRuntime("Ready", "ready");
      drainPendingWork();
    }
  }

  function drainPendingWork() {
    if (state.busy) return;
    if (state.pendingModelReset) {
      state.pendingModelReset = false;
      resetModel();
      return;
    }
    if (state.pendingConfigurationReset !== null) {
      const reset = state.pendingConfigurationReset;
      state.pendingConfigurationReset = null;
      configureModel(reset);
    }
  }

  async function advance(days = 30) {
    if (state.busy || !state.worker) return;
    const horizonDays = state.horizonMonths * 30;
    if (state.elapsedDays >= horizonDays) {
      stopPlayback();
      setRuntime("Horizon reached", "complete");
      return;
    }
    state.busy = true;
    setRuntime("Computing", "busy");
    try {
      const stepDays = Math.min(days, horizonDays - state.elapsedDays);
      const [active, reference] = await Promise.all([
        state.worker.request("step", { days: stepDays, snapshot: { historyLimit: 180, includeHistories: true } }),
        state.referenceWorker.request("step", { days: stepDays, snapshot: { historyLimit: 180, includeHistories: true } }),
      ]);
      state.snapshot = snapshotFrom(active);
      state.referenceSnapshot = snapshotFrom(reference);
      state.elapsedDays = modelDay(state.snapshot, state.elapsedDays + stepDays);
      recordHistory(state.snapshot, state.history);
      recordHistory(state.referenceSnapshot, state.referenceHistory);
      renderAll();
    } catch (error) {
      stopPlayback();
      handleError(error);
    } finally {
      state.busy = false;
      if (state.playing) setRuntime("Running", "running");
      else setRuntime("Paused", "ready");
      drainPendingWork();
    }
  }

  function schedulePlayback() {
    clearTimeout(state.playTimer);
    if (!state.playing) return;
    state.playTimer = setTimeout(
      async () => {
        await advance(30);
        schedulePlayback();
      },
      Math.max(80, 850 / state.speed)
    );
  }

  function togglePlayback() {
    state.playing = !state.playing;
    ui.play?.setAttribute("aria-pressed", String(state.playing));
    if (ui.playLabel) ui.playLabel.textContent = state.playing ? "Pause" : "Run";
    if (state.playing) {
      setRuntime("Running", "running");
      announce("Simulation running month by month.");
      schedulePlayback();
    } else {
      stopPlayback(false);
      announce("Simulation paused.");
    }
  }

  function stopPlayback(updateButton = true) {
    state.playing = false;
    clearTimeout(state.playTimer);
    if (updateButton) {
      ui.play?.setAttribute("aria-pressed", "false");
      if (ui.playLabel) ui.playLabel.textContent = "Run";
    }
  }

  async function resetModel() {
    if (!state.worker || !state.referenceWorker) return;
    if (state.busy) {
      state.pendingModelReset = true;
      announce("Reset queued for the next model boundary.");
      return;
    }
    state.busy = true;
    stopPlayback();
    state.seed = Number(ui.seed?.value || 240124);
    setRuntime("Resetting", "busy");
    try {
      const [active, reference] = await Promise.all([
        state.worker.request("reset", { seed: state.seed }),
        state.referenceWorker.request("reset", { seed: state.seed }),
      ]);
      state.snapshot = snapshotFrom(active);
      state.referenceSnapshot = snapshotFrom(reference);
      if (state.scenario !== "reference") {
        const configured = await state.worker.request("configure", { patch: currentPatch(), reset: true });
        state.snapshot = snapshotFrom(configured);
      }
      state.elapsedDays = 0;
      state.history = [];
      state.referenceHistory = [];
      recordHistory(state.snapshot, state.history);
      recordHistory(state.referenceSnapshot, state.referenceHistory);
      renderAll();
      announce(`Reset to seed ${state.seed}.`);
    } catch (error) {
      handleError(error);
    } finally {
      state.busy = false;
      setRuntime("Ready", "ready");
      drainPendingWork();
    }
  }

  function bindControls() {
    ui.play?.addEventListener("click", togglePlayback);
    $("[data-udes-v2-action='step']")?.addEventListener("click", () => advance(30));
    $("[data-udes-v2-action='reset']")?.addEventListener("click", resetModel);
    $("[data-udes-v2-action='reset-levers']")?.addEventListener("click", () => applyPreset("reference"));
    $("[data-udes-v2-action='export']")?.addEventListener("click", exportCsv);
    $("[data-udes-v2-compare]")?.addEventListener("click", (event) => {
      state.compare = !state.compare;
      event.currentTarget.setAttribute("aria-pressed", String(state.compare));
      root.dataset.udesV2Compare = state.compare ? "on" : "off";
      renderAll();
      announce(state.compare ? "Same-seed comparison shown." : "Comparison hidden.");
    });
    $("[data-udes-v2-action='fit-emirate']")?.addEventListener("click", fitMap);
    $("[data-udes-v2-map-action='zoom-in']")?.addEventListener("click", () => state.map?.zoomIn());
    $("[data-udes-v2-map-action='zoom-out']")?.addEventListener("click", () => state.map?.zoomOut());

    for (const button of $$("[data-udes-v2-scenario]")) {
      button.addEventListener("click", () => applyPreset(button.dataset.udesV2Scenario));
    }
    for (const button of $$("[data-udes-v2-speed]")) {
      button.addEventListener("click", () => {
        state.speed = Number(button.dataset.udesV2Speed);
        $$("[data-udes-v2-speed]").forEach((item) => item.setAttribute("aria-pressed", String(item === button)));
        if (state.playing) schedulePlayback();
      });
    }
    for (const input of $$("[data-udes-v2-lever]")) {
      input.addEventListener("input", () => {
        markCustomScenario();
        updateLeverOutput(input);
      });
      input.addEventListener("change", () => configureModel(false));
      updateLeverOutput(input);
    }
    ui.zoneSelect?.addEventListener("change", () => {
      if (ui.zoneSelect.value === "city") selectObject("city", null);
      else selectObject("zone", ui.zoneSelect.value);
      configureModel(false);
    });
    ui.horizon?.addEventListener("change", () => {
      state.horizonMonths = Number(ui.horizon.value);
      if (ui.progress) ui.progress.max = state.horizonMonths;
      renderClock();
    });
    ui.seed?.addEventListener("change", resetModel);

    bindTabs("inspector");
    bindTabs("chart");
    for (const button of $$("[data-udes-v2-map-layer]")) {
      button.addEventListener("click", () => {
        state.mapMode = button.dataset.udesV2MapLayer;
        $$("[data-udes-v2-map-layer]").forEach((item) => item.setAttribute("aria-pressed", String(item === button)));
        updateMapStyles();
      });
    }
  }

  function bindTabs(kind) {
    const tabAttr = kind === "chart" ? "data-udes-v2-chart-tab" : "data-udes-v2-inspector-tab";
    const panelAttr = kind === "chart" ? "data-udes-v2-chart-panel" : "data-udes-v2-inspector-panel";
    const tabs = $$(`[${tabAttr}]`);
    tabs.forEach((tab, index) => {
      tab.addEventListener("click", () => activateTab(kind, tab.getAttribute(tabAttr)));
      tab.addEventListener("keydown", (event) => {
        if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
        event.preventDefault();
        const targetIndex =
          event.key === "Home"
            ? 0
            : event.key === "End"
              ? tabs.length - 1
              : (index + (event.key === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length;
        tabs[targetIndex].focus();
        tabs[targetIndex].click();
      });
    });
    if (!$$(`[${panelAttr}]`).length) return;
  }

  function activateTab(kind, value) {
    const tabSelector = kind === "chart" ? "[data-udes-v2-chart-tab]" : "[data-udes-v2-inspector-tab]";
    const panelSelector = kind === "chart" ? "[data-udes-v2-chart-panel]" : "[data-udes-v2-inspector-panel]";
    const tabKey = kind === "chart" ? "udesV2ChartTab" : "udesV2InspectorTab";
    const panelKey = kind === "chart" ? "udesV2ChartPanel" : "udesV2InspectorPanel";
    $$(tabSelector).forEach((tab) => {
      const active = tab.dataset[tabKey] === value;
      tab.setAttribute("aria-selected", String(active));
      tab.tabIndex = active ? 0 : -1;
    });
    $$(panelSelector).forEach((panel) => {
      panel.hidden = panel.dataset[panelKey] !== value;
    });
    if (kind === "chart") {
      renderChartPanel(value);
      requestAnimationFrame(() => resizeCharts());
    } else if (["citizen", "enterprise", "link"].includes(value) && state.selected.kind !== value) {
      selectSample(value);
    } else if (value === "zone" && !["zone", "city"].includes(state.selected.kind)) {
      const citySelected = ui.zoneSelect?.value === "city";
      const zoneId = citySelected ? null : ui.zoneSelect?.value || state.dataset?.zones?.[0]?.id;
      state.selected = { ...state.selected, kind: citySelected ? "city" : "zone", id: zoneId };
      renderSelection();
      updateMapStyles();
    }
  }

  function handleError(error) {
    console.error(error);
    setRuntime("Model error", "error");
    announce(error.message);
    const placeholder = $("[data-udes-v2-map-placeholder]");
    if (!state.map && placeholder) placeholder.hidden = false;
  }

  async function init() {
    root.dataset.udesV2State = "loading";
    root.dataset.udesV2Compare = "on";
    setRuntime("Loading geography", "busy");
    bindControls();
    try {
      await loadData();
      initMap();
      await startWorkers();
      setupResponsiveBehavior();
    } catch (error) {
      handleError(error);
    }
  }

  init();

  // Rendering and inspection helpers are intentionally kept in this controller so
  // the Web Worker remains deterministic and free of DOM concerns.

  function scenarioLabel(name) {
    return (
      {
        reference: "Reference",
        transit: "Transit first",
        housing: "Connected housing",
        balanced: "Balanced growth",
        custom: "Custom scenario",
      }[name] || name
    );
  }

  function valueAt(object, keys, fallback = 0) {
    for (const key of keys) {
      const value = key.split(".").reduce((current, part) => current?.[part], object);
      if (value !== undefined && value !== null && Number.isFinite(Number(value))) return Number(value);
    }
    return fallback;
  }

  function textAt(object, keys, fallback = "—") {
    for (const key of keys) {
      const value = key.split(".").reduce((current, part) => current?.[part], object);
      if (value !== undefined && value !== null && value !== "") return String(value);
    }
    return fallback;
  }

  function zoneLabel(id) {
    if (!id || id === "—") return "—";
    return baselineZone(id)?.name || String(id);
  }

  function cityOf(snapshot = state.snapshot) {
    return snapshot?.city || snapshot?.metrics || snapshot?.aggregate || {};
  }

  function zonesOf(snapshot = state.snapshot) {
    if (Array.isArray(snapshot?.zones)) return snapshot.zones;
    if (snapshot?.zones && typeof snapshot.zones === "object") return Object.values(snapshot.zones);
    return state.dataset?.zones || [];
  }

  function linksOf(snapshot = state.snapshot) {
    if (Array.isArray(snapshot?.links)) return snapshot.links;
    if (snapshot?.links && typeof snapshot.links === "object") return Object.values(snapshot.links);
    return state.dataset?.roadGraph?.edges || [];
  }

  function samplesOf(kind, snapshot = state.snapshot) {
    const plural = kind === "enterprise" ? "enterprises" : `${kind}s`;
    const candidates = [
      snapshot?.[plural],
      snapshot?.samples?.[plural],
      snapshot?.sample?.[plural],
      snapshot?.[`${kind}Samples`],
      snapshot?.agents?.[plural],
    ];
    return candidates.find(Array.isArray) || [];
  }

  function modelDay(snapshot, fallback = 0) {
    return valueAt(snapshot, ["clock.day", "day", "elapsedDays", "time.day"], fallback);
  }

  function modelDate(snapshot = state.snapshot) {
    const supplied = textAt(snapshot, ["clock.date", "date", "time.date"], "");
    if (supplied) {
      const parsed = new Date(supplied);
      if (!Number.isNaN(parsed.valueOf())) return parsed;
    }
    const start = state.dataset?.calibration?.baseDate || state.dataset?.scope?.baseDate || "2024-01-01";
    return new Date(new Date(start).valueOf() + modelDay(snapshot) * DAY_MS);
  }

  function normalizeCity(snapshot = state.snapshot) {
    const city = cityOf(snapshot);
    const modes = city.modeShares || city.modeShare || city.modes || {};
    const status = city.stateShares || city.statusShare || city.states || city.satisfactionStates || {};
    return {
      day: modelDay(snapshot),
      date: modelDate(snapshot),
      population: valueAt(city, ["population", "representedPopulation", "residents"]),
      jobs: valueAt(city, ["jobs", "representedEmployed", "employment", "filledJobs"]),
      enterprises: valueAt(city, ["enterprises", "enterpriseCount", "firms"]),
      satisfaction: percentToRatio(valueAt(city, ["satisfaction", "satisfactionRate", "happyShare", "happy"], 0)),
      happy: percentToRatio(valueAt(status, ["happy", "Happy", "satisfied"], valueAt(city, ["happyShare", "happy"], 0))),
      waiting: percentToRatio(valueAt(status, ["waiting", "Waiting", "acceptable", "dissatisfied"], valueAt(city, ["waitingShare", "waiting"], 0))),
      extreme: percentToRatio(valueAt(status, ["extreme", "Extreme", "unhappy"], valueAt(city, ["extremeShare", "extreme"], 0))),
      recovery: percentToRatio(valueAt(status, ["recovery", "Recovery"], valueAt(city, ["recoveryShare", "recovery"], 0))),
      carShare: percentToRatio(valueAt(modes, ["car"], valueAt(city, ["carShare", "modeCar"], 0))),
      ptShare: percentToRatio(valueAt(modes, ["pt", "transit"], valueAt(city, ["ptShare", "transitShare"], 0))),
      walkShare: percentToRatio(valueAt(modes, ["walk", "walking"], valueAt(city, ["walkShare"], 0))),
      meanCommute: valueAt(city, [
        "averageRoundTripMinutes",
        "meanCommuteMinutes",
        "commuteMinutes",
        "averageCommuteMinutes",
        "meanRoundTripMinutes",
        "daily.averageRoundTripMinutes",
      ]),
      roadLoad: percentToRatio(valueAt(city, ["averageRoadCapacityUsage", "meanRoadLoad", "roadLoad", "roadCapacityUsage", "averageRoadLoad"])),
      rent: valueAt(city, ["meanHousingRentAed", "housingRent", "averageRent", "rentIndex"]),
      netIncome: valueAt(city, ["averageNetIncomeAed", "meanNetIncomeAed", "netIncome"]),
      bankBalance: valueAt(city, ["averageBankBalanceAed", "meanBankBalanceAed", "bankBalance"]),
      unemployment: percentToRatio(
        valueAt(city, ["unemploymentRate", "unemployment", "unemployedShare"], Math.max(0, 100 - valueAt(city, ["employmentRate"], 100)))
      ),
      sameZone: percentToRatio(valueAt(city, ["sameZoneWorkShare", "sameZoneShare", "liveWorkSameShare"])),
      carKm: valueAt(city, ["dailyCarKm", "daily.carVehicleKm", "carKilometres", "vehicleKm"]),
      forcedWalkers: valueAt(city, ["forcedInterzoneWalkers", "daily.forcedWalkTrips", "forcedWalkers"]),
      hires: valueAt(city, ["monthlyHires", "currentMonthEvents.hires", "events.hires", "hires"]),
      fires: valueAt(city, ["monthlyFires", "currentMonthEvents.fires", "events.fires", "fires"]),
      moves: valueAt(city, ["monthlyMoves", "currentMonthEvents.residentialMoves", "events.residentialMoves", "moves"]),
    };
  }

  function percentToRatio(value) {
    return Number.isFinite(Number(value)) ? Number(value) / 100 : 0;
  }

  function recordHistory(snapshot, target) {
    if (!snapshot) return;
    const point = normalizeCity(snapshot);
    const index = target.findIndex((entry) => entry.day === point.day);
    if (index >= 0) target[index] = point;
    else target.push(point);
    target.sort((a, b) => a.day - b.day);
    if (target.length > 240) target.splice(0, target.length - 240);
  }

  function renderProgress(progress) {
    const completed = valueAt(progress, ["completedDays"], 0);
    const total = valueAt(progress, ["totalDays"], 1);
    setRuntime(`Computing ${Math.round((completed / total) * 100)}%`, "busy");
  }

  function formatNumber(value, maximumFractionDigits = 0) {
    return new Intl.NumberFormat("en-AE", { maximumFractionDigits }).format(Number(value) || 0);
  }

  function formatCompact(value) {
    return new Intl.NumberFormat("en-AE", { notation: "compact", maximumFractionDigits: 1 }).format(Number(value) || 0);
  }

  function formatPercent(value, digits = 1) {
    return `${(Number(value || 0) * 100).toFixed(digits)}%`;
  }

  function formatAed(value, compact = false) {
    if (compact) return `AED ${formatCompact(value)}`;
    return `AED ${formatNumber(value)}`;
  }

  function setMetric(name, value) {
    $$(`[data-udes-v2-metric='${name}']`).forEach((node) => {
      node.textContent = value;
    });
  }

  function setDelta(name, activeValue, referenceValue, format = "points", inverse = false) {
    const difference = Number(activeValue) - Number(referenceValue);
    const adjusted = inverse ? -difference : difference;
    let label = state.compare ? "Same-seed reference" : "Comparison hidden";
    if (!state.compare) {
      $$(`[data-udes-v2-delta='${name}']`).forEach((node) => {
        node.textContent = label;
        node.dataset.direction = "neutral";
      });
      return;
    }
    if (Math.abs(difference) > 0.00001) {
      if (format === "percent") label = `${difference > 0 ? "+" : ""}${(difference * 100).toFixed(1)} pp vs reference`;
      else if (format === "minutes") label = `${difference > 0 ? "+" : ""}${difference.toFixed(1)} min vs reference`;
      else if (format === "compact") label = `${difference > 0 ? "+" : ""}${formatCompact(difference)} vs reference`;
      else label = `${difference > 0 ? "+" : ""}${difference.toFixed(1)} vs reference`;
    }
    $$(`[data-udes-v2-delta='${name}']`).forEach((node) => {
      node.textContent = label;
      node.dataset.direction = adjusted > 0 ? "positive" : adjusted < 0 ? "negative" : "neutral";
    });
  }

  function renderAll() {
    if (!state.snapshot) return;
    renderClock();
    renderSummary();
    updateMapStyles();
    renderSelection();
    const activeChart = $("[data-udes-v2-chart-tab][aria-selected='true']")?.dataset.udesV2ChartTab || "overview";
    renderChartPanel(activeChart);
  }

  function renderClock() {
    const date = modelDate();
    if (ui.date) ui.date.textContent = new Intl.DateTimeFormat("en-AE", { month: "short", year: "numeric" }).format(date);
    const months = Math.min(state.horizonMonths, Math.round(state.elapsedDays / 30));
    if (ui.progress) {
      ui.progress.max = state.horizonMonths;
      ui.progress.value = months;
      ui.progress.textContent = `${months} of ${state.horizonMonths} months`;
    }
    if (ui.progressLabel) ui.progressLabel.textContent = months;
    if (ui.horizonLabel) ui.horizonLabel.textContent = state.horizonMonths;
  }

  function renderSummary() {
    const active = normalizeCity(state.snapshot);
    const reference = normalizeCity(state.referenceSnapshot);
    setMetric("population", formatCompact(active.population));
    setMetric("commute", `${active.meanCommute.toFixed(1)} min`);
    setMetric("carShare", formatPercent(active.carShare));
    setMetric("roadLoad", formatPercent(active.roadLoad));
    setDelta("population", active.population, reference.population, "compact");
    setDelta("commute", active.meanCommute, reference.meanCommute, "minutes", true);
    setDelta("carShare", active.carShare, reference.carShare, "percent", true);
    setDelta("roadLoad", active.roadLoad, reference.roadLoad, "percent", true);
  }

  function findZone(id, snapshot = state.snapshot) {
    return zonesOf(snapshot).find((zone) => String(zone.id || zone.zoneId) === String(id));
  }

  function baselineZone(id) {
    return state.dataset?.zones?.find((zone) => String(zone.id) === String(id));
  }

  function normalizeZone(zone = {}, baseline = {}) {
    const modes = zone.modeShares || zone.modeShare || zone.modes || {};
    const statuses = zone.stateShares || zone.statusShare || zone.states || {};
    const population = valueAt(zone, ["population", "residents", "representedPopulation"], baseline.population2024 || 0);
    const happy = valueAt(statuses, ["happy", "Happy", "satisfied"], valueAt(zone, ["happyShare", "satisfaction"], 0));
    return {
      id: zone.id || zone.zoneId || baseline.id,
      name: zone.name || baseline.name || "Selected district",
      population,
      jobs: valueAt(zone, ["jobs", "representedEmployed", "employment", "filledJobs"], baseline.jobs2024 || 0),
      housing: valueAt(zone, ["housingCapacityRepresented", "housingCapacity", "capacity"], baseline.housingCapacity || 0),
      rent: valueAt(zone, ["residentialRentAed", "housingRentAed", "rent", "rentIndex"], baseline.housingRentIndex || 0),
      satisfaction: percentToRatio(happy),
      commute: valueAt(zone, ["averageRoundTripMinutes", "meanCommuteMinutes", "commuteMinutes", "meanRoundTripMinutes"]),
      carShare: percentToRatio(valueAt(modes, ["car"], valueAt(zone, ["carShare"], 0))),
      ptShare: percentToRatio(valueAt(modes, ["pt", "transit"], valueAt(zone, ["ptShare"], 0))),
      walkShare: percentToRatio(valueAt(modes, ["walk", "walking"], valueAt(zone, ["walkShare"], 0))),
      quality: valueAt(zone, ["quality", "placeQuality"], baseline.quality || 0),
      enterprises: valueAt(zone, ["enterprises", "enterpriseCount", "firms"]),
      vacancies: valueAt(zone, ["vacancies", "openJobs"]),
      bankBalance: valueAt(zone, ["averageBankBalanceAed", "meanBankBalanceAed", "bankBalance"]),
      netIncome: valueAt(zone, ["averageNetIncomeAed", "meanNetIncomeAed", "netIncome"]),
      occupancy:
        population / Math.max(1, valueAt(zone, ["housingCapacityRepresented", "housingCapacity", "capacity"], baseline.housingCapacity || 1)),
    };
  }

  function renderSelection() {
    if (state.selected.kind === "city") {
      renderCityInspector();
      return;
    }
    if (state.selected.kind === "zone") renderZoneInspector(state.selected.id);
    else if (["citizen", "enterprise", "link"].includes(state.selected.kind)) {
      const fallback = samplesOf(state.selected.kind).find((item) => String(item.id) === String(state.selected.id));
      requestInspection(state.selected.kind, state.selected.id, fallback);
    }
  }

  function renderCityInspector() {
    const city = normalizeCity(state.snapshot);
    const reference = normalizeCity(state.referenceSnapshot);
    const zones = zonesOf(state.snapshot).map((zone) => normalizeZone(zone, baselineZone(zone.id || zone.zoneId) || {}));
    const housing = zones.reduce((total, zone) => total + zone.housing, 0);
    const weightedRent = zones.reduce((total, zone) => total + zone.rent * Math.max(1, zone.population), 0);
    const rentPopulation = zones.reduce((total, zone) => total + Math.max(1, zone.population), 0);
    const rent = rentPopulation ? weightedRent / rentPopulation : city.rent;

    if (ui.selectionName) ui.selectionName.textContent = "Greater Abu Dhabi City";
    if (ui.selectionId) ui.selectionId.textContent = "CITY MODEL · 18 DISTRICTS";
    setMetric("zoneSatisfaction", formatPercent(city.satisfaction || city.happy));
    setMetric("zonePopulation", formatCompact(city.population));
    setMetric("zoneJobs", formatCompact(city.jobs));
    setMetric("zoneHousing", formatCompact(housing));
    setMetric("zoneRent", rent > 500 ? formatAed(rent) : rent.toFixed(0));
    setMetric("zoneCommute", `${city.meanCommute.toFixed(1)} min`);
    setMetric("zoneCarShare", formatPercent(city.carShare));
    setDelta("zoneSatisfaction", city.satisfaction || city.happy, reference.satisfaction || reference.happy, "percent");
    const insight = $("[data-udes-v2-insight] p");
    if (insight) {
      insight.textContent = `Citywide view across all 18 modeled districts. ${formatPercent(
        city.sameZone
      )} of employed residents work in their home district; compare scenarios before interpreting a single run.`;
    }
    renderProvenance(null);
    renderInspectorMiniChart({ satisfaction: city.satisfaction || city.happy });
  }

  function renderZoneInspector(id) {
    const baseline = baselineZone(id) || {};
    const zone = normalizeZone(findZone(id) || {}, baseline);
    const reference = normalizeZone(findZone(id, state.referenceSnapshot) || {}, baseline);
    if (ui.selectionName) ui.selectionName.textContent = zone.name;
    if (ui.selectionId) ui.selectionId.textContent = `DISTRICT ${String(zone.id || "").toUpperCase()}`;
    setMetric("zoneSatisfaction", formatPercent(zone.satisfaction));
    setMetric("zonePopulation", formatCompact(zone.population));
    setMetric("zoneJobs", formatCompact(zone.jobs));
    setMetric("zoneHousing", formatCompact(zone.housing));
    setMetric("zoneRent", zone.rent > 500 ? formatAed(zone.rent) : zone.rent.toFixed(0));
    setMetric("zoneCommute", `${zone.commute.toFixed(1)} min`);
    setMetric("zoneCarShare", formatPercent(zone.carShare));
    setDelta("zoneSatisfaction", zone.satisfaction, reference.satisfaction, "percent");
    const insight = $("[data-udes-v2-insight] p");
    if (insight) {
      const pressure = zone.occupancy > 0.92 ? "Housing occupancy is the main modeled pressure." : "Housing capacity remains available.";
      const access =
        zone.commute > 60 ? " Commutes are above the calibrated acceptable range." : " Employment access remains within the calibrated range.";
      insight.textContent = `${pressure}${access}`;
    }
    renderProvenance(baseline);
    renderInspectorMiniChart(zone);
  }

  function renderProvenance(zone) {
    const node = $("[data-udes-v2-provenance]");
    if (!node) return;
    if (!zone) {
      node.innerHTML =
        "<span>Field provenance</span><p><strong>Population</strong> mixed observed / synthetic · <strong>Geography</strong> observed · <strong>Jobs and rents</strong> synthetic calibration</p>";
      return;
    }
    const classes = zone.sourceClassByField || {};
    node.innerHTML = `<span>Field provenance</span><p><strong>Population</strong> ${escapeHtml(
      classes.population2024 || "synthetic"
    )} · <strong>Geography</strong> observed · <strong>Jobs</strong> ${escapeHtml(
      classes.jobs2024 || "synthetic"
    )} · <strong>Rent</strong> ${escapeHtml(classes.housingRentIndex || "synthetic")}</p>`;
  }

  function renderInspectorMiniChart(zone) {
    const mount = $("[data-udes-v2-inspector-chart='zone']");
    if (!mount) return;
    const zoneHistory = state.selected.kind === "zone" ? state.snapshot?.histories?.zones?.[zone.id] || [] : [];
    const zoneSeries = zoneHistory.length
      ? zoneHistory.map((entry) => percentToRatio(valueAt(entry.stateShares || entry.states || {}, ["Happy", "happy"], 0)))
      : state.history.map((entry) => entry.satisfaction || 0);
    const values = zoneSeries.length > 1 ? zoneSeries : [zone.satisfaction, zone.satisfaction];
    const width = 300;
    const height = 58;
    const path = linePath(values, width, height, 4, 0, 1);
    mount.innerHTML = `<div class="udes-v2-mini-chart-heading"><span>Model history</span><strong>${formatPercent(
      zone.satisfaction
    )}</strong></div><svg viewBox="0 0 ${width} 72" role="img" aria-label="Selected district satisfaction history"><path class="udes-v2-mini-chart__line" d="${path}"></path></svg>`;
  }

  function initMap() {
    const mount = $("[data-udes-v2-map]");
    const placeholder = $("[data-udes-v2-map-placeholder]");
    if (!mount || !window.L) {
      if (placeholder) placeholder.hidden = false;
      if (ui.mapStatus) ui.mapStatus.textContent = "Static geography preview";
      return;
    }
    state.map = window.L.map(mount, { zoomControl: false, preferCanvas: true, attributionControl: true, minZoom: 8, maxZoom: 16 });
    window.L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>',
    }).addTo(state.map);
    if (state.geo.roads) {
      state.layers.roads = window.L.geoJSON(state.geo.roads, {
        style: roadStyle,
        onEachFeature: (feature, layer) => {
          layer.on("click", () => selectObject("link", feature.properties?.id || feature.id));
        },
      }).addTo(state.map);
    }
    if (state.geo.zones) {
      state.layers.zones = window.L.geoJSON(state.geo.zones, {
        style: zoneStyle,
        onEachFeature: (feature, layer) => {
          const id = feature.properties?.id || feature.properties?.zoneId || feature.id;
          layer.bindTooltip(feature.properties?.name || baselineZone(id)?.name || id, { sticky: true, direction: "top" });
          layer.on({
            click: () => selectObject("zone", id),
            mouseover: () => layer.setStyle({ weight: 2.2, fillOpacity: 0.4 }),
            mouseout: () => updateMapStyles(),
          });
        },
      }).addTo(state.map);
    } else {
      const points = (state.dataset.zones || []).map((zone) => ({
        type: "Feature",
        properties: zone,
        geometry: { type: "Point", coordinates: zone.centroid },
      }));
      state.layers.zones = window.L.geoJSON(
        { type: "FeatureCollection", features: points },
        {
          pointToLayer: (feature, latlng) => window.L.circleMarker(latlng, { radius: 8, color: palette.green, fillOpacity: 0.45 }),
          onEachFeature: (feature, layer) => layer.on("click", () => selectObject("zone", feature.properties.id)),
        }
      ).addTo(state.map);
    }
    state.layers.roads?.bringToFront?.();
    if (state.geo.stops) {
      state.layers.stops = window.L.geoJSON(state.geo.stops, {
        interactive: false,
        pointToLayer: (_feature, latlng) => window.L.circleMarker(latlng, { radius: 1.7, color: palette.blue, weight: 0, fillOpacity: 0.55 }),
      });
    }
    if (placeholder) placeholder.hidden = true;
    fitMap();
    if (ui.mapStatus) ui.mapStatus.textContent = `${state.dataset.zones?.length || 0} official districts · calibrated agent model`;
    state.map.on("zoomend", updateTransitVisibility);
    updateTransitVisibility();
    setTimeout(() => state.map.invalidateSize(), 80);
  }

  function updateTransitVisibility() {
    if (!state.map || !state.layers.stops) return;
    const shouldShow = state.mapMode === "network" && state.map.getZoom() >= 12;
    const visible = state.map.hasLayer(state.layers.stops);
    if (shouldShow && !visible) state.layers.stops.addTo(state.map);
    else if (!shouldShow && visible) state.map.removeLayer(state.layers.stops);
  }

  function fitMap() {
    if (!state.map) return;
    const bounds = state.layers.zones?.getBounds?.();
    if (bounds?.isValid()) state.map.fitBounds(bounds, { padding: [18, 18], maxZoom: 11 });
    else state.map.setView([24.42, 54.62], 10);
  }

  function zoneFeatureId(feature) {
    return feature?.properties?.id || feature?.properties?.zoneId || feature?.id;
  }

  function zoneValue(feature) {
    const id = zoneFeatureId(feature);
    const zone = normalizeZone(findZone(id) || {}, baselineZone(id) || feature?.properties || {});
    if (state.mapMode === "population") return zone.population;
    if (state.mapMode === "access") return 1 - Math.min(1, zone.commute / 100);
    if (state.mapMode === "rent") return zone.rent;
    return zone.occupancy;
  }

  function extent(values) {
    const finite = values.filter(Number.isFinite);
    if (!finite.length) return [0, 1];
    const minimum = Math.min(...finite);
    const maximum = Math.max(...finite);
    if (Math.abs(maximum - minimum) < 0.0001) return [minimum - 0.5, maximum + 0.5];
    return [minimum, maximum];
  }

  function mixColor(low, high, ratio) {
    const from = low.match(/\w\w/g).map((item) => parseInt(item, 16));
    const to = high.match(/\w\w/g).map((item) => parseInt(item, 16));
    const value = from.map((item, index) => Math.round(item + (to[index] - item) * Math.max(0, Math.min(1, ratio))));
    return `#${value.map((item) => item.toString(16).padStart(2, "0")).join("")}`;
  }

  function zoneStyle(feature) {
    const values = state.geo.zones?.features?.map(zoneValue) || [];
    const [minimum, maximum] = extent(values);
    const value = zoneValue(feature);
    const ratio = (value - minimum) / Math.max(0.0001, maximum - minimum);
    const selected = String(zoneFeatureId(feature)) === String(state.selected.id);
    return {
      color: selected ? palette.ink : "#65736f",
      weight: selected ? 2.6 : 1.1,
      opacity: 0.9,
      fillColor: state.mapMode === "rent" ? mixColor("#f4ead4", "#a9673f", ratio) : mixColor("#e9f0ed", "#277565", ratio),
      fillOpacity: state.mapMode === "network" ? 0.16 : 0.54,
    };
  }

  function roadSnapshot(id) {
    return linksOf().find((link) => String(link.id || link.linkId) === String(id));
  }

  function linkLoad(link = {}) {
    const direct = valueAt(link, ["loadRatio", "roadLoad", "volumeCapacityRatio", "utilization"], Number.NaN);
    if (Number.isFinite(direct)) return direct;
    return Math.max(valueAt(link, ["volumeCapacityAB"], 0), valueAt(link, ["volumeCapacityBA"], 0));
  }

  function roadStyle(feature) {
    const id = feature?.properties?.id || feature?.id;
    const link = roadSnapshot(id) || {};
    const load = linkLoad(link);
    const selected = state.selected.kind === "link" && String(state.selected.id) === String(id);
    return {
      color: load > 0.9 ? palette.red : load > 0.65 ? palette.amber : palette.green,
      weight: selected ? 5 : Math.max(1.4, 2 + load * 2.2),
      opacity: state.mapMode === "network" ? 0.82 : 0.26,
    };
  }

  function updateMapStyles() {
    state.layers.zones?.setStyle?.(zoneStyle);
    state.layers.roads?.setStyle?.(roadStyle);
    updateTransitVisibility();
    if (ui.mapLegend) {
      const labels = {
        network: ["Road load", "Below 65%", "65–90%", "Above 90%"],
        population: ["Resident population", "Lower", "Middle", "Higher"],
        access: ["Job accessibility", "Lower", "Middle", "Higher"],
        rent: ["Housing rent", "Lower", "Middle", "Higher"],
      }[state.mapMode];
      const strong = $("strong", ui.mapLegend);
      if (strong) strong.textContent = labels[0];
      $$("span", ui.mapLegend).forEach((node, index) => {
        node.lastChild.textContent = labels[index + 1];
      });
    }
  }

  async function selectObject(kind, id) {
    state.selected.kind = kind;
    state.selected.id = id;
    if (kind === "zone" && ui.zoneSelect) ui.zoneSelect.value = id;
    activateTab("inspector", kind === "city" ? "zone" : kind);
    updateMapStyles();
    if (["citizen", "enterprise", "link"].includes(kind)) {
      await requestInspection(kind, id);
    } else {
      renderSelection();
    }
  }

  async function selectSample(kind) {
    const samples = samplesOf(kind);
    const list = kind === "link" && !samples.length ? linksOf() : samples;
    if (!list.length) {
      renderEmptyInspection(kind, "No sample is available at this model step.");
      return;
    }
    const index = state.selected.index[kind] % list.length;
    const sample = list[index];
    const id = sample.id || sample[`${kind}Id`];
    state.selected.kind = kind;
    state.selected.id = id;
    await requestInspection(kind, id, sample);
  }

  async function requestInspection(kind, id, fallback) {
    const panel = $(`[data-udes-v2-inspector-panel='${kind}']`);
    if (panel) panel.setAttribute("aria-busy", "true");
    try {
      const reply = await state.worker.request("inspect", { kind, id, historyLimit: 36 });
      renderInspection(kind, reply?.value || reply?.inspection || reply?.agent || reply, fallback);
    } catch (_error) {
      renderInspection(kind, fallback || (kind === "link" ? roadSnapshot(id) : null));
    } finally {
      panel?.removeAttribute("aria-busy");
    }
  }

  function escapeHtml(value) {
    return String(value ?? "—")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function statechart(states, active) {
    return `<div class="udes-v2-statechart" aria-label="Agent statechart">${states
      .map((name) => `<span class="${String(name).toLowerCase() === String(active).toLowerCase() ? "is-active" : ""}">${escapeHtml(name)}</span>`)
      .join('<i aria-hidden="true">→</i>')}</div>`;
  }

  function metricRows(rows) {
    return `<dl class="udes-v2-agent-metrics">${rows
      .map(([label, value]) => `<div><dt>${escapeHtml(label)}</dt><dd>${escapeHtml(value)}</dd></div>`)
      .join("")}</dl>`;
  }

  function agentNavigation(kind, item) {
    const samples = kind === "link" ? linksOf() : samplesOf(kind);
    if (samples.length < 2) return "";
    return `<div class="udes-v2-agent-nav"><button type="button" data-udes-v2-agent-nav="previous">Previous</button><span>${escapeHtml(
      item.id || item[`${kind}Id`] || "sample"
    )}</span><button type="button" data-udes-v2-agent-nav="next">Next</button></div>`;
  }

  function renderInspection(kind, inspection, fallback = {}) {
    const item = inspection && typeof inspection === "object" ? inspection : fallback || {};
    const panel = $(`[data-udes-v2-inspector-panel='${kind}']`);
    if (!panel) return;
    const id = item.id || item[`${kind}Id`] || state.selected.id || "sample";
    if (ui.selectionName)
      ui.selectionName.textContent =
        kind === "enterprise" ? `Enterprise ${id}` : kind === "citizen" ? `Citizen ${id}` : textAt(item, ["name", "roadName"], `Network link ${id}`);
    if (ui.selectionId) ui.selectionId.textContent = `${kind.toUpperCase()} ${id}`;
    if (kind === "citizen") {
      const status = textAt(item, ["status", "state"], "Happy");
      const netIncome = valueAt(item, ["netIncomeAed", "netIncomeMonthly", "netIncome"]);
      const roundTrip = valueAt(item, ["roundTripMinutes", "commuteMinutes"]);
      panel.innerHTML = `${agentNavigation(kind, item)}${statechart(["Happy", "Waiting", "Extreme", "Recovery"], status)}${metricRows([
        ["Representative weight", `${formatNumber(valueAt(item, ["weight"], 1))} people`],
        ["Home district", zoneLabel(textAt(item, ["homeZoneId", "livingZoneId"]))],
        ["Work district", item.workZoneId ? zoneLabel(item.workZoneId) : "Unemployed"],
        ["Employer", textAt(item, ["enterpriseName", "enterpriseId"], "Unemployed")],
        ["Age", textAt(item, ["age"])],
        ["Mode", textAt(item, ["mode"], "walk")],
        ["Owns car", valueAt(item, ["hasCar", "ownsCar"], 0) ? "Yes" : "No"],
        ["Salary", formatAed(valueAt(item, ["salaryAed", "salaryMonthly", "salary"]))],
        ["Housing rent", formatAed(valueAt(item, ["residentialRentAed", "rentMonthly", "rent"]))],
        ["Transport / month", formatAed(valueAt(item, ["monthlyTransportCostAed", "monthlyTransportCost", "transportCost"]))],
        ["Net income", formatAed(netIncome)],
        ["Income goal margin", formatAed(netIncome - currentPatch().waitingNetIncomeAed)],
        ["Savings", formatAed(valueAt(item, ["bankBalanceAed", "bankBalance", "savings"]))],
        ["Round trip", `${roundTrip.toFixed(1)} min`],
        ["Commute goal margin", `${(currentPatch().acceptableCommuteRoundTripMin - roundTrip).toFixed(1)} min`],
      ])}${historyBars(item.history || item.histories, "Citizen finance and commute history")}`;
    } else if (kind === "enterprise") {
      const status = textAt(item, ["status", "state"], "Working");
      const representedEmployees = valueAt(item, ["representedEmployees", "employeeCount", "employees", "staff"]);
      const representedJobCapacity = valueAt(item, ["representedJobCapacity", "maxJobsPersons", "jobCapacity", "maxJobs"]);
      const representedVacancies = Math.max(0, representedJobCapacity - representedEmployees);
      panel.innerHTML = `${agentNavigation(kind, item)}${statechart(["Starting", "Working", "Grow", "Lesser"], status)}${metricRows([
        ["District", zoneLabel(textAt(item, ["zoneId"]))],
        ["Sector", textAt(item, ["sectorLabel", "sector"], "Services")],
        ["Employees represented", formatNumber(representedEmployees)],
        ["Job capacity represented", formatNumber(representedJobCapacity)],
        ["Vacancies represented", formatNumber(representedVacancies)],
        ["Salary bill", formatAed(valueAt(item, ["salaryBillAed", "salaryBillMonthly", "salaryBill"]))],
        ["Business rent", formatAed(valueAt(item, ["totalBusinessRentAed", "totalBusinessRentMonthly", "businessRent"]))],
        ["Revenue proxy", formatAed(valueAt(item, ["monthlyRevenueAed", "revenueMonthly"]))],
        ["Operating margin", formatPercent(valueAt(item, ["operatingMargin", "margin"]))],
        ["Sector demand", valueAt(item, ["demandIndex"], 1).toFixed(2)],
        ["Labor accessibility", formatPercent(valueAt(item, ["laborAccessScore", "labourAccessibility", "accessibility"]))],
      ])}${historyBars(item.history || item.histories, "Employment, wages and rent history")}`;
    } else {
      const current = item.current && typeof item.current === "object" ? { ...item, ...item.current } : item;
      const load = linkLoad(current);
      panel.innerHTML = `${agentNavigation(kind, item)}${metricRows([
        ["From", zoneLabel(textAt(current, ["from"]))],
        ["To", zoneLabel(textAt(current, ["to"]))],
        ["Road class", textAt(current, ["roadClass", "class"], "Urban arterial")],
        ["Distance", `${valueAt(current, ["distanceKm", "lengthKm"]).toFixed(1)} km`],
        ["Free-flow time", `${valueAt(current, ["freeFlowMinutes", "travelTimeFreeFlow"]).toFixed(1)} min`],
        [
          "Modeled time",
          `${Math.max(
            valueAt(current, ["travelTimeABMin"], 0),
            valueAt(current, ["travelTimeBAMin"], 0),
            valueAt(current, ["travelTimeMinutes", "travelTime"], 0)
          ).toFixed(1)} min`,
        ],
        ["Capacity", `${formatNumber(valueAt(current, ["capacityVehPerHour", "capacityVehiclesPerDirection", "capacity"]))} veh/h`],
        ["Load / capacity", formatPercent(load)],
      ])}${historyBars(item.history || item.histories, "Link congestion history")}`;
    }
    bindAgentNavigation(panel, kind);
  }

  function renderEmptyInspection(kind, message) {
    const panel = $(`[data-udes-v2-inspector-panel='${kind}']`);
    if (panel)
      panel.innerHTML = `<div class="udes-v2-empty-state"><strong>No ${escapeHtml(kind)} selected</strong><p>${escapeHtml(message)}</p></div>`;
  }

  function bindAgentNavigation(panel, kind) {
    $$("[data-udes-v2-agent-nav]", panel).forEach((button) => {
      button.addEventListener("click", () => {
        const count = kind === "link" ? linksOf().length : samplesOf(kind).length;
        const delta = button.dataset.udesV2AgentNav === "next" ? 1 : -1;
        state.selected.index[kind] = (state.selected.index[kind] + delta + count) % Math.max(1, count);
        selectSample(kind);
      });
    });
  }

  function historyBars(history, label) {
    const values = Array.isArray(history)
      ? history.slice(-24).map((entry) => valueAt(entry, ["value", "netIncome", "loadRatio", "employeeCount", "commuteMinutes"], 0))
      : [];
    if (!values.length)
      return `<div class="udes-v2-agent-history"><span>${escapeHtml(label)}</span><p>History begins after the first model month.</p></div>`;
    const maximum = Math.max(...values.map(Math.abs), 1);
    return `<div class="udes-v2-agent-history"><span>${escapeHtml(label)}</span><div>${values
      .map((value) => `<i style="--value:${Math.max(0.08, Math.abs(value) / maximum)}" title="${escapeHtml(value.toFixed?.(1) || value)}"></i>`)
      .join("")}</div></div>`;
  }

  function linePath(values, width, height, padding = 8, minimum = null, maximum = null) {
    if (!values.length) return "";
    const min = minimum ?? Math.min(...values);
    const max = maximum ?? Math.max(...values);
    const range = Math.max(0.0001, max - min);
    return values
      .map((value, index) => {
        const x = padding + (index / Math.max(1, values.length - 1)) * (width - padding * 2);
        const y = padding + (1 - (value - min) / range) * (height - padding * 2);
        return `${index ? "L" : "M"}${x.toFixed(2)} ${y.toFixed(2)}`;
      })
      .join(" ");
  }

  function chartSource() {
    const history = state.history.length ? state.history : [normalizeCity()];
    const reference = state.referenceHistory.length ? state.referenceHistory : [normalizeCity(state.referenceSnapshot)];
    const labels = history.map((entry) => new Intl.DateTimeFormat("en-AE", { month: "short", year: "2-digit" }).format(entry.date));
    return { history, reference, labels };
  }

  function baseChartOptions() {
    return {
      animationDuration: 280,
      color: [palette.green, palette.blue, palette.amber, palette.red, palette.sand, palette.teal],
      textStyle: { fontFamily: 'Inter, "Helvetica Neue", sans-serif', color: palette.ink, fontSize: 10 },
      tooltip: {
        trigger: "axis",
        backgroundColor: "#ffffff",
        borderColor: palette.line,
        textStyle: { color: palette.ink, fontSize: 11 },
        confine: true,
      },
      grid: { top: 20, left: 44, right: 16, bottom: 28 },
      legend: { top: 0, right: 4, itemWidth: 12, itemHeight: 7, textStyle: { color: palette.muted, fontSize: 9 } },
      xAxis: {
        type: "category",
        axisLine: { lineStyle: { color: palette.line } },
        axisTick: { show: false },
        axisLabel: { color: palette.muted, fontSize: 9, hideOverlap: true },
      },
      yAxis: {
        type: "value",
        splitLine: { lineStyle: { color: "#e8ece9" } },
        axisLabel: { color: palette.muted, fontSize: 9 },
        axisLine: { show: false },
        axisTick: { show: false },
      },
    };
  }

  function createChartCell(parent, key, title, subtitle = "") {
    const section = document.createElement("section");
    section.className = "udes-v2-live-chart";
    section.innerHTML = `<header><strong>${escapeHtml(title)}</strong><span>${escapeHtml(
      subtitle
    )}</span></header><div role="img" aria-label="${escapeHtml(title)}" data-udes-v2-chart-title="${escapeHtml(
      title
    )}" data-udes-v2-live-chart="${escapeHtml(key)}"></div>`;
    parent.append(section);
    return $("[data-udes-v2-live-chart]", section);
  }

  function mountChart(node, key, option) {
    if (!node) return;
    node.setAttribute("aria-label", chartSummary(node.dataset.udesV2ChartTitle || key, option));
    if (!window.echarts) {
      node.innerHTML =
        '<p class="udes-v2-chart-empty">Interactive chart library unavailable. Model values remain available in the inspector and export.</p>';
      return;
    }
    let chart = state.charts.get(key);
    if (!chart || chart.isDisposed?.()) {
      chart = window.echarts.init(node, null, { renderer: "canvas" });
      state.charts.set(key, chart);
    }
    chart.setOption(option, { notMerge: true, lazyUpdate: true });
  }

  function chartSummary(title, option) {
    const summaries = (option.series || [])
      .map((series) => {
        const points = (series.data || [])
          .map((point) => (typeof point === "object" && point !== null ? Number(point.value) : Number(point)))
          .filter(Number.isFinite);
        if (!points.length) return null;
        if (series.type === "pie") {
          const parts = series.data
            .map((point) => `${point.name}: ${Number(point.value).toFixed(1)}`)
            .slice(0, 6)
            .join(", ");
          return `${series.name || "distribution"}: ${parts}`;
        }
        const latest = points.at(-1);
        return `${series.name || "series"}: latest ${latest.toFixed(1)}, range ${Math.min(...points).toFixed(1)} to ${Math.max(...points).toFixed(
          1
        )}`;
      })
      .filter(Boolean);
    return summaries.length ? `${title}. ${summaries.join(". ")}.` : title;
  }

  function prepareChartPanel(kind, definitions) {
    const mount = $(`[data-udes-v2-chart='${kind}']`);
    if (!mount) return [];
    const signature = definitions.map((definition) => definition[0]).join("|");
    if (mount.dataset.renderedSignature !== signature) {
      for (const [key, chart] of state.charts.entries()) {
        if (key.startsWith(`${kind}:`)) {
          chart.dispose?.();
          state.charts.delete(key);
        }
      }
      mount.replaceChildren();
      mount.classList.add("udes-v2-live-chart-grid");
      definitions.forEach(([key, title, subtitle]) => createChartCell(mount, `${kind}:${key}`, title, subtitle));
      mount.dataset.renderedSignature = signature;
    }
    return definitions.map(([key]) => $(`[data-udes-v2-live-chart='${kind}:${key}']`, mount));
  }

  function renderChartPanel(kind) {
    if (!state.snapshot) return;
    if (kind === "overview") renderOverviewCharts();
    else if (kind === "population") renderPopulationCharts();
    else if (kind === "housing") renderHousingCharts();
    else if (kind === "business") renderBusinessCharts();
    else if (kind === "mobility") renderMobilityCharts();
    else if (kind === "distribution") renderDistributionCharts();
  }

  function renderOverviewCharts() {
    const mount = $("[data-udes-v2-chart='overview']");
    if (!mount) return;
    const [historyNode, stateNode, zoneNode] = prepareChartPanel("overview", [
      ["history", "System trajectory", "Active scenario and same-seed reference"],
      ["states", "Citizen states", "Weighted resident share"],
      ["zones", "District comparison", "Population and jobs"],
    ]);
    const { history, reference, labels } = chartSource();
    const line = baseChartOptions();
    line.xAxis.data = labels;
    line.yAxis = { ...line.yAxis, axisLabel: { ...line.yAxis.axisLabel, formatter: "{value}%" }, max: 100 };
    line.series = [
      {
        name: "Satisfied",
        type: "line",
        showSymbol: false,
        smooth: 0.25,
        data: history.map((entry) => entry.satisfaction * 100),
        lineStyle: { width: 2.2 },
      },
      {
        name: "Car share",
        type: "line",
        showSymbol: false,
        smooth: 0.25,
        data: history.map((entry) => entry.carShare * 100),
        lineStyle: { width: 1.7 },
      },
      {
        name: "Road load",
        type: "line",
        showSymbol: false,
        smooth: 0.25,
        data: history.map((entry) => entry.roadLoad * 100),
        lineStyle: { width: 1.7 },
      },
      state.compare
        ? {
            name: "Reference satisfaction",
            type: "line",
            showSymbol: false,
            data: reference.map((entry) => entry.satisfaction * 100),
            lineStyle: { width: 1.2, type: "dashed", color: palette.muted },
            itemStyle: { color: palette.muted },
          }
        : null,
    ].filter(Boolean);
    mountChart(historyNode, "overview:history", line);

    const current = normalizeCity();
    const states = baseChartOptions();
    states.tooltip = { ...states.tooltip, trigger: "item", formatter: "{b}: {c}%" };
    states.grid = { top: 12, left: 16, right: 16, bottom: 10 };
    states.xAxis = { show: false };
    states.yAxis = { show: false };
    states.legend = { orient: "vertical", right: 6, top: "middle", textStyle: { fontSize: 9, color: palette.muted } };
    states.series = [
      {
        type: "pie",
        radius: ["48%", "72%"],
        center: ["38%", "52%"],
        label: { show: false },
        data: [
          { name: "Happy", value: current.happy * 100, itemStyle: { color: palette.green } },
          { name: "Waiting", value: current.waiting * 100, itemStyle: { color: palette.amber } },
          { name: "Extreme", value: current.extreme * 100, itemStyle: { color: palette.red } },
          { name: "Recovery", value: current.recovery * 100, itemStyle: { color: palette.blue } },
        ],
      },
    ];
    mountChart(stateNode, "overview:states", states);

    const zones = zonesOf()
      .map((item) => normalizeZone(item, baselineZone(item.id || item.zoneId) || {}))
      .sort((a, b) => b.population - a.population)
      .slice(0, 10);
    const compare = baseChartOptions();
    compare.grid = { top: 12, left: 84, right: 10, bottom: 22 };
    compare.legend = { show: false };
    compare.xAxis = { ...compare.xAxis, type: "value", axisLabel: { ...compare.xAxis.axisLabel, formatter: (value) => formatCompact(value) } };
    compare.yAxis = {
      ...compare.yAxis,
      type: "category",
      data: zones.map((zone) => zone.name).reverse(),
      axisLabel: { ...compare.yAxis.axisLabel, width: 74, overflow: "truncate" },
    };
    compare.series = [
      { name: "Population", type: "bar", data: zones.map((zone) => zone.population).reverse(), barWidth: 7, itemStyle: { color: palette.green } },
      { name: "Jobs", type: "bar", data: zones.map((zone) => zone.jobs).reverse(), barWidth: 7, itemStyle: { color: palette.blue } },
    ];
    mountChart(zoneNode, "overview:zones", compare);
  }

  function renderPopulationCharts() {
    const [statesNode, zonesNode, movesNode] = prepareChartPanel("population", [
      ["states", "Satisfaction state history", "Happy, waiting, and extreme"],
      ["zones", "Residents by district", "Current weighted population"],
      ["moves", "Residential response", "Moves, hires, and forced walks"],
    ]);
    const { history, labels } = chartSource();
    const stacked = baseChartOptions();
    stacked.xAxis.data = labels;
    stacked.yAxis = { ...stacked.yAxis, max: 100, axisLabel: { ...stacked.yAxis.axisLabel, formatter: "{value}%" } };
    stacked.series = [
      {
        name: "Happy",
        type: "line",
        stack: "state",
        areaStyle: {},
        showSymbol: false,
        data: history.map((entry) => entry.happy * 100),
        itemStyle: { color: palette.green },
      },
      {
        name: "Waiting",
        type: "line",
        stack: "state",
        areaStyle: {},
        showSymbol: false,
        data: history.map((entry) => entry.waiting * 100),
        itemStyle: { color: palette.amber },
      },
      {
        name: "Extreme",
        type: "line",
        stack: "state",
        areaStyle: {},
        showSymbol: false,
        data: history.map((entry) => entry.extreme * 100),
        itemStyle: { color: palette.red },
      },
    ];
    mountChart(statesNode, "population:states", stacked);

    const zones = zonesOf()
      .map((item) => normalizeZone(item, baselineZone(item.id || item.zoneId) || {}))
      .sort((a, b) => b.population - a.population);
    const bars = baseChartOptions();
    bars.grid = { top: 12, left: 82, right: 14, bottom: 20 };
    bars.legend = { show: false };
    bars.xAxis = { ...bars.xAxis, type: "value", axisLabel: { ...bars.xAxis.axisLabel, formatter: (value) => formatCompact(value) } };
    bars.yAxis = {
      ...bars.yAxis,
      type: "category",
      data: zones
        .slice(0, 12)
        .map((zone) => zone.name)
        .reverse(),
      axisLabel: { ...bars.yAxis.axisLabel, width: 72, overflow: "truncate" },
    };
    bars.series = [
      {
        type: "bar",
        data: zones
          .slice(0, 12)
          .map((zone) => zone.population)
          .reverse(),
        barMaxWidth: 10,
        itemStyle: { color: palette.green },
      },
    ];
    mountChart(zonesNode, "population:zones", bars);

    const events = baseChartOptions();
    events.xAxis.data = labels;
    events.legend = { ...events.legend, show: true };
    events.series = [
      { name: "Moves", type: "bar", data: history.map((entry) => entry.moves), itemStyle: { color: palette.sand } },
      { name: "Hires", type: "line", showSymbol: false, data: history.map((entry) => entry.hires), itemStyle: { color: palette.green } },
      { name: "Forced walks", type: "line", showSymbol: false, data: history.map((entry) => entry.forcedWalkers), itemStyle: { color: palette.red } },
    ];
    mountChart(movesNode, "population:moves", events);
  }

  function renderHousingCharts() {
    const [rentNode, occupancyNode, affordabilityNode] = prepareChartPanel("housing", [
      ["rent", "Housing cost", "District rent level"],
      ["occupancy", "Capacity pressure", "Residents divided by housing capacity"],
      ["affordability", "Household position", "Net income and accumulated savings"],
    ]);
    const zones = zonesOf()
      .map((item) => normalizeZone(item, baselineZone(item.id || item.zoneId) || {}))
      .sort((a, b) => b.rent - a.rent);
    const rent = baseChartOptions();
    rent.grid = { top: 14, left: 88, right: 14, bottom: 20 };
    rent.legend = { show: false };
    rent.xAxis = { ...rent.xAxis, type: "value" };
    rent.yAxis = {
      ...rent.yAxis,
      type: "category",
      data: zones
        .slice(0, 12)
        .map((zone) => zone.name)
        .reverse(),
      axisLabel: { ...rent.yAxis.axisLabel, width: 78, overflow: "truncate" },
    };
    rent.series = [
      {
        type: "bar",
        data: zones
          .slice(0, 12)
          .map((zone) => zone.rent)
          .reverse(),
        barMaxWidth: 11,
        itemStyle: { color: palette.amber },
      },
    ];
    mountChart(rentNode, "housing:rent", rent);

    const occupancy = baseChartOptions();
    occupancy.grid = { top: 14, left: 88, right: 14, bottom: 20 };
    occupancy.legend = { show: false };
    occupancy.xAxis = {
      ...occupancy.xAxis,
      type: "value",
      max: Math.max(1.2, ...zones.map((zone) => zone.occupancy)),
      axisLabel: { ...occupancy.xAxis.axisLabel, formatter: (value) => `${Math.round(value * 100)}%` },
    };
    occupancy.yAxis = {
      ...occupancy.yAxis,
      type: "category",
      data: zones
        .slice(0, 12)
        .map((zone) => zone.name)
        .reverse(),
      axisLabel: { ...occupancy.yAxis.axisLabel, width: 78, overflow: "truncate" },
    };
    occupancy.series = [
      {
        type: "bar",
        data: zones
          .slice(0, 12)
          .map((zone) => ({
            value: zone.occupancy,
            itemStyle: { color: zone.occupancy > 0.95 ? palette.red : zone.occupancy > 0.82 ? palette.amber : palette.green },
          }))
          .reverse(),
        barMaxWidth: 11,
        markLine: { symbol: "none", data: [{ xAxis: 1 }], lineStyle: { color: palette.red, type: "dashed" }, label: { show: false } },
      },
    ];
    mountChart(occupancyNode, "housing:occupancy", occupancy);

    const { history, labels } = chartSource();
    const finance = baseChartOptions();
    finance.xAxis.data = labels;
    finance.yAxis.axisLabel.formatter = (value) => formatCompact(value);
    finance.series = [
      { name: "Net income", type: "line", showSymbol: false, data: history.map((entry) => entry.netIncome), itemStyle: { color: palette.green } },
      { name: "Savings", type: "line", showSymbol: false, data: history.map((entry) => entry.bankBalance), itemStyle: { color: palette.blue } },
      { name: "Rent", type: "line", showSymbol: false, data: history.map((entry) => entry.rent), itemStyle: { color: palette.amber } },
    ];
    mountChart(affordabilityNode, "housing:affordability", finance);
  }

  function renderBusinessCharts() {
    const [jobsNode, firmsNode, labourNode] = prepareChartPanel("business", [
      ["jobs", "Jobs and residents", "District labor-market balance"],
      ["firms", "Enterprise geography", "Firms and vacancies"],
      ["labour", "Labor-market events", "Hires, fires, and unemployment"],
    ]);
    const zones = zonesOf()
      .map((item) => normalizeZone(item, baselineZone(item.id || item.zoneId) || {}))
      .sort((a, b) => b.jobs - a.jobs)
      .slice(0, 12);
    const jobs = baseChartOptions();
    jobs.grid = { top: 12, left: 82, right: 14, bottom: 20 };
    jobs.xAxis = { ...jobs.xAxis, type: "value", axisLabel: { ...jobs.xAxis.axisLabel, formatter: (value) => formatCompact(value) } };
    jobs.yAxis = {
      ...jobs.yAxis,
      type: "category",
      data: zones.map((zone) => zone.name).reverse(),
      axisLabel: { ...jobs.yAxis.axisLabel, width: 72, overflow: "truncate" },
    };
    jobs.series = [
      { name: "Jobs", type: "bar", data: zones.map((zone) => zone.jobs).reverse(), barWidth: 7, itemStyle: { color: palette.blue } },
      { name: "Residents", type: "bar", data: zones.map((zone) => zone.population).reverse(), barWidth: 7, itemStyle: { color: palette.greenSoft } },
    ];
    mountChart(jobsNode, "business:jobs", jobs);

    const firms = baseChartOptions();
    firms.grid = { top: 12, left: 82, right: 14, bottom: 20 };
    firms.xAxis = { ...firms.xAxis, type: "value" };
    firms.yAxis = {
      ...firms.yAxis,
      type: "category",
      data: zones.map((zone) => zone.name).reverse(),
      axisLabel: { ...firms.yAxis.axisLabel, width: 72, overflow: "truncate" },
    };
    firms.series = [
      { name: "Enterprises", type: "bar", data: zones.map((zone) => zone.enterprises).reverse(), barWidth: 7, itemStyle: { color: palette.green } },
      { name: "Vacancies", type: "bar", data: zones.map((zone) => zone.vacancies).reverse(), barWidth: 7, itemStyle: { color: palette.amber } },
    ];
    mountChart(firmsNode, "business:firms", firms);

    const { history, labels } = chartSource();
    const labour = baseChartOptions();
    labour.xAxis.data = labels;
    labour.series = [
      { name: "Hires", type: "bar", data: history.map((entry) => entry.hires), itemStyle: { color: palette.green } },
      { name: "Fires", type: "bar", data: history.map((entry) => -entry.fires), itemStyle: { color: palette.red } },
      {
        name: "Unemployment %",
        type: "line",
        yAxisIndex: 1,
        showSymbol: false,
        data: history.map((entry) => entry.unemployment * 100),
        itemStyle: { color: palette.blue },
      },
    ];
    labour.yAxis = [
      labour.yAxis,
      { type: "value", axisLabel: { formatter: "{value}%", color: palette.muted, fontSize: 9 }, splitLine: { show: false } },
    ];
    mountChart(labourNode, "business:labour", labour);
  }

  function renderMobilityCharts() {
    const [modesNode, commuteNode, linksNode] = prepareChartPanel("mobility", [
      ["modes", "Daily mode choice", "Car, public transport, and walking"],
      ["commute", "Travel burden", "Round-trip time and same-zone work"],
      ["links", "Most loaded road links", "Current modeled volume / capacity"],
    ]);
    const { history, reference, labels } = chartSource();
    const modes = baseChartOptions();
    modes.xAxis.data = labels;
    modes.yAxis = { ...modes.yAxis, max: 100, axisLabel: { ...modes.yAxis.axisLabel, formatter: "{value}%" } };
    modes.series = [
      {
        name: "Car",
        type: "line",
        stack: "mode",
        areaStyle: {},
        showSymbol: false,
        data: history.map((entry) => entry.carShare * 100),
        itemStyle: { color: palette.amber },
      },
      {
        name: "Transit",
        type: "line",
        stack: "mode",
        areaStyle: {},
        showSymbol: false,
        data: history.map((entry) => entry.ptShare * 100),
        itemStyle: { color: palette.blue },
      },
      {
        name: "Walk",
        type: "line",
        stack: "mode",
        areaStyle: {},
        showSymbol: false,
        data: history.map((entry) => entry.walkShare * 100),
        itemStyle: { color: palette.green },
      },
    ];
    mountChart(modesNode, "mobility:modes", modes);

    const commute = baseChartOptions();
    commute.xAxis.data = labels;
    commute.series = [
      { name: "Round trip", type: "line", showSymbol: false, data: history.map((entry) => entry.meanCommute), itemStyle: { color: palette.green } },
      state.compare
        ? {
            name: "Reference",
            type: "line",
            showSymbol: false,
            data: reference.map((entry) => entry.meanCommute),
            lineStyle: { type: "dashed", color: palette.muted },
            itemStyle: { color: palette.muted },
          }
        : null,
      {
        name: "Same-zone work %",
        type: "line",
        yAxisIndex: 1,
        showSymbol: false,
        data: history.map((entry) => entry.sameZone * 100),
        itemStyle: { color: palette.blue },
      },
    ].filter(Boolean);
    commute.yAxis = [
      commute.yAxis,
      { type: "value", axisLabel: { formatter: "{value}%", color: palette.muted, fontSize: 9 }, splitLine: { show: false } },
    ];
    mountChart(commuteNode, "mobility:commute", commute);

    const links = linksOf()
      .map((link) => ({ ...link, load: linkLoad(link) }))
      .sort((a, b) => b.load - a.load)
      .slice(0, 12);
    const linkChart = baseChartOptions();
    linkChart.grid = { top: 12, left: 86, right: 14, bottom: 20 };
    linkChart.legend = { show: false };
    linkChart.xAxis = {
      ...linkChart.xAxis,
      type: "value",
      max: Math.max(1.2, ...links.map((link) => link.load)),
      axisLabel: { ...linkChart.xAxis.axisLabel, formatter: (value) => `${Math.round(value * 100)}%` },
    };
    linkChart.yAxis = {
      ...linkChart.yAxis,
      type: "category",
      data: links.map((link) => textAt(link, ["name", "id"], "Link")).reverse(),
      axisLabel: { ...linkChart.yAxis.axisLabel, width: 76, overflow: "truncate" },
    };
    linkChart.series = [
      {
        type: "bar",
        data: links
          .map((link) => ({
            value: link.load,
            itemStyle: { color: link.load > 0.9 ? palette.red : link.load > 0.65 ? palette.amber : palette.green },
          }))
          .reverse(),
        barMaxWidth: 10,
      },
    ];
    mountChart(linksNode, "mobility:links", linkChart);
  }

  function renderDistributionCharts() {
    const [incomeNode, commuteNode, firmsNode] = prepareChartPanel("distribution", [
      ["income", "Net income distribution", "Citizen-agent sample, AED/month"],
      ["commute", "Commute-time distribution", "Citizen-agent sample, round trip"],
      ["firms", "Enterprise-size distribution", "Enterprise-agent sample"],
    ]);
    const citizens = samplesOf("citizen");
    const enterprises = samplesOf("enterprise");
    mountHistogram(
      incomeNode,
      "distribution:income",
      citizens.map((item) => valueAt(item, ["netIncomeAed", "netIncomeMonthly", "netIncome"])),
      14,
      "AED"
    );
    mountHistogram(
      commuteNode,
      "distribution:commute",
      citizens.map((item) => valueAt(item, ["roundTripMinutes", "commuteMinutes"])),
      14,
      "min"
    );
    mountHistogram(
      firmsNode,
      "distribution:firms",
      enterprises.map((item) => valueAt(item, ["representedEmployees", "employeeCount", "employees", "staff"])),
      12,
      "workers"
    );
  }

  function histogram(values, binCount) {
    const data = values.filter((value) => Number.isFinite(value));
    if (!data.length) return { labels: ["No sample"], values: [0] };
    const min = Math.min(...data);
    const max = Math.max(...data);
    const width = Math.max(1, (max - min) / binCount);
    const bins = Array.from({ length: binCount }, () => 0);
    data.forEach((value) => {
      bins[Math.min(binCount - 1, Math.floor((value - min) / width))] += 1;
    });
    return { labels: bins.map((_value, index) => formatCompact(min + width * index)), values: bins };
  }

  function mountHistogram(node, key, values, bins, unit) {
    const data = histogram(values, bins);
    const option = baseChartOptions();
    option.legend = { show: false };
    option.xAxis.data = data.labels;
    option.xAxis.name = unit;
    option.xAxis.nameTextStyle = { color: palette.muted, fontSize: 9 };
    option.series = [{ type: "bar", data: data.values, barCategoryGap: "8%", itemStyle: { color: palette.green } }];
    mountChart(node, key, option);
  }

  function resizeCharts() {
    state.charts.forEach((chart) => chart.resize?.());
  }

  function exportCsv() {
    const patch = currentPatch();
    const header = [
      "date",
      "scenario",
      "population",
      "satisfaction_share",
      "mean_commute_minutes",
      "car_share",
      "transit_share",
      "walk_share",
      "road_load",
      "mean_net_income_aed",
      "mean_bank_balance_aed",
      "transit_fare_aed",
      "transit_speed_kmh",
      "road_capacity_multiplier",
      "car_cost_per_km_aed",
      "housing_capacity_multiplier",
      "business_capacity_multiplier",
      "rent_pressure_multiplier",
      "place_quality",
      "citizen_income_buffer_aed",
      "acceptable_round_trip_minutes",
      "severe_round_trip_minutes",
      "enterprise_target_margin",
    ];
    const rows = state.history.map((entry) => [
      entry.date.toISOString().slice(0, 10),
      state.scenario,
      entry.population,
      entry.satisfaction,
      entry.meanCommute,
      entry.carShare,
      entry.ptShare,
      entry.walkShare,
      entry.roadLoad,
      entry.netIncome,
      entry.bankBalance,
      patch.transitFareAed,
      patch.transitSpeedKmh,
      patch.roadCapacityMultiplier,
      patch.carCostPerKmAed,
      patch.housingCapacityMultiplier,
      patch.businessCapacityMultiplier,
      patch.rentPressureMultiplier,
      patch.placeQuality,
      patch.waitingNetIncomeAed,
      patch.acceptableCommuteRoundTripMin,
      patch.extremeCommuteRoundTripMin,
      patch.enterpriseTargetMargin,
    ]);
    const csv = [header, ...rows].map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `abu-dhabi-urban-dynamics-${state.scenario}-seed-${state.seed}.csv`;
    document.body.append(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    announce("Scenario history exported as CSV.");
  }

  function setupResponsiveBehavior() {
    const compact = window.matchMedia("(max-width: 1099px)");
    const apply = () => {
      root.dataset.udesV2Mobile = compact.matches ? "readonly" : "interactive";
      $$("[data-udes-v2-action='play'], [data-udes-v2-action='step'], [data-udes-v2-lever], [data-udes-v2-scenario]").forEach((control) => {
        control.disabled = compact.matches;
      });
      if (compact.matches) {
        stopPlayback();
        setRuntime("Read-only", "readonly");
        announce("Mobile view is read-only. Open on a larger screen to run scenarios.");
      } else if (!state.busy) {
        setRuntime("Ready", "ready");
      }
      setTimeout(() => {
        state.map?.invalidateSize?.();
        resizeCharts();
      }, 80);
    };
    compact.addEventListener?.("change", apply);
    apply();
    state.resizeObserver = new ResizeObserver(() => resizeCharts());
    const tray = $("[data-udes-v2-tray]");
    if (tray) state.resizeObserver.observe(tray);
    window.addEventListener(
      "beforeunload",
      () => {
        state.worker?.terminate();
        state.referenceWorker?.terminate();
        state.resizeObserver?.disconnect();
      },
      { once: true }
    );
  }
})();
