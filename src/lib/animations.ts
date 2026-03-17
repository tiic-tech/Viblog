/**
 * Viblog Animation System
 *
 * Framer Motion variants and animation utilities for consistent animations
 * across the revolutionary design system.
 *
 * Usage:
 * ```tsx
 * import { motionVariants, animations } from '@/lib/animations'
 *
 * <motion.div variants={motionVariants.fadeInUp} initial="initial" animate="animate">
 *   Content
 * </motion.div>
 * ```
 */

import type { Variants, Transition } from 'framer-motion'

/* ============================================
   TRANSITION PRESETS
   ============================================ */

export const transitions = {
  instant: {
    duration: 0.1,
    ease: [0.4, 0, 0.2, 1],
  } as Transition,
  fast: {
    duration: 0.15,
    ease: [0, 0, 0.2, 1],
  } as Transition,
  normal: {
    duration: 0.25,
    ease: [0.4, 0, 0.2, 1],
  } as Transition,
  slow: {
    duration: 0.4,
    ease: [0.25, 0.1, 0.25, 1],
  } as Transition,
  spring: {
    type: 'spring',
    stiffness: 400,
    damping: 30,
  } as Transition,
  bounce: {
    type: 'spring',
    stiffness: 400,
    damping: 10,
  } as Transition,
}

/* ============================================
   MOTION VARIANTS
   ============================================ */

export const motionVariants = {
  // Fade In Up - Standard entrance
  fadeInUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  } as Variants,

  // Fade In - Simple opacity
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  } as Variants,

  // Scale In - Pop effect
  scaleIn: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
  } as Variants,

  // Scale In Bounce - Pop with bounce
  scaleInBounce: {
    initial: { opacity: 0, scale: 0.8 },
    animate: {
      opacity: 1,
      scale: 1,
      transition: transitions.bounce,
    },
    exit: { opacity: 0, scale: 0.8 },
  } as Variants,

  // Slide In Right
  slideInRight: {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  } as Variants,

  // Slide In Left
  slideInLeft: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
  } as Variants,

  // Stagger Container
  staggerContainer: {
    animate: {
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
  } as Variants,

  // Stagger Item
  staggerItem: {
    initial: { opacity: 0, y: 15 },
    animate: { opacity: 1, y: 0 },
  } as Variants,

  // Card Hover
  cardHover: {
    rest: {
      scale: 1,
      y: 0,
      boxShadow: 'var(--glow-card)',
    },
    hover: {
      scale: 1.02,
      y: -8,
      boxShadow: 'var(--glow-hover)',
      transition: {
        duration: 0.3,
        ease: [0, 0, 0.2, 1],
      },
    },
  } as Variants,

  // Card Tap
  cardTap: {
    rest: { scale: 1 },
    tap: { scale: 0.98 },
  } as Variants,

  // Button Press
  buttonPress: {
    rest: { scale: 1 },
    hover: { scale: 1.02 },
    tap: { scale: 0.98 },
  } as Variants,

  // Icon Pop
  iconPop: {
    rest: { scale: 1 },
    hover: {
      scale: 1.1,
      transition: transitions.bounce,
    },
  } as Variants,

  // Glow Pulse
  glowPulse: {
    rest: {
      boxShadow: 'var(--glow-card)',
    },
    hover: {
      boxShadow: 'var(--glow-primary)',
      transition: {
        duration: 0.3,
      },
    },
  } as Variants,
}

/* ============================================
   PAGE TRANSITIONS
   ============================================ */

export const pageTransition = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: transitions.slow,
}

/* ============================================
   LIST ANIMATIONS
   ============================================ */

export const listStagger = {
  animate: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
}

export const listItem = {
  initial: { opacity: 0, y: 20, scale: 0.95 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: transitions.normal,
  },
}

/* ============================================
   HERO ANIMATIONS
   ============================================ */

export const heroAnimations = {
  // Floating orbs
  floatingOrb: (duration: number = 8) => ({
    animate: {
      y: [0, -20, 0],
      x: [0, 10, 0],
    },
    transition: {
      duration,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  }),

  // Gradient pulse
  gradientPulse: {
    animate: {
      opacity: [0.5, 0.8, 0.5],
    },
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },

  // Title entrance
  titleEntrance: {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: {
      duration: 0.6,
      ease: [0, 0, 0.2, 1],
    },
  },
}

/* ============================================
   CARD ANIMATIONS
   ============================================ */

export const cardAnimations = {
  // Article card entrance
  articleEntrance: (index: number) => ({
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: {
      delay: index * 0.05,
      duration: 0.3,
      ease: [0, 0, 0.2, 1],
    },
  }),

  // Hover lift
  hoverLift: {
    y: -8,
    transition: {
      duration: 0.3,
      ease: [0, 0, 0.2, 1],
    },
  },

  // Tap down
  tapDown: {
    scale: 0.98,
    transition: {
      duration: 0.1,
    },
  },
}

/* ============================================
   CODE BLOCK ANIMATIONS
   ============================================ */

export const codeAnimations = {
  // Copy button success
  copySuccess: {
    initial: { scale: 0 },
    animate: { scale: 1 },
    exit: { scale: 0 },
    transition: transitions.bounce,
  },

  // Line highlight
  lineHighlight: {
    initial: { opacity: 0, x: -10 },
    animate: { opacity: 1, x: 0 },
    transition: transitions.normal,
  },

  // Window dots pulse
  windowDotPulse: {
    animate: {
      opacity: [0.7, 1, 0.7],
    },
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
}

/* ============================================
   NAVIGATION ANIMATIONS
   ============================================ */

export const navAnimations = {
  // Dropdown menu
  dropdown: {
    initial: { opacity: 0, y: -10, scale: 0.95 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -10, scale: 0.95 },
    transition: transitions.fast,
  },

  // Mobile menu slide
  mobileMenu: {
    initial: { x: '100%' },
    animate: { x: 0 },
    exit: { x: '100%' },
    transition: transitions.normal,
  },

  // Menu item stagger
  menuItemStagger: {
    animate: {
      transition: {
        staggerChildren: 0.05,
      },
    },
  },

  menuItem: {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
  },
}

/* ============================================
   MODAL ANIMATIONS
   ============================================ */

export const modalAnimations = {
  // Backdrop
  backdrop: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: transitions.fast,
  },

  // Modal content
  content: {
    initial: { opacity: 0, scale: 0.95, y: 20 },
    animate: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.95, y: 20 },
    transition: transitions.normal,
  },

  // Sheet (side panel)
  sheet: {
    initial: { x: '100%' },
    animate: { x: 0 },
    exit: { x: '100%' },
    transition: transitions.normal,
  },
}

/* ============================================
   LOADING ANIMATIONS
   ============================================ */

export const loadingAnimations = {
  // Spinner
  spinner: {
    animate: { rotate: 360 },
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: 'linear',
    },
  },

  // Pulse
  pulse: {
    animate: {
      opacity: [0.5, 1, 0.5],
      scale: [0.98, 1, 0.98],
    },
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },

  // Skeleton shimmer
  shimmer: {
    animate: {
      backgroundPosition: ['-200% 0', '200% 0'],
    },
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: 'linear',
    },
  },

  // Progress dots
  progressDot: (index: number, total: number) => ({
    animate: {
      opacity: [0.3, 1, 0.3],
      scale: [1, 1.2, 1],
    },
    transition: {
      duration: 0.6,
      repeat: Infinity,
      delay: index * 0.1,
      ease: 'easeInOut',
    },
  }),
}

/* ============================================
   UTILITY FUNCTIONS
   ============================================ */

/**
 * Creates a staggered delay for list items
 */
export function createStaggerDelay(index: number, baseDelay: number = 0.05): number {
  return index * baseDelay
}

/**
 * Creates a spring transition with custom parameters
 */
export function createSpringTransition(stiffness: number = 400, damping: number = 30): Transition {
  return {
    type: 'spring',
    stiffness,
    damping,
  }
}

/**
 * Creates a hover animation with glow effect
 */
export function createHoverGlow(accentColor: string = 'var(--accent-primary)'): object {
  return {
    rest: {
      boxShadow: 'var(--glow-card)',
    },
    hover: {
      boxShadow: `0 0 40px ${accentColor}20, 0 12px 32px rgba(0, 0, 0, 0.3)`,
      transition: {
        duration: 0.3,
      },
    },
  }
}

/**
 * Creates a floating animation for decorative elements
 */
export function createFloatingAnimation(duration: number = 8, distance: number = 20): object {
  return {
    animate: {
      y: [0, -distance, 0],
      x: [0, distance / 2, 0],
    },
    transition: {
      duration,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  }
}