'use client';

import { cn } from '@/lib/utils';
import { useMotionValue, animate, motion } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import useMeasure from 'react-use-measure';

type InfiniteSliderProps = {
  children: React.ReactNode;
  gap?: number;
  duration?: number;
  durationOnHover?: number;
  direction?: 'horizontal' | 'vertical';
  reverse?: boolean;
  className?: string;
  speed?: number;
  speedOnHover?: number;
};

export function InfiniteSlider({
  children,
  gap = 16,
  duration = 25,
  durationOnHover,
  direction = 'horizontal',
  reverse = false,
  className,
  speed,
  speedOnHover,
}: InfiniteSliderProps) {
  // Support both duration and speed props (speed is inverse of duration)
  const effectiveDuration = speed ? 100 / speed : duration;
  const effectiveDurationOnHover = speedOnHover ? 100 / speedOnHover : durationOnHover;

  const [currentDuration, setCurrentDuration] = useState(effectiveDuration || duration);
  const [ref, { width, height }] = useMeasure();
  const translation = useMotionValue(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [key, setKey] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const animationControlsRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Intersection Observer to pause animation when not visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    const container = containerRef.current;
    if (container) {
      observer.observe(container);
    }

    return () => {
      if (container) {
        observer.unobserve(container);
      }
    };
  }, []);

  useEffect(() => {
    // Don't animate if not visible or if dimensions aren't ready
    if (!isVisible || (direction === 'horizontal' && !width) || (direction === 'vertical' && !height)) {
      if (animationControlsRef.current) {
        animationControlsRef.current.stop();
      }
      return;
    }

    let controls;
    const size = direction === 'horizontal' ? width : height;
    const contentSize = size + gap;
    const from = reverse ? -contentSize / 2 : 0;
    const to = reverse ? 0 : -contentSize / 2;

    if (isTransitioning) {
      controls = animate(translation, [translation.get(), to], {
        ease: 'linear',
        duration:
          currentDuration * Math.abs((translation.get() - to) / contentSize),
        onComplete: () => {
          setIsTransitioning(false);
          setKey((prevKey) => prevKey + 1);
        },
      });
    } else {
      controls = animate(translation, [from, to], {
        ease: 'linear',
        duration: currentDuration,
        repeat: Infinity,
        repeatType: 'loop',
        repeatDelay: 0,
        onRepeat: () => {
          translation.set(from);
        },
      });
    }

    animationControlsRef.current = controls;

    return () => {
      if (controls) {
        controls.stop();
      }
    };
  }, [
    key,
    translation,
    currentDuration,
    width,
    height,
    gap,
    isTransitioning,
    direction,
    reverse,
    isVisible,
  ]);

  const hoverProps = effectiveDurationOnHover
    ? {
        onHoverStart: () => {
          setIsTransitioning(true);
          setCurrentDuration(effectiveDurationOnHover);
        },
        onHoverEnd: () => {
          setIsTransitioning(true);
          setCurrentDuration(effectiveDuration);
        },
      }
    : {};

  return (
    <div 
      ref={containerRef}
      className={cn('overflow-hidden', className)} 
      style={{ transform: 'translateZ(0)' }}
    >
      <motion.div
        className='flex w-max'
        style={{
          ...(direction === 'horizontal'
            ? { x: translation }
            : { y: translation }),
          gap: `${gap}px`,
          flexDirection: direction === 'horizontal' ? 'row' : 'column',
          transform: 'translateZ(0)',
          willChange: 'transform',
        }}
        ref={ref}
        {...hoverProps}
      >
        {children}
        {children}
      </motion.div>
    </div>
  );
}

