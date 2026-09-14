import { useMemo } from 'react';
import { ArrowRight } from '@phosphor-icons/react';
import type { Dataset, Result } from './viewTypes';
import { getTradeProfile } from './tradeMetrics';
import './scenario-overview.css';

type Props = {
  dataset: Dataset;
  result: Result;
  onSelectSector: (id: string) => void;
  onTrade: (sectorId?: string, flow?: 'exports' | 'imports') => void;
};

const amount = (value: number) => {
  const absolute = Math.abs(value);
  const billions = absolute >= 1000;
  return `${value < 0 ? '−' : ''}$${(billions ? absolute / 1000 : absolute).toLocaleString('en-US', {minimumFractionDigits: billions ? 2 : 1, maximumFractionDigits: billions ? 2 : 1})}${billions ? 'bn' : 'm'}`;
};
const delta = (value: number) => `${Math.abs(value) < .05 ? '' : value > 0 ? '+' : '−'}${amount(Math.abs(value))}`;
const points = (value: number) => `${Math.abs(value) < .0005 ? '' : value > 0 ? '+' : '−'}${Math.abs(value).toFixed(3)}`;
const direction = (value: number) => Math.abs(value) < .0005 ? 'neutral' : value > 0 ? 'positive' : 'negative';

export default function ScenarioOverview({dataset, result, onSelectSector, onTrade}: Props) {
  const sectors = useMemo(() => {
    const baselineGDP = dataset.sectors.reduce((total, sector) => total + sector.valueAdded, 0);
    return result.sectors.map(sector => ({
      ...sector,
      change: sector.valueAdded * sector.valueAddedChange / 100,
      contribution: baselineGDP > 0 ? sector.valueAdded / baselineGDP * sector.valueAddedChange : 0,
    })).sort((a, b) => Math.abs(b.contribution) - Math.abs(a.contribution) || b.valueAdded - a.valueAdded);
  }, [dataset, result]);
  const trade = useMemo(() => getTradeProfile(dataset, result), [dataset, result]);
  const drivers = useMemo(() => trade.rows.flatMap(row => (['exports', 'imports'] as const).map(flow => ({
    id: `${row.id}-${flow}`, sectorId: row.id, name: row.name, flow,
    label: flow === 'exports' ? 'Exports' : 'Imports', change: row[flow].change,
  }))).filter(row => Math.abs(row.change) >= .05).sort((a, b) => Math.abs(b.change) - Math.abs(a.change)).slice(0, 3), [trade]);
  const largestContribution = Math.max(...sectors.map(sector => Math.abs(sector.contribution)), .000001);

  return <div className="scenario-overview">
    <section className="overview-panel overview-sector-panel" aria-labelledby="overview-sector-heading">
      <div className="overview-panel-heading"><div><h2 id="overview-sector-heading">Sector impact</h2><p>Largest contributions to real GDP change.</p></div><button className="text-button" onClick={() => sectors[0] && onSelectSector(sectors[0].id)}>Explore sectors<ArrowRight size={14}/></button></div>
      <div className="overview-sector-labels" aria-hidden="true"><span>Sector</span><span>Δ Value added</span><span>GDP · p.p.</span></div>
      <ol className="overview-sector-list">{sectors.slice(0, 6).map(sector => <li key={sector.id}>
        <button className="overview-sector-row" onClick={() => onSelectSector(sector.id)} aria-label={`Explore ${sector.name}: value added ${delta(sector.change)}, contribution ${points(sector.contribution)} percentage points to real GDP change`}>
          <span className="overview-sector-name">{sector.name}<span className="overview-impact-track" aria-hidden="true"><i className={direction(sector.contribution)} style={{width:`${Math.abs(sector.contribution) / largestContribution * 50}%`, left:sector.contribution < 0 ? `${50 - Math.abs(sector.contribution) / largestContribution * 50}%` : '50%'}}/></span></span>
          <span className="overview-value-added">{delta(sector.change)}</span><strong className={direction(sector.contribution)}>{points(sector.contribution)}</strong>
        </button>
      </li>)}</ol>
      <p className="overview-definition">Percentage points (p.p.) show how much each sector adds to the economy’s GDP change. Value added is output minus purchased inputs.</p>
    </section>

    <section className="overview-panel overview-trade-panel" aria-labelledby="overview-trade-heading">
      <div className="overview-panel-heading"><div><h2 id="overview-trade-heading">Trade</h2><p>{dataset.year} baseline → scenario</p></div><button className="text-button" onClick={() => onTrade()}>Explore trade<ArrowRight size={14}/></button></div>
      <div className="overview-trade-totals">{([
        {label:'Exports', flow:'exports', level:trade.exports},
        {label:'Imports', flow:'imports', level:trade.imports},
        {label:'Net exports', flow:'netExports', level:trade.netExports},
      ]).map(row => <div className="overview-trade-total" key={row.label}>
        <span className="overview-trade-label">{row.label}</span><div className="overview-trade-levels"><span>{amount(row.level.baseline)}</span><ArrowRight size={11}/><b>{amount(row.level.scenario)}</b></div><strong className={row.flow === 'imports' ? 'overview-import-change' : direction(row.level.change)}>{delta(row.level.change)}</strong>
      </div>)}</div>
      <div className="overview-drivers-heading"><h3>Biggest trade movements</h3><span>Change in value</span></div>
      {drivers.length ? <ul className="overview-trade-drivers">{drivers.map(row => <li key={row.id}><button onClick={() => onTrade(row.sectorId, row.flow)} aria-label={`Explore trade in ${row.name}, ${row.label.toLowerCase()} ${delta(row.change)}`}><span>{row.name}<small>{row.label}</small></span><strong className={row.flow === 'imports' ? 'overview-import-change' : direction(row.change)}>{delta(row.change)}</strong><ArrowRight size={13}/></button></li>)}</ul> : <p className="overview-no-change">Trade is unchanged. Adjust the scenario to compare exports and imports.</p>}
      <p className="overview-definition">USD at baseline prices. Net exports = exports − imports.</p>
    </section>
  </div>;
}
