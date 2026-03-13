'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const DATABASE_TYPES = [
  { id: 'supabase', name: 'Supabase', description: 'Managed PostgreSQL' },
  { id: 'clickhouse', name: 'ClickHouse', description: 'Analytics database' },
  { id: 'sqlite', name: 'SQLite', description: 'Local database' },
  { id: 'none', name: 'None', description: 'Skip database configuration' },
] as const

interface Step2Props {
  onNext: () => void
  onBack: () => void
}

export function Step2Database({ onNext, onBack }: Step2Props) {
  const [dbType, setDbType] = useState<string>('supabase')
  const [dbUrl, setDbUrl] = useState('')
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
          database_type: dbType === 'none' ? null : dbType,
          database_url_encrypted: dbUrl || null,
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
        <CardTitle>Configure Database</CardTitle>
        <CardDescription>
          Choose where to store your data. You can use your own database or skip this step.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label>Database Type</Label>
            <div className="grid grid-cols-2 gap-2">
              {DATABASE_TYPES.map((db) => (
                <button
                  key={db.id}
                  type="button"
                  onClick={() => setDbType(db.id)}
                  className={`rounded-lg border p-3 text-left transition-colors ${
                    dbType === db.id
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:bg-accent'
                  }`}
                >
                  <div className="text-sm font-medium">{db.name}</div>
                  <div className="text-xs text-muted-foreground">{db.description}</div>
                </button>
              ))}
            </div>
          </div>

          {dbType !== 'none' && (
            <div className="space-y-2">
              <Label htmlFor="dbUrl">Connection URL</Label>
              <Input
                id="dbUrl"
                type="password"
                placeholder="Enter your database connection URL"
                value={dbUrl}
                onChange={(e) => setDbUrl(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Your connection string is stored securely.
              </p>
            </div>
          )}

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