---
layout: simulation
title: Abu Dhabi Urban Dynamics Lab
permalink: /projects/abu-dhabi-urban-dynamics/
description: Explore how transport costs, road capacity, housing, and access to jobs can reshape the Emirate of Abu Dhabi over a decade.
eyebrow: UDES-inspired policy sandbox
importance: 1
category: simulation
map: true
udes_simulation: true
visual:
  key: urban-dynamics
  icon: fa-solid fa-map-location-dot
  label: interactive simulation
  headline: Abu Dhabi Urban Dynamics Lab
  summary: A browser-based land-use and transport scenario explorer grounded in real Abu Dhabi geography and OSM roads.
  chips:
    - urban dynamics
    - transport
    - land use
    - Abu Dhabi
---

<div
  class="udes-app"
  data-udes-root
  data-network-url="{{ '/assets/data/udes/abu-dhabi-corridors.json' | relative_url }}"
>
  <section class="udes-command" aria-label="Simulation controls">
    <div class="udes-command__status">
      <span class="udes-status-dot" aria-hidden="true"></span>
      <div>
        <span class="udes-label">Model clock</span>
        <strong id="udes-date">January 2026</strong>
      </div>
      <p id="udes-live-status" class="udes-sr-only" role="status" aria-live="polite">Simulation ready.</p>
    </div>

    <div class="udes-command__transport" role="group" aria-label="Playback">
      <button class="udes-button udes-button--primary" type="button" data-action="play" aria-label="Run or pause simulation" aria-pressed="false" disabled>
        <span data-play-label>Run model</span>
      </button>
      <button class="udes-button" type="button" data-action="step" disabled>Step one month</button>
      <button class="udes-button udes-button--quiet" type="button" data-action="reset">Reset</button>
    </div>

    <div class="udes-command__timeline">
      <label class="udes-label" for="udes-progress">2026 <span>to</span> 2036</label>
      <progress id="udes-progress" value="0" max="120">0 of 120 months</progress>
    </div>

    <fieldset class="udes-speed">
      <legend class="udes-label">Speed</legend>
      <button type="button" data-speed="1" aria-pressed="true">1x</button>
      <button type="button" data-speed="4" aria-pressed="false">4x</button>
      <button type="button" data-speed="12" aria-pressed="false">12x</button>
    </fieldset>

  </section>

  <div class="udes-workbench">
    <aside class="udes-panel udes-controls" aria-labelledby="udes-scenarios-title">
      <div class="udes-panel__heading">
        <div>
          <span class="udes-label">Policy desk</span>
          <h2 id="udes-scenarios-title">Shape the scenario</h2>
        </div>
        <button class="udes-icon-button" type="button" data-action="reset-levers" aria-label="Restore default policy levers">Reset</button>
      </div>

      <fieldset class="udes-presets">
        <legend>Starting point</legend>
        <button type="button" data-scenario="baseline" aria-pressed="true">
          <strong>Reference</strong>
          <span>Current model assumptions</span>
        </button>
        <button type="button" data-scenario="transit" aria-pressed="false">
          <strong>Transit first</strong>
          <span>Faster, cheaper public transport</span>
        </button>
        <button type="button" data-scenario="housing" aria-pressed="false">
          <strong>Connected homes</strong>
          <span>More capacity near job centres</span>
        </button>
        <button type="button" data-scenario="roads" aria-pressed="false">
          <strong>Road expansion</strong>
          <span>Higher speed and capacity</span>
        </button>
      </fieldset>

      <details class="udes-control-group" open>
        <summary>City levers</summary>
        <div class="udes-control-list">
          <label class="udes-range" for="udes-pt-fare">
            <span>Public transport fare <output id="udes-pt-fare-output" for="udes-pt-fare">AED 2.00</output></span>
            <input id="udes-pt-fare" data-lever="ptFare" type="range" min="0.5" max="5" value="2" step="0.25">
            <small>One-way generalized fare</small>
          </label>
          <label class="udes-range" for="udes-pt-speed">
            <span>Public transport speed <output id="udes-pt-speed-output" for="udes-pt-speed">28 km/h</output></span>
            <input id="udes-pt-speed" data-lever="ptSpeed" type="range" min="15" max="50" value="28" step="1">
          </label>
          <label class="udes-range" for="udes-pt-wait">
            <span>Average wait <output id="udes-pt-wait-output" for="udes-pt-wait">8 min</output></span>
            <input id="udes-pt-wait" data-lever="ptWait" type="range" min="2" max="20" value="8" step="1">
          </label>
          <label class="udes-range" for="udes-car-cost">
            <span>Car operating cost <output id="udes-car-cost-output" for="udes-car-cost">AED 0.35/km</output></span>
            <input id="udes-car-cost" data-lever="carCost" type="range" min="0.1" max="1.2" value="0.35" step="0.05">
          </label>
          <label class="udes-range" for="udes-road-speed">
            <span>Road free-flow speed <output id="udes-road-speed-output" for="udes-road-speed">60 km/h</output></span>
            <input id="udes-road-speed" data-lever="roadSpeed" type="range" min="30" max="100" value="60" step="5">
          </label>
          <label class="udes-range" for="udes-road-capacity">
            <span>Road capacity <output id="udes-road-capacity-output" for="udes-road-capacity">100%</output></span>
            <input id="udes-road-capacity" data-lever="roadCapacity" type="range" min="0.6" max="1.8" value="1" step="0.05">
          </label>
          <label class="udes-range" for="udes-rent-policy">
            <span>Annual rent pressure <output id="udes-rent-policy-output" for="udes-rent-policy">Neutral</output></span>
            <input id="udes-rent-policy" data-lever="rentPolicy" type="range" min="0.92" max="1.08" value="1" step="0.01">
          </label>
        </div>
      </details>

      <details class="udes-control-group" open>
        <summary>Selected study zone</summary>
        <div class="udes-zone-control__header">
          <label for="udes-zone-select">Zone</label>
          <select id="udes-zone-select" data-zone-select>
            <option value="downtown">Abu Dhabi Island</option>
            <option value="reem">Reem / Maryah</option>
            <option value="saadiyat">Saadiyat</option>
            <option value="yas">Yas / Al Raha</option>
            <option value="khalifa">Khalifa City</option>
            <option value="mbz">MBZ / Mussafah</option>
            <option value="alain">Al Ain</option>
            <option value="ruwais">Al Dhafra / Ruwais</option>
          </select>
        </div>
        <div class="udes-control-list">
          <label class="udes-range" for="udes-zone-housing">
            <span>Housing capacity <output id="udes-zone-housing-output" for="udes-zone-housing">100%</output></span>
            <input id="udes-zone-housing" data-zone-lever="housing" type="range" min="70" max="160" value="100" step="5">
          </label>
          <label class="udes-range" for="udes-zone-quality">
            <span>Place quality <output id="udes-zone-quality-output" for="udes-zone-quality">0.82</output></span>
            <input id="udes-zone-quality" data-zone-lever="quality" type="range" min="0.4" max="1" value="0.82" step="0.01">
          </label>
          <label class="udes-range" for="udes-zone-jobs">
            <span>Employment space <output id="udes-zone-jobs-output" for="udes-zone-jobs">100%</output></span>
            <input id="udes-zone-jobs" data-zone-lever="jobs" type="range" min="70" max="160" value="100" step="5">
          </label>
          <label class="udes-range" for="udes-zone-rent">
            <span>Housing rent index <output id="udes-zone-rent-output" for="udes-zone-rent">100</output></span>
            <input id="udes-zone-rent" data-zone-lever="rent" type="range" min="60" max="160" value="100" step="2">
          </label>
        </div>
      </details>
    </aside>

    <section class="udes-map-panel" aria-labelledby="udes-map-title">
      <div class="udes-map-panel__bar">
        <div>
          <span class="udes-label">Emirate of Abu Dhabi</span>
          <h2 id="udes-map-title">Movement across the emirate</h2>
        </div>
        <div class="udes-map-tools">
          <fieldset aria-label="Map metric">
            <button type="button" data-map-mode="load" data-map-only aria-pressed="true">Road load</button>
            <button type="button" data-map-mode="population" data-map-only aria-pressed="false">Population</button>
            <button type="button" data-map-mode="happiness" data-map-only aria-pressed="false">Satisfaction</button>
          </fieldset>
          <button class="udes-button udes-button--quiet" type="button" data-action="emirate-view" data-map-only>Focus metro</button>
        </div>
      </div>

      <div class="udes-map-wrap">
        <div
          id="udes-map"
          class="udes-map"
          role="region"
          aria-label="Interactive OpenStreetMap of the Emirate of Abu Dhabi with eight model study zones and commuter corridors"
          aria-describedby="udes-map-summary"
        ></div>
        <div class="udes-map-empty" id="udes-map-empty" data-map-empty role="status" hidden>
          <strong>The map could not be loaded.</strong>
          <span>The model and its results remain available in the tables below.</span>
        </div>
        <div class="udes-map-key" data-map-key role="group" aria-label="Road load legend">
          <div data-map-key-mode="load">
            <span><i class="udes-key-line udes-key-line--free"></i> Flowing</span>
            <span><i class="udes-key-line udes-key-line--busy"></i> Busy</span>
            <span><i class="udes-key-line udes-key-line--strained"></i> Strained</span>
          </div>
          <div data-map-key-mode="population" hidden>
            <span><i class="udes-key-circle udes-key-circle--small"></i> Fewer residents</span>
            <span><i class="udes-key-circle udes-key-circle--large"></i> More residents</span>
          </div>
          <div data-map-key-mode="happiness" hidden>
            <span><i class="udes-key-circle udes-key-circle--high"></i> Index 75+</span>
            <span><i class="udes-key-circle udes-key-circle--medium"></i> Index 65–74</span>
            <span><i class="udes-key-circle udes-key-circle--low"></i> Below 65</span>
          </div>
        </div>
        <div class="udes-map-note" id="udes-network-status" data-network-status>Loading OSM-derived corridors...</div>
      </div>

      <div class="udes-map-actions">
        <div>
          <strong>Test a model-only connection</strong>
          <span>Choose two study zones or select them directly on the map.</span>
        </div>
        <div class="udes-connector-form">
          <label>From
            <select data-connector-from data-map-only>
              <option value="downtown">Abu Dhabi Island</option>
              <option value="reem">Reem / Maryah</option>
              <option value="saadiyat">Saadiyat</option>
              <option value="yas">Yas / Al Raha</option>
              <option value="khalifa">Khalifa City</option>
              <option value="mbz">MBZ / Mussafah</option>
              <option value="alain">Al Ain</option>
              <option value="ruwais">Al Dhafra / Ruwais</option>
            </select>
          </label>
          <label>To
            <select data-connector-to data-map-only>
              <option value="reem">Reem / Maryah</option>
              <option value="downtown">Abu Dhabi Island</option>
              <option value="saadiyat">Saadiyat</option>
              <option value="yas">Yas / Al Raha</option>
              <option value="khalifa">Khalifa City</option>
              <option value="mbz">MBZ / Mussafah</option>
              <option value="alain">Al Ain</option>
              <option value="ruwais">Al Dhafra / Ruwais</option>
            </select>
          </label>
          <button class="udes-button" type="button" data-action="connector" data-map-only>Add connector</button>
          <button class="udes-button udes-button--quiet" type="button" data-action="connector-map" data-map-only aria-pressed="false">Choose on map</button>
        </div>
      </div>

      <p class="udes-map-summary" id="udes-map-summary">
        Eight synthetic study zones span metropolitan Abu Dhabi, Al Ain, and Al Dhafra through representative routes derived from OpenStreetMap. Abu Dhabi Island is selected.
      </p>
    </section>

    <aside class="udes-panel udes-results" aria-labelledby="udes-results-title">
      <div class="udes-panel__heading">
        <div>
          <span class="udes-label">Live outcomes</span>
          <h2 id="udes-results-title">City pulse</h2>
        </div>
        <span class="udes-model-state" data-model-state>Ready</span>
      </div>

      <div class="udes-kpis">
        <article>
          <span>Satisfaction index</span>
          <strong data-kpi="happiness">--</strong>
          <small data-delta="happiness">Reference month</small>
        </article>
        <article>
          <span>Mean commute</span>
          <strong data-kpi="commute">--</strong>
          <small data-delta="commute">Round trip</small>
        </article>
        <article>
          <span>Car mode share</span>
          <strong data-kpi="carShare">--</strong>
          <small data-delta="carShare">Daily commutes</small>
        </article>
        <article>
          <span>Average road load</span>
          <strong data-kpi="roadLoad">--</strong>
          <small data-delta="roadLoad">Volume / capacity</small>
        </article>
        <article>
          <span>Transport CO<sub>2</sub> index</span>
          <strong data-kpi="co2">--</strong>
          <small data-delta="co2">Start = 100</small>
        </article>
        <article>
          <span>Represented residents</span>
          <strong data-kpi="population">--</strong>
          <small>Synthetic population</small>
        </article>
      </div>

      <section class="udes-zone-brief" aria-labelledby="udes-zone-brief-title">
        <div>
          <span class="udes-label">Selected zone</span>
          <h3 id="udes-zone-brief-title" data-zone-name>Abu Dhabi Island</h3>
        </div>
        <dl>
          <div><dt>Residents</dt><dd data-zone-stat="population">--</dd></div>
          <div><dt>Jobs</dt><dd data-zone-stat="jobs">--</dd></div>
          <div><dt>Rent index</dt><dd data-zone-stat="rent">--</dd></div>
          <div><dt>Satisfaction index</dt><dd data-zone-stat="happiness">--</dd></div>
        </dl>
        <p data-zone-insight>Run the model to see how accessibility and affordability interact here.</p>
      </section>

      <section class="udes-signal" aria-labelledby="udes-signal-title">
        <span class="udes-label">Planner note</span>
        <h3 id="udes-signal-title" data-insight-title>Start with a reference run</h3>
        <p data-insight-copy>Then change one lever at a time. The strongest policy signals are easier to interpret when the starting point is stable.</p>
      </section>
    </aside>

  </div>

  <section class="udes-analysis" aria-labelledby="udes-analysis-title">
    <div class="udes-analysis__heading">
      <div>
        <span class="udes-label">Across the decade</span>
        <h2 id="udes-analysis-title">Watch the trade-offs accumulate</h2>
      </div>
      <div class="udes-chart-legend" role="group" aria-label="Chart legend">
        <span><i class="udes-legend-dot udes-legend-dot--satisfaction"></i>Satisfaction index</span>
        <span><i class="udes-legend-dot udes-legend-dot--car"></i>Car share</span>
        <span><i class="udes-legend-dot udes-legend-dot--co2"></i>CO<sub>2</sub> index</span>
      </div>
    </div>

    <div class="udes-chart-card">
      <svg
        class="udes-chart"
        data-history-chart
        viewBox="0 0 720 240"
        role="img"
        aria-labelledby="udes-chart-title udes-chart-description"
        preserveAspectRatio="none"
      >
        <title id="udes-chart-title">Simulation outcome history</title>
        <desc id="udes-chart-description">Satisfaction index, car mode share, and carbon dioxide index over the ten-year model horizon.</desc>
        <g class="udes-chart__grid" aria-hidden="true">
          <line x1="48" y1="28" x2="700" y2="28"></line>
          <line x1="48" y1="87" x2="700" y2="87"></line>
          <line x1="48" y1="146" x2="700" y2="146"></line>
          <line x1="48" y1="205" x2="700" y2="205"></line>
        </g>
        <g class="udes-chart__labels" aria-hidden="true">
          <text x="8" y="33">120</text>
          <text x="19" y="92">75</text>
          <text x="19" y="151">50</text>
          <text x="19" y="210">25</text>
          <text x="48" y="232">2026</text>
          <text x="355" y="232">2031</text>
          <text x="665" y="232">2036</text>
        </g>
        <path class="udes-chart__line udes-chart__line--satisfaction" data-series="happiness" d=""></path>
        <path class="udes-chart__line udes-chart__line--car" data-series="carShare" d=""></path>
        <path class="udes-chart__line udes-chart__line--co2" data-series="co2" d=""></path>
      </svg>
      <p class="udes-chart-fallback" data-chart-summary>Run the model to build a readable history of the three indicators.</p>
    </div>

  </section>

  <section class="udes-zone-table-section" aria-labelledby="udes-zone-table-title">
    <div class="udes-analysis__heading">
      <div>
        <span class="udes-label">Zone comparison</span>
        <h2 id="udes-zone-table-title">Where change is landing</h2>
      </div>
      <p>Model values are synthetic and scaled for comparison; they are not official statistics.</p>
    </div>
    <div class="udes-table-wrap">
      <table class="udes-table">
        <caption>Modeled outcomes by synthetic study zone</caption>
        <thead>
          <tr>
            <th scope="col">Study zone</th>
            <th scope="col">Residents</th>
            <th scope="col">Jobs</th>
            <th scope="col">Rent index</th>
            <th scope="col">Satisfaction index</th>
            <th scope="col">Car share</th>
          </tr>
        </thead>
        <tbody data-zone-table></tbody>
      </table>
    </div>
  </section>

  <section class="udes-method" aria-labelledby="udes-method-title">
    <div>
      <span class="udes-label">Method and limits</span>
      <h2 id="udes-method-title">A transparent educational adaptation</h2>
    </div>
    <div class="udes-method__copy">
      <p>
        This browser model is an aggregate educational adaptation of TU Delft's Urban Dynamics Educational Simulator. Zone-level population and employment totals evolve from housing capacity and place quality, while resident location choice responds to rent, job access, and commute time. Commuters choose between car, public transport, and walking; traffic feeds back into road travel time; and zone rents adjust over time.
      </p>
      <p>
        Abu Dhabi's geography is real, and the representative corridors follow routes derived from OpenStreetMap. The people, firms, capacities, behavioral coefficients, and policy outcomes are synthetic. The satisfaction index is a modeled composite of affordability, commute time, place quality, and job access—not an observed share of satisfied residents. Use this as a conversation and learning tool, not as an engineering model or an official Emirate forecast.
      </p>
      <details>
        <summary>Model assumptions</summary>
        <ul>
          <li>Eight study zones approximate metropolitan, Al Ain, and Al Dhafra clusters; they are not administrative boundaries.</li>
          <li>Each monthly step aggregates daily commute choices made by a synthetic representative population.</li>
          <li>Metropolitan Abu Dhabi, Al Ain, and Al Dhafra are treated as distinct labour markets with a small modeled share of inter-regional commuting.</li>
          <li>Car and public-transport choice follows the UDES binary-logit structure; same-zone commuters can walk.</li>
          <li>Mode utilities retain the published UDES coefficients: car = 3 − 0.30 × cost − 0.05 × time; public transport = −0.30 × fare − 0.035 × time − 0.060 × waiting time.</li>
          <li>Corridor time combines a 1.2-minute link allowance, the OSRM reference duration adjusted by the road-speed lever, and 1.8 minutes multiplied by volume-to-capacity.</li>
          <li>Road travel time responds to volume relative to capacity, while rents respond annually to occupancy, jobs, and quality.</li>
          <li>Public transport is generic and does not claim to reproduce official Abu Dhabi bus routes or schedules.</li>
          <li>The traffic overlay assigns demand to eleven aggregate OSM-derived corridors; shared road segments and turn movements are not modeled as a full street-level network.</li>
        </ul>
      </details>
      <div class="udes-method__links">
        <a href="https://cloud.anylogic.com/model/47990ad8-ab7c-4fc5-88e5-0e3771cb5303?mode=SETTINGS">Open the original UDES model</a>
        <a href="https://www.anylogic.com/upload/iblock/198/1985a2d61b26c2d23acd158ab6e5d68e.pdf">Read the UDES v1.4 paper</a>
        <a href="https://research.tudelft.nl/en/datasets/urban-dynamics-educational-simulator-udes/">TU Delft software record</a>
        <a href="https://www.openstreetmap.org/copyright">OpenStreetMap copyright and licence</a>
      </div>
    </div>
  </section>

  <noscript>
    <p class="udes-noscript">This interactive model needs JavaScript. The method, limitations, and source links above remain available without it.</p>
  </noscript>
</div>
