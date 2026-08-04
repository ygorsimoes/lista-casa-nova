import { describe, expect, it, vi } from 'vitest'

const insert = vi.fn()
const from = vi.fn(() => ({ insert }))
const publicFrom = vi.fn(() => ({ insert }))

vi.mock('@/lib/supabase', () => ({
  getSupabaseClient: () => ({ from }),
  getPublicSupabaseClient: () => ({ from: publicFrom }),
}))

import { reserveGift } from './catalog-api'

describe('reserveGift', () => {
  it('confirma uma reserva persistida', async () => {
    insert.mockResolvedValueOnce({ error: null })
    await expect(reserveGift('gift-1', ' Ana ')).resolves.toEqual({ kind: 'reserved' })
    expect(publicFrom).toHaveBeenCalledWith('reservations')
    expect(insert).toHaveBeenCalledWith({ gift_id: 'gift-1', guest_name: 'Ana' })
  })

  it('traduz conflito de unicidade para uma mensagem de produto', async () => {
    insert.mockResolvedValueOnce({ error: { code: '23505' } })
    await expect(reserveGift('gift-1', 'Bia')).resolves.toEqual({ kind: 'already-reserved' })
  })
})
