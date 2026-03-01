"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"

const NAV_LINKS = [
  { href: "/#features", label: "Features" },
  { href: "/showcase", label: "See it Live" },
  { href: "/privacy", label: "Privacy" },
]

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href.startsWith("/#")) return false
    return pathname === href
  }

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 sm:px-8 py-6 max-w-7xl mx-auto w-full">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2 group">
          <img
            src="/mark.png"
            alt="Bandura Logo"
            className="h-10 w-10 object-contain -mb-0.5"
          />
          <div className="text-3xl font-bold tracking-tighter text-white">Bandura</div>
        </a>

        {/* Navigation — Glass pill */}
        <nav className="hidden md:flex items-center gap-1 rounded-full border border-white/10 bg-white/5 p-1 backdrop-blur-md">
          {NAV_LINKS.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              className={`text-sm font-medium px-6 py-2.5 rounded-full transition-all duration-200 ${
                isActive(href)
                  ? "text-white bg-white/15"
                  : "text-white/80 hover:text-white hover:bg-white/10"
              }`}
            >
              {label}
            </a>
          ))}
        </nav>

        {/* CTA */}
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

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 top-[72px] z-40 md:hidden bg-black/95 backdrop-blur-md border-t border-white/10">
          <nav className="flex flex-col px-6 py-8 space-y-4">
            {NAV_LINKS.map(({ href, label }) => (
              <a
                key={href}
                href={href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-white/90 hover:text-white text-base font-medium py-3 px-4 rounded-lg hover:bg-white/10 transition-all duration-200"
              >
                {label}
              </a>
            ))}
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
    </>
  )
}
