# Abu Dhabi Urban Dynamics implementation review

Implemented locally on 11 September 2026, following the audit in this directory. The desktop preview is at <http://127.0.0.1:4000/projects/abu-dhabi-urban-dynamics-v2/> while the local server is running. The changes are on `codex/abu-dhabi-model-rebuild`.

## Delivered

- **Connected geography:** 18 districts, 452 network nodes and 543 visible routed road segments. All 306 directed district pairs are reachable; the graph audit finds no dangling endpoints. Road direction, shared physical segments and route continuity are checked. Gray district access chains remain visible and routeable, with their exclusion from congestion capacity declared explicitly.
- **Road visualization:** load colors use assigned demand divided by directional capacity. Animated chevrons follow actual assigned directions and encode relative volume. They are illustrative flow symbols, not individual vehicles. Reduced-motion preferences produce static symbols.
- **Consistent mechanisms:** daily budget accrual and calendar-month settlement, a charged vehicle-access commitment, fixed opening nonparticipant support, explicit labor participation and endogenous recruitment, capacity constraints, and consistent expected/realized within-district travel choice. Scheduled vehicle-access reviews can consider affordable improvements in every stress state. Financial account and vehicle-access stock identities are checked.
- **Desktop interface:** a persistent map with one results panel, a scenario drawer, an inspector that replaces the results panel, and a methods dialog. Redundant summaries and long explanations were removed from the primary workspace. Scenario controls, all result views, road flow, district inspection, playback and export remain functional.
- **Reproducible evidence:** 86 frozen source responses with provenance; observed, derived and assumed fields remain distinct. Comparison CSV aligns both runs by day. Experiment JSON records initial inputs, exact ordered policy patches and effective dates, daily histories, units, and the fingerprint of the actual fetched worker source used by both runs.

## Verification

The engine, accounting/mechanics, job-capacity, road-network, directional-flow, comparison-export, calendar/history, evidence-helper and scenario checks pass. The final scenario suite completed in 422 seconds. The six full-scale scenarios pass all 143 structural checks; the 14 seed/sensitivity runs also pass their structural checks. All 11 application/data/evidence contract sections pass, including independently recalculated paired statistics and mixed-account cohort counts. The reports are stored beside the baseline; their structural checks are separate from diagnostic review flags.

The production Jekyll build and all whole-site contracts pass. Existing Windows ImageMagick thumbnail and Sass deprecation warnings remain in the build log; they did not block the simulation build or its checks. The preview serves the built files without rebuilding production metadata as development URLs.

Desktop browser checks covered initial load; +30-day stepping; automatic playback and pause; reproducible reset; next-day bus-priority application; map layers; zoom and flow alignment; results views; district/resident inspection; methods; and CSV/JSON downloads. No browser warning or error was logged in the checked flows. A downloaded 30-day experiment from the final engine contained 31 observations for each run, a correctly dated effective patch and a fingerprint matching the actual served worker. Its comparison CSV also had 31 data rows. The Jekyll-minified worker matched the source engine through a 32-day replay including monthly settlement. Scoped LF rules preserve source/data evidence hashes across Windows and Linux checkouts.

Screenshots: [overview](implemented-desktop.png), [scenario setup](implemented-scenario.png), [district inspection](implemented-district.png). Mobile layout was outside the requested scope.

## Interpretation and remaining evidence

This is a reproducible scenario model, not an empirically calibrated Abu Dhabi forecast. Observed road geometry and population do not validate synthetic household budgets, employer behavior, service schedules or route demand. The road model covers commuting on a routed network union, with no freight, nonwork travel, measured traffic profiles or signal simulation. Transit stops are observed; service topology and timetables are modeled.

The full-scale seed and sensitivity experiments expose behavior that needs empirical work. In particular, vehicle access declines substantially, while employment and financial policy effects vary across seeds. Those findings are retained rather than being replaced by preferred outcome targets. The [model specification](../../abu-dhabi-model-specification.md) explains the mechanisms, denominators, current experiment results and the evidence required for the next stage.

No production deployment is part of this local implementation.
