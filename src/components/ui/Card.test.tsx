import { Card } from '@/components/ui/Card'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

describe('Card', () => {
  it('preserva elevação por padrão e oferece superfície plana', () => {
    const { rerender } = render(<Card data-testid="card">Elevado</Card>)
    expect(screen.getByTestId('card')).toHaveClass('ui-card--elevated')

    rerender(
      <Card data-testid="card" variant="flat" className="gift-card">
        Plano
      </Card>,
    )
    expect(screen.getByTestId('card')).toHaveClass('ui-card--flat', 'gift-card')
  })
})
