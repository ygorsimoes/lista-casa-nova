export interface Gift {
  id: string
  name: string
  imageUrl: string | null
  color: string | null
  description: string | null
  preferences: string[]
  referenceValue: number | null
  referenceUrl: string | null
  sortOrder: number
}

export type ReserveResult =
  | { kind: 'reserved' }
  | { kind: 'already-reserved' }
  | { kind: 'unavailable' }
  | { kind: 'failure' }

export interface AdminReservation {
  giftId: string
  guestName: string
  createdAt: string
}

export function mapGift(row: {
  id: string
  name: string
  image_url: string | null
  color: string | null
  description: string | null
  preferences: string[]
  reference_value: number | null
  reference_url: string | null
  sort_order: number
}): Gift {
  return {
    id: row.id,
    name: row.name,
    imageUrl: row.image_url,
    color: row.color,
    description: row.description,
    preferences: row.preferences,
    referenceValue: row.reference_value,
    referenceUrl: row.reference_url,
    sortOrder: row.sort_order,
  }
}
