'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export function Step5Welcome() {
  const router = useRouter()
  const [status, setStatus] = useState<'generating' | 'success' | 'error'>('generating')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    generateWelcomeBlog()
  }, [])

  const generateWelcomeBlog = async () => {
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        setError('You must be logged in')
        setStatus('error')
        return
      }

      // Create a welcome article
      const welcomeContent = `# Welcome to Viblog!

This is your first blog post, automatically generated to help you get started.

## What is Viblog?

Viblog is an AI-Native blogging platform designed for **Vibe Coders** - developers who use AI assistants to write code.

## Features

- **Record** your vibe coding journey
- **Share** your experiences with the community
- **Grow** your personal knowledge base

## Getting Started

1. Create your first **Project** to organize your articles
2. Write your first blog post about your coding experience
3. Share it with the world!

---

Happy Vibe Coding!`

      const { error: articleError } = await supabase
        .from('articles')
        .insert({
          user_id: user.id,
          title: 'Welcome to Viblog!',
          slug: `welcome-${Date.now()}`,
          content: welcomeContent,
          excerpt: 'Your first blog post to get started with Viblog.',
          status: 'draft',
          visibility: 'private',
        })

      if (articleError) {
        console.error('Failed to create welcome article:', articleError)
        // Don't fail the onboarding if article creation fails
      }

      setStatus('success')
    } catch (err) {
      console.error('Error generating welcome blog:', err)
      setStatus('error')
      setError('Failed to generate welcome blog')
    }
  }

  const handleFinish = () => {
    router.push('/dashboard')
    router.refresh()
  }

  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <CardTitle>
          {status === 'generating' && 'Setting Up Your Blog...'}
          {status === 'success' && 'You are All Set!'}
          {status === 'error' && 'Almost There!'}
        </CardTitle>
        <CardDescription>
          {status === 'generating' && 'Creating your first blog post...'}
          {status === 'success' && 'Your Viblog is ready to use.'}
          {status === 'error' && 'You can start writing your first blog.'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {status === 'generating' && (
          <div className="flex flex-col items-center gap-4 py-8">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            <p className="text-sm text-muted-foreground">Generating your welcome blog...</p>
          </div>
        )}

        {(status === 'success' || status === 'error') && (
          <div className="space-y-6">
            {error && (
              <div className="rounded-lg border border-warning/50 bg-warning/10 p-3">
                <p className="text-sm text-warning">{error}</p>
              </div>
            )}

            <div className="rounded-lg border border-primary/50 bg-primary/10 p-4">
              <h3 className="font-semibold">What is Next?</h3>
              <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                <li>1. Create your first Project</li>
                <li>2. Write about your vibe coding experience</li>
                <li>3. Share with the community</li>
              </ul>
            </div>

            <Button onClick={handleFinish} className="w-full">
              Go to Dashboard
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}