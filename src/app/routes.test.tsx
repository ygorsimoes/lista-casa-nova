import { AppRoutes } from '@/app/routes'
import { renderWithApp } from '@/test/renderApp'
import { screen } from '@testing-library/react'
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
})
