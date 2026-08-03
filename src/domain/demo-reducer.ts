import { selectAvailability } from '@/domain/selectors'
import type {
  DemoReservation,
  DemoState,
  EditableSiteSettings,
  ReserveGiftInput,
} from '@/domain/types'

export type DemoAction =
  | { type: 'reservation/submitted'; input: ReserveGiftInput }
  | { type: 'reservation/purchased'; token: string }
  | { type: 'reservation/cancelled'; token: string }
  | { type: 'reservation/received'; token: string }
  | { type: 'reservation/outcomeDismissed' }
  | { type: 'admin/unlocked' }
  | { type: 'admin/locked' }
  | { type: 'settings/updated'; settings: EditableSiteSettings }

function createReservation(state: DemoState, input: ReserveGiftInput): DemoState {
  const gift = state.gifts.find(({ code }) => code === input.itemCode)

  if (gift?.demoScenario === 'conflict') {
    return {
      ...state,
      reservationOutcome: { kind: 'conflict', itemCode: input.itemCode },
    }
  }

  const availability = selectAvailability(state, input.itemCode)
  const validQuantity =
    Number.isInteger(input.quantity) &&
    input.quantity >= 1 &&
    input.quantity <= (availability?.remainingQuantity ?? 0)

  if (!gift || !availability || !validQuantity) {
    return {
      ...state,
      reservationOutcome: { kind: 'unavailable', itemCode: input.itemCode },
    }
  }

  const token = `reserva-${input.itemCode.toLocaleLowerCase('pt-BR')}-${state.nextReservationNumber}`
  const reservation: DemoReservation = {
    token,
    itemCode: input.itemCode,
    firstName: input.firstName,
    ...(input.contact === undefined ? {} : { contact: input.contact }),
    quantity: input.quantity,
    status: 'reserved',
    source: 'web',
    createdAt: `2026-08-02T00:00:${String(state.nextReservationNumber).padStart(2, '0')}.000Z`,
  }

  return {
    ...state,
    reservations: [...state.reservations, reservation],
    nextReservationNumber: state.nextReservationNumber + 1,
    reservationOutcome: { kind: 'success', itemCode: input.itemCode, token },
  }
}

function transitionReservation(
  state: DemoState,
  token: string,
  nextStatus: 'purchased' | 'cancelled' | 'received',
): DemoState {
  const reservation = state.reservations.find((candidate) => candidate.token === token)

  if (!reservation || reservation.status === 'received' || reservation.status === 'cancelled') {
    return state
  }

  const allowed =
    (nextStatus === 'purchased' && reservation.status === 'reserved') ||
    (nextStatus === 'cancelled' &&
      (reservation.status === 'reserved' || reservation.status === 'purchased')) ||
    (nextStatus === 'received' &&
      (reservation.status === 'reserved' || reservation.status === 'purchased'))

  if (!allowed) return state

  return {
    ...state,
    reservations: state.reservations.map((candidate) =>
      candidate.token === token ? { ...candidate, status: nextStatus } : candidate,
    ),
  }
}

export function demoReducer(state: DemoState, action: DemoAction): DemoState {
  switch (action.type) {
    case 'reservation/submitted':
      return createReservation(state, action.input)
    case 'reservation/purchased':
      return transitionReservation(state, action.token, 'purchased')
    case 'reservation/cancelled':
      return transitionReservation(state, action.token, 'cancelled')
    case 'reservation/received':
      return transitionReservation(state, action.token, 'received')
    case 'reservation/outcomeDismissed':
      return state.reservationOutcome === null ? state : { ...state, reservationOutcome: null }
    case 'admin/unlocked':
      return state.adminUnlocked ? state : { ...state, adminUnlocked: true }
    case 'admin/locked':
      return state.adminUnlocked ? { ...state, adminUnlocked: false } : state
    case 'settings/updated':
      return {
        ...state,
        settings: { ...state.settings, ...action.settings },
      }
  }
}
