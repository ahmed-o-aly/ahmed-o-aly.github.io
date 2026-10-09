# MetaHub catalogue and shared interface

Works and the homepage now feature one MetaHub entry. Its catalogue contains Machine Lab, Protein Structures, Circuits Lab, Bloch Lab and Power Systems Lab. Their existing project notes and application URLs remain available. Economy and urban dynamics stay separate Works entries.

The catalogue renders static covers and real project links, enhanced with search, subject filters, a details dialog and shareable lab hashes. Opening details starts no renderer or model download. MetaHub project notes require an explicit action before loading their embedded viewer; full-screen launch links work without JavaScript.

The four native labs import a shared header with catalogue navigation, title/action slots and fullscreen controls. Protein Structures and Bloch Lab also use the configurable viewer/panel layout. The labs retain their subject-specific controls and immersive interfaces. Shared frame visibility skips hidden desktop work without suppressing immersive callbacks. Machine Lab's native interface remains owned by its separate repository and was not migrated by this change.

## Verification

- All four native app bundles were rebuilt from source. Their 257 tests passed (30 protein, 185 circuits, 29 Bloch, 13 power systems).
- Jekyll build and aggregate generated-site contracts passed, including the new catalogue and deferred-viewer checks. The local ImageMagick step logged its existing Windows `convert.exe` errors; the three new covers are directly generated WebP assets and were verified in the built site.
- Browser checks used installed Edge through the locked Playwright dependency, at desktop and 390-pixel phone widths. Filters, empty results, reset, all five details panels, launch links, Escape/focus return, lab hashes, no-JavaScript links, deferred loading and all four responsive app shells passed, with no page errors.
- A real embedded Protein Structures viewer loaded and displayed its structure after the explicit load action. Catalogue requests contained no app bundles or model data before launch.
- Native Vite servers explicitly allow the repository-level shared imports. Both shared JavaScript and CSS were served successfully by the Protein Structures development server.
- Axe WCAG 2 A/AA and 2.1 AA checks reported no violations on the phone catalogue or open details dialog. The catalogue was added to the CI accessibility route matrix.
- Desktop and phone captures were visually reviewed. Captures and local QA logs are in ignored `tmp/metahub/`; the repeatable browser suite is `tests/metahub-browser.mjs`.
- Physical headset testing remains pending; desktop and automated XR checks do not establish headset performance.
- Changed catalogue/template source passes its formatting checks and `git diff --check`. The repository-wide `format:check` still flags ten unchanged files inherited from the pulled branch; they were left outside this task.

## Covers and archive bytes

Machine Lab retains the approved VMC855 capture in `assets/img/projects/selected-works/`. Power Systems Lab retains its existing project preview. Protein Structures, Circuits Lab and Bloch Lab use 1200 × 750 captures of their rebuilt applications, encoded as WebP at quality 82 in `assets/img/projects/metahub/`. These are application captures, not generated illustrations. Scientific/model sources and creator credits remain in each project note and lab.

Windows checkout line endings were removed from the unchanged prepared-data copies by restoring their original Git bytes before rebuilding. Compiled data/document bytes match the existing committed assets. Git attributes now preserve compiled and prepared archives without checkout translation, and keep source entry HTML and the copied circuit guide in LF form.
