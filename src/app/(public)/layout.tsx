import { createClient } from '@/lib/supabase/server'
import { Toaster } from 'sonner'
import { Navigation } from '@/components/layout/Navigation'
import { Footer } from '@/components/layout/Footer'

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

      {/* Footer Component (Phase 11.3) */}
      <Footer />
    </div>
  )
}