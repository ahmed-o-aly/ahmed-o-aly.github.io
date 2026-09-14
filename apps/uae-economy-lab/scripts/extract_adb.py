#!/usr/bin/env python3
"""Reproduce UAE baseline from the public ADB national input-output workbook.

Requires Python 3 and openpyxl. Source cells and original source are preserved.
Run: python scripts/extract_adb.py [--download] [--year 2024]
"""
from __future__ import annotations

import argparse
import hashlib
import json
import math
from pathlib import Path
import urllib.request

import openpyxl

ROOT = Path(__file__).resolve().parents[1]
URL = "https://kidb.adb.org/download/mrio-file/251"
SOURCE = ROOT / "data/source/uae-adb-io-2017-2024.xlsx"
LABELS = [
    "Agriculture & fishing", "Mining & quarrying", "Food & beverages",
    "Textiles", "Leather & footwear", "Wood products", "Paper & printing",
    "Petroleum refining", "Chemicals", "Rubber & plastics", "Nonmetallic minerals",
    "Metals", "Machinery", "Electrical & optical equipment", "Transport equipment",
    "Other manufacturing", "Electricity, gas & water", "Construction", "Motor trade & fuel retail",
    "Wholesale trade", "Retail trade", "Hotels & restaurants", "Inland transport",
    "Water transport", "Air transport", "Transport support & travel agencies",
    "Post & telecommunications", "Finance", "Real estate", "Business services",
    "Public administration", "Education", "Health & social work", "Other services",
    "Household employment",
]


def extract(workbook, year: int):
    sheet = workbook[str(year)]
    rows = list(sheet.values)
    def num(row, col):
        value = rows[row - 1][col - 1]
        if not isinstance(value, (int, float)) or not math.isfinite(value):
            raise ValueError(f"Non-numeric source {year}!{openpyxl.utils.get_column_letter(col)}{row}: {value!r}")
        return float(value)
    def block(start):
        return [[num(start + i, 4 + j) for j in range(35)] for i in range(35)]

    domestic = block(8)
    imported = block(43)
    assert min(min(row) for row in domestic + imported) >= 0
    sectors = []
    for i in range(35):
        row = 8 + i
        assert rows[row - 1][2] == f"c{i+1}"
        assert rows[42 + i][2] == f"c{i+1}"
        sector = {
            "id": f"c{i+1}", "name": LABELS[i], "sourceName": rows[row - 1][0],
            "output": num(row, 45), "valueAdded": num(84, 4 + i),
            "exports": num(row, 44), "imports": num(row + 35, 45),
            "taxesLessSubsidiesOnProducts": num(80, 4 + i),
            "tariffRevenue": None, "laborCompensation": None, "capitalIncome": None,
        }
        for label, col in [("Household", 39), ("Npish", 40), ("Government", 41), ("Investment", 42), ("Inventories", 43)]:
            sector["domestic" + label] = num(row, col)
            sector["imported" + label] = num(row + 35, col)
            sector[label[0].lower() + label[1:]] = num(row, col) + num(row + 35, col)
        sectors.append(sector)

    # The two sides are independently taken from reported output, demand, and VA.
    demand_residuals = [
        s["output"] - sum(domestic[i]) - s["exports"] - sum(s["domestic" + c] for c in ["Household", "Npish", "Government", "Investment", "Inventories"])
        for i, s in enumerate(sectors)
    ]
    cost_residuals = [
        s["output"] - sum(domestic[i][j] + imported[i][j] for i in range(35)) - s["valueAdded"] - s["taxesLessSubsidiesOnProducts"]
        for j, s in enumerate(sectors)
    ]
    import_residuals = [
        s["imports"] - sum(imported[i]) - sum(s["imported" + c] for c in ["Household", "Npish", "Government", "Investment", "Inventories"])
        for i, s in enumerate(sectors)
    ]
    aggregate = {key: sum(s[key] for s in sectors) for key in ["output", "valueAdded", "exports", "imports", "household", "npish", "government", "investment", "inventories", "taxesLessSubsidiesOnProducts"]}
    expenditure = aggregate["household"] + aggregate["npish"] + aggregate["government"] + aggregate["investment"] + aggregate["inventories"] + aggregate["exports"] - aggregate["imports"]
    validation = {
        "maxDomesticSupplyResidual": max(abs(v) for v in demand_residuals),
        "maxProductionCostResidual": max(abs(v) for v in cost_residuals),
        "maxImportUseResidual": max(abs(v) for v in import_residuals),
        "aggregateExpenditureMinusValueAddedMinusIntermediateProductTaxes": expenditure - aggregate["valueAdded"] - aggregate["taxesLessSubsidiesOnProducts"],
        "reportedValueAdded": num(84, 45),
        "extractedMinusReportedValueAdded": aggregate["valueAdded"] - num(84, 45),
        "toleranceUSDmillion": 0.00001,
        "balanced": all(abs(x) <= .00001 for x in demand_residuals + cost_residuals + import_residuals + [expenditure - aggregate["valueAdded"] - aggregate["taxesLessSubsidiesOnProducts"]]),
    }
    if not validation["balanced"]:
        raise ValueError(f"Source balancing failed: {validation}")
    return {"sectors": sectors, "domesticIO": domestic, "importedIO": imported, "aggregate": aggregate, "validation": validation}


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--download", action="store_true")
    parser.add_argument("--year", type=int, default=2024)
    args = parser.parse_args()
    SOURCE.parent.mkdir(parents=True, exist_ok=True)
    if args.download or not SOURCE.exists():
        with urllib.request.urlopen(URL, timeout=90) as response:
            SOURCE.write_bytes(response.read())
    workbook = openpyxl.load_workbook(SOURCE, data_only=True, read_only=True)
    data = extract(workbook, args.year)
    data["meta"] = {
        "source": "Asian Development Bank Multiregional Input-Output database: UAE national table",
        "year": args.year, "units": "USD million, current prices", "currency": "USD", "scale": 1000000,
        "edition": "August 2025", "country": "United Arab Emirates", "countryCode": "ARE",
        "sourceUrl": URL, "catalogUrl": "https://kidb.adb.org/globalization/current",
        "methodologyUrl": "https://www.adb.org/what-we-do/data/regional-input-output-tables",
        "workbook": "data/source/uae-adb-io-2017-2024.xlsx", "sheet": str(args.year),
        "sha256": hashlib.sha256(SOURCE.read_bytes()).hexdigest(),
        "retrievedAt": "2026-09-14", "sectors": 35,
        "modelType": "Published ADB input-output accounts. This is not the GTAP database or model.",
        "valuations": {
            "table": "Current prices, USD million, as printed in workbook A2",
            "valueAdded": "Value added at basic prices, workbook row84",
            "investment": "Gross fixed capital formation only. Changes in inventories and valuables kept separately, signed.",
            "imports": "Imported commodity use: intermediate and final use from workbook IMP block. No estimated allocation.",
            "taxes": "Workbook taxes less subsidies on products row is zero. This does not establish that tariffs are zero; tariffRevenue remains null.",
        },
        "sourceRanges": {
            "domesticIO": "D8:AL42", "importedIO": "D43:AL77", "output": "AS8:AS42",
            "valueAdded": "D84:AL84", "domesticFinalDemand": "AM8:AQ42", "importedFinalDemand": "AM43:AQ77",
            "exports": "AR8:AR42", "imports": "AS43:AS77", "taxesLessSubsidiesOnProducts": "D80:AL80",
        },
        "limitations": [
            "ADB-compiled interindustry estimates; not a new official UAE supply-use survey and not GTAP.",
            "Mining and quarrying includes petroleum, natural gas and other mining; the table cannot isolate oil from gas.",
            "Electricity, gas and water are one industry; technologies, physical energy volumes and emissions are absent.",
            "Labor compensation, capital income, citizen/expatriate labor, tariff rates, remittances and fiscal detail are absent.",
            "The national table supplies aggregate imports and exports; bilateral trade requires the separate MRIO source.",
            "Published sector exports and imports should not be equated to headline customs totals or used to identify re-export margins without further reconciliation.",
            "Monetary values are current USD millions and are not volumes or constant-price growth measures.",
        ],
    }
    data["partners"] = []
    partner_path = ROOT / "src/data/uae-partners.json"
    if partner_path.exists():
        partner_data = json.loads(partner_path.read_text())
        if partner_data["meta"]["year"] == args.year:
            partners = partner_data["partners"]
            residual = max(
                abs(sum(p[key + "BySector"][i] for p in partners) - s[key])
                for i, s in enumerate(data["sectors"]) for key in ["imports", "exports"]
            )
            if residual > .00001:
                raise ValueError("Existing partner data no longer matches national data; rerun partner extraction.")
            data["partners"] = partners
            data["meta"]["partners"] = partner_data["meta"]
            data["validation"]["partners"] = partner_data["validation"]
            data["meta"]["limitations"] = [v for v in data["meta"]["limitations"] if not v.startswith("The national table supplies")]
    # Earlier workbook tabs use differing accounting presentations. Only the
    # selected and independently balanced year is released as a model baseline.
    target = ROOT / "src/data/uae-baseline.json"
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(json.dumps(data, indent=2, allow_nan=False) + "\n")
    print(json.dumps({"file": str(target), "aggregate": data["aggregate"], "validation": data["validation"]}, indent=2))


if __name__ == "__main__":
    main()
