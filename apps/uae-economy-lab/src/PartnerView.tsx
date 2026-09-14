import { useId, useMemo, useState } from 'react';
import { ArrowDownLeft, ArrowUpRight, CaretDown, CaretUp, GlobeHemisphereEast } from '@phosphor-icons/react';
import type { Dataset } from './viewTypes';
import './partner.css';

type Flow = 'exports' | 'imports';
const sum = (values: number[]) => values.reduce((a, b) => a + b, 0);
const billions = (value: number) => value > 0 && value < 1
  ? '<0.001'
  : (value / 1000).toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: value < 1000 ? 3 : 1 });
const share = (value: number, total: number) => total > 0 ? 100 * value / total : 0;
const shareLabel = (value: number) => value > 0 && value < 0.1 ? '<0.1%' : `${value.toFixed(1)}%`;

export function PartnerView({ dataset, onSelect }: { dataset: Dataset; onSelect: (id: string) => void }) {
  const [flow, setFlow] = useState<Flow>('exports');
  const [sectorId, setSectorId] = useState('all');
  const [showAll, setShowAll] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const headingId = useId();
  const detailId = useId();
  const sectorIndex = dataset.sectors.findIndex(s => s.id === sectorId);
  const sector = sectorIndex >= 0 ? dataset.sectors[sectorIndex] : undefined;
  const valuesKey = flow === 'exports' ? 'exportsBySector' : 'importsBySector';
  const ranked = useMemo(() => dataset.partners.map(partner => ({
    ...partner,
    value: sectorIndex < 0 ? sum(partner[valuesKey]) : partner[valuesKey][sectorIndex],
  })).sort((a, b) => b.value - a.value || a.name.localeCompare(b.name)), [dataset, valuesKey, sectorIndex]);
  const total = sum(ranked.map(p => p.value));
  const visible = showAll ? ranked : ranked.slice(0, 12);
  const visibleShare = share(sum(visible.map(p => p.value)), total);
  const maximum = ranked[0]?.value ?? 0;
  const selected = ranked.find(p => p.id === selectedId)
    ?? ranked.find(p => !/rest of (the )?world/i.test(p.name))
    ?? ranked[0];
  const selectedSectors = selected ? dataset.sectors.map((item, index) => ({
    ...item, value: selected[valuesKey][index],
  })).filter(item => sectorIndex < 0 || item.id === sector?.id)
    .sort((a, b) => b.value - a.value).slice(0, 5) : [];
  const direction = flow === 'exports' ? 'to' : 'from';
  const FlowIcon = flow === 'exports' ? ArrowUpRight : ArrowDownLeft;

  if (!dataset.partners.length) return <section className="partner-view partner-empty" aria-labelledby={headingId}>
    <GlobeHemisphereEast size={28} aria-hidden="true" />
    <h2 id={headingId}>Partner data unavailable</h2>
    <p>This dataset includes national trade totals but no bilateral flows.</p>
  </section>;

  return <section className="partner-view" aria-labelledby={headingId}>
    <header className="partner-heading">
      <div>
        <span className="partner-source">{dataset.year} baseline · {dataset.source}</span>
        <h2 id={headingId}>Trading partners</h2>
      </div>

    </header>

    <div className="partner-controls">
      <label>Trade flow
        <select value={flow} onChange={event => { setFlow(event.target.value as Flow); setShowAll(false); }}>
          <option value="exports">UAE exports</option>
          <option value="imports">UAE imports</option>
        </select>
      </label>
      <label className="partner-sector-filter">Sector
        <select value={sector?.id ?? 'all'} onChange={event => { setSectorId(event.target.value); setShowAll(false); }}>
          <option value="all">All sectors</option>
          {dataset.sectors.map(item => <option value={item.id} key={item.id}>{item.name}</option>)}
        </select>
      </label>
    </div>

    <div className="partner-summary" aria-live="polite">
      <div className="partner-total"><FlowIcon size={19} aria-hidden="true" />
        <strong>${billions(total)}<span>bn</span></strong>
        <span>{sector ? `${sector.name} ${flow}` : `Total ${flow}`}</span>
      </div>
      <p>{total > 0 ? <><strong>{shareLabel(visibleShare)}</strong> across {showAll ? 'all' : `the top ${visible.length}`} partners</> : `No recorded ${flow} in this sector`}</p>
    </div>

    <div className="partner-layout">
      <div className="partner-ranking">
        <div className="partner-column-labels" aria-hidden="true"><span>Partner</span><span>USD bn</span><span>Share</span></div>
        <ol className="partner-list">
          {visible.map(partner => <li key={partner.id}>
            <button className={`partner-row${partner.id === selected?.id ? ' selected' : ''}`}
              aria-pressed={partner.id === selected?.id} aria-controls={detailId}
              aria-label={`${partner.name}: ${billions(partner.value)} billion US dollars, ${shareLabel(share(partner.value, total))} of ${sector ? sector.name + ' ' : ''}${flow}. View sector detail.`}
              onClick={() => setSelectedId(partner.id)}>
              <span className="partner-country">{partner.name}</span>
              <span className="partner-bar-track" aria-hidden="true"><span style={{ width: `${maximum > 0 ? partner.value / maximum * 100 : 0}%` }} /></span>
              <span className="partner-amount">{billions(partner.value)}</span>
              <span className="partner-share">{shareLabel(share(partner.value, total))}</span>
            </button>
          </li>)}
        </ol>
        {ranked.length > 12 && <button className="partner-show-all" onClick={() => setShowAll(!showAll)} aria-expanded={showAll}>
          {showAll ? 'Show top 12' : `Show all ${ranked.length} partners`}
          {showAll ? <CaretUp size={13} aria-hidden="true" /> : <CaretDown size={13} aria-hidden="true" />}
        </button>}
      </div>

      {selected && <aside className="partner-detail" id={detailId} aria-label="Selected partner detail" aria-live="polite">
        <span className="partner-detail-label">UAE {flow} {direction}</span>
        <h3>{selected.name}</h3>
        <div className="partner-detail-total">${billions(selected.value)}<span>bn</span></div>
        <p className="partner-detail-share">{shareLabel(share(selected.value, total))} of {sector ? 'this sector’s' : 'UAE'} {flow}</p>
        <div className="partner-detail-divider" />
        <h4>{sector ? 'Selected sector' : 'Leading sectors'}</h4>
        <ul className="partner-sector-list">
          {selectedSectors.map(item => <li key={item.id}>
            <div><button className="sector-name-link" onClick={() => onSelect(item.id)}>{item.name}</button><strong>${billions(item.value)}bn</strong></div>
            <div className="partner-mini-track" aria-hidden="true"><span style={{ width: `${share(item.value, selected.value)}%` }} /></div>
          </li>)}
        </ul>
        {/rest of (the )?world/i.test(selected.name) && <p className="partner-detail-note">Economies grouped together in the source.</p>}
      </aside>}
    </div>

    <footer className="partner-note">Goods and services · Current USD</footer>
  </section>;
}

export default PartnerView;
