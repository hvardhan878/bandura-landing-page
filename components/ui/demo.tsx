'use client'

import { useEffect, useRef, useCallback } from 'react';
import { SplineScene } from "@/components/ui/splite";
import { Spotlight } from "@/components/ui/spotlight"

// Helper to parse 'rgb(r, g, b)' or 'rgba(r, g, b, a)' string to {r, g, b}
const parseRgbColor = (colorString: string) => {
    if (!colorString) return null;
    const match = colorString.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)/);
    if (match) {
        return {
            r: parseInt(match[1], 10),
            g: parseInt(match[2], 10),
            b: parseInt(match[3], 10),
        };
    }
    return null;
};

export function SplineSceneBasic() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const targetRef = useRef<HTMLAnchorElement>(null);
  const mousePosRef = useRef({ x: null as number | null, y: null as number | null });
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const animationFrameIdRef = useRef<number | null>(null);
  const isMobileRef = useRef(false);

  const resolvedCanvasColorsRef = useRef({
      strokeStyle: { r: 255, g: 255, b: 255 }, // Default white for dark background
  });

  useEffect(() => {
      const tempElement = document.createElement('div');
      tempElement.style.display = 'none';
      document.body.appendChild(tempElement);

      const updateResolvedColors = () => {
          tempElement.style.color = 'rgb(255, 255, 255)'; // White color for dark theme
          const computedFgColor = getComputedStyle(tempElement).color;
          const parsedFgColor = parseRgbColor(computedFgColor);
          if (parsedFgColor) {
              resolvedCanvasColorsRef.current.strokeStyle = parsedFgColor;
          } else {
              resolvedCanvasColorsRef.current.strokeStyle = { r: 255, g: 255, b: 255 }; // Fallback to white
          }
      };
      updateResolvedColors();

      return () => {
          if (tempElement.parentNode) {
              tempElement.parentNode.removeChild(tempElement);
          }
      };
  }, []);

  const drawArrow = useCallback(() => {
      // Don't draw arrow on mobile screens
      if (isMobileRef.current) return;
      if (!canvasRef.current || !targetRef.current || !ctxRef.current) return;

      const targetEl = targetRef.current;
      const ctx = ctxRef.current;
      const mouse = mousePosRef.current;

      const x0 = mouse.x;
      const y0 = mouse.y;

      if (x0 === null || y0 === null) return;

      const rect = targetEl.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;

      const a = Math.atan2(cy - y0, cx - x0);
      const x1 = cx - Math.cos(a) * (rect.width / 2 + 12);
      const y1 = cy - Math.sin(a) * (rect.height / 2 + 12);

      const midX = (x0 + x1) / 2;
      const midY = (y0 + y1) / 2;
      const offset = Math.min(200, Math.hypot(x1 - x0, y1 - y0) * 0.5);
      const t = Math.max(-1, Math.min(1, (y0 - y1) / 200));
      const controlX = midX;
      const controlY = midY + offset * t;
      
      const r = Math.sqrt((x1 - x0)**2 + (y1 - y0)**2);
      // Increase max opacity to 1 (fully opaque) and adjust divisor for quicker ramp-up
      const opacity = Math.min(1.0, (r - Math.max(rect.width, rect.height) / 2) / 500); 

      const arrowColor = resolvedCanvasColorsRef.current.strokeStyle;
      ctx.strokeStyle = `rgba(${arrowColor.r}, ${arrowColor.g}, ${arrowColor.b}, ${opacity})`;
      // Increase line width for more visibility
      ctx.lineWidth = 2;

      // Draw curve
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(x0, y0);
      ctx.quadraticCurveTo(controlX, controlY, x1, y1);
      // Adjust dash pattern for thicker line: longer dashes, similar gap
      ctx.setLineDash([10, 5]);
      ctx.stroke();
      ctx.restore();

      // Draw arrowhead
      const angle = Math.atan2(y1 - controlY, x1 - controlX);
      // Scale arrowhead with line width, base size 10 for lineWidth 1.5
      const headLength = 10 * (ctx.lineWidth / 1.5); 
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(
          x1 - headLength * Math.cos(angle - Math.PI / 6),
          y1 - headLength * Math.sin(angle - Math.PI / 6)
      );
      ctx.moveTo(x1, y1);
      ctx.lineTo(
          x1 - headLength * Math.cos(angle + Math.PI / 6),
          y1 - headLength * Math.sin(angle + Math.PI / 6)
      );
      ctx.stroke();
  }, []);

  useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas || !targetRef.current) return;

      const checkIsMobile = () => {
          // Check if screen width is less than md breakpoint (768px)
          return window.innerWidth < 768;
      };

      isMobileRef.current = checkIsMobile();

      // Only set up arrow animation on desktop
      if (!isMobileRef.current) {
          ctxRef.current = canvas.getContext("2d");
          const ctx = ctxRef.current;

          const updateCanvasSize = () => {
              if (canvas) {
                  canvas.width = window.innerWidth;
                  canvas.height = window.innerHeight;
              }
              isMobileRef.current = checkIsMobile();
          };

          const handleMouseMove = (e: MouseEvent) => {
              if (!isMobileRef.current) {
                  mousePosRef.current = { x: e.clientX, y: e.clientY };
              }
          };

          window.addEventListener("resize", updateCanvasSize);
          window.addEventListener("mousemove", handleMouseMove);
          updateCanvasSize();

          const animateLoop = () => {
              if (ctx && canvas && !isMobileRef.current) {
                  ctx.clearRect(0, 0, canvas.width, canvas.height);
                  drawArrow();
              }
              animationFrameIdRef.current = requestAnimationFrame(animateLoop);
          };
          
          animateLoop();

          return () => {
              window.removeEventListener("resize", updateCanvasSize);
              window.removeEventListener("mousemove", handleMouseMove);
              if (animationFrameIdRef.current) {
                  cancelAnimationFrame(animationFrameIdRef.current);
              }
          };
      }
  }, [drawArrow]);

  return (
    <div className="w-full h-[700px] md:h-[600px] bg-black relative overflow-hidden">
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
            Bandura embeds strategic thinking 6–9 months before the ITT drops — automating capture planning, competitor analysis, and win probability so your team bids with conviction, not guesswork.
          </p>
          <div className="mt-8">
            <a 
              ref={targetRef}
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
      <canvas ref={canvasRef} className="hidden md:block fixed inset-0 pointer-events-none z-10" />
    </div>
  )
}

