# Validation

Local verification on 7 October 2026 used Node 24.18.0, Vite 7.3.6,
Three.js 0.180.0, three-mesh-bvh 0.9.8 and Playwright Chromium 1.61.1.
The app requires Node >=22.12.0; the site’s CI uses Node 22.

- Thirteen unit checks: complete source triangles/corner IDs and hashes; whole-device
  membership and repeated bays; licence and candidate labels; BVH indirect face
  preservation; one-hand offset and release; two-hand scaling/rebasing; continuous
  simultaneous movement/turning; speed, deadzone and head pivot; panel hit areas,
  pagination and bounded separation slider.
- Actual desktop and 390px mobile browser checks: complete-device selection,
  actual canvas breaker picking, isolation and restored geometry, source
  appearance, all six guide/video chapters, attribution, help dismissal, mobile
  drawers and absence of horizontal overflow. No browser errors were observed.
- Simulated actual XR controller-routing loop: one/two grips, scaling,
  simultaneous movement and turning while gripping, panel toggle while gripping,
  face-button edges, tracking loss, neutral rearm, session invisibility,
  desktop restoration and handled session-request failure. The fixture uses an
  unparented XR ArrayCamera, verifies panel/reset positions after movement and
  turning, and checks that exit restores the desktop field of view. Mocked poses update
  controller matrices as tracked WebXR poses do; they do not constitute a
  physical headset test.
- Reviewed transformer: 248 source occurrences and 838,253 placed triangles;
  enclosure opening, core/coils view, category isolation, illustrative separation
  and reset. The approved GLB retains its reviewed hash; public provenance records creator attribution and permission. Original CAD, drawings and local manifest remain excluded.
- Production-only browser checks for both experiences: attribution, selection,
  isolation, source appearance, transformer enclosure/core/separation/reset, model
  switching and responsive layout. No private requests or development QA API.

The public geometry preserves all 665,472 source triangles and all packed corner
attributes. No geometry is decimated. The source diffuse image remains unchanged.
The compressed geometry is 12,829,615 bytes and the indirect BVH is 3,208,249 bytes.
The normal and material presentation is selectable; model identity, voltage
ratings, netlist and operating mechanism are not inferred from appearance.

Local Jekyll execution is unavailable because the host Ruby is 2.6.10 and the
locked Bundler requires a newer Ruby. The repository’s existing CI builds Jekyll
with Ruby 3.3.5 and verifies the complete generated site before deployment.
`tests/power-systems-lab-contract.mjs` adds byte-preservation, same-origin routes,
attribution and local-path and original-CAD-exclusion checks to the existing site contract.

Physical Meta Quest 3 performance, optical readability and controller ergonomics
remain untested. Screenshots and machine-readable local reports are in ignored
`output/`; transformer captures are in ignored `private/verification/`.
