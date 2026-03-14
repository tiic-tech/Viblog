import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './card'

describe('Card components', () => {
  describe('Card', () => {
    it('should render card with children', () => {
      render(
        <Card>
          <div>Card content</div>
        </Card>
      )

      expect(screen.getByText('Card content')).toBeInTheDocument()
    })

    it('should apply custom className', () => {
      render(<Card className="custom-card">Test</Card>)

      const card = screen.getByText('Test')
      expect(card.className).toContain('custom-card')
    })
  })

  describe('CardHeader', () => {
    it('should render header with children', () => {
      render(<CardHeader>Header content</CardHeader>)

      expect(screen.getByText('Header content')).toBeInTheDocument()
    })
  })

  describe('CardTitle', () => {
    it('should render title', () => {
      render(<CardTitle>Card Title</CardTitle>)

      expect(screen.getByText('Card Title')).toBeInTheDocument()
    })
  })

  describe('CardDescription', () => {
    it('should render description', () => {
      render(<CardDescription>Card description text</CardDescription>)

      expect(screen.getByText('Card description text')).toBeInTheDocument()
    })
  })

  describe('CardContent', () => {
    it('should render content', () => {
      render(<CardContent>Main content</CardContent>)

      expect(screen.getByText('Main content')).toBeInTheDocument()
    })
  })

  describe('CardFooter', () => {
    it('should render footer', () => {
      render(<CardFooter>Footer content</CardFooter>)

      expect(screen.getByText('Footer content')).toBeInTheDocument()
    })
  })

  describe('Full card composition', () => {
    it('should render complete card structure', () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle>Test Card</CardTitle>
            <CardDescription>A test card</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Content here</p>
          </CardContent>
          <CardFooter>
            <button>Action</button>
          </CardFooter>
        </Card>
      )

      expect(screen.getByText('Test Card')).toBeInTheDocument()
      expect(screen.getByText('A test card')).toBeInTheDocument()
      expect(screen.getByText('Content here')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Action' })).toBeInTheDocument()
    })
  })
})
