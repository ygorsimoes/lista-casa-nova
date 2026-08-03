import { renderWithApp } from '@/test/renderApp'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { ReservationForm } from './ReservationForm'

describe('ReservationForm', () => {
  it('foca o primeiro campo inválido e associa a mensagem de erro', async () => {
    const user = userEvent.setup()
    renderWithApp(
      <ReservationForm itemCode="CZ-001" availableQuantity={1} onClose={() => undefined} />,
    )

    await user.click(screen.getByRole('button', { name: /confirmar reserva/i }))

    const firstName = screen.getByLabelText(/primeiro nome/i)
    expect(firstName).toHaveFocus()
    expect(firstName).toHaveAttribute('aria-invalid', 'true')
    expect(screen.getByText(/informe pelo menos 2 caracteres/i)).toBeVisible()
  })
})
