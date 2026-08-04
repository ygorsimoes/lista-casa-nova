import { Button } from '@/components/ui/Button'
import { render, screen } from '@testing-library/react'
import { createRef } from 'react'
import { describe, expect, it } from 'vitest'

describe('Button', () => {
  it('mantém type button, variantes, largura e ref', () => {
    const ref = createRef<HTMLButtonElement>()
    render(
      <Button ref={ref} variant="ghost" fullWidth aria-label="Ver presente">
        Ver
      </Button>,
    )

    const button = screen.getByRole('button', { name: 'Ver presente' })
    expect(button).toHaveAttribute('type', 'button')
    expect(button).toHaveClass('ui-button--ghost', 'ui-button--full')
    expect(ref.current).toBe(button)
  })
})
