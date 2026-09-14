import source from './data/uae-baseline.json';
import { validateEconomy } from './model/engine';
import type { EconomyData, ModelResult } from './model/engine';
import type { Dataset, Result, Scenario } from './viewTypes';

function fingerprint(text: string) {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) { h ^= text.charCodeAt(i); h = Math.imul(h, 16777619); }
  return (h >>> 0).toString(16);
}

export function parseDataset(value: unknown): Dataset {
  if (!value || typeof value !== 'object') throw new Error('Invalid dataset. Use the JSON format described in README.');
  const data = value as EconomyData & { meta?: Record<string, unknown>; partners?: Dataset['partners']; sectors: (EconomyData['sectors'][0] & { imports?: number })[] };
  if (!Array.isArray(data.sectors) || !Array.isArray(data.domesticIO) || !Array.isArray(data.importedIO)) throw new Error('Dataset needs sector accounts and both input-output matrices.');
  if (!data.meta || data.meta.countryCode !== 'ARE' || typeof data.meta.year !== 'number' || !Number.isInteger(data.meta.year)) throw new Error('Dataset metadata must identify the UAE (ARE) and a reference year.');
  if (data.meta.currency !== 'USD' || data.meta.scale !== 1_000_000) throw new Error('Convert source values to current USD millions before importing.');
  if (data.sectors.some(s => !s || typeof s.id !== 'string' || typeof s.name !== 'string')) throw new Error('Every sector needs an ID and name.');
  try { validateEconomy(data); } catch (e) { throw new Error(e instanceof Error ? e.message : 'Invalid economic accounts.'); }
  const partners = Array.isArray(data.partners) ? data.partners : [];
  if (partners.some(p => !p || typeof p.id !== 'string' || typeof p.name !== 'string' || ![p.importsBySector, p.exportsBySector].every(v => Array.isArray(v) && v.length === data.sectors.length && v.every(n => Number.isFinite(n) && n >= 0)))) throw new Error('Partner records must have valid import and export values for every sector.');
  const imports = data.sectors.map((s, i) => data.importedIO[i].reduce((a, b) => a + b, 0) + s.importedHousehold + s.importedGovernment + s.importedInvestment + s.importedInventories);
  if (partners.length && data.sectors.some((s, i) => Math.abs(partners.reduce((v, p) => v + p.importsBySector[i], 0) - imports[i]) > Math.max(0.001, imports[i] * 1e-5) || Math.abs(partners.reduce((v, p) => v + p.exportsBySector[i], 0) - s.exports) > Math.max(0.001, s.exports * 1e-5))) throw new Error('Partner trade does not match the national accounts.');
  let sourceUrl = '';
  if (typeof data.meta.sourceUrl === 'string') { try { const u = new URL(data.meta.sourceUrl); if (['https:', 'http:'].includes(u.protocol)) sourceUrl = u.href; } catch { /* Invalid source links are never rendered as active URLs. */ } }
  return {
    id: `ARE-${data.meta.year}-${fingerprint(JSON.stringify(data))}`,
    title: 'UAE input-output accounts', year: data.meta.year, source: data.meta.source === source.meta.source ? 'ADB' : typeof data.meta.source === 'string' ? data.meta.source : 'Imported data',
    sourceUrl, currency: 'USD', units: 'USD million', domesticIO: data.domesticIO, raw: data,
    tariffsAvailable: data.sectors.every(s => typeof s.tariffRate === 'number' && Number.isFinite(s.tariffRate)), partners,
    limitations: Array.isArray(data.meta.limitations) ? data.meta.limitations.filter((v): v is string => typeof v === 'string') : [],
    sectors: data.sectors.map((s, i) => ({ id: s.id, name: s.name, group: /^c([3-9]|1[0-6])$/.test(s.id) ? 'manufacturing' : s.id === 'c2' ? 'mining' : 'other', output: s.output, valueAdded: s.valueAdded, imports: imports[i], exports: s.exports })),
  };
}
export async function loadDefaultDataset(): Promise<Dataset> { return parseDataset(source); }

export function simulate(dataset: Dataset, scenario: Scenario, signal?: AbortSignal): Promise<Result> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) { reject(new DOMException('Cancelled', 'AbortError')); return; }
    const worker = new Worker(new URL('./model.worker.ts', import.meta.url), { type: 'module' });
    const abort = () => { clearTimeout(timer); worker.terminate(); reject(new DOMException('Cancelled', 'AbortError')); };
    const cleanup = () => { clearTimeout(timer); worker.terminate(); signal?.removeEventListener('abort', abort); };
    const timer = setTimeout(() => { cleanup(); reject(new Error('This scenario took too long to solve. Try smaller changes.')); }, 30_000);
    signal?.addEventListener('abort', abort, { once: true });
    worker.onmessage = (event: MessageEvent<{ result?: ModelResult; error?: string }>) => {
      cleanup();
      if (event.data.error || !event.data.result) { reject(new Error(event.data.error || 'No model result was returned.')); return; }
      const r = event.data.result;
      if (!r.diagnostics.converged || ![r.realGDP, r.householdRealIncome, r.exports, r.imports].every(Number.isFinite)) { reject(new Error('The model did not produce a valid equilibrium. Try a smaller change.')); return; }
      resolve({
        realGDP: r.realGDP, realIncome: r.householdRealIncome, exports: r.exports, imports: r.imports, wage: r.wage, employment: r.employment, appliedSectorShocks: r.appliedSectorShocks, warnings: r.warnings,
        sectors: r.sectors.map((s, i) => ({ ...dataset.sectors[i], outputChange: s.output, priceChange: s.price, exportChange: s.exports, importChange: s.imports, employmentChange: s.employment, valueAddedChange: s.valueAdded, intermediateInputPrice: s.intermediateInputPrice })),
        diagnostics: { converged: r.diagnostics.converged, iterations: r.diagnostics.iterations, residual: r.diagnostics.maxResidual },
      });
    };
    worker.onerror = () => { cleanup(); reject(new Error('The solver could not start. Reload the app and try again.')); };
    worker.postMessage({ data: dataset.raw, scenario });
  });
}
