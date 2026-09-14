import type { EconomyData } from './model/engine';
import type { Dataset, Result, SectorResult } from './viewTypes';

/** Money amounts use the dataset's units. Scenario levels are volumes valued at
 * baseline prices, not scenario revenue, import spending, profits, or wages. */
export type LevelComparison = {
  baseline: number;
  scenario: number;
  change: number;
  /** Null when there is no baseline denominator. */
  percentChange: number | null;
};

export type InputSupplier = {
  id: string; name: string; domestic: number; imported: number; total: number;
  /** Percentage of all domestic AND imported intermediate purchases. */
  share: number;
};

export type IndustryBuyer = {
  id: string; name: string; value: number;
  /** Percentage of this product's domestic intermediate sales. */
  share: number;
  /** Percentage of this product's gross domestic output. */
  outputShare: number;
};

export type FinalDemandRow = {
  id: 'household' | 'government' | 'investment' | 'inventories' | 'exports';
  name: string;
  /** Sales of the UAE-produced product. */
  domestic: number;
  /** Imported goods of the same product category, not sales by UAE producers. */
  imported: number;
  total: number;
  /** Domestic column / gross domestic output, including signed inventories. */
  outputShare: number;
};

export type TradePartnerRow = {
  id: string; name: string; value: number;
  /** Percentage of this sector's total national imports or exports. */
  share: number;
};

export type SectorProfile = {
  sector: SectorResult;
  levels: Record<'output' | 'valueAdded' | 'exports' | 'imports' | 'domesticSales' | 'intermediatePurchases', LevelComparison>;
  /** Baseline transactions only, sorted largest first and excluding zero flows. */
  inputs: InputSupplier[];
  buyers: IndustryBuyer[];
  /** All categories retained, including zero values and signed inventories. */
  finalDemand: FinalDemandRow[];
  totals: {
    domesticInputs: number; importedInputs: number; intermediateInputs: number;
    domesticIntermediateSales: number; domesticFinalSales: number; domesticSales: number;
    imports: number; exports: number; output: number; valueAdded: number;
  };
  /** Observed baseline trade; the national model does not simulate bilateral flows. */
  partners: { imports: TradePartnerRow[]; exports: TradePartnerRow[] };
};

const sum = (values: number[]) => values.reduce((a, b) => a + b, 0);
const share = (value: number, total: number) => total > 0 ? value / total * 100 : 0;
const level = (baseline: number, scenario: number): LevelComparison => ({
  baseline, scenario, change: scenario - baseline,
  percentChange: baseline !== 0 ? (scenario / baseline - 1) * 100 : null,
});
const changedLevel = (baseline: number, percentChange: number) => level(baseline, baseline * (1 + percentChange / 100));

/**
 * Builds a single sector's accounts from an already validated Dataset and its
 * matching Result. IO rows supply products; columns purchase inputs. IDs are
 * opaque strings, and result lookup does not depend on array order.
 *
 * Exact aggregate scenario domestic sales and intermediate purchases follow
 * from output minus exports and output minus double-deflated value added.
 * Individual scenario transactions cannot be recovered from this Result API:
 * it does not retain the CES elasticity, fiscal state, or tariff policy.
 */
export function getSectorProfile(dataset: Dataset, result: Result, sectorId: string): SectorProfile | null {
  const raw = dataset.raw as EconomyData;
  const index = raw.sectors.findIndex(s => s.id === sectorId);
  const sector = result.sectors.find(s => s.id === sectorId);
  if (index < 0 || !sector) return null;
  const account = raw.sectors[index];
  const names = new Map(dataset.sectors.map(s => [s.id, s.name]));
  const domesticInputs = sum(raw.domesticIO.map(row => row[index]));
  const importedInputs = sum(raw.importedIO.map(row => row[index]));
  const intermediateInputs = domesticInputs + importedInputs;
  const domesticIntermediateSales = sum(raw.domesticIO[index]);

  const inputs: InputSupplier[] = raw.sectors.map((s, i) => {
    const domestic = raw.domesticIO[i][index], imported = raw.importedIO[i][index];
    return { id: s.id, name: names.get(s.id) ?? s.name, domestic, imported, total: domestic + imported, share: share(domestic + imported, intermediateInputs) };
  }).filter(row => row.total > 0).sort((a, b) => b.total - a.total);

  const buyers: IndustryBuyer[] = raw.sectors.map((s, j) => ({
    id: s.id, name: names.get(s.id) ?? s.name, value: raw.domesticIO[index][j],
    share: share(raw.domesticIO[index][j], domesticIntermediateSales),
    outputShare: share(raw.domesticIO[index][j], account.output),
  })).filter(row => row.value > 0).sort((a, b) => b.value - a.value);

  const finalRow = (id: FinalDemandRow['id'], name: string, domestic: number, imported: number): FinalDemandRow => ({
    id, name, domestic, imported, total: domestic + imported, outputShare: share(domestic, account.output),
  });
  const finalDemand: FinalDemandRow[] = [
    finalRow('household', 'Households', account.domesticHousehold, account.importedHousehold),
    finalRow('government', 'Government', account.domesticGovernment, account.importedGovernment),
    finalRow('investment', 'Fixed investment', account.domesticInvestment, account.importedInvestment),
    finalRow('inventories', 'Inventory change', account.domesticInventories, account.importedInventories),
    finalRow('exports', 'Exports', account.exports, 0),
  ];
  const domesticFinalSales = sum(finalDemand.filter(row => row.id !== 'exports').map(row => row.domestic));
  const domesticSales = domesticIntermediateSales + domesticFinalSales;
  const imports = sum(raw.importedIO[index]) + sum(finalDemand.map(row => row.imported));
  const output = changedLevel(account.output, sector.outputChange);
  const valueAdded = changedLevel(account.valueAdded, sector.valueAddedChange);
  const exports = changedLevel(account.exports, sector.exportChange);

  const tradePartners = (direction: 'imports' | 'exports', total: number): TradePartnerRow[] => dataset.partners.map(p => ({
    id: p.id, name: p.name, value: p[direction === 'imports' ? 'importsBySector' : 'exportsBySector'][index],
    share: share(p[direction === 'imports' ? 'importsBySector' : 'exportsBySector'][index], total),
  })).filter(row => row.value > 0).sort((a, b) => b.value - a.value);

  return {
    sector,
    levels: {
      output, valueAdded, exports, imports: changedLevel(imports, sector.importChange),
      domesticSales: level(domesticSales, output.scenario - exports.scenario),
      intermediatePurchases: level(intermediateInputs, output.scenario - valueAdded.scenario),
    },
    inputs, buyers, finalDemand,
    totals: { domesticInputs, importedInputs, intermediateInputs, domesticIntermediateSales, domesticFinalSales, domesticSales, imports, exports: account.exports, output: account.output, valueAdded: account.valueAdded },
    partners: { imports: tradePartners('imports', imports), exports: tradePartners('exports', account.exports) },
  };
}
