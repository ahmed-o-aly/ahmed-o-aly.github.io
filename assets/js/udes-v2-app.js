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
    "residentialMoveDecisionProbability",
    "residentialMoveCooldownDays",
    "firmMoveProbabilityOnStateEntry",
    "firmMoveCooldownDays",
  ]);
  const TARGETED_LAND_USE_FIELDS = Object.freeze(["housingCapacityMultiplier", "businessCapacityMultiplier", "placeQuality"]);
  const NETWORK_POLICY_FIELDS = Object.freeze([
    "transitFareAed",
    "transitSpeedKmh",
    "transitWaitMin",
    "ptCapacityMultiplier",
    "roadCapacityMultiplier",
    "carCostPerKmAed",
    "parkingDailyCostAed",
  ]);
  const LEVER_POLICY_FIELDS = Object.freeze({
    transitFare: "transitFareAed",
    transitSpeed: "transitSpeedKmh",
    transitWait: "transitWaitMin",
    transitCapacity: "ptCapacityMultiplier",
    roadCapacity: "roadCapacityMultiplier",
    carCost: "carCostPerKmAed",
    parkingCost: "parkingDailyCostAed",
    housing: "housingCapacityMultiplier",
    business: "businessCapacityMultiplier",
    placeQuality: "placeQuality",
    incomeBuffer: "waitingNetIncomeAed",
    acceptableCommute: "acceptableCommuteRoundTripMin",
    extremeCommute: "extremeCommuteRoundTripMin",
    targetMargin: "enterpriseTargetMargin",
    employmentTarget: "targetEmploymentRate",
    rentPressure: "rentPressureMultiplier",
    householdMoveChance: "residentialMoveDecisionProbability",
    householdMinimumStay: "residentialMoveCooldownDays",
    firmMoveChance: "firmMoveProbabilityOnStateEntry",
    firmMinimumStay: "firmMoveCooldownDays",
  });
  const PRESET_LEVERS = Object.freeze({
    reference: Object.freeze([
      "transitFare",
      "transitSpeed",
      "transitWait",
      "transitCapacity",
      "roadCapacity",
      "carCost",
      "parkingCost",
      "housing",
      "business",
      "placeQuality",
    ]),
    transit: Object.freeze(["transitFare", "transitSpeed", "transitWait", "transitCapacity"]),
    housing: Object.freeze(["housing"]),
    balanced: Object.freeze(["housing", "business", "placeQuality"]),
  });
  const HISTORY_NUMERIC_POLICY_FIELDS = Object.freeze([
    "transitFareAed",
    "transitSpeedKmh",
    "transitWaitMin",
    "ptCapacityMultiplier",
    "roadCapacityMultiplier",
    "carCostPerKmAed",
    "parkingDailyCostAed",
    "housingCapacityMultiplier",
    "businessCapacityMultiplier",
    "rentPressureMultiplier",
    "placeQuality",
    "waitingNetIncomeAed",
    "acceptableCommuteRoundTripMin",
    "extremeCommuteRoundTripMin",
    "enterpriseTargetMargin",
    "targetEmploymentRate",
    "residentialMoveDecisionProbability",
    "residentialMoveCooldownDays",
    "firmMoveProbabilityOnStateEntry",
    "firmMoveCooldownDays",
  ]);
  const PUBLIC_PRESETS = Object.freeze({
    reference: Object.freeze({
      transitFareAed: 2,
      transitSpeedKmh: 28,
      transitWaitMin: 7,
      ptCapacityMultiplier: 1,
      roadCapacityMultiplier: 1,
      carCostPerKmAed: 0.35,
      parkingDailyCostAed: 15,
      housingCapacityMultiplier: 1,
      businessCapacityMultiplier: 1,
      rentPressureMultiplier: 1,
      placeQuality: 0.82,
      waitingNetIncomeAed: 1500,
      acceptableCommuteRoundTripMin: 60,
      extremeCommuteRoundTripMin: 90,
      enterpriseTargetMargin: 0.12,
      targetEmploymentRate: 0.67,
      residentialMoveDecisionProbability: 0.2,
      residentialMoveCooldownDays: 365,
      firmMoveProbabilityOnStateEntry: 0.1,
      firmMoveCooldownDays: 730,
    }),
    transit: Object.freeze({
      transitFareAed: 1,
      transitSpeedKmh: 45,
      transitWaitMin: 4,
      ptCapacityMultiplier: 2,
      roadCapacityMultiplier: 1,
      carCostPerKmAed: 0.35,
      parkingDailyCostAed: 15,
      housingCapacityMultiplier: 1,
      businessCapacityMultiplier: 1,
      rentPressureMultiplier: 1,
      placeQuality: 0.82,
      waitingNetIncomeAed: 1500,
      acceptableCommuteRoundTripMin: 60,
      extremeCommuteRoundTripMin: 90,
      enterpriseTargetMargin: 0.12,
      targetEmploymentRate: 0.67,
      residentialMoveDecisionProbability: 0.2,
      residentialMoveCooldownDays: 365,
      firmMoveProbabilityOnStateEntry: 0.1,
      firmMoveCooldownDays: 730,
    }),
    housing: Object.freeze({
      transitFareAed: 2,
      transitSpeedKmh: 28,
      transitWaitMin: 7,
      ptCapacityMultiplier: 1,
      roadCapacityMultiplier: 1,
      carCostPerKmAed: 0.35,
      parkingDailyCostAed: 15,
      housingCapacityMultiplier: 1.3,
      businessCapacityMultiplier: 1,
      rentPressureMultiplier: 1,
      placeQuality: 0.82,
      waitingNetIncomeAed: 1500,
      acceptableCommuteRoundTripMin: 60,
      extremeCommuteRoundTripMin: 90,
      enterpriseTargetMargin: 0.12,
      targetEmploymentRate: 0.67,
      residentialMoveDecisionProbability: 0.2,
      residentialMoveCooldownDays: 365,
      firmMoveProbabilityOnStateEntry: 0.1,
      firmMoveCooldownDays: 730,
    }),
    balanced: Object.freeze({
      transitFareAed: 2,
      transitSpeedKmh: 28,
      transitWaitMin: 7,
      ptCapacityMultiplier: 1,
      roadCapacityMultiplier: 1,
      carCostPerKmAed: 0.35,
      parkingDailyCostAed: 15,
      housingCapacityMultiplier: 1.2,
      businessCapacityMultiplier: 1.15,
      rentPressureMultiplier: 1,
      placeQuality: 0.94,
      waitingNetIncomeAed: 1500,
      acceptableCommuteRoundTripMin: 60,
      extremeCommuteRoundTripMin: 90,
      enterpriseTargetMargin: 0.12,
      targetEmploymentRate: 0.67,
      residentialMoveDecisionProbability: 0.2,
      residentialMoveCooldownDays: 365,
      firmMoveProbabilityOnStateEntry: 0.1,
      firmMoveCooldownDays: 730,
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
    "transit_wait_minutes",
    "pt_capacity_multiplier",
    "road_capacity_multiplier",
    "car_cost_per_km_aed",
    "parking_and_fixed_car_cost_aed_per_day",
    "uniform_or_target_housing_capacity_multiplier",
    "uniform_or_target_business_capacity_multiplier",
    "rent_pressure_multiplier",
    "uniform_or_target_place_quality",
    "citizen_income_buffer_aed",
    "acceptable_round_trip_minutes",
    "severe_round_trip_minutes",
    "enterprise_target_margin",
    "target_employment_rate",
    "residential_move_follow_through_probability",
    "residential_minimum_stay_days",
    "firm_move_consideration_probability",
    "firm_minimum_stay_days",
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
      entry.transitWaitMin,
      entry.ptCapacityMultiplier,
      entry.roadCapacityMultiplier,
      entry.carCostPerKmAed,
      entry.parkingDailyCostAed,
      landUseScalar(entry.housingCapacityMultiplier),
      landUseScalar(entry.businessCapacityMultiplier),
      entry.rentPressureMultiplier,
      landUseScalar(entry.placeQuality),
      entry.waitingNetIncomeAed,
      entry.acceptableCommuteRoundTripMin,
      entry.extremeCommuteRoundTripMin,
      entry.enterpriseTargetMargin,
      entry.targetEmploymentRate,
      entry.residentialMoveDecisionProbability,
      entry.residentialMoveCooldownDays,
      entry.firmMoveProbabilityOnStateEntry,
      entry.firmMoveCooldownDays,
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

  function flowDefinition(kind, measure = "represented") {
    const represented = measure === "represented";
    return (
      {
        residential: {
          collection: "residentialMoves",
          value: represented ? "representedResidents" : "citizenAgentCount",
          unit: represented ? "represented move-event equivalents" : "modeled household-agent events",
        },
        job: {
          collection: "jobMoves",
          value: represented ? "representedWorkers" : "citizenAgentCount",
          unit: represented ? "represented job-switch equivalents" : "modeled citizen-agent job switches",
        },
        workplace: {
          collection: "enterpriseMoves",
          value: represented ? "representedWorkersAffected" : "affectedCitizenAgentCount",
          unit: represented ? "represented workplace-change equivalents" : "modeled workers carried by firm moves",
        },
        enterprise: { collection: "enterpriseMoves", value: "enterpriseCount", unit: "enterprises" },
        replacement: {
          collection: "replacementRelocations",
          value: represented ? "representedResidents" : "citizenAgentCount",
          unit: represented ? "represented replacement-placement equivalents" : "modeled replacement-agent placements",
        },
        commute: {
          collection: "commuteOd",
          value: represented ? "representedWorkers" : "citizenAgentCount",
          unit: represented ? "represented employed residents (stock)" : "modeled employed citizen agents (stock)",
        },
      }[kind] || {
        collection: "residentialMoves",
        value: represented ? "representedResidents" : "citizenAgentCount",
        unit: represented ? "represented move-event equivalents" : "modeled household-agent events",
      }
    );
  }

  function flowRowsForHistoryEntry(entry, kind = "residential", measure = "represented") {
    const definition = flowDefinition(kind, measure);
    const rows = entry?.flows?.[definition.collection];
    return Array.isArray(rows) ? rows : [];
  }

  function aggregateFlowRoutes(history, kind = "residential", windowDays = 30, latestDay = null, measure = "represented") {
    const definition = flowDefinition(kind, measure);
    const points = filterHistoryWindow(history || [], windowDays, latestDay);
    const routes = new Map();
    for (const point of points) {
      for (const row of flowRowsForHistoryEntry(point, kind, measure)) {
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

  function flowSeriesForZone(history, kind, zoneId, windowDays = 30, latestDay = null, measure = "represented") {
    const definition = flowDefinition(kind, measure);
    const target = String(zoneId || "");
    return filterHistoryWindow(history || [], windowDays, latestDay).map((point) => {
      let inflow = 0;
      let outflow = 0;
      for (const row of flowRowsForHistoryEntry(point, kind, measure)) {
        const value = Math.max(0, Number(row[definition.value]) || 0);
        if (String(row.toZoneId || "") === target && String(row.fromZoneId || "") !== target) inflow += value;
        if (String(row.fromZoneId || "") === target && String(row.toZoneId || "") !== target) outflow += value;
      }
      return { day: Number(point.day) || 0, date: point.date, inflow, outflow, net: inflow - outflow };
    });
  }

  function isInterDistrictCorridor(feature = {}) {
    const properties = feature?.properties || feature;
    const contextOnly = properties?.contextOnly === true;
    if (!contextOnly && (properties?.modelVisible === false || properties?.loadBearing === false)) return false;
    const fromZoneId = String(properties?.from || properties?.fromZoneId || "");
    const toZoneId = String(properties?.to || properties?.toZoneId || "");
    const fromNodeId = String(properties?.fromNodeId || properties?.from || "");
    const toNodeId = String(properties?.toNodeId || properties?.to || "");
    return Boolean((fromZoneId && toZoneId && fromZoneId !== toZoneId) || (fromNodeId && toNodeId && fromNodeId !== toNodeId));
  }

  function isRenderedAnalysisLink(link = {}) {
    const properties = link?.properties || link;
    return properties.modelVisible !== false && properties.contextOnly !== true && properties.hidden !== true && properties.loadBearing !== false;
  }

  function topInterDistrictCommutes(rows, limit = 18) {
    const routes = new Map();
    for (const row of Array.isArray(rows) ? rows : []) {
      if (!row || typeof row !== "object") continue;
      const fromZoneId = String(row.homeZoneId || row.fromZoneId || "");
      const toZoneId = String(row.workZoneId || row.toZoneId || "");
      if (!fromZoneId || !toZoneId || fromZoneId === toZoneId) continue;
      const key = `${fromZoneId}\u0000${toZoneId}`;
      const value = Math.max(0, Number(row.representedWorkers ?? row.representedResidents ?? row.value) || 0);
      const current = routes.get(key) || { fromZoneId, toZoneId, value: 0 };
      current.value += value;
      routes.set(key, current);
    }
    const count = Math.max(0, Math.floor(Number(limit) || 0));
    return [...routes.values()]
      .sort((a, b) => b.value - a.value || a.fromZoneId.localeCompare(b.fromZoneId) || a.toZoneId.localeCompare(b.toZoneId))
      .slice(0, count);
  }

  function representedCommuteWorkers(row, measure = "represented") {
    if (!row?.workZoneId) return 0;
    if (measure === "agents") return Math.max(0, Number(row.citizenAgentCount) || 0);
    const workers = Number(row.representedWorkers);
    if (Number.isFinite(workers)) return Math.max(0, workers);
    return Math.max(0, Number(row.representedResidents) || 0);
  }

  function commuteDistrictIds(rows, districtIds = []) {
    const requested = [...new Set((Array.isArray(districtIds) ? districtIds : []).map(String).filter(Boolean))];
    const discovered = new Set();
    for (const row of Array.isArray(rows) ? rows : []) {
      if (row?.homeZoneId) discovered.add(String(row.homeZoneId));
      if (row?.workZoneId) discovered.add(String(row.workZoneId));
    }
    return [...requested, ...[...discovered].filter((id) => !requested.includes(id)).sort()];
  }

  function commuteLiveWorkByDistrict(rows, districtIds = [], measure = "represented") {
    const ids = commuteDistrictIds(rows, districtIds);
    const totals = new Map(ids.map((districtId) => [districtId, { districtId, employedResidents: 0, locatedJobs: 0, netJobBalance: 0 }]));
    for (const row of Array.isArray(rows) ? rows : []) {
      const homeZoneId = String(row?.homeZoneId || "");
      const workZoneId = String(row?.workZoneId || "");
      const workers = representedCommuteWorkers(row, measure);
      if (!homeZoneId || !workZoneId || workers <= 0) continue;
      if (!totals.has(homeZoneId)) totals.set(homeZoneId, { districtId: homeZoneId, employedResidents: 0, locatedJobs: 0, netJobBalance: 0 });
      if (!totals.has(workZoneId)) totals.set(workZoneId, { districtId: workZoneId, employedResidents: 0, locatedJobs: 0, netJobBalance: 0 });
      totals.get(homeZoneId).employedResidents += workers;
      totals.get(workZoneId).locatedJobs += workers;
    }
    return [...totals.values()].map((row) => ({ ...row, netJobBalance: row.locatedJobs - row.employedResidents }));
  }

  function commuteOdMatrix(rows, districtIds = [], measure = "represented") {
    const ids = commuteDistrictIds(rows, districtIds);
    const indexById = new Map(ids.map((districtId, index) => [districtId, index]));
    const totals = new Map();
    for (const row of Array.isArray(rows) ? rows : []) {
      const homeZoneId = String(row?.homeZoneId || "");
      const workZoneId = String(row?.workZoneId || "");
      const workers = representedCommuteWorkers(row, measure);
      if (!indexById.has(homeZoneId) || !indexById.has(workZoneId) || workers <= 0) continue;
      const key = `${homeZoneId}\u0000${workZoneId}`;
      totals.set(key, (totals.get(key) || 0) + workers);
    }
    const cells = [];
    let maximum = 0;
    ids.forEach((homeZoneId, homeIndex) => {
      ids.forEach((workZoneId, workIndex) => {
        const value = totals.get(`${homeZoneId}\u0000${workZoneId}`) || 0;
        maximum = Math.max(maximum, value);
        cells.push([workIndex, homeIndex, value]);
      });
    });
    return { districtIds: ids, cells, maximum };
  }

  function selectedDistrictCommuteExchange(rows, districtId, measure = "represented") {
    const selectedId = String(districtId || "");
    const destinations = new Map();
    const origins = new Map();
    let sameDistrict = 0;
    for (const row of Array.isArray(rows) ? rows : []) {
      const homeZoneId = String(row?.homeZoneId || "");
      const workZoneId = String(row?.workZoneId || "");
      const workers = representedCommuteWorkers(row, measure);
      if (!selectedId || !homeZoneId || !workZoneId || workers <= 0) continue;
      if (homeZoneId === selectedId && workZoneId === selectedId) {
        sameDistrict += workers;
      } else {
        if (homeZoneId === selectedId) destinations.set(workZoneId, (destinations.get(workZoneId) || 0) + workers);
        if (workZoneId === selectedId) origins.set(homeZoneId, (origins.get(homeZoneId) || 0) + workers);
      }
    }
    const sortRows = (totals) =>
      [...totals.entries()]
        .map(([counterpartDistrictId, value]) => ({ counterpartDistrictId, value }))
        .sort((a, b) => b.value - a.value || a.counterpartDistrictId.localeCompare(b.counterpartDistrictId));
    const destinationRows = sortRows(destinations);
    const originRows = sortRows(origins);
    return {
      districtId: selectedId,
      sameDistrict,
      destinations: destinationRows,
      origins: originRows,
      outboundWorkers: destinationRows.reduce((total, row) => total + row.value, 0),
      inboundWorkers: originRows.reduce((total, row) => total + row.value, 0),
    };
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
          .map((point) =>
            Array.isArray(point) ? Number(point.at(-1)) : typeof point === "object" && point !== null ? Number(point.value) : Number(point)
          )
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
      isInterDistrictCorridor,
      isRenderedAnalysisLink,
      topInterDistrictCommutes,
      commuteLiveWorkByDistrict,
      commuteOdMatrix,
      selectedDistrictCommuteExchange,
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
    mapRenderers: { agents: null, commuteFlows: null, roads: null },
    agentCanvas: null,
    view: root.dataset.udesV2View === "studio" ? "studio" : "overview",
    mapMode: "agents",
    // Keep commuter stock opt-in so the road-load signal remains legible.
    agentVisibility: { citizens: true, enterprises: true, flows: false },
    renderedMapMode: null,
    layers: {
      zones: null,
      roads: null,
      stops: null,
      selection: null,
      citizenAgents: null,
      enterpriseAgents: null,
      agentCanvas: null,
      commuteFlows: null,
      basemap: null,
    },
    mapFeatures: { citizenAgents: new Map(), enterpriseAgents: new Map(), commuteFlows: new Map() },
    selected: { kind: "city", id: null, index: { citizen: 0, enterprise: 0, link: 0 } },
    scenario: "reference",
    compare: true,
    playing: false,
    busy: false,
    speed: 1,
    horizonDays: 366,
    chartWindowDays: 90,
    flowKind: "residential",
    flowMeasure: "agents",
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
    chartStructureKeys: new Map(),
    panelHtml: new WeakMap(),
    pendingPanelRenders: new WeakMap(),
    hoveredZoneId: null,
    hoveredMapFeatureKey: null,
    focusedMapFeatureKey: null,
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
    flowMeasure: $("[data-udes-v2-flow-measure]"),
    flowWindow: $("[data-udes-v2-flow-window]"),
    flowFilter: $("[data-udes-v2-flow-controls]"),
    seed: $("[data-udes-v2-seed]"),
    applyPolicy: $("[data-udes-v2-action='apply-policy']"),
    policyStatus: $("[data-udes-v2-policy-status]"),
    selectionName: $("[data-udes-v2-selection-name]"),
    selectionId: $("[data-udes-v2-selection-id]"),
    mapStatus: $("[data-udes-v2-map-status]"),
    mapLegend: $("[data-udes-v2-map-legend]"),
    agentLayerToggles: $("[data-udes-v2-agent-layer-toggles]"),
    viewToggle: $("[data-udes-v2-view-toggle]"),
    viewLabel: $("[data-udes-v2-view-label]"),
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

  function setConsoleView(view, announceChange = true) {
    const nextView = view === "studio" ? "studio" : "overview";
    state.view = nextView;
    root.dataset.udesV2View = nextView;
    const studioOpen = nextView === "studio";
    if (!studioOpen) activateTab("chart", "outcomes");
    if (ui.viewLabel) ui.viewLabel.textContent = studioOpen ? "Show overview" : "Open studio";
    if (ui.viewToggle) {
      ui.viewToggle.setAttribute("aria-pressed", String(studioOpen));
      ui.viewToggle.setAttribute(
        "aria-label",
        studioOpen ? "Return to the map and city-pulse overview" : "Open scenario controls and object inspection studio"
      );
    }
    const refreshLayout = () => {
      state.map?.invalidateSize?.({ pan: false });
      resizeCharts();
    };
    requestAnimationFrame(refreshLayout);
    setTimeout(refreshLayout, 120);
    if (announceChange) {
      announce(studioOpen ? "Studio opened with scenario controls and object inspection." : "City overview restored.");
    }
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
      links: dataset.roadGraph?.segments || dataset.roadGraph?.edges || dataset.links || [],
      nodes: dataset.roadGraph?.nodes || [],
      zoneAccess: dataset.roadGraph?.zoneAccess || [],
      candidateRoutes: dataset.roadGraph?.candidateRoutes || [],
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
      transitWaitMin: values.transitWait,
      ptCapacityMultiplier: values.transitCapacity / 100,
      roadCapacityMultiplier: values.roadCapacity / 100,
      carCostPerKmAed: values.carCost,
      parkingDailyCostAed: values.parkingCost,
      housingCapacityMultiplier: values.housing / 100,
      businessCapacityMultiplier: values.business / 100,
      rentPressureMultiplier: values.rentPressure / 100,
      placeQuality: values.placeQuality / 100,
      waitingNetIncomeAed: values.incomeBuffer,
      acceptableCommuteRoundTripMin: values.acceptableCommute,
      extremeCommuteRoundTripMin: values.extremeCommute,
      enterpriseTargetMargin: values.targetMargin / 100,
      targetEmploymentRate: values.employmentTarget / 100,
      residentialMoveDecisionProbability: values.householdMoveChance / 100,
      residentialMoveCooldownDays: values.householdMinimumStay,
      firmMoveProbabilityOnStateEntry: values.firmMoveChance / 100,
      firmMoveCooldownDays: values.firmMinimumStay,
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
      calibrationLabel: "Illustrative Greater Abu Dhabi City scenario baseline, not a forecast",
      endogenousEnterpriseDynamics: true,
    };
  }

  function setLever(name, value) {
    const input = $(`[data-udes-v2-lever='${name}']`);
    if (!input) return;
    const transformed = {
      transitFare: value.transitFareAed,
      transitSpeed: value.transitSpeedKmh,
      transitWait: value.transitWaitMin,
      transitCapacity: value.ptCapacityMultiplier * 100,
      roadCapacity: value.roadCapacityMultiplier * 100,
      carCost: value.carCostPerKmAed,
      parkingCost: value.parkingDailyCostAed,
      housing: value.housingCapacityMultiplier * 100,
      business: value.businessCapacityMultiplier * 100,
      rentPressure: value.rentPressureMultiplier * 100,
      placeQuality: value.placeQuality * 100,
      incomeBuffer: value.waitingNetIncomeAed,
      acceptableCommute: value.acceptableCommuteRoundTripMin,
      extremeCommute: value.extremeCommuteRoundTripMin,
      targetMargin: value.enterpriseTargetMargin * 100,
      employmentTarget: value.targetEmploymentRate * 100,
      householdMoveChance: value.residentialMoveDecisionProbability * 100,
      householdMinimumStay: value.residentialMoveCooldownDays,
      firmMoveChance: value.firmMoveProbabilityOnStateEntry * 100,
      firmMinimumStay: value.firmMoveCooldownDays,
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
      transitWait: `${value.toFixed(0)} min`,
      transitCapacity: `${value.toFixed(0)}%`,
      roadCapacity: `${value.toFixed(0)}%`,
      carCost: `AED ${value.toFixed(2)}`,
      parkingCost: `AED ${value.toFixed(0)}/day`,
      housing: `${value.toFixed(0)}%`,
      business: `${value.toFixed(0)}%`,
      rentPressure: value === 100 ? "Neutral" : `${value > 100 ? "+" : ""}${value - 100}%`,
      placeQuality: (value / 100).toFixed(2),
      incomeBuffer: `AED ${formatNumber(value)}`,
      acceptableCommute: `${value.toFixed(0)} min`,
      extremeCommute: `${value.toFixed(0)} min`,
      targetMargin: `${value.toFixed(0)}%`,
      employmentTarget: `${value.toFixed(0)}%`,
      householdMoveChance: `${value.toFixed(0)}%`,
      householdMinimumStay: `${value.toFixed(0)} days`,
      firmMoveChance: `${value.toFixed(0)}%`,
      firmMinimumStay: `${value.toFixed(0)} days`,
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
      state.worker.request("init", { data, config: activeConfig, seed: state.seed, snapshot: { mapFrame: "all" } }),
      state.referenceWorker.request("init", { data, config: referenceConfig, seed: state.seed, snapshot: { mapFrame: "none" } }),
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
      mapFrame: "all",
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
          snapshot: { mapFrame: "all" },
        }),
        state.referenceWorker.request("configure", {
          patch: { ...enginePolicyPatch(resetReferencePolicy), seed: state.seed },
          reset: true,
          snapshot: { mapFrame: "none" },
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
    ui.viewToggle?.addEventListener("click", () => setConsoleView(state.view === "overview" ? "studio" : "overview"));
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
      state.flowKind = ["residential", "job", "workplace", "enterprise", "replacement", "commute"].includes(ui.flowKind.value)
        ? ui.flowKind.value
        : "residential";
      if (ui.flowWindow) ui.flowWindow.disabled = state.flowKind === "commute";
      renderChartPanel("flows");
    });
    ui.flowMeasure?.addEventListener("change", () => {
      state.flowMeasure = ui.flowMeasure.value === "represented" ? "represented" : "agents";
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
    for (const button of $$("[data-udes-v2-agent-layer]")) {
      button.addEventListener("click", () => {
        const layer = button.dataset.udesV2AgentLayer;
        if (!(layer in state.agentVisibility)) return;
        state.agentVisibility[layer] = !state.agentVisibility[layer];
        button.setAttribute("aria-pressed", String(state.agentVisibility[layer]));
        updateAgentMapLayers();
        renderMapStatus();
        announce(`${button.textContent.trim()} ${state.agentVisibility[layer] ? "shown" : "hidden"} on the agent map.`);
      });
    }
  }

  function bindTabs(kind) {
    const tabAttr = `data-udes-v2-${kind}-tab`;
    const panelAttr = `data-udes-v2-${kind}-panel`;
    const tabs = $$(`[${tabAttr}]`);
    tabs.forEach((tab, index) => {
      tab.addEventListener("click", () => {
        activateTab(kind, tab.getAttribute(tabAttr));
        requestAnimationFrame(() => tab.scrollIntoView?.({ block: "nearest", inline: "nearest" }));
      });
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
    setConsoleView(state.view, false);
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

  function textAt(object, keys, fallback = "Not available") {
    for (const key of keys) {
      const value = key.split(".").reduce((current, part) => current?.[part], object);
      if (value !== undefined && value !== null && value !== "") return String(value);
    }
    return fallback;
  }

  function zoneLabel(id) {
    if (!id || id === "Not available") return "Not available";
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
        outsideLaborForce: percentToRatio(valueAt(financialStatus, ["outside-labor-force"], 0)),
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
    if (state.map) renderMapStatus(date, dailyStatus);
  }

  function renderSummary() {
    const active = normalizeCity(state.snapshot);
    const reference = normalizeCity(state.referenceSnapshot);
    const peakRoadUsage = Math.max(0, ...linksOf().filter(isRenderedAnalysisLink).map(linkLoad).filter(Number.isFinite));
    setMetric("satisfaction", formatPercent(active.satisfaction || active.happy));
    setMetric("commute", `${active.meanCommute.toFixed(1)} min`);
    setMetric("transitShare", formatPercent(active.ptShare));
    setMetric("housingOccupancy", formatPercent(active.housingOccupancy));
    setMetric("cityPopulation", formatCompact(active.population));
    setMetric("cityEnterprises", formatNumber(active.enterprises));
    setMetric("peakRoadUsage", formatPercent(peakRoadUsage));
    setMetric("mapCommute", `${active.meanCommute.toFixed(1)} min`);
    setMetric("cityNetIncome", formatAed(active.netIncome, true));
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
    state.map = window.L.map(mount, { zoomControl: false, preferCanvas: true, attributionControl: true, minZoom: 8, maxZoom: 17 });
    state.map.createPane("udesV2CommuteFlows").style.zIndex = "420";
    state.map.createPane("udesV2Roads").style.zIndex = "430";
    state.map.createPane("udesV2Agents").style.zIndex = "450";
    state.mapRenderers.roads = window.L.svg({ pane: "udesV2Roads", padding: 0.5 });
    state.mapRenderers.commuteFlows = window.L.svg({ pane: "udesV2CommuteFlows", padding: 0.5 });
    state.mapRenderers.agents = window.L.svg({ pane: "udesV2Agents", padding: 0.5 });
    state.layers.basemap = window.L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      minZoom: 8,
      maxZoom: 19,
      maxNativeZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>',
      crossOrigin: true,
    }).addTo(state.map);
    if (state.geo.roads) {
      state.layers.roads = window.L.geoJSON(state.geo.roads, {
        filter: isInterDistrictCorridor,
        style: roadStyle,
        onEachFeature: (feature, layer) => {
          layer.bindTooltip(roadTooltipHtml(feature), {
            className: "udes-v2-agent-tooltip",
            sticky: true,
            direction: "top",
            opacity: 0.98,
          });
          layer.on("click", () => selectObject("link", feature.properties?.id || feature.id));
        },
      }).addTo(state.map);
    }
    if (state.geo.zones) {
      state.layers.zones = window.L.geoJSON(state.geo.zones, {
        style: zoneStyle,
        onEachFeature: (feature, layer) => {
          const id = feature.properties?.id || feature.properties?.zoneId || feature.id;
          const label = feature.properties?.name || baselineZone(id)?.name || id;
          const tooltip = layer
            .bindTooltip(label, {
              permanent: true,
              direction: "center",
              className: "udes-v2-zone-label",
              interactive: true,
              opacity: 0.94,
            })
            .getTooltip();
          tooltip.on("click", () => selectObject("zone", id));
          layer.on("tooltipopen", (event) => {
            const element = event.tooltip?.getElement?.();
            if (!element || element.dataset.udesV2Bound === "true") return;
            element.dataset.udesV2Bound = "true";
            element.setAttribute("role", "button");
            element.setAttribute("tabindex", "0");
            element.setAttribute("aria-label", `Inspect ${label}`);
            element.addEventListener("keydown", (keyboardEvent) => {
              if (!["Enter", " "].includes(keyboardEvent.key)) return;
              keyboardEvent.preventDefault();
              selectObject("zone", id);
            });
          });
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
    state.layers.commuteFlows = window.L.layerGroup();
    state.layers.citizenAgents = window.L.layerGroup();
    state.layers.enterpriseAgents = window.L.layerGroup();
    state.agentCanvas = createAgentCanvasLayer();
    state.layers.agentCanvas = state.agentCanvas;
    state.agentCanvas?.addTo(state.map);
    if (placeholder) placeholder.hidden = true;
    fitMap();
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
    const corridorOrAgentMode = state.mapMode === "network" || state.mapMode === "agents";
    return {
      color: selected ? palette.ink : "#60736e",
      weight: selected ? 2.7 : hovered ? 2.1 : corridorOrAgentMode ? 1.05 : 1.1,
      opacity: corridorOrAgentMode ? 0.8 : 0.9,
      fillColor:
        state.mapMode === "rent" ? mixColor("#f4ead4", "#a9673f", ratio) : corridorOrAgentMode ? "#eef3f0" : mixColor("#e9f0ed", "#277565", ratio),
      fillOpacity: selected ? (corridorOrAgentMode ? 0.24 : 0.72) : hovered ? (corridorOrAgentMode ? 0.2 : 0.78) : corridorOrAgentMode ? 0.11 : 0.5,
    };
  }

  function zoneCentroidLatLng(id) {
    const centroid = baselineZone(id)?.centroid;
    if (!Array.isArray(centroid) || centroid.length < 2) return null;
    const longitude = Number(centroid[0]);
    const latitude = Number(centroid[1]);
    return Number.isFinite(longitude) && Number.isFinite(latitude) ? [latitude, longitude] : null;
  }

  function featureForZone(zoneId) {
    return state.geo.zones?.features?.find((feature) => String(zoneFeatureId(feature)) === String(zoneId)) || null;
  }

  function geometryPolygons(geometry) {
    if (geometry?.type === "Polygon") return [geometry.coordinates];
    if (geometry?.type === "MultiPolygon") return geometry.coordinates;
    return [];
  }

  function pointInRing(point, ring) {
    let inside = false;
    for (let index = 0, previous = ring.length - 1; index < ring.length; previous = index, index += 1) {
      const [x1, y1] = ring[index];
      const [x2, y2] = ring[previous];
      if (y1 > point[1] !== y2 > point[1] && point[0] < ((x2 - x1) * (point[1] - y1)) / (y2 - y1) + x1) {
        inside = !inside;
      }
    }
    return inside;
  }

  function pointInFeature(point, feature) {
    return geometryPolygons(feature?.geometry).some(
      (polygon) => pointInRing(point, polygon[0]) && !polygon.slice(1).some((hole) => pointInRing(point, hole))
    );
  }

  function featureCoordinateBounds(feature) {
    const coordinates = geometryPolygons(feature?.geometry).flat(2);
    if (!coordinates.length) return null;
    const longitudes = coordinates.map((point) => Number(point[0])).filter(Number.isFinite);
    const latitudes = coordinates.map((point) => Number(point[1])).filter(Number.isFinite);
    if (!longitudes.length || !latitudes.length) return null;
    return {
      west: Math.min(...longitudes),
      east: Math.max(...longitudes),
      south: Math.min(...latitudes),
      north: Math.max(...latitudes),
    };
  }

  const zoneDisplayGeometryCache = new Map();
  const zonePointSequenceCache = new Map();

  function zoneDisplayGeometry(zoneId) {
    const key = String(zoneId || "");
    if (!zoneDisplayGeometryCache.has(key)) {
      const feature = featureForZone(key);
      zoneDisplayGeometryCache.set(key, { feature, bounds: featureCoordinateBounds(feature) });
    }
    return zoneDisplayGeometryCache.get(key);
  }

  function stableHash(value) {
    let hash = 2166136261;
    for (const character of String(value)) {
      hash ^= character.charCodeAt(0);
      hash = Math.imul(hash, 16777619) >>> 0;
    }
    return hash >>> 0;
  }

  function hashUnit(hash) {
    let value = hash >>> 0;
    value ^= value >>> 16;
    value = Math.imul(value, 0x7feb352d);
    value ^= value >>> 15;
    value = Math.imul(value, 0x846ca68b);
    value ^= value >>> 16;
    return (value >>> 0) / 4294967296;
  }

  function candidatePointInsideZone(feature, bounds, seed) {
    for (let attempt = 0; attempt < 48; attempt += 1) {
      const longitudeHash = seed + Math.imul(attempt + 1, 0x9e3779b9);
      const latitudeHash = seed ^ Math.imul(attempt + 1, 0x85ebca6b);
      const longitude = bounds.west + (bounds.east - bounds.west) * hashUnit(longitudeHash);
      const latitude = bounds.south + (bounds.north - bounds.south) * hashUnit(latitudeHash);
      if (pointInFeature([longitude, latitude], feature)) return [latitude, longitude];
    }
    return null;
  }

  function stablePointInsideZone(zoneId, identity, kind, generation = 0, slot = null) {
    const { feature, bounds } = zoneDisplayGeometry(zoneId);
    if (!feature || !bounds) return zoneCentroidLatLng(zoneId);
    if (!Number.isInteger(slot) || slot < 0) {
      return candidatePointInsideZone(feature, bounds, stableHash(`${kind}:${identity}:${generation}:${zoneId}`)) || zoneCentroidLatLng(zoneId);
    }
    const sequenceKey = `${kind}:${zoneId}`;
    if (!zonePointSequenceCache.has(sequenceKey)) zonePointSequenceCache.set(sequenceKey, []);
    const sequence = zonePointSequenceCache.get(sequenceKey);
    const longitudeScale = Math.max(0.35, Math.cos((((bounds.south + bounds.north) / 2) * Math.PI) / 180));
    while (sequence.length <= slot) {
      const ordinal = sequence.length;
      let bestPoint = null;
      let bestSpacing = -1;
      for (let candidateIndex = 0; candidateIndex < 10; candidateIndex += 1) {
        const candidate = candidatePointInsideZone(feature, bounds, stableHash(`${sequenceKey}:${ordinal}:${candidateIndex}`));
        if (!candidate) continue;
        let nearestSpacing = Number.POSITIVE_INFINITY;
        for (const previous of sequence) {
          const deltaX = (candidate[1] - previous[1]) * longitudeScale;
          const deltaY = candidate[0] - previous[0];
          nearestSpacing = Math.min(nearestSpacing, deltaX * deltaX + deltaY * deltaY);
        }
        if (nearestSpacing > bestSpacing) {
          bestPoint = candidate;
          bestSpacing = nearestSpacing;
        }
      }
      sequence.push(bestPoint || zoneCentroidLatLng(zoneId));
    }
    return sequence[slot];
  }

  function mapAgentId(kind, index) {
    return kind === "citizen" ? `c-${String(index + 1).padStart(5, "0")}` : `e-${String(index + 1).padStart(4, "0")}`;
  }

  function frameArray(value) {
    return ArrayBuffer.isView(value) || Array.isArray(value) ? value : [];
  }

  function createAgentCanvasLayer() {
    if (!window.L?.Layer || !state.map) return null;
    const AgentCanvasLayer = window.L.Layer.extend({
      initialize() {
        this.frame = null;
        this.visible = false;
        this.points = [];
        this.positionCache = new Map();
        this.positionSlotCache = new Map();
        this.nextPositionSlot = new Map();
        this.grid = new Map();
        this.hoveredKey = null;
        this.keyboardKey = null;
        this.drawRequest = null;
        this.zooming = false;
        this.drawCenter = null;
        this.drawZoom = null;
        this.drawPosition = null;
        this.tooltip = null;
      },
      onAdd(map) {
        this.map = map;
        this.canvas = window.L.DomUtil.create("canvas", "leaflet-zoom-animated udes-v2-agent-canvas");
        this.canvas.tabIndex = 0;
        this.canvas.setAttribute("role", "application");
        this.canvas.setAttribute("aria-describedby", "udes-v2-map-caption");
        this.canvas.setAttribute("aria-label", this.agentAriaLabel());
        map.getPane("udesV2Agents").appendChild(this.canvas);
        this.container = map.getContainer();
        this.pointerMoveListener = (event) => this.onPointerMove(event);
        this.pointerLeaveListener = () => this.onPointerLeave();
        this.clickListener = (event) => this.onClick(event);
        this.container.addEventListener("mousemove", this.pointerMoveListener);
        this.container.addEventListener("mouseleave", this.pointerLeaveListener);
        this.container.addEventListener("click", this.clickListener, true);
        window.L.DomEvent.on(this.canvas, "keydown", this.onKeyDown, this);
        map.on("move resize", this.scheduleDraw, this);
        map.on("zoomstart", this.onZoomStart, this);
        map.on("zoomanim", this.onZoomAnimation, this);
        map.on("zoomend viewreset", this.onZoomEnd, this);
        this.scheduleDraw();
      },
      onRemove(map) {
        map.off("move resize", this.scheduleDraw, this);
        map.off("zoomstart", this.onZoomStart, this);
        map.off("zoomanim", this.onZoomAnimation, this);
        map.off("zoomend viewreset", this.onZoomEnd, this);
        this.container?.removeEventListener("mousemove", this.pointerMoveListener);
        this.container?.removeEventListener("mouseleave", this.pointerLeaveListener);
        this.container?.removeEventListener("click", this.clickListener, true);
        this.container?.classList.remove("is-agent-hover");
        if (this.drawRequest) cancelAnimationFrame(this.drawRequest);
        this.closeTooltip();
        this.canvas?.remove();
        this.canvas = null;
        this.container = null;
      },
      setFrame(frame) {
        if (this.frame === frame) return;
        this.frame = frame || null;
        this.rebuildPoints();
        this.scheduleDraw();
      },
      setKinds(kinds) {
        const nextKinds = { citizen: kinds?.citizen !== false, enterprise: kinds?.enterprise !== false };
        if (this.kinds?.citizen === nextKinds.citizen && this.kinds?.enterprise === nextKinds.enterprise) return;
        this.kinds = nextKinds;
        this.hoveredKey = null;
        this.keyboardKey = null;
        this.container?.classList.remove("is-agent-hover");
        this.closeTooltip();
        this.scheduleDraw();
      },
      pointVisible(point) {
        return this.kinds?.[point.kind] !== false;
      },
      agentAriaLabel() {
        const kinds = [this.kinds?.citizen !== false ? "citizen" : null, this.kinds?.enterprise !== false ? "enterprise" : null].filter(Boolean);
        if (!kinds.length) return "Agent layers are hidden.";
        const subject = kinds.length === 2 ? "citizen and enterprise" : kinds[0];
        return `Modeled ${subject} agents. Use the arrow keys to move between nearby agents and Enter to inspect.`;
      },
      setVisible(visible) {
        this.visible = Boolean(visible);
        if (this.canvas) {
          this.canvas.hidden = !this.visible;
          this.canvas.tabIndex = this.visible ? 0 : -1;
        }
        if (!this.visible) {
          this.container?.classList.remove("is-agent-hover");
          this.closeTooltip();
        }
        this.scheduleDraw();
      },
      positionSlot(cacheKey, zoneId, kind) {
        if (this.positionSlotCache.has(cacheKey)) return this.positionSlotCache.get(cacheKey);
        const sequenceKey = `${kind}:${zoneId}`;
        const slot = this.nextPositionSlot.get(sequenceKey) || 0;
        this.nextPositionSlot.set(sequenceKey, slot + 1);
        this.positionSlotCache.set(cacheKey, slot);
        return slot;
      },
      onZoomStart() {
        this.zooming = true;
        if (this.drawRequest) {
          cancelAnimationFrame(this.drawRequest);
          this.drawRequest = null;
        }
        this.hoveredKey = null;
        this.container?.classList.remove("is-agent-hover");
        this.closeTooltip();
      },
      onZoomAnimation(event) {
        if (!this.canvas || !this.map || !this.drawCenter || this.drawZoom === null || !this.drawPosition) return;
        const scale = this.map.getZoomScale(event.zoom, this.drawZoom);
        const viewHalf = this.map.getSize().multiplyBy(0.5);
        const drawnCenterPoint = this.map.project(this.drawCenter, event.zoom);
        const targetCenterPoint = this.map.project(event.center, event.zoom);
        const centerOffset = targetCenterPoint.subtract(drawnCenterPoint);
        const position = viewHalf.multiplyBy(-scale).add(this.drawPosition).add(viewHalf).subtract(centerOffset);
        window.L.DomUtil.setTransform(this.canvas, position, scale);
      },
      onZoomEnd() {
        this.zooming = false;
        this.scheduleDraw();
      },
      rebuildPoints() {
        const frame = this.frame;
        if (!frame?.citizens || !frame?.enterprises) {
          this.points = [];
          return;
        }
        const zoneIds = Array.isArray(frame.zoneIds) ? frame.zoneIds : [];
        const noneCode = Number(frame.noneCode ?? 255);
        const citizenStates = frame.codes?.citizenStates || ["Happy", "Waiting", "Extreme", "Recovery"];
        const citizenModes = frame.codes?.citizenModes || ["none", "car", "pt", "walk", "unserved"];
        const citizenLaborForceStatuses = frame.codes?.citizenLaborForceStatuses || ["nonparticipant", "unemployed", "employed"];
        const enterpriseStates = frame.codes?.enterpriseStates || ["Starting", "Working", "Grow", "Lesser"];
        const homeZones = frameArray(frame.citizens.homeZones);
        const workZones = frameArray(frame.citizens.workZones);
        const states = frameArray(frame.citizens.states);
        const modes = frameArray(frame.citizens.modes);
        const laborForceStatuses = frameArray(frame.citizens.laborForceStatuses);
        const generations = frameArray(frame.citizens.generations);
        const points = [];
        for (let index = 0; index < homeZones.length; index += 1) {
          const zoneCode = Number(homeZones[index]);
          const zoneId = zoneCode === noneCode ? null : zoneIds[zoneCode];
          if (!zoneId) continue;
          const id = mapAgentId("citizen", index);
          const generation = Number(generations[index]) || 0;
          const cacheKey = `citizen:${id}:${generation}:${zoneId}`;
          let latlng = this.positionCache.get(cacheKey);
          if (!latlng) {
            latlng = stablePointInsideZone(zoneId, id, "citizen", generation, this.positionSlot(cacheKey, zoneId, "citizen"));
            if (latlng) this.positionCache.set(cacheKey, latlng);
          }
          if (!latlng) continue;
          const workCode = Number(workZones[index]);
          points.push({
            key: `citizen:${id}`,
            kind: "citizen",
            id,
            index,
            zoneId,
            workZoneId: workCode === noneCode ? null : zoneIds[workCode],
            state: citizenStates[Number(states[index])] || "Happy",
            mode: citizenModes[Number(modes[index])] || "none",
            laborForceStatus: citizenLaborForceStatuses[Number(laborForceStatuses[index])] || (workCode === noneCode ? "unemployed" : "employed"),
            generation,
            latlng,
          });
        }
        const enterpriseZones = frameArray(frame.enterprises.zones);
        const enterpriseStateCodes = frameArray(frame.enterprises.states);
        const employeeCounts = frameArray(frame.enterprises.employeeCounts);
        for (let index = 0; index < enterpriseZones.length; index += 1) {
          const zoneCode = Number(enterpriseZones[index]);
          const zoneId = zoneCode === noneCode ? null : zoneIds[zoneCode];
          if (!zoneId) continue;
          const id = mapAgentId("enterprise", index);
          const cacheKey = `enterprise:${id}:${zoneId}`;
          let latlng = this.positionCache.get(cacheKey);
          if (!latlng) {
            latlng = stablePointInsideZone(zoneId, id, "enterprise", 0, this.positionSlot(cacheKey, zoneId, "enterprise"));
            if (latlng) this.positionCache.set(cacheKey, latlng);
          }
          if (!latlng) continue;
          points.push({
            key: `enterprise:${id}`,
            kind: "enterprise",
            id,
            index,
            zoneId,
            state: enterpriseStates[Number(enterpriseStateCodes[index])] || "Working",
            employeeCount: Number(employeeCounts[index]) || 0,
            latlng,
          });
        }
        this.points = points;
      },
      scheduleDraw() {
        if (this.zooming) return;
        if (this.drawRequest) return;
        this.drawRequest = requestAnimationFrame(() => {
          this.drawRequest = null;
          this.draw();
        });
      },
      draw() {
        if (!this.canvas || !this.map || !this.visible || this.zooming) return;
        const size = this.map.getSize();
        const ratio = Math.min(2, window.devicePixelRatio || 1);
        this.canvas.width = Math.max(1, Math.round(size.x * ratio));
        this.canvas.height = Math.max(1, Math.round(size.y * ratio));
        this.canvas.style.width = `${size.x}px`;
        this.canvas.style.height = `${size.y}px`;
        const canvasPosition = this.map.containerPointToLayerPoint([0, 0]);
        window.L.DomUtil.setPosition(this.canvas, canvasPosition);
        this.drawCenter = this.map.getCenter();
        this.drawZoom = this.map.getZoom();
        this.drawPosition = canvasPosition.clone();
        const context = this.canvas.getContext("2d");
        context.setTransform(ratio, 0, 0, ratio, 0, 0);
        context.clearRect(0, 0, size.x, size.y);
        this.grid = new Map();
        const zoom = this.map.getZoom();
        const citizenRadius = zoom >= 13 ? 3.4 : zoom >= 11 ? 2.9 : 2.4;
        const enterpriseRadius = zoom >= 13 ? 5.2 : zoom >= 11 ? 4.4 : 3.8;
        for (const point of this.points) {
          if (!this.pointVisible(point)) {
            point.screen = null;
            continue;
          }
          const screen = this.map.latLngToContainerPoint(point.latlng);
          point.screen = screen;
          if (screen.x < -8 || screen.y < -8 || screen.x > size.x + 8 || screen.y > size.y + 8) continue;
          const cell = `${Math.floor(screen.x / 18)}:${Math.floor(screen.y / 18)}`;
          if (!this.grid.has(cell)) this.grid.set(cell, []);
          this.grid.get(cell).push(point);
          const highlighted =
            point.key === this.hoveredKey || point.key === this.keyboardKey || (state.selected.kind === point.kind && state.selected.id === point.id);
          if (point.kind === "citizen") {
            context.beginPath();
            context.arc(screen.x, screen.y, highlighted ? citizenRadius + 1.8 : citizenRadius, 0, Math.PI * 2);
            context.fillStyle =
              point.state === "Extreme"
                ? palette.red
                : point.state === "Waiting"
                  ? palette.amber
                  : point.state === "Recovery"
                    ? palette.teal
                    : palette.green;
            context.globalAlpha = highlighted ? 1 : 0.92;
            context.fill();
            context.lineWidth = highlighted ? 1.8 : 0.8;
            context.strokeStyle = "#ffffff";
            context.stroke();
          } else {
            const radius = highlighted ? enterpriseRadius + 1.7 : enterpriseRadius;
            context.globalAlpha = highlighted ? 1 : 0.94;
            context.fillStyle = palette.blue;
            context.strokeStyle = "#ffffff";
            context.lineWidth = highlighted ? 2.2 : 1.1;
            context.fillRect(screen.x - radius, screen.y - radius, radius * 2, radius * 2);
            context.strokeRect(screen.x - radius, screen.y - radius, radius * 2, radius * 2);
          }
        }
        context.globalAlpha = 1;
      },
      nearestPoint(containerPoint, maximumDistance = 9) {
        if (this.zooming) return null;
        const cellX = Math.floor(containerPoint.x / 18);
        const cellY = Math.floor(containerPoint.y / 18);
        let nearest = null;
        let nearestDistance = maximumDistance ** 2;
        for (let xOffset = -1; xOffset <= 1; xOffset += 1) {
          for (let yOffset = -1; yOffset <= 1; yOffset += 1) {
            for (const point of this.grid.get(`${cellX + xOffset}:${cellY + yOffset}`) || []) {
              const distance = (point.screen.x - containerPoint.x) ** 2 + (point.screen.y - containerPoint.y) ** 2;
              if (distance <= nearestDistance) {
                nearest = point;
                nearestDistance = distance;
              }
            }
          }
        }
        return nearest;
      },
      pointerPoint(event) {
        if (event?.containerPoint) return event.containerPoint;
        const bounds = this.container?.getBoundingClientRect() || this.canvas.getBoundingClientRect();
        return window.L.point(event.clientX - bounds.left, event.clientY - bounds.top);
      },
      tooltipHtml(point) {
        if (point.kind === "citizen") {
          const laborLabel =
            point.laborForceStatus === "nonparticipant"
              ? "Outside modeled labor force"
              : point.laborForceStatus === "unemployed"
                ? "Active job seeker"
                : "Employed";
          const work = point.workZoneId ? zoneLabel(point.workZoneId) : laborLabel;
          return `<strong>${escapeHtml(point.id)} · citizen agent</strong><span>Lives: ${escapeHtml(zoneLabel(point.zoneId))} · works: ${escapeHtml(
            work
          )}</span><span>${escapeHtml(laborLabel)} · ${escapeHtml(point.state)} · ${escapeHtml(
            humanizeEvent(point.mode)
          )}</span><span>Represents ${escapeHtml(formatNumber(this.frame?.citizenWeight || 1))} residents</span>`;
        }
        return `<strong>${escapeHtml(point.id)} · enterprise agent</strong><span>${escapeHtml(zoneLabel(point.zoneId))} · ${escapeHtml(
          point.state
        )}</span><span>${escapeHtml(formatNumber(point.employeeCount))} modeled employee agents</span>`;
      },
      showTooltip(point) {
        if (!point || !this.map) return;
        if (!this.tooltip) this.tooltip = window.L.tooltip({ className: "udes-v2-agent-tooltip", direction: "top", opacity: 0.98 });
        this.tooltip.setLatLng(point.latlng).setContent(this.tooltipHtml(point)).openOn(this.map);
        this.canvas?.setAttribute("aria-label", `${point.id}, ${point.kind} agent in ${zoneLabel(point.zoneId)}. Press Enter to inspect.`);
      },
      closeTooltip() {
        if (this.tooltip && this.map) this.map.closeTooltip(this.tooltip);
        if (this.canvas) {
          this.canvas.setAttribute("aria-label", this.agentAriaLabel());
        }
      },
      onPointerMove(event) {
        if (!this.visible || event.target?.closest?.(".leaflet-control")) return;
        const point = this.nearestPoint(this.pointerPoint(event));
        const nextKey = point?.key || null;
        if (nextKey === this.hoveredKey) return;
        this.hoveredKey = nextKey;
        this.container?.classList.toggle("is-agent-hover", Boolean(point));
        if (point) this.showTooltip(point);
        else this.closeTooltip();
        this.scheduleDraw();
      },
      onPointerLeave() {
        this.hoveredKey = null;
        this.container?.classList.remove("is-agent-hover");
        if (!this.keyboardKey) this.closeTooltip();
        this.scheduleDraw();
      },
      onClick(event) {
        if (
          !this.visible ||
          event.target?.closest?.("a, button, .leaflet-control, .udes-v2-road-feature, .udes-v2-commute-flow-feature, .udes-v2-zone-label")
        )
          return;
        const point = this.nearestPoint(this.pointerPoint(event), 5);
        if (!point) return;
        event.preventDefault();
        event.stopImmediatePropagation();
        selectObject(point.kind, point.id);
      },
      directionalPoint(current, key) {
        if (!current?.screen) return this.points.find((point) => point.screen) || null;
        const direction = {
          ArrowLeft: [-1, 0],
          ArrowRight: [1, 0],
          ArrowUp: [0, -1],
          ArrowDown: [0, 1],
        }[key];
        let best = null;
        let bestScore = Infinity;
        for (const candidate of this.points) {
          if (!this.pointVisible(candidate) || !candidate.screen || candidate === current) continue;
          const dx = candidate.screen.x - current.screen.x;
          const dy = candidate.screen.y - current.screen.y;
          const forward = dx * direction[0] + dy * direction[1];
          if (forward <= 0) continue;
          const sideways = Math.abs(dx * direction[1] - dy * direction[0]);
          const score = forward + sideways * 2.4;
          if (score < bestScore) {
            best = candidate;
            bestScore = score;
          }
        }
        return best || current;
      },
      onKeyDown(event) {
        if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Enter", " ", "Escape"].includes(event.key)) return;
        event.preventDefault();
        if (event.key === "Escape") {
          this.keyboardKey = null;
          this.closeTooltip();
          this.scheduleDraw();
          return;
        }
        const current =
          this.points.find((point) => point.key === this.keyboardKey && this.pointVisible(point) && point.screen) ||
          this.points.find((point) => this.pointVisible(point) && point.screen);
        if (!current) return;
        if (["Enter", " "].includes(event.key)) {
          selectObject(current.kind, current.id);
          return;
        }
        const next = this.directionalPoint(current, event.key);
        this.keyboardKey = next.key;
        this.showTooltip(next);
        this.scheduleDraw();
      },
    });
    return new AgentCanvasLayer();
  }

  function offsetAgentLatLng(latlng, kind) {
    const [latitude, longitude] = latlng;
    const longitudeScale = Math.max(0.35, Math.cos((latitude * Math.PI) / 180));
    const eastWestOffset = 0.0042 / longitudeScale;
    return kind === "citizen" ? [latitude + 0.0012, longitude - eastWestOffset] : [latitude - 0.0012, longitude + eastWestOffset];
  }

  function stableAgentLatLng(latlng, id, kind) {
    let hash = kind === "citizen" ? 2166136261 : 16777619;
    for (const character of String(id || kind)) {
      hash ^= character.charCodeAt(0);
      hash = Math.imul(hash, 16777619) >>> 0;
    }
    const angle = ((hash % 360) * Math.PI) / 180;
    const radius = 0.0012 + ((hash >>> 9) % 5) * 0.00042;
    const longitudeScale = Math.max(0.35, Math.cos((latlng[0] * Math.PI) / 180));
    return [latlng[0] + Math.sin(angle) * radius, latlng[1] + (Math.cos(angle) * radius) / longitudeScale];
  }

  function mapLayerVisible(layer, visible) {
    if (!state.map || !layer) return;
    const isVisible = state.map.hasLayer(layer);
    if (visible && !isVisible) layer.addTo(state.map);
    else if (!visible && isVisible) state.map.removeLayer(layer);
  }

  function activeEnterpriseCount(zone, normalized) {
    const activeShare = percentToRatio(valueAt(zone, ["activeEnterpriseSharePercent"], 100));
    return Math.max(0, Math.round(normalized.enterprises * activeShare));
  }

  function representativeAgentEntries(kind) {
    const citizenWeight = Math.max(1, Number(state.dataset?.calibration?.citizenAgentPersonsRecommended) || 250);
    const mapSamples = Array.isArray(state.snapshot?.mapAgents?.[`${kind}s`]) ? state.snapshot.mapAgents[`${kind}s`] : [];
    if (mapSamples.length) {
      return mapSamples
        .map((sample) => {
          const zoneId = String(kind === "citizen" ? sample.homeZoneId || "" : sample.zoneId || "");
          const centroid = zoneCentroidLatLng(zoneId);
          if (!zoneId || !centroid) return null;
          const name = zoneLabel(zoneId);
          if (kind === "citizen") {
            const laborLabel =
              sample.laborForceStatus === "nonparticipant"
                ? "outside modeled labor force"
                : sample.laborForceStatus === "unemployed"
                  ? "active job seeker"
                  : "employed";
            const workLabel = sample.workZoneId ? zoneLabel(sample.workZoneId) : laborLabel;
            return {
              key: `citizen:${sample.id}`,
              kind,
              zoneId,
              latlng: stableAgentLatLng(centroid, sample.id, kind),
              radius: 4.2,
              representativeId: sample.id,
              ariaLabel: `${sample.id}: citizen agent living in ${name}, working in ${workLabel}`,
              tooltip: `<strong>${escapeHtml(sample.id)} · citizen agent</strong><span>Lives: ${escapeHtml(name)} · works: ${escapeHtml(
                workLabel
              )}</span><span>${escapeHtml(humanizeEvent(laborLabel))} · ${escapeHtml(humanizeEvent(sample.state || "unknown"))} · ${escapeHtml(
                humanizeEvent(sample.mode || "none")
              )} · represents ${escapeHtml(formatNumber(sample.weight || citizenWeight))} residents</span>`,
            };
          }
          return {
            key: `enterprise:${sample.id}`,
            kind,
            zoneId,
            latlng: stableAgentLatLng(centroid, sample.id, kind),
            radius: 4.5,
            representativeId: sample.id,
            ariaLabel: `${sample.id}: enterprise agent located in ${name}`,
            tooltip: `<strong>${escapeHtml(sample.id)} · enterprise agent</strong><span>Located: ${escapeHtml(name)} · ${escapeHtml(
              humanizeEvent(sample.state || "unknown")
            )}</span><span>${escapeHtml(formatNumber(sample.employeeAgentCount || 0))} modeled employees · ${escapeHtml(
              formatNumber(sample.representedEmployees || 0)
            )} represented</span>`,
          };
        })
        .filter(Boolean);
    }
    const samples = samplesOf(kind);
    return zonesOf()
      .map((rawZone) => {
        const baseline = baselineZone(rawZone.id || rawZone.zoneId) || {};
        const zone = normalizeZone(rawZone, baseline);
        const centroid = zoneCentroidLatLng(zone.id);
        if (!centroid) return null;
        const representative = samples.find((sample) => {
          const sampleZoneId = kind === "citizen" ? sample.homeZoneId || sample.livingZoneId : sample.zoneId;
          if (String(sampleZoneId) !== String(zone.id)) return false;
          return kind !== "enterprise" || textAt(sample, ["status", "state"], "Working") !== "Starting";
        });
        if (kind === "citizen") {
          const agentCount = Math.max(0, Math.round(zone.population / citizenWeight));
          if (!agentCount) return null;
          return {
            key: `citizen:${zone.id}`,
            kind,
            zoneId: String(zone.id),
            latlng: offsetAgentLatLng(centroid, kind),
            radius: Math.min(11, 4.5 + Math.sqrt(agentCount) / 7),
            representativeId: representative?.id || null,
            ariaLabel: `${zone.name}: ${formatNumber(agentCount)} citizen agents representing ${formatNumber(zone.population)} residents`,
            tooltip: `<strong>${escapeHtml(zone.name)} · citizen agents</strong><span>${escapeHtml(
              formatNumber(agentCount)
            )} agents represent ${escapeHtml(formatNumber(zone.population))} residents</span><span>${escapeHtml(
              formatPercent(zone.satisfaction)
            )} satisfied · ${escapeHtml(zone.commute.toFixed(1))} min mean round trip</span>`,
          };
        }
        const activeCount = activeEnterpriseCount(rawZone, zone);
        if (!activeCount) return null;
        return {
          key: `enterprise:${zone.id}`,
          kind,
          zoneId: String(zone.id),
          latlng: offsetAgentLatLng(centroid, kind),
          radius: Math.min(10, 4.5 + Math.sqrt(activeCount) / 2.2),
          representativeId: representative?.id || null,
          ariaLabel: `${zone.name}: ${formatNumber(activeCount)} active enterprise agents`,
          tooltip: `<strong>${escapeHtml(zone.name)} · enterprises</strong><span>${escapeHtml(formatNumber(activeCount))} active of ${escapeHtml(
            formatNumber(zone.enterprises)
          )} enterprise agents</span><span>${escapeHtml(formatCompact(zone.jobs))} represented jobs · ${escapeHtml(
            formatCompact(zone.vacancies)
          )} vacancies</span>`,
        };
      })
      .filter(Boolean);
  }

  function representativeAgentStyle(kind) {
    return kind === "citizen"
      ? {
          pane: "udesV2Agents",
          renderer: state.mapRenderers.agents,
          color: "#ffffff",
          weight: 1.8,
          fillColor: palette.green,
          fillOpacity: 0.92,
          opacity: 1,
        }
      : {
          pane: "udesV2Agents",
          renderer: state.mapRenderers.agents,
          color: palette.amber,
          weight: 2.2,
          fillColor: "#ffffff",
          fillOpacity: 0.96,
          opacity: 1,
        };
  }

  function removeRepresentativeAgentLayer(marker, registry, layerGroup) {
    const key = marker?.udesV2Entry?.key;
    if (!key) return;
    if (state.hoveredMapFeatureKey === key || state.focusedMapFeatureKey === key) {
      marker.udesV2PendingRemoval = true;
      return;
    }
    layerGroup.removeLayer(marker);
    registry.delete(key);
    marker.udesV2PendingRemoval = false;
  }

  function syncRepresentativeAgentMarkers(kind) {
    const registryKey = kind === "citizen" ? "citizenAgents" : "enterpriseAgents";
    const registry = state.mapFeatures[registryKey];
    const layerGroup = state.layers[registryKey];
    if (!registry || !layerGroup || !window.L) return;
    const activeKeys = new Set();
    for (const entry of representativeAgentEntries(kind)) {
      activeKeys.add(entry.key);
      let marker = registry.get(entry.key);
      if (!marker) {
        marker = window.L.circleMarker(entry.latlng, representativeAgentStyle(kind)).addTo(layerGroup);
        marker.bindTooltip(entry.tooltip, { className: "udes-v2-agent-tooltip", direction: "top", sticky: true, opacity: 0.98 });
        marker.on({
          mouseover: () => {
            state.hoveredMapFeatureKey = entry.key;
            marker.udesV2Signature = null;
            marker.setStyle({ weight: kind === "citizen" ? 3 : 3.2, fillOpacity: 1 });
            marker.bringToFront?.();
          },
          mouseout: () => {
            const key = marker.udesV2Entry?.key || entry.key;
            if (state.hoveredMapFeatureKey === key) state.hoveredMapFeatureKey = null;
            if (marker.udesV2PendingRemoval) marker.udesV2RemoveWhenIdle?.();
            updateAgentMapLayers();
          },
          click: () => {
            const current = marker.udesV2Entry;
            if (current?.representativeId) selectObject(kind, current.representativeId);
            else if (current?.zoneId) selectObject("zone", current.zoneId);
          },
        });
        registry.set(entry.key, marker);
      }
      marker.udesV2Entry = entry;
      marker.udesV2PendingRemoval = false;
      marker.udesV2RemoveWhenIdle = () => removeRepresentativeAgentLayer(marker, registry, layerGroup);
      const signature = JSON.stringify([entry.latlng, entry.radius, entry.tooltip]);
      if (state.hoveredMapFeatureKey !== entry.key && state.focusedMapFeatureKey !== entry.key && marker.udesV2Signature !== signature) {
        marker.setLatLng(entry.latlng);
        marker.setRadius(entry.radius);
        marker.setStyle(representativeAgentStyle(kind));
        marker.setTooltipContent(entry.tooltip);
        marker.udesV2Signature = signature;
      }
    }
    for (const [key, marker] of registry.entries()) {
      if (activeKeys.has(key)) continue;
      removeRepresentativeAgentLayer(marker, registry, layerGroup);
    }
  }

  function fallbackCommuteRouteLatLngs(fromZoneId, toZoneId) {
    const from = zoneCentroidLatLng(fromZoneId);
    const to = zoneCentroidLatLng(toZoneId);
    if (!from || !to) return null;
    const latitudeDelta = to[0] - from[0];
    const longitudeDelta = to[1] - from[1];
    const length = Math.max(0.0001, Math.hypot(latitudeDelta, longitudeDelta));
    const bend = Math.min(0.014, length * 0.12);
    const midpoint = [(from[0] + to[0]) / 2 - (longitudeDelta / length) * bend, (from[1] + to[1]) / 2 + (latitudeDelta / length) * bend];
    return [from, midpoint, to];
  }

  function roadGraphEdges() {
    return state.dataset?.roadGraph?.segments || state.dataset?.roadGraph?.edges || [];
  }

  function roadGraphNodeIdsForZone(zoneId) {
    const accesses = state.dataset?.roadGraph?.zoneAccess || [];
    const accessNodeIds = accesses
      .filter((access) => String(access.zoneId) === String(zoneId))
      .sort((left, right) => (Number(right.weight) || 0) - (Number(left.weight) || 0))
      .map((access) => String(access.nodeId || access.node || ""))
      .filter(Boolean);
    if (accessNodeIds.length) return accessNodeIds;
    const zone = (state.dataset?.zones || []).find((entry) => String(entry.id || entry.zoneId || "") === String(zoneId));
    const zoneNodeId = String(zone?.networkNodeId || zone?.roadNodeId || "");
    if (zoneNodeId) return [zoneNodeId];
    return (state.dataset?.roadGraph?.nodes || [])
      .filter((node) => String(node.zoneId || "") === String(zoneId))
      .map((node) => String(node.id || node.nodeId || ""))
      .filter(Boolean);
  }

  function roadFeature(id) {
    return state.geo.roads?.features?.find((feature) => String(feature.id || feature.properties?.id || "") === String(id || ""));
  }

  function roadEdgeGeometry(edge, direction) {
    const feature = roadFeature(edge.geometryFeatureId || edge.id);
    const geometry = feature?.geometry || edge.geometry;
    let coordinates =
      geometry?.type === "LineString" ? geometry.coordinates : geometry?.type === "MultiLineString" ? geometry.coordinates.flat() : [];
    if (!coordinates.length) return [];
    if (direction < 0) coordinates = [...coordinates].reverse();
    return coordinates.map((coordinate) => [Number(coordinate[1]), Number(coordinate[0])]);
  }

  function roadEdgeTravelMinutes(edge, direction) {
    const current = roadSnapshot(edge.id) || {};
    if (direction > 0) return valueAt(current, ["travelTimeABMin"], valueAt(edge, ["freeFlowMinutesAB", "freeFlowMinutes"], 1));
    return valueAt(current, ["travelTimeBAMin"], valueAt(edge, ["freeFlowMinutesBA", "freeFlowMinutes"], 1));
  }

  function commuteRoadPath(fromZoneId, toZoneId) {
    const startIds = roadGraphNodeIdsForZone(fromZoneId);
    const destinationIds = new Set(roadGraphNodeIdsForZone(toZoneId));
    const edges = roadGraphEdges();
    if (!startIds.length || !destinationIds.size || !edges.length) {
      return { latlngs: fallbackCommuteRouteLatLngs(fromZoneId, toZoneId), roadNames: [] };
    }
    const adjacency = new Map();
    const addArc = (from, to, edge, direction) => {
      if (!adjacency.has(from)) adjacency.set(from, []);
      adjacency.get(from).push({ to, edge, direction });
    };
    for (const edge of edges) {
      const from = String(edge.fromNodeId || edge.from || "");
      const to = String(edge.toNodeId || edge.to || "");
      if (!from || !to) continue;
      const oneWay = String(edge.oneway ?? edge.oneWay ?? "").toLowerCase();
      let allowAB = edge.allowAB !== false;
      let allowBA = edge.allowBA !== false && edge.bidirectional !== false;
      if (["-1", "reverse", "backward"].includes(oneWay)) {
        allowAB = false;
        allowBA = true;
      } else if (["1", "yes", "true", "forward"].includes(oneWay)) {
        allowAB = true;
        allowBA = false;
      }
      if (allowAB) addArc(from, to, edge, 1);
      if (allowBA) addArc(to, from, edge, -1);
    }
    const distances = new Map(startIds.map((id) => [id, 0]));
    const previous = new Map();
    const unvisited = new Set([...adjacency.keys(), ...[...adjacency.values()].flatMap((arcs) => arcs.map((arc) => arc.to))]);
    let destination = null;
    while (unvisited.size) {
      let current = null;
      let currentDistance = Infinity;
      for (const nodeId of unvisited) {
        const distance = distances.get(nodeId) ?? Infinity;
        if (distance < currentDistance) {
          current = nodeId;
          currentDistance = distance;
        }
      }
      if (current == null || !Number.isFinite(currentDistance)) break;
      unvisited.delete(current);
      if (destinationIds.has(current)) {
        destination = current;
        break;
      }
      for (const arc of adjacency.get(current) || []) {
        if (!unvisited.has(arc.to)) continue;
        const candidate = currentDistance + roadEdgeTravelMinutes(arc.edge, arc.direction);
        if (candidate < (distances.get(arc.to) ?? Infinity)) {
          distances.set(arc.to, candidate);
          previous.set(arc.to, { from: current, ...arc });
        }
      }
    }
    if (!destination) return { latlngs: fallbackCommuteRouteLatLngs(fromZoneId, toZoneId), roadNames: [] };
    const path = [];
    let cursor = destination;
    while (previous.has(cursor)) {
      const step = previous.get(cursor);
      path.unshift(step);
      cursor = step.from;
    }
    const latlngs = [];
    const roadNames = [];
    for (const step of path) {
      const coordinates = roadEdgeGeometry(step.edge, step.direction);
      if (latlngs.length && coordinates.length) coordinates.shift();
      latlngs.push(...coordinates);
      const name = step.edge.primaryRoad || step.edge.roadNameEn || step.edge.name;
      const displayClass = String(step.edge.displayClass || "");
      const isNamedVisibleRoad =
        step.edge.modelVisible !== false &&
        step.edge.contextOnly !== true &&
        step.edge.loadBearing !== false &&
        ["arterial", "gateway"].includes(displayClass) &&
        name &&
        !/^unnamed\b|^zone access\b/i.test(String(name));
      if (isNamedVisibleRoad && !roadNames.includes(name)) roadNames.push(name);
    }
    return {
      latlngs: latlngs.length > 1 ? latlngs : fallbackCommuteRouteLatLngs(fromZoneId, toZoneId),
      roadNames: roadNames.slice(0, 4),
    };
  }

  function commuteFlowStyle(entry, maximum) {
    const strength = Math.sqrt(entry.value / Math.max(1, maximum));
    const selectedZoneId = state.selected.kind === "zone" ? String(state.selected.id) : "";
    const selected = selectedZoneId && [entry.fromZoneId, entry.toZoneId].includes(selectedZoneId);
    return {
      className: "udes-v2-commute-flow-feature",
      pane: "udesV2CommuteFlows",
      renderer: state.mapRenderers.commuteFlows,
      color: selected ? palette.teal : palette.blue,
      weight: 0.8 + strength * 2.8 + (selected ? 0.6 : 0),
      opacity: selected ? 0.82 : 0.2 + strength * 0.34,
      dashArray: "3 6",
      lineCap: "round",
      lineJoin: "round",
    };
  }

  function commuteArcLatLngs(fromZoneId, toZoneId) {
    const start = zoneCentroidLatLng(fromZoneId);
    const end = zoneCentroidLatLng(toZoneId);
    if (!start || !end) return fallbackCommuteRouteLatLngs(fromZoneId, toZoneId);
    const midLatitude = (start[0] + end[0]) / 2;
    const longitudeScale = Math.max(0.35, Math.cos((midLatitude * Math.PI) / 180));
    const deltaX = (end[1] - start[1]) * longitudeScale;
    const deltaY = end[0] - start[0];
    const distance = Math.hypot(deltaX, deltaY);
    if (distance < 1e-6) return [start, end];
    const bend = Math.min(0.035, distance * 0.16);
    const controlLatitude = midLatitude + (deltaX / distance) * bend;
    const controlLongitude = (start[1] + end[1]) / 2 - (deltaY / distance / longitudeScale) * bend;
    const latlngs = [];
    for (let index = 0; index <= 24; index += 1) {
      const t = index / 24;
      const inverse = 1 - t;
      latlngs.push([
        inverse * inverse * start[0] + 2 * inverse * t * controlLatitude + t * t * end[0],
        inverse * inverse * start[1] + 2 * inverse * t * controlLongitude + t * t * end[1],
      ]);
    }
    return latlngs;
  }

  function removeCommuteFlowLayer(line) {
    const key = line?.udesV2Entry?.key;
    if (!key) return;
    if (state.hoveredMapFeatureKey === key || state.focusedMapFeatureKey === key) {
      line.udesV2PendingRemoval = true;
      return;
    }
    state.layers.commuteFlows?.removeLayer(line);
    state.mapFeatures.commuteFlows.delete(key);
    line.udesV2PendingRemoval = false;
  }

  function syncMapFeatureAccessibility(layer) {
    const element = layer?.getElement?.();
    const entry = layer?.udesV2Entry;
    if (!element || !entry) return;
    element.setAttribute("role", "button");
    element.setAttribute("tabindex", "0");
    element.setAttribute("aria-label", entry.ariaLabel || entry.key);
    if (layer.udesV2KeyboardElement === element) return;
    element.addEventListener("keydown", (event) => {
      if (!["Enter", " "].includes(event.key)) return;
      event.preventDefault();
      layer.fire("click");
    });
    element.addEventListener("focus", () => {
      const key = layer.udesV2Entry?.key;
      if (!key) return;
      state.focusedMapFeatureKey = key;
      layer.openTooltip?.();
    });
    element.addEventListener("blur", () => {
      const key = layer.udesV2Entry?.key;
      if (state.focusedMapFeatureKey === key) state.focusedMapFeatureKey = null;
      layer.closeTooltip?.();
      if (layer.udesV2PendingRemoval) (layer.udesV2RemoveWhenIdle || removeCommuteFlowLayer)(layer);
      updateAgentMapLayers();
    });
    layer.udesV2KeyboardElement = element;
  }

  function syncCommuteFlowLayers() {
    const registry = state.mapFeatures.commuteFlows;
    const layerGroup = state.layers.commuteFlows;
    if (!registry || !layerGroup || !window.L) return;
    const entries = topInterDistrictCommutes(state.snapshot?.commuteOd, 18)
      .map((route) => {
        return {
          ...route,
          latlngs: commuteArcLatLngs(route.fromZoneId, route.toZoneId),
          roadNames: [],
          key: `commute:${route.fromZoneId}:${route.toZoneId}`,
        };
      })
      .filter((route) => route.latlngs);
    const maximum = Math.max(1, ...entries.map((entry) => entry.value));
    const activeKeys = new Set();
    for (const entry of entries) {
      activeKeys.add(entry.key);
      entry.ariaLabel = `${zoneLabel(entry.fromZoneId)} to ${zoneLabel(entry.toZoneId)}: ${formatNumber(
        entry.value
      )} represented workers in the current home-to-work stock. This is not a daily trip count. Activate to inspect the home district.`;
      const tooltip = `<strong>${escapeHtml(zoneLabel(entry.fromZoneId))} → ${escapeHtml(zoneLabel(entry.toZoneId))}</strong><span>${escapeHtml(
        formatNumber(entry.value)
      )} represented workers</span><span>Current home-to-work relationship · not daily road traffic</span>`;
      let line = registry.get(entry.key);
      if (!line) {
        line = window.L.polyline(entry.latlngs, commuteFlowStyle(entry, maximum)).addTo(layerGroup);
        line.bindTooltip(tooltip, { className: "udes-v2-agent-tooltip", sticky: true, opacity: 0.98 });
        line.on({
          mouseover: () => {
            state.hoveredMapFeatureKey = entry.key;
            line.udesV2Signature = null;
            line.setStyle({ color: palette.teal, opacity: 1, weight: Number(line.options.weight || 1) + 1.3 });
            line.bringToFront?.();
          },
          mouseout: () => {
            const key = line.udesV2Entry?.key || entry.key;
            if (state.hoveredMapFeatureKey === key) state.hoveredMapFeatureKey = null;
            if (line.udesV2PendingRemoval) removeCommuteFlowLayer(line);
            updateAgentMapLayers();
          },
          click: () => selectObject("zone", line.udesV2Entry?.fromZoneId),
        });
        registry.set(entry.key, line);
      }
      line.udesV2Entry = entry;
      line.udesV2PendingRemoval = false;
      const signature = JSON.stringify([entry.latlngs, entry.value, maximum, state.selected.kind === "zone" ? state.selected.id : null]);
      if (state.hoveredMapFeatureKey !== entry.key && state.focusedMapFeatureKey !== entry.key && line.udesV2Signature !== signature) {
        line.setLatLngs(entry.latlngs);
        line.setStyle(commuteFlowStyle(entry, maximum));
        line.setTooltipContent(tooltip);
        line.udesV2Signature = signature;
      }
    }
    for (const [key, line] of registry.entries()) {
      if (activeKeys.has(key)) continue;
      removeCommuteFlowLayer(line);
    }
  }

  function updateAgentMapLayers() {
    if (!state.map) return;
    const visible = state.mapMode === "agents";
    const showCitizens = visible && state.agentVisibility.citizens;
    const showEnterprises = visible && state.agentVisibility.enterprises;
    const showFlows = visible && state.agentVisibility.flows;
    const fullFrameAvailable = Boolean(state.snapshot?.mapFrame?.citizens && state.snapshot?.mapFrame?.enterprises && state.agentCanvas);
    if (visible) {
      syncCommuteFlowLayers();
      if (fullFrameAvailable) {
        state.agentCanvas.setFrame(state.snapshot.mapFrame);
        state.agentCanvas.setKinds({ citizen: showCitizens, enterprise: showEnterprises });
      } else {
        syncRepresentativeAgentMarkers("citizen");
        syncRepresentativeAgentMarkers("enterprise");
      }
    } else {
      state.hoveredMapFeatureKey = null;
      state.focusedMapFeatureKey = null;
      state.mapFeatures.commuteFlows.forEach((line) => {
        line.udesV2Signature = null;
      });
      state.mapFeatures.citizenAgents.forEach((marker) => {
        marker.udesV2Signature = null;
      });
      state.mapFeatures.enterpriseAgents.forEach((marker) => {
        marker.udesV2Signature = null;
      });
    }
    mapLayerVisible(state.layers.commuteFlows, showFlows);
    mapLayerVisible(state.layers.citizenAgents, showCitizens && !fullFrameAvailable);
    mapLayerVisible(state.layers.enterpriseAgents, showEnterprises && !fullFrameAvailable);
    state.agentCanvas?.setVisible(fullFrameAvailable && (showCitizens || showEnterprises));
    if (visible) {
      const registries = [
        ...(fullFrameAvailable || !showCitizens ? [] : [state.mapFeatures.citizenAgents]),
        ...(fullFrameAvailable || !showEnterprises ? [] : [state.mapFeatures.enterpriseAgents]),
        ...(showFlows ? [state.mapFeatures.commuteFlows] : []),
      ];
      for (const registry of registries) {
        registry.forEach((layer) => {
          syncMapFeatureAccessibility(layer);
        });
      }
    }
  }

  function roadSnapshot(id) {
    const current = linksOf().find((link) => String(link.id || link.linkId) === String(id));
    const feature = roadFeature(id);
    if (!feature?.properties) return current;
    return { ...feature.properties, ...(current || {}), id: current?.id || feature.properties.id || feature.id };
  }

  function linkLoad(link = {}) {
    const direct = valueAt(link, ["loadRatio", "roadLoad", "volumeCapacityRatio", "utilization"], Number.NaN);
    if (Number.isFinite(direct)) return direct;
    return Math.max(valueAt(link, ["volumeCapacityAB"], 0), valueAt(link, ["volumeCapacityBA"], 0));
  }

  function roadStyle(feature) {
    const id = feature?.properties?.id || feature?.id;
    const link = roadSnapshot(id) || {};
    const contextOnly = feature?.properties?.contextOnly === true || link.contextOnly === true;
    const load = linkLoad(link);
    const selected = state.selected.kind === "link" && String(state.selected.id) === String(id);
    if (contextOnly) {
      return {
        className: "udes-v2-road-feature",
        pane: "udesV2Roads",
        renderer: state.mapRenderers.roads,
        color: "#7f8c89",
        weight: selected ? 2.4 : 1.25,
        opacity: state.mapMode === "network" ? 0.72 : 0.38,
        dashArray: "4 5",
        lineCap: "round",
      };
    }
    return {
      className: "udes-v2-road-feature",
      pane: "udesV2Roads",
      renderer: state.mapRenderers.roads,
      color: load > 0.9 ? palette.red : load > 0.65 ? palette.amber : palette.green,
      weight: selected ? 5 : Math.max(1.4, 2 + load * 2.2),
      opacity: state.mapMode === "network" ? 0.86 : state.mapMode === "agents" ? 0.76 : 0.34,
    };
  }

  function roadTooltipHtml(feature) {
    const properties = feature?.properties || {};
    const id = properties.id || feature?.id;
    const current = roadSnapshot(id) || {};
    const roadName = properties.primaryRoad || properties.roadNameEn || properties.name || "Modeled arterial";
    const refs = properties.roadRefs || properties.refs || [];
    const roadRefs = (Array.isArray(refs) ? refs.join(", ") : String(refs || properties.ref || "")).trim();
    const ratioAB = valueAt(current, ["volumeCapacityAB"], 0);
    const ratioBA = valueAt(current, ["volumeCapacityBA"], 0);
    const vehiclesAB = valueAt(current, ["loadABVehicles"], 0);
    const vehiclesBA = valueAt(current, ["loadBAVehicles"], 0);
    const lanesObserved = textAt(current, ["sourceClassByField.lanesPerDirection"], "") === "observed";
    const capacityBasis = lanesObserved ? "AD-SDI lane count · modeled per-lane capacity" : "Modeled road-class capacity";
    if (properties.contextOnly === true || current.contextOnly === true) {
      return `<strong>${escapeHtml(roadName)}${
        roadRefs ? ` · ${escapeHtml(roadRefs)}` : ""
      }</strong><span>Map context only · no assigned OD demand</span><span>Shown for orientation; excluded from modeled road load and capacity results.</span>`;
    }
    return `<strong>${escapeHtml(roadName)}${
      roadRefs ? ` · ${escapeHtml(roadRefs)}` : ""
    }</strong><span>Modeled work-trip road load · A→B ${escapeHtml(formatPercent(ratioAB))} · B→A ${escapeHtml(
      formatPercent(ratioBA)
    )}</span><span>${escapeHtml(formatNumber(vehiclesAB))} / ${escapeHtml(formatNumber(vehiclesBA))} assigned vehicles</span><span>${escapeHtml(
      capacityBasis
    )} · activate for assumptions</span>`;
  }

  function renderMapStatus(date = modelDate(), dailyStatus = state.latestDailyStatus || normalizeCity(state.snapshot)) {
    if (!ui.mapStatus) return;
    const districtCount = state.dataset?.zones?.length || 0;
    const corridorCount =
      state.geo.roads?.features?.filter((feature) => isInterDistrictCorridor(feature) && isRenderedAnalysisLink(feature)).length || 0;
    if (state.mapMode === "agents") {
      const citizenWeight = Math.max(1, Number(state.dataset?.calibration?.citizenAgentPersonsRecommended) || 250);
      const zones = zonesOf().map((zone) => ({ raw: zone, normalized: normalizeZone(zone, baselineZone(zone.id || zone.zoneId) || {}) }));
      const citizenAgents = Math.round(zones.reduce((total, zone) => total + zone.normalized.population, 0) / citizenWeight);
      const trackedCitizens =
        Number(state.snapshot?.mapFrame?.citizenCount) || state.snapshot?.mapAgents?.citizens?.length || state.mapFeatures.citizenAgents.size;
      const trackedEnterprises =
        Number(state.snapshot?.mapFrame?.enterpriseCount) ||
        state.snapshot?.mapAgents?.enterprises?.length ||
        state.mapFeatures.enterpriseAgents.size;
      const flowCount = topInterDistrictCommutes(state.snapshot?.commuteOd, 18).length;
      const agentScope = state.snapshot?.mapFrame
        ? `All ${formatNumber(trackedCitizens)} citizen + ${formatNumber(trackedEnterprises)} enterprise agents shown`
        : `${formatNumber(trackedCitizens)} of ${formatNumber(citizenAgents)} citizen agents + ${formatNumber(
            trackedEnterprises
          )} enterprise agents shown`;
      const shownLayers = [
        state.agentVisibility.citizens ? `${formatNumber(trackedCitizens)} citizens` : null,
        state.agentVisibility.enterprises ? `${formatNumber(trackedEnterprises)} enterprises` : null,
        state.agentVisibility.flows ? `${flowCount} strongest home→work links` : null,
      ].filter(Boolean);
      ui.mapStatus.textContent = shownLayers.length
        ? `${shownLayers.join(" + ")} shown · ${state.snapshot?.mapFrame ? "complete agent frame" : agentScope}`
        : "Agent layers hidden · use the legend toggles to restore them";
      return;
    }
    const assignmentDate = parseUtcDate(textAt(dailyStatus, ["networkAssignmentDate", "city.networkAssignmentDate"], ""));
    if (!assignmentDate) {
      ui.mapStatus.textContent = `${districtCount} districts · ${corridorCount} modeled arterial / gateway segments`;
      return;
    }
    const label = new Intl.DateTimeFormat("en-AE", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }).format(assignmentDate);
    const status = textAt(
      dailyStatus,
      ["networkAssignmentStatus"],
      assignmentDate.valueOf() === date.valueOf() ? "current" : "retained-last-workday"
    );
    ui.mapStatus.textContent = `${districtCount} districts · ${corridorCount} modeled arterial / gateway segments · ${
      status === "retained-last-workday" ? `assignment retained from ${label}` : `network assigned ${label}`
    }`;
  }

  function updateMapStyles() {
    const mapModeChanged = state.renderedMapMode !== state.mapMode;
    if (mapModeChanged) {
      const mapMount = $("[data-udes-v2-map]");
      if (mapMount) mapMount.dataset.udesV2MapMode = state.mapMode;
      if (ui.mapLegend) ui.mapLegend.dataset.udesV2MapMode = state.mapMode;
      state.renderedMapMode = state.mapMode;
    }
    state.layers.zones?.setStyle?.(zoneStyle);
    state.layers.roads?.setStyle?.(roadStyle);
    state.layers.roads?.eachLayer?.((layer) => {
      if (layer?.feature && layer.getTooltip?.()) layer.setTooltipContent(roadTooltipHtml(layer.feature));
    });
    updateTransitVisibility();
    updateAgentMapLayers();
    renderMapStatus();
    if (ui.agentLayerToggles) ui.agentLayerToggles.hidden = state.mapMode !== "agents";
    if (ui.mapLegend && mapModeChanged) {
      const legend = {
        network: ["Road load", ["is-low", "Below 65%"], ["is-medium", "65–90%"], ["is-high", "Above 90%"], ["is-context-road", "Context only"]],
        population: ["Resident population", ["is-low", "Lower"], ["is-medium", "Middle"], ["is-high", "Higher"]],
        access: ["Shorter mean commute", ["is-high", "Longer"], ["is-medium", "Middle"], ["is-low", "Shorter"]],
        rent: ["Housing rent", ["is-low", "Lower"], ["is-medium", "Middle"], ["is-high", "Higher"]],
        agents: [
          "Agent symbols",
          ["is-agent-satisfied", "Satisfied"],
          ["is-agent-waiting", "Waiting"],
          ["is-agent-extreme", "Extreme"],
          ["is-agent-recovery", "Recovery"],
          ["is-agent-enterprise", "Enterprise"],
        ],
      }[state.mapMode];
      const strong = $("strong", ui.mapLegend);
      if (strong) strong.textContent = legend[0];
      $$("span", ui.mapLegend).forEach((node, index) => {
        const entry = legend[index + 1];
        node.hidden = !entry;
        if (!entry) return;
        const [className, label] = entry;
        const swatch = $("i", node);
        if (swatch) {
          swatch.className = className;
          node.replaceChildren(swatch, document.createTextNode(label));
        } else {
          node.textContent = label;
        }
      });
    }
  }

  async function selectObject(kind, id) {
    state.selected.kind = kind;
    state.selected.id = id;
    if (kind !== "city" && state.view === "overview" && window.matchMedia("(min-width: 1100px)").matches) {
      setConsoleView("studio", false);
    }
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
    const list = kind === "link" ? (samples.length ? samples : linksOf()).filter(isRenderedAnalysisLink) : samples;
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
    return String(value ?? "Not available")
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
    const samples = kind === "link" ? linksOf().filter(isRenderedAnalysisLink) : samplesOf(kind);
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
        const date = textAt(event, ["date"], Number.isFinite(Number(event.day)) ? `Day ${Number(event.day)}` : "Not available");
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
    let condition = textAt(current, ["financialStatusLabel", "state"], textAt(item, ["state", "status"], "Not available"));
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
      condition = `${textAt(current, ["state"], textAt(item, ["state"], "Not available"))} · ${valueAt(
        current,
        ["operatingMarginPercent"],
        0
      ).toFixed(1)}% margin`;
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
    const nonLaborSupport = valueAt(account, ["nonLaborSupportAed"], valueAt(item, ["monthlyNonLaborSupportAed", "nonLaborSupportAed"], 0));
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
    )}</span>${row("Gross salary", gross)}${nonLaborSupport > 0 ? row("+ Modeled non-labor resources", nonLaborSupport) : ""}${row(
      "− Housing",
      -housing,
      false,
      true
    )}${row("− Commute", -commute, false, true)}${row("Cash after housing + commute", fixedCash, true, fixedCash < 0)}${row(
      "− Essentials",
      -essentials,
      false,
      true
    )}${row("Residual after essentials", residual, true, residual < 0)}${row(
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
      const laborForceStatus = textAt(item, ["laborForceStatus", "financialAccount.laborForceStatus"], item.workZoneId ? "employed" : "unemployed");
      const nonEmploymentLabel = laborForceStatus === "nonparticipant" ? "Outside modeled labor force" : "Active job seeker";
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
        ["Labor-force status", humanizeEvent(laborForceStatus)],
        ["Work district", item.workZoneId ? zoneLabel(item.workZoneId) : nonEmploymentLabel],
        ["Employer", textAt(item, ["enterpriseName", "enterpriseId"], nonEmploymentLabel)],
        ["Age", textAt(item, ["age"])],
        ["Mode", textAt(item, ["mode"], "walk")],
        ["Owns car", valueAt(item, ["hasCar", "ownsCar"], 0) ? "Yes" : "No"],
        ["Salary", formatAed(valueAt(item, ["salaryAed", "salaryMonthly", "salary"]))],
        ["Modeled non-labor resources", formatAed(valueAt(item, ["monthlyNonLaborSupportAed", "nonLaborSupportAed"], 0))],
        ["Housing rent", formatAed(valueAt(item, ["residentialRentAed", "rentMonthly", "rent"]))],
        ["Transport / month", formatAed(valueAt(item, ["monthlyTransportCostAed", "monthlyTransportCost", "transportCost"]))],
        ["Financial status", textAt(item, ["financialStatusLabel"], "Not classified")],
        ["Cash after housing + commute", formatAed(netIncome)],
        ["Cash-buffer margin", formatAed(netIncome - appliedPolicy.waitingNetIncomeAed)],
        ["Modeled savings stock", formatAed(valueAt(item, ["bankBalanceAed", "bankBalance", "savings"]))],
        ["Last monthly saving / drawdown", formatAed(valueAt(item, ["lastMonthlyBankBalanceDeltaAed"]))],
        ["Round trip", `${roundTrip.toFixed(1)} min`],
        ["Commute goal margin", `${(appliedPolicy.acceptableCommuteRoundTripMin - roundTrip).toFixed(1)} min`],
        ["Residential move eligible", textAt(item, ["decisionExplanation.currentAssessment.nextResidentialMoveEligibleDate"], "Now")],
        ["Voluntary job switch eligible", textAt(item, ["decisionExplanation.currentAssessment.nextVoluntaryJobSwitchEligibleDate"], "Now")],
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
        ["Relocation eligible", textAt(item, ["decisionExplanation.currentAssessment.nextRelocationEligibleDate"], "Now")],
        [
          "Relocation gate",
          `${valueAt(item, ["decisionExplanation.currentAssessment.relocationConsiderationPercent"], 0).toFixed(0)}% consideration`,
        ],
      ])}${historyBars(
        item.history || item.histories,
        "Employee-agent count history",
        ["employeeCount", "employees"],
        "employee agents"
      )}${agentEvents(item.events)}`;
    } else {
      const current = item.current && typeof item.current === "object" ? { ...item, ...item.current } : item;
      const load = linkLoad(current);
      const contextOnly = current.contextOnly === true;
      const roadName = textAt(current, ["primaryRoad", "name", "roadName"], `Road segment ${id}`);
      const roadRefs = Array.isArray(current.roadRefs) ? current.roadRefs.join(", ") : textAt(current, ["roadRef", "ref"], "");
      const capacityAB = valueAt(current, ["capacityVehPerHourAB", "capacityVehPerHour", "capacityVehiclesPerDirection", "capacity"]);
      const capacityBA = valueAt(current, ["capacityVehPerHourBA", "capacityVehPerHour", "capacityVehiclesPerDirection", "capacity"]);
      const periodCapacityAB = valueAt(current, ["capacityVehiclesAB", "capacityVehiclesPerDirection", "capacity"]);
      const periodCapacityBA = valueAt(current, ["capacityVehiclesBA", "capacityVehiclesPerDirection", "capacity"]);
      const assignmentPeriodHours = valueAt(current, ["assignmentPeriodHours"], capacityAB > 0 ? Math.max(1, periodCapacityAB / capacityAB) : 1);
      const officialRoad = current.officialMainRoadMatch || {};
      const lanesObserved = textAt(current, ["sourceClassByField.lanesPerDirection"], "") === "observed" && officialRoad.capacityApplied === true;
      const lanesAB = valueAt(current, ["lanesAB"], valueAt(current, ["lanesPerDirection"], 0));
      const lanesBA = valueAt(current, ["lanesBA"], valueAt(current, ["lanesPerDirection"], 0));
      const officialReference = [officialRoad.routeId, officialRoad.side, officialRoad.nameEnglish].filter(Boolean).join(" · ");
      const officialMatchQuality = officialRoad.featureId
        ? `${(valueAt(officialRoad, ["coverageWithin75m"], 0) * 100).toFixed(0)}% within 75 m · p90 ${valueAt(
            officialRoad,
            ["p90DistanceMeters"],
            0
          ).toFixed(0)} m · alignment ${(valueAt(officialRoad, ["alignment"], 0) * 100).toFixed(0)}%`
        : "No official match retained";
      if (ui.selectionName) ui.selectionName.textContent = roadName;
      html = `${agentNavigation(kind, item)}${metricRows([
        ["Assignment role", contextOnly ? "Map context only · no assigned OD demand" : "Physical assignment edge"],
        ["Road reference", roadRefs || "No signed route reference"],
        ["Road class", textAt(current, ["roadClass", "class"], "Urban arterial")],
        ["Segment", `${textAt(current, ["fromNodeId", "from"], "A")} → ${textAt(current, ["toNodeId", "to"], "B")}`],
        ["Length", `${valueAt(current, ["distanceKm", "lengthKm"]).toFixed(2)} km`],
        ["Free-flow", `${valueAt(current, ["freeFlowMinutes", "travelTimeFreeFlow"]).toFixed(2)} min`],
        ["Lanes A→B / B→A", `${formatNumber(lanesAB)} / ${formatNumber(lanesBA)} · ${lanesObserved ? "AD-SDI observed" : "road-class assumption"}`],
        ["Official road match", officialReference || "No strict AD-SDI capacity match"],
        ["Match quality", officialMatchQuality],
        [
          "Capacity basis",
          lanesObserved
            ? `Observed lanes × assumed ${formatNumber(valueAt(current, ["capacityPerLaneVehPerHour"], 0))} veh/lane/h`
            : `Assumed lanes × ${formatNumber(valueAt(current, ["capacityPerLaneVehPerHour"], 0))} veh/lane/h`,
        ],
        [
          "Modeled time A→B / B→A",
          `${valueAt(current, ["travelTimeABMin", "travelTimeMinutes", "travelTime"], 0).toFixed(2)} / ${valueAt(
            current,
            ["travelTimeBAMin", "travelTimeMinutes", "travelTime"],
            0
          ).toFixed(2)} min`,
        ],
        ["Hourly capacity A→B / B→A", `${formatNumber(capacityAB)} / ${formatNumber(capacityBA)} veh/h`],
        [
          `${assignmentPeriodHours.toFixed(0)}h assignment capacity`,
          `${formatNumber(periodCapacityAB)} / ${formatNumber(periodCapacityBA)} vehicles`,
        ],
        [
          "Assigned vehicles A→B / B→A",
          `${formatNumber(valueAt(current, ["loadABVehicles"], 0))} / ${formatNumber(valueAt(current, ["loadBAVehicles"], 0))}`,
        ],
        [
          "Work-trip road load A→B / B→A",
          `${formatPercent(valueAt(current, ["volumeCapacityAB"], load))} / ${formatPercent(valueAt(current, ["volumeCapacityBA"], load))}`,
        ],
        ["Connected candidate routes", formatNumber(Array.isArray(current.candidateRouteIds) ? current.candidateRouteIds.length : 0)],
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
        const count = kind === "link" ? linksOf().filter(isRenderedAnalysisLink).length : samplesOf(kind).length;
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
      textStyle: { fontFamily: 'Inter, "Helvetica Neue", sans-serif', color: palette.ink, fontSize: 11 },
      tooltip: {
        trigger: "axis",
        backgroundColor: "#ffffff",
        borderColor: palette.line,
        textStyle: { color: palette.ink, fontSize: 11 },
        confine: true,
      },
      grid: { top: 20, left: 44, right: 16, bottom: 28 },
      legend: { top: 0, right: 4, itemWidth: 12, itemHeight: 7, textStyle: { color: palette.muted, fontSize: 10 } },
      xAxis: {
        type: "category",
        axisLine: { lineStyle: { color: palette.line } },
        axisTick: { show: false },
        axisLabel: { color: palette.muted, fontSize: 10, hideOverlap: true },
      },
      yAxis: {
        type: "value",
        splitLine: { lineStyle: { color: "#e8ece9" } },
        axisLabel: { color: palette.muted, fontSize: 10 },
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

  function clearAccessibleOdTable(node) {
    if (!node) return;
    const detail = node.parentElement?.querySelector("[data-udes-v2-od-table]");
    if (detail) detail.remove();
    node.removeAttribute("aria-describedby");
  }

  function updateAccessibleOdTable(node, matrix, labels, unit) {
    if (!node || !matrix || !Array.isArray(labels)) return;
    const signature = JSON.stringify([matrix.cells, labels, unit]);
    let detail = node.parentElement?.querySelector("[data-udes-v2-od-table]");
    if (!detail) {
      detail = document.createElement("div");
      detail.id = `udes-v2-od-detail-${String(node.dataset.udesV2LiveChart || "matrix").replace(/[^a-z0-9]+/gi, "-")}`;
      detail.className = "udes-v2-sr-only";
      detail.dataset.udesV2OdTable = "true";
      node.after(detail);
    }
    node.setAttribute("aria-describedby", detail.id);
    if (detail.dataset.renderedSignature === signature) return;

    const values = new Map((matrix.cells || []).map(([workIndex, homeIndex, value]) => [`${homeIndex}:${workIndex}`, value]));
    const table = document.createElement("table");
    const caption = document.createElement("caption");
    caption.textContent = `Home-to-work origin-destination stock. Rows are home districts and columns are work districts. Values are ${unit}. This table is not relocation-event data.`;
    table.append(caption);

    const head = document.createElement("thead");
    const headRow = document.createElement("tr");
    const corner = document.createElement("th");
    corner.scope = "col";
    corner.textContent = "Home district by work district";
    headRow.append(corner);
    labels.forEach((label) => {
      const header = document.createElement("th");
      header.scope = "col";
      header.textContent = label;
      headRow.append(header);
    });
    head.append(headRow);
    table.append(head);

    const body = document.createElement("tbody");
    labels.forEach((label, homeIndex) => {
      const row = document.createElement("tr");
      const header = document.createElement("th");
      header.scope = "row";
      header.textContent = label;
      row.append(header);
      labels.forEach((_workLabel, workIndex) => {
        const cell = document.createElement("td");
        cell.textContent = formatNumber(values.get(`${homeIndex}:${workIndex}`) || 0);
        row.append(cell);
      });
      body.append(row);
    });
    table.append(body);
    detail.replaceChildren(table);
    detail.dataset.renderedSignature = signature;
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

  function applyChartOption(chart, key, option, structureKey = "default") {
    if (!chart || chart.isDisposed?.()) return;
    const signature = `${structureKey}:${chartDataSignature(option)}`;
    if (state.chartDataSignatures.get(key) === signature) return;
    const firstRender = !state.chartDataSignatures.has(key);
    const structureChanged = state.chartStructureKeys.has(key) && state.chartStructureKeys.get(key) !== structureKey;
    chart.setOption(
      option,
      firstRender || structureChanged
        ? { notMerge: true, lazyUpdate: true }
        : { notMerge: false, lazyUpdate: true, silent: true, replaceMerge: ["series"] }
    );
    state.chartDataSignatures.set(key, signature);
    state.chartStructureKeys.set(key, structureKey);
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
      requestAnimationFrame(() => applyChartOption(chart, key, pending.option, pending.structureKey));
    });
  }

  function mountChart(node, key, option, structureKey = "default") {
    if (!node) return;
    (option.series || []).forEach((series, index) => {
      if (!series.id)
        series.id = `${key}:${String(series.name || index)
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")}`;
      if (series.type === "line") {
        const finitePointCount = (series.data || []).filter((datum) => {
          const value = Array.isArray(datum) ? datum.at(-1) : datum && typeof datum === "object" ? datum.value : datum;
          return value !== null && value !== undefined && value !== "" && Number.isFinite(Number(value));
        }).length;
        if (finitePointCount <= 1) {
          series.showSymbol = true;
          series.symbolSize = 7;
        }
      }
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
    const structureChanged = state.chartStructureKeys.has(key) && state.chartStructureKeys.get(key) !== structureKey;
    if (state.chartInteractionLocks.has(key) && !structureChanged) {
      state.pendingChartOptions.set(key, { option, structureKey });
      return;
    }
    state.pendingChartOptions.delete(key);
    applyChartOption(chart, key, option, structureKey);
  }

  function prepareChartPanel(kind, definitions) {
    const mount = $(`[data-udes-v2-chart='${kind}']`);
    if (!mount) return [];
    const signature = definitions.map(([key]) => key).join("|");
    if (mount.dataset.renderedSignature !== signature) {
      for (const [key, chart] of state.charts.entries()) {
        if (key.startsWith(`${kind}:`)) {
          chart.dispose?.();
          state.charts.delete(key);
          state.chartInteractionLocks.delete(key);
          state.pendingChartOptions.delete(key);
          state.chartDataSignatures.delete(key);
          state.chartStructureKeys.delete(key);
        }
      }
      mount.replaceChildren();
      mount.classList.add("udes-v2-live-chart-grid");
      definitions.forEach(([key, title, subtitle]) => createChartCell(mount, `${kind}:${key}`, title, subtitle));
      mount.dataset.renderedSignature = signature;
    }
    return definitions.map(([key, title, subtitle]) => {
      const chartNode = $(`[data-udes-v2-live-chart='${kind}:${key}']`, mount);
      const section = chartNode?.closest(".udes-v2-live-chart");
      const titleNode = section ? $("header strong", section) : null;
      const subtitleNode = section ? $("header span", section) : null;
      if (titleNode && titleNode.textContent !== title) titleNode.textContent = title;
      if (subtitleNode && subtitleNode.textContent !== subtitle) subtitleNode.textContent = subtitle;
      if (chartNode) chartNode.dataset.udesV2ChartTitle = title;
      return chartNode;
    });
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
    const [satisfactionNode, commuteNode, transitNode, occupancyNode] = prepareChartPanel("outcomes", [
      ["satisfaction", "Resident satisfaction", "Daily weighted share · active and same-seed reference"],
      ["commute", "Mean round-trip commute", "Completed workdays only · minutes"],
      ["transit", "Transit mode share", "Completed workdays only · active and same-seed reference"],
      ["occupancy", "Housing occupancy", "Daily occupied capacity · active and same-seed reference"],
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

    const transit = baseChartOptions();
    transit.xAxis.data = workdaySource.labels;
    transit.yAxis = { ...transit.yAxis, min: 0, max: 100, axisLabel: { ...transit.yAxis.axisLabel, formatter: "{value}%" } };
    transit.series = [
      {
        name: "Active",
        type: "line",
        showSymbol: false,
        smooth: 0.18,
        data: workdaySource.history.map((entry) => entry.ptShare * 100),
        lineStyle: { width: 2.3, color: palette.blue },
        itemStyle: { color: palette.blue },
      },
      state.compare
        ? {
            name: "Reference",
            type: "line",
            showSymbol: false,
            data: workdaySource.reference.map((entry) => (entry ? entry.ptShare * 100 : null)),
            lineStyle: { width: 1.5, type: "dashed", color: palette.muted },
            itemStyle: { color: palette.muted },
          }
        : null,
    ].filter(Boolean);
    addInterventionMarkers(transit, workdaySource.history, workdaySource.labels);
    mountChart(transitNode, "outcomes:transit", transit);

    const occupancy = baseChartOptions();
    occupancy.xAxis.data = labels;
    occupancy.yAxis = { ...occupancy.yAxis, min: 0, max: 100, axisLabel: { ...occupancy.yAxis.axisLabel, formatter: "{value}%" } };
    occupancy.series = [
      {
        name: "Active",
        type: "line",
        showSymbol: false,
        smooth: 0.18,
        data: history.map((entry) => entry.housingOccupancy * 100),
        lineStyle: { width: 2.3, color: palette.amber },
        itemStyle: { color: palette.amber },
      },
      state.compare
        ? {
            name: "Reference",
            type: "line",
            showSymbol: false,
            data: reference.map((entry) => (entry ? entry.housingOccupancy * 100 : null)),
            lineStyle: { width: 1.5, type: "dashed", color: palette.muted },
            itemStyle: { color: palette.muted },
          }
        : null,
    ].filter(Boolean);
    addInterventionMarkers(occupancy, history, labels);
    mountChart(occupancyNode, "outcomes:occupancy", occupancy);
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
      [
        "stocks",
        "Employed residents vs jobs located",
        "Current home → work stock · residence district vs workplace district · not relocation events",
      ],
      [
        "selected",
        selectedName ? `${selectedName}: daily district trajectory` : "Choose a district for its daily trajectory",
        selectedName ? "Population and jobs daily · housing rent changes annually" : "Use Inspect district in Setup or click a district on the map",
      ],
    ]);
    const zoneIds = normalizeCity(state.snapshot).zoneSeries.map((zone) => String(zone.id));
    const liveWork = commuteLiveWorkByDistrict(state.snapshot?.commuteOd, zoneIds)
      .map((row) => ({ ...row, name: zoneLabel(row.districtId) }))
      .sort((a, b) => a.employedResidents - b.employedResidents || a.name.localeCompare(b.name));
    const labels = liveWork.map((row) => row.name);
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
      {
        name: "Employed residents (live)",
        type: "bar",
        data: liveWork.map((row) => row.employedResidents),
        barMaxWidth: 7,
        itemStyle: { color: palette.green },
      },
      {
        name: "Jobs located (work)",
        type: "bar",
        data: liveWork.map((row) => row.locatedJobs),
        barMaxWidth: 7,
        itemStyle: { color: palette.blue },
      },
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
    const definition = flowDefinition(kind, state.flowMeasure);
    const mobilityRates = cityOf(state.snapshot).mobilityEventRates || {};
    const eventRate = valueAt(
      mobilityRates,
      [
        {
          residential: "residentialMovesPer100CitizenAgentYears",
          job: "crossDistrictVoluntaryJobSwitchesPer100EmployedAgentYears",
          workplace: "employerCarriedWorkplaceChangesPer100EmployedAgentYears",
          enterprise: "firmRelocationsPer100FirmAgentYears",
        }[kind],
      ].filter(Boolean),
      Number.NaN
    );
    const rateDenominator = {
      residential: "citizen-agent-years",
      job: "employed-agent-years",
      workplace: "employed-agent-years",
      enterprise: "firm-agent-years",
    }[kind];
    const rateLabel = Number.isFinite(eventRate) && rateDenominator ? ` · cumulative ${eventRate.toFixed(1)} events / 100 ${rateDenominator}` : "";
    const kindLabel = {
      residential: "Residential moves",
      job: "Cross-district job switches",
      workplace: "Firm-carried workplace changes",
      enterprise: "Enterprise relocations",
      replacement: "Replacement placements",
      commute: "Home-to-work stock",
    }[kind];
    const selectedId = selectedDistrictId();
    const selectedName = selectedId ? zoneLabel(selectedId) : null;
    const [routesNode, districtNode] = prepareChartPanel("flows", [
      [
        "routes",
        commuteStock ? "Home → work OD matrix" : `Top cross-district ${kindLabel.toLowerCase()}`,
        commuteStock
          ? "Current employed-resident stock · rows = home, columns = work · not relocation events"
          : `${state.flowWindowDays}-day sum · ${definition.unit} · origin → destination${rateLabel}`,
      ],
      [
        "district",
        commuteStock
          ? selectedName
            ? `${selectedName}: work destinations and worker origins`
            : "Select a district for its commute exchange"
          : selectedName
            ? `${selectedName}: incoming, outgoing, and net`
            : `${kindLabel} by decision reason`,
        commuteStock
          ? selectedName
            ? "Current worker stock · out = residents’ jobs; in = workers’ homes · not relocation events"
            : "Use Inspect district in Setup or click a district on the map"
          : selectedName
            ? `Exact daily OD flows · ${definition.unit}`
            : `${state.flowWindowDays}-day citywide totals · choose a district for its daily balance`,
      ],
    ]);
    const flowMount = routesNode?.closest("[data-udes-v2-chart='flows']");
    if (flowMount) flowMount.dataset.udesV2FlowChartMode = commuteStock ? "commute" : "events";
    const commuteOd = Array.isArray(state.snapshot?.commuteOd) ? state.snapshot.commuteOd : [];
    const routeChart = baseChartOptions();
    if (commuteStock) {
      const districtIds = normalizeCity(state.snapshot)
        .zoneSeries.map((zone) => String(zone.id))
        .sort((a, b) => zoneLabel(a).localeCompare(zoneLabel(b)));
      const matrix = commuteOdMatrix(commuteOd, districtIds, state.flowMeasure);
      const labels = matrix.districtIds.map(zoneLabel);
      const shortLabel = (value) =>
        String(value)
          .replace(/^Al\s+/i, "")
          .replace(/\s+Island$/i, "");
      routeChart.animationDuration = 0;
      routeChart.grid = { top: 10, left: 83, right: 12, bottom: 69 };
      routeChart.legend = { show: false };
      routeChart.tooltip = {
        ...routeChart.tooltip,
        trigger: "item",
        formatter: (params) => {
          const [workIndex, homeIndex, value] = params.value || [];
          return `${escapeHtml(labels[homeIndex] || "Home district")} → ${escapeHtml(labels[workIndex] || "Work district")}<br><strong>${formatNumber(
            value
          )}</strong> ${escapeHtml(definition.unit)}`;
        },
      };
      routeChart.xAxis = {
        ...routeChart.xAxis,
        name: "work district",
        nameLocation: "middle",
        nameGap: 56,
        data: labels,
        splitArea: { show: true },
        axisLabel: { ...routeChart.xAxis.axisLabel, interval: 0, rotate: 48, formatter: shortLabel },
      };
      routeChart.yAxis = {
        ...routeChart.yAxis,
        type: "category",
        name: "home district",
        nameLocation: "middle",
        nameGap: 71,
        data: labels,
        splitArea: { show: true },
        axisLabel: { ...routeChart.yAxis.axisLabel, width: 68, overflow: "truncate", interval: 0, formatter: shortLabel },
      };
      routeChart.visualMap = {
        min: 0,
        max: Math.max(1, matrix.maximum),
        calculable: false,
        orient: "horizontal",
        left: "center",
        bottom: 1,
        itemWidth: 105,
        itemHeight: 7,
        text: ["more", "0"],
        textStyle: { color: palette.muted, fontSize: 8 },
        inRange: { color: ["#edf4f1", palette.green] },
      };
      routeChart.series = [
        {
          name: "Employed residents",
          type: "heatmap",
          data: matrix.cells,
          itemStyle: { borderColor: "#ffffff", borderWidth: 1 },
          emphasis: { itemStyle: { borderColor: palette.ink, borderWidth: 1 } },
        },
      ];
      updateAccessibleOdTable(routesNode, matrix, labels, definition.unit);
    } else {
      clearAccessibleOdTable(routesNode);
      const routes = aggregateFlowRoutes(state.history, kind, state.flowWindowDays, latestDay, state.flowMeasure).slice(0, 12).reverse();
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
          itemStyle: {
            color:
              kind === "enterprise"
                ? palette.amber
                : kind === "job" || kind === "workplace"
                  ? palette.blue
                  : kind === "replacement"
                    ? palette.sand
                    : palette.green,
          },
        },
      ];
    }
    mountChart(routesNode, "flows:routes", routeChart, commuteStock ? "commute-od-heatmap" : "event-route-bars");

    const districtChart = baseChartOptions();
    if (commuteStock) {
      const exchange = selectedDistrictCommuteExchange(commuteOd, selectedId, state.flowMeasure);
      const outboundByDistrict = new Map(exchange.destinations.map((row) => [row.counterpartDistrictId, row.value]));
      const inboundByDistrict = new Map(exchange.origins.map((row) => [row.counterpartDistrictId, row.value]));
      const counterpartIds = [...new Set([...outboundByDistrict.keys(), ...inboundByDistrict.keys()])];
      const exchangeRows = selectedId
        ? [
            ...counterpartIds.map((districtId) => ({
              label: zoneLabel(districtId),
              outbound: outboundByDistrict.get(districtId) || 0,
              inbound: inboundByDistrict.get(districtId) || 0,
              within: 0,
            })),
            { label: "Lives + works here", outbound: 0, inbound: 0, within: exchange.sameDistrict },
          ].sort((a, b) => a.outbound + a.inbound + a.within - (b.outbound + b.inbound + b.within) || a.label.localeCompare(b.label))
        : [{ label: "Select a district", outbound: 0, inbound: 0, within: 0 }];
      districtChart.grid = { top: 22, left: 124, right: 20, bottom: 20 };
      districtChart.xAxis = {
        ...districtChart.xAxis,
        type: "value",
        axisLabel: { ...districtChart.xAxis.axisLabel, formatter: (value) => formatCompact(value) },
      };
      districtChart.yAxis = {
        ...districtChart.yAxis,
        type: "category",
        data: exchangeRows.map((row) => row.label),
        axisLabel: { ...districtChart.yAxis.axisLabel, width: 114, overflow: "truncate", interval: 0 },
      };
      districtChart.series = [
        {
          name: "Residents working out",
          type: "bar",
          data: exchangeRows.map((row) => row.outbound),
          barMaxWidth: 7,
          itemStyle: { color: palette.blue },
        },
        {
          name: "Workers commuting in",
          type: "bar",
          data: exchangeRows.map((row) => row.inbound),
          barMaxWidth: 7,
          itemStyle: { color: palette.green },
        },
        {
          name: "Live + work here",
          type: "bar",
          data: exchangeRows.map((row) => row.within),
          barMaxWidth: 7,
          itemStyle: { color: palette.sand },
        },
      ];
    } else if (selectedId) {
      const points = flowSeriesForZone(state.history, kind, selectedId, state.flowWindowDays, latestDay, state.flowMeasure);
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
      for (const route of aggregateFlowRoutes(state.history, kind, state.flowWindowDays, latestDay, state.flowMeasure)) {
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
    const districtStructure = commuteStock ? "commute-district-exchange" : selectedId ? "event-district-timeseries" : "event-reason-bars";
    mountChart(districtNode, "flows:district", districtChart, districtStructure);
  }

  function renderMobilityCharts() {
    const [modesNode, linksNode] = prepareChartPanel("mobility", [
      ["modes", "Workday commute mode share", "Completed workdays only · car, bus and walk"],
      ["links", "Named corridor pressure", "Latest assignment · highest directional road load across each named road's modeled segments"],
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

    const corridors = new Map();
    for (const link of linksOf().filter(isRenderedAnalysisLink)) {
      const name = textAt(link, ["primaryRoad", "name"], "").trim();
      if (!name || /^unnamed\b|^zone access\b/i.test(name)) continue;
      const roadPressure = linkLoad(link);
      const ptPressure = Math.max(valueAt(link, ["ptLoadFactorAB"], 0), valueAt(link, ["ptLoadFactorBA"], 0));
      const current = corridors.get(name) || { name, roadPressure: 0, ptPressure: 0, segmentCount: 0 };
      current.roadPressure = Math.max(current.roadPressure, roadPressure);
      current.ptPressure = Math.max(current.ptPressure, ptPressure);
      current.segmentCount += 1;
      corridors.set(name, current);
    }
    const links = [...corridors.values()]
      .sort((a, b) => Math.max(b.roadPressure, b.ptPressure) - Math.max(a.roadPressure, a.ptPressure) || a.name.localeCompare(b.name))
      .slice(0, 12);
    const linkChart = baseChartOptions();
    linkChart.grid = { top: 24, left: 126, right: 14, bottom: 20 };
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
      axisLabel: { ...linkChart.yAxis.axisLabel, width: 116, overflow: "truncate" },
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
      ["states", "Citizen decision states", "Daily weighted shares · modeled-agent transition count on right axis"],
    ]);
    const activeBins = Array.isArray(activeStatus.bins) ? activeStatus.bins : [];
    const referenceBins = new Map((referenceStatus.bins || []).map((bin) => [bin.id, bin]));
    const labels = activeBins.length
      ? activeBins.map(
          (bin) =>
            ({
              "outside-labor-force": "Outside labor force",
              unemployed: "Active job seeker",
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
        name: "Agent transitions",
        type: "bar",
        yAxisIndex: 1,
        data: history.map((entry) => Number(entry.transitions?.totals?.citizenAgentTransitions) || 0),
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
    [$("[data-udes-v2-tray]"), $(".udes-v2-map-workspace")].filter(Boolean).forEach((node) => state.resizeObserver.observe(node));
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
