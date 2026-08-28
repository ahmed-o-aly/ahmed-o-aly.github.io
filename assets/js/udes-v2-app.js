(() => {
  const DAY_MS = 24 * 60 * 60 * 1000;
  const HISTORY_POINT_LIMIT = 3654;
  const FLOW_HISTORY_DETAIL_DAYS = 30;
  const ASSUMPTION_FIELDS = Object.freeze([
    "rentPressureMultiplier",
    "waitingNetIncomeAed",
    "acceptableCommuteRoundTripMin",
    "extremeCommuteRoundTripMin",
    "enterpriseTargetMargin",
    "targetEmploymentRate",
  ]);
  const TARGETED_LAND_USE_FIELDS = Object.freeze(["housingCapacityMultiplier", "businessCapacityMultiplier", "placeQuality"]);
  const NETWORK_POLICY_FIELDS = Object.freeze([
    "transitFareAed",
    "transitSpeedKmh",
    "ptCapacityMultiplier",
    "roadCapacityMultiplier",
    "carCostPerKmAed",
  ]);
  const LEVER_POLICY_FIELDS = Object.freeze({
    transitFare: "transitFareAed",
    transitSpeed: "transitSpeedKmh",
    transitCapacity: "ptCapacityMultiplier",
    roadCapacity: "roadCapacityMultiplier",
    carCost: "carCostPerKmAed",
    housing: "housingCapacityMultiplier",
    business: "businessCapacityMultiplier",
    placeQuality: "placeQuality",
    incomeBuffer: "waitingNetIncomeAed",
    acceptableCommute: "acceptableCommuteRoundTripMin",
    extremeCommute: "extremeCommuteRoundTripMin",
    targetMargin: "enterpriseTargetMargin",
    employmentTarget: "targetEmploymentRate",
    rentPressure: "rentPressureMultiplier",
  });
  const PRESET_LEVERS = Object.freeze({
    reference: Object.freeze(["transitFare", "transitSpeed", "transitCapacity", "roadCapacity", "carCost", "housing", "business", "placeQuality"]),
    transit: Object.freeze(["transitFare", "transitSpeed", "transitCapacity"]),
    housing: Object.freeze(["housing"]),
    balanced: Object.freeze(["housing", "business", "placeQuality"]),
  });
  const HISTORY_NUMERIC_POLICY_FIELDS = Object.freeze([
    "transitFareAed",
    "transitSpeedKmh",
    "ptCapacityMultiplier",
    "roadCapacityMultiplier",
    "carCostPerKmAed",
    "housingCapacityMultiplier",
    "businessCapacityMultiplier",
    "rentPressureMultiplier",
    "placeQuality",
    "waitingNetIncomeAed",
    "acceptableCommuteRoundTripMin",
    "extremeCommuteRoundTripMin",
    "enterpriseTargetMargin",
    "targetEmploymentRate",
  ]);
  const PUBLIC_PRESETS = Object.freeze({
    reference: Object.freeze({
      transitFareAed: 2,
      transitSpeedKmh: 28,
      ptCapacityMultiplier: 1,
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
      targetEmploymentRate: 0.8,
    }),
    transit: Object.freeze({
      transitFareAed: 1,
      transitSpeedKmh: 45,
      ptCapacityMultiplier: 2,
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
      targetEmploymentRate: 0.8,
    }),
    housing: Object.freeze({
      transitFareAed: 2,
      transitSpeedKmh: 28,
      ptCapacityMultiplier: 1,
      roadCapacityMultiplier: 1,
      carCostPerKmAed: 0.35,
      housingCapacityMultiplier: 1.3,
      businessCapacityMultiplier: 1,
      rentPressureMultiplier: 1,
      placeQuality: 0.82,
      waitingNetIncomeAed: 1500,
      acceptableCommuteRoundTripMin: 60,
      extremeCommuteRoundTripMin: 90,
      enterpriseTargetMargin: 0.12,
      targetEmploymentRate: 0.8,
    }),
    balanced: Object.freeze({
      transitFareAed: 2,
      transitSpeedKmh: 28,
      ptCapacityMultiplier: 1,
      roadCapacityMultiplier: 1,
      carCostPerKmAed: 0.35,
      housingCapacityMultiplier: 1.2,
      businessCapacityMultiplier: 1.15,
      rentPressureMultiplier: 1,
      placeQuality: 0.94,
      waitingNetIncomeAed: 1500,
      acceptableCommuteRoundTripMin: 60,
      extremeCommuteRoundTripMin: 90,
      enterpriseTargetMargin: 0.12,
      targetEmploymentRate: 0.8,
    }),
  });
  const HISTORY_CSV_HEADERS = Object.freeze([
    "day",
    "date",
    "network_assignment_date",
    "network_assignment_status",
    "scenario",
    "policy_scope_zone_id",
    "intervention",
    "intervention_scope",
    "intervention_fields",
    "district_land_use_state_json",
    "daily_hires_represented",
    "daily_fires_represented",
    "daily_moves_represented",
    "population",
    "satisfaction_share",
    "mean_commute_minutes",
    "car_share",
    "car_ownership_share",
    "transit_share",
    "walk_share",
    "road_load",
    "mean_net_income_aed",
    "mean_bank_balance_aed",
    "active_enterprise_share",
    "loss_making_enterprise_share",
    "enterprise_portfolio_margin",
    "transit_fare_aed",
    "transit_speed_kmh",
    "pt_capacity_multiplier",
    "road_capacity_multiplier",
    "car_cost_per_km_aed",
    "uniform_or_target_housing_capacity_multiplier",
    "uniform_or_target_business_capacity_multiplier",
    "rent_pressure_multiplier",
    "uniform_or_target_place_quality",
    "citizen_income_buffer_aed",
    "acceptable_round_trip_minutes",
    "severe_round_trip_minutes",
    "enterprise_target_margin",
    "target_employment_rate",
  ]);

  function resolveHistoryPolicy(patch = {}, fallback = {}, scenario = null) {
    const resolved = {
      scenario: String(scenario || patch.scenario || fallback.scenario || "custom"),
      policyScopeZoneId: String(patch.policyScopeZoneId ?? fallback.policyScopeZoneId ?? "city"),
    };
    for (const field of HISTORY_NUMERIC_POLICY_FIELDS) {
      const value = Number(patch[field] ?? fallback[field]);
      resolved[field] = Number.isFinite(value) ? value : 0;
    }
    return resolved;
  }

  function historyDate(value) {
    if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
    const date = value instanceof Date ? value : new Date(value);
    return Number.isNaN(date.valueOf()) ? "" : date.toISOString().slice(0, 10);
  }

  function historyEntryCsvRow(entry) {
    const mixedDistrictLandUse = String(entry.policyScopeZoneId || "").toLowerCase() === "mixed";
    const landUseScalar = (value) => (mixedDistrictLandUse ? "" : value);
    return [
      entry.day,
      historyDate(entry.date),
      entry.networkAssignmentDate,
      entry.networkAssignmentStatus,
      entry.scenario,
      entry.policyScopeZoneId,
      entry.intervention,
      entry.interventionScope,
      entry.interventionFields,
      JSON.stringify(entry.zonePolicyState || []),
      entry.hires,
      entry.fires,
      entry.moves,
      entry.population,
      entry.satisfaction,
      entry.meanCommute,
      entry.carShare,
      entry.carOwnership,
      entry.ptShare,
      entry.walkShare,
      entry.roadLoad,
      entry.netIncome,
      entry.bankBalance,
      entry.activeEnterpriseShare,
      entry.lossMakingEnterpriseShare,
      entry.enterprisePortfolioMargin,
      entry.transitFareAed,
      entry.transitSpeedKmh,
      entry.ptCapacityMultiplier,
      entry.roadCapacityMultiplier,
      entry.carCostPerKmAed,
      landUseScalar(entry.housingCapacityMultiplier),
      landUseScalar(entry.businessCapacityMultiplier),
      entry.rentPressureMultiplier,
      landUseScalar(entry.placeQuality),
      entry.waitingNetIncomeAed,
      entry.acceptableCommuteRoundTripMin,
      entry.extremeCommuteRoundTripMin,
      entry.enterpriseTargetMargin,
      entry.targetEmploymentRate,
    ];
  }

  function createHistoryPoint(metrics, policy, fallback = {}) {
    return { ...metrics, ...resolveHistoryPolicy(policy, fallback) };
  }

  function historyToCsv(history) {
    return [HISTORY_CSV_HEADERS, ...history.map(historyEntryCsvRow)]
      .map((row) => row.map((cell) => `"${String(cell ?? "").replaceAll('"', '""')}"`).join(","))
      .join("\n");
  }

  function parseUtcDate(value) {
    const text = String(value || "");
    const parsed = /^\d{4}-\d{2}-\d{2}$/.test(text) ? new Date(`${text}T00:00:00Z`) : new Date(text);
    return Number.isNaN(parsed.valueOf()) ? null : parsed;
  }

  function addUtcCalendarMonths(date, months) {
    const source = new Date(date.valueOf());
    const targetMonth = new Date(
      Date.UTC(
        source.getUTCFullYear(),
        source.getUTCMonth() + Math.trunc(months),
        1,
        source.getUTCHours(),
        source.getUTCMinutes(),
        source.getUTCSeconds(),
        source.getUTCMilliseconds()
      )
    );
    const lastDay = new Date(Date.UTC(targetMonth.getUTCFullYear(), targetMonth.getUTCMonth() + 1, 0)).getUTCDate();
    targetMonth.setUTCDate(Math.min(source.getUTCDate(), lastDay));
    return targetMonth;
  }

  function utcDayDifference(start, end) {
    return Math.round((end.valueOf() - start.valueOf()) / DAY_MS);
  }

  function completedCalendarMonthsFrom(start, date) {
    let months = (date.getUTCFullYear() - start.getUTCFullYear()) * 12 + date.getUTCMonth() - start.getUTCMonth();
    if (addUtcCalendarMonths(start, months).valueOf() > date.valueOf()) months -= 1;
    return Math.max(0, months);
  }

  function nextCalendarBoundaryDayFrom(start, date, calendarMonths = 1) {
    const month = completedCalendarMonthsFrom(start, date) + Math.max(1, Math.trunc(calendarMonths));
    return utcDayDifference(start, addUtcCalendarMonths(start, month));
  }

  function horizonEndDayFrom(start, horizonMonths) {
    return utcDayDifference(start, addUtcCalendarMonths(start, horizonMonths));
  }

  function formatChartMonthUtc(date) {
    return new Intl.DateTimeFormat("en-AE", { month: "short", year: "2-digit", timeZone: "UTC" }).format(date);
  }

  function formatChartDayUtc(date) {
    return new Intl.DateTimeFormat("en-AE", { day: "numeric", month: "short", year: "2-digit", timeZone: "UTC" }).format(date);
  }

  function clampDailyStep(currentDay, horizonDays, requestedDays) {
    const current = Math.max(0, Math.floor(Number(currentDay) || 0));
    const horizon = Math.max(0, Math.floor(Number(horizonDays) || 0));
    const requested = Math.max(0, Math.floor(Number(requestedDays) || 0));
    return Math.max(0, Math.min(requested, horizon - current));
  }

  function canSelectHorizon(elapsedDays, proposedHorizonDays) {
    const elapsed = Math.max(0, Math.floor(Number(elapsedDays) || 0));
    const proposed = Math.max(0, Math.floor(Number(proposedHorizonDays) || 0));
    return proposed >= elapsed;
  }

  function filterHistoryWindow(history, windowDays, latestDay = null) {
    if (!Array.isArray(history) || !history.length) return [];
    const window = Math.max(0, Math.floor(Number(windowDays) || 0));
    if (!window) return history.slice();
    const latest =
      latestDay !== null && latestDay !== undefined && Number.isFinite(Number(latestDay)) ? Number(latestDay) : Number(history.at(-1).day) || 0;
    const firstDay = latest - window + 1;
    return history.filter((entry) => Number(entry.day) >= firstDay);
  }

  function flowDefinition(kind) {
    return (
      {
        residential: { collection: "residentialMoves", value: "representedResidents", unit: "represented residents" },
        job: { collection: "jobMoves", value: "representedWorkers", unit: "represented workers" },
        enterprise: { collection: "enterpriseMoves", value: "enterpriseCount", unit: "enterprises" },
        commute: { collection: "commuteOd", value: "representedResidents", unit: "represented residents" },
      }[kind] || { collection: "residentialMoves", value: "representedResidents", unit: "represented residents" }
    );
  }

  function flowRowsForHistoryEntry(entry, kind = "residential") {
    const definition = flowDefinition(kind);
    const rows = entry?.flows?.[definition.collection];
    if (kind !== "residential") return Array.isArray(rows) ? rows : [];
    const replacements = entry?.flows?.replacementRelocations;
    return [
      ...(Array.isArray(rows) ? rows : []),
      ...(Array.isArray(replacements) ? replacements.map((row) => ({ reason: "demographic-replacement", ...row })) : []),
    ];
  }

  function aggregateFlowRoutes(history, kind = "residential", windowDays = 30, latestDay = null) {
    const definition = flowDefinition(kind);
    const points = filterHistoryWindow(history || [], windowDays, latestDay);
    const routes = new Map();
    for (const point of points) {
      for (const row of flowRowsForHistoryEntry(point, kind)) {
        const fromZoneId = String(row.fromZoneId || "");
        const toZoneId = String(row.toZoneId || "");
        if (!fromZoneId || !toZoneId || fromZoneId === toZoneId) continue;
        const key = `${fromZoneId}\u0000${toZoneId}`;
        const value = Math.max(0, Number(row[definition.value]) || 0);
        const current = routes.get(key) || { fromZoneId, toZoneId, value: 0, reasons: {} };
        current.value += value;
        const reason = String(row.reason || "unspecified");
        current.reasons[reason] = (current.reasons[reason] || 0) + value;
        routes.set(key, current);
      }
    }
    return [...routes.values()].sort((a, b) => b.value - a.value || a.fromZoneId.localeCompare(b.fromZoneId));
  }

  function flowSeriesForZone(history, kind, zoneId, windowDays = 30, latestDay = null) {
    const definition = flowDefinition(kind);
    const target = String(zoneId || "");
    return filterHistoryWindow(history || [], windowDays, latestDay).map((point) => {
      let inflow = 0;
      let outflow = 0;
      for (const row of flowRowsForHistoryEntry(point, kind)) {
        const value = Math.max(0, Number(row[definition.value]) || 0);
        if (String(row.toZoneId || "") === target && String(row.fromZoneId || "") !== target) inflow += value;
        if (String(row.fromZoneId || "") === target && String(row.toZoneId || "") !== target) outflow += value;
      }
      return { day: Number(point.day) || 0, date: point.date, inflow, outflow, net: inflow - outflow };
    });
  }

  function commuteRangeMessage(roundTripMinutes, acceptableRoundTripMinutes) {
    const threshold = Number(acceptableRoundTripMinutes);
    return Number(roundTripMinutes) > threshold
      ? ` Mean commute is above the applied ${threshold}-minute acceptable range.`
      : ` Mean commute is within the applied ${threshold}-minute acceptable range.`;
  }

  function summarizeChart(title, option) {
    const axes = [option.xAxis, option.yAxis].flatMap((axis) => (Array.isArray(axis) ? axis : axis ? [axis] : []));
    const categoryLabels = axes.find((axis) => Array.isArray(axis.data))?.data || [];
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
        if (series.type === "bar" && categoryLabels.length === points.length && categoryLabels.length <= 24) {
          const pairs = points.map((point, index) => `${categoryLabels[index]}: ${point.toFixed(1)}`).join(", ");
          return `${series.name || "series"}: ${pairs}`;
        }
        const latest = points.at(-1);
        return `${series.name || "series"}: latest ${latest.toFixed(1)}, range ${Math.min(...points).toFixed(1)} to ${Math.max(...points).toFixed(
          1
        )}`;
      })
      .filter(Boolean);
    const interventions = (option.series || [])
      .flatMap((series) => series.markLine?.data || [])
      .map((marker) => marker.name)
      .filter(Boolean);
    const interventionSummary = interventions.length ? ` Interventions: ${[...new Set(interventions)].join(", ")}.` : "";
    return summaries.length ? `${title}. ${summaries.join(". ")}.${interventionSummary}` : `${title}.${interventionSummary}`;
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = {
      PUBLIC_PRESETS,
      HISTORY_CSV_HEADERS,
      resolveHistoryPolicy,
      createHistoryPoint,
      historyEntryCsvRow,
      historyToCsv,
      parseUtcDate,
      addUtcCalendarMonths,
      utcDayDifference,
      completedCalendarMonthsFrom,
      nextCalendarBoundaryDayFrom,
      horizonEndDayFrom,
      formatChartMonthUtc,
      formatChartDayUtc,
      clampDailyStep,
      canSelectHorizon,
      filterHistoryWindow,
      flowDefinition,
      flowRowsForHistoryEntry,
      aggregateFlowRoutes,
      flowSeriesForZone,
      commuteRangeMessage,
      summarizeChart,
    };
  }
  if (typeof document === "undefined") return;

  const root = document.querySelector("[data-udes-v2-root]");
  if (!root) return;

  const $ = (selector, scope = root) => scope.querySelector(selector);
  const $$ = (selector, scope = root) => Array.from(scope.querySelectorAll(selector));
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
    horizonDays: 366,
    chartWindowDays: 90,
    flowKind: "residential",
    flowWindowDays: 30,
    elapsedDays: 0,
    seed: 240124,
    appliedPolicy: null,
    referenceAppliedPolicy: null,
    draftDirty: false,
    draftFields: new Set(),
    draftScopeDirty: false,
    interventions: [],
    appliedZonePolicies: new Map(),
    latestDailyStatus: null,
    charts: new Map(),
    chartInteractionLocks: new Set(),
    pendingChartOptions: new Map(),
    chartDataSignatures: new Map(),
    panelHtml: new WeakMap(),
    pendingPanelRenders: new WeakMap(),
    hoveredZoneId: null,
    resizeObserver: null,
    requestCounter: 0,
    inspectionRequestToken: 0,
    playTimer: null,
    pendingModelReset: false,
  };

  const presets = PUBLIC_PRESETS;
  const MUTATING_CONTROL_SELECTOR =
    "[data-udes-v2-action='play'], [data-udes-v2-step-days], [data-udes-v2-action='reset'], [data-udes-v2-action='reset-levers'], [data-udes-v2-action='apply-policy'], [data-udes-v2-lever], [data-udes-v2-scenario], [data-udes-v2-policy-scope], [data-udes-v2-horizon], [data-udes-v2-seed]";

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
    policyScope: $("[data-udes-v2-policy-scope]"),
    horizon: $("[data-udes-v2-horizon]"),
    chartWindow: $("[data-udes-v2-window]"),
    flowKind: $("[data-udes-v2-flow-kind]"),
    flowWindow: $("[data-udes-v2-flow-window]"),
    flowFilter: $("[data-udes-v2-flow-controls]"),
    seed: $("[data-udes-v2-seed]"),
    applyPolicy: $("[data-udes-v2-action='apply-policy']"),
    policyStatus: $("[data-udes-v2-policy-status]"),
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
    ui.zoneSelect?.replaceChildren();
    ui.policyScope?.replaceChildren();
    if (ui.zoneSelect) {
      const all = document.createElement("option");
      all.value = "city";
      all.textContent = "Greater Abu Dhabi City";
      ui.zoneSelect.append(all);
    }
    if (ui.policyScope) {
      const all = document.createElement("option");
      all.value = "city";
      all.textContent = `All ${state.dataset.zones?.length || 0} districts`;
      ui.policyScope.append(all);
    }
    for (const zone of state.dataset.zones || []) {
      for (const select of [ui.zoneSelect, ui.policyScope].filter(Boolean)) {
        const option = document.createElement("option");
        option.value = zone.id;
        option.textContent = zone.name;
        select.append(option);
      }
    }
    state.selected.kind = "city";
    state.selected.id = null;
    if (ui.zoneSelect) ui.zoneSelect.value = "city";
    if (ui.policyScope) ui.policyScope.value = "city";
    const scopeLabel = ui.zoneSelect ? $(".udes-v2-section-heading span", ui.zoneSelect.closest(".udes-v2-control-section")) : null;
    if (scopeLabel) scopeLabel.textContent = `${state.dataset.zones?.length || 0} districts`;
  }

  function currentPatch() {
    const values = {};
    for (const input of $$("[data-udes-v2-lever]")) values[input.dataset.udesV2Lever] = Number(input.value);
    return {
      transitFareAed: values.transitFare,
      transitSpeedKmh: values.transitSpeed,
      ptCapacityMultiplier: values.transitCapacity / 100,
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
      targetEmploymentRate: values.employmentTarget / 100,
      policyScopeZoneId: ui.policyScope?.value || "city",
      scenario: state.scenario,
    };
  }

  function policyFromControls() {
    return resolveHistoryPolicy(currentPatch(), presets[state.scenario] || presets.reference, state.scenario);
  }

  function referencePolicyFromControls() {
    const draft = currentPatch();
    const assumptions = Object.fromEntries(ASSUMPTION_FIELDS.map((field) => [field, draft[field]]));
    return resolveHistoryPolicy(
      { ...presets.reference, ...assumptions, policyScopeZoneId: "city", scenario: "reference" },
      presets.reference,
      "reference"
    );
  }

  function enginePolicyPatch(policy) {
    return {
      ...policy,
      policyScopeZoneId: !policy.policyScopeZoneId || policy.policyScopeZoneId === "city" ? null : policy.policyScopeZoneId,
    };
  }

  function compactZonePolicy(zone = {}) {
    return {
      id: String(zone.id || zone.zoneId || ""),
      housingCapacityMultiplier: Number(zone.housingCapacityMultiplier ?? zone.appliedHousingCapacityMultiplier ?? 1),
      businessCapacityMultiplier: Number(zone.businessCapacityMultiplier ?? zone.appliedBusinessCapacityMultiplier ?? 1),
      placeQuality: Number(zone.placeQuality ?? zone.placeQualityPolicy ?? 0.82),
    };
  }

  function zonePolicyStateFromSnapshot(snapshot) {
    const source = Array.isArray(snapshot?.zonePolicies) ? snapshot.zonePolicies : Array.isArray(snapshot?.zones) ? snapshot.zones : [];
    return source.map(compactZonePolicy).filter((zone) => zone.id);
  }

  function seedAppliedZonePolicies(snapshot) {
    state.appliedZonePolicies = new Map(zonePolicyStateFromSnapshot(snapshot).map((zone) => [zone.id, zone]));
  }

  function updateAppliedZonePolicies(policy, changedFields) {
    const changed = new Set(changedFields);
    if (!TARGETED_LAND_USE_FIELDS.some((field) => changed.has(field))) return;
    const targetIds =
      !policy.policyScopeZoneId || policy.policyScopeZoneId === "city"
        ? (state.dataset?.zones || []).map((zone) => String(zone.id))
        : [String(policy.policyScopeZoneId)];
    for (const id of targetIds) {
      const current = state.appliedZonePolicies.get(id) || compactZonePolicy({ id });
      state.appliedZonePolicies.set(id, {
        ...current,
        housingCapacityMultiplier: changed.has("housingCapacityMultiplier") ? policy.housingCapacityMultiplier : current.housingCapacityMultiplier,
        businessCapacityMultiplier: changed.has("businessCapacityMultiplier")
          ? policy.businessCapacityMultiplier
          : current.businessCapacityMultiplier,
        placeQuality: changed.has("placeQuality") ? policy.placeQuality : current.placeQuality,
      });
    }
  }

  function appliedZonePolicyList() {
    return [...state.appliedZonePolicies.values()].sort((a, b) => a.id.localeCompare(b.id));
  }

  function historyScopeFromZonePolicies(policies, fallback = "city") {
    if (!Array.isArray(policies) || policies.length < 2) return fallback || "city";
    const signature = (policy) =>
      [policy.housingCapacityMultiplier, policy.businessCapacityMultiplier, policy.placeQuality].map((value) => Number(value).toFixed(6)).join("|");
    if (new Set(policies.map(signature)).size === 1) return "city";
    const changed = policies.filter(
      (policy) =>
        Math.abs(policy.housingCapacityMultiplier - PUBLIC_PRESETS.reference.housingCapacityMultiplier) > 1e-9 ||
        Math.abs(policy.businessCapacityMultiplier - PUBLIC_PRESETS.reference.businessCapacityMultiplier) > 1e-9 ||
        Math.abs(policy.placeQuality - PUBLIC_PRESETS.reference.placeQuality) > 1e-9
    );
    return changed.length === 1 ? changed[0].id : "mixed";
  }

  function sameAppliedLandUseForScope(scopeZoneId) {
    const policies =
      !scopeZoneId || scopeZoneId === "city" ? appliedZonePolicyList() : [state.appliedZonePolicies.get(String(scopeZoneId))].filter(Boolean);
    if (!policies.length) return null;
    const first = policies[0];
    const fields = TARGETED_LAND_USE_FIELDS;
    return policies.every((policy) => fields.every((field) => Math.abs(Number(policy[field]) - Number(first[field])) < 1e-9)) ? first : null;
  }

  function loadAppliedLandUseControls(scopeZoneId) {
    const policy = sameAppliedLandUseForScope(scopeZoneId);
    if (!policy) return false;
    setLever("housing", policy);
    setLever("business", policy);
    setLever("placeQuality", policy);
    return true;
  }

  function showMixedAppliedLandUseControls() {
    for (const name of ["housing", "business", "placeQuality"]) {
      setLever(name, PUBLIC_PRESETS.reference);
      const input = $(`[data-udes-v2-lever='${name}']`);
      const output = $(`[data-udes-v2-output='${name}']`);
      input?.setAttribute("aria-valuetext", "Mixed across districts");
      if (output) {
        output.value = "Mixed";
        output.textContent = "Mixed";
      }
    }
  }

  function mergeAppliedPolicy(current, requested, changedFields, reference = false) {
    const merged = { ...(current || (reference ? presets.reference : requested)) };
    for (const field of changedFields) {
      if (!reference || ASSUMPTION_FIELDS.includes(field)) merged[field] = requested[field];
    }
    if (!reference && TARGETED_LAND_USE_FIELDS.some((field) => changedFields.includes(field))) {
      merged.policyScopeZoneId = requested.policyScopeZoneId;
    }
    merged.scenario = reference ? "reference" : requested.scenario;
    return resolveHistoryPolicy(merged, presets.reference, merged.scenario);
  }

  function stagedEnginePatch(policy, reference = false) {
    const patch = {};
    for (const field of state.draftFields) {
      if (!reference || ASSUMPTION_FIELDS.includes(field)) patch[field] = policy[field];
    }
    const changesTargetedLandUse = TARGETED_LAND_USE_FIELDS.some((field) => state.draftFields.has(field));
    if (!reference && changesTargetedLandUse) {
      patch.policyScopeZoneId = !policy.policyScopeZoneId || policy.policyScopeZoneId === "city" ? null : policy.policyScopeZoneId;
    }
    return patch;
  }

  function structuralConfig() {
    return {
      startDate: state.dataset?.calibration?.baseDate || "2024-01-01",
      calibrationLabel: "Illustrative Greater Abu Dhabi City scenario baseline — not a forecast",
      endogenousEnterpriseDynamics: true,
    };
  }

  function setLever(name, value) {
    const input = $(`[data-udes-v2-lever='${name}']`);
    if (!input) return;
    const transformed = {
      transitFare: value.transitFareAed,
      transitSpeed: value.transitSpeedKmh,
      transitCapacity: value.ptCapacityMultiplier * 100,
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
      employmentTarget: value.targetEmploymentRate * 100,
    }[name];
    if (Number.isFinite(transformed)) input.value = transformed;
    input.removeAttribute("aria-valuetext");
    updateLeverOutput(input);
  }

  function applyPreset(name) {
    const preset = presets[name] || presets.reference;
    state.scenario = name;
    if (name === "reference" && ui.policyScope) {
      ui.policyScope.value = "city";
      state.draftScopeDirty = true;
    }
    for (const button of $$("[data-udes-v2-scenario]")) {
      button.setAttribute("aria-pressed", String(button.dataset.udesV2Scenario === name));
    }
    for (const leverName of PRESET_LEVERS[name] || PRESET_LEVERS.reference) {
      setLever(leverName, preset);
      const policyField = LEVER_POLICY_FIELDS[leverName];
      if (policyField) state.draftFields.add(policyField);
    }
    markDraftDirty(`${scenarioLabel(name)} template selected`);
  }

  function markCustomScenario() {
    state.scenario = "custom";
    for (const button of $$("[data-udes-v2-scenario]")) button.setAttribute("aria-pressed", "false");
  }

  function markDraftDirty(label = "Unapplied changes") {
    state.draftDirty = true;
    if (ui.applyPolicy) {
      ui.applyPolicy.disabled = mutationControlsUnavailable() || state.elapsedDays >= state.horizonDays;
    }
    if (ui.policyStatus) {
      ui.policyStatus.textContent = state.elapsedDays >= state.horizonDays ? `${label} · extend the horizon or reset to apply` : label;
    }
  }

  function clearDraftDirty(label = "No unapplied changes") {
    state.draftDirty = false;
    state.draftFields.clear();
    state.draftScopeDirty = false;
    if (ui.applyPolicy) ui.applyPolicy.disabled = true;
    if (ui.policyStatus) ui.policyStatus.textContent = label;
  }

  function resetDraft() {
    const applied = state.appliedPolicy || resolveHistoryPolicy(presets.reference, presets.reference, "reference");
    const selectedScope = ui.policyScope?.value || applied.policyScopeZoneId || "city";
    state.scenario = applied.scenario || "reference";
    for (const button of $$("[data-udes-v2-scenario]")) {
      button.setAttribute("aria-pressed", String(button.dataset.udesV2Scenario === state.scenario));
    }
    for (const lever of $$("[data-udes-v2-lever]")) {
      const field = LEVER_POLICY_FIELDS[lever.dataset.udesV2Lever];
      if (!TARGETED_LAND_USE_FIELDS.includes(field)) setLever(lever.dataset.udesV2Lever, applied);
    }
    if (ui.policyScope) ui.policyScope.value = selectedScope;
    const loaded = loadAppliedLandUseControls(selectedScope);
    if (!loaded) showMixedAppliedLandUseControls();
    clearDraftDirty(
      loaded ? `Viewing applied land-use inputs · ${policyScopeLabel(selectedScope)}` : "Mixed district land-use inputs remain applied"
    );
    announce(
      loaded
        ? `Draft restored to the currently applied inputs for ${policyScopeLabel(selectedScope)}.`
        : "Draft cleared. District land-use settings remain mixed; choose a district to inspect its applied values."
    );
  }

  function updateLeverOutput(input) {
    const name = input.dataset.udesV2Lever;
    const output = $(`[data-udes-v2-output='${name}']`);
    if (!output) return;
    const value = Number(input.value);
    const labels = {
      transitFare: `AED ${value.toFixed(2)}`,
      transitSpeed: `${value.toFixed(0)} km/h`,
      transitCapacity: `${value.toFixed(0)}%`,
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
      employmentTarget: `${value.toFixed(0)}%`,
    };
    output.value = labels[name] || String(value);
    output.textContent = output.value;
  }

  function enforceCommuteThresholdOrder(changedInput) {
    const acceptable = $("[data-udes-v2-lever='acceptableCommute']");
    const severe = $("[data-udes-v2-lever='extremeCommute']");
    if (!acceptable || !severe) return [];
    if (changedInput === acceptable && Number(acceptable.value) > Number(severe.value)) {
      severe.value = acceptable.value;
      return [severe];
    }
    if (changedInput === severe && Number(severe.value) < Number(acceptable.value)) {
      acceptable.value = severe.value;
      return [acceptable];
    }
    return [];
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
    const activePolicy = policyFromControls();
    const fixedReferencePolicy = referencePolicyFromControls();
    const referenceConfig = { ...structuralConfig(), ...enginePolicyPatch(fixedReferencePolicy) };
    const activeConfig = { ...structuralConfig(), ...enginePolicyPatch(activePolicy) };
    const [active, reference] = await Promise.all([
      state.worker.request("init", { data, config: activeConfig, seed: state.seed }),
      state.referenceWorker.request("init", { data, config: referenceConfig, seed: state.seed }),
    ]);
    state.snapshot = snapshotFrom(active);
    state.referenceSnapshot = snapshotFrom(reference);
    seedAppliedZonePolicies(state.snapshot);
    state.appliedPolicy = activePolicy;
    state.referenceAppliedPolicy = fixedReferencePolicy;
    state.elapsedDays = modelDay(state.snapshot);
    state.history = [];
    state.referenceHistory = [];
    state.interventions = [];
    state.latestDailyStatus = null;
    recordHistory(state.snapshot, state.history, state.appliedPolicy);
    recordHistory(state.referenceSnapshot, state.referenceHistory, fixedReferencePolicy);
    clearDraftDirty();
    renderAll();
    setRuntime("Ready", "ready");
    announce("Agent model initialized with the reference comparison ready.");
  }

  async function applyDraftPolicy() {
    if (!state.worker || !state.referenceWorker) return;
    if (!state.draftDirty) {
      announce("There are no unapplied inputs.");
      return;
    }
    if (state.busy) {
      announce("Wait for the current daily model update to finish, then apply the draft.");
      return;
    }
    if (state.elapsedDays >= state.horizonDays) {
      announce("The current horizon is complete. Extend it, or reset the run, before staging another intervention.");
      return;
    }
    state.busy = true;
    setMutationControlsDisabled(true);
    setRuntime("Staging intervention", "busy");
    let operationFailed = false;
    try {
      const requestedPolicy = policyFromControls();
      const requestedReferencePolicy = referencePolicyFromControls();
      const changedFields = [...state.draftFields];
      if (!changedFields.length) {
        clearDraftDirty("Target selected; change a land-use lever to apply it");
        announce("A target area alone does not change the model. Change housing, employment-space, or public-realm inputs first.");
        return;
      }
      await Promise.all([
        state.worker.request("configure", { patch: stagedEnginePatch(requestedPolicy), reset: false }),
        state.referenceWorker.request("configure", { patch: stagedEnginePatch(requestedReferencePolicy, true), reset: false }),
      ]);
      state.appliedPolicy = mergeAppliedPolicy(state.appliedPolicy, requestedPolicy, changedFields);
      state.referenceAppliedPolicy = mergeAppliedPolicy(state.referenceAppliedPolicy, requestedReferencePolicy, changedFields, true);
      updateAppliedZonePolicies(requestedPolicy, changedFields);
      const effectiveDay = state.elapsedDays + 1;
      const effectiveDate = new Date(simulationStartDate().valueOf() + effectiveDay * DAY_MS);
      const descriptor = interventionDescriptor(requestedPolicy, changedFields);
      const marker = {
        day: effectiveDay,
        date: historyDate(effectiveDate),
        scenario: requestedPolicy.scenario,
        policyScopeZoneId: TARGETED_LAND_USE_FIELDS.some((field) => changedFields.includes(field)) ? requestedPolicy.policyScopeZoneId : "",
        scope: descriptor.scope,
        fields: descriptor.fields,
        label: descriptor.label,
      };
      const existingMarker = state.interventions.findIndex((intervention) => intervention.day === effectiveDay);
      if (existingMarker >= 0) {
        const existing = state.interventions[existingMarker];
        state.interventions[existingMarker] = {
          ...marker,
          scope: [...new Set([existing.scope, marker.scope].filter(Boolean))].join(" + "),
          fields: [...new Set([...(existing.fields || []), ...marker.fields])],
          label: [...new Set([existing.label, marker.label].filter(Boolean))].join("; "),
        };
      } else state.interventions.push(marker);
      clearDraftDirty(`Applied · effective Day ${effectiveDay}`);
      announce(`${marker.label} is staged for ${formatLongDate(effectiveDate)}. Existing daily history was not rewritten.`);
    } catch (error) {
      operationFailed = true;
      stopPlayback();
      clearPendingWork();
      handleError(error);
    } finally {
      state.busy = false;
      if (!operationFailed) {
        restoreMutationControlAvailability();
        setRuntime("Ready", "ready");
        drainPendingWork();
      }
    }
  }

  function clearPendingWork() {
    state.pendingModelReset = false;
  }

  function drainPendingWork() {
    if (state.busy) return;
    if (state.pendingModelReset) {
      state.pendingModelReset = false;
      resetModel();
      return;
    }
  }

  function leanSnapshotOptions(snapshot = state.snapshot) {
    return {
      historyLimit: 0,
      includeHistories: false,
      citizenIds: samplesOf("citizen", snapshot).map((citizen) => citizen.id),
      enterpriseIds: samplesOf("enterprise", snapshot).map((enterprise) => enterprise.id),
    };
  }

  function detachDailySeries(reply) {
    const snapshot = snapshotFrom(reply) || {};
    const dailySeries = Array.isArray(snapshot.dailySeries) ? snapshot.dailySeries : [];
    const { dailySeries: _dailySeries, ...leanSnapshot } = snapshot;
    return { dailySeries, snapshot: leanSnapshot };
  }

  async function advanceDays(requestedDays = 1) {
    if (state.busy || !state.worker) return;
    const stepDays = clampDailyStep(state.elapsedDays, state.horizonDays, requestedDays);
    if (!stepDays) {
      stopPlayback();
      setRuntime("Horizon reached", "complete");
      return;
    }
    state.busy = true;
    restoreMutationControlAvailability();
    if (!state.playing) setRuntime("Computing", "busy");
    let operationFailed = false;
    try {
      const [active, reference] = await Promise.all([
        state.worker.request("step", { days: stepDays, captureDaily: true, snapshot: leanSnapshotOptions() }),
        state.referenceWorker.request("step", {
          days: stepDays,
          captureDaily: true,
          snapshot: { historyLimit: 0, includeHistories: false, citizenIds: [], enterpriseIds: [] },
        }),
      ]);
      const activeResult = detachDailySeries(active);
      const referenceResult = detachDailySeries(reference);
      recordDailySeries(activeResult.dailySeries, state.history, state.appliedPolicy);
      recordDailySeries(referenceResult.dailySeries, state.referenceHistory, state.referenceAppliedPolicy);
      state.snapshot = activeResult.snapshot;
      state.referenceSnapshot = referenceResult.snapshot;
      state.latestDailyStatus = activeResult.dailySeries.at(-1) || null;
      state.elapsedDays = modelDay(state.snapshot, state.elapsedDays + stepDays);
      renderAll();
      if (state.elapsedDays >= state.horizonDays) {
        stopPlayback();
        setRuntime("Horizon reached", "complete");
        announce(`Simulation reached the ${state.horizonDays}-day horizon.`);
      }
    } catch (error) {
      operationFailed = true;
      stopPlayback();
      clearPendingWork();
      handleError(error);
    } finally {
      state.busy = false;
      if (!operationFailed) {
        restoreMutationControlAvailability();
        if (state.elapsedDays >= state.horizonDays) setRuntime("Horizon reached", "complete");
        else if (state.playing) setRuntime("Running", "running");
        else setRuntime("Paused", "ready");
        drainPendingWork();
      }
    }
  }

  function schedulePlayback() {
    clearTimeout(state.playTimer);
    if (!state.playing) return;
    state.playTimer = setTimeout(async () => {
      await advanceDays(state.speed);
      schedulePlayback();
    }, 650);
  }

  function togglePlayback() {
    if (state.playing) {
      stopPlayback(false);
      ui.play?.setAttribute("aria-pressed", "false");
      if (ui.playLabel) ui.playLabel.textContent = "Run";
      restoreMutationControlAvailability();
      setRuntime("Paused", "ready");
      announce("Simulation paused after the current daily update.");
      return;
    }
    if (!state.worker || !state.referenceWorker || state.busy) {
      announce(state.busy ? "Wait for the current model operation to finish." : "Wait for the agent model to finish loading.");
      return;
    }
    state.playing = true;
    ui.play?.setAttribute("aria-pressed", "true");
    if (ui.playLabel) ui.playLabel.textContent = "Pause";
    restoreMutationControlAvailability();
    setRuntime("Running", "running");
    announce(`Simulation running in ${state.speed}-day updates.`);
    schedulePlayback();
  }

  function stopPlayback(updateButton = true) {
    state.playing = false;
    clearTimeout(state.playTimer);
    if (updateButton) {
      ui.play?.setAttribute("aria-pressed", "false");
      if (ui.playLabel) ui.playLabel.textContent = "Run";
    }
    restoreMutationControlAvailability();
  }

  async function resetModel() {
    if (!state.worker || !state.referenceWorker) return;
    if (state.busy) {
      state.pendingModelReset = true;
      announce("Reset queued for the next model boundary.");
      return;
    }
    state.busy = true;
    setMutationControlsDisabled(true);
    stopPlayback();
    state.seed = Number(ui.seed?.value || 240124);
    setRuntime("Resetting", "busy");
    let operationFailed = false;
    try {
      const hadDraft = state.draftDirty;
      const draftLabel = ui.policyStatus?.textContent || "Unapplied changes";
      const resetPolicy = state.appliedPolicy || policyFromControls();
      const resetReferencePolicy = state.referenceAppliedPolicy || referencePolicyFromControls();
      const zonePolicies = appliedZonePolicyList();
      const activeResetBase = {
        ...resetPolicy,
        housingCapacityMultiplier: presets.reference.housingCapacityMultiplier,
        businessCapacityMultiplier: presets.reference.businessCapacityMultiplier,
        placeQuality: presets.reference.placeQuality,
        policyScopeZoneId: "city",
      };
      const [active, reference] = await Promise.all([
        state.worker.request("configure", {
          patch: { ...enginePolicyPatch(activeResetBase), seed: state.seed, zonePolicies },
          reset: true,
        }),
        state.referenceWorker.request("configure", {
          patch: { ...enginePolicyPatch(resetReferencePolicy), seed: state.seed },
          reset: true,
        }),
      ]);
      state.snapshot = snapshotFrom(active);
      state.referenceSnapshot = snapshotFrom(reference);
      state.appliedPolicy = resetPolicy;
      state.referenceAppliedPolicy = resetReferencePolicy;
      seedAppliedZonePolicies(state.snapshot);
      state.elapsedDays = 0;
      state.history = [];
      state.referenceHistory = [];
      state.interventions = [];
      state.latestDailyStatus = null;
      recordHistory(state.snapshot, state.history, state.appliedPolicy);
      recordHistory(state.referenceSnapshot, state.referenceHistory, state.referenceAppliedPolicy);
      if (hadDraft) markDraftDirty(draftLabel);
      else clearDraftDirty();
      renderAll();
      announce(`Reset to seed ${state.seed} with the currently applied inputs${hadDraft ? "; the unapplied draft was preserved" : ""}.`);
    } catch (error) {
      operationFailed = true;
      clearPendingWork();
      handleError(error);
    } finally {
      state.busy = false;
      if (!operationFailed) {
        restoreMutationControlAvailability();
        setRuntime("Ready", "ready");
        drainPendingWork();
      }
    }
  }

  function bindControls() {
    ui.play?.addEventListener("click", togglePlayback);
    for (const button of $$("[data-udes-v2-step-days]")) {
      button.addEventListener("click", () => advanceDays(Number(button.dataset.udesV2StepDays) || 1));
    }
    $("[data-udes-v2-action='reset']")?.addEventListener("click", resetModel);
    $("[data-udes-v2-action='reset-levers']")?.addEventListener("click", resetDraft);
    ui.applyPolicy?.addEventListener("click", applyDraftPolicy);
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
        input.removeAttribute("aria-valuetext");
        if (!input.hasAttribute("data-udes-v2-assumption")) markCustomScenario();
        const policyField = LEVER_POLICY_FIELDS[input.dataset.udesV2Lever];
        if (policyField) state.draftFields.add(policyField);
        updateLeverOutput(input);
        for (const adjustedLever of enforceCommuteThresholdOrder(input)) {
          const adjustedField = LEVER_POLICY_FIELDS[adjustedLever.dataset.udesV2Lever];
          if (adjustedField) state.draftFields.add(adjustedField);
          updateLeverOutput(adjustedLever);
        }
        markDraftDirty(input.hasAttribute("data-udes-v2-assumption") ? "Unapplied model assumptions" : "Unapplied policy changes");
      });
      updateLeverOutput(input);
    }
    ui.zoneSelect?.addEventListener("change", () => {
      if (ui.zoneSelect.value === "city") selectObject("city", null);
      else selectObject("zone", ui.zoneSelect.value);
    });
    ui.policyScope?.addEventListener("change", () => {
      const targetLabel = policyScopeLabel(ui.policyScope.value);
      const hasTargetedDraft = TARGETED_LAND_USE_FIELDS.some((field) => state.draftFields.has(field));
      state.draftScopeDirty = hasTargetedDraft;
      if (hasTargetedDraft) {
        if (ui.policyStatus) ui.policyStatus.textContent = `Draft land-use values retained · will apply to ${targetLabel}`;
        announce(`Draft land-use values retained and now target ${targetLabel}.`);
        return;
      }
      const loaded = loadAppliedLandUseControls(ui.policyScope.value);
      if (!loaded) showMixedAppliedLandUseControls();
      if (ui.policyStatus) {
        ui.policyStatus.textContent = loaded
          ? `Viewing applied land-use inputs · ${targetLabel}`
          : "Mixed district inputs · changing a land-use lever will apply one value to all districts";
      }
      announce(
        loaded
          ? `Loaded the currently applied land-use inputs for ${targetLabel}.`
          : "The districts have different applied land-use inputs. A new all-district change will overwrite only the lever you edit."
      );
    });
    ui.horizon?.addEventListener("change", () => {
      if (state.busy) {
        ui.horizon.value = String(state.horizonDays);
        announce("Wait for the current model update before changing the horizon.");
        return;
      }
      const requestedHorizon = Math.max(1, Number(ui.horizon.value) || 366);
      if (!canSelectHorizon(state.elapsedDays, requestedHorizon)) {
        ui.horizon.value = String(state.horizonDays);
        announce(`Choose a horizon of at least Day ${state.elapsedDays}, or reset the run first.`);
        return;
      }
      state.horizonDays = requestedHorizon;
      if (ui.progress) ui.progress.max = state.horizonDays;
      renderClock();
      restoreMutationControlAvailability();
    });
    ui.chartWindow?.addEventListener("change", () => {
      state.chartWindowDays = Math.max(0, Number(ui.chartWindow.value) || 0);
      renderChartPanel($("[data-udes-v2-chart-tab][aria-selected='true']")?.dataset.udesV2ChartTab || "outcomes");
    });
    ui.flowKind?.addEventListener("change", () => {
      state.flowKind = ["residential", "job", "enterprise", "commute"].includes(ui.flowKind.value) ? ui.flowKind.value : "residential";
      if (ui.flowWindow) ui.flowWindow.disabled = state.flowKind === "commute";
      renderChartPanel("flows");
    });
    ui.flowWindow?.addEventListener("change", () => {
      state.flowWindowDays = [1, 7, 30].includes(Number(ui.flowWindow.value)) ? Number(ui.flowWindow.value) : 30;
      renderChartPanel("flows");
    });
    ui.seed?.addEventListener("change", resetModel);

    bindTabs("control");
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
    const tabAttr = `data-udes-v2-${kind}-tab`;
    const panelAttr = `data-udes-v2-${kind}-panel`;
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
    const tabSelector = `[data-udes-v2-${kind}-tab]`;
    const panelSelector = `[data-udes-v2-${kind}-panel]`;
    const dataPrefix = `udesV2${kind[0].toUpperCase()}${kind.slice(1)}`;
    const tabKey = `${dataPrefix}Tab`;
    const panelKey = `${dataPrefix}Panel`;
    $$(tabSelector).forEach((tab) => {
      const active = tab.dataset[tabKey] === value;
      tab.setAttribute("aria-selected", String(active));
      tab.tabIndex = active ? 0 : -1;
    });
    $$(panelSelector).forEach((panel) => {
      panel.hidden = panel.dataset[panelKey] !== value;
    });
    if (kind === "chart") {
      if (ui.flowFilter) ui.flowFilter.hidden = value !== "flows";
      renderChartPanel(value);
      requestAnimationFrame(() => resizeCharts());
    } else if (kind === "inspector" && ["citizen", "enterprise", "link"].includes(value) && state.selected.kind !== value) {
      selectSample(value);
    } else if (kind === "inspector" && value === "zone" && !["zone", "city"].includes(state.selected.kind)) {
      const citySelected = ui.zoneSelect?.value === "city";
      const zoneId = citySelected ? null : ui.zoneSelect?.value || state.dataset?.zones?.[0]?.id;
      state.selected = { ...state.selected, kind: citySelected ? "city" : "zone", id: zoneId };
      renderSelection();
      updateMapStyles();
    }
  }

  function handleError(error) {
    console.error(error);
    root.dataset.udesV2State = "error";
    setRuntime("Model error", "error");
    setMutationControlsDisabled(true);
    announce(error?.message || "The model could not be loaded.");
    const placeholder = $("[data-udes-v2-map-placeholder]");
    if (!state.snapshot && placeholder) {
      placeholder.hidden = false;
      placeholder.setAttribute("aria-hidden", "false");
      const message = $("span", placeholder);
      if (message) message.textContent = "Model data is unavailable. Reload the page to retry.";
    }
    if (ui.mapStatus) ui.mapStatus.textContent = "Model unavailable · reload to retry";
  }

  function setMutationControlsDisabled(disabled) {
    $$(MUTATING_CONTROL_SELECTOR).forEach((control) => {
      control.disabled = disabled;
    });
  }

  function mutationControlsUnavailable() {
    return root.dataset.udesV2Mobile === "readonly" || root.dataset.udesV2State === "error" || state.busy || !state.worker || !state.referenceWorker;
  }

  function restoreMutationControlAvailability() {
    const hardDisabled = root.dataset.udesV2Mobile === "readonly" || root.dataset.udesV2State === "error" || !state.worker || !state.referenceWorker;
    const transactionLocked = hardDisabled || state.busy || state.playing;
    setMutationControlsDisabled(transactionLocked);
    if (ui.play) ui.play.disabled = hardDisabled;
    if (!transactionLocked && ui.applyPolicy) {
      ui.applyPolicy.disabled = !state.draftDirty || state.elapsedDays >= state.horizonDays;
    }
  }

  async function init() {
    root.dataset.udesV2State = "loading";
    root.dataset.udesV2Compare = "on";
    setRuntime("Loading geography", "busy");
    bindControls();
    setMutationControlsDisabled(true);
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
        transit: "Bus priority",
        housing: "Housing delivery",
        balanced: "Housing + jobs",
        custom: "Custom scenario",
      }[name] || name
    );
  }

  function policyScopeLabel(scopeZoneId) {
    return !scopeZoneId || scopeZoneId === "city" ? "All districts" : zoneLabel(scopeZoneId);
  }

  function interventionDescriptor(policy, changedFields) {
    const fields = [...changedFields];
    const landUse = TARGETED_LAND_USE_FIELDS.filter((field) => fields.includes(field));
    const network = NETWORK_POLICY_FIELDS.filter((field) => fields.includes(field));
    const assumptions = ASSUMPTION_FIELDS.filter((field) => fields.includes(field));
    const scopes = [];
    if (landUse.length) scopes.push(`${policyScopeLabel(policy.policyScopeZoneId)} land use`);
    if (network.length) scopes.push("network-wide mobility");
    if (assumptions.length) scopes.push("both-run assumptions");
    const scope = scopes.length ? scopes.join(" + ") : "none";
    return {
      fields,
      scope,
      label: `${scenarioLabel(policy.scenario)} · ${scope}`,
    };
  }

  function formatLongDate(date) {
    return new Intl.DateTimeFormat("en-AE", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
      timeZone: "UTC",
    }).format(date);
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

  function simulationStartDate() {
    const supplied = state.dataset?.calibration?.baseDate || state.dataset?.scope?.baseDate || "2024-01-01";
    return parseUtcDate(supplied) || new Date(Date.UTC(2024, 0, 1));
  }

  function completedCalendarMonths(date = modelDate()) {
    return completedCalendarMonthsFrom(simulationStartDate(), date);
  }

  function nextCalendarBoundaryDay(calendarMonths = 1) {
    return nextCalendarBoundaryDayFrom(simulationStartDate(), modelDate(), calendarMonths);
  }

  function horizonEndDay() {
    return state.horizonDays;
  }

  function modelDate(snapshot = state.snapshot) {
    const supplied = textAt(snapshot, ["clock.date", "date", "time.date"], "");
    if (supplied) {
      const parsed = parseUtcDate(supplied);
      if (parsed) return parsed;
    }
    return new Date(simulationStartDate().valueOf() + modelDay(snapshot) * DAY_MS);
  }

  function normalizeCity(snapshot = state.snapshot) {
    const city = cityOf(snapshot);
    const modes = city.modeShares || city.modeShare || city.modes || {};
    const status = city.stateShares || city.statusShare || city.states || city.satisfactionStates || {};
    const financialStatus = city.financialStatusShares || {};
    const enterpriseStatus = city.enterpriseStateShares || city.enterpriseStates || {};
    const events = snapshot?.events || city.dailyEvents || {};
    const assignmentDate = textAt(snapshot, ["networkAssignmentDate", "city.networkAssignmentDate"], textAt(city, ["networkAssignmentDate"], ""));
    const snapshotDate = modelDate(snapshot);
    const assignmentStatus = textAt(
      snapshot,
      ["networkAssignmentStatus"],
      assignmentDate ? (assignmentDate === historyDate(snapshotDate) ? "current" : "retained-last-workday") : "not-assigned"
    );
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
      carOwnership: percentToRatio(valueAt(city, ["carOwnershipRate", "carOwnershipShare", "carOwnership"], 0)),
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
      grossSalary: valueAt(city, ["averageGrossSalaryAed"]),
      housingCost: valueAt(city, ["averageHousingCostAed"]),
      transportCost: valueAt(city, ["averageMonthlyTransportCostAed"]),
      residualAfterEssentials: valueAt(city, ["averageResidualAfterEssentialsAed"]),
      bankBalance: valueAt(city, ["averageBankBalanceAed", "meanBankBalanceAed", "bankBalance"]),
      financialStatus: {
        unemployed: percentToRatio(valueAt(financialStatus, ["unemployed"], 0)),
        fixedCostDeficit: percentToRatio(valueAt(financialStatus, ["fixed-cost-deficit"], 0)),
        essentialsGap: percentToRatio(valueAt(financialStatus, ["essentials-gap"], 0)),
        thinPositiveBuffer: percentToRatio(valueAt(financialStatus, ["thin-positive-buffer"], 0)),
        savingsCapacity: percentToRatio(valueAt(financialStatus, ["savings-capacity"], 0)),
      },
      enterpriseStates: {
        starting: percentToRatio(valueAt(enterpriseStatus, ["Starting", "starting"], 0)),
        working: percentToRatio(valueAt(enterpriseStatus, ["Working", "working"], 0)),
        grow: percentToRatio(valueAt(enterpriseStatus, ["Grow", "grow"], 0)),
        lesser: percentToRatio(valueAt(enterpriseStatus, ["Lesser", "lesser"], 0)),
      },
      activeEnterpriseShare: percentToRatio(valueAt(city, ["activeEnterpriseSharePercent"], 0)),
      lossMakingEnterpriseShare: percentToRatio(valueAt(city, ["lossMakingEnterpriseSharePercent"], 0)),
      enterprisePortfolioMargin: percentToRatio(valueAt(city, ["enterprisePortfolioOperatingMarginPercent"], 0)),
      housingOccupancy: percentToRatio(valueAt(city, ["housingOccupancyRate"], valueAt(city, ["housingOccupancyRatio"], 0) * 100)),
      unemployment: percentToRatio(
        valueAt(city, ["unemploymentRate", "unemployment", "unemployedShare"], Math.max(0, 100 - valueAt(city, ["employmentRate"], 100)))
      ),
      sameZone: percentToRatio(valueAt(city, ["sameZoneWorkShare", "sameZoneShare", "liveWorkSameShare"])),
      carKm: valueAt(city, ["dailyCarKm", "daily.carVehicleKm", "carKilometres", "vehicleKm"]),
      forcedWalkers: valueAt(city, ["forcedInterzoneWalkers", "daily.forcedWalkTrips", "forcedWalkers"]),
      hires: valueAt(events, ["hiresRepresented", "hires"], 0),
      fires: valueAt(events, ["firesRepresented", "fires"], 0),
      moves: valueAt(events, ["residentialMovesRepresented", "residentialMoves"], 0),
      firmMoves: valueAt(events, ["firmMoves"], 0),
      firmRestarts: valueAt(events, ["firmRestarts"], 0),
      flows: snapshot?.flows || { residentialMoves: [], jobMoves: [], enterpriseMoves: [], replacementRelocations: [], totals: {} },
      transitions: snapshot?.transitions || { citizens: [], enterprises: [], totals: {} },
      financialStatusDistribution: city.distributions?.financialStatus || null,
      networkAssignmentDate: assignmentDate,
      networkAssignmentStatus: assignmentStatus,
      isWorkday: Boolean(snapshot?.isWorkday ?? assignmentStatus === "current"),
      zonePolicyState: zonePolicyStateFromSnapshot(snapshot),
      zoneSeries: (Array.isArray(snapshot?.zoneSeries) ? snapshot.zoneSeries : Array.isArray(snapshot?.zones) ? snapshot.zones : [])
        .map((zone) => ({
          id: String(zone.id || zone.zoneId || ""),
          satisfaction: percentToRatio(valueAt(zone, ["satisfaction", "stateShares.Happy", "states.happy"], 0)),
          waiting: percentToRatio(valueAt(zone, ["waitingSharePercent", "stateShares.Waiting"], 0)),
          extreme: percentToRatio(valueAt(zone, ["extremeSharePercent", "stateShares.Extreme"], 0)),
          recovery: percentToRatio(valueAt(zone, ["recoverySharePercent", "stateShares.Recovery"], 0)),
          averageRoundTripMinutes: valueAt(zone, ["averageRoundTripMinutes", "meanCommuteMinutes"], 0),
          housingOccupancy: percentToRatio(valueAt(zone, ["housingOccupancyRate"], valueAt(zone, ["housingOccupancyRatio"], 0) * 100)),
          residentialRentAed: valueAt(zone, ["residentialRentAed"], 0),
          businessRentAed: valueAt(zone, ["businessRentAedPerRepresentedWorker"], 0),
          jobs: valueAt(zone, ["jobs", "representedEmployed"], 0),
          jobCapacity: valueAt(zone, ["jobCapacity"], 0),
          vacancies: valueAt(zone, ["vacancies"], 0),
          population: valueAt(zone, ["population", "representedPopulation"], 0),
          housingCapacity: valueAt(zone, ["housingCapacity", "housingCapacityRepresented"], 0),
          enterprises: valueAt(zone, ["enterprises"], 0),
          enterprisePlaceCapacity: valueAt(zone, ["enterprisePlaceCapacity"], 0),
          employmentRate: percentToRatio(valueAt(zone, ["employmentRate"], 0)),
          carOwnership: percentToRatio(valueAt(zone, ["carOwnershipRate"], 0)),
          carShare: percentToRatio(valueAt(zone, ["carModeSharePercent"], 0)),
          ptShare: percentToRatio(valueAt(zone, ["ptModeSharePercent"], 0)),
          walkShare: percentToRatio(valueAt(zone, ["walkModeSharePercent"], 0)),
          sameZoneWorkShare: percentToRatio(valueAt(zone, ["sameZoneWorkShare"], 0)),
          averageGrossSalaryAed: valueAt(zone, ["averageGrossSalaryAed"], 0),
          averageHousingCostAed: valueAt(zone, ["averageHousingCostAed"], 0),
          averageMonthlyTransportCostAed: valueAt(zone, ["averageMonthlyTransportCostAed"], 0),
          averageCashAfterHousingAndCommuteAed: valueAt(zone, ["averageCashAfterHousingAndCommuteAed"], 0),
          averageResidualAfterEssentialsAed: valueAt(zone, ["averageResidualAfterEssentialsAed"], 0),
          averageBankBalanceAed: valueAt(zone, ["averageBankBalanceAed"], 0),
          financialStatusShares: zone.financialStatusShares || {},
          enterpriseStateShares: zone.enterpriseStateShares || {},
          activeEnterpriseShare: percentToRatio(valueAt(zone, ["activeEnterpriseSharePercent"], 0)),
          lossMakingEnterpriseShare: percentToRatio(valueAt(zone, ["lossMakingEnterpriseSharePercent"], 0)),
          enterprisePortfolioMargin: percentToRatio(valueAt(zone, ["enterprisePortfolioOperatingMarginPercent"], 0)),
          residentialMoveInflows: valueAt(zone, ["residentialMoveInflows"], 0),
          residentialMoveOutflows: valueAt(zone, ["residentialMoveOutflows"], 0),
          residentialMoveNet: valueAt(zone, ["residentialMoveNet"], 0),
          jobMoveInflows: valueAt(zone, ["jobMoveInflows"], 0),
          jobMoveOutflows: valueAt(zone, ["jobMoveOutflows"], 0),
          jobMoveNet: valueAt(zone, ["jobMoveNet"], 0),
          enterpriseMoveInflows: valueAt(zone, ["enterpriseMoveInflows"], 0),
          enterpriseMoveOutflows: valueAt(zone, ["enterpriseMoveOutflows"], 0),
          enterpriseMoveNet: valueAt(zone, ["enterpriseMoveNet"], 0),
          replacementRelocationInflows: valueAt(zone, ["replacementRelocationInflows"], 0),
          replacementRelocationOutflows: valueAt(zone, ["replacementRelocationOutflows"], 0),
          replacementRelocationNet: valueAt(zone, ["replacementRelocationNet"], 0),
        }))
        .filter((zone) => zone.id),
    };
  }

  function percentToRatio(value) {
    return Number.isFinite(Number(value)) ? Number(value) / 100 : 0;
  }

  function recordHistory(snapshot, target, policy) {
    if (!snapshot) return;
    const normalized = normalizeCity(snapshot);
    if (target === state.referenceHistory) {
      normalized.zoneSeries = [];
      normalized.flows = {
        residentialMoves: [],
        jobMoves: [],
        enterpriseMoves: [],
        replacementRelocations: [],
        totals: normalized.flows?.totals || {},
      };
      normalized.transitions = { citizens: [], enterprises: [], totals: normalized.transitions?.totals || {} };
    }
    if (!normalized.zonePolicyState.length && target === state.history) normalized.zonePolicyState = appliedZonePolicyList();
    if (target.some((entry) => entry.day === normalized.day)) return;
    const marker = target === state.history ? state.interventions.find((intervention) => intervention.day === normalized.day) : null;
    const capturedPolicy = policy || state.appliedPolicy || policyFromControls();
    const point = Object.freeze(
      createHistoryPoint(
        {
          ...normalized,
          intervention: marker?.label || "",
          interventionScope: marker?.scope || "",
          interventionFields: (marker?.fields || []).join("|"),
        },
        {
          ...capturedPolicy,
          policyScopeZoneId: historyScopeFromZonePolicies(normalized.zonePolicyState, capturedPolicy.policyScopeZoneId),
        },
        presets.reference
      )
    );
    target.push(point);
    target.sort((a, b) => a.day - b.day);
    if (target.length > HISTORY_POINT_LIMIT) target.splice(0, target.length - HISTORY_POINT_LIMIT);
    if (target === state.history) {
      const detailCutoff = Number(target.at(-1)?.day || 0) - FLOW_HISTORY_DETAIL_DAYS + 1;
      for (let index = 0; index < target.length && Number(target[index].day) < detailCutoff; index += 1) {
        const entry = target[index];
        const hasFlowRows = ["residentialMoves", "jobMoves", "enterpriseMoves", "replacementRelocations"].some((key) => entry.flows?.[key]?.length);
        const hasTransitionRows = entry.transitions?.citizens?.length || entry.transitions?.enterprises?.length;
        if (!hasFlowRows && !hasTransitionRows) continue;
        target[index] = Object.freeze({
          ...entry,
          flows: {
            residentialMoves: [],
            jobMoves: [],
            enterpriseMoves: [],
            replacementRelocations: [],
            totals: entry.flows?.totals || {},
          },
          transitions: { citizens: [], enterprises: [], totals: entry.transitions?.totals || {} },
        });
      }
    }
  }

  function recordDailySeries(series, target, policy) {
    for (const observation of Array.isArray(series) ? series : []) recordHistory(observation, target, policy);
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
    const activeChart = $("[data-udes-v2-chart-tab][aria-selected='true']")?.dataset.udesV2ChartTab || "outcomes";
    renderChartPanel(activeChart);
  }

  function renderClock() {
    const date = modelDate();
    if (ui.date) ui.date.textContent = formatLongDate(date);
    const days = state.elapsedDays;
    for (const option of ui.horizon?.options || []) option.disabled = Number(option.value) < days;
    if (ui.progress) {
      ui.progress.max = Math.max(state.horizonDays, days);
      ui.progress.value = days;
      ui.progress.textContent = `Day ${days} of ${state.horizonDays}`;
    }
    if (ui.progressLabel) ui.progressLabel.textContent = days;
    if (ui.horizonLabel) ui.horizonLabel.textContent = state.horizonDays;
    const dailyStatus = state.latestDailyStatus || normalizeCity(state.snapshot);
    const assignmentDate = parseUtcDate(textAt(dailyStatus, ["networkAssignmentDate", "city.networkAssignmentDate"], ""));
    if (state.map && ui.mapStatus && assignmentDate) {
      const label = new Intl.DateTimeFormat("en-AE", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }).format(assignmentDate);
      const status = textAt(
        dailyStatus,
        ["networkAssignmentStatus"],
        assignmentDate.valueOf() === date.valueOf() ? "current" : "retained-last-workday"
      );
      ui.mapStatus.textContent = `${state.dataset.zones?.length || 0} district groups derived from official AD-SDI · ${
        status === "retained-last-workday" ? `weekend/non-workday view, assignment retained from ${label}` : `network assigned ${label}`
      }`;
    }
  }

  function renderSummary() {
    const active = normalizeCity(state.snapshot);
    const reference = normalizeCity(state.referenceSnapshot);
    setMetric("satisfaction", formatPercent(active.satisfaction || active.happy));
    setMetric("commute", `${active.meanCommute.toFixed(1)} min`);
    setMetric("transitShare", formatPercent(active.ptShare));
    setMetric("housingOccupancy", formatPercent(active.housingOccupancy));
    setDelta("satisfaction", active.satisfaction || active.happy, reference.satisfaction || reference.happy, "percent");
    setDelta("commute", active.meanCommute, reference.meanCommute, "minutes", true);
    setDelta("transitShare", active.ptShare, reference.ptShare, "percent");
    setDelta("housingOccupancy", active.housingOccupancy, reference.housingOccupancy, "percent", true);
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
      jobCapacity: valueAt(zone, ["representedJobCapacity", "jobCapacity", "maxJobsPersons"]),
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
      )} of completed commuters work in their home district; compare scenarios before interpreting a single run.`;
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
      const acceptableCommute = (state.appliedPolicy || policyFromControls()).acceptableCommuteRoundTripMin;
      const access = commuteRangeMessage(zone.commute, acceptableCommute);
      insight.textContent = `${pressure}${access}`;
    }
    renderProvenance(baseline);
    renderInspectorMiniChart(zone);
  }

  function renderProvenance(zone) {
    const node = $("[data-udes-v2-provenance]");
    if (!node) return;
    let html = "";
    if (!zone) {
      html =
        "<span>Field provenance</span><p><strong>Population</strong> SCAD-mapped (12 direct + 6 grouped / relabeled) · <strong>Geography</strong> derived from official AD-SDI · <strong>Jobs and rents</strong> synthetic assumptions</p>";
    } else {
      const classes = zone.sourceClassByField || {};
      html = `<span>Field provenance</span><p><strong>Population</strong> ${escapeHtml(
        classes.population2024 || "synthetic"
      )} · <strong>Geography</strong> derived · <strong>Jobs</strong> ${escapeHtml(
        classes.jobs2024 || "synthetic"
      )} · <strong>Rent</strong> ${escapeHtml(classes.housingRentIndex || "synthetic")}</p>${
        zone.mappingNote ? `<small>${escapeHtml(zone.mappingNote)}</small>` : ""
      }`;
    }
    if (state.panelHtml.get(node) === html) return;
    node.innerHTML = html;
    state.panelHtml.set(node, html);
  }

  function renderInspectorMiniChart(zone) {
    const mount = $("[data-udes-v2-inspector-chart='zone']");
    if (!mount) return;
    const isDistrict = state.selected.kind === "zone";
    const zoneSeries = isDistrict
      ? state.history
          .map((entry) => (entry.zoneSeries || []).find((item) => String(item.id) === String(zone.id))?.satisfaction)
          .filter((value) => Number.isFinite(Number(value)))
      : state.history.map((entry) => entry.satisfaction || 0);
    const values = zoneSeries.length > 1 ? zoneSeries : [zone.satisfaction, zone.satisfaction];
    const width = 300;
    const height = 58;
    const path = linePath(values, width, height, 4, 0, 1);
    const subject = isDistrict ? "District" : "City";
    if (!mount.querySelector("[data-udes-v2-mini-chart-line]")) {
      mount.innerHTML = `<div class="udes-v2-mini-chart-heading"><span data-udes-v2-mini-chart-label></span><strong data-udes-v2-mini-chart-value></strong></div><svg viewBox="0 0 ${width} 72" role="img"><path class="udes-v2-mini-chart__line" data-udes-v2-mini-chart-line></path></svg>`;
    }
    const label = $("[data-udes-v2-mini-chart-label]", mount);
    const value = $("[data-udes-v2-mini-chart-value]", mount);
    const svg = $("svg", mount);
    const line = $("[data-udes-v2-mini-chart-line]", mount);
    if (label) label.textContent = `${subject} daily history`;
    if (value) value.textContent = formatPercent(zone.satisfaction);
    if (svg) svg.setAttribute("aria-label", `${subject} daily satisfaction history`);
    if (line) line.setAttribute("d", path);
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
            mouseover: () => {
              state.hoveredZoneId = id;
              layer.setStyle(zoneStyle(feature));
            },
            mouseout: () => {
              if (String(state.hoveredZoneId) === String(id)) state.hoveredZoneId = null;
              updateMapStyles();
            },
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
    if (ui.mapStatus)
      ui.mapStatus.textContent = `${state.dataset.zones?.length || 0} district groups derived from official AD-SDI · transparent agent baseline`;
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
    if (state.mapMode === "access") return -zone.commute;
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
    const id = zoneFeatureId(feature);
    const selected = String(id) === String(state.selected.id);
    const hovered = String(id) === String(state.hoveredZoneId);
    return {
      color: selected ? palette.ink : "#65736f",
      weight: selected ? 2.6 : hovered ? 2.2 : 1.1,
      opacity: 0.9,
      fillColor: state.mapMode === "rent" ? mixColor("#f4ead4", "#a9673f", ratio) : mixColor("#e9f0ed", "#277565", ratio),
      fillOpacity: hovered ? 0.64 : state.mapMode === "network" ? 0.16 : 0.54,
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
        access: ["Shorter mean commute", "Longer", "Middle", "Shorter"],
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
      renderChartPanel($("[data-udes-v2-chart-tab][aria-selected='true']")?.dataset.udesV2ChartTab || "outcomes");
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
    const requestToken = ++state.inspectionRequestToken;
    const isCurrentSelection = () =>
      requestToken === state.inspectionRequestToken && state.selected.kind === kind && String(state.selected.id) === String(id);
    if (panel) panel.setAttribute("aria-busy", "true");
    try {
      const reply = await state.worker.request("inspect", { kind, id, historyLimit: 36 });
      if (!isCurrentSelection()) return;
      const inspection = reply && ("value" in reply || "inspection" in reply) ? reply.value ?? reply.inspection : reply?.agent || reply;
      renderInspection(kind, inspection, fallback);
    } catch (_error) {
      if (!isCurrentSelection()) return;
      renderInspection(kind, fallback || (kind === "link" ? roadSnapshot(id) : null));
    } finally {
      if (requestToken === state.inspectionRequestToken) panel?.removeAttribute("aria-busy");
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

  function statechart(states, active, note) {
    return `<div class="udes-v2-statechart" aria-label="Agent states; ${escapeHtml(active)} is active">${states
      .map((name) => `<span class="${String(name).toLowerCase() === String(active).toLowerCase() ? "is-active" : ""}">${escapeHtml(name)}</span>`)
      .join("")}<p class="udes-v2-statechart__branch-note">${escapeHtml(note)}</p></div>`;
  }

  function metricRows(rows) {
    return `<dl class="udes-v2-agent-metrics">${rows
      .map(([label, value]) => `<div><dt>${escapeHtml(label)}</dt><dd>${escapeHtml(value)}</dd></div>`)
      .join("")}</dl>`;
  }

  function agentNavigation(kind, item) {
    const samples = kind === "link" ? linksOf() : samplesOf(kind);
    const id = item.id || item[`${kind}Id`] || state.selected.id || "";
    const disabled = samples.length < 2 ? " disabled" : "";
    return `<div class="udes-v2-agent-nav"><button type="button" data-udes-v2-agent-nav="previous"${disabled}>Previous tracked</button><form data-udes-v2-agent-search><label class="udes-v2-sr-only" for="udes-v2-${escapeHtml(
      kind
    )}-id">Inspect ${escapeHtml(kind)} ID</label><input id="udes-v2-${escapeHtml(kind)}-id" name="agent-id" value="${escapeHtml(
      id
    )}" autocomplete="off" spellcheck="false"><button type="submit">Inspect</button></form><button type="button" data-udes-v2-agent-nav="next"${disabled}>Next tracked</button></div>`;
  }

  function humanizeEvent(value) {
    return String(value || "event")
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .replace(/[-_]+/g, " ")
      .replace(/^./, (letter) => letter.toUpperCase());
  }

  function eventDescription(event = {}) {
    const type = humanizeEvent(event.type || event.action || event.event || "model action");
    const reason = event.reason ? ` · ${humanizeEvent(event.reason)}` : "";
    const from = event.fromZoneId || event.fromWorkZoneId || event.previousZoneId || event.from;
    const to = event.toZoneId || event.toWorkZoneId || event.zoneId || event.to;
    const route = from && to && String(from) !== String(to) ? ` · ${zoneLabel(from)} → ${zoneLabel(to)}` : "";
    return `${type}${reason}${route}`;
  }

  function agentEvents(events) {
    const recent = Array.isArray(events) ? events.slice(-5).reverse() : [];
    if (!recent.length) {
      return '<section class="udes-v2-agent-events"><span>Recent actions</span><p>No completed action is recorded in this agent’s retained history.</p></section>';
    }
    return `<section class="udes-v2-agent-events"><span>Recent actions</span><ol>${recent
      .map((event) => {
        const date = textAt(event, ["date"], Number.isFinite(Number(event.day)) ? `Day ${Number(event.day)}` : "—");
        return `<li><time>${escapeHtml(date)}</time><span>${escapeHtml(eventDescription(event))}</span></li>`;
      })
      .join("")}</ol></section>`;
  }

  function decisionSummary(kind, item) {
    const explanation = item?.decisionExplanation || {};
    const current = explanation.currentAssessment || {};
    const next = explanation.nextScheduledReview || explanation.nextScheduledDecision;
    const last = explanation.lastAction;
    const goal =
      explanation.primaryGoal ||
      (kind === "citizen" ? "Balance housing, work access, and household finances." : "Keep the enterprise viable and staffed.");
    let condition = textAt(current, ["financialStatusLabel", "state"], textAt(item, ["state", "status"], "—"));
    let guard = "No severe guard is active";
    let assessment = "Rules are evaluated daily";
    if (kind === "citizen") {
      if (current.severeFinancial && current.severeCommute) guard = "Severe finance + commute guard";
      else if (current.severeFinancial) guard = "Severe financial guard";
      else if (current.severeCommute) guard = "Severe commute guard";
      else if (current.normal === false) guard = "Dissatisfaction guard";
      assessment = `${
        valueAt(item, ["cashAfterHousingAndCommuteAed", "netIncomeAed"], 0) >= valueAt(current, ["waitingCashThresholdAed"], 0) ? "Above" : "Below"
      } AED ${formatNumber(valueAt(current, ["waitingCashThresholdAed"], 0))} cash buffer · ${valueAt(item, ["roundTripMinutes"], 0).toFixed(
        1
      )} / ${valueAt(current, ["acceptableRoundTripMinutes"], 0).toFixed(0)} min commute`;
    } else {
      condition = `${textAt(current, ["state"], textAt(item, ["state"], "—"))} · ${valueAt(current, ["operatingMarginPercent"], 0).toFixed(
        1
      )}% margin`;
      const gap = valueAt(current, ["marginGapPercentagePoints"], 0);
      guard = `${gap >= 0 ? "+" : ""}${gap.toFixed(1)} pp to target`;
      assessment = `${valueAt(current, ["vacancyFillRatePercent"], 0).toFixed(0)}% vacancy fill · demand ${valueAt(
        current,
        ["demandIndex"],
        0
      ).toFixed(2)} · access ${valueAt(current, ["laborAccessScore"], 0).toFixed(2)}`;
    }
    const nextText = next
      ? `${humanizeEvent(next.purpose)} in ${formatNumber(next.daysFromNow)} day${Number(next.daysFromNow) === 1 ? "" : "s"} · ${next.date}`
      : "Re-evaluated by the daily rule set";
    const lastText = last ? eventDescription(last) : "No completed action retained";
    return `<section class="udes-v2-decision-summary"><span>What this agent is trying to do</span><strong>${escapeHtml(goal)}</strong><p>${escapeHtml(
      explanation.decisionModel || "Rule-based statechart"
    )}</p></section><dl class="udes-v2-decision-grid"><div><dt>Current assessment</dt><dd>${escapeHtml(
      condition
    )}</dd></div><div><dt>Active guard</dt><dd>${escapeHtml(guard)}</dd></div><div><dt>Evidence used now</dt><dd title="${escapeHtml(
      assessment
    )}">${escapeHtml(assessment)}</dd></div><div><dt>Next decision</dt><dd title="${escapeHtml(nextText)}">${escapeHtml(
      nextText
    )}</dd></div><div><dt>Last completed action</dt><dd title="${escapeHtml(lastText)}">${escapeHtml(
      lastText
    )}</dd></div><div><dt>Days in dissatisfaction</dt><dd>${
      kind === "citizen" ? formatNumber(valueAt(current, ["daysDissatisfied"], 0)) : "Not applicable"
    }</dd></div></dl>`;
  }

  function citizenAccounting(item) {
    const account = item.financialAccount || {};
    const gross = valueAt(account, ["grossSalaryAed"], valueAt(item, ["salaryAed"], 0));
    const housing = valueAt(account, ["housingCostAed"], valueAt(item, ["residentialRentAed"], 0));
    const commute = valueAt(account, ["commutingCostAed"], valueAt(item, ["monthlyTransportCostAed"], 0));
    const fixedCash = valueAt(account, ["cashAfterHousingAndCommuteAed"], gross - housing - commute);
    const essentials = valueAt(account, ["essentialConsumptionAed"], 0);
    const residual = valueAt(account, ["residualAfterEssentialsAed"], fixedCash - essentials);
    const bankChange = valueAt(account, ["modeledBankChangeAtMonthEndAed"], valueAt(item, ["lastMonthlyBankBalanceDeltaAed"], 0));
    const row = (label, value, total = false, negative = false) =>
      `<div class="udes-v2-accounting-row${total ? " is-total" : ""}"${negative ? ' data-direction="negative"' : ""}><span>${escapeHtml(
        label
      )}</span><strong>${escapeHtml(formatAed(value))}</strong></div>`;
    return `<section class="udes-v2-accounting"><span>Last monthly household account · ${escapeHtml(
      textAt(account, ["accountingDate"], "current model month")
    )}</span>${row("Gross salary", gross)}${row("− Housing", -housing, false, true)}${row("− Commute", -commute, false, true)}${row(
      "Cash after housing + commute",
      fixedCash,
      true,
      fixedCash < 0
    )}${row("− Essentials", -essentials, false, true)}${row("Residual after essentials", residual, true, residual < 0)}${row(
      "Modeled saving / drawdown",
      bankChange,
      false,
      bankChange < 0
    )}</section>`;
  }

  function panelIsInteracting(panel) {
    return panel.matches(":hover") || panel.contains(document.activeElement);
  }

  function commitPanelRender(panel, render) {
    if (!render || state.panelHtml.get(panel) === render.html) return;
    const scrollContainer = panel.closest(".udes-v2-inspector__body");
    const previousScrollTop = scrollContainer?.scrollTop || 0;
    panel.innerHTML = render.html;
    panel.dataset.udesV2SelectionKey = render.selectionKey;
    state.panelHtml.set(panel, render.html);
    render.bind?.();
    if (scrollContainer) scrollContainer.scrollTop = previousScrollTop;
  }

  function flushPendingPanelRender(panel) {
    if (panelIsInteracting(panel)) return;
    const pending = state.pendingPanelRenders.get(panel);
    if (!pending) return;
    state.pendingPanelRenders.delete(panel);
    commitPanelRender(panel, pending);
  }

  function renderStablePanel(panel, selectionKey, html, bind) {
    if (!panel) return;
    if (panel.dataset.udesV2InteractionBound !== "true") {
      panel.dataset.udesV2InteractionBound = "true";
      panel.addEventListener("pointerleave", () => flushPendingPanelRender(panel));
      panel.addEventListener("focusout", () => requestAnimationFrame(() => flushPendingPanelRender(panel)));
    }
    if (state.panelHtml.get(panel) === html) return;
    const render = { selectionKey, html, bind };
    const selectionChanged = panel.dataset.udesV2SelectionKey !== selectionKey;
    if (!selectionChanged && panelIsInteracting(panel)) {
      state.pendingPanelRenders.set(panel, render);
      return;
    }
    state.pendingPanelRenders.delete(panel);
    commitPanelRender(panel, render);
  }

  function renderInspection(kind, inspection, fallback = {}) {
    if ((!inspection || typeof inspection !== "object") && (!fallback || !Object.keys(fallback).length)) {
      renderEmptyInspection(kind, `No ${kind} matched ${state.selected.id}. Enter a valid model ID and try again.`);
      return;
    }
    const item = inspection && typeof inspection === "object" ? inspection : fallback || {};
    const panel = $(`[data-udes-v2-inspector-panel='${kind}']`);
    if (!panel) return;
    const id = item.id || item[`${kind}Id`] || state.selected.id || "sample";
    let html = "";
    if (ui.selectionName)
      ui.selectionName.textContent =
        kind === "enterprise" ? `Enterprise ${id}` : kind === "citizen" ? `Citizen ${id}` : textAt(item, ["name", "roadName"], `Network link ${id}`);
    if (ui.selectionId) ui.selectionId.textContent = `${kind.toUpperCase()} ${id}`;
    if (kind === "citizen") {
      const status = textAt(item, ["status", "state"], "Happy");
      const netIncome = valueAt(item, ["netIncomeAed", "netIncomeMonthly", "netIncome"]);
      const roundTrip = valueAt(item, ["roundTripMinutes", "commuteMinutes"]);
      const appliedPolicy = state.appliedPolicy || policyFromControls();
      html = `${agentNavigation(kind, item)}${decisionSummary(kind, item)}${statechart(
        ["Happy", "Waiting", "Extreme", "Recovery"],
        status,
        "Daily branching statechart: financial and commute guards can trigger dissatisfaction; successful moves, job changes, or recovery can return the citizen to Happy."
      )}${citizenAccounting(item)}${metricRows([
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
        ["Financial status", textAt(item, ["financialStatusLabel"], "Not classified")],
        ["Cash after housing + commute", formatAed(netIncome)],
        ["Cash-buffer margin", formatAed(netIncome - appliedPolicy.waitingNetIncomeAed)],
        ["Modeled savings stock", formatAed(valueAt(item, ["bankBalanceAed", "bankBalance", "savings"]))],
        ["Last monthly saving / drawdown", formatAed(valueAt(item, ["lastMonthlyBankBalanceDeltaAed"]))],
        ["Round trip", `${roundTrip.toFixed(1)} min`],
        ["Commute goal margin", `${(appliedPolicy.acceptableCommuteRoundTripMin - roundTrip).toFixed(1)} min`],
      ])}${historyBars(
        item.history || item.histories,
        "Monthly cash-after-fixed-cost history",
        ["netIncomeAed", "netIncome"],
        "AED/month"
      )}${agentEvents(item.events)}`;
    } else if (kind === "enterprise") {
      const status = textAt(item, ["status", "state"], "Working");
      const representedEmployees = valueAt(item, ["representedEmployees", "employeeCount", "employees", "staff"]);
      const representedJobCapacity = valueAt(item, ["representedJobCapacity", "maxJobsPersons", "jobCapacity", "maxJobs"]);
      const representedVacancies = valueAt(
        item,
        ["representedVacancies"],
        item.hiring === false ? 0 : Math.max(0, representedJobCapacity - representedEmployees)
      );
      html = `${agentNavigation(kind, item)}${decisionSummary(kind, item)}${statechart(
        ["Starting", "Working", "Grow", "Lesser"],
        status,
        "Scheduled branching statechart: margin, demand, vacancy fill, and labor access adjust the hazards for Grow and Lesser; actions can hire, fire, move, or restart."
      )}${metricRows([
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
      ])}${historyBars(
        item.history || item.histories,
        "Employee-agent count history",
        ["employeeCount", "employees"],
        "employee agents"
      )}${agentEvents(item.events)}`;
    } else {
      const current = item.current && typeof item.current === "object" ? { ...item, ...item.current } : item;
      const load = linkLoad(current);
      html = `${agentNavigation(kind, item)}${metricRows([
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
      ])}${historyBars(item.history || item.histories, "Maximum load / capacity history", ["volumeCapacityRatio", "loadRatio"], "ratio")}`;
    }
    renderStablePanel(panel, `${kind}:${id}`, html, () => bindAgentNavigation(panel, kind));
  }

  function renderEmptyInspection(kind, message) {
    const panel = $(`[data-udes-v2-inspector-panel='${kind}']`);
    if (!panel) return;
    const navigation = ["citizen", "enterprise", "link"].includes(kind) ? agentNavigation(kind, { id: state.selected.id }) : "";
    const html = `${navigation}<div class="udes-v2-empty-state"><strong>No ${escapeHtml(kind)} selected</strong><p>${escapeHtml(message)}</p></div>`;
    renderStablePanel(panel, `${kind}:${state.selected.id || "empty"}`, html, navigation ? () => bindAgentNavigation(panel, kind) : null);
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
    $("[data-udes-v2-agent-search]", panel)?.addEventListener("submit", (event) => {
      event.preventDefault();
      const id = String(new FormData(event.currentTarget).get("agent-id") || "").trim();
      if (id) selectObject(kind, id);
    });
  }

  function historyBars(history, label, keys, unit) {
    const values = Array.isArray(history) ? history.slice(-24).map((entry) => valueAt(entry, keys, 0)) : [];
    if (!values.length)
      return `<div class="udes-v2-agent-history"><span>${escapeHtml(label)}</span><p>Agent finance history is recorded at month close.</p></div>`;
    const maximum = Math.max(...values.map(Math.abs), 1);
    const signed = values.some((value) => value < 0);
    const accessibleValues = values.map((value) => `${Number(value).toFixed(1)} ${unit}`).join(", ");
    return `<div class="udes-v2-agent-history"><span>${escapeHtml(label)}</span><div class="${
      signed ? "is-signed" : ""
    }" role="img" aria-label="${escapeHtml(`${label}, oldest to newest: ${accessibleValues}`)}">${values
      .map(
        (value) =>
          `<i aria-hidden="true" data-direction="${value < 0 ? "negative" : value > 0 ? "positive" : "zero"}" style="--value:${Math.max(
            signed ? 0.025 : 0.08,
            Math.abs(value) / maximum
          )}"></i>`
      )
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

  function chartSource({ workdaysOnly = false } = {}) {
    const fullHistory = state.history.length ? state.history : [normalizeCity()];
    const latestDay = fullHistory.at(-1)?.day || 0;
    const history = filterHistoryWindow(fullHistory, state.chartWindowDays, latestDay).filter(
      (entry) => !workdaysOnly || entry.isWorkday || entry.networkAssignmentStatus === "current"
    );
    const referenceByDay = new Map(
      filterHistoryWindow(
        state.referenceHistory.length ? state.referenceHistory : [normalizeCity(state.referenceSnapshot)],
        state.chartWindowDays,
        latestDay
      ).map((entry) => [entry.day, entry])
    );
    const reference = history.map((entry) => referenceByDay.get(entry.day) || null);
    const labels = history.map((entry) => formatChartDayUtc(entry.date));
    return { history, reference, labels };
  }

  function baseChartOptions() {
    return {
      animationDuration: 280,
      animationDurationUpdate: 0,
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

  function addInterventionMarkers(option, history, labels) {
    if (!option?.series?.length || !history.length || !labels.length) return;
    const firstDay = Number(history[0].day);
    const lastDay = Number(history.at(-1).day);
    const data = state.interventions
      .filter((intervention) => intervention.day >= firstDay && intervention.day <= lastDay)
      .map((intervention) => {
        const index = history.findIndex((entry) => Number(entry.day) >= intervention.day);
        if (index < 0) return null;
        const interventionDate = parseUtcDate(intervention.date);
        const shortLabel = `${scenarioLabel(intervention.scenario)} · ${
          interventionDate ? formatChartDayUtc(interventionDate) : `Day ${intervention.day}`
        }`;
        return {
          name: shortLabel,
          xAxis: labels[index],
          fullLabel: intervention.label,
        };
      })
      .filter(Boolean);
    if (!data.length) return;
    option.series[0].markLine = {
      silent: true,
      symbol: "none",
      lineStyle: { color: palette.red, type: "dashed", width: 1 },
      label: {
        show: true,
        position: "insideEndTop",
        color: palette.red,
        fontSize: 8,
        formatter: (params) => params.name,
      },
      data,
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

  function chartDataSignature(option) {
    return JSON.stringify({
      xAxis: option.xAxis,
      yAxis: option.yAxis,
      legend: option.legend,
      series: (option.series || []).map((series) => ({
        name: series.name,
        type: series.type,
        stack: series.stack,
        yAxisIndex: series.yAxisIndex,
        data: series.data,
        markLine: series.markLine?.data,
      })),
    });
  }

  function applyChartOption(chart, key, option) {
    if (!chart || chart.isDisposed?.()) return;
    const signature = chartDataSignature(option);
    if (state.chartDataSignatures.get(key) === signature) return;
    const firstRender = !state.chartDataSignatures.has(key);
    chart.setOption(
      option,
      firstRender ? { notMerge: true, lazyUpdate: true } : { notMerge: false, lazyUpdate: true, silent: true, replaceMerge: ["series"] }
    );
    state.chartDataSignatures.set(key, signature);
  }

  function bindChartInteraction(node, key, chart) {
    if (node.dataset.udesV2InteractionBound === "true") return;
    node.dataset.udesV2InteractionBound = "true";
    node.addEventListener("pointerenter", () => state.chartInteractionLocks.add(key));
    node.addEventListener("pointerleave", () => {
      state.chartInteractionLocks.delete(key);
      const pending = state.pendingChartOptions.get(key);
      if (!pending) return;
      state.pendingChartOptions.delete(key);
      requestAnimationFrame(() => applyChartOption(chart, key, pending));
    });
  }

  function mountChart(node, key, option) {
    if (!node) return;
    (option.series || []).forEach((series, index) => {
      if (!series.id)
        series.id = `${key}:${String(series.name || index)
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")}`;
    });
    node.setAttribute("aria-label", summarizeChart(node.dataset.udesV2ChartTitle || key, option));
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
    bindChartInteraction(node, key, chart);
    if (state.chartInteractionLocks.has(key)) {
      state.pendingChartOptions.set(key, option);
      return;
    }
    applyChartOption(chart, key, option);
  }

  function prepareChartPanel(kind, definitions) {
    const mount = $(`[data-udes-v2-chart='${kind}']`);
    if (!mount) return [];
    const signature = definitions.map((definition) => definition.join("::")).join("|");
    if (mount.dataset.renderedSignature !== signature) {
      for (const [key, chart] of state.charts.entries()) {
        if (key.startsWith(`${kind}:`)) {
          chart.dispose?.();
          state.charts.delete(key);
          state.chartInteractionLocks.delete(key);
          state.pendingChartOptions.delete(key);
          state.chartDataSignatures.delete(key);
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
    if (kind === "outcomes") renderOutcomeCharts();
    else if (kind === "districts") renderDistrictCharts();
    else if (kind === "flows") renderFlowCharts();
    else if (kind === "mobility") renderMobilityCharts();
    else if (kind === "citizens") renderCitizenCharts();
    else if (kind === "enterprises") renderEnterpriseCharts();
  }

  function renderOutcomeCharts() {
    const [satisfactionNode, commuteNode] = prepareChartPanel("outcomes", [
      ["satisfaction", "Resident satisfaction", "Daily weighted share · active and same-seed reference"],
      ["commute", "Mean round-trip commute", "Completed workdays only · minutes"],
    ]);
    const { history, reference, labels } = chartSource();
    const workdaySource = chartSource({ workdaysOnly: true });

    const satisfaction = baseChartOptions();
    satisfaction.xAxis.data = labels;
    satisfaction.yAxis = { ...satisfaction.yAxis, min: 0, max: 100, axisLabel: { ...satisfaction.yAxis.axisLabel, formatter: "{value}%" } };
    satisfaction.series = [
      {
        name: "Active",
        type: "line",
        showSymbol: false,
        smooth: 0.18,
        data: history.map((entry) => entry.satisfaction * 100),
        lineStyle: { width: 2.3, color: palette.green },
        itemStyle: { color: palette.green },
      },
      state.compare
        ? {
            name: "Reference",
            type: "line",
            showSymbol: false,
            data: reference.map((entry) => (entry ? entry.satisfaction * 100 : null)),
            lineStyle: { width: 1.5, type: "dashed", color: palette.muted },
            itemStyle: { color: palette.muted },
          }
        : null,
    ].filter(Boolean);
    addInterventionMarkers(satisfaction, history, labels);
    mountChart(satisfactionNode, "outcomes:satisfaction", satisfaction);

    const commute = baseChartOptions();
    commute.xAxis.data = workdaySource.labels;
    commute.yAxis = { ...commute.yAxis, name: "minutes", nameTextStyle: { color: palette.muted, fontSize: 9 } };
    commute.series = [
      {
        name: "Active",
        type: "line",
        showSymbol: false,
        smooth: 0.18,
        data: workdaySource.history.map((entry) => entry.meanCommute),
        lineStyle: { width: 2.3, color: palette.green },
        itemStyle: { color: palette.green },
      },
      state.compare
        ? {
            name: "Reference",
            type: "line",
            showSymbol: false,
            data: workdaySource.reference.map((entry) => (entry ? entry.meanCommute : null)),
            lineStyle: { width: 1.5, type: "dashed", color: palette.muted },
            itemStyle: { color: palette.muted },
          }
        : null,
    ].filter(Boolean);
    addInterventionMarkers(commute, workdaySource.history, workdaySource.labels);
    mountChart(commuteNode, "outcomes:commute", commute);
  }

  function selectedDistrictId() {
    if (state.selected.kind === "zone" && state.selected.id) return String(state.selected.id);
    if (ui.zoneSelect?.value && ui.zoneSelect.value !== "city") return String(ui.zoneSelect.value);
    return null;
  }

  function districtHistory(zoneId) {
    if (!zoneId) return [];
    return chartSource()
      .history.map((entry) => {
        const zone = (entry.zoneSeries || []).find((candidate) => String(candidate.id) === String(zoneId));
        return zone ? { ...zone, day: entry.day, date: entry.date } : null;
      })
      .filter(Boolean);
  }

  function renderDistrictCharts() {
    const selectedId = selectedDistrictId();
    const selectedName = selectedId ? zoneLabel(selectedId) : null;
    const [stocksNode, districtNode] = prepareChartPanel("districts", [
      ["stocks", "Residents and located jobs by district", "Current day · all modeled Abu Dhabi City districts"],
      [
        "selected",
        selectedName ? `${selectedName}: daily district trajectory` : "Choose a district for its daily trajectory",
        selectedName ? "Population and jobs daily · housing rent changes annually" : "Use Inspect district in Setup or click a district on the map",
      ],
    ]);
    const zones = normalizeCity(state.snapshot)
      .zoneSeries.map((zone) => ({ ...zone, name: zoneLabel(zone.id) }))
      .sort((a, b) => a.population - b.population || a.name.localeCompare(b.name));
    const labels = zones.map((zone) => zone.name);
    const stocks = baseChartOptions();
    stocks.grid = { top: 22, left: 112, right: 18, bottom: 20 };
    stocks.xAxis = { ...stocks.xAxis, type: "value", axisLabel: { ...stocks.xAxis.axisLabel, formatter: (value) => formatCompact(value) } };
    stocks.yAxis = {
      ...stocks.yAxis,
      type: "category",
      data: labels,
      axisLabel: { ...stocks.yAxis.axisLabel, width: 102, overflow: "truncate", interval: 0 },
    };
    stocks.series = [
      { name: "Residents", type: "bar", data: zones.map((zone) => zone.population), barMaxWidth: 7, itemStyle: { color: palette.green } },
      { name: "Located jobs", type: "bar", data: zones.map((zone) => zone.jobs), barMaxWidth: 7, itemStyle: { color: palette.blue } },
    ];
    mountChart(stocksNode, "districts:stocks", stocks);

    const history = districtHistory(selectedId);
    const district = baseChartOptions();
    district.grid = { ...district.grid, right: 54 };
    district.xAxis.data = history.map((entry) => formatChartDayUtc(entry.date));
    district.yAxis = [
      {
        ...district.yAxis,
        name: "people / jobs",
        nameTextStyle: { color: palette.muted, fontSize: 9 },
        axisLabel: { ...district.yAxis.axisLabel, formatter: (value) => formatCompact(value) },
      },
      {
        ...district.yAxis,
        position: "right",
        name: "AED/month",
        nameTextStyle: { color: palette.muted, fontSize: 9 },
        axisLabel: { ...district.yAxis.axisLabel, formatter: (value) => formatCompact(value) },
        splitLine: { show: false },
      },
    ];
    district.series = [
      {
        name: "Population",
        type: "line",
        showSymbol: false,
        data: history.map((entry) => entry.population),
        lineStyle: { width: 2.2, color: palette.green },
        itemStyle: { color: palette.green },
      },
      {
        name: "Located jobs",
        type: "line",
        showSymbol: false,
        data: history.map((entry) => entry.jobs),
        lineStyle: { width: 2, color: palette.blue },
        itemStyle: { color: palette.blue },
      },
      {
        name: "Housing rent",
        type: "line",
        yAxisIndex: 1,
        showSymbol: false,
        step: "end",
        data: history.map((entry) => entry.residentialRentAed),
        lineStyle: { width: 1.7, color: palette.amber },
        itemStyle: { color: palette.amber },
      },
    ];
    addInterventionMarkers(district, history, district.xAxis.data);
    mountChart(districtNode, "districts:selected", district);
  }

  function renderFlowCharts() {
    const latestDay = state.history.at(-1)?.day || 0;
    const kind = state.flowKind;
    const commuteStock = kind === "commute";
    const definition = flowDefinition(kind);
    const kindLabel = {
      residential: "Residential moves",
      job: "Workplace changes",
      enterprise: "Enterprise relocations",
      commute: "Home-to-work relationships",
    }[kind];
    const selectedId = selectedDistrictId();
    const selectedName = selectedId ? zoneLabel(selectedId) : null;
    const [routesNode, districtNode] = prepareChartPanel("flows", [
      [
        "routes",
        `Top cross-district ${kindLabel.toLowerCase()}`,
        commuteStock
          ? "Current resident stock · home → work · employed residents"
          : `${state.flowWindowDays}-day sum · ${definition.unit} · origin → destination${kind === "residential" ? " · replacements labeled" : ""}`,
      ],
      [
        "district",
        commuteStock
          ? selectedName
            ? `${selectedName}: residents’ work destinations`
            : "Where residents work today"
          : selectedName
            ? `${selectedName}: incoming, outgoing, and net`
            : `${kindLabel} by decision reason`,
        commuteStock
          ? selectedName
            ? "Current stock · includes same-district work and unemployment"
            : "Citywide same-district, cross-district, and unemployment split"
          : selectedName
            ? `Exact daily OD flows · ${definition.unit}${kind === "residential" ? " · replacements included" : ""}`
            : `${state.flowWindowDays}-day citywide totals · choose a district for its daily balance`,
      ],
    ]);
    const commuteOd = Array.isArray(state.snapshot?.commuteOd) ? state.snapshot.commuteOd : [];
    const routes = (
      commuteStock
        ? commuteOd
            .filter((row) => row.workZoneId && String(row.homeZoneId) !== String(row.workZoneId))
            .map((row) => ({ fromZoneId: row.homeZoneId, toZoneId: row.workZoneId, value: Number(row.representedWorkers) || 0, reasons: {} }))
            .sort((a, b) => b.value - a.value)
        : aggregateFlowRoutes(state.history, kind, state.flowWindowDays, latestDay)
    )
      .slice(0, 12)
      .reverse();
    const routeChart = baseChartOptions();
    routeChart.grid = { top: 22, left: 142, right: 20, bottom: 20 };
    routeChart.xAxis = {
      ...routeChart.xAxis,
      type: "value",
      axisLabel: { ...routeChart.xAxis.axisLabel, formatter: (value) => formatCompact(value) },
    };
    routeChart.yAxis = {
      ...routeChart.yAxis,
      type: "category",
      data: routes.length
        ? routes.map((route) => `${zoneLabel(route.fromZoneId)} → ${zoneLabel(route.toZoneId)}`)
        : ["No cross-district changes yet"],
      axisLabel: { ...routeChart.yAxis.axisLabel, width: 132, overflow: "truncate", interval: 0 },
    };
    routeChart.series = [
      {
        name: kindLabel,
        type: "bar",
        data: routes.length ? routes.map((route) => route.value) : [0],
        barMaxWidth: 10,
        itemStyle: { color: kind === "enterprise" ? palette.amber : kind === "job" || commuteStock ? palette.blue : palette.green },
      },
    ];
    mountChart(routesNode, "flows:routes", routeChart);

    const districtChart = baseChartOptions();
    if (commuteStock) {
      const groups = new Map();
      const relevant = selectedId ? commuteOd.filter((row) => String(row.homeZoneId) === selectedId) : commuteOd;
      if (selectedId) {
        for (const row of relevant) {
          const label = row.workZoneId ? zoneLabel(row.workZoneId) : "Unemployed";
          groups.set(label, (groups.get(label) || 0) + (Number(row.representedResidents) || 0));
        }
      } else {
        for (const row of relevant) {
          const label = !row.workZoneId
            ? "Unemployed"
            : String(row.homeZoneId) === String(row.workZoneId)
              ? "Works in home district"
              : "Works in another district";
          groups.set(label, (groups.get(label) || 0) + (Number(row.representedResidents) || 0));
        }
      }
      const workDestinations = [...groups.entries()].sort((a, b) => a[1] - b[1]);
      districtChart.grid = { top: 22, left: 124, right: 20, bottom: 20 };
      districtChart.xAxis = {
        ...districtChart.xAxis,
        type: "value",
        axisLabel: { ...districtChart.xAxis.axisLabel, formatter: (value) => formatCompact(value) },
      };
      districtChart.yAxis = {
        ...districtChart.yAxis,
        type: "category",
        data: workDestinations.length ? workDestinations.map(([label]) => label) : ["No commute stock available"],
        axisLabel: { ...districtChart.yAxis.axisLabel, width: 114, overflow: "truncate", interval: 0 },
      };
      districtChart.series = [
        {
          name: "Residents",
          type: "bar",
          data: workDestinations.length ? workDestinations.map(([, value]) => value) : [0],
          barMaxWidth: 11,
          itemStyle: { color: palette.blue },
        },
      ];
    } else if (selectedId) {
      const points = flowSeriesForZone(state.history, kind, selectedId, state.flowWindowDays, latestDay);
      districtChart.xAxis.data = points.map((point) => formatChartDayUtc(point.date));
      districtChart.yAxis.axisLabel = { ...districtChart.yAxis.axisLabel, formatter: (value) => formatCompact(value) };
      districtChart.series = [
        { name: "In", type: "bar", data: points.map((point) => point.inflow), itemStyle: { color: palette.greenSoft } },
        { name: "Out", type: "bar", data: points.map((point) => -point.outflow), itemStyle: { color: palette.sand } },
        {
          name: "Net",
          type: "line",
          showSymbol: false,
          data: points.map((point) => point.net),
          lineStyle: { width: 2.2, color: palette.ink },
          itemStyle: { color: palette.ink },
        },
      ];
    } else {
      const reasonTotals = new Map();
      for (const route of aggregateFlowRoutes(state.history, kind, state.flowWindowDays, latestDay)) {
        for (const [reason, value] of Object.entries(route.reasons)) reasonTotals.set(reason, (reasonTotals.get(reason) || 0) + value);
      }
      const reasons = [...reasonTotals.entries()].sort((a, b) => b[1] - a[1]);
      districtChart.grid = { top: 22, left: 118, right: 20, bottom: 20 };
      districtChart.xAxis = {
        ...districtChart.xAxis,
        type: "value",
        axisLabel: { ...districtChart.xAxis.axisLabel, formatter: (value) => formatCompact(value) },
      };
      districtChart.yAxis = {
        ...districtChart.yAxis,
        type: "category",
        data: reasons.length ? reasons.map(([reason]) => humanizeEvent(reason)).reverse() : ["No completed changes yet"],
        axisLabel: { ...districtChart.yAxis.axisLabel, width: 108, overflow: "truncate", interval: 0 },
      };
      districtChart.series = [
        {
          name: kindLabel,
          type: "bar",
          data: reasons.length ? reasons.map(([, value]) => value).reverse() : [0],
          barMaxWidth: 11,
          itemStyle: { color: palette.teal },
        },
      ];
    }
    mountChart(districtNode, "flows:district", districtChart);
  }

  function renderMobilityCharts() {
    const [modesNode, linksNode] = prepareChartPanel("mobility", [
      ["modes", "Workday commute mode share", "Completed workdays only · car, bus and walk"],
      ["links", "Named corridor pressure", "Latest completed assignment · road and bus load/capacity"],
    ]);
    const { history, labels } = chartSource({ workdaysOnly: true });
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
    addInterventionMarkers(modes, history, labels);
    mountChart(modesNode, "mobility:modes", modes);

    const links = linksOf()
      .map((link) => ({
        ...link,
        roadPressure: linkLoad(link),
        ptPressure: Math.max(valueAt(link, ["ptLoadFactorAB"], 0), valueAt(link, ["ptLoadFactorBA"], 0)),
      }))
      .sort((a, b) => Math.max(b.roadPressure, b.ptPressure) - Math.max(a.roadPressure, a.ptPressure))
      .slice(0, 12);
    const linkChart = baseChartOptions();
    linkChart.grid = { top: 24, left: 86, right: 14, bottom: 20 };
    linkChart.xAxis = {
      ...linkChart.xAxis,
      type: "value",
      max: Math.max(1.2, ...links.map((link) => Math.max(link.roadPressure, link.ptPressure))),
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
        name: "Road",
        type: "bar",
        data: links.map((link) => link.roadPressure).reverse(),
        barMaxWidth: 7,
        itemStyle: { color: palette.amber },
      },
      {
        name: "Bus",
        type: "bar",
        data: links.map((link) => link.ptPressure).reverse(),
        barMaxWidth: 7,
        itemStyle: { color: palette.blue },
      },
    ];
    mountChart(linksNode, "mobility:links", linkChart);
  }

  function renderCitizenCharts() {
    const activeStatus = cityOf(state.snapshot).distributions?.financialStatus || {};
    const referenceStatus = cityOf(state.referenceSnapshot).distributions?.financialStatus || {};
    const [financeNode, statesNode] = prepareChartPanel("citizens", [
      ["finance", "Why household finances differ", "Latest monthly account · all represented residents · mutually exclusive · no ‘net zero’ bucket"],
      ["states", "Citizen decision states", "Daily weighted shares · transition count on right axis"],
    ]);
    const activeBins = Array.isArray(activeStatus.bins) ? activeStatus.bins : [];
    const referenceBins = new Map((referenceStatus.bins || []).map((bin) => [bin.id, bin]));
    const labels = activeBins.length
      ? activeBins.map(
          (bin) =>
            ({
              unemployed: "Unemployed",
              "fixed-cost-deficit": "Pay < housing + commute",
              "essentials-gap": "Essentials gap",
              "thin-positive-buffer": "Thin buffer",
              "savings-capacity": "Savings capacity",
            })[bin.id] || bin.label
        )
      : ["No data"];
    const finance = baseChartOptions();
    finance.grid = { top: 24, left: 42, right: 12, bottom: 56 };
    finance.xAxis.data = labels;
    finance.xAxis.axisLabel = { ...finance.xAxis.axisLabel, interval: 0, rotate: 18 };
    finance.yAxis = { ...finance.yAxis, min: 0, max: 100, axisLabel: { ...finance.yAxis.axisLabel, formatter: "{value}%" } };
    finance.series = [
      {
        name: "Active",
        type: "bar",
        data: activeBins.length ? activeBins.map((bin) => Number(bin.sharePercent) || 0) : [0],
        itemStyle: { color: palette.green },
      },
      state.compare
        ? {
            name: "Reference",
            type: "bar",
            data: activeBins.length ? activeBins.map((bin) => Number(referenceBins.get(bin.id)?.sharePercent) || 0) : [0],
            itemStyle: { color: palette.greenSoft },
          }
        : null,
    ].filter(Boolean);
    mountChart(financeNode, "citizens:finance", finance);

    const { history, labels: dayLabels } = chartSource();
    const states = baseChartOptions();
    states.grid = { ...states.grid, right: 46 };
    states.xAxis.data = dayLabels;
    states.yAxis = [
      { ...states.yAxis, min: 0, max: 100, axisLabel: { ...states.yAxis.axisLabel, formatter: "{value}%" } },
      {
        ...states.yAxis,
        position: "right",
        name: "changes",
        nameTextStyle: { color: palette.muted, fontSize: 9 },
        axisLabel: { ...states.yAxis.axisLabel, formatter: (value) => formatCompact(value) },
        splitLine: { show: false },
      },
    ];
    states.series = [
      {
        name: "Happy",
        type: "line",
        stack: "citizen-state",
        areaStyle: {},
        showSymbol: false,
        data: history.map((entry) => entry.happy * 100),
        itemStyle: { color: palette.green },
      },
      {
        name: "Waiting",
        type: "line",
        stack: "citizen-state",
        areaStyle: {},
        showSymbol: false,
        data: history.map((entry) => entry.waiting * 100),
        itemStyle: { color: palette.amber },
      },
      {
        name: "Extreme",
        type: "line",
        stack: "citizen-state",
        areaStyle: {},
        showSymbol: false,
        data: history.map((entry) => entry.extreme * 100),
        itemStyle: { color: palette.red },
      },
      {
        name: "Recovery",
        type: "line",
        stack: "citizen-state",
        areaStyle: {},
        showSymbol: false,
        data: history.map((entry) => entry.recovery * 100),
        itemStyle: { color: palette.blue },
      },
      {
        name: "Transitions",
        type: "bar",
        yAxisIndex: 1,
        data: history.map((entry) => Number(entry.transitions?.totals?.representedCitizenTransitions) || 0),
        barMaxWidth: 5,
        itemStyle: { color: "rgba(29,42,42,0.28)" },
      },
    ];
    addInterventionMarkers(states, history, dayLabels);
    mountChart(statesNode, "citizens:states", states);
  }

  function renderEnterpriseCharts() {
    const [statesNode, viabilityNode] = prepareChartPanel("enterprises", [
      ["states", "Enterprise decision states", "Daily shares · transition count on right axis"],
      ["viability", "Portfolio viability and actions", "Daily active/loss-making shares · closed-month margin · moves/restarts"],
    ]);
    const { history, labels } = chartSource();
    const states = baseChartOptions();
    states.grid = { ...states.grid, right: 46 };
    states.xAxis.data = labels;
    states.yAxis = [
      { ...states.yAxis, min: 0, max: 100, axisLabel: { ...states.yAxis.axisLabel, formatter: "{value}%" } },
      {
        ...states.yAxis,
        position: "right",
        name: "changes",
        nameTextStyle: { color: palette.muted, fontSize: 9 },
        axisLabel: { ...states.yAxis.axisLabel, formatter: (value) => formatCompact(value) },
        splitLine: { show: false },
      },
    ];
    states.series = [
      {
        name: "Starting",
        type: "line",
        stack: "enterprise-state",
        areaStyle: {},
        showSymbol: false,
        data: history.map((entry) => entry.enterpriseStates.starting * 100),
        itemStyle: { color: palette.sand },
      },
      {
        name: "Working",
        type: "line",
        stack: "enterprise-state",
        areaStyle: {},
        showSymbol: false,
        data: history.map((entry) => entry.enterpriseStates.working * 100),
        itemStyle: { color: palette.green },
      },
      {
        name: "Grow",
        type: "line",
        stack: "enterprise-state",
        areaStyle: {},
        showSymbol: false,
        data: history.map((entry) => entry.enterpriseStates.grow * 100),
        itemStyle: { color: palette.blue },
      },
      {
        name: "Lesser",
        type: "line",
        stack: "enterprise-state",
        areaStyle: {},
        showSymbol: false,
        data: history.map((entry) => entry.enterpriseStates.lesser * 100),
        itemStyle: { color: palette.red },
      },
      {
        name: "Transitions",
        type: "bar",
        yAxisIndex: 1,
        data: history.map((entry) => Number(entry.transitions?.totals?.enterpriseTransitions) || 0),
        barMaxWidth: 5,
        itemStyle: { color: "rgba(29,42,42,0.28)" },
      },
    ];
    addInterventionMarkers(states, history, labels);
    mountChart(statesNode, "enterprises:states", states);

    const viability = baseChartOptions();
    viability.grid = { ...viability.grid, right: 48 };
    viability.xAxis.data = labels;
    viability.yAxis = [
      {
        ...viability.yAxis,
        min: 0,
        max: 100,
        name: "%",
        nameTextStyle: { color: palette.muted, fontSize: 9 },
        axisLabel: { ...viability.yAxis.axisLabel, formatter: "{value}%" },
      },
      {
        ...viability.yAxis,
        position: "right",
        name: "actions",
        nameTextStyle: { color: palette.muted, fontSize: 9 },
        axisLabel: { ...viability.yAxis.axisLabel, formatter: (value) => formatCompact(value) },
        splitLine: { show: false },
      },
    ];
    viability.series = [
      {
        name: "Active firms",
        type: "line",
        showSymbol: false,
        data: history.map((entry) => entry.activeEnterpriseShare * 100),
        lineStyle: { width: 2.2, color: palette.green },
        itemStyle: { color: palette.green },
      },
      {
        name: "Loss-making",
        type: "line",
        showSymbol: false,
        data: history.map((entry) => entry.lossMakingEnterpriseShare * 100),
        lineStyle: { width: 1.8, color: palette.red },
        itemStyle: { color: palette.red },
      },
      {
        name: "Portfolio margin",
        type: "line",
        showSymbol: false,
        data: history.map((entry) => entry.enterprisePortfolioMargin * 100),
        lineStyle: { width: 1.8, color: palette.blue },
        itemStyle: { color: palette.blue },
      },
      {
        name: "Moves",
        type: "bar",
        yAxisIndex: 1,
        data: history.map((entry) => entry.firmMoves),
        barMaxWidth: 6,
        itemStyle: { color: palette.amber },
      },
      {
        name: "Restarts",
        type: "bar",
        yAxisIndex: 1,
        data: history.map((entry) => entry.firmRestarts),
        barMaxWidth: 6,
        itemStyle: { color: palette.sand },
      },
    ];
    addInterventionMarkers(viability, history, labels);
    mountChart(viabilityNode, "enterprises:viability", viability);
  }

  function resizeCharts() {
    state.charts.forEach((chart) => chart.resize?.());
  }

  function exportCsv() {
    const csv = historyToCsv(state.history);
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `abu-dhabi-urban-dynamics-${state.appliedPolicy?.scenario || "reference"}-seed-${state.seed}.csv`;
    document.body.append(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    announce("Scenario history exported as CSV.");
  }

  function setupResponsiveBehavior() {
    const compact = window.matchMedia("(max-width: 1099px)");
    const apply = () => {
      const runtimeFailed = root.dataset.udesV2State === "error";
      root.dataset.udesV2Mobile = compact.matches ? "readonly" : "interactive";
      restoreMutationControlAvailability();
      if (compact.matches && !runtimeFailed) {
        stopPlayback();
        setRuntime("Read-only", "readonly");
        announce("Mobile view is read-only. Open on a larger screen to run scenarios.");
      } else if (!state.busy && !runtimeFailed) {
        if (state.elapsedDays >= state.horizonDays) setRuntime("Horizon reached", "complete");
        else setRuntime("Ready", "ready");
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
