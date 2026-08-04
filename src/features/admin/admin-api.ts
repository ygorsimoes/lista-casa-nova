import type { AdminReservation } from '@/domain/gifts'
import { getSupabaseClient } from '@/lib/supabase'

export interface AdminGiftInput {
  name: string
  imageUrl: string
  color: string
  description: string
  preferences: string
  referenceValue: string
  referenceUrl: string
  sortOrder: number
}

function optionalText(value: string) {
  return value.trim() || null
}

function toGiftRow(input: AdminGiftInput) {
  const referenceValue = input.referenceValue.trim()
  return {
    name: input.name.trim(),
    image_url: optionalText(input.imageUrl),
    color: optionalText(input.color),
    description: optionalText(input.description),
    preferences: input.preferences
      .split(',')
      .map((preference) => preference.trim())
      .filter(Boolean),
    reference_value: referenceValue ? Number(referenceValue) : null,
    reference_url: optionalText(input.referenceUrl),
    sort_order: input.sortOrder,
  }
}

export async function fetchAdminReservations(): Promise<AdminReservation[]> {
  const { data, error } = await getSupabaseClient()
    .from('reservations')
    .select('gift_id,guest_name,created_at')
    .order('created_at')
  if (error) throw error
  return data.map((reservation) => ({
    giftId: reservation.gift_id,
    guestName: reservation.guest_name,
    createdAt: reservation.created_at,
  }))
}

export async function createAdminGift(input: AdminGiftInput) {
  const { error } = await getSupabaseClient().from('gifts').insert(toGiftRow(input))
  if (error) throw error
}

export async function updateAdminGift(id: string, input: AdminGiftInput) {
  const { error } = await getSupabaseClient().from('gifts').update(toGiftRow(input)).eq('id', id)
  if (error) throw error
}

export async function deleteAdminGift(id: string) {
  const { error } = await getSupabaseClient().from('gifts').delete().eq('id', id)
  if (error) throw error
}
