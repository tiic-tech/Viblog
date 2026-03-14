import { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { vi } from 'vitest'

// Custom render function that includes providers
export function customRender(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  return render(ui, { ...options })
}

// Re-export everything from testing library
export * from '@testing-library/react'
export { customRender as render }

// Helper to create mock functions
export function createMockFn<T extends (...args: unknown[]) => unknown>() {
  return vi.fn<T>()
}

// Helper to wait for conditions
export function waitFor(condition: () => boolean, timeout = 1000): Promise<void> {
  return new Promise((resolve, reject) => {
    const startTime = Date.now()
    const interval = setInterval(() => {
      if (condition()) {
        clearInterval(interval)
        resolve()
      } else if (Date.now() - startTime > timeout) {
        clearInterval(interval)
        reject(new Error('Condition not met within timeout'))
      }
    }, 50)
  })
}