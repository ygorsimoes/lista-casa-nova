import type { GiftAvailability } from '@/domain/types'

export interface GiftAvailabilityPresentation {
  label: string
  tone: 'available' | 'reserved' | 'received'
}

export function getGiftAvailabilityPresentation(
  availability: GiftAvailability,
): GiftAvailabilityPresentation {
  if (availability.visualState === 'available') {
    return { label: 'Disponível', tone: 'available' }
  }
  if (availability.visualState === 'partially-reserved') {
    return {
      label: `${availability.remainingQuantity} de ${availability.desiredQuantity} disponíveis`,
      tone: 'available',
    }
  }
  if (availability.visualState === 'received') {
    return { label: 'Presente recebido', tone: 'received' }
  }
  return { label: 'Indisponível', tone: 'reserved' }
}
