# Urban Dynamics foundation corrections, engine 2.3

The implementation starts from current GitHub main `1ae4e3df5c695aac308da5bdb8a8dc0c8e1d590d`. The engine was unchanged from the audited revision `91843340480311a377f252f12af1009de30147ba`. All changes were prepared in an isolated checkout; the original website checkout was left untouched.

## Corrections and acceptance evidence

| Correction | Implementation | Regression evidence |
| --- | --- | --- |
| Bound RNG arithmetic | `SeededRandom.next` wraps its persistent state to uint32 | Independent reference through draw 4,917,760; fixed short vectors, reset and normalized seed collisions |
| Preserve due firm events | Monthly economics refresh skips hazard redraws when either Working event is already due | Ordinary, month and year boundaries; Grow/Lesser exact tie; one Working transition per firm |
| Make no-op configuration inert | Compare canonical config and affected district policies; avoid unnecessary refresh; economics toggles do not advance demand shocks | Complete state serialization preserves actors, clocks, reset recipe, caches, counters and RNG state |
| Reject policy transactions before mutation | Separate policy validation from application; construct reset replacement before committing; require reset for seed changes | Duplicate/unknown district, invalid numeric policy, invalid date and invalid reset leave state unchanged |
| Preserve explicit zeros | Nullish defaults for shares, quality and rent; explicit rejection of zero supplied job capacity | Zero-share normalization, zero quality/rent, unsupported zero job capacity rejection |
| Govern unemployed recovery through daily matching | Better-job search is restricted to incumbents; daily matching retains successful-hire budget and reviewed seekers across repeated calls | Search probability zero; daily caps zero and one; ordinary Waiting recovery; hires versus switches and stock invariants |
| Separate current prices from historical accounts | City rent aggregates current district prices | Current weighted mean changes without rewriting settled finance fields |
| Use shared same-district road-time quote | `localCarRoundTripMinutes` is used for commute choice and acquisition alternatives | Doubling speed halves time in both paths; distance cash costs and vehicle commitment unchanged |

`tests/udes-v2-foundations.mjs` also compares thirty batched days with thirty individually observed days. The worker protocol and dependency-free `UdesV2Engine` API remain available. Helpers separate validation/application and share the local commute quote; this is a bounded correctness change, not a framework or full module migration.

## Verification

- Engine, job-capacity, mechanics, network, turn-routing, road-flow, analysis, comparison and history suites passed.
- Existing representative-scale scenario regression suite passed, including ten-year scenarios and paired seeds.
- New foundation suite passed; the uncertainty CLI rejected two different integers with the same normalized RNG state.
- Evidence/statistics and presentation-provenance helper suites passed. The serial/parallel runner equality and worker-failure probe passed.
- Regenerated full-scale `validation-report.json`: 149/149 structural checks passed; 0/105 diagnostics flagged.
- Regenerated `uncertainty-report.json`: 14/14 structurally valid runs. Both reports record the actual changed engine hash; no prior evidence hash was relabeled.
- Headless Chromium loaded engine 2.3 with 6,070 citizen cohorts, 600 employers and 1,115 edges. The interface advanced one day, crossed into 1 February, applied a transit policy, advanced again and reset, with zero JavaScript/worker errors. Desktop and mobile screenshots were inspected.
- Formatting of changed JavaScript/tests/package files and `git diff --check` passed.

Browser QA used existing generated HTML/CSS with current source JavaScript and data overlaid. A fresh Jekyll build and built-site contract suite could not run: this host's Ruby environment lacks Bundler 2.7.2. Browser artifacts remain in the task workspace `browser-qa/`; they are not deployed assets.

The supplied Library audit identifier was resolved, but the authorized transfer repeatedly returned HTTP 403. The original DOCX bytes could not be verified here. Implementation was grounded in the supplied detailed audit handoff, current code paths and executable regressions.

## Interpretation and compatibility

Engine 2.3 intentionally changes long-run trajectories. The old RNG diverged once its unbounded state exceeded exact integer precision; boundary redraws discarded due events; unemployed statechart hires bypassed declared labor controls. These changes are corrections, not calibration adjustments.

The future Working-event monthly redraw rule remains as before; this does not introduce integrated continuous-time hazards. Population/cohort units, rent equations, demand/production assumptions, value-of-time coefficients, transport assignment, household/developer/migration structure and empirical calibration were not redesigned. Structural checks establish software consistency under declared assumptions, not Abu Dhabi predictive validity.
