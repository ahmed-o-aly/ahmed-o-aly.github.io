import { lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowRight, ArrowSquareOut, ArrowCounterClockwise, ArrowsLeftRight,
  BookmarkSimple, ChartBar, Check, Copy, Database, DownloadSimple, Factory,
  Info, Lightning, BookOpen, MagnifyingGlass, Plus, SlidersHorizontal, Trash, WarningCircle, X,
} from '@phosphor-icons/react';
import { loadDefaultDataset, parseDataset, simulate } from './adapter';
import { DEFAULT_SCENARIO, PRESETS, baselineScenario, money, percent } from './viewTypes';
import type { Dataset, Result, SavedScenario, Scenario, SectorResult } from './viewTypes';
import { loadSaved, persistSaved, readShared, loadActive, persistActive } from './storage';
import PartnerView from './PartnerView';
import SectorEditor from './SectorEditor';
import SectorWorkspace from './SectorWorkspace';
import { ASSUMPTION_HELP, assumptionExample, workforceExplanation } from './assumptionHelp';
const ExplainView = lazy(() => import('./ExplainView'));
import { togglePreset, presetActive, resetShocks } from './scenario';

type Page = 'simulator' | 'saved' | 'model' | 'learn' | 'sector';
type ResultTab = 'sectors' | 'trade' | 'compare';
const metricList = [
  { key: 'realGDP', label: 'Real GDP', detail: 'Value added at basic prices, at baseline prices' },
  { key: 'realIncome', label: 'Household purchasing power', detail: 'Income adjusted for consumer prices' },
  { key: 'exports', label: 'Export volume', detail: 'At baseline export prices' },
  { key: 'imports', label: 'Import volume', detail: 'At baseline import prices' },
] as const;

function IconButton({ label, children, onClick, disabled = false }: { label: string; children: React.ReactNode; onClick: () => void; disabled?: boolean }) {
  return <button className="icon-button" aria-label={label} title={label} onClick={onClick} disabled={disabled}>{children}</button>;
}

function Lever({ label, value, min, max, step = 1, onChange, suffix = '%', help, explanation }: {
  label: string; value: number; min: number; max: number; step?: number;
  onChange: (value: number) => void; suffix?: string; help: string; explanation?: string;
}) {
  const id = label.toLowerCase().replaceAll(' ', '-');
  return <div className="lever">
    <div className="lever-heading"><label htmlFor={id}>{label}</label><span className="number-input"><input
      aria-label={`${label} value`} aria-describedby={`${id}-help${explanation ? ` ${id}-explanation` : ''}`} type="number" min={min} max={max} step={step} value={value}
      onChange={e => { const n = e.target.valueAsNumber; if (Number.isFinite(n)) onChange(Math.min(max, Math.max(min, n))); }}
    /><span>{suffix}</span></span></div>
    <input id={id} type="range" min={min} max={max} step={step} value={value}
      aria-describedby={`${id}-help${explanation ? ` ${id}-explanation` : ''}`} onChange={e => onChange(Number(e.target.value))}
      style={{ '--range-fill': `${(value - min) / (max - min) * 100}%` } as React.CSSProperties} />
    <div className="range-captions"><span>{min}{suffix}</span><span id={`${id}-help`}>{help}</span><span>{max}{suffix}</span></div>
    {explanation && <p id={`${id}-explanation`} className="lever-explanation">{explanation}</p>}
  </div>;
}

function changeClass(value: number) { return Math.abs(value) < 0.005 ? 'neutral' : value > 0 ? 'positive' : 'negative'; }

function Metrics({ result }: { result: Result }) {
  return <div className="metrics">{metricList.map(m => <div className="metric" key={m.key}>
    <div className="metric-label">{m.label}<span title={m.detail}><Info size={14} aria-label={m.detail}/></span></div>
    <div className={`metric-value ${changeClass(result[m.key])}`}>{percent(result[m.key])}</div>
    <div className="metric-caption">vs. baseline</div>
  </div>)}</div>;
}

function SectorChart({ result, onSelect }: { result: Result; onSelect: (sector: SectorResult) => void }) {
  const [all, setAll] = useState(false);
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState('impact');
  const [measure, setMeasure] = useState<'outputChange' | 'priceChange' | 'employmentChange'>('outputChange');
  const sectors = useMemo(() => {
    const rows = [...result.sectors].filter(s => s.name.toLowerCase().includes(query.toLowerCase()));
    rows.sort((a, b) => sort === 'size' ? b.valueAdded - a.valueAdded : sort === 'name' ? a.name.localeCompare(b.name) : Math.abs(b[measure]) - Math.abs(a[measure]) || b.valueAdded - a.valueAdded);
    return rows;
  }, [result, query, sort, measure]);
  const visible = all || query ? sectors : sectors.slice(0, 10);
  const max = Math.max(0.1, ...visible.map(s => Math.abs(s[measure]))) * 1.12;
  const labels = { outputChange: 'Output', priceChange: 'Price', employmentChange: 'Employment' };
  return <>
    <div className="chart-toolbar">
      <div className="segmented" aria-label="Sector measure">{Object.entries(labels).map(([id, name]) => <button key={id} aria-pressed={measure === id} onClick={() => setMeasure(id as typeof measure)}>{name}</button>)}</div>
      <select aria-label="Sort sectors" value={sort} onChange={e => setSort(e.target.value)}><option value="impact">Largest change</option><option value="size">Largest sector</option><option value="name">A–Z</option></select>
    </div>
    {all && <label className="search-field"><MagnifyingGlass size={17} /><input aria-label="Find a sector" placeholder="Find a sector" value={query} onChange={e => setQuery(e.target.value)} /></label>}
    <div className="chart-axis"><span>Sector</span><div><span>−{max.toFixed(1)}%</span><span>0</span><span>+{max.toFixed(1)}%</span></div><span>Change</span></div>
    <div className="sector-chart" role="group" aria-label={`${labels[measure]} change by sector`}>
      {visible.map(s => <button className="sector-row" key={s.id} onClick={() => onSelect(s)} aria-label={`${s.name}, ${labels[measure]} ${percent(s[measure])}, view details`}>
        <span className="sector-name">{s.name}</span>
        <span className="bar-track"><span className="grid-line grid-left"/><span className="grid-line grid-center"/><span className="grid-line grid-right"/>
          <span className={`impact-bar ${changeClass(s[measure])}`} style={{ width: `${Math.abs(s[measure]) / max * 50}%`, left: `${s[measure] < 0 ? 50 - Math.abs(s[measure]) / max * 50 : 50}%` }} />
        </span><span className={`sector-change ${changeClass(s[measure])}`}>{percent(s[measure])}</span>
      </button>)}
      {visible.length === 0 && <div className="inline-empty">No sectors match “{query}”.</div>}
    </div>
    <div className="chart-footer"><button className="text-button" onClick={() => { setAll(!all); setQuery(''); }}>{all ? 'Show top 10' : `View all ${result.sectors.length} sectors`}<ArrowRight size={14}/></button><span>Click a sector to inspect</span></div>
  </>;
}

function TradeView({ result, dataset, onSelect }: { result: Result; dataset: Dataset; onSelect: (id: string) => void }) {
  const [view, setView] = useState<'scenario' | 'partners'>('scenario');
  return <><div className="trade-subnav"><button aria-pressed={view === 'scenario'} onClick={() => setView('scenario')}>Scenario flows</button><button aria-pressed={view === 'partners'} onClick={() => setView('partners')}>Partner exposure</button></div>{view === 'scenario' ? <TradeTable result={result} onSelect={onSelect}/> : <PartnerView dataset={dataset} onSelect={onSelect}/>}</>;
}

function TradeTable({ result, onSelect }: { result: Result; onSelect: (id: string) => void }) {
  const [direction, setDirection] = useState<'exports' | 'imports'>('exports');
  const rows = [...result.sectors].sort((a, b) => b[direction] - a[direction]);
  return <><div className="chart-toolbar"><div className="segmented" aria-label="Trade flow"><button aria-pressed={direction === 'exports'} onClick={() => setDirection('exports')}>Exports</button><button aria-pressed={direction === 'imports'} onClick={() => setDirection('imports')}>Imports</button></div><span className="quiet-label">USD · baseline prices</span></div>
    <div className="table-wrap"><table className="data-table"><thead><tr><th>Sector</th><th>Baseline</th><th>Scenario</th><th>Change</th></tr></thead><tbody>{rows.map(s => {
      const change = direction === 'exports' ? s.exportChange : s.importChange;
      return <tr key={s.id}><td><button className="sector-name-link" onClick={() => onSelect(s.id)}>{s.name}</button></td><td>{money(s[direction])}</td><td>{money(s[direction] * (1 + change / 100))}</td><td className={changeClass(change)}>{percent(change)}</td></tr>;
    })}</tbody></table></div></>;
}

function Compare({ dataset, current, currentScenario, saved, notify }: {
  dataset: Dataset; current: Result; currentScenario: Scenario; saved: SavedScenario[]; notify: (message: string) => void;
}) {
  const available = saved.filter(s => s.datasetId === dataset.id);
  const [selected, setSelected] = useState('baseline');
  const [other, setOther] = useState<Result | null>(null);
  const [pending, setPending] = useState(false);
  const [comparisonError, setComparisonError] = useState('');
  const otherScenario = available.find(s => s.id === selected)?.scenario || baselineScenario();
  useEffect(() => {
    let alive = true;
    setPending(true); setOther(null); setComparisonError('');
    simulate(dataset, otherScenario).then(r => { if (alive) setOther(r); }).catch(e => { if (alive) { setOther(null); setComparisonError(e.message); } }).finally(() => { if (alive) setPending(false); });
    return () => { alive = false; };
  }, [dataset, selected]);
  return <><div className="chart-toolbar"><label className="compare-picker">Compare with<select value={selected} onChange={e => { setOther(null); setSelected(e.target.value); }} aria-label="Comparison scenario"><option value="baseline">Baseline</option>{available.map(s => <option key={s.id} value={s.id}>{s.scenario.name}</option>)}</select></label><button className="text-button" onClick={() => notify('Save scenarios to add them to this comparison.')}>How to compare<Info size={14}/></button></div>
    {comparisonError && <div role="alert" className="error-panel">{comparisonError}</div>}
    <div className={`compare-grid ${pending ? 'is-calculating' : ''}`}>
      <div className="compare-heading"><span>Change vs. baseline</span><strong>{currentScenario.name}</strong><strong>{otherScenario.name}</strong></div>
      {metricList.map(m => <div className="compare-row" key={m.key}><span>{m.label}</span><strong className={changeClass(current[m.key])}>{percent(current[m.key])}</strong><strong className={other ? changeClass(other[m.key]) : ''}>{other ? percent(other[m.key]) : '—'}</strong></div>)}
      <div className="compare-row"><span>Wages</span><strong className={changeClass(current.wage)}>{percent(current.wage)}</strong><strong className={other ? changeClass(other.wage) : ''}>{other ? percent(other.wage) : '—'}</strong></div>
    </div>
    <div className="table-note">Both scenarios use the same {dataset.year} accounts.</div></>;
}

function App() {
  const [page, setPage] = useState<Page>('simulator');
  const [tab, setTab] = useState<ResultTab>('sectors');
  useEffect(() => { window.scrollTo(0, 0); }, [page]);
  const [dataset, setDataset] = useState<Dataset | null>(null);
  const [loading, setLoading] = useState(true);
  const [draft, setDraft] = useState<Scenario>(() => readShared() || DEFAULT_SCENARIO);
  const [applied, setApplied] = useState<Scenario | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState('');
  const [toast, setToast] = useState('');
  const [saved, setSaved] = useState<SavedScenario[]>(loadSaved);
  const [selectedSectorId, setSelectedSectorId] = useState('c3');
  const [sectorHistory, setSectorHistory] = useState<string[]>([]);
  const focusedSectorId = dataset?.sectors.some(s => s.id === selectedSectorId) ? selectedSectorId : dataset?.sectors[0]?.id ?? '';
  const openSector = (id = focusedSectorId) => {
    if (id !== focusedSectorId && focusedSectorId) setSectorHistory(history => [...history, focusedSectorId].slice(-20));
    setSelectedSectorId(id); setPage('sector'); window.scrollTo(0, 0);
  };
  const previousSectorId = sectorHistory.at(-1);
  const backSector = () => { if (previousSectorId) { setSelectedSectorId(previousSectorId); setSectorHistory(history => history.slice(0, -1)); window.scrollTo(0, 0); } };
  const [dataError, setDataError] = useState('');
  const fileInput = useRef<HTMLInputElement>(null);
  const runId = useRef(0);
  const importId = useRef(0);
  const [retry, setRetry] = useState(0);
  const dirty = !!applied && JSON.stringify(draft) !== JSON.stringify(applied);
  const notify = (message: string) => setToast(message);
  useEffect(() => { if (!toast) return; const id = setTimeout(() => setToast(''), 4200); return () => clearTimeout(id); }, [toast]);
  useEffect(() => {
    let alive = true;
    loadDefaultDataset().then(async d => {
      if (!alive) return;
      setDataset(d);
      const initial = readShared(d.id) || loadActive(d.id) || DEFAULT_SCENARIO;
      setDraft(initial);
      if (readShared() && !readShared(d.id)) setDataError('This link needs a different dataset. Import its original accounts to restore the scenario.');

    }).catch(e => { if (alive) setDataError(e.message); }).finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, []);

  useEffect(() => {
    const restore = () => {
      if (!dataset || !location.hash) return;
      const next = readShared(dataset.id);
      if (next) { setDataError(''); setDraft(next); }
      else setDataError('This scenario link is invalid or needs its original dataset.');
    };
    window.addEventListener('hashchange', restore);
    return () => window.removeEventListener('hashchange', restore);
  }, [dataset]);

  const edit = <K extends keyof Scenario>(key: K, value: Scenario[K]) => setDraft(s => ({ ...s, [key]: value }));
  const choosePreset = (id: string) => setDraft(s => togglePreset(s, id));
  useEffect(() => {
    if (!dataset || loading) return;
    const id = ++runId.current;
    const controller = new AbortController();
    persistActive(dataset.id, draft);
    setRunning(true); setError('');
    const timer = setTimeout(() => {
      simulate(dataset, draft, controller.signal).then(r => {
        if (id !== runId.current || controller.signal.aborted) return;
        setResult(r); setApplied({ ...draft });
      }).catch(e => {
        if (id === runId.current && !controller.signal.aborted) setError(e instanceof Error ? e.message : 'Try a smaller change.');
      }).finally(() => { if (id === runId.current && !controller.signal.aborted) setRunning(false); });
    }, 250);
    return () => { clearTimeout(timer); controller.abort(); };
  }, [dataset, draft, loading, retry]);
  function save() {
    if (!applied || !dataset || !result || dirty) return;
    const item: SavedScenario = { id: crypto.randomUUID(), scenario: { ...applied }, datasetId: dataset.id, savedAt: new Date().toISOString() };
    const next = [item, ...saved].slice(0, 12);
    if (persistSaved(next)) { setSaved(next); notify('Scenario saved'); } else notify('Storage is unavailable. Export this scenario instead.');
  }
  function remove(id: string) { const next = saved.filter(s => s.id !== id); if (persistSaved(next)) setSaved(next); else notify('Could not update saved scenarios.'); }
  function exportResult() {
    if (!result || !applied || !dataset) return;
    const q = (s: string | number) => {
      const value = typeof s === 'string' && /^[\s]*[=+@\-]/.test(s) ? `'${s}` : String(s);
      return `"${value.replaceAll('"', '""')}"`;
    };
    const rows: (string | number)[][] = [
      ['UAE Economy Lab', 'Simplified single-country CGE'], ['Source', dataset.source], ['Source URL', dataset.sourceUrl], ['Baseline year', dataset.year],
      ['Scenario', applied.name], ['Tariff cut (%)', applied.tariffCut], ['Productivity (%)', applied.productivity], ['Productivity sector', applied.productivitySector],
      ['Mining export demand (%)', applied.oilDemand], ['Import delivered-price change (%)', applied.freightCost], ['Labor closure', applied.laborClosure], ['Assumed labor share (%)', applied.laborShare], ['Assumed import substitution elasticity', applied.substitution], ['Assumed export demand elasticity', applied.exportElasticity],
      ['Residual', result.diagnostics.residual], [], ['Effective sector changes', 'Productivity (%)', 'Export demand (%)', 'Import price (%)'], ...dataset.sectors.map(s => [s.name, result.appliedSectorShocks[s.id].productivity, result.appliedSectorShocks[s.id].exportDemand, result.appliedSectorShocks[s.id].importPrice]), [], ['Metric', 'Change (%)'], ...metricList.map(m => [m.label, result[m.key]]), [],
      ['Sector', 'Baseline output (USD million)', 'Output change (%)', 'Price change (%)', 'Exports change (%)', 'Imports change (%)', 'Employment change (%)'],
      ...result.sectors.map(s => [s.name, s.output, s.outputChange, s.priceChange, s.exportChange, s.importChange, s.employmentChange]),
    ];
    const blob = new Blob(['\uFEFF' + rows.map(row => row.map(q).join(',')).join('\r\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = `uae-${applied.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${dataset.year}.csv`; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
    notify('Results exported');
  }
  async function share() {
    const payload = { scenario: draft, datasetId: dataset?.id };
    const url = `${location.origin}${location.pathname}#${encodeURIComponent(JSON.stringify(payload))}`;
    try { await navigator.clipboard.writeText(url); notify('Scenario link copied.'); } catch { location.hash = encodeURIComponent(JSON.stringify(payload)); notify('Scenario added to the address bar. Copy the URL to keep it.'); }
  }
  async function importData(file: File) {
    if (file.size > 10_000_000) { notify('Choose a dataset smaller than 10 MB.'); return; }
    const requestId = ++importId.current;
    ++runId.current; setRunning(false); setLoading(true); setDataError(''); setError('');
    try {
      const fileText = await file.text();
      if (requestId !== importId.current) return;
      const d = parseDataset(JSON.parse(fileText));
      const next = readShared(d.id) || baselineScenario();
      setResult(null); setApplied(null); setDataset(d); setDraft(next); setPage('simulator'); notify('Dataset loaded');
    } catch (e) { if (requestId === importId.current) setDataError(e instanceof Error ? e.message : 'Invalid dataset. Check the format in README.'); }
    finally { if (requestId === importId.current) { setLoading(false); if (fileInput.current) fileInput.current.value = ''; } }
  }

  return <div className="app-shell">
    <header className="app-header"><a className="brand" href="#" onClick={e => { e.preventDefault(); setPage('simulator'); }} aria-label="UAE Economy Lab home"><span className="brand-mark">ae<span>.</span></span><span className="brand-name">Economy Lab<span>United Arab Emirates</span></span></a>
      <nav className="main-nav" aria-label="Main navigation"><button className={page === 'simulator' ? 'active' : ''} onClick={() => setPage('simulator')}><SlidersHorizontal size={18}/>Simulator</button><button className={page === 'sector' ? 'active' : ''} onClick={() => openSector()}><Factory size={18}/>Sectors</button><button className={page === 'saved' ? 'active' : ''} onClick={() => setPage('saved')}><BookmarkSimple size={18}/>Saved<span className="nav-count">{saved.length}</span></button><button className={page === 'model' ? 'active' : ''} onClick={() => setPage('model')}><Database size={18}/>Data</button><button className={page === 'learn' ? 'active' : ''} onClick={() => setPage('learn')}><BookOpen size={18}/>Understand</button></nav>
      <div className="header-meta"><span className="country-flag" aria-label="UAE flag"><i/><i/><i/></span><span>UAE</span></div>
    </header>

    <main className="main-content">
      <div className="page-heading"><div><span className="eyebrow">Economic scenarios</span><h1>{page === 'simulator' ? 'Explore the UAE economy' : page === 'sector' ? 'Your sector, in context' : page === 'saved' ? 'Your scenarios' : page === 'learn' ? 'Understand the model' : 'Behind the numbers'}</h1></div><button className="dataset-tag" onClick={() => setPage('model')}><span className="status-dot"/>{dataset ? `${dataset.source} · ${dataset.year}` : loading ? 'Loading accounts' : 'Dataset required'}<ArrowSquareOut size={14}/></button></div>
      {(dataError || error) && <div className="error-panel" role="alert"><WarningCircle size={20}/><span>{dataError || error}</span><IconButton label="Dismiss error" onClick={() => { setError(''); setDataError(''); }}><X size={17}/></IconButton></div>}

      {page === 'simulator' && <div className="workbench">
        {result && <div className="mobile-live-results" aria-label="Live scenario totals"><span>{running || dirty ? 'Updating…' : 'Live results'}</span><Metrics result={result}/></div>}
        <section className="broad-controls" aria-label="Combined scenario controls">
          <div className="broad-heading"><div><h2>Build a combined scenario</h2><p>Mix broad changes with sector-specific ones. Results update as you edit.</p></div><button className="text-button" onClick={() => setDraft(s => resetShocks(s))}><ArrowCounterClockwise size={16}/>Reset changes</button></div>
          <div className="preset-strip" aria-label="Combine scenario presets">{PRESETS.map((p, i) => { const Icon = i === 0 ? ArrowsLeftRight : i === 1 ? Lightning : Factory; const active = presetActive(draft, p.id); return <button key={p.id} aria-pressed={active} onClick={() => choosePreset(p.id)}><Icon size={17}/>{p.name}{active ? <Check size={14}/> : <Plus size={14}/>}</button>; })}<span>Examples can be combined</span></div>
          <div className="broad-grid">
            <div><Lever label="Import costs" value={draft.freightCost} min={-20} max={50} onChange={v => edit('freightCost', v)} help="All imported products" explanation="Change the delivered price of imports. −5% makes imported products 5% cheaper for UAE buyers."/></div>
            <div><Lever label="Productivity change" value={draft.productivity} min={-10} max={20} step={0.5} onChange={v => edit('productivity', v)} help="Same inputs, more output" explanation="+5% means 5% more output from the same inputs in the selected sectors."/><label className="broad-select">Applies to<select aria-label="Broad productivity scope" value={draft.productivitySector} onChange={e => edit('productivitySector', e.target.value)}><option value="manufacturing">All manufacturing</option><option value="all">All sectors</option>{dataset?.sectors.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}</select></label></div>
            <div><Lever label="Mining export demand" value={draft.oilDemand} min={-40} max={40} onChange={v => edit('oilDemand', v)} help="Includes oil and gas" explanation="+10% raises foreign demand for mining products by 10% at unchanged UAE prices. Prices and production then adjust."/></div>
          </div>
          <div className="broad-footer"><label>Workforce<select aria-label="Workforce response" aria-describedby="workforce-help" value={draft.laborClosure} onChange={e => edit('laborClosure', e.target.value as Scenario['laborClosure'])}><option value="fixed">Fixed · wages adjust</option><option value="elastic">Flexible · real wage fixed</option></select></label><button className="text-button" onClick={() => setPage('learn')}>What do these changes mean?<BookOpen size={15}/></button>{dataset?.tariffsAvailable ? <label>Tariff cut %<input aria-label="Import tariff cut value" type="number" min="0" max="100" value={draft.tariffCut} onChange={e => { if (Number.isFinite(e.target.valueAsNumber)) edit('tariffCut', Math.max(0,Math.min(100,e.target.valueAsNumber))); }}/></label> : <span title="Sector tariff rates are absent from these accounts.">Tariffs: data needed</span>}<small id="workforce-help" className="workforce-help">{workforceExplanation(draft.laborClosure)}</small></div>
        </section>
        <div className="workbench-columns">
        {dataset && <SectorEditor dataset={dataset} scenario={draft} onChange={setDraft} onSelect={openSector}/>}
        <section className="results-area" aria-label="Simulation results" aria-busy={loading || running}>
          <div className="results-heading"><div><span className="eyebrow">Scenario results</span><input className="scenario-name" aria-label="Scenario name" maxLength={80} value={draft.name} onChange={e => edit('name', e.target.value)}/></div><div className="result-actions"><span className={`live-status ${running || dirty ? 'updating' : ''}`}><span className="status-dot"/>{loading ? 'Loading…' : running ? 'Updating…' : error || dirty ? 'Not applied' : 'Live'}</span><IconButton label="Copy scenario link" onClick={share}><Copy size={17}/></IconButton><button className="secondary-button" onClick={save} disabled={!result || dirty || running}><BookmarkSimple size={16}/>Save</button><button className="secondary-button" onClick={exportResult} disabled={!result || dirty || running}><DownloadSimple size={16}/><span>Export</span></button></div></div>
          {dirty && <div className="pending-note"><span className="pending-dot"/>{!error ? 'Updating all changes together. Previous results shown below.' : 'These changes could not be solved. Previous results shown below.'}{!running && <button onClick={() => setRetry(n => n + 1)}>Retry</button>}</div>}
          {loading || (!result && running) ? <div className="loading-state"><div className="skeleton metrics-skeleton"/><div className="skeleton chart-skeleton"/><span>Loading UAE accounts…</span></div> : result && dataset && applied ? <div className={running ? 'results-body is-calculating' : 'results-body'}>
            <Metrics result={result}/>
            {result.warnings.filter(w => w.startsWith('Export demand changes')).map(w => <div className="scenario-notice" key={w}>{w}</div>)}
            <button className="understand-prompt" onClick={() => openSector()}><Factory size={18}/><span><strong>Explore a sector in context</strong>Production, trade, inputs and customers in one place.</span><ArrowRight size={17}/></button>
            <div className="results-card"><div className="result-tabs" role="tablist" aria-label="Results view"><button role="tab" aria-selected={tab === 'sectors'} onClick={() => setTab('sectors')}><ChartBar size={17}/>Sector impact</button><button role="tab" aria-selected={tab === 'trade'} onClick={() => setTab('trade')}><ArrowsLeftRight size={17}/>Trade</button><button role="tab" aria-selected={tab === 'compare'} onClick={() => setTab('compare')}><SlidersHorizontal size={17}/>Compare</button></div>
              <div className="tab-content" role="tabpanel">{tab === 'sectors' ? <SectorChart result={result} onSelect={s => openSector(s.id)}/> : tab === 'trade' ? <TradeView result={result} dataset={dataset} onSelect={openSector}/> : <Compare key={dataset.id} dataset={dataset} current={result} currentScenario={applied} saved={saved} notify={notify}/>}</div>
            </div>
            <div className="results-footnote"><span><Check size={14}/>Equilibrium solved</span><button onClick={() => setPage('learn')}>Model & assumptions<Info size={14}/></button><span>{dataset.year} baseline</span></div>
          </div> : <div className="empty-state"><Database size={36} weight="light"/><h2>Connect economic accounts</h2><p>Load a supported dataset to run a scenario.</p><button className="primary-button" onClick={() => fileInput.current?.click()}>Import dataset<Plus size={17}/></button><button className="text-button" onClick={() => setPage('model')}>View data requirements<ArrowRight size={14}/></button></div>}
        </section>
        </div>
      </div>}

      {page === 'sector' && dataset && result && applied && <SectorWorkspace dataset={dataset} result={result} scenario={draft} applied={applied} selectedId={focusedSectorId} previousName={dataset.sectors.find(s => s.id === previousSectorId)?.name} busy={running} stale={dirty} onSelect={openSector} onBack={backSector} onChange={setDraft} onSave={save} onExport={exportResult}/>}

      {page === 'saved' && <section className="saved-page"><div className="section-topline"><span>{saved.length} saved {saved.length === 1 ? 'scenario' : 'scenarios'}</span><button className="primary-button" onClick={() => { setPage('simulator'); setDraft(baselineScenario()); }}><Plus size={17}/>New scenario</button></div>{saved.length ? <div className="saved-grid">{saved.map(s => <article className="saved-card" key={s.id}><div className="saved-card-top"><BookmarkSimple size={19}/><IconButton label={`Delete ${s.scenario.name}`} onClick={() => remove(s.id)}><Trash size={17}/></IconButton></div><h2>{s.scenario.name}</h2><span className="quiet-label">{new Date(s.savedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} · {s.scenario.laborClosure === 'fixed' ? 'Fixed workforce' : 'Flexible workforce'}</span><div className="saved-changes">{[
        ['Tariff cut', s.scenario.tariffCut], ['Productivity', s.scenario.productivity], ['Mining demand', s.scenario.oilDemand], ['Import costs', s.scenario.freightCost],
      ].filter(([, v]) => v !== 0).map(([label, value]) => <span key={label as string}>{label}<strong>{percent(Number(value), 1)}</strong></span>)}{Object.keys(s.scenario.sectorShocks || {}).length > 0 && <span>Sector overrides<strong>{Object.keys(s.scenario.sectorShocks || {}).length}</strong></span>}</div><button className="secondary-button" disabled={s.datasetId !== dataset?.id} onClick={() => { setDraft(s.scenario); setPage('simulator');  }}>Open scenario<ArrowRight size={16}/></button>{s.datasetId !== dataset?.id && <p className="quiet-label">Requires its original dataset.</p>}</article>)}</div> : <div className="empty-state"><BookmarkSimple size={42} weight="light"/><h2>Keep a scenario worth comparing</h2><p>Change a scenario, then save it here.</p><button className="primary-button" onClick={() => setPage('simulator')}>Open simulator<ArrowRight size={17}/></button></div>}</section>}

      {page === 'learn' && dataset && result && <section className="learn-page">
        <div className="learn-live"><div className="learn-live-heading"><span><span className="status-dot"/>{running || dirty ? 'Updating · previous results below' : 'Live scenario'}<strong>{applied?.name}</strong></span><button className="text-button" onClick={() => setPage('simulator')}>Back to changes<ArrowRight size={15}/></button></div><Metrics result={result}/></div>
        <Suspense fallback={<div className="inline-empty">Loading explanations…</div>}><ExplainView key={dataset.id} dataset={dataset} result={result} scenario={draft} onChange={setDraft} onExploreSector={() => openSector()}/></Suspense>
      </section>}

      {page === 'model' && <section className="model-page">
        <div className="model-overview"><div className="model-icon"><Database size={27} weight="light"/></div><div><h2>{dataset ? dataset.title : 'UAE economic accounts'}</h2><p>{dataset ? `${dataset.sectors.length} sectors · ${dataset.year} · ${dataset.units}` : 'A balanced input-output dataset is required.'}</p></div><button className="secondary-button" onClick={() => fileInput.current?.click()}><Plus size={16}/>Import dataset</button></div>
        <div className="model-grid"><div className="model-section"><span className="eyebrow">Data</span><h2>UAE input-output accounts</h2>{dataset && <><dl className="metadata-list"><div><dt>Source</dt><dd><a href={dataset.sourceUrl} target="_blank" rel="noreferrer">{dataset.source}<ArrowSquareOut size={14}/></a></dd></div><div><dt>Reference year</dt><dd>{dataset.year}</dd></div><div><dt>Economy</dt><dd>United Arab Emirates</dd></div><div><dt>Coverage</dt><dd>{dataset.sectors.length} national sectors</dd></div><div><dt>Currency</dt><dd>{dataset.currency} · current prices</dd></div></dl></>}</div>
          <div className="model-section"><span className="eyebrow">Model</span><h2>Single-country CGE</h2><div className="model-flow"><span>Trade & policy</span><ArrowRight size={17}/><span>Production & prices</span><ArrowRight size={17}/><span>Income & demand</span></div><p className="model-description">Prices, production and demand adjust together across the UAE economy.</p><dl className="metadata-list"><div><dt>Government & investment</dt><dd>Fixed real demand</dd></div><div><dt>Capital</dt><dd>Fixed in each sector</dd></div><div><dt>Labor</dt><dd>Choose fixed workforce or fixed real wage</dd></div><div><dt>International markets</dt><dd>Fixed import prices; responsive export demand</dd></div><div><dt>External financing</dt><dd>Adjusts to balance accounts</dd></div></dl></div>
        </div>
        <div className="model-section parameters">
          <div><span className="eyebrow">Parameters</span><h2>Adjust the response</h2><p>Choose how labor and trade respond to your scenario.</p></div>
          {([
            { key: 'laborShare', label: 'Labor share (%)', min: 10, max: 90, step: 5 },
            { key: 'substitution', label: 'Import substitution', min: 0, max: 8, step: .5 },
            { key: 'exportElasticity', label: 'Export response', min: .5, max: 12, step: .5 },
          ] as const).map(control => <label key={control.key}>
            <span>{control.label}</span>
            <input type="number" aria-label={control.label} aria-describedby={`data-${control.key}-help`} min={control.min} max={control.max} step={control.step} value={draft[control.key]}
              onChange={event => { if (Number.isFinite(event.target.valueAsNumber)) edit(control.key, Math.min(control.max, Math.max(control.min, event.target.valueAsNumber))); }}/>
            <small className="assumption-help" id={`data-${control.key}-help`}><span>{ASSUMPTION_HELP[control.key]}</span><span>{assumptionExample(control.key, draft[control.key])}</span></small>
          </label>)}
          <button className="secondary-button" onClick={() => setPage('simulator')}>View live results<ArrowRight size={16}/></button>
        </div><div className="model-section diagnostics"><div><span className="eyebrow">Verification</span><h2>Solver checks</h2></div><div><span>Solver status</span><strong>{result?.diagnostics.converged ? 'Converged' : 'No result'}</strong></div><div><span>Maximum residual</span><strong>{result ? result.diagnostics.residual.toExponential(2) : '—'}</strong></div><div><span>Iterations</span><strong>{result?.diagnostics.iterations ?? '—'}</strong></div></div>
        {dataset && <div className="model-section"><div className="section-topline"><h2>Baseline economy</h2><span className="quiet-label">USD billion</span></div><div className="table-wrap"><table className="data-table"><thead><tr><th>Sector</th><th>Gross output</th><th>Value added</th><th>Exports</th><th>Imports</th></tr></thead><tbody>{dataset.sectors.map(s => <tr key={s.id}><td><button className="sector-name-link" onClick={() => openSector(s.id)}>{s.name}</button></td><td>{money(s.output)}</td><td>{money(s.valueAdded)}</td><td>{money(s.exports)}</td><td>{money(s.imports)}</td></tr>)}</tbody></table></div></div>}
      </section>}
      <footer className="app-footer"><span>UAE Economy Lab</span></footer>
    </main>
    <input ref={fileInput} type="file" accept="application/json,.json" className="visually-hidden" aria-label="Import economic dataset" onChange={e => { if (e.target.files?.[0]) importData(e.target.files[0]); }}/>
    {toast && <div className="toast" role="status"><Check size={17}/>{toast}</div>}
    <span className="visually-hidden" role="status">{running ? 'Solving scenario' : result && applied ? `Results available for ${applied.name}. Real GDP change ${percent(result.realGDP)}.` : ''}</span>
  </div>;
}
export default App;
