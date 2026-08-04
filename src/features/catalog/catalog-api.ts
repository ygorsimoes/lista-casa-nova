import type { Gift, ReserveResult } from '@/domain/gifts'
import { mapGift } from '@/domain/gifts'
import { getPublicSupabaseClient } from '@/lib/supabase'

export async function fetchGifts(): Promise<Gift[]> {
  const { data, error } = await getPublicSupabaseClient()
    .from('gifts')
    .select('id,name,image_url,color,description,preferences,reference_value,reference_url,sort_order')
    .order('sort_order')

  if (error) throw error
  return data.map(mapGift)
}

export async function fetchReservedGiftIds(): Promise<Set<string>> {
  const { data, error } = await getPublicSupabaseClient().from('reservations').select('gift_id')
  if (error) throw error
  return new Set(data.map((reservation) => reservation.gift_id))
}

export async function reserveGift(giftId: string, guestName: string): Promise<ReserveResult> {
  const { error } = await getPublicSupabaseClient()
    .from('reservations')
    .insert({ gift_id: giftId, guest_name: guestName.trim() })

  if (!error) return { kind: 'reserved' }
  if (error.code === '23505') return { kind: 'already-reserved' }
  if (error.code === '23503') return { kind: 'unavailable' }
  return { kind: 'failure' }
}
