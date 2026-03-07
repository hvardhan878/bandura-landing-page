"use client"

import { useState, useCallback } from "react"
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const BanduraNetwork = require("@/components/ui/bandura-network").default as any
import BidScoringDashboard from "@/components/ui/bid-scoring-dashboard"

type Phase = "pre" | "running" | "created"
type Tab = "network" | "scoring"

export default function ScoringPage() {
  const [phase, setPhase] = useState<Phase>("pre")
  const [activeTab, setActiveTab] = useState<Tab>("network")
  const [scoringUnlocked, setScoringUnlocked] = useState(false)

  const handlePhaseChange = useCallback((p: string) => {
    setPhase(p as Phase)
    if (p === "created") {
      setScoringUnlocked(true)
      setTimeout(() => setActiveTab("scoring"), 1800)
    }
  }, [])

  const tabStyle = (id: Tab, locked = false) => ({
    display: "flex",
    alignItems: "center",
    gap: 7,
    padding: "0 18px",
    fontSize: 12,
    fontWeight: 500,
    cursor: locked ? "not-allowed" : "pointer",
    color: activeTab === id ? "#f0f0f0" : locked ? "#2a2a2a" : "#666",
    borderBottom: activeTab === id ? "2px solid #00CD92" : "2px solid transparent",
    transition: "all 0.2s",
    whiteSpace: "nowrap" as const,
    userSelect: "none" as const,
  })

  return (
    <div style={{
      height: "100vh",
      display: "flex",
      flexDirection: "column",
      background: "#0a0a0a",
      fontFamily: "Inter, system-ui, sans-serif",
      overflow: "hidden",
    }}>

      {/* ── App titlebar ─────────────────────────────────────────────── */}
      <div style={{
        height: 44, flexShrink: 0,
        background: "#111",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        display: "flex", alignItems: "center",
        padding: "0 20px", gap: 14,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
          <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#00CD92", boxShadow: "0 0 0 2px rgba(0,205,146,0.2)" }} />
          <span style={{ fontSize: 13, fontWeight: 700, color: "#f0f0f0", letterSpacing: "-0.01em" }}>Bandura</span>
        </div>
        <div style={{ width: 1, height: 14, background: "rgba(255,255,255,0.1)" }} />
        <span style={{ fontSize: 12, color: "#777" }}>HMRC Digital Transformation Programme</span>
        <span style={{ fontSize: 12, color: "#3a3a3a" }}>· £55m · Cabinet Office · DOS6</span>
        <div style={{ flex: 1 }} />

        {phase === "pre" && (
          <span style={{ fontSize: 11, color: "#3a3a3a" }}>Send a message to start</span>
        )}
        {phase === "running" && (
          <div style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.18)", borderRadius: 999, padding: "3px 12px" }}>
            <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#f59e0b", animation: "blink 1s ease-in-out infinite" }} />
            <span style={{ fontSize: 11, color: "#f59e0b", fontWeight: 600 }}>Building capture plan…</span>
          </div>
        )}
        {phase === "created" && (
          <div style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(0,205,146,0.08)", border: "1px solid rgba(0,205,146,0.18)", borderRadius: 999, padding: "3px 12px" }}>
            <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#00CD92" }} />
            <span style={{ fontSize: 11, color: "#00CD92", fontWeight: 600 }}>22 documents synced · Scoring intelligence ready</span>
          </div>
        )}
      </div>

      {/* ── Section tabs ─────────────────────────────────────────────── */}
      <div style={{
        height: 38, flexShrink: 0,
        background: "#0d0d0d",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        display: "flex", alignItems: "stretch",
        padding: "0 6px",
      }}>
        <button
          style={tabStyle("network")}
          onClick={() => setActiveTab("network")}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="3"/><line x1="12" y1="3" x2="12" y2="9"/><line x1="12" y1="15" x2="12" y2="21"/>
            <line x1="3" y1="12" x2="9" y2="12"/><line x1="15" y1="12" x2="21" y2="12"/>
          </svg>
          Capture Plan
        </button>

        <button
          style={tabStyle("scoring", !scoringUnlocked)}
          onClick={() => scoringUnlocked && setActiveTab("scoring")}
        >
          {!scoringUnlocked ? (
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
          ) : (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
            </svg>
          )}
          Scoring Intelligence
          {!scoringUnlocked && phase === "pre" && (
            <span style={{ fontSize: 9, color: "#2a2a2a", marginLeft: 2 }}>· build capture plan first</span>
          )}
          {phase === "running" && !scoringUnlocked && (
            <span style={{ fontSize: 9, color: "#f59e0b", marginLeft: 2, opacity: 0.7 }}>· generating…</span>
          )}
        </button>
      </div>

      {/* ── Content area ─────────────────────────────────────────────── */}
      <div style={{ flex: 1, overflow: "auto", position: "relative" }}>

        {/* Network tab */}
        <div style={{
          display: activeTab === "network" ? "block" : "none",
        }}>
          <BanduraNetwork onPhaseChange={handlePhaseChange} />
        </div>

        {/* Scoring tab */}
        <div style={{
          display: activeTab === "scoring" ? "block" : "none",
          animation: activeTab === "scoring" ? "fadeIn 0.4s ease" : "none",
        }}>
          <BidScoringDashboard />
        </div>

      </div>

      <style>{`
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.3} }
        @keyframes fadeIn { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
      `}</style>
    </div>
  )
}
