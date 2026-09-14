import { useId, useState } from 'react';
import type { CSSProperties } from 'react';
import { ArrowSquareOut, ArrowsLeftRight, CaretDown, Graph, GlobeHemisphereEast, SlidersHorizontal } from '@phosphor-icons/react';
import { DEFAULT_SCENARIO } from './viewTypes';
import type { Dataset, Result, Scenario } from './viewTypes';
import './explain.css';

type Props = { dataset: Dataset; result: Result; scenario: Scenario; onChange: (next: Scenario) => void; onExploreSector: () => void };
type Topic = 'assumptions' | 'gtap';

function AssumptionControl({ label, value, unit, min, max, step, description, why, implication, onChange }: {
  label: string; value: number; unit?: string; min: number; max: number; step: number;
  description: string; why: string; implication: string; onChange: (value: number) => void;
}) {
  const id = useId();
  return <section className="explain-assumption">
    <div className="explain-assumption-heading"><label htmlFor={id}>{label}</label><output htmlFor={id}>{value}{unit}</output></div>
    <p id={`${id}-description`}>{description}</p>
    <input id={id} type="range" value={value} min={min} max={max} step={step}
      aria-describedby={`${id}-description`} aria-valuetext={`${value}${unit ?? ''}`}
      style={{ '--range-fill': `${(value - min) / (max - min) * 100}%` } as CSSProperties}
      onChange={event => onChange(Number(event.target.value))} />
    <div className="explain-range-ends"><span>{min}{unit}</span><span>{max}{unit}</span></div>
    <details className="explain-disclosure">
      <summary>Why this starting value? <CaretDown size={13} aria-hidden="true" /></summary>
      <p>{why}</p>
      <p><strong>Changing it:</strong> {implication}</p>
    </details>
  </section>;
}

export default function ExplainView({ dataset, scenario, onChange, onExploreSector }: Props) {
  const [topic, setTopic] = useState<Topic>('assumptions');
  const headingId = useId();
  const update = <K extends keyof Scenario>(key: K, value: Scenario[K]) => onChange({ ...scenario, [key]: value });

  return <div className="explain-view">
    <nav className="explain-nav" aria-label="Learning topics">
      <button onClick={onExploreSector}><Graph size={17} aria-hidden="true" />Sector workspace</button>
      <button aria-pressed={topic === 'assumptions'} onClick={() => setTopic('assumptions')}><SlidersHorizontal size={17} aria-hidden="true" />Assumptions</button>
      <button aria-pressed={topic === 'gtap'} onClick={() => setTopic('gtap')}><GlobeHemisphereEast size={17} aria-hidden="true" />GTAP comparison</button>
    </nav>

    {topic === 'assumptions' && <section className="explain-panel" aria-labelledby={headingId}>
      <div className="explain-section-heading"><div><h3 id={headingId}>Choose how the economy responds</h3><p>These settings change the active scenario. Defaults are illustrative assumptions, not estimated UAE parameters.</p></div>
        <button className="explain-reset" onClick={() => onChange({ ...scenario, laborClosure: DEFAULT_SCENARIO.laborClosure, laborShare: DEFAULT_SCENARIO.laborShare, substitution: DEFAULT_SCENARIO.substitution, exportElasticity: DEFAULT_SCENARIO.exportElasticity })}>Reset assumptions</button>
      </div>
      <div className="explain-concepts">
        <div><span>Your change</span><h4>Shock</h4><p>What you alter, such as productivity, import prices or export demand.</p></div>
        <div><span>Response rule</span><h4>Behavior</h4><p>How strongly firms, households and foreign buyers respond.</p></div>
        <div><span>What stays fixed</span><h4>Closure</h4><p>Which constraints hold, and which variables adjust to balance the economy.</p></div>
      </div>
      <section className="explain-labor-closure">
        <div><h4>Labor market closure</h4><p>Choose what adjusts when sectors need more or less labor.</p></div>
        <fieldset><legend className="visually-hidden">Labor market closure</legend>
          <label className={scenario.laborClosure === 'fixed' ? 'chosen' : ''}><input type="radio" name={`${headingId}-labor`} checked={scenario.laborClosure === 'fixed'} onChange={() => update('laborClosure', 'fixed')} /><span><strong>Fixed total labor</strong><small>Wages adjust; labor moves across sectors.</small></span></label>
          <label className={scenario.laborClosure === 'elastic' ? 'chosen' : ''}><input type="radio" name={`${headingId}-labor`} checked={scenario.laborClosure === 'elastic'} onChange={() => update('laborClosure', 'elastic')} /><span><strong>Flexible labor supply</strong><small>Real wage stays fixed; total labor adjusts.</small></span></label>
        </fieldset>
        <p className="explain-closure-meaning">{scenario.laborClosure === 'fixed'
          ? 'The default holds the existing workforce fixed to study reallocation. Employment gains in one sector are offset elsewhere; the wage clears the labor market.'
          : 'Labor supply can expand or contract without a modeled limit at the baseline real wage. This adds a growth channel, but does not model migration, unemployment or hiring constraints.'}</p>
      </section>
      <div className="explain-assumptions-grid">
        <AssumptionControl label="Labor share of value added" value={scenario.laborShare} unit="%" min={10} max={90} step={1}
          description="Assumed labor payments in every sector; the remainder goes to capital."
          why="60% supplies an illustrative split because the input-output source has no labor/capital income breakdown. It is not observed UAE wage data."
          implication="A higher share gives wages more weight in costs and assigns more factor income to labor. Results can change in either direction."
          onChange={value => update('laborShare', value)} />
        <AssumptionControl label="Domestic/import substitution" value={scenario.substitution} min={0} max={8} step={.25}
          description="How easily buyers switch between domestic and imported versions of a product."
          why="2 allows a moderate illustrative response to relative prices. It is a starting point for sensitivity checks, not a measured UAE elasticity."
          implication="Higher values produce stronger sourcing shifts. At 0, the domestic/import mix stays fixed. At 2, a 1% relative price rise lowers the domestic/import quantity ratio by about 2%, all else equal."
          onChange={value => update('substitution', value)} />
        <AssumptionControl label="Export demand sensitivity" value={scenario.exportElasticity} min={.5} max={12} step={.25}
          description="How strongly foreign buyers respond to UAE export prices."
          why="4 is an illustrative common sensitivity across sectors. The source does not estimate this response."
          implication="At 4, a 1% export-price rise reduces foreign demand by about 4%, before other changes. Higher values make exports more price-sensitive; they do not guarantee larger GDP gains."
          onChange={value => update('exportElasticity', value)} />
      </div>
      <details className="explain-disclosure explain-wide-note"><summary>Other rules held fixed in this version <CaretDown size={14} aria-hidden="true" /></summary>
        <dl className="explain-rule-list">
          <div><dt>Capital stays in each sector</dt><dd>The model isolates adjustment with existing capacity. Expansion can raise capital rents; new investment does not build capacity over time.</dd></div>
          <div><dt>Government and investment volumes stay fixed</dt><dd>This isolates the chosen shocks. Household lump-sum taxes adjust to finance government spending, net of modeled tariff receipts.</dd></div>
          <div><dt>Foreign financing adjusts</dt><dd>Investment less domestic saving determines borrowing or lending. There is no borrowing limit, risk premium or sovereign wealth fund model.</dd></div>
          <div><dt>World import prices are given</dt><dd>The UAE can change its purchases, but foreign production and prices are not solved. Bilateral trade exposure is descriptive.</dd></div>
          <div><dt>Intermediate product requirements are fixed</dt><dd>Domestic/import sourcing can change within each product bundle. Firms cannot freely redesign their mix across products.</dd></div>
          <div><dt>One representative household</dt><dd>Spending follows fixed shares across product bundles. Distributional effects, worker groups, remittances and foreign investment income are absent.</dd></div>
        </dl>
      </details>
      <p className="explain-bottom-note">Try several plausible assumptions and compare the results. This tests sensitivity; it does not produce a statistical confidence interval.</p>
    </section>}

    {topic === 'gtap' && <section className="explain-panel" aria-labelledby={headingId}>
      <div className="explain-section-heading"><div><h3 id={headingId}>How this relates to GTAP</h3><p>Both use economic accounts and market-clearing equations. Their coverage and economic rules differ.</p></div></div>
      <div className="explain-concepts">
        <div><span>The starting economy</span><h4>Database</h4><p>Consistent accounts of who produces, buys and trades what.</p></div>
        <div><span>The economic rules</span><h4>Model</h4><p>Equations describing behavior and how markets balance.</p></div>
        <div><span>The way to run it</span><h4>Software</h4><p>Tools that prepare the data, apply changes and solve the equations.</p></div>
      </div>
      <div className="explain-comparison-wrap"><table className="explain-comparison"><thead><tr><th scope="col">Dimension</th><th scope="col">This UAE model</th><th scope="col">Standard GTAP</th></tr></thead><tbody>
        <tr><th scope="row">Coverage</th><td>Solves the UAE economy. Partner flows show baseline exposure.</td><td>Solves linked regional economies and bilateral trade, including foreign production and demand.</td></tr>
        <tr><th scope="row">Data</th><td>{dataset.source} {dataset.year} accounts with {dataset.sectors.length} sectors. Selected response parameters are assumed.</td><td>GTAP global accounts include production, consumption, bilateral trade, transport and protection data.</td></tr>
        <tr><th scope="row">Behavior</th><td>Simplified production, sourcing and household demand. Four editable response and labor settings.</td><td>More detailed production and household demand systems, with documented parameter sets.</td></tr>
        <tr><th scope="row">Capital and labor</th><td>Capital fixed within each sector. Choose fixed labor or fixed real wage.</td><td>Common closures let capital move between industries and fix regional factor totals. Alternative closures are available.</td></tr>
        <tr><th scope="row">Trade policy</th><td>Import-price and export-demand experiments. Tariff scenarios require observed baseline rates; bilateral policy effects are not solved.</td><td>Bilateral tariff and other policy experiments with interactions across regions.</td></tr>
        <tr><th scope="row">Time</th><td>Static scenario comparison. No dated path or capital accumulation.</td><td>The standard model is also comparative static. Dynamic GTAP is a separate extension.</td></tr>
      </tbody></table></div>
      <div className="explain-doc-links">
        <a href="https://www.gtap.agecon.purdue.edu/models/current.asp" target="_blank" rel="noreferrer">Official GTAP model <ArrowSquareOut size={14} aria-hidden="true" /></a>
        <a href="https://www.gtap.agecon.purdue.edu/databases/v12/index.aspx" target="_blank" rel="noreferrer">GTAP data <ArrowSquareOut size={14} aria-hidden="true" /></a>
        <a href="https://www.gtap.agecon.purdue.edu/models/dynamic/model.asp" target="_blank" rel="noreferrer">Dynamic GTAP <ArrowSquareOut size={14} aria-hidden="true" /></a>
      </div>
      <details className="explain-disclosure explain-wide-note"><summary>What a closer UAE implementation would need <CaretDown size={14} aria-hidden="true" /></summary>
        <p>Start from GTAP’s regional data and model equations, retain the UAE and relevant trading partners, select a closure, and reproduce the benchmark. Validate a simple experiment against the original implementation before extending it.</p>
        <p>UAE policy analysis also needs appropriate tariff schedules, oil/gas and electricity detail, national/expatriate labor, re-export margins and fiscal/external income accounts. Standard GTAP itself does not automatically supply every UAE-specific mechanism.</p>
      </details>
      <p className="explain-bottom-note"><ArrowsLeftRight size={16} aria-hidden="true" />Matching baseline accounts checks accounting consistency. Policy credibility also requires validated behavior, relevant mechanisms and sensitivity analysis.</p>
    </section>}
  </div>;
}
