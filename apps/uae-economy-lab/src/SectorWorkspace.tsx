import { useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, BookmarkSimple, DownloadSimple, CaretDown, ArrowSquareOut } from '@phosphor-icons/react';
import type { Dataset, Result, Scenario, SectorShock } from './viewTypes';
import { percent } from './viewTypes';
import { effectiveShock, inheritedShock, setSectorShock } from './scenario';
import { getSectorProfile } from './sectorProfile';
import './sector-workspace.css';

type Props = {
  dataset: Dataset; result: Result; scenario: Scenario; applied: Scenario;
  selectedId: string; previousName?: string; busy: boolean; stale: boolean;
  onSelect: (id: string) => void; onBack: () => void; onChange: (next: Scenario) => void;
  onSave: () => void; onExport: () => void;
};
const usd = (value: number) => `${value < 0 ? '−' : ''}$${(Math.abs(value) / 1000).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}bn`;
const amount = (value: number) => Math.abs(value) < 100 ? `${value < 0 ? '−' : ''}$${Math.abs(value).toLocaleString('en-US', {maximumFractionDigits: 1})}m` : usd(value);
const share = (value: number) => `${value.toFixed(1)}%`;
const deltaAmount = (value: number) => `${Math.abs(value) < .05 ? '' : value < 0 ? '−' : '+'}$${Math.abs(value).toLocaleString('en-US', {minimumFractionDigits: 1, maximumFractionDigits: 1})}m`;
const signClass = (value: number) => Math.abs(value) < .005 ? 'neutral' : value > 0 ? 'positive' : 'negative';
const dimensions: {key: keyof SectorShock; label: string; min: number; max: number; help: string}[] = [
  {key: 'productivity', label: 'Productivity', min: -10, max: 20, help: 'Output per unit of input.'},
  {key: 'exportDemand', label: 'Foreign demand', min: -40, max: 40, help: 'Foreign demand at baseline prices.'},
  {key: 'importPrice', label: 'Imported-product price', min: -20, max: 50, help: 'This product’s import price for all UAE buyers.'},
];

export default function SectorWorkspace(props: Props) {
  const {dataset, result, scenario, applied, selectedId, busy, stale, onSelect, onChange} = props;
  const profile = useMemo(() => getSectorProfile(dataset, result, selectedId), [dataset, result, selectedId]);
  const [allInputs, setAllInputs] = useState(false);
  const [allBuyers, setAllBuyers] = useState(false);
  const [allPartners, setAllPartners] = useState(false);
  if (!profile) return <p className="inline-empty">Choose a sector with available accounts.</p>;
  const {sector, totals, levels, inputs, buyers, partners, finalDemand} = profile;
  const inherited = inheritedShock(scenario, sector);
  const activeChanges = dataset.sectors.flatMap(s => dimensions.flatMap(d => {
    const value = effectiveShock(scenario, s)[d.key];
    return value === 0 ? [] : [{id: `${s.id}-${d.key}`, sectorId: s.id, name: s.name, label: d.label, value}];
  }));
  const select = (id: string) => { setAllInputs(false); setAllBuyers(false); onSelect(id); };
  const inputRows = allInputs ? inputs : inputs.slice(0, 5);
  const buyerRows = allBuyers ? buyers : buyers.slice(0, 5);
  const exportShare = totals.output > 0 ? totals.exports / totals.output * 100 : 0;
  const importedInputShare = totals.intermediateInputs > 0 ? totals.importedInputs / totals.intermediateInputs * 100 : 0;
  const outcomeMetrics = [
    {label:'UAE production', level:levels.output, help:'Gross output, including the value of purchased inputs.'},
    {label:'Value added', level:levels.valueAdded, help:'The sector’s contribution to GDP after subtracting intermediate inputs.'},
    {label:'Exports', level:levels.exports, help:totals.exports > 0 ? 'This sector’s products sold abroad.' : 'No baseline exports; demand changes have no effect.'},
    {label:'Imports into the UAE', level:levels.imports, help:'Imports of this product for all UAE users.'},
  ];
  const outputUses = [
    {id:'industries', name:'UAE businesses', value:totals.domesticIntermediateSales},
    ...finalDemand.filter(row => row.id !== 'exports').map(row => ({id:row.id, name:row.name, value:row.domestic})),
    {id:'exports', name:'Exports', value:totals.exports},
  ].filter(row => row.value !== 0);
  return <section className="sector-workspace" aria-label="Sector workspace" aria-busy={busy}>
    <div className="sector-context">
      <div className="sector-context-title">
        <label htmlFor="sector-focus">Explore a sector</label>
        <select id="sector-focus" aria-label="Explore a sector" value={sector.id} onChange={e => select(e.target.value)}>{dataset.sectors.map(s => <option value={s.id} key={s.id}>{s.name}</option>)}</select>
      </div>
      <div className="sector-context-scenario"><span className={`live-status ${busy || stale ? 'updating' : ''}`}><span className="status-dot"/>{busy ? 'Updating…' : stale ? 'Previous result' : 'Live scenario'}</span><strong>{applied.name}</strong></div>
      <div className="sector-context-actions"><button className="secondary-button" aria-label="Save scenario" title="Save the combined scenario" onClick={props.onSave} disabled={busy || stale}><BookmarkSimple size={16}/>Save</button><button className="secondary-button" aria-label="Export scenario CSV" title="Export the combined scenario and all sector results" onClick={props.onExport} disabled={busy || stale}><DownloadSimple size={16}/>Export</button></div>
    </div>
    {props.previousName && <button className="sector-back text-button" onClick={props.onBack}><ArrowLeft size={14}/>Back to {props.previousName}</button>}
    {stale && <p className="sector-status-note" role="status">{busy ? 'Updating all changes together. Figures below show the last solved scenario.' : 'These changes could not be solved. Figures below show the last solved scenario.'}</p>}

    <section className="sector-outcomes" aria-label="Production and trade results">
      <div className="sector-section-line"><h2>{sector.name}</h2><span>{dataset.year} baseline → scenario · USD at baseline prices</span></div>
      <div className="sector-outcome-grid">{outcomeMetrics.map(m => <div className="sector-outcome" key={m.label}>
        <span title={m.help}>{m.label}</span><strong className={signClass(m.level.percentChange ?? 0)}>{m.level.percentChange === null ? '—' : percent(m.level.percentChange)}</strong>
        <div className="sector-levels"><span>{amount(m.level.baseline)}</span><ArrowRight size={12}/><b>{amount(m.level.scenario)}</b></div>
        <p>{m.help}</p>
      </div>)}</div>
      <div className="sector-price-strip">{[
        {label:'Producer price', value:sector.priceChange, note:'UAE output price'},
        {label:'Input price index', value:sector.intermediateInputPrice, note:'Materials & services; before productivity'},
        {label:'Labor demand', value:sector.employmentChange, note:'Change in labor input'},
      ].map(m => <div key={m.label}><span>{m.label}<small>{m.note}</small></span><strong className={signClass(m.value ?? 0)}>{m.value == null ? '—' : percent(m.value)}</strong></div>)}</div>
      <div className="sector-sales-bridge" aria-label="Output change by domestic use and exports"><span>Where output changed<small>Changes at baseline prices</small></span><div><span>Used within the UAE</span><b className={signClass(levels.domesticSales.change)}>{deltaAmount(levels.domesticSales.change)}</b></div><span aria-hidden="true">+</span><div><span>Exported abroad</span><b className={signClass(levels.exports.change)}>{deltaAmount(levels.exports.change)}</b></div><span aria-hidden="true">=</span><div><span>Total output</span><b className={signClass(levels.output.change)}>{deltaAmount(levels.output.change)}</b></div></div>
    </section>

    <section className="sector-change-panel" aria-label="Change this sector">
      <div className="sector-section-line"><h2>Change this sector</h2><span>Edits combine with every other active change.</span></div>
      <div className="sector-levers">{dimensions.map(d => <label key={d.key}>
        <span>{d.label}</span><div className="sector-lever-input"><input aria-label={`${sector.name} ${d.label}`} type="number" min={d.min} max={d.max} step="0.5"
          value={scenario.sectorShocks?.[sector.id]?.[d.key] ?? ''} placeholder={String(inherited[d.key])}
          onChange={e => {const value = e.target.valueAsNumber; if (e.target.value === '') onChange(setSectorShock(scenario, sector.id, d.key, undefined)); else if (Number.isFinite(value)) onChange(setSectorShock(scenario, sector.id, d.key, Math.min(d.max, Math.max(d.min, value))));}}/><span>%</span></div><small>{d.help}</small>
      </label>)}</div>
      <p className="sector-inheritance-note">Faint values follow broad settings. Clear a cell to follow again; enter 0 to cancel its broad change.</p>
      <details className="sector-active-changes" open={activeChanges.length <= 6}><summary>{activeChanges.length ? `${activeChanges.length} active changes across the economy` : 'No active changes'}<CaretDown size={14}/></summary><div>{activeChanges.map(change => <button key={change.id} onClick={() => select(change.sectorId)} aria-label={`Explore ${change.name}, ${change.label} ${percent(change.value)}`}><span>{change.name}</span><small>{change.label} <b>{percent(change.value, 1)}</b></small></button>)}</div></details>
    </section>

    <div className="sector-section-line sector-network-label"><h2>Follow the money</h2><span>{dataset.source} · {dataset.year} baseline flows</span></div>
    <div className="sector-network-grid">
      <section className="sector-flow-panel" aria-label="Inputs used by this sector">
        <div className="sector-flow-heading"><span className="sector-step">01</span><div><h3>What producers buy</h3><p>Domestic and imported inputs used by this sector.</p></div></div>
        <div className="sector-sourcing-totals"><div><span className="sector-swatch domestic"/>UAE inputs<strong>{amount(totals.domesticInputs)}</strong></div><div><span className="sector-swatch imported"/>Imported inputs<strong>{amount(totals.importedInputs)}</strong></div></div>
        <p className="sector-exposure"><strong>{share(importedInputShare)}</strong> of intermediate purchases are imported.</p>
        <div className="sector-table-scroll"><table className="sector-flow-table"><caption>Supplying products · share of all intermediate purchases</caption><thead><tr><th>Supplier / product</th><th>UAE</th><th>Imported</th><th>Share</th></tr></thead><tbody>{inputRows.map(row => {
          const priceShock = result.appliedSectorShocks[row.id]?.importPrice ?? 0;
          return <tr key={row.id}><th scope="row"><button onClick={() => select(row.id)}>{row.name}<ArrowRight size={12}/></button>{row.imported > 0 && priceShock !== 0 && <small className="sector-input-shock">Import price {percent(priceShock, 1)}</small>}</th><td>{amount(row.domestic)}</td><td>{amount(row.imported)}</td><td>{share(row.share)}</td></tr>;
        })}</tbody></table></div>
        {!inputs.length && <p className="sector-empty">No intermediate inputs in these accounts.</p>}
        {inputs.length > 5 && <button className="sector-expand" onClick={() => setAllInputs(!allInputs)}>{allInputs ? 'Show top 5' : `Show all ${inputs.length} suppliers · ${share(inputs.slice(5).reduce((v, r) => v + r.share, 0))} in the rest`}<CaretDown size={13}/></button>}
        <div className="sector-account-line"><span>All intermediate inputs</span><b>{amount(totals.intermediateInputs)}</b></div><div className="sector-account-line"><span>+ Value added (labor & capital)</span><b>{amount(totals.valueAdded)}</b></div><div className="sector-account-line total"><span>= Gross output</span><b>{amount(totals.output)}</b></div>
      </section>

      <section className="sector-flow-panel" aria-label="Buyers of UAE output">
        <div className="sector-flow-heading"><span className="sector-step">02</span><div><h3>Where UAE output goes</h3><p>Business use, final buyers and foreign markets.</p></div></div>
        <div className="sector-output-uses">{outputUses.map(row => <div key={row.id}><span>{row.name}</span><div className={`sector-use-track ${row.value < 0 ? 'signed' : ''}`}><i style={{width:`${Math.min(100, Math.abs(row.value / totals.output) * 100)}%`}}/></div><b>{amount(row.value)}</b><small>{share(row.value / totals.output * 100)}</small></div>)}</div>
        <p className="sector-exposure"><strong>{share(exportShare)}</strong> of UAE production goes abroad.</p>
        <div className="sector-table-scroll"><table className="sector-flow-table sector-buyers"><caption>UAE business customers · {amount(totals.domesticIntermediateSales)} total</caption><thead><tr><th>Customer</th><th>Buys</th><th>Share</th><th>Output change</th></tr></thead><tbody>{buyerRows.map(row => {
          const change = result.sectors.find(s => s.id === row.id)?.outputChange;
          return <tr key={row.id}><th scope="row"><button onClick={() => select(row.id)}>{row.name}<ArrowRight size={12}/></button></th><td>{amount(row.value)}</td><td>{share(row.share)}</td><td className={signClass(change ?? 0)}>{change == null ? '—' : percent(change)}</td></tr>;
        })}</tbody></table></div>
        {!buyers.length && <p className="sector-empty">No sales to UAE industries in these accounts.</p>}
        {buyers.length > 5 && <button className="sector-expand" onClick={() => setAllBuyers(!allBuyers)}>{allBuyers ? 'Show top 5' : `Show all ${buyers.length} business customers`}<CaretDown size={13}/></button>}
        <p className="sector-definition">Purchases for production · Shares of UAE business sales.</p>
      </section>
    </div>

    <section className="sector-trade-panel" aria-label="Sector trading partners">
      <div className="sector-section-line"><div><h2>Across the border</h2><p>Markets for this sector’s products · {dataset.year} baseline</p></div><button className="text-button" onClick={() => setAllPartners(!allPartners)}>{allPartners ? 'Show top 5' : 'Show all partners'}<CaretDown size={14}/></button></div>
      <div className="sector-partner-grid">{(['exports', 'imports'] as const).map(direction => <div key={direction}>
        <div className="sector-partner-heading"><h3>{direction === 'exports' ? 'Export destinations' : 'Import origins'}</h3><b>{amount(totals[direction])}</b></div>
        <p>{direction === 'exports' ? 'Where foreign buyers of UAE output are located.' : 'Where this imported product comes from, for all UAE users.'}</p>
        <div className="sector-partner-list">{(allPartners ? partners[direction] : partners[direction].slice(0, 5)).map(row => <div key={row.id}><span>{row.name}</span><b>{amount(row.value)}</b><small>{share(row.share)}</small><i aria-hidden="true" style={{width:`${row.share}%`}}/></div>)}</div>
        {!partners[direction].length && <p className="sector-empty">{dataset.partners.length ? 'No baseline trade for this product.' : 'Partner data are not available in these accounts.'}</p>}
        {!allPartners && partners[direction].length > 5 && <div className="sector-partner-rest"><span>Other {partners[direction].length - 5} partners</span><b>{amount(partners[direction].slice(5).reduce((v, row) => v + row.value, 0))}</b><small>{share(partners[direction].slice(5).reduce((v, row) => v + row.share, 0))}</small></div>}
      </div>)}</div>

    </section>

    <details className="sector-assumptions"><summary><span>Response assumptions <small>{applied.laborClosure === 'fixed' ? 'Fixed workforce' : 'Flexible workforce'} · Labor share {applied.laborShare}% · Substitution {applied.substitution} · Export response {applied.exportElasticity}</small></span><CaretDown size={16}/></summary>
      <p>Changes apply across all sectors.</p><div className="sector-assumption-inputs">
        <label>Workforce<select aria-label="Sector workspace workforce" value={scenario.laborClosure} onChange={e => onChange({...scenario, laborClosure:e.target.value as Scenario['laborClosure']})}><option value="fixed">Fixed · wages adjust</option><option value="elastic">Flexible · real wage fixed</option></select><small>Fixed labor moves across sectors. Flexible labor lets total supply adjust.</small></label>
        {([{key:'laborShare',label:'Labor share (%)',min:10,max:90,step:5,help:'Share of value added paid to labor; sector capital stays fixed.'},{key:'substitution',label:'Import substitution',min:0,max:8,step:.5,help:'Higher values allow more switching between domestic and imported products.'},{key:'exportElasticity',label:'Export response',min:.5,max:12,step:.5,help:'Higher values make foreign buyers more sensitive to UAE prices.'}] as const).map(a => <label key={a.key}>{a.label}<input aria-label={`Sector workspace ${a.label}`} type="number" value={scenario[a.key]} min={a.min} max={a.max} step={a.step} onChange={e => {if(Number.isFinite(e.target.valueAsNumber)) onChange({...scenario,[a.key]:Math.min(a.max,Math.max(a.min,e.target.valueAsNumber))});}}/><small>{a.help}</small></label>)}
      </div>
    </details>
    <div className="sector-source"><span>{dataset.source} · {dataset.year}</span><a href={dataset.sourceUrl} target="_blank" rel="noreferrer">Source accounts<ArrowSquareOut size={13}/></a></div>
  </section>;
}
