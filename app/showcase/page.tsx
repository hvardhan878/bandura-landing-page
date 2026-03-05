import Navbar from "@/components/ui/navbar"
import BanduraDashboard from "@/components/ui/bandura-dashboard"
import { LetsWorkTogether } from "@/components/ui/lets-work-section"

export const metadata = {
  title: "See it Live — Bandura",
  description: "See Bandura in action: capture planning, price-to-win modelling, scenario readiness, and pursuit investment — all in one place.",
}

export default function ShowcasePage() {
  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-purple-500/30 overflow-x-hidden">
      <Navbar />

      <div className="pt-8">
        <BanduraDashboard />
      </div>

      <LetsWorkTogether />
    </div>
  )
}
