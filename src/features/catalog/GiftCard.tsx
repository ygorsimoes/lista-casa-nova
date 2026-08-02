import { useDemoSelector } from '@/app/DemoStateProvider'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { selectGiftByCode } from '@/domain/selectors'
import type { CatalogEntry, GiftVisualState } from '@/domain/types'
import { Bath, BedDouble, CookingPot, Lamp, WashingMachine } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'

const categoryIcons = {
  'cooking-pot': CookingPot,
  'bed-double': BedDouble,
  bath: Bath,
  'washing-machine': WashingMachine,
  lamp: Lamp,
}

function getAvailabilityLabel(entry: CatalogEntry) {
  const { availability } = entry
  if (availability.visualState === 'available') return 'Disponível'
  if (availability.visualState === 'partially-reserved') {
    return `${availability.remainingQuantity} de ${availability.desiredQuantity} disponíveis`
  }
  if (availability.visualState === 'received') return 'Presente recebido'
  return 'Indisponível'
}

function getBadgeTone(visualState: GiftVisualState) {
  if (visualState === 'available' || visualState === 'partially-reserved') return 'available'
  if (visualState === 'received') return 'received'
  return 'reserved'
}

export interface GiftCardProps {
  code: string
}

export function GiftCard({ code }: GiftCardProps) {
  const entry = useDemoSelector((state) => selectGiftByCode(state, code))
  const location = useLocation()
  const navigate = useNavigate()

  if (!entry) return null

  const Icon = categoryIcons[entry.category.icon]
  const canReserve = entry.availability.canReserve
  const actionLabel = canReserve ? 'Quero dar este presente' : 'Ver detalhes'

  return (
    <Card className="gift-card">
      <article>
        <div className="gift-card__icon" aria-hidden="true">
          <Icon size={48} strokeWidth={1.55} />
        </div>
        <div className="gift-card__content">
          <p className="gift-card__category">{entry.category.name}</p>
          <h2>{entry.gift.name}</h2>
          <Badge tone={getBadgeTone(entry.availability.visualState)}>
            {getAvailabilityLabel(entry)}
          </Badge>
          <p className="gift-card__preference">{entry.gift.preferences[0]}</p>
        </div>
        <div className="gift-card__action">
          <Button
            variant={canReserve ? 'primary' : 'secondary'}
            onClick={() =>
              navigate(`/item/${entry.gift.code}`, {
                state: { backgroundLocation: location },
              })
            }
            aria-label={`${actionLabel}: ${entry.gift.name}`}
          >
            {actionLabel}
          </Button>
        </div>
      </article>
    </Card>
  )
}
