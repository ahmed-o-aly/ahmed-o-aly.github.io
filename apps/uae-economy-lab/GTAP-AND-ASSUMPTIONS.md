# GTAP and the UAE Economy Lab

Verified against official GTAP documentation and the app's economic engine on 14 September 2026.

**The app is a UAE economic experiment model.** It uses real ADB accounts for 2024, covering 35 industries, and solves how production, purchases, trade and prices fit together after a hypothetical change. It is a simplified national CGE model; it does not run the standard GTAP equations or use the GTAP database.

**GTAP has three distinct parts:** an economic database, a model, and software for running experiments. The database connects countries' production and consumption accounts with trade flows. The model supplies the behavioral equations. RunGTAP is an interface to the GEMPACK software used to solve those equations. A different interface does not, by itself, reproduce the GTAP model. [GTAP introduction](https://www.gtap.agecon.purdue.edu/about/getting_started.asp)

**The controls answer different questions.**

| Control | Plain meaning | Example |
|---|---|---|
| Baseline data | What the starting economy looks like | How much UAE manufacturers buy from domestic suppliers and abroad |
| Shock | What you want to change | Manufacturing productivity +5% |
| Parameter | How strongly people or firms respond | How readily buyers switch between domestic products and imports |
| Closure | What stays fixed and what is allowed to adjust | Keep total labor fixed and solve wages, or keep real wages fixed and solve labor demand |
| Result | What the equations calculate | Output, prices, imports and household purchasing power |

A closure is the choice of given variables and solved variables. A shock changes a given variable; it does not directly dictate the results. GTAP supports different closures, including alternatives for employment, fiscal adjustment and the trade balance. [GTAP closure definition](https://gtap.agecon.purdue.edu/resources/faqs/faqs_display.asp?F_ID=59), [GTAP model options](https://www.gtap.agecon.purdue.edu/models/current.asp)

**What standard GTAP adds**

| Component | Standard GTAP | This app | Consequence for interpretation |
|---|---|---|---|
| Economic coverage | Solves regions throughout the world together. [Model documentation, pp. 4–5](https://jgea.org/ojs/index.php/jgea/article/download/47/30/229) | Solves UAE industries; the foreign economy is represented by import prices and export-demand curves. | Foreign producers, incomes and competing buyers do not respond inside the app. |
| Accounts | Reconciles national tables, trade, macroeconomic, energy and protection information into a consistent benchmark. [Database guide](https://www.gtap.agecon.purdue.edu/databases/v12/index.aspx) | Uses ADB's UAE accounts and separate MRIO partner exposures. | Real source data establish the starting structure, not the accuracy of response assumptions. |
| Production | Includes substitution parameters across input and factor groups; version 7 can distinguish products from producing activities. [Quick reference](https://www.gtap.agecon.purdue.edu/resources/res_download.asp?D_ID=9143) | One commodity per industry; fixed input-composite proportions; a labor/capital composite; domestic/import substitution. | A steel producer cannot replace steelmaking inputs with an unrelated input simply because its price falls. |
| Competition | Perfect competition and constant returns to scale. [Model overview](https://www.gtap.agecon.purdue.edu/models/current.asp) | Competitive pricing with all input costs and capital rents accounted for. | Neither model automatically estimates firm markups, monopoly profits or economies of scale. |
| Labor and capital | Factor mobility is configurable. A usual capital treatment allows movement between industries while fixing the region's total. [Model documentation, pp. 8–9](https://jgea.org/ojs/index.php/jgea/article/download/47/30/229) | One mobile labor category; capital fixed separately in every sector. | The app cannot shift existing capital from a contracting sector into an expanding one. |
| Trade substitution | Distinguishes domestic goods from imported composites, then imports by origin. [GTAP parameters](https://www.gtap.agecon.purdue.edu/models/setsVariables.asp) | Distinguishes domestic from imported products, with an individual benchmark import share for each user. | It can calculate domestic/import substitution, but cannot calculate switching from one foreign supplier country to another. |
| Transport and tariffs | Represents international transport margins and bilateral trade; protection data distinguish tax-paid and tax-free flows. [Model overview](https://www.gtap.agecon.purdue.edu/models/current.asp), [GTAP accounts](https://www.gtap.agecon.purdue.edu/models/setsVariables.asp) | Import costs are delivered-price shocks. Actual tariff rates are missing, so tariff-cut experiments are disabled. | A delivered-price change is not an implemented trade agreement, customs-revenue estimate or freight-only shock. |
| Household demand | Private demand uses CDE preferences, allowing expenditure patterns to change with income. [Model overview](https://www.gtap.agecon.purdue.edu/models/current.asp) | Household expenditure shares across commodity composites remain fixed. | The app cannot estimate richer households shifting toward different categories of consumption. |
| Public spending and saving | A regional household allocates income among private consumption, government consumption and saving. [Graphical introduction, pp. 5–8](https://www.gtap.agecon.purdue.edu/resources/res_download.asp?D_ID=181) | Public real consumption is fixed; household lump-sum taxes fund its cost; consumption is a fixed share of disposable income. | The app uses an explicit fiscal balancing assumption, not the UAE's actual tax and spending rules. |
| Investment and finance | Global saving finances investment, with alternative rules for its allocation across regions. [GTAP investment parameters and accounts](https://www.gtap.agecon.purdue.edu/models/setsVariables.asp) | Real investment is fixed; foreign financing fills the gap between investment spending and domestic saving. | Financing does not become more expensive or hit a borrowing limit. |

Full employment is a **closure choice**, not a fact established by GTAP or by this app. Fixing total labor means there can be industry-level job reallocation and wage changes, but no net increase in aggregate model employment. It does not establish that everyone in the real UAE is employed. GTAP permits alternative employment closures. [GTAP model options](https://www.gtap.agecon.purdue.edu/models/current.asp)

**The assumptions in this app, why they exist, and what they change**

These explanations describe the implementation in the [economic method](src/model/METHOD.md) and [engine](src/model/engine.ts). The reasons explain modeling choices; they do not establish that those choices are empirically correct for the UAE.

| Assumption | Current setting and reason | Effect on results |
|---|---|---|
| Labor share | 60% of value added in every industry. The source does not separate labor and capital earnings. | Determines how income is divided and how labor demand changes when activity expands against fixed capital. This is especially consequential for mining. It is not an observed UAE wage share. |
| Domestic/import substitution | Elasticity 2 throughout the economy. A single explicit value keeps behavioral calibration inspectable. | Holding the composite fixed, a 1% rise in the domestic/import price ratio reduces the domestic/import quantity ratio by about 2%. A higher value permits stronger switching; it does not guarantee a better GDP result. |
| Export sensitivity | Elasticity 4 throughout the economy. Foreign demand must be represented without foreign production equations. | Before other changes, a 1% rise in the export price reduces demand by about 4%. A higher value makes export volumes more price-sensitive. |
| Fixed labor | Total labor is fixed by default; the wage clears the labor market. | Expanding sectors compete for labor with other sectors. Aggregate employment change is zero by construction. |
| Elastic labor alternative | Real wage is fixed; labor supply can expand or contract without a limit. | Allows an aggregate employment response. It does not identify unemployment, migration, visa availability or citizen/expatriate effects. More work has no leisure cost in the model. |
| Sector capital | Capital stays in its initial sector and does not accumulate. Detailed capital stocks and investment dynamics are absent. | Expansion meets sector capacity pressure through factor returns and labor requirements. No factory-building or capital relocation response is generated. |
| Public purchases | The real amount of each public consumption composite stays fixed. | Its changing monetary cost is passed to the representative household through the fiscal balancing rule. No discretionary stimulus or spending cuts occur automatically. |
| Household spending | Commodity expenditure shares and propensity to consume disposable income stay fixed. | Income and prices alter consumption volumes; household types and inequality are not distinguished. |
| Investment and inventories | Real fixed-investment composites and signed inventory quantities stay fixed. | Investment does not rise automatically when an industry becomes more profitable. Inventory drawdowns are preserved rather than converted into positive demand. |
| External financing | Investment spending less domestic saving determines net financing from abroad. | The trade balance can change. There are no interest premiums, financing constraints, remittances or sovereign wealth fund decisions. |
| Price reference | Import prices are given in a common world-price unit; domestic relative prices adjust. | Price changes are relative-price results. They do not model UAE monetary policy, the exchange-rate peg or a dated inflation forecast. |

**What a shock actually does**

A productivity increase of 5% multiplies the targeted production-efficiency factor by 1.05. Producing the same output therefore requires each intermediate composite and the value-added composite to be divided by 1.05. That is approximately 4.76% less of those composites per unit of output. Actual production and labor then adjust to demand, prices and available factors; sector output is not forced to rise by 5%.

An import-cost increase changes the price of imported products delivered to UAE users. It does not specify whether the cause is transport, an overseas producer's price or another cost. Domestic products can become relatively more attractive, but producers also pay more for imported inputs and household purchasing power changes. The net result must be solved.

The mining experiment changes foreign demand for the sector's output at a given price. Mining combines oil, gas and other extraction. This does not set the oil price, the production quota or the price of an individual crude grade.

For a combined experiment, all selected changes belong in **one equilibrium solve**. For example, changing manufacturing and logistics productivity together changes their shared suppliers, customers and labor market. Adding two separately calculated GDP percentages does not generally reproduce the combined result.

**Bilateral exposure is real data, but it is not a bilateral policy simulation.** The partner view reports ADB MRIO flows between UAE industries and foreign economies. Those flows help identify dependence and exposure. The solver does not use them to model tariffs by origin, foreign production responses, trade diversion or retaliation. A country-specific policy experiment requires those mechanisms and the relevant policy data.

**What the results can tell you**

- Real GDP here means total real value added at basic prices, using benchmark-price output less intermediate use. It is a change from the model's starting economy, not an annual growth forecast.
- Household purchasing power is real representative-household consumption. It is not a distributional welfare measure, household survey or GTAP equivalent variation.
- Employment is a labor-demand index. It is not a measured worker count.
- A converged solution means the equations and accounts balance. It does not validate the assumed elasticities or predict the actual policy outcome.

**Standard GTAP also has limits.** It compares economic states rather than automatically generating a year-by-year forecast. Its standard accounts do not provide a complete government deficit/transfer system, re-export business model, remittance system or monetary economy. Those gaps matter for the UAE. [Model documentation, pp. 4–8](https://jgea.org/ojs/index.php/jgea/article/download/47/30/229)

Dynamic GTAP adds investment behavior, capital ownership and economic paths over time. GTAP-E adds energy substitution and emissions accounting; electricity detail requires additional model and data choices. These are extensions requiring appropriate data and assumptions, not hidden features already present in this app. [Dynamic GTAP](https://www.gtap.agecon.purdue.edu/models/dynamic/model.asp), [GTAP-E documentation](https://www.gtap.agecon.purdue.edu/uploads/resources/download/4212.pdf), [GTAP-E-Power](https://jgea.org/ojs/index.php/jgea/article/view/27)

For UAE trade-policy appraisal, the next substantive upgrade is an actual multiregion model with reconciled bilateral tariff/protection accounts. For domestic policy, priorities are measured sector labor/capital shares, household and government accounts, energy detail, remittances, re-exports, and capital formation. Testing alternative response parameters and closures should accompany the scenario results.
