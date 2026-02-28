'use client'

import { SplineScene } from "@/components/ui/splite";
import { Spotlight } from "@/components/ui/spotlight"

export function SplineSceneBasic() {

  return (
    <div className="w-full h-[calc(100vh-6rem)] min-h-[700px] md:min-h-[800px] bg-black relative overflow-hidden">
      <Spotlight
        className="-top-40 left-0 md:left-60 md:-top-20"
      />
      
      <div className="flex flex-col md:flex-row h-full">
        {/* Left content */}
        <div className="flex-1 p-8 md:p-12 relative z-10 flex flex-col justify-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400">
            The operating system for winning complex deals
          </h1>
          <p className="mt-6 text-neutral-300 text-lg max-w-lg">
            Bandura predicts if you can win, and how you will win complex deals. Then helps you execute your strategy.
          </p>
          <div className="mt-8">
            <a 
              href="https://calendly.com/johann-bandurai/30min"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-8 py-3 rounded-lg bg-white text-black font-medium text-sm md:text-base transition-all duration-200 hover:bg-gray-200 cursor-pointer relative z-20"
            >
              Request Demo
            </a>
          </div>
        </div>
        {/* Right content */}
        <div className="flex-1 relative min-h-[400px] md:min-h-full overflow-hidden">
          <SplineScene 
            scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
            className="w-full h-full"
          />
        </div>
      </div>
    </div>
  )
}

