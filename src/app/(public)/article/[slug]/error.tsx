'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { AlertTriangle } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="container py-16">
      <Card className="mx-auto max-w-md">
        <CardContent className="pt-6 text-center">
          <AlertTriangle className="mx-auto mb-4 h-12 w-12 text-destructive" />
          <h2 className="mb-2 text-xl font-semibold">Failed to load article</h2>
          <p className="mb-4 text-muted-foreground">
            This article could not be loaded. It may have been removed or is temporarily
            unavailable.
          </p>
          <div className="flex justify-center gap-2">
            <Button variant="outline" onClick={reset}>
              Try again
            </Button>
            <Link
              href="/"
              className="hover:bg-primary/80 inline-flex items-center justify-center rounded-lg bg-primary px-2.5 py-1.5 text-sm font-medium text-primary-foreground"
            >
              Go home
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
