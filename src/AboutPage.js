import React from 'react';
import { FAMILIES, FAMILY_ORDER } from './etfUniverse';

function Formula({ tag, name, unit, code, plain, children }) {
  return (
    <div className="formula">
      <div className="formula-head">
        <span className="formula-tag">{tag}</span>
        <span className="formula-name">{name}</span>
        {unit && <span className="formula-unit">{unit}</span>}
      </div>
      <pre>{code}</pre>
      {children && <p className="formula-note">{children}</p>}
      {plain && (
        <div className="plain">
          <span className="plain-tag">In plain English</span>
          <p>{plain}</p>
        </div>
      )}
    </div>
  );
}

export default function AboutPage() {
  return (
    <div className="doc">
      <div className="doc-hero">
        <div className="doc-kicker">Methodology</div>
        <h1>How this desk works</h1>
        <p className="doc-lede">
          Ten US spot-bitcoin ETFs that all hold the same thing &mdash; bitcoin
          &mdash; and yet cost different amounts to own and to trade. This page
          explains every number on the desk: where it comes from, what it means,
          and where it stops being trustworthy. No prior knowledge assumed.
        </p>
      </div>

      {/* ── universe ─────────────────────────────────── */}
      <section id="universe">
        <h2>The universe</h2>
        <h3>The US spot-bitcoin cohort</h3>

        <p>
          On <strong>11 January 2024</strong> the SEC allowed the first US
          spot-bitcoin ETFs to begin trading &mdash; eleven funds that each hold
          bitcoin directly and track its dollar price. This desk plots{' '}
          <strong>ten</strong> of them.
        </p>

        <div className="note">
          <p>
            The eleventh, Hashdex&rsquo;s <strong>DEFI</strong>, returns too few
            clean daily bars from the public price feed to support any rolling
            statistic, so it is documented but not yet plotted. A slot is left
            for it in the roster the moment a usable series appears.
          </p>
        </div>

        <h4>They are the same instrument &mdash; that is the point</h4>

        <p>
          Unlike a gold screener, which mixes bullion trusts with leveraged
          notes and miner baskets, this cohort is <strong>one structure</strong>:
          every fund is a spot trust holding bitcoin against a benchmark of{' '}
          <code>BTC-USD</code>. Nothing here separates them by <em>kind</em>. So
          points are coloured by <strong>fund</strong> rather than by structure,
          and the whole desk becomes a like-for-like comparison &mdash; the same
          exposure, priced ten different ways.
        </p>

        <div className="tablewrap">
          <table className="tbl">
            <thead>
              <tr>
                <th>Fund</th>
                <th>Issuer</th>
              </tr>
            </thead>
            <tbody>
              {FAMILY_ORDER.map((k) => (
                <tr key={k}>
                  <td className="tk">
                    <span className="swatch" style={{ background: FAMILIES[k].color }} />
                    {FAMILIES[k].label}
                  </td>
                  <td>{FAMILIES[k].blurb}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p>
          Click any fund in the strip above the chart to hide it; double-click to
          view it alone. Because every fund holds the same asset, the difference
          that matters is small and lives in cost, liquidity and tracking
          &mdash; which is exactly what the desk isolates.
        </p>
      </section>

      {/* ── data ─────────────────────────────────── */}
      <section id="data">
        <h2>Inputs</h2>
        <h3>Where the numbers come from</h3>

        <p>
          Every plotted value is derived from free daily price data &mdash; the
          open, high, low, close and volume for each fund, pulled from Yahoo
          Finance&rsquo;s public chart endpoint. Nothing here needs a paid
          terminal.
        </p>

        <div className="formula">
          <div className="formula-head">
            <span className="formula-tag">SRC</span>
            <span className="formula-name">Price feed</span>
          </div>
          <pre>{`https://query1.finance.yahoo.com/v8/finance/chart/{SYMBOL}
    ?range=2y&interval=1d`}</pre>
          <p className="formula-note">
            Plus one benchmark: <code>BTC-USD</code>, spot bitcoin, used as the
            reference for every fund &mdash; because every fund holds bitcoin.
          </p>
        </div>

        <div className="note warn">
          <p>
            <strong>Fund assets and stated fees are quoted from issuer pages</strong>{' '}
            and appear in the tooltip as context. They are never plotted. Every
            axis is derived from price, so nothing on the chart depends on a
            figure this desk cannot recompute.
          </p>
        </div>

        <div className="note warn">
          <p>
            <strong>The weekend gap.</strong> Bitcoin trades continuously, seven
            days a week; the ETFs trade only on the five days the US equity
            market is open. The desk keeps only sessions the two calendars share,
            so a Monday fund return is measured against bitcoin&rsquo;s Friday-to-Monday
            move &mdash; a move that spans a weekend the fund could not trade
            through. This inflates the apparent fair-value gap on Mondays and
            biases the fitted convergence one session per week. It is inherent to
            comparing a five-day wrapper with a seven-day underlying.
          </p>
        </div>

        <p>
          Each fund is measured on <strong>its own history</strong>. The cohort
          shares a listing date, so the windows are close to identical here, but
          the newest data point on every axis is that fund&rsquo;s own most
          recent session.
        </p>

        <Formula
          tag="1"
          name="Daily log return"
          unit="decimal"
          code={`r_t = ln( close_t / close_(t-1) )      the fund
b_t = ln( btc_t  / btc_(t-1) )        spot bitcoin (BTC-USD)`}
          plain="Today's price divided by yesterday's, then a logarithm. Logs are used instead of plain percentages because they add up cleanly over time."
        />
      </section>

      {/* ── arbitrage ─────────────────────────────────── */}
      <section id="arbitrage">
        <h2>Panel one</h2>
        <h3>Creation arbitrage</h3>

        <p>
          Most of this desk asks what a fund costs <em>you</em>. This panel
          asks a different question, from the other side of the screen: when
          the traded price drifts away from the bitcoin the fund actually holds,{' '}
          <strong>is the gap big enough for anyone to bother closing it?</strong>
        </p>

        <p>
          That is the job of an authorised participant. If the ETF trades rich
          it sells the ETF, buys bitcoin, and delivers it to the issuer for new
          shares. If it trades cheap it does the reverse. The trade only exists
          if the dislocation is wider than the cost of doing it &mdash; and that
          cost is the horizontal axis here.
        </p>

        <h4>Step one &mdash; what the holdings are worth</h4>

        <p>
          The textbook version prices the creation basket line by line at
          executable quotes. This desk has no basket file and no quotes, so the
          holdings are proxied by the fund&rsquo;s benchmark &mdash;{' '}
          <code>BTC-USD</code> &mdash; rolled forward on the beta fitted in
          panel five, and bled down by the fee the NAV accrues along the way.
        </p>

        <Formula
          tag="2"
          name="Fair value"
          unit="price"
          code={`FV_t = P_(t−W) · exp(  Σ beta_s · b_s  −  (ER/252) · W  )
                        s = t−W+1 .. t

W = 21 sessions      b_s = bitcoin log return
beta_s = the fund's own 60-session beta to bitcoin`}
          plain="Take the fund's price three weeks ago, push it forward by whatever bitcoin did since — scaled by how much bitcoin the fund actually gives you — then subtract the management fee it has quietly accrued. That is roughly what a share should be worth today."
        >
          Anchoring on the fund&rsquo;s own price rather than a published NAV is
          what makes this computable from free data. It also means the measure
          is a <em>relative</em> dislocation over the last 21 sessions, not an
          absolute premium to NAV.
        </Formula>

        <Formula
          tag="3"
          name="Gross arbitrage spread"
          unit="basis points"
          code={`GrossSpread_t = ( P_ETF,t − FV_t ) / FV_t  × 10,000`}
          plain="How far the market price has wandered from that fair value, in hundredths of a percent. Positive means the ETF is expensive relative to the bitcoin it holds; negative means it is cheap."
        />

        <h4>The horizontal axis &mdash; what the trade costs</h4>

        <p>
          Every arbitrage crosses <strong>two</strong> markets, and the textbook
          splits the cost accordingly. The ETF leg pays half a spread, plus the
          impact of its own size, plus commission. The bitcoin leg pays half a
          spread and its own impact. On top of both sit two cash items: the
          issuer&rsquo;s creation fee, and the cost of funding the position over
          the settlement gap.
        </p>

        <Formula
          tag="4"
          name="Total execution cost  (D₂)"
          unit="basis points"
          code={`C_ETF = Spread_ETF / 2   +  MI_ETF  +  Commission
C_btc = Spread_btc / 2   +  MI_btc

D2 = C_ETF  +  C_btc  +  CreationFee  +  Financing`}
          plain="Add up every toll the round trip pays: half the gap between buy and sell on each of the two markets, the price you move by trading size, the broker's cut, the issuer's fee for printing new shares, and one night of interest."
        >
          Both spreads come from the same Corwin&ndash;Schultz estimator as
          formula 7 in panel three &mdash; the fund&rsquo;s on the fund, bitcoin&rsquo;s
          on <code>BTC-USD</code>. <code>MI_ETF</code> is the Amihud impact of
          formula 8 for a $1m clip. Note that this is a <em>one-way</em> cost on
          each leg, unlike the round trip in panel three, which crosses the same
          market twice.
        </Formula>

        <div className="note warn">
          <p>
            <strong>Four of these numbers are invented, not sourced.</strong>{' '}
            Only the two spread terms and <code>MI_ETF</code> are measured from
            price data. Commission (<strong>0.5 bps</strong>), financing (an
            assumed <strong>4.3%</strong> annualised over <strong>T+1</strong>,
            about 1.2 bps), the creation fee (<strong>1.0 bps</strong>) and
            bitcoin-leg impact (<strong>1.0 bps</strong>) are placeholder
            constants of roughly the right order of magnitude.{' '}
            <strong>No prospectus, fee schedule or funding curve was consulted
            for any of them.</strong> Bitcoin-leg impact in particular is assumed
            rather than measured: spot bitcoin is deep, but Yahoo does not report
            a reliable executable-size series for it, so an Amihud measure would
            be noise. All of these sit at the top of{' '}
            <code>scripts/build_datasets.py</code>; replace them with real data
            before quoting a number off this panel.
          </p>
        </div>

        <div className="note warn">
          <p>
            <strong>Cash create versus in-kind.</strong> At launch the SEC
            required these funds to create and redeem <em>in cash</em>, not in
            bitcoin: the AP hands the issuer dollars and the issuer buys the
            bitcoin, inserting a party and a spread the AP does not control.
            That extra leg is a real cost this desk&rsquo;s D₂ does not capture,
            so the panel <em>understates</em> arbitrage cost over the cash-create
            part of the window. In-kind creation, which removes that leg, was
            only permitted later.
          </p>
        </div>

        <h4>The vertical axis &mdash; what survives</h4>

        <Formula
          tag="5"
          name="Net arbitrage spread"
          unit="basis points"
          code={`NetSpread_t = | GrossSpread_t |  −  D2_t`}
          plain="The dislocation minus everything it costs to capture. Above zero, the trade pays for itself. Below zero, the price can stay 'wrong' all day and nobody has a reason to correct it."
        >
          The absolute value is deliberate: an AP creates when the ETF is rich
          and redeems when it is cheap, so what has to clear the cost is the{' '}
          <em>size</em> of the dislocation, not its direction. The signed gross
          spread is in the tooltip if you want to know which way it pointed.
        </Formula>

        <div className="note warn">
          <p>
            <strong>Why that axis looks strange too.</strong> The horizontal
            axis is <strong>logarithmic</strong> and{' '}
            <strong>reversed</strong> &mdash; cost grows to the <em>left</em>,
            and each labelled step that way is ten times the last. The practical
            reading: <strong>the further right a point sits, the cheaper it is
            to arbitrage</strong>. Execution cost is strictly positive, so the
            axis never reaches zero.
          </p>
        </div>

        <div className="note">
          <p>
            <strong>Reading the panel.</strong> With one structure, the spread
            in cost is driven by <em>size</em>, not design. The large, liquid
            funds &mdash; <strong>IBIT, FBTC, GBTC</strong> &mdash; sit furthest
            right at a median D₂ near <strong>63 bps</strong>, while the thinnest,{' '}
            <strong>BTCW</strong>, pays about <strong>123 bps</strong> for the same
            trade. Against a typical dislocation of roughly <strong>77 bps</strong>,
            the median net spread across the cohort is essentially{' '}
            <strong>zero</strong> &mdash; negative about <strong>50%</strong> of
            the time. That is what an efficient, single-structure market looks
            like: the gap and the cost of closing it are the same size, so the
            trade is a coin-flip rather than a standing edge.
          </p>
        </div>

        <div className="note warn">
          <p>
            <strong>Do not read the level as free money.</strong> The net spread
            straddling zero is the fair-value proxy showing through: formula 2
            measures drift away from a 21-session beta-implied path, and a fund
            can drift from that path for reasons an AP cannot monetise &mdash;
            beta estimation error, the weekend gap, non-synchronous closing
            prices, genuine tracking slippage. A true premium to NAV would be far
            smaller. Compare funds against each other, and watch which side of
            the line they sit on; do not read the height above zero as a P&amp;L.
          </p>
        </div>

      </section>

      {/* ── arbitrage 3d ─────────────────────────────────── */}
      <section id="arbitrage-3d">
        <h2>Panel two</h2>
        <h3>Creation arbitrage in three dimensions</h3>

        <p>
          Panel one tells you whether a dislocation is <em>worth</em> closing.
          It does not tell you how long your money is tied up while it closes.
          This panel keeps both arbitrage axes exactly as they were and adds
          that third question on the vertical: <strong>once the position is on,
          how long does the gap historically take to shut?</strong>
        </p>

        <h4>The third axis &mdash; how fast it closes</h4>

        <p>
          Take the same relative dislocation from formula 3 and ask whether it
          mean-reverts. Regress today&rsquo;s <em>change</em> in the spread on
          yesterday&rsquo;s <em>level</em>. A negative slope means a wide gap
          tends to narrow, and the size of that slope says how quickly. Turn it
          into a half-life &mdash; the number of sessions for any gap to shrink
          by half &mdash; and it becomes a number you can compare across funds.
        </p>

        <Formula
          tag="6"
          name="Convergence half-life"
          unit="sessions"
          code={`S_t = ( P_ETF,t − FV_t ) / FV_t

ΔS_t = alpha  +  beta · S_(t−1)  +  e_t      over 60 sessions

  equivalently   S_t = c + (1 + beta) · S_(t−1) + e_t

HalfLife = − ln(2) / ln(1 + beta)`}
          plain="Fit a line to how much of yesterday's gap disappeared today, then work out how many days it takes for half of any gap to melt away. Under a day means the market is policing itself tightly."
        >
          Only a mean-reverting fit has a half-life, so this is left blank
          unless <code>&minus;1 &lt; beta &lt; 0</code>. A fit that reverts almost
          imperceptibly can throw an enormous half-life, so the value is clamped
          at <strong>999 sessions</strong> &mdash; but nothing here comes close:
          the longest fitted half-life on the whole desk is{' '}
          <strong>3.2 sessions</strong>, so the clamp never bites.
        </Formula>

        <div className="note warn">
          <p>
            <strong>Daily bars are the wrong frequency for this, and that
            matters.</strong> Create/redeem is an intraday trade; the textbook
            fits this regression on 1- or 5-minute bars, where a half-life of
            &ldquo;six periods&rdquo; means half an hour. Free daily closes are
            the coarsest frequency that still says anything, so a half-life
            under one session here should be read as <em>within a day</em> and
            no finer. The cross-sectional ranking is the usable output; the
            absolute number is not.
          </p>
        </div>

        <div className="note">
          <p>
            <strong>Reading the panel.</strong> The good corner is{' '}
            <strong>low and to the right</strong> &mdash; cheap to put on, and
            quick to come back. Because every fund holds the same deeply-traded
            asset, the whole cohort lives in that corner: a median half-life of
            about <strong>0.55 sessions</strong> &mdash; well under a day &mdash;
            and <strong>every</strong> fund-session converging in under five. The
            spread that remains is along the cost axis, not the speed axis: the
            big funds are marginally faster and much cheaper, the thin funds
            marginally slower and dearer, but none of them stays dislocated for
            long. This is the mechanism working the way it should.
          </p>
        </div>

        <div className="note warn">
          <p>
            <strong>Drag to rotate.</strong> Three-dimensional scatter hides
            points behind other points from any single angle, so no one camera
            position tells the truth about this cloud. Spin it. The tooltip
            carries the exact half-life, execution cost and both spreads for
            whichever point you are actually looking at.
          </p>
        </div>
      </section>

      {/* ── cost panel ─────────────────────────────────── */}
      <section id="cost">
        <h2>Panel three</h2>
        <h3>Cost of ownership</h3>

        <p>
          Two costs decide what a fund really charges you, and neither is the
          number on the fact sheet. There is what you pay to <em>get in and
          out</em>, and what the fund quietly costs you <em>per year you hold
          it</em>.
        </p>

        <h4>The horizontal axis &mdash; getting in and out</h4>

        <p>
          Daily data has no bid and no ask. But there is a well-known way to
          recover the spread from just the daily high and low, published by
          Corwin and Schultz in 2012. Over two days, the high-to-low range
          reflects both real price movement and the spread &mdash; and real
          movement scales with time while the spread does not. Compare one
          day&rsquo;s range with a two-day range and the spread falls out.
        </p>

        <Formula
          tag="7"
          name="Corwin&ndash;Schultz spread estimator"
          unit="basis points"
          code={`k = 3 − 2√2

beta  = ln(H_(t-1) / L_(t-1))²  +  ln(H_t / L_t)²
gamma = ln( max(H_(t-1), H_t) / min(L_(t-1), L_t) )²

alpha = ( √(2·beta) − √beta ) / k  −  √( gamma / k )

Spread_t = 2 · (e^alpha − 1) / (1 + e^alpha)   × 10,000`}
          plain="An estimate of the gap between the buy price and the sell price, worked out from the daily high and low alone. Roughly: what you lose instantly by buying and immediately selling."
        >
          Averaged over 21 sessions, because the daily version is clipped at zero
          whenever the maths returns a negative number.
        </Formula>

        <p>
          Then there is your own footprint. A large order in a thin fund pushes
          the price against you. Amihud&rsquo;s 2002 measure captures that in one
          number: how far the price moves per million dollars traded.
        </p>

        <Formula
          tag="8"
          name="Round-trip trading cost"
          unit="basis points"
          code={`illiq_t = | r_t |  /  ( close_t · volume_t / 1,000,000 )

RoundTrip_t = Spread_t  +  ( median illiq over 21 sessions × $1mm × 10,000 )`}
          plain="What one complete buy-and-sell costs on a one-million-dollar order: the spread you cross, plus the price you move by showing up."
        >
          The median, not the average. Amihud puts turnover in the denominator,
          so a single near-dead session sends an average to infinity &mdash; and
          the thinnest funds here have sessions like that. Quoted for a $1m clip
          so the funds are comparable; for the smallest funds on the desk that
          clip is a large share of a day&rsquo;s volume, and the cost shown says
          so.
        </Formula>

        <h4>The vertical axis &mdash; the cost of holding it</h4>

        <p>
          Rather than quote the stated expense ratio, the desk measures what the
          fund <em>actually</em> cost. Strip out the bitcoin move and whatever
          systematic loss is left over is the real drag &mdash; fees, cash-create
          slippage, tracking error, all of it, whether or not it appears in a
          prospectus.
        </p>

        <Formula
          tag="9"
          name="Realised holding drag"
          unit="basis points per year"
          code={`beta_t  = Cov(r, b) / Var(b)          over the last 60 sessions
resid_t = r_t − beta_t · b_t

Drag = − mean( resid over the last 126 sessions ) × 252 × 10,000`}
          plain="How much the fund lost its holder each year beyond what bitcoin did. Positive means it bled value; negative means it actually did slightly better than its exposure implies."
        >
          126 sessions is about six months. Because this is measured rather than
          quoted, it captures things a fee table never shows. Across this cohort
          the median drag is small &mdash; about <strong>7 bps/yr</strong> &mdash;
          which is what you would expect from ten funds that all hold the same
          asset and charge fees in a narrow band.
        </Formula>

        <div className="note warn">
          <p>
            <strong>Why that axis looks strange.</strong> Holding drag takes both
            signs and spans a wide range across this cohort, so neither a normal
            nor a logarithmic axis can show it. The plot uses a{' '}
            <strong>log-modulus</strong> scale,{' '}
            <code>sign(x) &times; log10(1 + |x|)</code>, which keeps the sign and
            compresses the tail. <strong>The tick labels are real bps per
            year</strong> &mdash; each step is ten times the last.
          </p>
        </div>

        <p>
          The best place to sit is the <strong>bottom left</strong>: cheap to
          trade, and it does not bleed while you hold it. With one structure the
          cohort clusters tightly, and the fund that lands lowest and leftmost is
          simply the one that is both cheap to trade and true to its benchmark.
        </p>
      </section>

      {/* ── liquidity ─────────────────────────────────── */}
      <section id="liquidity">
        <h2>Panel four</h2>
        <h3>Liquidity</h3>

        <p>
          Can you actually get the size you want, and what will it cost you at
          the touch? Turnover across this cohort spans more than three orders of
          magnitude, from over <strong>$2bn a day</strong> in IBIT to under{' '}
          <strong>$1m</strong> in the smallest funds, so both axes are
          logarithmic.
        </p>

        <Formula
          tag="10"
          name="Average daily turnover"
          unit="US$ millions"
          code={`ADV = mean( close_t × volume_t  over 21 sessions ) / 1,000,000`}
          plain="How many dollars change hands in a typical day. The single best guide to whether you can get in and out without a fuss."
        />

        <p>
          The two axes lean against each other, which is the point: deep funds
          quote tight and thin funds quote wide. <strong>IBIT</strong> sits alone
          in the deep, tight corner; the rest of the cohort trails off toward
          thinner turnover and wider spreads. What is worth looking for is a fund
          sitting <em>off</em> that line &mdash; unusually wide for its turnover,
          or unusually tight.
        </p>
      </section>

      {/* ── exposure ─────────────────────────────────── */}
      <section id="exposure">
        <h2>Panel five</h2>
        <h3>Exposure</h3>

        <p>
          Every fund here promises the same thing &mdash; the price of bitcoin
          &mdash; so the useful question is not <em>how much</em> bitcoin you get
          but <strong>how faithfully</strong> you get it. Each fund is regressed
          against <code>BTC-USD</code>, and a spot trust should print a beta of{' '}
          <strong>1</strong>. This panel reads as <em>tracking quality</em>, not
          leverage.
        </p>

        <Formula
          tag="11"
          name="Beta to bitcoin"
          unit="ratio, 60-session"
          code={`BtcBeta_t = Cov(r, btc) / Var(btc)

           = Σ (r_j − r̄)(b_j − b̄)
             ──────────────────      over the last 60 sessions
                  Σ (b_j − b̄)²`}
          plain="How much the fund moves when bitcoin moves 1%. A spot trust should sit right at 1. Meaningfully below 1 is not less bitcoin — it is a measurement artefact of comparing a five-day fund with a seven-day, round-the-clock underlying."
        >
          This doubles as a validity check on the whole desk. The cohort clusters
          around <strong>0.94</strong> rather than exactly 1 &mdash; and the
          shortfall is <em>not</em> missing exposure. It is{' '}
          <strong>non-synchronous pricing</strong>: the fund&rsquo;s close is
          struck at 4 p.m. New York while <code>BTC-USD</code> keeps moving, so
          the two series are measured at different instants and the fitted beta
          is attenuated toward zero. The weekend gap pulls in the same direction.
          The funds hold their bitcoin; the clock is what prints below 1.
        </Formula>

        <p>
          The vertical axis is realised volatility, logarithmic, so you can read
          the risk you are taking to obtain that exposure. All ten funds carry
          essentially the same volatility &mdash; around <strong>42%</strong>{' '}
          annualised &mdash; because they all hold the same asset; a fund sitting
          off that band would be carrying risk that has nothing to do with
          bitcoin.
        </p>
      </section>

      {/* ── scale ─────────────────────────────────── */}
      <section id="scale">
        <h2>Scale</h2>
        <h3>Why there are no z-scores here</h3>

        <p>
          An earlier version of this desk standardised every axis &mdash; each
          value rewritten as standard deviations from the average. That works
          when the things being compared are alike in magnitude. It fails here.
        </p>

        <p>
          A z-score answers &ldquo;how unusual is this within the group?&rdquo;
          But this group contains an $80bn fund trading over $2bn a day and a
          fund trading under $1m a day. Standardising turnover would report that
          IBIT is &ldquo;three standard deviations liquid&rdquo; when what you
          actually want to know is that it trades <strong>two thousand times</strong>{' '}
          the size of the smallest fund on the desk.
        </p>

        <p>
          So every axis stays in the unit it was measured in &mdash; basis
          points, basis points per year, dollars, beta, percent &mdash; and where
          a span crosses orders of magnitude the axis goes logarithmic instead of
          the data being squashed. <strong>Every tick label on this desk is a
          real number you could quote.</strong>
        </p>
      </section>

      {/* ── caveats ─────────────────────────────────── */}
      <section id="caveats">
        <h2>Limitations</h2>
        <h3>What this does not do</h3>

        <ul>
          <li>
            <strong>Spreads are estimated, not quoted.</strong>{' '}
            Corwin&ndash;Schultz infers a spread from the daily high and low. It
            is known to read high on volatile instruments, and bitcoin is
            volatile, so the absolute spread levels here are likely overstated
            &mdash; though the ranking across funds still holds.
          </li>
          <li>
            <strong>Beta prints below 1 for a clock reason, not a holdings
            reason.</strong> The ETF closes at 4 p.m. New York; bitcoin trades on
            past it and through the weekend. Measuring the two at different
            instants attenuates the fitted beta, so read the exposure panel as
            tracking quality, not as a claim about how much bitcoin each fund
            holds.
          </li>
          <li>
            <strong>The weekend gap is baked in.</strong> A Monday fund return is
            scored against a Friday-to-Monday bitcoin move. This inflates the
            fair-value gap on Mondays and biases the convergence fit by about one
            session a week. It cannot be removed without intraday data.
          </li>
          <li>
            <strong>Cash-create cost is not captured.</strong> The funds launched
            creating in cash, not in kind, which inserts a leg the AP does not
            control and D₂ does not price. Panel one therefore understates
            arbitrage cost over the cash-create part of the window.
          </li>
          <li>
            <strong>Daily bars, not intraday.</strong> Everything here describes
            structure over months. None of it tells you when to send an order.
          </li>
          <li>
            <strong>The arbitrage panel has no basket and no NAV.</strong> A real
            desk prices the creation basket off executable quotes and compares it
            to the published NAV. Panel one proxies the holdings with a
            beta-scaled bitcoin path anchored on the fund&rsquo;s own price, so it
            measures dislocation relative to the last 21 sessions rather than a
            true premium to net asset value. It reads directionally, not to the
            basis point.
          </li>
          <li>
            <strong>Its cash legs are assumed.</strong> Commission, financing,
            the creation fee and bitcoin&rsquo;s market impact are desk constants,
            listed in panel one and set at the top of the build script.
          </li>
          <li>
            <strong>Convergence is fitted on daily closes.</strong> Create and
            redeem is an intraday trade and the half-life regression belongs on
            minute bars. Daily data can rank funds from fast to slow, which is
            what panel two is for; it cannot tell you that a gap closes in six
            hours rather than twelve.
          </li>
          <li>
            <strong>It is not advice.</strong> This is a data visualisation built
            from public prices.
          </li>
        </ul>
      </section>

      <div className="doc-foot">
        Universe is the US spot-bitcoin ETF cohort listed 11 January 2024 &mdash;
        ten of eleven, with Hashdex&rsquo;s DEFI pending a usable price series.
        All plotted figures are computed in{' '}
        <code>scripts/build_datasets.py</code> using the Python standard library
        only. Re-run it and the entire desk regenerates from scratch. Fund names
        and tickers are the property of their issuers; this desk is not
        affiliated with any of them.
      </div>
    </div>
  );
}
