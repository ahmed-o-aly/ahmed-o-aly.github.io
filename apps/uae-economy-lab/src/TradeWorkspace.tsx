import { useMemo, useState } from 'react';
import { ArrowDownLeft, ArrowRight, ArrowSquareOut, ArrowUpRight, ArrowsDownUp, CaretDown, MagnifyingGlass, SlidersHorizontal } from '@phosphor-icons/react';
import type { Dataset, Result, Scenario, SectorShock } from './viewTypes';
import { percent } from './viewTypes';
import { effectiveShock, inheritedShock, setSectorShock } from './scenario';
import { getTradeProfile } from './tradeMetrics';
import type { LevelComparison } from './tradeMetrics';
import { ASSUMPTION_HELP, assumptionExample } from './assumptionHelp';
import './trade-workspace.css';

type Props = {
  dataset: Dataset; result: Result; scenario: Scenario; applied: Scenario;
  busy: boolean; stale: boolean; onChange: (scenario: Scenario) => void;
  onSelectSector: (id: string) => void; onScenario: () => void; initialSectorId?: string; initialFlow?: Flow;
};
type Flow = 'exports' | 'imports';
type SortKey = 'name' | 'baseline' | 'scenario' | 'change' | 'percentChange';
const sum = (values: number[]) => values.reduce((a, b) => a + b, 0);
const amount = (value: number, forceBillions = false) => {
  const billions = forceBillions || Math.abs(value) >= 1000;
  return `${value < 0 ? '−' : ''}$${(Math.abs(value) / (billions ? 1000 : 1)).toLocaleString('en-US', { minimumFractionDigits: billions ? 2 : 1, maximumFractionDigits: billions ? 2 : 1 })}${billions ? 'bn' : 'm'}`;
};
const delta = (value: number) => `${Math.abs(value) < .05 ? '' : value > 0 ? '+' : '−'}${amount(Math.abs(value))}`;
const share = (value: number, total: number) => total > 0 ? value / total * 100 : 0;
const shareLabel = (value: number, total: number) => total <= 0 ? '—' : share(value, total) > 0 && share(value, total) < .1 ? '<0.1%' : `${share(value, total).toFixed(1)}%`;
const tone = (flow: Flow, change: number) => flow === 'imports' || Math.abs(change) < .005 ? 'trade-neutral' : change > 0 ? 'trade-up' : 'trade-down';

function FlowSwitch({ flow, onChange, label }: { flow: Flow; onChange: (flow: Flow) => void; label: string }) {
  return <div className="trade-flow-switch" role="group" aria-label={label}>
    <button aria-pressed={flow === 'exports'} onClick={() => onChange('exports')}><ArrowUpRight size={14} />Exports</button>
    <button aria-pressed={flow === 'imports'} onClick={() => onChange('imports')}><ArrowDownLeft size={14} />Imports</button>
  </div>;
}

function Comparison({ label, level, flow }: { label: string; level: LevelComparison; flow?: Flow }) {
  return <div className={`trade-outcome ${flow ?? 'net'}`}>
    <span className="trade-outcome-label">{flow === 'exports' ? <ArrowUpRight size={16} /> : flow === 'imports' ? <ArrowDownLeft size={16} /> : <ArrowsDownUp size={16} />}{label}</span>
    <strong className={flow ? tone(flow, level.change) : 'trade-neutral'}>{flow ? level.percentChange === null ? '—' : percent(level.percentChange) : delta(level.change)}</strong>
    <div className="trade-levels"><span>{amount(level.baseline, true)}</span><ArrowRight size={13} /><b>{amount(level.scenario, true)}</b></div>
    <small>{flow ? `${delta(level.change)} from baseline` : 'Exports minus imports · change from baseline'}</small>
  </div>;
}

export default function TradeWorkspace({ dataset, result, scenario, applied, busy, stale, onChange, onSelectSector, onScenario, initialSectorId, initialFlow }: Props) {
  const initialId = dataset.sectors.some(sector => sector.id === initialSectorId) ? initialSectorId! : 'all';
  const [view, setView] = useState<'scenario' | 'partners'>('scenario');
  const [sectorId, setSectorId] = useState(initialId);
  const [controlSectorId, setControlSectorId] = useState(initialId === 'all' ? [...dataset.sectors].sort((a, b) => b.exports - a.exports)[0]?.id ?? '' : initialId);
  const [flow, setFlow] = useState<Flow>(initialFlow ?? 'exports');
  const [query, setQuery] = useState('');
  const [partnerQuery, setPartnerQuery] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('scenario');
  const [sortDescending, setSortDescending] = useState(true);
  const [showAllSectors, setShowAllSectors] = useState(false);
  const [showAllPartners, setShowAllPartners] = useState(false);
  const [partnerId, setPartnerId] = useState<string | null>(null);
  const [showAllProducts, setShowAllProducts] = useState(false);
  const national = useMemo(() => getTradeProfile(dataset, result), [dataset, result]);
  const filtered = useMemo(() => getTradeProfile(dataset, result, sectorId), [dataset, result, sectorId]);
  const sectorIndex = dataset.sectors.findIndex(sector => sector.id === sectorId);
  const selectedSector = dataset.sectors[sectorIndex];
  const controlSector = dataset.sectors.find(sector => sector.id === controlSectorId) ?? dataset.sectors[0];
  const inherited = controlSector ? inheritedShock(scenario, controlSector) : null;
  const effective = controlSector ? effectiveShock(scenario, controlSector) : null;
  const sortedRows = useMemo(() => filtered.rows.filter(row => row.name.toLocaleLowerCase().includes(query.toLocaleLowerCase().trim())).sort((a, b) => {
    if (sortKey === 'name') return a.name.localeCompare(b.name) * (sortDescending ? -1 : 1);
    const av = a[flow][sortKey], bv = b[flow][sortKey];
    if (av === null) return bv === null ? a.name.localeCompare(b.name) : 1;
    if (bv === null) return -1;
    return (av - bv) * (sortDescending ? -1 : 1) || a.name.localeCompare(b.name);
  }), [filtered, query, sortKey, sortDescending, flow]);
  const visibleRows = showAllSectors ? sortedRows : sortedRows.slice(0, 10);
  const drivers = [...filtered.rows].filter(row => Math.abs(row[flow].change) >= .05).sort((a, b) => Math.abs(b[flow].change) - Math.abs(a[flow].change)).slice(0, 4);
  const maxDriver = Math.max(...drivers.map(row => Math.abs(row[flow].change)), 1);
  const partners = useMemo(() => dataset.partners.map(partner => ({
    ...partner,
    exports: sectorIndex < 0 ? sum(partner.exportsBySector) : partner.exportsBySector[sectorIndex],
    imports: sectorIndex < 0 ? sum(partner.importsBySector) : partner.importsBySector[sectorIndex],
  })).sort((a, b) => b[flow] - a[flow] || a.name.localeCompare(b.name)), [dataset, sectorIndex, flow]);
  const matchingPartners = partners.filter(partner => partner.name.toLocaleLowerCase().includes(partnerQuery.toLocaleLowerCase().trim()));
  const visiblePartners = showAllPartners ? matchingPartners : matchingPartners.slice(0, 10);
  const selectedPartner = matchingPartners.find(partner => partner.id === partnerId)
    ?? matchingPartners.find(partner => !/rest of (the )?world/i.test(partner.name)) ?? matchingPartners[0];
  const partnerTotal = sum(partners.map(partner => partner[flow]));
  const maximumPartner = Math.max(...partners.map(partner => partner[flow]), 1);
  const setProduct = (id: string) => { setSectorId(id); setShowAllSectors(false); setShowAllPartners(false); setShowAllProducts(false); if (id !== 'all') setControlSectorId(id); };
  const changeFlow = (next: Flow) => { setFlow(next); setShowAllSectors(false); setShowAllPartners(false); };
  const sort = (key: SortKey) => { setSortDescending(key === sortKey ? !sortDescending : key !== 'name'); setSortKey(key); };
  const sortHeader = (key: SortKey, label: string) => <th scope="col" aria-sort={sortKey === key ? sortDescending ? 'descending' : 'ascending' : 'none'}><button onClick={() => sort(key)}>{label}<span aria-hidden="true">{sortKey === key ? sortDescending ? '↓' : '↑' : '↕'}</span></button></th>;
  const updateSectorShock = (key: keyof SectorShock, value: string, numeric: number, min: number, max: number) => {
    if (!controlSector) return;
    if (value === '') onChange(setSectorShock(scenario, controlSector.id, key, undefined));
    else if (Number.isFinite(numeric)) onChange(setSectorShock(scenario, controlSector.id, key, Math.min(max, Math.max(min, numeric))));
  };

  return <section className="trade-workspace" aria-label="Trade workspace" aria-busy={busy}>
    <header className="trade-context">
      <div><span className="trade-eyebrow">Goods and services</span><h2>National trade</h2><p>{dataset.year} baseline → scenario · USD at baseline prices</p></div>
      <div className="trade-context-scenario"><span className={`live-status ${busy || stale ? 'updating' : ''}`}><span className="status-dot" />{busy ? 'Updating…' : stale ? 'Previous result' : 'Live scenario'}</span><strong>{applied.name}</strong></div>
      <button className="secondary-button" onClick={onScenario}><SlidersHorizontal size={15} />Scenario controls</button>
    </header>
    {stale && <p className="trade-status" role="status">{busy ? 'Updating your changes. Showing the last solved scenario.' : 'These changes could not be solved. Showing the last solved scenario.'}</p>}
    <section className="trade-outcomes" aria-label="National trade results">
      <Comparison label="Exports" level={national.exports} flow="exports" />
      <Comparison label="Imports" level={national.imports} flow="imports" />
      <Comparison label="Net exports" level={national.netExports} />
    </section>

    <div className="trade-view-nav" role="group" aria-label="Trade view">
      <button aria-pressed={view === 'scenario'} onClick={() => setView('scenario')}>Scenario trade<span>Sector results</span></button>
      <button aria-pressed={view === 'partners'} onClick={() => setView('partners')}>Trading partners<span>{dataset.year} baseline flows</span></button>
    </div>
    <div className="trade-filters">
      <label className="trade-product-filter">Product / sector<select aria-label="Trade sector filter" value={sectorId} onChange={event => setProduct(event.target.value)}><option value="all">All sectors</option>{dataset.sectors.map(sector => <option key={sector.id} value={sector.id}>{sector.name}</option>)}</select></label>
      <label className="trade-search"><span>{view === 'scenario' ? 'Find a sector' : 'Find a partner'}</span><div><MagnifyingGlass size={15} aria-hidden="true" /><input type="search" aria-label={view === 'scenario' ? 'Search trade sectors' : 'Search trading partners'} placeholder={view === 'scenario' ? 'Search sectors…' : 'Search economies…'} value={view === 'scenario' ? query : partnerQuery} onChange={event => view === 'scenario' ? setQuery(event.target.value) : setPartnerQuery(event.target.value)} /></div></label>
      <FlowSwitch flow={flow} onChange={changeFlow} label="Trade direction" />
    </div>

    {view === 'scenario' ? <div className="trade-scenario-layout">
      <div className="trade-results-column">
        <section className="trade-sector-results" aria-label="Sector trade results">
          <div className="trade-section-heading"><div><h3>{selectedSector ? selectedSector.name : `Trade by sector`}</h3><p>{flow === 'exports' ? 'UAE products sold abroad' : 'Imported products for all UAE buyers'} · USD at baseline prices</p></div><div className="trade-filter-total"><span>{selectedSector ? 'Sector' : 'All sectors'} · scenario {flow}</span><strong>{amount(filtered[flow].scenario)}</strong></div></div>
          <div className="trade-table-scroll" tabIndex={0} role="region" aria-label="Sector trade table, scroll horizontally for all values"><table className="trade-table"><thead><tr>{sortHeader('name', 'Sector')}{sortHeader('baseline', 'Baseline')}{sortHeader('scenario', 'Scenario')}{sortHeader('change', 'Change')}{sortHeader('percentChange', 'Change %')}</tr></thead><tbody>{visibleRows.map(row => <tr key={row.id}>
            <th scope="row"><button onClick={() => onSelectSector(row.id)} aria-label={`Explore ${row.name} sector`}><span>{row.name}</span><ArrowRight size={13} /></button></th>
            <td>{amount(row[flow].baseline)}</td><td>{amount(row[flow].scenario)}</td><td className={tone(flow, row[flow].change)}>{delta(row[flow].change)}</td><td className={tone(flow, row[flow].change)}>{row[flow].percentChange === null ? '—' : percent(row[flow].percentChange)}</td>
          </tr>)}</tbody></table></div>
          {!sortedRows.length && <p className="trade-empty">No sectors match “{query}”.</p>}
          <div className="trade-table-footer"><span>{visibleRows.length} of {sortedRows.length} sectors</span>{sortedRows.length > 10 && <button onClick={() => setShowAllSectors(!showAllSectors)} aria-expanded={showAllSectors}>{showAllSectors ? 'Show top 10' : `Show all ${sortedRows.length}`}<CaretDown size={13} /></button>}</div>
        </section>
        <section className="trade-drivers" aria-label="Largest trade changes"><div className="trade-section-heading"><div><h3>What moves {flow}</h3><p>Largest absolute changes · USD at baseline prices</p></div></div>
          {drivers.length ? <div className="trade-driver-list">{drivers.map(row => <button key={row.id} onClick={() => onSelectSector(row.id)}><span>{row.name}<ArrowRight size={12} /></span><div className={`trade-driver-track ${row[flow].change < 0 ? 'decrease' : ''}`} aria-hidden="true"><i style={{ width: `${Math.abs(row[flow].change) / maxDriver * 100}%` }} /></div><strong className={tone(flow, row[flow].change)}>{delta(row[flow].change)}</strong></button>)}</div> : <p className="trade-empty">Change import prices or foreign demand to explore how trade responds.</p>}
        </section>
      </div>
      <aside className="trade-controls" aria-label="Trade scenario controls">
        <div className="trade-section-heading"><div><span className="trade-eyebrow">Change the scenario</span><h3>Prices & demand</h3></div><SlidersHorizontal size={19} /></div>
        <label className="trade-global-control"><span>Import prices · all products</span><div className="trade-number"><input type="number" aria-label="Global import price change" aria-describedby="trade-global-price-help" min="-20" max="50" step="0.5" value={scenario.freightCost} onChange={event => { if (Number.isFinite(event.target.valueAsNumber)) onChange({ ...scenario, freightCost: Math.min(50, Math.max(-20, event.target.valueAsNumber)) }); }} /><span>%</span></div></label>
        <input type="range" aria-label="Global import price change slider" aria-describedby="trade-global-price-help" min="-20" max="50" step="0.5" value={scenario.freightCost} style={{ '--range-fill': `${(scenario.freightCost + 20) / 70 * 100}%` } as React.CSSProperties} onChange={event => onChange({ ...scenario, freightCost: Number(event.target.value) })} />
        <p className="trade-help" id="trade-global-price-help">−5% makes imported products 5% cheaper for UAE buyers. Individual product settings can override this change.</p>
        {controlSector && inherited && effective && <div className="trade-product-controls">
          <label className="trade-control-product">Change one product<select aria-label="Trade control sector" value={controlSector.id} onChange={event => setControlSectorId(event.target.value)}>{dataset.sectors.map(sector => <option value={sector.id} key={sector.id}>{sector.name}</option>)}</select></label>
          {([
            { key: 'exportDemand', label: 'Foreign demand', min: -40, max: 40, help: '+10% raises foreign demand by 10% at unchanged UAE prices. Prices and output then adjust.' },
            { key: 'importPrice', label: 'Import price', min: -20, max: 50, help: 'The price of this imported product for all UAE buyers. −5% makes it 5% cheaper.' },
          ] as const).map(control => <div className="trade-sector-control" key={control.key}>
            <label><span>{control.label}</span><div className="trade-number"><input type="number" aria-label={`${controlSector.name} trade ${control.label}`} aria-describedby={`trade-control-${control.key}-help`} min={control.min} max={control.max} step="0.5" value={scenario.sectorShocks?.[controlSector.id]?.[control.key] ?? ''} placeholder={String(inherited[control.key])} onChange={event => updateSectorShock(control.key, event.target.value, event.target.valueAsNumber, control.min, control.max)} /><span>%</span></div></label>
            <span className="trade-effective-value">{scenario.sectorShocks?.[controlSector.id]?.[control.key] === undefined ? 'Following broad settings' : 'Product override'} · {percent(effective[control.key], 1)}</span>
            <p className="trade-help" id={`trade-control-${control.key}-help`}>{control.help}</p>
          </div>)}
          <p className="trade-inheritance-help">Clear a product value to follow broad settings. Enter 0 to cancel its broad change.</p>
          <button className="trade-inline-link" onClick={() => onSelectSector(controlSector.id)}>Explore this sector<ArrowRight size={13} /></button>
        </div>}
        <details className="trade-response"><summary>Trade response assumptions<CaretDown size={14} /></summary>{([
          { key: 'substitution', label: 'Import substitution', min: 0, max: 8 },
          { key: 'exportElasticity', label: 'Export response', min: .5, max: 12 },
        ] as const).map(control => <div key={control.key}><label>{control.label}<input type="number" aria-label={`Trade ${control.label}`} aria-describedby={`trade-${control.key}-help`} min={control.min} max={control.max} step="0.5" value={scenario[control.key]} onChange={event => { if (Number.isFinite(event.target.valueAsNumber)) onChange({ ...scenario, [control.key]: Math.min(control.max, Math.max(control.min, event.target.valueAsNumber)) }); }} /></label><p className="trade-help" id={`trade-${control.key}-help`}>{ASSUMPTION_HELP[control.key]} <span>{assumptionExample(control.key, scenario[control.key])}</span></p></div>)}</details>
      </aside>
    </div> : <section className="trade-partners" aria-label="Baseline trading partners">
      <div className="trade-partners-heading"><div><span className="trade-eyebrow">{dataset.year} source accounts · current USD</span><h3>{selectedSector ? `${selectedSector.name} · partners` : 'Where the UAE trades'}</h3><p>{flow === 'exports' ? 'Destinations of UAE exports' : 'Origins of UAE imports'}</p></div><div className="trade-filter-total"><span>Baseline {flow}</span><strong>{amount(partnerTotal)}</strong></div></div>
      {dataset.partners.length ? <div className="trade-partner-layout">
        <div className="trade-partner-ranking">
          <div className="trade-partner-labels"><span>{flow === 'exports' ? 'Destination' : 'Origin'}</span><span>Amount</span><span>Share</span></div>
          <ol className="trade-partner-list">{visiblePartners.map(partner => <li key={partner.id}><button aria-pressed={partner.id === selectedPartner?.id} aria-controls="trade-partner-detail" onClick={() => { setPartnerId(partner.id); setShowAllProducts(false); }}><span className="trade-partner-name">{partner.name}</span><b>{amount(partner[flow])}</b><small>{shareLabel(partner[flow], partnerTotal)}</small><span className="trade-partner-bar" aria-hidden="true"><i style={{ width: `${partner[flow] / maximumPartner * 100}%` }} /></span></button></li>)}</ol>
          {!matchingPartners.length && <p className="trade-empty">No partners match “{partnerQuery}”.</p>}
          {matchingPartners.length > 10 && <button className="trade-expand" onClick={() => setShowAllPartners(!showAllPartners)} aria-expanded={showAllPartners}>{showAllPartners ? 'Show top 10' : `Show all ${matchingPartners.length} partners`}<CaretDown size={13} /></button>}
        </div>
        {selectedPartner && <article className="trade-partner-detail" id="trade-partner-detail" aria-label="Selected trading partner" aria-live="polite">
          <div className="trade-partner-detail-heading"><span>UAE trade with</span><h3>{selectedPartner.name}</h3><p>{dataset.year} baseline · {selectedSector?.name ?? 'All sectors'}{/rest of (the )?world/i.test(selectedPartner.name) ? ' · Grouped economies' : ''}</p></div>
          <div className="trade-bilateral-totals"><div><span>Exports to</span><strong>{amount(selectedPartner.exports)}</strong><small>{shareLabel(selectedPartner.exports, filtered.exports.baseline)} of UAE {selectedSector ? 'sector ' : ''}exports</small></div><div><span>Imports from</span><strong>{amount(selectedPartner.imports)}</strong><small>{shareLabel(selectedPartner.imports, filtered.imports.baseline)} of UAE {selectedSector ? 'sector ' : ''}imports</small></div><div><span>Net exports</span><strong>{amount(selectedPartner.exports - selectedPartner.imports)}</strong><small>Exports minus imports</small></div></div>
          <div className="trade-partner-products">{(['exports', 'imports'] as const).map(direction => {
            const products = dataset.sectors.map((sector, index) => ({ id: sector.id, name: sector.name, value: selectedPartner[direction === 'exports' ? 'exportsBySector' : 'importsBySector'][index] })).filter(row => (sectorId === 'all' || row.id === sectorId) && row.value > 0).sort((a, b) => b.value - a.value);
            const visible = showAllProducts ? products : products.slice(0, 5);
            return <section key={direction} aria-label={`Leading ${direction} with ${selectedPartner.name}`}><h4>{direction === 'exports' ? <ArrowUpRight size={15} /> : <ArrowDownLeft size={15} />}{direction === 'exports' ? 'Exports to' : 'Imports from'} {selectedPartner.name}</h4><ol>{visible.map(product => <li key={product.id}><button onClick={() => onSelectSector(product.id)}><span>{product.name}<ArrowRight size={12} /></span><strong>{amount(product.value)}</strong><small>{shareLabel(product.value, selectedPartner[direction])}</small><i aria-hidden="true" style={{ width: `${share(product.value, selectedPartner[direction])}%` }} /></button></li>)}</ol>{!products.length && <p className="trade-empty">No baseline {direction} for this selection.</p>}{!showAllProducts && products.length > 5 && <p className="trade-products-rest">Other {products.length - 5} sectors <b>{amount(sum(products.slice(5).map(product => product.value)))}</b></p>}</section>;
          })}</div>
          {sectorId === 'all' && <button className="trade-expand" onClick={() => setShowAllProducts(!showAllProducts)} aria-expanded={showAllProducts}>{showAllProducts ? 'Show leading products' : 'Show all products'}<CaretDown size={13} /></button>}
        </article>}
      </div> : <p className="trade-empty">Partner flows are unavailable for this dataset.</p>}
    </section>}
    <footer className="trade-source"><span>{dataset.source} · {dataset.year} · Goods and services</span>{dataset.sourceUrl && <a href={dataset.sourceUrl} target="_blank" rel="noreferrer">Source accounts<ArrowSquareOut size={13} /></a>}</footer>
  </section>;
}
