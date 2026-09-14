# Source data

The simulator's starting accounts are the **Asian Development Bank's UAE input-output table for 2024**, in current US dollars, millions. The source edition is August 2025. These are published ADB-compiled economic accounts, not GTAP data and not a newly conducted official UAE input-output survey.

- [ADB source catalogue](https://kidb.adb.org/globalization/current)
- [UAE national workbook, 2017–2024](https://kidb.adb.org/download/mrio-file/251), included here unchanged as `uae-adb-io-2017-2024.xlsx` (387 KB).
- [ADB 74-economy MRIO for 2024, plus rest of world](https://kidb.adb.org/download/mrio-file/445), about 100 MB. The extracted UAE partner records are included in `src/data/uae-partners.json`; the large source can be downloaded again by the script.
- [ADB input-output framework and methodology overview](https://www.adb.org/what-we-do/data/regional-input-output-tables).

Retrieved 14 September 2026. SHA-256 hashes, source cell ranges, valuations, definitions and balance diagnostics are recorded in the JSON metadata. All 35 source industries are retained. No intermediate-use or partner weights are invented or rescaled.

## Reproduce

From the project directory, with Python 3 and `openpyxl` installed:

```sh
python scripts/extract_adb.py
python scripts/extract_adb_partners.py
```

The first command reads the included workbook and creates the national baseline. Add `--download` to retrieve it again. The second retrieves the large MRIO workbook if necessary and adds the real bilateral flows. To use an already downloaded MRIO file:

```sh
python scripts/extract_adb_partners.py --source /absolute/path/adb-mrio74-2024.xlsx
```

Existing partner data is preserved when the national extraction is rerun only if its sector totals continue to match. Extraction fails rather than silently rescaling inconsistent sources.

## Definitions and limits

Domestic and imported intermediate use are separate 35 × 35 matrices, with supplying industries in rows and using industries in columns. Household consumption, government consumption, gross fixed capital formation and signed changes in inventories have explicit domestic/imported components. Exports are domestic-industry output sold abroad. Partner imports and exports sum both intermediate and final use directly from the MRIO.

Gross output is **not GDP**: it includes intermediate production. Aggregate value added at basic prices is USD 542,792.35 million in this source. The 2024 source has zero entries in its products-tax row; this does not establish that real-world UAE tariffs or other taxes are zero. Tariff revenue, labor compensation and capital income are absent and are marked `null`.

The source combines petroleum, natural gas and other mining in **Mining and quarrying**. It combines electricity, gas and water supply. It does not identify electricity technologies, physical energy volumes, emissions, citizen/expatriate labor, remittances or detailed fiscal accounts. A model using these dimensions needs separately identified assumptions or additional data.

These published MRIO imports and exports are not interchangeable with headline customs trade totals. Re-exports and trade margins require a dedicated reconciliation before such interpretation. Countries not separately represented are in Rest of the World. Earlier national workbook tabs use differing accounting presentations, so only the independently reconciled 2024 baseline is shipped in the model JSON.

## Reconciliation

Before releasing the JSON, scripts check each industry's domestic supply against domestic intermediate and final uses plus exports, production cost against output, imports against imported intermediate/final uses, and the aggregate expenditure identity. The MRIO domestic matrix must also match the national table and bilateral imports/exports must add to each industry's national totals.

The released 2024 data pass all these identities within USD 0.00001 million; actual largest residual is about USD 0.000000000116 million. Floating-point discrepancies are preserved in diagnostics and no balance adjustments are made.
