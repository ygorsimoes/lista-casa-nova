import AdminPage from '@/features/admin/AdminPage'
import { renderWithApp } from '@/test/renderApp'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

describe('AdminPage', () => {
  it('explica que o acesso não possui autenticação real', () => {
    renderWithApp(<AdminPage />, { route: '/admin' })

    expect(screen.getByRole('heading', { name: /painel demonstrativo/i })).toBeVisible()
    expect(screen.getByText(/não existe autenticação real/i)).toBeVisible()
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
  })

  it('entra e sai da demonstração sem credenciais', async () => {
    const user = userEvent.setup()
    renderWithApp(<AdminPage />, { route: '/admin' })

    await user.click(screen.getByRole('button', { name: /entrar na demonstração/i }))

    expect(screen.getByRole('heading', { name: /painel da lista/i })).toHaveFocus()
    expect(screen.getByText('8', { selector: '.admin-summary__value' })).toBeVisible()
    expect(screen.getByRole('button', { name: /^presentes$/i })).toBeVisible()
    expect(screen.getByRole('button', { name: /^reservas$/i })).toBeVisible()
    expect(screen.getByRole('link', { name: /voltar para a lista/i })).toBeVisible()
    expect(screen.getByRole('button', { name: /sair da demonstração/i })).toBeVisible()

    await user.click(screen.getByRole('button', { name: /sair da demonstração/i }))

    expect(screen.getByText(/não existe autenticação real/i)).toBeVisible()
    expect(screen.getByRole('heading', { name: /painel demonstrativo/i })).toHaveFocus()
  })

  it('inicia cada nova montagem bloqueada', () => {
    renderWithApp(<AdminPage />, { route: '/admin' })

    expect(screen.getByRole('button', { name: /entrar na demonstração/i })).toBeVisible()
  })

  it('mostra resumo e seções operacionais simultaneamente no shell administrativo', async () => {
    const user = userEvent.setup()
    renderWithApp(<AdminPage />, { route: '/admin' })

    await user.click(screen.getByRole('button', { name: /entrar na demonstração/i }))

    expect(screen.getByRole('heading', { name: /presentes da lista/i })).toBeVisible()
    expect(screen.getByRole('heading', { name: /^reservas$/i })).toBeVisible()
    expect(screen.getByRole('heading', { name: /configurações da lista/i })).toBeVisible()
    expect(screen.getByText(/código.*categoria.*desejado.*restante/i)).toBeVisible()
    expect(document.querySelector('.site-header')).not.toBeInTheDocument()
    expect(document.querySelector('.admin-shell')).toBeInTheDocument()
  })
})
