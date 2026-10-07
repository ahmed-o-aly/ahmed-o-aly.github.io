# Power Systems Lab

An ELEN424 equipment field study for desktop, touch and Meta Quest controllers.
The public experience uses One80 Solar’s CC BY 4.0 substation. The optional
academic transformer is a private local inspection and is excluded from builds.

## Develop and build

Use Node 22.12 or later. From this directory:

```sh
npm ci
npm run dev
npm test
npm run build
```

Development listens only on `127.0.0.1:5196`. The bundle is committed at
`../assets/apps/power-systems-lab/`. Jekyll’s post-write plugin copies it unchanged
to `/power-systems-lab/`; the Works entry is `/projects/power-systems-lab/`.
Deployment consumes the committed bundle, so rebuild after source/data changes.

Browser checks require Playwright Chromium and a running development server:

```sh
npm run test:browser
node scripts/xr-qa.mjs
node scripts/transformer-qa.mjs
```

Reports and substation screenshots go to ignored `output/`. Transformer
screenshots and reports go to ignored `private/verification/`. Physical Quest
verification is separate from these desktop and simulated-controller checks.

## Model and learning references

“Substation” by **One80 Solar**, published 13 December 2018:
<https://sketchfab.com/3d-models/substation-8f4e54879b664104bece03d8e7236c15>.
Licence: [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).

The teaching guide follows Dr Tarek El Fouly’s ELEN424 Substation Equipment notes
and the supplied videos:

- Substation: <https://www.youtube.com/watch?v=QC0t_9Z_9hg>.
- Transformer: <https://www.youtube.com/watch?v=Vz5x6ZtHdgY>.

The supplied notes/photos and source CAD drawings are research references; they
are not distributed in this app. The public source attribution and modification
notice appear in both the app and its Works entry.

The three-tank circuit breaker is a strong exterior match. Its interruption
medium and ratings remain unknown. Disconnect and arrester labels remain
candidates. Column apparatus and compact tanks have unresolved electrical roles.
The model supplies no verified netlist, operating mechanism, voltage rating,
transformer internals or physical units. The guide asks the learner to compare
geometry with the reference video; video ratings and device subtypes are not
transferred to this model.

## Geometry and presentation

The reviewed OBJ conversion contains 665,472 triangles and 15,171 connected
source pieces. Source position, normal, UV and piece-ID corner attributes and
triangle order are preserved bit-for-bit by the asset packer; no triangles are
decimated. Concave polygon triangulation was reviewed before this conversion.
Degenerate or unresolved source polygons remain in their original fan form.
`public/data/substation/provenance.json` records source and derived hashes.

Exact attribute deduplication is attempted without quantization; this source has
no identical combined tuples, so all 1,116,979 packed vertices remain. The model
is gzip transported as a 12.8 MB asset. The 4096px diffuse atlas remains unchanged.
Optional presentation normals and representative steel, ceramic, painted metal
and concrete finishes aid inspection. Source appearance uses authored normals
and the original diffuse atlas. UV/image binding is inferred because the archive
contains no MTL. The display scale is relative and is not a site measurement.

`src/substation.js` keeps the full pick geometry/index immutable. A prebuilt
indirect BVH preserves source face order. Isolation replaces only the rendered
index with the selected complete device’s triangles, reducing GPU work. Repeated
bays resolve through 20 reviewed aliases; functional child groups such as
bushings are independently selectable. No invented circuit connections are drawn.

To reproduce public assets, use the reviewed conversion directory containing the
GLB, original diffuse image, piece bounds, equipment inventory and normal audit:

```sh
python3 scripts/prepare-assets.py /path/to/reviewed/substation-third
npm run prepare:bvh
npm test
npm run build
```

The Python preparation script requires NumPy. BVH serialization includes the
library’s format version. The loader handles servers that automatically decode
`.gz` responses as well as servers that deliver the compressed bytes verbatim.

## Quest controls

Left stick moves; right stick turns smoothly. Trigger selects devices or panel
controls. One grip moves/rotates the model with its initial controller-relative
offset; two grips rotate and scale around the hand midpoint. Movement and turning
remain independent while one or both grips are held. X or right stick click
summons a world-anchored panel; Y resets the view in front of the viewer.

The panel has Learn, Equipment and View tabs. A single controller owns a panel
press/slider until release; disabled controls and empty panel areas consume the
press. Another controller can manipulate the model while a panel is in use.
Tracking loss or session invisibility cancels captures; held controls must return
to neutral before rearming. Session exit restores the desktop camera/view.

`src/navigation.js` adapts the current Bloch Lab navigation and grip controls.
`src/vr-panel.js` adapts Protein Structures’ tested canvas panel and single-pointer
capture. No external controller-profile download is required.

## Private transformer boundary

The localhost Vite middleware serves exactly two read-only files from the
existing reviewed transformer directory outside this checkout: its GLB and
manifest. No private directory is mounted, and no other private URL is accepted.
The development-only adapter preserves the source assembly and representative
finishes, with enclosure opening, core/coil isolation and illustrative separation.
The source has 248 occurrences and 838,253 placed triangles. Its drawings identify
inner BT and outer AT coils, limbs and yokes; winding turns and connections are
not inferred. Separation is a placement view, not a maintenance procedure.

Production sets `__TRANSFORMER_AVAILABLE__` to false, eliminating the private
loader and metadata. The build contains no transformer mesh, source CAD, source
manifest or derivative screenshot. Do not publish those materials unless explicit
verified redistribution permission is obtained. The generated-site contract also
checks that no private routes or paths entered the public bundle.
