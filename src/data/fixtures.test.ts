import { createInitialDemoState } from '@/data/initial-state'
import { describe, expect, it } from 'vitest'

describe('fixtures do catálogo', () => {
  it('mantém identificadores e URLs demonstrativos seguros', () => {
    const state = createInitialDemoState()

    expect(new Set(state.gifts.map(({ code }) => code)).size).toBe(state.gifts.length)
    expect(
      state.gifts
        .flatMap(({ suggestions }) => suggestions)
        .every(({ url }) => new URL(url).hostname.endsWith('.invalid')),
    ).toBe(true)
    expect(state.collections.every(({ url }) => new URL(url).hostname.endsWith('.invalid'))).toBe(
      true,
    )
  })

  it('fornece as categorias e itens demonstrativos na ordem planejada', () => {
    const state = createInitialDemoState()

    expect(state.categories.map(({ slug }) => slug)).toEqual([
      'cozinha',
      'quarto',
      'banheiro',
      'lavanderia',
      'decoracao',
    ])
    expect(state.gifts.map(({ code }) => code)).toEqual([
      'CZ-001',
      'CZ-002',
      'CZ-003',
      'CZ-004',
      'QT-001',
      'QT-002',
      'BN-001',
      'BN-002',
      'LV-001',
      'LV-002',
      'DC-001',
    ])
    expect(state.gifts.find(({ code }) => code === 'BN-001')?.suggestions).toHaveLength(2)
  })

  it('inicializa configurações e estado transitório de demonstração', () => {
    const state = createInitialDemoState()

    expect(state.settings).toMatchObject({
      title: 'Lista da nossa casa nova',
      message: 'Escolha com carinho algo que você já imaginou para o nosso lar.',
      footer: 'Obrigado por celebrar este momento com a gente.',
      pix: { recipient: 'Marina e Rafael — demonstração', institution: 'Banco Fictício' },
    })
    expect(state).toMatchObject({
      nextReservationNumber: 1,
      reservationOutcome: null,
      adminUnlocked: false,
    })
  })

  it('cria novas coleções de dados a cada chamada', () => {
    const first = createInitialDemoState()
    const second = createInitialDemoState()

    expect(second).toEqual(first)
    expect(second).not.toBe(first)
    expect(second.gifts).not.toBe(first.gifts)
    expect(second.gifts[0]).not.toBe(first.gifts[0])
    expect(second.gifts[0].suggestions).not.toBe(first.gifts[0].suggestions)
    expect(second.settings).not.toBe(first.settings)
    expect(second.settings.pix).not.toBe(first.settings.pix)
    expect(second.reservations).not.toBe(first.reservations)
  })
})
