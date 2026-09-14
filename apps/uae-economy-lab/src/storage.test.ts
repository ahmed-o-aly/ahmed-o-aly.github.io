import { afterEach, describe, expect, it, vi } from 'vitest';
import { DEFAULT_SCENARIO } from './viewTypes';
import { loadSaved, readShared, validScenario, loadActive, persistActive } from './storage';
afterEach(() => vi.unstubAllGlobals());
describe('saved and shared scenario integrity', () => {
  it('rejects corrupt storage without breaking the app', () => {
    vi.stubGlobal('localStorage', { getItem: () => '{invalid' });
    expect(loadSaved()).toEqual([]);
  });
  it('rejects invalid shocks and missing assumptions', () => {
    expect(validScenario(DEFAULT_SCENARIO)).toBe(true);
    expect(validScenario({ ...DEFAULT_SCENARIO, productivity: Infinity })).toBe(false);
    expect(validScenario({ ...DEFAULT_SCENARIO, laborShare: undefined })).toBe(false);
  });
  it('does not replay a shared scenario against another dataset', () => {
    vi.stubGlobal('location', { hash: '#' + encodeURIComponent(JSON.stringify({ datasetId: 'original', scenario: DEFAULT_SCENARIO })) });
    expect(readShared('original')).toEqual(DEFAULT_SCENARIO);
    expect(readShared('different')).toBeNull();
  });
});

describe('multiple-sector persistence', () => {
  it('accepts explicit zero and separate sector shocks, rejecting unsafe numeric input', () => {
    expect(validScenario({ ...DEFAULT_SCENARIO, sectorShocks: { c3: { productivity: 0 }, c8: { importPrice: -10, exportDemand: 20 } } })).toBe(true);
    expect(validScenario({ ...DEFAULT_SCENARIO, sectorShocks: { c8: { importPrice: Infinity } } })).toBe(false);
    expect(validScenario({ ...DEFAULT_SCENARIO, sectorShocks: { c8: { exportDemand: 400 } } })).toBe(false);
    expect(validScenario({ ...DEFAULT_SCENARIO, sectorShocks: { c8: { unexpected: 1 } } })).toBe(false);
  });
});


it('restores active edits only for their original dataset', () => {
  const values = new Map<string, string>();
  vi.stubGlobal('localStorage', { getItem: (key: string) => values.get(key) || null, setItem: (key: string, value: string) => values.set(key, value) });
  const scenario = { ...DEFAULT_SCENARIO, sectorShocks: { c9: { productivity: 12 }, c25: { exportDemand: 8 } } };
  persistActive('source-a', scenario);
  expect(loadActive('source-a')).toEqual(scenario);
  expect(loadActive('source-b')).toBeNull();
});
