# Yas → Mussafah: shared congestion trace

**Correction independently verified.** The updated model loads all 543 physical road edges. All 562 permitted directions have finite positive car capacity, and their recorded vehicle loads reconcile with the sum of actual OD route traversals at initialization and Day 30. The source-hashed [after result](yas-musaffah-shared-congestion-after.json) is preserved separately from the before evidence below.

This investigation confirms a substantive defect in the pre-correction model: physical paths are connected and shared, but `loadBearing:false` removes congestion from many real streets in the middle of those paths. The labels “district gateway access” and “aggregate zone portal” do not establish that a segment is an artificial connector or is used only by its assigned district.

The preserved [before result](yas-musaffah-shared-congestion.json) records the full-scale reference scenario at seed 240124, starting 2024-01-01, with 6,070 resident cohorts × 250 represented people and 600 employer cohorts. It includes all source hashes, ordered route segments, directional assigned-versus-recorded loads, six largest OD contributions per segment, the sum of remaining contributions, and Day 30 results. These are simulated workday vehicle traversals, not observed traffic counts or counts of unique cars. Both outbound and return journeys contribute.

The [investigation script](yas-musaffah-shared-congestion.mjs) observes the real worker's `applyCommute` calls before subsequent agent decisions change their route state. A separate uninstrumented run produces exactly the same Day 30 snapshot. Run from the repository root with `node docs/audits/abu-dhabi-urban-dynamics-2026-09-11/yas-musaffah-shared-congestion.mjs after` to produce a separate after-correction result and preserve the before evidence.

## Verified result after the correction

The frozen after run uses worker SHA-256 `f400be40d69c0eafa42cea741d0f2cd1d1d57f5c21d038f3ff6cd6b72bae376d` and baseline SHA-256 `9ec52d0cc9dd5d1206965b00ff6865534b01ce1e72c9066b2f568db2be950123`. It retains the same full-scale reference configuration and random seed. Eight Yas-resident car cohorts commute to Mussafah at initialization, and two at Day 30. They now use the 49-segment outbound route and 35-segment return route; every segment contributes to congestion.

| Formerly exempt segment | Day 0 assigned = recorded vehicles | Yas → Mussafah contribution | Other OD contribution | Directional workday capacity | Free-flow → loaded travel time |
| --- | ---: | ---: | ---: | ---: | --- |
| 0530 BA — Al Rhah Street match | 29,791.67 | 1,666.67 | 28,125.00 | 52,000 | 0.690 → 0.809 min |
| 0381 AB — Al Ittihad Street | 243,750.00 | 1,666.67 | 242,083.33 | 62,400 | 0.020 → 0.043 min |
| 0388 AB — Mohammed Bin Khalifa Al Kindi Street | 168,541.67 | 1,666.67 | 166,875.00 | 62,400 | 2.070 → 3.747 min |

These totals include 34, 109 and 56 distinct home/work OD pairs respectively. The model therefore now implements the requested shared congestion mechanism: a Yas-to-Mussafah traveler adds to the same directional segment load as travelers from other districts, and its accumulated load affects travel time. Demand and route choices change after removing the old cost exemptions; identical before/after traffic volumes were not an acceptance condition.

Across every permitted graph direction, the maximum difference between recorded load and summed assignment contributions is 0.00000000396 vehicles at Day 0 and 0.00000000169 at Day 30—ordinary floating-point rounding, well below the 0.000001-vehicle test tolerance. There are no reconciliation failures or engine invariant failures. All selected route endpoints and intermediate node connections pass. The independent uninstrumented Day 30 snapshot matches exactly. The first complete instrumented-plus-independent audit took 11.19 seconds locally.

The script's `after` mode now fails if any physical road remains capacity-excluded, any permitted direction lacks finite positive capacity, or directional demand fails reconciliation. These are structural mechanism checks; this experiment does not establish that the single-gateway district distribution, assumed capacities, hourly traffic profile or predicted delays match observed Abu Dhabi conditions.

## What the Yas resident did before correction

At initialization, eight car-commuting cohorts live in Yas and work in Mussafah: 2,000 represented residents, corresponding to 1,666.67 vehicle movements per journey at the assumed occupancy of 1.2. Five cohorts use outbound route A and three use route B. All use the same return route. At Day 30, two car cohorts use route B and that same return route.

| Journey | Assigned cohorts on Day 0 | Physical directed segments | Distance | Segments excluded from congestion | Excluded distance |
| --- | ---: | ---: | ---: | ---: | ---: |
| Outbound A | 5 | 49 | 37.204 km | 28 | 9.424 km |
| Outbound B | 3 | 44 | 34.106 km | 29 | 15.837 km |
| Return | 8 | 35 | 30.566 km | 25 | 16.830 km |

Both outbound paths begin with Al Masar Street and Yas Street, follow Sheikh Khalifa bin Zayed Street and Sheikh Zayed bin Sultan Street, then reach Mussafah through Ar Rawdah Road and connecting streets. Route A passes Al Ittihad Street near Rabdan; route B instead follows a chain toward Al Khaleej Al Arabi Street. The full ordered segments appear below. They are physical geometry, not a district-to-district jump.

## Before correction: shared demand disappeared on some physical links

| Segment and direction | Actual assigned vehicle traversals | Yas → Mussafah contribution | Other OD contribution | Recorded load | Effect |
| --- | ---: | ---: | ---: | ---: | --- |
| 0503 AB — Sheikh Khalifa bin Zayed Street | 26,250.00 | 1,666.67 | 24,583.33 | 26,250.00 | Congestion applies |
| 0530 BA — official Al Rhah Street match | 26,250.00 | 1,666.67 | 24,583.33 | 0 | Congestion excluded |
| 0381 AB — Al Ittihad Street | 245,208.33 | 1,041.67 | 244,166.67 | 0 | Congestion excluded |
| 0406 AB — Al Khaleej Al Arabi Street | 115,625.00 | 1,041.67 | 114,583.33 | 115,625.00 | Congestion applies |
| 0388 AB — Mohammed Bin Khalifa Al Kindi Street, return journey | 169,375.00 | 1,666.67 | 167,708.33 | 0 | Congestion excluded |

The calculation is additive across actual signed path traversals. On 0503, 29 home/work OD pairs sum to 26,250 vehicles. The worker records that sum and increases travel time from 1.10 to 1.16663 minutes. On 0406, 64 OD pairs sum to 115,625 vehicles; with 78,000 vehicles of assumed directional workday capacity, travel time rises from 0.71 to 1.02575 minutes.

In contrast, 0530 carries the same 29-OD 26,250-vehicle flow as 0503 but remains at its 0.69-minute free-flow time. Its geometry has a high-confidence match to official main-road object 146: Al Rhah Street, classified as a minor arterial, with an observed two lanes and 100 km/h posted speed. It is nevertheless labeled `district-gateway-access` and excluded from capacity loading. The observed match is evidence of the underlying road; it is not proof that the original model applied those lane attributes to capacity.

The “Rabdan portal” label on 0381 is specifically contradicted by actual use. Its 108 car OD contributors include Mussafah → Al Danah (12,500 vehicle traversals), Mussafah → Al Rawdah (12,083.33), Khalifa City → Al Danah (10,416.67), and MBZ/Zayed City → Al Rawdah (10,416.67), as well as Yas → Mussafah. None of these journeys starts or ends in Rabdan. Across the graph, 62 excluded portal directions on Day 0 and 66 on Day 30 are used by at least one OD whose endpoints do not include the portal's nominated district.

The longer 1.882-km Mohammed Bin Khalifa Al Kindi Street section 0388 provides another counterexample. Although labeled as a Mussafah portal, it also carries MBZ/Zayed City → Al Rawdah, Al Danah, Al Mushrif and Muroor trips. Its 169,375 vehicle traversals are discarded from the load calculation; its travel time stays at 2.07 minutes.

## Cause and recommendation

In `scripts/build-udes-v2-data.mjs:1275`, portal status is inferred from common endpoints of the limited set of original candidate routes and distance within 2.5 km of a district gateway. That does not remain an endpoint-only property after the graph is combined and shortest paths reuse its edges. The terminal-access rule at `:1399` depends on whether route steps have been recognized as major roads; unnamed connecting sections may therefore be classified as access even when they are physical links in an interdistrict journey. The collapsed-edge signature at `:1558` also omits access status, while the collapsed edge inherits access status from its first raw segment at `:1646`.

The worker then turns the classification into an unconditional exemption: `linkCapacity` returns Infinity (`assets/js/udes-v2-worker.js:2191`), `storedRouteLoad` and `addPathLoad` skip the edge (`:2393`, `:2449`), and both car and PT congestion ratios become zero (`:2218`, `:2237`). This affects actual assignment costs, not just displayed arrows.

All 543 retained road geometries are real routed segments. The earlier cleanup already removed artificial connectors and terminal stubs. For the user's stated model—every shared physical road must accumulate the journeys that traverse it—the coherent bounded correction is therefore to load all retained physical road edges, preserving their directional permissions, geometries and documented capacity assumptions. Drawing extra arrows or retaining silent mid-route exemptions would leave the defect intact.

Single-gateway aggregation can still produce unrealistic concentrated bottlenecks. That should remain explicit, with a later multiple-gateway/activity-location model and capacity sensitivity work. It does not justify silently deleting shared real-road congestion. Historical access/portal labels can remain as provenance or gateway-concentration warnings without changing loading. After correction, verify directional edge loads equal the sum of actual assigned path contributions, including after the daily warm start; do not demand that route choices or numerical loads remain identical to this before run.

## Ordered physical segments before correction

Each row is one directed physical graph edge. “Loaded” contributes to congestion; “Access” and “Portal” are the old exemptions. The full JSON contains the directional loads and contributors for every row.

### Outbound route A — five cohorts

| Order | Edge | Direction | Physical road | km | Old load classification |
| ---: | --- | --- | --- | ---: | --- |
| 1 | 0533 | AB | Al Masar Street | 0.050 | Portal: yas-island |
| 2 | 0528 | BA | Al Masar Street | 0.311 | Portal: yas-island |
| 3 | 0499 | BA | Al Masar Street | 0.966 | Portal: yas-island |
| 4 | 0497 | BA | Yas Street | 0.147 | Portal: yas-island |
| 5 | 0496 | AB | Yas Street | 0.252 | Portal: yas-island |
| 6 | 0498 | AB | Unnamed OSM road connector | 0.614 | Portal: yas-island |
| 7 | 0503 | AB | Sheikh Khalifa bin Zayed Street | 2.001 | Loaded |
| 8 | 0537 | AB | Sheikh Khalifa bin Zayed Street | 2.026 | Loaded |
| 9 | 0542 | BA | Sheikh Khalifa bin Zayed Street | 0.016 | Loaded |
| 10 | 0543 | AB | Unnamed OSM road connector | 0.656 | Loaded |
| 11 | 0541 | BA | Unnamed OSM road connector | 2.058 | Loaded |
| 12 | 0540 | BA | Sheikh Zayed bin Sultan Street | 1.441 | Loaded |
| 13 | 0535 | BA | Sheikh Zayed bin Sultan Street | 2.045 | Loaded |
| 14 | 0530 | BA | Unnamed OSM road connector | 0.536 | Access |
| 15 | 0519 | BA | Unnamed OSM road connector | 0.098 | Access |
| 16 | 0513 | BA | Unnamed OSM road connector | 0.183 | Access |
| 17 | 0510 | BA | Unnamed OSM road connector | 0.239 | Access |
| 18 | 0508 | BA | Unnamed OSM road connector | 0.013 | Access |
| 19 | 0507 | AB | Unnamed OSM road connector | 0.041 | Access |
| 20 | 0509 | AB | Unnamed OSM road connector | 0.183 | Access |
| 21 | 0512 | AB | Unnamed OSM road connector | 0.185 | Access |
| 22 | 0500 | BA | Unnamed OSM road connector | 0.728 | Access |
| 23 | 0494 | BA | Sheikh Zayed bin Sultan Street | 0.419 | Loaded |
| 24 | 0461 | BA | Sheikh Zayed bin Sultan Street | 2.547 | Loaded |
| 25 | 0443 | BA | Sheikh Zayed bin Sultan Street | 2.399 | Loaded |
| 26 | 0424 | BA | Sheikh Zayed bin Sultan Street | 2.099 | Loaded |
| 27 | 0416 | BA | Unnamed OSM road connector | 0.703 | Loaded |
| 28 | 0378 | BA | Unnamed OSM road connector | 2.000 | Loaded |
| 29 | 0377 | AB | Unnamed OSM road connector | 0.579 | Loaded |
| 30 | 0403 | BA | Al Ittihad Street | 0.973 | Loaded |
| 31 | 0396 | BA | Al Ittihad Street | 0.576 | Loaded |
| 32 | 0382 | BA | Al Ittihad Street | 0.341 | Portal: rabdan-al-maqta |
| 33 | 0381 | AB | Al Ittihad Street | 0.012 | Portal: rabdan-al-maqta |
| 34 | 0386 | AB | Unnamed OSM road connector | 0.359 | Access |
| 35 | 0399 | BA | Unnamed OSM road connector | 0.272 | Access |
| 36 | 0400 | AB | Unnamed OSM road connector | 0.205 | Access |
| 37 | 0406 | AB | Al Khaleej Al Arabi Street | 1.135 | Loaded |
| 38 | 0412 | AB | Unnamed OSM road connector | 0.939 | Loaded |
| 39 | 0422 | AB | Unnamed OSM road connector | 0.358 | Loaded |
| 40 | 0423 | AB | Ar Rawdah Road | 2.006 | Loaded |
| 41 | 0428 | AB | Ar Rawdah Road | 0.804 | Loaded |
| 42 | 0411 | BA | Unnamed OSM road connector | 1.444 | Access |
| 43 | 0409 | BA | Unnamed OSM road connector | 0.094 | Access |
| 44 | 0408 | AB | Unnamed OSM road connector | 0.476 | Access |
| 45 | 0391 | BA | Unnamed OSM road connector | 0.963 | Access |
| 46 | 0380 | BA | Unnamed OSM road connector | 0.074 | Access |
| 47 | 0379 | AB | Unnamed OSM road connector | 0.479 | Access |
| 48 | 0383 | BA | Unnamed OSM road connector | 0.025 | Access |
| 49 | 0373 | BA | Unnamed OSM road connector | 0.134 | Access |

### Outbound route B — three cohorts; also the Day 30 car route

| Order | Edge | Direction | Physical road | km | Old load classification |
| ---: | --- | --- | --- | ---: | --- |
| 1 | 0533 | AB | Al Masar Street | 0.050 | Portal: yas-island |
| 2 | 0528 | BA | Al Masar Street | 0.311 | Portal: yas-island |
| 3 | 0499 | BA | Al Masar Street | 0.966 | Portal: yas-island |
| 4 | 0497 | BA | Yas Street | 0.147 | Portal: yas-island |
| 5 | 0496 | AB | Yas Street | 0.252 | Portal: yas-island |
| 6 | 0498 | AB | Unnamed OSM road connector | 0.614 | Portal: yas-island |
| 7 | 0503 | AB | Sheikh Khalifa bin Zayed Street | 2.001 | Loaded |
| 8 | 0537 | AB | Sheikh Khalifa bin Zayed Street | 2.026 | Loaded |
| 9 | 0542 | BA | Sheikh Khalifa bin Zayed Street | 0.016 | Loaded |
| 10 | 0543 | AB | Unnamed OSM road connector | 0.656 | Loaded |
| 11 | 0541 | BA | Unnamed OSM road connector | 2.058 | Loaded |
| 12 | 0540 | BA | Sheikh Zayed bin Sultan Street | 1.441 | Loaded |
| 13 | 0535 | BA | Sheikh Zayed bin Sultan Street | 2.045 | Loaded |
| 14 | 0530 | BA | Unnamed OSM road connector | 0.536 | Access |
| 15 | 0521 | BA | Unnamed OSM road connector | 0.078 | Access |
| 16 | 0516 | BA | Unnamed OSM road connector | 0.021 | Access |
| 17 | 0517 | AB | Unnamed OSM road connector | 0.530 | Access |
| 18 | 0524 | AB | Unnamed OSM road connector | 1.804 | Access |
| 19 | 0534 | BA | Unnamed OSM road connector | 0.083 | Access |
| 20 | 0504 | BA | Unnamed OSM road connector | 0.701 | Access |
| 21 | 0492 | BA | Unnamed OSM road connector | 2.176 | Access |
| 22 | 0491 | BA | Unnamed OSM road connector | 0.021 | Access |
| 23 | 0486 | BA | Unnamed OSM road connector | 0.267 | Access |
| 24 | 0473 | BA | Unnamed OSM road connector | 0.759 | Access |
| 25 | 0468 | BA | Unnamed OSM road connector | 0.089 | Access |
| 26 | 0466 | BA | Unnamed OSM road connector | 0.009 | Access |
| 27 | 0467 | AB | Unnamed OSM road connector | 1.442 | Access |
| 28 | 0454 | BA | Unnamed OSM road connector | 1.292 | Access |
| 29 | 0450 | BA | Al Khaleej Al Arabi Street | 0.488 | Loaded |
| 30 | 0437 | BA | Al Khaleej Al Arabi Street | 2.148 | Loaded |
| 31 | 0434 | BA | Al Khaleej Al Arabi Street | 0.282 | Loaded |
| 32 | 0421 | BA | Unnamed OSM road connector | 1.553 | Loaded |
| 33 | 0420 | AB | Unnamed OSM road connector | 0.387 | Loaded |
| 34 | 0422 | AB | Unnamed OSM road connector | 0.358 | Loaded |
| 35 | 0423 | AB | Ar Rawdah Road | 2.006 | Loaded |
| 36 | 0428 | AB | Ar Rawdah Road | 0.804 | Loaded |
| 37 | 0411 | BA | Unnamed OSM road connector | 1.444 | Access |
| 38 | 0409 | BA | Unnamed OSM road connector | 0.094 | Access |
| 39 | 0408 | AB | Unnamed OSM road connector | 0.476 | Access |
| 40 | 0391 | BA | Unnamed OSM road connector | 0.963 | Access |
| 41 | 0380 | BA | Unnamed OSM road connector | 0.074 | Access |
| 42 | 0379 | AB | Unnamed OSM road connector | 0.479 | Access |
| 43 | 0383 | BA | Unnamed OSM road connector | 0.025 | Access |
| 44 | 0373 | BA | Unnamed OSM road connector | 0.134 | Access |

### Return route — all eight cohorts

| Order | Edge | Direction | Physical road | km | Old load classification |
| ---: | --- | --- | --- | ---: | --- |
| 1 | 0373 | AB | Unnamed OSM road connector | 0.134 | Access |
| 2 | 0384 | AB | Unnamed OSM road connector | 0.493 | Access |
| 3 | 0389 | BA | Mohammed Bin Khalifa Al Kindi Street | 0.011 | Portal: musaffah |
| 4 | 0387 | BA | Mohammed Bin Khalifa Al Kindi Street | 0.026 | Portal: musaffah |
| 5 | 0388 | AB | Mohammed Bin Khalifa Al Kindi Street | 1.882 | Portal: musaffah |
| 6 | 0417 | AB | Unnamed OSM road connector | 1.156 | Loaded |
| 7 | 0431 | BA | Ar Rawdah Road | 1.005 | Loaded |
| 8 | 0426 | BA | Ar Rawdah Road | 2.673 | Loaded |
| 9 | 0425 | AB | Unnamed OSM road connector | 0.309 | Loaded |
| 10 | 0427 | AB | Unnamed OSM road connector | 1.152 | Loaded |
| 11 | 0433 | AB | Al Khaleej Al Arabi Street | 1.758 | Loaded |
| 12 | 0448 | AB | Al Khaleej Al Arabi Street | 1.569 | Loaded |
| 13 | 0462 | AB | Unnamed OSM road connector | 1.412 | Access |
| 14 | 0471 | BA | Unnamed OSM road connector | 1.863 | Access |
| 15 | 0469 | BA | Unnamed OSM road connector | 0.049 | Access |
| 16 | 0470 | AB | Unnamed OSM road connector | 0.033 | Access |
| 17 | 0472 | AB | Unnamed OSM road connector | 0.810 | Access |
| 18 | 0485 | BA | Unnamed OSM road connector | 0.015 | Access |
| 19 | 0483 | BA | Unnamed OSM road connector | 0.370 | Access |
| 20 | 0482 | AB | Unnamed OSM road connector | 0.020 | Access |
| 21 | 0477 | BA | Unnamed OSM road connector | 1.407 | Access |
| 22 | 0478 | AB | Unnamed OSM road connector | 2.003 | Access |
| 23 | 0493 | AB | Unnamed OSM road connector | 1.232 | Access |
| 24 | 0523 | AB | Unnamed OSM road connector | 0.019 | Access |
| 25 | 0525 | AB | Unnamed OSM road connector | 2.009 | Access |
| 26 | 0539 | AB | Unnamed OSM road connector | 1.405 | Access |
| 27 | 0536 | BA | Yas Street | 0.400 | Loaded |
| 28 | 0506 | BA | Yas Street | 2.002 | Loaded |
| 29 | 0505 | AB | Yas Street | 1.712 | Loaded |
| 30 | 0532 | BA | Unnamed OSM road connector | 0.532 | Portal: yas-island |
| 31 | 0531 | AB | Unnamed OSM road connector | 0.540 | Portal: yas-island |
| 32 | 0528 | BA | Al Masar Street | 0.311 | Portal: yas-island |
| 33 | 0526 | BA | Unnamed OSM road connector | 0.011 | Portal: yas-island |
| 34 | 0527 | AB | Unnamed OSM road connector | 0.026 | Portal: yas-island |
| 35 | 0529 | AB | Al Masar Street | 0.217 | Portal: yas-island |
