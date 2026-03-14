import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useToast, toast } from './use-toast'

// Mock timers for setTimeout
vi.useFakeTimers()

describe('useToast hook', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.clearAllTimers()
  })

  it('should return initial state with empty toasts', () => {
    const { result } = renderHook(() => useToast())

    expect(result.current.toasts).toEqual([])
  })

  it('should have toast function', () => {
    const { result } = renderHook(() => useToast())

    expect(typeof result.current.toast).toBe('function')
  })

  it('should have dismiss function', () => {
    const { result } = renderHook(() => useToast())

    expect(typeof result.current.dismiss).toBe('function')
  })

  it('should add a toast', () => {
    const { result } = renderHook(() => useToast())

    act(() => {
      result.current.toast({
        title: 'Test Toast',
        description: 'Test description',
      })
    })

    expect(result.current.toasts).toHaveLength(1)
    expect(result.current.toasts[0].title).toBe('Test Toast')
    expect(result.current.toasts[0].description).toBe('Test description')
  })

  it('should dismiss a toast', () => {
    const { result } = renderHook(() => useToast())

    act(() => {
      result.current.toast({
        title: 'Test Toast',
      })
    })

    expect(result.current.toasts).toHaveLength(1)

    act(() => {
      result.current.dismiss(result.current.toasts[0].id)
    })

    // After dismiss, toast should be marked as dismissed (open: false)
    expect(result.current.toasts[0].open).toBe(false)
  })

  it('should dismiss all toasts when no id provided', () => {
    const { result } = renderHook(() => useToast())

    act(() => {
      result.current.toast({ title: 'Toast 1' })
    })

    act(() => {
      result.current.dismiss()
    })

    expect(result.current.toasts[0].open).toBe(false)
  })
})

describe('toast function', () => {
  it('should be callable', () => {
    expect(typeof toast).toBe('function')
  })

  it('should return id and dismiss/Update functions', () => {
    const result = toast({ title: 'Test' })

    expect(result.id).toBeDefined()
    expect(typeof result.dismiss).toBe('function')
    expect(typeof result.update).toBe('function')
  })
})