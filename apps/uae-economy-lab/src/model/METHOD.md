# Economic model and interpretation

This is a **simplified single-country computable general equilibrium model**, calibrated to the supplied UAE input-output accounts. It is not a port of the standard GTAP model, does not reproduce GTAP results, and does not estimate the impacts of actual policies without additional policy evidence.

## Calibration

For sector j, the source gives gross output Yj, domestic and imported intermediate purchases Dij and Mij, value added Vj, final uses, inventories, and exports. Every sector must satisfy both its sales identity and its production-cost identity. The validator rejects discrepancies larger than 0.001% of sector output. Prices are initially one, so initial value flows also act as benchmark quantity units. Signed inventory changes are retained as fixed quantities, not converted into positive consumer demand.

The source does not identify wages, labor counts, capital stocks, tariff rates, or economic response elasticities. The default value-added labor share 0.6, domestic/import elasticity 2, and export-demand elasticity 4 are **assumptions**. They are not estimated or externally validated UAE parameters. Changing these parameters is sensitivity analysis, not a confidence interval.

## Production and factor markets

All activity uses fixed proportions of intermediate composites and a value-added composite. Each supplying commodity's domestic and imported varieties form a CES composite with its own benchmark shares for each using activity or final-demand category. This preserves the source's different import intensities; it does not impose one national import share on every user.

Value added combines mobile labor and sector-specific fixed capital using Cobb-Douglas technology. A sector productivity shock scales the input requirements of both intermediate composites and value added. If activity expands with fixed capital, its labor requirement and capital rental rate rise. Zero-profit conditions equate output prices with unit input costs, including the productivity shift.

The fixed-labor closure keeps aggregate labor supply at its benchmark and solves the wage. Sector employment outputs describe reallocation. The elastic closure holds the real wage (relative to the model household consumption price index) fixed and allows unconstrained labor supply. This is an alternative economic assumption; it is not a model of migration, unemployment, Emiratization, or specific worker groups.

## Demand, government and the external account

Household demand has fixed expenditure shares across commodity composites. Government and fixed investment hold their real composite volumes constant. Inventories hold their signed domestic/imported quantities constant. Government balances its consumption spending through lump-sum household taxes net of modeled tariff receipts. Household consumption's share of disposable factor income is calibrated to reproduce the baseline; remaining income is household saving.

Investment spending less saving determines foreign financing. This is an explicit external closure: foreign financing can adjust without a risk premium, borrowing ceiling, financial friction, exchange-rate intervention, or sovereign-wealth-fund module. A positive foreign-financing number is net borrowing; a negative number is net lending. The model verifies that the financing balance equals the opposite of the trade balance at its prices. It does not claim the source economy has no other real-world investment income or remittances; those channels are absent from this reduced model.

Import prices in world-price units are exogenous. Each sector's foreign export demand is a calibrated downward-sloping function of its domestic output price. Domestic prices and factor returns adjust while the world-price numeraire remains fixed. The model has no foreign production equations or trading-partner detail.

## Scenario meaning

- Productivity changes are hypothetical technological changes. Their implementation costs are not modeled. `manufacturing` means ADB sectors c3 through c16.
- `freightCost` is retained as an interface field name but means a **uniform delivered import-price change** across goods and services. No freight-margin data exist in the source, so a label such as “shipping cost” would overstate what is modeled.
- `oilDemand` shifts the export-demand intercept of ADB c2, **mining and quarrying**, which combines oil, gas, and other extraction. It is not a world oil-price or production-quota shock.
- Tariff reductions are rejected when observed effective baseline tariff rates are absent. Zeros in the source products-tax row do not establish that actual UAE tariffs are zero. If rates are supplied, the model uses tax-inclusive benchmark import values and recycles collected import tariffs through the balanced government account. Bilateral tariff shocks remain unsupported.

### Multiple simultaneous sector changes

`Scenario.sectorShocks` accepts a map keyed by exact ADB sector IDs. Each sector can specify `productivity`, `importPrice`, and `exportDemand`, in percent. All effective changes enter one joint equilibrium solve. For example:

```ts
{
  sectorShocks: {
    c2: { exportDemand: -20 },
    c8: { productivity: 8, importPrice: 10 },
    c25: { productivity: 5, exportDemand: 15 }
  },
  laborClosure: 'fixed'
}
```

Existing scalar controls remain supported. First, the engine applies the legacy/global productivity, import-price and mining-demand settings. A supplied sector dimension then **replaces** that sector's inherited value. An omitted or `undefined` dimension inherits; explicit zero cancels an inherited change for that sector. Values are not added or compounded. `result.appliedSectorShocks` records the final effective percentages for every sector, including zero values. Invalid IDs, unknown dimension names, nonfinite values and out-of-range magnitudes throw errors.

An import-price change for sector i changes the price of **imports of commodity i** to every user of those imports; it does not change all imported inputs bought by industry i. Its effect depends on each user's observed imported inputs and the domestic/import substitution assumption. Export-demand changes apply to the chosen sector's demand intercept. A sector with zero initial exports cannot gain an export market through this multiplicative model; such an ineffective demand shock produces a warning.

Combined results generally differ from the sum of separate results because the shocks share intermediate markets, labor, household income and relative prices. Comparing the combined run with standalone runs is a model interaction comparison. It is not a unique causal attribution to each shock. A contribution attributed to one shock would depend on the order or decomposition method; none is implemented here.

### Reading industry connections

The benchmark `domesticIO[i][j]` is industry j's purchases from domestic supplier i; `importedIO[i][j]` is j's purchases of imported commodity i. These observed transactions support descriptions of direct supplier/customer exposure. A supplier's share of a customer's total intermediate purchases has denominator the sum of **both** domestic and imported purchases down that customer's column. A customer's share of a supplier's output uses the supplier's gross output as denominator. These are different measures and should be labeled accordingly.

Every sector result includes `intermediateInputPrice`: the percentage change in its benchmark-weighted intermediate-composite price index, before its productivity change. It is `null` when the source sector has no intermediate purchases. This distinguishes changing input prices from changing input quantities and technological efficiency. It combines the equilibrium prices of all suppliers and imports; it does not identify which selected shock caused a given amount of the change.

Supplier/customer links are baseline connections, not measured transmission coefficients. Equilibrium sector output, price and labor-demand changes may be shown alongside those links, but an arrow should not claim that a specific fraction of a customer's change was caused by the connected supplier. The model also transmits effects through wages and final demand beyond direct supply-chain links.

## Output metrics and solver checks

Real GDP is the sum of sector real value added calculated by double deflation: new gross output valued at benchmark prices minus new domestic and imported intermediate quantities valued at their benchmark prices. It is not gross output, nominal income, a fitted multiplier, or a forecast. A terms-of-trade loss can therefore reduce household purchasing power much more than real GDP under a fixed-resource closure.

`householdRealIncome` is the real household-consumption index: household nominal consumption divided by the Cobb-Douglas consumption price index. It describes one representative household's consumption possibilities, not individual incomes, distributional welfare, or Emirati households specifically. Sector `employment` is a model labor-demand index using assumed labor payments as weights; it is not a worker count. Changes in GDP, prices, output, trade and household consumption are percentages relative to the same benchmark, not annual growth rates.

The numerical engine solves log prices, log activity and log wages with a damped Newton method and a numerical Jacobian. It checks goods-market clearing, zero profits and the chosen labor closure. Singular Jacobians, invalid accounts, invalid inputs, failed line searches and nonconvergence throw errors; they do not produce fallback economic estimates. Tests independently check the benchmark, directional mechanisms, fiscal/external balance, both labor closures and failure behavior, and run separate and combined shocks on the real UAE dataset.

The source's 2024 value-added total is reproduced at baseline. This establishes accounting calibration and software behavior, not predictive validity. Behavioral calibration, validation against another CGE implementation, alternative external/fiscal closures, and UAE-specific household, labor, energy and re-export modeling would be required for policy appraisal.
