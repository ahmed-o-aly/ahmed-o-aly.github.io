# Chester-Inspired Portfolio Redesign

**Date:** 2026-07-12
**Status:** Approved for implementation
**Project:** Ahmed Aly personal website

## Summary

Redesign the full Jekyll site as a calm professional/personal digital garden. The result should follow Chester How's observable visual direction closely: segmented sticky navigation, a large Fraunces introduction, muted prose with selected dark phrases, a dense mixed-size card grid, small Inter metadata, matte neutral surfaces, and restrained motion. Taiki Sato's influence is limited to a slightly warmer, quieter neutral canvas.

The implementation will be original Jekyll, Liquid, SCSS, and JavaScript. It will not copy Chester's source code, personal copy, project media, botanical identity, or footer artwork.

## Goals

- Replace the current hash-routed homepage with a continuous, server-rendered homepage.
- Apply one coherent visual system to the homepage, projects, writing, reading, about, CV, publications, and utility pages.
- Balance professional work with writing, reading, and personal context.
- Make heterogeneous project images and book covers feel intentional through consistent matte media mounts.
- Simplify navigation and consolidate redundant content areas.
- Preserve useful canonical URLs and add compatibility handling for old homepage hashes.
- Keep the site accessible, responsive, performant, and fully usable without JavaScript.
- Isolate the new design from the accumulated portfolio overrides in `_sass/_base.scss`.

## Non-goals

- No migration away from Jekyll.
- No CMS, database, search service, or client-side application framework.
- No cinematic loader, custom cursor, smooth-scroll hijacking, dark/light theme switcher, or pervasive parallax.
- No automatic palette extraction from images.
- No attempt to make every book cover or project image match the site palette.
- No unrelated rewrite of al-folio features that are not visible in the redesigned pages.

## Approved visual direction

### Overall character

The site should feel calm, editorial, collected, and quietly personal. It should be recognizably close to Chester's information density and spatial rhythm, but populated entirely by Ahmed's work and interests.

There are no glossy effects. Surfaces are flat and matte. Depth comes from spacing, scale, hierarchy, and the contrast between neutral framing and authentic full-color media.

### Color tokens

- Canvas: `#faf9f6`
- Card surface: `#f2f0eb`
- Card hover/focus surface: `#ece9e3`
- Primary ink: `#171717`
- Accessible secondary ink: `#6f6b63`
- Quiet decorative text: `#8f8b83`, used only where contrast remains sufficient for the rendered size
- Borders and separators: `#dedad2`
- Matte media well: `#faf9f6`
- Uniform underline/accent: `#8d8069`
- Focus outline: `#615846` with a canvas-colored offset

Color from book covers, photographs, charts, and project screenshots remains unmodified. The surrounding UI does not introduce competing accent colors.

### Typography

- Display and editorial prose: Fraunces variable, weight 300, with optical sizing and a soft setting close to Chester's use.
- Navigation, metadata, controls, and compact body copy: Inter, weights 400 and 500.
- Fonts should be self-hosted as WOFF2 assets when practical, with serif and sans-serif fallbacks.
- Hero copy scales from approximately 24px on mobile to 36px on desktop, with tight leading and letter spacing.
- Standard article body copy remains comfortably readable at approximately 17–19px.

### Motion

- Navigation enters once with a short fade and upward offset.
- Grid cards may reveal with a small upward offset and restrained stagger.
- Media may scale to at most 1.03–1.05 on hover.
- Surface transitions use roughly 150ms.
- No information is available only on hover.
- `prefers-reduced-motion: reduce` disables nonessential transitions and reveal animation.

## Information architecture

### Primary navigation

- Home → `/`
- Projects → `/projects/`
- Writing → `/blog/`
- Reading → `/books/`
- About → `/about/`
- CV is a utility link to `/cv/`
- GitHub is a desktop utility link and remains reachable on mobile through the footer or compact navigation.

Contact and social links live in the footer rather than a separate primary page.

### Consolidation

- Achievements and credentials move into About and CV.
- Repository material becomes supporting proof inside Projects; `/repositories/` may redirect to `/projects/` if it no longer has unique value.
- Publications remain available at `/publications/` and are linked from About.
- The former hash routes are removed. A small compatibility map redirects `#/about/`, `#/projects/`, `#/achievements/`, and `#/contact/` to the nearest canonical page or anchor.

## Homepage

The homepage is one continuous garden rather than a mini-SPA.

### Header

- Sticky segmented navigation with a matte card background, subtle border, small radius, and no glossy shadow.
- Ahmed Aly appears as a simple text identity rather than the current code-style emblem.
- The active destination uses a flat neutral lozenge.
- External utilities are hidden or collapsed appropriately below tablet width.

### Editorial introduction

- A large Fraunces introduction occupies the first major grid area.
- Most prose uses secondary ink; selected phrases use primary ink.
- Copy positions Ahmed as someone who builds decision-support systems for labs, public policy, and complex operations, while also writing about simulation, books, and practical lessons from the work.
- The introduction contains contextual links to About, Projects, Writing, and Reading.

### Garden grid

- Mixed project, writing, reading, and current-focus cards share one deterministic grid.
- The grid is one column on mobile, two columns from small tablet width, three columns on standard desktop, and optionally four columns on wide desktop.
- Large cards span two columns or rows; small cards remain single cells.
- Card order is curated rather than randomized.
- A dedicated data manifest, such as `_data/home_garden.yml`, defines item kind, stable reference, order, and size. Display content continues to come from the referenced project, post, book, or data entry.
- Missing or invalid references render an intentional text fallback during development and must be resolved before release.

### Initial content mix

- Featured MetaHub AI/XR project
- Territory design research project
- ADSG policy simulations
- DEWA energy optimization
- Logistics routing and facility optimization
- Latest writing
- Selected reading entry or review
- Current professional focus
- Short path to About and CV

## Media treatment

The approved treatment is **Natural Color with a Matte Mount**.

- Book covers, photography, charts, and screenshots retain their original colors.
- Each item sits inside the same neutral media well with consistent inset, border treatment, and aspect-ratio rules.
- Book covers use `object-fit: contain`; photographs and project imagery may use `cover` only when the crop is intentional.
- Card metadata, spacing, and typography provide consistency across visually different images.
- Images may receive a slight scale or rotation on hover, but no saturation, duotone, shine, gradient overlay, or forced palette matching.
- Items without media become deliberately typographic cards rather than empty placeholders.

## Page patterns

### Projects index

- Mixed-size visual mosaic using the shared garden card component.
- Introductory copy explains the relationship between modeling, operations, research software, public policy, and lab systems.
- Each card includes category, title, concise outcome, media or typographic fallback, and a clear destination.

### Project case study

- Restrained page introduction with title, category, role, dates, and a primary proof link where relevant.
- Sections follow: problem, constraints, system, decisions, outcomes, and supporting artifacts.
- Existing rich project front matter remains the source of truth.
- Wide diagrams and media use the common matte mount.
- Related or next projects appear at the end.

### Writing index and posts

- Writing index combines excerpt cards, dates, categories, and occasional imagery.
- Article pages use a narrower reading column, generous vertical rhythm, and the shared shell.
- Existing code, math, notebook, citation, and media features remain available when a post uses them.
- Optional table of contents remains subordinate to the article.

### Reading index and book reviews

- Reading is grouped by the existing thematic reading threads.
- Books with covers show natural color inside identical matte wells.
- Books without covers use a typographic treatment with title, author, rating, and note.
- Existing YAML reading notes remain usable without requiring a dedicated page for every book.
- Full book review pages show cover, metadata, review, and related titles.

### About

- Biography and positioning
- Current work at MetaHub and with public-sector simulation support
- Recurring themes and methods
- Selected credentials and publications
- Links to CV, publications, GitHub, LinkedIn, and email

### CV

- Preserve `_data/cv.yml` as the source of truth.
- Restyle the page with the shared navigation, typography, spacing, borders, and print-friendly behavior.
- Avoid duplicating details in page markup when they already exist in YAML.

### Utility pages

- Publications, archives, 404, and other retained pages use the same shell and tokens.
- Empty states explain what is absent and provide a useful next destination.

## Component architecture

Create small Liquid includes with explicit responsibilities:

- `garden-nav.liquid`: shared navigation and active-state logic
- `garden-footer.liquid`: compact contact, social, and secondary links
- `garden-intro.liquid`: category/page introduction
- `garden-card.liquid`: shared card frame and metadata
- `garden-media.liquid`: image, cover, chart, or typographic fallback
- `garden-project-card.liquid`: project-specific mapping into the shared card
- `garden-post-card.liquid`: post-specific mapping
- `garden-book-card.liquid`: book/review-specific mapping
- `garden-related.liquid`: related or next-item links

Each include receives documented parameters and avoids relying on unrelated global page state.

## Styling architecture

- Add a dedicated garden stylesheet and focused Sass partials for tokens, shell, grid, cards, page patterns, and motion.
- Load the garden stylesheet after the existing al-folio stylesheet while the migration is in progress.
- Remove obsolete `ii-*` homepage and shell selectors after every redesigned page is verified.
- Avoid adding another override block to the end of the 9,000-line `_sass/_base.scss`.
- Preserve specialized al-folio styling for code, math, notebooks, citations, and other content features unless it visibly conflicts.

## JavaScript architecture

- Retire the hash-routed `portfolio-home.js` behavior.
- Add a small progressive-enhancement script for legacy hash migration, optional reveal classes, and navigation state that cannot be expressed server-side.
- Use `IntersectionObserver` only for nonessential reveal animation.
- Do not block rendering or navigation on JavaScript.
- Keep event handling local to components and avoid global page state.

## Data flow

1. Jekyll reads project front matter, posts, book reviews, YAML reading data, CV YAML, and the curated homepage manifest.
2. Layouts select a page pattern.
3. Type-specific includes map source data into the shared garden card and media contracts.
4. Liquid renders complete HTML at build time.
5. CSS applies the responsive visual system.
6. Optional JavaScript adds motion and legacy-route compatibility after content is usable.

## Fallbacks and error handling

- Missing image: render a typographic media fallback.
- Missing optional metadata: omit the row and collapse its spacing.
- Missing homepage reference: render a clearly marked development fallback; release verification must catch and remove it.
- Image load failure: keep meaningful title and metadata visible; never leave a blank clickable card.
- External links: identify them and use safe `rel` attributes.
- JavaScript failure: server-rendered navigation, links, and content continue to work.
- Old hash route: map to the nearest canonical URL or homepage anchor.
- Empty collection: render an explanatory empty state and a path back to the garden.

## Accessibility

- Semantic landmarks and one clear primary heading per page.
- Consistent heading hierarchy inside cards and articles.
- Visible keyboard focus with adequate contrast and offset.
- Text colors meet WCAG contrast for their rendered size; decorative low-contrast text is never the only carrier of information.
- Informative alt text for meaningful media and empty alt text for decorative imagery.
- Full card links have clear accessible names without nested interactive elements.
- Navigation works by keyboard and screen reader at every breakpoint.
- Touch targets remain at least approximately 44px where practical.
- Reduced-motion preferences disable nonessential effects.
- No hover-only content or color-only status.

## Responsive behavior

- Mobile target: 390px viewport, one-column cards, compact horizontal navigation or accessible menu, and full-width reading flow.
- Tablet target: 768px viewport, two-column garden where space allows.
- Desktop target: 1024px and above, three-column mixed grid.
- Wide desktop: consider four columns only when card readability is preserved.
- Article and case-study reading widths remain capped independently of the global grid.
- Media aspect ratios are stable to avoid layout shift.

## Performance

- Prefer self-hosted WOFF2 font subsets and preload only the essential faces.
- Continue using responsive images and lazy loading below the fold.
- Eager-load only the primary above-the-fold media when present.
- Keep enhancement JavaScript small and deferred.
- Avoid video backgrounds, large texture tiles, animation libraries, and runtime layout engines.

## Migration strategy

1. Establish tokens, fonts, shell, navigation, footer, and shared components.
2. Replace the root hash-routed homepage with the continuous garden.
3. Redesign the project index and representative project case study, then apply the pattern to all projects.
4. Redesign writing index and representative post.
5. Redesign reading index and book review pattern.
6. Create the standalone About page and restyle CV.
7. Apply the shell to publications and utility pages; consolidate or redirect repositories and other redundant routes.
8. Remove obsolete `ii-*` markup, styles, and JavaScript.
9. Run full build, accessibility, responsive, link, and browser verification.

## Verification

- Run formatting checks on Liquid, Markdown, SCSS, and JavaScript.
- Run a development and production Jekyll build.
- Confirm no unresolved Liquid warnings, missing assets, or invalid homepage references.
- Inspect homepage and every index pattern at 390px, 768px, 1024px, and a wide desktop viewport.
- Inspect at least one project, article, book review, CV, publications, and 404 page.
- Test keyboard navigation, visible focus, reduced motion, and no-JavaScript behavior.
- Run automated accessibility checks on representative routes.
- Check internal links, legacy hash migration, external-link safety, console errors, and image fallbacks.
- Confirm print behavior for CV and readable article output.

## Acceptance criteria

- The homepage is continuous and has no hash-based content routing.
- All retained primary pages use the shared garden shell and approved palette.
- The layout is visibly close to Chester's editorial hierarchy and grid rhythm without copying personal content or assets.
- No glossy effects, gradients, glass surfaces, cinematic loaders, or pervasive texture are present.
- Full-color media is displayed through consistent matte mounts.
- Projects, writing, reading, About, CV, publications, and utility pages are responsive and keyboard accessible.
- Existing project, post, book, and CV data remains editable through their current Jekyll sources.
- The production build succeeds and representative pages pass automated and manual accessibility checks.
- Old hash destinations do not strand visitors.
