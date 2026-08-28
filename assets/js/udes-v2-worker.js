/*
 * Abu Dhabi Urban Dynamics Engine v2
 *
 * A dependency-free Web Worker simulation core. Persistent weighted citizen
 * and enterprise agents produce aggregate city, zone, and network outcomes.
 *
 * Worker request: { type, requestId?, payload? }
 *   init       { data?: { zones?, links? }, config?: Partial<Config>, seed? }
 *   step       { days?: 1, captureDaily?: false, snapshot?: SnapshotOptions }
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
    initialEmploymentRate: 0.8,
    // Employment is a calibrated stock, not an absorbing state. Daily labor
    // matching repairs separations only up to this citywide target instead of
    // mechanically filling every vacancy until unemployment reaches zero.
    targetEmploymentRate: 0.8,
    initialCarOwnership: 0.86,
    initialHomeZoneJobProbability: 0.3,
    initialHousingOccupancyTarget: 0.82,
    initialBankMonthsOfSalary: 1.5,
    // Bank balance is a savings stock, not cumulative disposable income.
    // Positive income after ordinary essentials is saved only in part, while
    // a negative residual draws down the balance in full.
    monthlyEssentialConsumptionAed: 2500,
    positiveResidualSavingsRate: 0.25,
    // Reporting-only threshold used to distinguish a thin positive monthly
    // buffer from stronger savings capacity after modeled essentials.
    financialThinBufferAed: 1500,
    ageMin: 20,
    ageMax: 80,
    retirementSalaryFactorAfterAge: 60,
    retirementSalaryFactor: 0.5,
    workdays: [1, 2, 3, 4, 5],
    workdaysPerMonth: 22,
    agentSampleSize: 12,
    routingBatchSize: 512,
    maxDailyLaborMatches: 160,
    laborMarketVacancyBuffer: 0.08,
    betterJobSearchAttempts: 8,
    betterJobMinimumRaise: 1.03,
    initialHousingCapacityBuffer: 1.2,
    housingCapacityMultiplier: 1,
    // Published district capacity is treated as housing stock rather than a
    // hard population gate. Occupancy above 100% is surfaced as overcrowding
    // and feeds rent pressure; agents are never silently dumped into zone 0.
    housingCapacityIsSoft: true,
    businessCapacityMultiplier: 1,
    rentPressureMultiplier: 1,
    placeQuality: 0.82,
    // Land-use levers can be applied citywide (null) or to one named zone.
    // Mobility levers remain citywide. Each zone retains its own applied
    // values so a subsequent targeted intervention does not reset others.
    policyScopeZoneId: null,
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
    // Happy carless agents reconsider ownership infrequently, but acquisition
    // is not automatic. It requires a post-purchase income buffer and savings,
    // then responds to the relative generalized cost of car and available PT.
    // This Abu Dhabi calibration extension uses a one-to-two-year review
    // interval; the published UDES statechart does not prescribe this timer.
    carConsiderationMinDays: 365,
    carConsiderationMaxDays: 730,
    carAcquisitionFixedMonthlyCostAed: 700,
    carAcquisitionMinimumSavingsAed: 12000,
    carAcquisitionSavingsRampAed: 24000,
    carAcquisitionAffordabilityScaleAed: 4000,
    carAcquisitionValueOfTimeAedPerHour: 35,
    carAcquisitionConvenienceBenefitAed: 15,
    carAcquisitionMinimumGeneralizedAdvantageAed: 0,
    carAcquisitionGeneralizedCostScaleAed: 4,
    carAcquisitionMaximumProbability: 1,
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
    // Abu Dhabi bus tariff: each direction charges a boarding/base fare plus
    // a distance component for every passenger-kilometre travelled.
    ptFareOneWayAed: 2,
    ptFarePerPassengerKmAed: 0.05,
    ptFareMaximumOneWayAed: 5,
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
    // Corridor capacities are soft assignment capacities. Excess demand is
    // represented as congestion/crowding, never as an implausible long walk.
    allowCapacityOverflow: true,
    maxInterzoneWalkDistanceKm: 3,

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
    firmMinimumJobSlots: 3,
    firmMaximumJobSlots: 40,
    // A firm at minimum scale exits only after a sustained, material loss.
    // The agent slot then represents a new entrant after a short setup period.
    enterpriseRestartMarginThreshold: -0.2,
    enterpriseRestartLossMonths: 12,
    firmStartupDays: 14,
    firmAnnualWageGrowth: 0.015,
    firmGrowthWageIncrease: 0.015,
    firmLesserWageDecrease: 0.02,
    firmWageIndexMin: 0.65,
    firmWageIndexMax: 2.5,
    businessRentBaseAedPerRepresentedWorker: 32,

    // Synthetic Abu Dhabi enterprise-economics extension. Set this false to
    // retain the reference UDES independent exponential state hazards. The
    // extension does not add profit-maximising agents: it only conditions the
    // existing Grow/Lesser clocks and relocation ranking on transparent,
    // lightweight monthly operating signals.
    endogenousEnterpriseDynamics: true,
    enterpriseTargetMargin: 0.12,
    enterpriseNonLaborCostShare: 0.21,
    enterpriseMaximumLaborCostShare: 0.8,
    enterpriseFixedCostAedPerCapacityWorker: 850,
    enterpriseMarginHazardSensitivity: 1.8,
    enterpriseFillHazardSensitivity: 0.8,
    enterpriseDemandHazardSensitivity: 1.25,
    enterpriseHazardMultiplierMin: 0.08,
    enterpriseHazardMultiplierMax: 4,
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
      // Ownership draws have their own deterministic stream so a policy that
      // changes acquisition probability cannot perturb unrelated firm,
      // housing, mortality, or mode-choice draws.
      this.carOwnershipRng = new SeededRandom(this.seed ^ 0x9e3779b9);
      this.qualityAspirationRng = new SeededRandom(this.seed ^ 0x85ebca6b);
      this.initialOptions = {
        seed: this.seed,
        config: deepClone(suppliedConfig),
        data: deepClone(options.data || {}),
        zonePolicies: deepClone(options.zonePolicies || []),
      };
      this.day = 0;
      this.monthCounter = 0;
      this.yearCounter = 0;
      this.startEpoch = Date.parse(`${this.config.startDate}T00:00:00Z`);
      if (!Number.isFinite(this.startEpoch)) throw new Error("config.startDate must use YYYY-MM-DD");
      this.clock = this.clockAt(0);
      this.eventsTotal = this.emptyEventCounters();
      this.lastHistoryEventTotals = this.emptyEventCounters();
      this.lastCompletedMonthEvents = this.emptyEventCounters();
      this.dailyFlows = this.emptyDailyFlows();
      this.dailyTransitions = this.emptyDailyTransitions();
      this.cityHistory = [];
      this.zones = this.createZones(options.data?.zones || DEFAULT_ZONES);
      this.zoneById = new Map(this.zones.map((zone) => [zone.id, zone]));
      this.initializeZoneLandUsePolicies();
      if (this.initialOptions.zonePolicies.length) this.applyExplicitZonePolicies(this.initialOptions.zonePolicies);
      this.initialOptions.zonePolicies = this.serializeZonePolicies();
      this.links = this.createLinks(options.data?.links || options.data?.routes, options.data?.transit);
      this.linkById = new Map(this.links.map((link) => [link.id, link]));
      this.graph = this.buildGraph();
      this.citizens = [];
      this.citizenById = new Map();
      this.enterprises = [];
      this.enterpriseById = new Map();
      this.unemployedIds = new Set();
      this.daily = this.emptyDailyMetrics();
      this.lastWorkdayAssignmentDate = null;
      this.lastCarPathMatrix = null;
      this.lastPtPathMatrix = null;
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
        zonePolicies: this.initialOptions.zonePolicies,
      });
    }

    configure(patch, reset = false) {
      if (!isPlainObject(patch)) throw new Error("configure.patch must be an object");
      const normalizedPatch = normalizeConfigPatch(patch);
      const explicitZonePolicies = Array.isArray(normalizedPatch.zonePolicies) ? normalizedPatch.zonePolicies : null;
      delete normalizedPatch.zonePolicies;
      if (reset) {
        const resetZonePolicies = explicitZonePolicies || this.initialOptions.zonePolicies;
        this.initialOptions.config = mergeConfig(this.initialOptions.config, normalizedPatch);
        this.initialize({
          seed: normalizedPatch.seed ?? this.seed,
          config: this.initialOptions.config,
          data: this.initialOptions.data,
          zonePolicies: resetZonePolicies,
        });
        return this.snapshot();
      }
      const structuralKeys = ["citizenCount", "enterpriseCount", "citizenWeight", "startDate", "salaryDistribution", "sectorDistribution"];
      if (structuralKeys.some((key) => Object.prototype.hasOwnProperty.call(normalizedPatch, key))) {
        throw new Error(`Structural configuration (${structuralKeys.join(", ")}) requires reset:true`);
      }
      const policyScopeZoneId = this.normalizePolicyScopeZoneId(
        Object.prototype.hasOwnProperty.call(normalizedPatch, "policyScopeZoneId") ? normalizedPatch.policyScopeZoneId : this.config.policyScopeZoneId
      );
      normalizedPatch.policyScopeZoneId = policyScopeZoneId;
      this.config = mergeConfig(this.config, normalizedPatch);
      this.initialOptions.config = mergeConfig(this.initialOptions.config, normalizedPatch);
      const targetZones = policyScopeZoneId ? [this.zoneById.get(policyScopeZoneId)] : this.zones;
      if (normalizedPatch.housingCapacityMultiplier !== undefined) {
        for (const zone of targetZones) {
          zone.housingCapacityMultiplier = Number(this.config.housingCapacityMultiplier);
          zone.housingCapacityAgents = Math.max(1, Math.ceil(zone.baseHousingCapacityAgents * zone.housingCapacityMultiplier));
        }
      }
      if (normalizedPatch.businessCapacityMultiplier !== undefined) {
        for (const zone of targetZones) {
          zone.businessCapacityMultiplier = Number(this.config.businessCapacityMultiplier);
          zone.enterprisePlaceCapacity = Math.max(
            zone.enterpriseIds.size,
            Math.round(zone.baseEnterprisePlaceCapacity * zone.businessCapacityMultiplier)
          );
        }
      }
      if (normalizedPatch.placeQuality !== undefined) {
        this.applyPlaceQualityPolicy(targetZones, this.config.placeQuality);
      }
      if (explicitZonePolicies) this.applyExplicitZonePolicies(explicitZonePolicies);
      this.initialOptions.zonePolicies = this.serializeZonePolicies();
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

    emptyDailyFlows() {
      return {
        residentialMoves: [],
        jobMoves: [],
        enterpriseMoves: [],
        replacementRelocations: [],
      };
    }

    resetDailyFlows() {
      this.dailyFlows = this.emptyDailyFlows();
    }

    emptyDailyTransitions() {
      return { citizens: [], enterprises: [] };
    }

    resetDailyTransitions() {
      this.dailyTransitions = this.emptyDailyTransitions();
    }

    recordDailyTransition(kind, transition) {
      const collection = this.dailyTransitions?.[kind];
      if (!Array.isArray(collection) || !transition?.fromState || !transition?.toState || transition.fromState === transition.toState) return;
      collection.push({ ...transition });
    }

    aggregateDailyTransitions() {
      const aggregate = (rows, numericFields) => {
        const grouped = new Map();
        for (const row of rows) {
          const reason = String(row.reason || "unspecified");
          const zoneId = String(row.zoneId || "unknown");
          const key = `${zoneId}|${row.fromState}|${row.toState}|${reason}`;
          if (!grouped.has(key)) {
            grouped.set(key, {
              zoneId,
              fromState: row.fromState,
              toState: row.toState,
              reason,
              ...Object.fromEntries(numericFields.map((field) => [field, 0])),
            });
          }
          const target = grouped.get(key);
          for (const field of numericFields) target[field] += Math.max(0, Number(row[field]) || 0);
        }
        return [...grouped.values()].sort(
          (a, b) =>
            a.zoneId.localeCompare(b.zoneId) ||
            a.fromState.localeCompare(b.fromState) ||
            a.toState.localeCompare(b.toState) ||
            a.reason.localeCompare(b.reason)
        );
      };
      const citizens = aggregate(this.dailyTransitions.citizens, ["citizenAgentCount", "representedResidents"]);
      const enterprises = aggregate(this.dailyTransitions.enterprises, ["enterpriseCount"]);
      return {
        citizens,
        enterprises,
        totals: {
          citizenAgentTransitions: sumBy(citizens, (row) => row.citizenAgentCount),
          representedCitizenTransitions: sumBy(citizens, (row) => row.representedResidents),
          enterpriseTransitions: sumBy(enterprises, (row) => row.enterpriseCount),
        },
      };
    }

    recordDailyFlow(kind, flow) {
      const collection = this.dailyFlows?.[kind];
      if (!Array.isArray(collection) || !flow?.fromZoneId || !flow?.toZoneId || flow.fromZoneId === flow.toZoneId) return;
      collection.push({ ...flow });
    }

    aggregateDailyFlows() {
      const aggregate = (rows, numericFields) => {
        const grouped = new Map();
        for (const row of rows) {
          const reason = String(row.reason || "unspecified");
          const key = `${row.fromZoneId}|${row.toZoneId}|${reason}`;
          if (!grouped.has(key)) {
            grouped.set(key, {
              fromZoneId: row.fromZoneId,
              toZoneId: row.toZoneId,
              reason,
              ...Object.fromEntries(numericFields.map((field) => [field, 0])),
            });
          }
          const target = grouped.get(key);
          for (const field of numericFields) target[field] += Math.max(0, Number(row[field]) || 0);
        }
        return [...grouped.values()].sort(
          (a, b) => a.fromZoneId.localeCompare(b.fromZoneId) || a.toZoneId.localeCompare(b.toZoneId) || a.reason.localeCompare(b.reason)
        );
      };
      const residentialMoves = aggregate(this.dailyFlows.residentialMoves, ["citizenAgentCount", "representedResidents"]);
      const jobMoves = aggregate(this.dailyFlows.jobMoves, ["citizenAgentCount", "representedWorkers"]);
      const enterpriseMoves = aggregate(this.dailyFlows.enterpriseMoves, [
        "enterpriseCount",
        "affectedCitizenAgentCount",
        "representedWorkersAffected",
      ]);
      const replacementRelocations = aggregate(this.dailyFlows.replacementRelocations, ["citizenAgentCount", "representedResidents"]);
      return {
        residentialMoves,
        jobMoves,
        enterpriseMoves,
        replacementRelocations,
        totals: {
          residentialMoveAgents: sumBy(residentialMoves, (row) => row.citizenAgentCount),
          representedResidentialMoves: sumBy(residentialMoves, (row) => row.representedResidents),
          crossDistrictJobMoveAgents: sumBy(jobMoves, (row) => row.citizenAgentCount),
          representedCrossDistrictJobMoves: sumBy(jobMoves, (row) => row.representedWorkers),
          enterpriseMoves: sumBy(enterpriseMoves, (row) => row.enterpriseCount),
          representedWorkersAffectedByEnterpriseMoves: sumBy(enterpriseMoves, (row) => row.representedWorkersAffected),
          replacementRelocationAgents: sumBy(replacementRelocations, (row) => row.citizenAgentCount),
          representedReplacementRelocations: sumBy(replacementRelocations, (row) => row.representedResidents),
        },
      };
    }

    dailyZoneFlowDiagnostics(flows) {
      const diagnostics = new Map(
        this.zones.map((zone) => [
          zone.id,
          {
            residentialMoveInflows: 0,
            residentialMoveOutflows: 0,
            residentialMoveNet: 0,
            jobMoveInflows: 0,
            jobMoveOutflows: 0,
            jobMoveNet: 0,
            enterpriseMoveInflows: 0,
            enterpriseMoveOutflows: 0,
            enterpriseMoveNet: 0,
            workersAffectedByEnterpriseMoveInflows: 0,
            workersAffectedByEnterpriseMoveOutflows: 0,
            enterpriseWorkerMoveNet: 0,
            replacementRelocationInflows: 0,
            replacementRelocationOutflows: 0,
            replacementRelocationNet: 0,
          },
        ])
      );
      const apply = (rows, valueField, inflowField, outflowField, netField) => {
        for (const row of rows) {
          const value = Math.max(0, Number(row[valueField]) || 0);
          const origin = diagnostics.get(row.fromZoneId);
          const target = diagnostics.get(row.toZoneId);
          if (origin) {
            origin[outflowField] += value;
            origin[netField] -= value;
          }
          if (target) {
            target[inflowField] += value;
            target[netField] += value;
          }
        }
      };
      apply(flows.residentialMoves, "representedResidents", "residentialMoveInflows", "residentialMoveOutflows", "residentialMoveNet");
      apply(flows.jobMoves, "representedWorkers", "jobMoveInflows", "jobMoveOutflows", "jobMoveNet");
      apply(flows.enterpriseMoves, "enterpriseCount", "enterpriseMoveInflows", "enterpriseMoveOutflows", "enterpriseMoveNet");
      apply(
        flows.enterpriseMoves,
        "representedWorkersAffected",
        "workersAffectedByEnterpriseMoveInflows",
        "workersAffectedByEnterpriseMoveOutflows",
        "enterpriseWorkerMoveNet"
      );
      apply(
        flows.replacementRelocations,
        "representedResidents",
        "replacementRelocationInflows",
        "replacementRelocationOutflows",
        "replacementRelocationNet"
      );
      return diagnostics;
    }

    eventCounterDelta(current, previous) {
      const delta = this.emptyEventCounters();
      for (const key of Object.keys(delta)) delta[key] = Math.max(0, Number(current[key] || 0) - Number(previous[key] || 0));
      return delta;
    }

    serializeEventDeltas(rawCounters) {
      const counters = { ...this.emptyEventCounters(), ...rawCounters };
      const representedKeys = ["residentialMoves", "jobChanges", "hires", "fires", "carAcquisitions", "carDisposals", "replacements"];
      const output = { ...counters };
      for (const key of representedKeys) output[`${key}Represented`] = counters[key] * this.config.citizenWeight;
      return output;
    }

    dailyObservation(previousEventTotals) {
      const metrics = this.computeMetrics();
      const flows = this.aggregateDailyFlows();
      const transitions = this.aggregateDailyTransitions();
      const zoneFlows = this.dailyZoneFlowDiagnostics(flows);
      const isWorkday = this.config.workdays.includes(this.clock.weekday);
      const networkAssignmentDate = this.lastWorkdayAssignmentDate;
      const networkAssignmentStatus = !networkAssignmentDate
        ? "not-assigned"
        : networkAssignmentDate === this.clock.date
          ? "current"
          : "retained-last-workday";
      return {
        clock: { ...this.clock },
        date: this.clock.date,
        day: this.day,
        isWorkday,
        networkAssignmentDate,
        networkAssignmentStatus,
        networkAssignmentIsStale: networkAssignmentStatus === "retained-last-workday",
        city: metrics.city,
        zonePolicies: this.serializeZonePolicies(),
        zoneSeries: metrics.zones.map((zone) => ({
          id: zone.id,
          satisfaction: zone.stateShares.Happy,
          waitingSharePercent: zone.stateShares.Waiting,
          extremeSharePercent: zone.stateShares.Extreme,
          recoverySharePercent: zone.stateShares.Recovery,
          averageRoundTripMinutes: zone.averageRoundTripMinutes,
          housingOccupancyRate: zone.housingOccupancyRate,
          residentialRentAed: zone.residentialRentAed,
          jobs: zone.jobs,
          jobCapacity: zone.jobCapacity,
          vacancies: zone.vacancies,
          population: zone.population,
          representedEmployed: zone.representedEmployed,
          employmentRate: zone.employmentRate,
          carOwnershipRate: zone.carOwnershipRate,
          carModeSharePercent: zone.modeShares.car,
          ptModeSharePercent: zone.modeShares.pt,
          walkModeSharePercent: zone.modeShares.walk,
          sameZoneWorkShare: zone.sameZoneWorkShare,
          averageGrossSalaryAed: zone.averageGrossSalaryAed,
          averageHousingCostAed: zone.averageHousingCostAed,
          averageMonthlyTransportCostAed: zone.averageMonthlyTransportCostAed,
          averageCashAfterHousingAndCommuteAed: zone.averageCashAfterHousingAndCommuteAed,
          averageResidualAfterEssentialsAed: zone.averageResidualAfterEssentialsAed,
          averageBankBalanceAed: zone.averageBankBalanceAed,
          housingCapacity: zone.housingCapacity,
          enterprises: zone.enterprises,
          enterprisePlaceCapacity: zone.enterprisePlaceCapacity,
          businessRentAedPerRepresentedWorker: zone.businessRentAedPerRepresentedWorker,
          citizenStateCounts: zone.stateCounts,
          citizenModeCounts: zone.modeCounts,
          financialStatusShares: zone.financialStatusShares,
          enterpriseStateShares: zone.enterpriseStateShares,
          activeEnterpriseSharePercent: zone.activeEnterpriseSharePercent,
          lossMakingEnterpriseSharePercent: zone.lossMakingEnterpriseSharePercent,
          enterprisePortfolioOperatingMarginPercent: zone.enterprisePortfolioOperatingMarginPercent,
          ...zoneFlows.get(zone.id),
        })),
        flows,
        transitions,
        events: this.serializeEventDeltas(this.eventCounterDelta(this.eventsTotal, previousEventTotals)),
        monthToDateEvents: this.serializeEventDeltas(this.eventCounterDelta(this.eventsTotal, this.lastHistoryEventTotals)),
      };
    }

    emptyDailyMetrics() {
      return {
        representedTrips: 0,
        carTrips: 0,
        ptTrips: 0,
        walkTrips: 0,
        forcedWalkTrips: 0,
        unservedTrips: 0,
        capacityOverflowTrips: 0,
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
        const suppliedCapacityAgents = Number(source.housingCapacityAgents);
        const baseHousingCapacityAgents = Math.max(
          1,
          Number.isFinite(suppliedCapacityPeople)
            ? Math.ceil(suppliedCapacityPeople / this.config.citizenWeight)
            : Number.isFinite(suppliedCapacityAgents)
              ? Math.ceil(suppliedCapacityAgents)
              : Math.ceil(this.config.citizenCount * populationShare * this.config.initialHousingCapacityBuffer)
        );
        const baseEnterprisePlaceCapacity = Math.max(
          1,
          Math.round(Number(source.enterprisePlaceCapacity) || this.config.enterpriseCount * 1.35 * firmShare)
        );
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
          baseHousingCapacityAgents,
          housingCapacityMultiplier: 1,
          housingCapacityAgents: baseHousingCapacityAgents,
          baseEnterprisePlaceCapacity,
          businessCapacityMultiplier: 1,
          enterprisePlaceCapacity: baseEnterprisePlaceCapacity,
          placeQualityPolicy: 0.82,
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

    normalizePolicyScopeZoneId(scopeZoneId) {
      if (scopeZoneId == null || scopeZoneId === "") return null;
      const normalized = String(scopeZoneId);
      if (!this.zoneById.has(normalized)) throw new Error(`Unknown policy scope zone: ${normalized}`);
      return normalized;
    }

    initializeZoneLandUsePolicies() {
      const policyScopeZoneId = this.normalizePolicyScopeZoneId(this.config.policyScopeZoneId);
      this.config.policyScopeZoneId = policyScopeZoneId;
      const targetZones = policyScopeZoneId ? [this.zoneById.get(policyScopeZoneId)] : this.zones;
      const housingMultiplier = Number(this.config.housingCapacityMultiplier);
      const businessMultiplier = Number(this.config.businessCapacityMultiplier);
      for (const zone of targetZones) {
        zone.housingCapacityMultiplier = housingMultiplier;
        zone.housingCapacityAgents = Math.max(1, Math.ceil(zone.baseHousingCapacityAgents * housingMultiplier));
        zone.businessCapacityMultiplier = businessMultiplier;
        zone.enterprisePlaceCapacity = Math.max(1, Math.round(zone.baseEnterprisePlaceCapacity * businessMultiplier));
      }
      this.applyPlaceQualityPolicy(targetZones, this.config.placeQuality);
    }

    applyPlaceQualityPolicy(targetZones = this.zones, policyValue = this.config.placeQuality) {
      const normalizedPolicyValue = Number(policyValue);
      const change = normalizedPolicyValue - 0.82;
      if (!Number.isFinite(change)) return;
      for (const zone of targetZones) {
        zone.placeQualityPolicy = normalizedPolicyValue;
        zone.quality = clamp(zone.baselineQuality + change, 0, 1);
      }
    }

    serializeZonePolicies() {
      return this.zones.map((zone) => ({
        id: zone.id,
        housingCapacityMultiplier: zone.housingCapacityMultiplier,
        businessCapacityMultiplier: zone.businessCapacityMultiplier,
        placeQuality: zone.placeQualityPolicy,
      }));
    }

    applyExplicitZonePolicies(entries) {
      const seen = new Set();
      for (const entry of entries) {
        if (!isPlainObject(entry)) throw new Error("Each zone policy must be an object");
        const zoneId = String(entry.id ?? entry.zoneId ?? "");
        if (!zoneId || seen.has(zoneId)) throw new Error(`Invalid or duplicate zone policy: ${zoneId || "(missing id)"}`);
        const zone = this.zoneById.get(zoneId);
        if (!zone) throw new Error(`Unknown zone policy target: ${zoneId}`);
        const housingCapacityMultiplier = Number(entry.housingCapacityMultiplier);
        const businessCapacityMultiplier = Number(entry.businessCapacityMultiplier);
        const placeQuality = Number(entry.placeQuality);
        if (!Number.isFinite(housingCapacityMultiplier) || housingCapacityMultiplier <= 0) {
          throw new Error(`Invalid housing capacity multiplier for ${zoneId}`);
        }
        if (!Number.isFinite(businessCapacityMultiplier) || businessCapacityMultiplier <= 0) {
          throw new Error(`Invalid business capacity multiplier for ${zoneId}`);
        }
        if (!Number.isFinite(placeQuality) || placeQuality < 0 || placeQuality > 1) {
          throw new Error(`Invalid place quality for ${zoneId}`);
        }
        seen.add(zoneId);
        zone.housingCapacityMultiplier = housingCapacityMultiplier;
        zone.housingCapacityAgents = Math.max(1, Math.ceil(zone.baseHousingCapacityAgents * housingCapacityMultiplier));
        zone.businessCapacityMultiplier = businessCapacityMultiplier;
        zone.enterprisePlaceCapacity = Math.max(
          1,
          zone.enterpriseIds.size,
          Math.round(zone.baseEnterprisePlaceCapacity * businessCapacityMultiplier)
        );
        this.applyPlaceQualityPolicy([zone], placeQuality);
      }
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
          ptAverageWaitMin: Number.isFinite(Number(transit?.averageWaitMinutes))
            ? Math.max(0, Number(transit.averageWaitMinutes))
            : Math.max(0, Number(this.config.ptAverageWaitMin) || 0),
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
        if (kind === "resident") return this.zoneAcceptsResident(zone);
        return zone.enterpriseIds.size < zone.enterprisePlaceCapacity;
      });
      const weightKey = kind === "resident" ? "populationShare" : "firmShare";
      const selected = this.rng.weighted(candidates, (zone) => zone[weightKey]);
      if (selected) return selected;
      throw new Error(`No ${kind} capacity remains; revise the corresponding capacity input`);
    }

    zoneAcceptsResident(zone) {
      return Boolean(this.config.housingCapacityIsSoft) || zone.residentIds.size < zone.housingCapacityAgents;
    }

    createEnterprises() {
      for (let index = 0; index < this.config.enterpriseCount; index += 1) {
        const zone = this.allocateZoneByShare("enterprise");
        const sector =
          this.rng.weighted(this.config.sectorDistribution, (candidate) => Number(candidate.share) || 0) || this.config.sectorDistribution[0];
        const wageIndex = (zone.averageMonthlySalaryAed > 0 ? zone.averageMonthlySalaryAed / 10000 : 1) * (0.88 + this.rng.next() * 0.24);
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
          wageIndex,
          // Initial productivity/revenue and wages share the same local-sector
          // index; subsequent growth, contraction, and inflation move together.
          revenueIndex: wageIndex,
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
          consecutiveRestartLossMonths: 0,
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
          lastAccountedGrossSalaryAed: 0,
          lastAccountedHousingCostAed: 0,
          lastAccountedTransportCostAed: 0,
          lastAccountedEmployed: false,
          lastFinancialAccountingDate: this.clock.date,
          bankBalanceAed: 0,
          lastMonthlyBankBalanceDeltaAed: 0,
          mode: "none",
          routeLinkIds: [],
          roundTripMinutes: 0,
          roundTripDistanceKm: 0,
          dailyTransportCostAed: 0,
          state: "Happy",
          stateEnteredDay: 0,
          stateDecisionDay: null,
          nextCarConsiderationDay: this.carConsiderationDelayDays(),
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
      const sampledSalary = Number(selected[0]) * enterprise.wageIndex * jitter * ageFactor;
      const zone = this.zoneById.get(enterprise.zoneId);
      const productivity = 0.82 + (zone?.quality || 0.75) * 0.12 + (enterprise.laborAccessScore || 0.5) * 0.06;
      const supportedSalary =
        enterprise.sectorRevenuePerWorkerAed *
        enterprise.revenueIndex *
        enterprise.demandIndex *
        productivity *
        this.config.enterpriseMaximumLaborCostShare;
      return round(Math.min(sampledSalary, supportedSalary), 0);
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
      const formerEnterpriseId = citizen.enterpriseId;
      const formerWorkZoneId = citizen.workZoneId;
      if (!citizen.enterpriseId && reason !== "initial-hire") {
        const targetEmployed = Math.round(this.citizens.length * clamp(this.config.targetEmploymentRate, 0, 1));
        const representedEmployedAgents = this.citizens.length - this.unemployedIds.size;
        if (representedEmployedAgents >= targetEmployed) return false;
      }
      if (citizen.enterpriseId) this.detachEmployment(citizen, reason === "better-job" ? "transfer" : "detach", false);
      enterprise.employeeIds.add(citizen.id);
      citizen.enterpriseId = enterprise.id;
      citizen.workZoneId = enterprise.zoneId;
      citizen.salaryAed = Math.max(0, round(salaryAed, 0));
      this.unemployedIds.delete(citizen.id);
      this.eventsTotal.hires += 1;
      if (reason === "better-job") {
        this.eventsTotal.jobChanges += 1;
        this.recordDailyFlow("jobMoves", {
          fromZoneId: formerWorkZoneId,
          toZoneId: enterprise.zoneId,
          reason,
          citizenAgentCount: 1,
          representedWorkers: citizen.weight,
        });
      }
      this.recordCitizenEvent(citizen, reason, {
        formerEnterpriseId,
        enterpriseId: enterprise.id,
        fromWorkZoneId: formerWorkZoneId,
        toWorkZoneId: enterprise.zoneId,
        salaryAed: citizen.salaryAed,
      });
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
      citizen.mode = "none";
      citizen.routeLinkIds = [];
      citizen.roundTripMinutes = 0;
      citizen.roundTripDistanceKm = 0;
      citizen.dailyTransportCostAed = 0;
      this.unemployedIds.add(citizen.id);
      if (countFire) this.eventsTotal.fires += 1;
      this.recordCitizenEvent(citizen, reason, { formerEnterpriseId });
      return true;
    }

    assignInitialEmployment() {
      const order = this.rng.shuffle([...this.citizens]);
      const target = Math.min(order.length, Math.max(0, Math.round(order.length * clamp(this.config.initialEmploymentRate, 0, 1))));
      let employed = 0;
      for (const citizen of order) {
        if (employed >= target) break;
        const enterprise = this.findHiringEnterprise(citizen.homeZoneId);
        if (!enterprise) break;
        if (this.employ(citizen, enterprise, this.sampleSalary(enterprise, citizen.age), "initial-hire")) employed += 1;
      }
    }

    initializeCitizenFinances() {
      for (const citizen of this.citizens) {
        citizen.residentialRentAed = this.zoneById.get(citizen.homeZoneId).residentialRentAed;
        const expectedTransport = citizen.enterpriseId ? (citizen.hasCar ? 520 : 176) : 0;
        citizen.monthlyTransportCostAed = expectedTransport;
        citizen.netIncomeAed = citizen.salaryAed - citizen.residentialRentAed - expectedTransport;
        citizen.lastAccountedGrossSalaryAed = citizen.salaryAed;
        citizen.lastAccountedHousingCostAed = citizen.residentialRentAed;
        citizen.lastAccountedTransportCostAed = expectedTransport;
        citizen.lastAccountedEmployed = Boolean(citizen.enterpriseId);
        citizen.lastFinancialAccountingDate = this.clock.date;
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
      if (mode === "pt") {
        const base = link.ptBaseDurationMin * (28 / Math.max(this.config.ptAverageSpeedKmh, 1));
        const ratio = this.linkDirectionalLoad(link, direction, "pt") / Math.max(this.linkCapacity(link, "pt"), 1);
        const crowded = Math.max(0, ratio - 0.85);
        return base * (1 + 0.12 * crowded ** 2);
      }
      const load = this.linkDirectionalLoad(link, direction, "car");
      const ratio = load / Math.max(this.linkCapacity(link, "car"), 1);
      // UDES link-time structure: 0.02 h + free-flow + 0.03 h * v/c.
      const freeFlow = link.baseDurationMin / 60 / Math.max(this.config.roadSpeedMultiplier, 0.1);
      return (0.02 + freeFlow + ratio * 0.03) * 60;
    }

    ptLinkWaitMinutes(link) {
      const linkWait = Number(link?.ptAverageWaitMin);
      if (Number.isFinite(linkWait)) return Math.max(0, linkWait);
      return Math.max(0, Number(this.config.ptAverageWaitMin) || 0);
    }

    ptPathRoundTripWaitMinutes(path) {
      if (!path?.steps?.length) return 0;
      // The abstract corridor graph has no transfer representation. Model one
      // initial wait on each leg: the first outbound corridor and the first
      // return corridor (the final link of the stored outbound path).
      const firstLink = this.links[path.steps[0].linkIndex];
      const returnFirstLink = this.links[path.steps[path.steps.length - 1].linkIndex];
      return this.ptLinkWaitMinutes(firstLink) + this.ptLinkWaitMinutes(returnFirstLink);
    }

    localPtRoundTripMinutes() {
      return Math.max(0, Number(this.config.localPtCommuteMin) || 0) * (28 / Math.max(1, Number(this.config.ptAverageSpeedKmh) || 1));
    }

    ptOneWayFareAed(oneWayDistanceKm) {
      const distanceKm = Number(oneWayDistanceKm);
      if (!Number.isFinite(distanceKm) || distanceKm < 0) return Infinity;
      const baseFareAed = Math.max(0, Number(this.config.ptFareOneWayAed) || 0);
      const distanceFareAed = Math.max(0, Number(this.config.ptFarePerPassengerKmAed) || 0);
      const calculatedFareAed = baseFareAed + distanceKm * distanceFareAed;
      const maximumFareAed = Number(this.config.ptFareMaximumOneWayAed);
      return Number.isFinite(maximumFareAed) && maximumFareAed >= 0 ? Math.min(calculatedFareAed, maximumFareAed) : calculatedFareAed;
    }

    ptRoundTripFareAed(oneWayDistanceKm) {
      const oneWayFareAed = this.ptOneWayFareAed(oneWayDistanceKm);
      return Number.isFinite(oneWayFareAed) ? oneWayFareAed * 2 : Infinity;
    }

    transitFareEvidence() {
      const localRoundTripDistanceKm = Math.max(0, Number(this.config.localPtDistanceKm) || 0);
      return {
        currency: "AED",
        basis: "per-direction",
        formula: "min(maximum fare, base fare + passenger-km rate × one-way distance)",
        baseFarePerDirectionAed: round(Math.max(0, Number(this.config.ptFareOneWayAed) || 0), 2),
        farePerPassengerKmAed: round(Math.max(0, Number(this.config.ptFarePerPassengerKmAed) || 0), 4),
        maximumFarePerDirectionAed: round(Math.max(0, Number(this.config.ptFareMaximumOneWayAed) || 0), 2),
        localRoundTripDistanceKm: round(localRoundTripDistanceKm, 2),
        localRoundTripFareAed: round(this.ptRoundTripFareAed(localRoundTripDistanceKm / 2), 2),
      };
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
        const localRoundTripDistanceKm = Math.max(0, Number(this.config.localPtDistanceKm) || 0);
        this.applyCommute(
          citizen,
          "pt",
          null,
          this.localPtRoundTripMinutes(),
          localRoundTripDistanceKm,
          this.ptRoundTripFareAed(localRoundTripDistanceKm / 2),
          false
        );
      }
    }

    commuteCitizens() {
      // A weekend snapshot keeps the most recent workday assignment intact.
      // Clearing only network loads while retaining each citizen's last mode
      // made the previous implementation internally inconsistent.
      if (!this.config.workdays.includes(this.clock.weekday)) return;
      this.daily = this.emptyDailyMetrics();
      this.resetDailyNetwork();
      const order = this.rng.shuffle(this.citizens.filter((citizen) => citizen.enterpriseId));
      const assignments = [];
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
          assignments.push({ citizen, mode: citizen.mode, path: null });
          continue;
        }
        const carPath = carPaths[home.index][work.index];
        const ptPath = ptPaths[home.index][work.index];
        const carDistance = carPath?.distanceKm || Infinity;
        const ptDistance = ptPath?.distanceKm || Infinity;
        const carMinutes = carPath ? carPath.oneWayMinutes * 2 : Infinity;
        const ptInVehicleMinutes = ptPath ? ptPath.oneWayMinutes * 2 : Infinity;
        const ptWaitMinutes = ptPath ? this.ptPathRoundTripWaitMinutes(ptPath) : Infinity;
        const ptMinutes = ptPath ? ptInVehicleMinutes + ptWaitMinutes : Infinity;
        const carCost = carPath ? carDistance * 2 * this.config.carFuelAndRunningCostAedPerKm + this.config.carFixedDailyCostAed : Infinity;
        const ptCost = ptPath ? this.ptRoundTripFareAed(ptDistance) : Infinity;
        const carUtility =
          this.config.carAlternativeConstant +
          this.config.modeCostCoefficient * (carCost / this.config.costScaleAed) +
          this.config.carTimeCoefficient * carMinutes;
        const ptUtility =
          this.config.modeCostCoefficient * (ptCost / this.config.costScaleAed) +
          this.config.ptTimeCoefficient * ptInVehicleMinutes +
          this.config.ptWaitCoefficient * (ptWaitMinutes / 2);
        const probabilityCar = Number.isFinite(carUtility) ? 1 / (1 + Math.exp(clamp(ptUtility - carUtility, -30, 30))) : 0;
        let mode = this.rng.next() < probabilityCar ? "car" : "pt";
        const carAddition = citizen.weight / Math.max(this.config.carOccupancy, 0.1);
        const ptAddition = citizen.weight;
        const carPossible = citizen.hasCar && Boolean(carPath);
        const ptPossible = Boolean(ptPath);
        const carAvailable = carPossible && this.pathHasCapacity(carPath, "car", carAddition);
        const ptAvailable = ptPossible && this.pathHasCapacity(ptPath, "pt", ptAddition);
        if (this.config.allowCapacityOverflow) {
          if (mode === "car" && !carPossible) mode = ptPossible ? "pt" : "unserved";
          if (mode === "pt" && !ptPossible) mode = carPossible ? "car" : "unserved";
        } else {
          if (mode === "car" && !carAvailable) mode = ptAvailable ? "pt" : "unserved";
          if (mode === "pt" && !ptAvailable) mode = carAvailable ? "car" : "unserved";
        }
        if (mode === "car") {
          const overflow = !carAvailable;
          this.addPathLoad(carPath, "car", carAddition);
          this.applyCommute(citizen, mode, carPath, carMinutes, carDistance * 2, carCost, false, overflow);
          assignments.push({ citizen, mode, path: carPath });
        } else if (mode === "pt") {
          const overflow = !ptAvailable;
          this.addPathLoad(ptPath, "pt", ptAddition);
          this.applyCommute(citizen, mode, ptPath, ptMinutes, ptDistance * 2, ptCost, false, overflow);
          assignments.push({ citizen, mode, path: ptPath });
        } else {
          const distance = Math.min(carDistance, ptDistance);
          const walkDistance = Number.isFinite(distance) ? distance * 2 : haversineKm(home, work) * 2;
          if (walkDistance <= this.config.maxInterzoneWalkDistanceKm) {
            const walkMinutes = (walkDistance / this.config.walkSpeedKmh) * 60;
            this.applyCommute(citizen, "walk", null, walkMinutes, walkDistance, 0, false);
            assignments.push({ citizen, mode: "walk", path: null });
          } else {
            this.applyUnservedCommute(citizen);
          }
        }
      }
      for (const link of this.links) {
        link.travelTimeABMin = this.linkTravelTime(link, 1, "car");
        link.travelTimeBAMin = this.linkTravelTime(link, -1, "car");
      }
      this.recomputeRealizedCommuteTimes(assignments);
      // Retain final-load shortest paths for infrequent ownership decisions.
      // This makes better PT service suppress acquisition without rebuilding
      // the network separately for each considering citizen.
      this.lastCarPathMatrix = this.buildPathMatrix("car");
      this.lastPtPathMatrix = this.buildPathMatrix("pt");
      this.lastWorkdayAssignmentDate = this.clock.date;
    }

    recomputeRealizedCommuteTimes(assignments) {
      let weightedRoundTripMinutes = 0;
      for (const assignment of assignments) {
        const { citizen, mode, path } = assignment;
        if (path && (mode === "car" || mode === "pt")) {
          const oneWayMinutes = sumBy(path.steps, (step) => this.linkTravelTime(this.links[step.linkIndex], step.direction, mode));
          const waitMinutes = mode === "pt" ? this.ptPathRoundTripWaitMinutes(path) : 0;
          citizen.roundTripMinutes = round(oneWayMinutes * 2 + waitMinutes, 2);
        }
        weightedRoundTripMinutes += citizen.weight * citizen.roundTripMinutes;
      }
      // Citizen state guards, city metrics, and the daily aggregate now all use
      // the same final-load travel times for the completed assignment.
      this.daily.weightedRoundTripMinutes = round(weightedRoundTripMinutes, 2);
    }

    applyCommute(citizen, mode, path, minutes, distanceKm, costAed, forcedWalk, capacityOverflow = false) {
      citizen.mode = mode;
      citizen.routeLinkIds = path ? path.steps.map((step) => this.links[step.linkIndex].id) : [];
      citizen.roundTripMinutes = round(minutes, 2);
      citizen.roundTripDistanceKm = round(distanceKm, 2);
      citizen.dailyTransportCostAed = round(costAed, 2);
      citizen.currentMonthTransportCostAed += costAed;
      const represented = citizen.weight;
      this.daily.representedTrips += represented;
      this.daily.weightedRoundTripMinutes += represented * minutes;
      if (capacityOverflow) this.daily.capacityOverflowTrips += represented;
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

    applyUnservedCommute(citizen) {
      citizen.mode = "unserved";
      citizen.routeLinkIds = [];
      citizen.roundTripMinutes = 0;
      citizen.roundTripDistanceKm = 0;
      citizen.dailyTransportCostAed = 0;
      this.daily.unservedTrips += citizen.weight;
    }

    citizenIsForcedInterzoneWalk(citizen) {
      return citizen.mode === "walk" && citizen.homeZoneId !== citizen.workZoneId;
    }

    citizenIsNormal(citizen) {
      return (
        citizen.mode !== "unserved" &&
        citizen.netIncomeAed > this.config.waitingNetIncomeAed &&
        citizen.roundTripMinutes < this.config.acceptableCommuteRoundTripMin &&
        !this.citizenIsForcedInterzoneWalk(citizen)
      );
    }

    citizenIsFinanciallySevere(citizen) {
      return citizen.netIncomeAed < this.config.extremeNetIncomeAed || citizen.bankBalanceAed < this.config.extremeBankBalanceAed;
    }

    citizenHasSevereCommute(citizen) {
      return (
        citizen.mode === "unserved" || citizen.roundTripMinutes > this.config.extremeCommuteRoundTripMin || this.citizenIsForcedInterzoneWalk(citizen)
      );
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

    carConsiderationDelayDays() {
      const minimum = Math.max(1, Math.floor(Number(this.config.carConsiderationMinDays) || 1));
      const maximum = Math.max(minimum, Math.floor(Number(this.config.carConsiderationMaxDays) || minimum));
      return this.carOwnershipRng.integer(minimum, maximum);
    }

    enterCitizenState(citizen, state, reason) {
      if (citizen.state === state) return;
      const previousState = citizen.state;
      citizen.state = state;
      citizen.stateEnteredDay = this.day;
      if (state === "Waiting") {
        citizen.stateDecisionDay = this.day + this.rng.integer(this.config.waitingDecisionMinDays, this.config.waitingDecisionMaxDays);
      } else if (state === "Extreme") {
        citizen.stateDecisionDay = this.day + this.rng.integer(this.config.extremeDecisionMinDays, this.config.extremeDecisionMaxDays);
        if (citizen.hasCar && this.citizenShouldDisposeCar(citizen)) {
          citizen.hasCar = false;
          citizen.nextCarConsiderationDay = this.day + this.carConsiderationDelayDays();
          this.eventsTotal.carDisposals += 1;
          this.recordCitizenEvent(citizen, "car-disposal", {
            reason: this.config.udesExactExtremeCarDisposal ? "extreme-state-exact" : "extreme-financial-guard",
          });
        }
      } else if (state === "Happy") {
        citizen.daysDissatisfied = 0;
        citizen.stateDecisionDay = null;
        citizen.nextQualityMoveDay = this.day + this.rng.integer(this.config.qualityMoveMinDays, this.config.qualityMoveMaxDays);
      } else {
        citizen.stateDecisionDay = this.day + 1;
      }
      this.recordDailyTransition("citizens", {
        zoneId: citizen.homeZoneId,
        fromState: previousState,
        toState: state,
        reason,
        citizenAgentCount: 1,
        representedResidents: citizen.weight,
      });
      this.recordCitizenEvent(citizen, "state", { state, reason });
    }

    updateCitizenStates() {
      for (const citizen of this.citizens) {
        const normal = this.citizenIsNormal(citizen);
        if (normal) citizen.daysDissatisfied = 0;
        else citizen.daysDissatisfied += 1;
        const severe = this.citizenIsSevere(citizen);
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
          const decision = this.evaluateCarAcquisition(citizen);
          if (decision.probability > 0 && this.carOwnershipRng.next() < decision.probability) {
            citizen.hasCar = true;
            this.eventsTotal.carAcquisitions += 1;
            this.recordCitizenEvent(citizen, "car-acquisition", decision);
          }
        }
        citizen.nextCarConsiderationDay = this.day + this.carConsiderationDelayDays();
      }
      if (this.day >= citizen.nextQualityMoveDay) {
        const candidates = this.qualityAspirationCandidates(citizen);
        // One isolated draw per review preserves common random numbers across
        // policies even when one policy has no feasible aspiration candidate.
        const aspirationChoice = this.qualityAspirationRng.next();
        let target = null;
        if (candidates.length && aspirationChoice < 0.7) {
          target = [...candidates].sort((a, b) => b.zone.quality - a.zone.quality || a.generalizedMonthlyCostAed - b.generalizedMonthlyCostAed)[0];
        } else if (candidates.length) {
          const affordable = [...candidates].sort((a, b) => a.generalizedMonthlyCostAed - b.generalizedMonthlyCostAed).slice(0, 3);
          const index = Math.min(affordable.length - 1, Math.floor(((aspirationChoice - 0.7) / 0.3) * affordable.length));
          target = affordable[index];
        }
        if (target) this.moveCitizen(citizen, target.zone.id, "quality-aspiration");
        citizen.nextQualityMoveDay = this.day + this.rng.integer(this.config.qualityMoveMinDays, this.config.qualityMoveMaxDays);
      }
    }

    residentialOptionCosts(citizen, home) {
      const work = this.zoneById.get(citizen.workZoneId);
      if (!home || !work || !citizen.enterpriseId) return null;
      const valueOfTime = Math.max(0, Number(this.config.carAcquisitionValueOfTimeAedPerHour) || 0);
      const workdays = Math.max(1, Number(this.config.workdaysPerMonth) || 1);
      const options = [];
      if (home.id === work.id) {
        if (citizen.hasCar) {
          const carCash =
            Math.max(0, Number(this.config.localCarDistanceKm) || 0) * this.config.carFuelAndRunningCostAedPerKm + this.config.carFixedDailyCostAed;
          options.push({
            cashAed: carCash,
            generalizedAed: carCash + (this.config.localCarCommuteMin / 60) * valueOfTime,
            roundTripMinutes: this.config.localCarCommuteMin,
          });
        }
        const ptCash = this.ptRoundTripFareAed(Math.max(0, Number(this.config.localPtDistanceKm) || 0) / 2);
        options.push({
          cashAed: ptCash,
          generalizedAed: ptCash + (this.localPtRoundTripMinutes() / 60) * valueOfTime,
          roundTripMinutes: this.localPtRoundTripMinutes(),
        });
        options.push({
          cashAed: 0,
          generalizedAed: (this.config.localWalkCommuteMin / 60) * valueOfTime,
          roundTripMinutes: this.config.localWalkCommuteMin,
        });
      } else {
        const carPath = this.lastCarPathMatrix?.[home.index]?.[work.index];
        const ptPath = this.lastPtPathMatrix?.[home.index]?.[work.index];
        if (citizen.hasCar && carPath) {
          const minutes = sumBy(carPath.steps, (step) => this.linkTravelTime(this.links[step.linkIndex], step.direction, "car")) * 2;
          const cashAed = carPath.distanceKm * 2 * this.config.carFuelAndRunningCostAedPerKm + this.config.carFixedDailyCostAed;
          options.push({ cashAed, generalizedAed: cashAed + (minutes / 60) * valueOfTime, roundTripMinutes: minutes });
        }
        if (ptPath) {
          const minutes =
            sumBy(ptPath.steps, (step) => this.linkTravelTime(this.links[step.linkIndex], step.direction, "pt")) * 2 +
            this.ptPathRoundTripWaitMinutes(ptPath);
          const cashAed = this.ptRoundTripFareAed(ptPath.distanceKm);
          options.push({ cashAed, generalizedAed: cashAed + (minutes / 60) * valueOfTime, roundTripMinutes: minutes });
        }
        const walkDistanceKm = Math.min(carPath?.distanceKm ?? Infinity, ptPath?.distanceKm ?? Infinity) * 2;
        if (walkDistanceKm <= this.config.maxInterzoneWalkDistanceKm) {
          options.push({
            cashAed: 0,
            generalizedAed: (walkDistanceKm / Math.max(0.1, this.config.walkSpeedKmh)) * valueOfTime,
            roundTripMinutes: (walkDistanceKm / Math.max(0.1, this.config.walkSpeedKmh)) * 60,
          });
        }
      }
      if (!options.length) return null;
      const best = options.sort((a, b) => a.generalizedAed - b.generalizedAed)[0];
      return {
        cashMonthlyCostAed: home.residentialRentAed + best.cashAed * workdays,
        generalizedMonthlyCostAed: home.residentialRentAed + best.generalizedAed * workdays,
        roundTripMinutes: best.roundTripMinutes,
      };
    }

    qualityAspirationCandidates(citizen) {
      const current = this.zoneById.get(citizen.homeZoneId);
      const currentCosts = this.residentialOptionCosts(citizen, current);
      if (!current || !currentCosts) return [];
      const affordableHousingAndTravelAed =
        citizen.salaryAed -
        Math.max(0, Number(this.config.monthlyEssentialConsumptionAed) || 0) -
        Math.max(0, Number(this.config.waitingNetIncomeAed) || 0);
      return this.zones
        .filter((zone) => zone.id !== current.id && zone.quality > current.quality && this.zoneAcceptsResident(zone))
        .map((zone) => {
          const costs = this.residentialOptionCosts(citizen, zone);
          return costs ? { zone, ...costs } : null;
        })
        .filter(
          (candidate) =>
            candidate &&
            Number.isFinite(candidate.cashMonthlyCostAed) &&
            candidate.cashMonthlyCostAed <= affordableHousingAndTravelAed + EPSILON &&
            candidate.generalizedMonthlyCostAed <= currentCosts.generalizedMonthlyCostAed + EPSILON &&
            candidate.roundTripMinutes <= currentCosts.roundTripMinutes + EPSILON
        );
    }

    evaluateCarAcquisition(citizen) {
      const unavailable = {
        probability: 0,
        carGeneralizedCostAed: null,
        alternativeGeneralizedCostAed: null,
        incrementalMonthlyCostAed: null,
        postAcquisitionBufferAed: null,
      };
      if (!citizen.enterpriseId || !citizen.workZoneId) return unavailable;
      const alternatives = this.carAcquisitionAlternatives(citizen);
      if (!alternatives) return unavailable;

      const monthlyCarCost =
        Math.max(0, Number(this.config.carAcquisitionFixedMonthlyCostAed) || 0) +
        alternatives.carCashCostAed * Math.max(1, Number(this.config.workdaysPerMonth) || 1);
      const monthlyAlternativeCost = alternatives.alternativeCashCostAed * Math.max(1, Number(this.config.workdaysPerMonth) || 1);
      const incrementalMonthlyCostAed = Math.max(0, monthlyCarCost - monthlyAlternativeCost);
      const currentRentAed = Math.max(0, Number(this.zoneById.get(citizen.homeZoneId)?.residentialRentAed ?? citizen.residentialRentAed) || 0);
      const postAcquisitionBuffer =
        citizen.salaryAed -
        currentRentAed -
        monthlyCarCost -
        Math.max(0, Number(this.config.monthlyEssentialConsumptionAed) || 0) -
        this.config.waitingNetIncomeAed;
      if (postAcquisitionBuffer <= 0) {
        return {
          ...unavailable,
          carGeneralizedCostAed: round(alternatives.carGeneralizedCostAed, 2),
          alternativeGeneralizedCostAed: round(alternatives.alternativeGeneralizedCostAed, 2),
          incrementalMonthlyCostAed: round(incrementalMonthlyCostAed, 2),
          postAcquisitionBufferAed: round(postAcquisitionBuffer, 2),
        };
      }

      const minimumSavings = Math.max(0, Number(this.config.carAcquisitionMinimumSavingsAed) || 0);
      if (citizen.bankBalanceAed < minimumSavings) {
        return {
          ...unavailable,
          carGeneralizedCostAed: round(alternatives.carGeneralizedCostAed, 2),
          alternativeGeneralizedCostAed: round(alternatives.alternativeGeneralizedCostAed, 2),
          incrementalMonthlyCostAed: round(incrementalMonthlyCostAed, 2),
          postAcquisitionBufferAed: round(postAcquisitionBuffer, 2),
        };
      }

      const affordabilityScore = clamp(postAcquisitionBuffer / Math.max(1, Number(this.config.carAcquisitionAffordabilityScaleAed) || 1), 0, 1);
      const savingsScore = clamp(
        (citizen.bankBalanceAed - minimumSavings) / Math.max(1, Number(this.config.carAcquisitionSavingsRampAed) || 1),
        0,
        1
      );
      const relativeAdvantageAed = alternatives.alternativeGeneralizedCostAed - alternatives.carGeneralizedCostAed;
      const minimumAdvantage = Number(this.config.carAcquisitionMinimumGeneralizedAdvantageAed) || 0;
      // A car is considered only when it beats the available PT/walk service.
      // The saturating hazard remains bounded while retaining a transparent
      // AED generalized-cost interpretation.
      const generalizedCostScale = Math.max(0.1, Number(this.config.carAcquisitionGeneralizedCostScaleAed) || 0.1);
      const excessAdvantageAed = relativeAdvantageAed - minimumAdvantage;
      const serviceScore = excessAdvantageAed > 0 ? 1 - Math.exp(-excessAdvantageAed / generalizedCostScale) : 0;
      const probability = clamp(
        Math.max(0, Number(this.config.carAcquisitionMaximumProbability) || 0) * affordabilityScore * savingsScore * serviceScore,
        0,
        1
      );
      return {
        probability: round(probability, 4),
        affordabilityScore: round(affordabilityScore, 4),
        savingsScore: round(savingsScore, 4),
        serviceScore: round(serviceScore, 4),
        relativeGeneralizedAdvantageAed: round(relativeAdvantageAed, 2),
        carGeneralizedCostAed: round(alternatives.carGeneralizedCostAed, 2),
        alternativeGeneralizedCostAed: round(alternatives.alternativeGeneralizedCostAed, 2),
        incrementalMonthlyCostAed: round(incrementalMonthlyCostAed, 2),
        postAcquisitionBufferAed: round(postAcquisitionBuffer, 2),
      };
    }

    carAcquisitionAlternatives(citizen) {
      const home = this.zoneById.get(citizen.homeZoneId);
      const work = this.zoneById.get(citizen.workZoneId);
      if (!home || !work) return null;
      const valueOfTime = Math.max(0, Number(this.config.carAcquisitionValueOfTimeAedPerHour) || 0);
      const convenienceBenefit = Math.max(0, Number(this.config.carAcquisitionConvenienceBenefitAed) || 0);
      let carMinutes;
      let carDistanceKm;
      let ptMinutes;
      let ptOneWayDistanceKm;
      let walkMinutes = Infinity;
      if (home.id === work.id) {
        carMinutes = this.config.localCarCommuteMin;
        carDistanceKm = this.config.localCarDistanceKm;
        ptMinutes = this.localPtRoundTripMinutes();
        ptOneWayDistanceKm = Math.max(0, Number(this.config.localPtDistanceKm) || 0) / 2;
        walkMinutes = this.config.localWalkCommuteMin;
      } else {
        const carPath = this.lastCarPathMatrix?.[home.index]?.[work.index];
        const ptPath = this.lastPtPathMatrix?.[home.index]?.[work.index];
        if (!carPath) return null;
        carMinutes = sumBy(carPath.steps, (step) => this.linkTravelTime(this.links[step.linkIndex], step.direction, "car")) * 2;
        carDistanceKm = carPath.distanceKm * 2;
        ptMinutes = ptPath
          ? sumBy(ptPath.steps, (step) => this.linkTravelTime(this.links[step.linkIndex], step.direction, "pt")) * 2 +
            this.ptPathRoundTripWaitMinutes(ptPath)
          : Infinity;
        ptOneWayDistanceKm = ptPath?.distanceKm ?? Infinity;
        const walkDistanceKm = Math.min(carPath.distanceKm, ptPath?.distanceKm ?? Infinity) * 2;
        if (walkDistanceKm <= this.config.maxInterzoneWalkDistanceKm) {
          walkMinutes = (walkDistanceKm / Math.max(0.1, this.config.walkSpeedKmh)) * 60;
        }
      }

      const carCashCostAed = carDistanceKm * this.config.carFuelAndRunningCostAedPerKm + this.config.carFixedDailyCostAed;
      const ptCashCostAed = this.ptRoundTripFareAed(ptOneWayDistanceKm);
      const carGeneralizedCostAed = Math.max(0, carCashCostAed + (carMinutes / 60) * valueOfTime - convenienceBenefit);
      const ptGeneralizedCostAed = ptCashCostAed + (ptMinutes / 60) * valueOfTime;
      const walkGeneralizedCostAed = (walkMinutes / 60) * valueOfTime;
      if (walkGeneralizedCostAed < ptGeneralizedCostAed) {
        return {
          carCashCostAed,
          alternativeCashCostAed: 0,
          carGeneralizedCostAed,
          alternativeGeneralizedCostAed: walkGeneralizedCostAed,
        };
      }
      if (Number.isFinite(ptGeneralizedCostAed)) {
        return {
          carCashCostAed,
          alternativeCashCostAed: ptCashCostAed,
          carGeneralizedCostAed,
          alternativeGeneralizedCostAed: ptGeneralizedCostAed,
        };
      }
      // A disconnected non-car network is represented by a finite, saturated
      // service disadvantage so acquisition events remain JSON-safe.
      return {
        carCashCostAed,
        alternativeCashCostAed: 0,
        carGeneralizedCostAed,
        alternativeGeneralizedCostAed: carGeneralizedCostAed + Math.max(1, Number(this.config.carAcquisitionGeneralizedCostScaleAed) || 1) * 10,
      };
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
      if (!target || target === origin || !this.zoneAcceptsResident(target)) return false;
      origin.residentIds.delete(citizen.id);
      target.residentIds.add(citizen.id);
      citizen.homeZoneId = target.id;
      citizen.residentialRentAed = target.residentialRentAed;
      citizen.lastMoveReason = reason;
      this.eventsTotal.residentialMoves += 1;
      this.recordDailyFlow("residentialMoves", {
        fromZoneId: origin.id,
        toZoneId: target.id,
        reason,
        citizenAgentCount: 1,
        representedResidents: citizen.weight,
      });
      this.recordCitizenEvent(citizen, "move", { from: origin.id, to: target.id, reason });
      return true;
    }

    moveToCheaperZone(citizen) {
      const current = this.zoneById.get(citizen.homeZoneId);
      const candidates = this.zones
        .filter((zone) => zone.id !== current.id && zone.residentialRentAed < current.residentialRentAed && this.zoneAcceptsResident(zone))
        .sort((a, b) => a.residentialRentAed - b.residentialRentAed)
        .slice(0, 3);
      const target = this.rng.pick(candidates);
      return target ? this.moveCitizen(citizen, target.id, "cheaper-rent") : false;
    }

    moveToLowerCommuteCostZone(citizen) {
      if (!citizen.workZoneId) return false;
      const current = this.zoneById.get(citizen.homeZoneId);
      const work = this.zoneById.get(citizen.workZoneId);
      const candidates = this.zones.filter((zone) => zone.residentialRentAed < current.residentialRentAed && this.zoneAcceptsResident(zone));
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
          if (this.day >= enterprise.stateEnteredDay + Math.max(1, this.config.firmStartupDays)) {
            this.enterEnterpriseWorking(enterprise, "restart-complete");
          }
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
      const previousState = enterprise.state;
      enterprise.state = "Working";
      enterprise.stateEnteredDay = this.day;
      enterprise.hiring = true;
      this.scheduleEnterpriseWorkingHazards(enterprise);
      enterprise.nextActionDay = null;
      enterprise.stateExitDay = null;
      this.recordDailyTransition("enterprises", {
        zoneId: enterprise.zoneId,
        fromState: previousState,
        toState: "Working",
        reason,
        enterpriseCount: 1,
      });
      this.recordEnterpriseEvent(enterprise, "state", { state: "Working", reason });
    }

    scheduleEnterpriseWorkingHazards(enterprise) {
      const useEconomics = Boolean(this.config.endogenousEnterpriseDynamics);
      let growMultiplier = useEconomics ? enterprise.growHazardMultiplier || 1 : 1;
      let lesserMultiplier = useEconomics ? enterprise.lesserHazardMultiplier || 1 : 1;
      if (useEconomics) {
        const healthy = enterprise.operatingMargin >= this.config.enterpriseTargetMargin && enterprise.vacancyFillRate >= 0.78;
        const distressed = enterprise.operatingMargin < 0 || enterprise.vacancyFillRate < 0.5;
        if (healthy) lesserMultiplier = Math.min(lesserMultiplier, this.config.enterpriseHazardMultiplierMin);
        else if (distressed) growMultiplier = Math.min(growMultiplier, this.config.enterpriseHazardMultiplierMin);
      }
      enterprise.nextGrowDay = this.day + this.rng.exponential(this.config.firmWorkingToGrowMeanDays / Math.max(growMultiplier, EPSILON));
      enterprise.nextLesserDay = this.day + this.rng.exponential(this.config.firmWorkingToLesserMeanDays / Math.max(lesserMultiplier, EPSILON));
    }

    enterEnterpriseGrow(enterprise) {
      const previousState = enterprise.state;
      enterprise.state = "Grow";
      enterprise.stateEnteredDay = this.day;
      enterprise.hiring = true;
      enterprise.nextActionDay = this.day + this.rng.exponential(this.config.firmGrowthActionMeanDays);
      enterprise.stateExitDay = this.day + this.rng.exponential(this.config.firmGrowReturnMeanDays);
      if (this.rng.next() < this.config.firmMoveProbabilityOnStateEntry) this.moveEnterpriseHigherQuality(enterprise);
      this.recordDailyTransition("enterprises", {
        zoneId: enterprise.zoneId,
        fromState: previousState,
        toState: "Grow",
        reason: "grow-hazard",
        enterpriseCount: 1,
      });
      this.recordEnterpriseEvent(enterprise, "state", { state: "Grow" });
    }

    enterEnterpriseLesser(enterprise) {
      const previousState = enterprise.state;
      enterprise.state = "Lesser";
      enterprise.stateEnteredDay = this.day;
      enterprise.hiring = false;
      enterprise.nextActionDay = this.day + this.rng.exponential(this.config.firmLesserActionMeanDays);
      enterprise.stateExitDay = this.day + this.rng.exponential(this.config.firmLesserReturnMeanDays);
      if (this.rng.next() < this.config.firmMoveProbabilityOnStateEntry) this.moveEnterpriseLowerRent(enterprise);
      this.recordDailyTransition("enterprises", {
        zoneId: enterprise.zoneId,
        fromState: previousState,
        toState: "Lesser",
        reason: "lesser-hazard",
        enterpriseCount: 1,
      });
      this.recordEnterpriseEvent(enterprise, "state", { state: "Lesser" });
    }

    activeJobSlots(enterprise) {
      return enterprise.state === "Starting" ? 0 : Math.max(0, Number(enterprise.maxJobSlots) || 0);
    }

    openVacancySlots(enterprise) {
      if (!enterprise.hiring) return 0;
      return Math.max(0, this.activeJobSlots(enterprise) - enterprise.employeeIds.size);
    }

    applyEnterpriseGrowth(enterprise) {
      if (
        this.config.endogenousEnterpriseDynamics &&
        (enterprise.operatingMargin < this.config.enterpriseTargetMargin - 0.02 || enterprise.vacancyFillRate < 0.82)
      ) {
        this.enterEnterpriseWorking(enterprise, "growth-paused-by-economics");
        return;
      }
      enterprise.maxJobSlots = Math.min(this.config.firmMaximumJobSlots, enterprise.maxJobSlots + this.config.firmJobStepSlots);
      const previousWageIndex = enterprise.wageIndex;
      enterprise.wageIndex = clamp(
        enterprise.wageIndex * (1 + this.config.firmGrowthWageIncrease),
        this.config.firmWageIndexMin,
        this.config.firmWageIndexMax
      );
      const appliedWageFactor = enterprise.wageIndex / Math.max(previousWageIndex, EPSILON);
      enterprise.revenueIndex = clamp(enterprise.revenueIndex * appliedWageFactor, this.config.firmWageIndexMin, this.config.firmWageIndexMax);
      for (const citizenId of enterprise.employeeIds) {
        const citizen = this.citizenById.get(citizenId);
        citizen.salaryAed = round(citizen.salaryAed * appliedWageFactor, 0);
      }
      enterprise.nextActionDay = this.day + this.rng.exponential(this.config.firmGrowthActionMeanDays);
      this.recordEnterpriseEvent(enterprise, "growth-action", { maxJobSlots: enterprise.maxJobSlots });
    }

    applyEnterpriseLesser(enterprise) {
      if (
        this.config.endogenousEnterpriseDynamics &&
        enterprise.operatingMargin >= this.config.enterpriseTargetMargin - 0.02 &&
        enterprise.vacancyFillRate >= 0.65
      ) {
        this.enterEnterpriseWorking(enterprise, "contraction-paused-by-economics");
        return;
      }
      const minimumJobSlots = Math.max(1, this.config.firmMinimumJobSlots);
      const sustainedRestartLoss = enterprise.consecutiveRestartLossMonths >= Math.max(1, this.config.enterpriseRestartLossMonths);
      const totalActiveJobSlots = sumBy(this.enterprises, (candidate) => this.activeJobSlots(candidate));
      const targetEmployed = Math.round(this.citizens.length * clamp(this.config.targetEmploymentRate, 0, 1));
      const minimumCitywideJobSlots = Math.ceil(targetEmployed * (1 + Math.max(0, this.config.laborMarketVacancyBuffer)));
      if (enterprise.maxJobSlots <= minimumJobSlots && sustainedRestartLoss) {
        if (totalActiveJobSlots - this.activeJobSlots(enterprise) < minimumCitywideJobSlots) {
          this.enterEnterpriseWorking(enterprise, "restart-paused-by-labor-capacity");
          return;
        }
        this.restartEnterprise(enterprise);
        return;
      }
      const nextJobSlots = Math.max(minimumJobSlots, enterprise.maxJobSlots - this.config.firmJobStepSlots);
      const capacityReduction = enterprise.maxJobSlots - nextJobSlots;
      if (capacityReduction <= 0) {
        this.enterEnterpriseWorking(enterprise, "contraction-paused-at-minimum-scale");
        return;
      }
      if (totalActiveJobSlots - capacityReduction < minimumCitywideJobSlots) {
        this.enterEnterpriseWorking(enterprise, "contraction-paused-by-labor-capacity");
        return;
      }
      enterprise.maxJobSlots = nextJobSlots;
      while (enterprise.employeeIds.size > enterprise.maxJobSlots) {
        const lowestPaid = [...enterprise.employeeIds].map((id) => this.citizenById.get(id)).sort((a, b) => a.salaryAed - b.salaryAed)[0];
        if (lowestPaid) this.detachEmployment(lowestPaid, "firm-contraction", true);
        else break;
      }
      const previousWageIndex = enterprise.wageIndex;
      enterprise.wageIndex = clamp(
        enterprise.wageIndex * (1 - this.config.firmLesserWageDecrease),
        this.config.firmWageIndexMin,
        this.config.firmWageIndexMax
      );
      const appliedWageFactor = enterprise.wageIndex / Math.max(previousWageIndex, EPSILON);
      enterprise.revenueIndex = clamp(enterprise.revenueIndex * appliedWageFactor, this.config.firmWageIndexMin, this.config.firmWageIndexMax);
      for (const citizenId of enterprise.employeeIds) {
        const citizen = this.citizenById.get(citizenId);
        citizen.salaryAed = round(citizen.salaryAed * appliedWageFactor, 0);
      }
      enterprise.nextActionDay = this.day + this.rng.exponential(this.config.firmLesserActionMeanDays);
      this.recordEnterpriseEvent(enterprise, "lesser-action", { maxJobSlots: enterprise.maxJobSlots });
    }

    restartEnterprise(enterprise) {
      const previousState = enterprise.state;
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
      enterprise.nextGrowDay = null;
      enterprise.nextLesserDay = null;
      enterprise.nextActionDay = null;
      enterprise.stateExitDay = null;
      enterprise.maxJobSlots = Math.max(1, this.config.firmMinimumJobSlots);
      enterprise.consecutiveRestartLossMonths = 0;
      enterprise.demandShock = 0;
      const zone = this.zoneById.get(enterprise.zoneId);
      const localWageIndex = zone?.averageMonthlySalaryAed > 0 ? zone.averageMonthlySalaryAed / 10000 : 1;
      enterprise.wageIndex = clamp(localWageIndex, this.config.firmWageIndexMin, this.config.firmWageIndexMax);
      enterprise.revenueIndex = enterprise.wageIndex;
      enterprise.salaryBillAed = 0;
      enterprise.monthlyRevenueAed = 0;
      enterprise.monthlyOutputProxy = 0;
      enterprise.nonLaborOperatingCostAed = 0;
      enterprise.operatingCostAed = 0;
      enterprise.operatingMargin = 0;
      this.eventsTotal.firmRestarts += 1;
      this.recordDailyTransition("enterprises", {
        zoneId: enterprise.zoneId,
        fromState: previousState,
        toState: "Starting",
        reason: "sustained-loss-restart",
        enterpriseCount: 1,
      });
      this.recordEnterpriseEvent(enterprise, "restart", { startupDays: Math.max(1, this.config.firmStartupDays) });
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
      const affectedCitizenAgentCount = enterprise.employeeIds.size;
      const representedWorkersAffected = affectedCitizenAgentCount * this.config.citizenWeight;
      origin.enterpriseIds.delete(enterprise.id);
      target.enterpriseIds.add(enterprise.id);
      enterprise.zoneId = target.id;
      enterprise.rentPerRepresentedWorkerAed = target.businessRentAed;
      for (const citizenId of enterprise.employeeIds) this.citizenById.get(citizenId).workZoneId = target.id;
      this.eventsTotal.firmMoves += 1;
      this.recordDailyFlow("enterpriseMoves", {
        fromZoneId: origin.id,
        toZoneId: target.id,
        reason,
        enterpriseCount: 1,
        affectedCitizenAgentCount,
        representedWorkersAffected,
      });
      if (affectedCitizenAgentCount) {
        this.recordDailyFlow("jobMoves", {
          fromZoneId: origin.id,
          toZoneId: target.id,
          reason: `enterprise-relocation:${reason}`,
          citizenAgentCount: affectedCitizenAgentCount,
          representedWorkers: representedWorkersAffected,
        });
      }
      this.recordEnterpriseEvent(enterprise, "move", { from: origin.id, to: target.id, reason });
      return true;
    }

    matchUnemployedCitizens() {
      if (!this.unemployedIds.size) return;
      const targetEmployed = Math.round(this.citizens.length * clamp(this.config.targetEmploymentRate, 0, 1));
      const employed = this.citizens.length - this.unemployedIds.size;
      const gap = Math.max(0, targetEmployed - employed);
      if (!gap) return;
      const unemployed = this.rng.shuffle([...this.unemployedIds]);
      const limit = Math.min(gap, unemployed.length, this.config.maxDailyLaborMatches);
      for (let index = 0; index < limit; index += 1) {
        const citizen = this.citizenById.get(unemployed[index]);
        const enterprise = this.findHiringEnterprise(citizen.homeZoneId);
        if (!enterprise) break;
        this.employ(citizen, enterprise, this.sampleSalary(enterprise, citizen.age), "hire");
      }
    }

    closeMonth(accountingClock = this.clock) {
      this.monthCounter += 1;
      for (const citizen of this.citizens) {
        citizen.monthlyTransportCostAed = round(citizen.currentMonthTransportCostAed, 2);
        citizen.residentialRentAed = this.zoneById.get(citizen.homeZoneId).residentialRentAed;
        citizen.netIncomeAed = round(citizen.salaryAed - citizen.residentialRentAed - citizen.monthlyTransportCostAed, 2);
        citizen.lastAccountedGrossSalaryAed = citizen.salaryAed;
        citizen.lastAccountedHousingCostAed = citizen.residentialRentAed;
        citizen.lastAccountedTransportCostAed = citizen.monthlyTransportCostAed;
        citizen.lastAccountedEmployed = Boolean(citizen.enterpriseId);
        citizen.lastFinancialAccountingDate = accountingClock.date;
        const residualAfterEssentials = citizen.netIncomeAed - Math.max(0, Number(this.config.monthlyEssentialConsumptionAed) || 0);
        const savingsRate = clamp(Number(this.config.positiveResidualSavingsRate) || 0, 0, 1);
        citizen.lastMonthlyBankBalanceDeltaAed = round(
          residualAfterEssentials > 0 ? residualAfterEssentials * savingsRate : residualAfterEssentials,
          2
        );
        citizen.bankBalanceAed = round(citizen.bankBalanceAed + citizen.lastMonthlyBankBalanceDeltaAed, 2);
        citizen.currentMonthTransportCostAed = 0;
      }
      this.updateEnterpriseSalaryBills();
      this.updateEnterpriseEconomics(true, true, accountingClock);
      this.recordMonthlyHistory(false);
    }

    closeYear() {
      this.yearCounter += 1;
      for (const enterprise of this.enterprises) {
        const previousWageIndex = enterprise.wageIndex;
        enterprise.wageIndex = clamp(
          enterprise.wageIndex * (1 + this.config.firmAnnualWageGrowth),
          this.config.firmWageIndexMin,
          this.config.firmWageIndexMax
        );
        const appliedWageFactor = enterprise.wageIndex / Math.max(previousWageIndex, EPSILON);
        enterprise.revenueIndex = clamp(enterprise.revenueIndex * appliedWageFactor, this.config.firmWageIndexMin, this.config.firmWageIndexMax);
        for (const citizenId of enterprise.employeeIds) {
          const citizen = this.citizenById.get(citizenId);
          citizen.salaryAed = round(citizen.salaryAed * appliedWageFactor, 0);
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
      const previousState = citizen.state;
      this.detachEmployment(citizen, "death", false);
      const currentZone = this.zoneById.get(citizen.homeZoneId);
      const target = [...this.zones]
        .filter((zone) => this.zoneAcceptsResident(zone) || zone === currentZone)
        .sort((a, b) => a.residentialRentAed - b.residentialRentAed)[0];
      if (target && target !== currentZone) {
        currentZone.residentIds.delete(citizen.id);
        target.residentIds.add(citizen.id);
        citizen.homeZoneId = target.id;
        this.recordDailyFlow("replacementRelocations", {
          fromZoneId: currentZone.id,
          toZoneId: target.id,
          reason: "replacement-lowest-rent",
          citizenAgentCount: 1,
          representedResidents: citizen.weight,
        });
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
      citizen.lastAccountedGrossSalaryAed = 0;
      citizen.lastAccountedHousingCostAed = citizen.residentialRentAed;
      citizen.lastAccountedTransportCostAed = 0;
      citizen.lastAccountedEmployed = false;
      citizen.lastFinancialAccountingDate = this.clock.date;
      citizen.bankBalanceAed = this.config.extremeBankBalanceAed;
      citizen.lastMonthlyBankBalanceDeltaAed = 0;
      citizen.daysDissatisfied = 0;
      citizen.history = [];
      citizen.events = [];
      citizen.state = "Happy";
      citizen.stateEnteredDay = this.day;
      citizen.stateDecisionDay = null;
      citizen.nextCarConsiderationDay = this.day + this.carConsiderationDelayDays();
      citizen.nextQualityMoveDay = this.day + this.rng.integer(this.config.qualityMoveMinDays, this.config.qualityMoveMaxDays);
      this.recordDailyTransition("citizens", {
        zoneId: citizen.homeZoneId,
        fromState: previousState,
        toState: "Happy",
        reason: "demographic-replacement",
        citizenAgentCount: 1,
        representedResidents: citizen.weight,
      });
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

    updateEnterpriseEconomics(rescheduleWorkingHazards = false, recordCompletedMonth = false, accountingClock = this.clock) {
      this.computeZoneLaborAccessScores();
      const monthAngle = ((accountingClock.month - 1) / 12) * Math.PI * 2;
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
        enterprise.monthlyRevenueAed = round(
          representedEmployees * enterprise.sectorRevenuePerWorkerAed * enterprise.revenueIndex * enterprise.demandIndex * productivity,
          0
        );
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
        if (recordCompletedMonth) {
          if (enterprise.state !== "Starting" && enterprise.operatingMargin <= this.config.enterpriseRestartMarginThreshold) {
            enterprise.consecutiveRestartLossMonths += 1;
          } else {
            enterprise.consecutiveRestartLossMonths = 0;
          }
        }

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
      this.resetDailyFlows();
      this.resetDailyTransitions();
      const monthChanged = this.clock.month !== previousClock.month || this.clock.year !== previousClock.year;
      const yearChanged = this.clock.year !== previousClock.year;
      if (monthChanged) this.closeMonth(previousClock);
      if (yearChanged) this.closeYear();
      this.commuteCitizens();
      this.updateCitizenStates();
      this.updateEnterprisesDaily();
      this.lastSnapshotCache = null;
    }

    step(days = 1, options = {}) {
      const count = Math.max(0, Math.floor(Number(days) || 0));
      const normalizedOptions = isPlainObject(options) ? options : {};
      const captureDaily = Boolean(normalizedOptions.captureDaily);
      const { captureDaily: _captureDaily, snapshot: nestedSnapshotOptions, ...inlineSnapshotOptions } = normalizedOptions;
      const snapshotOptions = isPlainObject(nestedSnapshotOptions) ? nestedSnapshotOptions : inlineSnapshotOptions;
      const dailySeries = [];
      for (let index = 0; index < count; index += 1) {
        const previousEventTotals = { ...this.eventsTotal };
        this.advanceOneDay();
        if (captureDaily) dailySeries.push(this.dailyObservation(previousEventTotals));
      }
      const snapshot = this.snapshot(snapshotOptions);
      if (captureDaily) snapshot.dailySeries = dailySeries;
      return snapshot;
    }

    recordCitizenEvent(citizen, type, details) {
      pushBounded(citizen.events, { day: this.day, date: this.clock.date, type, ...details }, this.config.eventHistoryLimit);
    }

    recordEnterpriseEvent(enterprise, type, details) {
      pushBounded(enterprise.events, { day: this.day, date: this.clock.date, type, ...details }, this.config.eventHistoryLimit);
    }

    recordMonthlyHistory(initial) {
      const eventDelta = {};
      for (const key of Object.keys(this.eventsTotal)) {
        eventDelta[key] = initial ? 0 : this.eventsTotal[key] - this.lastHistoryEventTotals[key];
        this.lastHistoryEventTotals[key] = this.eventsTotal[key];
      }
      this.lastCompletedMonthEvents = { ...eventDelta };
      // Compute after persisting the boundary delta so the history point and
      // immediate snapshot expose the same completed-month totals.
      const metrics = this.computeMetrics();
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
              consecutiveRestartLossMonths: enterprise.consecutiveRestartLossMonths,
              demandIndex: enterprise.demandIndex,
              laborAccessScore: enterprise.laborAccessScore,
              vacancyFillRate: enterprise.vacancyFillRate,
            },
            this.config.enterpriseHistoryLimit
          );
        }
      }
    }

    citizenFinancialAccount(citizen) {
      const grossSalaryAed = Math.max(0, Number(citizen.lastAccountedGrossSalaryAed ?? citizen.salaryAed) || 0);
      const housingCostAed = Math.max(0, Number(citizen.lastAccountedHousingCostAed ?? citizen.residentialRentAed) || 0);
      const commutingCostAed = Math.max(0, Number(citizen.lastAccountedTransportCostAed ?? citizen.monthlyTransportCostAed) || 0);
      const componentCashAfterHousingAndCommuteAed = round(grossSalaryAed - housingCostAed - commutingCostAed, 2);
      const cashAfterHousingAndCommuteAed = Number.isFinite(Number(citizen.netIncomeAed))
        ? Number(citizen.netIncomeAed)
        : componentCashAfterHousingAndCommuteAed;
      const essentialConsumptionAed = Math.max(0, Number(this.config.monthlyEssentialConsumptionAed) || 0);
      const residualAfterEssentialsAed = round(cashAfterHousingAndCommuteAed - essentialConsumptionAed, 2);
      const savingsRate = clamp(Number(this.config.positiveResidualSavingsRate) || 0, 0, 1);
      const modeledBankChangeAtMonthEndAed = round(
        residualAfterEssentialsAed > 0 ? residualAfterEssentialsAed * savingsRate : residualAfterEssentialsAed,
        2
      );
      let status = "savings-capacity";
      let statusLabel = "Savings capacity";
      if (!(citizen.lastAccountedEmployed ?? Boolean(citizen.enterpriseId))) {
        status = "unemployed";
        statusLabel = "Unemployed";
      } else if (cashAfterHousingAndCommuteAed < 0) {
        status = "fixed-cost-deficit";
        statusLabel = "Pay below housing + commute";
      } else if (residualAfterEssentialsAed < 0) {
        status = "essentials-gap";
        statusLabel = "Essentials not fully covered";
      } else if (residualAfterEssentialsAed < Math.max(0, Number(this.config.financialThinBufferAed) || 0)) {
        status = "thin-positive-buffer";
        statusLabel = "Thin positive buffer";
      }
      return {
        grossSalaryAed,
        housingCostAed,
        commutingCostAed,
        cashAfterHousingAndCommuteAed,
        accountingReconciliationDifferenceAed: round(cashAfterHousingAndCommuteAed - componentCashAfterHousingAndCommuteAed, 2),
        essentialConsumptionAed,
        residualAfterEssentialsAed,
        modeledBankChangeAtMonthEndAed,
        positiveResidualSavingsRate: savingsRate,
        accountingDate: citizen.lastFinancialAccountingDate || this.clock.date,
        accountingCadence: "monthly-close",
        employedDuringAccountingPeriod: Boolean(citizen.lastAccountedEmployed ?? citizen.enterpriseId),
        status,
        statusLabel,
      };
    }

    financialStatusDefinitions() {
      return [
        { id: "unemployed", label: "Unemployed" },
        { id: "fixed-cost-deficit", label: "Pay below housing + commute" },
        { id: "essentials-gap", label: "Essentials not fully covered" },
        { id: "thin-positive-buffer", label: "Thin positive buffer" },
        { id: "savings-capacity", label: "Savings capacity" },
      ];
    }

    computeMetrics() {
      const zoneAccumulators = this.zones.map((zone) => ({
        id: zone.id,
        name: zone.name,
        representedPopulation: 0,
        employed: 0,
        carOwners: 0,
        state: { Happy: 0, Waiting: 0, Extreme: 0, Recovery: 0 },
        mode: { car: 0, pt: 0, walk: 0, none: 0 },
        netIncome: 0,
        grossSalary: 0,
        housingCost: 0,
        monthlyTransportCost: 0,
        residualAfterEssentials: 0,
        financialStatus: Object.fromEntries(this.financialStatusDefinitions().map((status) => [status.id, 0])),
        bankBalance: 0,
        monthlyBankBalanceDelta: 0,
        commute: 0,
        commuters: 0,
        sameZoneWorkers: 0,
        locatedJobs: 0,
        jobCapacity: 0,
        vacancies: 0,
        enterpriseState: { Working: 0, Grow: 0, Lesser: 0, Starting: 0 },
        enterpriseCount: 0,
        activeEnterpriseCount: 0,
        lossMakingEnterpriseCount: 0,
        enterpriseRevenue: 0,
        enterpriseCost: 0,
      }));
      const cityState = { Happy: 0, Waiting: 0, Extreme: 0, Recovery: 0 };
      const cityMode = { car: 0, pt: 0, walk: 0, none: 0 };
      const cityEnterpriseState = { Working: 0, Grow: 0, Lesser: 0, Starting: 0 };
      let representedPopulation = 0;
      let representedEmployed = 0;
      let representedCarOwners = 0;
      let netIncomeTotal = 0;
      let grossSalaryTotal = 0;
      let housingCostTotal = 0;
      let monthlyTransportCostTotal = 0;
      let residualAfterEssentialsTotal = 0;
      const cityFinancialStatus = Object.fromEntries(this.financialStatusDefinitions().map((status) => [status.id, 0]));
      let bankTotal = 0;
      let monthlyBankBalanceDeltaTotal = 0;
      let commuteTotal = 0;
      let commuterWeight = 0;
      let rentTotal = 0;
      let sameZoneWorkers = 0;
      let representedJobCapacity = 0;
      let representedVacancies = 0;
      let activeEnterpriseCount = 0;
      let lossMakingEnterpriseCount = 0;
      let enterpriseRevenueTotal = 0;
      let enterpriseCostTotal = 0;
      const completedModes = new Set(["car", "pt", "walk"]);
      for (const citizen of this.citizens) {
        const zone = this.zoneById.get(citizen.homeZoneId);
        const accumulator = zoneAccumulators[zone.index];
        const weight = citizen.weight;
        representedPopulation += weight;
        accumulator.representedPopulation += weight;
        if (citizen.hasCar) {
          representedCarOwners += weight;
          accumulator.carOwners += weight;
        }
        cityState[citizen.state] += weight;
        accumulator.state[citizen.state] += weight;
        const financial = this.citizenFinancialAccount(citizen);
        netIncomeTotal += financial.cashAfterHousingAndCommuteAed * weight;
        grossSalaryTotal += financial.grossSalaryAed * weight;
        housingCostTotal += financial.housingCostAed * weight;
        monthlyTransportCostTotal += financial.commutingCostAed * weight;
        residualAfterEssentialsTotal += financial.residualAfterEssentialsAed * weight;
        cityFinancialStatus[financial.status] += weight;
        bankTotal += citizen.bankBalanceAed * weight;
        monthlyBankBalanceDeltaTotal += citizen.lastMonthlyBankBalanceDeltaAed * weight;
        rentTotal += citizen.residentialRentAed * weight;
        accumulator.netIncome += financial.cashAfterHousingAndCommuteAed * weight;
        accumulator.grossSalary += financial.grossSalaryAed * weight;
        accumulator.housingCost += financial.housingCostAed * weight;
        accumulator.monthlyTransportCost += financial.commutingCostAed * weight;
        accumulator.residualAfterEssentials += financial.residualAfterEssentialsAed * weight;
        accumulator.financialStatus[financial.status] += weight;
        accumulator.bankBalance += citizen.bankBalanceAed * weight;
        accumulator.monthlyBankBalanceDelta += citizen.lastMonthlyBankBalanceDeltaAed * weight;
        if (citizen.enterpriseId) {
          representedEmployed += weight;
          accumulator.employed += weight;
          cityMode[citizen.mode] = (cityMode[citizen.mode] || 0) + weight;
          accumulator.mode[citizen.mode] = (accumulator.mode[citizen.mode] || 0) + weight;
          // An unserved work relation is tracked separately and is not a
          // completed commute with a misleading zero-minute travel time.
          if (completedModes.has(citizen.mode)) {
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
      }
      for (const enterprise of this.enterprises) {
        const accumulator = zoneAccumulators[this.zoneById.get(enterprise.zoneId).index];
        accumulator.enterpriseState[enterprise.state] = (accumulator.enterpriseState[enterprise.state] || 0) + 1;
        cityEnterpriseState[enterprise.state] = (cityEnterpriseState[enterprise.state] || 0) + 1;
        accumulator.enterpriseCount += 1;
        const activeSlots = this.activeJobSlots(enterprise);
        const activeCapacity = activeSlots * this.config.citizenWeight;
        const vacancies = this.openVacancySlots(enterprise) * this.config.citizenWeight;
        accumulator.locatedJobs += enterprise.employeeIds.size * this.config.citizenWeight;
        accumulator.jobCapacity += activeCapacity;
        accumulator.vacancies += vacancies;
        representedJobCapacity += activeCapacity;
        representedVacancies += vacancies;
        const isActiveEnterprise = enterprise.employeeIds.size > 0 && enterprise.monthlyRevenueAed > 0;
        if (isActiveEnterprise) {
          activeEnterpriseCount += 1;
          accumulator.activeEnterpriseCount += 1;
          enterpriseRevenueTotal += enterprise.monthlyRevenueAed;
          enterpriseCostTotal += enterprise.operatingCostAed;
          accumulator.enterpriseRevenue += enterprise.monthlyRevenueAed;
          accumulator.enterpriseCost += enterprise.operatingCostAed;
          if (enterprise.operatingMargin < 0) {
            lossMakingEnterpriseCount += 1;
            accumulator.lossMakingEnterpriseCount += 1;
          }
        }
      }
      const zones = zoneAccumulators.map((item) => {
        const zone = this.zoneById.get(item.id);
        const population = Math.max(item.representedPopulation, 1);
        const commuters = Math.max(item.commuters, 1);
        const stateShares = this.shareObject(item.state, population);
        const modeShares = this.modeShareObject(item.mode);
        const housingCapacityRepresented = zone.housingCapacityAgents * this.config.citizenWeight;
        const housingOccupancyRatio = item.representedPopulation / Math.max(housingCapacityRepresented, 1);
        const housingOvercapacityRepresented = Math.max(0, item.representedPopulation - housingCapacityRepresented);
        const averageNetIncomeAed = round(item.netIncome / population, 2);
        const averageGrossSalaryAed = round(item.grossSalary / population, 2);
        const averageHousingCostAed = round(item.housingCost / population, 2);
        const averageMonthlyTransportCostAed = round(item.monthlyTransportCost / population, 2);
        const averageResidualAfterEssentialsAed = round(item.residualAfterEssentials / population, 2);
        const averageBankBalanceAed = round(item.bankBalance / population, 2);
        const averageMonthlyBankBalanceDeltaAed = round(item.monthlyBankBalanceDelta / population, 2);
        const averageRoundTripMinutes = round(item.commute / commuters, 2);
        return {
          id: zone.id,
          name: zone.name,
          quality: zone.quality,
          appliedPlaceQuality: zone.quality,
          placeQualityPolicy: zone.placeQualityPolicy,
          residentialRentAed: zone.residentialRentAed,
          housingRentAed: zone.residentialRentAed,
          businessRentAedPerRepresentedWorker: zone.businessRentAed,
          representedPopulation: item.representedPopulation,
          population: item.representedPopulation,
          carOwnershipRate: round((item.carOwners / population) * 100, 2),
          housingCapacityRepresented,
          housingCapacity: housingCapacityRepresented,
          appliedHousingCapacityMultiplier: zone.housingCapacityMultiplier,
          effectiveHousingCapacityMultiplier: round(zone.housingCapacityAgents / Math.max(zone.baseHousingCapacityAgents, 1), 4),
          housingOccupancyRatio: round(housingOccupancyRatio, 4),
          housingOccupancyRate: round(housingOccupancyRatio * 100, 2),
          housingOvercapacityRepresented,
          housingConstraintMode: this.config.housingCapacityIsSoft ? "soft-overcrowding" : "hard-capacity",
          enterprises: zone.enterpriseIds.size,
          enterprisePlaceCapacity: zone.enterprisePlaceCapacity,
          appliedBusinessCapacityMultiplier: zone.businessCapacityMultiplier,
          effectiveBusinessCapacityMultiplier: round(zone.enterprisePlaceCapacity / Math.max(zone.baseEnterprisePlaceCapacity, 1), 4),
          representedEmployed: item.employed,
          jobs: item.locatedJobs,
          representedJobCapacity: item.jobCapacity,
          jobCapacity: item.jobCapacity,
          vacancies: item.vacancies,
          employmentRate: round((item.employed / population) * 100, 2),
          stateCounts: { ...item.state },
          stateShares,
          states: {
            happy: stateShares.Happy,
            waiting: stateShares.Waiting,
            extreme: stateShares.Extreme,
            recovery: stateShares.Recovery,
          },
          modeCounts: { ...item.mode },
          modeShares,
          modeShare: modeShares,
          averageNetIncomeAed,
          meanNetIncomeAed: averageNetIncomeAed,
          averageCashAfterHousingAndCommuteAed: averageNetIncomeAed,
          averageGrossSalaryAed,
          averageHousingCostAed,
          averageMonthlyTransportCostAed,
          averageResidualAfterEssentialsAed,
          financialStatusCounts: { ...item.financialStatus },
          financialStatusShares: this.shareObject(item.financialStatus, population),
          averageBankBalanceAed,
          meanBankBalanceAed: averageBankBalanceAed,
          averageMonthlyBankBalanceDeltaAed,
          averageRoundTripMinutes,
          meanCommuteMinutes: averageRoundTripMinutes,
          sameZoneWorkShare: round((item.sameZoneWorkers / commuters) * 100, 2),
          enterpriseStateCounts: { ...item.enterpriseState },
          enterpriseStateShares: this.shareObject(item.enterpriseState, item.enterpriseCount),
          activeEnterpriseSharePercent: round((item.activeEnterpriseCount / Math.max(item.enterpriseCount, 1)) * 100, 2),
          lossMakingEnterpriseSharePercent: round((item.lossMakingEnterpriseCount / Math.max(item.activeEnterpriseCount, 1)) * 100, 2),
          enterprisePortfolioOperatingMarginPercent: round(
            item.enterpriseRevenue > 0 ? ((item.enterpriseRevenue - item.enterpriseCost) / item.enterpriseRevenue) * 100 : 0,
            2
          ),
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
      const cityHousingCapacityRepresented = sumBy(this.zones, (zone) => zone.housingCapacityAgents * this.config.citizenWeight);
      const cityHousingOccupancyRatio = representedPopulation / Math.max(cityHousingCapacityRepresented, 1);
      const stateShares = this.shareObject(cityState, representedPopulation);
      const modeShares = this.modeShareObject(cityMode);
      const averageNetIncomeAed = round(netIncomeTotal / Math.max(representedPopulation, 1), 2);
      const averageGrossSalaryAed = round(grossSalaryTotal / Math.max(representedPopulation, 1), 2);
      const averageHousingCostAed = round(housingCostTotal / Math.max(representedPopulation, 1), 2);
      const averageMonthlyTransportCostAed = round(monthlyTransportCostTotal / Math.max(representedPopulation, 1), 2);
      const averageResidualAfterEssentialsAed = round(residualAfterEssentialsTotal / Math.max(representedPopulation, 1), 2);
      const averageBankBalanceAed = round(bankTotal / Math.max(representedPopulation, 1), 2);
      const averageMonthlyBankBalanceDeltaAed = round(monthlyBankBalanceDeltaTotal / Math.max(representedPopulation, 1), 2);
      const averageRoundTripMinutes = round(commuteTotal / Math.max(commuterWeight, 1), 2);
      const averageRoadCapacityUsage = round(averageRoadLoad * 100, 2);
      const distributions = this.computeDistributions();
      const representedCitizenEventsTotal = {};
      for (const key of ["residentialMoves", "jobChanges", "hires", "fires", "carAcquisitions", "carDisposals", "replacements"]) {
        representedCitizenEventsTotal[key] = this.eventsTotal[key] * this.config.citizenWeight;
      }
      const city = {
        representedPopulation,
        population: representedPopulation,
        representedEmployed,
        jobs: representedEmployed,
        representedJobCapacity,
        jobCapacity: representedJobCapacity,
        vacancies: representedVacancies,
        carOwnershipRate: round((representedCarOwners / Math.max(representedPopulation, 1)) * 100, 2),
        employmentRate: round((representedEmployed / Math.max(representedPopulation, 1)) * 100, 2),
        unemploymentRate: round((1 - representedEmployed / Math.max(representedPopulation, 1)) * 100, 2),
        citizens: this.citizens.length,
        citizenWeight: this.config.citizenWeight,
        enterprises: this.enterprises.length,
        activeEnterpriseSharePercent: round((activeEnterpriseCount / Math.max(this.enterprises.length, 1)) * 100, 2),
        lossMakingEnterpriseSharePercent: round((lossMakingEnterpriseCount / Math.max(activeEnterpriseCount, 1)) * 100, 2),
        enterprisePortfolioOperatingMarginPercent: round(
          enterpriseRevenueTotal > 0 ? ((enterpriseRevenueTotal - enterpriseCostTotal) / enterpriseRevenueTotal) * 100 : 0,
          2
        ),
        enterpriseStateCounts: { ...cityEnterpriseState },
        enterpriseStateShares: this.shareObject(cityEnterpriseState, this.enterprises.length),
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
        averageCashAfterHousingAndCommuteAed: averageNetIncomeAed,
        averageGrossSalaryAed,
        averageHousingCostAed,
        averageMonthlyTransportCostAed,
        averageResidualAfterEssentialsAed,
        financialStatusCounts: { ...cityFinancialStatus },
        financialStatusShares: this.shareObject(cityFinancialStatus, representedPopulation),
        financialAccounting: {
          formula: "gross salary − housing − commuting = cash after housing and commute; then subtract essential consumption",
          averageGrossSalaryAed,
          averageHousingCostAed,
          averageMonthlyTransportCostAed,
          averageCashAfterHousingAndCommuteAed: averageNetIncomeAed,
          monthlyEssentialConsumptionAed: Math.max(0, Number(this.config.monthlyEssentialConsumptionAed) || 0),
          averageResidualAfterEssentialsAed,
        },
        averageBankBalanceAed,
        meanBankBalanceAed: averageBankBalanceAed,
        averageMonthlyBankBalanceDeltaAed,
        savingsPolicy: {
          monthlyEssentialConsumptionAed: Math.max(0, Number(this.config.monthlyEssentialConsumptionAed) || 0),
          positiveResidualSavingsRate: clamp(Number(this.config.positiveResidualSavingsRate) || 0, 0, 1),
          negativeResidualDrawdownRate: 1,
        },
        meanHousingRentAed: round(rentTotal / Math.max(representedPopulation, 1), 2),
        averageRoundTripMinutes,
        meanCommuteMinutes: averageRoundTripMinutes,
        averageRoadCapacityUsage,
        meanRoadLoad: averageRoadCapacityUsage,
        sameZoneWorkShare: round((sameZoneWorkers / Math.max(commuterWeight, 1)) * 100, 2),
        housingCapacityRepresented: cityHousingCapacityRepresented,
        housingOccupancyRatio: round(cityHousingOccupancyRatio, 4),
        housingOccupancyRate: round(cityHousingOccupancyRatio * 100, 2),
        housingOvercapacityRepresented: Math.max(0, representedPopulation - cityHousingCapacityRepresented),
        housingConstraintMode: this.config.housingCapacityIsSoft ? "soft-overcrowding" : "hard-capacity",
        dailyCarKm: round(this.daily.carVehicleKm, 2),
        forcedInterzoneWalkers: round(this.daily.forcedWalkTrips, 0),
        unservedCommuters: round(this.daily.unservedTrips, 0),
        capacityOverflowTrips: round(this.daily.capacityOverflowTrips, 0),
        networkAssignmentDate: this.lastWorkdayAssignmentDate,
        monthlyHires: this.lastCompletedMonthEvents.hires,
        monthlyFires: this.lastCompletedMonthEvents.fires,
        monthlyMoves: this.lastCompletedMonthEvents.residentialMoves,
        monthlyHiresRepresented: this.lastCompletedMonthEvents.hires * this.config.citizenWeight,
        monthlyFiresRepresented: this.lastCompletedMonthEvents.fires * this.config.citizenWeight,
        monthlyMovesRepresented: this.lastCompletedMonthEvents.residentialMoves * this.config.citizenWeight,
        daily: {
          ...this.daily,
          averageRoundTripMinutes: round(this.daily.weightedRoundTripMinutes / Math.max(this.daily.representedTrips, 1), 2),
        },
        distributions,
        eventsTotal: { ...this.eventsTotal },
        representedCitizenEventsTotal,
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

    computeCommuteOd() {
      const grouped = new Map();
      const completedModes = new Set(["car", "pt", "walk"]);
      for (const citizen of this.citizens) {
        const workZoneId = citizen.enterpriseId ? citizen.workZoneId : null;
        const key = `${citizen.homeZoneId}|${workZoneId || "unemployed"}`;
        if (!grouped.has(key)) {
          grouped.set(key, {
            homeZoneId: citizen.homeZoneId,
            workZoneId,
            employmentStatus: workZoneId ? "employed" : "unemployed",
            citizenAgentCount: 0,
            representedResidents: 0,
            representedWorkers: 0,
            modeCounts: { car: 0, pt: 0, walk: 0, unserved: 0, none: 0 },
            completedCommuteWeight: 0,
            weightedRoundTripMinutes: 0,
          });
        }
        const row = grouped.get(key);
        row.citizenAgentCount += 1;
        row.representedResidents += citizen.weight;
        if (workZoneId) row.representedWorkers += citizen.weight;
        row.modeCounts[citizen.mode] = (row.modeCounts[citizen.mode] || 0) + citizen.weight;
        if (workZoneId && completedModes.has(citizen.mode)) {
          row.completedCommuteWeight += citizen.weight;
          row.weightedRoundTripMinutes += citizen.roundTripMinutes * citizen.weight;
        }
      }
      return [...grouped.values()]
        .map((row) => ({
          homeZoneId: row.homeZoneId,
          workZoneId: row.workZoneId,
          employmentStatus: row.employmentStatus,
          citizenAgentCount: row.citizenAgentCount,
          representedResidents: row.representedResidents,
          representedWorkers: row.representedWorkers,
          modeCounts: row.modeCounts,
          modeShares: this.modeShareObject(row.modeCounts),
          averageRoundTripMinutes: round(row.weightedRoundTripMinutes / Math.max(row.completedCommuteWeight, 1), 2),
        }))
        .sort(
          (a, b) =>
            a.homeZoneId.localeCompare(b.homeZoneId) || String(a.workZoneId || "~unemployed").localeCompare(String(b.workZoneId || "~unemployed"))
        );
    }

    weightedHistogram(items, bins, valueSelector, weightSelector) {
      const output = bins.map((bin) => ({
        label: bin.label,
        minInclusive: bin.min,
        maxExclusive: bin.max,
        agentCount: 0,
        representedCount: 0,
        sharePercent: 0,
      }));
      let representedTotal = 0;
      for (const item of items) {
        const value = Number(valueSelector(item));
        const weight = Math.max(0, Number(weightSelector(item)) || 0);
        if (!Number.isFinite(value) || weight <= 0) continue;
        const index = bins.findIndex((bin) => (bin.min === null || value >= bin.min) && (bin.max === null || value < bin.max));
        if (index < 0) continue;
        output[index].agentCount += 1;
        output[index].representedCount += weight;
        representedTotal += weight;
      }
      for (const bin of output) bin.sharePercent = round((bin.representedCount / Math.max(representedTotal, 1)) * 100, 2);
      return { bins: output, representedTotal };
    }

    computeDistributions() {
      const income = this.weightedHistogram(
        this.citizens,
        [
          { label: "Below AED 0", min: null, max: 0 },
          { label: "AED 0–2,999", min: 0, max: 3000 },
          { label: "AED 3,000–5,999", min: 3000, max: 6000 },
          { label: "AED 6,000–9,999", min: 6000, max: 10000 },
          { label: "AED 10,000–14,999", min: 10000, max: 15000 },
          { label: "AED 15,000–24,999", min: 15000, max: 25000 },
          { label: "AED 25,000+", min: 25000, max: null },
        ],
        (citizen) => citizen.netIncomeAed,
        (citizen) => citizen.weight
      );
      const exactZeroIncomeAgents = this.citizens.filter((citizen) => citizen.netIncomeAed === 0);
      const financialStatusBins = this.financialStatusDefinitions().map((definition) => ({
        ...definition,
        agentCount: 0,
        representedCount: 0,
        sharePercent: 0,
      }));
      const financialStatusById = new Map(financialStatusBins.map((bin) => [bin.id, bin]));
      for (const citizen of this.citizens) {
        const financial = this.citizenFinancialAccount(citizen);
        const bin = financialStatusById.get(financial.status);
        bin.agentCount += 1;
        bin.representedCount += citizen.weight;
      }
      const representedFinancialPopulation = sumBy(financialStatusBins, (bin) => bin.representedCount);
      for (const bin of financialStatusBins) {
        bin.sharePercent = round((bin.representedCount / Math.max(representedFinancialPopulation, 1)) * 100, 2);
      }
      const completedCommuters = this.citizens.filter(
        (citizen) => citizen.enterpriseId && (citizen.mode === "car" || citizen.mode === "pt" || citizen.mode === "walk")
      );
      const commute = this.weightedHistogram(
        completedCommuters,
        [
          { label: "Under 20 min", min: 0, max: 20 },
          { label: "20–29 min", min: 20, max: 30 },
          { label: "30–44 min", min: 30, max: 45 },
          { label: "45–59 min", min: 45, max: 60 },
          { label: "60–89 min", min: 60, max: 90 },
          { label: "90–119 min", min: 90, max: 120 },
          { label: "120+ min", min: 120, max: null },
        ],
        (citizen) => citizen.roundTripMinutes,
        (citizen) => citizen.weight
      );
      const firmBins = [
        { label: "0 workers", min: 0, max: 1 },
        { label: "1–4 workers", min: 1, max: 5 },
        { label: "5–9 workers", min: 5, max: 10 },
        { label: "10–19 workers", min: 10, max: 20 },
        { label: "20–29 workers", min: 20, max: 30 },
        { label: "30+ workers", min: 30, max: null },
      ];
      const firmSizeBins = firmBins.map((bin) => ({
        label: bin.label,
        minInclusive: bin.min,
        maxExclusive: bin.max,
        enterpriseCount: 0,
        representedEmployees: 0,
        enterpriseSharePercent: 0,
      }));
      for (const enterprise of this.enterprises) {
        const index = firmBins.findIndex(
          (bin) => enterprise.employeeIds.size >= bin.min && (bin.max === null || enterprise.employeeIds.size < bin.max)
        );
        firmSizeBins[index].enterpriseCount += 1;
        firmSizeBins[index].representedEmployees += enterprise.employeeIds.size * this.config.citizenWeight;
      }
      for (const bin of firmSizeBins) {
        bin.enterpriseSharePercent = round((bin.enterpriseCount / Math.max(this.enterprises.length, 1)) * 100, 2);
      }
      return {
        income: {
          population: "all-citizens",
          metric: "cash-after-housing-and-commute",
          unit: "AED/month after housing and commuting, before essential consumption",
          formula: "gross salary − housing − commuting",
          interpretation:
            "This is not gross income and not final disposable income. Unemployed citizens remain in the distribution with zero salary and their housing cost.",
          sourceAgentCount: this.citizens.length,
          representedTotal: income.representedTotal,
          exactZeroAgentCount: exactZeroIncomeAgents.length,
          exactZeroRepresentedCount: sumBy(exactZeroIncomeAgents, (citizen) => citizen.weight),
          bins: income.bins,
        },
        financialStatus: {
          population: "all-citizens",
          unit: "represented residents",
          monthlyEssentialConsumptionAed: Math.max(0, Number(this.config.monthlyEssentialConsumptionAed) || 0),
          thinPositiveBufferUpperBoundAed: Math.max(0, Number(this.config.financialThinBufferAed) || 0),
          categoriesAreMutuallyExclusive: true,
          representedTotal: representedFinancialPopulation,
          bins: financialStatusBins,
        },
        commute: {
          population: "completed-employed-commuters",
          unit: "round-trip minutes",
          sourceAgentCount: completedCommuters.length,
          representedTotal: commute.representedTotal,
          bins: commute.bins,
        },
        firmSize: {
          population: "all-enterprises",
          unit: "modeled employee agents",
          enterpriseTotal: this.enterprises.length,
          representedEmployeeTotal: sumBy(this.enterprises, (enterprise) => enterprise.employeeIds.size * this.config.citizenWeight),
          bins: firmSizeBins,
        },
      };
    }

    citizenDecisionExplanation(citizen) {
      const financial = this.citizenFinancialAccount(citizen);
      const severeFinancial = this.citizenIsFinanciallySevere(citizen);
      const severeCommute = this.citizenHasSevereCommute(citizen);
      const normal = this.citizenIsNormal(citizen);
      let nextReviewDay = citizen.stateDecisionDay;
      let reviewPurpose = "state recovery decision";
      if (citizen.state === "Happy") {
        nextReviewDay = Math.min(citizen.nextCarConsiderationDay, citizen.nextQualityMoveDay);
        reviewPurpose = citizen.nextCarConsiderationDay <= citizen.nextQualityMoveDay ? "car ownership review" : "housing quality review";
      }
      const lastAction = citizen.events.length ? { ...citizen.events[citizen.events.length - 1] } : null;
      return {
        decisionModel: "rule-based UDES-style statechart",
        primaryGoal: "Keep housing and access to work while maintaining an acceptable financial and commute buffer.",
        goals: [
          `Keep cash after housing and commuting above AED ${this.config.waitingNetIncomeAed.toLocaleString("en-US")}/month.`,
          `Keep the round-trip commute below ${this.config.acceptableCommuteRoundTripMin} minutes.`,
          "When dissatisfied, try a better job, cheaper housing, or housing closer to work; car and quality aspirations are reviewed less often.",
        ],
        currentAssessment: {
          state: citizen.state,
          normal,
          severeFinancial,
          severeCommute,
          financialStatus: financial.status,
          financialStatusLabel: financial.statusLabel,
          financialAccountingDate: financial.accountingDate,
          financialAccountingCadence: financial.accountingCadence,
          waitingCashThresholdAed: this.config.waitingNetIncomeAed,
          extremeCashThresholdAed: this.config.extremeNetIncomeAed,
          extremeBankBalanceThresholdAed: this.config.extremeBankBalanceAed,
          acceptableRoundTripMinutes: this.config.acceptableCommuteRoundTripMin,
          extremeRoundTripMinutes: this.config.extremeCommuteRoundTripMin,
          daysDissatisfied: citizen.daysDissatisfied,
        },
        nextScheduledReview:
          Number.isFinite(nextReviewDay) && nextReviewDay >= this.day
            ? {
                day: nextReviewDay,
                date: this.clockAt(nextReviewDay).date,
                daysFromNow: nextReviewDay - this.day,
                purpose: reviewPurpose,
              }
            : null,
        lastAction,
      };
    }

    enterpriseDecisionExplanation(enterprise) {
      const marginGap = round(enterprise.operatingMargin - this.config.enterpriseTargetMargin, 4);
      let nextDecisionDay = null;
      let nextDecision = null;
      if (enterprise.state === "Working") {
        nextDecisionDay = Math.min(enterprise.nextGrowDay, enterprise.nextLesserDay);
        nextDecision = enterprise.nextGrowDay <= enterprise.nextLesserDay ? "growth-state hazard" : "contraction-state hazard";
      } else if (enterprise.state === "Grow") {
        nextDecisionDay = Math.min(enterprise.nextActionDay, enterprise.stateExitDay);
        nextDecision = enterprise.nextActionDay <= enterprise.stateExitDay ? "growth action" : "return to Working";
      } else if (enterprise.state === "Lesser") {
        nextDecisionDay = Math.min(enterprise.nextActionDay, enterprise.stateExitDay);
        nextDecision = enterprise.nextActionDay <= enterprise.stateExitDay ? "contraction action" : "return to Working";
      } else if (enterprise.state === "Starting") {
        nextDecisionDay = enterprise.stateEnteredDay + Math.max(1, this.config.firmStartupDays);
        nextDecision = "complete startup";
      }
      const lastAction = enterprise.events.length ? { ...enterprise.events[enterprise.events.length - 1] } : null;
      return {
        decisionModel: this.config.endogenousEnterpriseDynamics
          ? "UDES-style statechart with margin, vacancy-fill, demand, and labor-access hazards"
          : "reference UDES-style independent state hazards",
        primaryGoal: "Maintain a viable operating margin and staffed capacity while responding to local demand and labor access.",
        goals: [
          `Work toward a ${(this.config.enterpriseTargetMargin * 100).toFixed(0)}% operating-margin target.`,
          "Grow capacity when margin, demand, and vacancy fill are strong; contract when they are weak.",
          "In Grow, prefer higher-quality and labor-accessible districts; in Lesser, prefer lower-rent accessible districts.",
        ],
        currentAssessment: {
          state: enterprise.state,
          operatingMarginPercent: round(enterprise.operatingMargin * 100, 2),
          targetOperatingMarginPercent: round(this.config.enterpriseTargetMargin * 100, 2),
          marginGapPercentagePoints: round(marginGap * 100, 2),
          vacancyFillRatePercent: round(enterprise.vacancyFillRate * 100, 2),
          demandIndex: enterprise.demandIndex,
          laborAccessScore: enterprise.laborAccessScore,
          growHazardMultiplier: enterprise.growHazardMultiplier,
          lesserHazardMultiplier: enterprise.lesserHazardMultiplier,
        },
        nextScheduledDecision:
          Number.isFinite(nextDecisionDay) && nextDecisionDay >= this.day
            ? {
                day: nextDecisionDay,
                date: this.clockAt(nextDecisionDay).date,
                daysFromNow: nextDecisionDay - this.day,
                purpose: nextDecision,
              }
            : null,
        lastAction,
      };
    }

    serializeCitizen(citizen, historyLimit = 0) {
      if (!citizen) return null;
      const financialAccount = this.citizenFinancialAccount(citizen);
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
        cashAfterHousingAndCommuteAed: financialAccount.cashAfterHousingAndCommuteAed,
        residualAfterEssentialsAed: financialAccount.residualAfterEssentialsAed,
        financialStatus: financialAccount.status,
        financialStatusLabel: financialAccount.statusLabel,
        financialAccount,
        bankBalanceAed: citizen.bankBalanceAed,
        bankBalance: citizen.bankBalanceAed,
        lastMonthlyBankBalanceDeltaAed: citizen.lastMonthlyBankBalanceDeltaAed,
        lastMoveReason: citizen.lastMoveReason,
        decisionExplanation: this.citizenDecisionExplanation(citizen),
        history: historyLimit ? citizen.history.slice(-historyLimit) : undefined,
        events: historyLimit ? citizen.events.slice(-historyLimit) : undefined,
      };
    }

    serializeEnterprise(enterprise, historyLimit = 0) {
      if (!enterprise) return null;
      const activeJobSlots = this.activeJobSlots(enterprise);
      const vacancyCount = this.openVacancySlots(enterprise);
      return {
        id: enterprise.id,
        zoneId: enterprise.zoneId,
        state: enterprise.state,
        status: enterprise.state,
        stateEnteredDay: enterprise.stateEnteredDay,
        hiring: enterprise.hiring,
        maxJobSlots: enterprise.maxJobSlots,
        activeJobSlots,
        representedJobCapacity: activeJobSlots * this.config.citizenWeight,
        maxJobsPersons: activeJobSlots * this.config.citizenWeight,
        plannedRepresentedJobCapacity: enterprise.maxJobSlots * this.config.citizenWeight,
        employeeCount: enterprise.employeeIds.size,
        representedEmployees: enterprise.employeeIds.size * this.config.citizenWeight,
        vacancyCount,
        vacancies: vacancyCount,
        representedVacancies: vacancyCount * this.config.citizenWeight,
        employeeIds: [...enterprise.employeeIds],
        wageIndex: round(enterprise.wageIndex, 4),
        revenueIndex: round(enterprise.revenueIndex, 4),
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
        consecutiveRestartLossMonths: enterprise.consecutiveRestartLossMonths,
        growHazardMultiplier: enterprise.growHazardMultiplier,
        lesserHazardMultiplier: enterprise.lesserHazardMultiplier,
        decisionExplanation: this.enterpriseDecisionExplanation(enterprise),
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
        housingConstraintMode: this.config.housingCapacityIsSoft ? "soft-overcrowding" : "hard-capacity",
        transitFare: this.transitFareEvidence(),
        seed: this.seed,
        clock: { ...this.clock, elapsedMonths: this.monthCounter, elapsedYears: this.yearCounter },
        city: metrics.city,
        zones: metrics.zones,
        links: metrics.links,
        commuteOd: this.computeCommuteOd(),
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
      for (const zone of this.zones) {
        if (!this.config.housingCapacityIsSoft && zone.residentIds.size > zone.housingCapacityAgents) {
          issues.push(`${zone.id} exceeds hard housing capacity`);
        }
        for (const citizenId of zone.residentIds) {
          if (this.citizenById.get(citizenId)?.homeZoneId !== zone.id) issues.push(`${zone.id}/${citizenId} reverse residence mismatch`);
        }
      }
      for (const citizen of this.citizens) {
        const home = this.zoneById.get(citizen.homeZoneId);
        if (!home?.residentIds.has(citizen.id)) issues.push(`${citizen.id} missing from home zone`);
        if (citizen.enterpriseId) {
          const enterprise = this.enterpriseById.get(citizen.enterpriseId);
          if (!enterprise?.employeeIds.has(citizen.id)) issues.push(`${citizen.id} missing from employer`);
          if (citizen.workZoneId !== enterprise?.zoneId) issues.push(`${citizen.id} work zone mismatch`);
          if (this.unemployedIds.has(citizen.id)) issues.push(`${citizen.id} both employed and unemployed`);
        } else if (!this.unemployedIds.has(citizen.id)) issues.push(`${citizen.id} absent from unemployment pool`);
        else if (citizen.mode !== "none" || citizen.routeLinkIds.length || citizen.roundTripMinutes !== 0) {
          issues.push(`${citizen.id} retains a commute while unemployed`);
        }
      }
      for (const enterprise of this.enterprises) {
        const zone = this.zoneById.get(enterprise.zoneId);
        if (!zone?.enterpriseIds.has(enterprise.id)) issues.push(`${enterprise.id} missing from zone`);
        if (enterprise.employeeIds.size > enterprise.maxJobSlots) issues.push(`${enterprise.id} exceeds its job capacity`);
        if (enterprise.state === "Starting" && (enterprise.hiring || enterprise.employeeIds.size)) {
          issues.push(`${enterprise.id} has active employment during startup`);
        }
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
          const snapshot = engine.step(payload.days ?? 1, {
            captureDaily: Boolean(payload.captureDaily),
            snapshot: payload.snapshot,
          });
          reply("snapshot", requestId, snapshot);
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
          else fail(requestId, new Error("Run superseded by a newer model request"), "RUN_CANCELLED");
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
