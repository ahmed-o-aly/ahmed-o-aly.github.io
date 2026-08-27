# Abu Dhabi City UDES v2 baseline

This directory is a compact, reproducible spatial baseline for the browser simulation. It covers 18 distinct Greater Abu Dhabi City model zones and deliberately excludes Al Ain, Al Dhafra, and outer Abu Dhabi Region districts outside the selected metropolitan study area.

The simulation adapts the published [Urban Dynamics for Egyptian Settlements (UDES) agent logic](https://www.anylogic.com/upload/iblock/198/1985a2d61b26c2d23acd158ab6e5d68e.pdf). Citizen satisfaction states and recovery choices follow that conceptual structure; the sector-demand, operating-margin, labor-access, and access-aware enterprise behaviors are explicit Abu Dhabi planning extensions.

## Files

- `baseline.json` is the data contract used by the simulation: zone attributes, the aggregate road graph, modeled transit links, calibration totals, assumptions, sources, and per-field provenance.
- `zones.geojson` contains grouped official AD-SDI community polygons. Every feature has a stable kebab-case `id` matching `baseline.json`.
- `roads.geojson` contains 31 static, routable OpenStreetMap/OSRM corridors between zone activity anchors. It is an aggregate zone network, not every street.
- `transit-stops.geojson` contains 924 official AD-SDI bus-stop points falling inside the selected zone polygons.

The zone set is: Al Bateen, Al Danah, Al Khalidiyah, Al Manhal / Al Karamah, Al Mushrif, Al Nahyan, Muroor / Al Sa'adah, Al Rawdah, Al Zahiyah, Al Reem Island, Al Maryah Island, Saadiyat Island, Rabdan / Al Maqta, Al Raha, Yas Island, Khalifa City, Mohamed Bin Zayed / Zayed City, and Musaffah.

## Provenance contract

`baseline.json.classifications` defines the labels used throughout the package:

- `observed`: published directly by a cited government source.
- `derived`: calculated from observed geometry/stops or an OSM route snapshot.
- `derived-from-observed`: calculated solely from cited observed records.
- `synthetic`: a transparent starting assumption requiring calibration before policy use.
- `reference`: published evidence consulted as a reasonableness check or rejected implementation source.
- `license`: reuse and attribution terms for a cited source.

Each zone has `sourceClassByField`; consumers should expose those classifications instead of presenting all values as official. All 18 selected-zone population totals are mapped from SCAD's complete 2024 Abu Dhabi Region district table: 12 are direct mappings and 6 are grouped or relabeled mappings derived from observed records. Combined familiar-area labels—such as Al Bateen, Al Manhal / Al Karamah, Muroor / Al Sa'adah, Rabdan / Al Maqta, and Mohamed Bin Zayed / Zayed City—retain explicit mapping notes and components. All job estimates, capacities, rent/quality indices, salaries, employment themes, road capacity, and transit service variables remain synthetic baselines.

The simulation-facing `centroid` is a hand-selected representative activity/network anchor. `geometryCentroid` is calculated from the grouped official polygon. Keeping both avoids routing a sprawling district from an unrepresentative geometric center.

## Temporal cadence

The engine advances one calendar day at a time. Commute assignment, network loading, citizen decisions, labor matching, and enterprise actions are daily processes. Household finance and enterprise accounts close monthly, while rent response, wage growth, ageing, and mortality replacement are annual. Weekend snapshots retain the most recent workday network assignment and identify its date explicitly.

This cadence is a model rule, not an observed Abu Dhabi daily-demand calibration. The baseline has no measured weekday profile, public-holiday or Ramadan schedule, seasonal-heat response, incident pattern, or hourly road/transit counts. `baseline.json.temporal` records that distinction so a daily interface cannot be mistaken for empirical day-level precision.

## Spatial mappings and limitations

Official AD-SDI community polygons are grouped by district ID. A few legacy community records are geographically displaced despite sharing valid district IDs; the build uses documented city-cluster anchors and radii to exclude those records reproducibly. Feature properties report the included community IDs and `excludedDisplacedCommunityRecords` count.

Label mappings are explicit: Muroor uses the official Al Sa'adah geography; Al Manhal supplies the combined Al Manhal / Al Karamah label; Rabdan supplies Rabdan / Al Maqta; Al Reem combines the applicable official Reem district IDs; and Mohamed Bin Zayed / Zayed City combines the applicable official district IDs.

The official AD-SDI RoadCenterline layer was inspected first. It yielded 13,131 eligible major segments in scope but no ready navigable topology or turn restrictions, so embedding it would be both heavy and misleading as a routing graph. The delivered network instead uses static OSRM routes over OpenStreetMap. Visible `© OpenStreetMap contributors` attribution is required in the UI.

Bus-stop points are observed. The reference standard pay-as-you-go fare follows Abu Dhabi Mobility's published formula of AED 2 plus AED 0.05 per passenger-kilometre in each direction, capped at AED 5 per journey; scenarios can vary the base component. Pass products, transfers, and exemptions are not represented. Published route and timetable data has not yet been integrated, so transit links, headways, capacities, waits, and in-vehicle times remain modeled. This package is suitable as a transparent demonstration baseline, not policy-grade forecasting without calibration and validation.

Mode-choice outputs are checked against a broad historical reference only: UN-Habitat reports 2015 Abu Dhabi all-trip shares from UITP (2019) of 59.6% private car, 4.5% taxi, 13.9% private bus, 2.3% public transport, and 19.7% walking. The browser model represents work trips and aggregates taxis with cars and private/public buses as transit, so this reference is a plausibility band—not direct calibration evidence. A current household travel survey is still required for policy use.

The reference engine also makes its behavioral adaptation explicit: same-zone commutes are distributed across car, transit, and walking; commute-only hardship spends 45 days in Waiting before it can become Extreme; and car disposal requires a severe financial signal rather than a long commute alone. Configuration switches retain the point-zone, immediate-guard, and automatic-disposal behavior for UDES-exact comparison.

Housing capacity is modeled as a soft stock constraint. Occupancy above 100% is reported as overcrowding and increases rent pressure; it does not silently relocate residents to an arbitrary fallback district. Road and transit capacities are also soft assignment constraints: excess demand produces congestion or crowding and is reported as overflow, while inter-district travelers are never converted into implausible forced walkers. The reference labor market targets 80% employment, with a vacancy buffer for matching and enterprise turnover, instead of treating every vacancy as a reason to converge to 100% employment.

Enterprise exit is conditional rather than random: a firm already at minimum scale must remain below a −20% operating margin for 12 monthly observations before it exits, relocates to the lowest-rent available district, and re-enters after a 14-day startup period.

Car ownership can also change. Carless agents periodically evaluate a purchase using income and savings gates plus the generalized cost of car, transit, and walking for their current commute; financially severe owners can dispose of a car. This ownership process is a transparent Abu Dhabi calibration extension rather than a rule copied from the UDES paper. The output therefore reports both daily commute mode and resident car ownership, which are related but not interchangeable.

Household finance distinguishes monthly net income from saving. Net income is salary less housing and modeled transport costs. The reference configuration then subtracts AED 2,500 of essential monthly consumption: households add 25% of any remaining positive residual to their modeled savings stock, while a negative residual is drawn down in full. These transparent behavioral assumptions are exposed in every city snapshot and require household-survey calibration before policy use.

## Engine validation

`validation-report.json` records reproducible full-scale checks using the committed baseline, one weighted citizen agent per 250 SCAD-mapped residents, 600 enterprise agents, and seed `240124`. The current mapped population produces 6,070 citizen agents. The companion script runs one-year reference and transit-first scenarios plus all four public policy packages over the exact ten-calendar-year horizon ending on 2034-01-01. Regression tests separately cover deterministic replay, reciprocal agent references, finite outputs, population conservation, dissatisfaction-episode reset, weekend network consistency, housing-policy order independence, final-load congestion and crowding, long-run scenario direction, zero forced or unserved inter-district trips, enterprise exit/re-entry, and long-run enterprise stability.

These are software, structural, and plausibility checks—not empirical validation of a forecast. Current household travel, establishment, rent, income, and longitudinal relocation data are still required to estimate parameters and test predictive accuracy before policy use.

## Sources

- [AD-SDI Community layer](https://arcgis.sdi.abudhabi.ae/agspublish/rest/services/OpenData/ADSDI_OpenData/MapServer/2)
- [AD-SDI RoadCenterline layer](https://arcgis.sdi.abudhabi.ae/agspublish/rest/services/OpenData/ADSDI_OpenData/MapServer/101)
- [AD-SDI Bus Stops layer](https://arcgis.sdi.abudhabi.ae/agspublish/rest/services/OpenData/ADSDI_OpenData/MapServer/801)
- [AD-SDI catalogue terms](https://sdi.gov.abudhabi/sdi/Imagenarycatalogue.html)
- [SCAD Census population 2024](https://census.scad.gov.ae/home/population?lang=en)
- [Abu Dhabi Mobility Standard Service fare](https://admobility.gov.ae/en/pb-bus-service/hafilat-public-buses-fees)
- [UN-Habitat National Urban Policy Transport Guide](https://unhabitat.org/sites/default/files/2022/03/nup-transport_guide-web.pdf)
- [OpenStreetMap copyright and attribution](https://www.openstreetmap.org/copyright)
- [Project OSRM public routing service](https://router.project-osrm.org/)

The precise retrieval date, publisher, use, and classification for every source are embedded under `baseline.json.sources`.

## Rebuild

From the repository root with Node.js 20.9 or newer:

```sh
node scripts/build-udes-v2-data.mjs
```

The script fetches current official communities and bus stops, rebuilds routed corridors, and overwrites the four generated JSON/GeoJSON files. Rebuilding later can change the snapshot; inspect the diff and keep `generatedAt`/source retrieval dates aligned when intentionally refreshing it.
