'use client'

import Link from 'next/link'
import { PenTool, ArrowRight, Twitter, Github } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * Viblog Footer Component
 *
 * Design Philosophy: Effortel-inspired premium footer
 * - 4-column responsive grid layout
 * - CTA card with gradient background and animated arrow
 * - AI-Native tagline: "Made with AI, for AI"
 * - Social links for community engagement
 *
 * Phase 11.3: Footer Implementation
 */

// Footer navigation configuration
const FOOTER_LINKS = {
  product: {
    title: 'PRODUCT',
    links: [
      { label: 'Features', href: '/#features' },
      { label: 'Pricing', href: '/#pricing' },
      { label: 'Changelog', href: '/changelog' },
      { label: 'Roadmap', href: '/roadmap' },
    ],
  },
  resources: {
    title: 'RESOURCES',
    links: [
      { label: 'Blog', href: '/' },
      { label: 'Documentation', href: '/docs' },
      { label: 'API Reference', href: '/api-docs' },
      { label: 'Community', href: '/community' },
    ],
  },
  company: {
    title: 'COMPANY',
    links: [
      { label: 'About', href: '/about' },
      { label: 'Careers', href: '/careers' },
      { label: 'Press Kit', href: '/press' },
      { label: 'Contact', href: '/contact' },
    ],
  },
  legal: {
    title: 'LEGAL',
    links: [
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Cookie Policy', href: '/cookies' },
      { label: 'GDPR', href: '/gdpr' },
    ],
  },
} as const

const SOCIAL_LINKS = [
  { label: 'Twitter', href: 'https://twitter.com/viblog', icon: Twitter },
  { label: 'GitHub', href: 'https://github.com/viblog', icon: Github },
] as const

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-bg-surface">
      {/* Main Footer Content */}
      <div className="container px-4 pt-20 pb-12 md:px-8">
        {/* CTA Card (Checkpoint 11.3.2) */}
        <div
          className={cn(
            'mb-16 overflow-hidden rounded-xl p-8 md:p-12',
            'bg-gradient-to-br from-accent-primary/10 via-transparent to-accent-secondary/10',
            'border border-[rgba(255,255,255,0.08)]'
          )}
        >
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="text-center md:text-left">
              <h3 className="font-display text-2xl font-bold text-fg-primary md:text-3xl">
                Ready to Start Your Vibe Journey?
              </h3>
              <p className="mt-2 text-fg-secondary">
                Join thousands of vibe coders sharing their AI-native experiences.
              </p>
            </div>
            <Link
              href="/register"
              className={cn(
                'group inline-flex items-center gap-2',
                'rounded-md bg-accent-primary px-6 py-3 text-base font-semibold text-white',
                'transition-all duration-200',
                'hover:bg-accent-primary-light hover:shadow-[0_0_20px_rgba(139,92,246,0.3)]'
              )}
            >
              Get Started Free
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        {/* 4-Column Grid (Checkpoint 11.3.3) */}
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 md:gap-12">
          {Object.entries(FOOTER_LINKS).map(([key, section]) => (
            <div key={key}>
              <h4 className="mb-4 text-xs font-semibold tracking-wider text-fg-muted uppercase">
                {section.title}
              </h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-fg-secondary transition-colors duration-150 hover:text-accent-primary"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Section (Checkpoint 11.3.4) */}
      <div className="border-t border-[rgba(255,255,255,0.06)]">
        <div className="container flex flex-col items-center justify-between gap-4 px-4 py-6 md:flex-row md:px-8">
          {/* Logo + Copyright */}
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2">
              <PenTool className="h-5 w-5 text-accent-primary" />
              <span className="bg-gradient-to-r from-white to-white/70 bg-clip-text font-display font-bold text-transparent">
                Viblog
              </span>
            </Link>
            <span className="text-sm text-fg-muted">
              &copy; {currentYear} Viblog. Made with AI, for AI.
            </span>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            {SOCIAL_LINKS.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-fg-muted transition-colors duration-150 hover:text-accent-primary"
                aria-label={social.label}
              >
                <social.icon className="h-5 w-5" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}