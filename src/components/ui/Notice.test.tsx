import { Notice } from '@/components/ui/Notice'
import { render, screen } from '@testing-library/react'
import { createRef } from 'react'
import { describe, expect, it } from 'vitest'

describe('Notice', () => {
  it('não cria região viva implicitamente e encaminha ref', () => {
    const ref = createRef<HTMLDivElement>()
    const { container } = render(
      <Notice ref={ref} tone="demo">
        Nada é enviado ou salvo.
      </Notice>,
    )
    expect(container.firstElementChild).not.toHaveAttribute('role')
    expect(container.firstElementChild).not.toHaveAttribute('aria-live')
    expect(ref.current).toBe(container.firstElementChild)
  })

  it('propaga papel, nome e classe sem expor o ícone', () => {
    render(
      <Notice
        tone="error"
        role="alert"
        aria-label="Conflito de reserva"
        className="reservation-notice"
        icon={<svg data-testid="notice-icon" />}
      >
        Este presente acabou de ser reservado.
      </Notice>,
    )

    expect(screen.getByRole('alert', { name: 'Conflito de reserva' })).toHaveClass(
      'ui-notice--error',
      'reservation-notice',
    )
    expect(screen.getByTestId('notice-icon').parentElement).toHaveAttribute('aria-hidden', 'true')
  })
})
