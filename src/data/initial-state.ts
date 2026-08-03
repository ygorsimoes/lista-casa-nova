import { catalog, categories } from '@/data/catalog'
import { collections } from '@/data/collections'
import { reservations } from '@/data/reservations'
import { settings } from '@/data/settings'
import type { DemoState } from '@/domain/types'

export function createInitialDemoState(): DemoState {
  return {
    categories: categories.map((category) => ({ ...category })),
    gifts: catalog.map((gift) => ({
      ...gift,
      preferences: [...gift.preferences],
      suggestions: gift.suggestions.map((suggestion) => ({ ...suggestion })),
    })),
    collections: collections.map((collection) => ({ ...collection })),
    reservations: reservations.map((reservation) => ({ ...reservation })),
    settings: { ...settings, pix: { ...settings.pix } },
    nextReservationNumber: 1,
    reservationOutcome: null,
    adminUnlocked: false,
  }
}
