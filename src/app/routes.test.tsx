import { AppRoutes } from '@/app/routes'
import { renderWithApp } from '@/test/renderApp'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

describe('AppRoutes', () => {
  it('mostra uma mensagem amigável para rotas desconhecidas', () => {
    renderWithApp(<AppRoutes />, { route: '/onde-foi-parar' })

    expect(screen.getByRole('heading', { name: /página não encontrada/i })).toBeVisible()
    expect(screen.getByRole('link', { name: /voltar ao catálogo/i })).toHaveAttribute('href', '/')
  })

  it('abre uma página de detalhes pelo código do presente', () => {
    renderWithApp(<AppRoutes />, { route: '/item/CZ-001' })

    expect(screen.getByRole('heading', { name: 'Chaleira' })).toBeVisible()
    expect(screen.getByRole('button', { name: /voltar ao catálogo/i })).toBeVisible()
  })

  it.each([
    ['/colecao/sugestoes-cozinha', /sugestões para a cozinha/i],
    ['/pix', /contribuir por pix/i],
  ])('abre a rota demonstrativa %s', (route, heading) => {
    renderWithApp(<AppRoutes />, { route })

    expect(screen.getByRole('heading', { name: heading })).toBeVisible()
  })

  it('carrega a prévia de impressão pela rota sob demanda', async () => {
    renderWithApp(<AppRoutes />, { route: '/pdf' })

    expect(await screen.findByRole('heading', { name: /prévia para impressão/i })).toBeVisible()
  })

  it('abre detalhes sobre o catálogo e devolve o foco ao cartão ao fechar', async () => {
    const user = userEvent.setup()
    renderWithApp(<AppRoutes />)
    const trigger = screen.getByRole('button', { name: /quero dar este presente: chaleira/i })

    await user.click(trigger)

    expect(screen.getByRole('dialog', { name: /detalhes do presente/i })).toBeVisible()
    await user.click(screen.getByRole('button', { name: 'Fechar' }))

    expect(screen.queryByRole('dialog', { name: /detalhes do presente/i })).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /lista da nossa casa nova/i })).toBeVisible()
    expect(trigger).toHaveFocus()
  })
})
