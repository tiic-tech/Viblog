'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Highlighter, MessageSquare, Share2, X } from 'lucide-react'
import { useTextSelection, type TextSelection } from '@/hooks/use-text-selection'

/**
 * Annotation action types
 */
export type AnnotationAction = 'highlight' | 'comment' | 'share'

/**
 * Props for the AnnotationTooltip component
 */
interface AnnotationTooltipProps {
  onHighlight?: (selection: TextSelection) => void
  onComment?: (selection: TextSelection) => void
  onShare?: (selection: TextSelection) => void
  onAction?: (action: AnnotationAction, selection: TextSelection) => void
  containerRef?: React.RefObject<HTMLElement | null>
  enabled?: boolean
}

/**
 * Tooltip action button
 */
interface ActionButton {
  action: AnnotationAction
  label: string
  icon: React.ReactNode
  colorClass: string
}

const actionButtons: ActionButton[] = [
  {
    action: 'highlight',
    label: 'Highlight',
    icon: <Highlighter className="h-4 w-4" />,
    colorClass: 'text-accent-primary hover:bg-accent-primary/15',
  },
  {
    action: 'comment',
    label: 'Comment',
    icon: <MessageSquare className="h-4 w-4" />,
    colorClass: 'text-accent-secondary hover:bg-accent-secondary/15',
  },
  {
    action: 'share',
    label: 'Share',
    icon: <Share2 className="h-4 w-4" />,
    colorClass: 'text-accent-tertiary hover:bg-accent-tertiary/15',
  },
]

/**
 * Annotation Tooltip Component
 *
 * A floating tooltip that appears when the user selects text within
 * article content. Provides quick actions for highlighting, commenting,
 * and sharing the selected text.
 *
 * Features:
 * - Positioned near the selection
 * - Animated entrance/exit
 * - Keyboard accessible
 * - Respects selection boundaries
 */
export default function AnnotationTooltip({
  onHighlight,
  onComment,
  onShare,
  onAction,
  containerRef,
  enabled = true,
}: AnnotationTooltipProps) {
  const { selection, isSelecting, clearSelection } = useTextSelection(containerRef, {
    minLength: 3,
    debounceMs: 150,
    enabled,
  })

  const tooltipRef = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState({ top: 0, left: 0 })
  const [placement, setPlacement] = useState<'top' | 'bottom'>('top')

  // Calculate tooltip position based on selection rect
  useEffect(() => {
    if (!selection) return

    const rect = selection.rect
    const tooltipHeight = 48 // Approximate tooltip height
    const tooltipWidth = 200 // Approximate tooltip width
    const padding = 12 // Padding from selection

    // Calculate horizontal center
    let left = rect.left + rect.width / 2 - tooltipWidth / 2

    // Keep within viewport horizontally
    if (left < 16) left = 16
    if (left + tooltipWidth > window.innerWidth - 16) {
      left = window.innerWidth - tooltipWidth - 16
    }

    // Determine vertical placement
    const spaceAbove = rect.top
    const spaceBelow = window.innerHeight - rect.bottom

    let top: number
    if (spaceAbove >= tooltipHeight + padding) {
      // Place above
      top = rect.top - tooltipHeight - padding
      setPlacement('top')
    } else if (spaceBelow >= tooltipHeight + padding) {
      // Place below
      top = rect.bottom + padding
      setPlacement('bottom')
    } else {
      // Default to above with scroll adjustment
      top = Math.max(16, rect.top - tooltipHeight - padding)
      setPlacement('top')
    }

    setPosition({ top, left })
  }, [selection])

  // Handle mouse down on tooltip - prevent browser from clearing selection
  const handleTooltipMouseDown = (e: React.MouseEvent) => {
    // Prevent the browser's default behavior of clearing selection on click
    e.preventDefault()
  }

  // Handle action click
  const handleAction = (action: AnnotationAction) => {
    if (!selection) return

    // Call specific handler
    switch (action) {
      case 'highlight':
        onHighlight?.(selection)
        break
      case 'comment':
        onComment?.(selection)
        break
      case 'share':
        onShare?.(selection)
        break
    }

    // Call general action handler
    onAction?.(action, selection)

    // Clear selection after action
    clearSelection()
  }

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      clearSelection()
      return
    }

    // Focus trap and action shortcuts
    if (e.key === 'h') {
      handleAction('highlight')
    } else if (e.key === 'c') {
      handleAction('comment')
    } else if (e.key === 's') {
      handleAction('share')
    }
  }

  // Don't render while selecting or no selection
  if (isSelecting || !selection) return null

  return (
    <AnimatePresence>
      {selection && (
        <motion.div
          ref={tooltipRef}
          data-annotation-tooltip="true"
          onMouseDown={handleTooltipMouseDown}
          initial={{ opacity: 0, y: placement === 'top' ? 8 : -8, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: placement === 'top' ? 4 : -4, scale: 0.95 }}
          transition={{
            duration: 0.15,
            ease: [0.16, 1, 0.3, 1],
          }}
          onKeyDown={handleKeyDown}
          className="fixed z-50"
          style={{
            top: position.top,
            left: position.left,
          }}
        >
          <div
            className={`
              bg-bg-elevated/95 flex items-center gap-1 rounded-xl border
              border-border-subtle px-2 py-1.5 shadow-lg
              shadow-black/5 backdrop-blur-lg
            `}
            role="toolbar"
            aria-label="Text annotation tools"
          >
            {actionButtons.map((btn) => (
              <button
                key={btn.action}
                onClick={() => handleAction(btn.action)}
                className={`
                  focus:ring-accent-primary/30 flex items-center gap-1.5 rounded-lg px-2.5
                  py-1.5 text-sm font-medium transition-all
                  duration-150 focus:outline-none focus:ring-2
                  ${btn.colorClass}
                `}
                title={`${btn.label} (${btn.action[0].toUpperCase()})`}
                aria-label={btn.label}
              >
                {btn.icon}
                <span className="hidden sm:inline">{btn.label}</span>
              </button>
            ))}

            <div className="mx-1 h-4 w-px bg-border-subtle" />

            <button
              onClick={clearSelection}
              className="rounded-lg p-1.5 text-fg-muted transition-colors hover:bg-bg-surface hover:text-fg-secondary"
              title="Close (Esc)"
              aria-label="Close"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Arrow indicator */}
          <div
            className={`
              absolute left-1/2 h-2 w-4 -translate-x-1/2
              ${placement === 'top' ? '-bottom-1' : '-top-1 rotate-180'}
            `}
          >
            <div
              className={`
                bg-bg-elevated/95 h-full w-full border-b border-l border-r
                border-border-subtle
              `}
              style={{
                clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
              }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
