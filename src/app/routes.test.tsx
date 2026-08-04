import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { describe, expect, it, vi } from 'vitest'

vi.mock('@/features/catalog/LiveCatalogPage', () => ({
  LiveCatalogPage: () => <main>Lista real</main>,
}))

vi.mock('@/features/catalog/GiftDetailsPage', () => ({
  GiftDetailsPage: () => <main>Detalhe demonstrativo</main>,
}))

vi.mock('@/features/not-found/NotFoundPage', () => ({
  NotFoundPage: () => <main>Página não encontrada</main>,
}))

import { AppRoutes } from './routes'

describe('AppRoutes', () => {
  it('não mantém a rota demonstrativa de detalhe de presente', () => {
    render(
      <MemoryRouter initialEntries={['/item/chaleira']}>
        <AppRoutes />
      </MemoryRouter>,
    )

    expect(screen.getByText('Página não encontrada')).toBeInTheDocument()
  })
})
