# Chart explorer revision — 12 September 2026

The map is now the default workspace. Six compact city indicators open relevant charts; the Charts control opens a grouped catalog of 23 views. Only one chart is mounted at a time. Closing analysis restores the map indicators and keyboard focus without resizing or recentering the map. District inspectors have a contextual chart action, and district comparison bars and scatter points open that district's trajectory.

The interaction follows UDES's progression from an overview to selected-object analysis. The floating panel is an adaptation for this browser model, not a claim that the original UDES kept every deep analysis page beside its map. See [the paper-based inventory](udes-chart-inventory.md).

## Chart content

- City history: commute, transit share, housing occupancy, financial/commute stress state, unemployment and disposable resources.
- Districts: employed residents versus located jobs, selected district history, and rent versus commute with population-sized bubbles.
- Movement: relocation routes, district balance and the current home-to-work origin–destination matrix. Event windows and worker stocks remain distinct.
- Transport: mode composition, corridor pressure, commute distribution and an accounting waterfall of vehicle access.
- Residents: budget categories, decision-state history, resources distribution, transition matrix and labor-force composition.
- Firms: decision-state history, portfolio viability/actions and employer-size distribution.

Time charts have selectable history windows, a draggable range control, hover values and toggleable legends. Longer reading notes are collapsed. Histogram scales use the largest displayed share with a rounded percentage ceiling. Comparisons use matching snapshot dates and category boundaries; missing data remains missing. Commute distributions also check the assignment dates when both are known.

Transition charts expose their district and 1/7/30-day window. They show counts of represented transition events, not transition probabilities or unique people. State-share histories no longer overlay truncated transition ledgers as zeros. The resource distribution remains explicitly before essential consumption; the city disposable-resource indicator opens its separate after-essentials history. All distributions use complete aggregate outputs, not the visible sample of agents.

## Map and layout

Road motion runs at 35% of its previous speed. Stable sampling uses visible road length and relative demand; fragments under 40 screen pixels do not force arrows. A viewport-area budget caps the number of moving symbols at 80, with fewer at smaller sizes. Direction, clipping, map alignment and reduced-motion handling are retained. Road color continues to encode assigned load relative to capacity; arrow motion is a schematic flow cue, not vehicle-speed measurement.

The old 1,099-pixel breakpoint incorrectly made ordinary desktop panes read-only. The phone-only threshold is now 719 pixels. Map overlays have an explicit stacking context, and zoom controls remain clear of the indicators.

## Verification and evidence

Pure tests cover complete distributions, percentage denominators, date/bin matching, missing inputs, labor accounting, vehicle-access conservation, selected-district transition totals, clipping, symbol budgets, direction and reduced-motion drawing. The deployed-page contract verifies opt-in analysis, accessible controls, unique bindings and the active desktop threshold. Browser checks exercise all chart choices, scope changes, map/context navigation, comparison visibility and running history. Screenshots of the revised map, distribution and matrix accompany this note.

The engine, baseline, scenario presets and calendar definitions are unchanged. Both simulation reports retain their original run dates, execution source hashes and results. Append-only presentation compatibility checks verify immutable dependencies and the exact consumed controller inputs; these checks explicitly record that no simulation was rerun. They validate compatibility of the existing evidence, not empirical calibration or chart appearance.
