import { describe, it, expect } from 'vitest';
import { baselineScenario } from './viewTypes';
import { presetActive, effectiveShock, setSectorShock, togglePreset, resetShocks } from './scenario';
import { parseDataset } from './adapter';
import source from './data/uae-baseline.json';
const data = parseDataset(source);
describe('combined scenario editing', () => {
  it('combines presets and turning one off preserves the others and assumptions', () => {
    const start = { ...baselineScenario(), laborShare: 45 };
    const combined = togglePreset(togglePreset(start, 'trade'), 'industry');
    expect(combined.freightCost).toBe(-5);
    expect(combined.productivity).toBe(5);
    expect(togglePreset(combined, 'trade').productivity).toBe(5);
    expect(togglePreset(combined, 'trade').freightCost).toBe(0);
    expect(combined.laborShare).toBe(45);
  });
  it('holds separate sector overrides, supports explicit zero and restores inheritance', () => {
    const a = togglePreset(baselineScenario(), 'industry');
    const b = setSectorShock(setSectorShock(a, 'c3', 'productivity', 0), 'c9', 'productivity', 12);
    expect(effectiveShock(b, data.sectors.find(s => s.id === 'c3')!).productivity).toBe(0);
    expect(effectiveShock(b, data.sectors.find(s => s.id === 'c9')!).productivity).toBe(12);
    expect(effectiveShock(setSectorShock(b, 'c3', 'productivity', undefined), data.sectors.find(s => s.id === 'c3')!).productivity).toBe(5);
    expect(resetShocks(b).sectorShocks).toEqual({});
    expect(resetShocks({...b, laborShare: 45}).laborShare).toBe(45);
  });
});


it('industrial preset applies to manufacturing and retains sector overrides', () => {
  const sectorOnly = {...baselineScenario(), productivity: 5, productivitySector: 'c28', sectorShocks: {c9: {productivity: 12}}};
  expect(presetActive(sectorOnly, 'industry')).toBe(false);
  const next = togglePreset(sectorOnly, 'industry');
  expect(next.productivitySector).toBe('manufacturing');
  expect(next.sectorShocks).toEqual(sectorOnly.sectorShocks);
  expect(togglePreset(next, 'industry').productivitySector).toBe('manufacturing');
});
