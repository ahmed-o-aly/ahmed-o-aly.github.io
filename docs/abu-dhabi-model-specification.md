# Abu Dhabi Urban Dynamics: model specification

Version reviewed: 11 September 2026. The executable specification is the committed baseline, the worker engine and the public scenario presets together. Validation reports record their SHA-256 hashes, so a result can be matched to its actual inputs.

## Purpose and boundary

This is a reproducible scenario explorer for land-use, employment and commuting interactions across 18 selected Greater Abu Dhabi City districts. It supports comparison and explanation of consequences under declared assumptions. It is not an estimated forecast of future population, traffic, rents or welfare.

Its conceptual reference is Gonçalo Correia's [Urban Dynamics Educational Simulator, version 1.4, February 2018](https://www.anylogic.com/upload/iblock/198/1985a2d61b26c2d23acd158ab6e5d68e.pdf). UDES is an educational model; this implementation changes its geography, scaling, finance, employment and transport behavior. It should be described as UDES-inspired, not an exact replication.

The study excludes Al Ain, Al Dhafra and parts of the Abu Dhabi Region outside the selected polygons. Cross-boundary commuters, through traffic, external trade and migration are not represented. The default calendar starts on 1 January 2024. Later road observations do not establish a historical 2024 network; retrieval dates and population reference dates remain separate.

Monetary outputs use the model's AED amounts and configured wage/rent changes. There is no inflation deflator, macroeconomic growth path or claim that a future-year amount represents comparable real purchasing power.

## Model units

| Entity or field         | Unit and interpretation                                                                                    | Limitation                                                                                                                    |
| ----------------------- | ---------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| Resident agent          | A persistent, weighted resident decision cohort; default weight 250 represented residents                  | Members inherit identical per-resident budgets, work status, home district and mode. This is not sampled household microdata. |
| Agent age               | Synthetic adult behavioral attribute, initially 20-80 years                                                | It does not reproduce the age distribution of the full census population. Children and household life cycles are absent.      |
| Employer agent          | A modeled employer cohort with workers, sector, capacity and operating estimates                           | Not an observed establishment. A job slot inherits the resident weight, so employment changes are coarse.                     |
| Housing capacity        | Represented-resident capacity within a district                                                            | Not a dwelling count. Occupancy must not be called a vacancy rate for apartments.                                             |
| Budget                  | AED per represented resident decision unit per month                                                       | Not disposable household income or a national-accounts estimate. Resources are not pooled within actual families.             |
| Commute                 | One modeled worker's daily home-work-home itinerary                                                        | The count is a round-trip commuter observation, not two trips or a count of vehicles.                                         |
| Road demand             | Represented commuting people divided by configured car occupancy, assigned to each traversed directed edge | Excludes nonwork trips, freight and other background traffic.                                                                 |
| Road capacity           | Vehicles per direction for the declared assignment period                                                  | Per-lane throughput and the period are assumptions; observed lane counts do not make capacity observed.                       |
| Transit demand/capacity | Passengers per directed modeled service/assignment period                                                  | Service supply is synthetic, not an observed timetable or fleet.                                                              |
| Agent map position      | Deterministic point within a district                                                                      | Display location only; route demand originates at the district network gateway.                                               |

Population remains fixed. Cohort rounding can make the represented total differ slightly from the census subtotal; both totals remain distinct in reports. Annual mortality replacement supplies a new adult cohort and preserves the participation slot. Default participation is a synthetic 70% of represented residents. Initial employment is 67%, using an emirate-wide observed ratio as an approximate opening anchor. Neither percentage is an independently validated rate for this exact study area.

## Mechanism contracts

### Finance and vehicle access

Salary, housing payments, nonlabor support, essential consumption and the fixed vehicle-access commitment accrue by calendar day. Actual commute expenditure accrues on modeled workdays. Monthly settlement uses the accrued amounts, so a late-month job or home change does not retrospectively reprice the whole month.

Decision forecasts convert expected daily commute costs to a typical month using `workdaysPerMonth`, default 22. Actual settlement uses the simulated calendar and incurred expenses. The expectation and accounting conventions are distinct and should not be used interchangeably when explaining a decision.

The account identities are:

```
resources = earned salary + modeled nonlabor support
cash after housing and transport = resources - housing - commute costs - fixed vehicle access
residual after essentials = cash after housing and transport - essential consumption
savings change = 25% of positive residual, or the full negative residual
```

The default vehicle commitment is AED 700/month while the cohort has vehicle access, plus trip running/parking costs. Acquisition is an affordability/access decision, not a cash vehicle purchase: there is no modeled asset price, loan principal or resale proceeds. Savings gates and generalized-cost preference parameters are assumptions. Their values and interpretation must accompany ownership results.

Vehicle-access review follows its own schedule for employed carless cohorts in every stress state. Affordability, savings and a positive generalized benefit still gate acquisition; financial disposal takes precedence and resets the review date. A poor commute therefore does not itself remove the option of adopting an affordable beneficial mode. The utility still primarily represents work travel and cannot establish observed household vehicle demand.

Several vehicle-access assumptions remain consequential. Opening review dates are delayed 365–730 days rather than initialized at residual phases of an ongoing review process. Nonparticipants cannot acquire access, and demographic replacement exits any previous access stock. The full monthly commitment is compared with work-trip benefits; nonwork travel and actual household use are absent. Passing the income and savings gates does not guarantee adoption: modeled work-trip benefits can remain below that commitment. Repairing review eligibility does not calibrate these assumptions or establish a realistic ownership trajectory.

Nonparticipants receive a support amount imputed from their opening housing cost, essentials and a buffer. That cohort-slot endowment stays fixed, including demographic replacement; a future rent rise is not automatically reimbursed. An explicitly configured support amount can replace the opening imputation. It is not a named public benefit. There is no supporting household account, government budget or conservation of transfers across the modeled population.

Financial stress guards use resources after essentials and vehicle commitment. These states are rule-based stress categories, not observed happiness or well-being. Public presets supply the displayed commute thresholds; worker fallback defaults are not necessarily the live scenario values.

### Employment and firms

The default employment closure is endogenous within the participating cohort pool. Opening employment initializes demand; subsequent matching is constrained by eligible job seekers, search timing and employer demand/capacity rather than a 67% ceiling. Separations and firm contraction can reduce employment. The optional `fixed-target` closure retains a controlled-employment comparison mode and must be identified in exported results.

Each active seeker has the configured daily search probability (default 4%). Successful hires are also capped by `maxDailyLaborMatches`, default 160 worker cohorts per model day. That throughput is a synthetic labor-market assumption with the same cohort weight as employment, not merely a computational optimization. The cap, search probability and separation rate all belong in the experiment's assumption record.

Firms respond to synthetic demand, staffing, operating margin and accessibility through growth, contraction and relocation rules. Opening assigned workers anchor each employer's base demand. Monthly demand slots apply a configurable demand multiplier and the current sector-demand signal, constrained by physical capacity. Revenue is capped by the market-demand worker equivalent. Added employment space provides room for activity; it does not create occupied jobs by definition. Revenue per worker, sector demand, costs and event probabilities are illustrative parameters, not fitted Abu Dhabi establishment behavior.

Labor access sums participating residents weighted by `exp(-roundTripMinutes / decayMinutes)`, with a default decay of 45 minutes, and divides by the entire participating population. For interdistrict journeys, travel time is the fastest feasible return itinerary allowed by each cohort's vehicle access, including modeled transit waiting. Same-district time is the shared mode-probability expectation. An unavailable route contributes zero accessibility. This is an accessibility proxy, not a claim that all reachable residents have the skills or willingness needed by a particular employer. No occupational/skill matching, wage bargaining, product market, trade or government sector budget is modeled.

Enterprise `salaryBillAed` is the current monthly payroll run rate used in operating decisions; `lastCompletedSalaryBillAed` records payroll actually accrued during the settled month. Revenue and operating margin remain current operating proxies, not a complete accrued corporate cash-flow ledger. Their observation basis differs from the resident settlement account.

### Housing and relocation

Households are not explicit agents; relocation belongs to the resident decision cohort. A move changes its home district, rent and expected commute costs. Selection evaluates housing/transport affordability and improvement, subject to review probabilities and minimum-stay frictions. There are no leases, owners, developers, dwelling types or school constraints.

Housing capacity is a soft constraint. Occupancy above 100% is reported, and rent responds to modeled pressure. Capacity levers change the available stock at application time; planning permission, construction time, financing and phased delivery are absent. These limitations matter when interpreting a long-run housing scenario.

### Travel and road assignment

Car and public-transport costs are calculated for a return commute, with money in AED and travel time in minutes. Same-district alternatives use a shared probability model for expected and realized choice; transit improvements therefore affect both decision expectations and sampled trips. Within-district distance/time values are synthetic and do not locate individual homes or workplaces.

Interdistrict movement follows a directed graph constructed from real routed road geometry. The frozen graph combines all 306 directed gateway-to-gateway routes across the 18 districts, with 1,115 physical edges and 822 nodes. Route endpoints, edge continuity, graph nodes and directional reachability must agree. A route is not made connected by drawing an arbitrary straight line. Shared physical edges have shared load and capacity. This is a union of routed corridors, not an exhaustive street network.

Routing enforces 159 explicit, source-supported turn prohibitions at 120 junctions, including 34 prohibited U-turns. At those junctions the shortest-path solver retains the incoming road and direction, because the cheapest arrival may not allow the desired departure. Both car and transit paths obey these physical restrictions. Cached intersection evidence establishes these particular prohibitions; it does not establish complete turn, signal, queue or time-of-day controls. The network benchmark compares the same fixed gateways with OSRM and independently checks cached geometry and declared turns. It is a source-consistency check, not independent observed journey-time validation.

Every physical road receives the sum of assigned outbound and return traversals in each legal direction, including local approaches and roads passing through other districts. A district boundary or an access label does not exempt a shared real road from congestion. For example, Yas–Mussafah trips contribute to the same Al Ittihad Street load as other OD pairs using that segment. The previous terminal/portal exemptions were removed because they suppressed real shared-road congestion.

Each district still has one representative network gateway. That spatial aggregation can overconcentrate demand around an entry point; the model now exposes that pressure instead of suppressing its load. Multiple origins and destinations need a supported within-district allocation and additional connected access points. Detailed local bottleneck predictions remain outside the model's demonstrated accuracy.

Daily route choice is warm-started from the previous workday, with the cohort's old demand removed before reassigning it. Final travel times use the resulting loads. This is a sequential day-to-day assignment, not a time-dependent traffic microsimulation or a proved equilibrium assignment. Excess demand creates congestion/crowding and remains identifiable as overflow.

The assignment window is a model parameter applied to directional hourly capacity. It is not peak-hour demand. Weekend displays retain and date the preceding workday assignment; they must not be relabeled as a newly observed weekend flow. Animation is an illustration along the assigned geometry, not trajectories of observed vehicles.

Observed bus stops are context. The 62 original directional synthetic transit services are preserved when road coverage expands; adding a road corridor does not create a new bus service. Headways, waits, speeds and supply equivalents remain modeled. Transit routing can combine serviced road edges at shared nodes without maintaining an onboard service identity, and charges one initial wait per leg. It therefore omits explicit transfer locations and additional transfer penalties. A line sharing the road graph does not become a real bus route. Access/egress, fare products and timetables are also incomplete.

## Metrics and denominators

| Metric                 | Denominator / observation                                                                      | Meaning                                                                                                                                   |
| ---------------------- | ---------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| Employment rate        | Employed represented residents / all represented residents                                     | Distinct from unemployment rate; the initial condition is not an outcome target.                                                          |
| Unemployment rate      | Active unemployed / labor-force participants                                                   | Nonparticipants are excluded.                                                                                                             |
| Car/transit/walk share | Snapshot: current employed cohorts' stored modes; pooled window: completed workday commutes    | Later decisions can change a cohort's stored mode after assignment. Neither basis describes all trips; report unserved demand separately. |
| Mean commute time      | Represented-worker weighted return minutes on the declared snapshot or completed-commute basis | Includes modeled transit wait; report the observation date/window and a distribution or tail alongside the mean.                          |
| Vehicle-kilometres     | Sum of assigned return distance times represented vehicle demand                               | A commute-derived activity measure; not total city vehicle-kilometres.                                                                    |
| Housing occupancy      | Represented residents / modeled resident capacity                                              | Population pressure, not measured dwelling occupancy.                                                                                     |
| Financial status       | Latest available account by current cohort, weighted by represented residents                  | Continuing cohorts use settled budgets; replacement cohorts use opening estimates. Identify both and the support assumption.              |
| Operating margin       | Modeled operating profit / modeled revenue                                                     | Report revenue-weighted and firm-distribution summaries separately.                                                                       |
| Moves/job changes      | Completed events per accumulated actor-years                                                   | Repeat events count repeatedly; not the fraction of unique residents who moved.                                                           |
| Edge volume/capacity   | Assigned directional vehicles / modeled directional period capacity                            | No closed direction or absent service should dilute an average with an artificial zero.                                                   |

Snapshot metrics, completed-month budgets and pooled travel windows are different observations. Export each date/window and unit. The final day of a run alone is not a representative commute average. Scenario differences use the same model version and declared assumptions; changes in population composition and random event paths can still affect the contrast.

At annual replacement, a new cohort's account resets to an opening estimate and its prior saving/drawdown resets to zero. A January endpoint financial average therefore mixes continuing cohorts' settled December accounts with new-generation opening estimates. It is a cross-section of the current population, not a homogeneous realized December ledger. The uncertainty report records cohort counts and represented weights for both account bases.

## Data and evidence contract

Source labels distinguish observed, derived, derived-from-observed, synthetic and reference values. A district can have an observed population and a synthetic rent simultaneously. Preserve field-level provenance rather than assigning the whole district one evidence label.

The data builder freezes source responses with their request/retrieval metadata and hashes. A normal rebuild should consume that snapshot deterministically; refreshing sources is an explicit operation. SCAD geography/population mappings, AD-SDI polygons/stops/road attributes and OSM routing each have distinct date and coverage limitations.

Official geometry is not empirical behavioral validation. No parameter should be called calibrated solely because it produces a plausible-looking aggregate. The current project has not estimated behavioral parameters from household or establishment microdata and has not tested predictions against a held-out period.

## Analysis views

Charts open on request into complete scope dashboards: nine city charts, eight selected-district charts, and six charts each for transport, district comparison, housing, residents, firms and roads. Desktop dashboards use three columns with a shared history window; the chart area scrolls when the viewport cannot fit every row. Each chart can expand individually, with a return to its dashboard. The map and run controls remain the underlying workspace. Closing or switching a view disposes its chart instances; hidden views do not keep rendering. This follows the UDES reference’s complete results pages (seven city charts and ten zone charts), rather than imposing a two-chart limit.

Outcome comparisons use six separate unit-labeled scales, with signed scenario-minus-reference differences and matching snapshot/assignment dates. District comparisons show current district averages, not within-district dispersion. Population and employer distributions use complete aggregated outputs, not the inspector samples. State-transition heatmaps count represented events over retained daily observations; they are neither transition probabilities nor counts of unique people. The resident view's district selector scopes its transition chart; budget composition remains explicitly citywide.

Selected-district histories retain recorded population/capacity, rent, employed residents and local jobs for both scenario and reference. Comparisons join exact dates and preserve missing observations as gaps. District mode composition uses current employed residents, including unserved and no-commute states; the city mode history uses completed workdays. Workplace charts show current worker counts and destination-specific commute means, not within-district histograms. The [dashboard revision audit](audits/abu-dhabi-dashboards-network/revision.md) records the reference inspection, chart inventory and tested desktop layouts.

Road coverage distinguishes assigned car demand, transit-only demand and known zero demand. Missing directional observations are not zero. Motion is a sparse, slow sample of actual directional assignment, so a gap between arrows does not establish that a road is unused. See the [Yas–Mussafah shared-load trace](audits/abu-dhabi-urban-dynamics-2026-09-11/yas-musaffah-shared-congestion.md) for exact path continuity and summed-load verification before and after removing physical-road exemptions.

## Verification and experiment protocol

1. **Structural verification:** deterministic replay, actor/stock reconciliation, finite accounts, capacity bookkeeping, graph continuity and valid dates. Failures are software or contract failures.
2. **Model diagnostics:** stress-state shares, extreme financial balances, enterprise margins, relocation rates and scenario direction. Unexpected values remain visible for review; assumed bands and preferred policy outcomes do not determine whether the software passes.
3. **Seed variability:** full-scale reference/transit pairs at three or more seeds. Summaries report the observed mean, minimum, maximum, sample standard deviation and sign counts of paired differences. With a small sample these are not confidence or prediction intervals.
4. **Assumption sensitivity:** change declared parameters on both sides of the comparison. The supplied harness varies cost sensitivity and assignment duration independently by 25%. These chosen stress ranges are not estimated uncertainty bounds and do not cover joint/structural uncertainty.
5. **Empirical validation still required:** observed journey times/counts, commute-mode shares for the same population, household resources/rents, relocation transitions and establishment changes, with a declared estimation sample and separate validation sample.

The seeded experiment begins from a synthetic population allocation. No equilibrated initial state or burn-in is implied. A future measured-state forecast and an equilibrium policy experiment require different initialization protocols. Changes to network resolution, cohort weight, participation, job demand or monetary coefficients warrant a new validation artifact.

Commands from the repository root:

```sh
node scripts/validate-udes-v2-full.mjs
node scripts/validate-udes-v2-uncertainty.mjs
```

The first writes `assets/data/udes-v2/validation-report.json`; the second writes `assets/data/udes-v2/uncertainty-report.json`. For a different experiment, declare it explicitly, for example `--months=24 --seeds=240124,70117,90421,55109,81357`. The reports reject worker, baseline, harness or consumed controller-model input changes during execution. Display-only controller changes are accepted only when the consumed presets, calendar-function definitions and evaluated horizon lengths are identical; both execution-start and final controller hashes are retained with that compatibility check. Do not substitute a reduced-scale experiment for a full-scale claim.

The full report runs up to four independent scenarios concurrently, each with its own engine and RNG; scenario definitions and output order are unchanged. `node scripts/validate-udes-v2-full.mjs --verify-concurrency` compares complete serial and parallel results on a short runner probe and checks that a failed worker rejects the run. That probe writes no evidence artifact and is not a substitute for the declared full horizons.

The full-scale road guard reconstructs signed car and transit traversal loads immediately after the final observed workday assignment, before later decisions change agents' routes. It reconciles every physical edge against raw and serialized loads and checks every assigned leg against the declared turn prohibitions. Arriving at work ends a leg; the return departure is not a through-turn. Focused tests cover approach-dependent shortest paths, directional reachability and malformed restrictions, while the runner's negative controls detect a deliberately forbidden turn and a missing assigned load. The [network and routing audit](audits/abu-dhabi-dashboards-network/network.md) records source geometry and before/after same-gateway detour checks separately from scenario outcomes.

## Current experiment findings

The [full report generated on 12 September 2026](../assets/data/udes-v2/validation-report.json) uses 6,070 resident cohorts, 250 represented residents per cohort, 600 employer cohorts and seed 240124. All 149 structural checks pass, including directional assignment accounting across all 1,115 physical roads and checks against 159 declared turn restrictions. The six final workday assignments have zero prohibited turns or mismatched directional loads. None of the 105 broad diagnostic prompts is flagged. These checks establish internal consistency within the implemented network and assumptions; empirical validation has not been performed.

The following are final actor snapshots after exactly ten calendar years, from 1 January 2024 to 1 January 2034; they are not forecasts. Mode and travel-time columns summarize current employed cohorts' stored commute states. Network loads and assignment accounting separately retain the most recent workday, 30 December 2033; the Sunday snapshot does not create another workday of traffic.

| Scenario         | Employment / residents | Vehicle access / residents | Car share of stored commute states | Mean stored round trip | Mean modeled rent per month |
| ---------------- | ---------------------: | -------------------------: | ---------------------------------: | ---------------------: | --------------------------: |
| Reference        |                 60.81% |                     27.25% |                             10.23% |              60.70 min |                AED 2,521.18 |
| Bus priority     |                 60.40% |                     25.16% |                              6.46% |              42.50 min |                AED 2,500.05 |
| Housing delivery |                 60.82% |                     26.99% |                              9.72% |              65.16 min |                AED 2,219.90 |
| Housing + jobs   |                 61.42% |                     27.89% |                             11.00% |              60.34 min |                AED 2,318.58 |

Vehicle access remains an uncalibrated behavioral result. The ten-year reference records 210 acquisitions, housing delivery 213, housing + jobs 264 and bus priority zero, counted as cohort events. Both one-year cases record zero acquisitions. Reference access falls from an initial assigned stock of 4,609 cohorts to 3,088 after one year and 1,654 after ten years. Its ten-year identity is exact: 4,609 + 210 acquisitions − 3,010 disposals − 155 replacement exits = 1,654. Work-trip-only benefits, the full recurring access cost, initial review delays of 365–730 days, nonparticipant acquisition eligibility and replacement resets still need evidence. Correct stock accounting and state-independent reviews do not calibrate this decline.

Housing delivery has a tradeoff in this run: occupancy falls from 86.85% to 66.75% and monthly modeled rent from AED 2,521.18 to AED 2,219.90, while the mean stored round trip increases from 60.70 to 65.16 minutes. Employment differs by only 0.01 percentage points at the report's precision. Housing + jobs has higher employment than reference, 61.42% versus 60.81%, with a similar stored commute mean. Employment varies within the fixed participation pool; no result is required to return to the opening 67%. These single-seed long-run comparisons do not establish robust policy effects.

The [uncertainty report generated on 12 September 2026](../assets/data/udes-v2/uncertainty-report.json) contains 14 structurally valid full-scale one-year runs: three reference/bus-priority pairs using seeds 240124, 70117 and 90421, plus four parameter-sensitivity pairs. Across the three seeds, bus priority minus reference gives:

| Outcome                                                          |      Mean paired change | Observed range across three seeds |
| ---------------------------------------------------------------- | ----------------------: | --------------------------------: |
| Car commute share                                                | −3.73 percentage points |             −4.29 to −3.10 points |
| Transit commute share                                            | +8.80 percentage points |             +8.25 to +9.27 points |
| Mean round-trip commute                                          |          −10.05 minutes |           −10.82 to −8.99 minutes |
| Employment / residents                                           | −0.30 percentage points |              −0.86 to 0.00 points |
| Monthly resources after housing and transport, before essentials |              +AED 24.09 |          +AED 13.59 to +AED 42.64 |
| Latest monthly saving/drawdown                                   |               −AED 2.63 |            −AED 7.75 to +AED 6.94 |
| Residents with an essential-budget gap                           | +0.10 percentage points |             −0.15 to +0.30 points |
| Vehicle access / residents                                       | −0.08 percentage points |             −0.51 to +0.18 points |

Travel values pool completed commutes over the 64 modeled workdays in the final 90 calendar days, excluding retained weekend assignments. Car share and mean commute decrease, and transit share increases, in all three seed pairs and all four tested 25% parameter changes. The modeled Extreme-state share also falls across those cases. Monthly net resources rise across all tested pairs, while saving, essential-budget gaps and vehicle access have mixed signs across seeds or assumptions. Employment is unchanged or lower across the three baseline seed pairs and changes sign under parameter sensitivity. Changing cost sensitivity reverses the vehicle-access contrast relative to seed 240124; changing assignment-period length reverses its saving and essential-budget-gap contrasts. These are observed sensitivities within chosen stress ranges, not confidence bounds or comprehensive robustness evidence. Equal seeds do not guarantee eventwise common random numbers once scenarios branch.

Financial values use the mixed account basis described above, separate from the pooled travel window. Across the six baseline-seed runs, 28–55 of 6,070 cohorts (7,000–13,750 represented residents) contribute replacement opening estimates; the remaining cohorts contribute their latest settled accounts. Replacement saving/drawdown resets to zero. Composition changes can therefore affect financial contrasts alongside the policy mechanism. Both reports retain execution provenance and distinguish presentation compatibility from numerical execution; the worker, baseline and current controller hashes match the checked files.

## Next evidence-driven extensions

The highest-value additions depend on the question: households and tenancy for affordability; observed service topology, access/egress and time periods for bus policy; skills, sectors and migration for employment; development parcels and phased delivery for housing supply. Adding all of them at once would expand the unidentifiable parameter set. Select a measurable outcome and the observations needed to test it before adding another agent class.
