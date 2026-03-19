'use client'

import { useRef, useCallback, useEffect } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import { Button } from '@/components/ui/button'
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Code,
  Heading1,
  Heading2,
  Undo,
  Redo,
  Eye,
  EyeOff,
} from 'lucide-react'
import { useEditorState } from '@/hooks/use-editor-state'
import { useSplitPane } from '@/hooks/use-split-pane'

interface SplitPaneEditorProps {
  content: string
  onChange: (content: string) => void
  minPaneWidth?: number
  defaultSplit?: number // percentage, e.g., 50 means 50/50 split
}

/**
 * SplitPaneEditor - A Dual-Pane Writing Experience
 *
 * This component provides a split-view editor with live preview,
 * allowing writers to see their content rendered in real-time.
 *
 * Soul Mission: Make writing feel like thinking out loud - where
 * every keystroke becomes visible art, and the gap between thought
 * and expression disappears.
 */
export function SplitPaneEditor({
  content,
  onChange,
  minPaneWidth = 200,
  defaultSplit = 50,
}: SplitPaneEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const editorPaneRef = useRef<HTMLDivElement>(null)
  const previewPaneRef = useRef<HTMLDivElement>(null)

  // Initialize Tiptap editor
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Write your article content here...',
      }),
    ],
    content: content,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class:
          'prose prose-sm dark:prose-invert max-w-none focus:outline-none min-h-[400px] px-4 py-3',
      },
    },
  })

  // Use the editor state hook
  const { isPreviewVisible, togglePreview } = useEditorState({
    editor,
    initialPreviewVisible: true,
  })

  // Use the split pane hook for resizable divider
  const { leftWidth, rightWidth, dividerProps } = useSplitPane({
    defaultSplit,
    minPaneWidth,
    containerRef,
  })

  // Scroll synchronization
  const handleEditorScroll = useCallback(() => {
    if (!editorPaneRef.current || !previewPaneRef.current || !isPreviewVisible) return

    const editorPane = editorPaneRef.current
    const previewPane = previewPaneRef.current

    const scrollRatio = editorPane.scrollTop / (editorPane.scrollHeight - editorPane.clientHeight)
    const previewScrollTop = scrollRatio * (previewPane.scrollHeight - previewPane.clientHeight)

    previewPane.scrollTop = previewScrollTop
  }, [isPreviewVisible])

  // Add scroll sync listener
  useEffect(() => {
    const editorPane = editorPaneRef.current
    if (editorPane) {
      editorPane.addEventListener('scroll', handleEditorScroll)
      return () => editorPane.removeEventListener('scroll', handleEditorScroll)
    }
  }, [handleEditorScroll])

  if (!editor) {
    return null
  }

  return (
    <div
      ref={containerRef}
      className="split-pane-container flex h-full w-full overflow-hidden rounded-lg border"
    >
      {/* Editor Pane (Left) */}
      <div
        ref={editorPaneRef}
        data-testid="editor-pane"
        className="flex flex-col overflow-auto border-r"
        style={{ flexBasis: `${leftWidth}%`, minWidth: `${minPaneWidth}px` }}
      >
        {/* Toolbar */}
        <div className="sticky top-0 z-10 flex flex-wrap gap-1 border-b bg-background bg-muted/50 p-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={editor.isActive('bold') ? 'bg-muted' : ''}
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={editor.isActive('italic') ? 'bg-muted' : ''}
          >
            <Italic className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={editor.isActive('heading', { level: 1 }) ? 'bg-muted' : ''}
          >
            <Heading1 className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={editor.isActive('heading', { level: 2 }) ? 'bg-muted' : ''}
          >
            <Heading2 className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={editor.isActive('bulletList') ? 'bg-muted' : ''}
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={editor.isActive('orderedList') ? 'bg-muted' : ''}
          >
            <ListOrdered className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={editor.isActive('blockquote') ? 'bg-muted' : ''}
          >
            <Quote className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            className={editor.isActive('codeBlock') ? 'bg-muted' : ''}
          >
            <Code className="h-4 w-4" />
          </Button>
          <div className="flex-1" />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
          >
            <Undo className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
          >
            <Redo className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={togglePreview}
            aria-label="Toggle preview"
          >
            {isPreviewVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </div>

        {/* Editor Content */}
        <EditorContent editor={editor} className="flex-1 overflow-auto" />
      </div>

      {/* Resizable Divider */}
      <div
        {...dividerProps}
        role="separator"
        aria-orientation="vertical"
        tabIndex={0}
        className="w-1 cursor-col-resize bg-border transition-colors hover:bg-primary/50 focus:bg-primary focus:outline-none"
      />

      {/* Preview Pane (Right) */}
      <div
        ref={previewPaneRef}
        data-testid="preview-pane"
        className="overflow-auto bg-muted/30"
        style={{
          flexBasis: `${rightWidth}%`,
          minWidth: `${minPaneWidth}px`,
          display: isPreviewVisible ? 'block' : 'none',
        }}
      >
        <div className="prose prose-sm dark:prose-invert max-w-none p-4">
          <div dangerouslySetInnerHTML={{ __html: editor.getHTML() }} className="preview-content" />
        </div>
      </div>
    </div>
  )
}
