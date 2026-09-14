export type SectorShock = { productivity?: number; importPrice?: number; exportDemand?: number };
export type Scenario = {
  name: string;
  tariffCut: number;
  productivity: number;
  productivitySector: string;
  oilDemand: number;
  freightCost: number;
  laborClosure: 'fixed' | 'elastic';
  laborShare: number; substitution: number; exportElasticity: number;
  sectorShocks?: Record<string, SectorShock>;
};

export type Sector = {
  id: string; name: string; group: string;
  output: number; valueAdded: number; imports: number; exports: number;
};
export type Dataset = {
  id: string; title: string; year: number; source: string; sourceUrl: string;
  currency: string; units: string; sectors: Sector[]; limitations: string[];
  domesticIO: number[][]; raw: unknown;
  tariffsAvailable: boolean;
  partners: { id: string; name: string; importsBySector: number[]; exportsBySector: number[] }[];
};
export type SectorResult = Sector & {
  outputChange: number; priceChange: number; exportChange: number;
  importChange: number; employmentChange: number; valueAddedChange: number; intermediateInputPrice: number | null;
};
export type Result = {
  realGDP: number; realIncome: number; exports: number; imports: number;
  wage: number; employment: number; sectors: SectorResult[];
  appliedSectorShocks: Record<string, Required<SectorShock>>; warnings: string[];
  diagnostics: { residual: number; iterations: number; converged: boolean };
};
export type SavedScenario = {
  id: string; scenario: Scenario; datasetId: string; savedAt: string;
};

export const DEFAULT_SCENARIO: Scenario = {
  name: 'Industrial growth', tariffCut: 0, productivity: 5,
  productivitySector: 'manufacturing', oilDemand: 0, freightCost: 0, laborClosure: 'fixed',
  laborShare: 60, substitution: 2, exportElasticity: 4,
};
export const PRESETS: { id: string; name: string; caption: string; values: Partial<Scenario> }[] = [
  { id: 'trade', name: 'Lower import costs', caption: 'Cheaper imported inputs', values: { freightCost: -5 } },
  { id: 'oil', name: 'Energy demand shock', caption: 'Weaker mining export demand', values: { oilDemand: -15 } },
  { id: 'industry', name: 'Industrial growth', caption: 'Higher productivity', values: { productivity: 5, productivitySector: 'manufacturing' } },
];
export function baselineScenario(): Scenario {
  return { ...DEFAULT_SCENARIO, name: 'Baseline', tariffCut: 0, productivity: 0, oilDemand: 0, freightCost: 0, sectorShocks: {} };
}
export const percent = (value: number, digits = 2) => `${Math.abs(value) < 0.005 ? '' : value > 0 ? '+' : '−'}${Math.abs(value).toFixed(digits)}%`;
export const money = (value: number, digits = 1) => `${(value / 1000).toLocaleString('en-US', { maximumFractionDigits: digits, minimumFractionDigits: digits })}bn`;
