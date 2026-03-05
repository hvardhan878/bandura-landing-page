'use client'

import { Spotlight } from "@/components/ui/spotlight"

export function SplineSceneBasic() {
  return (
    <div className="w-full h-[calc(100vh-6rem)] min-h-[600px] flex items-center justify-center bg-black/[0.96] antialiased relative overflow-hidden">
      <Spotlight
        className="-top-40 left-0 md:left-60 md:-top-20"
        fill="white"
      />
      
      <div className="p-4 max-w-7xl mx-auto relative z-10 w-full pt-20 md:pt-0 flex flex-col items-center">
        <h1 className="text-4xl md:text-7xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 bg-opacity-50 tracking-tight">
          The operating system for <br /> winning complex deals.
        </h1>
        <p className="mt-6 font-normal text-base md:text-lg text-neutral-300 max-w-lg text-center mx-auto leading-relaxed">
          Bandura predicts if you can win, and how you will win complex deals. Then helps you execute your strategy.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
          <a 
            href="https://calendly.com/johann-bandurai/30min"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-12 items-center justify-center rounded-full bg-white px-8 font-medium text-black transition-all hover:bg-gray-200 hover:scale-105 w-full sm:w-auto"
          >
            Request Demo
          </a>
          <a 
            href="#see-it-live"
            className="inline-flex h-12 items-center justify-center rounded-full border border-white/10 bg-white/5 px-8 font-medium text-white transition-colors hover:bg-white/10 w-full sm:w-auto"
          >
            See it Live
          </a>
        </div>
      </div>
      
      {/* Background gradient for depth */}
      <div className="absolute pointer-events-none inset-0 flex items-center justify-center bg-black [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
    </div>
  )
}
