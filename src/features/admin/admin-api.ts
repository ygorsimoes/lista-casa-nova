import type { AdminReservation } from '@/domain/gifts'
import { getSupabaseClient } from '@/lib/supabase'

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
