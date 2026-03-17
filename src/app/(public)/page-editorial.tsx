'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Clock, Star, Eye, ArrowRight } from 'lucide-react'
import type { PublicArticle } from '@/types/public'

// Mock articles for editorial
const mockArticles: PublicArticle[] = [
  { id: '1', title: 'Building a Real-Time AI Agent with Claude and WebSocket', slug: 'ai-agent', excerpt: 'A deep dive into creating responsive AI agents that feel truly conversational. This is the story of how I built a system that responds in milliseconds.', cover_image: null, vibe_platform: 'claude', vibe_duration_minutes: 47, vibe_model: 'claude-opus-4', stars_count: 234, views_count: 1520, published_at: new Date().toISOString(), profiles: { username: 'vibecoder', display_name: 'Vibe Coder', avatar_url: null }, projects: { id: '1', name: 'AI Agents', color: '#8b5cf6' } },
  { id: '2', title: 'Cursor + Figma: The Ultimate Design-to-Code Pipeline', slug: 'cursor-figma', excerpt: 'How I built a seamless workflow from design files to production code in record time.', cover_image: null, vibe_platform: 'cursor', vibe_duration_minutes: 32, vibe_model: 'claude-sonnet', stars_count: 189, views_count: 980, published_at: new Date(Date.now() - 86400000).toISOString(), profiles: { username: 'designer', display_name: 'Design Dev', avatar_url: null }, projects: { id: '2', name: 'DevTools', color: '#06b6d4' } },
  { id: '3', title: 'My Journey: From Zero to Shipping in 3 Hours', slug: 'zero-ship', excerpt: 'The power of vibe coding when you let AI handle the heavy lifting.', cover_image: null, vibe_platform: 'windsurf', vibe_duration_minutes: 180, vibe_model: 'gpt-4', stars_count: 456, views_count: 2340, published_at: new Date(Date.now() - 172800000).toISOString(), profiles: { username: 'shipfast', display_name: 'Ship Fast', avatar_url: null }, projects: { id: '3', name: 'Startups', color: '#f59e0b' } },
  { id: '4', title: 'Error Handling Patterns for AI-Generated Code', slug: 'errors', excerpt: 'Making your vibe-coded applications robust and production-ready.', cover_image: null, vibe_platform: 'copilot', vibe_duration_minutes: 25, vibe_model: 'gpt-4', stars_count: 98, views_count: 543, published_at: new Date(Date.now() - 259200000).toISOString(), profiles: { username: 'stability', display_name: 'Stable Code', avatar_url: null }, projects: { id: '4', name: 'Best Practices', color: '#10b981' } },
  { id: '5', title: 'The Art of Prompt Engineering for Developers', slug: 'prompts', excerpt: 'Advanced techniques to get the most out of your AI coding sessions.', cover_image: null, vibe_platform: 'claude', vibe_duration_minutes: 55, vibe_model: 'claude-opus-4', stars_count: 312, views_count: 1876, published_at: new Date(Date.now() - 345600000).toISOString(), profiles: { username: 'prompter', display_name: 'Prompt Master', avatar_url: null }, projects: { id: '5', name: 'AI Skills', color: '#f43f5e' } },
  { id: '6', title: 'Building Microservices with AI Assistance', slug: 'microservices', excerpt: 'Architecting scalable systems with vibe coding workflows.', cover_image: null, vibe_platform: 'cursor', vibe_duration_minutes: 89, vibe_model: 'claude-sonnet', stars_count: 167, views_count: 923, published_at: new Date(Date.now() - 432000000).toISOString(), profiles: { username: 'architect', display_name: 'System Architect', avatar_url: null }, projects: { id: '6', name: 'Architecture', color: '#8b5cf6' } },
]

// Featured article hero
function EditorialHero({ article }: { article: PublicArticle }) {
  return (
    <section className="relative min-h-[80vh] flex items-end">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <div
          className="w-full h-full"
          style={{
            background: article.projects?.color
              ? `linear-gradient(135deg, ${article.projects.color}40, ${article.projects.color}20, transparent)`
              : 'linear-gradient(135deg, rgba(139, 92, 246, 0.2), transparent)',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-bg-deep via-bg-deep/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-bg-deep/80 via-bg-deep/40 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-4xl mx-auto px-6 pb-16 pt-32">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-6"
        >
          {/* Tags */}
          <div className="flex flex-wrap items-center gap-3">
            {article.vibe_platform && (
              <span className="px-3 py-1 text-sm tracking-wide uppercase border border-accent-primary/30 text-accent-primary-light rounded-full">
                {article.vibe_platform}
              </span>
            )}
            {article.vibe_duration_minutes && (
              <div className="flex items-center gap-1.5 text-fg-secondary text-sm">
                <Clock className="h-4 w-4" />
                <span>{article.vibe_duration_minutes} min read</span>
              </div>
            )}
          </div>

          {/* Title - Serif Typography */}
          <Link href={`/article/${article.slug}`}>
            <h1
              className="text-5xl md:text-6xl lg:text-7xl font-normal leading-[1.1] tracking-tight text-fg-primary hover:text-accent-primary-light transition-colors duration-300"
              style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
            >
              {article.title}
            </h1>
          </Link>

          {/* Excerpt */}
          {article.excerpt && (
            <p
              className="text-xl md:text-2xl text-fg-secondary leading-relaxed max-w-2xl"
              style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
            >
              {article.excerpt}
            </p>
          )}

          {/* Author & Stats */}
          <div className="flex flex-wrap items-center justify-between gap-6 pt-4 border-t border-border-subtle">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-accent-primary/20 flex items-center justify-center text-lg text-accent-primary-light font-medium">
                {article.profiles?.display_name?.[0] || article.profiles?.username?.[0] || '?'}
              </div>
              <div>
                <p className="font-medium text-fg-primary">
                  {article.profiles?.display_name || article.profiles?.username || 'Anonymous'}
                </p>
                <p className="text-sm text-fg-muted">
                  {new Date(article.published_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-6 text-fg-muted">
              <div className="flex items-center gap-1.5">
                <Star className="h-5 w-5 text-accent-tertiary" />
                <span className="text-fg-secondary">{article.stars_count}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Eye className="h-5 w-5" />
                <span className="text-fg-secondary">{article.views_count}</span>
              </div>
              <Link
                href={`/article/${article.slug}`}
                className="flex items-center gap-2 px-4 py-2 border border-accent-primary/30 text-accent-primary-light rounded-lg hover:bg-accent-primary/10 transition-colors"
              >
                Read Article
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

// Pull quote component
function PullQuote({ quote, author }: { quote: string; author?: string }) {
  return (
    <motion.blockquote
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="relative py-12 px-8 md:px-16 my-12 text-center"
    >
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-px bg-gradient-to-r from-transparent via-accent-primary/30 to-transparent" />
      <p
        className="text-2xl md:text-3xl lg:text-4xl text-fg-primary leading-relaxed italic max-w-4xl mx-auto"
        style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
      >
        &ldquo;{quote}&rdquo;
      </p>
      {author && (
        <cite className="mt-6 text-lg text-fg-secondary not-italic block">
          {author}
        </cite>
      )}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-px bg-gradient-to-r from-transparent via-accent-primary/30 to-transparent" />
    </motion.blockquote>
  )
}

// Article card
function ArticleCard({ article, index }: { article: PublicArticle; index: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08 }}
      className="group"
    >
      <Link href={`/article/${article.slug}`} className="block">
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden rounded-lg mb-4" style={{ background: `${article.projects?.color || '#8b5cf6'}15` }}>
          {article.vibe_platform && (
            <div className="absolute top-3 left-3 px-2 py-1 text-xs bg-bg-deep/70 backdrop-blur-sm rounded">
              {article.vibe_platform}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="space-y-2">
          <h3
            className="text-xl leading-snug text-fg-primary group-hover:text-accent-primary-light transition-colors line-clamp-2"
            style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
          >
            {article.title}
          </h3>
          {article.excerpt && (
            <p className="text-sm text-fg-secondary line-clamp-2 leading-relaxed">
              {article.excerpt}
            </p>
          )}
          <div className="flex items-center gap-3 pt-2">
            <span className="text-sm text-fg-secondary flex-1 truncate">
              {article.profiles?.display_name || article.profiles?.username}
            </span>
            <div className="flex items-center gap-2 text-xs text-fg-muted">
              <span className="flex items-center gap-0.5">
                <Star className="h-3 w-3" />
                {article.stars_count}
              </span>
              <span className="flex items-center gap-0.5">
                <Eye className="h-3 w-3" />
                {article.views_count}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.article>
  )
}

export default function EditorialHomepage() {
  const featuredArticle = mockArticles[0]
  const trendingArticles = mockArticles.slice(1, 5)
  const recentArticles = mockArticles.slice(5)

  return (
    <div className="min-h-screen bg-bg-deep">
      {/* Hero */}
      {featuredArticle && <EditorialHero article={featuredArticle} />}

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-16">
        {/* Pull Quote */}
        <PullQuote
          quote="Vibe coding is not just about writing code faster; it's about capturing the authentic journey of building with AI."
          author="The Viblog Team"
        />

        {/* Section Header */}
        <div className="mb-12 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-px bg-gradient-to-r from-transparent via-accent-primary to-transparent" />
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-semibold tracking-tight text-fg-primary mb-3">
            Trending Stories
          </h2>
          <p
            className="text-lg text-fg-secondary max-w-2xl mx-auto leading-relaxed"
            style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
          >
            The most engaging vibe coding journeys this week
          </p>
        </div>

        {/* Trending Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {trendingArticles.map((article, index) => (
            <ArticleCard key={article.id} article={article} index={index} />
          ))}
        </div>

        {/* Another Quote */}
        <PullQuote
          quote="Every line of code tells a story. We're here to help you share yours."
          author="Viblog Manifesto"
        />

        {/* Recent Section */}
        <div className="mb-12 text-center">
          <h2 className="font-display text-3xl md:text-4xl font-semibold tracking-tight text-fg-primary mb-3">
            Recent Publications
          </h2>
          <p className="text-lg text-fg-secondary">
            Fresh stories from the vibe coding community
          </p>
        </div>

        {/* Recent Grid */}
        {recentArticles.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentArticles.map((article, index) => (
              <ArticleCard key={article.id} article={article} index={index} />
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="mt-24 text-center">
          <div className="relative rounded-3xl border border-glass-border bg-glass-bg backdrop-blur-sm p-12 max-w-3xl mx-auto">
            <h2
              className="text-3xl md:text-4xl font-display font-bold text-fg-primary mb-4"
              style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
            >
              Stay in the Loop
            </h2>
            <p className="text-lg text-fg-secondary max-w-md mx-auto mb-8">
              Get the latest vibe coding stories delivered to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 px-4 py-3 bg-bg-elevated border border-border-subtle rounded-lg text-fg-primary placeholder:text-fg-muted focus:outline-none focus:border-accent-primary/50 transition-colors"
              />
              <button className="px-6 py-3 bg-accent-primary text-white font-semibold rounded-lg hover:bg-accent-primary-dark transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border-subtle mt-24">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="font-display text-2xl font-bold text-fg-primary">Viblog</div>
            <p className="text-sm text-fg-muted">
              {new Date().getFullYear()} Viblog. Crafted with passion for vibe coders everywhere.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}