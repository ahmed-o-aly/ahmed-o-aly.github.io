import { assert, test } from 'vitest';
import baselineData from '../data/uae-baseline.json';
import { solveScenario, validateEconomy, ModelError, type EconomyData } from './engine.ts';

/** Synthetic balanced accounts for numerical tests only. These are NOT UAE data. */
const syntheticBalancedFixture: EconomyData = {
  sectors: [
    { id: 'c1', name: 'Synthetic A', output: 100, valueAdded: 50, exports: 35,
      domesticHousehold: 20, importedHousehold: 15, domesticGovernment: 5, importedGovernment: 2,
      domesticInvestment: 10, importedInvestment: 8, domesticInventories: 0, importedInventories: 0 },
    { id: 'c2', name: 'Synthetic B', output: 150, valueAdded: 100, exports: 42,
      domesticHousehold: 40, importedHousehold: 10, domesticGovernment: 10, importedGovernment: 3,
      domesticInvestment: 20, importedInvestment: 12, domesticInventories: -2, importedInventories: 0 },
  ],
  domesticIO: [[20, 10], [15, 25]], importedIO: [[5, 10], [10, 5]],
};
const near = (actual: number, expected: number, tolerance = 1e-6) => assert.ok(Math.abs(actual - expected) < tolerance, `${actual} ≠ ${expected}`);

test('balanced synthetic economy reproduces the exact no-shock benchmark', () => {
  const r = solveScenario(syntheticBalancedFixture);
  for (const v of [r.realGDP, r.householdRealIncome, r.exports, r.imports, r.wage, r.employment]) near(v, 0);
  near(r.foreignFinancingLevel, 3);
  near(r.diagnostics.accountingResidual, 0);
  assert.equal(r.diagnostics.iterations, 0);
});

test('a productivity gain raises real output and preserves total fixed labor and external accounts', () => {
  const r = solveScenario(syntheticBalancedFixture, { productivity: 10, productivitySector: 'all' });
  assert.ok(r.realGDP > 0);
  assert.ok(r.householdRealIncome > 0);
  near(r.employment, 0);
  assert.ok(r.diagnostics.maxResidual < 1e-8);
  assert.ok(r.diagnostics.accountingResidual < 1e-7);
});

test('an import-cost shock reduces import volumes and solves both labor closures', () => {
  for (const laborClosure of ['fixed', 'elastic'] as const) {
    const r = solveScenario(syntheticBalancedFixture, { freightCost: 15, laborClosure });
    assert.ok(r.imports < 0);
    if (laborClosure === 'fixed') near(r.employment, 0);
    else near(r.realWage, 0);
    assert.ok(r.diagnostics.accountingResidual < 1e-7);
  }
});

test('export demand shock contracts the affected industry and reallocates fixed labor', () => {
  const r = solveScenario(syntheticBalancedFixture, { oilDemand: -20 });
  assert.ok(r.sectors[1].output < 0);
  assert.ok(r.sectors[0].employment > 0);
  near(r.employment, 0);
});

test('missing tariff evidence rejects tariff-cut calculations', () => {
  assert.throws(() => solveScenario(syntheticBalancedFixture, { tariffCut: 20 }), /observed baseline tariff/);
});

test('known tariff removal reduces collected tariffs, with balanced fiscal/external accounts', () => {
  const data = structuredClone(syntheticBalancedFixture);
  data.sectors.forEach(s => { s.tariffRate = 0.1; });
  const zero = solveScenario(data);
  near(zero.realGDP, 0);
  const r = solveScenario(data, { tariffCut: 100 });
  assert.ok(r.tariffRevenueChange < 0);
  assert.ok(r.diagnostics.accountingResidual < 1e-7);
});

test('bad accounts, invalid inputs and deliberate nonconvergence cannot return estimates', () => {
  const data = structuredClone(syntheticBalancedFixture);
  data.sectors[0].output += 3;
  assert.throws(() => validateEconomy(data), /do not balance/);
  assert.throws(() => solveScenario(syntheticBalancedFixture, { freightCost: NaN }), ModelError);
  assert.throws(() => solveScenario(syntheticBalancedFixture, { freightCost: 10 }, {}, { maxIterations: 0 }), /did not converge/);
  assert.throws(() => solveScenario(syntheticBalancedFixture, { productivity: 10, productivitySector: 'missing' }), /Unknown productivity sector/);
});

const realUae: EconomyData = baselineData;

test('real ADB UAE 2024 accounts reproduce published aggregate value added without shock', () => {
  const r = solveScenario(realUae);
  near(r.realGDP, 0);
  near(r.realGDPLevel, 542792.351581198, 1e-5);
  assert.ok(r.diagnostics.baselineAccountResidual < 1e-10);
  assert.ok(r.diagnostics.accountingResidual < 1e-10);
});

test('real UAE calibrated model solves substantive separate and combined shocks', () => {
  const scenarios = [
    { productivity: 5, productivitySector: 'c8' },
    { oilDemand: -20 },
    { freightCost: 10 },
    { productivity: 5, productivitySector: 'c8', oilDemand: -20, freightCost: 10 },
  ];
  for (const scenario of scenarios) {
    const r = solveScenario(realUae, scenario);
    assert.ok(r.diagnostics.maxResidual < 1e-8);
    assert.ok(r.diagnostics.accountingResidual < 1e-7);
    near(r.employment, 0);
    assert.ok(Number.isFinite(r.realGDP));
  }
});

test('explicit sector maps reproduce legacy global and grouped shock definitions', () => {
  const legacy = solveScenario(realUae, { productivity: 5, productivitySector: 'manufacturing', freightCost: 10, oilDemand: -20 });
  const sectorShocks = Object.fromEntries(realUae.sectors.map(s => {
    const code = Number(s.id.slice(1));
    return [s.id, { productivity: code >= 3 && code <= 16 ? 5 : 0, importPrice: 10, exportDemand: s.id === 'c2' ? -20 : 0 }];
  }));
  const explicit = solveScenario(realUae, { sectorShocks });
  for (const key of ['realGDP', 'householdRealIncome', 'exports', 'imports', 'wage'] as const) near(explicit[key], legacy[key], 1e-9);
  assert.deepEqual(explicit.appliedSectorShocks, legacy.appliedSectorShocks);
});

test('sector overrides replace only provided dimensions, zero cancels and unsetting restores inheritance', () => {
  const inherited = { productivity: 5, productivitySector: 'all', freightCost: 10, oilDemand: -20 };
  const override = solveScenario(syntheticBalancedFixture, { ...inherited, sectorShocks: {
    c1: { productivity: 0, importPrice: -5 }, c2: { exportDemand: 0 },
  } });
  assert.deepEqual(override.appliedSectorShocks.c1, { productivity: 0, importPrice: -5, exportDemand: 0 });
  assert.deepEqual(override.appliedSectorShocks.c2, { productivity: 5, importPrice: 10, exportDemand: 0 });
  const unset = solveScenario(syntheticBalancedFixture, { ...inherited, sectorShocks: { c1: { productivity: undefined } } });
  const legacy = solveScenario(syntheticBalancedFixture, inherited);
  near(unset.realGDP, legacy.realGDP, 1e-10);
  assert.deepEqual(unset.appliedSectorShocks, legacy.appliedSectorShocks);
});

test('different sector import prices preserve collected tariffs and external accounting', () => {
  const d = structuredClone(syntheticBalancedFixture);
  d.sectors[0].tariffRate = 0.1;
  d.sectors[1].tariffRate = 0.2;
  const r = solveScenario(d, { tariffCut: 25, sectorShocks: { c1: { importPrice: 50 }, c2: { importPrice: -20 } } });
  const baselineTariffs = 40 * 0.1 / 1.1 + 40 * 0.2 / 1.2;
  const calculatedTariffs = 40 * (1 + r.sectors[0].imports / 100) * 1.5 * 0.075 / 1.1
    + 40 * (1 + r.sectors[1].imports / 100) * 0.8 * 0.15 / 1.2;
  near(r.tariffRevenueChange, calculatedTariffs - baselineTariffs, 1e-7);
  assert.ok(r.diagnostics.accountingResidual < 1e-7);
});

test('simultaneous opposing sector shocks solve as one nonlinear equilibrium in both closures', () => {
  const sectorShocks = {
    c2: { productivity: -10, importPrice: 50, exportDemand: -40 },
    c8: { productivity: 20, importPrice: -20, exportDemand: 40 },
    c17: { productivity: 5, importPrice: 15 },
    c25: { productivity: 8, importPrice: 30, exportDemand: 25 },
  };
  for (const laborClosure of ['fixed', 'elastic'] as const) {
    const r = solveScenario(realUae, { sectorShocks, laborClosure });
    assert.ok(r.diagnostics.maxResidual < 1e-8);
    assert.ok(r.diagnostics.accountingResidual < 1e-7);
    if (laborClosure === 'fixed') near(r.employment, 0);
    else near(r.realWage, 0);
    for (const s of r.sectors) for (const v of Object.values(s)) if (typeof v === 'number') assert.ok(Number.isFinite(v));
  }
  const together = solveScenario(realUae, { sectorShocks });
  const separateSum = Object.entries(sectorShocks).reduce((total, [id, shock]) => total + solveScenario(realUae, { sectorShocks: { [id]: shock } }).realGDP, 0);
  assert.ok(Math.abs(together.realGDP - separateSum) > 1e-5, 'The joint run should include interactions, not sum standalone outputs.');
});

test('intermediate price diagnostic follows supplying rows, while zero-input sectors stay not applicable', () => {
  const scenario = { sectorShocks: { c1: { importPrice: 20 }, c2: { importPrice: -10 } } };
  const r = solveScenario(syntheticBalancedFixture, scenario, { armingtonElasticity: 0 });
  for (let j = 0; j < 2; j++) {
    let spending = 0, baseline = 0;
    for (let i = 0; i < 2; i++) {
      const d = syntheticBalancedFixture.domesticIO[i][j], m = syntheticBalancedFixture.importedIO[i][j];
      spending += d * (1 + r.sectors[i].price / 100) + m * (i === 0 ? 1.2 : 0.9);
      baseline += d + m;
    }
    near(r.sectors[j].intermediateInputPrice!, (spending / baseline - 1) * 100);
  }
  const noExports = solveScenario(realUae, { sectorShocks: { c35: { exportDemand: 40 } } });
  near(noExports.realGDP, 0);
  assert.equal(noExports.sectors.find(s => s.id === 'c35')!.intermediateInputPrice, null);
  assert.ok(noExports.warnings.some(w => w.includes('zero baseline exports')));
});

test('malformed, unknown and out-of-range sector shocks are rejected', () => {
  assert.throws(() => solveScenario(realUae, { sectorShocks: { missing: { productivity: 5 } } }), /Unknown shock sector/);
  assert.throws(() => solveScenario(realUae, { sectorShocks: { c2: { productivity: NaN } } }), /must be finite/);
  assert.throws(() => solveScenario(realUae, { sectorShocks: { c2: { importPrice: -100 } } }), /outside the supported/);
  assert.throws(() => solveScenario(realUae, { sectorShocks: { c2: { exportDemand: Infinity } } }), /must be finite/);
  // Runtime checks protect saved/imported scenario JSON as well as typed callers.
  assert.throws(() => solveScenario(realUae, JSON.parse('{"sectorShocks":{"c2":null}}')), /Invalid shock definition/);
  assert.throws(() => solveScenario(realUae, JSON.parse('{"sectorShocks":{"c2":{"unrecognized":10}}}')), /Unknown shock dimension/);
});
