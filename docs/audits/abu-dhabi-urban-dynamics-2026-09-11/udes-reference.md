# UDES reference and interpretation audit

Reviewed 2026-09-11. Read-only review of the application. The source PDF was downloaded and its 40 pages extracted; the statechart, utility equations, rent equations and main interface were also visually inspected. Source PDF and extraction/rendering intermediates were saved under `tmp/pdfs/`.

The implementation findings below describe the pre-rebuild snapshot. Subsequent changes are documented in the [current model specification](../../abu-dhabi-model-specification.md); the original findings and code references remain here as the audit record.

## Source identity and what the reference establishes

[Correia, February 2018, UDES v1.4](https://www.anylogic.com/upload/iblock/198/1985a2d61b26c2d23acd158ab6e5d68e.pdf) is the exact official-host mirror of the supplied Korean URL, which returned HTTP 403. Its title expands UDES as **Urban Dynamics Educational Simulator**. The [linked Cloud model](https://cloud.anylogic.com/model/47990ad8-ab7c-4fc5-88e5-0e3771cb5303?mode=SETTINGS) exposed version 32 in fetched page metadata; that is an upload version, not evidence of changed scientific specifications. Its public description mentions five zones while the paper describes six, so the two sources should be versioned separately. This subtask did not execute the Cloud model.

The paper describes an educational toy city, explicitly unsuitable as a real-city policy model (pp. 3, 11). Two agent classes, residents and firms, interact across six zones (pp. 11-13). Daily commuting and decisions run over ten years; financial accounting is monthly and rent updates annual (pp. 13-14, 21-26). Agents represent ten adults each; families, children and migration are absent, and replacement keeps population constant (pp. 13, 15-18). Residents change jobs, homes and modes through state transitions and probabilistic rules; car/transit choice uses logit (pp. 14-18). Firm growth/contraction uses random timers, not a regional economy (pp. 19-20). Rent follows occupancy/quality functions; transport uses simplified road and transit networks (pp. 21-24). A fixed seed and initial warm-up support experiments (pp. 25-26). The road-addition example illustrates feedback; it is not empirical validation (pp. 35-39).

## Findings in this implementation

### 1. Correct the citation, then distinguish inherited rules from local assumptions

`assets/data/udes-v2/README.md:5` incorrectly calls the reference "Urban Dynamics for Egyptian Settlements". That is a concrete credibility defect, separate from any disagreement about modeling choices.

The engine already comments many modifications clearly, and its provenance package is a useful foundation. However, `DEFAULT_CONFIG` still labels the block at `assets/js/udes-v2-worker.js:176` as UDES mode-choice coefficients even though the car constant, currency scaling and waiting-time treatment are local modifications. The paper's equation is on p. 16; the current implemented equation is at worker lines 2433-2440. The "UDES-exact" switches at worker lines 138 and 217 restore particular branches only. They do not make this complete model a replication of UDES.

**Recommendation:** one concise model specification with columns for mechanism, source, modification, parameter units, evidence and known limitation. Use "UDES-inspired" consistently unless an independently checked reference implementation actually reproduces the original model. Preserve the distinction between a scientific reference, a geographic observation and a fitted parameter.

### 2. Resolve the unit of the resident agent

The current model treats the full population total as its represented resident stock, while generating every agent between ages 20 and 80 (`worker.js:45-64`, `:1753-1765`). Each agent simultaneously has individual age, salary, employment, car ownership and a full zone rent bill. UI text sometimes calls the same actor a household. Nonparticipants are added separately, but there are no shared households, dependents, shared housing payments or household vehicles. Annual replacements preserve labor-force slots (`:3458-3480`).

This makes income, rent burden, ownership and age outputs ambiguous. A 250-person agent also represents a very large synchronized decision: a move relocates 250 residents; a worker hire supplies 250 employees. The 600 enterprise agents therefore represent employment clusters with coarse job increments, regardless of the word "enterprise" displayed in the interface.

**Recommendation:** choose explicit resident/household/establishment units. For a modest educational scope, use adult representative groups and label them as such. For housing or affordability analysis, introduce households with size, workers, pooled resources, tenure, dwelling type and shared transport access; assign individual work trips to working members. Test aggregation effects before increasing map-dot count. Do not present random in-district marker positions as locations of real people or establishments.

### 3. Employment is a constraint, not a free scenario outcome

`employ()` refuses additional noninitial employment above the configured target (`worker.js:1880-1884`). `matchUnemployedCitizens()` only fills the gap to that target (`:3376-3393`). Firm contraction and restart are suppressed when they would take city capacity below target employment plus the vacancy buffer (`:3199-3220`). The validation script then checks that employment remains within one percentage point of this configured target (`scripts/validate-udes-v2-full.mjs:314`).

This is defensible for a fixed-employment land-use allocation experiment. It cannot independently demonstrate job creation, recession, labor-market recovery or employment benefits from added business capacity. Those headline findings would partly restate the constraint supplied to the model.

**Recommendation:** in the next version, make employment scope explicit. Either hold regional employment exogenous and study where jobs/workers locate, or implement entry/exit, sector demand, worker skills, participation and migration with calibration. Do not advertise endogenous employment growth while keeping a hard target in the matching function.

### 4. Enterprise economics contains feedback, but is still a synthetic mechanism

The implementation is more elaborate than a purely random firm statechart: sector demand, vacancy fill and a calculated operating margin affect hazard multipliers (`worker.js:3589-3663`). Nevertheless, revenue-per-worker, sector shares, cost shares and hazard sensitivities are assumptions (`:258-277`). Labor access uses a straight-line distance decay, not modeled travel time (`:3569-3587`). Productivity rises with a general place-quality index. Wages and revenue indices are multiplied together in growth/contraction events (`:3171-3181`, `:3226-3236`).

These choices can make attractive output without being an independently identified economic mechanism. In particular, a transit improvement does not directly change this firm labor-access variable, while a public-realm slider changes assumed productivity.

**Recommendation:** label the output as illustrative enterprise dynamics; explain the employment ceiling. Before adding more sectors or agent sophistication, decide which enterprise response the project needs to answer and which observation could estimate or falsify it. For accessibility-led economic scenarios, calculate access from the same travel-cost system used by commuters.

### 5. The reported "satisfaction" is a threshold state, not measured well-being

Normal state requires net resources above a fixed amount and a round-trip commute below a fixed duration (`worker.js:2548-2554`). The worker fallback thresholds are 30 and 48 minutes round trip (`:132-133`); the public presets override them to 60 and 90 minutes (`assets/js/udes-v2-app.js:103-104`), as observed in the deployed UI. A local 45-day escalation grace period also applies. These thresholds do not vary by resident segment, occupation or preference.

Nonparticipant monthly support automatically covers current rent, essential consumption and an additional buffer (`:2013-2019`). This financially protects that group from rent changes by construction. Separating the group in the finance chart is good disclosure, but it does not remove the assumption from citywide distributions.

**Recommendation:** report "modeled financial/commute stress" or separate observable components instead of headline happiness. Add distributions: commute time, after-housing resources, rent-to-income burden and share failing a defined affordability criterion. Model household support as a resource linked to a supporting household, or clearly keep it fixed/exogenous and show sensitivity. A rent-indexed support rule should not silently be read as an affordability result.

### 6. Transport needs units and identification before more detail

The current implementation already improves several unrealistic mechanics: it supports within-zone car/transit trips, soft congestion/crowding overflow, directed shared road edges and conditional car disposal. These are meaningful engineering/modeling improvements, not evidence of empirical accuracy.

With cost coefficient -0.3 and `costScaleAed:10`, the effective money coefficient is -0.03 per AED. The car-time coefficient -0.05 implies a marginal ratio of about AED 100/hour; transit in-vehicle time implies AED 70/hour. The separate acquisition calculation uses AED 35/hour (`worker.js:161`). These ratios are algebraic properties of the current settings, not observed Abu Dhabi values. Waiting is supplied to the mode utility as half the round-trip wait (`:2440`), so its unit convention also needs stating.

Daily work trips are assigned over a 13-hour capacity window (`:113-119`), and within-zone modes use fixed probability and distance assumptions (`:195-214`). Real-looking roads and bus stops therefore should not suggest a peak-hour traffic model or a schedule-based bus model.

**Recommendation:** define each policy question first. For transit-access questions, prioritize route/service topology, access/egress and transfers, feasible mode availability, generalized-cost units and observed commute distributions. For congestion questions, introduce time periods and calibrate demand/capacity together. Show sensitivity to agent weight, ordering, assignment duration and network aggregation. Do not add vehicle animation as a substitute.

### 7. Preserve the useful experiment machinery; improve the experiment design

The app already runs a same-seed reference and has extensive structural checks. The reduced-scale scenario suite also includes three seeds (`tests/udes-v2-scenarios.mjs:993-1046`). It would be incorrect to say there is no testing or no seed variability check.

There is no documented empirically equilibrated starting population. Assignment warm starts are not a population/land-use warm-up. A ten-year baseline can drift because synthetic starting jobs, ages, rents and resources are inconsistent, and that drift can be mistaken for an urban forecast. The committed full-scale report describes itself correctly as fixed-seed software and provisional sanity validation (`scripts/validate-udes-v2-full.mjs:643-660`).

**Recommendation:** distinguish (1) software invariants, (2) behavioral reasonableness, (3) calibration against observed data, and (4) held-out predictive validation. Add a baseline initialization diagnostic, multiple full-scale paired seeds and parameter sensitivity ranges. Decide whether the intended experiment starts from a measured transient state or a synthetic equilibrium; do not silently discard a warm-up period from a dated forecast. Keep directional tests as regression guards rather than proof of which policy is beneficial.

## Proposed development order

1. **Choose the product claim.** A transparent educational Abu Dhabi scenario explorer is achievable with the present foundation. A policy forecasting tool requires a narrower question, a calibration program and stronger behavioral data. Decide this before adding agents.
2. **Fix conceptual units and claims.** Correct UDES attribution; define resident/household/enterprise groups; make fixed population and employment constraints visible; replace happiness terminology with the modeled quantity.
3. **Make one causal experiment trustworthy.** A bounded question such as how improved bus access changes modeled commute options is a stronger next milestone than citywide prosperity. Use declared input changes, affected groups, uncertainty and a short causal explanation.
4. **Add only mechanisms required by that question.** Household structure, relocation costs/lease timing, project delivery phasing, labor accessibility and external growth/migration are candidates; none is established by the present code or validated merely by citing UDES.
5. **Present evidence through progressive disclosure.** Keep the everyday flow to baseline, intervention, comparison and explanation. Move equations, source classes and synthetic-assumption details into a method/evidence view that remains one click away. The point of the agent inspector should be explaining a decision, not exposing every internal variable.

No application files were changed. This report is an assessment and discussion basis, not a calibrated replacement model.
