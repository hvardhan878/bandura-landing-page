"use client"

import { useEffect } from "react"
import Navbar from "@/components/ui/navbar"
import { LogoCloud } from "@/components/ui/logo-cloud-3"
import { SplineSceneBasic } from "@/components/ui/demo"
import { GlowingEffectDemo } from "@/components/ui/glowing-effect-demo"
import { LetsWorkTogether } from "@/components/ui/lets-work-section"
import { cn } from "@/lib/utils"
import BanduraDashboard from "@/components/ui/bandura-dashboard"

export default function Home() {
  useEffect(() => {
    // #region agent log - scroll diagnostics
    const ua = navigator.userAgent;
    const isChrome = /Chrome\/(\d+)/.test(ua);
    const chromeVer = isChrome ? Number(ua.match(/Chrome\/(\d+)/)?.[1]) : null;
    console.group('[Bandura Scroll Debug]');
    console.log('UA:', ua);
    console.log('Chrome:', isChrome, 'v' + chromeVer);
    console.log('html overflow:', getComputedStyle(document.documentElement).overflow);
    console.log('body overflow:', getComputedStyle(document.body).overflow);
    console.log('html overscroll-behavior:', getComputedStyle(document.documentElement).overscrollBehavior);
    console.log('Scroll container: window.scrollY works?', typeof window.scrollY === 'number');

    let scrollFired = false;
    const onScroll = () => {
      if (!scrollFired) {
        console.log('[Bandura Scroll Debug] ✅ window scroll fired — scrollY:', window.scrollY);
        scrollFired = true;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    let wheelFired = false;
    const onWheel = (e: WheelEvent) => {
      if (!wheelFired) {
        console.log('[Bandura Scroll Debug] Wheel event — deltaY:', e.deltaY, 'defaultPrevented:', e.defaultPrevented, 'cancelable:', e.cancelable);
        wheelFired = true;
      }
    };
    window.addEventListener('wheel', onWheel, { passive: true });

    // After 3s check if any scroll happened
    const timer = setTimeout(() => {
      console.log('[Bandura Scroll Debug] After 3s — scrollY:', window.scrollY, 'scroll fired:', scrollFired);
      console.groupEnd();
    }, 3000);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('wheel', onWheel);
      clearTimeout(timer);
    };
    // #endregion
  }, [])

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
    <div className="min-h-screen bg-black text-white font-sans selection:bg-purple-500/30 overflow-x-hidden">
      <Navbar />

      <main>
      {/* Hero Section with 3D Spline Scene */}
      <section className="pt-24 bg-black">
        <SplineSceneBasic />
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

      {/* Features Grid Section with Glowing Effect */}
      <section id="features" className="py-24 bg-black relative">
        <div className="container mx-auto px-6">
          <div className="mb-16 max-w-3xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight text-white">
              Increase win rates and improve your qualification capabilities.
            </h2>
            <p className="text-lg text-gray-400">
              Most teams are bidding reactively. Bandura automates the analysis required to predict and shape your strategy - giving you the ability to act your strategy months before the competition.
            </p>
          </div>
          <div className="max-w-7xl mx-auto">
            <GlowingEffectDemo />
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

      {/* Bandura Dashboard Demo */}
      <BanduraDashboard />

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
