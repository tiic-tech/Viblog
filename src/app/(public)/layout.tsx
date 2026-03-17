import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { PenTool } from 'lucide-react'
import { Toaster } from 'sonner'
import { Navigation } from '@/components/layout/Navigation'

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <div className="flex min-h-screen flex-col">
      {/* Skip to main content link for keyboard users */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-accent-primary focus:px-4 focus:py-2 focus:text-white focus:outline-none"
      >
        Skip to main content
      </a>

      {/* Navigation Component (Phase 11.2) */}
      <Navigation user={user} />

      {/* Main Content - pt-[72px] compensates for fixed header */}
      <main id="main-content" className="flex-1 pt-[72px]" role="main">
        {children}
      </main>

      {/* Toast Notifications */}
      <Toaster position="bottom-right" />

      {/* Footer - Will be replaced in Step 11.3 */}
      <footer className="bg-muted/30 border-t py-8">
        <div className="container">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-2 font-semibold">
              <PenTool className="h-5 w-5 text-accent-primary" />
              <span className="bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
                Viblog
              </span>
            </div>

            <nav
              aria-label="Footer navigation"
              className="flex items-center gap-6 text-sm text-muted-foreground"
            >
              <Link href="/" className="transition-colors hover:text-accent-primary">
                Feed
              </Link>
              <Link href="/about" className="transition-colors hover:text-accent-primary">
                About
              </Link>
              <Link href="/privacy" className="transition-colors hover:text-accent-primary">
                Privacy
              </Link>
              <Link href="/terms" className="transition-colors hover:text-accent-primary">
                Terms
              </Link>
            </nav>

            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} Viblog. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}