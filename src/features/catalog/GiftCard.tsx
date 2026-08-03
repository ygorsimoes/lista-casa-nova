import { useDemoSelector } from '@/app/DemoStateProvider'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { selectGiftByCode } from '@/domain/selectors'
import { Bath, BedDouble, CookingPot, Lamp, WashingMachine } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router'
import { getGiftAvailabilityPresentation } from './gift-presentation'

const categoryIcons = {
  'cooking-pot': CookingPot,
  'bed-double': BedDouble,
  bath: Bath,
  'washing-machine': WashingMachine,
  lamp: Lamp,
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
  const availabilityPresentation = getGiftAvailabilityPresentation(entry.availability)

  return (
    <Card className="gift-card">
      <article>
        <div className="gift-card__icon" aria-hidden="true">
          <Icon size={48} strokeWidth={1.55} />
        </div>
        <div className="gift-card__content">
          <p className="gift-card__category">{entry.category.name}</p>
          <h2>{entry.gift.name}</h2>
          <Badge tone={availabilityPresentation.tone}>{availabilityPresentation.label}</Badge>
          <p className="gift-card__preference">{entry.gift.preferences[0]}</p>
        </div>
        <div className="gift-card__action">
          <Button
            id={`gift-card-action-${entry.gift.code}`}
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
