'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface CodeBlockProps {
  code: string
  language?: string
  filename?: string
  showLineNumbers?: boolean
}

// Language display names and icons
const languageConfig: Record<string, { name: string; icon: string }> = {
  typescript: { name: 'TypeScript', icon: 'TS' },
  javascript: { name: 'JavaScript', icon: 'JS' },
  tsx: { name: 'TSX', icon: 'TSX' },
  jsx: { name: 'JSX', icon: 'JSX' },
  python: { name: 'Python', icon: 'PY' },
  rust: { name: 'Rust', icon: 'RS' },
  go: { name: 'Go', icon: 'GO' },
  css: { name: 'CSS', icon: 'CSS' },
  html: { name: 'HTML', icon: 'HTML' },
  json: { name: 'JSON', icon: '{ }' },
  bash: { name: 'Bash', icon: '$' },
  shell: { name: 'Shell', icon: '$' },
  sql: { name: 'SQL', icon: 'SQL' },
  markdown: { name: 'Markdown', icon: 'MD' },
  yaml: { name: 'YAML', icon: 'YML' },
  default: { name: 'Code', icon: '< >' },
}

/**
 * CodeBlock Component
 *
 * Soul Purpose: Code is the hero of Vibe Coder stories. It deserves respect.
 *
 * Features:
 * - Language badge with icon
 * - Copy button with feedback
 * - Line numbers for longer blocks
 * - Filename header when available
 * - Dark theme syntax highlighting (via CSS)
 *
 * Reference: Phase 3 Article Detail Polish
 * User Story: US-200 (Smart Markdown Formatting)
 */
export function CodeBlock({
  code,
  language = 'typescript',
  filename,
  showLineNumbers = true,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false)
  const lines = code.split('\n')
  const shouldShowLineNumbers = showLineNumbers && lines.length > 3

  const config = languageConfig[language.toLowerCase()] || languageConfig.default

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy code:', err)
    }
  }, [code])

  return (
    <div className="code-block my-6 overflow-hidden rounded-xl border border-white/[0.15] bg-bg-deep">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-white/[0.1] bg-glass-surface px-4 py-2">
        <div className="flex items-center gap-3">
          {/* Language Badge */}
          <span className="flex items-center gap-1.5 rounded-md bg-accent-primary/20 px-2 py-0.5 text-xs font-medium text-accent-primary">
            <span className="font-mono font-bold">{config.icon}</span>
            <span className="uppercase tracking-wide">{config.name}</span>
          </span>

          {/* Filename */}
          {filename && (
            <span className="text-sm text-fg-muted">{filename}</span>
          )}
        </div>

        {/* Copy Button */}
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium text-fg-muted transition-colors hover:bg-white/10 hover:text-fg-default"
          aria-label={copied ? 'Copied!' : 'Copy code'}
        >
          <AnimatePresence mode="wait">
            {copied ? (
              <motion.span
                key="copied"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex items-center gap-1 text-green-400"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Copied!
              </motion.span>
            ) : (
              <motion.span
                key="copy"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex items-center gap-1"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Copy
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </header>

      {/* Code Content */}
      <div className="relative overflow-x-auto">
        <pre className="p-4 text-sm leading-relaxed">
          <code className={`language-${language}`}>
            {shouldShowLineNumbers ? (
              <table className="w-full border-collapse">
                <tbody>
                  {lines.map((line, index) => (
                    <tr key={index} className="hover:bg-white/5">
                      <td className="select-none pr-4 text-right text-fg-muted/50">
                        {index + 1}
                      </td>
                      <td className="whitespace-pre font-mono text-fg-default">
                        {line || ' '}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <span className="whitespace-pre font-mono text-fg-default">
                {code}
              </span>
            )}
          </code>
        </pre>
      </div>
    </div>
  )
}

export default CodeBlock