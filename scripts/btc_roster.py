"""
The US spot-bitcoin ETF roster: the funds cleared by the SEC to begin trading
11 January 2024, as the first American spot bitcoin exchange-traded products.

This desk plots 10 of the 11. Hashdex's DEFI is the pending 11th -- its history
on the price source used here is too short to fit the rolling windows, so it is
held out until a longer series is available. The other ten each carry ~500
sessions, comfortably past the pipeline's minimum.

Unlike the gold desk, every fund here is the SAME structure: a spot trust that
holds bitcoin directly. There is no leverage, no inverse, no miner equity and no
option overlay. So `family` is "spot" for all of them and is used only to look up
the creation-fee assumption; points on the desk are coloured by FUND, not by
structure, because structure no longer separates them.

AUM and ExpenseRatio are metadata only -- nothing plotted is derived from them.
They are approximate issuer figures captured 2026-08 and are not exact.
`benchmark` is the series each fund's residual is measured against: spot bitcoin.
"""

# ticker: (name, issuer, aum_usd, expense_ratio_pct, family, benchmark)
BTC_ROSTER = {
    "IBIT": ("iShares Bitcoin Trust",          "BlackRock",           80.00e9, 0.25, "spot", "BTC-USD"),
    "FBTC": ("Fidelity Wise Origin Bitcoin",   "Fidelity",            20.00e9, 0.25, "spot", "BTC-USD"),
    "GBTC": ("Grayscale Bitcoin Trust",        "Grayscale",           18.00e9, 1.50, "spot", "BTC-USD"),
    "ARKB": ("ARK 21Shares Bitcoin ETF",       "ARK / 21Shares",       5.00e9, 0.21, "spot", "BTC-USD"),
    "BITB": ("Bitwise Bitcoin ETF",            "Bitwise",              4.00e9, 0.20, "spot", "BTC-USD"),
    "HODL": ("VanEck Bitcoin Trust",           "VanEck",               1.30e9, 0.20, "spot", "BTC-USD"),
    "BTCO": ("Invesco Galaxy Bitcoin ETF",     "Invesco / Galaxy",     0.80e9, 0.25, "spot", "BTC-USD"),
    "BRRR": ("CoinShares Valkyrie Bitcoin",    "CoinShares",           0.60e9, 0.25, "spot", "BTC-USD"),
    "BTCW": ("WisdomTree Bitcoin Fund",        "WisdomTree",           0.40e9, 0.25, "spot", "BTC-USD"),
    "EZBC": ("Franklin Bitcoin ETF",           "Franklin Templeton",   0.50e9, 0.19, "spot", "BTC-USD"),
}

FAMILIES = {
    "spot": "Spot bitcoin",
}

SOURCE = "SEC spot-bitcoin cohort (listed 2024-01-11), 10 of 11; DEFI pending"
