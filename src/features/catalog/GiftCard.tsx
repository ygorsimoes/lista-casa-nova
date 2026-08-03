import { useDemoSelector } from '@/app/DemoStateProvider'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { selectGiftByCode } from '@/domain/selectors'
import { cn } from '@/lib/cn'
import { ChevronRight } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router'
import { GiftVisual } from './GiftVisual'
import { getGiftAvailabilityPresentation } from './gift-presentation'

export interface GiftCardProps {
  code: string
}

export function GiftCard({ code }: GiftCardProps) {
  const entry = useDemoSelector((state) => selectGiftByCode(state, code))
  const location = useLocation()
  const navigate = useNavigate()

  if (!entry) return null

  const canReserve = entry.availability.canReserve
  const availabilityPresentation = getGiftAvailabilityPresentation(entry.availability)

  return (
    <Card variant="flat" className={cn('gift-card', !canReserve && 'gift-card--chosen')}>
      <article>
        <GiftVisual itemCode={entry.gift.code} categoryIcon={entry.category.icon} />
        <div className="gift-card__content">
          <p className="gift-card__category">{entry.category.name}</p>
          <h3>{entry.gift.name}</h3>
          <p className="gift-card__preference">{entry.gift.preferences.slice(0, 2).join(' · ')}</p>
          <p className="gift-card__status">{availabilityPresentation.label}</p>
        </div>
        <Button
          id={`gift-card-action-${entry.gift.code}`}
          className="gift-card__open"
          variant="ghost"
          onClick={() =>
            navigate(`/item/${entry.gift.code}`, {
              state: { backgroundLocation: location },
            })
          }
          aria-label={`Ver ${entry.gift.name}`}
        >
          Ver
          <ChevronRight aria-hidden="true" size={18} />
        </Button>
      </article>
    </Card>
  )
}
