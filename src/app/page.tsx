import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background text-foreground">
      <div className="container flex max-w-4xl flex-col items-center gap-8 px-4 py-16">
        <h1 className="text-5xl font-bold tracking-tight">
          <span className="text-primary">Vi</span>blog
        </h1>
        <p className="text-center text-xl text-muted-foreground">
          AI-Native Blogging Platform for Vibe Coders
        </p>

        <div className="flex gap-4">
          <Link
            href="/login"
            className="rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Sign In
          </Link>
          <Link
            href="/register"
            className="rounded-lg border border-border bg-background px-6 py-3 font-medium transition-colors hover:bg-accent"
          >
            Get Started
          </Link>
        </div>

        <div className="mt-16 grid gap-8 text-center">
          <h2 className="text-2xl font-semibold">Coming Soon</h2>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-lg border border-border p-6">
              <h3 className="font-semibold">Record</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Capture your vibe coding journey
              </p>
            </div>
            <div className="rounded-lg border border-border p-6">
              <h3 className="font-semibold">Share</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Transform experiences into beautiful content
              </p>
            </div>
            <div className="rounded-lg border border-border p-6">
              <h3 className="font-semibold">Grow</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Build your personal knowledge base
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}