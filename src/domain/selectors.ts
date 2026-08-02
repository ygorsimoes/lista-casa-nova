import type {
  CatalogEntry,
  CatalogFilters,
  DemoReservation,
  DemoState,
  GiftAvailability,
  GiftItem,
  GiftVisualState,
  ReservationStatus,
  ShoppingCollection,
} from '@/domain/types'

const consumingStatuses = new Set<ReservationStatus>(['reserved', 'purchased', 'received'])

export function normalizeSearch(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLocaleLowerCase('pt-BR')
}

function selectVisualState(
  desiredQuantity: number,
  remainingQuantity: number,
  receivedQuantity: number,
): GiftVisualState {
  if (remainingQuantity === desiredQuantity) return 'available'
  if (remainingQuantity === 0 && receivedQuantity > 0) return 'received'
  if (remainingQuantity === 0) return 'reserved'
  return 'partially-reserved'
}

function matchesSearch(gift: GiftItem, query: string) {
  if (query === '') return true

  return [gift.name, gift.description, ...gift.preferences]
    .map(normalizeSearch)
    .some((value) => value.includes(query))
}

export function selectAvailability(
  state: DemoState,
  itemCode: string,
): GiftAvailability | undefined {
  const gift = state.gifts.find(({ code }) => code === itemCode)

  if (!gift) return undefined

  const quantities = state.reservations.reduce(
    (totals, reservation) => {
      if (reservation.itemCode !== itemCode || !consumingStatuses.has(reservation.status)) {
        return totals
      }

      if (reservation.status === 'reserved') totals.reservedQuantity += reservation.quantity
      if (reservation.status === 'purchased') totals.purchasedQuantity += reservation.quantity
      if (reservation.status === 'received') totals.receivedQuantity += reservation.quantity
      return totals
    },
    { reservedQuantity: 0, purchasedQuantity: 0, receivedQuantity: 0 },
  )
  const activeReservationsQuantity =
    quantities.reservedQuantity + quantities.purchasedQuantity + quantities.receivedQuantity
  const remainingQuantity = Math.max(0, gift.desiredQuantity - activeReservationsQuantity)

  return {
    desiredQuantity: gift.desiredQuantity,
    ...quantities,
    remainingQuantity,
    canReserve: remainingQuantity > 0,
    visualState: selectVisualState(
      gift.desiredQuantity,
      remainingQuantity,
      quantities.receivedQuantity,
    ),
  }
}

export function selectCatalogEntries(
  state: DemoState,
  filters: CatalogFilters,
): readonly CatalogEntry[] {
  const query = normalizeSearch(filters.query)
  const entries: CatalogEntry[] = []

  for (const gift of state.gifts) {
    const category = state.categories.find(({ id }) => id === gift.categoryId)
    const availability = selectAvailability(state, gift.code)

    if (!category || !availability || !matchesSearch(gift, query)) continue
    if (filters.categorySlug !== null && category.slug !== filters.categorySlug) continue
    if (filters.availableOnly && !availability.canReserve) continue

    entries.push({ gift, category, availability })
  }

  return entries
}

export function selectGiftByCode(state: DemoState, code: string): CatalogEntry | undefined {
  return selectCatalogEntries(state, {
    query: '',
    categorySlug: null,
    availableOnly: false,
  }).find((entry) => entry.gift.code === code)
}

export function selectReservationByToken(
  state: DemoState,
  token: string,
): DemoReservation | undefined {
  return state.reservations.find((reservation) => reservation.token === token)
}

export function selectCollectionBySlug(
  state: DemoState,
  slug: string,
): ShoppingCollection | undefined {
  return state.collections.find((collection) => collection.slug === slug)
}
