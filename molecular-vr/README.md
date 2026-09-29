# Protein Structures · 7W38

A desktop and WebXR viewer for the actual PDB 7W38 coordinates and EMD-32273 cryo-EM density: USP14-bound human 26S proteasome, state EA2.0_UBL.

Default view: dark blue (#174789) wireframe density at **0.5σ**, with **0.50 opacity**, over a colored Cα backbone. Contour and opacity are independent controls.

## Open the viewer

[Protein Structures project](https://ahmed-o-aly.github.io/projects/protein-structures/) · [Full-screen viewer / headset address](https://ahmed-o-aly.github.io/protein-structures/)

In a compatible headset browser, open the HTTPS link and choose **View in VR** / **Enter VR**. The viewer detects immersive-vr support; an ordinary desktop browser without a connected headset will explain that VR is unavailable.

- Desktop: drag to orbit, scroll to zoom, right-drag to pan, R to reset. Touch: drag to orbit, two fingers to zoom/pan.
- VR: hold a lower grip to move/turn the whole model. Hold both lower grips to rotate and scale it like a ball. The **left thumbstick moves the viewer** forward/backward and sideways on the horizontal plane, relative to the headset’s viewing direction. Neither stick changes model size.
- **X or a right-thumbstick click** summons/hides the VR controls panel. Aim a controller and use its trigger to select or drag. The panel opens on entry and stays in the scene until hidden; summon it again to bring it beside your current view. Adjust contour, opacity, density representation, model visibility, chain isolation, and cutaway inside VR. These settings stay synchronized with the desktop controls. Density color remains a desktop setting.
- **Y** recenters the model. Grip gestures continue to work while the panel is open. A trigger aimed away from the panel also grabs the model; supported hand tracking uses pinch. Controller buttons refer to Oculus Touch-style mappings; other layouts may differ. Panel interaction currently requires controllers. The model and density always move together.
- Wireframe, shaded surface and density-off modes; backbone visibility and chain filtering; screenshot download.

## Run again

Requires Node.js 20.19+ (tested with 24.18) and npm.

```sh
cd molecular-vr
npm ci
npm run dev
```

Build and serve a portable static copy:

```sh
npm run build
python3 -m http.server 4178 --bind 127.0.0.1 --directory ../assets/apps/protein-structures
```

Run `npm run build:protein-structures` from the repository root before publishing changes to the viewer. It rebuilds the committed production bundle in `assets/apps/protein-structures/`. Jekyll copies that bundle to `/protein-structures/` after its minifiers finish, preserving compiled modules and scientific data. Commit the updated bundle with its source changes. The existing site workflow builds and publishes the page without downloading app dependencies.

All structure/map assets are local to the viewer; the optional fonts use Google Fonts with local fallbacks. Do not open `index.html` directly with a `file:` URL: fetching binary geometry requires an HTTP(S) server. Plain LAN HTTP is insufficient for standalone-headset WebXR. The localhost exception applies to the same device, not another device's LAN address.

## Scientific scope

- Complete original mmCIF is included: `public/data/7w38.cif` (106,178 atoms).
- Interactive structure is the **Cα backbone**, 13,539 residues across 48 chains. It does not draw side chains, ligands, or a secondary-structure ribbon. Missing-residue gaps are preserved.
- Density is the **real experimental EMD-32273 map**, sampled by the PDBe VolumeServer from 640³ at 0.685 Å to 160³ at 2.74 Å, with server-provided 8-bit interval quantization. Marching cubes produces each contour. No simulated molecular envelope, mesh smoothing, or geometric fitting is used.
- The seven presets are 0.3, 0.5, 0.8, 1.0, 1.5, 2.0 and 3.2σ. Sigma uses the original source map's mean and standard deviation. 0.5σ corresponds to an absolute map level of about 0.000742219.
- The deposited recommended level is **0.005 absolute ≈3.196σ**. “Use deposited contour” selects the nearby 3.2σ preset, not exactly 0.005.
- This lighter map is appropriate for interactive overview and VR. Use the original full-resolution map for fine atomic-density interpretation; it is about 930 MB compressed and is linked, not bundled.
- Both model and density retain their deposited Cartesian Å coordinates. A single shared transform centers/scales them for display. 99.9926% of Cα positions sample above the 0.5σ threshold, supporting alignment.

Provenance, mesh formats, thresholds and validation: `public/data/density-manifest.json` and `public/data/README.md`.

[Original RCSB entry](https://www.rcsb.org/structure/7W38) · [EMDB entry](https://www.ebi.ac.uk/emdb/EMD-32273) · [Full-resolution map](https://ftp.ebi.ac.uk/pub/databases/emdb/structures/EMD-32273/map/emd_32273.map.gz)

## Verification

Production build and dependency audit pass. Desktop browser checks cover real geometry loading, wireframe/surface/off, contour switching, opacity, chain filtering, cutaway and responsive framing. Data checks verify finite geometry, index validity, outward normals and coordinate alignment. WebXR session/transformation logic was exercised with mocked sessions and actual Three.js matrices. **No physical headset was connected, so headset tracking, rendering and performance remain untested.**

## Reproduce the data

Use Python 3.11+ with `scripts/requirements-data.txt`, then run `scripts/prepare-data.py`. The checked-in prepared assets are sufficient to run the viewer without Python or downloading the original ~930MB map.

## Experimental state comparison

Select **State comparison** beside **7W38 + density**. This mode uses six related, experimentally solved substrate-engaged conformations. The original 7W38 view remains available.

The inspection sequence follows the paper's **inferred** order and stops at the last snapshot:

| State | PDB | Reported resolution |
| --- | --- | --- |
| ED4 | 7W3A | 3.5 Å |
| ED5 | 7W3B | 3.6 Å |
| ED0 | 7W3C | 3.4 Å |
| ED1 | 7W3F | 3.3 Å |
| ED2.0 | 7W3G | 3.2 Å |
| ED2.1 | 7W3H | 3.2 Å |

**Default playback displays only experimental snapshots.** Choose a state directly, step forwards/backwards, or play at 2/4/8 seconds per state. These durations are presentation timing, not biochemical timing. ED3 was not captured; the viewer does not imply a complete observed cycle.

Use **Inspect** to focus on the ATPase motor/USP14/substrate, the USP14–RPT1 contact, or the whole complex. **Hide RPT5** exposes the substrate channel, following the presentation in the paper's Figure 1. **Overlay ED4 at snapshots** adds a translucent first-state comparison at experimental endpoints. The USP14 shift statistic is RMS displacement of common Cα residues after core alignment, relative to ED4, including modeling uncertainty.

All full endpoints retain their deposited Cα coordinates and state-specific gaps, transformed by a rigid alignment of **5,882 common core residues** to 7W38. Fit RMSD is 0.7085–0.8077 Å. Matching uses author chain, residue number and insertion code, verified against complete entity polymer sequence, sequence position and residue identity. Correspondence never relies on file chain order: chain labels change between entries.

Optional **Illustrative interpolation** is off by default. It linearly interpolates Cα coordinates of 13,915 verified common protein residues, rendered as fixed-radius backbone links; intermediate shapes are not experimentally observed, are not a molecular dynamics simulation, and may contain nonphysical intermediate geometry. Unmatched residues are hidden during interpolation. The substrate is modeled with an unassigned sequence, so it is excluded from interpolation and displacement statistics entirely. It appears only in the observed snapshots. An absent domain in an endpoint (for example USP14 UBL in ED5) represents unmodeled coordinates, not proven dissociation.

The 7W38 density EMD-32273 is hidden throughout State comparison, because it is evidence for a different state. All six comparison states already have open core gates. This mode does not claim to show gate opening or tracked substrate-residue translocation.

In VR, use the summonable panel to enter **State comparison**, play/pause, step to the previous or next snapshot, choose a focus, hide RPT5, or overlay ED4. **A toggles playback and B advances** on Oculus Touch-style right controllers; **X opens the panel and Y recenters** on the left. Mappings vary on other controllers. Lower grip buttons continue to grab and scale; the left thumbstick moves the viewer. A caption attached to the model identifies observed versus interpolated geometry. The panel keeps 7W38 density controls separate from comparison controls; cutaway works in both views. Interpolation and display timing remain desktop settings, with interpolation off by default. Hand tracking can grab the model, but controller input is required to use the panel.

Sources and review: `science-review.md`, `public/data/motion/README.md`, `public/data/motion/motion.json`, and the six compressed original mmCIF files alongside it. `scripts/prepare-motion.py` reproduces the aligned data. Independent data validation re-read all 84,505 exported endpoint Cα coordinates from the source files and found a maximum transform/export rounding error of 0.0005 Å.

[Study](https://www.nature.com/articles/s41586-022-04671-8) · [Official full text](https://pmc.ncbi.nlm.nih.gov/articles/PMC9117149/)

Comparison verification: `npm test` includes regressions for observed-state-only playback, stopping, pause and stepping behavior, scientific correspondence and gaps, asynchronous activation, preserved full endpoints, and optional interpolation. The interpolation test checks displayed link endpoints against adjacent source Cα coordinates, fixed tube radius, and substrate/reference exclusion. Desktop browser checks additionally cover source labels, endpoint playback, and scene switching. These checks do not establish a physically correct transition pathway; physical headset operation remains untested.
