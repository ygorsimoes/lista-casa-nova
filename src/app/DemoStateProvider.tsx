import { createInitialDemoState } from '@/data/initial-state'
import { demoReducer } from '@/domain/demo-reducer'
import type { DemoState, EditableSiteSettings, ReserveGiftInput } from '@/domain/types'
import { createContext, useContext, useMemo, useReducer, type PropsWithChildren } from 'react'

export interface DemoActions {
  reserveGift(input: ReserveGiftInput): void
  markReservationPurchased(token: string): void
  cancelReservation(token: string): void
  markReservationReceived(token: string): void
  dismissReservationOutcome(): void
  unlockAdmin(): void
  lockAdmin(): void
  updateSiteSettings(settings: EditableSiteSettings): void
}

const DemoStateContext = createContext<DemoState | null>(null)
const DemoActionsContext = createContext<DemoActions | null>(null)

export function DemoStateProvider({ children }: PropsWithChildren) {
  const [state, dispatch] = useReducer(demoReducer, undefined, createInitialDemoState)
  const actions = useMemo<DemoActions>(
    () => ({
      reserveGift: (input) => dispatch({ type: 'reservation/submitted', input }),
      markReservationPurchased: (token) => dispatch({ type: 'reservation/purchased', token }),
      cancelReservation: (token) => dispatch({ type: 'reservation/cancelled', token }),
      markReservationReceived: (token) => dispatch({ type: 'reservation/received', token }),
      dismissReservationOutcome: () => dispatch({ type: 'reservation/outcomeDismissed' }),
      unlockAdmin: () => dispatch({ type: 'admin/unlocked' }),
      lockAdmin: () => dispatch({ type: 'admin/locked' }),
      updateSiteSettings: (settings) => dispatch({ type: 'settings/updated', settings }),
    }),
    [dispatch],
  )

  return (
    <DemoStateContext value={state}>
      <DemoActionsContext value={actions}>{children}</DemoActionsContext>
    </DemoStateContext>
  )
}

// O contrato público do provider exige este hook no mesmo módulo.
// eslint-disable-next-line react-refresh/only-export-components
export function useDemoSelector<T>(selector: (state: DemoState) => T): T {
  const state = useContext(DemoStateContext)

  if (state === null) {
    throw new Error('useDemoSelector deve ser usado dentro de DemoStateProvider.')
  }

  return selector(state)
}

// O contrato público do provider exige este hook no mesmo módulo.
// eslint-disable-next-line react-refresh/only-export-components
export function useDemoActions(): DemoActions {
  const actions = useContext(DemoActionsContext)

  if (actions === null) {
    throw new Error('useDemoActions deve ser usado dentro de DemoStateProvider.')
  }

  return actions
}
