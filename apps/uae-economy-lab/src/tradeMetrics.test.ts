import { describe, expect, it } from 'vitest';
import { getTradeProfile } from './tradeMetrics';
import type { Dataset, Result } from './viewTypes';

const sectors = [
  { id: 'a', name: 'A', group: 'other', output: 400, valueAdded: 200, exports: 200, imports: 50 },
  { id: 'b', name: 'B', group: 'other', output: 200, valueAdded: 100, exports: 0, imports: 100 },
];
const dataset = { sectors } as Dataset;
const result = { sectors: [
  { ...sectors[1], exportChange: 50, importChange: -20 },
  { ...sectors[0], exportChange: 10, importChange: 20 },
] } as Result;

describe('trade level aggregation', () => {
  it('weights sector changes by baseline trade and matches results by ID', () => {
    const profile = getTradeProfile(dataset, result);
    expect(profile.exports.baseline).toBe(200);
    expect(profile.exports.scenario).toBeCloseTo(220, 10);
    expect(profile.exports.percentChange).toBeCloseTo(10, 10);
    expect(profile.imports.baseline).toBe(150);
    expect(profile.imports.scenario).toBe(140);
    expect(profile.imports.percentChange).toBeCloseTo(-100 / 15, 10);
    expect(profile.netExports.baseline).toBe(50);
    expect(profile.netExports.scenario).toBeCloseTo(80, 10);
    expect(profile.netExports.change).toBeCloseTo(profile.exports.change - profile.imports.change, 10);
  });

  it('keeps zero exports and signed net exports for a product filter', () => {
    const profile = getTradeProfile(dataset, result, 'b');
    expect(profile.rows.map(row => row.id)).toEqual(['b']);
    expect(profile.exports).toEqual({ baseline: 0, scenario: 0, change: 0, percentChange: null });
    expect(profile.netExports.baseline).toBe(-100);
    expect(profile.netExports.scenario).toBe(-80);
    expect(profile.netExports.change).toBe(20);
    expect(profile.netExports.percentChange).toBeCloseTo(-20, 10);
  });

  it('handles an empty filter without inventing ratios or mutating accounts', () => {
    const before = JSON.stringify({ dataset, result });
    const profile = getTradeProfile(dataset, result, 'missing');
    expect(profile.rows).toEqual([]);
    expect(profile.imports.percentChange).toBeNull();
    expect(profile.netExports.scenario).toBe(0);
    expect(JSON.stringify({ dataset, result })).toBe(before);
  });
});
