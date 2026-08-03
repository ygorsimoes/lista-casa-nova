import { AppRoutes } from '@/app/routes'
import { renderWithApp } from '@/test/renderApp'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

describe('AppRoutes', () => {
  it.each([
    ['/item/CODIGO-INEXISTENTE', 'Presente não encontrado'],
    ['/minha-reserva/reserva-inexistente', 'Reserva não encontrada'],
    ['/colecao/colecao-inexistente', 'Coleção não encontrada'],
    ['/onde-foi-parar', 'Página não encontrada'],
  ])('oferece um h1 focalizado para o estado inválido em %s', (route, title) => {
    renderWithApp(<AppRoutes />, { route })

    const heading = screen.getByRole('heading', { level: 1, name: title })
    expect(heading).toBeVisible()
    expect(heading).toHaveFocus()
    expect(screen.getByRole('link', { name: /voltar (ao catálogo|à lista)/i })).toHaveAttribute(
      'href',
      '/',
    )
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

  it('carrega o painel demonstrativo pela rota sob demanda', async () => {
    renderWithApp(<AppRoutes />, { route: '/admin' })

    expect(await screen.findByRole('heading', { name: /painel demonstrativo/i })).toBeVisible()
  })

  it('abre detalhes sobre o catálogo e devolve o foco ao cartão ao fechar', async () => {
    const user = userEvent.setup()
    renderWithApp(<AppRoutes />)
    const trigger = screen.getByRole('button', { name: 'Ver Chaleira' })

    await user.click(trigger)

    expect(screen.getByRole('dialog', { name: /detalhes do presente/i })).toBeVisible()
    await user.click(screen.getByRole('button', { name: 'Fechar' }))

    expect(screen.queryByRole('dialog', { name: /detalhes do presente/i })).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /lista da nossa casa nova/i })).toBeVisible()
    expect(trigger).toHaveFocus()
  })
})
