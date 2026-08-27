# Bitcoin ETF Desk

A relative value desk for the **US spot-bitcoin ETF cohort** &mdash; the funds
that began trading on 11 January 2024, each holding bitcoin directly against a
benchmark of `BTC-USD`. Ten of the eleven are plotted here; Hashdex's **DEFI**
is documented but pending a usable price series.

Recreated from the [OpenEXA relative value desk](https://yellow-grass-043d0571e.7.azurestaticapps.net/):
the same Plotly desk and obsidian theme, re-pointed from a heterogeneous gold
screener onto a cohort where every fund holds the **same** asset &mdash; so the
whole desk becomes a like-for-like comparison of cost, liquidity and tracking.

| | |
|---|---|
| **Framework** | React 18 + `react-scripts` 5 |
| **Charting** | `plotly.js` via `react-plotly.js` (WebGL scatter) |
| **Data loading** | `d3-dsv` (CSV from `public/plotted_datasets`) |
| **Data pipeline** | Python standard library only |
| **Deployment** | Azure Static Web Apps, or any static host |

---

## The universe

The ten funds are one structure &mdash; a spot trust holding bitcoin &mdash; so
points are coloured by **fund**, not by structure. Metadata (AUM, expense ratio)
travels in the CSVs and appears in tooltips; nothing plotted derives from it.

| Fund | Issuer | Median beta to bitcoin | Median round trip | Latest ADV |
|---|---|---|---|---|
| IBIT | BlackRock | 0.94 | &mdash; | $2.1bn |
| FBTC | Fidelity | 0.94 | &mdash; | $249m |
| GBTC | Grayscale | 0.94 | &mdash; | $117m |
| BITB | Bitwise | 0.94 | &mdash; | $53m |
| ARKB | ARK / 21Shares | 0.94 | &mdash; | $43m |
| HODL | VanEck | 0.94 | &mdash; | $27m |
| EZBC | Franklin Templeton | 0.94 | &mdash; | $6m |
| BTCO | Invesco / Galaxy | 0.94 | &mdash; | $4m |
| BTCW | WisdomTree | 0.94 | &mdash; | $1.4m |
| BRRR | CoinShares Valkyrie | 0.94 | &mdash; | $0.9m |

Every fund clusters near a **0.94** beta to bitcoin, not exactly 1. The
shortfall is not missing exposure &mdash; it is **non-synchronous pricing**: the
ETF close is struck at 4 p.m. New York while `BTC-USD` keeps moving, so the two
series are measured at different instants and the fitted beta is attenuated. The
weekend gap (bitcoin trades seven days, the funds five) pulls the same way. The
funds hold their bitcoin; the clock is what prints below 1.

The strip above the chart filters by fund: click to mute, double-click to
isolate.

---

## The panels

| Panel | x | y | z |
|---|---|---|---|
| Creation Arbitrage | execution cost (bps, log, reversed) | net spread (bps, log-modulus) | &mdash; |
| Creation Arbitrage 3D | execution cost (bps, log, reversed) | net spread (log-modulus) | convergence half-life (sessions, log) |
| Cost of Ownership | round-trip cost (bps, log) | realised holding drag (bps/yr, log-modulus) | &mdash; |
| Liquidity | daily turnover ($mm, log) | estimated spread (bps, log) | &mdash; |
| Exposure | beta to bitcoin | realised volatility (% ann, log) | &mdash; |
| Three-way 3D | beta to bitcoin | turnover (log) | round trip (log) |

### Real units, not z-scores

An earlier version standardised every axis. That fails here: a z-score reports
IBIT as "three standard deviations liquid" when the useful fact is that it trades
**two thousand times** the size of the smallest fund on the desk. Every axis is
in the unit it was measured in, and where a span crosses orders of magnitude the
axis is logarithmic rather than the data being squashed. **Every tick label is a
real number you could quote.**

Holding drag and net spread both take both signs, so they use a **log-modulus**
scale, `sign(x) x log10(1 + |x|)`, with ticks written back in real units.

### Palette

Deliberately neutral &mdash; muted blues, teal, cyan, purple, magenta,
champagne, bronze, sand and two greys, ten distinguishable hues. No saturated
green and no saturated red anywhere, so no point on the chart reads as an implied
verdict about a fund. A unit test enforces this by hue.

---

## Methodology

The **Methodology** tab explains every formula in plain English alongside the
maths. In short:

| # | Quantity | Formula |
|---|---|---|
| 1 | Log return | `r_t = ln(close_t / close_{t-1})` |
| 2 | Fair value | 21-session beta-implied path from `BTC-USD`, net of accrued fee |
| 3 | Bid&ndash;ask spread | Corwin&ndash;Schultz (2012) high/low estimator, 21d mean |
| 4 | Execution cost (D2) | half-spread + Amihud impact per leg + creation fee + financing |
| 5 | Net arbitrage spread | `|gross spread| - D2` |
| 6 | Convergence half-life | `-ln(2) / ln(1 + beta)` from an AR(1) on the dislocation |
| 7 | Round-trip cost | `spread + median(Amihud) x $1mm x 10,000` |
| 8 | Realised holding drag | `-mean(r - beta.b over 126d) x 252 x 10,000` |
| 9 | Beta to bitcoin | `Cov(r, btc) / Var(btc)` over 60 sessions |

Choices worth flagging:

- **One structure, coloured by fund.** Every fund holds bitcoin, so there is no
  structural family to separate them; the dispersion that remains is cost,
  liquidity and tracking, and that is what the desk isolates.
- **Drag is measured, not quoted.** Rather than repeat the stated expense ratio,
  the desk fits what the fund actually cost its holder. Across the cohort the
  median is a small **~7 bps/yr**, as you would expect from ten funds holding
  the same asset at fees in a narrow band.
- **Net arbitrage spread straddles zero.** Against a typical **~77 bps**
  dislocation the median D2 is **~75 bps**, so the net spread is negative about
  half the time &mdash; what an efficient, single-structure market looks like.

Fund assets and stated fees are quoted from issuer pages and shown in tooltips as
context. **They are never plotted** &mdash; every axis is derived from price.

### Caveats specific to this cohort

- **Cash-create cost is not captured.** The funds launched creating in cash, not
  in kind, inserting a leg the AP does not control and D2 does not price, so the
  arbitrage panel understates cost over the cash-create window.
- **The weekend gap is baked in.** A Monday fund return is scored against a
  Friday-to-Monday bitcoin move, inflating the fair-value gap on Mondays and
  biasing the convergence fit by about one session a week.
- **Beta prints below 1 for a clock reason, not a holdings reason** (see above).

---

## Data pipeline

`scripts/build_datasets.py` pulls daily OHLCV for the ten funds plus the
`BTC-USD` benchmark from the public Yahoo Finance chart endpoint, and writes the
CSVs the app reads. Standard library only.

```bash
python scripts/build_datasets.py   # or: npm run data
```

```
public/plotted_datasets/etf_arbitrage.csv   creation/redemption arbitrage
public/plotted_datasets/etf_cost.csv        cost of ownership
public/plotted_datasets/etf_liquidity.csv   liquidity
public/plotted_datasets/etf_exposure.csv    exposure quality
public/plotted_datasets/etf_latest.csv      one row per fund, latest session
```

The desk keeps only sessions the fund and `BTC-USD` calendars share, which is
how the weekend gap is handled. The script prints real-unit percentiles and
per-fund medians on every run; the plot axis ranges in
[`src/datasets.js`](src/datasets.js) are sized from that output.

The roster lives in [`scripts/btc_roster.py`](scripts/btc_roster.py) with its
source recorded, and a documented slot left for DEFI as the eleventh fund.

---

## Running it

```bash
npm install
npm start      # dev server on http://localhost:3000
npm test       # unit tests
npm run build  # production bundle in build/
```

The tests cover more than wiring: they assert the palette contains no saturated
green or red, that no axis is a z-score, that all ten funds are covered, and that
every log axis gives its tickvals in **data** units. That last one is a real trap
&mdash; Plotly reads a log axis `range` in log10 units but `tickvals` in data
units, and getting it backwards renders a single mislabelled tick with no error.

## Project layout

```
scripts/btc_roster.py       the 10-fund universe, with source (DEFI pending)
scripts/build_datasets.py   market data -> the CSV panels
public/plotted_datasets/    generated datasets, served statically
src/App.js                  header, tabs, fund filter, view switching
src/AboutPage.js            the Methodology page
src/RelValPlot.js           Plotly traces, log axes, neutral 3D styling
src/datasets.js             panel definitions (axes, ranges, tick maps)
src/etfUniverse.js          the ten funds and their colours
src/EtfData.js              CSV column-access helpers
```

## Limitations

- **Spreads are estimated, not quoted.** Corwin&ndash;Schultz infers a spread
  from the daily high and low and reads high on volatile instruments &mdash; and
  bitcoin is volatile &mdash; so absolute spread levels are likely overstated,
  though the ranking across funds holds.
- **Daily bars, not intraday.** This describes structure over months, not when
  to send an order.
- **The arbitrage panel has no basket and no NAV.** It proxies the holdings with
  a beta-scaled bitcoin path anchored on the fund's own price, so it reads
  directionally, not to the basis point. Its cash legs (commission, financing,
  creation fee, bitcoin impact) are desk constants set at the top of the build
  script.
- **A $1mm clip is large for the smallest funds.** For the thinnest names on the
  desk that clip is a meaningful share of a day's volume, and the cost shown says
  so.
- **Not investment advice**, and not affiliated with any issuer named.
