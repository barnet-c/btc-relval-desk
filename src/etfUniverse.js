/**
 * The spot-bitcoin ETF cohort.
 *
 * The universe is 10 of the 11 US spot-bitcoin ETFs that began trading on
 * 11 January 2024 (Hashdex's DEFI is the pending 11th). Per-fund metadata
 * (name, issuer, AUM, expense ratio) travels in the CSVs themselves; the only
 * thing declared here is how each fund is drawn.
 *
 * Unlike the gold desk, points are coloured by FUND rather than by structure.
 * Every fund here is the same structure -- a spot trust holding bitcoin -- so
 * structure no longer separates them; what a reader needs to tell apart is which
 * of the ten funds a point belongs to. Ten hues is legible where the gold desk's
 * 37 funds were not, which is why that desk fell back to six structural colours.
 *
 * The palette is deliberately neutral -- muted blues, teal, cyan, purple,
 * magenta, champagne, bronze, sand and two greys. No saturated green and no
 * saturated red anywhere, so nothing on the chart reads as an implied "good" or
 * "bad" verdict about a fund.
 *
 * FAMILY_ORDER / FAMILIES keep their names so the plot and legend need no logic
 * change, but here the key is a TICKER, not a structural family.
 */

export const FAMILY_ORDER = [
  'IBIT',
  'FBTC',
  'GBTC',
  'ARKB',
  'BITB',
  'HODL',
  'BTCO',
  'BRRR',
  'BTCW',
  'EZBC',
];

export const FAMILIES = {
  IBIT: {
    label: 'IBIT',
    color: '#6E9BD1', // blue
    blurb: 'BlackRock — iShares Bitcoin Trust. The largest of the cohort.',
  },
  FBTC: {
    label: 'FBTC',
    color: '#E0CE97', // champagne
    blurb: 'Fidelity — Wise Origin Bitcoin Fund.',
  },
  GBTC: {
    label: 'GBTC',
    color: '#C58A5A', // bronze
    blurb: 'Grayscale — the converted trust, and the priciest fee here.',
  },
  ARKB: {
    label: 'ARKB',
    color: '#A783C2', // purple
    blurb: 'ARK / 21Shares — ARK 21Shares Bitcoin ETF.',
  },
  BITB: {
    label: 'BITB',
    color: '#5FA8A6', // teal
    blurb: 'Bitwise — Bitwise Bitcoin ETF.',
  },
  HODL: {
    label: 'HODL',
    color: '#C57EA9', // magenta
    blurb: 'VanEck — VanEck Bitcoin Trust.',
  },
  BTCO: {
    label: 'BTCO',
    color: '#8E93A0', // cool grey
    blurb: 'Invesco / Galaxy — Invesco Galaxy Bitcoin ETF.',
  },
  BRRR: {
    label: 'BRRR',
    color: '#7FB6C4', // cyan
    blurb: 'CoinShares — CoinShares Valkyrie Bitcoin Fund.',
  },
  BTCW: {
    label: 'BTCW',
    color: '#ABA090', // warm grey
    blurb: 'WisdomTree — WisdomTree Bitcoin Fund.',
  },
  EZBC: {
    label: 'EZBC',
    color: '#8C86A6', // slate violet
    blurb: 'Franklin Templeton — Franklin Bitcoin ETF.',
  },
};

/** Anything the CSV labels with an unknown fund still gets drawn. */
export const FALLBACK_COLOR = '#79808C';

export function familyColor(key) {
  return (FAMILIES[key] && FAMILIES[key].color) || FALLBACK_COLOR;
}

export function familyLabel(key) {
  return (FAMILIES[key] && FAMILIES[key].label) || key;
}

export const UNIVERSE_SOURCE =
  'US spot-bitcoin ETFs listed 2024-01-11 — 10 of 11, DEFI pending';
