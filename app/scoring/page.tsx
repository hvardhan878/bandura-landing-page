import BidScoringDashboard from "@/components/ui/bid-scoring-dashboard"

export const metadata = {
  title: "Bid Scoring — Bandura",
  description: "Run 1 million simulations across your evaluation criteria and competitor intelligence to predict your win probability.",
}

export default function ScoringPage() {
  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-purple-500/30">
      <BidScoringDashboard />
    </div>
  )
}
