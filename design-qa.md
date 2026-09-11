# Selected Works — design QA

final result: passed

Implemented the selected alternating layout on the existing Jekyll homepage. The project index continues to use its existing shared list component.

## Visual evidence

- Source visual truth: `C:/Users/white/.codex/generated_images/01a09077-4075-7ed3-b640-67bc4faed9fe/exec-0eeb6887-e9f0-4186-a28c-ce92b02aa6b5.png` (1414 × 1112).
- Implementation: `http://127.0.0.1:4000/`, homepage scrolled 664 CSS pixels, light theme, images and fonts loaded.
- Desktop screenshot: `F:/CODEX/Website/tmp/site-review-20260911/selected-works-desktop-final.png`.
- Full comparison, source left and implementation right: `F:/CODEX/Website/tmp/site-review-20260911/selected-works-comparison.png`.
- Focused typography/copy comparison: `F:/CODEX/Website/tmp/site-review-20260911/selected-works-copy-comparison.png`.
- Phone evidence: `F:/CODEX/Website/tmp/site-review-20260911/selected-works-mobile-first.png` and `selected-works-mobile-second.png` in the same folder.
- Tablet evidence: `F:/CODEX/Website/tmp/site-review-20260911/selected-works-tablet.png`.

Both source and implementation were viewed together, followed by the focused copy comparison. Desktop CSS viewport: 1414 × 1112, DPR 1. The browser capture returned 1399 × 1100 pixels; the comparison normalizes that capture to the source's 1414 × 1112 frame. This small capture-size difference and scrollbar are not treated as design defects. Phone CSS viewport: 390 × 844 (capture 375 × 812); tablet: 768 × 1024 (capture 753 × 1004). Responsive evidence is judged in its native frame rather than against an invented mobile mockup.

## Findings and comparison history

1. **P2, resolved — initial rows were too tall and type was too small.** The first desktop capture (`selected-works-desktop-v1-matched.png`) pushed the second project's action below the viewport. It also wrapped the long desktop project title into two lines. The final layout uses approximately 400-pixel rows, 44-pixel Machine Lab and 40-pixel urban titles, 24-pixel body copy, and 24-pixel primary links. The urban title can use the otherwise empty gutter at desktop widths. Final full and focused comparisons confirm balanced rows, four-line descriptions, and visible actions.
2. **P2, resolved — the real machine capture initially showed a white rectangle.** The homepage's completed entrance animation retained a stacking context that prevented blending with the page. Using backwards animation fill releases that context after the entrance. The final desktop and phone captures show the real model on the site's paper background.
3. **P2, resolved — image payload was excessive.** Initial PNG previews totalled about 2.48 MB. The final WebP assets total 205,588 bytes, retain 1200 × 900 intrinsic dimensions, and load lazily with asynchronous decoding.
4. **P2, resolved — narrow tablet map crop.** The fixed desktop image height cropped too much of the map in a narrow column. Below 900 pixels, the map uses its natural ratio. The final tablet capture shows the complete preview; phone rows stack their image above the copy and remove the edge fade.

No actionable P0/P1/P2 findings remain.

## Required fidelity surfaces

- **Typography:** Existing EB Garamond and IBM Plex Mono are retained. Italic project headings, first-person paragraphs, rust primary links, and secondary italic links follow the chosen direction. Desktop copy was compared at readable size. Phone titles wrap without truncation.
- **Spacing/layout:** Alternating image/text rows, thin rules, section numbering, and the library band match the intended hierarchy. The existing site navigation and content rail are retained, so the surrounding frame is intentionally a little narrower than the generated concept. The faithful CAD geometry is narrower than the mockup's generated machine; it is not stretched to match it.
- **Colors:** Existing paper, ink, muted brown, and rust tokens are reused. No new card surfaces, rounded panels, or shadows were added. The original paper texture remains visible around and behind the machine.
- **Image quality:** Final assets are captures of the actual VMC855 viewer and the running urban simulation. Geometry, map labels, agent locations, and coastline are preserved. Both images were cropped to remove surrounding UI, proportionally resized, and compressed. The generated extraction explored during implementation is not shipped. The map's left-edge CSS mask softens the real image into the page; it does not synthesize geography. OpenStreetMap attribution remains visible and linked.
- **Copy/content:** Both approved descriptions are reproduced verbatim. Each feature has a direct launch link plus an accessible, separately labelled project note link. The simulation explicitly says it is not a forecast.

## Validation

- Jekyll build passed. Existing Sass/import and notebook lexer warnings remain in the build log.
- `npm run test:site` passed all six focused contracts and the aggregate contract, including unchanged Works index checks.
- `npm run format:check` and `git diff --check` passed.
- Desktop, tablet, and phone DOM checks found no horizontal overflow. Both preview assets loaded successfully.
- All four feature actions have at least 44 CSS pixels of height on the phone. Existing focus outlines and reduced-motion rules remain in force. The review anchor lands 100 pixels below the viewport top, clear of the sticky navigation.
- Clicked Machine Lab launch and confirmed the VMC855 viewer heading. Activated the simulation launch with Enter and confirmed the simulation route. Clicked both project-note links and confirmed their corresponding page headings.
- The homepage browser error log was empty after final verification.

## Asset provenance

- `assets/img/projects/selected-works/vmc855.webp`: 37,402 bytes. Captured from `https://ahmed-o-aly.github.io/cnc-machine-inspector/?machine=vmc855` in the default isometric view at 1800 × 1112. Source capture: `tmp/site-review-20260911/vmc855-source-wide-final.png`; crop: left 518, top 355, width 896, height 672; resized to 1200 × 900, WebP quality 90.
- `assets/img/projects/selected-works/abu-dhabi.webp`: 168,186 bytes. Captured from `https://ahmed-o-aly.github.io/projects/abu-dhabi-urban-dynamics-v2/`, Agents layer, initial reference date. Source capture: `tmp/site-review-20260911/map-source-full.png`; crop: left 80, top 290, width 864, height 648; resized to 1200 × 900, WebP quality 88.

## Handoff

- Publication was authorized after the local preview review. Before pushing, the change was rebased onto `aefa539`, preserving the four newer upstream commits, including the updated Goodreads shelf, Marginalia, and simulation.
- The refreshed library contains all three currently-reading books shown live: The Devils, Is Muhammad ﷺ Truly a Prophet of God?, and The Blade Itself. Their existing progress values are preserved. The rebuilt site, format check, site contracts, simulation engine tests, and zoned job-capacity regression passed after integration.
- Verification covered the homepage presentation and link destinations. The simulation engine and Machine Lab internals were outside this change.
- No further implementation fixes are required for this scope. A future higher-resolution native CAD export could improve enlarged-image sharpness, but the current preview is clear at its displayed size.
