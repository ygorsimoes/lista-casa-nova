import { describe, expect, it, vi } from 'vitest'

const insert = vi.fn()
const update = vi.fn()
const remove = vi.fn()
const eq = vi.fn()
const from = vi.fn(() => ({ insert, update, delete: remove, eq }))

vi.mock('@/lib/supabase', () => ({
  getSupabaseClient: () => ({ from }),
}))

import {
  createAdminGift,
  deleteAdminGift,
  deleteAdminReservation,
  updateAdminGift,
} from './admin-api'

describe('admin-api', () => {
  it('cria um presente normalizando os campos opcionais', async () => {
    insert.mockResolvedValueOnce({ error: null })

    await createAdminGift({
      name: '  Jogo de taças  ',
      imageUrl: ' ',
      color: '  Âmbar ',
      description: '',
      preferences: ' vidro, artesanal , ',
      referenceValue: '',
      referenceUrl: ' ',
      sortOrder: 8,
    })

    expect(from).toHaveBeenCalledWith('gifts')
    expect(insert).toHaveBeenCalledWith({
      name: 'Jogo de taças',
      image_url: null,
      color: 'Âmbar',
      description: null,
      preferences: ['vidro', 'artesanal'],
      reference_value: null,
      reference_url: null,
      sort_order: 8,
    })
  })

  it('atualiza o presente indicado', async () => {
    const updateEq = vi.fn().mockResolvedValueOnce({ error: null })
    update.mockReturnValueOnce({ eq: updateEq })

    await updateAdminGift('gift-1', {
      name: 'Tapete',
      imageUrl: '',
      color: '',
      description: '',
      preferences: '',
      referenceValue: '149.90',
      referenceUrl: '',
      sortOrder: 4,
    })

    expect(update).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'Tapete', reference_value: 149.9 }),
    )
    expect(updateEq).toHaveBeenCalledWith('id', 'gift-1')
  })

  it('remove o presente indicado', async () => {
    const deleteEq = vi.fn().mockResolvedValueOnce({ error: null })
    remove.mockReturnValueOnce({ eq: deleteEq })

    await deleteAdminGift('gift-1')

    expect(from).toHaveBeenCalledWith('gifts')
    expect(deleteEq).toHaveBeenCalledWith('id', 'gift-1')
  })

  it('libera a reserva do presente indicado', async () => {
    const deleteEq = vi.fn().mockResolvedValueOnce({ error: null })
    remove.mockReturnValueOnce({ eq: deleteEq })

    await deleteAdminReservation('gift-2')

    expect(from).toHaveBeenCalledWith('reservations')
    expect(deleteEq).toHaveBeenCalledWith('gift_id', 'gift-2')
  })
})
