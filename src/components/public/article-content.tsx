'use client'

import { memo, useRef, useCallback, useEffect, useState } from 'react'
import CodeBlock from '@/components/ui/code-block'
import AnnotationTooltip from '@/components/ui/annotation-tooltip'
import { AnnotationSidebar } from '@/components/annotations/annotation-sidebar'
import { CommentModal } from '@/components/annotations/comment-modal'
import type { TextSelection } from '@/hooks/use-text-selection'
import { useHighlights, applyHighlightsToDOM } from '@/hooks/use-highlights'
import { useAnnotations } from '@/hooks/use-annotations'
import { toast } from '@/hooks/use-toast'
import type { AnnotationColor, AnnotationVisibility } from '@/types/annotation'

// Import immersive prose styles for Phase 3 Article Detail Polish
import '@/styles/prose-immersive.css'

interface ArticleContentProps {
  content: string | null
  articleId?: string
  currentUserId?: string
}

/**
 * Article Content - The Intellectual Gallery
 *
 * This component renders article content with annotation support.
 * Every annotation is a mark of intellectual presence - transforming
 * passive reading into active dialogue.
 *
 * Soul Mission: "I've been here. I've grown here. This is my intellectual home."
 */
function ArticleContent({ content, articleId = 'default', currentUserId = 'anonymous' }: ArticleContentProps) {
  const contentRef = useRef<HTMLDivElement>(null)
  const [isSidebarVisible, setIsSidebarVisible] = useState(false)
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false)
  const [pendingSelection, setPendingSelection] = useState<TextSelection | null>(null)

  // Initialize highlights persistence
  const { highlights, addHighlight, removeHighlight, isHighlighted } = useHighlights({
    articleId,
    maxHighlights: 50,
  })

  // Initialize annotations
  const {
    annotations,
    addAnnotation,
    updateAnnotation,
    deleteAnnotation,
    addReply,
    getAnnotationByText,
  } = useAnnotations({
    articleId,
    userId: currentUserId,
  })

  // Apply persisted highlights to DOM after content renders
  useEffect(() => {
    if (!contentRef.current || highlights.length === 0) return

    // Small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      if (contentRef.current) {
        applyHighlightsToDOM(contentRef.current, highlights)
      }
    }, 100)

    return () => clearTimeout(timer)
  }, [highlights])

  // Sync annotations with highlights
  useEffect(() => {
    if (!contentRef.current || annotations.length === 0) return

    // Small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      if (contentRef.current) {
        // Create highlight data from annotations
        const annotationHighlights = annotations.map((ann) => ({
          id: ann.id,
          text: ann.text,
          containerXPath: ann.containerXPath,
          startOffset: ann.startOffset,
          endOffset: ann.endOffset,
          color: ann.color,
        }))
        applyHighlightsToDOM(contentRef.current, annotationHighlights)
      }
    }, 100)

    return () => clearTimeout(timer)
  }, [annotations])

  // Handle highlight action - persist the highlight
  const handleHighlight = useCallback(
    (selection: TextSelection) => {
      // Check if already highlighted
      if (isHighlighted(selection.text)) {
        toast({
          title: 'Already Highlighted',
          description: 'This text is already highlighted',
        })
        return
      }

      // Create the highlight
      const newHighlight = addHighlight({
        text: selection.text,
        containerXPath: selection.containerXPath,
        startOffset: selection.startOffset,
        endOffset: selection.endOffset,
        color: 'default',
      })

      if (newHighlight) {
        // Apply to DOM immediately
        if (contentRef.current) {
          applyHighlightsToDOM(contentRef.current, [...highlights, newHighlight])
        }

        toast({
          title: 'Text Highlighted',
          description: `"${selection.text.slice(0, 50)}${selection.text.length > 50 ? '...' : ''}"`,
        })
      }
    },
    [addHighlight, isHighlighted, highlights]
  )

  // Handle comment action - open modal instead of toast
  const handleComment = useCallback((selection: TextSelection) => {
    setPendingSelection(selection)
    setIsCommentModalOpen(true)
  }, [])

  // Handle share action
  const handleShare = useCallback((selection: TextSelection) => {
    // Copy selection to clipboard with article context
    const shareText = `"${selection.text}" - from article`

    navigator.clipboard.writeText(shareText).then(
      () => {
        toast({
          title: 'Copied to Clipboard',
          description: 'Text selection ready to share',
        })
      },
      () => {
        toast({
          title: 'Copy Failed',
          description: 'Could not copy text to clipboard',
          variant: 'destructive',
        })
      }
    )
  }, [])

  // Handle saving annotation from modal
  const handleSaveAnnotation = useCallback(
    (data: { content: string; color: AnnotationColor; visibility: AnnotationVisibility }) => {
      if (!pendingSelection) return

      addAnnotation({
        text: pendingSelection.text,
        containerXPath: pendingSelection.containerXPath,
        startOffset: pendingSelection.startOffset,
        endOffset: pendingSelection.endOffset,
        content: data.content,
        color: data.color,
        visibility: data.visibility,
      })

      toast({
        title: 'Annotation Added',
        description: 'Your thought has been saved',
      })

      setPendingSelection(null)
    },
    [addAnnotation, pendingSelection]
  )

  // Handle clicking annotation in sidebar
  const handleAnnotationClick = useCallback((annotation: typeof annotations[0]) => {
    // Find the text in the content and scroll to it
    if (!contentRef.current) return

    const textNodes: Text[] = []
    const walker = document.createTreeWalker(contentRef.current, NodeFilter.SHOW_TEXT, null)

    let node: Text | null
    while ((node = walker.nextNode() as Text | null)) {
      textNodes.push(node)
    }

    for (const textNode of textNodes) {
      if (textNode.textContent?.includes(annotation.text)) {
        const parentElement = textNode.parentElement
        if (parentElement) {
          parentElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
          // Brief highlight effect
          parentElement.style.transition = 'background-color 0.3s'
          const originalBg = parentElement.style.backgroundColor
          parentElement.style.backgroundColor = 'rgba(59, 130, 246, 0.3)'
          setTimeout(() => {
            parentElement.style.backgroundColor = originalBg
          }, 1500)
        }
        break
      }
    }
  }, [])

  // Toggle sidebar visibility
  const toggleSidebar = useCallback(() => {
    setIsSidebarVisible((prev) => !prev)
  }, [])

  if (!content) {
    return <div className="py-8 text-center text-muted-foreground">No content available.</div>
  }

  // Try to parse as JSON (Tiptap format)
  let parsedContent
  try {
    parsedContent = JSON.parse(content)
  } catch {
    // If not JSON, treat as HTML
    return (
      <div data-testid="article-content-container" className="relative">
        <button
          type="button"
          onClick={toggleSidebar}
          aria-label="Toggle annotations"
          className="fixed right-4 top-1/2 -translate-y-1/2 z-10 rounded-full bg-background border border-border p-2 shadow-md hover:bg-muted transition-colors"
        >
          <svg
            className={`w-5 h-5 transition-transform ${isSidebarVisible ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <title>Toggle annotations sidebar</title>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={isSidebarVisible ? 'M9 5l7 7-7 7' : 'M15 19l-7-7 7-7'}
            />
          </svg>
        </button>

        <div className={isSidebarVisible ? 'flex' : ''}>
          <div
            ref={contentRef}
            className="prose-immersive flex-1"
            dangerouslySetInnerHTML={{ __html: content }}
          />
          {isSidebarVisible && (
            <AnnotationSidebar
              annotations={annotations}
              currentUserId={currentUserId}
              onAnnotationClick={handleAnnotationClick}
            />
          )}
        </div>

        <AnnotationTooltip
          containerRef={contentRef}
          onHighlight={handleHighlight}
          onComment={handleComment}
          onShare={handleShare}
        />

        <CommentModal
          isOpen={isCommentModalOpen}
          onClose={() => setIsCommentModalOpen(false)}
          selectedText={pendingSelection?.text || ''}
          onSave={handleSaveAnnotation}
        />
      </div>
    )
  }

  // Render JSON content recursively
  return (
    <div data-testid="article-content-container" className="relative">
      <button
        type="button"
        onClick={toggleSidebar}
        aria-label="Toggle annotations"
        className="fixed right-4 top-1/2 -translate-y-1/2 z-10 rounded-full bg-background border border-border p-2 shadow-md hover:bg-muted transition-colors"
      >
        <svg
          className={`w-5 h-5 transition-transform ${isSidebarVisible ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <title>Toggle annotations sidebar</title>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d={isSidebarVisible ? 'M9 5l7 7-7 7' : 'M15 19l-7-7 7-7'}
          />
        </svg>
      </button>

      <div className={isSidebarVisible ? 'flex' : ''}>
        <div ref={contentRef} className="prose-immersive flex-1">
          {renderNode(parsedContent)}
        </div>
        {isSidebarVisible && (
          <AnnotationSidebar
            annotations={annotations}
            currentUserId={currentUserId}
            onAnnotationClick={handleAnnotationClick}
          />
        )}
      </div>

      <AnnotationTooltip
        containerRef={contentRef}
        onHighlight={handleHighlight}
        onComment={handleComment}
        onShare={handleShare}
      />

      <CommentModal
        isOpen={isCommentModalOpen}
        onClose={() => setIsCommentModalOpen(false)}
        selectedText={pendingSelection?.text || ''}
        onSave={handleSaveAnnotation}
      />
    </div>
  )
}

function renderNode(node: any): React.ReactNode {
  if (!node) return null

  // Handle text nodes
  if (node.type === 'text') {
    let text = node.text || ''

    // Apply marks (bold, italic, etc.)
    if (node.marks) {
      node.marks.forEach((mark: any) => {
        switch (mark.type) {
          case 'bold':
            text = `<strong>${text}</strong>`
            break
          case 'italic':
            text = `<em>${text}</em>`
            break
          case 'code':
            text = `<code>${text}</code>`
            break
          case 'strike':
            text = `<s>${text}</s>`
            break
          case 'link':
            text = `<a href="${mark.attrs?.href || '#'}" target="_blank" rel="noopener noreferrer">${text}</a>`
            break
        }
      })
    }

    return <span dangerouslySetInnerHTML={{ __html: text }} />
  }

  // Handle block nodes
  const children = node.content
    ? node.content.map((child: any, i: number) => <span key={i}>{renderNode(child)}</span>)
    : null

  switch (node.type) {
    case 'doc':
    case 'paragraph':
      return <p>{children}</p>
    case 'heading':
      const HeadingTag = `h${node.attrs?.level || 1}` as keyof JSX.IntrinsicElements
      return <HeadingTag>{children}</HeadingTag>
    case 'bulletList':
      return <ul>{children}</ul>
    case 'orderedList':
      return <ol>{children}</ol>
    case 'listItem':
      return <li>{children}</li>
    case 'blockquote':
      return <blockquote>{children}</blockquote>
    case 'codeBlock': {
      // Extract text content from Tiptap codeBlock nodes
      const codeText = node.content
        ? node.content.map((child: any) => child.text || '').join('')
        : ''
      const language = node.attrs?.language || 'typescript'
      const filename = node.attrs?.filename
      return <CodeBlock code={codeText} language={language} filename={filename} />
    }
    case 'hardBreak':
      return <br />
    case 'horizontalRule':
      return <hr />
    case 'image':
      return <img src={node.attrs?.src} alt={node.attrs?.alt || ''} title={node.attrs?.title} />
    default:
      return children
  }
}

export default memo(ArticleContent)