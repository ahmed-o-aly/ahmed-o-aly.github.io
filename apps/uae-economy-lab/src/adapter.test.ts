import { describe, expect, it } from 'vitest';
import source from './data/uae-baseline.json';
import { parseDataset } from './adapter';

describe('source provenance and imported accounts', () => {
  it('loads all actual sectors and partner records', () => {
    const d = parseDataset(source);
    expect(d.sectors).toHaveLength(35);
    expect(d.partners).toHaveLength(74);
    expect(d.tariffsAvailable).toBe(false);
    expect(d.year).toBe(2024);
  });
  it('rejects an unbalanced production account', () => {
    const d = structuredClone(source);
    d.sectors[0].output += 1000;
    expect(() => parseDataset(d)).toThrow(/balance/);
  });
  it('rejects partner flows that fail to reconcile', () => {
    const d = structuredClone(source);
    d.partners[0].exportsBySector[0] += 1000;
    expect(() => parseDataset(d)).toThrow(/Partner trade/);
  });
  it('does not silently relabel another currency or country as the UAE', () => {
    expect(() => parseDataset({ ...source, meta: { ...source.meta, currency: 'AED' } })).toThrow(/USD/);
    expect(() => parseDataset({ ...source, meta: { ...source.meta, countryCode: 'USA' } })).toThrow(/UAE/);
  });
  it('rejects executable source URLs and fingerprints data changes', () => {
    const changed = { ...source, meta: { ...source.meta, sourceUrl: 'javascript:alert(1)' } };
    expect(parseDataset(changed).sourceUrl).toBe('');
    expect(parseDataset(changed).id).not.toBe(parseDataset(source).id);
  });
});
