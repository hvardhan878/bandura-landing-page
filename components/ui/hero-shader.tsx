"use client"

import type React from "react"

interface ShaderBackgroundProps {
  children: React.ReactNode
}

export function ShaderBackground({ children }: ShaderBackgroundProps) {
  return (
    <div className="h-screen w-full relative overflow-hidden" style={{ transform: 'translateZ(0)' }}>
      {/* SVG Filters */}
      <svg className="absolute inset-0 w-0 h-0">
        <defs>
          <filter id="glass-effect" x="-50%" y="-50%" width="200%" height="200%">
            <feTurbulence baseFrequency="0.005" numOctaves="1" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="0.3" />
            <feColorMatrix
              type="matrix"
              values="1 0 0 0 0.02
                      0 1 0 0 0.02
                      0 0 1 0 0.05
                      0 0 0 0.9 0"
              result="tint"
            />
          </filter>
          <filter id="gooey-filter" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9"
              result="gooey"
            />
            <feComposite in="SourceGraphic" in2="gooey" operator="atop" />
          </filter>
        </defs>
      </svg>

      {/* Static Gradient Background */}
      <div 
        className="absolute inset-0 w-full h-full"
        style={{
          background: `
            radial-gradient(ellipse at 20% 50%, rgba(139, 92, 246, 0.3) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
            radial-gradient(ellipse at 50% 80%, rgba(78, 29, 149, 0.2) 0%, transparent 50%),
            linear-gradient(180deg, #000000 0%, #0a0a0a 100%)
          `
        }}
      />
      <div 
        className="absolute inset-0 w-full h-full opacity-60"
        style={{
          background: `
            radial-gradient(ellipse at 50% 20%, rgba(139, 92, 246, 0.15) 0%, transparent 50%),
            radial-gradient(ellipse at 50% 80%, rgba(0, 0, 0, 0.8) 0%, transparent 50%)
          `
        }}
      />

      {children}
    </div>
  )
}

