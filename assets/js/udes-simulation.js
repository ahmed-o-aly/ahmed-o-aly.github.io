(() => {
  const root = document.querySelector("[data-udes-root]");
  if (!root) return;

  const MONTHS = 120;
  const START_YEAR = 2026;
  const REDUCED_MOTION = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const number = new Intl.NumberFormat("en-AE", { maximumFractionDigits: 0 });

  const zoneBlueprints = [
    {
      id: "downtown",
      short: "AUH",
      name: "Abu Dhabi Island",
      region: "metro",
      coordinates: [24.4667, 54.3667],
      population: 235,
      jobs: 260,
      housing: 285,
      jobCapacity: 310,
      quality: 0.82,
      rent: 100,
    },
    {
      id: "reem",
      short: "R/M",
      name: "Reem / Maryah",
      region: "metro",
      coordinates: [24.4952, 54.4078],
      population: 120,
      jobs: 105,
      housing: 150,
      jobCapacity: 140,
      quality: 0.88,
      rent: 108,
    },
    {
      id: "saadiyat",
      short: "SAA",
      name: "Saadiyat",
      region: "metro",
      coordinates: [24.542, 54.436],
      population: 58,
      jobs: 48,
      housing: 82,
      jobCapacity: 80,
      quality: 0.93,
      rent: 119,
    },
    {
      id: "yas",
      short: "YAS",
      name: "Yas / Al Raha",
      region: "metro",
      coordinates: [24.488, 54.607],
      population: 92,
      jobs: 100,
      housing: 126,
      jobCapacity: 145,
      quality: 0.9,
      rent: 111,
    },
    {
      id: "khalifa",
      short: "KCA",
      name: "Khalifa City",
      region: "metro",
      coordinates: [24.425, 54.58],
      population: 155,
      jobs: 92,
      housing: 195,
      jobCapacity: 125,
      quality: 0.83,
      rent: 87,
    },
    {
      id: "mbz",
      short: "MBZ",
      name: "MBZ / Mussafah",
      region: "metro",
      coordinates: [24.33, 54.54],
      population: 205,
      jobs: 185,
      housing: 255,
      jobCapacity: 235,
      quality: 0.74,
      rent: 72,
    },
    {
      id: "alain",
      short: "AIN",
      name: "Al Ain",
      region: "alain",
      coordinates: [24.22487, 55.74522],
      population: 340,
      jobs: 270,
      housing: 420,
      jobCapacity: 330,
      quality: 0.82,
      rent: 75,
    },
    {
      id: "ruwais",
      short: "RWS",
      name: "Al Dhafra / Ruwais",
      region: "dhafra",
      coordinates: [24.1109, 52.7306],
      population: 180,
      jobs: 135,
      housing: 225,
      jobCapacity: 180,
      quality: 0.78,
      rent: 70,
    },
  ];

  const defaultLevers = {
    ptFare: 2,
    ptSpeed: 28,
    ptWait: 8,
    carCost: 0.35,
    roadSpeed: 60,
    roadCapacity: 1,
    rentPolicy: 1,
  };

  const presets = {
    baseline: { ...defaultLevers },
    transit: { ...defaultLevers, ptFare: 1, ptSpeed: 40, ptWait: 4 },
    housing: { ...defaultLevers, ptSpeed: 32, rentPolicy: 0.96 },
    roads: { ...defaultLevers, roadSpeed: 80, roadCapacity: 1.4 },
  };

  const routeCapacity = {
    "downtown-reem": 48000,
    "downtown-saadiyat": 44000,
    "downtown-khalifa": 72000,
    "downtown-mbz": 68000,
    "reem-yas": 50000,
    "saadiyat-yas": 52000,
    "khalifa-yas": 58000,
    "mbz-khalifa": 54000,
    "khalifa-alain": 62000,
    "mbz-ruwais": 52000,
    "alain-ruwais": 42000,
  };

  const localTrips = {
    downtown: { distanceKm: 3.5, walkShare: 0.28 },
    reem: { distanceKm: 3, walkShare: 0.3 },
    saadiyat: { distanceKm: 5, walkShare: 0.2 },
    yas: { distanceKm: 5.5, walkShare: 0.16 },
    khalifa: { distanceKm: 6, walkShare: 0.12 },
    mbz: { distanceKm: 6.5, walkShare: 0.1 },
    alain: { distanceKm: 5.5, walkShare: 0.18 },
    ruwais: { distanceKm: 5, walkShare: 0.14 },
  };

  const fallbackRoutes = [
    ["downtown-reem", "downtown", "reem", 6.5],
    ["downtown-saadiyat", "downtown", "saadiyat", 12.4],
    ["downtown-khalifa", "downtown", "khalifa", 30.5],
    ["downtown-mbz", "downtown", "mbz", 32.8],
    ["reem-yas", "reem", "yas", 27.3],
    ["saadiyat-yas", "saadiyat", "yas", 24.8],
    ["khalifa-yas", "khalifa", "yas", 18.5],
    ["mbz-khalifa", "mbz", "khalifa", 16.2],
    ["khalifa-alain", "khalifa", "alain", 145],
    ["mbz-ruwais", "mbz", "ruwais", 230],
    ["alain-ruwais", "alain", "ruwais", 365],
  ].map(([id, from, to, distanceKm]) => {
    const start = zoneBlueprints.find((zone) => zone.id === from).coordinates;
    const end = zoneBlueprints.find((zone) => zone.id === to).coordinates;
    return {
      id,
      from,
      to,
      distanceKm,
      durationMin: (distanceKm / 60) * 60,
      capacity: routeCapacity[id],
      coordinates: [
        [start[1], start[0]],
        [end[1], end[0]],
      ],
    };
  });

  const references = {
    date: root.querySelector("#udes-date"),
    progress: root.querySelector("#udes-progress"),
    liveStatus: root.querySelector("#udes-live-status"),
    playLabel: root.querySelector("[data-play-label]"),
    playButton: root.querySelector("[data-action='play']"),
    stepButton: root.querySelector("[data-action='step']"),
    modelState: root.querySelector("[data-model-state]"),
    zoneSelect: root.querySelector("[data-zone-select]"),
    zoneTable: root.querySelector("[data-zone-table]"),
    mapSummary: root.querySelector("#udes-map-summary"),
    networkStatus: root.querySelector("[data-network-status]"),
    mapKey: root.querySelector("[data-map-key]"),
    connectorFrom: root.querySelector("[data-connector-from]"),
    connectorTo: root.querySelector("[data-connector-to]"),
    connectorMapButton: root.querySelector("[data-action='connector-map']"),
    chartSummary: root.querySelector("[data-chart-summary]"),
    insightTitle: root.querySelector("[data-insight-title]"),
    insightCopy: root.querySelector("[data-insight-copy]"),
  };

  const mapState = {
    map: null,
    routeLayers: new Map(),
    zoneLayers: new Map(),
    vehicles: [],
    connectorLayer: null,
    emirateBounds: null,
    metroBounds: null,
  };

  let routes = fallbackRoutes;
  let state = createState("baseline");
  let lastFrame = performance.now();
  let accumulator = 0;
  let animationPhase = 0;

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function round(value, places = 1) {
    const multiplier = 10 ** places;
    return Math.round(value * multiplier) / multiplier;
  }

  function zoneById(id) {
    return state.zones.find((zone) => zone.id === id);
  }

  function blueprintById(id) {
    return zoneBlueprints.find((zone) => zone.id === id);
  }

  function createState(scenario) {
    if (!presets[scenario]) scenario = "baseline";
    const zones = zoneBlueprints.map((zone) => ({
      ...zone,
      baseHousing: zone.housing,
      baseJobCapacity: zone.jobCapacity,
      baseRent: zone.rent,
      housingMultiplier: 1,
      jobsMultiplier: 1,
      happiness: 0,
      carShare: 0,
      commute: 0,
    }));

    if (scenario === "housing") {
      for (const zone of zones) {
        if (["downtown", "reem", "saadiyat"].includes(zone.id)) zone.housingMultiplier = 1.25;
        if (["khalifa", "mbz"].includes(zone.id)) zone.jobsMultiplier = 1.12;
      }
    }

    return {
      month: 0,
      running: false,
      speed: 1,
      scenario,
      selectedZone: "downtown",
      mapMode: "load",
      emirateView: true,
      connectorMode: false,
      connectorSelection: [],
      connector: null,
      levers: { ...presets[scenario] },
      zones,
      edgeRatios: new Map(),
      history: [],
      baseline: null,
      metrics: null,
    };
  }

  function haversine(a, b) {
    const toRadians = (degrees) => (degrees * Math.PI) / 180;
    const earthRadius = 6371;
    const dLat = toRadians(b[0] - a[0]);
    const dLon = toRadians(b[1] - a[1]);
    const lat1 = toRadians(a[0]);
    const lat2 = toRadians(b[0]);
    const value = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
    return 2 * earthRadius * Math.asin(Math.sqrt(value));
  }

  function activeRoutes() {
    if (!state.connector) return routes;
    return [
      ...routes,
      {
        id: "hypothetical-connector",
        from: state.connector.from,
        to: state.connector.to,
        distanceKm: state.connector.distanceKm,
        capacity: 65000,
        coordinates: state.connector.coordinates,
        hypothetical: true,
      },
    ];
  }

  function edgeMinutes(route, ratios = state.edgeRatios) {
    const ratio = ratios.get(route.id) || 0;
    const freeFlow = route.durationMin ? route.durationMin * (60 / state.levers.roadSpeed) : (route.distanceKm / state.levers.roadSpeed) * 60;
    return 1.2 + freeFlow + ratio * 1.8;
  }

  function buildGraph(ratios) {
    const graph = new Map(state.zones.map((zone) => [zone.id, []]));
    for (const route of activeRoutes()) {
      const edge = {
        id: route.id,
        distanceKm: route.distanceKm,
        minutes: edgeMinutes(route, ratios),
      };
      graph.get(route.from).push({ ...edge, to: route.to });
      graph.get(route.to).push({ ...edge, to: route.from });
    }
    return graph;
  }

  function shortestPath(from, to, ratios) {
    if (from === to) return { distanceKm: 0, minutes: 0, edges: [] };
    const graph = buildGraph(ratios);
    const pending = new Set(graph.keys());
    const distance = new Map([...pending].map((id) => [id, Infinity]));
    const previous = new Map();
    distance.set(from, 0);

    while (pending.size) {
      let current = null;
      let currentDistance = Infinity;
      for (const id of pending) {
        if (distance.get(id) < currentDistance) {
          current = id;
          currentDistance = distance.get(id);
        }
      }
      if (current === null || current === to) break;
      pending.delete(current);
      for (const edge of graph.get(current)) {
        if (!pending.has(edge.to)) continue;
        const candidate = currentDistance + edge.minutes;
        if (candidate < distance.get(edge.to)) {
          distance.set(edge.to, candidate);
          previous.set(edge.to, { from: current, edge });
        }
      }
    }

    const edges = [];
    let cursor = to;
    while (previous.has(cursor)) {
      const step = previous.get(cursor);
      edges.unshift(step.edge);
      cursor = step.from;
    }
    if (!edges.length) return { distanceKm: haversine(zoneById(from).coordinates, zoneById(to).coordinates) * 1.25, minutes: 60, edges: [] };
    return {
      distanceKm: edges.reduce((sum, edge) => sum + edge.distanceKm, 0),
      minutes: edges.reduce((sum, edge) => sum + edge.minutes, 0),
      edges: edges.map((edge) => edge.id),
    };
  }

  function assignment(ratios) {
    const edgeLoads = new Map(activeRoutes().map((route) => [route.id, 0]));
    const zoneFlows = new Map(state.zones.map((zone) => [zone.id, { workers: 0, car: 0, transit: 0, walk: 0, minutes: 0, carKm: 0, transitKm: 0 }]));
    let totalCar = 0;
    let totalTransit = 0;
    let totalWalk = 0;
    let weightedMinutes = 0;
    let totalCarKm = 0;
    let totalTransitKm = 0;

    for (const origin of state.zones) {
      const workers = origin.population * 0.56;
      const destinations = state.zones.map((destination) => {
        const path = shortestPath(origin.id, destination.id, ratios);
        const localBias = origin.id === destination.id ? 1.55 : 1;
        const regionalBias = origin.region === destination.region ? 1 : 0.02;
        const attraction = (destination.jobs * localBias * regionalBias) / (4 + path.distanceKm) ** 0.72;
        return { destination, path, attraction };
      });
      const totalAttraction = destinations.reduce((sum, item) => sum + item.attraction, 0);

      for (const item of destinations) {
        const commuters = workers * (item.attraction / totalAttraction);
        const flow = zoneFlows.get(origin.id);
        flow.workers += commuters;
        if (origin.id === item.destination.id) {
          const local = localTrips[origin.id];
          const walk = commuters * local.walkShare;
          const motorized = commuters - walk;
          const roundTripDistance = local.distanceKm * 2;
          const carMinutes = (roundTripDistance / Math.max(state.levers.roadSpeed * 0.55, 20)) * 60;
          const ptMinutes = (roundTripDistance / state.levers.ptSpeed) * 60 + state.levers.ptWait * 2;
          const carCost = roundTripDistance * state.levers.carCost + 3;
          const ptCost = state.levers.ptFare * 2;
          const carUtility = 3 - 0.3 * carCost - 0.05 * carMinutes;
          const ptUtility = -0.3 * ptCost - 0.035 * ptMinutes - 0.06 * state.levers.ptWait;
          const carProbability = clamp(1 / (1 + Math.exp(clamp(ptUtility - carUtility, -30, 30))), 0.2, 0.9);
          const car = motorized * carProbability;
          const transit = motorized - car;
          flow.walk += walk;
          flow.car += car;
          flow.transit += transit;
          flow.minutes += walk * 18 + car * carMinutes + transit * ptMinutes;
          flow.carKm += car * roundTripDistance;
          flow.transitKm += transit * roundTripDistance;
          totalWalk += walk;
          totalCar += car;
          totalTransit += transit;
          weightedMinutes += walk * 18 + car * carMinutes + transit * ptMinutes;
          totalCarKm += car * roundTripDistance;
          totalTransitKm += transit * roundTripDistance;
          continue;
        }

        const roundTripDistance = item.path.distanceKm * 2;
        const carMinutes = item.path.minutes * 2;
        const ptMinutes = (roundTripDistance / state.levers.ptSpeed) * 60 + state.levers.ptWait * 2;
        const carCost = roundTripDistance * state.levers.carCost + 3;
        const ptCost = state.levers.ptFare * 2;
        const carUtility = 3 - 0.3 * carCost - 0.05 * carMinutes;
        const ptUtility = -0.3 * ptCost - 0.035 * ptMinutes - 0.06 * state.levers.ptWait;
        const carProbability = clamp(1 / (1 + Math.exp(clamp(ptUtility - carUtility, -30, 30))), 0.04, 0.96);
        const car = commuters * carProbability;
        const transit = commuters - car;

        flow.car += car;
        flow.transit += transit;
        flow.minutes += car * carMinutes + transit * ptMinutes;
        flow.carKm += car * roundTripDistance;
        flow.transitKm += transit * roundTripDistance;
        totalCar += car;
        totalTransit += transit;
        weightedMinutes += car * carMinutes + transit * ptMinutes;
        totalCarKm += car * roundTripDistance;
        totalTransitKm += transit * roundTripDistance;

        for (const edgeId of item.path.edges) edgeLoads.set(edgeId, edgeLoads.get(edgeId) + car * 2000);
      }
    }

    return {
      edgeLoads,
      zoneFlows,
      totalCar,
      totalTransit,
      totalWalk,
      weightedMinutes,
      totalCarKm,
      totalTransitKm,
    };
  }

  function ratiosFromLoads(edgeLoads) {
    const ratios = new Map();
    for (const route of activeRoutes()) {
      const capacity = route.capacity || routeCapacity[route.id] || 70000;
      ratios.set(route.id, edgeLoads.get(route.id) / (capacity * state.levers.roadCapacity));
    }
    return ratios;
  }

  function computeMetrics() {
    let ratios = new Map(state.edgeRatios);
    let flows;
    for (let iteration = 0; iteration < 3; iteration += 1) {
      flows = assignment(ratios);
      const calculated = ratiosFromLoads(flows.edgeLoads);
      ratios = new Map([...calculated].map(([id, value]) => [id, (ratios.get(id) || value) * 0.35 + value * 0.65]));
    }
    flows = assignment(ratios);
    state.edgeRatios = ratiosFromLoads(flows.edgeLoads);

    for (const zone of state.zones) {
      const flow = flows.zoneFlows.get(zone.id);
      const totalTrips = Math.max(flow.car + flow.transit + flow.walk, 1);
      zone.carShare = (flow.car / totalTrips) * 100;
      zone.commute = flow.minutes / totalTrips;
      const affordability = (105 - zone.rent) * 0.24;
      const commuteEffect = (38 - zone.commute) * 0.38;
      const accessEffect = clamp((zone.jobs / Math.max(zone.population, 1) - 0.65) * 10, -5, 7);
      zone.happiness = clamp(44 + zone.quality * 38 + affordability + commuteEffect + accessEffect, 28, 96);
    }

    const population = state.zones.reduce((sum, zone) => sum + zone.population, 0);
    const totalCommuters = flows.totalCar + flows.totalTransit + flows.totalWalk;
    const rawCarbon = flows.totalCarKm * 0.192 + flows.totalTransitKm * 0.065;
    const roadRatios = [...state.edgeRatios.values()];
    const metrics = {
      happiness: state.zones.reduce((sum, zone) => sum + zone.happiness * zone.population, 0) / population,
      commute: flows.weightedMinutes / Math.max(totalCommuters, 1),
      carShare: (flows.totalCar / Math.max(totalCommuters, 1)) * 100,
      transitShare: (flows.totalTransit / Math.max(totalCommuters, 1)) * 100,
      walkShare: (flows.totalWalk / Math.max(totalCommuters, 1)) * 100,
      roadLoad: (roadRatios.reduce((sum, ratio) => sum + ratio, 0) / Math.max(roadRatios.length, 1)) * 100,
      population,
      rawCarbon,
      co2: 100,
    };
    if (!state.baseline) state.baseline = { ...metrics };
    metrics.co2 = (rawCarbon / state.baseline.rawCarbon) * 100;
    state.metrics = metrics;
    return metrics;
  }

  function allocateWithCaps(total, weights, caps) {
    const allocations = Array(weights.length).fill(0);
    const active = new Set(weights.map((_, index) => index));
    let remaining = total;
    while (active.size && remaining > 0.0001) {
      const weightTotal = [...active].reduce((sum, index) => sum + Math.max(weights[index], 0.0001), 0);
      const capped = [];
      for (const index of active) {
        const share = remaining * (Math.max(weights[index], 0.0001) / weightTotal);
        if (share > caps[index]) capped.push(index);
      }
      if (!capped.length) {
        for (const index of active) {
          allocations[index] = remaining * (Math.max(weights[index], 0.0001) / weightTotal);
        }
        remaining = 0;
        break;
      }
      for (const index of capped) {
        allocations[index] = caps[index];
        remaining -= caps[index];
        active.delete(index);
      }
    }
    return allocations;
  }

  function evolveZones(metrics) {
    const currentPopulation = state.zones.reduce((sum, zone) => sum + zone.population, 0);
    const housingCaps = state.zones.map((zone) => zone.baseHousing * zone.housingMultiplier * 0.97);
    const totalPopulation = Math.min(
      currentPopulation * 1.00045,
      housingCaps.reduce((sum, value) => sum + value, 0)
    );
    const scores = state.zones.map((zone) => {
      const access = zone.jobs / Math.max(zone.population, 1);
      return zone.quality * 2.1 - zone.rent / 118 - zone.commute / 95 + access * 0.45;
    });
    const maxScore = Math.max(...scores);
    const weights = scores.map((score) => Math.exp((score - maxScore) * 1.4));

    const targets = allocateWithCaps(totalPopulation, weights, housingCaps);
    const movedWeights = state.zones.map((zone, index) => Math.max(10, zone.population + (targets[index] - zone.population) * 0.0045));
    const populations = allocateWithCaps(totalPopulation, movedWeights, housingCaps);

    state.zones.forEach((zone, index) => {
      zone.population = populations[index];
      const jobLimit = zone.baseJobCapacity * zone.jobsMultiplier;
      const jobGrowth = 0.0003 + (zone.quality - 0.75) * 0.0012 + (metrics.happiness - 70) * 0.00001;
      zone.jobs = clamp(zone.jobs * (1 + jobGrowth), 8, jobLimit);
    });

    if (state.month % 12 === 0) {
      for (const zone of state.zones) {
        const housingOccupancy = zone.population / (zone.baseHousing * zone.housingMultiplier);
        const jobOccupancy = zone.jobs / (zone.baseJobCapacity * zone.jobsMultiplier);
        const pressure = (housingOccupancy - 0.8) * 0.035 + (jobOccupancy - 0.72) * 0.018 + (zone.quality - 0.75) * 0.01;
        zone.rent = clamp(zone.rent * clamp(state.levers.rentPolicy + pressure, 0.92, 1.1), 52, 180);
      }
    }
  }

  function snapshot(metrics) {
    return {
      month: state.month,
      happiness: metrics.happiness,
      carShare: metrics.carShare,
      co2: metrics.co2,
      commute: metrics.commute,
      roadLoad: metrics.roadLoad,
    };
  }

  function advanceMonth() {
    if (state.month >= MONTHS) {
      setRunning(false);
      announce("The ten-year scenario is complete.");
      return true;
    }
    const current = computeMetrics();
    state.month += 1;
    evolveZones(current);
    const metrics = computeMetrics();
    state.history.push(snapshot(metrics));
    const complete = state.month >= MONTHS;
    if (complete) setRunning(false);
    render();
    if (complete) announce("The ten-year scenario is complete.");
    return complete;
  }

  function leverOutput(key, value) {
    if (key === "ptFare") return `AED ${Number(value).toFixed(2)}`;
    if (key === "ptSpeed" || key === "roadSpeed") return `${value} km/h`;
    if (key === "ptWait") return `${value} min`;
    if (key === "carCost") return `AED ${Number(value).toFixed(2)}/km`;
    if (key === "roadCapacity") return `${Math.round(value * 100)}%`;
    if (key === "rentPolicy") {
      if (value < 0.98) return `${Math.round((1 - value) * 100)}% relief`;
      if (value > 1.02) return `+${Math.round((value - 1) * 100)}% pressure`;
      return "Neutral";
    }
    return value;
  }

  function syncControls() {
    for (const input of root.querySelectorAll("[data-lever]")) {
      const key = input.dataset.lever;
      input.value = state.levers[key];
      const output = root.querySelector(`#${input.id}-output`);
      if (output) output.value = leverOutput(key, state.levers[key]);
    }
    for (const button of root.querySelectorAll("[data-scenario]")) {
      button.setAttribute("aria-pressed", String(button.dataset.scenario === state.scenario));
    }
    references.zoneSelect.value = state.selectedZone;
    const play = root.querySelector("[data-action='play']");
    play.setAttribute("aria-pressed", String(state.running));
    references.playLabel.textContent = state.running ? "Pause model" : state.month >= MONTHS ? "Run again" : "Run model";
    for (const button of root.querySelectorAll("[data-speed]")) {
      button.setAttribute("aria-pressed", String(Number(button.dataset.speed) === state.speed));
    }
    for (const button of root.querySelectorAll("[data-map-mode]")) {
      button.setAttribute("aria-pressed", String(button.dataset.mapMode === state.mapMode));
    }
    const emirate = root.querySelector("[data-action='emirate-view']");
    emirate.textContent = state.emirateView ? "Focus metro" : "View whole emirate";
    syncZoneControls();
  }

  function syncZoneControls() {
    const zone = zoneById(state.selectedZone);
    const controls = {
      housing: Math.round(zone.housingMultiplier * 100),
      quality: zone.quality,
      jobs: Math.round(zone.jobsMultiplier * 100),
      rent: Math.round(zone.rent),
    };
    for (const input of root.querySelectorAll("[data-zone-lever]")) {
      const key = input.dataset.zoneLever;
      input.value = controls[key];
      const output = root.querySelector(`#${input.id}-output`);
      if (!output) continue;
      if (key === "quality") output.value = Number(controls[key]).toFixed(2);
      else if (key === "rent") output.value = controls[key];
      else output.value = `${controls[key]}%`;
    }
  }

  function formatDelta(key, suffix = "") {
    if (!state.baseline || !state.metrics) return "Reference month";
    const delta = state.metrics[key] - state.baseline[key];
    if (Math.abs(delta) < 0.05) return "At reference";
    return `${delta > 0 ? "+" : ""}${round(delta, 1)}${suffix} from start`;
  }

  function renderKpis() {
    const metrics = state.metrics;
    const values = {
      happiness: round(metrics.happiness, 1),
      commute: `${round(metrics.commute, 1)} min`,
      carShare: `${round(metrics.carShare, 1)}%`,
      roadLoad: `${round(metrics.roadLoad, 0)}%`,
      co2: round(metrics.co2, 0),
      population: `${round(metrics.population, 0)}k`,
    };
    for (const [key, value] of Object.entries(values)) {
      const element = root.querySelector(`[data-kpi="${key}"]`);
      if (element) element.textContent = value;
    }
    const deltas = {
      happiness: formatDelta("happiness", " pts"),
      commute: formatDelta("commute", " min"),
      carShare: formatDelta("carShare", " pts"),
      roadLoad: formatDelta("roadLoad", " pts"),
      co2: formatDelta("co2", ""),
    };
    for (const [key, value] of Object.entries(deltas)) {
      const element = root.querySelector(`[data-delta="${key}"]`);
      if (element) element.textContent = value;
    }
  }

  function renderSelectedZone() {
    const zone = zoneById(state.selectedZone);
    const values = {
      population: `${round(zone.population, 0)}k`,
      jobs: `${round(zone.jobs, 0)}k`,
      rent: round(zone.rent, 0),
      happiness: round(zone.happiness, 1),
    };
    root.querySelector("[data-zone-name]").textContent = zone.name;
    for (const [key, value] of Object.entries(values)) {
      root.querySelector(`[data-zone-stat="${key}"]`).textContent = value;
    }
    const occupancy = zone.population / (zone.baseHousing * zone.housingMultiplier);
    let insight = `${zone.name} has room to absorb new residents without immediate rent pressure.`;
    if (occupancy > 0.9) insight = `${zone.name} is nearing its model housing capacity; added accessibility may now push rents upward.`;
    if (zone.happiness < 65) insight = `Longer commutes and affordability pressure are weighing on satisfaction in ${zone.name}.`;
    root.querySelector("[data-zone-insight]").textContent = insight;
  }

  function renderTable() {
    if (references.zoneTable.children.length !== state.zones.length) {
      references.zoneTable.replaceChildren(
        ...state.zones.map((zone) => {
          const row = document.createElement("tr");
          row.dataset.zoneRow = zone.id;
          const nameCell = document.createElement("td");
          const button = document.createElement("button");
          button.type = "button";
          button.dataset.selectZone = zone.id;
          button.textContent = zone.name;
          nameCell.append(button);
          row.append(nameCell);
          for (const key of ["population", "jobs", "rent", "happiness", "carShare"]) {
            const cell = document.createElement("td");
            cell.dataset.zoneValue = key;
            row.append(cell);
          }
          return row;
        })
      );
    }
    for (const zone of state.zones) {
      const row = references.zoneTable.querySelector(`[data-zone-row="${zone.id}"]`);
      row.dataset.selected = String(zone.id === state.selectedZone);
      const values = {
        population: `${round(zone.population, 0)}k`,
        jobs: `${round(zone.jobs, 0)}k`,
        rent: round(zone.rent, 0),
        happiness: round(zone.happiness, 1),
        carShare: `${round(zone.carShare, 1)}%`,
      };
      for (const [key, value] of Object.entries(values)) row.querySelector(`[data-zone-value="${key}"]`).textContent = value;
    }
  }

  function chartPath(history, key) {
    if (!history.length) return "";
    const xStart = 48;
    const xWidth = 652;
    const yTop = 28;
    const yHeight = 177;
    return history
      .map((point, index) => {
        const x = xStart + (point.month / MONTHS) * xWidth;
        const y = yTop + (1 - clamp(point[key], 0, 120) / 120) * yHeight;
        return `${index === 0 ? "M" : "L"}${round(x, 2)} ${round(y, 2)}`;
      })
      .join(" ");
  }

  function renderChart() {
    for (const key of ["happiness", "carShare", "co2"]) {
      root.querySelector(`[data-series="${key}"]`).setAttribute("d", chartPath(state.history, key));
    }
    if (state.month === 0) {
      references.chartSummary.textContent = "Run the model to build a readable history of the three indicators.";
      return;
    }
    references.chartSummary.textContent = `By ${dateLabel()}, the satisfaction index is ${round(state.metrics.happiness, 1)}, car share is ${round(
      state.metrics.carShare,
      1
    )}%, and the transport CO2 index is ${round(state.metrics.co2, 0)}.`;
  }

  function renderInsight() {
    let title = "A stable reference case";
    let copy = "Use the reference run to see how accessibility, rent, and travel choices settle before introducing a policy change.";
    if (state.connector) {
      title = "A direct link changes more than travel time";
      copy =
        "The hypothetical connector redistributes traffic and improves access, but easier driving can also lift car share and development pressure.";
    } else if (state.levers.roadCapacity > 1.2) {
      title = "Road relief can invite more driving";
      copy = "Added capacity reduces delay first. As car utility improves, the model can shift commuters back to cars and rebuild traffic over time.";
    } else if (state.levers.ptSpeed >= 36 || state.levers.ptFare <= 1.25) {
      title = "Transit is becoming competitive";
      copy =
        "Lower generalized cost and shorter waiting time make public transport more attractive, reducing car-kilometres on the busiest corridors.";
    } else if (state.levers.rentPolicy < 0.98) {
      title = "Affordability changes location choice";
      copy = "Lower rent pressure helps households remain near jobs, though growth can move toward zones with spare housing and employment capacity.";
    }
    references.insightTitle.textContent = title;
    references.insightCopy.textContent = copy;
  }

  function dateLabel() {
    const year = START_YEAR + Math.floor(state.month / 12);
    const month = state.month % 12;
    return new Intl.DateTimeFormat("en-AE", { month: "long", year: "numeric" }).format(new Date(year, month, 1));
  }

  function renderMapKey() {
    const labels = {
      load: "Road load legend",
      population: "Population marker-size legend",
      happiness: "Satisfaction index color legend",
    };
    references.mapKey.setAttribute("aria-label", labels[state.mapMode]);
    for (const group of references.mapKey.querySelectorAll("[data-map-key-mode]")) {
      group.hidden = group.dataset.mapKeyMode !== state.mapMode;
    }
  }

  function renderMap() {
    renderMapKey();
    if (!mapState.map) return;
    for (const zone of state.zones) {
      const layer = mapState.zoneLayers.get(zone.id);
      if (!layer) continue;
      const selected = zone.id === state.selectedZone;
      let fillColor = "#2f7d63";
      let radius = 10 + Math.sqrt(zone.population) * 0.55;
      if (state.mapMode === "population") {
        fillColor = "#315f83";
        radius = 8 + Math.sqrt(zone.population) * 0.85;
      }
      if (state.mapMode === "happiness") {
        fillColor = zone.happiness >= 75 ? "#2f7d63" : zone.happiness >= 65 ? "#d29a35" : "#b95548";
        radius = 15;
      }
      layer.setRadius(radius);
      layer.setStyle({
        fillColor,
        fillOpacity: 0.86,
        color: selected ? "#173b2f" : "#ffffff",
        weight: selected ? 4 : 2,
      });
      const metric =
        state.mapMode === "happiness" ? `Satisfaction index ${round(zone.happiness, 1)}` : `${round(zone.population, 0)}k represented residents`;
      layer.setTooltipContent(`<strong>${zone.name}</strong><br>${metric}`);
    }

    for (const route of activeRoutes()) {
      const layer = mapState.routeLayers.get(route.id);
      if (!layer) continue;
      const ratio = state.edgeRatios.get(route.id) || 0;
      const color = ratio < 0.65 ? "#3d8b76" : ratio < 0.9 ? "#d29a35" : "#b95548";
      layer.setStyle({
        color: route.hypothetical ? "#6c5f8b" : color,
        opacity: state.mapMode === "load" ? 0.8 : 0.28,
        weight: route.hypothetical ? 4 : clamp(2.5 + ratio * 3.5, 2.5, 7),
        dashArray: route.hypothetical ? "7 7" : null,
      });
      layer.setTooltipContent(
        route.hypothetical
          ? "Hypothetical model connector"
          : `${round(route.distanceKm, 1)} km representative corridor · ${round(ratio * 100, 0)}% model load`
      );
    }
    const selected = zoneById(state.selectedZone);
    const mapMetric =
      state.mapMode === "population"
        ? `${round(selected.population, 0)}k represented residents`
        : state.mapMode === "happiness"
          ? `satisfaction index ${round(selected.happiness, 1)}`
          : `average network road load ${round(state.metrics.roadLoad, 0)}%`;
    references.mapSummary.textContent = `Eight synthetic study zones span metropolitan Abu Dhabi, Al Ain, and Al Dhafra through representative OSM-derived routes. ${selected.name} is selected; ${mapMetric}.`;
  }

  function render() {
    if (!state.metrics) computeMetrics();
    const currentSnapshot = snapshot(state.metrics);
    const lastSnapshot = state.history.at(-1);
    if (lastSnapshot?.month === state.month) state.history[state.history.length - 1] = currentSnapshot;
    else state.history.push(currentSnapshot);
    references.date.textContent = dateLabel();
    references.progress.value = state.month;
    references.progress.textContent = `${state.month} of ${MONTHS} months`;
    references.modelState.textContent = state.month >= MONTHS ? "Complete" : state.running ? "Running" : state.month ? "Paused" : "Ready";
    root.classList.toggle("is-running", state.running);
    renderKpis();
    renderSelectedZone();
    renderTable();
    renderChart();
    renderInsight();
    renderMap();
    syncZoneControls();
  }

  function announce(message) {
    references.liveStatus.textContent = message;
  }

  function setRunning(running) {
    state.running = running && state.month < MONTHS;
    root.classList.toggle("is-running", state.running);
    root.querySelector("[data-action='play']").setAttribute("aria-pressed", String(state.running));
    references.playLabel.textContent = state.running ? "Pause model" : state.month >= MONTHS ? "Run again" : "Run model";
    references.modelState.textContent = state.running ? "Running" : state.month ? "Paused" : "Ready";
  }

  function resetSimulation(scenario = state.scenario) {
    const selectedZone = state.selectedZone;
    state = createState(scenario);
    state.selectedZone = selectedZone;
    computeMetrics();
    state.history = [snapshot(state.metrics)];
    clearConnectorLayer();
    references.connectorFrom.value = "downtown";
    references.connectorTo.value = "reem";
    syncControls();
    state.emirateView = true;
    setMapView(true);
    rebuildRouteLayers();
    render();
    announce(`${scenario === "baseline" ? "Reference" : "Policy"} scenario restored to January ${START_YEAR}.`);
  }

  function selectZone(id, fromMap = false) {
    if (!zoneById(id)) return;
    if (state.connectorMode && fromMap) {
      if (!state.connectorSelection.length) {
        state.connectorSelection = [id];
        references.connectorFrom.value = id;
        announce(`${zoneById(id).name} selected. Choose a second study zone.`);
      } else if (state.connectorSelection[0] === id) {
        announce("Choose a different destination zone.");
      } else {
        references.connectorTo.value = id;
        createConnector(state.connectorSelection[0], id);
      }
      return;
    }
    state.selectedZone = id;
    references.zoneSelect.value = id;
    renderSelectedZone();
    renderTable();
    renderMap();
    syncZoneControls();
  }

  function createConnector(from, to) {
    const first = zoneById(from);
    const second = zoneById(to);
    if (!first || !second || from === to) {
      announce("Choose two different study zones for the connector.");
      references.connectorTo.focus();
      return;
    }
    state.connector = {
      from,
      to,
      distanceKm: haversine(first.coordinates, second.coordinates) * 1.08,
      coordinates: [
        [first.coordinates[1], first.coordinates[0]],
        [second.coordinates[1], second.coordinates[0]],
      ],
    };
    state.connectorMode = false;
    state.connectorSelection = [];
    references.connectorFrom.value = from;
    references.connectorTo.value = to;
    const button = root.querySelector("[data-action='connector']");
    button.textContent = "Remove connector";
    references.connectorMapButton.setAttribute("aria-pressed", "false");
    references.connectorMapButton.textContent = "Choose on map";
    computeMetrics();
    rebuildRouteLayers();
    render();
    announce(`A model-only connector now links ${first.name} and ${second.name}.`);
  }

  function clearConnectorLayer() {
    if (mapState.connectorLayer && mapState.map) mapState.map.removeLayer(mapState.connectorLayer);
    mapState.connectorLayer = null;
    const button = root.querySelector("[data-action='connector']");
    button.textContent = "Add connector";
    references.connectorMapButton.setAttribute("aria-pressed", "false");
    references.connectorMapButton.textContent = "Choose on map";
  }

  function applyConnector() {
    if (state.connector) {
      state.connector = null;
      clearConnectorLayer();
      computeMetrics();
      rebuildRouteLayers();
      render();
      announce("The hypothetical connector was removed.");
      return;
    }
    createConnector(references.connectorFrom.value, references.connectorTo.value);
  }

  function toggleConnectorMapMode() {
    state.connectorMode = !state.connectorMode;
    state.connectorSelection = [];
    const button = references.connectorMapButton;
    button.setAttribute("aria-pressed", String(state.connectorMode));
    button.textContent = state.connectorMode ? "Cancel map choice" : "Choose on map";
    announce(state.connectorMode ? "Select two study zones on the map." : "Connector selection cancelled.");
  }

  function setMapView(showEmirate) {
    if (!mapState.map) return;
    const bounds = showEmirate ? mapState.emirateBounds : mapState.metroBounds;
    mapState.map.fitBounds(bounds, { padding: [24, 24], maxZoom: showEmirate ? 7 : 10 });
  }

  function initializeMap() {
    const mapElement = document.querySelector("#udes-map");
    if (!window.L || !mapElement) {
      root.querySelector("[data-map-empty]").hidden = false;
      for (const control of root.querySelectorAll("[data-map-only]")) {
        control.disabled = true;
        control.setAttribute("aria-describedby", "udes-map-empty");
      }
      references.mapKey.hidden = true;
      references.networkStatus.textContent = "Map library unavailable; model results remain active.";
      references.mapSummary.textContent =
        "The interactive map is unavailable. All eight study-zone results remain available in the comparison table.";
      return;
    }
    mapState.emirateBounds = window.L.latLngBounds(state.zones.map((zone) => zone.coordinates));
    mapState.metroBounds = window.L.latLngBounds(
      state.zones.filter((zone) => !["alain", "ruwais"].includes(zone.id)).map((zone) => zone.coordinates)
    );
    mapState.map = window.L.map(mapElement, { zoomControl: false, preferCanvas: true, minZoom: 6 });
    setMapView(true);
    window.L.control.zoom({ position: "topright" }).addTo(mapState.map);
    window.L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>',
    }).addTo(mapState.map);

    for (const zone of state.zones) {
      const layer = window.L.circleMarker(zone.coordinates, {
        radius: 15,
        color: "#fff",
        weight: 2,
        fillColor: "#2f7d63",
        fillOpacity: 0.86,
        bubblingMouseEvents: false,
      })
        .addTo(mapState.map)
        .bindTooltip(zone.name, { direction: "top", className: "udes-zone-tooltip" });
      layer.on("click", () => selectZone(zone.id, true));
      mapState.zoneLayers.set(zone.id, layer);
    }
    rebuildRouteLayers();
    window.setTimeout(() => mapState.map.invalidateSize(), 50);
  }

  function rebuildRouteLayers() {
    if (!mapState.map) return;
    for (const layer of mapState.routeLayers.values()) mapState.map.removeLayer(layer);
    for (const vehicle of mapState.vehicles) mapState.map.removeLayer(vehicle.marker);
    mapState.routeLayers.clear();
    mapState.vehicles = [];
    mapState.connectorLayer = null;

    for (const route of activeRoutes()) {
      const latLngs = route.coordinates.map(([longitude, latitude]) => [latitude, longitude]);
      const layer = window.L.polyline(latLngs, {
        color: route.hypothetical ? "#6c5f8b" : "#3d8b76",
        weight: route.hypothetical ? 4 : 3,
        opacity: 0.75,
        dashArray: route.hypothetical ? "7 7" : null,
      })
        .addTo(mapState.map)
        .bindTooltip(route.hypothetical ? "Hypothetical model connector" : `${round(route.distanceKm, 1)} km representative corridor`);
      mapState.routeLayers.set(route.id, layer);
      if (route.hypothetical) mapState.connectorLayer = layer;
    }

    if (!REDUCED_MOTION) {
      routes.forEach((route, routeIndex) => {
        const count = routeIndex % 2 === 0 ? 3 : 2;
        for (let index = 0; index < count; index += 1) {
          const start = route.coordinates[0];
          const marker = window.L.marker([start[1], start[0]], {
            interactive: false,
            keyboard: false,
            icon: window.L.divIcon({ className: "", html: '<span class="udes-commuter"></span>', iconSize: [9, 9], iconAnchor: [4, 4] }),
          }).addTo(mapState.map);
          mapState.vehicles.push({ marker, route, offset: (index / count + routeIndex * 0.13) % 1, direction: index % 2 ? -1 : 1 });
        }
      });
    }
    renderMap();
  }

  function pointAlong(coordinates, progress) {
    if (coordinates.length < 2) return coordinates[0];
    const lengths = [];
    let total = 0;
    for (let index = 1; index < coordinates.length; index += 1) {
      const previous = coordinates[index - 1];
      const current = coordinates[index];
      const distance = Math.hypot(current[0] - previous[0], current[1] - previous[1]);
      lengths.push(distance);
      total += distance;
    }
    let target = progress * total;
    for (let index = 0; index < lengths.length; index += 1) {
      if (target <= lengths[index]) {
        const fraction = lengths[index] ? target / lengths[index] : 0;
        const start = coordinates[index];
        const end = coordinates[index + 1];
        return [start[0] + (end[0] - start[0]) * fraction, start[1] + (end[1] - start[1]) * fraction];
      }
      target -= lengths[index];
    }
    return coordinates.at(-1);
  }

  function animateVehicles(elapsed) {
    if (!state.running || !mapState.vehicles.length) return;
    animationPhase = (animationPhase + elapsed * 0.000035 * state.speed) % 1;
    for (const vehicle of mapState.vehicles) {
      let progress = (vehicle.offset + animationPhase * vehicle.direction + 1) % 1;
      if (progress > 0.5) progress = 1 - progress;
      progress *= 2;
      const [longitude, latitude] = pointAlong(vehicle.route.coordinates, progress);
      vehicle.marker.setLatLng([latitude, longitude]);
    }
  }

  async function loadNetwork() {
    try {
      const response = await fetch(root.dataset.networkUrl, { credentials: "same-origin" });
      if (!response.ok) throw new Error(`Network response ${response.status}`);
      const data = await response.json();
      if (!Array.isArray(data.routes) || data.routes.length < 11) throw new Error("Incomplete route data");
      const untouched = state.month === 0 && state.history.length <= 1 && !state.running;
      if (!untouched) {
        references.networkStatus.textContent = "Road snapshot ready; reset the model to apply it consistently";
        return;
      }
      routes = data.routes.map((route) => ({
        ...route,
        capacity: route.capacity || routeCapacity[route.id] || 70000,
        distanceKm: Number(route.distanceKm),
      }));
      if (untouched) state.baseline = null;
      computeMetrics();
      if (untouched) state.history = [snapshot(state.metrics)];
      rebuildRouteLayers();
      render();
      references.networkStatus.textContent = "Representative road routes: OpenStreetMap / OSRM snapshot";
    } catch (error) {
      references.networkStatus.textContent = "OSM basemap active; simplified corridor fallback in use";
    } finally {
      references.playButton.disabled = false;
      references.stepButton.disabled = false;
    }
  }

  function bindEvents() {
    root.querySelector("[data-action='play']").addEventListener("click", () => {
      if (state.month >= MONTHS) resetSimulation(state.scenario);
      setRunning(!state.running);
      announce(state.running ? "Simulation running." : "Simulation paused.");
    });
    root.querySelector("[data-action='step']").addEventListener("click", () => {
      setRunning(false);
      const complete = advanceMonth();
      if (!complete) announce(`Advanced to ${dateLabel()}.`);
    });
    root.querySelector("[data-action='reset']").addEventListener("click", () => resetSimulation(state.scenario));
    root.querySelector("[data-action='reset-levers']").addEventListener("click", () => {
      state.levers = { ...defaultLevers };
      state.scenario = "custom";
      computeMetrics();
      syncControls();
      render();
      announce("City levers returned to reference values; zone settings and model time were kept.");
    });
    root.querySelector("[data-action='connector']").addEventListener("click", applyConnector);
    references.connectorMapButton.addEventListener("click", toggleConnectorMapMode);
    root.querySelector("[data-action='emirate-view']").addEventListener("click", (event) => {
      if (!mapState.map) return;
      state.emirateView = !state.emirateView;
      event.currentTarget.textContent = state.emirateView ? "Focus metro" : "View whole emirate";
      setMapView(state.emirateView);
    });

    for (const button of root.querySelectorAll("[data-speed]")) {
      button.addEventListener("click", () => {
        state.speed = Number(button.dataset.speed);
        for (const peer of root.querySelectorAll("[data-speed]")) peer.setAttribute("aria-pressed", String(peer === button));
        announce(`Simulation speed set to ${state.speed} times.`);
      });
    }

    for (const button of root.querySelectorAll("[data-scenario]")) {
      button.addEventListener("click", () => resetSimulation(button.dataset.scenario));
    }

    for (const button of root.querySelectorAll("[data-map-mode]")) {
      button.addEventListener("click", () => {
        state.mapMode = button.dataset.mapMode;
        for (const peer of root.querySelectorAll("[data-map-mode]")) peer.setAttribute("aria-pressed", String(peer === button));
        renderMap();
      });
    }

    for (const input of root.querySelectorAll("[data-lever]")) {
      input.addEventListener("input", () => {
        state.levers[input.dataset.lever] = Number(input.value);
        state.scenario = "custom";
        computeMetrics();
        syncControls();
        render();
      });
    }

    references.zoneSelect.addEventListener("change", () => selectZone(references.zoneSelect.value));
    for (const input of root.querySelectorAll("[data-zone-lever]")) {
      input.addEventListener("input", () => {
        const zone = zoneById(state.selectedZone);
        const value = Number(input.value);
        if (input.dataset.zoneLever === "housing") zone.housingMultiplier = value / 100;
        if (input.dataset.zoneLever === "quality") zone.quality = value;
        if (input.dataset.zoneLever === "jobs") zone.jobsMultiplier = value / 100;
        if (input.dataset.zoneLever === "rent") zone.rent = value;
        state.scenario = "custom";
        computeMetrics();
        syncControls();
        render();
      });
    }

    references.zoneTable.addEventListener("click", (event) => {
      const button = event.target.closest("[data-select-zone]");
      if (button) selectZone(button.dataset.selectZone);
    });
  }

  function frame(now) {
    const elapsed = Math.min(now - lastFrame, 250);
    lastFrame = now;
    animateVehicles(elapsed);
    if (state.running) {
      accumulator += elapsed;
      const interval = 1000 / state.speed;
      while (accumulator >= interval && state.running) {
        accumulator -= interval;
        advanceMonth();
      }
    } else {
      accumulator = 0;
    }
    window.requestAnimationFrame(frame);
  }

  computeMetrics();
  state.history = [snapshot(state.metrics)];
  bindEvents();
  syncControls();
  initializeMap();
  render();
  loadNetwork();
  window.requestAnimationFrame(frame);
})();
