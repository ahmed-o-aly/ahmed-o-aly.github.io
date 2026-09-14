# UAE Economy Lab

An economic scenario app with a working, simplified national CGE solver and a compact interface. The baseline is real **ADB UAE 2024 input-output data**: 35 industries and 74 external partner records. No synthetic UAE accounts or predetermined scenario results are used.

## Run

Node.js 22 or newer is recommended.

```sh
npm install
npm run dev
```

For development, open `http://127.0.0.1:5177/uae-economy-lab/`. The published app is at [UAE Economy Lab](https://ahmed-o-aly.github.io/uae-economy-lab/).

```sh
npm test
npm run build
npm run preview
```

The production build writes to `../../assets/apps/uae-economy-lab/`. Commit that bundle with source changes, then run the parent Jekyll build and serve `../../_site/` over HTTP. A Jekyll hook publishes the bundle at `/uae-economy-lab/` without modifying its compiled assets. The app requires HTTP rather than opening `index.html` directly, because the solver runs in a Web Worker. Once served, it does not require an external API or cloud solver. Fonts and source data are bundled.

## Use

Combine **Lower import costs**, **Energy demand shock**, and **Industrial growth** by toggling them on or off. Each preset changes its own broad setting and preserves the others. Results update automatically 250 ms after editing pauses; a superseded solve is cancelled. The active scenario is restored after reload when its dataset matches.

Use the **Fine-tune sectors** table to enter separate productivity, export-demand and imported-product price changes for several industries at once. A blank cell inherits its broad setting; entering a number replaces that setting for that sector, and entering zero explicitly cancels it. Clear the cell to restore inheritance. These are simultaneous changes in a single equilibrium, not a sum of separate simulation results.

**Sectors** is a single workspace for a selected industry. It combines baseline and scenario production, value added, exports and imports; producer prices, input prices and labor demand; domestic and imported input purchases; domestic customers and final demand; and export destinations and import origins. Follow supplier/customer links with a back path, edit sector shocks, adjust assumptions, save and export without leaving the workspace. Sector links from the simulator, trade tables, partner details and Data open the same view. Selection is retained across app navigation.

Imports of a sector’s product into the UAE differ from imported inputs purchased by that sector’s producers; the workspace labels both. Supplier shares cover all domestic and imported intermediate purchases. Customer shares cover sales to UAE industries. Link amounts and partner shares remain baseline estimates, while scenario monetary levels are volumes at baseline prices. Signed inventory changes are preserved.

**Understand** contains Assumptions and GTAP comparison, with a direct route to the sector workspace. See [GTAP and assumptions](GTAP-AND-ASSUMPTIONS.md) for the sourced explanation.

- **Sector impact:** output, price or employment changes; sort, search and open the complete sector workspace.
- **Trade → Scenario flows:** baseline and simulated national trade volumes at baseline prices.
- **Trade → Partner exposure:** ADB baseline bilateral trade estimates by partner and sector. This view does not claim to simulate partner-specific policies.
- **Save / Compare:** retain up to 12 scenarios locally, including data identity, all sector changes and behavioral assumptions. Compare only scenarios using the same data.
- **Export:** CSV with scenario inputs, assumptions, provenance, diagnostics and sector results.
- **Data:** inspect sources, limitations, accounts and residuals. Response assumptions are also editable in **Understand → Assumptions**.

Saved scenarios live in this browser's local storage. Shared links preserve broad controls, sector overrides, assumptions and dataset identity; a localhost link needs this app running on the receiving machine. Imported accounts are held in the current session, so they must be imported again after a reload. Files are processed locally and are not uploaded to a server.

## What the model does

The solver jointly determines domestic producer prices, output, wages, intermediate use, household demand, imports and exports. It combines domestic/import CES bundles, fixed intermediate input requirements, labor and sector-specific capital, household demand and export demand. Government and investment real demand are fixed, lump-sum fiscal transfers balance government accounts, and external financing adjusts. The fixed-workforce option changes wages and reallocates employment; the flexible-workforce option fixes wages and allows employment to change.

This is **not the standard GTAP model**, and it is not a forecast. It is an independently implemented, simplified single-country CGE calibrated to published ADB accounts. Full GTAP data access required login during development; no GTAP license or proprietary dataset is included.

The default labor share (60%), import substitution elasticity (2), and export-demand elasticity (4) are explicit modeling assumptions, not estimates from the accounts. They can be changed in the UI. Household purchasing power measures real household consumption, not comprehensive social welfare or citizen-specific income. Real GDP denotes aggregate real value added at basic prices.

Sector-specific import-price changes affect imports of that sector’s product for every buyer; they do not change the price of every imported input purchased by that sector. Export-demand shifts cannot create exports where the benchmark has none.

Mining export demand covers the combined mining and quarrying industry, including oil and natural gas. It is a demand-intercept shock, not a direct global oil-price forecast. Import costs change delivered import prices uniformly across goods and services; they are not a detailed freight or supply-chain model. Productivity improves production efficiency; it does not automatically include the cost of a government investment program.

The accounts lack observed sector tariff rates. The built-in dataset therefore **does not enable tariff cuts**. Missing rates are not represented as observed zero tariffs. A future tariff extension needs reconciled tariff and fiscal data; national or product-group averages should not be copied across industries. Citizen/expatriate labor, remittances, energy technologies, emissions and separate emirates also need additional data and model extensions.

## Data and reproducibility

[Source notes](data/source/README.md) include download links, source definitions, the unchanged national workbook and extraction instructions. Source hashes, cell ranges, metadata and reconciliation results are included in `src/data/uae-baseline.json`. The large ADB MRIO workbook is not bundled; its extracted UAE partner flows and a reproducible download/extraction script are included.

[Model specification](src/model/METHOD.md) documents the equations, closures, calibration and diagnostics. The test suite verifies baseline reproduction, accounting identities, responses to separate and combined shocks, convergence failure handling, source/partner reconciliation and saved-scenario integrity.

## Import format

Use the bundled `src/data/uae-baseline.json` as the schema reference. Monetary values must be **current USD million**, and metadata must identify `countryCode: "ARE"`, `currency: "USD"`, `scale: 1000000`, a reference year and a source.

Required arrays are `sectors`, `domesticIO`, and `importedIO`. The two matrices have suppliers in rows and users in columns. Each sector requires an ID, name, output, value added, exports, and domestic/imported household, government, investment and signed inventory flows. Optional partner records must reconcile to national trade. The importer validates balances and rejects inconsistent accounts; it does not fill missing input-output coefficients or rescale data to force a match.

Keep observed effective tariff rates as fraction-valued `tariffRate` fields only when properly reconciled with the underlying accounts. A complete set enables the tariff control in the current solver, but is not a substitute for reviewing the model's fiscal calibration.

## Project structure

- `src/App.tsx`, `src/SectorEditor.tsx`, `src/scenario.ts`, `src/workbench.css`: combined edits and live simulation.
- `src/SectorWorkspace.tsx`, `src/sector-workspace.css`, `src/sectorProfile.ts`: unified sector results, trade, production links and local controls.
- `src/ExplainView.tsx`, `src/explain.css`: assumptions and GTAP comparison.
- `src/PartnerView.tsx`: baseline bilateral exposure.
- `src/adapter.ts`, `src/model.worker.ts`: validated data and isolated solver execution.
- `src/model/engine.ts`: equilibrium solver.
- `src/data/`: real accounts and provenance.
- `scripts/`: reproducible source extraction.

Built and verified 14 September 2026.
