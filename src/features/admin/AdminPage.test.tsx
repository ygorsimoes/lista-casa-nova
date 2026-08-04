import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import type { Gift } from '@/domain/gifts'
import { MemoryRouter } from 'react-router'

const mocks = vi.hoisted(() => ({
  refresh: vi.fn(),
  fetchAdminReservations: vi
    .fn()
    .mockResolvedValue([
      { giftId: 'gift-2', guestName: 'Marina', createdAt: '2026-08-04T12:00:00Z' },
    ]),
  deleteAdminReservation: vi.fn().mockResolvedValue(undefined),
  updateAdminGift: vi.fn().mockResolvedValue(undefined),
}))

const gifts: Gift[] = [
  {
    id: 'gift-1',
    name: 'Chaleira',
    imageUrl: null,
    color: 'Inox',
    description: null,
    preferences: [],
    referenceValue: null,
    referenceUrl: null,
    sortOrder: 1,
  },
  {
    id: 'gift-2',
    name: 'Jogo de toalhas',
    imageUrl: null,
    color: 'Areia',
    description: null,
    preferences: ['algodão'],
    referenceValue: null,
    referenceUrl: null,
    sortOrder: 2,
  },
]

vi.mock('@/app/GiftListProvider', () => ({
  useGiftList: () => ({ gifts, reservedGiftIds: new Set(['gift-2']), refresh: mocks.refresh }),
}))

vi.mock('@/lib/supabase', () => ({
  getSupabaseClient: () => ({
    auth: {
      getSession: vi.fn().mockResolvedValue({ data: { session: { user: { id: 'admin' } } } }),
      signOut: vi.fn().mockResolvedValue({}),
    },
  }),
}))

vi.mock('./admin-api', () => ({
  fetchAdminReservations: mocks.fetchAdminReservations,
  createAdminGift: vi.fn(),
  updateAdminGift: mocks.updateAdminGift,
  deleteAdminGift: vi.fn(),
  deleteAdminReservation: mocks.deleteAdminReservation,
}))

import AdminPage from './AdminPage'

function renderPage() {
  return render(
    <MemoryRouter>
      <AdminPage />
    </MemoryRouter>,
  )
}

describe('AdminPage', () => {
  it('resume a lista e filtra os presentes reservados', async () => {
    renderPage()

    await waitFor(() => expect(screen.getByText('2 presentes')).toBeInTheDocument())
    expect(screen.getByText('2 presentes')).toBeInTheDocument()
    expect(screen.getByText('1 disponível')).toBeInTheDocument()
    expect(screen.getByText('1 reservado')).toBeInTheDocument()

    fireEvent.change(screen.getByLabelText('Filtrar catálogo'), { target: { value: 'reserved' } })
    const catalog = screen.getByLabelText('Catálogo de presentes')
    expect(within(catalog).getByText('Jogo de toalhas')).toBeInTheDocument()
    expect(within(catalog).queryByText('Chaleira')).not.toBeInTheDocument()
  })

  it('abre a edição com os dados existentes e salva a alteração', async () => {
    renderPage()

    await waitFor(() => expect(screen.getByText('2 presentes')).toBeInTheDocument())
    fireEvent.click(screen.getByRole('button', { name: 'Editar Chaleira' }))

    expect(screen.getByRole('heading', { name: 'Editar presente' })).toBeInTheDocument()
    expect(screen.getByLabelText('Nome do presente')).toHaveValue('Chaleira')
    fireEvent.change(screen.getByLabelText('Nome do presente'), {
      target: { value: 'Chaleira elétrica' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Salvar alterações' }))

    expect(mocks.updateAdminGift).toHaveBeenCalledWith(
      'gift-1',
      expect.objectContaining({ name: 'Chaleira elétrica' }),
    )
    expect(await screen.findByRole('status')).toHaveTextContent('Presente atualizado na lista.')
  })

  it('associa a reserva ao presente correto', async () => {
    renderPage()

    await waitFor(() => expect(screen.getByText('2 presentes')).toBeInTheDocument())
    const reservations = screen.getByLabelText('Reservas da lista')
    expect(within(reservations).getByText('Jogo de toalhas')).toBeInTheDocument()
    expect(within(reservations).getByText('Reservado por Marina')).toBeInTheDocument()
  })

  it('mostra a data e libera a reserva após confirmação', async () => {
    renderPage()

    await screen.findByText('Reservado por Marina')
    expect(screen.getByText('Em 4 de agosto')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Liberar Jogo de toalhas' }))
    expect(screen.getByRole('heading', { name: 'Liberar reserva' })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Liberar presente' }))

    expect(mocks.deleteAdminReservation).toHaveBeenCalledWith('gift-2')
    await waitFor(() => expect(mocks.refresh).toHaveBeenCalled())
    expect(await screen.findByRole('status')).toHaveTextContent(
      'Reserva liberada; o presente voltou a ficar disponível.',
    )
  })

  it('mantém a reserva aberta quando a liberação falha', async () => {
    mocks.deleteAdminReservation.mockRejectedValueOnce(new Error('indisponível'))
    renderPage()

    await screen.findByText('Reservado por Marina')
    fireEvent.click(screen.getByRole('button', { name: 'Liberar Jogo de toalhas' }))
    fireEvent.click(screen.getByRole('button', { name: 'Liberar presente' }))

    expect(await screen.findByRole('status')).toHaveTextContent(
      'Não foi possível liberar esta reserva. Tente novamente.',
    )
    expect(screen.getByRole('heading', { name: 'Liberar reserva' })).toBeInTheDocument()
    expect(
      within(screen.getByLabelText('Reservas da lista')).getByText('Jogo de toalhas'),
    ).toBeInTheDocument()
  })
})
