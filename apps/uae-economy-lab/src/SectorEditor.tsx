import { useMemo, useState } from 'react';
import { MagnifyingGlass, ArrowCounterClockwise } from '@phosphor-icons/react';
import type { Dataset, Scenario, SectorShock } from './viewTypes';
import { effectiveShock, inheritedShock, setSectorShock } from './scenario';

const columns: { key: keyof SectorShock; label: string; min: number; max: number }[] = [
  { key: 'productivity', label: 'Productivity', min: -10, max: 20 },
  { key: 'exportDemand', label: 'Export demand', min: -40, max: 40 },
  { key: 'importPrice', label: 'Import cost', min: -20, max: 50 },
];
export default function SectorEditor({dataset, scenario, onChange, onSelect}: {dataset: Dataset; scenario: Scenario; onChange: (next: Scenario) => void; onSelect: (id: string) => void}) {
  const [query, setQuery] = useState('');
  const [changedOnly, setChangedOnly] = useState(false);
  const changed = useMemo(() => new Set(dataset.sectors.filter(s => Object.values(effectiveShock(scenario, s)).some(v => v !== 0)).map(s => s.id)), [dataset, scenario]);
  const sectors = dataset.sectors.filter(s => s.name.toLowerCase().includes(query.toLowerCase()) && (!changedOnly || changed.has(s.id)));
  return <section className="sector-editor" aria-label="Sector changes">
    <div className="editor-heading"><div><h2>Fine-tune sectors</h2><p>Change as many as you like, together.</p></div><button className="icon-button" aria-label="Clear sector overrides" title="Clear sector overrides" onClick={() => onChange({...scenario, sectorShocks: {}})} disabled={!Object.keys(scenario.sectorShocks || {}).length}><ArrowCounterClockwise size={17}/></button></div>
    <div className="editor-filter"><label><MagnifyingGlass size={16}/><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Find a sector" aria-label="Find a sector to change"/></label><button aria-pressed={changedOnly} onClick={() => setChangedOnly(!changedOnly)}>Changed <span>{changed.size}</span></button></div>
    <div className="sector-input-scroll"><table className="sector-input-table"><thead><tr><th>Sector</th>{columns.map(c => <th key={c.key}>{c.label}<small>% change</small></th>)}</tr></thead><tbody>{sectors.map(sector => {
      const inherited = inheritedShock(scenario, sector);
      return <tr key={sector.id} className={changed.has(sector.id) ? 'has-shock' : ''}><th scope="row"><button className="sector-name-link" title={`Explore ${sector.name}`} onClick={() => onSelect(sector.id)}>{sector.name}</button></th>{columns.map(c => {
        const value = scenario.sectorShocks?.[sector.id]?.[c.key];
        return <td key={c.key}><input type="number" step="0.5" min={c.min} max={c.max} aria-label={`${sector.name} ${c.label}`} title={`Blank follows broad setting: ${inherited[c.key]}%. Range ${c.min}% to ${c.max}%.`} placeholder={String(inherited[c.key])} value={value ?? ''} className={value === undefined ? 'inherited-value' : 'custom-value'} onChange={e => { if (e.target.value === '') onChange(setSectorShock(scenario, sector.id, c.key, undefined)); else if (Number.isFinite(e.target.valueAsNumber)) onChange(setSectorShock(scenario, sector.id, c.key, Math.max(c.min, Math.min(c.max, e.target.valueAsNumber)))); }}/></td>;
      })}</tr>;
    })}</tbody></table>{!sectors.length && <p className="editor-empty">No matching sectors.</p>}</div>
    <div className="editor-note"><span className="inherited-key"/>Faint values follow broad settings.<br/><span className="custom-key"/>Your values replace them. Clear a cell to follow again.</div>
  </section>;
}
