# Scientific review: experimental proteasome state comparisons

Reviewed 29 September 2026. Scope: six substrate-engaged USP14–proteasome reconstructions from Zhang et al., *Nature* 605, 567–574 (2022), [doi:10.1038/s41586-022-04671-8](https://doi.org/10.1038/s41586-022-04671-8).

## Independently verified identifiers

The official RCSB entry API returned the matching state name in `struct.title`, the EMDB identifier, and the resolution below. Every entry links to the same primary publication (PubMed 35477760). Resolution is the reported overall reconstruction resolution, not a guarantee of local detail.

| State | PDB and RCSB metadata | Experimental map | Resolution |
| --- | --- | --- | --- |
| ED4 | [7W3A](https://www.rcsb.org/structure/7W3A), [API](https://data.rcsb.org/rest/v1/core/entry/7W3A) | EMD-32275 | 3.5 Å |
| ED5 | [7W3B](https://www.rcsb.org/structure/7W3B), [API](https://data.rcsb.org/rest/v1/core/entry/7W3B) | EMD-32276 | 3.6 Å |
| ED0 | [7W3C](https://www.rcsb.org/structure/7W3C), [API](https://data.rcsb.org/rest/v1/core/entry/7W3C) | EMD-32277 | 3.4 Å |
| ED1 | [7W3F](https://www.rcsb.org/structure/7W3F), [API](https://data.rcsb.org/rest/v1/core/entry/7W3F) | EMD-32278 | 3.3 Å |
| ED2.0 | [7W3G](https://www.rcsb.org/structure/7W3G), [API](https://data.rcsb.org/rest/v1/core/entry/7W3G) | EMD-32279 | 3.2 Å |
| ED2.1 | [7W3H](https://www.rcsb.org/structure/7W3H), [API](https://data.rcsb.org/rest/v1/core/entry/7W3H) | EMD-32280 | 3.2 Å |

7W38 is EA2.0_UBL; it is the original reference structure and is outside this six-state substrate-engaged set.

## Order and wording

Recommended inspection order: **ED4 → ED5 → ED0 → ED1 → ED2.0 → ED2.1, then stop**. This follows the authors' inferred sequence in the section “Asymmetric ATP hydrolysis around ATPase ring”; they place EA1 before ED4. The authors infer the sequence using structure and ATPase coordination. They did not record a continuous single-molecule trajectory or state-to-state transit times.

Suggested overall UI copy:

> Compare six experimental snapshots of the substrate-engaged motor in the study's inferred order. Each step displays a deposited structure. Playback timing is for inspection.

If the implementation instead uses ED0 → ED1 → ED2.0 → ED2.1 → ED4 → ED5, label it only **inspection sequence**, not a published temporal order or complete cycle. Do not automatically return from the last to first state. The set lacks ED3.

## Suggested short state descriptions

| State | UI description |
| --- | --- |
| ED4 | USP14 docks against the RPT1 ATPase domain. Compare its position with ED2.1. |
| ED5 | Inspect two neighboring pore loops disengaged from the substrate. |
| ED0 | USP14 is raised away from the RPT1 ATPase domain. |
| ED1 | Compare the motor's pore-loop staircase with the preceding snapshot. |
| ED2.0 | Inspect the motor staircase and two neighboring disengaged pore loops. |
| ED2.1 | Compare USP14 with ED4; the study reports an approximately 30° difference. |

These descriptions deliberately avoid assigning new biological functions to every substate. ED0, ED1, ED2.0, and ED2.1 all have the USP domain detached from the RPT1 AAA domain; this does **not** mean USP14 is detached from the proteasome. Its OB-ring interactions persist. ED5, ED0, ED1, and ED2.0 are reported to have two neighboring substrate-disengaged pore-1 loops.

## Presentation limits that affect implementation

- All six states already have an open core-particle gate. Do not depict or label a gate-opening event within this sequence.
- The approximately 30° USP14 difference between ED2.1 and ED4 is a published comparison from Figure 1, not a newly measured viewer result.
- Show deposited states as discrete steps. If a later version interpolates, identify intermediate frames as interpolation; do not suggest those coordinates or densities were experimentally observed.
- The bound substrate was modeled without an assigned amino-acid sequence. Do not infer residue identity, a tracked substrate residue's displacement, or a per-step translocation distance from its numbering across states.
- Use a stable core-particle alignment when comparing motor positions, as in Figure 3. A whole-complex fit can reduce the apparent motor displacement.
- Preserve the original density's state identity. EMD-32273 belongs to 7W38 and must not appear as experimental support for another state. For comparisons, load each state's map with the same alignment transform as its coordinates, or hide density and explain why.
- A backbone representation does not expose all atom-level contacts. Avoid displaying atom-level interaction claims as measured by this rendering.

## Evidence locations

Primary paper: [Nature](https://www.nature.com/articles/s41586-022-04671-8), [official PMC copy](https://pmc.ncbi.nlm.nih.gov/articles/PMC9117149/), [official Europe PMC full-text XML](https://www.ebi.ac.uk/europepmc/webservices/rest/PMC9117149/fullTextXML). The XML was retrieved successfully when the Nature/PMC browser pages redirected to cookie/robot checks.

- Figure 1b–c: ED2.1 versus ED4 USP14 orientation; RPT5 omitted to expose substrate.
- Figure 3a–f: core-aligned motor comparison and pore-loop staircase.
- “Dynamic USP14–proteasome interactions”: USP-domain docking and detachment.
- “Asymmetric ATP hydrolysis around ATPase ring”: inferred state order and two-loop disengagement.
- Extended Data Figures 4b and 6a–f: substrate represented without sequence assignment.
- “Visualizing intermediates of USP14–proteasome”: all six substrate-engaged states have an open core gate.
- Data availability: state/PDB/EMDB mapping, independently checked against the RCSB API above.

This review validates the scientific scope and wording, not coordinate alignment, rendering, or headset operation.
