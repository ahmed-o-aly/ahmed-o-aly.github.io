# Abu Dhabi Urban Dynamics baseline

This package supports a scenario explorer across 18 selected Greater Abu Dhabi City districts. Al Ain, Al Dhafra and outer Abu Dhabi Region districts are outside the boundary. It combines observed geography and population with explicit assumptions about budgets, jobs, housing and travel. It is not a validated forecast.

The conceptual reference is Correia's [Urban Dynamics Educational Simulator (UDES), version 1.4, February 2018](https://www.anylogic.com/upload/iblock/198/1985a2d61b26c2d23acd158ab6e5d68e.pdf). This implementation adapts its state-based decisions and replaces or extends many mechanics. It is UDES-inspired, not an exact replication. See the [model specification](../../../docs/abu-dhabi-model-specification.md) for actor units, mechanism contracts, metric denominators and limitations.

## Files

- `baseline.json`: zone attributes, directed road graph, synthetic transit services, initial totals, assumptions and field-level provenance. Its graph audit and source metadata record the snapshot counts.
- `zones.geojson`: grouped AD-SDI community polygons with IDs matching the baseline.
- `roads.geojson`: visible, continuous routed road geometry for the model graph, including local/unnamed connectors. All physical segments carry shared directional assignment.
- `transit-stops.geojson`: observed AD-SDI bus-stop points within the polygons; these are not a route timetable.
- `validation-report.json`: full-scale structural verification and separately reported model diagnostics, with source hashes.
- `uncertainty-report.json`: full-scale paired-seed results and declared parameter sensitivity, with source hashes and experiment windows.

The district set is Al Bateen, Al Danah, Al Khalidiyah, Al Manhal / Al Karamah, Al Mushrif, Al Nahyan, Muroor / Al Sa'adah, Al Rawdah, Al Zahiyah, Al Reem Island, Al Maryah Island, Saadiyat Island, Rabdan / Al Maqta, Al Raha, Yas Island, Khalifa City, Mohamed Bin Zayed / Zayed City, and Musaffah. Grouped labels retain component mappings; the map boundary and population definition must agree.

## Evidence and reproducibility

`baseline.json.classifications` distinguishes `observed`, `derived`, `derived-from-observed`, `synthetic`, `reference` and `license`. Each zone and road field retains its own classification. Observed district population does not make its job capacity, rent or place-quality index observed.

SCAD 2024 district totals supply the population reference. AD-SDI supplies community polygons, stops and selected road attributes. OSM/OSRM supplies routed road geometry. The simulation anchor is a representative activity/network location; `geometryCentroid` describes the polygon. Neither is a geocoded home or establishment.

Retrieval dates are distinct from the population reference year and simulation calendar. Frozen source responses under `scripts/data/udes-v2-sources`, with hashes and retrieval metadata in their manifest, make a normal rebuild reproducible. A refresh must be explicit and its mapping/geometry diff inspected. Road observation dates do not establish the exact network that existed in January 2024. Published SCAD all-use property counts and emirate-wide use shares do not identify residential capacity in each model district; the 15% spare-capacity baseline remains a named assumption.

## Road and transit interpretation

The graph uses connected, directed road geometry returned by routing. The committed snapshot has 822 nodes and 1,115 visible physical edges. Every one of the 306 directed interdistrict pairs has its own frozen source route in the shared union; this replaces the sparse 62-route road coverage. Every physical edge bears assignment load. Shared segments accumulate outbound and return demand from all OD pairs in each legal direction. Local approaches remain visible and contribute to congestion along the entire journey. Arbitrary straight-line attachments and disconnected reference-road fragments do not constitute an assigned route.

The graph enforces 159 turn prohibitions at 120 junctions, including 34 prohibited U-turns, conservatively derived from matching incoming/outgoing bearings and consistent frozen OSRM intersection `entry` flags. Ambiguous observations do not establish a restriction, and every complete source route remains traversable. These observations are a partial turn inventory; unknown approaches remain unknown. The source manifest retains 330 responses, including all 306 route responses, with request URLs, hashes and actual retrieval timestamps. Network tests compare every reconstructed candidate polyline against its frozen source after the documented gateway trimming.

The previous gateway/portal capacity exemptions were removed: they incorrectly suppressed shared traffic on real roads, including arterials. Each district still uses one representative gateway, which can overconcentrate local demand. Multiple distributed origins and supported gateway allocations are needed for detailed district bottleneck studies; high loads must remain visible rather than be removed through exemptions.

AD-SDI lane and speed fields affect modeled values only when the recorded strict spatial/semantic match passes; match counts and per-edge provenance are recorded in the baseline. Newly load-bearing roads use the same match rules. Per-lane throughput remains synthetic. The graph is a route union, not a complete signal/turn network. It omits background traffic, freight, nonwork trips, incidents and measured hourly profiles. Road load means **modeled work-trip assignment**, not observed total traffic.

Bus stops are observed, but directional services, headways, speed, waiting time and capacity equivalents remain modeled. Expanding road coverage preserves the existing 62 synthetic transit services and their frequencies, capacities and in-vehicle times; the independent service assumptions are stored in `scripts/data/udes-v2-transit-services.json`. Additional car-road candidates do not create additional bus services. The standard fare reference is AED 2 plus AED 0.05 per passenger-kilometre, capped at AED 5 per journey; scenarios can change the base component. Pass products, transfers and exemptions are incomplete. Historical 2015 all-trip mode shares used as a broad reference are not a calibration target for these work trips.

## Actors, finance and calendar

Resident agents are weighted decision cohorts, defaulting to 250 represented residents each. Employer agents are modeled employer cohorts and their worker slots inherit that weight. Neither represents observed household or establishment microdata. Adult ages are synthetic behavioral attributes; the full population total does not imply that child or family dynamics are modeled.

Population and participation remain fixed. Opening employment is 67% of residents, approximately anchored to the emirate-wide employed/resident ratio; default participation is a synthetic 70%. Subsequent employment is endogenous within that participating pool, constrained by search and employer demand/capacity. The optional `fixed-target` closure is a separately labeled controlled-employment mode. A result is not validated by staying near its initial employment assumption.

Daily decisions include commute assignment, job search, firm actions and relocation reviews. The capacity assignment window is a model duration, not peak-hour traffic. Weekend map views retain and date the most recent workday load. There is no observed public-holiday, Ramadan, seasonal-heat or incident calendar.

Budgets accrue calendar-day salary, rent, support, essentials and fixed vehicle access, plus actual commute expenses, and settle monthly. Vehicle access carries an AED 700 monthly commitment while held; it is not a modeled cash asset purchase. Nonparticipant support is imputed at the cohort's opening and stays fixed afterward, so later rent increases are not automatically reimbursed. Support is not a named public benefit or a conserved transfer from another modeled household.

Positive residual resources after essentials contribute 25% to savings; deficits reduce savings in full. Stress categories refer to budget/commute rules, not measured happiness. Rents, wage updates and demographic replacement operate annually. Housing capacity is a soft resident-stock constraint, not a dwelling count; above-capacity occupancy remains visible.

## Verification and uncertainty

Run from the repository root with Node.js 20.9 or newer:

```sh
node scripts/validate-udes-v2-full.mjs
node scripts/validate-udes-v2-uncertainty.mjs
```

The full report checks stock/denominator reconciliation, conservation, numerical values, job-space capacity and agent invariants over the public scenarios. Broad plausibility bands and preferred scenario directions are diagnostics, not proof that the model is scientifically correct.

Its four-worker runner preserves each scenario's independent seeded engine. `node scripts/validate-udes-v2-full.mjs --verify-concurrency` checks serial/parallel equality and worker-failure propagation without writing a report.

The uncertainty report uses three full-scale same-seed reference/transit pairs and four additional sensitivity pairs by default. Travel statistics pool the final 90 calendar days of completed workday commutes. Financial outcomes use each current cohort's latest account: settled budgets for continuing cohorts and opening estimates for demographic replacements. The report records counts and represented weights of both bases; this is not a homogeneous realized December ledger. Seed summaries show observed spread and signs of scenario differences, not confidence or prediction intervals. Sensitivity varies cost responsiveness and assignment duration by 25%; these are stress ranges, not estimated uncertainty bounds.

Neither report fits behavioral parameters, reconstructs an equilibrated population or tests held-out predictions. Current travel counts/times, household resources and rents, relocation records and establishment changes are still required for empirical validation. Cohort resolution, omitted traffic and alternative model structures remain additional uncertainty.

## Rebuild and sources

```sh
node scripts/build-udes-v2-data.mjs
# Intentionally request a new source snapshot:
node scripts/build-udes-v2-data.mjs --refresh-sources
```

Keep frozen inputs, baseline metadata and generated geometry together. Inspect changes to geographic mappings, classifications and source dates before accepting a refresh. OpenStreetMap attribution must remain visible.

- [AD-SDI Community layer](https://arcgis.sdi.abudhabi.ae/agspublish/rest/services/OpenData/ADSDI_OpenData/MapServer/2)
- [AD-SDI Main Roads layer 407](https://arcgis.sdi.abudhabi.ae/agshost/rest/services/Hosted/BaseMapEng_LightGray_GCS/MapServer/407)
- [AD-SDI Bus Stops layer](https://arcgis.sdi.abudhabi.ae/agspublish/rest/services/OpenData/ADSDI_OpenData/MapServer/801)
- [SCAD 2024 population](https://census.scad.gov.ae/home/population?lang=en)
- [SCAD employed population](https://census.scad.gov.ae/home/labourforce?fid=0&id=0&lang=en&tab=table_employee_population&year=2024)
- [Abu Dhabi Mobility fare reference](https://admobility.gov.ae/en/pb-bus-service/hafilat-public-buses-fees)
- [UN-Habitat transport guide](https://unhabitat.org/sites/default/files/2022/03/nup-transport_guide-web.pdf)
- [OpenStreetMap attribution](https://www.openstreetmap.org/copyright)
- [Project OSRM routing service](https://router.project-osrm.org/)

Publisher, retrieval date, use and classification are recorded in `baseline.json.sources` and the frozen source manifest.
