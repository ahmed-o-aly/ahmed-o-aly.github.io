# Dashboard and road-network revision — 12 September 2026

The reported problems were incomplete road coverage around Rabdan, a perceived gap between Yas and Saadiyat, and result views that stopped at two charts. This revision addresses road topology and chart organization together; rendering more roads or more plots alone does not establish model validity.

## Reference and interaction

The [UDES model](https://cloud.anylogic.com/model/47990ad8-ab7c-4fc5-88e5-0e3771cb5303?mode=SETTINGS) was opened in the in-app browser and its city and selected-zone results pages inspected directly. The [reference manual](https://www.anylogic.com/upload/iblock/198/1985a2d61b26c2d23acd158ab6e5d68e.pdf) documents seven city plots plus a district table, and ten plots on the detailed zone page. The final live captures are [udes-city-live.png](udes-city-live.png) and [udes-district-live.png](udes-district-live.png). An initial guest session reached its time limit; a fresh run was paused at its opening date and both result screens were captured before the limit. This verifies their arrangement and navigation, not long-run reference behavior.

The implemented interaction follows those complete results pages: charts remain closed until requested, each dashboard gathers related questions, and any plot can expand individually. It does not copy the reference's variables where this model has no defensible equivalent output.

| Dashboard           | Charts | Main questions                                                                                                                                             |
| ------------------- | -----: | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| City                |      9 | Resident and employer states, labor composition, resources, travel modes and duration, vehicle stock, employer size, housing occupancy                     |
| Selected district   |      8 | Resident/capacity history, resident states and modes, rent, employment and local jobs, workplace destinations, employer states, commute means by workplace |
| Transport           |      6 | Commute distribution, modes, vehicle stock, district differences, coverage and network pressure                                                            |
| District comparison |      6 | Population/jobs, commute, housing, rent/commute tradeoffs, labor and resources                                                                             |
| Housing             |      6 | Housing pressure, rent/commute tradeoffs, occupancy, district stocks and resources                                                                         |
| Residents           |      6 | Decision states, budgets, resources, labor, transitions and vehicle stock                                                                                  |
| Firms               |      6 | Decision states, employer size, viability, location, labor and unemployment                                                                                |
| Roads               |      6 | Assignment coverage, pressure, commute distribution, district differences, modes and commute history                                                       |

There are 43 selectable views: eight dashboards and 35 individual analyses. A shared history control filters retained observations. Expanding and returning preserves the district and history window. Three columns show all nine city charts or eight district charts at the tested 1056 × 912 viewport; the tested 1280 × 720 viewport shows six complete charts, with the remaining row accessible inside the chart area. The command bar stays available and closing charts restores the map. No phone-specific redesign was requested.

## Chart meaning

Most dashboards combine distributions, stacked composition, stock reconciliation, comparisons and histories. These are distinct model outputs, not decorative variants of one time series. District histories retain exact recorded dates, including the reference history; missing dates or values remain gaps. Reference comparisons join exact dates. A zero is shown only where complete counts establish it.

District travel modes describe current employed residents, including unserved/no-commute states. City mode histories summarize completed workdays. Workplace charts show current worker stocks and actual destination-specific commute means. The latter are not within-district commute histograms, which the engine does not currently retain. Resident transition counts are events over the chosen observation window, not unique residents or transition probabilities. The transition district control does not silently change citywide budget charts.

Units, denominators and dates are available in subtitles, tooltips, accessible summaries and the collapsed reading guide. Detailed chart expansion exposes a larger plot and time zoom without filling each dashboard card with controls. Missing reference values remain unavailable; hiding the reference also removes its comparison summaries.

## Roads

The [network review](network.md) contains the frozen-source audit, new coverage and routing benchmarks. The road union now includes all 306 directed pairs of the same 18 district gateways: 1,115 physical edges and 159 source-supported turn restrictions. These roads carry shared assigned demand; no visible simulated road is exempt from capacity accounting. The 62 existing synthetic transit services are preserved separately from the expanded road routes.

North of Rabdan, the expanded union supplies real sections of Sheikh Rashid bin Saeed Street, Sheikh Zayed bin Sultan Street, Al Khaleej Al Arabi Street and Rabdan Street. Yas–Saadiyat already had continuous E12 geometry in both directions; the refreshed map visibly retains it. No invented connector was added there.

Road strokes are thinner and distinguish hierarchy. Sparse, slow arrows still sample actual directed assignment. Unassigned roads remain visible in gray: the absence of modeled work-trip demand is not a claim that a real road is empty. Background travel, freight, nonwork trips, time-of-day demand and signal operations remain outside this simulation.

The road tooltip and inspector distinguish a prohibited direction from a traversable road with no assigned demand. An explicitly prohibited direction reads **Closed** for time and load ratio; missing directional data reads **Unavailable**. Recorded zero assigned vehicles remain zero. Focused tests cover one-way and reverse-only roads, missing permissions and missing directional times without substituting a combined-road time.

## Visual and interaction checks

- [Opening network before](before-network-fit.png) and [after](network-opening.png) use the same 1280 × 720 viewport, fitted city extent and 1 January 2024 model date. The changed colors reflect changed routing and loads as well as thinner road styling; they are not a calibration comparison. E12 is continuous in both captures and additional Rabdan/inter-island coverage is visible after the revision.
- [City dashboard](city-dashboard.png), [district dashboard](district-dashboard.png) and [expanded district chart](district-expanded.png) show the new day-30 view at 1056 × 912. All plotted rows fit without footer overlap. The [shorter desktop view](city-dashboard-short-desktop.png) shows six complete charts and a visible internal scrollbar.
- The earlier [paired view](before-paired-view.png) records the previous interaction at a different simulation day. It supports a layout comparison only, not a numerical comparison.
- [All 43 view mount checks](chart-mount-check.json) passed: each expected chart had a nonzero plotting area, canvas and accessible label. Subsequent CSS changes reduced the compact outcome chart's minimum height and were visually checked again.
- District selection, 30-day/full-history switching, reference visibility, single-chart expansion, dashboard return, simulation stepping and reset were exercised in the in-app browser. At day 30, the last-30-day history correctly contains 2–31 January; the full history contains 1–31 January.
- Playback, pause and flow visibility were checked after selecting E12 on the map. The [road inspector](e12-direction-inspector.png) identifies the selected physical edge and correctly shows its prohibited reverse direction as Closed.
- The final focused review found no material chart/controller defect; all four UI suites passed. Browser error logs were empty during the exercised flows.

Long-horizon model evidence and its limitations are recorded in the [model specification](../../abu-dhabi-model-specification.md), with source hashes and complete runs in the published validation artifacts. Routing plausibility, deterministic execution and stock conservation are verification checks. Empirical calibration and independent validation against Abu Dhabi observations remain outstanding.
