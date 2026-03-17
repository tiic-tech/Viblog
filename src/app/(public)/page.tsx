'use client'

import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import Link from 'next/link'
import type { PublicArticle } from '@/types/public'

// Animated code snippets floating in space
const floatingCodeSnippets = [
  { code: 'const vibe = await ai.collaborate()', delay: 0, x: '10%', y: '20%' },
  { code: 'function create() { return magic }', delay: 0.5, x: '75%', y: '15%' },
  { code: 'export default async function build()', delay: 1, x: '60%', y: '70%' },
  { code: 'await stream.think(process)', delay: 1.5, x: '20%', y: '80%' },
  { code: 'const future = await ship()', delay: 2, x: '85%', y: '50%' },
]

// Platform colors
const platformColors: Record<string, string> = {
  cursor: '#8b5cf6',
  claude: '#f43f5e',
  copilot: '#06b6d4',
  windsurf: '#f59e0b',
  replit: '#10b981',
}

// Mock articles for demo when no data
const mockArticles: PublicArticle[] = [
  {
    id: '1',
    title: 'Building a Real-Time AI Agent with Claude and WebSocket',
    slug: 'building-realtime-ai-agent',
    excerpt: 'A deep dive into creating responsive AI agents that feel truly conversational.',
    cover_image: null,
    vibe_platform: 'claude',
    vibe_duration_minutes: 47,
    vibe_model: 'claude-opus-4',
    stars_count: 234,
    views_count: 1520,
    published_at: new Date().toISOString(),
    profiles: { username: 'vibecoder', display_name: 'Vibe Coder', avatar_url: null },
    projects: { id: '1', name: 'AI Agents', color: '#8b5cf6' },
  },
  {
    id: '2',
    title: 'Cursor + Figma: The Ultimate Design-to-Code Pipeline',
    slug: 'cursor-figma-pipeline',
    excerpt: 'How I built a seamless workflow from design files to production code.',
    cover_image: null,
    vibe_platform: 'cursor',
    vibe_duration_minutes: 32,
    vibe_model: 'claude-sonnet',
    stars_count: 189,
    views_count: 980,
    published_at: new Date(Date.now() - 86400000).toISOString(),
    profiles: { username: 'designer', display_name: 'Design Dev', avatar_url: null },
    projects: { id: '2', name: 'DevTools', color: '#06b6d4' },
  },
  {
    id: '3',
    title: 'My Journey: From Zero to Shipping in 3 Hours',
    slug: 'zero-to-shipping-3-hours',
    excerpt: 'The power of vibe coding when you let AI handle the heavy lifting.',
    cover_image: null,
    vibe_platform: 'windsurf',
    vibe_duration_minutes: 180,
    vibe_model: 'gpt-4',
    stars_count: 456,
    views_count: 2340,
    published_at: new Date(Date.now() - 172800000).toISOString(),
    profiles: { username: 'shipfast', display_name: 'Ship Fast', avatar_url: null },
    projects: { id: '3', name: 'Startups', color: '#f59e0b' },
  },
  {
    id: '4',
    title: 'Error Handling Patterns for AI-Generated Code',
    slug: 'error-handling-ai-code',
    excerpt: 'Making your vibe-coded applications robust and production-ready.',
    cover_image: null,
    vibe_platform: 'copilot',
    vibe_duration_minutes: 25,
    vibe_model: 'gpt-4',
    stars_count: 98,
    views_count: 543,
    published_at: new Date(Date.now() - 259200000).toISOString(),
    profiles: { username: 'stability', display_name: 'Stable Code', avatar_url: null },
    projects: { id: '4', name: 'Best Practices', color: '#10b981' },
  },
  {
    id: '5',
    title: 'The Art of Prompt Engineering for Developers',
    slug: 'prompt-engineering-developers',
    excerpt: 'Advanced techniques to get the most out of your AI coding sessions.',
    cover_image: null,
    vibe_platform: 'claude',
    vibe_duration_minutes: 55,
    vibe_model: 'claude-opus-4',
    stars_count: 312,
    views_count: 1876,
    published_at: new Date(Date.now() - 345600000).toISOString(),
    profiles: { username: 'prompter', display_name: 'Prompt Master', avatar_url: null },
    projects: { id: '5', name: 'AI Skills', color: '#f43f5e' },
  },
  {
    id: '6',
    title: 'Building Microservices with AI Assistance',
    slug: 'microservices-ai-assistance',
    excerpt: 'Architecting scalable systems with vibe coding workflows.',
    cover_image: null,
    vibe_platform: 'cursor',
    vibe_duration_minutes: 89,
    vibe_model: 'claude-sonnet',
    stars_count: 167,
    views_count: 923,
    published_at: new Date(Date.now() - 432000000).toISOString(),
    profiles: { username: 'architect', display_name: 'System Architect', avatar_url: null },
    projects: { id: '6', name: 'Architecture', color: '#8b5cf6' },
  },
]

export default function RevolutionaryHomepage() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [articles] = useState<PublicArticle[]>(mockArticles)
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 })

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  // Smooth spring animation for scroll progress
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  })

  // Parallax transforms
  const heroY = useTransform(smoothProgress, [0, 0.3], [0, -200])
  const heroOpacity = useTransform(smoothProgress, [0, 0.2], [1, 0])
  const titleScale = useTransform(smoothProgress, [0, 0.15], [1, 0.9])

  // Track mouse for spotlight effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCursorPos({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <div
      ref={containerRef}
      className="relative min-h-[400vh] bg-bg-deep overflow-hidden"
    >
      {/* Global Spotlight that follows cursor */}
      <div
        className="pointer-events-none fixed inset-0 z-0 transition-opacity duration-300"
        style={{
          background: `radial-gradient(600px circle at ${cursorPos.x}px ${cursorPos.y}px, rgba(139, 92, 246, 0.06), transparent 40%)`,
        }}
      />

      {/* Ambient Background Mesh */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-mesh opacity-50" />
        <motion.div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(ellipse 80% 50% at 50% 0%, rgba(139, 92, 246, 0.12), transparent)`,
            y: heroY,
          }}
        />
      </div>

      {/* Floating Code Particles */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        {floatingCodeSnippets.map((snippet, index) => (
          <motion.code
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: [0.1, 0.3, 0.1],
              y: [0, -30, 0],
              x: [0, 10, 0],
            }}
            transition={{
              duration: 8 + index,
              repeat: Infinity,
              delay: snippet.delay,
              ease: 'easeInOut',
            }}
            className="absolute text-xs font-mono text-fg-dim/30 whitespace-nowrap select-none"
            style={{ left: snippet.x, top: snippet.y }}
          >
            {snippet.code}
          </motion.code>
        ))}
      </div>

      {/* Hero Section - Full Immersive Experience */}
      <motion.section
        style={{ y: heroY, opacity: heroOpacity }}
        className="relative z-10 h-screen flex items-center justify-center"
      >
        <div className="container relative">
          <motion.div
            style={{ scale: titleScale }}
            className="max-w-5xl mx-auto text-center"
          >
            {/* Pre-title Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border-subtle bg-glass-bg backdrop-blur-sm mb-8"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-primary opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-primary" />
              </span>
              <span className="text-sm text-fg-secondary font-medium">
                The AI-Native Blogging Platform
              </span>
            </motion.div>

            {/* Main Title */}
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-display font-bold tracking-tighter mb-6"
            >
              <span className="block text-fg-primary">Where</span>
              <span className="block bg-gradient-to-r from-accent-primary via-accent-secondary to-accent-tertiary bg-clip-text text-transparent">
                Code Meets Art
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-xl md:text-2xl text-fg-secondary max-w-2xl mx-auto mb-12 leading-relaxed"
            >
              Every vibe coding session becomes a masterpiece. Record your journey,
              share your process, and build your legacy.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link
                href="/register"
                className="group relative px-8 py-4 bg-accent-primary text-white rounded-xl font-semibold text-lg overflow-hidden transition-all duration-300 hover:shadow-lg"
                style={{ boxShadow: '0 0 30px rgba(139, 92, 246, 0.3)' }}
              >
                <span className="relative z-10">Start Your Journey</span>
                <div className="absolute inset-0 bg-gradient-to-r from-accent-primary-dark to-accent-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Link>
              <a
                href="#exhibitions"
                className="px-8 py-4 border border-border-emphasis text-fg-primary rounded-xl font-semibold text-lg backdrop-blur-sm hover:bg-glass-bg-hover transition-all duration-300"
              >
                Explore Exhibitions
              </a>
            </motion.div>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="absolute bottom-12 left-1/2 -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="flex flex-col items-center gap-2 text-fg-muted"
            >
              <span className="text-sm font-medium tracking-wide uppercase">Scroll to Explore</span>
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Journey Timeline Section */}
      <section className="relative z-10 py-32">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center mb-24"
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6">
              <span className="text-fg-primary">Three Steps to</span>
              <span className="block text-accent-primary-light mt-2">Vibe Coding Mastery</span>
            </h2>
          </motion.div>

          {/* The Journey Steps */}
          <div className="relative max-w-6xl mx-auto">
            {/* Connecting Line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-accent-primary via-accent-secondary to-accent-tertiary opacity-30 hidden lg:block" />

            {[
              {
                number: '01',
                title: 'Record',
                description: 'Capture every prompt, every decision, every breakthrough. Your vibe coding sessions become detailed narratives.',
                icon: (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                ),
              },
              {
                number: '02',
                title: 'Share',
                description: 'Transform raw sessions into beautiful articles. Your code becomes art, your process becomes inspiration.',
                icon: (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                ),
              },
              {
                number: '03',
                title: 'Grow',
                description: 'Build your knowledge base. Track your evolution as a vibe coder. Inspire the next generation.',
                icon: (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                ),
              },
            ].map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, x: index % 2 === 0 ? -60 : 60 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ delay: index * 0.2, duration: 0.8 }}
                className={`relative flex items-center gap-8 mb-16 lg:mb-24 ${
                  index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
                }`}
              >
                <div className={`flex-1 ${index % 2 === 0 ? 'lg:text-right' : 'lg:text-left'}`}>
                  <div className="inline-flex items-center gap-4 px-6 py-4 rounded-2xl bg-glass-bg backdrop-blur-sm border border-glass-border hover:border-accent-primary/30 transition-all duration-300 group">
                    <div className="flex items-center justify-center w-16 h-16 rounded-xl bg-accent-primary/10 text-accent-primary group-hover:scale-110 transition-transform duration-300">
                      {step.icon}
                    </div>
                    <div className="text-left">
                      <span className="text-fg-muted text-sm font-mono">{step.number}</span>
                      <h3 className="text-2xl font-display font-bold text-fg-primary">{step.title}</h3>
                    </div>
                  </div>
                  <p className="mt-4 text-lg text-fg-secondary max-w-md mx-auto lg:mx-0">
                    {step.description}
                  </p>
                </div>
                <div className="hidden lg:flex items-center justify-center w-12 h-12 rounded-full bg-bg-elevated border-2 border-accent-primary text-accent-primary font-mono font-bold z-10">
                  {step.number}
                </div>
                <div className="flex-1 hidden lg:block" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Exhibition Gallery Section */}
      <section id="exhibitions" className="relative z-10 py-32">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center mb-16"
          >
            <span className="text-accent-primary font-mono text-sm tracking-widest uppercase mb-4 block">
              The Gallery
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-fg-primary mb-6">
              Featured Exhibitions
            </h2>
            <p className="text-xl text-fg-secondary max-w-2xl mx-auto">
              Each article is a curated experience. Click to enter the world of a fellow vibe coder.
            </p>
          </motion.div>

          {/* Exhibition Grid - Asymmetric Layout */}
          <div className="relative">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((article, index) => (
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  className={`group relative ${index === 0 ? 'md:col-span-2 md:row-span-2' : ''}`}
                >
                  <Link href={`/article/${article.slug}`}>
                    <div
                      className="relative h-full min-h-[280px] rounded-2xl overflow-hidden border border-glass-border bg-glass-bg backdrop-blur-sm transition-all duration-500 hover:border-accent-primary/30"
                      style={{
                        minHeight: index === 0 ? '560px' : '280px',
                        boxShadow: index === 0 ? '0 0 30px rgba(139, 92, 246, 0.15)' : undefined,
                      }}
                    >
                      {/* Cover Image with Overlay */}
                      {article.cover_image ? (
                        <div className="absolute inset-0">
                          <img src={article.cover_image} alt={article.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                          <div className="absolute inset-0 bg-gradient-to-t from-bg-deep via-bg-deep/60 to-transparent" />
                        </div>
                      ) : (
                        <div
                          className="absolute inset-0"
                          style={{
                            background: article.projects?.color
                              ? `linear-gradient(135deg, ${article.projects.color}15, ${article.projects.color}05)`
                              : 'linear-gradient(135deg, rgba(139, 92, 246, 0.08), transparent)',
                          }}
                        />
                      )}

                      {/* Platform Badge */}
                      {article.vibe_platform && (
                        <div
                          className="absolute top-4 left-4 px-3 py-1.5 rounded-full text-xs font-mono font-medium backdrop-blur-md border border-white/10"
                          style={{
                            backgroundColor: `${platformColors[article.vibe_platform] || 'var(--accent-primary)'}20`,
                            color: platformColors[article.vibe_platform] || 'var(--accent-primary-light)',
                          }}
                        >
                          {article.vibe_platform}
                        </div>
                      )}

                      {/* Content Overlay */}
                      <div className="absolute bottom-0 left-0 right-0 p-6">
                        <h3 className="text-xl md:text-2xl font-display font-bold text-fg-primary mb-2 line-clamp-2 group-hover:text-accent-primary-light transition-colors">
                          {article.title}
                        </h3>
                        {article.excerpt && (
                          <p className="text-fg-secondary text-sm line-clamp-2 mb-4">
                            {article.excerpt}
                          </p>
                        )}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-accent-primary/20 flex items-center justify-center text-xs text-accent-primary-light font-medium">
                              {article.profiles?.display_name?.[0] || article.profiles?.username?.[0] || '?'}
                            </div>
                            <span className="text-sm text-fg-muted">
                              {article.profiles?.display_name || article.profiles?.username || 'Anonymous'}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 text-sm text-fg-muted">
                            {article.stars_count > 0 && (
                              <span className="flex items-center gap-1">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                                {article.stars_count}
                              </span>
                            )}
                            <span>{new Date(article.published_at).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>

                      {/* Hover Glow Effect */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                        <div className="absolute inset-0 bg-gradient-to-t from-accent-primary/10 to-transparent" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Code Art Showcase */}
      <section className="relative z-10 py-32">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-6xl mx-auto"
          >
            {/* Terminal-style Code Display */}
            <div className="relative rounded-3xl overflow-hidden border border-glass-border backdrop-blur-sm" style={{ background: 'rgba(30, 30, 46, 0.5)' }}>
              {/* Terminal Header */}
              <div className="flex items-center gap-2 px-4 py-3 bg-bg-elevated/50 border-b border-glass-border">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
                <span className="text-fg-muted text-sm font-mono ml-4">viblog-session.tsx</span>
              </div>

              {/* Code Content */}
              <div className="p-6 md:p-8 font-mono text-sm md:text-base leading-relaxed overflow-x-auto">
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.3 }}
                >
                  <span style={{ color: 'var(--code-keyword)' }}>import</span>
                  <span className="text-fg-primary"> {'{'} createArticle {'}'} </span>
                  <span style={{ color: 'var(--code-keyword)' }}>from</span>
                  <span style={{ color: 'var(--code-string)' }}> '@viblog/ai-native'</span>
                  <br /><br />
                  <span style={{ color: 'var(--code-keyword)' }}>const</span>
                  <span style={{ color: 'var(--code-variable)' }}> vibeSession </span>
                  <span style={{ color: 'var(--code-operator)' }}>=</span>
                  <span style={{ color: 'var(--code-keyword)' }}> await</span>
                  <span style={{ color: 'var(--code-function)' }}> createArticle</span>
                  <span className="text-fg-primary">{'({'}</span>
                  <br />
                  <span className="text-fg-primary">  title: </span>
                  <span style={{ color: 'var(--code-string)' }}>"Building the Future with AI"</span>
                  <span className="text-fg-primary">,</span>
                  <br />
                  <span className="text-fg-primary">  vibe: </span>
                  <span style={{ color: 'var(--code-string)' }}>"cursor"</span>
                  <span className="text-fg-primary">,</span>
                  <br />
                  <span className="text-fg-primary">  duration: </span>
                  <span style={{ color: 'var(--code-number)' }}>47</span>
                  <span className="text-fg-primary">,</span>
                  <span style={{ color: 'var(--code-comment)' }}> // minutes of pure flow</span>
                  <br />
                  <span className="text-fg-primary">  captures: [</span>
                  <span style={{ color: 'var(--code-string)' }}>'prompts'</span>
                  <span className="text-fg-primary">, </span>
                  <span style={{ color: 'var(--code-string)' }}>'decisions'</span>
                  <span className="text-fg-primary">, </span>
                  <span style={{ color: 'var(--code-string)' }}>'breakthroughs'</span>
                  <span className="text-fg-primary">],</span>
                  <br />
                  <span className="text-fg-primary">{'});'}</span>
                  <br /><br />
                  <span style={{ color: 'var(--code-comment)' }}>// Your journey, preserved forever</span>
                  <br />
                  <span style={{ color: 'var(--code-keyword)' }}>await</span>
                  <span style={{ color: 'var(--code-variable)' }}> vibeSession</span>
                  <span style={{ color: 'var(--code-operator)' }}>.</span>
                  <span style={{ color: 'var(--code-function)' }}>publish</span>
                  <span className="text-fg-primary">();</span>
                </motion.div>
              </div>

              {/* Glow effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-accent-primary/20 via-accent-secondary/10 to-accent-tertiary/20 blur-3xl opacity-30 -z-10" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-32">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative max-w-4xl mx-auto text-center"
          >
            {/* Background Glow */}
            <div className="absolute -inset-4 bg-gradient-to-r from-accent-primary/20 via-accent-secondary/20 to-accent-tertiary/20 blur-3xl opacity-50" />

            <div className="relative rounded-3xl border border-glass-border bg-glass-bg backdrop-blur-sm p-12 md:p-16">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-fg-primary mb-6">
                Ready to Write Your Story?
              </h2>
              <p className="text-xl text-fg-secondary max-w-2xl mx-auto mb-10">
                Join thousands of vibe coders already documenting their AI-powered journeys.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/register" className="px-8 py-4 bg-accent-primary text-white rounded-xl font-semibold text-lg transition-all duration-300" style={{ boxShadow: '0 0 30px rgba(139, 92, 246, 0.3)' }}>
                  Create Free Account
                </Link>
                <Link href="/login" className="px-8 py-4 border border-border-emphasis text-fg-primary rounded-xl font-semibold text-lg hover:bg-glass-bg-hover transition-all duration-300">
                  Sign In
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Scroll Progress Indicator */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-accent-primary origin-left z-50"
        style={{ scaleX: smoothProgress }}
      />
    </div>
  )
}