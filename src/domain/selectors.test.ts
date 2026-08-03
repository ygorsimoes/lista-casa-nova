import { createInitialDemoState } from '@/data/initial-state'
import {
  selectAvailability,
  selectAdminSummary,
  selectCatalogEntries,
  selectCollectionBySlug,
  selectGiftByCode,
  selectReservationByToken,
} from '@/domain/selectors'
import { demoReducer } from '@/domain/demo-reducer'
import { describe, expect, it } from 'vitest'

describe('seletores do catálogo', () => {
  it('deriva o resumo administrativo a partir de disponibilidades e reservas', () => {
    const state = createInitialDemoState()

    expect(selectAdminSummary(state)).toEqual({
      availableItems: 8,
      reservedItems: 1,
      receivedItems: 2,
      activeReservations: 5,
    })
  })

  it('atualiza o resumo após cancelar ou receber uma reserva, sem totais gravados', () => {
    const state = createInitialDemoState()
    const cancelled = demoReducer(state, {
      type: 'reservation/cancelled',
      token: 'reserva-demo-valida',
    })
    const received = demoReducer(state, {
      type: 'reservation/received',
      token: 'reserva-demo-valida',
    })

    expect(selectAdminSummary(cancelled)).toEqual({
      availableItems: 9,
      reservedItems: 0,
      receivedItems: 2,
      activeReservations: 4,
    })
    expect(selectAdminSummary(received)).toEqual({
      availableItems: 8,
      reservedItems: 0,
      receivedItems: 3,
      activeReservations: 5,
    })
  })

  it('ignora acentos e caixa ao buscar preferências', () => {
    const result = selectCatalogEntries(createInitialDemoState(), {
      query: 'neutros',
      categorySlug: null,
      availableOnly: false,
    })

    expect(result.map(({ gift }) => gift.code)).toContain('CZ-001')
  })

  it('libera quantidade de reservas canceladas', () => {
    const state = createInitialDemoState()
    const cancelledReservation = {
      ...state.reservations[0],
      token: 'reserva-demo-cancelada',
      status: 'cancelled' as const,
    }
    const availability = selectAvailability(
      { ...state, reservations: [...state.reservations, cancelledReservation] },
      'CZ-003',
    )

    expect(availability).toMatchObject({
      desiredQuantity: 2,
      reservedQuantity: 1,
      purchasedQuantity: 0,
      receivedQuantity: 0,
      remainingQuantity: 1,
      canReserve: true,
      visualState: 'partially-reserved',
    })
  })

  it('combina busca, categoria e disponibilidade', () => {
    const result = selectCatalogEntries(createInitialDemoState(), {
      query: 'vidro',
      categorySlug: 'cozinha',
      availableOnly: true,
    })

    expect(result.map(({ gift }) => gift.code)).toEqual(['CZ-003'])
  })

  it('mantém a ordem das fixtures em uma consulta vazia', () => {
    const result = selectCatalogEntries(createInitialDemoState(), {
      query: '',
      categorySlug: null,
      availableOnly: false,
    })

    expect(result.map(({ gift }) => gift.code)).toEqual([
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
  })

  it('não retorna itens na categoria sem disponíveis quando o filtro está ativo', () => {
    const result = selectCatalogEntries(createInitialDemoState(), {
      query: '',
      categorySlug: 'decoracao',
      availableOnly: true,
    })

    expect(result).toEqual([])
  })

  it('deriva o estado recebido quando toda a quantidade foi recebida', () => {
    const availability = selectAvailability(createInitialDemoState(), 'BN-002')

    expect(availability).toMatchObject({
      desiredQuantity: 2,
      receivedQuantity: 2,
      remainingQuantity: 0,
      canReserve: false,
      visualState: 'received',
    })
  })

  it('retorna indefinido para identificadores inexistentes', () => {
    const state = createInitialDemoState()

    expect(selectAvailability(state, 'INEXISTENTE')).toBeUndefined()
    expect(selectGiftByCode(state, 'INEXISTENTE')).toBeUndefined()
    expect(selectReservationByToken(state, 'reserva-inexistente')).toBeUndefined()
    expect(selectCollectionBySlug(state, 'colecao-inexistente')).toBeUndefined()
  })

  it('associa o presente à categoria e localiza fixtures públicas', () => {
    const state = createInitialDemoState()

    expect(selectGiftByCode(state, 'QT-001')).toMatchObject({
      gift: { name: 'Jogo de cama queen' },
      category: { slug: 'quarto' },
    })
    expect(selectReservationByToken(state, 'reserva-demo-valida')).toMatchObject({
      itemCode: 'LV-001',
      status: 'reserved',
    })
    expect(selectCollectionBySlug(state, 'sugestoes-cozinha')).toMatchObject({
      categoryId: 'cozinha',
    })
  })

  it('não muta as fixtures ao calcular ou filtrar o catálogo', () => {
    const state = createInitialDemoState()
    const before = structuredClone(state)

    selectAvailability(state, 'CZ-003')
    selectCatalogEntries(state, {
      query: 'casa',
      categorySlug: null,
      availableOnly: false,
    })
    selectGiftByCode(state, 'CZ-001')

    expect(state).toEqual(before)
  })
})
