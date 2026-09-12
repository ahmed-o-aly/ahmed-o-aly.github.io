# Engine, agent, and assumptions review

Reviewed 11 September 2026. Scope: the simulation worker, public presets, regression tests, and committed validation evidence. No application code was changed. No applicable `AGENTS.md` was found in the workspace or its parent directories.

The engine is a substantial prototype, with more care than its presentation suggests. Its main weakness is that synthetic behavioral rules and stabilizers determine several headline results. Passing the tests establishes software integrity; it does not establish that these mechanisms explain Abu Dhabi.

References below are to the readable local source, principally `assets/js/udes-v2-worker.js`. The deployed worker and public presets were downloaded by the main audit. All six executable probes below were repeated against those deployed assets and produced the same results as local code. The probes deliberately isolate mechanisms in small disposable in-memory fixtures; they are not empirical measurements of Abu Dhabi or estimates of citywide impact.

## Priority findings

### 1. Employment is a controlled target, not a policy outcome

**Classification: deliberate structural assumption; high impact on interpretation.**

The opening and target employed-resident shares are 67%. `employ()` rejects a new hire once the target is reached, even when an active seeker and an open vacancy exist (worker lines 1877–1886). Daily matching fills only the gap back to the target (3376–3392). Firms cannot contract or restart if doing so breaches a citywide capacity floor based on that same target plus an 8% vacancy buffer (3196–3217). This effectively combines a hiring ceiling and a business-survival floor.

The executable fixture had 13 active seekers and 194 open slots; hiring was rejected because employment was already 281/420, its rounded 67% target. Every one of the six committed validation scenarios reports exactly 67% employed residents and 4.28% unemployment, including both ten-year housing and housing-plus-jobs scenarios.

These are reasonable stabilizers for a closed educational model. They prevent this model from answering whether an intervention creates aggregate employment, changes unemployment, or produces a recession. Keep employment explicitly fixed in an initial transport/housing sandbox, or replace the ceiling/floor with labor demand, job search/matching frictions, qualifications, separations, vacancy duration, entry/exit, and an external labor-supply scenario. A calibration target should guide parameter fitting; it should not veto individual hires during every simulation run.

### 2. The agent unit conflates residents, workers, households, and firms

**Classification: deliberate simplification and unresolved conceptual model; high impact.**

Citizen agents represent the full resident stock, but every initial agent has a uniformly sampled integer age from 20 to 80 (75–76, 1753–1766). Employment is assigned through a shuffled population, independent of age/cohort, nationality, household composition, skill, or occupation (1942–1972). Salary sampling halves pay for new jobs after age 60, but annual aging does not implement retirement (1828–1842, 3427–3451). Mortality after age 70 replaces an agent one-for-one with a 20-year-old in the cheapest district and preserves the predecessor's labor-force slot (3456–3503). There is no migration or growing population stock.

With the published recommended weight of 250 residents, one agent's move shifts 250 residents together. A default enterprise begins with 8–16 slots, and each slot represents the same 250-person weight: 2,000–4,000 capacity workers per enterprise agent (1693, 3605–3606). The configuration has no explicit establishment multiplicity. “Enterprise” therefore needs a clear interpretation as either a large stylized employer or a cohort of establishments. Capacity, firm-size charts, firm moves, and employee moves depend on that choice.

Define the unit first. A useful limited next version would distinguish household decision makers, persons/worker weights, and firm cohorts. Introduce only empirically defensible segments: household size and number of earners, income group, car access, and broad employment type. Add explicit external population/job-growth paths before presenting ten-year change as urban development. A fully detailed demographic simulator is not necessary for an honest comparative sandbox.

### 3. Nonparticipants are automatically protected from housing costs

**Classification: explicit synthetic closure assumption; high impact on affordability.**

Thirty percent of the default resident population is outside the labor force. For them, monthly support is calculated as current housing cost + AED 2,500 essentials + AED 1,500 buffer (2013–2020). The payer and resource source do not exist in the model. In the probe, raising monthly rent from AED 2,000 to AED 20,000 raises support from AED 6,000 to AED 24,000; residual resources stay exactly AED 1,500. These residents are insulated from rent increases by construction.

Household sharing and transfers are essential, but a transfer should connect to household resources or an explicitly budgeted external support distribution. At minimum show affordability results by employment status and keep the imputed support amount visible in the assumptions ledger. Avoid an aggregate affordability claim that hides this protected group.

### 4. Car-ownership decisions and financial accounting use different costs

**Classification: confirmed internal inconsistency.**

The purchase decision includes AED 700 fixed ownership cost per month in its affordability gate (164, 2780–2791). That cost is absent from monthly accounting (3396–3419). Ownership itself only flips `hasCar`; it does not debit savings, create an asset/debt, or record a financed obligation (2651–2658). Disposal likewise flips the flag without a sale receipt (2592–2600). Per-trip car costs are charged, so this is specifically the fixed ownership obligation and acquisition/disposal accounting.

The controlled owner and nonowner with identical pay, housing, and zero commuting both saved AED 1,075, despite the AED 700 ownership cost used in the decision. Decide whether the car rule represents financed acquisition, cash purchase, or access to a vehicle. Charge the same costs in choice evaluation and realized accounting. An affordability gate alone cannot represent a recurring payment.

### 5. Monthly accounts use final-day salary and rent for the whole month

**Classification: confirmed timing inconsistency with daily employment/move events.**

Transport spending accumulates over daily trips, but salary, rent, and nonlabor support are taken from the agent's state at month close (3396–3412). A last-day separation sets salary to zero (1919–1927), so month close accounts no salary for that month; the probe reproduces this. Conversely, a late hire can receive the final monthly salary in full. A late move applies destination rent to the full period.

The result depends on which side of a calendar boundary the stochastic event falls. Record daily accruals or prorate pay, housing, and support across employment/residence spells, then close the actual ledger. Test a midmonth hire, separation, salary change, and move with known expected totals.

### 6. “Happy” can coexist with an ongoing essentials deficit

**Classification: confirmed semantic/behavioral inconsistency; severity depends on intended state meaning.**

The normal guard checks income after housing and transport against AED 1,500 (2548–2553). Essentials are then deducted separately from savings at month close (3413–3419). An agent with AED 2,000 after housing/transport, a short commute, and adequate opening savings is behaviorally normal, yet the financial account reports an AED 500 essentials gap (3779–3813). Until savings falls below the extreme threshold, such an agent can remain Happy and avoid the recovery behaviors.

Use the same defined disposable-resource measure for financial state guards, car decisions, and reporting, or explicitly describe the state as satisfaction rather than financial health and justify its thresholds. Do not make “Happy share” the primary welfare or quality-of-life measure: it is a threshold-defined model state, not a survey measure.

### 7. Relocation compares a different travel model from the one agents experience

**Classification: confirmed behavioral inconsistency.**

Same-zone daily trips use fixed car/walk/PT probabilities (2365–2388). A car owner selects car with probability 0.78; remaining trips split using another fixed probability. Yet residence and job comparisons take the cheapest generalized-cost option, which under defaults is a 16-minute walk for every same-zone destination (2681–2735). In the 10,000-choice probe, predicted travel was 16 minutes while realized mean travel was 22.2022 minutes, with 7,796 car trips. This also sets expected travel cash cost to zero during relocation evaluation despite frequent realized car costs.

Use the same available alternatives, access constraints, and expected generalized cost in mode choice and relocation. A district is too large to assume that every intrazonal job is within a 16-minute walk. Represent intrazonal trip lengths/access or at least a consistent distribution. Improving bus speed does not by itself change the fixed same-zone mode probabilities, weakening policy responsiveness for this group.

### 8. Transportation is an aggregate work-trip assignment, not an operational network

**Classification: deliberate abstraction; limits which claims the UI can make.**

All outbound and return work demand shares a 13-hour directional capacity window (112–122). Only employed residents generate trips (2392–2401); there is no peak-period demand, freight, school trips, discretionary travel, or external commuters. Same-zone car/PT trips add no road/route load (2365–2388, 2511–2512).

Physical transit services are superimposed on road edges, with summed capacity and minimum duration/wait; route search then traverses that edge graph (1532–1588, 2047–2097). Service identity, boarding locations, transfers, access/egress walks, and schedules are not preserved. For the physical graph, waiting uses the global wait assumption and counts one wait in each direction (2197–2213). A path through connected PT-enabled edges need not correspond to a feasible observed bus journey.

Keep the current graph for a transparent conceptual accessibility experiment. For transport-policy claims, add actual service routes/headways, stop access and transfers, and at least AM/PM demand with outside-area/background demand. Calibrate travel times and mode shares before increasing geometric detail. Prioritize trip validity and behavioral evidence over more animated vehicles.

## Scenario and validation improvements

The public “Bus priority” preset simultaneously halves base fare, changes average speed from 28 to 45 km/h, reduces wait from seven to four minutes, and doubles capacity (app lines 88–131). “Housing delivery” instantly adds 30% housing capacity (133–153); “Housing + jobs” adds 20% housing and 15% business capacity plus a quality increase (155–175). These are input bundles with no construction lead time, budget, fleet requirement, operating subsidy, or disruption. They are useful experiments, but cannot establish which funded intervention is best. Add one-lever comparisons first, then costed/scoped bundles, implementation schedules, and a no-intervention counterfactual that shares the initial state and documented random streams.

The committed report accurately calls its 236 passed checks “regression and provisional sanity checks,” not empirical validation. It uses one full-scale seed (validation script line 21). The scenario suite adds three seeds at 304 citizens representing 5,000 people each (tests lines 993–1005). That is a useful regression variance guard; it does not supply full-scale uncertainty intervals or prove that aggregation preserves nonlinear congestion, relocation, and firm dynamics.

Recommended next validation artifacts:

1. A compact model specification: units, state variables, schedules, equations, choice alternatives, exogenous inputs, and UDES-to-Abu-Dhabi differences.
2. A parameter ledger with value, unit, source/assumption, plausible range, and affected outputs.
3. Calibration against observed district populations, job locations, rents, travel times, mode shares, car access, and relocation rates; hold out locations/periods where possible.
4. Repeated-seed intervals at the intended deployed scale; sensitivity to agent weight, key behavioral parameters, employment closure, support closure, and road/PT supply factors.
5. Outcome tables separated into fixed inputs, derived quantities, and endogenous results. Include distributions and subgroup effects, not only city means.

## Strengths worth preserving

- Dependency-free worker with deterministic seeds, persistent agent IDs, reciprocal membership checks, compact map frames, bounded histories, and inspectable events.
- Explicit provenance and numerous comments distinguishing original UDES rules from later assumptions.
- Meaningful regression tests for job capacity, final-load travel time, exact calendar horizons, month-history labeling, finite metrics, weighted accounting, and targeted policy behavior.
- Separate random streams for selected decisions, soft-overflow reporting instead of silently forcing implausible walks, and final-load commute recomputation.
- Honest validation caveats already present in the repository. These should become clearer product boundaries, rather than being repeated throughout the interface.

## Verification record and limits

- Passed: `node tests/udes-v2-engine.mjs`.
- Passed: `node tests/udes-v2-job-capacity.mjs`.
- Passed: `node tests/udes-v2-history.mjs`.
- Passed: `node tests/udes-v2-scenarios.mjs` completed with exit code 0 in 309.0 seconds. This includes one-year comparisons, all four ten-year presets, and three reduced-scale paired-seed transit comparisons. Its ten-year reference portfolio margin was 20.17%. These remain software and directional sanity checks, not empirical validation.
- Passed execution: `node docs/audits/abu-dhabi-urban-dynamics-2026-09-11/model-probes.cjs` and the same command with `--live`. The deployed output is saved in `model-probes-live-output.json`.
- The probes isolate code behavior. Except for the included read of the committed validation report, they use small controlled fixtures and do not estimate the prevalence or aggregate magnitude of the issues.
- The full-scale validation writer was not rerun because it overwrites the published report and was unnecessary for this read-only audit. The committed report was inspected, not treated as an independent empirical validation.
