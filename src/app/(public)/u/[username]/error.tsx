'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { AlertTriangle, UserX } from 'lucide-react'

export default function ProfileError({
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
          <UserX className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
          <h2 className="mb-2 text-xl font-semibold">User not found</h2>
          <p className="mb-4 text-muted-foreground">
            This user profile could not be found. The account may have been deleted.
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
