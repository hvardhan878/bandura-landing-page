"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { LogoCloud } from "@/components/ui/logo-cloud-3"
import { SplineSceneBasic } from "@/components/ui/demo"
import { GlowingEffectDemo } from "@/components/ui/glowing-effect-demo"
import { LetsWorkTogether } from "@/components/ui/lets-work-section"
import { cn } from "@/lib/utils"

export default function Home() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    // Add BreadcrumbList structured data
    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: "https://bandurai.com",
        },
      ],
    }

    const script = document.createElement("script")
    script.type = "application/ld+json"
    script.text = JSON.stringify(breadcrumbSchema)
    document.head.appendChild(script)

    return () => {
      document.head.removeChild(script)
    }
  }, [])

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-purple-500/30 overflow-x-hidden" style={{ transform: 'translateZ(0)' }}>
      
      {/* Header Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 sm:px-8 py-6 max-w-7xl mx-auto w-full">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <img 
            src="/mark.png" 
            alt="Bandura Logo" 
            className="h-10 w-10 object-contain -mb-0.5"
          />
          <div className="text-3xl font-bold tracking-tighter text-white">Bandura</div>
        </div>

        {/* Navigation - Glass UI */}
        <nav className="hidden md:flex items-center gap-1 rounded-full border border-white/10 bg-white/5 p-1 backdrop-blur-md" style={{ transform: 'translateZ(0)' }}>
            <a
              href="#features"
              className="text-white/90 hover:text-white text-sm font-medium px-6 py-2.5 rounded-full hover:bg-white/10 transition-all duration-200"
            >
              Features
            </a>
          <a
            href="/privacy"
            className="text-white/90 hover:text-white text-sm font-medium px-6 py-2.5 rounded-full hover:bg-white/10 transition-all duration-200"
          >
            Privacy
          </a>
          {/* <a
            href="#security"
            className="text-white/90 hover:text-white text-sm font-medium px-6 py-2.5 rounded-full hover:bg-white/10 transition-all duration-200"
          >
            Security
          </a>
          <a
            href="#customers"
            className="text-white/90 hover:text-white text-sm font-medium px-6 py-2.5 rounded-full hover:bg-white/10 transition-all duration-200"
          >
            Customers
          </a> */}
        </nav>

        {/* Login & Liquid Button */}
        <div className="hidden sm:flex items-center gap-4">
          <div className="h-10 w-32">
            <a
              href="https://calendly.com/johann-bandurai/30min"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full h-full text-white font-medium inline-flex items-center justify-center cursor-pointer rounded-md transition-all duration-300 hover:scale-105"
            >
              Request Demo
            </a>
          </div>
        </div>
        {/* Mobile Menu Button */}
        <div className="md:hidden text-white">
          <Button 
            variant="ghost" 
            size="icon" 
            className="hover:bg-white/10"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            )}
          </Button>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 top-[72px] z-40 md:hidden bg-black/95 backdrop-blur-md border-t border-white/10">
          <nav className="flex flex-col px-6 py-8 space-y-4">
            <a
              href="#features"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-white/90 hover:text-white text-base font-medium py-3 px-4 rounded-lg hover:bg-white/10 transition-all duration-200"
            >
              Features
            </a>
            <a
              href="/privacy"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-white/90 hover:text-white text-base font-medium py-3 px-4 rounded-lg hover:bg-white/10 transition-all duration-200"
            >
              Privacy
            </a>
            <a
              href="https://calendly.com/johann-bandurai/30min"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsMobileMenuOpen(false)}
              className="mt-4 inline-flex items-center justify-center px-6 py-3 rounded-lg bg-white text-black font-medium text-sm transition-all duration-200 hover:bg-gray-200"
            >
              Request Demo
            </a>
          </nav>
        </div>
      )}

      <main>
      {/* Hero Section with 3D Spline Scene */}
      <section className="pt-24 bg-black">
        <SplineSceneBasic />
      </section>

      {/* Features Grid Section with Glowing Effect */}
      <section id="features" className="py-24 bg-black relative">
        <div className="container mx-auto px-6">
          <div className="mb-16 max-w-3xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight text-white">
              Embed strategy early. Win before the ITT drops.
            </h2>
            <p className="text-lg text-gray-400">
              Most bid teams engage too late. Bandura automates the strategic decisions that matter 6–9 months before the ITT — giving you the intelligence, alignment, and plans to shape deals before your competitors even know they exist.
            </p>
          </div>
          <div className="max-w-7xl mx-auto">
            <GlowingEffectDemo />
          </div>
        </div>
      </section>

      {/* Trusted By Section */}
      <section className="py-16 bg-black relative">
        <div
          aria-hidden="true"
          className={cn(
            "-z-10 -top-1/2 -translate-x-1/2 pointer-events-none absolute left-1/2 h-[120vmin] w-[120vmin] rounded-b-full",
            "bg-[radial-gradient(ellipse_at_center,var(--color-foreground)/.05,transparent_50%)]",
            "blur-[30px]"
          )}
        />
        <div className="container mx-auto px-6 relative z-10">
          <div className="relative mx-auto max-w-5xl">
            <h2 className="mb-5 text-center font-medium text-white text-xl tracking-tight md:text-3xl">
              {/* <span className="text-gray-400">Trusted by experts.</span>
              <br />
              <span className="font-semibold text-white">Used by the leaders.</span> */}
              <span className="font-semibold text-white">Made by experts from</span>
            </h2>
            <div className="mx-auto my-5 h-px max-w-sm bg-gray-700/50 [mask-image:linear-gradient(to_right,transparent,black,transparent)]" />
            <LogoCloud logos={logos} className="py-8" />
            <div className="mt-5 h-px bg-gray-700/50 [mask-image:linear-gradient(to_right,transparent,black,transparent)]" />
          </div>
        </div>
      </section>

      {/* Vision/Philosophy Section */}
      {/* <section className="bg-black text-white py-32 border-t border-white/10">
        <div className="container mx-auto px-6">
            <div className="max-w-5xl">
                <p className="text-xl md:text-2xl text-gray-400 mb-12 leading-relaxed max-w-3xl">
                    DOSA adapts to your workflow, unlocking team and machine collaboration at scale.
                </p>
                <h2 className="text-6xl md:text-8xl font-medium tracking-tighter leading-none">
                    DOSA meets professionals <br />
                    <span className="text-gray-500">where they are.</span>
                </h2>
            </div>
        </div>
      </section> */}

      {/* Testimonial Section */}
      {/* <TestimonialSection /> */}

      {/* Security Section */}
      {/* <SecuritySection /> */}

      {/* Solutions Section */}
      {/* <section id="solutions" className="py-24 bg-zinc-950">
        <div className="container mx-auto px-6">
          <div className="mb-16 max-w-2xl">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight text-white">
              Built for high-stakes decisions.
            </h2>
            <p className="text-lg text-gray-400">
              Specialized tools designed for the unique demands of underwriting and deal execution.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl">
            {[
              {
                title: "Underwriting",
                description: "Risk assessment and pricing."
              },
              {
                title: "Private Equity",
                description: "Deal review and investment memos."
              },
              {
                title: "Risk Analysis",
                description: "Complex factor analysis."
              },
              {
                title: "Deal Execution",
                description: "Strategy and deadline management."
              }
            ].map((solution, i) => (
              <div key={i} className="p-8 rounded-2xl border border-white/5 bg-black hover:border-white/20 transition-all duration-300 h-full flex flex-col justify-between group">
                <div>
                    <h3 className="text-xl font-bold mb-3 text-white group-hover:text-purple-300 transition-colors">{solution.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{solution.description}</p>
                </div>
                <div className="mt-8">
                    <svg className="w-5 h-5 text-gray-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* CTA Section */}
      <LetsWorkTogether />
      </main>

      {/* Footer */}
      {/* <footer className="py-12 bg-black border-t border-white/10"> */}
        {/* <div className="container mx-auto px-6"> */}
          {/* <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-1">
              <div className="text-xl font-bold mb-4">DOSA</div>
              <p className="text-gray-500 text-xs leading-relaxed">
                Professional-grade AI for underwriters and private equity.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-sm">Platform</h4>
              <ul className="space-y-2 text-xs text-gray-500">
                <li><a href="#" className="hover:text-white transition-colors">Overview</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Integrations</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-sm">Solutions</h4>
              <ul className="space-y-2 text-xs text-gray-500">
                <li><a href="#" className="hover:text-white transition-colors">Underwriting</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Private Equity</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Risk Analysis</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-sm">Company</h4>
              <ul className="space-y-2 text-xs text-gray-500">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              </ul>
            </div>
          </div> */}
          {/* <div className="pt-8 border-t border-white/5 text-center text-xs text-gray-600">
            <p>© 2025 DOSA. All rights reserved.</p>
          </div> */}
        {/* </div> */}
      {/* </footer> */}
    </div>
  )
}

const logos = [
  {
    src: "/hsbc.svg",
    alt: "HSBC",
  },
  {
    src: "/microsoft.svg",
    alt: "Microsoft",
  },
  {
    src: "/santander.svg",
    alt: "Santander",
  },
  {
    src: "/meta.svg",
    alt: "Meta",
  },
  {
    src: "/aia.svg",
    alt: "AIA",
  },
  {
    src: "/georgia.svg",
    alt: "Georgia Institute of Technology",
  },
  {
    src: "/ibm.svg",
    alt: "IBM",
  },
]
