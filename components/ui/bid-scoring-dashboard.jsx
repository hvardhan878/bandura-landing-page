"use client";
import { useState, useCallback, useMemo } from "react";
import {
  AreaChart, Area, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  ReferenceLine,
} from "recharts";

// ─── Colours (dark theme matching site) ─────────────────────────────────────
const C = {
  mint: "#0a0a0a",
  mintDark: "rgba(255,255,255,0.08)",
  green: "#00CD92",
  greenDeep: "#00CD92",
  greenLight: "rgba(0,205,146,0.12)",
  text: "#f0f0f0",
  textMid: "#9a9a9a",
  textLight: "#555555",
  white: "#111111",
  warn: "#f59e0b",
  warnLight: "rgba(245,158,11,0.12)",
  err: "#ef4444",
  errLight: "rgba(239,68,68,0.12)",
  border: "rgba(255,255,255,0.08)",
};

// ─── Monte Carlo Engine ──────────────────────────────────────────────────────
function sampleNormal(mean, std) {
  const u = Math.max(1e-10, Math.random());
  const v = Math.random();
  return mean + std * Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}
function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
function confToStd(conf, range) { return ((100 - conf) / 100) * (range / 2.5); }

// Accumulator — avoids storing millions of objects
function makeAccumulator(numCompetitors) {
  return {
    n: 0,
    wins: 0,
    scoreSum: 0,
    scoreMin: Infinity,
    scoreMax: -Infinity,
    // Store scores in a flat Float32Array pre-allocated to 1M
    scores: new Float32Array(1_000_000),
    compSums: new Float32Array(numCompetitors),
  };
}

// Pre-compute price constants outside the loop
function runBatchIntoAcc(acc, criteria, competitors, qualityWeight, priceWeight, yourPrice, N) {
  const qw = qualityWeight / 100, pw = priceWeight / 100;
  const allPrices = [yourPrice, ...competitors.map(c => c.price)];
  let minP = allPrices[0];
  for (let k = 1; k < allPrices.length; k++) if (allPrices[k] < minP) minP = allPrices[k];
  const yourPriceScore = (minP / yourPrice) * 100;
  const compPriceScores = competitors.map(c => (minP / c.price) * 100);

  for (let i = 0; i < N; i++) {
    // Sample weights
    let weightSum = 0;
    const sw = criteria.map(c => {
      const w = clamp(sampleNormal(c.weight, confToStd(c.weightConfidence, 100)), 0.5, 100);
      weightSum += w;
      return w;
    });

    // Your quality score
    let yourQuality = 0;
    for (let j = 0; j < criteria.length; j++) {
      const c = criteria[j];
      const score = clamp(sampleNormal(c.score, confToStd(c.scoreConfidence, 10)), 0, 10);
      yourQuality += (score / 10) * 100 * (sw[j] / weightSum);
    }

    const yourTotal = yourQuality * qw + yourPriceScore * pw;

    // Competitor totals
    let winning = true;
    for (let ci = 0; ci < competitors.length; ci++) {
      const comp = competitors[ci];
      let compQ = 0;
      for (let j = 0; j < criteria.length; j++) {
        const cs = comp.scores[criteria[j].id] || { score: 5, confidence: 50 };
        const score = clamp(sampleNormal(cs.score, confToStd(cs.confidence, 10)), 0, 10);
        compQ += (score / 10) * 100 * (sw[j] / weightSum);
      }
      const compTotal = compQ * qw + compPriceScores[ci] * pw;
      acc.compSums[ci] += compTotal;
      if (compTotal >= yourTotal) winning = false;
    }

    acc.scores[acc.n] = yourTotal;
    acc.scoreSum += yourTotal;
    if (yourTotal < acc.scoreMin) acc.scoreMin = yourTotal;
    if (yourTotal > acc.scoreMax) acc.scoreMax = yourTotal;
    if (winning) acc.wins++;
    acc.n++;
  }
}

function buildHistogramFromAcc(acc, bins = 55) {
  const { scores, n, scoreMin, scoreMax } = acc;
  const size = (scoreMax - scoreMin) / bins;
  const counts = new Array(bins).fill(0);
  for (let i = 0; i < n; i++) {
    const idx = Math.min(Math.floor((scores[i] - scoreMin) / size), bins - 1);
    counts[idx]++;
  }
  return counts.map((count, i) => ({ score: +(scoreMin + i * size + size / 2).toFixed(1), count }));
}

function percentilesFromAcc(acc) {
  // Sample 100k for percentile calc to avoid sorting 1M items
  const sample = [];
  const step = Math.max(1, Math.floor(acc.n / 100_000));
  for (let i = 0; i < acc.n; i += step) sample.push(acc.scores[i]);
  sample.sort((a, b) => a - b);
  const n = sample.length;
  return {
    p10: +sample[Math.floor(n * 0.1)].toFixed(1),
    p50: +sample[Math.floor(n * 0.5)].toFixed(1),
    p90: +sample[Math.floor(n * 0.9)].toFixed(1),
  };
}

// Lightweight win-rate only sim for price sensitivity
function winRateOnly(criteria, competitors, qualityWeight, priceWeight, yourPrice, N) {
  const qw = qualityWeight / 100, pw = priceWeight / 100;
  const allPrices = [yourPrice, ...competitors.map(c => c.price)];
  let minP = allPrices[0];
  for (let k = 1; k < allPrices.length; k++) if (allPrices[k] < minP) minP = allPrices[k];
  const yourPriceScore = (minP / yourPrice) * 100;
  const compPriceScores = competitors.map(c => (minP / c.price) * 100);
  let wins = 0;
  for (let i = 0; i < N; i++) {
    let weightSum = 0;
    const sw = criteria.map(c => {
      const w = clamp(sampleNormal(c.weight, confToStd(c.weightConfidence, 100)), 0.5, 100);
      weightSum += w;
      return w;
    });
    let yourQuality = 0;
    for (let j = 0; j < criteria.length; j++) {
      const score = clamp(sampleNormal(criteria[j].score, confToStd(criteria[j].scoreConfidence, 10)), 0, 10);
      yourQuality += (score / 10) * 100 * (sw[j] / weightSum);
    }
    const yourTotal = yourQuality * qw + yourPriceScore * pw;
    let winning = true;
    for (let ci = 0; ci < competitors.length; ci++) {
      const comp = competitors[ci];
      let compQ = 0;
      for (let j = 0; j < criteria.length; j++) {
        const cs = comp.scores[criteria[j].id] || { score: 5, confidence: 50 };
        compQ += (clamp(sampleNormal(cs.score, confToStd(cs.confidence, 10)), 0, 10) / 10) * 100 * (sw[j] / weightSum);
      }
      if (compQ * qw + compPriceScores[ci] * pw >= yourTotal) { winning = false; break; }
    }
    if (winning) wins++;
  }
  return wins / N * 100;
}

// ─── System-generated data ───────────────────────────────────────────────────
const SYSTEM_CRITERIA = [
  {
    id: "c1", name: "Technical Approach", weight: 30, weightConfidence: 80,
    score: 7.5, scoreConfidence: 72,
    insights: [
      { type: "strength", source: "Tender document", date: "12 Jan 2025", text: "Specification explicitly references cloud-native architecture — matches our delivery model precisely." },
      { type: "strength", source: "Incumbent contract", date: "08 Jan 2025", text: "Incumbent's last delivery used on-premise infrastructure. Switching cost narrative plays in our favour." },
      { type: "risk", source: "LinkedIn", date: "03 Jan 2025", text: "Buyer CTO posted about 'pragmatic modernisation' — may penalise fully cloud-native approach if seen as too aggressive." },
      { type: "intel", source: "Prior award notice", date: "15 Dec 2024", text: "Last comparable contract scored Technical Approach at 32% — slightly above stated 30%. Watch for reweighting." },
    ]
  },
  {
    id: "c2", name: "Team & Experience", weight: 25, weightConfidence: 75,
    score: 8.2, scoreConfidence: 85,
    insights: [
      { type: "strength", source: "Internal assessment", date: "10 Jan 2025", text: "Proposed lead has 7 years direct sector experience. Two named PMs have delivered analogous NHS programmes." },
      { type: "strength", source: "Case study", date: "09 Jan 2025", text: "DVLA engagement directly mirrors scope. Clear like-for-like reference available." },
      { type: "intel", source: "G-Cloud data", date: "05 Jan 2025", text: "Competitor A lists only 2 sector-relevant case studies vs our 5. Their profile CVs are 2 years stale." },
    ]
  },
  {
    id: "c3", name: "Delivery Methodology", weight: 20, weightConfidence: 60,
    score: 7.0, scoreConfidence: 58,
    insights: [
      { type: "risk", source: "Tender clarification", date: "14 Jan 2025", text: "Buyer asked a clarification about Agile governance — signals they've been burned before. Our response needs to address oversight explicitly." },
      { type: "intel", source: "Framework history", date: "11 Jan 2025", text: "Low confidence: buyer has not published methodology scoring breakdown on prior awards. Weight is an estimate." },
      { type: "strength", source: "Internal", date: "06 Jan 2025", text: "We have a formalised Agile-at-scale playbook which competitors on this framework typically lack." },
    ]
  },
  {
    id: "c4", name: "Social Value", weight: 15, weightConfidence: 50,
    score: 6.0, scoreConfidence: 52,
    insights: [
      { type: "risk", source: "Procurement policy", date: "13 Jan 2025", text: "PPN 06/21 compliance required. Our standard social value commitments score ~6/10 against typical evaluation rubrics." },
      { type: "intel", source: "Similar awards", date: "07 Jan 2025", text: "Very low confidence on weighting — seen anywhere from 10% to 20% across similar DPS lots. Modelled at 15%." },
      { type: "risk", source: "Competitor intel", date: "02 Jan 2025", text: "Competitor B recently hired a dedicated Social Value lead — likely to score strongly here." },
    ]
  },
  {
    id: "c5", name: "Case Studies", weight: 10, weightConfidence: 90,
    score: 8.5, scoreConfidence: 82,
    insights: [
      { type: "strength", source: "Internal review", date: "11 Jan 2025", text: "Three case studies directly analogous to this scope. Outcomes are quantified (time, cost, quality metrics)." },
      { type: "strength", source: "Prior feedback", date: "09 Jan 2025", text: "Evaluators on the G-Cloud framework previously noted our evidence as 'exemplary' in written feedback." },
      { type: "intel", source: "Tender", date: "04 Jan 2025", text: "Weighting confirmed in the ITT at 10% — high confidence this won't move." },
    ]
  },
];

const SYSTEM_COMPETITORS = [
  { id: "comp1", name: "Competitor A", price: 920000, scores: { c1: { score: 7.2, confidence: 55 }, c2: { score: 7.8, confidence: 62 }, c3: { score: 7.5, confidence: 48 }, c4: { score: 6.8, confidence: 40 }, c5: { score: 6.5, confidence: 52 } } },
  { id: "comp2", name: "Competitor B", price: 1050000, scores: { c1: { score: 6.5, confidence: 45 }, c2: { score: 7.0, confidence: 55 }, c3: { score: 8.0, confidence: 50 }, c4: { score: 8.0, confidence: 58 }, c5: { score: 6.0, confidence: 44 } } },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────
const confColor = v => v >= 75 ? C.green : v >= 50 ? C.warn : C.err;
const confBg = v => v >= 75 ? C.greenLight : v >= 50 ? C.warnLight : C.errLight;
const confLabel = v => v >= 75 ? "High confidence" : v >= 50 ? "Medium confidence" : "Low confidence";
const insightColor = t => t === "strength" ? C.green : t === "risk" ? C.err : C.textMid;
const insightBg = t => t === "strength" ? C.greenLight : t === "risk" ? C.errLight : "rgba(255,255,255,0.05)";
const insightLabel = t => t === "strength" ? "Strength" : t === "risk" ? "Risk" : "Intel";

function ConfBadge({ value }) {
  return (
    <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 9px", borderRadius: 999, background: confBg(value), color: confColor(value), whiteSpace: "nowrap" }}>
      {confLabel(value)} · {value}%
    </span>
  );
}

function MiniDist({ score, confidence, id }) {
  const pts = useMemo(() => {
    const std = Math.max(confToStd(confidence, 10), 0.01);
    return Array.from({ length: 60 }, (_, i) => {
      const x = i * (10 / 59);
      const z = (x - score) / std;
      return { x: +x.toFixed(2), y: Math.exp(-0.5 * z * z) };
    });
  }, [score, confidence]);
  return (
    <ResponsiveContainer width="100%" height={32}>
      <AreaChart data={pts} margin={{ top: 2, right: 0, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id={`g${id}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={C.green} stopOpacity={0.35} />
            <stop offset="95%" stopColor={C.green} stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <Area type="monotone" dataKey="y" stroke={C.green} strokeWidth={1.5} fill={`url(#g${id})`} dot={false} />
        <ReferenceLine x={score} stroke={C.greenDeep} strokeWidth={1.5} strokeDasharray="3 2" />
      </AreaChart>
    </ResponsiveContainer>
  );
}

function InsightDrawer({ criterion, onClose }) {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 200, display: "flex" }}>
      <div onClick={onClose} style={{ flex: 1, background: "rgba(17,17,17,0.4)" }} />
      <div style={{ width: 500, background: "#161616", display: "flex", flexDirection: "column", borderLeft: `1px solid ${C.border}`, overflowY: "auto" }}>
        {/* Header */}
        <div style={{ padding: "28px 28px 20px", borderBottom: `1px solid ${C.border}` }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, color: C.green, letterSpacing: 1, textTransform: "uppercase", marginBottom: 5 }}>Criterion intelligence</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: C.text }}>{criterion.name}</div>
            </div>
            <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 22, color: C.textLight, cursor: "pointer", padding: 4 }}>×</button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div style={{ background: C.greenLight, borderRadius: 10, padding: "14px 16px" }}>
              <div style={{ fontSize: 10, fontWeight: 600, color: C.green, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 4 }}>Our score</div>
              <div style={{ fontSize: 28, fontWeight: 700, color: C.green, lineHeight: 1 }}>{criterion.score}<span style={{ fontSize: 13, fontWeight: 400, color: C.textMid }}>/10</span></div>
              <div style={{ marginTop: 8 }}><ConfBadge value={criterion.scoreConfidence} /></div>
            </div>
            <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: 10, padding: "14px 16px" }}>
              <div style={{ fontSize: 10, fontWeight: 600, color: C.textMid, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 4 }}>Weight in scoring</div>
              <div style={{ fontSize: 28, fontWeight: 700, color: C.text, lineHeight: 1 }}>{criterion.weight}<span style={{ fontSize: 13, fontWeight: 400, color: C.textMid }}>%</span></div>
              <div style={{ marginTop: 8 }}><ConfBadge value={criterion.weightConfidence} /></div>
            </div>
          </div>
        </div>

        {/* Uncertainty explainer */}
        <div style={{ padding: "20px 28px", borderBottom: `1px solid ${C.border}`, background: "#0d0d0d" }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: C.textMid, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 10 }}>How this feeds the simulation</div>
          <div style={{ fontSize: 13, color: C.textMid, lineHeight: 1.65, marginBottom: 12 }}>
            We believe this criterion scores <strong style={{ color: C.text }}>{criterion.score}/10</strong>, but with only{" "}
            <strong style={{ color: confColor(criterion.scoreConfidence) }}>{criterion.scoreConfidence}% confidence</strong>.
            In every simulation run, this score is drawn from the distribution below — centred on {criterion.score}, but with
            a spread that widens the less confident we are.{" "}
            {criterion.scoreConfidence < 60 && <span style={{ color: C.err }}>This criterion is one of your biggest sources of uncertainty.</span>}
          </div>
          <MiniDist score={criterion.score} confidence={criterion.scoreConfidence} id={criterion.id} />
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: C.textLight, marginTop: 4 }}>
            <span>0</span>
            <span style={{ color: C.greenDeep, fontWeight: 600 }}>↑ most likely: {criterion.score}</span>
            <span>10</span>
          </div>
        </div>

        {/* Insights */}
        <div style={{ padding: "20px 28px" }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: C.textMid, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 14 }}>
            {criterion.insights.length} intelligence signals
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {criterion.insights.map((ins, i) => (
              <div key={i} style={{ borderRadius: 10, padding: "13px 15px", background: insightBg(ins.type), borderLeft: `3px solid ${insightColor(ins.type)}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <span style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.8, color: insightColor(ins.type) }}>{insightLabel(ins.type)}</span>
                  <div style={{ fontSize: 10, color: C.textLight }}>{ins.source} · {ins.date}</div>
                </div>
                <div style={{ fontSize: 13, color: C.text, lineHeight: 1.55 }}>{ins.text}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function BidScoringDashboard() {
  const [tab, setTab] = useState("matrix");
  const [selected, setSelected] = useState(null);
  const qualityWeight = 70;
  const yourPrice = 980_000;
  const [simResults, setSimResults] = useState(null);
  const [priceSimData, setPriceSimData] = useState(null);
  const [progress, setProgress] = useState(0);
  const [running, setRunning] = useState(false);
  const priceWeight = 100 - qualityWeight;
  const criteria = SYSTEM_CRITERIA;
  const competitors = SYSTEM_COMPETITORS;
  const lowConf = criteria.filter(c => c.scoreConfidence < 60 || c.weightConfidence < 60);

  const runSim = useCallback(() => {
    setRunning(true);
    setProgress(0);
    setSimResults(null);
    setPriceSimData(null);
    const TOTAL = 1_000_000, BATCH = 50_000, batches = TOTAL / BATCH;
    const acc = makeAccumulator(competitors.length);
    let b = 0;
    function next() {
      runBatchIntoAcc(acc, criteria, competitors, qualityWeight, priceWeight, yourPrice, BATCH);
      b++;
      setProgress(Math.round((b / batches) * 100));
      if (b < batches) { setTimeout(next, 0); return; }
      const { p10, p50, p90 } = percentilesFromAcc(acc);
      const histogram = buildHistogramFromAcc(acc);
      const compAvgs = Array.from(acc.compSums).map(s => +(s / acc.n).toFixed(1));
      setSimResults({
        winRate: +(acc.wins / acc.n * 100).toFixed(1),
        avgScore: +(acc.scoreSum / acc.n).toFixed(1),
        p10, p50, p90, histogram, compAvgs, n: acc.n,
      });
      const pts = [];
      const step = (1_200_000 - 750_000) / 14;
      for (let i = 0; i <= 14; i++) {
        const p = Math.round(750_000 + i * step);
        pts.push({ price: p, winPct: +winRateOnly(criteria, competitors, qualityWeight, priceWeight, p, 20_000).toFixed(1), pricek: `£${Math.round(p / 1000)}k` });
      }
      setPriceSimData(pts);
      setRunning(false);
      setProgress(100);
      setTab("results");
    }
    setTimeout(next, 0);
  }, [criteria, competitors, qualityWeight, priceWeight, yourPrice]);

  const { histogram, winRate, avgScore, p10, p50, p90 } = useMemo(() => {
    if (!simResults) return {};
    return {
      histogram: simResults.histogram,
      winRate: simResults.winRate,
      avgScore: simResults.avgScore,
      p10: simResults.p10,
      p50: simResults.p50,
      p90: simResults.p90,
    };
  }, [simResults]);

  const winColor = simResults ? (winRate > 60 ? C.green : winRate > 40 ? C.warn : C.err) : C.textLight;
  const totalW = criteria.reduce((s, c) => s + c.weight, 0);

  const TAB = (key, label) => (
    <button key={key} onClick={() => setTab(key)} style={{
      padding: "14px 22px", fontSize: 13, fontWeight: 500, border: "none", background: "none",
      cursor: "pointer", color: tab === key ? C.text : C.textMid,
      borderBottom: tab === key ? `2px solid ${C.green}` : "2px solid transparent",
      transition: "all 0.15s",
    }}>{label}</button>
  );

  return (
    <div style={{ background: C.mint, fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif", color: C.text }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        input[type=range] { appearance: none; height: 3px; border-radius: 2px; outline: none; cursor: pointer; }
        input[type=range]::-webkit-slider-thumb { appearance: none; width: 14px; height: 14px; border-radius: 50%; background: ${C.green}; cursor: pointer; border: 2px solid #111; box-shadow: 0 1px 4px rgba(0,0,0,0.5); }
        ::-webkit-scrollbar { width: 5px; } ::-webkit-scrollbar-thumb { background: #333; border-radius: 3px; }
      `}</style>

      {/* Tabs */}
      <div style={{ background: "#111111", borderBottom: `1px solid ${C.border}` }}>
        <div style={{ display: "flex", padding: "0 32px" }}>
          {TAB("matrix", "Capabilities matrix")}
          {TAB("competitors", "Competitor intelligence")}
          {TAB("results", "Scoring simulation")}
        </div>
      </div>

      <div style={{ padding: "28px 32px", maxWidth: 1280, margin: "0 auto" }}>

        {/* ── MATRIX ── */}
        {tab === "matrix" && (
          <div>
            {/* Why we simulate banner */}
            <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 12, padding: "20px 24px", marginBottom: 24, display: "flex", gap: 24, alignItems: "flex-start" }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: C.green, letterSpacing: 1, textTransform: "uppercase", marginBottom: 6 }}>Why we run a million simulations</div>
                <div style={{ fontSize: 13, color: C.textMid, lineHeight: 1.7 }}>
                  Every score below is an estimate built from intelligence signals — not a fact. We accept we might be wrong.
                  So instead of one answer, we run <strong style={{ color: C.text }}>1,000,000 versions</strong> of this bid.
                  Each run varies every score and every weight by how confident we are.{" "}
                  <strong style={{ color: C.text }}>Lower confidence = wider variation</strong> = more spread in your outcome distribution.
                  The result is a realistic range of win probabilities, not a false single number.
                </div>
                {lowConf.length > 0 && (
                  <div style={{ marginTop: 12, padding: "10px 14px", background: C.warnLight, borderRadius: 8, fontSize: 12, color: C.warn }}>
                    <strong>{lowConf.length} criterion{lowConf.length > 1 ? "a" : ""} have low confidence</strong>: {lowConf.map(c => c.name).join(", ")}.
                    These are driving the most variance in your score distribution — your biggest intel gaps.
                  </div>
                )}
              </div>
              {/* Live confidence bars */}
              <div style={{ minWidth: 180, display: "flex", flexDirection: "column", gap: 7, paddingTop: 2 }}>
                <div style={{ fontSize: 10, fontWeight: 600, color: C.textMid, letterSpacing: 0.8, textTransform: "uppercase", marginBottom: 4 }}>Score confidence</div>
                {criteria.map(c => (
                  <div key={c.id} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ fontSize: 11, color: C.textMid, width: 90, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.name.split(" ")[0]}</div>
                    <div style={{ flex: 1, height: 4, borderRadius: 2, background: C.mintDark }}>
                      <div style={{ width: `${c.scoreConfidence}%`, height: "100%", background: confColor(c.scoreConfidence), borderRadius: 2 }} />
                    </div>
                    <div style={{ fontSize: 10, color: confColor(c.scoreConfidence), fontWeight: 600, width: 30, textAlign: "right" }}>{c.scoreConfidence}%</div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 20, alignItems: "start" }}>
              {/* Table */}
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, color: C.textMid, textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>
                  Evaluation criteria · click a row to view intelligence signals
                </div>
                <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 12, overflow: "hidden" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr style={{ background: "#161616", borderBottom: `1px solid ${C.border}` }}>
                        {["Criterion", "Our score", "Score confidence", "Weight", "Weight confidence", "Score range"].map(h => (
                          <th key={h} style={{ padding: "10px 16px", fontSize: 11, fontWeight: 600, color: C.textMid, textAlign: "left" }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {criteria.map((c, i) => (
                        <tr key={c.id} onClick={() => setSelected(c)}
                          style={{ borderBottom: i < criteria.length - 1 ? `1px solid ${C.border}` : "none", cursor: "pointer" }}
                          onMouseEnter={e => e.currentTarget.style.background = "rgba(0,205,146,0.07)"}
                          onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                          <td style={{ padding: "14px 16px" }}>
                            <div style={{ fontWeight: 600, fontSize: 13, color: C.text }}>{c.name}</div>
                            <div style={{ fontSize: 11, color: C.textLight, marginTop: 2 }}>{c.insights.length} signals →</div>
                          </td>
                          <td style={{ padding: "14px 16px" }}>
                            <span style={{ fontSize: 22, fontWeight: 700, color: c.score >= 7.5 ? C.greenDeep : c.score >= 5 ? C.warn : C.err }}>{c.score}</span>
                            <span style={{ fontSize: 12, color: C.textLight }}>/10</span>
                          </td>
                          <td style={{ padding: "14px 16px" }}><ConfBadge value={c.scoreConfidence} /></td>
                          <td style={{ padding: "14px 16px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                              <div style={{ width: 36, height: 4, borderRadius: 2, background: C.mintDark }}>
                                <div style={{ width: `${c.weight}%`, height: "100%", background: C.green, borderRadius: 2 }} />
                              </div>
                              <span style={{ fontSize: 14, fontWeight: 700 }}>{c.weight}%</span>
                            </div>
                          </td>
                          <td style={{ padding: "14px 16px" }}><ConfBadge value={c.weightConfidence} /></td>
                          <td style={{ padding: "10px 16px", minWidth: 150 }}>
                            <MiniDist score={c.score} confidence={c.scoreConfidence} id={c.id} />
                            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, color: C.textLight, marginTop: 2 }}>
                              <span>0</span><span style={{ color: C.greenDeep }}>↑ {c.score}</span><span>10</span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div style={{ padding: "9px 16px", background: "#161616", borderTop: `1px solid ${C.border}`, fontSize: 12, color: totalW !== 100 ? C.err : C.green, fontWeight: 600 }}>
                    {totalW !== 100 ? `⚠ Weights sum to ${totalW}% — should total 100%` : `✓ Weights sum to 100%`}
                  </div>
                </div>
              </div>

              {/* Scoring model + run */}
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: C.textMid, textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>Scoring model</div>
                  <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20, display: "flex", flexDirection: "column", gap: 0 }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                      {[
                        { label: "Quality / price split", value: `${qualityWeight} / ${priceWeight}` },
                        { label: "Your bid price", value: `£${(yourPrice / 1000).toFixed(0)}k` },
                      ].map((row, i, arr) => (
                        <div key={row.label} style={{
                          display: "flex", justifyContent: "space-between", alignItems: "center",
                          padding: "13px 0",
                          borderBottom: i < arr.length - 1 ? `1px solid ${C.border}` : "none",
                        }}>
                          <span style={{ fontSize: 13, color: C.textMid }}>{row.label}</span>
                          <span style={{ fontSize: 14, fontWeight: 700, color: C.text }}>{row.value}</span>
                        </div>
                      ))}
                    </div>
                    <div style={{ marginTop: 14, padding: "8px 12px", background: "rgba(255,255,255,0.05)", borderRadius: 6, fontSize: 11, color: C.textMid }}>
                      Set by Bandura from tender documentation
                    </div>
                  </div>
                </div>

                <button onClick={runSim} disabled={running} style={{
                  background: running ? "#333" : C.green, color: "#000", border: "none",
                  borderRadius: 999, padding: "13px 20px", fontSize: 13, fontWeight: 700, cursor: running ? "not-allowed" : "pointer",
                  boxShadow: running ? "none" : "0 2px 14px rgba(0,205,146,0.3)", transition: "all 0.2s",
                }}>
                  {running ? `Simulating… ${progress}%` : "Run 1M simulations →"}
                </button>

                {running && (
                  <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 8, padding: "12px 14px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: C.textMid, marginBottom: 6 }}>
                      <span>Running scenarios</span><span>{(progress * 10000).toLocaleString()} / 1,000,000</span>
                    </div>
                    <div style={{ height: 4, borderRadius: 2, background: C.mintDark }}>
                      <div style={{ width: `${progress}%`, height: "100%", background: C.green, borderRadius: 2, transition: "width 0.3s" }} />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── COMPETITORS ── */}
        {tab === "competitors" && (
          <div>
            <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 12, padding: "16px 22px", marginBottom: 20, fontSize: 13, color: C.textMid, lineHeight: 1.65 }}>
              Competitor scores are system-estimated from intel signals. <strong style={{ color: C.text }}>Confidence reflects the quality of that intel</strong> — low confidence means their score has high variance in the simulation, creating additional uncertainty in your outcome.
            </div>
            {competitors.map((comp, ci) => (
              <div key={comp.id} style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 12, marginBottom: 16, overflow: "hidden" }}>
                <div style={{ padding: "14px 20px", borderBottom: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 4, height: 24, background: ci === 0 ? C.warn : C.err, borderRadius: 2 }} />
                    <span style={{ fontSize: 15, fontWeight: 700 }}>{comp.name}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 12, color: C.textMid }}>Estimated price</span>
                    <span style={{ fontSize: 16, fontWeight: 700 }}>£{(comp.price / 1000).toFixed(0)}k</span>
                    <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 10px", borderRadius: 999, background: yourPrice < comp.price ? C.greenLight : C.errLight, color: yourPrice < comp.price ? C.greenDeep : C.err }}>
                      {yourPrice < comp.price ? `You £${((comp.price - yourPrice) / 1000).toFixed(0)}k cheaper` : `You £${((yourPrice - comp.price) / 1000).toFixed(0)}k more expensive`}
                    </span>
                  </div>
                </div>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ background: "#161616", borderBottom: `1px solid ${C.border}` }}>
                      {["Criterion", "Our score", "Their estimated score", "Intel confidence", "Gap"].map(h => (
                        <th key={h} style={{ padding: "8px 16px", fontSize: 11, fontWeight: 600, color: C.textMid, textAlign: "left" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {criteria.map((c, idx) => {
                      const cs = comp.scores[c.id] || { score: 5, confidence: 50 };
                      const diff = c.score - cs.score;
                      return (
                        <tr key={c.id} style={{ borderBottom: idx < criteria.length - 1 ? `1px solid ${C.border}` : "none" }}>
                          <td style={{ padding: "12px 16px", fontSize: 13, fontWeight: 500 }}>{c.name}</td>
                          <td style={{ padding: "12px 16px", fontSize: 14, fontWeight: 700, color: C.greenDeep }}>{c.score}</td>
                          <td style={{ padding: "12px 16px", fontSize: 14, fontWeight: 700, color: C.textMid }}>{cs.score}</td>
                          <td style={{ padding: "12px 16px" }}><ConfBadge value={cs.confidence} /></td>
                          <td style={{ padding: "12px 16px" }}>
                            <span style={{ fontSize: 12, fontWeight: 700, padding: "3px 10px", borderRadius: 999, background: diff > 0.5 ? C.greenLight : diff < -0.5 ? C.errLight : "rgba(255,255,255,0.06)", color: diff > 0.5 ? C.green : diff < -0.5 ? C.err : C.textMid }}>
                              {diff > 0 ? `+${diff.toFixed(1)}` : diff.toFixed(1)} us
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        )}

        {/* ── RESULTS ── */}
        {tab === "results" && (
          <div>
            {!simResults ? (
              <div style={{ textAlign: "center", padding: "80px 0" }}>
                <div style={{ fontSize: 18, fontWeight: 700, color: C.textMid, marginBottom: 8 }}>No simulation run yet</div>
                <div style={{ fontSize: 13, color: C.textLight, marginBottom: 24 }}>Go to the capabilities matrix and run a simulation first.</div>
                <button onClick={() => setTab("matrix")} style={{ background: C.green, color: "#000", border: "none", borderRadius: 999, padding: "12px 24px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
                  Go to capabilities matrix →
                </button>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

                {/* How to read */}
                <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 12, padding: "18px 24px" }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: C.green, letterSpacing: 1, textTransform: "uppercase", marginBottom: 6 }}>How to read this</div>
                  <div style={{ fontSize: 13, color: C.textMid, lineHeight: 1.7 }}>
                    Each bar in the distribution is one version of this bid — a world where scores and weights landed slightly differently.
                    The <strong style={{ color: C.text }}>width of the curve</strong> is your uncertainty: wide and flat means your intel has gaps.
                    Tall and narrow means high confidence. <strong style={{ color: C.text }}>Win probability</strong> is the share of all 1M scenarios where you came first.
                    The P10/P50/P90 lines show the range of outcomes you should plan for.
                  </div>
                </div>

                {/* KPIs */}
                <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr", gap: 12 }}>
                  <div style={{ background: C.white, border: `2px solid ${winColor}`, borderRadius: 12, padding: "22px 24px" }}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: C.textMid, textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>Win probability</div>
                    <div style={{ fontSize: 52, fontWeight: 800, color: winColor, letterSpacing: -2, lineHeight: 1 }}>{winRate}%</div>
                    <div style={{ fontSize: 12, color: C.textLight, marginTop: 8 }}>at £{(yourPrice / 1000).toFixed(0)}k · 1,000,000 scenarios</div>
                  </div>
                  {[
                    { label: "Expected score", val: avgScore, note: "mean across all scenarios" },
                    { label: "Pessimistic P10", val: p10, note: "1-in-10 lands here or lower", color: C.err },
                    { label: "Median P50", val: p50, note: "most likely single outcome", color: C.warn },
                    { label: "Optimistic P90", val: p90, note: "1-in-10 lands here or higher", color: C.green },
                  ].map(x => (
                    <div key={x.label} style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 12, padding: "18px 18px" }}>
                      <div style={{ fontSize: 11, fontWeight: 600, color: C.textMid, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 8 }}>{x.label}</div>
                      <div style={{ fontSize: 30, fontWeight: 800, color: x.color || C.text, letterSpacing: -1 }}>{x.val}</div>
                      <div style={{ fontSize: 11, color: C.textLight, marginTop: 6 }}>{x.note}</div>
                    </div>
                  ))}
                </div>

                {/* Distribution */}
                <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 12, padding: "20px 24px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: C.text }}>Score distribution · 1,000,000 simulated outcomes</div>
                      <div style={{ fontSize: 12, color: C.textMid, marginTop: 3 }}>Width = uncertainty. Narrow it by improving intel confidence on low-signal criteria.</div>
                    </div>
                    <div style={{ display: "flex", gap: 16, fontSize: 11, color: C.textMid }}>
                      <span style={{ display: "flex", alignItems: "center", gap: 5 }}><div style={{ width: 16, height: 2, background: C.err }} /> P10</span>
                      <span style={{ display: "flex", alignItems: "center", gap: 5 }}><div style={{ width: 16, height: 2, background: C.warn }} /> P50</span>
                      <span style={{ display: "flex", alignItems: "center", gap: 5 }}><div style={{ width: 16, height: 2, background: C.green }} /> P90</span>
                    </div>
                  </div>
                  <ResponsiveContainer width="100%" height={230}>
                    <AreaChart data={histogram} margin={{ top: 5, right: 10, left: -15, bottom: 0 }}>
                      <defs>
                        <linearGradient id="dg" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={C.green} stopOpacity={0.25} />
                          <stop offset="95%" stopColor={C.green} stopOpacity={0.02} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke={C.mintDark} />
                      <XAxis dataKey="score" tick={{ fill: C.textLight, fontSize: 10 }} />
                      <YAxis tick={{ fill: C.textLight, fontSize: 10 }} />
                      <Tooltip contentStyle={{ background: "#1a1a1a", border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 12, color: C.text }} formatter={v => [v.toLocaleString(), "scenarios"]} labelFormatter={v => `Score: ${v}`} />
                      <ReferenceLine x={p10} stroke={C.err} strokeWidth={1.5} strokeDasharray="4 2" />
                      <ReferenceLine x={p50} stroke={C.warn} strokeWidth={1.5} strokeDasharray="4 2" />
                      <ReferenceLine x={p90} stroke={C.green} strokeWidth={1.5} strokeDasharray="4 2" />
                      <Area type="monotone" dataKey="count" stroke={C.green} strokeWidth={2} fill="url(#dg)" dot={false} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                {/* Price sensitivity */}
                {priceSimData && (
                  <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 12, padding: "20px 24px" }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: C.text, marginBottom: 4 }}>Win probability by price point</div>
                    <div style={{ fontSize: 12, color: C.textMid, marginBottom: 16 }}>Each point = 30,000 simulations. Where would you cross the 50% threshold?</div>
                    <ResponsiveContainer width="100%" height={210}>
                      <LineChart data={priceSimData} margin={{ top: 5, right: 20, left: -15, bottom: 24 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke={C.mintDark} />
                        <XAxis dataKey="pricek" tick={{ fill: C.textLight, fontSize: 10 }} angle={-25} textAnchor="end" height={40} />
                        <YAxis tick={{ fill: C.textLight, fontSize: 10 }} domain={[0, 100]} unit="%" />
                        <Tooltip contentStyle={{ background: "#1a1a1a", border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 12, color: C.text }} formatter={v => [`${v}%`, "Win probability"]} />
                        <ReferenceLine y={50} stroke={C.textLight} strokeDasharray="3 3" label={{ value: "50%", fill: C.textLight, fontSize: 10, position: "insideLeft" }} />
                        <ReferenceLine x={`£${Math.round(yourPrice / 1000)}k`} stroke={C.green} strokeWidth={1.5} strokeDasharray="4 2" label={{ value: "Your price", fill: C.greenDeep, fontSize: 10 }} />
                        <Line type="monotone" dataKey="winPct" stroke={C.green} strokeWidth={2.5} dot={{ fill: C.green, r: 3, strokeWidth: 0 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                )}

                {/* Competitor comparison */}
                <div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: C.textMid, textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 }}>Expected score comparison · mean across 1M simulations</div>
                  <div style={{ display: "grid", gridTemplateColumns: `repeat(${competitors.length + 1}, 1fr)`, gap: 12 }}>
                    {[{ name: "You", price: yourPrice, isYou: true }, ...competitors.map(c => ({ ...c, isYou: false }))].map((e, i) => {
                      const avg = i === 0 ? simResults.avgScore : simResults.compAvgs[i - 1];
                      const allP = [yourPrice, ...competitors.map(c => c.price)];
                      const minP = allP.reduce((a, b) => Math.min(a, b), Infinity);
                      return (
                        <div key={e.name || e.id} style={{ background: C.white, border: `1px solid ${e.isYou ? C.green : C.border}`, borderRadius: 12, padding: "18px 20px" }}>
                          <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.8, color: e.isYou ? C.green : C.textMid, marginBottom: 10 }}>{e.name}</div>
                          <div style={{ fontSize: 34, fontWeight: 800, color: e.isYou ? C.greenDeep : C.text, letterSpacing: -1 }}>{avg}</div>
                          <div style={{ fontSize: 11, color: C.textLight, marginTop: 6, marginBottom: 10 }}>avg total score</div>
                          <div style={{ height: 1, background: C.border, marginBottom: 10 }} />
                          <div style={{ fontSize: 11, color: C.textMid }}>Price: £{(e.price / 1000).toFixed(0)}k</div>
                          <div style={{ fontSize: 11, color: C.textLight, marginTop: 2 }}>Price score: {+(minP / e.price * 100).toFixed(1)}%</div>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>
            )}
          </div>
        )}
      </div>

      {selected && <InsightDrawer criterion={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
