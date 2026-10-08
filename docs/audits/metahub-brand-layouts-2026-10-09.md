# MetaHub website identity review

The local review covers all five labs. Four run their real applications with `?theme=folio`; Machine Lab uses a static assembly capture and illustrative controls because its implementation belongs to the separate machine-inspector repository. The existing default app URLs retain their current theme.

`assets/css/garden-tokens.css` now supplies the unchanged website palette and font tokens to both Jekyll and Vite. `_sass/garden/_tokens.scss` imports it into the website. `assets/css/metahub-lab-theme.css` owns the shared review appearance and the few subject-specific layout adjustments. Existing model, wire and quantum-axis colours retain their meaning; only the neutral scene backdrops change.

Generate the comparison after building and serving the site:

```sh
node scripts/preview-metahub-layouts.mjs
python -m http.server 4002 --bind 127.0.0.1 --directory output/metahub-layouts
```

The generator defaults to the built site at port 4001 and installed Edge. `METAHUB_QA_URL` and `METAHUB_QA_BROWSER_CHANNEL` override them. It writes five desktop captures, five phone captures, the Machine Lab prototype and a comparison page with a screen-size toggle. `output/` is ignored and excluded from Jekyll publication.

Verification on 2026-10-09:

- Four app builds and Jekyll build completed. The existing Windows ImageMagick executable issue still prevents responsive image derivatives; the review uses existing images and browser captures.
- All 257 app tests passed: Protein 30, Circuits 185, Bloch 29 and Power Systems 13.
- `npm run test:site` and `npm run test:metahub-browser` passed against the newly built output.
- Review captures passed at 1440 × 900 and 390 × 844 with no horizontal overflow or app errors. Real controls were exercised: protein representation/help, circuit module/help, Bloch free exploration/preparation, and power-equipment selection/mobile details.
- Axe found no WCAG 2 A/AA or 2.1 AA violations on the four initial themed app views at desktop and phone sizes, or the phone comparison page. This is a bounded automated check, not a physical headset test.
- Circuits phone navigation was changed to two columns after visual review. The protein viewport received a valid group role, and a circuit note now uses the darker shared text colour.
- Changed curated files passed Prettier and `git diff --check`. The repository's existing formatting deviations and native-app source formatting were not broadly rewritten.

Nothing was pushed or published during this review.

## Approved styling adopted

The user approved the layouts and allowed the Machine Lab rebuild to be left aside. The four native labs now enable the shared theme on their normal URLs, including project embeds; `?theme=folio` is no longer required. The comparison links open those normal URLs. Protein, Circuits and Bloch catalogue covers were refreshed from their real branded applications.

Machine Lab's public repository was fetched and checked: it contains only the published HTML, bundles and model packages, with no original application source in its available history. Its bundle and public entry remain unchanged. The comparison continues to label its layout as a visual prototype.

All four app bundles were rebuilt. The freshly built site contracts, default-route browser checks and the comparison generator's real-control checks passed. No app/model data changed, and nothing was pushed or published.
