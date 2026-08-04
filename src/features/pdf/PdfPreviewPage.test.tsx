import { renderWithApp } from '@/test/renderApp'
import { screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

vi.mock('@/app/GiftListProvider', () => ({
  useGiftList: () => ({
    gifts: [
      { id: 'gift-1', name: 'Chaleira', sortOrder: 1 },
      { id: 'gift-2', name: 'Jogo de panelas', sortOrder: 2 },
    ],
    reservedGiftIds: new Set(['gift-2']),
  }),
}))

vi.mock('@/components/layout/AppShell', () => ({
  AppShell: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))

import PdfPreviewPage from './PdfPreviewPage'

describe('PdfPreviewPage', () => {
  it('organiza uma folha de impressão sem nomes de reservas', () => {
    renderWithApp(<PdfPreviewPage />)

    expect(screen.getByRole('heading', { name: 'Lista da Casa Nova' })).toBeVisible()
    expect(screen.getByRole('list', { name: 'Presentes da lista' })).toHaveTextContent('Chaleira')
    expect(screen.getByRole('list', { name: 'Presentes da lista' })).toHaveTextContent(
      'Jogo de panelas',
    )
    expect(screen.getByText('Nomes de reservas não aparecem nesta lista.')).toBeVisible()
  })
})
