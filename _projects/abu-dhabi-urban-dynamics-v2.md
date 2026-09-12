---
layout: simulation-v2
title: Abu Dhabi Urban Dynamics
permalink: /projects/abu-dhabi-urban-dynamics-v2/
description: A desktop agent-based planning console for exploring housing, enterprise, and mobility scenarios across Greater Abu Dhabi City.
eyebrow: Agent-based planning lab
importance: 0
category: simulation
preview: true
case_study_url: /projects/abu-dhabi-urban-dynamics/
image: /assets/img/projects/urban-dynamics-console.png
image_alt: Abu Dhabi Urban Dynamics analyst console with real district geography, agent indicators, and scenario charts
image_fit: cover
image_width: 1600
image_height: 900
image_aspect: widescreen
card_size: wide
og_image: https://ahmed-o-aly.github.io/assets/img/projects/urban-dynamics-console.png
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
  headline: Abu Dhabi Urban Dynamics Lab
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
        <span class="udes-v2-kicker">Scenario</span>
        <h2 id="udes-v2-controls-title">Configure scenario</h2>
      </div>
      <button class="udes-v2-text-button" type="button" data-udes-v2-action="reset-levers">Reset draft</button><button class="udes-v2-icon-button" type="button" data-udes-v2-action="close-controls" aria-label="Close scenario configuration">×</button>
    </div>

    <div class="udes-v2-control-tabs" role="tablist" aria-label="Scenario control views">
      <button id="udes-v2-control-tab-setup" type="button" role="tab" aria-controls="udes-v2-control-panel-setup" aria-selected="true" data-udes-v2-control-tab="setup">Setup</button>
      <button id="udes-v2-control-tab-policy" type="button" role="tab" aria-controls="udes-v2-control-panel-policy" aria-selected="false" tabindex="-1" data-udes-v2-control-tab="policy">Policy</button>
      <button id="udes-v2-control-tab-model" type="button" role="tab" aria-controls="udes-v2-control-panel-model" aria-selected="false" tabindex="-1" data-udes-v2-control-tab="model">Model</button>
      <button id="udes-v2-control-tab-evidence" type="button" role="tab" aria-controls="udes-v2-control-panel-evidence" aria-selected="false" tabindex="-1" data-udes-v2-control-tab="evidence">Evidence</button>
    </div>

    <div class="udes-v2-controls__scroll">
      <div id="udes-v2-control-panel-setup" class="udes-v2-control-panel" role="tabpanel" aria-labelledby="udes-v2-control-tab-setup" data-udes-v2-control-panel="setup">
      <fieldset class="udes-v2-scenario-list">
        <legend>Intervention template</legend>
        <button type="button" data-udes-v2-scenario="reference" aria-pressed="true">
          <span>Reference</span>
          <small>No intervention</small>
        </button>
        <button type="button" data-udes-v2-scenario="transit" aria-pressed="false">
          <span>Bus priority</span>
          <small>AED 1 · 45 km/h · 4 min wait · 2× capacity</small>
        </button>
        <button type="button" data-udes-v2-scenario="housing" aria-pressed="false">
          <span>Housing delivery</span>
          <small>Housing capacity only</small>
        </button>
        <button type="button" data-udes-v2-scenario="balanced" aria-pressed="false">
          <span>Housing + jobs</span>
          <small>Co-located growth + public realm</small>
        </button>
      </fieldset>

      <section class="udes-v2-control-section" aria-labelledby="udes-v2-scope-title">
        <div class="udes-v2-section-heading">
          <h3 id="udes-v2-scope-title">Run setup</h3>
          <span>Daily calendar</span>
        </div>
        <label class="udes-v2-select-row" for="udes-v2-focus-zone">
          <span>Inspect district</span>
          <select id="udes-v2-focus-zone" data-udes-v2-focus-zone>
            <option value="city">Loading Abu Dhabi districts…</option>
          </select>
        </label>
        <label class="udes-v2-select-row" for="udes-v2-horizon">
          <span>Run horizon</span>
          <select id="udes-v2-horizon" data-udes-v2-horizon>
            <option value="30">30 days</option>
            <option value="90">90 days</option>
            <option value="366" selected>1 calendar year</option>
            <option value="731">2 calendar years</option>
            <option value="1827">5 calendar years</option>
            <option value="3653">10 calendar years</option>
          </select>
        </label>
        <label class="udes-v2-select-row" for="udes-v2-seed">
          <span>Random seed</span>
          <input id="udes-v2-seed" type="number" min="1" max="999999" step="1" value="240124" inputmode="numeric" data-udes-v2-seed>
        </label>
        <div class="udes-v2-run-speed"><span>Model days per update</span><fieldset class="udes-v2-speed">
        <legend>Automatic run step</legend>
        <button type="button" data-udes-v2-speed="1" aria-pressed="true" title="Run one model day per update">1d</button>
        <button type="button" data-udes-v2-speed="7" aria-pressed="false" title="Run seven model days per update">7d</button>
        <button type="button" data-udes-v2-speed="30" aria-pressed="false" title="Run thirty model days per update">30d</button>
      </fieldset></div>
        <div class="udes-v2-cadence-note">
          <strong>Model calendar</strong>
          <p>Travel and decisions update daily. Resident budgets settle monthly; rents update annually.</p>
        </div>
      </section>
      </div>

      <div id="udes-v2-control-panel-policy" class="udes-v2-control-panel" role="tabpanel" aria-labelledby="udes-v2-control-tab-policy" data-udes-v2-control-panel="policy" hidden>
      <section class="udes-v2-control-section" aria-labelledby="udes-v2-policy-target-title">
        <div class="udes-v2-section-heading">
          <h3 id="udes-v2-policy-target-title">Intervention target</h3>
          <span>Land-use levers</span>
        </div>
        <label class="udes-v2-select-row" for="udes-v2-policy-scope">
          <span>Target area</span>
          <select id="udes-v2-policy-scope" data-udes-v2-policy-scope>
            <option value="city">All 18 districts</option>
          </select>
        </label>
        <p class="udes-v2-control-explainer">Housing, employment space and public-realm changes apply to this target. Mobility inputs remain network-wide because published route and timetable data have not yet been integrated into this model.</p>
      </section>

      <section class="udes-v2-control-section" aria-labelledby="udes-v2-mobility-title">
        <div class="udes-v2-section-heading">
          <h3 id="udes-v2-mobility-title">Bus and road operations</h3>
          <span>Network-wide</span>
        </div>
        <label class="udes-v2-form-row" for="udes-v2-transit-fare">
          <span>
            <span>Base bus fare / direction</span>
            <output for="udes-v2-transit-fare" data-udes-v2-output="transitFare">AED 2.00</output>
          </span>
          <input id="udes-v2-transit-fare" type="range" min="0" max="4" step="0.25" value="2" data-udes-v2-lever="transitFare">
        </label>
        <label class="udes-v2-form-row" for="udes-v2-transit-speed">
          <span>
            <span>Effective bus speed</span>
            <output for="udes-v2-transit-speed" data-udes-v2-output="transitSpeed">28 km/h</output>
          </span>
          <input id="udes-v2-transit-speed" type="range" min="15" max="50" step="1" value="28" data-udes-v2-lever="transitSpeed">
        </label>
        <label class="udes-v2-form-row" for="udes-v2-transit-wait">
          <span>
            <span>Average bus wait</span>
            <output for="udes-v2-transit-wait" data-udes-v2-output="transitWait">7 min</output>
          </span>
          <input id="udes-v2-transit-wait" type="range" min="2" max="20" step="1" value="7" data-udes-v2-lever="transitWait">
        </label>
        <label class="udes-v2-form-row" for="udes-v2-transit-capacity">
          <span>
            <span>Bus service capacity</span>
            <output for="udes-v2-transit-capacity" data-udes-v2-output="transitCapacity">100%</output>
          </span>
          <input id="udes-v2-transit-capacity" type="range" min="60" max="200" step="5" value="100" data-udes-v2-lever="transitCapacity">
        </label>
        <label class="udes-v2-form-row" for="udes-v2-road-capacity">
          <span>
            <span>Road assignment capacity</span>
            <output for="udes-v2-road-capacity" data-udes-v2-output="roadCapacity">100%</output>
          </span>
          <input id="udes-v2-road-capacity" type="range" min="60" max="180" step="5" value="100" data-udes-v2-lever="roadCapacity">
        </label>
        <label class="udes-v2-form-row" for="udes-v2-car-cost">
          <span>
            <span>Vehicle running cost / km</span>
            <output for="udes-v2-car-cost" data-udes-v2-output="carCost">AED 0.35</output>
          </span>
          <input id="udes-v2-car-cost" type="range" min="0.1" max="1.2" step="0.05" value="0.35" data-udes-v2-lever="carCost">
        </label>
        <label class="udes-v2-form-row" for="udes-v2-parking-cost">
          <span>
            <span>Parking + fixed car cost</span>
            <output for="udes-v2-parking-cost" data-udes-v2-output="parkingCost">AED 15/day</output>
          </span>
          <input id="udes-v2-parking-cost" type="range" min="0" max="60" step="2.5" value="15" data-udes-v2-lever="parkingCost">
        </label>
        <p class="udes-v2-control-explainer">Bus fare, speed, wait and capacity change generalized travel cost and mode choice. The car controls combine running cost with a transparent daily parking/fixed-cost proxy. The observed standard bus fare still adds AED 0.05 per passenger-kilometre, capped at AED 5 per journey.</p>
      </section>

      <section class="udes-v2-control-section" aria-labelledby="udes-v2-land-title">
        <div class="udes-v2-section-heading">
          <h3 id="udes-v2-land-title">Housing and employment</h3>
          <span>Target-area delivery</span>
        </div>
        <label class="udes-v2-form-row" for="udes-v2-housing">
          <span>
            <span>Housing capacity</span>
            <output for="udes-v2-housing" data-udes-v2-output="housing">100%</output>
          </span>
          <input id="udes-v2-housing" type="range" min="100" max="180" step="5" value="100" data-udes-v2-lever="housing">
        </label>
        <label class="udes-v2-form-row" for="udes-v2-business">
          <span>
            <span>Employment-space capacity</span>
            <output for="udes-v2-business" data-udes-v2-output="business">100%</output>
          </span>
          <input id="udes-v2-business" type="range" min="100" max="180" step="5" value="100" data-udes-v2-lever="business">
        </label>
        <label class="udes-v2-form-row" for="udes-v2-place-quality">
          <span>
            <span>Public-realm quality index</span>
            <output for="udes-v2-place-quality" data-udes-v2-output="placeQuality">0.82</output>
          </span>
          <input id="udes-v2-place-quality" type="range" min="82" max="100" step="1" value="82" data-udes-v2-lever="placeQuality">
        </label>
      </section>
      </div>

      <section id="udes-v2-control-panel-model" class="udes-v2-control-section" role="tabpanel" aria-labelledby="udes-v2-control-tab-model" data-udes-v2-control-panel="model" hidden>
        <div class="udes-v2-section-heading">
          <h3 id="udes-v2-agents-title">Behavior assumptions</h3>
          <span>Applied to both runs</span>
        </div>
        <p class="udes-v2-control-explainer">These inputs define behavior; they are not policies. Changes apply to both the scenario and same-seed reference so the comparison remains like-for-like.</p>
        <details class="udes-v2-agent-method">
          <summary>How decisions are made</summary>
          <dl>
            <div>
              <dt>Citizen objective</dt>
              <dd>Employed citizens and active job seekers try to keep monthly resources above the buffer after earned salary, any explicitly modeled non-labor resources, housing, and transport are counted. They also try to keep a work trip below the acceptable limit. Citizens outside the modeled labor force do not search for jobs; they still review housing cost and place quality.</dd>
            </div>
            <div>
              <dt>Citizen response</dt>
              <dd>Residents within thresholds pursue meaningfully higher-quality locations. Residents under financial or commute stress review better work, lower rent and shorter commutes daily through their statechart, but a review is not a completed move. Moves require a minimum benefit, a follow-through draw, a minimum stay and a return lockout; financially severe agents may give up a car.</dd>
            </div>
            <div>
              <dt>Enterprise objective</dt>
              <dd>Maintain the target operating margin after wages, business rent, fixed costs, sector demand, vacancies, and labor accessibility.</dd>
            </div>
            <div>
              <dt>Enterprise response</dt>
              <dd>Operating firms expand or contract with probabilities adjusted by their economics, then change jobs and wages. Relocation is a separate, infrequent decision requiring a material quality/labor-access gain or rent saving and a minimum stay. A firm at minimum scale exits only after 12 consecutive months below a −20% margin; its agent slot re-enters after a 14-day setup period.</dd>
            </div>
            <div>
              <dt>Labor market</dt>
              <dd>The 6,070 citizen agents each represent 250 residents. The opening stock contains 4,067 employed agents, 182 active job seekers and 1,821 residents outside the modeled labor force. The opening employed-resident share is 67%; subsequent employment follows vacancies, labor demand and matching. The separate 70% participation split, including its 3 percentage-point active-seeker reserve, is an explicit, replaceable scenario assumption, not an observed city calibration.</dd>
            </div>
            <div>
              <dt>Housing and network capacity</dt>
              <dd>Housing stock is a soft overcrowding constraint that feeds rent pressure. Road and transit overflow becomes congestion or crowding; it never turns a long inter-district commute into a forced walk.</dd>
            </div>
            <div>
              <dt>Fixed reference assumptions</dt>
              <dd>Severe disposable-resource deficit: AED −500/month after essentials. Essential consumption: AED 2,500/month. Nonparticipants receive an uncalibrated household/non-labor resource fixed at opening housing cost, essentials and an AED 1,500 residual buffer so zero wages do not automatically mean extreme distress. Households save 25% of a positive residual after essentials and draw down the full negative residual. Relocation requires at least AED 600/month rent saving or a 10-minute commute improvement plus AED 500/month generalized benefit; job switches require an 8% raise and AED 500 net gain.</dd>
            </div>
            <div>
              <dt>Validation boundary</dt>
              <dd>Determinism, conservation, exact calendar horizons, capacity handling, ten-year stability, and movement-churn ceilings are regression-tested. The provisional ceilings are 30 residential events per 100 citizen-agent years and 20 firm moves per 100 firm-agent years; they are software sanity guards, not observed Abu Dhabi targets.</dd>
            </div>
          </dl>
        </details>
        <label class="udes-v2-form-row" for="udes-v2-income-buffer">
          <span>
            <span>Citizen income buffer</span>
            <output for="udes-v2-income-buffer" data-udes-v2-output="incomeBuffer">AED 1,500</output>
          </span>
          <input id="udes-v2-income-buffer" type="range" min="0" max="4000" step="250" value="1500" data-udes-v2-lever="incomeBuffer" data-udes-v2-assumption>
        </label>
        <label class="udes-v2-form-row" for="udes-v2-acceptable-commute">
          <span>
            <span>Acceptable round trip</span>
            <output for="udes-v2-acceptable-commute" data-udes-v2-output="acceptableCommute">60 min</output>
          </span>
          <input id="udes-v2-acceptable-commute" type="range" min="30" max="90" step="5" value="60" data-udes-v2-lever="acceptableCommute" data-udes-v2-assumption>
        </label>
        <label class="udes-v2-form-row" for="udes-v2-extreme-commute">
          <span>
            <span>Severe round trip</span>
            <output for="udes-v2-extreme-commute" data-udes-v2-output="extremeCommute">90 min</output>
          </span>
          <input id="udes-v2-extreme-commute" type="range" min="45" max="120" step="5" value="90" data-udes-v2-lever="extremeCommute" data-udes-v2-assumption>
        </label>
        <label class="udes-v2-form-row" for="udes-v2-target-margin">
          <span>
            <span>Enterprise target margin</span>
            <output for="udes-v2-target-margin" data-udes-v2-output="targetMargin">12%</output>
          </span>
          <input id="udes-v2-target-margin" type="range" min="4" max="25" step="1" value="12" data-udes-v2-lever="targetMargin" data-udes-v2-assumption>
        </label>
        <label class="udes-v2-form-row" for="udes-v2-job-search-probability">
          <span>
            <span>Daily job-search probability</span>
            <output for="udes-v2-job-search-probability" data-udes-v2-output="jobSearchProbability">4%</output>
          </span>
          <input id="udes-v2-job-search-probability" type="range" min="1" max="15" step="1" value="4" data-udes-v2-lever="jobSearchProbability" data-udes-v2-assumption>
        </label>
        <label class="udes-v2-form-row" for="udes-v2-rent-pressure">
          <span>
            <span>Annual rent-response strength</span>
            <output for="udes-v2-rent-pressure" data-udes-v2-output="rentPressure">Neutral</output>
          </span>
          <input id="udes-v2-rent-pressure" type="range" min="85" max="115" step="1" value="100" data-udes-v2-lever="rentPressure" data-udes-v2-assumption>
        </label>
        <label class="udes-v2-form-row" for="udes-v2-household-move-chance">
          <span>
            <span>Household move follow-through</span>
            <output for="udes-v2-household-move-chance" data-udes-v2-output="householdMoveChance">20%</output>
          </span>
          <input id="udes-v2-household-move-chance" type="range" min="5" max="40" step="5" value="20" data-udes-v2-lever="householdMoveChance" data-udes-v2-assumption>
        </label>
        <label class="udes-v2-form-row" for="udes-v2-household-minimum-stay">
          <span>
            <span>Household minimum stay</span>
            <output for="udes-v2-household-minimum-stay" data-udes-v2-output="householdMinimumStay">365 days</output>
          </span>
          <input id="udes-v2-household-minimum-stay" type="range" min="180" max="730" step="5" value="365" data-udes-v2-lever="householdMinimumStay" data-udes-v2-assumption>
        </label>
        <label class="udes-v2-form-row" for="udes-v2-firm-move-chance">
          <span>
            <span>Firm relocation consideration</span>
            <output for="udes-v2-firm-move-chance" data-udes-v2-output="firmMoveChance">10%</output>
          </span>
          <input id="udes-v2-firm-move-chance" type="range" min="0" max="30" step="2.5" value="10" data-udes-v2-lever="firmMoveChance" data-udes-v2-assumption>
        </label>
        <label class="udes-v2-form-row" for="udes-v2-firm-minimum-stay">
          <span>
            <span>Firm minimum stay</span>
            <output for="udes-v2-firm-minimum-stay" data-udes-v2-output="firmMinimumStay">730 days</output>
          </span>
          <input id="udes-v2-firm-minimum-stay" type="range" min="365" max="1095" step="5" value="730" data-udes-v2-lever="firmMinimumStay" data-udes-v2-assumption>
        </label>
      </section>

      <div id="udes-v2-control-panel-evidence" class="udes-v2-control-panel" role="tabpanel" aria-labelledby="udes-v2-control-tab-evidence" data-udes-v2-control-panel="evidence" hidden>
        <section class="udes-v2-control-section">
          <h3>Evidence coverage</h3>
          <dl class="udes-v2-evidence-list">
            <div><dt>Observed</dt><dd>SCAD district population, AD-SDI boundaries and bus-stop locations.</dd></div>
            <div><dt>Derived</dt><dd>District crosswalks, weighted population groups and a connected OSM/OSRM road network.</dd></div>
            <div><dt>Assumed</dt><dd>Jobs, housing capacity, rents, budgets, behavioral thresholds and transit service patterns.</dd></div>
          </dl>
          <p class="udes-v2-control-note">Structural checks verify accounting, capacity and connectivity. Behavioral calibration against observed Abu Dhabi outcomes remains open.</p>
          <button class="udes-v2-button" type="button" data-udes-v2-action="methods">Methods &amp; data</button>
          <nav class="udes-v2-source-links" aria-label="Model evidence">
            <a href="{{ '/assets/data/udes-v2/validation-report.json' | relative_url }}" target="_blank" rel="noreferrer">Structural checks</a>
            <a href="{{ '/assets/data/udes-v2/uncertainty-report.json' | relative_url }}" target="_blank" rel="noreferrer">Seed and parameter sensitivity</a>
          </nav>
        </section>
      </div>
    </div>

    <div class="udes-v2-policy-action">
      <div>
        <span>Draft policy</span>
        <strong data-udes-v2-policy-status>No unapplied changes</strong>
      </div>
      <button class="udes-v2-button udes-v2-button--primary" type="button" data-udes-v2-action="apply-policy" disabled>Apply next day</button>
    </div>

  </aside>

  <section class="udes-v2-map-workspace" aria-labelledby="udes-v2-map-title" data-udes-v2-map-workspace>
    <div class="udes-v2-workspace-bar">
      <div>
        <span class="udes-v2-kicker">Study area</span>
        <h2 id="udes-v2-map-title">Abu Dhabi road network</h2>
      </div>
      <div class="udes-v2-map-layers" role="group" aria-label="Map metric">
        <button type="button" data-udes-v2-map-layer="network" aria-pressed="true">Roads</button>
        <button type="button" data-udes-v2-map-layer="population" aria-pressed="false">Population</button>
        <button type="button" data-udes-v2-map-layer="access" aria-pressed="false">Commute</button>
        <button type="button" data-udes-v2-map-layer="rent" aria-pressed="false">Rent</button>
        <button type="button" data-udes-v2-map-layer="agents" aria-pressed="false">Residents</button>
      </div>
      <div class="udes-v2-workspace-actions">
        <button type="button" class="udes-v2-charts-button" data-udes-v2-action="open-analysis" aria-expanded="false" aria-controls="udes-v2-analysis">Charts <span aria-hidden="true">↗</span></button>
        <button class="udes-v2-view-toggle" type="button" aria-pressed="false" aria-label="Configure scenario" data-udes-v2-view-toggle>
          <span data-udes-v2-view-label>Configure scenario</span>
        </button>
        <button type="button" class="udes-v2-flow-toggle" data-udes-v2-road-flow-toggle aria-pressed="true" title="Direction follows assigned road demand; symbol density shows relative volume">Flow</button>
        <button class="udes-v2-text-button" type="button" data-udes-v2-action="fit-emirate">Fit city</button>
      </div>
    </div>

    <div class="udes-v2-map-stage">
      <div
        id="udes-v2-map"
        class="udes-v2-map-mount"
        role="region"
        aria-label="Interactive map of Greater Abu Dhabi City districts with a labeled basemap, all modeled citizen and enterprise agents, optional home-to-work relationships, and named arterial road segments"
        aria-describedby="udes-v2-map-caption"
        data-udes-v2-map
      ></div>

      <div class="udes-v2-map-placeholder" data-udes-v2-map-placeholder aria-hidden="true">
        <span>Loading the labeled Abu Dhabi basemap, official districts, agents and routed arterial network…</span>
      </div>

<div class="udes-v2-map-zoom" role="group" aria-label="Map zoom">
        <button type="button" data-udes-v2-map-action="zoom-in" aria-label="Zoom in">+</button>
        <button type="button" data-udes-v2-map-action="zoom-out" aria-label="Zoom out">&#8722;</button>
      </div>

      <div class="udes-v2-map-legend" data-udes-v2-map-legend>
        <div class="udes-v2-agent-layer-toggles" role="group" aria-label="Agent map layers" data-udes-v2-agent-layer-toggles>
          <button type="button" aria-pressed="true" data-udes-v2-agent-layer="citizens"><i class="is-agent-citizen"></i>Residents</button>
          <button type="button" aria-pressed="true" data-udes-v2-agent-layer="enterprises"><i class="is-agent-enterprise"></i>Firms</button>
          <button type="button" aria-pressed="false" data-udes-v2-agent-layer="flows" title="Top 18 current district-to-district home-to-work relationships; not daily road traffic"><i class="is-agent-flow"></i>Home → work</button>
        </div>
        <p class="udes-v2-map-legend__note">Home → work shows current worker relationships, not vehicles or daily trips.</p>
        <strong>Road load</strong>
        <span><i class="is-low"></i>Below 80%</span>
        <span><i class="is-medium"></i>80–100%</span>
        <span><i class="is-high"></i>Over capacity</span>
        <span hidden><i></i></span>
        <span hidden><i></i></span>
        <p class="udes-v2-road-flow-note">Arrows sample assigned flows; gaps do not mean zero traffic.</p>
        <button type="button" class="udes-v2-text-button" data-udes-v2-open-chart="workspace:roads">Road assignment ↗</button>
      </div>

      <div class="udes-v2-map-readout" data-udes-v2-map-readout>
        <span data-udes-v2-map-status>Map controller not connected</span>
        <span>Color: demand / capacity · arrows: direction &amp; relative volume</span>
      </div>
    </div>

    <p id="udes-v2-map-caption" class="udes-v2-sr-only">
      Eighteen model districts, grouped from official AD-SDI community polygons, are shown over a labeled OpenStreetMap basemap with all 6,070 modeled citizen agents (250 represented residents each), all 600 enterprise agents, optional district-to-district home-to-work relationships, shared named arterial road segments, and public-transport stops. Agent positions are deterministic display locations inside each modeled district, not geocoded addresses. Home-to-work arcs show current worker relationships rather than daily vehicle trips. Load-colored roads carry assigned model demand on a connected graph. Moving arrows show direction and relative volume. Local streets appear only as muted basemap reference and are not simulation edges. Al Ain and Al Dhafra are outside the model boundary.
    </p>

  </section>

  <aside class="udes-v2-inspector" aria-labelledby="udes-v2-inspector-title" data-udes-v2-inspector>
    <button type="button" class="udes-v2-back-results" data-udes-v2-action="close-inspector">← Map</button>
    <div class="udes-v2-panel-heading udes-v2-inspector__heading">
      <div>
        <span class="udes-v2-kicker">Inspector</span>
        <h2 id="udes-v2-inspector-title" data-udes-v2-selection-name>Greater Abu Dhabi City</h2>
      </div>
      <span class="udes-v2-object-id" data-udes-v2-selection-id>CITY MODEL · 18 DISTRICTS</span>
    </div>

    <div class="udes-v2-tabs" role="tablist" aria-label="Inspector views">
      <button id="udes-v2-tab-zone" type="button" role="tab" aria-selected="true" aria-controls="udes-v2-panel-zone" data-udes-v2-inspector-tab="zone">City / zone</button>
      <button id="udes-v2-tab-citizen" type="button" role="tab" aria-selected="false" aria-controls="udes-v2-panel-citizen" tabindex="-1" data-udes-v2-inspector-tab="citizen">Resident</button>
      <button id="udes-v2-tab-enterprise" type="button" role="tab" aria-selected="false" aria-controls="udes-v2-panel-enterprise" tabindex="-1" data-udes-v2-inspector-tab="enterprise">Firm</button>
      <button id="udes-v2-tab-link" type="button" role="tab" aria-selected="false" aria-controls="udes-v2-panel-link" tabindex="-1" data-udes-v2-inspector-tab="link">Road</button>
    </div>

    <button type="button" class="udes-v2-inspector-explore" data-udes-v2-action="inspect-charts">Explore charts for this selection ↗</button>
    <div class="udes-v2-inspector__body">
      <section id="udes-v2-panel-zone" class="udes-v2-tab-panel" role="tabpanel" aria-labelledby="udes-v2-tab-zone" data-udes-v2-inspector-panel="zone">
        <div class="udes-v2-primary-metric">
          <span>Within stress thresholds</span>
          <strong data-udes-v2-metric="zoneSatisfaction">&hellip;</strong>
          <small data-udes-v2-delta="zoneSatisfaction">Same-day reference</small>
        </div>

        <dl class="udes-v2-metric-list">
          <div><dt>Population</dt><dd data-udes-v2-metric="zonePopulation">&hellip;</dd></div>
          <div><dt>Filled jobs</dt><dd data-udes-v2-metric="zoneJobs">&hellip;</dd></div>
          <div><dt>Housing capacity (residents)</dt><dd data-udes-v2-metric="zoneHousing">&hellip;</dd></div>
          <div><dt>Housing rent (AED/month)</dt><dd data-udes-v2-metric="zoneRent">&hellip;</dd></div>
          <div><dt>Round-trip commute</dt><dd data-udes-v2-metric="zoneCommute">&hellip;</dd></div>
          <div><dt>Car share</dt><dd data-udes-v2-metric="zoneCarShare">&hellip;</dd></div>
        </dl>

        <div class="udes-v2-inspector-chart" aria-label="Daily zone trend" data-udes-v2-inspector-chart="zone">
          <div class="udes-v2-mini-chart-heading"><span>Daily signal</span><strong>Loading</strong></div>
          <p class="udes-v2-chart-empty">Waiting for the first model observation.</p>
        </div>

        <div class="udes-v2-insight" data-udes-v2-insight>
          <span>Model signal</span>
          <p>Employment access is strong; housing occupancy is the main source of modeled rent pressure.</p>
        </div>

        <div class="udes-v2-provenance" data-udes-v2-provenance>
          <span>Field provenance</span>
          <p><strong>Population</strong> mapped from SCAD observations · <strong>Geography</strong> derived from official AD-SDI polygons · <strong>Jobs and rents</strong> synthetic assumptions</p>
        </div>
      </section>

      <section id="udes-v2-panel-citizen" class="udes-v2-tab-panel" role="tabpanel" aria-labelledby="udes-v2-tab-citizen" data-udes-v2-inspector-panel="citizen" hidden>
        <div class="udes-v2-empty-state">
          <span>Tracked citizen</span>
          <strong>Citizen decision record loading</strong>
          <p>The model will show this citizen's goal, decision rule, next review, last action, home and work districts, finances, commute, mode, and live state.</p>
        </div>
      </section>

      <section id="udes-v2-panel-enterprise" class="udes-v2-tab-panel" role="tabpanel" aria-labelledby="udes-v2-tab-enterprise" data-udes-v2-inspector-panel="enterprise" hidden>
        <div class="udes-v2-empty-state">
          <span>Tracked enterprise</span>
          <strong>Enterprise decision record loading</strong>
          <p>The model will show this enterprise's goal, decision rule, next review, last action, district, workforce, costs, margin, accessibility, and live state.</p>
        </div>
      </section>

      <section id="udes-v2-panel-link" class="udes-v2-tab-panel" role="tabpanel" aria-labelledby="udes-v2-tab-link" data-udes-v2-inspector-panel="link" hidden>
        <div class="udes-v2-empty-state">
          <span>Named model corridor</span>
          <strong>Network inspector loading</strong>
          <p>The model will expose distance, capacity, travel time, modeled flow, and congestion history here.</p>
        </div>
      </section>
    </div>

  </aside>

  <aside class="udes-v2-monitor" aria-label="City indicators">
    <header><strong>City indicators</strong><span>Click to explore ↗</span></header>
    <div class="udes-v2-monitor-grid"><button type="button" data-udes-v2-open-chart="workspace:residents"><span>Within thresholds</span><strong data-udes-v2-metric="satisfaction">…</strong><small data-udes-v2-delta="satisfaction">Same-day reference</small></button>
<button type="button" data-udes-v2-open-chart="workspace:transport"><span>Mean commute</span><strong data-udes-v2-metric="commute">…</strong><small data-udes-v2-delta="commute">Same-day reference</small></button>
<button type="button" data-udes-v2-open-chart="workspace:transport"><span>Transit share</span><strong data-udes-v2-metric="transitShare">…</strong><small data-udes-v2-delta="transitShare">Same-day reference</small></button>
<button type="button" data-udes-v2-open-chart="workspace:housing"><span>Housing occupancy</span><strong data-udes-v2-metric="housingOccupancy">…</strong><small data-udes-v2-delta="housingOccupancy">Same-day reference</small></button>
<button type="button" data-udes-v2-open-chart="workspace:city"><span>Unemployment</span><strong data-udes-v2-metric="cityUnemployment">…</strong><small>Current model state</small></button>
<button type="button" data-udes-v2-open-chart="workspace:residents"><span>Disposable resources</span><strong data-udes-v2-metric="cityResidual">…</strong><small>After essentials · AED/month</small></button></div>
  </aside>

  <section id="udes-v2-analysis" class="udes-v2-tray" aria-labelledby="udes-v2-tray-title" data-udes-v2-tray hidden>
    <header class="udes-v2-analysis-heading"><div><h2 id="udes-v2-tray-title">City results</h2><span data-udes-v2-analysis-count></span></div><button type="button" class="udes-v2-icon-button" data-udes-v2-action="close-analysis" aria-label="Close chart explorer">×</button></header>
    <nav class="udes-v2-dashboard-nav" aria-label="Results dashboards" data-udes-v2-dashboard-nav></nav>
    <div class="udes-v2-analysis-controls">
      <button type="button" class="udes-v2-text-button" data-udes-v2-action="back-dashboard" hidden>← Dashboard</button>
      <label class="udes-v2-chart-picker">Explore<select data-udes-v2-analysis-picker aria-label="Choose analysis view"></select></label>
      <label data-udes-v2-analysis-window>History<select data-udes-v2-window aria-label="Chart history"><option value="30">30 days</option><option value="90" selected>90 days</option><option value="365">1 year</option><option value="0">Full run</option></select></label>
      <label hidden><span data-udes-v2-analysis-district-label>District</span><select data-udes-v2-analysis-district aria-label="Chart district"></select></label>
      <label hidden>Events<select data-udes-v2-transition-window aria-label="Transition history"><option value="1">1 day</option><option value="7">7 days</option><option value="30" selected>30 days</option></select></label>
    </div>
          <div class="udes-v2-tray-filter" data-udes-v2-flow-controls hidden>
        <label>
          <span>Flow</span>
          <select aria-label="Flow dataset: relocation events or home-to-work stock" data-udes-v2-flow-kind>
            <option value="residential">Residential moves (events)</option>
            <option value="job">Cross-district job switches (events)</option>
            <option value="workplace">Firm-carried workplace changes (events)</option>
            <option value="enterprise">Enterprise moves (events)</option>
            <option value="replacement">Replacement placements (events)</option>
            <option value="commute">Home → work (stock)</option>
          </select>
        </label>
        <label>
          <span>Measure</span>
          <select aria-label="Flow measure" data-udes-v2-flow-measure>
            <option value="agents" selected>Modeled agents</option>
            <option value="represented">Represented equivalents</option>
          </select>
        </label>
        <label>
          <span>Window</span>
          <select aria-label="Movement window" data-udes-v2-flow-window>
            <option value="1">1 day</option>
            <option value="7">7 days</option>
            <option value="30" selected>30 days</option>
          </select>
        </label>
      </div>
    <div class="udes-v2-chart-panels"><section class="udes-v2-chart-panel" data-udes-v2-chart-panel="outcomes" aria-label="City outcome trend" hidden><div class="udes-v2-chart-mount" data-udes-v2-chart="outcomes"></div></section>
<section class="udes-v2-chart-panel" data-udes-v2-chart-panel="districts" aria-label="District analysis" hidden><div class="udes-v2-chart-mount" data-udes-v2-chart="districts"></div></section>
<section class="udes-v2-chart-panel" data-udes-v2-chart-panel="flows" aria-label="Movement analysis" hidden><div class="udes-v2-chart-mount" data-udes-v2-chart="flows"></div></section>
<section class="udes-v2-chart-panel" data-udes-v2-chart-panel="mobility" aria-label="Transport analysis" hidden><div class="udes-v2-chart-mount" data-udes-v2-chart="mobility"></div></section>
<section class="udes-v2-chart-panel" data-udes-v2-chart-panel="citizens" aria-label="Resident analysis" hidden><div class="udes-v2-chart-mount" data-udes-v2-chart="citizens"></div></section>
<section class="udes-v2-chart-panel" data-udes-v2-chart-panel="enterprises" aria-label="Firm analysis" hidden><div class="udes-v2-chart-mount" data-udes-v2-chart="enterprises"></div></section>
<section class="udes-v2-chart-panel" data-udes-v2-chart-panel="analysis" aria-label="Detailed analysis" hidden><div class="udes-v2-chart-mount" data-udes-v2-chart="analysis"></div></section></div>
    <details class="udes-v2-analysis-details"><summary>Reading this view</summary><p class="udes-v2-analysis-note" data-udes-v2-analysis-note></p><p class="udes-v2-result-note" data-udes-v2-result-note>Choose a scenario, then run to compare its effects.</p></details>
    <footer class="udes-v2-result-exports"><button class="udes-v2-text-button" type="button" data-udes-v2-action="export" data-udes-v2-export>Comparison CSV</button><button class="udes-v2-text-button" type="button" data-udes-v2-action="export-experiment">Save experiment</button></footer>
  </section>
</div>

<noscript>
  <p class="udes-v2-noscript">JavaScript is required to run the agent model. The interface uses official Abu Dhabi district geography with clearly classified derived and synthetic assumptions.</p>
</noscript>

<dialog class="udes-v2-methods" data-udes-v2-methods aria-labelledby="udes-v2-methods-title"><header><div><span class="udes-v2-kicker">Model specification</span><h2 id="udes-v2-methods-title">Methods &amp; data</h2></div><button type="button" class="udes-v2-icon-button" data-udes-v2-action="close-methods" aria-label="Close methods">×</button></header><div class="udes-v2-methods-body" data-udes-v2-methods-body></div></dialog>
