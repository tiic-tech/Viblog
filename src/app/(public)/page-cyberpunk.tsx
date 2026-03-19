'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import type { PublicArticle } from '@/types/public'

// Glitch text effect
function GlitchText({ children, className }: { children: string; className?: string }) {
  return (
    <span className={`relative inline-block ${className}`}>
      <span className="relative z-10">{children}</span>
      <span
        className="absolute top-0 left-0 text-cyan-400 opacity-70 animate-pulse"
        style={{ clipPath: 'inset(0 0 50% 0)', transform: 'translate(-2px, 0)' }}
        aria-hidden
      >
        {children}
      </span>
      <span
        className="absolute top-0 left-0 text-rose-500 opacity-70"
        style={{ clipPath: 'inset(50% 0 0 0)', transform: 'translate(2px, 0)' }}
        aria-hidden
      >
        {children}
      </span>
    </span>
  )
}

// Typing animation for terminal
function TypeWriter({ text, delay = 50 }: { text: string; delay?: number }) {
  const [displayText, setDisplayText] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex])
        setCurrentIndex(prev => prev + 1)
      }, delay)
      return () => clearTimeout(timeout)
    }
  }, [currentIndex, delay, text])

  return (
    <span>
      {displayText}
      <span className="animate-pulse">_</span>
    </span>
  )
}

// Matrix rain effect
function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789'
    const fontSize = 14
    const columns = canvas.width / fontSize
    const drops: number[] = []

    for (let i = 0; i < columns; i++) {
      drops[i] = Math.random() * -100
    }

    const draw = () => {
      ctx.fillStyle = 'rgba(5, 5, 8, 0.05)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.fillStyle = '#8b5cf6'
      ctx.font = `${fontSize}px monospace`

      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)]
        ctx.fillStyle = Math.random() > 0.98 ? '#06b6d4' : Math.random() > 0.95 ? '#f43f5e' : '#8b5cf640'
        ctx.fillText(text, i * fontSize, drops[i] * fontSize)

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0
        }
        drops[i]++
      }
    }

    const interval = setInterval(draw, 50)

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    window.addEventListener('resize', handleResize)

    return () => {
      clearInterval(interval)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 opacity-30 pointer-events-none"
    />
  )
}

// Neon grid background
function NeonGrid() {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      {/* Horizontal lines */}
      <div className="absolute inset-0" style={{
        backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 50px, rgba(139, 92, 246, 0.1) 50px, rgba(139, 92, 246, 0.1) 51px)`,
      }} />
      {/* Vertical lines */}
      <div className="absolute inset-0" style={{
        backgroundImage: `repeating-linear-gradient(90deg, transparent, transparent 50px, rgba(6, 182, 212, 0.1) 50px, rgba(6, 182, 212, 0.1) 51px)`,
      }} />
      {/* Perspective grid */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[50vh]"
        style={{
          background: `linear-gradient(to top, rgba(139, 92, 246, 0.2), transparent)`,
          transform: 'perspective(500px) rotateX(60deg)',
          transformOrigin: 'bottom',
        }}
      />
    </div>
  )
}

// Scanline overlay
function ScanlineOverlay() {
  return (
    <div className="fixed inset-0 z-50 pointer-events-none opacity-10">
      <div
        className="w-full h-full"
        style={{
          backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 0, 0, 0.3) 2px, rgba(0, 0, 0, 0.3) 4px)`,
        }}
      />
    </div>
  )
}

// Mock articles
const mockArticles: PublicArticle[] = [
  { id: '1', title: 'SYSTEM://AI_AGENT_BUILD', slug: 'ai-agent', excerpt: 'Building real-time AI agents', cover_image: null, vibe_platform: 'claude', vibe_duration_minutes: 47, vibe_model: 'claude-opus-4', stars_count: 234, views_count: 1520, published_at: new Date().toISOString(), profiles: { username: 'n3rd', display_name: 'N3RD', avatar_url: null }, projects: { id: '1', name: 'AI', color: '#8b5cf6' } },
  { id: '2', title: 'EXEC://CURSOR_PIPELINE', slug: 'cursor', excerpt: 'Design to code pipeline', cover_image: null, vibe_platform: 'cursor', vibe_duration_minutes: 32, vibe_model: 'claude-sonnet', stars_count: 189, views_count: 980, published_at: new Date().toISOString(), profiles: { username: 'h4ck3r', display_name: 'H4CK3R', avatar_url: null }, projects: { id: '2', name: 'Tools', color: '#06b6d4' } },
  { id: '3', title: 'DATA://ZERO_TO_SHIP', slug: 'ship', excerpt: '3 hour shipping sprint', cover_image: null, vibe_platform: 'windsurf', vibe_duration_minutes: 180, vibe_model: 'gpt-4', stars_count: 456, views_count: 2340, published_at: new Date().toISOString(), profiles: { username: 'sh1p', display_name: 'SH1P', avatar_url: null }, projects: { id: '3', name: 'Speed', color: '#f59e0b' } },
  { id: '4', title: 'CORE://ERROR_HANDLING', slug: 'errors', excerpt: 'Robust AI code patterns', cover_image: null, vibe_platform: 'copilot', vibe_duration_minutes: 25, vibe_model: 'gpt-4', stars_count: 98, views_count: 543, published_at: new Date().toISOString(), profiles: { username: 'd3bug', display_name: 'D3BUG', avatar_url: null }, projects: { id: '4', name: 'Stability', color: '#10b981' } },
  { id: '5', title: 'PROMPT://ENGINEERING', slug: 'prompts', excerpt: 'Advanced prompt patterns', cover_image: null, vibe_platform: 'claude', vibe_duration_minutes: 55, vibe_model: 'claude-opus-4', stars_count: 312, views_count: 1876, published_at: new Date().toISOString(), profiles: { username: 'pr0mpt', display_name: 'PR0MPT', avatar_url: null }, projects: { id: '5', name: 'AI', color: '#f43f5e' } },
  { id: '6', title: 'NET://MICROSERVICES', slug: 'micro', excerpt: 'Scalable architectures', cover_image: null, vibe_platform: 'cursor', vibe_duration_minutes: 89, vibe_model: 'claude-sonnet', stars_count: 167, views_count: 923, published_at: new Date().toISOString(), profiles: { username: '4rch', display_name: '4RCH', avatar_url: null }, projects: { id: '6', name: 'Scale', color: '#8b5cf6' } },
]

export default function CyberpunkHomepage() {
  const [currentCommand, setCurrentCommand] = useState(0)
  const commands = [
    { cmd: 'viblog --init', output: 'Initializing AI-native environment...' },
    { cmd: 'ai.connect --model claude-opus-4', output: 'Connected to Claude Opus 4.6' },
    { cmd: 'session.capture --vibe', output: 'Recording vibe coding session...' },
    { cmd: 'blog.transform --ai-native', output: 'Transforming into exhibition...' },
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentCommand(prev => (prev + 1) % commands.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [commands.length])

  return (
    <div className="relative min-h-screen bg-bg-deep text-fg-primary overflow-hidden">
      {/* Background Effects */}
      <MatrixRain />
      <NeonGrid />
      <ScanlineOverlay />

      {/* Main Content */}
      <div className="relative z-10">
        {/* Hero Terminal */}
        <section className="min-h-screen flex flex-col items-center justify-center px-6">
          <div className="max-w-4xl w-full">
            {/* Terminal Window */}
            <div className="rounded-lg border border-accent-primary/30 overflow-hidden" style={{ background: 'rgba(10, 10, 15, 0.8)', boxShadow: '0 0 50px rgba(139, 92, 246, 0.2)' }}>
              {/* Terminal Header */}
              <div className="flex items-center gap-2 px-4 py-3 bg-bg-elevated/50 border-b border-accent-primary/20">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <span className="text-fg-muted text-sm font-mono ml-4">viblog@terminal:~</span>
              </div>

              {/* Terminal Content */}
              <div className="p-6 font-mono text-sm md:text-base">
                <div className="text-fg-muted mb-4">
                  <span className="text-accent-primary">root@viblog</span>
                  <span className="text-fg-dim">:</span>
                  <span className="text-accent-secondary">~</span>
                  <span className="text-fg-dim">$</span>
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentCommand}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="text-accent-primary-light">
                      $ <TypeWriter text={commands[currentCommand].cmd} delay={80} />
                    </div>
                    <div className="text-fg-secondary mt-2 ml-4">
                      {'>'} {commands[currentCommand].output}
                    </div>
                  </motion.div>
                </AnimatePresence>

                <div className="mt-8 pt-4 border-t border-border-subtle">
                  <div className="text-2xl md:text-4xl font-display font-bold">
                    <GlitchText className="text-fg-primary">VIBLOG</GlitchText>
                  </div>
                  <div className="text-accent-secondary mt-2">
                    {'// '}AI-Native Blogging for Vibe Coders
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mt-8 justify-center">
              <Link
                href="/register"
                className="px-8 py-4 bg-accent-primary text-white font-mono font-bold rounded border-2 border-accent-primary hover:bg-accent-primary-dark transition-all"
                style={{ boxShadow: '0 0 20px rgba(139, 92, 246, 0.5), inset 0 0 20px rgba(139, 92, 246, 0.1)' }}
              >
                {'>'} INITIALIZE ACCOUNT
              </Link>
              <Link
                href="#files"
                className="px-8 py-4 bg-transparent text-accent-secondary font-mono font-bold rounded border-2 border-accent-secondary hover:bg-accent-secondary/10 transition-all"
              >
                {'>'} EXPLORE FILES
              </Link>
            </div>
          </div>
        </section>

        {/* File System Grid */}
        <section id="files" className="py-20 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-4 mb-12">
              <div className="text-accent-primary font-mono">{'// FILE SYSTEM'}</div>
              <div className="flex-1 h-px bg-gradient-to-r from-accent-primary/50 to-transparent" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mockArticles.map((article, index) => (
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group"
                >
                  <Link href={`/article/${article.slug}`}>
                    <div
                      className="p-4 rounded border border-border-subtle hover:border-accent-primary/50 transition-all duration-300"
                      style={{ background: 'rgba(10, 10, 15, 0.6)' }}
                    >
                      {/* File Header */}
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-accent-tertiary">{'<'}</span>
                        <span className="font-mono text-sm text-accent-secondary">{article.vibe_platform}</span>
                        <span className="text-fg-muted text-xs">{article.vibe_duration_minutes}min</span>
                        <span className="text-fg-dim ml-auto">#{String(index + 1).padStart(3, '0')}</span>
                      </div>

                      {/* Title */}
                      <h3 className="font-mono text-lg text-fg-primary group-hover:text-accent-primary-light transition-colors">
                        {article.title}
                      </h3>

                      {/* Meta */}
                      <div className="flex items-center gap-4 mt-3 text-xs font-mono text-fg-muted">
                        <span className="text-accent-primary">@{article.profiles.username}</span>
                        <span>*{article.stars_count}</span>
                        <span>+{article.views_count}</span>
                      </div>

                      {/* Hover glow */}
                      <div
                        className="absolute inset-0 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                        style={{ boxShadow: 'inset 0 0 30px rgba(139, 92, 246, 0.1)' }}
                      />
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 px-6 border-t border-border-subtle">
          <div className="max-w-4xl mx-auto grid grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl md:text-5xl font-mono font-bold text-accent-primary">1.2K+</div>
              <div className="text-fg-muted font-mono text-sm mt-2">{'// SESSIONS'}</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-mono font-bold text-accent-secondary">340+</div>
              <div className="text-fg-muted font-mono text-sm mt-2">{'// CODERS'}</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-mono font-bold text-accent-tertiary">50K+</div>
              <div className="text-fg-muted font-mono text-sm mt-2">{'// VIEWS'}</div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 px-6">
          <div className="max-w-2xl mx-auto text-center">
            <div className="font-mono text-2xl md:text-4xl mb-8">
              <span className="text-fg-muted">{'>'}</span>{' '}
              <GlitchText className="text-fg-primary">READY TO VIBE?</GlitchText>
            </div>
            <Link
              href="/register"
              className="inline-block px-8 py-4 bg-accent-primary text-white font-mono font-bold rounded transition-all hover:shadow-lg"
              style={{ boxShadow: '0 0 30px rgba(139, 92, 246, 0.3)' }}
            >
              {'>'} START YOUR JOURNEY
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}