/*
 * Abu Dhabi Urban Dynamics Engine v2
 *
 * A dependency-free Web Worker simulation core. Persistent weighted citizen
 * and enterprise agents produce aggregate city, zone, and network outcomes.
 *
 * Worker request: { type, requestId?, payload? }
 *   init       { data?: { zones?, links? }, config?: Partial<Config>, seed? }
 *   step       { days?: 1, snapshot?: SnapshotOptions }
 *   run        { days, chunkDays?: 30, snapshot?: SnapshotOptions }
 *   reset      { seed? }
 *   configure  { patch, reset?: false }
 *   inspect    { kind: city|zone|citizen|enterprise|link, id?, historyLimit? }
 *
 * Worker reply: ready | snapshot | progress | inspection | error. Replies
 * preserve requestId. Default snapshots include bounded agent samples; use
 * inspect or explicit citizenIds/enterpriseIds for individual histories.
 */

(function attachUdesV2(globalScope) {
  "use strict";

  const SCHEMA_VERSION = "2.0";
  const DAY_MS = 86400000;
  const EPSILON = 1e-9;

  // These are transparent, illustrative Abu Dhabi City calibration values,
  // not official forecasts. Original UDES rules are identified in comments;
  // monetary levels, population weights, district data, and commute supply are
  // Abu Dhabi-oriented assumptions and remain configurable through init.
  const DEFAULT_CONFIG = Object.freeze({
    calibrationLabel: "Illustrative Abu Dhabi City baseline (not a validated forecast)",
    startDate: "2026-01-01",
    seed: 47990,
    citizenCount: 8000,
    enterpriseCount: 600,
    citizenWeight: 100,
    initialEmploymentRate: 0.78,
    initialCarOwnership: 0.86,
    initialHomeZoneJobProbability: 0.3,
    initialHousingOccupancyTarget: 0.82,
    initialBankMonthsOfSalary: 1.5,
    ageMin: 20,
    ageMax: 80,
    retirementSalaryFactorAfterAge: 60,
    retirementSalaryFactor: 0.5,
    workdays: [1, 2, 3, 4, 5],
    workdaysPerMonth: 22,
    agentSampleSize: 12,
    routingBatchSize: 512,
    maxDailyLaborMatches: 160,
    betterJobSearchAttempts: 8,
    betterJobMinimumRaise: 1.03,
    initialHousingCapacityBuffer: 1.2,
    housingCapacityMultiplier: 1,
    businessCapacityMultiplier: 1,
    rentPressureMultiplier: 1,
    placeQuality: 0.82,
    focusZoneId: null,
    housingRentBaseAed: 3000,
    assignmentPeakHours: 8,
    // The 18-zone graph has one representative edge where the real city has
    // several parallel roads and bus services. These factors convert an
    // observed/synthetic per-corridor hourly capacity into an aggregate
    // district-to-district assignment capacity. They apply only to inputs
    // explicitly supplied as `*PerHour`, never to already-aggregated values.
    roadCorridorBundleFactor: 5,
    ptCorridorBundleFactor: 48,

    // UDES state guards, translated from generic monetary units into
    // configurable AED monthly buffers. `extremeNetIncomeAed` represents a
    // material monthly cash deficit, rather than treating every small positive
    // remainder as an emergency. These remain assumptions, not forecasts.
    waitingNetIncomeAed: 1500,
    extremeNetIncomeAed: -500,
    extremeBankBalanceAed: 1000,
    acceptableCommuteRoundTripMin: 30,
    extremeCommuteRoundTripMin: 48,
    // The calibrated city model lets a commute-only hardship pass through
    // Waiting before it can become Extreme. Set this to zero (or enable the
    // exact guard switch) to reproduce the immediate UDES guard.
    commuteExtremeGraceDays: 45,
    udesExactCommuteStateGuards: false,
    waitingDecisionMinDays: 60,
    waitingDecisionMaxDays: 90,
    extremeDecisionMinDays: 10,
    extremeDecisionMaxDays: 60,
    carConsiderationMinDays: 700,
    carConsiderationMaxDays: 1000,
    qualityMoveMinDays: 365,
    qualityMoveMaxDays: 730,

    // UDES mode-choice coefficients. Costs are divided by costScaleAed before
    // applying the original generic-money coefficient.
    carAlternativeConstant: 2.2,
    modeCostCoefficient: -0.3,
    carTimeCoefficient: -0.05,
    ptTimeCoefficient: -0.035,
    ptWaitCoefficient: -0.06,
    costScaleAed: 10,
    ptFareOneWayAed: 2,
    ptAverageSpeedKmh: 28,
    ptAverageWaitMin: 7,
    carFuelAndRunningCostAedPerKm: 0.28,
    carFixedDailyCostAed: 15,
    carOccupancy: 1.2,
    walkSpeedKmh: 4.8,
    localWalkCommuteMin: 16,
    localWalkDistanceKm: 1.2,
    // A district is not a walk-only point. These explicit same-zone shares
    // represent short trips distributed across a real district. Car choice is
    // conditional on ownership; the remaining choices split between walking
    // and public transport. Disable the switch for the original point-zone
    // behavior where every same-zone commute is a walk.
    useCalibratedSameZoneModeChoice: true,
    localCarChoiceProbabilityWithCar: 0.78,
    localWalkChoiceProbabilityOtherwise: 0.62,
    localCarCommuteMin: 22,
    localCarDistanceKm: 7,
    localPtCommuteMin: 34,
    localPtDistanceKm: 6,
    // Car disposal is a liquidity response in the calibrated model, not an
    // automatic response to commute duration. The exact switch restores the
    // original implementation's disposal on every Extreme entry.
    udesExactExtremeCarDisposal: false,
    carDisposalNetIncomeAed: -3000,
    carDisposalBankBalanceAed: 0,
    roadSpeedMultiplier: 1,
    roadCapacityMultiplier: 1,
    ptCapacityMultiplier: 1,

    // Firm statechart. Mean-day values use exponential timeouts, matching the
    // UDES paper where specified. Lesser action timing is an exposed inference.
    firmWorkingToGrowMeanDays: 80,
    firmWorkingToLesserMeanDays: 80,
    firmGrowthActionMeanDays: 30,
    firmLesserActionMeanDays: 30,
    firmGrowReturnMeanDays: 80,
    firmLesserReturnMeanDays: 80,
    firmMoveProbabilityOnStateEntry: 0.35,
    firmInitialMinJobSlots: 8,
    firmInitialMaxJobSlots: 16,
    firmJobStepSlots: 1,
    firmAnnualWageGrowth: 0.015,
    firmGrowthWageIncrease: 0.015,
    firmLesserWageDecrease: 0.02,
    businessRentBaseAedPerRepresentedWorker: 32,

    // Synthetic Abu Dhabi enterprise-economics extension. Set this false to
    // retain the reference UDES independent exponential state hazards. The
    // extension does not add profit-maximising agents: it only conditions the
    // existing Grow/Lesser clocks and relocation ranking on transparent,
    // lightweight monthly operating signals.
    endogenousEnterpriseDynamics: true,
    enterpriseTargetMargin: 0.12,
    enterpriseNonLaborCostShare: 0.18,
    enterpriseFixedCostAedPerCapacityWorker: 850,
    enterpriseMarginHazardSensitivity: 1.8,
    enterpriseFillHazardSensitivity: 0.8,
    enterpriseDemandHazardSensitivity: 1.25,
    enterpriseHazardMultiplierMin: 0.35,
    enterpriseHazardMultiplierMax: 2.75,
    enterpriseDemandShockAmplitude: 0.035,
    enterpriseDemandShockPersistence: 0.65,
    enterpriseLaborAccessDecayKm: 12,
    sectorDistribution: [
      { id: "public-services", label: "Public & social services", share: 0.2, demandBase: 1.02, revenuePerWorkerAed: 18500 },
      { id: "professional-finance", label: "Professional & finance", share: 0.19, demandBase: 1.04, revenuePerWorkerAed: 26500 },
      { id: "retail-hospitality", label: "Retail & hospitality", share: 0.2, demandBase: 0.99, revenuePerWorkerAed: 15500 },
      { id: "construction-real-estate", label: "Construction & real estate", share: 0.18, demandBase: 0.98, revenuePerWorkerAed: 18000 },
      { id: "logistics-industry", label: "Logistics & industry", share: 0.13, demandBase: 1, revenuePerWorkerAed: 17500 },
      { id: "technology-knowledge", label: "Technology & knowledge", share: 0.1, demandBase: 1.06, revenuePerWorkerAed: 24500 },
    ],

    // Abu Dhabi-oriented illustrative salary mass points (AED/month).
    salaryDistribution: [
      [3000, 0.07],
      [4500, 0.14],
      [6500, 0.23],
      [9000, 0.23],
      [13000, 0.16],
      [18000, 0.1],
      [26000, 0.05],
      [40000, 0.02],
    ],
    annualMortalityAt70: 0.015,
    annualMortalityGrowthPerYear: 1.12,
    annualMortalityCap: 0.25,
    annualRentMaxIncrease: 1.08,
    annualRentMaxDecrease: 0.94,
    citizenHistoryEveryMonths: 3,
    citizenHistoryLimit: 24,
    enterpriseHistoryEveryMonths: 3,
    enterpriseHistoryLimit: 24,
    eventHistoryLimit: 32,
    aggregateHistoryLimit: 240,
  });

  // District polygons/road geometry can replace these definitions at init.
  // The defaults deliberately split Abu Dhabi Island into actual named areas.
  const DEFAULT_ZONES = Object.freeze([
    {
      id: "danah",
      name: "Al Danah / CBD",
      lat: 24.491,
      lon: 54.365,
      populationShare: 0.09,
      firmShare: 0.15,
      quality: 0.79,
      residentialRentAed: 2500,
    },
    { id: "zahiyah", name: "Al Zahiyah", lat: 24.498, lon: 54.379, populationShare: 0.075, firmShare: 0.1, quality: 0.8, residentialRentAed: 2800 },
    {
      id: "khalidiyah",
      name: "Al Khalidiyah",
      lat: 24.469,
      lon: 54.348,
      populationShare: 0.09,
      firmShare: 0.07,
      quality: 0.84,
      residentialRentAed: 3200,
    },
    { id: "bateen", name: "Al Bateen", lat: 24.447, lon: 54.35, populationShare: 0.055, firmShare: 0.04, quality: 0.91, residentialRentAed: 4200 },
    {
      id: "mushrif",
      name: "Al Mushrif",
      lat: 24.439,
      lon: 54.383,
      populationShare: 0.085,
      firmShare: 0.055,
      quality: 0.86,
      residentialRentAed: 3200,
    },
    { id: "nahyan", name: "Al Nahyan", lat: 24.47, lon: 54.39, populationShare: 0.075, firmShare: 0.075, quality: 0.82, residentialRentAed: 2900 },
    { id: "rawdah", name: "Al Rawdah", lat: 24.431, lon: 54.414, populationShare: 0.065, firmShare: 0.08, quality: 0.87, residentialRentAed: 3300 },
    {
      id: "reem",
      name: "Al Reem Island",
      lat: 24.495,
      lon: 54.408,
      populationShare: 0.085,
      firmShare: 0.075,
      quality: 0.9,
      residentialRentAed: 3700,
    },
    {
      id: "maryah",
      name: "Al Maryah Island",
      lat: 24.501,
      lon: 54.389,
      populationShare: 0.025,
      firmShare: 0.095,
      quality: 0.94,
      residentialRentAed: 4300,
    },
    {
      id: "saadiyat",
      name: "Saadiyat Island",
      lat: 24.54,
      lon: 54.435,
      populationShare: 0.035,
      firmShare: 0.055,
      quality: 0.95,
      residentialRentAed: 4800,
    },
    { id: "raha", name: "Al Raha", lat: 24.452, lon: 54.604, populationShare: 0.055, firmShare: 0.045, quality: 0.9, residentialRentAed: 3600 },
    {
      id: "khalifa",
      name: "Khalifa City",
      lat: 24.425,
      lon: 54.58,
      populationShare: 0.075,
      firmShare: 0.055,
      quality: 0.85,
      residentialRentAed: 2800,
    },
    {
      id: "mbz",
      name: "Mohamed Bin Zayed City",
      lat: 24.33,
      lon: 54.54,
      populationShare: 0.105,
      firmShare: 0.04,
      quality: 0.76,
      residentialRentAed: 2100,
    },
    {
      id: "mussafah",
      name: "Mussafah / Shabiya",
      lat: 24.36,
      lon: 54.51,
      populationShare: 0.12,
      firmShare: 0.065,
      quality: 0.68,
      residentialRentAed: 1700,
    },
  ]);

  const DEFAULT_LINK_SPECS = Object.freeze([
    ["danah", "zahiyah", 22000],
    ["danah", "khalidiyah", 26000],
    ["danah", "nahyan", 30000],
    ["zahiyah", "nahyan", 26000],
    ["zahiyah", "maryah", 34000],
    ["zahiyah", "reem", 30000],
    ["maryah", "reem", 28000],
    ["maryah", "saadiyat", 36000],
    ["reem", "saadiyat", 38000],
    ["khalidiyah", "bateen", 24000],
    ["khalidiyah", "nahyan", 26000],
    ["bateen", "mushrif", 22000],
    ["nahyan", "mushrif", 30000],
    ["nahyan", "rawdah", 34000],
    ["mushrif", "rawdah", 30000],
    ["rawdah", "saadiyat", 38000],
    ["saadiyat", "raha", 46000],
    ["reem", "raha", 52000],
    ["rawdah", "raha", 60000],
    ["rawdah", "mussafah", 56000],
    ["rawdah", "khalifa", 56000],
    ["raha", "khalifa", 52000],
    ["raha", "mussafah", 50000],
    ["khalifa", "mussafah", 48000],
    ["khalifa", "mbz", 50000],
    ["mussafah", "mbz", 52000],
  ]);

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function round(value, digits = 2) {
    const factor = 10 ** digits;
    return Math.round((value + Number.EPSILON) * factor) / factor;
  }

  function deepClone(value) {
    return value == null ? value : JSON.parse(JSON.stringify(value));
  }

  function isPlainObject(value) {
    return value !== null && typeof value === "object" && !Array.isArray(value);
  }

  function mergeConfig(base, patch) {
    const output = deepClone(base);
    if (!isPlainObject(patch)) return output;
    for (const [key, value] of Object.entries(patch)) {
      if (isPlainObject(value) && isPlainObject(output[key])) output[key] = mergeConfig(output[key], value);
      else output[key] = deepClone(value);
    }
    return output;
  }

  function normalizeConfigPatch(patch) {
    const output = deepClone(patch || {});
    const aliases = {
      transitFareAed: "ptFareOneWayAed",
      transitSpeedKmh: "ptAverageSpeedKmh",
      carCostPerKmAed: "carFuelAndRunningCostAedPerKm",
    };
    for (const [alias, canonical] of Object.entries(aliases)) {
      if (output[alias] !== undefined && output[canonical] === undefined) output[canonical] = output[alias];
    }
    return output;
  }

  function pushBounded(array, value, limit) {
    array.push(value);
    if (array.length > limit) array.splice(0, array.length - limit);
  }

  function sumBy(items, selector) {
    let total = 0;
    for (const item of items) total += selector(item);
    return total;
  }

  function haversineKm(a, b) {
    const radians = (degrees) => (degrees * Math.PI) / 180;
    const earthRadiusKm = 6371;
    const latitudeDelta = radians(b.lat - a.lat);
    const longitudeDelta = radians(b.lon - a.lon);
    const firstLatitude = radians(a.lat);
    const secondLatitude = radians(b.lat);
    const chord = Math.sin(latitudeDelta / 2) ** 2 + Math.cos(firstLatitude) * Math.cos(secondLatitude) * Math.sin(longitudeDelta / 2) ** 2;
    return 2 * earthRadiusKm * Math.asin(Math.sqrt(chord));
  }

  class SeededRandom {
    constructor(seed) {
      this.initialSeed = SeededRandom.normalizeSeed(seed);
      this.state = this.initialSeed;
    }

    static normalizeSeed(seed) {
      const numeric = Number(seed);
      if (!Number.isFinite(numeric)) return 47990;
      const normalized = numeric >>> 0;
      return normalized || 0x6d2b79f5;
    }

    reset(seed = this.initialSeed) {
      this.initialSeed = SeededRandom.normalizeSeed(seed);
      this.state = this.initialSeed;
    }

    next() {
      let value = (this.state += 0x6d2b79f5);
      value = Math.imul(value ^ (value >>> 15), value | 1);
      value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
      return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
    }

    integer(min, max) {
      const low = Math.ceil(min);
      const high = Math.floor(max);
      return low + Math.floor(this.next() * (high - low + 1));
    }

    exponential(mean) {
      return Math.max(1, Math.ceil(-Math.log(Math.max(EPSILON, 1 - this.next())) * mean));
    }

    pick(items) {
      return items.length ? items[Math.floor(this.next() * items.length)] : null;
    }

    weighted(items, weightSelector) {
      if (!items.length) return null;
      const total = sumBy(items, (item) => Math.max(0, weightSelector(item)));
      if (total <= EPSILON) return this.pick(items);
      let cursor = this.next() * total;
      for (const item of items) {
        cursor -= Math.max(0, weightSelector(item));
        if (cursor <= 0) return item;
      }
      return items[items.length - 1];
    }

    shuffle(array) {
      for (let index = array.length - 1; index > 0; index -= 1) {
        const other = Math.floor(this.next() * (index + 1));
        [array[index], array[other]] = [array[other], array[index]];
      }
      return array;
    }
  }

  class UdesV2Engine {
    constructor(options = {}) {
      this.initialize(options);
    }

    initialize(options = {}) {
      const suppliedConfig = normalizeConfigPatch(options.config || {});
      const calibration = options.data?.calibration;
      if (calibration && options.config?.citizenWeight === undefined) {
        suppliedConfig.citizenWeight = Number(calibration.citizenAgentPersonsRecommended) || DEFAULT_CONFIG.citizenWeight;
      }
      if (calibration && options.config?.citizenCount === undefined) {
        const representedPopulation = Number(calibration.studyScopePopulation2024);
        if (representedPopulation > 0) {
          suppliedConfig.citizenCount = Math.max(1, Math.round(representedPopulation / suppliedConfig.citizenWeight));
        }
      }
      this.config = mergeConfig(DEFAULT_CONFIG, suppliedConfig);
      if (options.seed != null) this.config.seed = SeededRandom.normalizeSeed(options.seed);
      this.seed = SeededRandom.normalizeSeed(this.config.seed);
      this.rng = new SeededRandom(this.seed);
      this.initialOptions = {
        seed: this.seed,
        config: deepClone(suppliedConfig),
        data: deepClone(options.data || {}),
      };
      this.day = 0;
      this.monthCounter = 0;
      this.yearCounter = 0;
      this.startEpoch = Date.parse(`${this.config.startDate}T00:00:00Z`);
      if (!Number.isFinite(this.startEpoch)) throw new Error("config.startDate must use YYYY-MM-DD");
      this.clock = this.clockAt(0);
      this.eventsTotal = this.emptyEventCounters();
      this.lastHistoryEventTotals = this.emptyEventCounters();
      this.cityHistory = [];
      this.zones = this.createZones(options.data?.zones || DEFAULT_ZONES);
      this.zoneById = new Map(this.zones.map((zone) => [zone.id, zone]));
      this.applyPlaceQualityPolicy();
      this.links = this.createLinks(options.data?.links || options.data?.routes, options.data?.transit);
      this.linkById = new Map(this.links.map((link) => [link.id, link]));
      this.graph = this.buildGraph();
      this.citizens = [];
      this.citizenById = new Map();
      this.enterprises = [];
      this.enterpriseById = new Map();
      this.unemployedIds = new Set();
      this.daily = this.emptyDailyMetrics();
      this.lastSnapshotCache = null;
      this.createEnterprises();
      this.createCitizens();
      this.assignInitialEmployment();
      this.initializeCitizenFinances();
      this.updateZoneAndEnterpriseRents();
      this.updateEnterpriseSalaryBills();
      this.updateEnterpriseEconomics(true);
      // The start date is an operational model day, not an empty pre-simulation
      // frame. Seed its commute, congestion, and agent decisions so the first
      // snapshot is analytically meaningful.
      this.commuteCitizens();
      this.updateCitizenStates();
      this.updateEnterprisesDaily();
      this.recordMonthlyHistory(true);
      return this.snapshot();
    }

    reset(seed = this.initialOptions.seed) {
      return this.initialize({
        seed,
        config: this.initialOptions.config,
        data: this.initialOptions.data,
      });
    }

    configure(patch, reset = false) {
      if (!isPlainObject(patch)) throw new Error("configure.patch must be an object");
      const normalizedPatch = normalizeConfigPatch(patch);
      if (reset) {
        this.initialOptions.config = mergeConfig(this.initialOptions.config, normalizedPatch);
        return this.initialize({
          seed: normalizedPatch.seed ?? this.seed,
          config: this.initialOptions.config,
          data: this.initialOptions.data,
        });
      }
      const structuralKeys = ["citizenCount", "enterpriseCount", "citizenWeight", "startDate", "salaryDistribution", "sectorDistribution"];
      if (structuralKeys.some((key) => Object.prototype.hasOwnProperty.call(normalizedPatch, key))) {
        throw new Error(`Structural configuration (${structuralKeys.join(", ")}) requires reset:true`);
      }
      const previousHousing = this.config.housingCapacityMultiplier;
      const previousBusiness = this.config.businessCapacityMultiplier;
      const previousQuality = this.config.placeQuality;
      this.config = mergeConfig(this.config, normalizedPatch);
      this.initialOptions.config = mergeConfig(this.initialOptions.config, normalizedPatch);
      const targetZones = this.config.focusZoneId ? this.zones.filter((zone) => zone.id === this.config.focusZoneId) : this.zones;
      if (normalizedPatch.housingCapacityMultiplier !== undefined && previousHousing > 0) {
        const ratio = this.config.housingCapacityMultiplier / previousHousing;
        for (const zone of targetZones) {
          zone.housingCapacityAgents = Math.max(zone.residentIds.size, Math.round(zone.housingCapacityAgents * ratio));
        }
      }
      if (normalizedPatch.businessCapacityMultiplier !== undefined && previousBusiness > 0) {
        const ratio = this.config.businessCapacityMultiplier / previousBusiness;
        for (const zone of targetZones) {
          zone.enterprisePlaceCapacity = Math.max(zone.enterpriseIds.size, Math.round(zone.enterprisePlaceCapacity * ratio));
        }
      }
      if (normalizedPatch.placeQuality !== undefined) {
        const change = this.config.placeQuality - previousQuality;
        for (const zone of targetZones) zone.quality = clamp(zone.quality + change, 0, 1);
      }
      if (normalizedPatch.endogenousEnterpriseDynamics !== undefined) this.updateEnterpriseEconomics(true);
      this.lastSnapshotCache = null;
      return this.snapshot();
    }

    emptyEventCounters() {
      return {
        residentialMoves: 0,
        jobChanges: 0,
        hires: 0,
        fires: 0,
        carAcquisitions: 0,
        carDisposals: 0,
        replacements: 0,
        firmMoves: 0,
        firmRestarts: 0,
      };
    }

    emptyDailyMetrics() {
      return {
        representedTrips: 0,
        carTrips: 0,
        ptTrips: 0,
        walkTrips: 0,
        forcedWalkTrips: 0,
        carVehicleKm: 0,
        ptPassengerKm: 0,
        walkPassengerKm: 0,
        weightedRoundTripMinutes: 0,
      };
    }

    clockAt(day) {
      const date = new Date(this.startEpoch + day * DAY_MS);
      return {
        day,
        date: date.toISOString().slice(0, 10),
        year: date.getUTCFullYear(),
        month: date.getUTCMonth() + 1,
        dayOfMonth: date.getUTCDate(),
        weekday: date.getUTCDay(),
      };
    }

    createZones(zoneDefinitions) {
      if (!Array.isArray(zoneDefinitions) || zoneDefinitions.length < 2) throw new Error("At least two zones are required");
      const populationBases = zoneDefinitions.map((zone) => Number(zone.populationShare ?? zone.population2024) || 1);
      const firmBases = zoneDefinitions.map((zone) => Number(zone.firmShare ?? zone.jobs2024) || 1);
      const normalizedShares = populationBases.reduce((sum, value) => sum + value, 0);
      const normalizedFirmShares = firmBases.reduce((sum, value) => sum + value, 0);
      return zoneDefinitions.map((source, index) => {
        const centroid = Array.isArray(source.centroid) ? source.centroid : [];
        const populationShare = populationBases[index] / normalizedShares;
        const firmShare = firmBases[index] / normalizedFirmShares;
        const quality = clamp(Number(source.quality) || 0.7, 0, 1);
        const housingRentIndex = Number(source.housingRentIndex);
        const residentialRentAed = Math.max(
          0,
          Number(source.residentialRentAed ?? source.housingRentAed) ||
            (Number.isFinite(housingRentIndex) ? housingRentIndex * this.config.housingRentBaseAed : this.config.housingRentBaseAed)
        );
        const suppliedCapacityPeople = Number(source.housingCapacityPersons);
        const housingCapacityAgents = Number.isFinite(suppliedCapacityPeople)
          ? Math.ceil((suppliedCapacityPeople / this.config.citizenWeight) * this.config.housingCapacityMultiplier)
          : Math.ceil(this.config.citizenCount * populationShare * this.config.initialHousingCapacityBuffer * this.config.housingCapacityMultiplier);
        return {
          id: String(source.id),
          index,
          name: source.name || String(source.id),
          lat: Number(source.lat ?? centroid[1]),
          lon: Number(source.lon ?? centroid[0]),
          populationShare,
          firmShare,
          quality,
          baselineQuality: quality,
          residentialRentAed,
          businessRentAed: Math.max(0, Number(source.businessRentAed) || 0),
          housingCapacityAgents: Math.max(1, Number(source.housingCapacityAgents) || housingCapacityAgents),
          enterprisePlaceCapacity: Math.max(
            1,
            Math.round(
              (Number(source.enterprisePlaceCapacity) || this.config.enterpriseCount * 1.35 * firmShare) * this.config.businessCapacityMultiplier
            )
          ),
          carOwnershipRate: clamp(Number(source.carOwnershipRate ?? this.config.initialCarOwnership), 0, 1),
          averageMonthlySalaryAed: Math.max(0, Number(source.averageMonthlySalaryAed) || 0),
          jobsBaselineRepresented: Math.max(0, Number(source.jobs2024) || 0),
          jobCapacityRepresented: Math.max(0, Number(source.jobCapacityPersons) || 0),
          residentIds: new Set(),
          enterpriseIds: new Set(),
          history: [],
        };
      });
    }

    applyPlaceQualityPolicy() {
      const targetZones = this.config.focusZoneId ? this.zones.filter((zone) => zone.id === this.config.focusZoneId) : this.zones;
      const change = Number(this.config.placeQuality) - 0.82;
      if (!Number.isFinite(change) || Math.abs(change) < EPSILON) return;
      for (const zone of targetZones) zone.quality = clamp(zone.baselineQuality + change, 0, 1);
    }

    createLinks(linkDefinitions, transitData) {
      const definitions = Array.isArray(linkDefinitions) && linkDefinitions.length ? linkDefinitions : this.defaultLinkDefinitions();
      const transitLinks = Array.isArray(transitData?.links) ? transitData.links : [];
      const transitByPair = new Map();
      for (const transit of transitLinks) transitByPair.set([String(transit.from), String(transit.to)].sort().join("|"), transit);
      return definitions.map((source, index) => {
        const from = this.zoneById.get(String(source.from));
        const to = this.zoneById.get(String(source.to));
        if (!from || !to || from === to) throw new Error(`Invalid link endpoints for ${source.id || index}`);
        const distanceKm = Math.max(0.1, Number(source.distanceKm) || haversineKm(from, to) * 1.22);
        const baseDurationMin = Math.max(1, Number(source.durationMin ?? source.freeFlowMinutes) || (distanceKm / (distanceKm < 8 ? 45 : 70)) * 60);
        const transit = transitByPair.get([from.id, to.id].sort().join("|"));
        const roadCapacity = Number(source.capacityVehicles ?? source.capacity);
        const capacityIsHourly = Number.isFinite(Number(source.capacityVehPerHour));
        const capacityVehicles = capacityIsHourly ? Number(source.capacityVehPerHour) * this.config.assignmentPeakHours : roadCapacity;
        const ptCapacity = Number(source.ptCapacityPassengers ?? source.ptCapacity);
        const ptCapacityIsHourly = Boolean(transit && Number.isFinite(Number(transit.capacityPaxPerHour)));
        const ptCapacityPassengers = ptCapacityIsHourly
          ? Number(transit.capacityPaxPerHour) * this.config.assignmentPeakHours
          : Number.isFinite(ptCapacity)
            ? ptCapacity
            : (capacityVehicles || 30000) * 0.55;
        return {
          id: String(source.id || `${from.id}-${to.id}`),
          index,
          from: from.id,
          to: to.id,
          fromIndex: from.index,
          toIndex: to.index,
          distanceKm,
          baseDurationMin,
          capacityVehicles: Math.max(1, capacityVehicles || 30000),
          capacityIsHourly,
          ptCapacityPassengers: Math.max(1, ptCapacityPassengers),
          ptCapacityIsHourly,
          ptBaseDurationMin: Math.max(1, Number(transit?.inVehicleMinutes) || (distanceKm / this.config.ptAverageSpeedKmh) * 60),
          ptAverageWaitMin: Math.max(0, Number(transit?.averageWaitMinutes) || this.config.ptAverageWaitMin),
          geometry: source.geometry || source.coordinates || null,
          geometryFeatureId: source.geometryFeatureId || null,
          roadClass: source.corridorType || source.roadClass || "urban-arterial",
          loadABVehicles: 0,
          loadBAVehicles: 0,
          loadABPassengers: 0,
          loadBAPassengers: 0,
          travelTimeABMin: baseDurationMin,
          travelTimeBAMin: baseDurationMin,
          history: [],
        };
      });
    }

    defaultLinkDefinitions() {
      const available = new Set(this.zones.map((zone) => zone.id));
      const links = DEFAULT_LINK_SPECS.filter(([from, to]) => available.has(from) && available.has(to)).map(([from, to, capacityVehicles]) => {
        const start = this.zoneById.get(from);
        const end = this.zoneById.get(to);
        const distanceKm = haversineKm(start, end) * 1.22;
        return {
          id: `${from}-${to}`,
          from,
          to,
          distanceKm,
          durationMin: (distanceKm / (distanceKm < 8 ? 45 : 70)) * 60,
          capacityVehicles,
          ptCapacityPassengers: capacityVehicles * 0.55,
        };
      });
      if (links.length) return links;
      const fallback = [];
      for (let index = 1; index < this.zones.length; index += 1) {
        fallback.push({ from: this.zones[index - 1].id, to: this.zones[index].id, capacityVehicles: 30000 });
      }
      return fallback;
    }

    buildGraph() {
      const graph = this.zones.map(() => []);
      for (const link of this.links) {
        graph[link.fromIndex].push({ linkIndex: link.index, toIndex: link.toIndex, direction: 1 });
        graph[link.toIndex].push({ linkIndex: link.index, toIndex: link.fromIndex, direction: -1 });
      }
      return graph;
    }

    allocateZoneByShare(kind) {
      const candidates = this.zones.filter((zone) => {
        if (kind === "resident") return zone.residentIds.size < zone.housingCapacityAgents;
        return zone.enterpriseIds.size < zone.enterprisePlaceCapacity;
      });
      const weightKey = kind === "resident" ? "populationShare" : "firmShare";
      return this.rng.weighted(candidates, (zone) => zone[weightKey]) || this.zones[0];
    }

    createEnterprises() {
      for (let index = 0; index < this.config.enterpriseCount; index += 1) {
        const zone = this.allocateZoneByShare("enterprise");
        const sector =
          this.rng.weighted(this.config.sectorDistribution, (candidate) => Number(candidate.share) || 0) || this.config.sectorDistribution[0];
        const enterprise = {
          id: `e-${String(index + 1).padStart(4, "0")}`,
          index,
          zoneId: zone.id,
          state: "Working",
          stateEnteredDay: 0,
          nextGrowDay: this.rng.exponential(this.config.firmWorkingToGrowMeanDays),
          nextLesserDay: this.rng.exponential(this.config.firmWorkingToLesserMeanDays),
          nextActionDay: null,
          stateExitDay: null,
          hiring: true,
          maxJobSlots: this.rng.integer(this.config.firmInitialMinJobSlots, this.config.firmInitialMaxJobSlots),
          employeeIds: new Set(),
          wageIndex: (zone.averageMonthlySalaryAed > 0 ? zone.averageMonthlySalaryAed / 10000 : 1) * (0.88 + this.rng.next() * 0.24),
          sector: String(sector.id),
          sectorLabel: sector.label || String(sector.id),
          sectorRevenuePerWorkerAed: Math.max(1, Number(sector.revenuePerWorkerAed) || 18000),
          sectorDemandBase: Math.max(0.1, Number(sector.demandBase) || 1),
          demandShock: 0,
          demandIndex: Math.max(0.1, Number(sector.demandBase) || 1),
          laborAccessScore: 0.5,
          vacancyFillRate: 0,
          monthlyRevenueAed: 0,
          monthlyOutputProxy: 0,
          nonLaborOperatingCostAed: 0,
          operatingCostAed: 0,
          operatingMargin: 0,
          growHazardMultiplier: 1,
          lesserHazardMultiplier: 1,
          rentPerRepresentedWorkerAed: 0,
          salaryBillAed: 0,
          history: [],
          events: [],
        };
        zone.enterpriseIds.add(enterprise.id);
        this.enterprises.push(enterprise);
        this.enterpriseById.set(enterprise.id, enterprise);
      }
    }

    createCitizens() {
      for (let index = 0; index < this.config.citizenCount; index += 1) {
        const zone = this.allocateZoneByShare("resident");
        const citizen = {
          id: `c-${String(index + 1).padStart(5, "0")}`,
          index,
          generation: 1,
          weight: this.config.citizenWeight,
          homeZoneId: zone.id,
          workZoneId: null,
          enterpriseId: null,
          age: this.rng.integer(this.config.ageMin, this.config.ageMax),
          hasCar: this.rng.next() < zone.carOwnershipRate,
          salaryAed: 0,
          residentialRentAed: zone.residentialRentAed,
          monthlyTransportCostAed: 0,
          currentMonthTransportCostAed: 0,
          netIncomeAed: 0,
          bankBalanceAed: 0,
          mode: "none",
          routeLinkIds: [],
          roundTripMinutes: 0,
          roundTripDistanceKm: 0,
          dailyTransportCostAed: 0,
          state: "Happy",
          stateEnteredDay: 0,
          stateDecisionDay: null,
          nextCarConsiderationDay: this.rng.integer(this.config.carConsiderationMinDays, this.config.carConsiderationMaxDays),
          nextQualityMoveDay: this.rng.integer(this.config.qualityMoveMinDays, this.config.qualityMoveMaxDays),
          daysDissatisfied: 0,
          lastMoveReason: null,
          history: [],
          events: [],
        };
        zone.residentIds.add(citizen.id);
        this.citizens.push(citizen);
        this.citizenById.set(citizen.id, citizen);
        this.unemployedIds.add(citizen.id);
      }
    }

    sampleSalary(enterprise, age) {
      const distribution = this.config.salaryDistribution;
      const selected = this.rng.weighted(distribution, (entry) => Number(entry[1]) || 0) || distribution[0];
      const jitter = 0.9 + this.rng.next() * 0.2;
      const ageFactor = age > this.config.retirementSalaryFactorAfterAge ? this.config.retirementSalaryFactor : 1;
      return round(Number(selected[0]) * enterprise.wageIndex * jitter * ageFactor, 0);
    }

    findHiringEnterprise(preferredZoneId = null) {
      let candidates = null;
      if (preferredZoneId && this.rng.next() < this.config.initialHomeZoneJobProbability) {
        const preferred = this.zoneById.get(preferredZoneId);
        candidates = preferred
          ? [...preferred.enterpriseIds]
              .map((id) => this.enterpriseById.get(id))
              .filter((enterprise) => enterprise.hiring && enterprise.employeeIds.size < enterprise.maxJobSlots)
          : [];
      }
      if (!candidates?.length) {
        if (!preferredZoneId) {
          for (let attempt = 0; attempt < 12; attempt += 1) {
            const candidate = this.rng.pick(this.enterprises);
            if (candidate?.hiring && candidate.employeeIds.size < candidate.maxJobSlots) return candidate;
          }
        }
        candidates = this.enterprises.filter((enterprise) => enterprise.hiring && enterprise.employeeIds.size < enterprise.maxJobSlots);
      }
      if (!candidates?.length) return null;
      if (!preferredZoneId) return this.rng.pick(candidates);
      const home = this.zoneById.get(preferredZoneId);
      // After the exact UDES 30% home-zone preference, use an explicit
      // Abu Dhabi accessibility weighting rather than uniform distant jobs.
      return this.rng.weighted(candidates, (enterprise) => {
        const work = this.zoneById.get(enterprise.zoneId);
        const vacancy = Math.max(1, enterprise.maxJobSlots - enterprise.employeeIds.size);
        const distance = home && work ? haversineKm(home, work) : 0;
        return vacancy / (2 + distance) ** 0.8;
      });
    }

    employ(citizen, enterprise, salaryAed, reason = "hire") {
      if (!citizen || !enterprise || enterprise.employeeIds.size >= enterprise.maxJobSlots || !enterprise.hiring) return false;
      if (citizen.enterpriseId === enterprise.id) return false;
      if (citizen.enterpriseId) this.detachEmployment(citizen, reason === "better-job" ? "transfer" : "detach", false);
      enterprise.employeeIds.add(citizen.id);
      citizen.enterpriseId = enterprise.id;
      citizen.workZoneId = enterprise.zoneId;
      citizen.salaryAed = Math.max(0, round(salaryAed, 0));
      this.unemployedIds.delete(citizen.id);
      this.eventsTotal.hires += 1;
      if (reason === "better-job") this.eventsTotal.jobChanges += 1;
      this.recordCitizenEvent(citizen, reason, { enterpriseId: enterprise.id, salaryAed: citizen.salaryAed });
      return true;
    }

    detachEmployment(citizen, reason = "fire", countFire = true) {
      if (!citizen.enterpriseId) return false;
      const enterprise = this.enterpriseById.get(citizen.enterpriseId);
      enterprise?.employeeIds.delete(citizen.id);
      const formerEnterpriseId = citizen.enterpriseId;
      citizen.enterpriseId = null;
      citizen.workZoneId = null;
      citizen.salaryAed = 0;
      this.unemployedIds.add(citizen.id);
      if (countFire) this.eventsTotal.fires += 1;
      this.recordCitizenEvent(citizen, reason, { formerEnterpriseId });
      return true;
    }

    assignInitialEmployment() {
      const order = this.rng.shuffle([...this.citizens]);
      for (const citizen of order) {
        if (this.rng.next() >= this.config.initialEmploymentRate) continue;
        const enterprise = this.findHiringEnterprise(citizen.homeZoneId);
        if (!enterprise) break;
        this.employ(citizen, enterprise, this.sampleSalary(enterprise, citizen.age), "initial-hire");
      }
    }

    initializeCitizenFinances() {
      for (const citizen of this.citizens) {
        citizen.residentialRentAed = this.zoneById.get(citizen.homeZoneId).residentialRentAed;
        const expectedTransport = citizen.enterpriseId ? (citizen.hasCar ? 520 : 176) : 0;
        citizen.monthlyTransportCostAed = expectedTransport;
        citizen.netIncomeAed = citizen.salaryAed - citizen.residentialRentAed - expectedTransport;
        citizen.bankBalanceAed = Math.max(this.config.extremeBankBalanceAed, citizen.salaryAed * this.config.initialBankMonthsOfSalary);
      }
    }

    buildPathMatrix(mode) {
      const count = this.zones.length;
      const matrix = Array.from({ length: count }, () => Array(count).fill(null));
      for (let origin = 0; origin < count; origin += 1) {
        const distances = Array(count).fill(Infinity);
        const previous = Array(count).fill(null);
        const visited = Array(count).fill(false);
        distances[origin] = 0;
        for (let pass = 0; pass < count; pass += 1) {
          let current = -1;
          let currentDistance = Infinity;
          for (let index = 0; index < count; index += 1) {
            if (!visited[index] && distances[index] < currentDistance) {
              current = index;
              currentDistance = distances[index];
            }
          }
          if (current < 0) break;
          visited[current] = true;
          for (const edge of this.graph[current]) {
            const link = this.links[edge.linkIndex];
            if (!this.linkHasResidualCapacity(link, edge.direction, mode, 0)) continue;
            const time = this.linkTravelTime(link, edge.direction, mode);
            const candidate = currentDistance + time;
            if (candidate < distances[edge.toIndex]) {
              distances[edge.toIndex] = candidate;
              previous[edge.toIndex] = { from: current, edge };
            }
          }
        }
        for (let destination = 0; destination < count; destination += 1) {
          if (destination === origin) {
            matrix[origin][destination] = { steps: [], oneWayMinutes: 0, distanceKm: 0 };
            continue;
          }
          const steps = [];
          let cursor = destination;
          while (previous[cursor]) {
            const part = previous[cursor];
            steps.unshift(part.edge);
            cursor = part.from;
          }
          if (cursor !== origin || !steps.length) continue;
          matrix[origin][destination] = {
            steps,
            oneWayMinutes: sumBy(steps, (step) => this.linkTravelTime(this.links[step.linkIndex], step.direction, mode)),
            distanceKm: sumBy(steps, (step) => this.links[step.linkIndex].distanceKm),
          };
        }
      }
      return matrix;
    }

    linkDirectionalLoad(link, direction, mode) {
      if (mode === "car") return direction === 1 ? link.loadABVehicles : link.loadBAVehicles;
      return direction === 1 ? link.loadABPassengers : link.loadBAPassengers;
    }

    linkCapacity(link, mode) {
      if (mode === "car") {
        const representationFactor = link.capacityIsHourly ? this.config.roadCorridorBundleFactor : 1;
        return link.capacityVehicles * representationFactor * this.config.roadCapacityMultiplier;
      }
      const representationFactor = link.ptCapacityIsHourly ? this.config.ptCorridorBundleFactor : 1;
      return link.ptCapacityPassengers * representationFactor * this.config.ptCapacityMultiplier;
    }

    linkHasResidualCapacity(link, direction, mode, addition) {
      return this.linkDirectionalLoad(link, direction, mode) + addition <= this.linkCapacity(link, mode) + EPSILON;
    }

    linkTravelTime(link, direction, mode) {
      if (mode === "pt") return link.ptBaseDurationMin * (28 / Math.max(this.config.ptAverageSpeedKmh, 1));
      const load = this.linkDirectionalLoad(link, direction, "car");
      const ratio = load / Math.max(this.linkCapacity(link, "car"), 1);
      // UDES link-time structure: 0.02 h + free-flow + 0.03 h * v/c.
      const freeFlow = link.baseDurationMin / 60 / Math.max(this.config.roadSpeedMultiplier, 0.1);
      return (0.02 + freeFlow + ratio * 0.03) * 60;
    }

    resetDailyNetwork() {
      for (const link of this.links) {
        link.loadABVehicles = 0;
        link.loadBAVehicles = 0;
        link.loadABPassengers = 0;
        link.loadBAPassengers = 0;
        link.travelTimeABMin = this.linkTravelTime(link, 1, "car");
        link.travelTimeBAMin = this.linkTravelTime(link, -1, "car");
      }
    }

    pathHasCapacity(path, mode, addition) {
      return Boolean(path) && path.steps.every((step) => this.linkHasResidualCapacity(this.links[step.linkIndex], step.direction, mode, addition));
    }

    addPathLoad(path, mode, addition) {
      for (const step of path.steps) {
        const link = this.links[step.linkIndex];
        if (mode === "car") {
          if (step.direction === 1) link.loadABVehicles += addition;
          else link.loadBAVehicles += addition;
        } else if (step.direction === 1) link.loadABPassengers += addition;
        else link.loadBAPassengers += addition;
      }
    }

    applySameZoneCommute(citizen) {
      if (!this.config.useCalibratedSameZoneModeChoice) {
        this.applyCommute(citizen, "walk", null, this.config.localWalkCommuteMin, this.config.localWalkDistanceKm, 0, false);
        return;
      }
      const carProbability = clamp(Number(this.config.localCarChoiceProbabilityWithCar) || 0, 0, 1);
      const walkProbability = clamp(Number(this.config.localWalkChoiceProbabilityOtherwise) || 0, 0, 1);
      if (citizen.hasCar && this.rng.next() < carProbability) {
        const distanceKm = Math.max(0, Number(this.config.localCarDistanceKm) || 0);
        const costAed = distanceKm * this.config.carFuelAndRunningCostAedPerKm + this.config.carFixedDailyCostAed;
        this.applyCommute(citizen, "car", null, this.config.localCarCommuteMin, distanceKm, costAed, false);
      } else if (this.rng.next() < walkProbability) {
        this.applyCommute(citizen, "walk", null, this.config.localWalkCommuteMin, this.config.localWalkDistanceKm, 0, false);
      } else {
        this.applyCommute(citizen, "pt", null, this.config.localPtCommuteMin, this.config.localPtDistanceKm, this.config.ptFareOneWayAed * 2, false);
      }
    }

    commuteCitizens() {
      this.daily = this.emptyDailyMetrics();
      this.resetDailyNetwork();
      if (!this.config.workdays.includes(this.clock.weekday)) return;
      const order = this.rng.shuffle(this.citizens.filter((citizen) => citizen.enterpriseId));
      let carPaths = this.buildPathMatrix("car");
      let ptPaths = this.buildPathMatrix("pt");
      for (let index = 0; index < order.length; index += 1) {
        if (index && index % this.config.routingBatchSize === 0) {
          carPaths = this.buildPathMatrix("car");
          ptPaths = this.buildPathMatrix("pt");
        }
        const citizen = order[index];
        const home = this.zoneById.get(citizen.homeZoneId);
        const work = this.zoneById.get(citizen.workZoneId);
        if (!home || !work) continue;
        if (home.id === work.id) {
          this.applySameZoneCommute(citizen);
          continue;
        }
        const carPath = carPaths[home.index][work.index];
        const ptPath = ptPaths[home.index][work.index];
        const carDistance = carPath?.distanceKm || Infinity;
        const ptDistance = ptPath?.distanceKm || Infinity;
        const carMinutes = carPath ? carPath.oneWayMinutes * 2 : Infinity;
        const ptInVehicleMinutes = ptPath ? ptPath.oneWayMinutes * 2 : Infinity;
        const ptMinutes = ptPath ? ptInVehicleMinutes + this.config.ptAverageWaitMin * 2 : Infinity;
        const carCost = carPath ? carDistance * 2 * this.config.carFuelAndRunningCostAedPerKm + this.config.carFixedDailyCostAed : Infinity;
        const ptCost = ptPath ? this.config.ptFareOneWayAed * 2 : Infinity;
        const carUtility =
          this.config.carAlternativeConstant +
          this.config.modeCostCoefficient * (carCost / this.config.costScaleAed) +
          this.config.carTimeCoefficient * carMinutes;
        const ptUtility =
          this.config.modeCostCoefficient * (ptCost / this.config.costScaleAed) +
          this.config.ptTimeCoefficient * ptInVehicleMinutes +
          this.config.ptWaitCoefficient * this.config.ptAverageWaitMin;
        const probabilityCar = Number.isFinite(carUtility) ? 1 / (1 + Math.exp(clamp(ptUtility - carUtility, -30, 30))) : 0;
        let mode = this.rng.next() < probabilityCar ? "car" : "pt";
        const carAddition = citizen.weight / Math.max(this.config.carOccupancy, 0.1);
        const ptAddition = citizen.weight;
        const carAvailable = citizen.hasCar && this.pathHasCapacity(carPath, "car", carAddition);
        const ptAvailable = this.pathHasCapacity(ptPath, "pt", ptAddition);
        if (mode === "car" && !carAvailable) mode = ptAvailable ? "pt" : "forced-walk";
        if (mode === "pt" && !ptAvailable) mode = carAvailable ? "car" : "forced-walk";
        if (mode === "car") {
          this.addPathLoad(carPath, "car", carAddition);
          this.applyCommute(citizen, mode, carPath, carMinutes, carDistance * 2, carCost, false);
        } else if (mode === "pt") {
          this.addPathLoad(ptPath, "pt", ptAddition);
          this.applyCommute(citizen, mode, ptPath, ptMinutes, ptDistance * 2, ptCost, false);
        } else {
          const distance = Math.min(carDistance, ptDistance);
          const walkDistance = Number.isFinite(distance) ? distance * 2 : haversineKm(home, work) * 2;
          const walkMinutes = (walkDistance / this.config.walkSpeedKmh) * 60;
          this.applyCommute(citizen, "walk", null, walkMinutes, walkDistance, 0, true);
        }
      }
      for (const link of this.links) {
        link.travelTimeABMin = this.linkTravelTime(link, 1, "car");
        link.travelTimeBAMin = this.linkTravelTime(link, -1, "car");
      }
    }

    applyCommute(citizen, mode, path, minutes, distanceKm, costAed, forcedWalk) {
      citizen.mode = mode;
      citizen.routeLinkIds = path ? path.steps.map((step) => this.links[step.linkIndex].id) : [];
      citizen.roundTripMinutes = round(minutes, 2);
      citizen.roundTripDistanceKm = round(distanceKm, 2);
      citizen.dailyTransportCostAed = round(costAed, 2);
      citizen.currentMonthTransportCostAed += costAed;
      const represented = citizen.weight;
      this.daily.representedTrips += represented;
      this.daily.weightedRoundTripMinutes += represented * minutes;
      if (mode === "car") {
        this.daily.carTrips += represented;
        this.daily.carVehicleKm += (represented / Math.max(this.config.carOccupancy, 0.1)) * distanceKm;
      } else if (mode === "pt") {
        this.daily.ptTrips += represented;
        this.daily.ptPassengerKm += represented * distanceKm;
      } else {
        this.daily.walkTrips += represented;
        this.daily.walkPassengerKm += represented * distanceKm;
        if (forcedWalk) this.daily.forcedWalkTrips += represented;
      }
    }

    citizenIsForcedInterzoneWalk(citizen) {
      return citizen.mode === "walk" && citizen.homeZoneId !== citizen.workZoneId;
    }

    citizenIsNormal(citizen) {
      return (
        citizen.netIncomeAed > this.config.waitingNetIncomeAed &&
        citizen.roundTripMinutes < this.config.acceptableCommuteRoundTripMin &&
        !this.citizenIsForcedInterzoneWalk(citizen)
      );
    }

    citizenIsFinanciallySevere(citizen) {
      return citizen.netIncomeAed < this.config.extremeNetIncomeAed || citizen.bankBalanceAed < this.config.extremeBankBalanceAed;
    }

    citizenHasSevereCommute(citizen) {
      return citizen.roundTripMinutes > this.config.extremeCommuteRoundTripMin || this.citizenIsForcedInterzoneWalk(citizen);
    }

    citizenIsSevere(citizen) {
      if (this.citizenIsFinanciallySevere(citizen)) return true;
      if (!this.citizenHasSevereCommute(citizen)) return false;
      if (this.config.udesExactCommuteStateGuards) return true;
      return citizen.daysDissatisfied >= Math.max(0, Number(this.config.commuteExtremeGraceDays) || 0);
    }

    citizenShouldDisposeCar(citizen) {
      if (this.config.udesExactExtremeCarDisposal) return true;
      return citizen.netIncomeAed < this.config.carDisposalNetIncomeAed || citizen.bankBalanceAed < this.config.carDisposalBankBalanceAed;
    }

    enterCitizenState(citizen, state, reason) {
      if (citizen.state === state) return;
      citizen.state = state;
      citizen.stateEnteredDay = this.day;
      if (state === "Waiting") {
        citizen.stateDecisionDay = this.day + this.rng.integer(this.config.waitingDecisionMinDays, this.config.waitingDecisionMaxDays);
      } else if (state === "Extreme") {
        citizen.stateDecisionDay = this.day + this.rng.integer(this.config.extremeDecisionMinDays, this.config.extremeDecisionMaxDays);
        if (citizen.hasCar && this.citizenShouldDisposeCar(citizen)) {
          citizen.hasCar = false;
          this.eventsTotal.carDisposals += 1;
          this.recordCitizenEvent(citizen, "car-disposal", {
            reason: this.config.udesExactExtremeCarDisposal ? "extreme-state-exact" : "extreme-financial-guard",
          });
        }
      } else if (state === "Happy") {
        citizen.stateDecisionDay = null;
        citizen.nextCarConsiderationDay = this.day + this.rng.integer(this.config.carConsiderationMinDays, this.config.carConsiderationMaxDays);
        citizen.nextQualityMoveDay = this.day + this.rng.integer(this.config.qualityMoveMinDays, this.config.qualityMoveMaxDays);
      } else {
        citizen.stateDecisionDay = this.day + 1;
      }
      this.recordCitizenEvent(citizen, "state", { state, reason });
    }

    updateCitizenStates() {
      for (const citizen of this.citizens) {
        if (citizen.state !== "Happy") citizen.daysDissatisfied += 1;
        const severe = this.citizenIsSevere(citizen);
        const normal = this.citizenIsNormal(citizen);
        if (citizen.state === "Happy") {
          if (severe) this.enterCitizenState(citizen, "Extreme", "severe-guard");
          else if (!normal) this.enterCitizenState(citizen, "Waiting", "dissatisfaction-guard");
          else this.processHappyAspirations(citizen);
        } else if (citizen.state === "Waiting") {
          if (severe) this.enterCitizenState(citizen, "Extreme", "severe-guard");
          else if (normal) this.enterCitizenState(citizen, "Happy", "recovered");
          else if (this.day >= citizen.stateDecisionDay) {
            this.performWaitingRecovery(citizen);
            this.enterCitizenState(citizen, "Recovery", "waiting-decision");
          }
        } else if (citizen.state === "Extreme") {
          if (!severe) this.enterCitizenState(citizen, normal ? "Happy" : "Waiting", "severe-guard-cleared");
          else if (this.day >= citizen.stateDecisionDay) {
            this.performExtremeRecovery(citizen);
            this.enterCitizenState(citizen, "Recovery", "extreme-decision");
          }
        } else if (this.day >= citizen.stateDecisionDay) {
          if (this.citizenIsSevere(citizen)) this.enterCitizenState(citizen, "Extreme", "recovery-failed-severe");
          else if (this.citizenIsNormal(citizen)) this.enterCitizenState(citizen, "Happy", "recovery-succeeded");
          else this.enterCitizenState(citizen, "Waiting", "recovery-incomplete");
        }
      }
    }

    processHappyAspirations(citizen) {
      if (this.day >= citizen.nextCarConsiderationDay) {
        if (!citizen.hasCar) {
          citizen.hasCar = true;
          this.eventsTotal.carAcquisitions += 1;
          this.recordCitizenEvent(citizen, "car-acquisition", {});
        }
        citizen.nextCarConsiderationDay = this.day + this.rng.integer(this.config.carConsiderationMinDays, this.config.carConsiderationMaxDays);
      }
      if (this.day >= citizen.nextQualityMoveDay) {
        const candidates = this.zones.filter((zone) => zone.id !== citizen.homeZoneId && zone.residentIds.size < zone.housingCapacityAgents);
        let target = null;
        if (this.rng.next() < 0.7) target = [...candidates].sort((a, b) => b.quality - a.quality)[0] || null;
        else target = this.rng.pick([...candidates].sort((a, b) => b.residentialRentAed - a.residentialRentAed).slice(0, 3));
        if (target) this.moveCitizen(citizen, target.id, "quality-aspiration");
        citizen.nextQualityMoveDay = this.day + this.rng.integer(this.config.qualityMoveMinDays, this.config.qualityMoveMaxDays);
      }
    }

    performWaitingRecovery(citizen) {
      if (this.rng.next() < 0.5) {
        this.searchBetterJob(citizen);
        return;
      }
      const choice = this.rng.next();
      if (choice < 0.5) this.moveToCheaperZone(citizen);
      else if (choice < 0.75) this.moveToLowerCommuteCostZone(citizen);
      else this.moveToWorkZone(citizen);
    }

    performExtremeRecovery(citizen) {
      if (this.citizenIsForcedInterzoneWalk(citizen) || citizen.roundTripMinutes > this.config.extremeCommuteRoundTripMin) {
        this.moveToWorkZone(citizen, true);
        return;
      }
      // The paper omits non-mandatory Extreme branch probabilities; equal
      // thirds are the explicit, replaceable implementation assumption here.
      const choice = this.rng.next();
      if (choice < 1 / 3) this.searchBetterJob(citizen);
      else if (choice < 2 / 3) this.moveToCheaperZone(citizen);
      else this.moveToWorkZone(citizen);
    }

    searchBetterJob(citizen) {
      let best = null;
      for (let attempt = 0; attempt < this.config.betterJobSearchAttempts; attempt += 1) {
        const enterprise = this.findHiringEnterprise(citizen.homeZoneId);
        if (!enterprise || enterprise.id === citizen.enterpriseId) continue;
        const salaryAed = this.sampleSalary(enterprise, citizen.age);
        if (salaryAed > citizen.salaryAed * this.config.betterJobMinimumRaise && (!best || salaryAed > best.salaryAed)) {
          best = { enterprise, salaryAed };
        }
      }
      return best ? this.employ(citizen, best.enterprise, best.salaryAed, "better-job") : false;
    }

    moveCitizen(citizen, targetZoneId, reason) {
      const origin = this.zoneById.get(citizen.homeZoneId);
      const target = this.zoneById.get(targetZoneId);
      if (!target || target === origin || target.residentIds.size >= target.housingCapacityAgents) return false;
      origin.residentIds.delete(citizen.id);
      target.residentIds.add(citizen.id);
      citizen.homeZoneId = target.id;
      citizen.residentialRentAed = target.residentialRentAed;
      citizen.lastMoveReason = reason;
      this.eventsTotal.residentialMoves += 1;
      this.recordCitizenEvent(citizen, "move", { from: origin.id, to: target.id, reason });
      return true;
    }

    moveToCheaperZone(citizen) {
      const current = this.zoneById.get(citizen.homeZoneId);
      const candidates = this.zones
        .filter(
          (zone) =>
            zone.id !== current.id && zone.residentialRentAed < current.residentialRentAed && zone.residentIds.size < zone.housingCapacityAgents
        )
        .sort((a, b) => a.residentialRentAed - b.residentialRentAed)
        .slice(0, 3);
      const target = this.rng.pick(candidates);
      return target ? this.moveCitizen(citizen, target.id, "cheaper-rent") : false;
    }

    moveToLowerCommuteCostZone(citizen) {
      if (!citizen.workZoneId) return false;
      const current = this.zoneById.get(citizen.homeZoneId);
      const work = this.zoneById.get(citizen.workZoneId);
      const candidates = this.zones.filter(
        (zone) => zone.residentialRentAed < current.residentialRentAed && zone.residentIds.size < zone.housingCapacityAgents
      );
      const target = candidates.sort((a, b) => haversineKm(a, work) - haversineKm(b, work))[0];
      return target ? this.moveCitizen(citizen, target.id, "lower-commute-cost") : false;
    }

    moveToWorkZone(citizen, force = false) {
      if (!citizen.workZoneId) return false;
      const current = this.zoneById.get(citizen.homeZoneId);
      const target = this.zoneById.get(citizen.workZoneId);
      if (!target || (!force && target.residentialRentAed >= current.residentialRentAed)) return false;
      return this.moveCitizen(citizen, target.id, "workplace-zone");
    }

    updateEnterprisesDaily() {
      for (const enterprise of this.enterprises) {
        if (enterprise.state === "Starting") {
          if (this.day > enterprise.stateEnteredDay) this.enterEnterpriseWorking(enterprise, "restart-complete");
          continue;
        }
        if (enterprise.state === "Working") {
          if (this.day >= enterprise.nextGrowDay && enterprise.nextGrowDay <= enterprise.nextLesserDay) {
            this.enterEnterpriseGrow(enterprise);
          } else if (this.day >= enterprise.nextLesserDay) this.enterEnterpriseLesser(enterprise);
        } else if (enterprise.state === "Grow") {
          if (this.day >= enterprise.stateExitDay) this.enterEnterpriseWorking(enterprise, "grow-complete");
          else if (this.day >= enterprise.nextActionDay) this.applyEnterpriseGrowth(enterprise);
        } else if (enterprise.state === "Lesser") {
          if (this.day >= enterprise.stateExitDay) this.enterEnterpriseWorking(enterprise, "lesser-complete");
          else if (this.day >= enterprise.nextActionDay) this.applyEnterpriseLesser(enterprise);
        }
      }
      this.matchUnemployedCitizens();
    }

    enterEnterpriseWorking(enterprise, reason) {
      enterprise.state = "Working";
      enterprise.stateEnteredDay = this.day;
      enterprise.hiring = true;
      this.scheduleEnterpriseWorkingHazards(enterprise);
      enterprise.nextActionDay = null;
      enterprise.stateExitDay = null;
      this.recordEnterpriseEvent(enterprise, "state", { state: "Working", reason });
    }

    scheduleEnterpriseWorkingHazards(enterprise) {
      const useEconomics = Boolean(this.config.endogenousEnterpriseDynamics);
      const growMultiplier = useEconomics ? enterprise.growHazardMultiplier || 1 : 1;
      const lesserMultiplier = useEconomics ? enterprise.lesserHazardMultiplier || 1 : 1;
      enterprise.nextGrowDay = this.day + this.rng.exponential(this.config.firmWorkingToGrowMeanDays / Math.max(growMultiplier, EPSILON));
      enterprise.nextLesserDay = this.day + this.rng.exponential(this.config.firmWorkingToLesserMeanDays / Math.max(lesserMultiplier, EPSILON));
    }

    enterEnterpriseGrow(enterprise) {
      enterprise.state = "Grow";
      enterprise.stateEnteredDay = this.day;
      enterprise.hiring = true;
      enterprise.nextActionDay = this.day + this.rng.exponential(this.config.firmGrowthActionMeanDays);
      enterprise.stateExitDay = this.day + this.rng.exponential(this.config.firmGrowReturnMeanDays);
      if (this.rng.next() < this.config.firmMoveProbabilityOnStateEntry) this.moveEnterpriseHigherQuality(enterprise);
      this.recordEnterpriseEvent(enterprise, "state", { state: "Grow" });
    }

    enterEnterpriseLesser(enterprise) {
      enterprise.state = "Lesser";
      enterprise.stateEnteredDay = this.day;
      enterprise.hiring = false;
      enterprise.nextActionDay = this.day + this.rng.exponential(this.config.firmLesserActionMeanDays);
      enterprise.stateExitDay = this.day + this.rng.exponential(this.config.firmLesserReturnMeanDays);
      if (this.rng.next() < this.config.firmMoveProbabilityOnStateEntry) this.moveEnterpriseLowerRent(enterprise);
      this.recordEnterpriseEvent(enterprise, "state", { state: "Lesser" });
    }

    applyEnterpriseGrowth(enterprise) {
      enterprise.maxJobSlots += this.config.firmJobStepSlots;
      for (const citizenId of enterprise.employeeIds) {
        const citizen = this.citizenById.get(citizenId);
        citizen.salaryAed = round(citizen.salaryAed * (1 + this.config.firmGrowthWageIncrease), 0);
      }
      enterprise.nextActionDay = this.day + this.rng.exponential(this.config.firmGrowthActionMeanDays);
      this.recordEnterpriseEvent(enterprise, "growth-action", { maxJobSlots: enterprise.maxJobSlots });
    }

    applyEnterpriseLesser(enterprise) {
      enterprise.maxJobSlots = Math.max(0, enterprise.maxJobSlots - this.config.firmJobStepSlots);
      if (enterprise.employeeIds.size > enterprise.maxJobSlots) {
        const lowestPaid = [...enterprise.employeeIds].map((id) => this.citizenById.get(id)).sort((a, b) => a.salaryAed - b.salaryAed)[0];
        if (lowestPaid) this.detachEmployment(lowestPaid, "firm-contraction", true);
      }
      for (const citizenId of enterprise.employeeIds) {
        const citizen = this.citizenById.get(citizenId);
        citizen.salaryAed = round(citizen.salaryAed * (1 - this.config.firmLesserWageDecrease), 0);
      }
      if (enterprise.maxJobSlots <= 0) this.restartEnterprise(enterprise);
      else enterprise.nextActionDay = this.day + this.rng.exponential(this.config.firmLesserActionMeanDays);
      this.recordEnterpriseEvent(enterprise, "lesser-action", { maxJobSlots: enterprise.maxJobSlots });
    }

    restartEnterprise(enterprise) {
      while (enterprise.employeeIds.size) {
        const citizen = this.citizenById.get(enterprise.employeeIds.values().next().value);
        this.detachEmployment(citizen, "firm-restart", true);
      }
      const target = [...this.zones]
        .filter((zone) => zone.enterpriseIds.size < zone.enterprisePlaceCapacity)
        .sort((a, b) => a.businessRentAed - b.businessRentAed)[0];
      if (target) this.moveEnterprise(enterprise, target.id, "restart-lowest-rent");
      enterprise.state = "Starting";
      enterprise.stateEnteredDay = this.day;
      enterprise.hiring = false;
      enterprise.maxJobSlots = Math.max(1, this.config.firmJobStepSlots);
      this.eventsTotal.firmRestarts += 1;
      this.recordEnterpriseEvent(enterprise, "restart", {});
    }

    moveEnterpriseHigherQuality(enterprise) {
      const current = this.zoneById.get(enterprise.zoneId);
      const rank = this.config.endogenousEnterpriseDynamics
        ? (zone) => zone.quality * 0.62 + (zone.laborAccessScore || 0) * 0.38
        : (zone) => zone.quality;
      const candidates = this.zones
        .filter((zone) => zone.quality > current.quality && zone.enterpriseIds.size < zone.enterprisePlaceCapacity)
        .sort((a, b) => rank(b) - rank(a))
        .slice(0, 3);
      const target = this.config.endogenousEnterpriseDynamics ? this.rng.weighted(candidates, rank) : this.rng.pick(candidates);
      return target ? this.moveEnterprise(enterprise, target.id, "growth-quality") : false;
    }

    moveEnterpriseLowerRent(enterprise) {
      const current = this.zoneById.get(enterprise.zoneId);
      const maximumRent = Math.max(1, ...this.zones.map((zone) => zone.businessRentAed));
      const rank = this.config.endogenousEnterpriseDynamics
        ? (zone) => (1 - zone.businessRentAed / maximumRent) * 0.68 + (zone.laborAccessScore || 0) * 0.32
        : (zone) => 1 - zone.businessRentAed / maximumRent;
      const candidates = this.zones
        .filter((zone) => zone.businessRentAed < current.businessRentAed && zone.enterpriseIds.size < zone.enterprisePlaceCapacity)
        .sort((a, b) => rank(b) - rank(a))
        .slice(0, 3);
      const target = this.config.endogenousEnterpriseDynamics ? this.rng.weighted(candidates, rank) : this.rng.pick(candidates);
      return target ? this.moveEnterprise(enterprise, target.id, "contraction-rent") : false;
    }

    moveEnterprise(enterprise, targetZoneId, reason) {
      const origin = this.zoneById.get(enterprise.zoneId);
      const target = this.zoneById.get(targetZoneId);
      if (!target || target === origin || target.enterpriseIds.size >= target.enterprisePlaceCapacity) return false;
      origin.enterpriseIds.delete(enterprise.id);
      target.enterpriseIds.add(enterprise.id);
      enterprise.zoneId = target.id;
      for (const citizenId of enterprise.employeeIds) this.citizenById.get(citizenId).workZoneId = target.id;
      this.eventsTotal.firmMoves += 1;
      this.recordEnterpriseEvent(enterprise, "move", { from: origin.id, to: target.id, reason });
      return true;
    }

    matchUnemployedCitizens() {
      if (!this.unemployedIds.size) return;
      const unemployed = this.rng.shuffle([...this.unemployedIds]);
      const limit = Math.min(unemployed.length, this.config.maxDailyLaborMatches);
      for (let index = 0; index < limit; index += 1) {
        const citizen = this.citizenById.get(unemployed[index]);
        const enterprise = this.findHiringEnterprise(citizen.homeZoneId);
        if (!enterprise) break;
        this.employ(citizen, enterprise, this.sampleSalary(enterprise, citizen.age), "hire");
      }
    }

    closeMonth() {
      this.monthCounter += 1;
      for (const citizen of this.citizens) {
        citizen.monthlyTransportCostAed = round(citizen.currentMonthTransportCostAed, 2);
        citizen.residentialRentAed = this.zoneById.get(citizen.homeZoneId).residentialRentAed;
        citizen.netIncomeAed = round(citizen.salaryAed - citizen.residentialRentAed - citizen.monthlyTransportCostAed, 2);
        citizen.bankBalanceAed = round(citizen.bankBalanceAed + citizen.netIncomeAed, 2);
        citizen.currentMonthTransportCostAed = 0;
      }
      this.updateEnterpriseSalaryBills();
      this.updateEnterpriseEconomics(true);
      this.recordMonthlyHistory(false);
    }

    closeYear() {
      this.yearCounter += 1;
      for (const enterprise of this.enterprises) {
        for (const citizenId of enterprise.employeeIds) {
          const citizen = this.citizenById.get(citizenId);
          citizen.salaryAed = round(citizen.salaryAed * (1 + this.config.firmAnnualWageGrowth), 0);
        }
      }
      for (const citizen of this.citizens) {
        citizen.age += 1;
        if (citizen.age > 70) {
          const probability = Math.min(
            this.config.annualMortalityCap,
            this.config.annualMortalityAt70 * this.config.annualMortalityGrowthPerYear ** (citizen.age - 70)
          );
          if (this.rng.next() < probability) this.replaceCitizen(citizen);
        }
      }
      this.updateZoneAndEnterpriseRents();
    }

    replaceCitizen(citizen) {
      this.detachEmployment(citizen, "death", false);
      const currentZone = this.zoneById.get(citizen.homeZoneId);
      const target = [...this.zones]
        .filter((zone) => zone.residentIds.size < zone.housingCapacityAgents || zone === currentZone)
        .sort((a, b) => a.residentialRentAed - b.residentialRentAed)[0];
      if (target && target !== currentZone) {
        currentZone.residentIds.delete(citizen.id);
        target.residentIds.add(citizen.id);
        citizen.homeZoneId = target.id;
      }
      citizen.generation += 1;
      citizen.age = 20;
      citizen.hasCar = false;
      citizen.salaryAed = 0;
      citizen.workZoneId = null;
      citizen.enterpriseId = null;
      citizen.mode = "none";
      citizen.routeLinkIds = [];
      citizen.roundTripMinutes = 0;
      citizen.roundTripDistanceKm = 0;
      citizen.monthlyTransportCostAed = 0;
      citizen.currentMonthTransportCostAed = 0;
      citizen.residentialRentAed = this.zoneById.get(citizen.homeZoneId).residentialRentAed;
      citizen.netIncomeAed = -citizen.residentialRentAed;
      citizen.bankBalanceAed = this.config.extremeBankBalanceAed;
      citizen.daysDissatisfied = 0;
      citizen.history = [];
      citizen.events = [];
      citizen.state = "Happy";
      citizen.stateEnteredDay = this.day;
      citizen.stateDecisionDay = null;
      citizen.nextCarConsiderationDay = this.day + this.rng.integer(this.config.carConsiderationMinDays, this.config.carConsiderationMaxDays);
      citizen.nextQualityMoveDay = this.day + this.rng.integer(this.config.qualityMoveMinDays, this.config.qualityMoveMaxDays);
      this.eventsTotal.replacements += 1;
      this.recordCitizenEvent(citizen, "replacement", { generation: citizen.generation });
    }

    updateZoneAndEnterpriseRents() {
      for (const zone of this.zones) {
        const housingOccupancy = zone.residentIds.size / Math.max(zone.housingCapacityAgents, 1);
        const businessOccupancy = zone.enterpriseIds.size / Math.max(zone.enterprisePlaceCapacity, 1);
        if (this.yearCounter > 0) {
          const pressure = (housingOccupancy - 0.8) * 0.08 + (businessOccupancy - 0.65) * 0.035 + (zone.quality - 0.75) * 0.025;
          zone.residentialRentAed = round(
            zone.residentialRentAed *
              clamp(1 + pressure * this.config.rentPressureMultiplier, this.config.annualRentMaxDecrease, this.config.annualRentMaxIncrease),
            0
          );
        }
        const qualityFactor = clamp(0.5 + 0.5 * zone.quality, 0.5, 1);
        const occupancyFactor = businessOccupancy <= 0.2 ? 0.95 : businessOccupancy >= 0.8 ? 1.05 : 0.95 + ((businessOccupancy - 0.2) / 0.6) * 0.1;
        zone.businessRentAed = round(this.config.businessRentBaseAedPerRepresentedWorker * qualityFactor * occupancyFactor, 2);
        for (const enterpriseId of zone.enterpriseIds) {
          const enterprise = this.enterpriseById.get(enterpriseId);
          enterprise.rentPerRepresentedWorkerAed = zone.businessRentAed;
        }
      }
    }

    updateEnterpriseSalaryBills() {
      for (const enterprise of this.enterprises) {
        enterprise.salaryBillAed = round(
          sumBy([...enterprise.employeeIds], (id) => this.citizenById.get(id).salaryAed * this.config.citizenWeight),
          0
        );
      }
    }

    computeZoneLaborAccessScores() {
      const decayKm = Math.max(1, Number(this.config.enterpriseLaborAccessDecayKm) || 12);
      const unemployedByZone = new Map(this.zones.map((zone) => [zone.id, 0]));
      for (const citizenId of this.unemployedIds) {
        const citizen = this.citizenById.get(citizenId);
        unemployedByZone.set(citizen.homeZoneId, (unemployedByZone.get(citizen.homeZoneId) || 0) + citizen.weight);
      }
      const raw = this.zones.map((destination) =>
        sumBy(this.zones, (origin) => {
          const population = origin.residentIds.size * this.config.citizenWeight;
          const unemployed = unemployedByZone.get(origin.id) || 0;
          const availableLabor = population * 0.35 + unemployed * 0.65;
          return availableLabor * Math.exp(-haversineKm(origin, destination) / decayKm);
        })
      );
      const maximum = Math.max(1, ...raw);
      for (let index = 0; index < this.zones.length; index += 1) {
        this.zones[index].laborAccessScore = clamp(raw[index] / maximum, 0, 1);
      }
    }

    updateEnterpriseEconomics(rescheduleWorkingHazards = false) {
      this.computeZoneLaborAccessScores();
      const monthAngle = ((this.clock.month - 1) / 12) * Math.PI * 2;
      for (const enterprise of this.enterprises) {
        const zone = this.zoneById.get(enterprise.zoneId);
        const shockInnovation = (this.rng.next() * 2 - 1) * this.config.enterpriseDemandShockAmplitude;
        enterprise.demandShock = enterprise.demandShock * this.config.enterpriseDemandShockPersistence + shockInnovation;
        const seasonal = Math.sin(monthAngle + (enterprise.index % 6) * (Math.PI / 3)) * 0.015;
        enterprise.demandIndex = round(clamp(enterprise.sectorDemandBase * (1 + enterprise.demandShock + seasonal), 0.72, 1.32), 4);
        enterprise.laborAccessScore = round(zone.laborAccessScore || 0, 4);
        enterprise.vacancyFillRate = round(enterprise.employeeIds.size / Math.max(enterprise.maxJobSlots, 1), 4);

        const representedEmployees = enterprise.employeeIds.size * this.config.citizenWeight;
        const representedCapacity = enterprise.maxJobSlots * this.config.citizenWeight;
        const productivity = 0.82 + zone.quality * 0.12 + enterprise.laborAccessScore * 0.06;
        enterprise.monthlyOutputProxy = round(representedEmployees * enterprise.demandIndex * productivity, 0);
        enterprise.monthlyRevenueAed = round(representedEmployees * enterprise.sectorRevenuePerWorkerAed * enterprise.demandIndex * productivity, 0);
        const totalBusinessRentAed = enterprise.rentPerRepresentedWorkerAed * representedEmployees;
        enterprise.nonLaborOperatingCostAed = round(
          enterprise.monthlyRevenueAed * this.config.enterpriseNonLaborCostShare +
            representedCapacity * this.config.enterpriseFixedCostAedPerCapacityWorker,
          0
        );
        enterprise.operatingCostAed = round(enterprise.salaryBillAed + totalBusinessRentAed + enterprise.nonLaborOperatingCostAed, 0);
        enterprise.operatingMargin =
          enterprise.monthlyRevenueAed > 0
            ? round((enterprise.monthlyRevenueAed - enterprise.operatingCostAed) / enterprise.monthlyRevenueAed, 4)
            : -1;

        if (this.config.endogenousEnterpriseDynamics) {
          const marginSignal = enterprise.operatingMargin - this.config.enterpriseTargetMargin;
          const fillSignal = enterprise.vacancyFillRate - 0.78;
          const demandSignal = enterprise.demandIndex - 1;
          enterprise.growHazardMultiplier = round(
            clamp(
              1 +
                marginSignal * this.config.enterpriseMarginHazardSensitivity +
                fillSignal * this.config.enterpriseFillHazardSensitivity +
                demandSignal * this.config.enterpriseDemandHazardSensitivity,
              this.config.enterpriseHazardMultiplierMin,
              this.config.enterpriseHazardMultiplierMax
            ),
            4
          );
          enterprise.lesserHazardMultiplier = round(
            clamp(
              1 -
                marginSignal * this.config.enterpriseMarginHazardSensitivity -
                fillSignal * this.config.enterpriseFillHazardSensitivity -
                demandSignal * this.config.enterpriseDemandHazardSensitivity,
              this.config.enterpriseHazardMultiplierMin,
              this.config.enterpriseHazardMultiplierMax
            ),
            4
          );
        } else {
          enterprise.growHazardMultiplier = 1;
          enterprise.lesserHazardMultiplier = 1;
        }
        if (rescheduleWorkingHazards && enterprise.state === "Working") this.scheduleEnterpriseWorkingHazards(enterprise);
      }
    }

    advanceOneDay() {
      const previousClock = this.clock;
      this.day += 1;
      this.clock = this.clockAt(this.day);
      const monthChanged = this.clock.month !== previousClock.month || this.clock.year !== previousClock.year;
      const yearChanged = this.clock.year !== previousClock.year;
      if (monthChanged) this.closeMonth();
      if (yearChanged) this.closeYear();
      this.commuteCitizens();
      this.updateCitizenStates();
      this.updateEnterprisesDaily();
      this.lastSnapshotCache = null;
    }

    step(days = 1) {
      const count = Math.max(0, Math.floor(Number(days) || 0));
      for (let index = 0; index < count; index += 1) this.advanceOneDay();
      return this.snapshot();
    }

    recordCitizenEvent(citizen, type, details) {
      pushBounded(citizen.events, { day: this.day, date: this.clock.date, type, ...details }, this.config.eventHistoryLimit);
    }

    recordEnterpriseEvent(enterprise, type, details) {
      pushBounded(enterprise.events, { day: this.day, date: this.clock.date, type, ...details }, this.config.eventHistoryLimit);
    }

    recordMonthlyHistory(initial) {
      const metrics = this.computeMetrics();
      const eventDelta = {};
      for (const key of Object.keys(this.eventsTotal)) {
        eventDelta[key] = this.eventsTotal[key] - this.lastHistoryEventTotals[key];
        this.lastHistoryEventTotals[key] = this.eventsTotal[key];
      }
      pushBounded(this.cityHistory, { date: this.clock.date, day: this.day, ...metrics.city, events: eventDelta }, this.config.aggregateHistoryLimit);
      for (const zoneMetric of metrics.zones) {
        const zone = this.zoneById.get(zoneMetric.id);
        pushBounded(zone.history, { date: this.clock.date, day: this.day, ...zoneMetric }, this.config.aggregateHistoryLimit);
      }
      for (const linkMetric of metrics.links) {
        const link = this.linkById.get(linkMetric.id);
        pushBounded(link.history, { date: this.clock.date, day: this.day, ...linkMetric }, this.config.aggregateHistoryLimit);
      }
      if (initial || this.monthCounter % this.config.citizenHistoryEveryMonths === 0) {
        for (const citizen of this.citizens) {
          pushBounded(
            citizen.history,
            {
              date: this.clock.date,
              state: citizen.state,
              homeZoneId: citizen.homeZoneId,
              enterpriseId: citizen.enterpriseId,
              mode: citizen.mode,
              salaryAed: citizen.salaryAed,
              netIncomeAed: citizen.netIncomeAed,
              netIncome: citizen.netIncomeAed,
              bankBalanceAed: citizen.bankBalanceAed,
              commuteMin: citizen.roundTripMinutes,
              commuteMinutes: citizen.roundTripMinutes,
            },
            this.config.citizenHistoryLimit
          );
        }
      }
      if (initial || this.monthCounter % this.config.enterpriseHistoryEveryMonths === 0) {
        for (const enterprise of this.enterprises) {
          pushBounded(
            enterprise.history,
            {
              date: this.clock.date,
              state: enterprise.state,
              zoneId: enterprise.zoneId,
              employees: enterprise.employeeIds.size,
              employeeCount: enterprise.employeeIds.size,
              maxJobSlots: enterprise.maxJobSlots,
              salaryBillAed: enterprise.salaryBillAed,
              monthlyRevenueAed: enterprise.monthlyRevenueAed,
              monthlyOutputProxy: enterprise.monthlyOutputProxy,
              operatingCostAed: enterprise.operatingCostAed,
              operatingMargin: enterprise.operatingMargin,
              demandIndex: enterprise.demandIndex,
              laborAccessScore: enterprise.laborAccessScore,
              vacancyFillRate: enterprise.vacancyFillRate,
            },
            this.config.enterpriseHistoryLimit
          );
        }
      }
    }

    computeMetrics() {
      const zoneAccumulators = this.zones.map((zone) => ({
        id: zone.id,
        name: zone.name,
        representedPopulation: 0,
        employed: 0,
        state: { Happy: 0, Waiting: 0, Extreme: 0, Recovery: 0 },
        mode: { car: 0, pt: 0, walk: 0, none: 0 },
        netIncome: 0,
        bankBalance: 0,
        commute: 0,
        commuters: 0,
        sameZoneWorkers: 0,
        locatedJobs: 0,
        vacancies: 0,
      }));
      const cityState = { Happy: 0, Waiting: 0, Extreme: 0, Recovery: 0 };
      const cityMode = { car: 0, pt: 0, walk: 0, none: 0 };
      let representedPopulation = 0;
      let representedEmployed = 0;
      let netIncomeTotal = 0;
      let bankTotal = 0;
      let commuteTotal = 0;
      let commuterWeight = 0;
      let rentTotal = 0;
      let sameZoneWorkers = 0;
      for (const citizen of this.citizens) {
        const zone = this.zoneById.get(citizen.homeZoneId);
        const accumulator = zoneAccumulators[zone.index];
        const weight = citizen.weight;
        representedPopulation += weight;
        accumulator.representedPopulation += weight;
        cityState[citizen.state] += weight;
        accumulator.state[citizen.state] += weight;
        cityMode[citizen.mode] = (cityMode[citizen.mode] || 0) + weight;
        accumulator.mode[citizen.mode] = (accumulator.mode[citizen.mode] || 0) + weight;
        netIncomeTotal += citizen.netIncomeAed * weight;
        bankTotal += citizen.bankBalanceAed * weight;
        rentTotal += citizen.residentialRentAed * weight;
        accumulator.netIncome += citizen.netIncomeAed * weight;
        accumulator.bankBalance += citizen.bankBalanceAed * weight;
        if (citizen.enterpriseId) {
          representedEmployed += weight;
          accumulator.employed += weight;
          commuterWeight += weight;
          commuteTotal += citizen.roundTripMinutes * weight;
          accumulator.commuters += weight;
          accumulator.commute += citizen.roundTripMinutes * weight;
          if (citizen.homeZoneId === citizen.workZoneId) {
            accumulator.sameZoneWorkers += weight;
            sameZoneWorkers += weight;
          }
        }
      }
      for (const enterprise of this.enterprises) {
        const accumulator = zoneAccumulators[this.zoneById.get(enterprise.zoneId).index];
        accumulator.locatedJobs += enterprise.employeeIds.size * this.config.citizenWeight;
        accumulator.vacancies += Math.max(0, enterprise.maxJobSlots - enterprise.employeeIds.size) * this.config.citizenWeight;
      }
      const zones = zoneAccumulators.map((item) => {
        const zone = this.zoneById.get(item.id);
        const population = Math.max(item.representedPopulation, 1);
        const commuters = Math.max(item.commuters, 1);
        const stateShares = this.shareObject(item.state, population);
        const modeShares = this.modeShareObject(item.mode);
        const housingCapacityRepresented = zone.housingCapacityAgents * this.config.citizenWeight;
        const averageNetIncomeAed = round(item.netIncome / population, 2);
        const averageBankBalanceAed = round(item.bankBalance / population, 2);
        const averageRoundTripMinutes = round(item.commute / commuters, 2);
        return {
          id: zone.id,
          name: zone.name,
          quality: zone.quality,
          residentialRentAed: zone.residentialRentAed,
          housingRentAed: zone.residentialRentAed,
          businessRentAedPerRepresentedWorker: zone.businessRentAed,
          representedPopulation: item.representedPopulation,
          population: item.representedPopulation,
          housingCapacityRepresented,
          housingCapacity: housingCapacityRepresented,
          enterprises: zone.enterpriseIds.size,
          enterprisePlaceCapacity: zone.enterprisePlaceCapacity,
          representedEmployed: item.employed,
          jobs: item.locatedJobs,
          vacancies: item.vacancies,
          employmentRate: round((item.employed / population) * 100, 2),
          stateShares,
          states: {
            happy: stateShares.Happy,
            waiting: stateShares.Waiting,
            extreme: stateShares.Extreme,
            recovery: stateShares.Recovery,
          },
          modeShares,
          modeShare: modeShares,
          averageNetIncomeAed,
          meanNetIncomeAed: averageNetIncomeAed,
          averageBankBalanceAed,
          meanBankBalanceAed: averageBankBalanceAed,
          averageRoundTripMinutes,
          meanCommuteMinutes: averageRoundTripMinutes,
          sameZoneWorkShare: round((item.sameZoneWorkers / commuters) * 100, 2),
        };
      });
      const links = this.links.map((link) => {
        const capacity = this.linkCapacity(link, "car");
        const ptCapacity = this.linkCapacity(link, "pt");
        const volumeCapacityAB = round(link.loadABVehicles / Math.max(capacity, 1), 4);
        const volumeCapacityBA = round(link.loadBAVehicles / Math.max(capacity, 1), 4);
        const loadRatio = Math.max(volumeCapacityAB, volumeCapacityBA);
        return {
          id: link.id,
          name: `${this.zoneById.get(link.from).name} – ${this.zoneById.get(link.to).name}`,
          from: link.from,
          to: link.to,
          roadClass: link.roadClass,
          distanceKm: round(link.distanceKm, 2),
          freeFlowMinutes: round(link.baseDurationMin, 2),
          loadABVehicles: round(link.loadABVehicles, 2),
          loadBAVehicles: round(link.loadBAVehicles, 2),
          loadABPassengers: round(link.loadABPassengers, 2),
          loadBAPassengers: round(link.loadBAPassengers, 2),
          capacityVehiclesPerDirection: round(capacity, 2),
          capacityVehPerHour: round(capacity / this.config.assignmentPeakHours, 2),
          capacity: round(capacity, 2),
          ptCapacityPassengersPerDirection: round(ptCapacity, 2),
          volumeCapacityAB,
          volumeCapacityBA,
          loadRatio,
          volumeCapacityRatio: loadRatio,
          ptLoadFactorAB: round(link.loadABPassengers / Math.max(ptCapacity, 1), 4),
          ptLoadFactorBA: round(link.loadBAPassengers / Math.max(ptCapacity, 1), 4),
          travelTimeABMin: round(link.travelTimeABMin, 2),
          travelTimeBAMin: round(link.travelTimeBAMin, 2),
          travelTimeMinutes: round(Math.max(link.travelTimeABMin, link.travelTimeBAMin), 2),
        };
      });
      const averageRoadLoad = links.length ? sumBy(links, (link) => (link.volumeCapacityAB + link.volumeCapacityBA) / 2) / links.length : 0;
      const stateShares = this.shareObject(cityState, representedPopulation);
      const modeShares = this.modeShareObject(cityMode);
      const averageNetIncomeAed = round(netIncomeTotal / Math.max(representedPopulation, 1), 2);
      const averageBankBalanceAed = round(bankTotal / Math.max(representedPopulation, 1), 2);
      const averageRoundTripMinutes = round(commuteTotal / Math.max(commuterWeight, 1), 2);
      const averageRoadCapacityUsage = round(averageRoadLoad * 100, 2);
      const currentMonthEvents = {};
      for (const key of Object.keys(this.eventsTotal)) {
        currentMonthEvents[key] = this.eventsTotal[key] - this.lastHistoryEventTotals[key];
      }
      const city = {
        representedPopulation,
        population: representedPopulation,
        representedEmployed,
        jobs: representedEmployed,
        employmentRate: round((representedEmployed / Math.max(representedPopulation, 1)) * 100, 2),
        unemploymentRate: round((1 - representedEmployed / Math.max(representedPopulation, 1)) * 100, 2),
        citizens: this.citizens.length,
        enterprises: this.enterprises.length,
        stateCounts: cityState,
        stateShares,
        states: {
          happy: stateShares.Happy,
          waiting: stateShares.Waiting,
          extreme: stateShares.Extreme,
          recovery: stateShares.Recovery,
        },
        satisfaction: stateShares.Happy,
        modeCounts: cityMode,
        modeShares,
        modeShare: modeShares,
        averageNetIncomeAed,
        meanNetIncomeAed: averageNetIncomeAed,
        averageBankBalanceAed,
        meanBankBalanceAed: averageBankBalanceAed,
        meanHousingRentAed: round(rentTotal / Math.max(representedPopulation, 1), 2),
        averageRoundTripMinutes,
        meanCommuteMinutes: averageRoundTripMinutes,
        averageRoadCapacityUsage,
        meanRoadLoad: averageRoadCapacityUsage,
        sameZoneWorkShare: round((sameZoneWorkers / Math.max(representedEmployed, 1)) * 100, 2),
        dailyCarKm: round(this.daily.carVehicleKm, 2),
        forcedInterzoneWalkers: round(this.daily.forcedWalkTrips, 0),
        monthlyHires: currentMonthEvents.hires,
        monthlyFires: currentMonthEvents.fires,
        monthlyMoves: currentMonthEvents.residentialMoves,
        daily: {
          ...this.daily,
          averageRoundTripMinutes: round(this.daily.weightedRoundTripMinutes / Math.max(this.daily.representedTrips, 1), 2),
        },
        eventsTotal: { ...this.eventsTotal },
      };
      return { city, zones, links };
    }

    shareObject(counts, denominator) {
      const output = {};
      for (const [key, value] of Object.entries(counts)) output[key] = round((value / Math.max(denominator, 1)) * 100, 2);
      return output;
    }

    modeShareObject(counts) {
      const denominator = Math.max((counts.car || 0) + (counts.pt || 0) + (counts.walk || 0), 1);
      return {
        car: round(((counts.car || 0) / denominator) * 100, 2),
        pt: round(((counts.pt || 0) / denominator) * 100, 2),
        walk: round(((counts.walk || 0) / denominator) * 100, 2),
      };
    }

    serializeCitizen(citizen, historyLimit = 0) {
      if (!citizen) return null;
      return {
        id: citizen.id,
        generation: citizen.generation,
        weight: citizen.weight,
        age: citizen.age,
        homeZoneId: citizen.homeZoneId,
        workZoneId: citizen.workZoneId,
        enterpriseId: citizen.enterpriseId,
        hasCar: citizen.hasCar,
        state: citizen.state,
        status: citizen.state,
        stateEnteredDay: citizen.stateEnteredDay,
        daysDissatisfied: citizen.daysDissatisfied,
        mode: citizen.mode,
        routeLinkIds: [...citizen.routeLinkIds],
        roundTripMinutes: citizen.roundTripMinutes,
        roundTripDistanceKm: citizen.roundTripDistanceKm,
        dailyTransportCostAed: citizen.dailyTransportCostAed,
        salaryAed: citizen.salaryAed,
        salaryMonthly: citizen.salaryAed,
        residentialRentAed: citizen.residentialRentAed,
        rentMonthly: citizen.residentialRentAed,
        monthlyTransportCostAed: citizen.monthlyTransportCostAed,
        monthlyTransportCost: citizen.monthlyTransportCostAed,
        netIncomeAed: citizen.netIncomeAed,
        netIncomeMonthly: citizen.netIncomeAed,
        bankBalanceAed: citizen.bankBalanceAed,
        bankBalance: citizen.bankBalanceAed,
        lastMoveReason: citizen.lastMoveReason,
        history: historyLimit ? citizen.history.slice(-historyLimit) : undefined,
        events: historyLimit ? citizen.events.slice(-historyLimit) : undefined,
      };
    }

    serializeEnterprise(enterprise, historyLimit = 0) {
      if (!enterprise) return null;
      return {
        id: enterprise.id,
        zoneId: enterprise.zoneId,
        state: enterprise.state,
        status: enterprise.state,
        stateEnteredDay: enterprise.stateEnteredDay,
        hiring: enterprise.hiring,
        maxJobSlots: enterprise.maxJobSlots,
        representedJobCapacity: enterprise.maxJobSlots * this.config.citizenWeight,
        maxJobsPersons: enterprise.maxJobSlots * this.config.citizenWeight,
        employeeCount: enterprise.employeeIds.size,
        representedEmployees: enterprise.employeeIds.size * this.config.citizenWeight,
        vacancyCount: Math.max(0, enterprise.maxJobSlots - enterprise.employeeIds.size),
        vacancies: Math.max(0, enterprise.maxJobSlots - enterprise.employeeIds.size),
        employeeIds: [...enterprise.employeeIds],
        wageIndex: round(enterprise.wageIndex, 4),
        sector: enterprise.sector,
        sectorLabel: enterprise.sectorLabel,
        demandIndex: enterprise.demandIndex,
        laborAccessScore: enterprise.laborAccessScore,
        vacancyFillRate: enterprise.vacancyFillRate,
        monthlyRevenueAed: enterprise.monthlyRevenueAed,
        revenueMonthly: enterprise.monthlyRevenueAed,
        monthlyOutputProxy: enterprise.monthlyOutputProxy,
        outputProxy: enterprise.monthlyOutputProxy,
        salaryBillAed: enterprise.salaryBillAed,
        salaryBillMonthly: enterprise.salaryBillAed,
        wageBillAed: enterprise.salaryBillAed,
        wageBillMonthly: enterprise.salaryBillAed,
        rentPerRepresentedWorkerAed: enterprise.rentPerRepresentedWorkerAed,
        totalBusinessRentAed: round(enterprise.rentPerRepresentedWorkerAed * enterprise.employeeIds.size * this.config.citizenWeight, 0),
        totalBusinessRentMonthly: round(enterprise.rentPerRepresentedWorkerAed * enterprise.employeeIds.size * this.config.citizenWeight, 0),
        nonLaborOperatingCostAed: enterprise.nonLaborOperatingCostAed,
        operatingCostAed: enterprise.operatingCostAed,
        operatingMargin: enterprise.operatingMargin,
        growHazardMultiplier: enterprise.growHazardMultiplier,
        lesserHazardMultiplier: enterprise.lesserHazardMultiplier,
        history: historyLimit ? enterprise.history.slice(-historyLimit) : undefined,
        events: historyLimit ? enterprise.events.slice(-historyLimit) : undefined,
      };
    }

    snapshot(options = {}) {
      const historyLimit = Math.max(0, Number(options.historyLimit) || 0);
      const includeHistories = Boolean(options.includeHistories);
      const aggregateHistoryLimit = historyLimit || 24;
      const metrics = this.computeMetrics();
      const citizenIds = Array.isArray(options.citizenIds)
        ? options.citizenIds
        : this.citizens.slice(0, this.config.agentSampleSize).map((citizen) => citizen.id);
      const enterpriseIds = Array.isArray(options.enterpriseIds)
        ? options.enterpriseIds
        : this.enterprises.slice(0, this.config.agentSampleSize).map((enterprise) => enterprise.id);
      const citizens = citizenIds.map((id) => this.serializeCitizen(this.citizenById.get(id), historyLimit)).filter(Boolean);
      const enterprises = enterpriseIds.map((id) => this.serializeEnterprise(this.enterpriseById.get(id), historyLimit)).filter(Boolean);
      return {
        schemaVersion: SCHEMA_VERSION,
        calibrationLabel: this.config.calibrationLabel,
        seed: this.seed,
        clock: { ...this.clock, elapsedMonths: this.monthCounter, elapsedYears: this.yearCounter },
        city: metrics.city,
        zones: metrics.zones,
        links: metrics.links,
        citizens,
        enterprises,
        citizenSamples: citizens,
        enterpriseSamples: enterprises,
        samples: { citizens, enterprises },
        agents: { citizens, enterprises },
        histories: includeHistories
          ? {
              city: this.cityHistory.slice(-aggregateHistoryLimit),
              zones: Object.fromEntries(this.zones.map((zone) => [zone.id, zone.history.slice(-aggregateHistoryLimit)])),
              links: Object.fromEntries(this.links.map((link) => [link.id, link.history.slice(-aggregateHistoryLimit)])),
            }
          : undefined,
      };
    }

    inspect(kind, id, historyLimit = 24) {
      const limit = Math.max(0, Math.floor(Number(historyLimit) || 0));
      if (kind === "city") return { clock: { ...this.clock }, current: this.computeMetrics().city, history: this.cityHistory.slice(-limit) };
      if (kind === "zone") {
        const zone = this.zoneById.get(String(id));
        if (!zone) throw new Error(`Unknown zone: ${id}`);
        return {
          current: this.computeMetrics().zones[zone.index],
          residentIds: [...zone.residentIds],
          enterpriseIds: [...zone.enterpriseIds],
          history: zone.history.slice(-limit),
        };
      }
      if (kind === "citizen") {
        const citizen = this.citizenById.get(String(id));
        if (!citizen) throw new Error(`Unknown citizen: ${id}`);
        return this.serializeCitizen(citizen, limit);
      }
      if (kind === "enterprise") {
        const enterprise = this.enterpriseById.get(String(id));
        if (!enterprise) throw new Error(`Unknown enterprise: ${id}`);
        return this.serializeEnterprise(enterprise, limit);
      }
      if (kind === "link") {
        const link = this.linkById.get(String(id));
        if (!link) throw new Error(`Unknown link: ${id}`);
        const current = this.computeMetrics().links[link.index];
        return { current, geometry: link.geometry, history: link.history.slice(-limit) };
      }
      throw new Error(`Unknown inspection kind: ${kind}`);
    }

    validateInvariants() {
      const issues = [];
      for (const citizen of this.citizens) {
        const home = this.zoneById.get(citizen.homeZoneId);
        if (!home?.residentIds.has(citizen.id)) issues.push(`${citizen.id} missing from home zone`);
        if (citizen.enterpriseId) {
          const enterprise = this.enterpriseById.get(citizen.enterpriseId);
          if (!enterprise?.employeeIds.has(citizen.id)) issues.push(`${citizen.id} missing from employer`);
          if (citizen.workZoneId !== enterprise?.zoneId) issues.push(`${citizen.id} work zone mismatch`);
          if (this.unemployedIds.has(citizen.id)) issues.push(`${citizen.id} both employed and unemployed`);
        } else if (!this.unemployedIds.has(citizen.id)) issues.push(`${citizen.id} absent from unemployment pool`);
      }
      for (const enterprise of this.enterprises) {
        const zone = this.zoneById.get(enterprise.zoneId);
        if (!zone?.enterpriseIds.has(enterprise.id)) issues.push(`${enterprise.id} missing from zone`);
        for (const citizenId of enterprise.employeeIds) {
          if (this.citizenById.get(citizenId)?.enterpriseId !== enterprise.id)
            issues.push(`${enterprise.id}/${citizenId} reverse employment mismatch`);
        }
      }
      return issues;
    }
  }

  function createWorkerController(post) {
    let engine = null;
    let runToken = 0;

    const reply = (type, requestId, payload) => post({ type, requestId, payload });
    const fail = (requestId, error, code = "ENGINE_ERROR") =>
      reply("error", requestId, { code, message: error instanceof Error ? error.message : String(error) });

    async function handle(message) {
      const { type, requestId, payload = {} } = message || {};
      try {
        if (type === "init") {
          runToken += 1;
          engine = new UdesV2Engine({ data: payload.data, config: payload.config, seed: payload.seed });
          reply("ready", requestId, {
            schemaVersion: SCHEMA_VERSION,
            config: deepClone(engine.config),
            counts: {
              citizens: engine.citizens.length,
              enterprises: engine.enterprises.length,
              zones: engine.zones.length,
              links: engine.links.length,
            },
            snapshot: engine.snapshot(payload.snapshot),
          });
          return;
        }
        if (!engine) throw new Error("Initialize the engine before sending this request");
        if (type === "reset") {
          runToken += 1;
          const snapshot = engine.reset(payload.seed);
          reply("ready", requestId, {
            schemaVersion: SCHEMA_VERSION,
            config: deepClone(engine.config),
            counts: {
              citizens: engine.citizens.length,
              enterprises: engine.enterprises.length,
              zones: engine.zones.length,
              links: engine.links.length,
            },
            snapshot,
          });
          return;
        }
        if (type === "configure") {
          runToken += 1;
          const snapshot = engine.configure(payload.patch, Boolean(payload.reset));
          reply("snapshot", requestId, snapshot);
          return;
        }
        if (type === "step") {
          runToken += 1;
          engine.step(payload.days ?? 1);
          reply("snapshot", requestId, engine.snapshot(payload.snapshot));
          return;
        }
        if (type === "inspect") {
          const inspection = engine.inspect(payload.kind, payload.id, payload.historyLimit);
          reply("inspection", requestId, {
            kind: payload.kind,
            id: payload.id ?? null,
            value: inspection,
            inspection,
          });
          return;
        }
        if (type === "run") {
          const totalDays = Math.max(0, Math.floor(Number(payload.days) || 0));
          const chunkDays = clamp(Math.floor(Number(payload.chunkDays) || 30), 1, 365);
          const token = ++runToken;
          let completedDays = 0;
          while (completedDays < totalDays && token === runToken) {
            const count = Math.min(chunkDays, totalDays - completedDays);
            engine.step(count);
            completedDays += count;
            reply("progress", requestId, {
              completedDays,
              totalDays,
              clock: { ...engine.clock },
              city: engine.computeMetrics().city,
            });
            await new Promise((resolve) => setTimeout(resolve, 0));
          }
          if (token === runToken) reply("snapshot", requestId, engine.snapshot(payload.snapshot));
          return;
        }
        throw new Error(`Unknown request type: ${type}`);
      } catch (error) {
        fail(requestId, error, type ? "ENGINE_ERROR" : "BAD_REQUEST");
      }
    }

    return { handle, getEngine: () => engine };
  }

  const exported = { SCHEMA_VERSION, DEFAULT_CONFIG, DEFAULT_ZONES, SeededRandom, UdesV2Engine, createWorkerController };
  if (typeof module !== "undefined" && module.exports) module.exports = exported;
  if (globalScope && typeof globalScope.postMessage === "function" && typeof globalScope.importScripts === "function") {
    const controller = createWorkerController((message) => globalScope.postMessage(message));
    globalScope.onmessage = (event) => controller.handle(event.data);
  }
})(typeof self !== "undefined" ? self : globalThis);
