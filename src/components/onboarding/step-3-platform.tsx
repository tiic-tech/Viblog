'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const VIBE_PLATFORMS = [
  { id: 'claude-code', name: 'Claude Code', icon: '🤖' },
  { id: 'cursor', name: 'Cursor', icon: '✨' },
  { id: 'codex', name: 'Codex', icon: '📝' },
  { id: 'trae', name: 'Trae', icon: '🚀' },
  { id: 'other', name: 'Other', icon: '📦' },
] as const

interface Step3Props {
  onNext: () => void
  onBack: () => void
}

export function Step3Platform({ onNext, onBack }: Step3Props) {
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['claude-code'])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const togglePlatform = (platformId: string) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platformId)
        ? prev.filter((p) => p !== platformId)
        : [...prev, platformId]
    )
  }

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
          vibe_platforms: selectedPlatforms.map((p) => ({ name: p })),
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
        <CardTitle>Vibe Coding Platforms</CardTitle>
        <CardDescription>
          Which AI coding assistants do you use? Select all that apply.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-3">
            {VIBE_PLATFORMS.map((platform) => (
              <button
                key={platform.id}
                type="button"
                onClick={() => togglePlatform(platform.id)}
                className={`flex items-center gap-3 rounded-lg border p-4 text-left transition-colors ${
                  selectedPlatforms.includes(platform.id)
                    ? 'border-primary bg-primary/10'
                    : 'border-border hover:bg-accent'
                }`}
              >
                <span className="text-2xl">{platform.icon}</span>
                <span className="font-medium">{platform.name}</span>
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