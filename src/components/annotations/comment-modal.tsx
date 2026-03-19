'use client'

import { useEffect, useRef, useState } from 'react'

import type { AnnotationColor, AnnotationVisibility } from '@/types/annotation'

interface CommentModalProps {
  isOpen: boolean
  onClose: () => void
  selectedText: string
  onSave: (data: {
    content: string
    color: AnnotationColor
    visibility: AnnotationVisibility
  }) => void
}

const COLOR_OPTIONS: AnnotationColor[] = ['default', 'yellow', 'green', 'blue', 'pink']

const VISIBILITY_OPTIONS: AnnotationVisibility[] = ['public', 'private', 'followers']

const COLOR_STYLES: Record<AnnotationColor, string> = {
  default: 'bg-muted',
  yellow: 'bg-yellow-200 dark:bg-yellow-800',
  green: 'bg-green-200 dark:bg-green-800',
  blue: 'bg-blue-200 dark:bg-blue-800',
  pink: 'bg-pink-200 dark:bg-pink-800',
}

/**
 * Comment Modal - The Gateway to Intellectual Presence
 *
 * When a reader selects text and wants to add their thoughts,
 * this modal becomes their writing desk. Every comment is a mark
 * of engagement, transforming passive reading into active dialogue.
 *
 * Soul Mission: "I've been here. This is my thought. This matters."
 */
export function CommentModal({
  isOpen,
  onClose,
  selectedText,
  onSave,
}: CommentModalProps) {
  const [content, setContent] = useState('')
  const [color, setColor] = useState<AnnotationColor>('default')
  const [visibility, setVisibility] = useState<AnnotationVisibility>('public')

  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Focus textarea when modal opens
  useEffect(() => {
    if (isOpen && textareaRef.current) {
      textareaRef.current.focus()
    }
  }, [isOpen])

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setContent('')
      setColor('default')
      setVisibility('public')
    }
  }, [isOpen])

  // Handle Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  const handleSave = () => {
    if (!content.trim()) return

    onSave({ content: content.trim(), color, visibility })
    onClose()
  }

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={handleOverlayClick}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="comment-modal-title"
        className="w-full max-w-lg rounded-lg bg-surface p-6 shadow-xl"
      >
        {/* Header */}
        <h2 id="comment-modal-title" className="text-lg font-semibold text-foreground">
          Add Annotation
        </h2>

        {/* Selected Text Preview */}
        <div className="mt-4 rounded-md bg-muted/50 p-3">
          <p className="italic text-muted-foreground line-clamp-3">
            &ldquo;{selectedText}&rdquo;
          </p>
        </div>

        {/* Comment Textarea */}
        <div className="mt-4">
          <label htmlFor="comment-textarea" className="sr-only">
            Your comment
          </label>
          <textarea
            ref={textareaRef}
            id="comment-textarea"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your comment..."
            className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>

        {/* Color Picker */}
        <div className="mt-4">
          <span className="text-sm font-medium text-foreground">Highlight Color</span>
          <div className="mt-2 flex gap-2">
            {COLOR_OPTIONS.map((colorOption) => (
              <button
                key={colorOption}
                type="button"
                aria-label={`${colorOption} color`}
                aria-pressed={color === colorOption}
                onClick={() => setColor(colorOption)}
                className={`h-8 w-8 rounded-full ${COLOR_STYLES[colorOption]} ${
                  color === colorOption
                    ? 'ring-2 ring-accent ring-offset-2'
                    : 'hover:ring-1 hover:ring-muted-foreground'
                } transition-all`}
              />
            ))}
          </div>
        </div>

        {/* Visibility Selector */}
        <div className="mt-4">
          <span className="text-sm font-medium text-foreground">Visibility</span>
          <div className="mt-2 flex gap-4">
            {VISIBILITY_OPTIONS.map((visibilityOption) => (
              <label
                key={visibilityOption}
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  type="radio"
                  name="visibility"
                  value={visibilityOption}
                  checked={visibility === visibilityOption}
                  onChange={() => setVisibility(visibilityOption)}
                  className="h-4 w-4 accent-accent"
                />
                <span className="text-sm capitalize text-foreground">
                  {visibilityOption}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={!content.trim()}
            className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  )
}