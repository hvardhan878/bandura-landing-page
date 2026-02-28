"use client"

import { useState, useEffect, useRef } from "react"
import {
  ComposedChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ReferenceArea,
  ResponsiveContainer,
} from "recharts"

const BASE_WIN = 31
const G = {
  green: "#00CD92",
  deepGreen: "#27896C",
  amber: "#e89400",
  red: "#dc3c3c",
  card: "rgba(255,255,255,0.04)",
  cardBorder: "rgba(255,255,255,0.08)",
  darkCard: "rgba(255,255,255,0.07)",
  darkCardBorder: "rgba(255,255,255,0.12)",
  textPrimary: "#ffffff",
  textSecondary: "#9ca3af",
  textMuted: "#6b7280",
  divider: "rgba(255,255,255,0.08)",
}

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener("resize", check)
    return () => window.removeEventListener("resize", check)
  }, [])
  return isMobile
}

const INVESTMENTS = [
  { id: "stakeholder", category: "Relationship Building", title: "SRO & Technical Architect engagement", description: "Direct engagement with the SRO and Technical Architect in the next 8 weeks to shape requirements.", status: "Not started", effort: "High", winImpact: 14, scenarioLinks: ["dxc_incumbent"], actions: ["Arrange working group participation with HMRC Digital", "Commission white paper aligned to SRO's stated priorities", "Brief Technical Architect on platform capabilities"] },
  { id: "requirements", category: "Positioning", title: "Requirements shaping & specification influence", description: "Influence the ITT specification to reflect our delivery methodology and cloud-native approach.", status: "Not started", effort: "High", winImpact: 11, scenarioLinks: ["dxc_tech"], actions: ["Submit response to pre-market engagement notice", "Propose evaluation criteria weighting", "Seed cloud-native architecture requirement language"] },
  { id: "partners", category: "Internal Assembly", title: "Strategic partner & SME assembly", description: "Lock in key subcontractors and SME partners before ITT drops.", status: "In progress", effort: "Medium", winImpact: 8, scenarioLinks: ["atos_partner", "capita_partner"], actions: ["Contract preferred SME partners on teaming agreements", "Confirm hyperscaler partnership for cloud delivery", "Align partner capability narratives with win themes"] },
  { id: "evidence", category: "Bid Readiness", title: "Case study & evidence pack preparation", description: "Build a pre-ITT evidence library covering transition delivery and HMRC-specific experience.", status: "Not started", effort: "Medium", winImpact: 7, scenarioLinks: ["capita_incumbent"], actions: ["Commission case studies from 3 comparable HMRC engagements", "Prepare transition methodology documentation", "Build independent reference contacts"] },
  { id: "pricing", category: "Commercial", title: "Price-to-win commercial modelling", description: "Finalise commercial strategy at £50m under the Full Managed Service model.", status: "In progress", effort: "Low", winImpact: 6, scenarioLinks: ["serco_price"], actions: ["Commission independent TCO analysis vs. incumbent", "Model scenario responses to Serco price undercut", "Prepare commercial narrative for bid team"] },
  { id: "governance", category: "Internal Governance", title: "Internal bid governance & resource lock-in", description: "Secure senior sponsorship and lock in the bid team resource now.", status: "Not started", effort: "Medium", winImpact: 5, scenarioLinks: [], actions: ["Obtain Partner-level sponsorship and budget commitment", "Identify and pre-book key SMEs for bid writing windows", "Establish bid governance cadence"] },
]

const SCENARIOS = [
  { id: "serco_price", competitor: "Serco", title: "Low Price Aggressive", likelihood: 91, impact: 18, bucket: "mitigateable", currentPosition: "Our TCO narrative is already strong. Serco's price play is predictable and evaluators are aware of their delivery quality risk.", actions: ["Ensure TCO modelling is in the bid pack", "Pre-brief evaluators on delivery quality as a scored criterion"], effort: "Low" },
  { id: "capita_incumbent", competitor: "Capita", title: "Incumbent Defend", likelihood: 71, impact: 12, bucket: "mitigateable", currentPosition: "Capita's delivery record is documentable. We have the evidence to build a 'cost of staying' narrative that counters their continuity play.", actions: ["Commission FOI on current contract performance data", "Build 'cost of staying' case for SRO briefing"], effort: "Low" },
  { id: "serco_partner", competitor: "Serco", title: "Strategic Partnership Play", likelihood: 44, impact: 6, bucket: "mitigateable", currentPosition: "Serco's partner relationships are not established. Any partnership at bid stage will look reactive and shallow.", actions: ["Evidence partnership depth with delivery case studies", "Challenge partner credential requirements in ITT process"], effort: "Low" },
  { id: "capita_partner", competitor: "Capita", title: "Hyperscaler Partnership Play", likelihood: 34, impact: 5, bucket: "mitigateable", currentPosition: "Capita's Azure partnership is new and contractually thin. We can challenge its depth in evaluation without significant investment.", actions: ["Require delivery case studies with named hyperscaler partner", "Position our native cloud architecture against bolted-on partnerships"], effort: "Low" },
  { id: "dxc_partner", competitor: "DXC (Incumbent)", title: "Late-Stage Tech Partnership", likelihood: 44, impact: 4, bucket: "mitigateable", currentPosition: "DXC bringing in a new tech partner at bid stage is a signal of weakness. Evaluators will question why it wasn't deployed in the current contract.", actions: ["Raise 'why wasn't this deployed already' in pre-market engagement", "Highlight our existing embedded partnerships vs. reactive ones"], effort: "Low" },
  { id: "dxc_incumbent", competitor: "DXC (Incumbent)", title: "Incumbent Defence Strategy", likelihood: 95, impact: 22, bucket: "investment", currentPosition: "DXC's relationship capital at SRO and Director level is deep. Without equivalent senior engagement, the spec will be written around their delivery model.", actions: ["Arrange direct engagement with SRO — requires Partner-level sponsorship", "Commission white paper aligned to SRO's modernisation priorities", "Brief Technical Architect before pre-market consultation closes"], effort: "High", investmentRequired: "Senior relationship programme — est. 6–8 weeks, Partner + BD resource" },
  { id: "atos_partner", competitor: "Atos / Eviden", title: "AWS Partnership Play", likelihood: 67, impact: 11, bucket: "investment", currentPosition: "Atos's AWS partnership is real at the architecture layer. Without a comparable hyperscaler narrative, we lose the technology credibility contest.", actions: ["Formalise hyperscaler partnership with named delivery proof points", "Embed hyperscaler credentials explicitly in win theme 1", "Request scored technical demonstrations in ITT"], effort: "Medium", investmentRequired: "Partnership formalisation — est. 4–6 weeks, alliance team resource" },
  { id: "atos_tech", competitor: "Atos / Eviden", title: "Technical Differentiator Play", likelihood: 58, impact: 13, bucket: "investment", currentPosition: "Atos's Eviden brand gives them credible AI and cloud-native positioning. Our innovation narrative needs strengthening.", actions: ["Develop a concrete AI use case specific to HMRC's stated priorities", "Invest in a pre-bid innovation workshop with HMRC Digital", "Build named innovation team into bid structure"], effort: "High", investmentRequired: "Innovation narrative and pre-bid engagement — est. 8–10 weeks" },
  { id: "dxc_tech", competitor: "DXC (Incumbent)", title: "Forward Technology Roadmap Commitment", likelihood: 52, impact: 9, bucket: "investment", currentPosition: "DXC will make compelling forward commitments to compensate for poor current delivery. Without a counter-narrative, evaluators may weight their roadmap over our track record.", actions: ["Formally request contract performance review against DXC's original commitments", "Build evaluation criterion: evidence of delivery against previous commitments", "Pre-brief commercial team on challenging future promise vs. past performance"], effort: "Medium", investmentRequired: "Procurement process influence — est. 6 weeks, BD + legal resource" },
  { id: "dxc_relationships", competitor: "DXC (Incumbent)", title: "Deep Departmental Relationship Capital", likelihood: 95, impact: 12, bucket: "unmitigatable", currentPosition: "DXC have 7+ years of relationship investment at SRO, Director, and Technical Architect level. This cannot be replicated before ITT. The spec will carry their fingerprints.", actions: ["Accept this as a structural disadvantage and build the bid to win despite it", "Focus engagement on stakeholders who are dissatisfied — they exist", "Position explicitly as a change agent, not a continuity play"], effort: "N/A", riskNote: "This scenario will depress win likelihood by an estimated 8–12% regardless of actions taken." },
  { id: "capita_sector", competitor: "Capita", title: "HMRC Institutional Knowledge Claim", likelihood: 71, impact: 8, bucket: "unmitigatable", currentPosition: "Capita's depth of HMRC-specific institutional knowledge cannot be matched or challenged directly.", actions: ["Do not compete on this dimension — reframe the evaluation away from 'who knows HMRC best'", "Use their depth of knowledge as evidence of stagnation, not advantage"], effort: "N/A", riskNote: "A structural disadvantage. Must be neutralised through narrative reframing, not direct competition." },
  { id: "serco_lowprice_floor", competitor: "Serco", title: "Below-Floor Price Submission", likelihood: 45, impact: 25, bucket: "unmitigatable", currentPosition: "If Serco bids below £36m we cannot match that price without destroying our commercial model.", actions: ["Ensure evaluation criteria weight quality and delivery evidence heavily", "Pre-brief commercial evaluators on the delivery risk of sub-floor bids"], effort: "N/A", riskNote: "If this materialises, a binary decision is required: bid at our floor or no-bid. Pre-agree at governance stage." },
]

const BUCKETS = [
  { id: "mitigateable", label: "Mitigateable", color: G.green, bgColor: "rgba(0,205,146,0.08)", borderColor: "rgba(0,205,146,0.2)", textColor: G.deepGreen, icon: "✓", implication: "Handle with current capability, minimal effort." },
  { id: "investment", label: "Investment to mitigate", color: G.amber, bgColor: "rgba(232,148,0,0.07)", borderColor: "rgba(232,148,0,0.2)", textColor: "#c07000", icon: "△", implication: "Requires deliberate investment decisions now." },
  { id: "unmitigatable", label: "Unmitigatable", color: G.red, bgColor: "rgba(220,60,60,0.06)", borderColor: "rgba(220,60,60,0.15)", textColor: G.red, icon: "✕", implication: "Structural disadvantages — absorb and plan around." },
]

const COMPOSITIONS = [
  { id: "minimal", label: "Minimal Viable", description: "Core delivery only, lean team, standard SLAs", color: G.textMuted, data: [{ price: 25, win: 74 }, { price: 30, win: 69 }, { price: 35, win: 62 }, { price: 40, win: 53 }, { price: 45, win: 42 }, { price: 50, win: 31 }, { price: 55, win: 21 }, { price: 60, win: 13 }, { price: 65, win: 7 }, { price: 70, win: 3 }, { price: 75, win: 1 }], sweetSpot: { price: 27, win: 74 }, sweetSpotRange: [25, 32] },
  { id: "hybrid", label: "Hybrid Partner", description: "Blended delivery with strategic subcontractors", color: G.deepGreen, data: [{ price: 25, win: 55 }, { price: 30, win: 66 }, { price: 35, win: 74 }, { price: 40, win: 69 }, { price: 45, win: 59 }, { price: 50, win: 47 }, { price: 55, win: 34 }, { price: 60, win: 21 }, { price: 65, win: 11 }, { price: 70, win: 5 }, { price: 75, win: 2 }], sweetSpot: { price: 33, win: 74 }, sweetSpotRange: [30, 38] },
  { id: "full", label: "Full Managed", description: "End-to-end ownership, premium team, enhanced SLAs", color: G.green, data: [{ price: 25, win: 36 }, { price: 30, win: 51 }, { price: 35, win: 65 }, { price: 40, win: 71 }, { price: 45, win: 62 }, { price: 50, win: 50 }, { price: 55, win: 37 }, { price: 60, win: 25 }, { price: 65, win: 14 }, { price: 70, win: 6 }, { price: 75, win: 2 }], sweetSpot: { price: 39, win: 71 }, sweetSpotRange: [35, 44] },
]

const COMPETITORS_PTW = [
  { name: "Capita", price: 36 }, { name: "Serco", price: 41 }, { name: "Atos", price: 47 }, { name: "DXC", price: 52 },
]

const CAPTURE_SECTIONS = [
  { id: "executive", title: "Executive Summary", tag: "Overview", content: "This capture plan positions ACME Consulting as the preferred partner for the HMRC Digital Transformation Programme. Analysis indicates a 71% win likelihood at the £50m price point under the Full Managed Service composition.", artefacts: ["Bid Context.xlsx", "Win Themes.docx", "Client Insights.xlsx"], analysis: ["Bid viability modelling", "Client intent mapping", "Historical win analysis"] },
  { id: "winThemes", title: "Win Themes", tag: "Strategy", content: "Three primary win themes identified: (1) Proven HMRC delivery — demonstrable experience across 4 prior engagements. (2) Transition risk mitigation — our phased approach directly addresses the client's stated concern around service continuity. (3) Value beyond compliance.", artefacts: ["Win Themes.docx", "Evaluation Drivers.docx", "Client Insights.xlsx", "Differentiators.docx"], analysis: ["Evaluation criteria weighting", "Win theme stress-testing", "Competitor win theme analysis"] },
  { id: "ghosting", title: "Ghosting Strategy", tag: "Competitive", content: "The incumbent (DXC) is vulnerable on transition risk and innovation credentials. Requirements should reference 'continuous service improvement' and 'cloud-native architecture' — areas where DXC's existing infrastructure is a structural disadvantage.", artefacts: ["Ghosting Strategy.docx", "Competitor SWOT.xlsx", "Capabilities Analysis.xlsx"], analysis: ["Competitor vulnerability mapping", "Requirement influence analysis", "Ghost theme generation"] },
  { id: "commercial", title: "Commercial Strategy", tag: "Pricing", content: "Recommended price-to-win: £47–53m. At this range, win likelihood is maximised at 69–71% under the Full Managed Service model. Below £40m, the solution becomes commercially unviable.", artefacts: ["Commercial Strategy.docx", "Commercial Strategy Generation.xlsx", "Competitor SWOT.xlsx"], analysis: ["Price-to-win modelling", "Competitor pricing intelligence", "Commercial scenario simulations"] },
  { id: "relationships", title: "Relationship & Influence Plan", tag: "Engagement", content: "Three key stakeholders identified: SRO (Deputy Director, Digital), who has publicly prioritised 'delivery confidence over cost innovation'; Commercial lead, who is price-sensitive; and Technical Architect, who will heavily influence the spec.", artefacts: ["Client Insights.xlsx", "Evaluation Drivers.docx", "Bid Context.xlsx"], analysis: ["Stakeholder influence mapping", "Engagement timeline modelling", "Requirements shaping analysis"] },
]

const LIVE_UPDATES = [
  { id: 1, section: "commercial", text: "Commercial Strategy updated — price band narrowed to £47–53m", time: 0, artefact: "Commercial Strategy Generation.xlsx" },
  { id: 2, section: "ghosting", text: "Ghosting Strategy revised — new Capita contract award identified", time: 4000, artefact: "Competitor SWOT.xlsx" },
  { id: 3, section: "winThemes", text: "Win Theme 2 strengthened — evaluation criteria weighting updated", time: 8000, artefact: "Evaluation Drivers.docx" },
  { id: 4, section: "relationships", text: "Stakeholder map updated — SRO engagement activity analysed", time: 12000, artefact: "Client Insights.xlsx" },
  { id: 5, section: "executive", text: "Executive Summary refreshed — win likelihood revised upward", time: 16000, artefact: "Bid Context.xlsx" },
  { id: 6, section: "commercial", text: "Price-to-win confirmed — competitor pricing intelligence updated", time: 20000, artefact: "Commercial Strategy Generation.xlsx" },
]

const TAG_COLORS: Record<string, { bg: string; text: string }> = {
  Overview: { bg: "rgba(255,255,255,0.08)", text: G.textSecondary },
  Strategy: { bg: "rgba(0,205,146,0.12)", text: G.green },
  Competitive: { bg: "rgba(220,60,60,0.12)", text: G.red },
  Pricing: { bg: "rgba(39,137,108,0.15)", text: G.deepGreen },
  Engagement: { bg: "rgba(255,255,255,0.08)", text: G.textSecondary },
}

const EFFORT_COLORS: Record<string, string> = { Low: G.green, Medium: G.amber, High: G.red, "N/A": G.textMuted }

const STATUS_CONFIG: Record<string, { bg: string; text: string; border: string }> = {
  "Not started": { bg: "rgba(220,60,60,0.08)", text: G.red, border: "rgba(220,60,60,0.2)" },
  "In progress": { bg: "rgba(232,148,0,0.1)", text: "#c07000", border: "rgba(232,148,0,0.2)" },
  "Complete": { bg: "rgba(0,205,146,0.1)", text: G.deepGreen, border: "rgba(0,205,146,0.2)" },
}

function SectionLabel({ children, color = G.green }: { children: React.ReactNode; color?: string }) {
  return (
    <div style={{ display: "inline-block", background: color, color: "#fff", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", padding: "5px 12px", borderRadius: 999, marginBottom: 16 }}>
      {children}
    </div>
  )
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return <h2 style={{ fontSize: "clamp(24px, 4vw, 36px)", fontWeight: 800, color: G.textPrimary, margin: "0 0 12px", lineHeight: 1.1, letterSpacing: "-0.02em" }}>{children}</h2>
}

function Card({ children, style = {} }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return <div style={{ background: G.card, border: `1px solid ${G.cardBorder}`, borderRadius: 16, padding: "20px", ...style }}>{children}</div>
}

function DarkCard({ children, style = {} }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return <div style={{ background: G.darkCard, border: `1px solid ${G.darkCardBorder}`, borderRadius: 16, padding: "20px", ...style }}>{children}</div>
}

// ─── PANEL 1: CAPTURE PLAN ────────────────────────────────────────────────────
function CapturePlan({ winLikelihood, activeComposition }: { winLikelihood: number; activeComposition: string }) {
  const isMobile = useIsMobile()
  const [hoveredSection, setHoveredSection] = useState<string | null>(null)
  const [flashedSections, setFlashedSections] = useState<Record<string, number>>({})
  const [liveUpdates, setLiveUpdates] = useState<typeof LIVE_UPDATES>([])
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([])
  const cycleRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const composition = COMPOSITIONS.find(c => c.id === activeComposition)

  const startUpdates = () => {
    timersRef.current.forEach(t => clearTimeout(t))
    timersRef.current = []
    setLiveUpdates([])
    LIVE_UPDATES.forEach(update => {
      const t = setTimeout(() => {
        setLiveUpdates(prev => [update, ...prev].slice(0, 5))
        setFlashedSections(prev => ({ ...prev, [update.section]: Date.now() }))
        setTimeout(() => setFlashedSections(prev => { const n = { ...prev }; delete n[update.section]; return n }), 1800)
      }, update.time)
      timersRef.current.push(t)
    })
    cycleRef.current = setTimeout(startUpdates, LIVE_UPDATES[LIVE_UPDATES.length - 1].time + 5000)
  }

  useEffect(() => {
    startUpdates()
    return () => {
      timersRef.current.forEach(t => clearTimeout(t))
      if (cycleRef.current) clearTimeout(cycleRef.current)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <section className="bd-section">
      <div style={{ marginBottom: 24 }}>
        <SectionLabel color={G.green}>01 — Live Capture Plan</SectionLabel>
        <SectionHeading>Your strategy, built and updated live.</SectionHeading>
        <p style={{ fontSize: 14, color: G.textSecondary, maxWidth: 480, lineHeight: 1.65, margin: 0 }}>
          Every section is grounded in Bandura&apos;s analysis. Hover any section to see what built it.
        </p>
      </div>

      <div className="bd-two-col">
        {/* Left: sections */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {CAPTURE_SECTIONS.map(section => {
            const isHovered = hoveredSection === section.id
            const isFlashing = !!flashedSections[section.id]
            const tagStyle = TAG_COLORS[section.tag] || TAG_COLORS.Overview
            return (
              <div
                key={section.id}
                onMouseEnter={() => !isMobile && setHoveredSection(section.id)}
                onMouseLeave={() => !isMobile && setHoveredSection(null)}
                onClick={() => isMobile && setHoveredSection(hoveredSection === section.id ? null : section.id)}
                style={{
                  background: isFlashing ? "rgba(0,205,146,0.06)" : isHovered ? "rgba(255,255,255,0.07)" : G.card,
                  border: `1px solid ${isFlashing ? G.green : isHovered ? "rgba(255,255,255,0.15)" : G.cardBorder}`,
                  borderRadius: 14, padding: "16px", cursor: isMobile ? "pointer" : "default",
                  transition: "all 0.25s ease", position: "relative", overflow: "hidden",
                }}
              >
                {isFlashing && <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${G.green}, ${G.deepGreen})`, borderRadius: "14px 14px 0 0" }} />}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8, marginBottom: 6 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1, minWidth: 0 }}>
                    <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: G.textPrimary }}>{section.title}</h3>
                    {isFlashing && <div style={{ background: G.green, color: "#fff", fontSize: 9, fontWeight: 700, letterSpacing: "0.06em", padding: "2px 7px", borderRadius: 999, textTransform: "uppercase", flexShrink: 0 }}>Updated</div>}
                  </div>
                  <div style={{ background: tagStyle.bg, color: tagStyle.text, fontSize: 10, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", padding: "3px 9px", borderRadius: 999, flexShrink: 0 }}>{section.tag}</div>
                </div>
                <p style={{ margin: 0, fontSize: 12, color: G.textSecondary, lineHeight: 1.65 }}>{section.content}</p>
                {isHovered && (
                  <div style={{ marginTop: 14, paddingTop: 12, borderTop: `1px solid ${G.divider}` }}>
                    <div style={{ marginBottom: 10 }}>
                      <div style={{ fontSize: 10, color: G.textMuted, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 6 }}>Built from artefacts</div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                        {section.artefacts.map(a => (
                          <div key={a} style={{ display: "inline-flex", alignItems: "center", gap: 4, background: "rgba(255,255,255,0.06)", border: `1px solid ${G.cardBorder}`, borderRadius: 6, padding: "3px 8px", fontSize: 11, color: G.textSecondary }}>
                            <span style={{ fontSize: 9 }}>{a.endsWith(".xlsx") ? "📊" : "📄"}</span>{a}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: 10, color: G.textMuted, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 6 }}>Analysis layers</div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                        {section.analysis.map((a, i) => (
                          <div key={i} style={{ display: "inline-flex", alignItems: "center", gap: 4, background: "rgba(0,205,146,0.07)", border: "1px solid rgba(0,205,146,0.18)", borderRadius: 6, padding: "3px 8px", fontSize: 11, color: G.deepGreen, fontWeight: 600 }}>
                            <div style={{ width: 4, height: 4, borderRadius: "50%", background: G.green, flexShrink: 0 }} />{a}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Right: live updates + composition */}
        <div className="bd-sidebar">
          <DarkCard>
            <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 14 }}>
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: G.green, boxShadow: `0 0 0 3px rgba(0,205,146,0.25)`, flexShrink: 0 }} />
              <span style={{ fontSize: 11, color: G.textPrimary, fontWeight: 700, letterSpacing: "0.05em" }}>LIVE UPDATES</span>
            </div>
            <div style={{ minHeight: 140 }}>
              {liveUpdates.length === 0 ? (
                <div style={{ color: G.textMuted, fontSize: 12, textAlign: "center", paddingTop: 24 }}>Monitoring for changes...</div>
              ) : liveUpdates.map((u, i) => (
                <div key={u.id} style={{ background: i === 0 ? "rgba(0,205,146,0.08)" : "rgba(255,255,255,0.03)", borderRadius: 8, padding: "9px 11px", marginBottom: 7, borderLeft: `3px solid ${i === 0 ? G.green : "transparent"}` }}>
                  <div style={{ fontSize: 11, color: i === 0 ? G.textPrimary : G.textMuted, lineHeight: 1.4, marginBottom: 4, fontWeight: i === 0 ? 600 : 400 }}>{u.text}</div>
                  <div style={{ fontSize: 10, color: G.textMuted }}>📄 {u.artefact}</div>
                </div>
              ))}
            </div>
          </DarkCard>
          {composition && (
            <Card style={{ marginTop: 12 }}>
              <div style={{ fontSize: 10, color: G.textMuted, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8 }}>Current composition</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: G.textPrimary, marginBottom: 4 }}>{composition.label}</div>
              <div style={{ fontSize: 11, color: G.textSecondary }}>{composition.description}</div>
              <div style={{ marginTop: 12, paddingTop: 10, borderTop: `1px solid ${G.divider}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 11, color: G.textMuted }}>Win likelihood</span>
                <span style={{ fontSize: 13, fontWeight: 800, color: G.green }}>{winLikelihood}%</span>
              </div>
            </Card>
          )}
        </div>
      </div>
    </section>
  )
}

// ─── PANEL 2: PRICE TO WIN ────────────────────────────────────────────────────
function PriceToWin({ activeComposition, setActiveComposition }: { activeComposition: string; setActiveComposition: (id: string) => void }) {
  const [animKey, setAnimKey] = useState(0)
  const composition = COMPOSITIONS.find(c => c.id === activeComposition)!
  const handleSelect = (id: string) => { setActiveComposition(id); setAnimKey(k => k + 1) }

  const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) => {
    if (active && payload?.length) return (
      <div style={{ background: "rgba(0,0,0,0.95)", border: `1px solid ${G.cardBorder}`, borderRadius: 10, padding: "10px 14px" }}>
        <div style={{ color: G.textMuted, fontSize: 11, marginBottom: 2 }}>Price Point</div>
        <div style={{ color: G.textPrimary, fontSize: 18, fontWeight: 700 }}>£{label}m</div>
        <div style={{ color: G.green, fontSize: 13, fontWeight: 600, marginTop: 4 }}>{payload[0]?.value}% win likelihood</div>
      </div>
    )
    return null
  }

  return (
    <section className="bd-section">
      <div style={{ marginBottom: 24 }}>
        <SectionLabel color={G.green}>02 — Price-to-Win Modelling</SectionLabel>
        <SectionHeading>Find your optimal price point.</SectionHeading>
        <p style={{ fontSize: 14, color: G.textSecondary, maxWidth: 480, lineHeight: 1.65, margin: 0 }}>
          Modelled across solution compositions and competitor pricing.
        </p>
      </div>

      {/* Composition selector */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        {COMPOSITIONS.map(c => (
          <button key={c.id} onClick={() => handleSelect(c.id)} style={{ background: activeComposition === c.id ? G.green : G.card, color: activeComposition === c.id ? "#000" : G.textSecondary, border: `1px solid ${activeComposition === c.id ? G.green : G.cardBorder}`, borderRadius: 999, padding: "7px 16px", fontSize: 13, fontWeight: activeComposition === c.id ? 700 : 500, cursor: "pointer", transition: "all 0.15s" }}>
            {c.label}
          </button>
        ))}
      </div>

      <div className="bd-two-col">
        <Card>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16, gap: 12, flexWrap: "wrap" }}>
            <div>
              <div style={{ fontSize: 12, color: G.textMuted, marginBottom: 2 }}>Solution: <span style={{ color: G.textPrimary, fontWeight: 700 }}>{composition.label}</span></div>
              <div style={{ fontSize: 11, color: G.textMuted }}>{composition.description}</div>
            </div>
            <div style={{ background: "rgba(0,205,146,0.08)", border: "1px solid rgba(0,205,146,0.2)", borderRadius: 10, padding: "7px 12px", textAlign: "right", flexShrink: 0 }}>
              <div style={{ fontSize: 10, color: G.textMuted }}>Sweet spot</div>
              <div style={{ fontSize: 15, fontWeight: 800, color: G.green }}>£{composition.sweetSpot.price}m → {composition.sweetSpot.win}%</div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={240} key={animKey}>
            <ComposedChart data={composition.data} margin={{ top: 10, right: 8, left: -8, bottom: 10 }}>
              <defs>
                <linearGradient id="wg2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={composition.color} stopOpacity={0.2} />
                  <stop offset="95%" stopColor={composition.color} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
              <XAxis dataKey="price" tickFormatter={v => `£${v}m`} tick={{ fill: G.textMuted, fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tickFormatter={v => `${v}%`} tick={{ fill: G.textMuted, fontSize: 10 }} axisLine={false} tickLine={false} domain={[0, 100]} />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceArea x1={composition.sweetSpotRange[0]} x2={composition.sweetSpotRange[1]} fill={G.green} fillOpacity={0.06} strokeOpacity={0} />
              {COMPETITORS_PTW.map(c => (
                <ReferenceLine key={c.name} x={c.price} stroke={G.textMuted} strokeDasharray="4 4" strokeWidth={1.5}
                  label={{ value: c.name, position: "top", fill: G.textMuted, fontSize: 9, fontWeight: 600 }} />
              ))}
              <Area type="monotone" dataKey="win" stroke={composition.color} strokeWidth={2.5} fill="url(#wg2)" dot={false}
                activeDot={{ r: 5, fill: composition.color, strokeWidth: 0 }} animationDuration={500} animationEasing="ease-out" />
            </ComposedChart>
          </ResponsiveContainer>
        </Card>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <DarkCard>
            <div style={{ fontSize: 10, color: G.textMuted, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10 }}>Bandura recommends</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: G.green, marginBottom: 6, letterSpacing: "-0.02em" }}>£{composition.sweetSpot.price}m</div>
            <div style={{ fontSize: 12, color: G.textSecondary, lineHeight: 1.6 }}>
              {composition.label} at this price point gives the highest win likelihood at{" "}
              <span style={{ color: G.green, fontWeight: 700 }}>{composition.sweetSpot.win}%</span> before competitor pressure compresses your advantage.
            </div>
          </DarkCard>
          <Card>
            <div style={{ fontSize: 10, color: G.textMuted, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 12 }}>All compositions</div>
            {COMPOSITIONS.map(c => (
              <div key={c.id} onClick={() => handleSelect(c.id)} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 10px", borderRadius: 8, marginBottom: 4, cursor: "pointer", background: activeComposition === c.id ? "rgba(0,205,146,0.08)" : "transparent" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: c.color, flexShrink: 0 }} />
                  <span style={{ fontSize: 12, fontWeight: activeComposition === c.id ? 700 : 400, color: G.textPrimary }}>{c.label}</span>
                </div>
                <span style={{ fontSize: 12, fontWeight: 700, color: activeComposition === c.id ? G.green : G.textMuted }}>{c.sweetSpot.win}%</span>
              </div>
            ))}
          </Card>
        </div>
      </div>
    </section>
  )
}

// ─── PANEL 3: COMPETITIVE READINESS ──────────────────────────────────────────
function CompetitiveReadiness({ enabledInvestments }: { enabledInvestments: Record<string, boolean> }) {
  const isMobile = useIsMobile()
  const [expandedBucket, setExpandedBucket] = useState<string | null>("investment")
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null)

  const getScenarios = (id: string) => SCENARIOS.filter(s => s.bucket === id)
  const avgLikelihood = (id: string) => { const s = getScenarios(id); return s.length ? Math.round(s.reduce((a, b) => a + b.likelihood, 0) / s.length) : 0 }
  const totalImpact = (id: string) => getScenarios(id).reduce((a, b) => a + b.impact, 0)
  const selectedDetail = SCENARIOS.find(s => s.id === selectedScenario) as (typeof SCENARIOS[0] & { investmentRequired?: string; riskNote?: string }) | undefined
  const selectedBucket = selectedDetail ? BUCKETS.find(b => b.id === selectedDetail.bucket) : null
  const linkedScenarioIds = INVESTMENTS.filter(i => enabledInvestments[i.id]).flatMap(i => i.scenarioLinks)
  const getImpactColor = (v: number) => v >= 18 ? G.red : v >= 9 ? G.amber : G.green

  return (
    <section className="bd-section">
      <div style={{ marginBottom: 24 }}>
        <SectionLabel color={G.deepGreen}>03 — Competitive Readiness</SectionLabel>
        <SectionHeading>Scenario Modelling</SectionHeading>
        <p style={{ fontSize: 14, color: G.textSecondary, maxWidth: 480, lineHeight: 1.65, margin: 0 }}>
          Every move each competitor could make and whether you can mitigate it.
        </p>
      </div>

      {/* Legend */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap", alignItems: "center" }}>
        <span style={{ fontSize: 11, color: G.textMuted, fontWeight: 600 }}>Win impact if unmitigated:</span>
        {[{ label: "Severe (18%+)", color: G.red }, { label: "Significant (9–17%)", color: G.amber }, { label: "Manageable (<9%)", color: G.green }].map(s => (
          <div key={s.label} style={{ display: "flex", alignItems: "center", gap: 5, background: G.card, border: `1px solid ${G.cardBorder}`, borderRadius: 8, padding: "4px 10px" }}>
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: s.color, flexShrink: 0 }} />
            <span style={{ fontSize: 11, color: G.textSecondary }}>{s.label}</span>
          </div>
        ))}
      </div>

      {/* Main content: bucket list + detail panel */}
      <div className={selectedDetail && !isMobile ? "bd-comp-split" : undefined}>
        {/* Buckets */}
        <div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {BUCKETS.map(bucket => {
              const scenarios = getScenarios(bucket.id)
              const isExpanded = expandedBucket === bucket.id
              return (
                <div key={bucket.id}>
                  {/* Bucket header */}
                  <div
                    onClick={() => setExpandedBucket(isExpanded ? null : bucket.id)}
                    style={{ background: isExpanded ? "rgba(255,255,255,0.08)" : G.card, border: `1px solid ${isExpanded ? "rgba(255,255,255,0.15)" : G.cardBorder}`, borderRadius: isExpanded ? "14px 14px 0 0" : 14, padding: "14px 16px", cursor: "pointer", display: "flex", alignItems: "center", gap: 12, transition: "all 0.2s" }}
                  >
                    {/* Icon */}
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: bucket.bgColor, border: `1px solid ${bucket.borderColor}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <span style={{ fontSize: 15, fontWeight: 800, color: bucket.color, lineHeight: 1 }}>{scenarios.length}</span>
                      <span style={{ fontSize: 9, color: bucket.textColor, fontWeight: 600 }}>{bucket.icon}</span>
                    </div>
                    {/* Label */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 14, fontWeight: 800, color: G.textPrimary, marginBottom: 2 }}>{bucket.label}</div>
                      <div style={{ fontSize: 12, color: G.textSecondary, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{bucket.implication}</div>
                    </div>
                    {/* Stats */}
                    <div style={{ display: "flex", gap: 12, flexShrink: 0 }}>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: 10, color: G.textMuted, whiteSpace: "nowrap" }}>avg likely</div>
                        <div style={{ fontSize: 16, fontWeight: 800, color: G.textSecondary }}>{avgLikelihood(bucket.id)}%</div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: 10, color: G.textMuted, whiteSpace: "nowrap" }}>total impact</div>
                        <div style={{ fontSize: 16, fontWeight: 800, color: bucket.color }}>-{totalImpact(bucket.id)}%</div>
                      </div>
                    </div>
                    <div style={{ fontSize: 12, color: G.textMuted, transform: isExpanded ? "rotate(180deg)" : "none", transition: "transform 0.2s", flexShrink: 0 }}>▼</div>
                  </div>

                  {/* Expanded scenario rows */}
                  {isExpanded && (
                    <div style={{ background: "rgba(255,255,255,0.02)", border: `1px solid ${G.cardBorder}`, borderTop: "none", borderRadius: "0 0 14px 14px" }}>
                      {scenarios.map((sc, i) => {
                        const isSelected = selectedScenario === sc.id
                        const isLinked = linkedScenarioIds.includes(sc.id)
                        const impactColor = getImpactColor(sc.impact)
                        return (
                          <div
                            key={sc.id}
                            onClick={() => setSelectedScenario(isSelected ? null : sc.id)}
                            style={{ padding: "12px 16px", borderBottom: i < scenarios.length - 1 ? `1px solid ${G.divider}` : "none", cursor: "pointer", background: isSelected ? "rgba(255,255,255,0.06)" : isLinked ? "rgba(0,205,146,0.03)" : "transparent", transition: "background 0.15s" }}
                          >
                            {/* Mobile-friendly row: stacked */}
                            <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                              {/* Competitor tag */}
                              <div style={{ fontSize: 9, color: G.textMuted, fontWeight: 600, background: "rgba(255,255,255,0.06)", borderRadius: 4, padding: "2px 6px", lineHeight: 1.5, flexShrink: 0, marginTop: 2 }}>{sc.competitor.split(" ")[0]}</div>
                              {/* Title + position */}
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap", marginBottom: 3 }}>
                                  <span style={{ fontSize: 13, fontWeight: 700, color: G.textPrimary }}>{sc.title}</span>
                                  {isLinked && <span style={{ fontSize: 9, color: G.deepGreen, background: "rgba(0,205,146,0.1)", borderRadius: 4, padding: "1px 5px", fontWeight: 700, flexShrink: 0 }}>Investment active ✓</span>}
                                </div>
                                <div style={{ fontSize: 11, color: G.textSecondary, lineHeight: 1.4 }}>{sc.currentPosition.substring(0, 90)}...</div>
                                {/* Stats row — always visible inline */}
                                <div style={{ display: "flex", gap: 12, marginTop: 8, flexWrap: "wrap" }}>
                                  <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                                    <span style={{ fontSize: 10, color: G.textMuted }}>Likelihood:</span>
                                    <span style={{ fontSize: 13, fontWeight: 800, color: sc.likelihood >= 70 ? G.red : sc.likelihood >= 40 ? G.amber : G.green }}>{sc.likelihood}%</span>
                                  </div>
                                  <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                                    <span style={{ fontSize: 10, color: G.textMuted }}>Win impact:</span>
                                    <span style={{ fontSize: 13, fontWeight: 800, color: impactColor }}>-{sc.impact}%</span>
                                  </div>
                                </div>
                              </div>
                              <div style={{ fontSize: 11, color: isSelected ? G.textPrimary : G.textMuted, flexShrink: 0, paddingTop: 2 }}>{isSelected ? "◀" : "▶"}</div>
                            </div>

                            {/* Expanded detail inline (mobile) or hidden (desktop uses side panel) */}
                            {isSelected && isMobile && selectedBucket && (
                              <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${G.divider}` }}>
                                <div style={{ fontSize: 10, color: G.textMuted, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>
                                  {sc.bucket === "unmitigatable" ? "How to absorb it" : "Actions required"}
                                </div>
                                {sc.actions.map((a, ai) => (
                                  <div key={ai} style={{ display: "flex", gap: 7, marginBottom: 5 }}>
                                    <div style={{ width: 5, height: 5, borderRadius: "50%", background: selectedBucket.color, marginTop: 5, flexShrink: 0 }} />
                                    <span style={{ fontSize: 12, color: G.textSecondary, lineHeight: 1.5 }}>{a}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Summary bar */}
          <div style={{ marginTop: 12, background: G.card, border: `1px solid ${G.cardBorder}`, borderRadius: 10, padding: "10px 16px", display: "flex", gap: 16, flexWrap: "wrap", alignItems: "center" }}>
            {BUCKETS.map(b => (
              <div key={b.id} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 7, height: 7, borderRadius: "50%", background: b.color, flexShrink: 0 }} />
                <span style={{ fontSize: 11, color: G.textSecondary }}><span style={{ fontWeight: 700, color: G.textPrimary }}>{getScenarios(b.id).length}</span> {b.label.toLowerCase()}</span>
              </div>
            ))}
            <span style={{ fontSize: 11, color: G.textMuted, marginLeft: "auto" }}>{SCENARIOS.length} total · 4 competitors</span>
          </div>
        </div>

        {/* Desktop detail panel */}
        {selectedDetail && selectedBucket && !isMobile && (
          <DarkCard>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
              <div>
                <div style={{ fontSize: 10, color: G.textMuted, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 3 }}>{selectedDetail.competitor}</div>
                <div style={{ fontSize: 16, fontWeight: 800, color: G.textPrimary, lineHeight: 1.2 }}>{selectedDetail.title}</div>
              </div>
              <div onClick={() => setSelectedScenario(null)} style={{ color: G.textMuted, cursor: "pointer", fontSize: 16, padding: 4 }}>✕</div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 16 }}>
              <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 10, padding: "10px 12px", textAlign: "center" }}>
                <div style={{ fontSize: 10, color: G.textMuted, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>Likelihood</div>
                <div style={{ fontSize: 24, fontWeight: 800, color: selectedDetail.likelihood >= 70 ? G.red : selectedDetail.likelihood >= 40 ? G.amber : G.green }}>{selectedDetail.likelihood}%</div>
              </div>
              <div style={{ background: `${getImpactColor(selectedDetail.impact)}12`, border: `1px solid ${getImpactColor(selectedDetail.impact)}25`, borderRadius: 10, padding: "10px 12px", textAlign: "center" }}>
                <div style={{ fontSize: 10, color: G.textMuted, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>Win impact</div>
                <div style={{ fontSize: 24, fontWeight: 800, color: getImpactColor(selectedDetail.impact) }}>-{selectedDetail.impact}%</div>
              </div>
            </div>
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 10, color: G.textMuted, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 6 }}>Your current position</div>
              <p style={{ fontSize: 12, color: G.textSecondary, lineHeight: 1.65, margin: 0 }}>{selectedDetail.currentPosition}</p>
            </div>
            <div style={{ marginBottom: selectedDetail.riskNote || selectedDetail.investmentRequired ? 14 : 0 }}>
              <div style={{ fontSize: 10, color: G.textMuted, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8 }}>
                {selectedDetail.bucket === "unmitigatable" ? "How to absorb it" : "Actions required"}
              </div>
              {selectedDetail.actions.map((a, i) => (
                <div key={i} style={{ display: "flex", gap: 7, marginBottom: 6 }}>
                  <div style={{ width: 5, height: 5, borderRadius: "50%", background: selectedBucket.color, marginTop: 5, flexShrink: 0 }} />
                  <span style={{ fontSize: 12, color: G.textSecondary, lineHeight: 1.55 }}>{a}</span>
                </div>
              ))}
            </div>
            {selectedDetail.investmentRequired && (
              <div style={{ background: "rgba(232,148,0,0.08)", border: "1px solid rgba(232,148,0,0.2)", borderRadius: 10, padding: "12px 14px", marginTop: 8 }}>
                <div style={{ fontSize: 10, color: G.amber, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 4 }}>Investment required</div>
                <div style={{ fontSize: 12, color: G.textSecondary, lineHeight: 1.5 }}>{selectedDetail.investmentRequired}</div>
              </div>
            )}
            {selectedDetail.riskNote && (
              <div style={{ background: "rgba(220,60,60,0.08)", border: "1px solid rgba(220,60,60,0.2)", borderRadius: 10, padding: "12px 14px", marginTop: 8 }}>
                <div style={{ fontSize: 10, color: G.red, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 4 }}>Bid risk note</div>
                <div style={{ fontSize: 12, color: G.textSecondary, lineHeight: 1.5 }}>{selectedDetail.riskNote}</div>
              </div>
            )}
          </DarkCard>
        )}
      </div>
    </section>
  )
}

// ─── PANEL 4: WHAT IT TAKES ───────────────────────────────────────────────────
function WhatItTakes({ enabledInvestments, setEnabledInvestments, winLikelihood }: { enabledInvestments: Record<string, boolean>; setEnabledInvestments: React.Dispatch<React.SetStateAction<Record<string, boolean>>>; winLikelihood: number }) {
  const [expanded, setExpanded] = useState<string | null>(null)
  const totalImpact = INVESTMENTS.filter(i => enabledInvestments[i.id]).reduce((a, b) => a + b.winImpact, 0)
  const pct = Math.min(BASE_WIN + totalImpact, 97)
  const grouped = INVESTMENTS.reduce<Record<string, typeof INVESTMENTS>>((acc, inv) => {
    if (!acc[inv.category]) acc[inv.category] = []
    acc[inv.category].push(inv)
    return acc
  }, {})
  const toggle = (id: string) => setEnabledInvestments(prev => ({ ...prev, [id]: !prev[id] }))

  return (
    <section className="bd-section" style={{ marginBottom: 0 }}>
      <div style={{ marginBottom: 24 }}>
        <SectionLabel color={G.amber}>04 — What It Will Take to Win</SectionLabel>
        <SectionHeading>Pursuit Opportunities</SectionHeading>
        <p style={{ fontSize: 14, color: G.textSecondary, maxWidth: 480, lineHeight: 1.65, margin: 0 }}>
          Toggle actions on and off to see impact on your win likelihood.
        </p>
      </div>

      <div className="bd-two-col">
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {Object.entries(grouped).map(([category, items]) => (
            <div key={category}>
              <div style={{ fontSize: 10, color: G.textMuted, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", margin: "12px 0 6px 4px" }}>{category}</div>
              {items.map(inv => {
                const isOn = enabledInvestments[inv.id]
                const isExpanded = expanded === inv.id
                const statusCfg = STATUS_CONFIG[inv.status]
                return (
                  <div key={inv.id} style={{ background: isOn ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.02)", border: `1px solid ${isExpanded ? G.green : isOn ? "rgba(255,255,255,0.1)" : G.cardBorder}`, borderRadius: 12, padding: "14px", marginBottom: 6, opacity: isOn ? 1 : 0.5, transition: "all 0.2s" }}>
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                      {/* Toggle */}
                      <div onClick={() => toggle(inv.id)} style={{ width: 34, height: 19, borderRadius: 999, background: isOn ? G.green : G.textMuted, position: "relative", cursor: "pointer", flexShrink: 0, marginTop: 2, transition: "background 0.2s" }}>
                        <div style={{ width: 13, height: 13, borderRadius: "50%", background: "#fff", position: "absolute", top: 3, left: isOn ? 18 : 3, transition: "left 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.4)" }} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                          <div onClick={() => setExpanded(isExpanded ? null : inv.id)} style={{ cursor: "pointer", flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 13, fontWeight: 700, color: G.textPrimary, marginBottom: 3 }}>{inv.title}</div>
                            <div style={{ fontSize: 12, color: G.textSecondary, lineHeight: 1.5 }}>{inv.description}</div>
                          </div>
                          <div style={{ flexShrink: 0, textAlign: "right" }}>
                            <div style={{ fontSize: 20, fontWeight: 800, color: isOn ? G.green : G.textMuted, lineHeight: 1 }}>+{inv.winImpact}%</div>
                            <div style={{ fontSize: 10, color: G.textMuted, marginTop: 1 }}>win impact</div>
                          </div>
                        </div>
                        <div style={{ display: "flex", gap: 6, marginTop: 8, flexWrap: "wrap" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 4, background: statusCfg.bg, border: `1px solid ${statusCfg.border}`, borderRadius: 6, padding: "2px 7px" }}>
                            <div style={{ width: 4, height: 4, borderRadius: "50%", background: statusCfg.text, flexShrink: 0 }} />
                            <span style={{ fontSize: 10, fontWeight: 600, color: statusCfg.text }}>{inv.status}</span>
                          </div>
                          <div style={{ fontSize: 10, color: G.textMuted, background: "rgba(255,255,255,0.05)", borderRadius: 6, padding: "2px 7px" }}>Effort: <span style={{ fontWeight: 700, color: EFFORT_COLORS[inv.effort] }}>{inv.effort}</span></div>
                          {inv.scenarioLinks.length > 0 && <div style={{ fontSize: 10, color: G.deepGreen, background: "rgba(0,205,146,0.08)", borderRadius: 6, padding: "2px 7px", fontWeight: 600 }}>Neutralises {inv.scenarioLinks.length} scenario{inv.scenarioLinks.length > 1 ? "s" : ""}</div>}
                        </div>
                        {isExpanded && (
                          <div style={{ marginTop: 12, paddingTop: 10, borderTop: `1px solid ${G.divider}` }}>
                            {inv.actions.map((a, i) => (
                              <div key={i} style={{ display: "flex", gap: 7, marginBottom: 5 }}>
                                <div style={{ width: 5, height: 5, borderRadius: "50%", background: G.green, marginTop: 5, flexShrink: 0 }} />
                                <span style={{ fontSize: 12, color: G.textSecondary, lineHeight: 1.5 }}>{a}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          ))}
        </div>

        {/* Win likelihood gauge */}
        <div className="bd-sidebar">
          <DarkCard>
            <div style={{ fontSize: 10, color: G.textMuted, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 16 }}>Win likelihood</div>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
              <svg width="180" height="100" viewBox="0 0 180 100">
                <path d="M 18 90 A 72 72 0 0 1 162 90" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="12" strokeLinecap="round" />
                <path d="M 18 90 A 72 72 0 0 1 162 90" fill="none" stroke={G.green} strokeWidth="12" strokeLinecap="round"
                  strokeDasharray={`${(pct / 100) * 226} 226`} style={{ transition: "stroke-dasharray 0.5s ease" }} />
                <text x="90" y="82" textAnchor="middle" fill="#fff" fontSize="38" fontWeight="800">{pct}%</text>
              </svg>
            </div>
            <div style={{ borderTop: `1px solid ${G.divider}`, paddingTop: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontSize: 11, color: G.textSecondary }}>Baseline</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: G.red }}>{BASE_WIN}%</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontSize: 11, color: G.textSecondary }}>Investment uplift</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: G.green }}>+{totalImpact}%</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: 12, color: G.textPrimary, fontWeight: 700 }}>Current projection</span>
                <span style={{ fontSize: 12, fontWeight: 800, color: G.green }}>{pct}%</span>
              </div>
            </div>
          </DarkCard>
        </div>
      </div>
    </section>
  )
}

// ─── MAIN EXPORT ──────────────────────────────────────────────────────────────
export default function BanduraDashboard() {
  const [enabledInvestments, setEnabledInvestments] = useState<Record<string, boolean>>(
    INVESTMENTS.reduce((acc, inv) => ({ ...acc, [inv.id]: true }), {})
  )
  const [activeComposition, setActiveComposition] = useState("full")

  const totalImpact = INVESTMENTS.filter(i => enabledInvestments[i.id]).reduce((a, b) => a + b.winImpact, 0)
  const winLikelihood = Math.min(BASE_WIN + totalImpact, 97)
  const composition = COMPOSITIONS.find(c => c.id === activeComposition)

  return (
    <section className="bg-black border-t border-white/10">
      <div className="container mx-auto px-4 sm:px-6 py-16 sm:py-24">
        {/* Section intro */}
        <div className="mb-12 max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 tracking-tight text-white">
            See Bandura in action
          </h2>
          <p className="text-base sm:text-lg text-gray-400">
            A live walkthrough of how Bandura builds and updates your win strategy — capture planning, price-to-win modelling, scenario readiness, and pursuit investment — all in one place.
          </p>
        </div>

        {/* Dashboard chrome */}
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, overflow: "hidden" }}>
          {/* Top bar */}
          <div style={{ background: "rgba(255,255,255,0.04)", borderBottom: "1px solid rgba(255,255,255,0.08)", padding: "0 16px" }}>
            <div style={{ display: "flex", alignItems: "center", height: 56, gap: 12, flexWrap: "wrap" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: G.green, boxShadow: `0 0 0 3px rgba(0,205,146,0.2)`, flexShrink: 0 }} />
                <span style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>Bandura</span>
              </div>
              <div style={{ height: 16, width: 1, background: "rgba(255,255,255,0.1)" }} />
              <span className="hidden sm:block" style={{ fontSize: 12, color: G.textMuted }}>HMRC Digital Transformation — £55m pursuit</span>
              <div style={{ flex: 1 }} />
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(0,205,146,0.1)", border: "1px solid rgba(0,205,146,0.2)", borderRadius: 999, padding: "5px 12px" }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: G.green, flexShrink: 0 }} />
                  <span className="hidden sm:inline" style={{ fontSize: 12, color: G.textSecondary }}>Win likelihood</span>
                  <span style={{ fontSize: 15, fontWeight: 800, color: G.green, transition: "all 0.4s ease" }}>{winLikelihood}%</span>
                </div>
                <span className="hidden md:block" style={{ fontSize: 11, color: G.textMuted }}>£{composition?.sweetSpot.price}m · {composition?.label}</span>
              </div>
            </div>
          </div>

          {/* Panels */}
          <div style={{ padding: "28px 16px" }} className="sm:p-8">
            <CapturePlan winLikelihood={winLikelihood} activeComposition={activeComposition} />
            <div style={{ width: "100%", height: 1, background: "rgba(255,255,255,0.06)", margin: "0 0 56px" }} />
            <PriceToWin activeComposition={activeComposition} setActiveComposition={setActiveComposition} />
            <div style={{ width: "100%", height: 1, background: "rgba(255,255,255,0.06)", margin: "0 0 56px" }} />
            <CompetitiveReadiness enabledInvestments={enabledInvestments} />
            <div style={{ width: "100%", height: 1, background: "rgba(255,255,255,0.06)", margin: "0 0 56px" }} />
            <WhatItTakes enabledInvestments={enabledInvestments} setEnabledInvestments={setEnabledInvestments} winLikelihood={winLikelihood} />
          </div>
        </div>
      </div>

      <style>{`
        .bd-section { margin-bottom: 56px; }
        /* Two-column grid: stacks on mobile */
        .bd-two-col { display: grid; grid-template-columns: 1fr; gap: 16px; }
        @media (min-width: 768px) { .bd-two-col { grid-template-columns: 1fr 240px; } }
        /* Sidebar: not sticky on mobile */
        .bd-sidebar { }
        @media (min-width: 768px) { .bd-sidebar { position: sticky; top: 100px; } }
        /* Competitive readiness split */
        .bd-comp-split { display: grid; grid-template-columns: 1fr; gap: 16px; }
        @media (min-width: 768px) { .bd-comp-split { grid-template-columns: 1fr 300px; } }
        /* Inner panel padding override */
        @media (min-width: 640px) { .sm\\:p-8 { padding: 32px !important; } }
        @keyframes slideIn { from { opacity: 0; transform: translateX(12px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </section>
  )
}
