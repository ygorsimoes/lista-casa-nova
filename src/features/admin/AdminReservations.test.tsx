import AdminPage from '@/features/admin/AdminPage'
import { renderWithApp } from '@/test/renderApp'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

async function openReservations() {
  const user = userEvent.setup()
  renderWithApp(<AdminPage />, { route: '/admin' })
  await user.click(screen.getByRole('button', { name: /entrar na demonstração/i }))
  await user.click(screen.getByRole('button', { name: /^reservas$/i }))
  return user
}

describe('AdminReservations', () => {
  it('libera uma reserva após confirmação e foca a linha alterada', async () => {
    const user = await openReservations()
    const reservation = screen
      .getByRole('button', { name: /liberar reserva de cesto de roupas/i })
      .closest('article')

    await user.click(screen.getByRole('button', { name: /liberar reserva de cesto de roupas/i }))
    await user.click(screen.getByRole('button', { name: /confirmar liberação/i }))

    expect(
      screen
        .getAllByRole('status')
        .some((element) => /reserva liberada/i.test(element.textContent ?? '')),
    ).toBe(true)
    expect(reservation).toHaveTextContent(/cancelada/i)
    expect(reservation).toHaveFocus()
  })

  it('mantém uma reserva quando a confirmação é descartada', async () => {
    const user = await openReservations()
    const release = screen.getByRole('button', { name: /liberar reserva de cesto de roupas/i })

    await user.click(release)
    await user.click(screen.getByRole('button', { name: /manter reserva/i }))

    expect(screen.getByText(/cesto de roupas/i).closest('article')).toHaveTextContent(/reservada/i)
    expect(release).toHaveFocus()
  })

  it('oferece somente as transições permitidas para cada status', async () => {
    const user = await openReservations()

    const reserved = screen.getByText(/potes herméticos/i).closest('article')
    const purchased = screen.getByText(/jogo de cama queen/i).closest('article')
    const received = screen.getByText(/jogo de toalhas/i).closest('article')

    expect(reserved).toHaveTextContent(/marcar como comprada/i)
    expect(reserved).toHaveTextContent(/marcar como recebida/i)
    expect(purchased).not.toHaveTextContent(/marcar como comprada/i)
    expect(purchased).toHaveTextContent(/marcar como recebida/i)
    expect(received).not.toHaveTextContent(/marcar como recebida/i)

    await user.click(
      screen.getByRole('button', { name: /marcar reserva de potes herméticos como comprada/i }),
    )
    expect(reserved).toHaveTextContent(/comprada/i)
    expect(screen.getAllByRole('status')).toContainEqual(
      expect.objectContaining({ textContent: expect.stringMatching(/marcada como comprada/i) }),
    )

    await user.click(
      screen.getByRole('button', { name: /marcar reserva de potes herméticos como recebida/i }),
    )
    expect(reserved).toHaveTextContent(/recebida/i)
    expect(reserved).toHaveTextContent(/não permite novas alterações/i)
  })

  it('atualiza a disponibilidade derivada na lista de presentes', async () => {
    const user = await openReservations()

    await user.click(screen.getByRole('button', { name: /liberar reserva de cesto de roupas/i }))
    await user.click(screen.getByRole('button', { name: /confirmar liberação/i }))
    await user.click(screen.getByRole('button', { name: /^presentes$/i }))

    expect(screen.getByText(/lv-001/i).closest('article')).toHaveTextContent(/1 restante/i)
    expect(screen.getByText(/lv-001/i).closest('article')).toHaveTextContent(/disponível/i)
  })
})
