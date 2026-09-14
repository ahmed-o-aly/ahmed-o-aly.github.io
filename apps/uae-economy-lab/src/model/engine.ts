/**
 * Calibrated small-open-economy CGE, NOT the standard GTAP model.
 * Values are source-year currency flows; all initial prices/quantities are indexed to 1.
 * Production: fixed intermediate bundles, user-specific domestic/import CES nests,
 * Cobb-Douglas labor/sector-specific capital value added. Sector capital is fixed.
 * Final demand: household Cobb-Douglas over CES goods; government and investment
 * real composite volumes and signed inventory quantities are fixed.
 * Government balances through lump-sum household taxes net of import tariffs.
 * Household propensity to consume disposable income is calibrated to the baseline.
 * The world-price numeraire is fixed and foreign financing adjusts to investment
 * less saving. Export demand is downward sloping. No partner-specific policy model.
 */

export interface SectorAccount {
  id: string;
  name: string;
  output: number;
  valueAdded: number;
  exports: number;
  domesticHousehold: number;
  importedHousehold: number;
  domesticGovernment: number;
  importedGovernment: number;
  domesticInvestment: number;
  importedInvestment: number;
  domesticInventories: number;
  importedInventories: number;
  /** Optional observed effective rate, in fraction units. Absent means unknown. */
  tariffRate?: number;
}

export interface EconomyData {
  sectors: SectorAccount[];
  /** Rows supply inputs; columns are the industries using them. */
  domesticIO: number[][];
  importedIO: number[][];
}

export interface SectorShock {
  /** Percent change in this sector's productivity. */
  productivity?: number;
  /** Percent change in the price of this sector's imported commodity. */
  importPrice?: number;
  /** Percent change in this sector's export-demand intercept. */
  exportDemand?: number;
}

export type AppliedSectorShock = Required<SectorShock>;

export interface Scenario {
  id?: string;
  name?: string;
  productivity?: number;
  /** Sector ID, "manufacturing" (ADB c3–c16), or "all". */
  productivitySector?: string;
  /** Uniform delivered-import price change, NOT specifically a freight cost. */
  freightCost?: number;
  /** Export-demand intercept change for mining (default c2), NOT an oil-price shock. */
  oilDemand?: number;
  miningSector?: string;
  /** Percent reduction in observed baseline tariffs; unsupported when rates absent. */
  tariffCut?: number;
  partner?: string;
  laborClosure?: 'fixed' | 'elastic';
  /**
   * Exact sector IDs. A supplied dimension overrides that sector's inherited
   * legacy/global shock; omitted dimensions inherit, and explicit zero cancels.
   * These simultaneous shocks are resolved before solving one equilibrium.
   */
  sectorShocks?: Record<string, SectorShock>;
}

export interface ModelAssumptions {
  /** Assumed labor cost share in value added, not estimated from IO accounts. */
  laborShare: number;
  /** Domestic-versus-import substitution elasticity for every user. */
  armingtonElasticity: number;
  /** Export-demand price elasticity. */
  exportElasticity: number;
}

export const DEFAULT_ASSUMPTIONS: Readonly<ModelAssumptions> = Object.freeze({
  laborShare: 0.6,
  armingtonElasticity: 2,
  exportElasticity: 4,
});

export interface SectorResult {
  id: string;
  name: string;
  output: number;
  price: number;
  valueAdded: number;
  employment: number;
  exports: number;
  imports: number;
  outputLevel: number;
  valueAddedLevel: number;
  /** Benchmark-weighted intermediate-composite price change, before productivity.
   * Null for a sector that buys no intermediate inputs. Not causal attribution. */
  intermediateInputPrice: number | null;
}

export interface ModelResult {
  /** Percent changes, unless explicitly named Level or Residual. */
  realGDP: number;
  householdRealIncome: number;
  exports: number;
  imports: number;
  wage: number;
  realWage: number;
  employment: number;
  consumerPrice: number;
  tariffRevenueChange: number;
  realGDPLevel: number;
  householdConsumptionLevel: number;
  foreignFinancingLevel: number;
  foreignFinancingChange: number;
  governmentSpendingLevel: number;
  netGovernmentTaxLevel: number;
  sectors: SectorResult[];
  diagnostics: {
    converged: true;
    iterations: number;
    maxResidual: number;
    goodsMarketResidual: number;
    zeroProfitResidual: number;
    laborResidual: number;
    accountingResidual: number;
    baselineAccountResidual: number;
  };
  assumptions: ModelAssumptions;
  /** All sectors' effective percentage shocks after legacy inheritance/overrides. */
  appliedSectorShocks: Record<string, AppliedSectorShock>;
  warnings: string[];
}

export class ModelError extends Error {
  constructor(message: string) { super(message); this.name = 'ModelError'; }
}

const sum = (v: number[]) => v.reduce((a, b) => a + b, 0);
const maxAbs = (v: number[]) => Math.max(0, ...v.map(Math.abs));
const percent = (ratio: number) => (ratio - 1) * 100;

/** Rejects incoherent/missing data instead of silently manufacturing balances. */
export function validateEconomy(data: EconomyData): { maxResidual: number } {
  const n = data.sectors.length;
  if (n < 1 || n > 100) throw new ModelError('The economy must contain 1–100 sectors.');
  if (new Set(data.sectors.map(s => s.id)).size !== n) throw new ModelError('Sector IDs must be unique.');
  for (const matrix of [data.domesticIO, data.importedIO]) {
    if (matrix.length !== n || matrix.some(row => row.length !== n)) throw new ModelError('Input-output matrices must match sector dimensions.');
    if (matrix.some(row => row.some(v => !Number.isFinite(v) || v < 0))) throw new ModelError('Intermediate transactions must be finite and nonnegative.');
  }
  let residual = 0;
  data.sectors.forEach((s, i) => {
    const nonnegative = [s.output, s.valueAdded, s.exports, s.domesticHousehold, s.importedHousehold,
      s.domesticGovernment, s.importedGovernment, s.domesticInvestment, s.importedInvestment];
    if (nonnegative.some(v => !Number.isFinite(v) || v < 0) || s.output <= 0 || s.valueAdded <= 0)
      throw new ModelError(`Missing or nonpositive production account: ${s.id}.`);
    if (![s.domesticInventories, s.importedInventories].every(Number.isFinite)) throw new ModelError(`Inventory account missing: ${s.id}.`);
    if (s.tariffRate !== undefined && (!Number.isFinite(s.tariffRate) || s.tariffRate < 0 || s.tariffRate > 2)) throw new ModelError(`Invalid tariff rate: ${s.id}.`);
    const sales = sum(data.domesticIO[i]) + s.domesticHousehold + s.domesticGovernment + s.domesticInvestment + s.domesticInventories + s.exports;
    const cost = s.valueAdded + sum(data.sectors.map((_, j) => data.domesticIO[j][i] + data.importedIO[j][i]));
    residual = Math.max(residual, Math.abs(sales - s.output) / s.output, Math.abs(cost - s.output) / s.output);
  });
  if (residual > 1e-5) throw new ModelError(`Accounts do not balance: maximum sector discrepancy ${(residual * 100).toFixed(5)}%.`);
  if (sum(data.sectors.map(s => s.domesticHousehold + s.importedHousehold)) <= 0) throw new ModelError('Household consumption is missing.');
  return { maxResidual: residual };
}

function linearSolve(matrix: number[][], rhs: number[]): number[] {
  const a = matrix.map((r, i) => [...r, rhs[i]]);
  const n = rhs.length;
  for (let k = 0; k < n; k++) {
    let pivot = k;
    for (let i = k + 1; i < n; i++) if (Math.abs(a[i][k]) > Math.abs(a[pivot][k])) pivot = i;
    if (Math.abs(a[pivot][k]) < 1e-12) throw new ModelError('The equilibrium Jacobian is singular for these assumptions.');
    [a[k], a[pivot]] = [a[pivot], a[k]];
    for (let i = k + 1; i < n; i++) {
      const f = a[i][k] / a[k][k];
      for (let j = k + 1; j <= n; j++) a[i][j] -= f * a[k][j];
      a[i][k] = 0;
    }
  }
  const x = Array(n).fill(0);
  for (let i = n - 1; i >= 0; i--) {
    x[i] = (a[i][n] - sum(a[i].slice(i + 1, n).map((v, j) => v * x[i + j + 1]))) / a[i][i];
  }
  return x;
}

export function solveScenario(
  data: EconomyData,
  scenario: Scenario = {},
  assumptionOverrides: Partial<ModelAssumptions> = {},
  options: { maxIterations?: number; tolerance?: number } = {},
): ModelResult {
  const baselineCheck = validateEconomy(data);
  const assumptions = { ...DEFAULT_ASSUMPTIONS, ...assumptionOverrides };
  const { laborShare: alpha, armingtonElasticity: sigma, exportElasticity: eta } = assumptions;
  if (!(alpha > 0.05 && alpha < 0.95 && sigma >= 0 && sigma <= 10 && eta > 0 && eta <= 20)) throw new ModelError('Invalid behavioral assumptions.');
  const n = data.sectors.length;
  const ss = data.sectors;
  const productivity = scenario.productivity ?? 0;
  const importShock = scenario.freightCost ?? 0;
  const miningShock = scenario.oilDemand ?? 0;
  const tariffCut = scenario.tariffCut ?? 0;
  if (![productivity, importShock, miningShock, tariffCut].every(Number.isFinite)) throw new ModelError('Scenario inputs must be finite.');
  if (productivity <= -90 || productivity > 200 || importShock <= -90 || importShock > 200 || miningShock <= -99 || miningShock > 200 || tariffCut < 0 || tariffCut > 100)
    throw new ModelError('Shock is outside the supported scenario range.');
  if (tariffCut !== 0 && ss.some(s => s.tariffRate === undefined)) throw new ModelError('Tariff simulations require observed baseline tariff rates; these input-output accounts do not supply them.');
  if (tariffCut !== 0 && scenario.partner && !['all', 'world'].includes(scenario.partner)) throw new ModelError('This national model has no bilateral tariff accounts.');
  const target = scenario.productivitySector ?? 'all';
  if (productivity !== 0 && !['all', 'manufacturing'].includes(target) && !ss.some(s => s.id === target)) throw new ModelError(`Unknown productivity sector: ${target}.`);
  const miningTarget = scenario.miningSector ?? 'c2';
  if (miningShock !== 0 && !ss.some(s => s.id === miningTarget)) throw new ModelError(`Unknown mining sector: ${miningTarget}.`);
  const closure = scenario.laborClosure ?? 'fixed';
  if (!['fixed', 'elastic'].includes(closure)) throw new ModelError('Unknown labor closure.');
  const sectorIds = new Set(ss.map(s => s.id));
  if (scenario.sectorShocks !== undefined && (scenario.sectorShocks === null || typeof scenario.sectorShocks !== 'object' || Array.isArray(scenario.sectorShocks)))
    throw new ModelError('Sector shocks must be keyed by exact sector IDs.');
  for (const [id, shock] of Object.entries(scenario.sectorShocks ?? {})) {
    if (!sectorIds.has(id)) throw new ModelError(`Unknown shock sector: ${id}.`);
    if (shock === null || typeof shock !== 'object' || Array.isArray(shock)) throw new ModelError(`Invalid shock definition: ${id}.`);
    for (const [dimension, value] of Object.entries(shock)) {
      if (!['productivity', 'importPrice', 'exportDemand'].includes(dimension)) throw new ModelError(`Unknown shock dimension ${dimension} for ${id}.`);
      if (value === undefined) continue;
      if (!Number.isFinite(value)) throw new ModelError(`Sector shock ${id}.${dimension} must be finite.`);
      const lowerBound = dimension === 'exportDemand' ? -99 : -90;
      if (value <= lowerBound || value > 200) throw new ModelError(`Sector shock ${id}.${dimension} is outside the supported scenario range.`);
    }
  }
  const appliedSectorShocks: Record<string, AppliedSectorShock> = {};
  ss.forEach(s => {
    const code = /^c(\d+)$/.exec(s.id);
    const manufacturing = code !== null && Number(code[1]) >= 3 && Number(code[1]) <= 16;
    const overrides = scenario.sectorShocks?.[s.id];
    appliedSectorShocks[s.id] = {
      productivity: overrides?.productivity ?? ((target === 'all' || target === s.id || (target === 'manufacturing' && manufacturing)) ? productivity : 0),
      importPrice: overrides?.importPrice ?? importShock,
      exportDemand: overrides?.exportDemand ?? (s.id === miningTarget ? miningShock : 0),
    };
  });
  const A = ss.map(s => 1 + appliedSectorShocks[s.id].productivity / 100);
  const exportShift = ss.map(s => 1 + appliedSectorShocks[s.id].exportDemand / 100);
  const t0 = ss.map(s => s.tariffRate ?? 0);
  const t1 = t0.map(t => t * (1 - tariffCut / 100));
  const border = ss.map(s => 1 + appliedSectorShocks[s.id].importPrice / 100);
  const pm = t0.map((t, i) => border[i] * (1 + t1[i]) / (1 + t));
  const tariffPerUnit = t0.map((t, i) => border[i] * t1[i] / (1 + t));
  const intermediateBase = ss.map((_, j) => sum(ss.map((_, i) => data.domesticIO[i][j] + data.importedIO[i][j])));
  const imports0 = ss.map((s, i) => sum(data.importedIO[i]) + s.importedHousehold + s.importedGovernment + s.importedInvestment + s.importedInventories);
  const VA0 = sum(ss.map(s => s.valueAdded));
  const L0 = alpha * VA0;
  const C0 = sum(ss.map(s => s.domesticHousehold + s.importedHousehold));
  const G0 = sum(ss.map(s => s.domesticGovernment + s.importedGovernment));
  const I0 = sum(ss.map(s => s.domesticInvestment + s.importedInvestment + s.domesticInventories + s.importedInventories));
  const T0 = sum(imports0.map((m, i) => m * t0[i] / (1 + t0[i])));
  if (VA0 - G0 + T0 <= 0) throw new ModelError('The baseline leaves no positive household disposable income after government spending.');
  const propensity = C0 / (VA0 - G0 + T0);
  const finance0 = I0 - (VA0 - G0 + T0 - C0);

  function evaluate(z: number[]) {
    const p = z.slice(0, n).map(Math.exp);
    const y = z.slice(n, 2 * n).map(Math.exp);
    const w = Math.exp(z[2 * n]);
    const demand = Array(n).fill(0);
    const imported = Array(n).fill(0);
    const inputVolumes = Array(n).fill(0);
    const intermediatePriceValue = Array(n).fill(0);
    const costs = Array(n).fill(0);
    const labor = y.map((v, i) => alpha * ss[i].valueAdded * Math.pow(v / A[i], 1 / alpha));
    const rent = y.map((v, i) => w * Math.pow(v / A[i], 1 / alpha));
    const unitVA = y.map((v, i) => w * Math.pow(v / A[i], (1 - alpha) / alpha));
    const factorIncome = sum(labor) * w + sum(ss.map((s, i) => (1 - alpha) * s.valueAdded * rent[i]));

    function bundle(i: number, d: number, m: number) {
      const total = d + m;
      if (total === 0) return { price: 1, d: 0, m: 0 };
      const share = d / total;
      const price = Math.abs(sigma - 1) < 1e-9
        ? Math.exp(share * Math.log(p[i]) + (1 - share) * Math.log(pm[i]))
        : Math.pow(share * Math.pow(p[i], 1 - sigma) + (1 - share) * Math.pow(pm[i], 1 - sigma), 1 / (1 - sigma));
      return { price, d: d * Math.pow(price / p[i], sigma), m: m * Math.pow(price / pm[i], sigma) };
    }

    for (let j = 0; j < n; j++) {
      for (let i = 0; i < n; i++) {
        const d = data.domesticIO[i][j], m = data.importedIO[i][j];
        const b = bundle(i, d, m);
        const scale = y[j] / A[j];
        demand[i] += b.d * scale;
        imported[i] += b.m * scale;
        inputVolumes[j] += (b.d + b.m) * scale;
        intermediatePriceValue[j] += (d + m) * b.price;
        costs[j] += (d + m) / ss[j].output * b.price / A[j];
      }
      costs[j] += ss[j].valueAdded / ss[j].output * unitVA[j] / A[j];
    }

    let G = 0, investment = 0;
    const household = ss.map((s, i) => bundle(i, s.domesticHousehold, s.importedHousehold));
    let logCPI = 0;
    for (let i = 0; i < n; i++) {
      const s = ss[i];
      const g = bundle(i, s.domesticGovernment, s.importedGovernment);
      const inv = bundle(i, s.domesticInvestment, s.importedInvestment);
      G += (s.domesticGovernment + s.importedGovernment) * g.price;
      investment += (s.domesticInvestment + s.importedInvestment) * inv.price + s.domesticInventories * p[i] + s.importedInventories * pm[i];
      demand[i] += g.d + inv.d + s.domesticInventories;
      imported[i] += g.m + inv.m + s.importedInventories;
      logCPI += (s.domesticHousehold + s.importedHousehold) / C0 * Math.log(household[i].price);
    }
    const cpi = Math.exp(logCPI);
    const nonHouseholdTariff = sum(imported.map((m, i) => m * tariffPerUnit[i]));
    const householdTariffShare = sum(household.map((b, i) => b.m * tariffPerUnit[i] / b.price)) / C0;
    const C = propensity * (factorIncome - G + nonHouseholdTariff) / (1 - propensity * householdTariffShare);
    if (!(C > 0) || !Number.isFinite(C)) throw new ModelError('This scenario implies nonpositive household consumption under the selected fiscal closure.');
    for (let i = 0; i < n; i++) {
      const scale = C / C0 / household[i].price;
      demand[i] += household[i].d * scale;
      imported[i] += household[i].m * scale;
    }
    const exports = ss.map((s, i) => s.exports * exportShift[i] * Math.pow(p[i], -eta));
    const taxes = sum(imported.map((m, i) => m * tariffPerUnit[i]));
    const disposable = factorIncome - G + taxes;
    const finance = investment - (disposable - C);
    const tradeBalance = sum(exports.map((x, i) => x * p[i])) - sum(imported.map((m, i) => m * border[i] / (1 + t0[i])));
    const residual = [
      ...p.map((v, i) => Math.log(v / costs[i])),
      ...y.map((v, i) => (ss[i].output * v - demand[i] - exports[i]) / ss[i].output),
      closure === 'fixed' ? (sum(labor) - L0) / L0 : Math.log(w / cpi),
    ];
    return { residual, p, y, w, labor, imported, exports, inputVolumes, intermediatePriceValue, factorIncome, cpi, C, G, investment, taxes, finance, tradeBalance };
  }

  const tolerance = options.tolerance ?? 1e-8;
  const maxIterations = options.maxIterations ?? 60;
  if (!(tolerance > 0 && tolerance <= 1e-4) || !Number.isInteger(maxIterations) || maxIterations < 0 || maxIterations > 200) throw new ModelError('Invalid solver options.');
  let z = Array(2 * n + 1).fill(0);
  let state = evaluate(z);
  let iteration = 0;
  for (; iteration < maxIterations && maxAbs(state.residual) > tolerance; iteration++) {
    const h = 1e-5;
    const columns = z.map((_, j) => {
      const shifted = [...z]; shifted[j] += h;
      const r = evaluate(shifted).residual;
      return r.map((v, i) => (v - state.residual[i]) / h);
    });
    const matrix = state.residual.map((_, i) => columns.map(c => c[i]));
    const delta = linearSolve(matrix, state.residual.map(v => -v));
    let accepted = false;
    const oldNorm = maxAbs(state.residual);
    for (let damping = 1; damping >= 1 / 4096; damping /= 2) {
      const candidate = z.map((v, i) => v + damping * delta[i]);
      if (candidate.some(v => !Number.isFinite(v) || Math.abs(v) > 12)) continue;
      try {
        const next = evaluate(candidate);
        if (maxAbs(next.residual) < oldNorm) { z = candidate; state = next; accepted = true; break; }
      } catch (e) { if (!(e instanceof ModelError)) throw e; }
    }
    if (!accepted) throw new ModelError(`Equilibrium did not converge (residual ${oldNorm.toExponential(2)}). Reduce the shock or review the assumptions.`);
  }
  const residual = maxAbs(state.residual);
  if (!Number.isFinite(residual) || residual > tolerance) throw new ModelError(`Equilibrium did not converge in ${maxIterations} iterations (residual ${residual.toExponential(2)}).`);
  const va = ss.map((s, i) => s.output * state.y[i] - state.inputVolumes[i]);
  const gdp = sum(va);
  const exportTotal = sum(ss.map(s => s.exports));
  const importTotal = sum(imports0);
  const warnings = [
    'A simplified national CGE calibrated to input-output accounts; this is not GTAP and does not reproduce a GTAP simulation.',
    'Labor shares and trade elasticities are explicit behavioral assumptions, not estimates supplied by these accounts.',
    'Sector employment is an index of model labor demand; no observed worker counts or citizen/expatriate split are available.',
    'Government and investment real volumes are fixed; net household taxes balance government and foreign financing adjusts.',
    'Mining includes oil, gas, and other extraction. Its scenario shifts export demand, not the world oil price.',
  ];
  if (ss.some(s => s.tariffRate === undefined)) warnings.push('Observed tariff rates are unavailable: tariff-cut scenarios are disabled. Import costs are simulated as price changes with no assumed tax receipts.');
  if (closure === 'elastic') warnings.push('Elastic labor closure holds the real wage fixed with unconstrained labor supply; it does not estimate unemployment or migration.');
  for (const s of ss) if (s.exports === 0 && appliedSectorShocks[s.id].exportDemand !== 0)
    warnings.push(`Export demand changes for ${s.name} cannot create exports because this sector has zero baseline exports.`);
  return {
    realGDP: percent(gdp / VA0), householdRealIncome: percent(state.C / C0 / state.cpi),
    exports: exportTotal > 0 ? percent(sum(state.exports) / exportTotal) : 0,
    imports: importTotal > 0 ? percent(sum(state.imported) / importTotal) : 0,
    wage: percent(state.w), realWage: percent(state.w / state.cpi), employment: percent(sum(state.labor) / L0),
    consumerPrice: percent(state.cpi), tariffRevenueChange: state.taxes - T0,
    realGDPLevel: gdp, householdConsumptionLevel: state.C / state.cpi,
    foreignFinancingLevel: state.finance, foreignFinancingChange: state.finance - finance0,
    governmentSpendingLevel: state.G, netGovernmentTaxLevel: state.G - state.taxes,
    sectors: ss.map((s, i) => ({ id: s.id, name: s.name, output: percent(state.y[i]), price: percent(state.p[i]),
      valueAdded: percent(va[i] / s.valueAdded), employment: percent(state.labor[i] / (alpha * s.valueAdded)),
      exports: s.exports > 0 ? percent(state.exports[i] / s.exports) : 0,
      imports: imports0[i] > 0 ? percent(state.imported[i] / imports0[i]) : 0,
      outputLevel: s.output * state.y[i], valueAddedLevel: va[i],
      intermediateInputPrice: intermediateBase[i] > 0 ? percent(state.intermediatePriceValue[i] / intermediateBase[i]) : null })),
    diagnostics: { converged: true, iterations: iteration, maxResidual: residual,
      goodsMarketResidual: maxAbs(state.residual.slice(n, 2 * n)),
      zeroProfitResidual: maxAbs(state.residual.slice(0, n)), laborResidual: Math.abs(state.residual[2 * n]),
      accountingResidual: Math.abs(state.finance + state.tradeBalance) / VA0,
      baselineAccountResidual: baselineCheck.maxResidual },
    assumptions, appliedSectorShocks, warnings,
  };
}
