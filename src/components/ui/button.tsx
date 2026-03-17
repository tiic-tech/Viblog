'use client'

import { Button as ButtonPrimitive } from '@base-ui/react/button'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

/**
 * Viblog Button Component
 *
 * Design Philosophy: Effortel-inspired premium buttons
 * - 8px border-radius (aligned with --radius-md)
 * - Glow effect on primary hover
 * - Consistent sizing with 40x40px icon buttons
 *
 * Phase 11.1: Button System Standardization
 */

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-md border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all duration-200 outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          'bg-accent-primary text-white hover:bg-accent-primary-light hover:shadow-[0_0_20px_rgba(139,92,246,0.3)] [a]:hover:bg-accent-primary-light',
        premium:
          'bg-gradient-to-r from-accent-primary to-accent-secondary text-white hover:opacity-90 hover:shadow-[0_0_30px_rgba(139,92,246,0.4)]',
        accent:
          'bg-accent-secondary text-white hover:bg-accent-secondary-light hover:shadow-[0_0_20px_rgba(6,182,212,0.3)]',
        outline:
          'border-border-emphasis bg-transparent text-fg-primary hover:bg-glass-bg-hover hover:border-accent-primary dark:border-glass-border dark:hover:border-accent-primary',
        secondary:
          'bg-glass-bg text-fg-primary border border-glass-border hover:bg-glass-bg-hover hover:border-accent-primary aria-expanded:bg-glass-bg-hover',
        ghost:
          'hover:bg-glass-bg hover:text-fg-primary aria-expanded:bg-glass-bg dark:hover:bg-glass-bg/50',
        destructive:
          'bg-error/10 text-error hover:bg-error/20 focus-visible:border-error/40 focus-visible:ring-error/20 dark:bg-error/20 dark:hover:bg-error/30 dark:focus-visible:ring-error/40',
        link: 'text-accent-primary underline-offset-4 hover:underline',
      },
      size: {
        default:
          'h-10 gap-2 px-4 py-2 has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3',
        xs: "h-7 gap-1 rounded-md px-2 text-xs in-data-[slot=button-group]:rounded-md has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-9 gap-1.5 rounded-md px-3 text-[0.8rem] in-data-[slot=button-group]:rounded-md has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 [&_svg:not([class*='size-'])]:size-3.5",
        lg: 'h-11 gap-2 px-5 py-2.5 has-data-[icon=inline-end]:pr-4 has-data-[icon=inline-start]:pl-4',
        icon: 'size-10 rounded-md' /* 40x40px with 8px radius */,
        'icon-xs':
          "size-7 rounded-md in-data-[slot=button-group]:rounded-md [&_svg:not([class*='size-'])]:size-3",
        'icon-sm': 'size-9 rounded-md in-data-[slot=button-group]:rounded-md',
        'icon-lg': 'size-11 rounded-md',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

function Button({
  className,
  variant = 'default',
  size = 'default',
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
