import { createInitialDemoState } from '@/data/initial-state'
import { demoReducer } from '@/domain/demo-reducer'
import { selectAvailability } from '@/domain/selectors'
import { describe, expect, it } from 'vitest'

describe('demoReducer', () => {
  it('cria uma reserva e reduz a disponibilidade', () => {
    const before = createInitialDemoState()
    const after = demoReducer(before, {
      type: 'reservation/submitted',
      input: { itemCode: 'CZ-001', firstName: 'Nina', quantity: 1 },
    })

    expect(after.reservationOutcome).toEqual({
      kind: 'success',
      itemCode: 'CZ-001',
      token: 'reserva-cz-001-1',
    })
    expect(selectAvailability(after, 'CZ-001')?.remainingQuantity).toBe(0)
    expect(after.reservations).toHaveLength(6)
    expect(before.reservations).toHaveLength(5)
    expect(after.reservations.at(-1)).toMatchObject({
      token: 'reserva-cz-001-1',
      itemCode: 'CZ-001',
      firstName: 'Nina',
      quantity: 1,
      status: 'reserved',
      source: 'web',
    })
  })

  it('preserva as reservas ao simular conflito', () => {
    const before = createInitialDemoState()
    const after = demoReducer(before, {
      type: 'reservation/submitted',
      input: { itemCode: 'CZ-004', firstName: 'Nina', quantity: 1 },
    })

    expect(after.reservations).toBe(before.reservations)
    expect(after.nextReservationNumber).toBe(before.nextReservationNumber)
    expect(after.reservationOutcome).toEqual({
      kind: 'conflict',
      itemCode: 'CZ-004',
    })
  })

  it.each([0, -1, 1.5, Number.NaN, 2])(
    'recusa quantidade inválida (%s) sem criar reserva',
    (quantity) => {
      const before = createInitialDemoState()
      const after = demoReducer(before, {
        type: 'reservation/submitted',
        input: { itemCode: 'CZ-001', firstName: 'Nina', quantity },
      })

      expect(after.reservations).toBe(before.reservations)
      expect(after.reservationOutcome).toEqual({
        kind: 'unavailable',
        itemCode: 'CZ-001',
      })
    },
  )

  it('recusa reservas para item inexistente ou indisponível', () => {
    const before = createInitialDemoState()
    const unavailable = demoReducer(before, {
      type: 'reservation/submitted',
      input: { itemCode: 'LV-001', firstName: 'Nina', quantity: 1 },
    })
    const unknown = demoReducer(before, {
      type: 'reservation/submitted',
      input: { itemCode: 'INEXISTENTE', firstName: 'Nina', quantity: 1 },
    })

    expect(unavailable.reservationOutcome).toEqual({
      kind: 'unavailable',
      itemCode: 'LV-001',
    })
    expect(unknown.reservationOutcome).toEqual({
      kind: 'unavailable',
      itemCode: 'INEXISTENTE',
    })
    expect(unavailable.reservations).toBe(before.reservations)
    expect(unknown.reservations).toBe(before.reservations)
  })

  it('altera somente a reserva alvo nas transições permitidas', () => {
    const before = createInitialDemoState()
    const purchased = demoReducer(before, {
      type: 'reservation/purchased',
      token: 'reserva-demo-valida',
    })
    const received = demoReducer(purchased, {
      type: 'reservation/received',
      token: 'reserva-demo-valida',
    })
    const targetIndex = before.reservations.findIndex(
      ({ token }) => token === 'reserva-demo-valida',
    )

    expect(purchased.reservations[targetIndex]).toMatchObject({ status: 'purchased' })
    expect(received.reservations[targetIndex]).toMatchObject({ status: 'received' })
    expect(received.reservations.filter((_, index) => index !== targetIndex)).toEqual(
      before.reservations.filter((_, index) => index !== targetIndex),
    )
  })

  it('cancela uma reserva e libera sua disponibilidade', () => {
    const before = createInitialDemoState()
    const after = demoReducer(before, {
      type: 'reservation/cancelled',
      token: 'reserva-demo-valida',
    })

    expect(after.reservations.find(({ token }) => token === 'reserva-demo-valida')).toMatchObject({
      status: 'cancelled',
    })
    expect(selectAvailability(after, 'LV-001')?.remainingQuantity).toBe(1)
  })

  it('ignora transições terminais ou não permitidas', () => {
    const before = createInitialDemoState()
    const received = demoReducer(before, {
      type: 'reservation/received',
      token: 'reserva-demo-lia',
    })
    const cancelled = demoReducer(before, {
      type: 'reservation/cancelled',
      token: 'reserva-demo-bia',
    })
    const unknown = demoReducer(before, {
      type: 'reservation/purchased',
      token: 'reserva-inexistente',
    })

    expect(received).toBe(before)
    expect(cancelled).toBe(before)
    expect(unknown).toBe(before)
  })

  it('limpa o resultado, alterna o acesso administrativo e atualiza apenas ajustes editáveis', () => {
    const before = createInitialDemoState()
    const withOutcome = demoReducer(before, {
      type: 'reservation/submitted',
      input: { itemCode: 'CZ-004', firstName: 'Nina', quantity: 1 },
    })
    const dismissed = demoReducer(withOutcome, { type: 'reservation/outcomeDismissed' })
    const unlocked = demoReducer(dismissed, { type: 'admin/unlocked' })
    const locked = demoReducer(unlocked, { type: 'admin/locked' })
    const updated = demoReducer(locked, {
      type: 'settings/updated',
      settings: {
        title: 'Nosso novo lar',
        message: 'Uma mensagem demonstrativa atualizada.',
        footer: 'Com carinho.',
      },
    })

    expect(dismissed.reservationOutcome).toBeNull()
    expect(unlocked.adminUnlocked).toBe(true)
    expect(locked.adminUnlocked).toBe(false)
    expect(updated.settings).toEqual({
      ...before.settings,
      title: 'Nosso novo lar',
      message: 'Uma mensagem demonstrativa atualizada.',
      footer: 'Com carinho.',
    })
    expect(updated.settings.pix).toBe(before.settings.pix)
  })
})
