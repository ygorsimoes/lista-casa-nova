import { renderWithApp } from '@/test/renderApp'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { ManageReservationPage } from './ManageReservationPage'

function renderReservation(token: string) {
  return renderWithApp(<ManageReservationPage />, {
    route: `/minha-reserva/${token}`,
    routePath: '/minha-reserva/:token',
  })
}

describe('ManageReservationPage', () => {
  it('marca a reserva válida como comprada e move o foco para o novo estado', async () => {
    const user = userEvent.setup()
    renderReservation('reserva-demo-valida')

    await user.click(screen.getByRole('button', { name: /já comprei/i }))

    const status = screen.getByRole('status', { name: /estado da reserva/i })
    expect(status).toHaveTextContent(/comprado/i)
    expect(screen.getByRole('heading', { name: /estado da reserva/i })).toHaveFocus()
    expect(screen.queryByRole('button', { name: /já comprei/i })).not.toBeInTheDocument()
    expect(screen.getByText(/reserva marcada como comprada/i)).toBeVisible()
    expect(status).toHaveTextContent(/comprado/i)
  })

  it('cancela uma reserva apenas após confirmar e move o foco para o novo estado', async () => {
    const user = userEvent.setup()
    renderReservation('reserva-demo-valida')

    const cancelButton = screen.getByRole('button', { name: /cancelar minha reserva/i })
    await user.click(cancelButton)
    expect(screen.getByRole('dialog', { name: /cancelar reserva/i })).toBeVisible()

    await user.click(screen.getByRole('button', { name: /^cancelar reserva$/i }))

    expect(screen.getByRole('status', { name: /estado da reserva/i })).toHaveTextContent(
      /cancelad/i,
    )
    expect(screen.getByRole('heading', { name: /estado da reserva/i })).toHaveFocus()
    expect(screen.queryByRole('button', { name: /já comprei/i })).not.toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: /cancelar minha reserva/i }),
    ).not.toBeInTheDocument()
    expect(screen.getByText(/^reserva cancelada\.$/i)).toBeVisible()
    expect(screen.getByRole('status', { name: /estado da reserva/i })).toHaveTextContent(
      /reserva cancelada/i,
    )
  })

  it('mantém a reserva quando a pessoa desiste do cancelamento', async () => {
    const user = userEvent.setup()
    renderReservation('reserva-demo-valida')

    await user.click(screen.getByRole('button', { name: /cancelar minha reserva/i }))
    await user.click(screen.getByRole('button', { name: /manter reserva/i }))

    expect(screen.getByRole('status', { name: /estado da reserva/i })).toHaveTextContent(
      /reservad/i,
    )
    expect(screen.getByRole('button', { name: /já comprei/i })).toBeVisible()
    expect(screen.getByRole('button', { name: /cancelar minha reserva/i })).toHaveFocus()
  })

  it.each([
    ['reserva-demo-paulo', /comprado/i],
    ['reserva-demo-lia', /recebido/i],
  ])('mostra o estado terminal %s sem ações inválidas', (token, expectedStatus) => {
    renderReservation(token)

    expect(screen.getByRole('status', { name: /estado da reserva/i })).toHaveTextContent(
      expectedStatus,
    )
    expect(screen.queryByRole('button', { name: /já comprei/i })).not.toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: /cancelar minha reserva/i }),
    ).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: /voltar à lista/i })).toHaveAttribute('href', '/')
  })

  it('oferece retorno ao catálogo para token inexistente', () => {
    renderReservation('reserva-inexistente')

    expect(screen.getByRole('heading', { name: /reserva não encontrada/i })).toBeVisible()
    expect(screen.getByRole('link', { name: /voltar à lista/i })).toHaveAttribute('href', '/')
  })
})
