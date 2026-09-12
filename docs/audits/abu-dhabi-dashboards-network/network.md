# Road geometry and route coverage review

The sparse route union caused real routing errors even though it was connected. The previous graph contained 543 physical edges from only 62 directed district routes. Reachability alone concealed missing cross-city roads: the free-flow Al Reem → Mohamed Bin Zayed route was 62.16 km through Yas, against 34.49 km in the same-gateway OSRM benchmark. Al Maryah → Mohamed Bin Zayed took 51.20 modeled minutes against 27.34 source minutes. These are coverage defects, not evidence of real congestion.

The replacement uses a frozen OSRM route for every one of the 306 directed pairs between the same 18 gateways. It contains 822 nodes and 1,115 physical edges, all visible and capacity-bearing. Every old geometric segment remains; 5,215 additional coordinate segments supply approximately 267 km of newly represented geometry. This length counts separate carriageways separately and is not a municipal road-length statistic. The [coverage delta](../abu-dhabi-urban-dynamics-2026-09-11/network-coverage-delta.json) records the exact comparison and source hashes.

The final [before](route-choice-before.json) and [after](route-choice-after.json) benchmarks use the same gateways and OSRM table. District pairs with modeled free-flow times more than 25% above the source fell from 134/306 to 0/306; remaining time ratios span approximately 0.888–1.080, reflecting the differing treatment of shared-edge costs and turn delays. Al Reem → Mohamed Bin Zayed now follows 34.525 km in 32.05 modeled minutes, close to the source's 34.486 km and 32.04 minutes. In the day-30 assignments, car legs more than 25% longer than the corresponding source route fell from 466/2,848 to 5/3,032; legs more than 50% longer fell from 170 to zero. These are routing checks, not empirical traffic validation.

## The two reported map gaps

- **Yas ↔ Saadiyat:** both directions already had continuous E12 source geometry. The source candidates remain approximately 19.94 km outbound and 21.12 km reverse. There was no missing source segment to bridge with an invented line. The browser review checks visibility and scale separately.
- **North of Rabdan:** the larger union adds real sections of Sheikh Rashid bin Saeed Street, Sheikh Zayed bin Sultan Street, Al Khaleej Al Arabi Street and Rabdan Street. The newly included Rabdan → Reem candidate is 22.42 km, including 12.31 km absent from the old union. Rabdan → Muroor is 11.25 km, including 5.14 km newly represented. The delta artifact gives source requests and ordered traversals for these examples.

## Junction correctness

The previous engine joined directed roads at shared vertices without retaining source turn restrictions. The cached source audit identified 28 prohibited through-turn combinations in that smaller graph. After expansion, 159 prohibitions at 120 junctions are retained and enforced by the worker: 125 through-turns and 34 U-turns. They require matching incoming/outgoing road bearings and consistent source intersection flags; ambiguous matches and conflicts with a complete source route cannot create prohibitions. OSRM documents an intersection's `entry` flags as determining whether entering an outgoing road from that approach is allowed. [OSRM intersection reference](https://project-osrm.org/docs/v5.24.0/api/#intersection-object).

The [expanded geometry audit](../abu-dhabi-urban-dynamics-2026-09-11/network-geometry-audit-expanded.json) independently checks all 306 cached candidates: zero geometry mismatches after gateway trimming, zero unwitnessed directed geometry segments, zero repeated nodes within source candidates, and the same 159 unambiguous prohibited turns. The [earlier audit](../abu-dhabi-urban-dynamics-2026-09-11/network-geometry-audit.json) and [same-gateway benchmark](../abu-dhabi-urban-dynamics-2026-09-11/network-plausibility-osrm-table.json) preserve the pre-expansion evidence.

The final worker reaches all 306 directed district pairs for both car and the retained transit network with those prohibitions enforced. None of the 10,320 captured opening/day-30 car and transit legs violates a declared prohibition. The instrumented and unmodified runs finish with identical snapshots.

## Scope and reproducibility

All district gateway coordinates remain unchanged at graph precision. The existing 62 synthetic transit services retain their identities, frequencies, capacities and in-vehicle times in a separate service-assumption file; the 244 extra road candidates do not manufacture bus supply. Observed lane attributes pass the existing strict join on 169 edges; remaining lanes and every per-lane throughput remain explicit assumptions.

The frozen manifest contains 330 source responses with retrieval timestamps and hashes. Cached builds complete in a few seconds. A final [isolated rebuild](../abu-dhabi-urban-dynamics-2026-09-11/network-rebuild-verification.json), using the unmodified builder and frozen inputs in a temporary workspace, reproduced all four generated datasets byte-for-byte. The final baseline SHA-256 is `02970f782667a391da60198f3e006cdb282710ddd0d91c7ae36195a7e70461da`. `node tests/udes-v2-network.mjs` verifies every candidate against its hash-checked frozen geometry, graph continuity/directionality, full pair coverage, fixed transit services, and hand-checkable turn-inference cases including an explicitly prohibited reversal.

To reproduce the route observation and compact benchmark, run the [probe](route-choice-probe.mjs) and [summarizer](summarize-route-choice.mjs) from the repository root:

```sh
node docs/audits/abu-dhabi-dashboards-network/route-choice-probe.mjs
node docs/audits/abu-dhabi-dashboards-network/summarize-route-choice.mjs
```

The probe writes `tmp/udes-route-choice-after.json`; the summarizer writes `route-choice-after.json` beside this document. Adding `--describe-inputs` to the probe checks its imports/settings without running a simulation. Adding `--check` to the summarizer validates the existing trace and its gateway/table match without writing an artifact. Paths resolve from the scripts' repository location.

The earlier trace recorded worker and baseline hashes but omitted the controller hash; those historical records remain unchanged. The current after artifact was regenerated by a fresh full-scale opening/day-30 observation and control run against the final controller, capturing the controller supplying `PUBLIC_PRESETS`, the probe script, exact preset/configuration, seed and gateway coordinates. It exactly reproduces the earlier final-baseline route metrics. No current hash was substituted into an older execution record. The summarizer requires the same ordered coordinates as the frozen OSRM request; for legacy traces, gateway recovery additionally requires an exact hash-matched baseline.

This is still a district-level route union. One gateway per district concentrates trips, source-supported prohibitions are a partial turn inventory, and missing signal delays/background traffic remain material limits. Free-flow segment costs are derived from source steps and shared-edge aggregation; exact OSRM duration equality is not a calibration target. The expanded geometry fixes missing-route detours without establishing observed travel demand or validated forecasts.
