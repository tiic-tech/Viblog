import type { Metadata } from 'next'
import { Inter, JetBrains_Mono, Outfit } from 'next/font/google'
import './globals.css'
import '@/styles/design-system.css'
import { cn } from "@/lib/utils";

// Display Font - Modern geometric sans for headlines
const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['400', '500', '600', '700'],
})

// Body Font - Optimized for readability
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
})

// Code Font - Excellent legibility for code
const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-code',
})

export const metadata: Metadata = {
  title: 'Viblog - AI-Native Blog for Vibe Coders',
  description: 'Capture, share, and grow from your AI-assisted development experiences. Transform your coding sessions into gallery-worthy articles.',
  keywords: ['AI', 'blog', 'vibe coding', 'developer', 'MCP', 'Claude', 'Cursor'],
  authors: [{ name: 'Viblog Team' }],
  openGraph: {
    title: 'Viblog - AI-Native Blog for Vibe Coders',
    description: 'Transform your coding sessions into gallery-worthy articles',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={cn(
        "dark",
        "font-body",
        inter.variable,
        outfit.variable,
        jetbrainsMono.variable
      )}
    >
      <body className="antialiased bg-bg-deep text-fg-primary">
        {children}
      </body>
    </html>
  )
}