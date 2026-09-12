# Abu Dhabi Urban Dynamics v2 — data review

Reviewed 11 September 2026. Application code and delivered datasets were not changed. No AGENTS.md was found in the workspace or its checked parent directories. This review covers the local delivered baseline, its builder and data documentation, with checks against the cited official sources. Agent mechanics and visual usability are reviewed separately.

## Assessment

There is a useful foundation here: the population values are genuinely sourced, official polygons and stops are used, classifications distinguish assumptions, and the validation report accurately describes itself as software/sanity evidence. But the observations mostly establish the setting. The quantities that generate the economic and policy results—jobs, housing supply, rent, salary, car ownership, quality, transit service and behavioral parameters—are largely assumed. A realistic-looking map cannot make those outputs locally validated.

The best next version should first define a narrower analytical question, align geography and reference year, and calibrate the few quantities that answer that question. Collecting more unrelated layers or adding more controls would increase the apparent precision without resolving the main uncertainty.

## What is actually in the baseline

| Component | Current evidence | Practical interpretation |
|---|---|---|
| Population | 1,517,535 people across 18 selected model zones, mapped from SCAD 2024 district tables | All 18 numeric mappings verified in this audit; geographic mapping remains a separate issue |
| Geography | AD-SDI community polygons, grouped and simplified; some records excluded by hand-selected cluster radii | Useful official spatial input with model-specific aggregation |
| Bus stops | 924 official points retained from 1,781 within the study bounding box | Observed stop locations do not establish routes, service frequency or accessibility |
| Roads | 536 nodes, 635 edges; 324 capacity-bearing edges, built from 31 chosen OD pairs routed both ways plus three named-road seeds | A selected route union, not a complete urban traffic network |
| Road lanes | Observed AD-SDI lanes applied to 87 of 324 assignment edges (26.9%) | Remaining lanes and every per-lane capacity are assumptions |
| Transit service | 62 directional modeled links derived from the selected road paths | No actual timetable, route identity or transfer network is integrated |
| Housing/jobs | Housing capacity = population × 1.15; job capacity = synthetic jobs × 1.12; firm-place capacity = synthetic jobs / 900 | Supply is constructed from demand assumptions rather than independently measured |
| Economic attributes | Salary, quality, rents, employment themes and car ownership are manually assigned in every district | These attributes encode the author's prior beliefs about places |
| Employment | 67% employed-resident share anchored to emirate-wide totals; 70% participation and 3% job-seeker shares assumed | Regional and demographic heterogeneity is not calibrated |
| Validation | Full-scale fixed-seed regression and provisional plausibility checks | Current and useful software evidence; no empirical accuracy measurement |

Evidence: [builder zone specifications](F:/CODEX/Website/scripts/build-udes-v2-data.mjs:114), [derived capacities](F:/CODEX/Website/scripts/build-udes-v2-data.mjs:1938), [delivered baseline](F:/CODEX/Website/assets/data/udes-v2/baseline.json:133), [validation scope](F:/CODEX/Website/assets/data/udes-v2/validation-report.json:14).

## Priority findings

### 1. A routing anchor is materially outside its own district

Khalifa City uses `[54.697, 24.425]` as its activity/network anchor. Its delivered polygon's maximum longitude is `54.642603`; the anchor is 12.078 km from the polygon's reported geometric centroid `[54.577913, 24.418599]`. A point-in-polygon check confirms it is outside. This is consequential: the builder submits that anchor to OSRM as the origin/destination of corridor routes. All trips involving the district therefore start from a different place than the map's district geography.

Al Raha's anchor is also outside its polygon, although it is only 0.268 km from the geometric centroid. An anchor near a boundary may be defensible if explicitly chosen as an access portal; the Khalifa displacement needs correction and a full rebuild/recheck of routes and outputs. A geometric centroid alone is not necessarily the right replacement. Use representative inhabited locations or multiple district portals and record why they are appropriate.

Evidence: [Khalifa anchor](F:/CODEX/Website/scripts/build-udes-v2-data.mjs:402), [route generation](F:/CODEX/Website/scripts/build-udes-v2-data.mjs:1998), [audit results](F:/CODEX/Website/docs/audits/abu-dhabi-urban-dynamics-2026-09-11/data-checks.json:1).

### 2. Census numbers and polygon extents need a real crosswalk

Al Bateen is assigned all 57,100 people from SCAD's combined **Al Qurm–Al Muzoun–Al Bateen** district, but the builder explicitly uses only the AD-SDI Al Bateen group for its geometry. The source number is real; treating the number as a population measured for that displayed polygon is not established. Consequently density, stop density comparisons, housing demand and trip generation can be assigned to the wrong extent.

Other relabelings (Al Manhal / Al Karamah, Muroor / Al Sa'adah, Rabdan / Al Maqta) are disclosed. Prefer official statistical names as canonical units and familiar names as aliases. Maintain a machine-readable table with census geography, GIS geography/version, exact components, mapping method and confidence. Where boundaries differ, aggregate both sources to a common extent or use documented allocation weights; do not describe simple reassignment as geographic validation.

Evidence: [explicit Al Bateen mismatch](F:/CODEX/Website/scripts/build-udes-v2-data.mjs:128), [geometry grouping/filtering](F:/CODEX/Website/scripts/build-udes-v2-data.mjs:1874).

### 3. The city boundary excludes relevant residents and employers

The modeled population is 53.7% of the Abu Dhabi Region population. A metropolitan subset is reasonable, but this is a selected collection of districts: it also omits central districts such as SCAD's Al Hisn (55,985 residents) and Hadbat Al Za'faranah (30,695), as well as Bani Yas, Shakhbout City, the industrial city and other important external origins/destinations. These examples were read from the same official 2024 table used to verify the included population.

Before interpreting commuting or job redistribution, define the intended functional urban area and represent travel across its boundary. Practical options are a more complete metropolitan zoning system or a few external zones with fixed inbound/outbound demand. A closed selected population cannot establish what interventions do to all city traffic or regional employment.

Evidence: [scope contract](F:/CODEX/Website/assets/data/udes-v2/baseline.json:5); [SCAD Census population](https://census.scad.gov.ae/home/population?lang=en). Exact district table retrieval is recorded in the audit script and JSON.

### 4. Uniform spare housing capacity prejudges housing results

Every district receives 15% more capacity than its starting population, rounded up. Before agent rounding this creates occupancy of 86.54–86.96% across all 18 districts. That is an arithmetic consequence, not an observed pattern of vacancy or crowding. The modeled housing interventions begin from that shared assumption, even though dwelling types, collective accommodation, household size and occupancy vary.

Replace it with residential dwelling stock by type, occupied/vacant stock where available, household-size or occupancy distributions, and separate collective/worker accommodation. Express housing deliveries in units or beds with dates and locations. Convert to resident capacity only through an explicit occupancy model. Use real rent observations differentiated by property type before applying district multipliers.

Evidence: [capacity formulas](F:/CODEX/Website/scripts/build-udes-v2-data.mjs:1954). Available starting sources are [SCAD real estate statistics](https://census.scad.gov.ae/home/realestate?lang=en) and [ADREC market data](https://adrec.gov.ae/en/market-data). SCAD's total units include commercial/other uses; they must not all be counted as dwellings.

### 5. Transport supply is synthetic despite observed-looking geometry

The builder sets bus in-vehicle time to road free-flow time × 1.35 + 2 minutes, sets headways to 8/12/18 minutes from centrality and stop counts, and assumes 80 passengers per vehicle. These links follow selected driving paths. The UI additionally reports an aggregate 48 service-equivalent capacity multiplier. This is a service approximation, not a representation of 31 observed bus routes.

The stop-density accessibility index is `0.15 + 0.85 × sqrt(zone density / maximum zone density)`. It uses real stop counts, but its form, minimum and normalization are invented. It does not measure walk catchments, crossings, heat/shade, frequency, transfers or reachable jobs. Calling it derived is technically compatible with its input; interpreting it as validated access is not.

The road demand is work trips only and is divided over a synthetic 13-hour capacity window. There are no observed link counts or daily profiles, and non-work/freight/background traffic is missing. Road congestion results therefore cannot be read as measured total or peak congestion. Service/route fidelity should precede additional transport controls.

Evidence: [headway rule](F:/CODEX/Website/scripts/build-udes-v2-data.mjs:1849), [transit construction](F:/CODEX/Website/scripts/build-udes-v2-data.mjs:2071), [accessibility formula](F:/CODEX/Website/scripts/build-udes-v2-data.mjs:1941), [UI supply disclosure](F:/CODEX/Website/_projects/abu-dhabi-urban-dynamics-v2.md:353). [Abu Dhabi Mobility publishes bus schedules](https://admobility.gov.ae/en/pb-bus-service); obtain a feed if available, or begin with a small verified set of published routes. Public downloadable GTFS availability was not established in this review.

### 6. Reproduction and refresh are currently mixed together

The builder fetches current GIS/OSRM responses but embeds a fixed retrieval date of 2026-08-28. Population values are hand-entered constants; the documented SCAD request is metadata rather than an executed population extraction. Rebuilding on another date changes the network without updating the hardcoded source dates or refreshing the population crosswalk. The simulation starts in 2024 while its delivered network/stops were fetched in 2026.

The builder lacks raw response snapshots, response hashes, request-level timestamps and pagination/completeness guards. Failed OSRM requests fall back to straight lines and still permit output. The committed baseline has zero fallback routes, and this audit found no present bus-stop truncation, so these are refresh reliability risks rather than claims that today's delivered graph contains such fallbacks.

Separate `fetch-sources` from `build-baseline`: archive raw responses with source/reference year, retrieval date, exact request, version/hash and license; build deterministically from those snapshots; fail a release build on unexpected fallbacks, unmatched population rows, invalid anchors, missing records or invalid geometry. Adopt a clear common-year baseline or explicitly describe a mixed-year scenario baseline.

Evidence: [fixed date](F:/CODEX/Website/scripts/build-udes-v2-data.mjs:7), [fetch helper](F:/CODEX/Website/scripts/build-udes-v2-data.mjs:580), [unpaginated GIS calls](F:/CODEX/Website/scripts/build-udes-v2-data.mjs:672), [straight-line fallback](F:/CODEX/Website/scripts/build-udes-v2-data.mjs:765), [population constants](F:/CODEX/Website/scripts/build-udes-v2-data.mjs:114).

## Data that can improve this without an unrealistic collection program

1. **Geographic integrity first:** correct the anchors; audit statistical/GIS crosswalks; make internal/external scope explicit. These changes use information already available and need no new microdata.
2. **Housing and income realism:** SCAD population, labor and unit statistics provide aggregate anchors; ADREC offers annual rents and lease statistics with product/area filters and exports. SCAD's [2024 Household Income and Expenditure Survey methodology](https://www.scad.gov.ae/documents/20122/0/Household%2BIncome%2Band%2BExpenditure%2BSurvey%2BMethodology%2B2024__for%2Bdissemination.pdf/57bdb234-e880-d35a-fd8a-5a53545edb33?t=1752484511694) explicitly distinguishes Emirati households, non-Emirati households, collective households and labor camps. Use available aggregate tables first; access to anonymized microdata would need to be established separately.
3. **One credible mobility corridor:** use actual stops, schedules, fare rules, service identities and transfers for a few relevant routes; compare modeled journey times with observed/scheduled examples. Expand after those checks pass. The [standard bus fare](https://admobility.gov.ae/en/pb-bus-service/hafilat-public-buses-fees) is correctly represented at its basic level (AED 2 + AED 0.05/km, capped at AED 5); transfers and pass products require additional treatment.
4. **Calibration targets, separate from software tests:** population/household composition, dwelling stock/rent distributions, workplace employment, OD trips by mode, trip-length/time distributions, relocation/job turnover. A historical all-trip mode split is only a broad plausibility reference for a work-trip model.
5. **Uncertainty instead of extra decimal places:** vary the influential assumptions, use multiple seeds and report intervals/directional robustness. With 250 represented people per agent, Al Maryah's 3,375 residents correspond to only about 14 agents; small-zone rates are intrinsically coarse. Define enterprise units/weights explicitly too—600 enterprise agents are not evidence of 600 observed establishments.

## Checks completed

- Fresh POST to the source's `home/IndicatorData` endpoint with its recorded 2024 request: every included zone's numeric population matches its intended source record(s). The endpoint requires POST; a GET returned 404.
- Independent point-in-polygon check of all 18 anchors: two outside, as detailed above.
- Recalculation of baseline housing occupancy: near-uniform 86.5–87.0% is generated by the 15% buffer.
- All four SHA-256 hashes in the committed validation report match the current local engine, baseline, public controller and validation harness. The report is therefore tied to the current local artifacts.
- Current official stop query count: 1,781; returned records: 1,781; all returned POINT_TYPE values were 1. The baseline retains 924 inside its selected polygons and excludes 857.

The repeatable population/anchor/hash checks are in [check-data.mjs](F:/CODEX/Website/docs/audits/abu-dhabi-urban-dynamics-2026-09-11/check-data.mjs), with results in [data-checks.json](F:/CODEX/Website/docs/audits/abu-dhabi-urban-dynamics-2026-09-11/data-checks.json). Run `node docs/audits/abu-dhabi-urban-dynamics-2026-09-11/check-data.mjs` from the repository root; it reads application files and writes only its audit JSON.
