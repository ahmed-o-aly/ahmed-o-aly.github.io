import type { SavedScenario, Scenario, SectorShock } from './viewTypes';

const KEY = 'uae-economy-lab:scenarios:v1';
export function validScenario(value: unknown): value is Scenario {
  if (!value || typeof value !== 'object') return false;
  const s = value as Scenario;
  const bounds: Record<keyof SectorShock, [number, number]> = { productivity: [-10, 20], importPrice: [-20, 50], exportDemand: [-40, 40] };
  if (s.sectorShocks !== undefined && (!s.sectorShocks || typeof s.sectorShocks !== 'object' || Array.isArray(s.sectorShocks) || Object.keys(s.sectorShocks).length > 100 || Object.entries(s.sectorShocks).some(([id, shock]) => !id || !shock || typeof shock !== 'object' || Array.isArray(shock) || Object.entries(shock).some(([key, value]) => !Object.hasOwn(bounds, key) || typeof value !== 'number' || !Number.isFinite(value) || value < bounds[key as keyof SectorShock][0] || value > bounds[key as keyof SectorShock][1])))) return false;
  return typeof s.name === 'string' && s.name.length <= 80 && typeof s.productivitySector === 'string' &&
    ['fixed', 'elastic'].includes(s.laborClosure) &&
    [['tariffCut', 0, 100], ['productivity', -10, 20], ['oilDemand', -40, 40], ['freightCost', -20, 50], ['laborShare', 10, 90], ['substitution', 0, 8], ['exportElasticity', 0.5, 12]].every(([key, min, max]) =>
      typeof s[key as keyof Scenario] === 'number' && Number.isFinite(s[key as keyof Scenario]) && Number(s[key as keyof Scenario]) >= Number(min) && Number(s[key as keyof Scenario]) <= Number(max));
}
export function loadSaved(): SavedScenario[] {
  try {
    const values: unknown = JSON.parse(localStorage.getItem(KEY) || '[]');
    if (!Array.isArray(values)) return [];
    return values.filter(v => v && typeof v.id === 'string' && typeof v.datasetId === 'string' && typeof v.savedAt === 'string' && validScenario(v.scenario)).slice(0, 12);
  } catch { return []; }
}
export function persistSaved(value: SavedScenario[]): boolean {
  try { localStorage.setItem(KEY, JSON.stringify(value)); return true; } catch { return false; }
}
export function readShared(expectedDatasetId?: string): Scenario | null {
  try {
    const value = JSON.parse(decodeURIComponent(location.hash.slice(1)));
    if (value && typeof value.datasetId === 'string' && validScenario(value.scenario)) {
      return expectedDatasetId && value.datasetId !== expectedDatasetId ? null : value.scenario;
    }
    return validScenario(value) ? value : null;
  } catch { return null; }
}

const ACTIVE_KEY = 'uae-economy-lab:active:v2';
export function loadActive(datasetId: string): Scenario | null {
  try {
    const value = JSON.parse(localStorage.getItem(ACTIVE_KEY) || 'null');
    return value?.datasetId === datasetId && validScenario(value.scenario) ? value.scenario : null;
  } catch { return null; }
}
export function persistActive(datasetId: string, scenario: Scenario): void {
  try { localStorage.setItem(ACTIVE_KEY, JSON.stringify({ datasetId, scenario })); } catch { /* Editing still works when browser storage is unavailable. */ }
}
