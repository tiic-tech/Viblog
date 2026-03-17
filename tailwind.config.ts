import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      /* ============================================
         COLORS - Revolutionary Design System
         ============================================ */
      colors: {
        // Background System
        'bg-deep': 'var(--bg-deep)',
        'bg-surface': 'var(--bg-surface)',
        'bg-elevated': 'var(--bg-elevated)',
        'bg-card': 'var(--bg-card)',

        // Foreground System
        'fg-primary': 'var(--fg-primary)',
        'fg-secondary': 'var(--fg-secondary)',
        'fg-muted': 'var(--fg-muted)',
        'fg-dim': 'var(--fg-dim)',

        // Accent System - Neon Pulse
        'accent-primary': {
          DEFAULT: 'var(--accent-primary)',
          light: 'var(--accent-primary-light)',
          dark: 'var(--accent-primary-dark)',
          glow: 'var(--accent-primary-glow)',
        },
        'accent-secondary': {
          DEFAULT: 'var(--accent-secondary)',
          light: 'var(--accent-secondary-light)',
          glow: 'var(--accent-secondary-glow)',
        },
        'accent-tertiary': {
          DEFAULT: 'var(--accent-tertiary)',
          light: 'var(--accent-tertiary-light)',
          glow: 'var(--accent-tertiary-glow)',
        },

        // Semantic Colors
        success: {
          DEFAULT: 'var(--success)',
          glow: 'var(--success-glow)',
        },
        warning: {
          DEFAULT: 'var(--warning)',
          glow: 'var(--warning-glow)',
        },
        error: {
          DEFAULT: 'var(--error)',
          glow: 'var(--error-glow)',
        },
        info: {
          DEFAULT: 'var(--info)',
          glow: 'var(--info-glow)',
        },

        // Code Theme Colors
        code: {
          bg: 'var(--code-bg)',
          keyword: 'var(--code-keyword)',
          string: 'var(--code-string)',
          number: 'var(--code-number)',
          comment: 'var(--code-comment)',
          function: 'var(--code-function)',
          variable: 'var(--code-variable)',
          operator: 'var(--code-operator)',
          'class': 'var(--code-class)',
        },

        // Legacy shadcn/ui compatibility
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',

        // Border System
        'border-subtle': 'var(--border-subtle)',
        'border-default': 'var(--border-default)',
        'border-emphasis': 'var(--border-emphasis)',
        'border-accent': 'var(--border-accent)',
      },

      /* ============================================
         FONT FAMILY
         ============================================ */
      fontFamily: {
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        body: ['var(--font-body)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
        code: ['var(--font-code)', 'monospace'],
        reading: ['var(--font-reading)', 'Georgia', 'serif'],
      },

      /* ============================================
         FONT SIZE
         ============================================ */
      fontSize: {
        xs: ['var(--text-xs)', { lineHeight: 'var(--leading-normal)' }],
        sm: ['var(--text-sm)', { lineHeight: 'var(--leading-normal)' }],
        base: ['var(--text-base)', { lineHeight: 'var(--leading-normal)' }],
        lg: ['var(--text-lg)', { lineHeight: 'var(--leading-relaxed)' }],
        xl: ['var(--text-xl)', { lineHeight: 'var(--leading-snug)' }],
        '2xl': ['var(--text-2xl)', { lineHeight: 'var(--leading-snug)' }],
        '3xl': ['var(--text-3xl)', { lineHeight: 'var(--leading-snug)' }],
        '4xl': ['var(--text-4xl)', { lineHeight: 'var(--leading-tight)' }],
        '5xl': ['var(--text-5xl)', { lineHeight: 'var(--leading-tight)' }],
        '6xl': ['var(--text-6xl)', { lineHeight: 'var(--leading-tight)' }],
        '7xl': ['var(--text-7xl)', { lineHeight: 'var(--leading-tight)' }],
      },

      /* ============================================
         SPACING
         ============================================ */
      spacing: {
        '0': 'var(--space-0)',
        '1': 'var(--space-1)',
        '2': 'var(--space-2)',
        '3': 'var(--space-3)',
        '4': 'var(--space-4)',
        '5': 'var(--space-5)',
        '6': 'var(--space-6)',
        '8': 'var(--space-8)',
        '10': 'var(--space-10)',
        '12': 'var(--space-12)',
        '16': 'var(--space-16)',
        '20': 'var(--space-20)',
        '24': 'var(--space-24)',
        '32': 'var(--space-32)',
      },

      /* ============================================
         BORDER RADIUS
         ============================================ */
      borderRadius: {
        'sm': 'var(--radius-sm)',
        'md': 'var(--radius-md)',
        'lg': 'var(--radius-lg)',
        'xl': 'var(--radius-xl)',
        '2xl': 'var(--radius-2xl)',
        'full': 'var(--radius-full)',
      },

      /* ============================================
         BOX SHADOW
         ============================================ */
      boxShadow: {
        'sm': 'var(--shadow-sm)',
        'md': 'var(--shadow-md)',
        'lg': 'var(--shadow-lg)',
        'xl': 'var(--shadow-xl)',
        'glow-primary': 'var(--glow-primary)',
        'glow-secondary': 'var(--glow-secondary)',
        'glow-tertiary': 'var(--glow-tertiary)',
        'glow-card': 'var(--glow-card)',
        'glow-hover': 'var(--glow-hover)',
      },

      /* ============================================
         ANIMATIONS
         ============================================ */
      transitionDuration: {
        'instant': 'var(--duration-instant)',
        'fast': 'var(--duration-fast)',
        'normal': 'var(--duration-normal)',
        'slow': 'var(--duration-slow)',
        'slower': 'var(--duration-slower)',
        'slowest': 'var(--duration-slowest)',
      },

      transitionTimingFunction: {
        'default': 'var(--ease-default)',
        'out': 'var(--ease-out)',
        'in': 'var(--ease-in)',
        'in-out': 'var(--ease-in-out)',
        'spring': 'var(--ease-spring)',
        'dramatic': 'var(--ease-dramatic)',
        'smooth': 'var(--ease-smooth)',
      },

      /* ============================================
         KEYFRAMES & ANIMATION
         ============================================ */
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'slide-in-right': {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },

      animation: {
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'fade-in-up': 'fade-in-up 0.3s ease-out',
        'scale-in': 'scale-in 0.25s ease-out',
        'slide-in-right': 'slide-in-right 0.3s ease-out',
      },

      /* ============================================
         BACKDROP BLUR
         ============================================ */
      backdropBlur: {
        'glass': 'var(--glass-blur)',
      },

      /* ============================================
         LETTER SPACING
         ============================================ */
      letterSpacing: {
        'tighter': 'var(--tracking-tighter)',
        'tight': 'var(--tracking-tight)',
        'normal': 'var(--tracking-normal)',
        'wide': 'var(--tracking-wide)',
        'wider': 'var(--tracking-wider)',
        'widest': 'var(--tracking-widest)',
      },

      /* ============================================
         MAX WIDTH - For Reading
         ============================================ */
      maxWidth: {
        'reading': '680px',
        'content': '768px',
        'wide': '1024px',
      },
    },
  },
  plugins: [],
}

export default config