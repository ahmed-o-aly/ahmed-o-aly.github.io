# Codebase guide

This is the single repository-wide guide for agents working on Ahmed Aly's personal website. Update it when routes, ownership, build steps, or verification change. Keep task history in `docs/`; do not create parallel instruction files or repeat this guide in subdirectories.

## Start here

- Read this file, inspect `git status --short`, and open only the files relevant to the request. Preserve unrelated local changes.
- Before documenting the codebase or claiming it is current, fetch the remote and compare `HEAD` with the upstream branch. If behind, account for newer code and preserve local work when synchronizing; never assume cached remote refs are current.
- Use the location tables below to find the implementation. Do not reread every audit or replay completed plans on each task.
- Current source, `package.json`, `_config.yml`, and workflow files establish actual behavior. Historical plans and audit snapshots describe past work, not outstanding instructions.
- Edit source files, rebuild when appropriate, and verify the affected behavior. Never fix generated `_site/` output directly.

## What this repository does

The live site is <https://ahmed-o-aly.github.io/>. The portfolio is a Jekyll site built from Markdown, YAML, Liquid templates, Sass, Ruby plugins, and browser JavaScript, based on al-folio. It also contains five independently built Vite applications: a React/TypeScript UAE Economy Lab and four Three.js/WebXR labs. Node runs their development servers, builds, maintenance scripts, and tests; Jekyll assembles the published site.

The current design uses the `garden` shell and `folio-*` components: paper/ink/rust colors, EB Garamond and IBM Plex Mono, an alternating Selected Works section, a reading library, and project write-ups. Older al-folio templates and styles remain for supporting features; trace the active layout before editing them.

Applications implemented here include Abu Dhabi Urban Dynamics v2, UAE Economy Lab, Protein Structures, Circuits Lab, and Bloch Lab. Machine Lab is an external application linked and embedded by this portfolio; its machine viewer implementation belongs to the separate `ahmed-o-aly/cnc-machine-inspector` repository.

## Content and routes

| Change                     | Source and purpose                                                                                                                                                                                                                                                                          |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Homepage `/`               | `_pages/home.md`; hero, latest writing, Selected Works, and reading library. `_pages/about.md` is the `/about/` page.                                                                                                                                                                       |
| Project index `/projects/` | `_pages/projects.md`; sorts project entries by `work_number` and handles the `venture` entry.                                                                                                                                                                                               |
| Project write-ups          | `_projects/*.md`; front matter supplies routes, cards, media, launch links, and feature copy. `home_feature` and `work_number` control featured homepage entries.                                                                                                                           |
| Writing                    | `_posts/YYYY-MM-DD-title.md`; `_pages/blog.md` is the archive. `_drafts/` holds unpublished post and book-note templates.                                                                                                                                                                   |
| Scheduled writing          | `_scheduled/YYYY-MM-DD-post-title.md`; `.github/workflows/schedule-posts.yml` moves files whose filename date matches the current Asia/Dubai date into `_posts/` at midnight Dubai time. It does not move earlier missed dates automatically. `_scheduled/` is excluded from Jekyll output. |
| Books `/books/`            | `_pages/books.md`, `_data/currently_reading.yml`, `_data/read_books.yml`, and `_books/` for collection entries. The homepage uses the same reading data.                                                                                                                                    |
| Marginalia `/marginalia/`  | `_pages/marginalia.md` and `_data/marginalia.yml`.                                                                                                                                                                                                                                          |
| CV `/cv/`                  | `_pages/cv.md`, `_data/cv.yml`, `_layouts/cv.liquid`, and `_includes/cv/` / `_includes/resume/`. The downloadable document is `assets/pdf/Ahmed Aly CV.pdf`; changing YAML does not regenerate that PDF.                                                                                    |
| Publications               | `_pages/publications.md`, `_bibliography/papers.bib`, `_layouts/bib.liquid`, and Jekyll Scholar configuration in `_config.yml`.                                                                                                                                                             |
| News and repositories      | `_news/`, `_pages/news.md`, `_pages/repositories.md`, and `_data/repositories.yml`.                                                                                                                                                                                                         |
| Shared editorial data      | `_data/work_threads.yml`, `reading_threads.yml`, `home_garden.yml`, `socials.yml`, `venues.yml`, and `coauthors.yml`; follow template references before changing a schema.                                                                                                                  |
| Old route compatibility    | `_pages/*-redirect.md`; retain redirects when revising project names or permalinks.                                                                                                                                                                                                         |

Use explicit front-matter permalinks as the route authority. Preserve existing public links and use Liquid's `relative_url` filter for local assets and links.

## Templates, appearance, and browser behavior

| Location                                                               | Purpose                                                                                                                |
| ---------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `_layouts/garden.liquid`                                               | Shared HTML shell, navigation, footer, book dialog, and site enhancements.                                             |
| `_layouts/home.liquid`, `default.liquid`, `page.liquid`, `post.liquid` | Page structure; home and default wrap the garden shell. Other layouts handle CV, books, archives, and simulations.     |
| `_includes/garden-nav.liquid`, `garden-footer.liquid`                  | Shared navigation and footer.                                                                                          |
| `_includes/folio-work-feature.liquid`                                  | Alternating homepage project features.                                                                                 |
| `_includes/folio-work-card.liquid`                                     | Project index rows; distinct from homepage features.                                                                   |
| `_includes/garden-*.liquid`, `project-visual.liquid`                   | Reusable content, media, related items, and legacy garden cards.                                                       |
| `_includes/head.liquid`, `metadata.liquid`, `scripts.liquid`           | Styles, SEO/social metadata, and conditional scripts. Front-matter feature flags control map/chart/simulation loading. |
| `assets/css/garden.scss`                                               | Active custom Sass entry point; imports `_sass/garden/` partials. Import order matters, with `folio-v2` last.          |
| `_sass/garden/_tokens.scss`, `_shell.scss`, `_folio-v2.scss`           | Design tokens, shared shell, and current portfolio presentation.                                                       |
| `_sass/garden/_content.scss`, `_cards.scss`, `_responsive.scss`        | Content, reusable cards, and responsive rules.                                                                         |
| `_sass/garden/_simulation.scss`, `_simulation-v2.scss`                 | Simulation presentation.                                                                                               |
| `assets/css/main.scss`, `_sass/_*.scss`                                | Base al-folio stylesheet and supporting theme styles; also loaded by the site.                                         |
| `assets/js/garden.js`                                                  | Portfolio interactions and progressive enhancements, including reading dialogs.                                        |
| `assets/js/`                                                           | Other browser scripts and bundled libraries. Avoid editing vendor/minified files for ordinary site changes.            |
| `_scripts/`                                                            | Jekyll-included templated JavaScript, such as search and analytics setup; distinct from Node utilities in `scripts/`.  |
| `assets/img/`                                                          | Published images. Selected Works uses actual captures in `assets/img/projects/selected-works/`.                        |
| `_plugins/`                                                            | Ruby build extensions: cache busting, asset handling, citations, and external content.                                 |

Preserve keyboard access, focus visibility, reduced-motion behavior, responsive layout, and image attribution. For presentation changes, inspect the affected route at desktop and phone sizes as well as checking generated markup.

## Bundled applications

These apps have their own `package.json`, lockfile, Vite configuration, dependencies, development server, and tests. Installing dependencies at the repository root does not install their dependencies. Use Node 22 for shared development; consult each app's package and README for its requirements.

| Application        | Source                                                                  | Published bundle and routes                                                                                               |
| ------------------ | ----------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| UAE Economy Lab    | `apps/uae-economy-lab/`; React/TypeScript economic scenario workbench   | `assets/apps/uae-economy-lab/` publishes at `/uae-economy-lab/`; `_projects/uae-economy-lab.md` is the write-up.          |
| Protein Structures | `molecular-vr/`; Three.js/WebXR protein and cryo-EM viewer              | `assets/apps/protein-structures/` publishes at `/protein-structures/`; `_projects/protein-structures.md` is the write-up. |
| Bloch Lab          | `bloch-lab/`; pure-qubit preparation, gate paths and fresh measurements | `assets/apps/bloch-lab/` publishes at `/bloch-lab/`; `_projects/bloch-lab.md` is the write-up.                            |
| Circuits Lab       | `circuits-lab/`; Three.js/WebXR circuit equipment and experiments       | `assets/apps/circuits-lab/` publishes at `/circuits-lab/`; `_projects/circuits-lab.md` is the write-up.                   |

Rebuild and commit the corresponding bundle whenever app source or prepared data changes. Do not edit compiled bundles directly. `_config.yml` excludes app source and bundle directories from normal Jekyll rendering. `_plugins/uae-economy-bundle.rb`, `_plugins/protein-structures-bundle.rb`, `_plugins/circuits-lab-bundle.rb`, and `_plugins/bloch-lab-bundle.rb` copy committed bundles to their public routes after Jekyll's minifiers finish. Deployment consumes committed bundles; it does not rebuild these applications. Preserve compiled module, worker, and data bytes.

### UAE Economy Lab locations

- `apps/uae-economy-lab/src/App.tsx` coordinates the workbench. `ScenarioOverview.tsx`, `SectorWorkspace.tsx`, `TradeWorkspace.tsx`, and `ExplainView.tsx` implement the main views; neighboring CSS files style them.
- `apps/uae-economy-lab/src/model/engine.ts` is the economic solver; `src/model.worker.ts` runs it off the UI thread. `src/adapter.ts`, `scenario.ts`, `storage.ts`, `sectorProfile.ts`, and `tradeMetrics.ts` handle data adaptation, edits, persistence, and derived views.
- `apps/uae-economy-lab/src/data/` contains prepared baseline and partner data; `data/source/` retains the ADB workbook and source notes. `apps/uae-economy-lab/scripts/extract_adb.py` and `apps/uae-economy-lab/scripts/extract_adb_partners.py` prepare the inputs. `examples/` contains scenario CSVs.
- Read `apps/uae-economy-lab/src/model/METHOD.md`, `GTAP-AND-ASSUMPTIONS.md`, and `data/source/README.md` for solver assumptions and data interpretation. Adjacent `src/*.test.ts` and `src/model/engine.test.ts` verify mechanics. `VERIFICATION.md` records past checks.

### Protein Structures locations

- `molecular-vr/src/main.js` assembles the desktop viewer; `src/style.css` styles it. `src/vr.js` handles immersive interaction and `src/vr-panel.js` handles in-headset controls.
- `molecular-vr/src/motion.js` and `src/motion-state.js` implement experimental state comparison and playback.
- `molecular-vr/public/data/` contains structure coordinates, density meshes, manifests, and source metadata. Its `motion/` directory contains comparison states and correspondence data.
- `molecular-vr/scripts/prepare-data.py` and `prepare-motion.py` reproduce prepared assets; `requirements-data.txt` lists data preparation dependencies. The `scripts/test-*.mjs` files check motion and VR behavior.
- Read `molecular-vr/public/data/README.md`, `public/data/motion/README.md`, and `science-review.md` when changing scientific presentation. Distinguish experimental snapshots from optional illustrative interpolation. Mocked WebXR tests do not prove physical headset performance.

### Circuits Lab locations

- `circuits-lab/src/main.js` connects the interface and scene. `src/bench.js`, `equipment.js`, `interaction.js`, and `vr-session.js` handle the physical bench, instruments, manipulation, and immersive sessions.
- `circuits-lab/src/modules.js`, `lab.js`, and `physics.js` define experiments, state/actions, and circuit calculations. `schematic.js` and `circuit-status.js` support diagrams and diagnostics.
- `circuits-lab/src/cable-routing.js`, `cable-motion.js`, and `terminal-sockets.js` implement wire geometry, movement, and connections. `src/style.css` styles the interface.
- `circuits-lab/tests/` checks activities, physics, wiring, probes, reset/history, and VR behavior. `circuits-lab/docs/module-designs.md` and `circuits-lab/docs/experiment-checklist.md` explain experiment requirements; `circuits-lab/docs/verification.md` records past verification and headset limitations.

### Bloch Lab

`bloch-lab/` contains the standalone pure-qubit teaching experiment. `npm run build:bloch-lab` builds `assets/apps/bloch-lab/`; `_plugins/bloch-lab-bundle.rb` copies it unchanged to `/bloch-lab/`. The project entry is `_projects/bloch-lab.md`. Run `npm run test:bloch-lab` for independent complex-matrix gate, Born-rule, and sequence state-machine checks. `bloch-lab/sequence.js` owns queued gate order, starting input and execution checkpoints; `learning.js` owns X/Y/Z fresh-copy measurement, probability formatting; `lesson.js` owns the ordered preparation-to-interference teaching path; `trajectory.js` samples the exact gate rotation paths; `vr-interaction.js` owns view-only grips and comfort navigation, separately from quantum state; `main.js` animates and pauses transitions and retains completed paths until replay, edits or a new preparation. `bloch-lab/README.md` documents local browser QA, same-origin launch verification and pending physical headset checks. `tests/bloch-lab-contract.mjs` checks the generated route and byte preservation as part of `test:site`.

### App commands

From the repository root, run `npm run build:uae-economy`, `npm run build:protein-structures`, or `npm run build:circuits-lab`. Each installs its app's locked dependencies and builds the bundle. Run the matching `npm run test:uae-economy`, `npm run test:protein-structures`, or `npm run test:circuits-lab` after dependencies are installed. Then build Jekyll and run `npm run test:site`; `node tests/uae-economy-contract.mjs` checks the published economy bundle explicitly.

For source development, run `npm ci` and `npm run dev` inside the app directory. Vite uses port 5177 for UAE Economy Lab, 5178 for Protein Structures, and 5186 for Circuits Lab. Serve apps over HTTP for workers/data loading; headset WebXR requires a compatible secure context. Do not claim headset verification from desktop or mocked tests alone.

## Abu Dhabi Urban Dynamics

| Location                                                                                                | Responsibility                                                                                                                                                                              |
| ------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `_projects/abu-dhabi-urban-dynamics.md`                                                                 | Public project write-up.                                                                                                                                                                    |
| `_projects/abu-dhabi-urban-dynamics-v2.md`                                                              | v2 console markup, controls, feature flags, model/worker URLs, and `/projects/abu-dhabi-urban-dynamics-v2/` route.                                                                          |
| `_layouts/simulation-v2.liquid`                                                                         | Console frame and shared simulation actions.                                                                                                                                                |
| `assets/js/udes-v2-app.js`                                                                              | Browser controller, public scenario presets, calendar helpers, worker coordination, charts, and UI state.                                                                                   |
| `assets/js/udes-v2-worker.js`                                                                           | Seeded simulation engine and worker protocol; also exercised directly by Node tests.                                                                                                        |
| `assets/js/udes-v2-road-flow.js`                                                                        | Road-flow presentation helpers.                                                                                                                                                             |
| `assets/js/udes-v2-analysis.js`                                                                         | Analysis and comparison helpers.                                                                                                                                                            |
| `assets/data/udes-v2/`                                                                                  | Committed baseline, geographic layers, validation report, and uncertainty report.                                                                                                           |
| `scripts/build-udes-v2-data.mjs`                                                                        | Generates baseline and geometry from source responses. Normal builds reuse frozen inputs; missing responses may still be fetched. `--refresh-sources` explicitly replaces source responses. |
| `scripts/data/udes-v2-sources/`                                                                         | Frozen compressed source responses and provenance manifest.                                                                                                                                 |
| `scripts/data/udes-v2-transit-services.json`                                                            | Synthetic transit assumptions maintained independently of road coverage.                                                                                                                    |
| `scripts/lib/`                                                                                          | Network integrity and turn-restriction helpers used by builders/tests.                                                                                                                      |
| `scripts/validate-udes-v2-full.mjs`, `validate-udes-v2-uncertainty.mjs`                                 | Recompute committed execution and paired-scenario evidence. Default runs write reports.                                                                                                     |
| `scripts/udes-v2-*-provenance.mjs`, `udes-v2-evidence-summary.mjs`, `udes-v2-experiment-statistics.mjs` | Source hashing, evidence summaries, and experiment statistics.                                                                                                                              |
| `scripts/refresh-udes-v2-presentation-provenance.mjs`                                                   | Checks whether presentation changes preserve the recorded simulation inputs before refreshing compatibility evidence.                                                                       |
| `_plugins/udes-verified-assets.rb`                                                                      | Preserves exact worker/baseline bytes in published output, together with minifier exclusions in `_config.yml`.                                                                              |
| `assets/js/udes-simulation.js`, `assets/data/udes/`, `_layouts/simulation.liquid`                       | Earlier simulation implementation and its separate data; do not confuse it with v2.                                                                                                         |

For model, geography, evidence, or interpretation changes, read `docs/abu-dhabi-model-specification.md` and `assets/data/udes-v2/README.md`. These are specialized references, not duplicate agent instructions. The explorer covers 18 selected Greater Abu Dhabi City districts and is illustrative, not a validated forecast. Preserve distinctions between observed, derived, and synthetic data, weighted cohorts versus actual people, work-trip assignment versus measured traffic, and retrieval dates versus reference years.

Keep frozen inputs, generated data, and provenance consistent. Recompute the appropriate reports after engine, baseline, or scenario-input changes; never alter hashes just to satisfy a check. The presentation-provenance verifier is for unchanged simulation inputs, not a substitute for model execution.

## Local setup and verification

Run commands from the repository root. `package.json` requires Node >=20.9; deployment uses Node 22, Ruby 3.3.5, and Python 3.13. Full builds need Bundler gems, ImageMagick, and Python `nbconvert`. On Windows, native gems may need the RubyInstaller MSYS2 toolchain.

```sh
npm ci
bundle install
bundle exec jekyll serve
```

Jekyll normally serves at `http://127.0.0.1:4000/`. `_config.yml` controls collections, plugin options, site metadata, and exclusions. `Gemfile` declares Ruby dependencies; `package-lock.json` locks Node dependencies.

| Change                                 | Relevant checks                                                                                                                                                                             |
| -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Content, Liquid, Sass, or site scripts | `bundle exec jekyll build --trace`, then `npm run test:site`; inspect affected pages for visual or interaction changes.                                                                     |
| Goodreads sync                         | `npm run test:goodreads`.                                                                                                                                                                   |
| v2 engine/accounting                   | `npm run test:udes-v2`, `npm run test:udes-v2-capacity`, `npm run test:udes-v2-mechanics`, and `npm run test:udes-v2-scenarios`.                                                            |
| v2 road graph/turns                    | `npm run test:udes-v2-network`.                                                                                                                                                             |
| v2 console, history, or analysis       | `npm run test:udes-v2-ui`, plus built-site checks.                                                                                                                                          |
| v2 evidence/provenance                 | `npm run test:udes-v2-evidence`; includes concurrency verification without rewriting the full report.                                                                                       |
| Changed simulation inputs              | `npm run validate:udes-v2-full` and, where uncertainty evidence is affected, `npm run validate:udes-v2-uncertainty`; inspect resulting report diffs.                                        |
| Formatting and whitespace              | `npm run format:check` for the curated paths in `package.json`, and `git diff --check`. For files outside that list, use the local Prettier executable on just the changed supported files. |
| Documentation only                     | Check referenced paths/commands, Markdown formatting, and `git diff --check`; a full simulation rerun is unnecessary.                                                                       |

`tests/site-contract.mjs` aggregates source and generated-site contracts. Several tests read `_site/` through `tests/helpers/site.mjs`, so build first; old generated output is not evidence for changed source. `tests/*-contract.mjs` cover routes, content, templates, and integration; other `udes-v2-*` tests exercise model and UI helper behavior. Consult `.github/workflows/deploy.yml` for the exact deployment verification sequence. Report unavailable checks explicitly.

## Maintenance and deployment

- `npm run sync:reading` fetches Goodreads and writes the reading YAML files. Deployment runs it before publishable builds, but skips live fetching for pull requests. Do not run it during unrelated edits.
- `npm run build:project-previews` generates preview assets using model data and `sharp`. Review output before replacing approved captures; this is not a routine build step.
- `.github/workflows/deploy.yml` builds on relevant main-branch pushes and pull requests, daily at 08:17 Asia/Dubai, and on manual dispatch. Only non-PR runs publish `_site/` to the GitHub Pages branch, after CSS purging and verification.
- `.github/workflows/axe.yml` checks accessibility on a route matrix. `.github/scripts/run-axe.mjs` is its runner. Other workflows handle scheduled posts, CodeQL, and manually triggered TOC updates.
- `purgecss.config.js` controls post-build CSS removal. Dynamic classes may require safelisting when adding browser-driven behavior.
- `_site/`, `.jekyll-cache/`, `node_modules/`, `tmp/`, and `output/` contain build output, dependencies, or temporary evidence. They are not implementation sources.

## Documentation ownership

- `AGENTS.md`: current codebase map and working instructions. Keep paths and commands accurate here.
- `README.md`: brief public introduction and link to this guide.
- App READMEs and scientific/model documents: subsystem behavior, interpretation, data provenance, and standalone usage. Read the relevant app's references when changing it; retain these distinct explanations rather than deleting them as duplicates.
- `docs/abu-dhabi-model-specification.md` and dataset READMEs: model contracts, data sources, attribution, and reproducibility details; read when changing that subsystem.
- `docs/audits/`: completed investigations, probes, results, and captured live assets. Consult the relevant record when investigating a related regression; snapshots here are not the active application.
- `docs/superpowers/`: historical portfolio design and implementation plan. It is not a standing task list.
- `design-qa.md`: completed Selected Works visual review and asset provenance, not a recurring checklist.

When work changes a durable convention, revise the relevant section of this guide. Record new task-specific findings separately only when they add evidence worth retaining; avoid another general handoff or instruction document.
