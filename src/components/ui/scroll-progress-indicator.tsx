'use client'

import { motion, useScroll, useSpring } from 'framer-motion'
import { useRef } from 'react'

interface ScrollProgressIndicatorProps {
  /**
   * Optional className for custom styling
   */
  className?: string
  /**
   * Color of the progress bar (default: bg-accent-primary)
   */
  color?: string
  /**
   * Height of the progress bar (default: h-1)
   */
  height?: string
}

/**
 * Scroll Progress Indicator
 *
 * A fixed progress bar at the top of the page that shows scroll progress.
 * Uses Framer Motion for smooth spring animation.
 *
 * Usage:
 * ```tsx
 * <ScrollProgressIndicator />
 * ```
 */
export function ScrollProgressIndicator({
  className = '',
  color = 'bg-accent-primary',
  height = 'h-1',
}: ScrollProgressIndicatorProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll()

  // Smooth spring animation for scroll progress
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  })

  return (
    <motion.div
      ref={containerRef}
      className={`fixed left-0 right-0 top-0 z-50 ${height} origin-left ${color} ${className}`}
      style={{ scaleX: smoothProgress }}
    />
  )
}