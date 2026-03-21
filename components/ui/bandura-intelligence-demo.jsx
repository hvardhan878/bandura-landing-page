"use client";

import { useState, useEffect, useRef, useCallback } from "react";

// ─── BRAND (dark-theme adapted) ──────────────────────────────────────────────
const C = {
  green: "#00CD92", deepGreen: "#27896C", mint: "#E1EDE6",
  black: "#0A0A0A", mid: "#A0A8A3", muted: "#505A56",
  white: "#FFFFFF", amber: "#E8A84D",
};

// ─── NETWORK NODES ───────────────────────────────────────────────────────────
const NETWORK_NODES = (() => {
  const nodes = [];
  nodes.push({ id: "n0", x: 400, y: 280, r: 10, primary: true });
  const clusters = [
    { cx: 200, cy: 160, count: 7, spread: 70 },
    { cx: 600, cy: 160, count: 6, spread: 65 },
    { cx: 150, cy: 350, count: 5, spread: 55 },
    { cx: 650, cy: 350, count: 6, spread: 60 },
    { cx: 300, cy: 90, count: 5, spread: 50 },
    { cx: 500, cy: 90, count: 4, spread: 45 },
    { cx: 250, cy: 430, count: 5, spread: 55 },
    { cx: 550, cy: 430, count: 5, spread: 55 },
    { cx: 400, cy: 480, count: 4, spread: 50 },
    { cx: 100, cy: 240, count: 3, spread: 40 },
    { cx: 700, cy: 240, count: 3, spread: 40 },
    { cx: 330, cy: 200, count: 3, spread: 35 },
    { cx: 470, cy: 200, count: 3, spread: 35 },
    { cx: 400, cy: 140, count: 3, spread: 40 },
    { cx: 400, cy: 400, count: 3, spread: 40 },
  ];
  let seed = 42;
  const rand = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
  let id = 1;
  clusters.forEach(cl => {
    for (let i = 0; i < cl.count; i++) {
      const angle = rand() * Math.PI * 2;
      const dist = rand() * cl.spread;
      const x = Math.max(20, Math.min(780, Math.round(cl.cx + Math.cos(angle) * dist)));
      const y = Math.max(20, Math.min(540, Math.round(cl.cy + Math.sin(angle) * dist)));
      nodes.push({ id: `n${id}`, x, y, r: 2.5 + rand() * 3, primary: false });
      id++;
    }
  });
  return nodes;
})();

const NETWORK_EDGES = (() => {
  const edges = [];
  for (let i = 0; i < NETWORK_NODES.length; i++) {
    for (let j = i + 1; j < NETWORK_NODES.length; j++) {
      const a = NETWORK_NODES[i], b = NETWORK_NODES[j];
      const dist = Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
      if (dist < ((a.primary || b.primary) ? 200 : 90)) edges.push([a.id, b.id]);
    }
  }
  return edges;
})();

// ─── INTERNAL DATA POINTS ────────────────────────────────────────────────────
const RAW_DATA = [
  { text: "Win/loss log: DXC incumbent on HMRC infrastructure services since 2019, contract value £48m", tag: "verified", source: "Win/Loss Log" },
  { text: "Account plan for HMRC: DXC relationship rated 'deeply embedded' across Digital and IT Ops", tag: "verified", source: "Account Plans" },
  { text: "Contract Finder archive: DXC awarded 3 consecutive HMRC contracts over 7 years", tag: "verified", source: "Contract Finder" },
  { text: "Competitor tracker: DXC hired 3 senior account managers from HMRC Digital in Q4 2024", tag: "signal", source: "Competitor Tracker" },
  { text: "Debrief notes from 2022: Evaluator said DXC's transition plan was 'strongest in the field'", tag: "verified", source: "Debrief Notes" },
  { text: "Internal assessment: Rated DXC 4/5 on HMRC relationship capital in annual competitor review", tag: "opinion", source: "Annual Review" },
  { text: "FOI archive: Three DXC milestones flagged as missed in HMRC programme governance report", tag: "verified", source: "FOI Archive" },
  { text: "Strategy deck: DXC categorised as 'legacy incumbent — strong relationship, weak innovation'", tag: "opinion", source: "Strategy Deck" },
  { text: "BD bulletin: DXC cloud roadmap for HMRC reportedly not delivered against original timeline", tag: "signal", source: "BD Bulletin" },
  { text: "Account manager email: 'SRO has publicly expressed frustration with DXC delivery pace'", tag: "verified", source: "Email Archive" },
  { text: "Partner notes: Our AWS rep says DXC pitching cloud-native repositioning to HMRC, no delivery proof", tag: "partial", source: "Partner Notes" },
  { text: "CRM notes: 'Met DXC team at GovTech event — seemed to be defending position rather than innovating'", tag: "opinion", source: "CRM Notes" },
  { text: "Competitor analysis: DXC published case study references 'HMRC digital modernisation' — vague on specifics", tag: "unsubstantiated", source: "Competitor Analysis" },
  { text: "HR records: 2 ex-DXC delivery leads now in our public sector practice — left citing 'innovation constraints'", tag: "verified", source: "HR Records" },
  { text: "Pipeline tracker: DXC appeared on all 6 HMRC-related shortlists we've tracked since 2020", tag: "verified", source: "Pipeline Tracker" },
  { text: "Commercial intel: DXC priced competitively on infrastructure but high on transformation work", tag: "partial", source: "Commercial Intel" },
  { text: "Bid library: DXC's G-Cloud service description emphasises 'managed services' not 'digital transformation'", tag: "verified", source: "Bid Library" },
  { text: "Event reports: DXC CTO spoke at Public Sector ICT on 'legacy modernisation' — positioned as lift-and-shift", tag: "verified", source: "Event Reports" },
  { text: "Team comms: 'Worked alongside DXC on shared HMRC programme — process-heavy, slow decision making'", tag: "opinion", source: "Team Comms" },
  { text: "Talent alerts: DXC posting for Cloud Architect — HMRC account, open 84 days", tag: "signal", source: "Talent Alerts" },
  { text: "Lessons learned: 'DXC won 2019 rebid on relationship continuity, not technical merit'", tag: "opinion", source: "Lessons Learned" },
  { text: "Market scan: DXC lost NHS Digital and Home Office transformation bids in last 18 months", tag: "verified", source: "Market Scan" },
  { text: "Sub register: DXC used Wipro as subcontractor for cloud migration elements on HMRC", tag: "verified", source: "Sub Register" },
  { text: "Competitor intel: DXC website shows 'Digital Transformation' practice but team page lists mostly infrastructure roles", tag: "signal", source: "Competitor Intel" },
];

const GAPS_TACIT = [
  { text: "Do we know specifically which milestones DXC missed on the HMRC programme — was it cloud delivery or something more operational?" },
  { text: "The two ex-DXC people we hired — can they tell us how DXC are actually staffing the transformation work versus the BAU infrastructure?" },
  { text: "Has anyone on our team spoken directly to the HMRC Technical Architect about how they feel about DXC's cloud-native credibility?" },
  { text: "When DXC lost the NHS Digital bid — do we know if it was their transformation approach that failed or just price?" },
];

const GAPS_RESEARCH = [
  { text: "What is DXC's actual cloud-native delivery track record across UK government — implementations shipped, not just proposals?" },
  { text: "Has the Wipro subcontracting arrangement on HMRC expanded or contracted — and what does that signal about DXC's in-house capability?" },
  { text: "How many of DXC's 'Digital Transformation' practice staff are genuinely cloud-native engineers vs. rebranded infrastructure people?" },
  { text: "Are there any recent FOI releases showing HMRC evaluator feedback on DXC's innovation credentials from the last contract review?" },
];

const PHASES = [
  "network", "zoom_in", "scanning", "classifying", "building",
  "gaps", "resolving", "judging", "confidence", "zoom_out",
];

const TAG_STYLE = {
  verified:       { bg: "rgba(0,205,146,0.15)", color: "#00CD92", label: "Verified" },
  opinion:        { bg: "rgba(232,168,77,0.15)", color: "#E8A84D", label: "Opinion" },
  unsubstantiated:{ bg: "rgba(255,80,80,0.15)", color: "#FF6060", label: "Unsubstantiated" },
  signal:         { bg: "rgba(100,160,255,0.15)", color: "#64A0FF", label: "Signal" },
  partial:        { bg: "rgba(167,139,250,0.15)", color: "#A78BFA", label: "Partial" },
  resolved:       { bg: "rgba(0,205,146,0.12)", color: "#27896C", label: "Resolved" },
};

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const S = 2;

// ─── NETWORK VIEW ────────────────────────────────────────────────────────────
function NetworkView({ phase, pulsingNodes }) {
  const canvasW = 800, canvasH = 560;
  const phaseIdx = PHASES.indexOf(phase);
  const isZoomed = phase === "zoom_in" || (phaseIdx > 1 && phaseIdx < 9);
  const isReturning = phase === "zoom_out";
  const primary = NETWORK_NODES[0];

  const scale = isZoomed ? 4.5 : 1;
  const tx = isZoomed ? canvasW / 2 - primary.x * scale : 0;
  const ty = isZoomed ? canvasH / 2 - primary.y * scale : 0;

  const nodeMap = {};
  NETWORK_NODES.forEach(n => { nodeMap[n.id] = n; });

  const transitionDur = isReturning ? "1s" : "0.8s";
  const transitionEase = isReturning
    ? "cubic-bezier(0.25,0.1,0.25,1)"
    : "cubic-bezier(0.34,1.2,0.64,1)";

  return (
    <div style={{
      width: "100%", height: canvasH, position: "relative", overflow: "hidden",
      borderRadius: 16, background: "rgba(255,255,255,0.03)",
      border: "1px solid rgba(255,255,255,0.06)",
    }}>
      <svg viewBox={`0 0 ${canvasW} ${canvasH}`} style={{
        width: "100%", height: "100%",
        transition: `transform ${transitionDur} ${transitionEase}`,
        transform: `translate(${tx}px, ${ty}px) scale(${scale})`,
        transformOrigin: "0 0",
      }}>
        <defs>
          <filter id="nodeGlowD"><feGaussianBlur stdDeviation="3" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
          <filter id="edgeGlowD"><feGaussianBlur stdDeviation="1.5" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        </defs>

        {NETWORK_EDGES.map(([a, b], i) => {
          const na = nodeMap[a], nb = nodeMap[b];
          if (!na || !nb) return null;
          const isLit = pulsingNodes.has(a) || pulsingNodes.has(b);
          return (
            <line key={i} x1={na.x} y1={na.y} x2={nb.x} y2={nb.y}
              stroke={isLit ? C.green : "rgba(255,255,255,0.06)"}
              strokeWidth={isLit ? 0.8 : 0.4}
              filter={isLit ? "url(#edgeGlowD)" : undefined}
              style={{ transition: "all 0.6s" }}
            />
          );
        })}

        {NETWORK_NODES.map(node => {
          const isPrimary = node.primary;
          const isPulsing = pulsingNodes.has(node.id);
          return (
            <g key={node.id}>
              {isPulsing && !isPrimary && (
                <circle cx={node.x} cy={node.y} r={node.r + 4} fill="none" stroke={C.green} strokeWidth="0.5" opacity="0.3">
                  <animate attributeName="r" from={node.r + 2} to={node.r + 8} dur="1.5s" repeatCount="indefinite"/>
                  <animate attributeName="opacity" from="0.3" to="0" dur="1.5s" repeatCount="indefinite"/>
                </circle>
              )}
              {isPrimary && (
                <circle cx={node.x} cy={node.y} r={node.r + 6} fill="none" stroke={C.green} strokeWidth="0.8" opacity="0.2">
                  <animate attributeName="r" from={node.r + 4} to={node.r + 18} dur="2s" repeatCount="indefinite"/>
                  <animate attributeName="opacity" from="0.3" to="0" dur="2s" repeatCount="indefinite"/>
                </circle>
              )}
              <circle cx={node.x} cy={node.y} r={node.r}
                fill={isPrimary ? C.green : isPulsing ? "rgba(0,205,146,0.6)" : "rgba(255,255,255,0.12)"}
                stroke={isPrimary ? C.deepGreen : isPulsing ? C.green : "rgba(255,255,255,0.08)"}
                strokeWidth={isPrimary ? 1.5 : 0.5}
                filter={isPulsing || isPrimary ? "url(#nodeGlowD)" : undefined}
                style={{ transition: "all 0.6s" }}
              />
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// ─── DATA SCANNER ────────────────────────────────────────────────────────────
function DataScanner({ phase, onScanComplete }) {
  const [visibleItems, setVisibleItems] = useState([]);
  const [scanIndex, setScanIndex] = useState(0);
  const [flickerItem, setFlickerItem] = useState(null);
  const scrollRef = useRef(null);
  const dataRef = useRef(shuffle(RAW_DATA));

  useEffect(() => {
    if (phase !== "scanning" && phase !== "classifying") return;
    const data = dataRef.current;
    if (scanIndex >= data.length) {
      const t = setTimeout(() => onScanComplete(), 800 * S);
      return () => clearTimeout(t);
    }
    const item = data[scanIndex];
    setFlickerItem({ ...item, showTag: false });
    const tagDelay = 600 * S;
    const nextDelay = 360 * S;
    const t1 = setTimeout(() => setFlickerItem(prev => prev ? { ...prev, showTag: true } : null), tagDelay);
    const t2 = setTimeout(() => {
      setVisibleItems(prev => [...prev, { ...item, id: scanIndex }]);
      setFlickerItem(null);
      setScanIndex(prev => prev + 1);
    }, tagDelay + nextDelay);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [phase, scanIndex, onScanComplete]);

  useEffect(() => { if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight; }, [visibleItems]);

  const progress = Math.round((scanIndex / RAW_DATA.length) * 100);

  return (
    <div style={{ position: "absolute", inset: 0, background: "rgba(10,10,10,0.97)", borderRadius: 16, display: "flex", flexDirection: "column", animation: "fadeInDemo 0.4s ease", border: "1px solid rgba(255,255,255,0.06)" }}>
      <div style={{ padding: "20px 24px 12px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: C.green, boxShadow: `0 0 8px ${C.green}`, animation: "pulseDemo 1s ease infinite" }} />
          <span style={{ fontSize: 11, fontWeight: 700, color: C.mid, letterSpacing: "0.06em", textTransform: "uppercase" }}>Scanning Repository</span>
        </div>
        <div style={{ fontSize: 18, fontWeight: 700, color: C.white, lineHeight: 1.3 }}>
          How strong will DXC be at delivering cloud-native architecture at scale for a large-scale transformation at HMRC?
        </div>
        <div style={{ fontSize: 12, color: C.muted, marginTop: 4 }}>HMRC Digital Transformation Programme · £55m · DOS6</div>
        <div style={{ marginTop: 10, height: 3, background: "rgba(255,255,255,0.06)", borderRadius: 2, overflow: "hidden" }}>
          <div style={{ height: "100%", background: C.green, borderRadius: 2, width: `${progress}%`, transition: "width 0.3s ease" }} />
        </div>
        <div style={{ fontSize: 10, color: C.muted, marginTop: 4 }}>{scanIndex} / {RAW_DATA.length} data points processed</div>
      </div>

      {flickerItem && (
        <div style={{ padding: "8px 24px", background: "rgba(0,205,146,0.04)", borderBottom: "1px solid rgba(0,205,146,0.1)", animation: "slideInDemo 0.15s ease" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 4, height: 4, borderRadius: "50%", background: C.green, animation: "pulseDemo 0.4s ease infinite" }} />
            <span style={{ fontSize: 12, color: C.white, fontWeight: 500, flex: 1 }}>{flickerItem.text}</span>
            {flickerItem.showTag && (
              <span style={{ fontSize: 9, fontWeight: 700, padding: "2px 8px", borderRadius: 99, background: TAG_STYLE[flickerItem.tag].bg, color: TAG_STYLE[flickerItem.tag].color, animation: "popTagDemo 0.2s cubic-bezier(0.34,1.56,0.64,1)", whiteSpace: "nowrap" }}>
                {TAG_STYLE[flickerItem.tag].label}
              </span>
            )}
          </div>
        </div>
      )}

      <div ref={scrollRef} style={{ flex: 1, overflowY: "auto", padding: "8px 24px", maskImage: "linear-gradient(to bottom, transparent 0%, black 5%, black 90%, transparent 100%)" }}>
        {visibleItems.map((item, i) => {
          const ts = TAG_STYLE[item.tag];
          const isRecent = i >= visibleItems.length - 3;
          return (
            <div key={item.id} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "6px 0", borderBottom: "1px solid rgba(255,255,255,0.04)", opacity: isRecent ? 1 : 0.4, transition: "opacity 0.3s" }}>
              <span style={{ fontSize: 9, color: C.muted, fontWeight: 600, minWidth: 72, paddingTop: 2 }}>{item.source}</span>
              <span style={{ fontSize: 11, color: C.mid, flex: 1, lineHeight: 1.4 }}>{item.text}</span>
              <span style={{ fontSize: 8, fontWeight: 700, padding: "2px 6px", borderRadius: 99, background: ts.bg, color: ts.color, whiteSpace: "nowrap", flexShrink: 0 }}>{ts.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── GAP RESOLUTION ──────────────────────────────────────────────────────────
function GapResolution({ phase, onComplete }) {
  const [tacitSent, setTacitSent] = useState(new Set());
  const [researchDone, setResearchDone] = useState(new Set());
  const [activeResearch, setActiveResearch] = useState(null);
  const timerRef = useRef([]);

  useEffect(() => {
    if (phase !== "resolving") return;
    GAPS_TACIT.forEach((_, i) => {
      const t = setTimeout(() => setTacitSent(prev => new Set([...prev, i])), (1200 + i * 1400) * S);
      timerRef.current.push(t);
    });
    const rStart = (1200 + GAPS_TACIT.length * 1400 + 800) * S;
    GAPS_RESEARCH.forEach((_, i) => {
      timerRef.current.push(setTimeout(() => setActiveResearch(i), rStart + i * 2400 * S));
      timerRef.current.push(setTimeout(() => {
        setResearchDone(prev => new Set([...prev, i]));
        setActiveResearch(prev => prev === i ? null : prev);
      }, rStart + (i * 2400 + 1800) * S));
    });
    timerRef.current.push(setTimeout(() => onComplete(), rStart + (GAPS_RESEARCH.length * 2400 + 1200) * S));
    return () => timerRef.current.forEach(clearTimeout);
  }, [phase, onComplete]);

  if (phase !== "resolving") return null;

  return (
    <div style={{ position: "absolute", inset: 0, background: "rgba(10,10,10,0.97)", borderRadius: 16, padding: 24, display: "flex", flexDirection: "column", animation: "fadeInDemo 0.4s ease", border: "1px solid rgba(255,255,255,0.06)" }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: C.mid, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 6 }}>Resolving Information Gaps</div>
      <div style={{ fontSize: 16, fontWeight: 700, color: C.white, marginBottom: 4 }}>8 gaps identified — splitting into acquisition channels</div>
      <div style={{ fontSize: 12, color: C.muted, marginBottom: 16 }}>HMRC Digital Transformation Programme · DXC Technology</div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, flex: 1, overflow: "auto" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="#A78BFA"><path d="M19.2 4.8H4.8c-.88 0-1.6.72-1.6 1.6v8c0 .88.72 1.6 1.6 1.6h2.4v3.2l3.2-3.2h8.8c.88 0 1.6-.72 1.6-1.6v-8c0-.88-.72-1.6-1.6-1.6z"/></svg>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#A78BFA" }}>Tacit Knowledge</span>
            <span style={{ fontSize: 10, color: C.muted, marginLeft: "auto" }}>via Teams</span>
          </div>
          {GAPS_TACIT.map((gap, i) => {
            const sent = tacitSent.has(i);
            return (
              <div key={i} style={{ padding: "10px 12px", borderRadius: 10, marginBottom: 6, background: sent ? "rgba(167,139,250,0.06)" : "rgba(255,255,255,0.02)", border: `1px solid ${sent ? "rgba(167,139,250,0.2)" : "rgba(255,255,255,0.05)"}`, transition: "all 0.4s" }}>
                <div style={{ fontSize: 11, color: sent ? C.white : C.muted, lineHeight: 1.4, transition: "color 0.3s", fontStyle: "italic" }}>"{gap.text}"</div>
                {sent && <div style={{ fontSize: 9, color: "#A78BFA", fontWeight: 600, marginTop: 4, animation: "slideInDemo 0.3s ease" }}>✓ Message sent to pursuit team</div>}
              </div>
            );
          })}
        </div>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill={C.green}><path d="M15.5 14h-.79l-.28-.27A6.47 6.47 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
            <span style={{ fontSize: 12, fontWeight: 700, color: C.green }}>Deep Research</span>
            <span style={{ fontSize: 10, color: C.muted, marginLeft: "auto" }}>automated</span>
          </div>
          {GAPS_RESEARCH.map((gap, i) => {
            const done = researchDone.has(i);
            const active = activeResearch === i;
            return (
              <div key={i} style={{ padding: "10px 12px", borderRadius: 10, marginBottom: 6, background: done ? "rgba(0,205,146,0.06)" : active ? "rgba(0,205,146,0.03)" : "rgba(255,255,255,0.02)", border: `1px solid ${done ? "rgba(0,205,146,0.2)" : active ? "rgba(0,205,146,0.12)" : "rgba(255,255,255,0.05)"}`, transition: "all 0.4s" }}>
                <div style={{ fontSize: 11, color: done || active ? C.white : C.muted, lineHeight: 1.4, transition: "color 0.3s" }}>{gap.text}</div>
                {active && <div style={{ fontSize: 9, color: C.green, fontWeight: 600, marginTop: 4, display: "flex", alignItems: "center", gap: 4 }}><div style={{ width: 6, height: 6, borderRadius: "50%", background: C.green, animation: "pulseDemo 0.6s ease infinite" }} />Researching…</div>}
                {done && <div style={{ fontSize: 9, color: C.deepGreen, fontWeight: 600, marginTop: 4, animation: "slideInDemo 0.3s ease" }}>✓ Intelligence acquired</div>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── JUDGMENT VIEW ───────────────────────────────────────────────────────────
function JudgmentView({ phase, onComplete }) {
  const [step, setStep] = useState(0);
  const [litPoints, setLitPoints] = useState(new Set());
  const [showVerdict, setShowVerdict] = useState(false);
  const [showConfidence, setShowConfidence] = useState(false);
  const [scoreAnim, setScoreAnim] = useState(0);
  const [confScoreAnim, setConfScoreAnim] = useState(0);
  const timerRef = useRef([]);

  const allPoints = [
    ...RAW_DATA,
    ...GAPS_TACIT.map(g => ({ text: g.text, tag: "resolved", source: "Tacit" })),
    ...GAPS_RESEARCH.map(g => ({ text: g.text, tag: "resolved", source: "Research" })),
  ];
  const totalPoints = allPoints.length;

  useEffect(() => {
    if (phase !== "judging" && phase !== "confidence") return;
    allPoints.forEach((_, i) => {
      timerRef.current.push(setTimeout(() => setLitPoints(prev => new Set([...prev, i])), 160 * S * i));
    });
    timerRef.current.push(setTimeout(() => setStep(1), (160 * totalPoints + 800) * S));
    timerRef.current.push(setTimeout(() => {
      setStep(2);
      setShowVerdict(true);
      let f = 0;
      const si = setInterval(() => { f++; setScoreAnim(Math.min(f, 4)); if (f >= 4) clearInterval(si); }, 180 * S);
      timerRef.current.push(si);
    }, (160 * totalPoints + 4000) * S));
    timerRef.current.push(setTimeout(() => {
      setStep(3);
      setShowConfidence(true);
      let f = 0;
      const ci = setInterval(() => { f++; setConfScoreAnim(Math.min(f, 7)); if (f >= 7) clearInterval(ci); }, 150 * S);
      timerRef.current.push(ci);
    }, (160 * totalPoints + 7000) * S));
    timerRef.current.push(setTimeout(() => onComplete(), (160 * totalPoints + 12000) * S));
    return () => timerRef.current.forEach(t => { clearTimeout(t); clearInterval(t); });
  }, [phase, onComplete]);

  if (phase !== "judging" && phase !== "confidence") return null;

  const remainingQuestions = [
    "Which specific milestones did DXC miss — was it the cloud migration or wider programme delivery?",
    "Is DXC genuinely building cloud-native capability or rebranding infrastructure staff?",
    "What did the HMRC Technical Architect actually say about DXC's innovation track record?",
    "Has the Wipro subcontracting arrangement grown — and what does that say about DXC's bench depth?",
  ];

  return (
    <div style={{ position: "absolute", inset: 0, background: "rgba(10,10,10,0.97)", borderRadius: 16, padding: 24, display: "flex", flexDirection: "column", animation: "fadeInDemo 0.4s ease", overflow: "hidden", border: "1px solid rgba(255,255,255,0.06)" }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: C.mid, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 6 }}>Forming Judgment</div>
      <div style={{ fontSize: 16, fontWeight: 700, color: C.white, marginBottom: 4 }}>Synthesising across {totalPoints} data points</div>
      <div style={{ fontSize: 12, color: C.muted, marginBottom: 16 }}>DXC Technology · HMRC Digital Transformation · £55m</div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 16 }}>
        {allPoints.map((p, i) => {
          const lit = litPoints.has(i);
          const ts = TAG_STYLE[p.tag] || TAG_STYLE.resolved;
          return <div key={i} title={p.text} style={{ width: 18, height: 18, borderRadius: 3, background: lit ? ts.bg : "rgba(255,255,255,0.04)", border: `1px solid ${lit ? ts.color + "40" : "rgba(255,255,255,0.06)"}`, transition: "all 0.3s" }} />;
        })}
      </div>

      {step >= 1 && (
        <div style={{ animation: "fadeInDemo 0.5s ease", marginBottom: 12 }}>
          <div style={{ fontSize: 10, color: C.muted, fontWeight: 600, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>Weight distribution</div>
          <div style={{ display: "flex", gap: 2, height: 6, borderRadius: 3, overflow: "hidden" }}>
            {[
              { w: 42, color: TAG_STYLE.verified.bg, border: TAG_STYLE.verified.color },
              { w: 20, color: TAG_STYLE.opinion.bg, border: TAG_STYLE.opinion.color },
              { w: 14, color: TAG_STYLE.signal.bg, border: TAG_STYLE.signal.color },
              { w: 10, color: TAG_STYLE.partial.bg, border: TAG_STYLE.partial.color },
              { w: 10, color: "rgba(0,205,146,0.12)", border: C.deepGreen },
              { w: 4, color: TAG_STYLE.unsubstantiated.bg, border: TAG_STYLE.unsubstantiated.color },
            ].map((seg, i) => (
              <div key={i} style={{ flex: seg.w, background: seg.color, borderBottom: `2px solid ${seg.border}`, animation: `growWidthDemo 0.6s ease ${i * 0.1}s both` }} />
            ))}
          </div>
          <div style={{ display: "flex", gap: 12, marginTop: 6, flexWrap: "wrap" }}>
            {[
              { label: "Verified", color: TAG_STYLE.verified.color, pct: "42%" },
              { label: "Opinion", color: TAG_STYLE.opinion.color, pct: "20%" },
              { label: "Signal", color: TAG_STYLE.signal.color, pct: "14%" },
              { label: "Partial", color: TAG_STYLE.partial.color, pct: "10%" },
              { label: "Resolved", color: C.deepGreen, pct: "10%" },
              { label: "Unsubstantiated", color: TAG_STYLE.unsubstantiated.color, pct: "4%" },
            ].map((l, i) => <span key={i} style={{ fontSize: 9, color: l.color, fontWeight: 600 }}>● {l.label} {l.pct}</span>)}
          </div>
        </div>
      )}

      {showVerdict && (
        <div style={{ background: "rgba(0,205,146,0.06)", border: "1.5px solid rgba(0,205,146,0.15)", borderRadius: 12, padding: 16, marginBottom: 12, animation: "slideUpDemo 0.5s cubic-bezier(0.34,1.2,0.64,1)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: C.green, textTransform: "uppercase", letterSpacing: "0.06em" }}>Concluded Assessment</div>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
                <span style={{ fontSize: 28, fontWeight: 800, color: C.white, lineHeight: 1 }}>{scoreAnim}</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: C.muted }}>/10</span>
                <span style={{ fontSize: 9, fontWeight: 600, color: C.mid, marginLeft: 4 }}>capability</span>
              </div>
              {showConfidence && (
                <div style={{ display: "flex", alignItems: "baseline", gap: 4, animation: "fadeInDemo 0.5s ease", paddingLeft: 16, borderLeft: "1px solid rgba(255,255,255,0.08)" }}>
                  <span style={{ fontSize: 28, fontWeight: 800, color: C.green, lineHeight: 1 }}>{confScoreAnim}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: C.muted }}>/10</span>
                  <span style={{ fontSize: 9, fontWeight: 600, color: C.mid, marginLeft: 4 }}>confidence</span>
                </div>
              )}
            </div>
          </div>
          <div style={{ fontSize: 13, fontWeight: 500, color: C.white, lineHeight: 1.6 }}>
            DXC holds deep HMRC relationship capital and incumbency advantage from 7 years of continuous delivery.
            However, evidence consistently points to <span style={{ fontWeight: 700, color: C.green }}>infrastructure strength being repositioned as transformation capability</span> — missed
            milestones, subcontractor dependency for cloud work, and recent losses on comparable transformation bids
            elsewhere in government suggest the digital transformation narrative is ahead of actual delivery depth.
          </div>
        </div>
      )}

      {showConfidence && (
        <div style={{ background: "rgba(255,255,255,0.02)", borderRadius: 12, padding: 14, animation: "fadeInDemo 0.5s ease", border: "1px solid rgba(255,255,255,0.05)" }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: C.mid, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>Open questions</div>
          {remainingQuestions.map((q, i) => (
            <div key={i} style={{ fontSize: 11, color: C.mid, lineHeight: 1.5, paddingLeft: 10, borderLeft: `2px solid ${C.amber}`, marginBottom: 6 }}>{q}</div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── PHASE INDICATOR ─────────────────────────────────────────────────────────
function PhaseIndicator({ phase }) {
  const labels = {
    network: "Intelligence Network", zoom_in: "Focusing on question…",
    scanning: "Scanning internal repository…", classifying: "Classifying evidence…",
    building: "Building the picture…", gaps: "Identifying information gaps…",
    resolving: "Resolving gaps…", judging: "Forming judgment…",
    confidence: "Assessing confidence…", zoom_out: "Returning to network view",
  };
  const currentIdx = PHASES.indexOf(phase);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
      <div style={{ display: "flex", gap: 3 }}>
        {PHASES.map((p, i) => (
          <div key={p} style={{ width: i === currentIdx ? 24 : 8, height: 4, borderRadius: 2, background: i <= currentIdx ? C.green : "rgba(255,255,255,0.1)", transition: "all 0.4s" }} />
        ))}
      </div>
      <span style={{ fontSize: 11, fontWeight: 600, color: C.mid }}>{labels[phase] || ""}</span>
    </div>
  );
}

// ─── MAIN EXPORT ─────────────────────────────────────────────────────────────
export default function BanduraIntelligenceDemo() {
  const [phase, setPhase] = useState("network");
  const [pulsingNodes, setPulsingNodes] = useState(new Set());
  const [started, setStarted] = useState(false);
  const timerRef = useRef([]);

  const clearTimers = () => { timerRef.current.forEach(clearTimeout); timerRef.current = []; };

  useEffect(() => {
    if (phase !== "network" || started) return;
    const ids = NETWORK_NODES.map(n => n.id);
    const interval = setInterval(() => {
      const picks = new Set();
      const count = 3 + Math.floor(Math.random() * 5);
      while (picks.size < count) picks.add(ids[Math.floor(Math.random() * ids.length)]);
      setPulsingNodes(picks);
      setTimeout(() => setPulsingNodes(new Set()), 1200);
    }, 2500);
    return () => clearInterval(interval);
  }, [phase, started]);

  const startDemo = useCallback(() => {
    if (started) return;
    setStarted(true);
    clearTimers();
    setPulsingNodes(new Set(["n0"]));
    timerRef.current.push(setTimeout(() => setPhase("zoom_in"), 300));
    timerRef.current.push(setTimeout(() => setPhase("scanning"), 1400));
  }, [started]);

  const handleScanComplete = useCallback(() => {
    setPhase("gaps");
    timerRef.current.push(setTimeout(() => setPhase("resolving"), 3000 * S));
  }, []);

  const handleResolveComplete = useCallback(() => setPhase("judging"), []);

  const handleJudgmentComplete = useCallback(() => {
    timerRef.current.push(setTimeout(() => {
      setPhase("zoom_out");
      setPulsingNodes(new Set(NETWORK_NODES.map(n => n.id)));
      timerRef.current.push(setTimeout(() => setPulsingNodes(new Set()), 2500));
    }, 500));
  }, []);

  const resetDemo = useCallback(() => {
    clearTimers();
    setPhase("network");
    setStarted(false);
    setPulsingNodes(new Set());
  }, []);

  useEffect(() => () => clearTimers(), []);

  const showOverlay = ["scanning", "classifying", "building", "gaps"].includes(phase);

  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", gap: 8 }}>
            {!started && (
              <button
                onClick={startDemo}
                style={{
                  background: C.green, color: "#fff", border: "none", borderRadius: 999,
                  padding: "9px 22px", fontSize: 12, fontWeight: 700, cursor: "pointer",
                  boxShadow: `0 2px 12px rgba(0,205,146,0.25)`, transition: "all 0.2s",
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                Run Intelligence Demo
              </button>
            )}
            {started && phase === "zoom_out" && (
              <button
                onClick={resetDemo}
                style={{
                  background: "rgba(255,255,255,0.05)", color: "#fff",
                  border: "1px solid rgba(255,255,255,0.1)", borderRadius: 999,
                  padding: "9px 22px", fontSize: 12, fontWeight: 700, cursor: "pointer",
                  fontFamily: "'DM Sans', sans-serif", transition: "all 0.2s",
                }}
              >
                Reset
              </button>
            )}
          </div>
        </div>
      </div>

      <div style={{ marginBottom: 16, background: "rgba(255,255,255,0.03)", borderRadius: 16, padding: "20px 28px", border: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ fontSize: 22, fontWeight: 800, color: C.white, lineHeight: 1.3 }}>How does Bandura build a judgment?</div>
      </div>

      <PhaseIndicator phase={phase} />

      <div style={{ position: "relative" }}>
        <NetworkView phase={phase} pulsingNodes={pulsingNodes} />
        {showOverlay && <div style={{ position: "absolute", inset: 0 }}><DataScanner phase={phase} onScanComplete={handleScanComplete} /></div>}
        {phase === "resolving" && <div style={{ position: "absolute", inset: 0 }}><GapResolution phase={phase} onComplete={handleResolveComplete} /></div>}
        {(phase === "judging" || phase === "confidence") && <div style={{ position: "absolute", inset: 0 }}><JudgmentView phase={phase} onComplete={handleJudgmentComplete} /></div>}
      </div>

      <style>{`
        @keyframes fadeInDemo { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideInDemo { from { opacity: 0; transform: translateX(-8px) } to { opacity: 1; transform: translateX(0) } }
        @keyframes slideUpDemo { from { opacity: 0; transform: translateY(12px) } to { opacity: 1; transform: translateY(0) } }
        @keyframes popTagDemo { from { opacity: 0; transform: scale(0.7) } to { opacity: 1; transform: scale(1) } }
        @keyframes pulseDemo { 0%,100% { opacity: 1 } 50% { opacity: 0.4 } }
        @keyframes growWidthDemo { from { transform: scaleX(0) } to { transform: scaleX(1) } }
      `}</style>
    </div>
  );
}
