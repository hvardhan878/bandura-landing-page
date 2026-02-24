"use client"

import type React from "react"

import { useState } from "react"

import { ArrowUpRight, Calendar, X } from "lucide-react"

export function LetsWorkTogether() {
  const [isHovered, setIsHovered] = useState(false)
  const [isClicked, setIsClicked] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [isButtonHovered, setIsButtonHovered] = useState(false)

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    setIsClicked(true)
    setTimeout(() => {
      setShowSuccess(true)
    }, 500)
  }

  const handleReset = () => {
    setShowSuccess(false)
    setIsClicked(false)
  }

  const handleBookCall = () => {
    window.open("https://calendly.com/johann-bandurai/30min", "_blank")
  }

  return (
    <section className="flex min-h-screen items-center justify-center px-6 bg-black">
      <div className="relative flex flex-col items-center gap-12">
        <div
          className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-8 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{
            opacity: showSuccess ? 1 : 0,
            transform: showSuccess ? "translateY(0) scale(1)" : "translateY(20px) scale(0.95)",
            pointerEvents: showSuccess ? "auto" : "none",
          }}
        >
          {/* Close button */}
          <button
            onClick={handleReset}
            className="absolute top-4 right-4 p-2 rounded-full border border-white/20 hover:bg-white/10 transition-all duration-300 text-white/60 hover:text-white"
            aria-label="Close"
          >
            <X className="size-4" />
          </button>

          {/* Elegant heading */}
          <div className="flex flex-col items-center gap-2">
            <span
              className="text-xs font-medium tracking-[0.3em] uppercase text-gray-400 transition-all duration-500"
              style={{
                transform: showSuccess ? "translateY(0)" : "translateY(10px)",
                opacity: showSuccess ? 1 : 0,
                transitionDelay: "100ms",
              }}
            >
              Start winning earlier
            </span>
            <h3
              className="text-3xl font-light tracking-tight text-white transition-all duration-500 sm:text-4xl"
              style={{
                transform: showSuccess ? "translateY(0)" : "translateY(10px)",
                opacity: showSuccess ? 1 : 0,
                transitionDelay: "200ms",
              }}
            >
              Book a demo
            </h3>
          </div>

          {/* Book a call button */}
          <button
            onClick={handleBookCall}
            onMouseEnter={() => setIsButtonHovered(true)}
            onMouseLeave={() => setIsButtonHovered(false)}
            className="group relative flex items-center gap-4 transition-all duration-500 cursor-pointer"
            style={{
              transform: showSuccess
                ? isButtonHovered
                  ? "translateY(0) scale(1.02)"
                  : "translateY(0) scale(1)"
                : "translateY(15px) scale(1)",
              opacity: showSuccess ? 1 : 0,
              transitionDelay: "150ms",
            }}
          >
            {/* Left line */}
            <div
              className="h-px w-8 bg-white/20 transition-all duration-500 sm:w-12"
              style={{
                transform: isButtonHovered ? "scaleX(0)" : "scaleX(1)",
                opacity: isButtonHovered ? 0 : 0.5,
              }}
            />

            {/* Button content */}
            <div
              className="relative flex items-center gap-3 overflow-hidden rounded-full border border-white/20 px-6 py-3 transition-all duration-500 sm:px-8 sm:py-4"
              style={{
                borderColor: isButtonHovered ? "white" : "rgba(255, 255, 255, 0.2)",
                backgroundColor: isButtonHovered ? "white" : "transparent",
                boxShadow: isButtonHovered ? "0 0 30px rgba(255,255,255,0.1), 0 10px 40px rgba(255,255,255,0.08)" : "none",
              }}
            >
              <Calendar
                className="size-4 transition-all duration-500 sm:size-5"
                strokeWidth={1.5}
                style={{
                  color: isButtonHovered ? "black" : "white",
                }}
              />
              <span
                className="text-sm font-medium tracking-wide transition-all duration-500 sm:text-base"
                style={{
                  color: isButtonHovered ? "black" : "white",
                }}
              >
                Book a call
              </span>
              <ArrowUpRight
                className="size-4 transition-all duration-500 sm:size-5"
                strokeWidth={1.5}
                style={{
                  color: isButtonHovered ? "black" : "white",
                  transform: isButtonHovered ? "translate(3px, -3px) scale(1.1)" : "translate(0, 0) scale(1)",
                }}
              />
            </div>

            {/* Right line */}
            <div
              className="h-px w-8 bg-white/20 transition-all duration-500 sm:w-12"
              style={{
                transform: isButtonHovered ? "scaleX(0)" : "scaleX(1)",
                opacity: isButtonHovered ? 0 : 0.5,
              }}
            />
          </button>

          {/* Subtle subtext */}
          <span
            className="text-xs tracking-widest uppercase text-gray-400/50 transition-all duration-500"
            style={{
              transform: showSuccess ? "translateY(0)" : "translateY(10px)",
              opacity: showSuccess ? 1 : 0,
              transitionDelay: "450ms",
            }}
          >
            15 min intro call
          </span>
        </div>

        <div
          className="flex items-center gap-3 transition-all duration-500"
          style={{
            opacity: isClicked ? 0 : 1,
            transform: isClicked ? "translateY(-20px)" : "translateY(0)",
            pointerEvents: isClicked ? "none" : "auto",
          }}
        >
          <span className="relative flex size-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
          </span>
          <span className="text-sm font-medium tracking-widest uppercase text-gray-400">
            Available now
          </span>
        </div>

        <div
          className="group relative cursor-pointer"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={(e) => handleClick(e as unknown as React.MouseEvent<HTMLAnchorElement>)}
          style={{
            pointerEvents: isClicked ? "none" : "auto",
          }}
        >
          <div className="flex flex-col items-center gap-6">
            <h2
              className="relative text-center text-5xl font-light tracking-tight text-white sm:text-6xl md:text-7xl lg:text-8xl transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
              style={{
                opacity: isClicked ? 0 : 1,
                transform: isClicked ? "translateY(-40px) scale(0.95)" : "translateY(0) scale(1)",
              }}
            >
              <span className="block overflow-hidden">
                <span
                  className="block transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
                  style={{
                    transform: isHovered && !isClicked ? "translateY(-8%)" : "translateY(0)",
                  }}
                >
                  Get started
                </span>
              </span>
              <span className="block overflow-hidden">
                <span
                  className="block transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] delay-75"
                  style={{
                    transform: isHovered && !isClicked ? "translateY(-8%)" : "translateY(0)",
                  }}
                >
                  <span className="text-gray-400">with Bandura</span>
                </span>
              </span>
            </h2>

            <div className="relative mt-4 flex size-16 items-center justify-center sm:size-20">
              <div
                className="pointer-events-none absolute inset-0 rounded-full border border-white/20 transition-all ease-out"
                style={{
                  borderColor: isClicked ? "white" : isHovered ? "white" : "rgba(255, 255, 255, 0.2)",
                  backgroundColor: isClicked ? "transparent" : isHovered ? "white" : "transparent",
                  transform: isClicked ? "scale(3)" : isHovered ? "scale(1.1)" : "scale(1)",
                  opacity: isClicked ? 0 : 1,
                  transitionDuration: isClicked ? "700ms" : "500ms",
                }}
              />
              <ArrowUpRight
                className="size-6 transition-all ease-[cubic-bezier(0.16,1,0.3,1)] sm:size-7"
                style={{
                  transform: isClicked
                    ? "translate(100px, -100px) scale(0.5)"
                    : isHovered
                      ? "translate(2px, -2px)"
                      : "translate(0, 0)",
                  opacity: isClicked ? 0 : 1,
                  color: isHovered && !isClicked ? "black" : "white",
                  transitionDuration: isClicked ? "600ms" : "500ms",
                }}
              />
            </div>
          </div>

          <div className="absolute -left-8 top-1/2 -translate-y-1/2 sm:-left-16">
            <div
              className="h-px w-8 bg-white/20 transition-all duration-500 sm:w-12"
              style={{
                transform: isClicked ? "scaleX(0) translateX(-20px)" : isHovered ? "scaleX(1.5)" : "scaleX(1)",
                opacity: isClicked ? 0 : isHovered ? 1 : 0.5,
              }}
            />
          </div>

          <div className="absolute -right-8 top-1/2 -translate-y-1/2 sm:-right-16">
            <div
              className="h-px w-8 bg-white/20 transition-all duration-500 sm:w-12"
              style={{
                transform: isClicked ? "scaleX(0) translateX(20px)" : isHovered ? "scaleX(1.5)" : "scaleX(1)",
                opacity: isClicked ? 0 : isHovered ? 1 : 0.5,
              }}
            />
          </div>
        </div>

        <div
          className="mt-8 flex flex-col items-center gap-4 text-center transition-all duration-500 delay-100"
          style={{
            opacity: isClicked ? 0 : 1,
            transform: isClicked ? "translateY(20px)" : "translateY(0)",
            pointerEvents: isClicked ? "none" : "auto",
          }}
        >
          <p className="max-w-md text-sm leading-relaxed text-gray-400">
            See how Bandura helps UK IT consulting firms win more £50M+ public sector contracts — with less cost, less guesswork, and a strategic edge months before the ITT drops.
          </p>
          <span className="text-xs tracking-widest uppercase text-gray-400/60">30-min intro call</span>
        </div>
      </div>
    </section>
  )
}

