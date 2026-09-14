# Verification

Verified on 14 September 2026. Version 0.2 adds simultaneous sector edits and live simulation.

- Production build passes (`npm run build`).
- 35 automated tests pass across economic equilibrium behavior, source reconciliation, combined controls, inheritance and storage validation.
- Engine checks cover opposing changes in multiple sectors, separate import-product prices, zero overrides, both labor closures and fiscal/external accounting. Six extra experiments changing all 35 sectors at once converged.
- Browser checks: combined presets, separate chemicals productivity and air-transport demand edits, automatic recalculation, assumption changes, saved scenarios, hash-link restoration, reload and CSV export. Exports retain all effective sector changes and applied assumptions.
- The invalid-import message remains visible after recalculation; previous accounts stay usable. Superseded simulations are cancelled, comparison results clear on selection and sector details derive from the latest result.
- Desktop and 390 × 844 mobile layouts inspected. Simulator and assumptions views have no page overflow; mobile totals remain visible while editing. Real supplier/buyer links, assumption explanations and GTAP comparison inspected.
- The example combined CSV contains 95 rows, including 35 effective sector-control rows and 35 sector-result rows. Chemicals productivity is 12%, air transport export demand is 8%, and broad imported-product prices are -5% in that example.

The tests establish software and accounting consistency, not predictive accuracy or equivalence to standard GTAP. Labor shares and response parameters remain illustrative assumptions. Tariff simulation requires verified sector rates.


## Unified sector workspace

Verified 14 September 2026 after the sector workflow update.

- Replaced the sector popup with one workspace covering production, value added, exports, imports, input prices, producer prices, labor demand, domestic/imported suppliers, output destinations, domestic customers and both partner directions.
- Seven new profile tests reconcile all 35 sector accounts, buyer/input/partner denominators, signed inventories, scenario levels, zero-input sectors, opaque IDs, reordered result arrays and input immutability. All 35 automated tests pass.
- Browser: opened Food & beverages from Sectors, followed Agriculture & fishing from its imported inputs and returned using Back; switched to Hotels, visited Understand and returned to the same sector. Household employment correctly shows no intermediate inputs and no baseline exports, while retaining its positive product imports.
- Browser: adding 1% Food productivity updates output from −5.30% to −2.73%; Save/Export disable while calculating. Clearing the cell via keyboard restores the original four-shock scenario and −5.30% output. No saved scenarios were added or removed.
- Domestic-use and export changes reconcile to the output change at baseline prices. No bilateral scenario changes or causal shock contributions are fabricated.
- Desktop overview and complete workspace screenshot inspected. Responsive CSS reviewed; this update's mobile layout has not had a fresh browser screenshot check. Earlier mobile checks above refer to the pre-existing simulator/assumption views.
- Screenshot: verification/sector-workspace.png. Audit evidence: work/sector-audit in the parent task workspace.
