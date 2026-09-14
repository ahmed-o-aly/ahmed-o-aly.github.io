import { describe, expect, it } from 'vitest';
import source from './data/uae-baseline.json';
import { parseDataset } from './adapter';
import { solveScenario } from './model/engine';
import type { EconomyData, ModelResult } from './model/engine';
import type { Dataset, Result } from './viewTypes';
import { getSectorProfile } from './sectorProfile';

const sum = (values: number[]) => values.reduce((a, b) => a + b, 0);
const dataset = parseDataset(source);
const data = dataset.raw as EconomyData;
const model = solveScenario(data, {
  productivity: 0, productivitySector: 'manufacturing', freightCost: 0,
  oilDemand: -15, tariffCut: 0, laborClosure: 'fixed',
  sectorShocks: { c1: { importPrice: 20 }, c22: { productivity: 10 }, c35: { productivity: 1 } },
}, { laborShare: 0.6, armingtonElasticity: 2, exportElasticity: 4 });

// Match the public UI Result contract explicitly, without a worker or adapter
// simulation shortcut. The profile must work with only these retained fields.
function toResult(d: Dataset, r: ModelResult): Result {
  return {
    realGDP: r.realGDP, realIncome: r.householdRealIncome, exports: r.exports,
    imports: r.imports, wage: r.wage, employment: r.employment,
    appliedSectorShocks: r.appliedSectorShocks, warnings: r.warnings,
    diagnostics: { converged: r.diagnostics.converged, iterations: r.diagnostics.iterations, residual: r.diagnostics.maxResidual },
    sectors: r.sectors.map(s => ({
      ...d.sectors.find(account => account.id === s.id)!,
      outputChange: s.output, priceChange: s.price, exportChange: s.exports,
      importChange: s.imports, employmentChange: s.employment,
      valueAddedChange: s.valueAdded, intermediateInputPrice: s.intermediateInputPrice,
    })),
  };
}
const result = toResult(dataset, model);

describe('sector account profiles', () => {
  it('reconciles every sector’s purchases, domestic sales, imported uses, and observed partner trade', () => {
    for (const account of data.sectors) {
      const p = getSectorProfile(dataset, result, account.id)!;
      expect(sum(p.inputs.map(row => row.total)) + p.totals.valueAdded).toBeCloseTo(account.output, 6);
      expect(p.totals.domesticInputs + p.totals.importedInputs).toBeCloseTo(p.totals.intermediateInputs, 8);
      expect(sum(p.buyers.map(row => row.value)) + sum(p.finalDemand.map(row => row.domestic))).toBeCloseTo(account.output, 6);
      expect(p.totals.domesticSales + p.totals.exports).toBeCloseTo(account.output, 6);
      expect(sum(p.partners.imports.map(row => row.value))).toBeCloseTo(p.totals.imports, 6);
      expect(sum(p.partners.exports.map(row => row.value))).toBeCloseTo(p.totals.exports, 6);
      if (p.totals.intermediateInputs > 0) expect(sum(p.inputs.map(row => row.share))).toBeCloseTo(100, 10);
      if (p.totals.domesticIntermediateSales > 0) expect(sum(p.buyers.map(row => row.share))).toBeCloseTo(100, 10);
      if (p.totals.imports > 0) expect(sum(p.partners.imports.map(row => row.share))).toBeCloseTo(100, 8);
      if (p.totals.exports > 0) expect(sum(p.partners.exports.map(row => row.share))).toBeCloseTo(100, 8);
      for (const rows of [p.buyers, p.partners.imports, p.partners.exports]) {
        expect(rows.map(row => row.value)).toEqual(rows.map(row => row.value).sort((a, b) => b - a));
      }
      expect(p.inputs.map(row => row.total)).toEqual(p.inputs.map(row => row.total).sort((a, b) => b - a));
    }
  });

  it('uses both input origins and distinguishes input shares from buyer and output shares for real food accounts', () => {
    const p = getSectorProfile(dataset, result, 'c3')!;
    const agriculture = p.inputs.find(row => row.id === 'c1')!;
    expect(agriculture.domestic).toBeCloseTo(333.4807817649111, 6);
    expect(agriculture.imported).toBeCloseTo(3040.6268979080437, 6);
    expect(agriculture.share).toBeCloseTo(20.609280912462022, 8);
    expect(p.totals.intermediateInputs).toBeCloseTo(16371.787516529503, 6);
    const hotels = p.buyers.find(row => row.id === 'c22')!;
    expect(hotels.value).toBeCloseTo(2087.990574373748, 6);
    expect(hotels.share).toBeCloseTo(39.46777304954855, 8);
    expect(hotels.outputShare).toBeCloseTo(9.83974008609251, 8);
    expect(p.finalDemand.find(row => row.id === 'exports')!.outputShare).toBeCloseTo(67.59942552423372, 8);
  });

  it('recovers exact model volume levels and reconciles the food contraction with exports and domestic sales', () => {
    const p = getSectorProfile(dataset, result, 'c3')!;
    const food = model.sectors.find(s => s.id === 'c3')!;
    expect(p.levels.output.percentChange).toBeCloseTo(-5.303051182433139, 7);
    expect(p.levels.output.scenario).toBeCloseTo(food.outputLevel, 8);
    expect(p.levels.valueAdded.scenario).toBeCloseTo(food.valueAddedLevel, 8);
    expect(p.levels.intermediatePurchases.scenario + p.levels.valueAdded.scenario).toBeCloseTo(food.outputLevel, 8);
    expect(p.levels.domesticSales.scenario + p.levels.exports.scenario).toBeCloseTo(food.outputLevel, 8);
    expect(p.levels.output.change).toBeCloseTo(-1125.3062364921752, 5);
    expect(p.levels.exports.change).toBeCloseTo(-1131.0636639864913, 5);
    expect(p.levels.domesticSales.change).toBeCloseTo(5.7574274943161, 5);
    expect(p.levels.imports.percentChange).toBeCloseTo(1.0230097289542162, 7);
    // This is a volume at baseline prices, so the 2.075% producer-price increase
    // is deliberately NOT multiplied into output or export levels.
    expect(p.levels.output.scenario).toBeCloseTo(20094.670674533292, 5);
  });

  it('preserves signed domestic and imported inventory changes without folding them into investment', () => {
    const p = getSectorProfile(dataset, result, 'c3')!;
    const account = data.sectors.find(s => s.id === 'c3')!;
    const inventory = p.finalDemand.find(row => row.id === 'inventories')!;
    expect(inventory.domestic).toBeCloseTo(-147.26404630399932, 8);
    expect(inventory.imported).toBe(account.importedInventories);
    expect(inventory.total).toBe(account.domesticInventories + account.importedInventories);
    expect(inventory.outputShare).toBeLessThan(0);
    expect(p.finalDemand.find(row => row.id === 'investment')!.total).toBe(account.domesticInvestment + account.importedInvestment);
    const index = data.sectors.findIndex(s => s.id === 'c3');
    expect(p.totals.imports).toBeCloseTo(sum(data.importedIO[index]) + account.importedHousehold + account.importedGovernment + account.importedInvestment + account.importedInventories, 8);
  });

  it('handles a zero-input and zero-export sector without inventing a denominator or discarding actual imports', () => {
    const p = getSectorProfile(dataset, result, 'c35')!;
    expect(p.inputs).toEqual([]);
    expect(p.totals.intermediateInputs).toBe(0);
    expect(p.levels.intermediatePurchases.scenario).toBeCloseTo(0, 8);
    expect(p.levels.intermediatePurchases.percentChange).toBeNull();
    expect(p.buyers).toEqual([]);
    expect(p.partners.exports).toEqual([]);
    expect(p.levels.imports.baseline).toBeCloseTo(16.59721682736173, 8);
    expect(sum(p.partners.imports.map(row => row.share))).toBeCloseTo(100, 8);
    expect(p.levels.exports).toEqual({ baseline: 0, scenario: 0, change: 0, percentChange: null });
    const numbers = [...Object.values(p.totals), ...Object.values(p.levels).flatMap(row => Object.values(row)), ...p.finalDemand.map(row => row.outputShare)];
    expect(numbers.filter(value => value !== null).every(Number.isFinite)).toBe(true);
  });

  it('looks up opaque sector IDs and unordered results without mutating its inputs', () => {
    const renamed = structuredClone(dataset);
    const renamedRaw = renamed.raw as EconomyData;
    const ids = new Map(renamed.sectors.map((s, i) => [s.id, `sector / ${i}`]));
    renamed.sectors.forEach(s => { s.id = ids.get(s.id)!; });
    renamedRaw.sectors.forEach(s => { s.id = ids.get(s.id)!; });
    const unordered = { ...result, sectors: result.sectors.map(s => ({ ...s, id: ids.get(s.id)! })).reverse() };
    const before = JSON.stringify({ renamed, unordered });
    const p = getSectorProfile(renamed, unordered, 'sector / 2')!;
    expect(p.sector.outputChange).toBeCloseTo(-5.303051182433139, 7);
    expect(p.inputs.find(row => row.id === 'sector / 0')!.imported).toBeCloseTo(3040.6268979080437, 6);
    expect(getSectorProfile(renamed, unordered, 'missing')).toBeNull();
    expect(getSectorProfile(dataset, { ...result, sectors: [] }, 'c3')).toBeNull();
    expect(JSON.stringify({ renamed, unordered })).toBe(before);
  });

  it('keeps observed bilateral rows unchanged across scenarios', () => {
    const baseline = toResult(dataset, solveScenario(data));
    const base = getSectorProfile(dataset, baseline, 'c3')!;
    const changed = getSectorProfile(dataset, result, 'c3')!;
    expect(changed.partners).toEqual(base.partners);
    expect(changed.inputs).toEqual(base.inputs);
    expect(changed.buyers).toEqual(base.buyers);
    expect(changed.finalDemand).toEqual(base.finalDemand);
    expect(changed.levels.exports.scenario).not.toBe(base.levels.exports.scenario);
  });
});
