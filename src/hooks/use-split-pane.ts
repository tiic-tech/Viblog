import { useState, useRef, useCallback, useEffect } from 'react'

interface UseSplitPaneOptions {
  defaultSplit?: number // percentage, e.g., 50 means 50/50 split
  minPaneWidth?: number // minimum width in pixels
  containerRef: React.RefObject<HTMLDivElement>
}

interface UseSplitPaneReturn {
  leftWidth: number
  rightWidth: number
  isDragging: boolean
  dividerProps: {
    onMouseDown: (e: React.MouseEvent) => void
    onKeyDown: (e: React.KeyboardEvent) => void
    'aria-valuenow': number
    'aria-valuemin': number
    'aria-valuemax': number
  }
}

/**
 * useSplitPane - Custom hook for resizable split pane logic
 *
 * This hook provides the logic for a resizable two-column layout
 * with keyboard accessibility support.
 */
export function useSplitPane({
  defaultSplit = 50,
  minPaneWidth = 200,
  containerRef,
}: UseSplitPaneOptions): UseSplitPaneReturn {
  const [leftWidth, setLeftWidth] = useState(defaultSplit)
  const [isDragging, setIsDragging] = useState(false)

  // Handle divider drag start
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  // Handle mouse move during drag
  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging || !containerRef.current) return

      const containerRect = containerRef.current.getBoundingClientRect()
      const containerWidth = containerRect.width
      const newLeftWidth = ((e.clientX - containerRect.left) / containerWidth) * 100

      // Constrain to min/max bounds
      const minWidthPercent = (minPaneWidth / containerWidth) * 100
      const maxWidthPercent = 100 - minWidthPercent

      const constrainedWidth = Math.min(Math.max(newLeftWidth, minWidthPercent), maxWidthPercent)
      setLeftWidth(constrainedWidth)
    },
    [isDragging, containerRef, minPaneWidth]
  )

  // Handle drag end
  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    const step = 2 // percentage per keypress
    if (e.key === 'ArrowLeft') {
      setLeftWidth((prev) => Math.max(prev - step, 10))
    } else if (e.key === 'ArrowRight') {
      setLeftWidth((prev) => Math.min(prev + step, 90))
    }
  }, [])

  // Add global mouse event listeners for drag
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [isDragging, handleMouseMove, handleMouseUp])

  return {
    leftWidth,
    rightWidth: 100 - leftWidth,
    isDragging,
    dividerProps: {
      onMouseDown: handleMouseDown,
      onKeyDown: handleKeyDown,
      'aria-valuenow': Math.round(leftWidth),
      'aria-valuemin': 10,
      'aria-valuemax': 90,
    },
  }
}