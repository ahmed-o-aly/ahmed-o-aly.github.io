---
layout: simulation-v2
title: Abu Dhabi Urban Dynamics Lab
permalink: /projects/abu-dhabi-urban-dynamics-v2/
description: A desktop agent-based planning console for exploring housing, enterprise, and mobility scenarios across Greater Abu Dhabi City.
eyebrow: Agent-based planning lab
importance: 0
category: simulation
preview: false
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
        <span class="udes-v2-kicker">Scenario studio</span>
        <h2 id="udes-v2-controls-title">Abu Dhabi interventions</h2>
      </div>
      <button class="udes-v2-text-button" type="button" data-udes-v2-action="reset-levers">Reset draft</button>
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
        <label class="udes-v2-select-row" for="udes-v2-window">
          <span>Trend window</span>
          <select id="udes-v2-window" data-udes-v2-window>
            <option value="30">Last 30 days</option>
            <option value="90" selected>Last 90 days</option>
            <option value="365">Last year</option>
            <option value="0">Full run</option>
          </select>
        </label>
        <label class="udes-v2-select-row" for="udes-v2-seed">
          <span>Random seed</span>
          <input id="udes-v2-seed" type="number" min="1" max="999999" step="1" value="240124" inputmode="numeric" data-udes-v2-seed>
        </label>
        <div class="udes-v2-cadence-note">
          <strong>Daily decisions, explicit accounting periods</strong>
          <p>Commutes, network loading, citizen decisions, job matching and enterprise actions run daily. Household finance and enterprise accounts close monthly; rents update annually.</p>
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
          <h3 id="udes-v2-agents-title">Agent calibration</h3>
          <span>Applied to both runs</span>
        </div>
        <p class="udes-v2-control-explainer">These inputs define behavior; they are not policies. Changes apply to both the scenario and same-seed reference so the comparison remains like-for-like.</p>
        <details class="udes-v2-agent-method" open>
          <summary>Citizen and enterprise objectives</summary>
          <dl>
            <div>
              <dt>Citizen objective</dt>
              <dd>Employed citizens and active job seekers try to keep monthly resources—earned salary plus any explicitly modeled non-labor resources, less housing and transport—above the buffer while keeping a work trip below the acceptable limit. Citizens outside the modeled labor force do not search for jobs; they still review housing cost and place quality.</dd>
            </div>
            <div>
              <dt>Citizen response</dt>
              <dd>Happy agents pursue meaningfully higher-quality locations. Waiting and Extreme agents review better work, lower rent and shorter commutes daily through their statechart, but a review is not a completed move. Moves require a minimum benefit, a follow-through draw, a minimum stay and a return lockout; financially severe agents may give up a car.</dd>
            </div>
            <div>
              <dt>Enterprise objective</dt>
              <dd>Maintain the target operating margin after wages, business rent, fixed costs, sector demand, vacancies, and labor accessibility.</dd>
            </div>
            <div>
              <dt>Enterprise response</dt>
              <dd>Working firms enter Grow or Lesser with economics-adjusted hazards, then change jobs and wages. Relocation is a separate, infrequent decision requiring a material quality/labor-access gain or rent saving and a minimum stay. A firm at minimum scale exits only after 12 consecutive months below a −20% margin; its agent slot re-enters after a 14-day setup period.</dd>
            </div>
            <div>
              <dt>Labor market</dt>
              <dd>The 6,070 citizen agents each represent 250 residents. The opening stock contains 4,067 employed agents, 182 active job seekers and 1,821 residents outside the modeled labor force. Employment is held near the SCAD-derived 67% employed-resident reference share. The separate 70% participation split—and its 3 percentage-point active-seeker reserve—is an explicit, replaceable scenario assumption, not an observed city calibration.</dd>
            </div>
            <div>
              <dt>Housing and network capacity</dt>
              <dd>Housing stock is a soft overcrowding constraint that feeds rent pressure. Road and transit overflow becomes congestion or crowding; it never turns a long inter-district commute into a forced walk.</dd>
            </div>
            <div>
              <dt>Fixed reference assumptions</dt>
              <dd>Severe net income: AED −500/month. Essential consumption: AED 2,500/month. Nonparticipants receive an uncalibrated household/non-labor resource equal to current housing, essentials and an AED 1,500 residual buffer so zero wages do not automatically mean extreme distress. Households save 25% of a positive residual after essentials and draw down the full negative residual. Relocation requires at least AED 600/month rent saving or a 10-minute commute improvement plus AED 500/month generalized benefit; job switches require an 8% raise and AED 500 net gain.</dd>
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
        <label class="udes-v2-form-row" for="udes-v2-employment-target">
          <span>
            <span>Employed-resident target</span>
            <output for="udes-v2-employment-target" data-udes-v2-output="employmentTarget">67%</output>
          </span>
          <input id="udes-v2-employment-target" type="range" min="55" max="85" step="1" value="67" data-udes-v2-lever="employmentTarget" data-udes-v2-assumption>
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

      <section id="udes-v2-control-panel-evidence" class="udes-v2-control-section udes-v2-evidence-panel" role="tabpanel" aria-labelledby="udes-v2-control-tab-evidence" data-udes-v2-control-panel="evidence" hidden>
        <div class="udes-v2-section-heading">
          <h3 id="udes-v2-evidence-title">Abu Dhabi evidence coverage</h3>
          <span>Base 2024 · sources checked 2026</span>
        </div>
        <dl class="udes-v2-evidence-list">
          <div><dt>Agent stock</dt><dd><b class="is-derived">Weighted</b> 6,070 citizen agents × 250 residents + 600 enterprise agents</dd></div>
          <div><dt>District geography</dt><dd><b class="is-derived">Derived</b> 18 groups from official AD-SDI polygons</dd></div>
          <div><dt>Bus-stop locations</dt><dd><b class="is-observed">Observed</b> 924 AD-SDI points</dd></div>
          <div><dt>District population</dt><dd><b class="is-mixed">SCAD-mapped</b> 12 direct + 6 grouped / relabeled mappings</dd></div>
          <div><dt>Employed-resident anchor</dt><dd><b class="is-derived">SCAD-derived</b> 67% · 2.76m employed / 4.14m residents emirate-wide</dd></div>
          <div><dt>Labor-force split</dt><dd><b class="is-synthetic">Assumed</b> 70% participating · 3% of residents active job seekers · 30% nonparticipants</dd></div>
          <div><dt>Standard bus fare</dt><dd><b class="is-observed">Observed</b> AED 2 + 0.05 / km · max 5</dd></div>
          <div><dt>Road assignment</dt><dd><b class="is-derived">OSM-routed</b> 536 nodes · 635 edges · 324 capacity-bearing edges · 241 visible arterial / gateway segments</dd></div>
          <div><dt>Main-road lanes</dt><dd><b class="is-mixed">AD-SDI matched</b> observed lanes on 87 / 324 assignment edges; other lanes remain road-class assumptions</dd></div>
          <div><dt>Zone portals</dt><dd><b class="is-synthetic">Excluded from V/C</b> 76 centroid-shared access edges remain routeable but cannot appear as fake bottlenecks</dd></div>
          <div><dt>Work-trip capacity window</dt><dd><b class="is-synthetic">Assumed</b> 13 hours/day · outbound + return work trips</dd></div>
          <div><dt>Jobs, rents and incomes</dt><dd><b class="is-synthetic">Assumed</b> 18 / 18 districts</dd></div>
          <div><dt>Bus routes and timetables</dt><dd><b class="is-synthetic">Assumed</b> 31 service links · 48 service-equivalent capacity multiplier</dd></div>
          <div><dt>Household and firm churn</dt><dd><b class="is-derived">Guarded</b> annualized event-rate ceilings · not locally calibrated</dd></div>
        </dl>
        <div class="udes-v2-cadence-note udes-v2-cadence-note--warning">
          <strong>Interpretation boundary</strong>
          <p>This is a transparent scenario model, not an Abu Dhabi forecast. It has real geography, named routed arterials, directional road topology and stops, but no observed all-traffic link counts, daily demand profile, holiday/Ramadan schedule, incidents, household travel survey, establishment census or district rent series. Each district still uses an aggregate demand portal rather than address-level trip origins; shared portal chains are therefore excluded from road V/C until routes reach the physical network. Road V/C describes assigned modeled work trips over the stated 13-hour daily capacity window, not measured total or peak-hour traffic. Bus capacity is an aggregate service-equivalent assumption—not the capacity of one observed route.</p>
        </div>
        <nav class="udes-v2-source-links" aria-label="Model sources">
          <a href="https://www.anylogic.com/upload/iblock/198/1985a2d61b26c2d23acd158ab6e5d68e.pdf" target="_blank" rel="noreferrer">UDES paper</a>
          <a href="https://census.scad.gov.ae/home/population?lang=en" target="_blank" rel="noreferrer">SCAD Census</a>
          <a href="https://census.scad.gov.ae/home/labourforce?lang=en" target="_blank" rel="noreferrer">SCAD employment</a>
          <a href="https://admobility.gov.ae/en/pb-bus-service/hafilat-public-buses-fees" target="_blank" rel="noreferrer">Bus tariff</a>
          <a href="https://adrec.gov.ae/en/market-data" target="_blank" rel="noreferrer">ADREC market data · future calibration</a>
          <a href="https://arcgis.sdi.abudhabi.ae/agspublish/rest/services/OpenData/ADSDI_OpenData/MapServer/2" target="_blank" rel="noreferrer">AD-SDI geography</a>
          <a href="https://arcgis.sdi.abudhabi.ae/agspublish/rest/services/Pub/AD_Navigable_Roads/NAServer" target="_blank" rel="noreferrer">AD-SDI navigable roads · reference</a>
          <a href="https://arcgis.sdi.abudhabi.ae/agshost/rest/services/Hosted/BaseMapEng_LightGray_GCS/MapServer/407" target="_blank" rel="noreferrer">AD-SDI main-road lanes</a>
          <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap roads + basemap</a>
          <a href="{{ '/assets/data/udes-v2/validation-report.json' | relative_url }}" target="_blank">Validation report</a>
        </nav>
      </section>
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
        <span class="udes-v2-kicker">Spatial view</span>
        <h2 id="udes-v2-map-title">Abu Dhabi agents and arterial network</h2>
      </div>
      <div class="udes-v2-map-layers" role="group" aria-label="Map metric">
        <button type="button" data-udes-v2-map-layer="network" aria-pressed="false">Road V/C</button>
        <button type="button" data-udes-v2-map-layer="population" aria-pressed="false">Population</button>
        <button type="button" data-udes-v2-map-layer="access" aria-pressed="false">Commute</button>
        <button type="button" data-udes-v2-map-layer="rent" aria-pressed="false">Rent</button>
        <button type="button" data-udes-v2-map-layer="agents" aria-pressed="true">Agents + flows</button>
      </div>
      <button class="udes-v2-text-button" type="button" data-udes-v2-action="fit-emirate">Fit city</button>
    </div>

    <div class="udes-v2-map-stage">
      <div
        id="udes-v2-map"
        class="udes-v2-map-mount"
        role="region"
        aria-label="Interactive map of Greater Abu Dhabi City districts with a labeled basemap, all modeled citizen and enterprise agents, routed home-to-work flows, and named arterial road segments"
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
        <strong>Road load</strong>
        <span><i class="is-low"></i>Below 65%</span>
        <span><i class="is-medium"></i>65–90%</span>
        <span><i class="is-high"></i>Above 90%</span>
        <span hidden><i></i></span>
        <span hidden><i></i></span>
      </div>

      <div class="udes-v2-map-readout" data-udes-v2-map-readout>
        <span data-udes-v2-map-status>Map controller not connected</span>
        <span>Official AD-SDI district groups · OSM basemap and routed named arterials</span>
      </div>
    </div>

    <p id="udes-v2-map-caption" class="udes-v2-sr-only">
      Eighteen model districts, grouped from official AD-SDI community polygons, are shown over a labeled OpenStreetMap basemap with all 6,070 modeled citizen agents (250 represented residents each), all 600 enterprise agents, directional home-to-work flows, shared named arterial road segments, and public-transport stops. Agent positions are deterministic display locations inside each modeled district, not geocoded addresses. Load-colored roads carry assigned model demand; thin neutral dashed roads are map context only and carry no assigned origin-to-destination demand. Local streets appear only as muted basemap reference and are not simulation edges. Al Ain and Al Dhafra are outside the model boundary.
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
          <strong data-udes-v2-metric="zoneSatisfaction">—</strong>
          <small data-udes-v2-delta="zoneSatisfaction">Same-day reference</small>
        </div>

        <dl class="udes-v2-metric-list">
          <div><dt>Population</dt><dd data-udes-v2-metric="zonePopulation">—</dd></div>
          <div><dt>Jobs</dt><dd data-udes-v2-metric="zoneJobs">—</dd></div>
          <div><dt>Housing capacity</dt><dd data-udes-v2-metric="zoneHousing">—</dd></div>
          <div><dt>Housing rent (AED/month)</dt><dd data-udes-v2-metric="zoneRent">—</dd></div>
          <div><dt>Mean commute</dt><dd data-udes-v2-metric="zoneCommute">—</dd></div>
          <div><dt>Car share</dt><dd data-udes-v2-metric="zoneCarShare">—</dd></div>
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

  <section class="udes-v2-tray" aria-labelledby="udes-v2-tray-title" data-udes-v2-tray>
    <div class="udes-v2-tray__bar">
      <div class="udes-v2-tray__label">
        <span class="udes-v2-kicker">Diagnostics</span>
        <h2 id="udes-v2-tray-title">Scenario evidence</h2>
      </div>
      <div class="udes-v2-chart-tabs" role="tablist" aria-label="Outcome chart views">
        <button id="udes-v2-chart-tab-outcomes" type="button" role="tab" aria-selected="true" aria-controls="udes-v2-chart-panel-outcomes" data-udes-v2-chart-tab="outcomes">Outcomes</button>
        <button id="udes-v2-chart-tab-districts" type="button" role="tab" aria-selected="false" aria-controls="udes-v2-chart-panel-districts" tabindex="-1" data-udes-v2-chart-tab="districts">Districts</button>
        <button id="udes-v2-chart-tab-flows" type="button" role="tab" aria-selected="false" aria-controls="udes-v2-chart-panel-flows" tabindex="-1" data-udes-v2-chart-tab="flows">Moves</button>
        <button id="udes-v2-chart-tab-mobility" type="button" role="tab" aria-selected="false" aria-controls="udes-v2-chart-panel-mobility" tabindex="-1" data-udes-v2-chart-tab="mobility">Mobility</button>
        <button id="udes-v2-chart-tab-citizens" type="button" role="tab" aria-selected="false" aria-controls="udes-v2-chart-panel-citizens" tabindex="-1" data-udes-v2-chart-tab="citizens">Citizens</button>
        <button id="udes-v2-chart-tab-enterprises" type="button" role="tab" aria-selected="false" aria-controls="udes-v2-chart-panel-enterprises" tabindex="-1" data-udes-v2-chart-tab="enterprises">Enterprises</button>
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
      <button class="udes-v2-text-button" type="button" data-udes-v2-action="export" data-udes-v2-export>Export CSV</button>
    </div>

    <div class="udes-v2-chart-panels">
      <section id="udes-v2-chart-panel-outcomes" class="udes-v2-chart-panel" role="tabpanel" aria-labelledby="udes-v2-chart-tab-outcomes" data-udes-v2-chart-panel="outcomes">
        <dl class="udes-v2-summary-strip">
          <div><dt>Satisfied</dt><dd class="udes-v2-summary-value" data-udes-v2-metric="satisfaction">—</dd><dd class="udes-v2-summary-delta" data-udes-v2-delta="satisfaction">Same-seed reference</dd></div>
          <div><dt>Mean commute</dt><dd class="udes-v2-summary-value" data-udes-v2-metric="commute">—</dd><dd class="udes-v2-summary-delta" data-udes-v2-delta="commute">Same-seed reference</dd></div>
          <div><dt>Transit share</dt><dd class="udes-v2-summary-value" data-udes-v2-metric="transitShare">—</dd><dd class="udes-v2-summary-delta" data-udes-v2-delta="transitShare">Same-seed reference</dd></div>
          <div><dt>Housing occupancy</dt><dd class="udes-v2-summary-value" data-udes-v2-metric="housingOccupancy">—</dd><dd class="udes-v2-summary-delta" data-udes-v2-delta="housingOccupancy">Same-seed reference</dd></div>
        </dl>

        <div class="udes-v2-chart-canvas" data-udes-v2-chart="outcomes"><p class="udes-v2-chart-empty">Daily outcome and same-seed reference trends are loading.</p></div>
      </section>

      <section id="udes-v2-chart-panel-districts" class="udes-v2-chart-panel" role="tabpanel" aria-labelledby="udes-v2-chart-tab-districts" data-udes-v2-chart-panel="districts" hidden>
        <div class="udes-v2-chart-mount" data-udes-v2-chart="districts"><p class="udes-v2-chart-empty">District comparisons and selected-district daily trends are loading.</p></div>
      </section>
      <section id="udes-v2-chart-panel-flows" class="udes-v2-chart-panel" role="tabpanel" aria-labelledby="udes-v2-chart-tab-flows" data-udes-v2-chart-panel="flows" hidden>
        <div class="udes-v2-chart-mount" data-udes-v2-chart="flows"><p class="udes-v2-chart-empty">Cross-district routes and origin–destination totals are loading.</p></div>
      </section>
      <section id="udes-v2-chart-panel-mobility" class="udes-v2-chart-panel" role="tabpanel" aria-labelledby="udes-v2-chart-tab-mobility" data-udes-v2-chart-panel="mobility" hidden>
        <div class="udes-v2-chart-mount" data-udes-v2-chart="mobility"><p class="udes-v2-chart-empty">Daily mode choice, commute burden and named-corridor pressure are loading.</p></div>
      </section>
      <section id="udes-v2-chart-panel-citizens" class="udes-v2-chart-panel" role="tabpanel" aria-labelledby="udes-v2-chart-tab-citizens" data-udes-v2-chart-panel="citizens" hidden>
        <div class="udes-v2-chart-mount" data-udes-v2-chart="citizens"><p class="udes-v2-chart-empty">Citizen states, financial position, and daily decisions are loading.</p></div>
      </section>
      <section id="udes-v2-chart-panel-enterprises" class="udes-v2-chart-panel" role="tabpanel" aria-labelledby="udes-v2-chart-tab-enterprises" data-udes-v2-chart-panel="enterprises" hidden>
        <div class="udes-v2-chart-mount" data-udes-v2-chart="enterprises"><p class="udes-v2-chart-empty">Enterprise states, margins, and daily decisions are loading.</p></div>
      </section>
    </div>

  </section>
</div>

<noscript>
  <p class="udes-v2-noscript">JavaScript is required to run the agent model. The interface uses official Abu Dhabi district geography with clearly classified derived and synthetic assumptions.</p>
</noscript>
