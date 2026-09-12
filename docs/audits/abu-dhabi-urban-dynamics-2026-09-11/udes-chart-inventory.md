# UDES chart and interaction evidence

Follow-up review: 12 September 2026. This is a read-only inventory of the reference, not a claim that every reference feature exists in the Abu Dhabi implementation.

Source: Correia, February 2018, [Urban Dynamics Educational Simulator, version 1.4](https://www.anylogic.com/upload/iblock/198/1985a2d61b26c2d23acd158ab6e5d68e.pdf), printed pages 26–34, especially Figures 20–26. The complete UI figures on pages 28–33 were visually inspected. The [current Cloud page](https://cloud.anylogic.com/model/47990ad8-ab7c-4fc5-88e5-0e3771cb5303?mode=SETTINGS) identifies upload version 32, but its fetched HTML exposes a loading shell rather than the running simulation. The runtime interactions below are established by the paper, not independently reverified against that upload.

## What the paper actually shows

| Scope                                     | Charts or visual summaries visible in the paper                                                                                                                                                                                                                                                                                                                         | Evidence                             |
| ----------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------ |
| Main view, selected zone                  | Resident-state composition over time; monthly resident-move origin composition; enterprise-state composition over time. The map, global figures and selected-zone charts remain visible together.                                                                                                                                                                       | Page 27 text; Figure 20, page 28     |
| City results                              | Stacked percentage histories for resident states, mode shares, and working inside/outside the home zone; line histories for population by zone, rent by zone, average monthly bank balance by zone, and average road capacity usage. A district comparison table supplies population, rent, state/mode shares, enterprise counts, per-person finance and travel values. | Figure 21, page 29                   |
| Detailed zone results                     | Resident-state and enterprise-state compositions; monthly move-origin composition; population; residential rent; residents' job locations by destination zone plus unemployment; enterprises versus available places; mode shares; average car cost; same-zone versus other-zone work shares.                                                                           | Figure 22, page 30                   |
| Enterprise                                | Salary-payment and rent histories; employee mode-share history; a statechart showing the current enterprise state. Staff, workplace capacity, current rent and monthly salary payments are numeric fields.                                                                                                                                                              | Figure 23, page 31                   |
| Resident                                  | Salary/expenses and rent/travel-cost histories; car-versus-transit cost histories; categorical mode history; current-state statechart. Bank balance and current travel time are numeric fields in this screenshot, not bank-balance or travel-time charts.                                                                                                              | Figure 24, page 32                   |
| Public-transport connection and road link | Capacity-usage history labeled “congestion,” a current utilization percentage, and capacity controls. Length, speed, travel time and load/capacity attributes are also shown.                                                                                                                                                                                           | Figures 25–26, page 33; page 27 text |

The figures do not establish scatterplots, histograms, Sankey diagrams, uncertainty intervals, brushing, pinned comparisons or map-linked chart hover. Those could be useful additions, but should be described as our additions.

## Interaction principles supported by the reference

1. **Selection reveals context.** Page 27 explicitly says clicking a zone displays its information on the right of the main window. Figure 20 confirms that the map remains visible. This is the strongest evidence for the requested interaction.
2. **More detail is a second action.** Separate buttons open additional city and zone results. Deeper views have Back and To main view controls. The paper therefore does not support the claim that every UDES inspection is nonmodal or always keeps the map visible.
3. **Entities link to related entities.** Figures 23–24 label blue text as hyperlinks; the examples link an employer to its zone and a resident to home zone/workplace. This supports an inspection path rather than disconnected screens.
4. **Zones can be browsed without returning to the map.** The main detail area offers Next zone; the detailed zone page offers named zone choices and Next zone (Figures 20, 22).
5. **Thin network objects need another selection route.** Page 27 explicitly warns that road/transit lines can be hard to click and recommends the full object listing. A searchable network list or larger invisible hit target is a direct improvement on this known issue.
6. **The changing state is inspectable.** Resident and enterprise views show the current position in the statechart alongside histories. The value is explaining an action in context; exposing every developer variable is not required to preserve it.

## Concrete adaptation for Abu Dhabi

Keep the map and run controls as the stable workspace. Clicking a district, resident, employer or network edge should replace the contents of one docked inspector, without changing map zoom or switching to a full results page. Put its title, type, date and Close/Back controls in a fixed header. An optional Expand chart action can provide more space; it should be an explicit second action.

Start each inspector with two or three relevant charts:

- **District:** population versus modeled resident capacity, rent history, and employment/work-destination or commute-mode history. Add move origins and firm-state history under a compact additional-results tab. With 18 districts, show a selected subset or top destinations plus a clearly defined remainder instead of an unreadable 18-color legend.
- **Resident cohort:** a budget history separating resources, housing, mobility and essentials; savings stock; commute time with applicable thresholds; and a compact categorical mode/state timeline. A short event list explains changes. Savings and commute histories extend the paper's resident view; they are not features evidenced by Figure 24.
- **Employer cohort:** workers versus demand slots and physical capacity; operating-margin or cost history; employee mode composition. Distinguish current payroll run rate from settled payroll and label operating estimates accurately.
- **Road:** separate directional demand/capacity histories and travel-time history, with the selected road highlighted on the map. Use the current model's assignment-period units; do not relabel work-trip capacity use as measured congestion or peak-hour traffic.
- **Modeled transit service:** passenger demand/capacity and modeled travel/wait-time history, retaining the distinction between synthetic service links and observed stops.

Use related-entity links inside the inspector and retain a small selection history so Back returns to the prior object. A district chooser and searchable road/service list provide alternatives to precise map clicking. Updating an inspector should preserve the current chart window where practical.

At city level, use a few grouped chart views rather than displaying every series at once: people/jobs, household-resource proxies, mobility, and land use. Add reference overlays, distributions and uncertainty displays where actual recorded data support them; these are proposed improvements, not UDES features established by the inspected pages.

Only plot stored observations. If object-level history begins when an object is selected, label that start instead of backfilling earlier dates from its current value. Distinguish daily assignments, monthly accounting observations, annual rents and cumulative stocks. Preserve zero, missing and unavailable values as different cases.
