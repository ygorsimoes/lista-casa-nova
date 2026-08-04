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

  it('mostra preferências, equivalência e uma referência sem abrir site externo', async () => {
    const user = userEvent.setup()
    renderWithApp(<GiftDetailsPage />, {
      route: '/item/CZ-001',
      routePath: '/item/:code',
    })

    expect(screen.getByText(/aceitamos um produto equivalente/i)).toBeVisible()
    expect(screen.getByText('inox, acabamento fosco, tons neutros')).toBeVisible()
    await user.click(screen.getByRole('button', { name: 'Ver uma referência opcional' }))

    expect(screen.getByRole('status')).toHaveTextContent('Nenhum site externo foi aberto.')
  })

  it('explica que um item indisponível não pode receber reservas', () => {
    renderWithApp(<GiftDetailsPage />, {
      route: '/item/LV-001',
      routePath: '/item/:code',
    })

    expect(screen.getByText('Este presente já foi escolhido por outra pessoa.')).toBeVisible()
    expect(
      screen.queryByRole('button', { name: /quero dar este presente/i }),
    ).not.toBeInTheDocument()
  })

  it('troca detalhe por reserva e preserva o nome ao voltar', async () => {
    const user = userEvent.setup()
    renderWithApp(<GiftDetailsPage />, { route: '/item/CZ-001', routePath: '/item/:code' })

    await user.click(screen.getByRole('button', { name: 'Quero dar este presente' }))
    expect(screen.queryByText('Nossa preferência')).not.toBeInTheDocument()
    await user.type(screen.getByLabelText('Seu primeiro nome'), 'Nina')
    await user.click(screen.getByRole('button', { name: 'Ver detalhes' }))
    expect(screen.getByText('Nossa preferência')).toBeVisible()

    await user.click(screen.getByRole('button', { name: 'Quero dar este presente' }))
    expect(screen.getByLabelText('Seu primeiro nome')).toHaveValue('Nina')
  })

  it('mantém conflito dentro do formulário e preserva o rascunho', async () => {
    const user = userEvent.setup()
    renderWithApp(<GiftDetailsPage />, { route: '/item/CZ-004', routePath: '/item/:code' })

    await user.click(screen.getByRole('button', { name: 'Quero dar este presente' }))
    await user.type(screen.getByLabelText('Seu primeiro nome'), 'Nina')
    await user.click(screen.getByRole('button', { name: 'Confirmar reserva' }))

    expect(screen.getByRole('alert')).toHaveTextContent('Este presente acabou de ser reservado.')
    expect(screen.getByRole('alert')).toHaveFocus()
    expect(screen.getByLabelText('Seu primeiro nome')).toHaveValue('Nina')
    expect(screen.getByRole('button', { name: 'Confirmar reserva' })).toBeVisible()
  })

  it('substitui o formulário pela confirmação e foca seu título', async () => {
    const user = userEvent.setup()
    renderWithApp(<GiftDetailsPage />, { route: '/item/CZ-001', routePath: '/item/:code' })

    await user.click(screen.getByRole('button', { name: 'Quero dar este presente' }))
    await user.type(screen.getByLabelText('Seu primeiro nome'), 'Nina')
    await user.click(screen.getByRole('button', { name: 'Confirmar reserva' }))

    const title = screen.getByRole('heading', { name: 'Este presente ficou com você' })
    expect(title).toHaveFocus()
    expect(screen.getByText('3 · Combine a entrega')).toBeVisible()
    expect(screen.getByRole('link', { name: 'Ver minha reserva' })).toHaveAttribute(
      'href',
      '/minha-reserva/reserva-cz-001-1',
    )
    expect(screen.queryByLabelText('Seu primeiro nome')).not.toBeInTheDocument()
    expect(screen.queryByText('Nossa preferência')).not.toBeInTheDocument()
  })
})
