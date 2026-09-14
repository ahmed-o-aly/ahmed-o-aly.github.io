import { PRESETS } from './viewTypes';
import type { Scenario, Sector, SectorShock } from './viewTypes';

export function inheritedShock(scenario: Scenario, sector: Sector): Required<SectorShock> {
  return {
    productivity: scenario.productivitySector === 'all' || scenario.productivitySector === sector.id || (scenario.productivitySector === 'manufacturing' && sector.group === 'manufacturing') ? scenario.productivity : 0,
    importPrice: scenario.freightCost,
    exportDemand: sector.id === 'c2' ? scenario.oilDemand : 0,
  };
}
export function effectiveShock(scenario: Scenario, sector: Sector): Required<SectorShock> {
  return { ...inheritedShock(scenario, sector), ...scenario.sectorShocks?.[sector.id] };
}
export function presetActive(scenario: Scenario, id: string) {
  const preset = PRESETS.find(p => p.id === id);
  return !!preset && Object.entries(preset.values).every(([key, value]) => scenario[key as keyof Scenario] === value);
}
export function togglePreset(scenario: Scenario, id: string): Scenario {
  const preset = PRESETS.find(p => p.id === id);
  if (!preset) return scenario;
  const active = presetActive(scenario, id);
  const values = Object.fromEntries(Object.entries(preset.values).map(([key, value]) => [key, active ? (typeof value === 'number' ? 0 : scenario[key as keyof Scenario]) : value]));
  const next = { ...scenario, ...values };
  const activePresets = PRESETS.filter(p => presetActive(next, p.id));
  return { ...next, name: activePresets.length > 1 ? 'Combined scenario' : activePresets.length === 1 ? activePresets[0].name : 'Custom scenario' };
}
export function setSectorShock(scenario: Scenario, id: string, key: keyof SectorShock, value: number | undefined): Scenario {
  const sectorShocks = { ...scenario.sectorShocks };
  const shock = { ...sectorShocks[id] };
  if (value === undefined) delete shock[key]; else shock[key] = value;
  if (Object.keys(shock).length) sectorShocks[id] = shock; else delete sectorShocks[id];
  return { ...scenario, sectorShocks };
}
export function resetShocks(scenario: Scenario): Scenario {
  return { ...scenario, tariffCut: 0, productivity: 0, oilDemand: 0, freightCost: 0, sectorShocks: {}, name: 'Baseline' };
}
