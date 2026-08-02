export type ReservationStatus = 'reserved' | 'purchased' | 'received' | 'cancelled'

export interface Category {
  id: string
  name: string
  slug: string
  icon: 'cooking-pot' | 'bed-double' | 'bath' | 'washing-machine' | 'lamp'
  sortOrder: number
}

export interface Suggestion {
  id: string
  label: string
  retailer: 'Shopee'
  url: string
  featured: boolean
}

export interface GiftItem {
  code: string
  categoryId: string
  name: string
  description: string
  preferences: readonly string[]
  desiredQuantity: number
  acceptsEquivalent: boolean
  demoScenario?: 'conflict'
  suggestions: readonly Suggestion[]
  sortOrder: number
}

export interface DemoReservation {
  token: string
  itemCode: string
  firstName: string
  contact?: string
  quantity: number
  status: ReservationStatus
  source: 'web' | 'paper' | 'admin'
  createdAt: string
}

export interface ShoppingCollection {
  title: string
  slug: string
  categoryId: string
  description: string
  url: string
}

export interface SiteSettings {
  title: string
  message: string
  howItWorks: string
  footer: string
  pix: {
    recipient: string
    institution: string
    copyAndPaste: string
  }
}

export type EditableSiteSettings = Pick<SiteSettings, 'title' | 'message' | 'footer'>

export interface ReserveGiftInput {
  itemCode: string
  firstName: string
  contact?: string
  quantity: number
}

export type ReservationOutcome =
  | { kind: 'success'; itemCode: string; token: string }
  | { kind: 'conflict'; itemCode: string }
  | { kind: 'unavailable'; itemCode: string }

export interface DemoState {
  categories: readonly Category[]
  gifts: readonly GiftItem[]
  collections: readonly ShoppingCollection[]
  reservations: readonly DemoReservation[]
  settings: SiteSettings
  nextReservationNumber: number
  reservationOutcome: ReservationOutcome | null
  adminUnlocked: boolean
}

export type GiftVisualState = 'available' | 'partially-reserved' | 'reserved' | 'received'

export interface GiftAvailability {
  desiredQuantity: number
  reservedQuantity: number
  purchasedQuantity: number
  receivedQuantity: number
  remainingQuantity: number
  canReserve: boolean
  visualState: GiftVisualState
}

export interface CatalogFilters {
  query: string
  categorySlug: string | null
  availableOnly: boolean
}

export interface CatalogEntry {
  gift: GiftItem
  category: Category
  availability: GiftAvailability
}
