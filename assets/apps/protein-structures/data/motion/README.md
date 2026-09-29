# Experimental conformational comparison

`motion.json` contains six deposited cryo-EM structures from Zhang et al., *Nature* 605, 567–574 (2022), [doi:10.1038/s41586-022-04671-8](https://doi.org/10.1038/s41586-022-04671-8). The [primary article](https://pmc.ncbi.nlm.nih.gov/articles/PMC9117149/), section “Asymmetric ATP hydrolysis around ATPase ring,” proposes the order used here. This is an inferred ordering of observed structural classes, not a time-resolved track of one molecule. The sequence stops after ED2.1; there is no fabricated ED3 or connection from the last state back to the first.

| Inspection index | State | PDB | Resolution | Core alignment RMSD to 7W38 |
| --- | --- | --- | --- | --- |
| 0 | ED4 | [7W3A](https://www.rcsb.org/structure/7W3A) | 3.5 Å | 0.8077 Å |
| 1 | ED5 | [7W3B](https://www.rcsb.org/structure/7W3B) | 3.6 Å | 0.7085 Å |
| 2 | ED0 | [7W3C](https://www.rcsb.org/structure/7W3C) | 3.4 Å | 0.7508 Å |
| 3 | ED1 | [7W3F](https://www.rcsb.org/structure/7W3F) | 3.3 Å | 0.7528 Å |
| 4 | ED2.0 | [7W3G](https://www.rcsb.org/structure/7W3G) | 3.2 Å | 0.7203 Å |
| 5 | ED2.1 | [7W3H](https://www.rcsb.org/structure/7W3H) | 3.2 Å | 0.7677 Å |

## What is preserved

Every endpoint's `observedFrames` preserves its complete set of deposited, positive-occupancy Cα atoms: 84,505 positions across the six models. Structures are aligned to the original 7W38 Cartesian frame using a proper Kabsch rotation and translation. The same 5,882 corresponding Cα positions in all 28 20S core chains (author IDs G–T and g–t) are used in every fit. Alpha-subunit residues 1–30 are excluded from the fit so that moving gate termini do not determine the alignment. All exported points are already transformed; the recorded transforms are provenance, not extra transforms for the viewer to apply.

Exact endpoint preservation was checked by re-reading all six source files and applying the saved transforms to every exported position. The maximum per-coordinate difference was 0.000500 Å, from rounding to the deposited coordinate precision. Each segment has only consecutive modeled residues and Cα separations below 5 Å; the maximum displayed endpoint separation was 3.931 Å. No missing loops are created.

## Correspondence and optional interpolation

The shared `frames` use 13,915 Cα positions in 48 protein chains. Matching is by author chain ID, author residue number and insertion code. Every match is verified against identical complete declared polymer sequences, label sequence positions and residue identities in all six deposits. Entity numbers and label chain IDs vary between deposits and are not used as correspondence by array order.

`observedFrames` shows all modeled residues at an endpoint. `frames` contains only the shared verified subset for optional geometric interpolation. Additional residues must be hidden between endpoints. Interpolation is not molecular dynamics, an energy-minimized pathway or experimentally observed intermediate structure; it can distort geometry and has no physical timing.

USP14 is author chain `x`. ED5 models residues 103–494 while the other five structures model 1–494. Thus the shared comparison includes its 392-residue catalytic portion; the additional 102 residues are retained at observed endpoints only. Per-chain exclusions and counts are stored explicitly.

The substrate is author chain `v`. Its sequence is entirely unassigned (`UNK` / `X`), and the modeled lengths are 34, 28, 36, 36, 34 and 36 residues in inspection order. Numeric residue indices do not prove the same material residue across states. Its full observed coordinates are included, but `interpolationAllowed` is false, its common frames are empty, and it is excluded from displacement metrics. Hide it during interpolation rather than presenting an invented substrate trajectory.

Author motor chains A–F are RPT1, RPT2, RPT6, RPT3, RPT4 and RPT5 respectively. In particular, [P35998](https://www.uniprot.org/uniprotkb/P35998/entry) identifies author A as RPT1/PSMC2 and [P17980](https://www.uniprot.org/uniprotkb/P17980/entry) identifies author F as RPT5/PSMC3.

## Measurement meaning

RMSDs and displacements compare common modeled Cα positions after alignment onto the stable core. They describe conformational differences and should not be interpreted as velocity, force or a per-residue measured physical path. Relative to ED4, the remaining motor structures differ by roughly 9.9–12.4 Å RMSD; the common USP14 portion differs by roughly 12.6–15.6 Å. These are structural comparisons, with the cryo-EM resolution and model limitations of the source structures.

EMD-32273 is the density for 7W38, not for any of these six states. Its display must be disabled during this comparison unless explicitly identified as an unrelated reference map. No new density maps or density morphs are supplied.

## Files and regeneration

- `motion.json`: viewer arrays, provenance, transforms, matching rules and metrics.
- `summary.json`: readable metadata and counts without large coordinate arrays.
- `7w3*.cif.gz`: downloaded complete atomic coordinate sources, losslessly compressed. Each state's `sourceSHA256` refers to the uncompressed original download.
- `7w37.cif` and `7w39.cif`: preliminary downloads from the earlier unimplemented EA-state proposal; not used by this comparison.

Run `python scripts/prepare-motion.py` from the viewer directory using the dependencies in `scripts/requirements-data.txt`. It writes only the motion directory and does not alter the original 7W38 model or density.
