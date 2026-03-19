import { renderHook, act } from '@testing-library/react'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { useSplitPane } from '../use-split-pane'

describe('useSplitPane', () => {
  const mockContainerRef = {
    current: {
      getBoundingClientRect: vi.fn(() => ({
        left: 0,
        width: 1000,
      })),
    } as unknown as HTMLDivElement,
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Initial State', () => {
    it('should return default split values', () => {
      const { result } = renderHook(() =>
        useSplitPane({
          containerRef: mockContainerRef as React.RefObject<HTMLDivElement>,
        })
      )

      expect(result.current.leftWidth).toBe(50)
      expect(result.current.rightWidth).toBe(50)
    })

    it('should accept custom default split', () => {
      const { result } = renderHook(() =>
        useSplitPane({
          defaultSplit: 70,
          containerRef: mockContainerRef as React.RefObject<HTMLDivElement>,
        })
      )

      expect(result.current.leftWidth).toBe(70)
      expect(result.current.rightWidth).toBe(30)
    })

    it('should not be dragging initially', () => {
      const { result } = renderHook(() =>
        useSplitPane({
          containerRef: mockContainerRef as React.RefObject<HTMLDivElement>,
        })
      )

      expect(result.current.isDragging).toBe(false)
    })
  })

  describe('Divider Props', () => {
    it('should provide aria-valuenow based on leftWidth', () => {
      const { result } = renderHook(() =>
        useSplitPane({
          defaultSplit: 60,
          containerRef: mockContainerRef as React.RefObject<HTMLDivElement>,
        })
      )

      expect(result.current.dividerProps['aria-valuenow']).toBe(60)
    })

    it('should provide aria-valuemin and aria-valuemax', () => {
      const { result } = renderHook(() =>
        useSplitPane({
          containerRef: mockContainerRef as React.RefObject<HTMLDivElement>,
        })
      )

      expect(result.current.dividerProps['aria-valuemin']).toBe(10)
      expect(result.current.dividerProps['aria-valuemax']).toBe(90)
    })

    it('should provide onMouseDown handler', () => {
      const { result } = renderHook(() =>
        useSplitPane({
          containerRef: mockContainerRef as React.RefObject<HTMLDivElement>,
        })
      )

      expect(typeof result.current.dividerProps.onMouseDown).toBe('function')
    })

    it('should provide onKeyDown handler', () => {
      const { result } = renderHook(() =>
        useSplitPane({
          containerRef: mockContainerRef as React.RefObject<HTMLDivElement>,
        })
      )

      expect(typeof result.current.dividerProps.onKeyDown).toBe('function')
    })
  })

  describe('Mouse Drag', () => {
    it('should start dragging on mouse down', () => {
      const { result } = renderHook(() =>
        useSplitPane({
          containerRef: mockContainerRef as React.RefObject<HTMLDivElement>,
        })
      )

      const mockEvent = {
        preventDefault: vi.fn(),
      } as unknown as React.MouseEvent

      act(() => {
        result.current.dividerProps.onMouseDown(mockEvent)
      })

      expect(result.current.isDragging).toBe(true)
    })
  })

  describe('Keyboard Navigation', () => {
    it('should decrease leftWidth on ArrowLeft', () => {
      const { result } = renderHook(() =>
        useSplitPane({
          defaultSplit: 50,
          containerRef: mockContainerRef as React.RefObject<HTMLDivElement>,
        })
      )

      act(() => {
        result.current.dividerProps.onKeyDown({
          key: 'ArrowLeft',
        } as React.KeyboardEvent)
      })

      expect(result.current.leftWidth).toBe(48)
      expect(result.current.rightWidth).toBe(52)
    })

    it('should increase leftWidth on ArrowRight', () => {
      const { result } = renderHook(() =>
        useSplitPane({
          defaultSplit: 50,
          containerRef: mockContainerRef as React.RefObject<HTMLDivElement>,
        })
      )

      act(() => {
        result.current.dividerProps.onKeyDown({
          key: 'ArrowRight',
        } as React.KeyboardEvent)
      })

      expect(result.current.leftWidth).toBe(52)
      expect(result.current.rightWidth).toBe(48)
    })

    it('should not go below minimum (10%) on ArrowLeft', () => {
      const { result } = renderHook(() =>
        useSplitPane({
          defaultSplit: 12,
          containerRef: mockContainerRef as React.RefObject<HTMLDivElement>,
        })
      )

      act(() => {
        result.current.dividerProps.onKeyDown({
          key: 'ArrowLeft',
        } as React.KeyboardEvent)
      })

      expect(result.current.leftWidth).toBe(10)
    })

    it('should not go above maximum (90%) on ArrowRight', () => {
      const { result } = renderHook(() =>
        useSplitPane({
          defaultSplit: 88,
          containerRef: mockContainerRef as React.RefObject<HTMLDivElement>,
        })
      )

      act(() => {
        result.current.dividerProps.onKeyDown({
          key: 'ArrowRight',
        } as React.KeyboardEvent)
      })

      expect(result.current.leftWidth).toBe(90)
    })

    it('should ignore other keys', () => {
      const { result } = renderHook(() =>
        useSplitPane({
          defaultSplit: 50,
          containerRef: mockContainerRef as React.RefObject<HTMLDivElement>,
        })
      )

      act(() => {
        result.current.dividerProps.onKeyDown({
          key: 'Enter',
        } as React.KeyboardEvent)
      })

      expect(result.current.leftWidth).toBe(50)
    })
  })
})
