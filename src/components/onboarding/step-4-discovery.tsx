'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const DISCOVERY_SOURCES = [
  { id: 'twitter', label: 'Twitter / X' },
  { id: 'github', label: 'GitHub' },
  { id: 'friend', label: 'Friend or Colleague' },
  { id: 'search', label: 'Search Engine' },
  { id: 'blog', label: 'Blog or Article' },
  { id: 'other', label: 'Other' },
] as const

interface Step4Props {
  onNext: () => void
  onBack: () => void
}

export function Step4Discovery({ onNext, onBack }: Step4Props) {
  const [source, setSource] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        setError('You must be logged in')
        return
      }

      // Update settings
      const { error: saveError } = await supabase
        .from('user_settings')
        .update({
          discovery_source: source,
        })
        .eq('user_id', user.id)

      if (saveError) {
        setError(saveError.message)
        return
      }

      onNext()
    } catch {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <CardTitle>How Did You Find Us?</CardTitle>
        <CardDescription>
          Help us understand how people discover Viblog. This is optional.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-3">
            {DISCOVERY_SOURCES.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setSource(s.id)}
                className={`rounded-lg border p-3 text-left transition-colors ${
                  source === s.id
                    ? 'border-primary bg-primary/10'
                    : 'border-border hover:bg-accent'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>

          {error && (
            <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-3">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={onBack} disabled={loading}>
              Back
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Continue'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}