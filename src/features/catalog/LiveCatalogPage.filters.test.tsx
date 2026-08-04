import { fireEvent, render, screen, within } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import type { Gift } from '@/domain/gifts'

const gifts: Gift[] = [
  { id: 'gift-1', name: 'Chaleira', imageUrl: null, color: null, description: null, preferences: [], referenceValue: null, referenceUrl: null, sortOrder: 1 },
  { id: 'gift-2', name: 'Cesto de roupas', imageUrl: null, color: null, description: null, preferences: [], referenceValue: null, referenceUrl: null, sortOrder: 2 },
  { id: 'gift-3', name: 'Varal de chão', imageUrl: null, color: null, description: null, preferences: [], referenceValue: null, referenceUrl: null, sortOrder: 3 },
]

vi.mock('@/app/GiftListProvider', () => ({
  useGiftList: () => ({
    gifts,
    reservedGiftIds: new Set(['gift-1']),
    loading: false,
    error: null,
    refresh: vi.fn(),
    reserve: vi.fn(),
  }),
}))

import { LiveCatalogPage } from './LiveCatalogPage'

describe('LiveCatalogPage availability priority', () => {
  it('mostra os presentes disponíveis primeiro e deixa todos acessíveis por um filtro simples', () => {
    render(<LiveCatalogPage />)

    expect(screen.queryByText('2 disponíveis para escolher')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Disponíveis (2)' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.queryByRole('heading', { name: 'Chaleira' })).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Todos (3)' }))

    const cards = within(screen.getByLabelText('Presentes para escolher')).getAllByRole('article')
    expect(cards.map((card) => card.textContent)).toEqual([
      expect.stringContaining('Cesto de roupas'),
      expect.stringContaining('Varal de chão'),
      expect.stringContaining('Chaleira'),
    ])
  })
})
