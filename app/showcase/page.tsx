import Navbar from "@/components/ui/navbar"
import BanduraNetwork from "@/components/ui/bandura-network"
import { LetsWorkTogether } from "@/components/ui/lets-work-section"

export const metadata = {
  title: "See it Live — Bandura",
  description: "See Bandura's bid strategy intelligence in action with an interactive live demo.",
}

export default function ShowcasePage() {
  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-purple-500/30 overflow-x-hidden">
      <Navbar />

      {/* Hero */}
      <section className="pt-40 pb-16 px-4 sm:px-8 text-center max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium text-white/70 backdrop-blur-md mb-8">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400" />
          </span>
          Live Demo
        </div>

        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6 leading-none">
          See Bandura{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
            in Action
          </span>
        </h1>

        <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
          Watch how Bandura automatically maps your bid landscape, identifies key decision nodes, 
          and builds a winning strategy — all before your competition even starts.
        </p>
      </section>

      {/* Interactive Demo */}
      <section className="px-4 sm:px-8 pb-24 max-w-7xl mx-auto">
        <div className="rounded-2xl border border-white/10 overflow-hidden shadow-2xl shadow-purple-500/5">
          <BanduraNetwork />
        </div>
      </section>

      {/* Explanation */}
      <section className="py-24 px-4 sm:px-8 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-center mb-16">
            How the strategy engine works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Sourcing Intelligence",
                description:
                  "Bandura ingests your market signals, past bids, and competitor data to build a live picture of the opportunity landscape.",
              },
              {
                step: "02",
                title: "Building Strategy",
                description:
                  "The network maps every decision node — pricing, teaming, risk posture — and surfaces the optimal path based on your win history.",
              },
              {
                step: "03",
                title: "Generating Outputs",
                description:
                  "Automatically produces tailored bid documents, pricing models, and executive summaries ready for review and submission.",
              },
            ].map(({ step, title, description }) => (
              <div
                key={step}
                className="p-8 rounded-2xl border border-white/5 bg-white/[0.02] hover:border-white/10 transition-all duration-300"
              >
                <div className="text-xs font-mono text-purple-400 mb-4 tracking-widest">{step}</div>
                <h3 className="text-xl font-semibold mb-3 text-white">{title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <LetsWorkTogether />
    </div>
  )
}
