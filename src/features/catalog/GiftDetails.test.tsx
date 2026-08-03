import { renderWithApp } from '@/test/renderApp'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { GiftDetailsPage } from './GiftDetailsPage'

describe('GiftDetailsPage', () => {
  it('mostra uma saída amigável para um presente inexistente', () => {
    renderWithApp(<GiftDetailsPage />, {
      route: '/item/inexistente',
      routePath: '/item/:code',
    })

    expect(screen.getByRole('alert')).toHaveTextContent(/presente não encontrado/i)
    expect(screen.getByRole('link', { name: /voltar ao catálogo/i })).toHaveAttribute('href', '/')
  })

  it('mostra preferências, equivalência e uma sugestão sem abrir site externo', async () => {
    const user = userEvent.setup()
    renderWithApp(<GiftDetailsPage />, {
      route: '/item/CZ-001',
      routePath: '/item/:code',
    })

    expect(screen.getByText(/aceitamos um produto equivalente/i)).toBeVisible()
    expect(screen.getByText('inox, acabamento fosco, tons neutros')).toBeVisible()
    await user.click(screen.getByRole('button', { name: /ver sugestão/i }))

    expect(screen.getAllByText(/nenhum site externo foi aberto/i)).toHaveLength(2)
  })

  it('explica que um item indisponível não pode receber reservas', () => {
    renderWithApp(<GiftDetailsPage />, {
      route: '/item/LV-001',
      routePath: '/item/:code',
    })

    expect(screen.getByText(/não está mais disponível/i)).toBeVisible()
    expect(
      screen.queryByRole('button', { name: /quero dar este presente/i }),
    ).not.toBeInTheDocument()
  })

  it('mantém os campos e mostra recuperação após conflito', async () => {
    const user = userEvent.setup()
    renderWithApp(<GiftDetailsPage />, {
      route: '/item/CZ-004',
      routePath: '/item/:code',
    })

    await user.click(screen.getByRole('button', { name: /quero dar este presente/i }))
    await user.type(screen.getByLabelText(/primeiro nome/i), 'Nina')
    await user.click(screen.getByRole('button', { name: /confirmar reserva/i }))

    expect(screen.getByRole('alert')).toHaveTextContent(/acabou de ser reservado/i)
    expect(screen.getByLabelText(/primeiro nome/i)).toHaveValue('Nina')
    expect(screen.getByRole('link', { name: /escolher outro presente/i })).toHaveAttribute(
      'href',
      '/',
    )
  })

  it('cria uma reserva com token determinístico e oferece o próximo passo', async () => {
    const user = userEvent.setup()
    renderWithApp(<GiftDetailsPage />, {
      route: '/item/CZ-001',
      routePath: '/item/:code',
    })

    await user.click(screen.getByRole('button', { name: /quero dar este presente/i }))
    await user.type(screen.getByLabelText(/primeiro nome/i), 'Nina')
    await user.click(screen.getByRole('button', { name: /confirmar reserva/i }))

    expect(screen.getByText(/pronto, este presente está reservado para você/i)).toBeVisible()
    expect(screen.getByRole('link', { name: /gerenciar esta reserva/i })).toHaveAttribute(
      'href',
      '/minha-reserva/reserva-cz-001-1',
    )
    expect(screen.queryByText(/não está mais disponível/i)).not.toBeInTheDocument()
  })
})
