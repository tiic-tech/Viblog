'use client'

import { memo, useRef, useCallback, useEffect } from 'react'
import CodeBlock from '@/components/ui/code-block'
import AnnotationTooltip from '@/components/ui/annotation-tooltip'
import type { TextSelection } from '@/hooks/use-text-selection'
import { useHighlights, applyHighlightsToDOM } from '@/hooks/use-highlights'
import { toast } from '@/hooks/use-toast'

// Import immersive prose styles for Phase 3 Article Detail Polish
import '@/styles/prose-immersive.css'

interface ArticleContentProps {
  content: string | null
  articleId?: string
}

// Parse and render Tiptap JSON content
function ArticleContent({ content, articleId = 'default' }: ArticleContentProps) {
  const contentRef = useRef<HTMLDivElement>(null)

  // Initialize highlights persistence
  const { highlights, addHighlight, removeHighlight, isHighlighted } = useHighlights({
    articleId,
    maxHighlights: 50,
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

  // Handle comment action
  const handleComment = useCallback((selection: TextSelection) => {
    // For now, show a toast - future implementation will open comment modal
    toast({
      title: 'Add Comment',
      description: `Comment on: "${selection.text.slice(0, 30)}${selection.text.length > 30 ? '...' : ''}"`,
    })
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
      <>
        <div
          ref={contentRef}
          className="prose-immersive"
          dangerouslySetInnerHTML={{ __html: content }}
        />
        <AnnotationTooltip
          containerRef={contentRef}
          onHighlight={handleHighlight}
          onComment={handleComment}
          onShare={handleShare}
        />
      </>
    )
  }

  // Render JSON content recursively
  return (
    <>
      <div ref={contentRef} className="prose-immersive">
        {renderNode(parsedContent)}
      </div>
      <AnnotationTooltip
        containerRef={contentRef}
        onHighlight={handleHighlight}
        onComment={handleComment}
        onShare={handleShare}
      />
    </>
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
