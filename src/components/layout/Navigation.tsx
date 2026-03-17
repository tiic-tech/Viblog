'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { PenTool, Menu, X, ChevronRight } from 'lucide-react'
import { Button, buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

/**
 * Viblog Navigation Component
 *
 * Design Philosophy: Effortel-inspired premium navigation
 * - 72px fixed header with backdrop blur
 * - Smart scroll behavior (hide down, show up)
 * - Premium hover effects with accent colors
 * - Full-screen mobile menu with smooth animations
 *
 * Phase 11.2: Navigation Implementation
 */

// Navigation items configuration
const NAV_ITEMS = [
  { label: 'Explore', href: '/#exhibitions' },
  { label: 'Features', href: '/#features' },
  { label: 'Pricing', href: '/#pricing' },
  { label: 'About', href: '/about' },
] as const

// Scroll threshold for hiding navigation
const SCROLL_THRESHOLD = 100

interface NavigationProps {
  user: { id: string } | null
}

export function Navigation({ user }: NavigationProps) {
  // State for scroll behavior
  const [isScrolled, setIsScrolled] = useState(false)
  const [isHidden, setIsHidden] = useState(false)
  const [lastScrollY, setLastScrollY] = useState(0)

  // State for mobile menu
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Handle scroll behavior (Checkpoint 11.2.2)
  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY

    // Add background opacity when scrolled
    setIsScrolled(currentScrollY > 10)

    // Hide on scroll down, show on scroll up
    if (currentScrollY > SCROLL_THRESHOLD) {
      if (currentScrollY > lastScrollY) {
        // Scrolling down - hide nav
        setIsHidden(true)
      } else {
        // Scrolling up - show nav
        setIsHidden(false)
      }
    } else {
      // Near top - always show
      setIsHidden(false)
    }

    setLastScrollY(currentScrollY)
  }, [lastScrollY])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  // Close mobile menu on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMobileMenuOpen(false)
      }
    }

    if (isMobileMenuOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }, [isMobileMenuOpen])

  return (
    <>
      {/* Fixed Header (Checkpoint 11.2.1) */}
      <header
        className={cn(
          'fixed left-0 right-0 top-0 z-50 h-[72px] transition-all duration-300',
          // Background with backdrop blur
          'border-b backdrop-blur-md',
          // Dynamic background based on scroll
          isScrolled
            ? 'bg-[rgba(5,5,8,0.95)] border-[rgba(255,255,255,0.08)]'
            : 'bg-[rgba(5,5,8,0.9)] border-[rgba(255,255,255,0.05)]',
          // Hide on scroll down
          isHidden && '-translate-y-full'
        )}
      >
        <div className="container flex h-full items-center justify-between px-4 md:px-8">
          {/* Logo with gradient text (Checkpoint 11.2.3) */}
          <Link
            href="/"
            className="group flex items-center gap-2.5 text-xl font-bold transition-opacity hover:opacity-80"
          >
            <PenTool className="h-6 w-6 text-accent-primary" />
            <span className="bg-gradient-to-r from-white to-white/70 bg-clip-text font-display tracking-tight text-transparent">
              Viblog
            </span>
          </Link>

          {/* Navigation - Desktop (Checkpoint 11.2.3) */}
          <nav
            aria-label="Main navigation"
            className="hidden items-center gap-8 md:flex"
          >
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-[14px] font-medium text-fg-secondary transition-all duration-150 ease-out hover:text-accent-primary"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Auth Buttons & CTA (Checkpoint 11.2.3) */}
          <div className="hidden items-center gap-3 md:flex">
            {user ? (
              <>
                <Link href="/dashboard">
                  <Button variant="ghost" size="sm">
                    Dashboard
                  </Button>
                </Link>
                <Link href="/dashboard/articles/new">
                  <Button size="sm">Write Article</Button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link
                  href="/register"
                  className={cn(
                    buttonVariants({ variant: 'premium', size: 'sm' }),
                    'font-semibold'
                  )}
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button (Checkpoint 11.2.4) */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </header>

      {/* Mobile Menu Overlay (Checkpoint 11.2.4) */}
      <div
        className={cn(
          'fixed inset-0 z-[60] md:hidden',
          'transition-opacity duration-300',
          isMobileMenuOpen
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        )}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />

        {/* Menu Panel - Slide from right */}
        <div
          className={cn(
            'absolute right-0 top-0 h-full w-full max-w-sm',
            'bg-bg-elevated border-l border-[rgba(255,255,255,0.08)]',
            'transition-transform duration-300 ease-out',
            isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          )}
        >
          {/* Close Button */}
          <div className="flex h-[72px] items-center justify-end px-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(false)}
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Mobile Navigation Items */}
          <nav className="flex flex-col px-6 py-4">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="group flex items-center justify-between py-4 text-lg font-medium text-fg-primary transition-colors hover:text-accent-primary"
              >
                {item.label}
                <ChevronRight className="h-5 w-5 text-fg-muted transition-transform group-hover:translate-x-1 group-hover:text-accent-primary" />
              </Link>
            ))}

            {/* Divider */}
            <div className="my-4 h-px bg-[rgba(255,255,255,0.08)]" />

            {/* Mobile Auth Buttons */}
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="py-4 text-lg font-medium text-fg-secondary transition-colors hover:text-accent-primary"
                >
                  Dashboard
                </Link>
                <Link
                  href="/dashboard/articles/new"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="mt-2"
                >
                  <Button className="w-full">Write Article</Button>
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="py-4 text-lg font-medium text-fg-secondary transition-colors hover:text-accent-primary"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="mt-2"
                >
                  <Button variant="premium" className="w-full font-semibold">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </>
  )
}