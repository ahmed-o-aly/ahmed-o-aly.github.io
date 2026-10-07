import assert from "node:assert/strict";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { UdesV2Engine, SeededRandom, DEFAULT_ZONES } = require("../assets/js/udes-v2-worker.js");
const make = (config = {}, data) =>
  new UdesV2Engine({
    seed: 17,
    data,
    config: {
      citizenCount: 40,
      enterpriseCount: 5,
      citizenWeight: 10,
      workdays: [],
      startDate: "2024-01-01",
      dailyJobSeparationProbability: 0,
      firmWorkingToGrowMeanDays: 1e6,
      firmWorkingToLesserMeanDays: 1e6,
      ...config,
    },
  });
const trace = (e) => JSON.stringify(e, (_key, value) => (value instanceof Map ? [...value] : value instanceof Set ? [...value] : value));
// Independent uint32 Mulberry32 reference, including the historical first loss
// of integer precision. This exercises RNG only, not a multi-year simulation.
{
  const random = new SeededRandom(240124);
  let state = 240124;
  for (let draw = 1; draw <= 4917760; draw++) {
    state = (state + 0x6d2b79f5) >>> 0;
    let value = Math.imul(state ^ (state >>> 15), state | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    const expected = ((value ^ (value >>> 14)) >>> 0) / 4294967296;
    assert.equal(random.next(), expected, `draw ${draw}`);
    assert.equal(random.state, state);
    if (draw === 4917759) assert.equal(expected, 0.7512710916344076);
  }
  assert.equal(SeededRandom.normalizeSeed(17), SeededRandom.normalizeSeed(17 + 2 ** 32));
  random.reset(17);
  assert.deepEqual(
    Array.from({ length: 3 }, () => random.next()),
    [0.6771502960473299, 0.19265692122280598, 0.5313839064911008]
  );
}
// No-op requests and failed transactions must preserve the entire state,
// including reset recipe, clocks, RNGs, counters, and populated caches.
{
  const e = make();
  e.snapshot();
  const before = trace(e);
  e.configure({ endogenousEnterpriseDynamics: e.config.endogenousEnterpriseDynamics });
  e.configure({});
  assert.equal(trace(e), before);
  const good = { ...e.serializeZonePolicies()[0], housingCapacityMultiplier: 2 };
  for (const patch of [
    { zonePolicies: [good, good] },
    { housingCapacityMultiplier: 2, zonePolicies: [good, { ...good, id: "missing" }] },
    { housingCapacityMultiplier: 0 },
    { placeQuality: NaN },
    { placeQuality: null },
    { dailyJobSearchProbability: 2 },
    { maxDailyLaborMatches: -1 },
    { zonePolicies: {} },
    { transitFareAed: -1 },
    { seed: 99 },
  ]) {
    assert.throws(() => e.configure(patch));
    assert.equal(trace(e), before);
  }
  assert.throws(() => e.configure({ startDate: "2024-02-31" }, true));
  assert.equal(trace(e), before);
  assert.throws(() => e.configure({ zonePolicies: [good, good] }, true));
  assert.equal(trace(e), before);
  const shocks = e.enterprises.map((firm) => firm.demandShock);
  e.configure({ endogenousEnterpriseDynamics: false });
  assert.deepEqual(
    e.enterprises.map((firm) => firm.demandShock),
    shocks
  );
  e.configure({ seed: 99 }, true);
  assert.equal(e.seed, 99);
  assert.equal(e.config.seed, 99);
}
// Due events survive ordinary, month and year boundaries; exact ties keep the
// documented Grow precedence and one transition per enterprise per day.
for (const startDate of ["2024-01-10", "2024-01-31", "2024-12-31"]) {
  for (const kind of ["grow", "lesser", "tie"]) {
    const e = make({ startDate, initialEmploymentRate: 1, maxDailyLaborMatches: 0 });
    const firm = e.enterprises[0];
    firm.state = "Working";
    firm.nextGrowDay = kind === "lesser" ? 100 : 1;
    firm.nextLesserDay = kind === "grow" ? 100 : 1;
    e.step(1);
    assert.equal(firm.state, kind === "lesser" ? "Lesser" : "Grow");
    assert.equal(e.dailyTransitions.enterprises.filter((x) => x.fromState === "Working").length, 1);
  }
}
// An unemployed recovery review cannot enter via voluntary job switching.
for (const cap of [0, 1]) {
  const e = make({ initialEmploymentRate: 0, laborForceParticipationRate: 1, dailyJobSearchProbability: 1, maxDailyLaborMatches: cap });
  for (const firm of e.enterprises) firm.desiredJobSlots = firm.maxJobSlots;
  for (const c of e.citizens) assert.equal(e.searchBetterJob(c), false);
  e.matchUnemployedCitizens();
  e.matchUnemployedCitizens();
  assert.equal(e.employedCitizenAgentCount(), cap);
  assert.equal(e.eventsTotal.hires, cap);
  assert.equal(e.eventsTotal.jobChanges, 0);
  assert.deepEqual(e.validateInvariants(), []);
}
{
  const e = make({ initialEmploymentRate: 0, laborForceParticipationRate: 1, dailyJobSearchProbability: 0, maxDailyLaborMatches: 1 });
  for (const firm of e.enterprises) firm.desiredJobSlots = firm.maxJobSlots;
  e.step(1);
  assert.equal(e.employedCitizenAgentCount(), 0);
}
// Force a waiting-state job-review on an ordinary model day. Statechart
// reviews still consume their branch draw, but cannot bypass matching controls.
for (const cap of [0, 1]) {
  const e = make({ initialEmploymentRate: 0, laborForceParticipationRate: 1, dailyJobSearchProbability: 1, maxDailyLaborMatches: cap });
  for (const firm of e.enterprises) firm.desiredJobSlots = firm.maxJobSlots;
  for (const c of e.citizens) {
    c.state = "Waiting";
    c.stateDecisionDay = 1;
  }
  e.citizenIsNormal = () => false;
  e.citizenIsSevere = () => false;
  e.rng.next = () => 0;
  e.step(1);
  assert.equal(e.employedCitizenAgentCount(), cap);
  assert.equal(e.eventsTotal.hires, cap);
  assert.equal(e.eventsTotal.jobChanges, 0);
  assert.deepEqual(e.validateInvariants(), []);
}
// Event accounting follows the former stock even for a mislabeled caller.
{
  const e = make({ initialEmploymentRate: 0, laborForceParticipationRate: 1 });
  const c = e.citizens[0],
    firm = e.enterprises[0];
  firm.desiredJobSlots = firm.maxJobSlots;
  assert.ok(e.employ(c, firm, 8000, "better-job"));
  assert.equal(e.eventsTotal.hires, 1);
  assert.equal(e.eventsTotal.jobChanges, 0);
}
// Explicit zero shares, quality and rent retain their meaning. Zero jobs are
// explicitly unsupported by positive-size firm cohorts, rather than unlimited.
{
  const zones = DEFAULT_ZONES.slice(0, 2).map((z, i) => ({ ...z, populationShare: i, firmShare: i, quality: 0, residentialRentAed: 0 }));
  const e = make({}, { zones });
  assert.deepEqual(
    e.zones.map((z) => z.populationShare),
    [0, 1]
  );
  assert.equal(e.zones[0].baselineQuality, 0);
  assert.equal(e.zones[0].residentialRentAed, 0);
  assert.throws(() => make({}, { zones: zones.map((z) => ({ ...z, jobCapacityPersons: 0 })) }), /Job capacity/);
}
// Current rent is independent of the settled ledger; the acquisition quote
// shares exactly the same local road-speed time as daily commute choice.
{
  const e = make({ initialEmploymentRate: 1 });
  const c = e.citizens.find((x) => x.enterpriseId);
  c.homeZoneId = c.workZoneId;
  const beforeAccount = e.citizenFinancialAccount(c);
  const quote1 = e.carAcquisitionAlternatives(c);
  const time1 = e.sameZoneCommuteOptions({ ...c, hasCar: true }).find((x) => x.mode === "car").minutes;
  e.configure({ roadSpeedMultiplier: 2 });
  const quote2 = e.carAcquisitionAlternatives(c);
  assert.equal(e.sameZoneCommuteOptions({ ...c, hasCar: true }).find((x) => x.mode === "car").minutes, time1 / 2);
  assert.equal(quote2.carCashCostAed, quote1.carCashCostAed);
  assert.ok(
    Math.abs(quote1.carGeneralizedCostAed - quote2.carGeneralizedCostAed - (time1 / 120) * e.config.carAcquisitionValueOfTimeAedPerHour) < 1e-10
  );
  for (const z of e.zones) z.residentialRentAed += 500;
  e.lastSnapshotCache = null;
  const expectedRent = e.citizens.reduce((sum, x) => sum + e.zoneById.get(x.homeZoneId).residentialRentAed, 0) / e.citizens.length;
  assert.equal(e.snapshot().city.meanHousingRentAed, Math.round(expectedRent * 100) / 100);
  const { currentMonthlyDisposableIncomeAed: _before, ...settledBefore } = beforeAccount;
  const { currentMonthlyDisposableIncomeAed: _after, ...settledAfter } = e.citizenFinancialAccount(c);
  assert.deepEqual(settledAfter, settledBefore);
}
// Batching and observation must not affect causal evolution or random streams.
{
  const a = make(),
    b = make();
  a.step(30);
  for (let day = 0; day < 30; day++) {
    b.snapshot();
    b.step(1);
  }
  assert.equal(trace(a), trace(b));
}
console.log("UDES foundation regression tests passed");
