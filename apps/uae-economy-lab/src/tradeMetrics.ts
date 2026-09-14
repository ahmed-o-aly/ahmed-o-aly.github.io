import type { Dataset, Result } from './viewTypes';
import type { LevelComparison } from './sectorProfile';

export type { LevelComparison } from './sectorProfile';
export type TradeSectorRow = {
  id: string;
  name: string;
  exports: LevelComparison;
  imports: LevelComparison;
  netExports: LevelComparison;
};

const compare = (baseline: number, scenario: number): LevelComparison => ({
  baseline, scenario, change: scenario - baseline,
  percentChange: baseline === 0 ? null : (scenario / baseline - 1) * 100,
});

/** Trade quantities valued at baseline prices, with results matched by sector ID. */
export function getTradeProfile(dataset: Dataset, result: Result, sectorId = 'all') {
  const results = new Map(result.sectors.map(sector => [sector.id, sector]));
  const rows: TradeSectorRow[] = dataset.sectors.filter(sector => sectorId === 'all' || sector.id === sectorId).map(sector => {
    const outcome = results.get(sector.id);
    const exports = compare(sector.exports, sector.exports * (1 + (outcome?.exportChange ?? 0) / 100));
    const imports = compare(sector.imports, sector.imports * (1 + (outcome?.importChange ?? 0) / 100));
    return { id: sector.id, name: sector.name, exports, imports, netExports: compare(exports.baseline - imports.baseline, exports.scenario - imports.scenario) };
  });
  const total = (key: 'exports' | 'imports' | 'netExports') => compare(
    rows.reduce((value, row) => value + row[key].baseline, 0),
    rows.reduce((value, row) => value + row[key].scenario, 0),
  );
  return { rows, exports: total('exports'), imports: total('imports'), netExports: total('netExports') };
}
