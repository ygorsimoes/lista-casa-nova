import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import type { Gift } from '@/domain/gifts'

const reserve = vi.fn()

vi.mock('@/app/GiftListProvider', () => ({
  useGiftList: () => ({ reserve }),
}))

vi.mock('@/components/ui/Dialog', () => ({
  Dialog: ({ children, open, title }: { children: React.ReactNode; open: boolean; title: string }) =>
    open ? <section aria-label={title}>{children}</section> : null,
}))

import { ReservationDialog } from './LiveCatalogPage'

const firstGift: Gift = {
  id: 'gift-1', name: 'Chaleira', imageUrl: null, color: null, description: null,
  preferences: [], referenceValue: null, referenceUrl: null, sortOrder: 1,
}

const secondGift: Gift = { ...firstGift, id: 'gift-2', name: 'Jogo de panelas' }

describe('ReservationDialog', () => {
  it('limpa o resultado da reserva anterior ao abrir outro presente', async () => {
    reserve.mockResolvedValueOnce({ kind: 'reserved' })
    const onClose = vi.fn()
    const view = render(<ReservationDialog key={firstGift.id} gift={firstGift} onClose={onClose} />)

    fireEvent.change(screen.getByLabelText('Seu nome'), { target: { value: 'Ana' } })
    fireEvent.click(screen.getByRole('button', { name: 'Confirmar reserva' }))
    await screen.findByRole('status')

    view.rerender(<ReservationDialog key={secondGift.id} gift={secondGift} onClose={onClose} />)

    await waitFor(() => {
      expect(screen.queryByRole('status')).not.toBeInTheDocument()
    })
    expect(screen.getByLabelText('Seu nome')).toHaveValue('')
  })
})
