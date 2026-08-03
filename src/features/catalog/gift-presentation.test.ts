import { createInitialDemoState } from '@/data/initial-state'
import { selectAvailability } from '@/domain/selectors'
import { describe, expect, it } from 'vitest'
import { getGiftAvailabilityPresentation } from './gift-presentation'

describe('getGiftAvailabilityPresentation', () => {
  it.each([
    ['CZ-001', 'Disponível'],
    ['CZ-003', '1 de 2 disponíveis'],
    ['LV-001', 'Já foi escolhido'],
    ['BN-002', 'Já foi escolhido'],
  ])('apresenta %s como %s', (code, label) => {
    const availability = selectAvailability(createInitialDemoState(), code)

    expect(availability).toBeDefined()
    expect(getGiftAvailabilityPresentation(availability!).label).toBe(label)
  })
})
