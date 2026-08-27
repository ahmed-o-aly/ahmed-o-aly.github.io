---
layout: simulation-v2
title: Abu Dhabi Urban Dynamics Lab · Analyst Preview
permalink: /projects/abu-dhabi-urban-dynamics-v2/
description: A desktop agent-based planning console for exploring housing, enterprise, and mobility scenarios across Greater Abu Dhabi City.
eyebrow: Calibrated agent model
importance: 99
category: simulation
preview: true
map: true
udes_v2: true
model_url: /assets/data/udes-v2/baseline.json
worker_url: /assets/js/udes-v2-worker.js
chart:
  echarts: true
visual:
  key: urban-dynamics-v2
  icon: fa-solid fa-chart-line
  label: analyst console
  headline: Abu Dhabi Urban Dynamics Lab v2
  summary: A map-first analyst console for inspecting citizen, enterprise, housing, and transport dynamics across Greater Abu Dhabi City.
  chips:
    - simulation
    - policy analysis
    - land use
    - mobility
---

<div class="udes-v2-console" data-udes-v2-console>
  <aside class="udes-v2-controls" aria-labelledby="udes-v2-controls-title" data-udes-v2-controls>
    <div class="udes-v2-panel-heading">
      <div>
        <span class="udes-v2-kicker">Model inputs</span>
        <h2 id="udes-v2-controls-title">Scenario controls</h2>
      </div>
      <button class="udes-v2-text-button" type="button" data-udes-v2-action="reset-levers">Reset inputs</button>
    </div>

    <div class="udes-v2-controls__scroll">
      <fieldset class="udes-v2-scenario-list">
        <legend>Policy package</legend>
        <button type="button" data-udes-v2-scenario="reference" aria-pressed="true">
          <span>Reference</span>
          <small>Current assumptions</small>
        </button>
        <button type="button" data-udes-v2-scenario="transit" aria-pressed="false">
          <span>Transit first</span>
          <small>Lower fares, faster buses</small>
        </button>
        <button type="button" data-udes-v2-scenario="housing" aria-pressed="false">
          <span>Connected housing</span>
          <small>Capacity near jobs</small>
        </button>
        <button type="button" data-udes-v2-scenario="balanced" aria-pressed="false">
          <span>Balanced growth</span>
          <small>Multi-sector package</small>
        </button>
      </fieldset>

      <section class="udes-v2-control-section" aria-labelledby="udes-v2-scope-title">
        <div class="udes-v2-section-heading">
          <h3 id="udes-v2-scope-title">Scope</h3>
          <span>18 districts</span>
        </div>
        <label class="udes-v2-select-row" for="udes-v2-focus-zone">
          <span>Focus zone</span>
          <select id="udes-v2-focus-zone" data-udes-v2-focus-zone>
            <option value="city">Loading Greater Abu Dhabi City districts…</option>
          </select>
        </label>
        <label class="udes-v2-select-row" for="udes-v2-horizon">
          <span>Horizon</span>
          <select id="udes-v2-horizon" data-udes-v2-horizon>
            <option value="120">10 years</option>
            <option value="60">5 years</option>
            <option value="24">2 years</option>
          </select>
        </label>
        <label class="udes-v2-select-row" for="udes-v2-seed">
          <span>Random seed</span>
          <input id="udes-v2-seed" type="number" min="1" max="999999" step="1" value="240124" inputmode="numeric" data-udes-v2-seed>
        </label>
      </section>

      <section class="udes-v2-control-section" aria-labelledby="udes-v2-mobility-title">
        <div class="udes-v2-section-heading">
          <h3 id="udes-v2-mobility-title">Mobility</h3>
          <span>Network-wide</span>
        </div>
        <label class="udes-v2-form-row" for="udes-v2-transit-fare">
          <span>
            <span>Transit fare</span>
            <output for="udes-v2-transit-fare" data-udes-v2-output="transitFare">AED 2.00</output>
          </span>
          <input id="udes-v2-transit-fare" type="range" min="0.5" max="5" step="0.25" value="2" data-udes-v2-lever="transitFare">
        </label>
        <label class="udes-v2-form-row" for="udes-v2-transit-speed">
          <span>
            <span>Transit speed</span>
            <output for="udes-v2-transit-speed" data-udes-v2-output="transitSpeed">28 km/h</output>
          </span>
          <input id="udes-v2-transit-speed" type="range" min="15" max="50" step="1" value="28" data-udes-v2-lever="transitSpeed">
        </label>
        <label class="udes-v2-form-row" for="udes-v2-road-capacity">
          <span>
            <span>Road capacity</span>
            <output for="udes-v2-road-capacity" data-udes-v2-output="roadCapacity">100%</output>
          </span>
          <input id="udes-v2-road-capacity" type="range" min="60" max="180" step="5" value="100" data-udes-v2-lever="roadCapacity">
        </label>
        <label class="udes-v2-form-row" for="udes-v2-car-cost">
          <span>
            <span>Car cost / km</span>
            <output for="udes-v2-car-cost" data-udes-v2-output="carCost">AED 0.35</output>
          </span>
          <input id="udes-v2-car-cost" type="range" min="0.1" max="1.2" step="0.05" value="0.35" data-udes-v2-lever="carCost">
        </label>
      </section>

      <section class="udes-v2-control-section" aria-labelledby="udes-v2-land-title">
        <div class="udes-v2-section-heading">
          <h3 id="udes-v2-land-title">Land and economy</h3>
          <span>Selected scope</span>
        </div>
        <label class="udes-v2-form-row" for="udes-v2-housing">
          <span>
            <span>Housing capacity</span>
            <output for="udes-v2-housing" data-udes-v2-output="housing">100%</output>
          </span>
          <input id="udes-v2-housing" type="range" min="70" max="160" step="5" value="100" data-udes-v2-lever="housing">
        </label>
        <label class="udes-v2-form-row" for="udes-v2-business">
          <span>
            <span>Business capacity</span>
            <output for="udes-v2-business" data-udes-v2-output="business">100%</output>
          </span>
          <input id="udes-v2-business" type="range" min="70" max="160" step="5" value="100" data-udes-v2-lever="business">
        </label>
        <label class="udes-v2-form-row" for="udes-v2-rent-pressure">
          <span>
            <span>Rent pressure</span>
            <output for="udes-v2-rent-pressure" data-udes-v2-output="rentPressure">Neutral</output>
          </span>
          <input id="udes-v2-rent-pressure" type="range" min="85" max="115" step="1" value="100" data-udes-v2-lever="rentPressure">
        </label>
        <label class="udes-v2-form-row" for="udes-v2-place-quality">
          <span>
            <span>Place quality</span>
            <output for="udes-v2-place-quality" data-udes-v2-output="placeQuality">0.82</output>
          </span>
          <input id="udes-v2-place-quality" type="range" min="40" max="100" step="1" value="82" data-udes-v2-lever="placeQuality">
        </label>
      </section>

      <section class="udes-v2-control-section" aria-labelledby="udes-v2-agents-title">
        <div class="udes-v2-section-heading">
          <h3 id="udes-v2-agents-title">Agent rules</h3>
          <span>Calibrated</span>
        </div>
        <p class="udes-v2-control-explainer">Citizens protect disposable income and commute time. Enterprises pursue a viable margin, sector demand, and labor access.</p>
        <details class="udes-v2-agent-method">
          <summary>Read the decision rules</summary>
          <dl>
            <div>
              <dt>Citizen objective</dt>
              <dd>Keep monthly net income—salary less housing and transport—above the buffer while keeping the round trip below the acceptable limit.</dd>
            </div>
            <div>
              <dt>Citizen response</dt>
              <dd>Happy agents pursue higher-quality locations. Waiting and Extreme agents search for better work or move toward lower rent and shorter commutes; financially severe agents may give up a car.</dd>
            </div>
            <div>
              <dt>Enterprise objective</dt>
              <dd>Maintain the target operating margin after wages, business rent, fixed costs, sector demand, vacancies, and labor accessibility.</dd>
            </div>
            <div>
              <dt>Enterprise response</dt>
              <dd>Working firms enter Grow or Lesser with economics-adjusted hazards, then change jobs and wages and may relocate for quality, rent, or labor access.</dd>
            </div>
            <div>
              <dt>Fixed reference calibration</dt>
              <dd>Severe net income: AED −500/month. Commute-only escalation: 45 days. Car disposal: net income below AED −3,000 or negative savings. Firm state clocks: 80-day Working hazards and 30-day action means.</dd>
            </div>
          </dl>
        </details>
        <label class="udes-v2-form-row" for="udes-v2-income-buffer">
          <span>
            <span>Citizen income buffer</span>
            <output for="udes-v2-income-buffer" data-udes-v2-output="incomeBuffer">AED 1,500</output>
          </span>
          <input id="udes-v2-income-buffer" type="range" min="0" max="4000" step="250" value="1500" data-udes-v2-lever="incomeBuffer">
        </label>
        <label class="udes-v2-form-row" for="udes-v2-acceptable-commute">
          <span>
            <span>Acceptable round trip</span>
            <output for="udes-v2-acceptable-commute" data-udes-v2-output="acceptableCommute">60 min</output>
          </span>
          <input id="udes-v2-acceptable-commute" type="range" min="30" max="90" step="5" value="60" data-udes-v2-lever="acceptableCommute">
        </label>
        <label class="udes-v2-form-row" for="udes-v2-extreme-commute">
          <span>
            <span>Severe round trip</span>
            <output for="udes-v2-extreme-commute" data-udes-v2-output="extremeCommute">90 min</output>
          </span>
          <input id="udes-v2-extreme-commute" type="range" min="45" max="120" step="5" value="90" data-udes-v2-lever="extremeCommute">
        </label>
        <label class="udes-v2-form-row" for="udes-v2-target-margin">
          <span>
            <span>Enterprise target margin</span>
            <output for="udes-v2-target-margin" data-udes-v2-output="targetMargin">12%</output>
          </span>
          <input id="udes-v2-target-margin" type="range" min="4" max="25" step="1" value="12" data-udes-v2-lever="targetMargin">
        </label>
      </section>

      <div class="udes-v2-control-note">
        <span aria-hidden="true">i</span>
        <p>
          Official geography is combined with derived and synthetic calibration values. Every field is classified in the model data.
          <a href="https://www.anylogic.com/upload/iblock/198/1985a2d61b26c2d23acd158ab6e5d68e.pdf" target="_blank" rel="noreferrer">UDES method</a>
          · <a href="https://census.scad.gov.ae/home/population?lang=en" target="_blank" rel="noreferrer">SCAD population</a>
          · <a href="https://arcgis.sdi.abudhabi.ae/agspublish/rest/services/OpenData/ADSDI_OpenData/MapServer/2" target="_blank" rel="noreferrer">AD-SDI geography</a>
        </p>
      </div>
    </div>

  </aside>

  <section class="udes-v2-map-workspace" aria-labelledby="udes-v2-map-title" data-udes-v2-map-workspace>
    <div class="udes-v2-workspace-bar">
      <div>
        <span class="udes-v2-kicker">Spatial view</span>
        <h2 id="udes-v2-map-title">Greater Abu Dhabi network</h2>
      </div>
      <div class="udes-v2-map-layers" role="group" aria-label="Map metric">
        <button type="button" data-udes-v2-map-layer="network" aria-pressed="true">Network</button>
        <button type="button" data-udes-v2-map-layer="population" aria-pressed="false">Population</button>
        <button type="button" data-udes-v2-map-layer="access" aria-pressed="false">Access</button>
        <button type="button" data-udes-v2-map-layer="rent" aria-pressed="false">Rent</button>
      </div>
      <button class="udes-v2-text-button" type="button" data-udes-v2-action="fit-emirate">Fit city</button>
    </div>

    <div class="udes-v2-map-stage">
      <div
        id="udes-v2-map"
        class="udes-v2-map-mount"
        role="region"
        aria-label="Interactive map of Greater Abu Dhabi City districts and transport links"
        aria-describedby="udes-v2-map-caption"
        data-udes-v2-map
      ></div>

      <div class="udes-v2-map-placeholder" data-udes-v2-map-placeholder aria-hidden="true">
        <svg viewBox="0 0 1000 580" preserveAspectRatio="none" focusable="false">
          <path class="udes-v2-map-placeholder__land" d="M-20 75 C120 54 205 93 313 85 C447 76 532 42 671 63 C786 80 866 60 1020 31 L1020 605 L-20 605 Z"></path>
          <g class="udes-v2-map-placeholder__minor-roads">
            <path d="M24 407 C175 352 271 366 394 287 S637 171 808 174 S928 124 1004 98"></path>
            <path d="M105 516 C215 420 315 436 414 360 S604 261 772 268 S906 221 1010 205"></path>
            <path d="M318 585 C394 479 493 442 582 360 S751 208 868 110"></path>
            <path d="M521 581 C545 470 630 421 709 335 S865 224 1009 197"></path>
            <path d="M154 167 C264 184 341 214 444 207 S627 116 782 125"></path>
          </g>
          <g class="udes-v2-map-placeholder__corridors">
            <path d="M125 394 C231 361 321 349 425 302 C513 263 573 248 642 254"></path>
            <path d="M425 302 C514 303 620 328 720 305 C798 287 845 247 892 205"></path>
            <path d="M642 254 C714 229 778 186 867 151"></path>
            <path d="M425 302 C407 239 445 185 501 142"></path>
            <path d="M501 142 C601 131 734 115 867 151"></path>
          </g>
          <g class="udes-v2-map-placeholder__water-lines">
            <path d="M0 98 C130 67 225 121 326 104 C477 79 541 51 686 76"></path>
            <path d="M0 119 C132 89 222 143 334 124"></path>
          </g>
        </svg>
        <span class="udes-v2-map-zone udes-v2-map-zone--musaffah">Musaffah</span>
        <span class="udes-v2-map-zone udes-v2-map-zone--mbz">MBZ City</span>
        <span class="udes-v2-map-zone udes-v2-map-zone--island">Mushrif</span>
        <span class="udes-v2-map-zone udes-v2-map-zone--reem">Reem</span>
        <span class="udes-v2-map-zone udes-v2-map-zone--saadiyat">Saadiyat</span>
        <span class="udes-v2-map-zone udes-v2-map-zone--yas">Yas</span>
        <span class="udes-v2-map-zone udes-v2-map-zone--khalifa">Khalifa</span>
        <span class="udes-v2-map-zone udes-v2-map-zone--raha">Al Raha</span>
      </div>

      <div class="udes-v2-map-zoom" role="group" aria-label="Map zoom">
        <button type="button" data-udes-v2-map-action="zoom-in" aria-label="Zoom in">+</button>
        <button type="button" data-udes-v2-map-action="zoom-out" aria-label="Zoom out">&#8722;</button>
      </div>

      <div class="udes-v2-map-legend" data-udes-v2-map-legend>
        <strong>Road load</strong>
        <span><i class="is-low"></i>Below 65%</span>
        <span><i class="is-medium"></i>65–90%</span>
        <span><i class="is-high"></i>Above 90%</span>
      </div>

      <div class="udes-v2-map-readout" data-udes-v2-map-readout>
        <span data-udes-v2-map-status>Map controller not connected</span>
        <span>Official districts · OSM-routed corridors</span>
      </div>
    </div>

    <p id="udes-v2-map-caption" class="udes-v2-sr-only">
      Eighteen Greater Abu Dhabi districts are shown with official ADSDI geography, routed road corridors, and public-transport stops. Al Ain and Al Dhafra are outside the model boundary.
    </p>

  </section>

  <aside class="udes-v2-inspector" aria-labelledby="udes-v2-inspector-title" data-udes-v2-inspector>
    <div class="udes-v2-panel-heading udes-v2-inspector__heading">
      <div>
        <span class="udes-v2-kicker">Inspector</span>
        <h2 id="udes-v2-inspector-title" data-udes-v2-selection-name>Greater Abu Dhabi City</h2>
      </div>
      <span class="udes-v2-object-id" data-udes-v2-selection-id>CITY MODEL · 18 DISTRICTS</span>
    </div>

    <div class="udes-v2-tabs" role="tablist" aria-label="Inspector views">
      <button id="udes-v2-tab-zone" type="button" role="tab" aria-selected="true" aria-controls="udes-v2-panel-zone" data-udes-v2-inspector-tab="zone">City / zone</button>
      <button id="udes-v2-tab-citizen" type="button" role="tab" aria-selected="false" aria-controls="udes-v2-panel-citizen" tabindex="-1" data-udes-v2-inspector-tab="citizen">Citizen</button>
      <button id="udes-v2-tab-enterprise" type="button" role="tab" aria-selected="false" aria-controls="udes-v2-panel-enterprise" tabindex="-1" data-udes-v2-inspector-tab="enterprise">Enterprise</button>
      <button id="udes-v2-tab-link" type="button" role="tab" aria-selected="false" aria-controls="udes-v2-panel-link" tabindex="-1" data-udes-v2-inspector-tab="link">Link</button>
    </div>

    <div class="udes-v2-inspector__body">
      <section id="udes-v2-panel-zone" class="udes-v2-tab-panel" role="tabpanel" aria-labelledby="udes-v2-tab-zone" data-udes-v2-inspector-panel="zone">
        <div class="udes-v2-primary-metric">
          <span>Resident satisfaction</span>
          <strong data-udes-v2-metric="zoneSatisfaction">74.2%</strong>
          <small data-udes-v2-delta="zoneSatisfaction">Reference month</small>
        </div>

        <dl class="udes-v2-metric-list">
          <div><dt>Population</dt><dd data-udes-v2-metric="zonePopulation">235k</dd></div>
          <div><dt>Jobs</dt><dd data-udes-v2-metric="zoneJobs">260k</dd></div>
          <div><dt>Housing capacity</dt><dd data-udes-v2-metric="zoneHousing">285k</dd></div>
          <div><dt>Monthly housing rent</dt><dd data-udes-v2-metric="zoneRent">AED 2,890</dd></div>
          <div><dt>Mean commute</dt><dd data-udes-v2-metric="zoneCommute">31.4 min</dd></div>
          <div><dt>Car share</dt><dd data-udes-v2-metric="zoneCarShare">68.1%</dd></div>
        </dl>

        <div class="udes-v2-inspector-chart" aria-label="Zone trend placeholder" data-udes-v2-inspector-chart="zone">
          <div class="udes-v2-mini-chart-heading"><span>12-month signal</span><strong>Stable</strong></div>
          <svg viewBox="0 0 300 72" role="img" aria-label="Placeholder trend line">
            <path class="udes-v2-mini-chart__area" d="M0 57 C42 52 57 42 88 45 S142 36 168 39 S219 27 244 31 S279 21 300 17 L300 72 L0 72 Z"></path>
            <path class="udes-v2-mini-chart__line" d="M0 57 C42 52 57 42 88 45 S142 36 168 39 S219 27 244 31 S279 21 300 17"></path>
          </svg>
        </div>

        <div class="udes-v2-insight" data-udes-v2-insight>
          <span>Model signal</span>
          <p>Employment access is strong; housing occupancy is the main source of modeled rent pressure.</p>
        </div>

        <div class="udes-v2-provenance" data-udes-v2-provenance>
          <span>Field provenance</span>
          <p><strong>Population</strong> mixed observed / synthetic · <strong>Geography</strong> observed · <strong>Jobs and rents</strong> synthetic calibration</p>
        </div>
      </section>

      <section id="udes-v2-panel-citizen" class="udes-v2-tab-panel" role="tabpanel" aria-labelledby="udes-v2-tab-citizen" data-udes-v2-inspector-panel="citizen" hidden>
        <div class="udes-v2-empty-state">
          <span>Citizen 004,218</span>
          <strong>Citizen inspector loading</strong>
          <p>The model will expose home, work, finances, commute, mode choice, and the live satisfaction statechart here.</p>
        </div>
      </section>

      <section id="udes-v2-panel-enterprise" class="udes-v2-tab-panel" role="tabpanel" aria-labelledby="udes-v2-tab-enterprise" data-udes-v2-inspector-panel="enterprise" hidden>
        <div class="udes-v2-empty-state">
          <span>Enterprise 000,846</span>
          <strong>Enterprise inspector loading</strong>
          <p>The model will expose sector, employment, wages, rent, operating margin, accessibility, and the live enterprise statechart here.</p>
        </div>
      </section>

      <section id="udes-v2-panel-link" class="udes-v2-tab-panel" role="tabpanel" aria-labelledby="udes-v2-tab-link" data-udes-v2-inspector-panel="link" hidden>
        <div class="udes-v2-empty-state">
          <span>Corridor 01–04</span>
          <strong>Network inspector loading</strong>
          <p>The model will expose distance, capacity, travel time, modeled flow, and congestion history here.</p>
        </div>
      </section>
    </div>

  </aside>

  <section class="udes-v2-tray" aria-labelledby="udes-v2-tray-title" data-udes-v2-tray>
    <div class="udes-v2-tray__bar">
      <div class="udes-v2-tray__label">
        <span class="udes-v2-kicker">Time series</span>
        <h2 id="udes-v2-tray-title">Scenario outcomes</h2>
      </div>
      <div class="udes-v2-chart-tabs" role="tablist" aria-label="Outcome chart views">
        <button id="udes-v2-chart-tab-overview" type="button" role="tab" aria-selected="true" aria-controls="udes-v2-chart-panel-overview" data-udes-v2-chart-tab="overview">Overview</button>
        <button id="udes-v2-chart-tab-population" type="button" role="tab" aria-selected="false" aria-controls="udes-v2-chart-panel-population" tabindex="-1" data-udes-v2-chart-tab="population">Population</button>
        <button id="udes-v2-chart-tab-housing" type="button" role="tab" aria-selected="false" aria-controls="udes-v2-chart-panel-housing" tabindex="-1" data-udes-v2-chart-tab="housing">Housing</button>
        <button id="udes-v2-chart-tab-business" type="button" role="tab" aria-selected="false" aria-controls="udes-v2-chart-panel-business" tabindex="-1" data-udes-v2-chart-tab="business">Business</button>
        <button id="udes-v2-chart-tab-mobility" type="button" role="tab" aria-selected="false" aria-controls="udes-v2-chart-panel-mobility" tabindex="-1" data-udes-v2-chart-tab="mobility">Mobility</button>
        <button id="udes-v2-chart-tab-distribution" type="button" role="tab" aria-selected="false" aria-controls="udes-v2-chart-panel-distribution" tabindex="-1" data-udes-v2-chart-tab="distribution">Distribution</button>
      </div>
      <button class="udes-v2-text-button" type="button" data-udes-v2-action="export" data-udes-v2-export>Export CSV</button>
    </div>

    <div class="udes-v2-chart-panels">
      <section id="udes-v2-chart-panel-overview" class="udes-v2-chart-panel" role="tabpanel" aria-labelledby="udes-v2-chart-tab-overview" data-udes-v2-chart-panel="overview">
        <dl class="udes-v2-summary-strip">
          <div><dt>Population</dt><dd class="udes-v2-summary-value" data-udes-v2-metric="population">1.82m</dd><dd class="udes-v2-summary-delta" data-udes-v2-delta="population">Baseline</dd></div>
          <div><dt>Mean commute</dt><dd class="udes-v2-summary-value" data-udes-v2-metric="commute">36.8 min</dd><dd class="udes-v2-summary-delta" data-udes-v2-delta="commute">Baseline</dd></div>
          <div><dt>Car share</dt><dd class="udes-v2-summary-value" data-udes-v2-metric="carShare">71.4%</dd><dd class="udes-v2-summary-delta" data-udes-v2-delta="carShare">Baseline</dd></div>
          <div><dt>Road load</dt><dd class="udes-v2-summary-value" data-udes-v2-metric="roadLoad">62%</dd><dd class="udes-v2-summary-delta" data-udes-v2-delta="roadLoad">Baseline</dd></div>
        </dl>

        <div class="udes-v2-chart-canvas" data-udes-v2-chart="overview">
          <svg viewBox="0 0 900 142" role="img" aria-labelledby="udes-v2-chart-title udes-v2-chart-desc" preserveAspectRatio="none">
            <title id="udes-v2-chart-title">Model overview loading</title>
            <desc id="udes-v2-chart-desc">The chart will show satisfaction, car share, road load, and same-seed reference values from 2024 to 2034.</desc>
            <g class="udes-v2-chart-grid" aria-hidden="true">
              <line x1="38" y1="18" x2="884" y2="18"></line>
              <line x1="38" y1="54" x2="884" y2="54"></line>
              <line x1="38" y1="90" x2="884" y2="90"></line>
              <line x1="38" y1="126" x2="884" y2="126"></line>
              <line x1="38" y1="18" x2="38" y2="126"></line>
              <line x1="461" y1="18" x2="461" y2="126"></line>
              <line x1="884" y1="18" x2="884" y2="126"></line>
            </g>
            <path class="udes-v2-series udes-v2-series--satisfaction" data-udes-v2-series="satisfaction" d="M38 73 C151 70 236 66 323 62 S498 55 588 50 S773 44 884 38"></path>
            <path class="udes-v2-series udes-v2-series--car" data-udes-v2-series="carShare" d="M38 61 C151 62 233 65 323 69 S497 73 588 75 S771 78 884 82"></path>
            <path class="udes-v2-series udes-v2-series--load" data-udes-v2-series="roadLoad" d="M38 92 C147 89 239 83 323 79 S496 70 588 67 S773 60 884 54"></path>
          </svg>
          <div class="udes-v2-chart-axis" aria-hidden="true"><span>2024</span><span>2029</span><span>2034</span></div>
          <div class="udes-v2-chart-legend" aria-label="Chart legend">
            <span><i class="is-satisfaction"></i>Satisfaction</span>
            <span><i class="is-car"></i>Car share</span>
            <span><i class="is-load"></i>Road load</span>
          </div>
        </div>
      </section>

      <section id="udes-v2-chart-panel-population" class="udes-v2-chart-panel" role="tabpanel" aria-labelledby="udes-v2-chart-tab-population" data-udes-v2-chart-panel="population" hidden>
        <div class="udes-v2-chart-mount" data-udes-v2-chart="population"><p class="udes-v2-chart-empty">Population totals and inter-zone movement series mount here.</p></div>
      </section>
      <section id="udes-v2-chart-panel-housing" class="udes-v2-chart-panel" role="tabpanel" aria-labelledby="udes-v2-chart-tab-housing" data-udes-v2-chart-panel="housing" hidden>
        <div class="udes-v2-chart-mount" data-udes-v2-chart="housing"><p class="udes-v2-chart-empty">Housing capacity, occupancy, and rent series mount here.</p></div>
      </section>
      <section id="udes-v2-chart-panel-business" class="udes-v2-chart-panel" role="tabpanel" aria-labelledby="udes-v2-chart-tab-business" data-udes-v2-chart-panel="business" hidden>
        <div class="udes-v2-chart-mount" data-udes-v2-chart="business"><p class="udes-v2-chart-empty">Enterprise counts, jobs, and relocation series mount here.</p></div>
      </section>
      <section id="udes-v2-chart-panel-mobility" class="udes-v2-chart-panel" role="tabpanel" aria-labelledby="udes-v2-chart-tab-mobility" data-udes-v2-chart-panel="mobility" hidden>
        <div class="udes-v2-chart-mount" data-udes-v2-chart="mobility"><p class="udes-v2-chart-empty">Mode share, commute, road-load, and emissions series mount here.</p></div>
      </section>
      <section id="udes-v2-chart-panel-distribution" class="udes-v2-chart-panel" role="tabpanel" aria-labelledby="udes-v2-chart-tab-distribution" data-udes-v2-chart-panel="distribution" hidden>
        <div class="udes-v2-chart-mount" data-udes-v2-chart="distribution"><p class="udes-v2-chart-empty">Distribution plots for residents, firms, rent, and accessibility mount here.</p></div>
      </section>
    </div>

  </section>
</div>

<noscript>
  <p class="udes-v2-noscript">JavaScript is required to run the agent model. The interface uses official Abu Dhabi district geography with clearly classified derived and synthetic calibration values.</p>
</noscript>
