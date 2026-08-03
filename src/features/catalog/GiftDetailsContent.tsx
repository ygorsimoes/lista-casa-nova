import { useDemoActions, useDemoSelector } from '@/app/DemoStateProvider'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { useToast } from '@/components/ui/Toast'
import type { CatalogEntry } from '@/domain/types'
import { Bath, BedDouble, CookingPot, Lamp, WashingMachine } from 'lucide-react'
import { useState } from 'react'
import { ReservationForm } from '../reservations/ReservationForm'
import { ReservationOutcome } from '../reservations/ReservationOutcome'
import { getGiftAvailabilityPresentation } from './gift-presentation'

export interface GiftDetailsContentProps {
  entry: CatalogEntry
  headingLevel?: 'h1' | 'h2'
}

const categoryIcons = {
  'cooking-pot': CookingPot,
  'bed-double': BedDouble,
  bath: Bath,
  'washing-machine': WashingMachine,
  lamp: Lamp,
}

export function GiftDetailsContent({ entry, headingLevel = 'h1' }: GiftDetailsContentProps) {
  const Heading = headingLevel
  const CategoryIcon = categoryIcons[entry.category.icon]
  const { dismissReservationOutcome } = useDemoActions()
  const { showToast } = useToast()
  const outcome = useDemoSelector((state) => state.reservationOutcome)
  const [formOpen, setFormOpen] = useState(false)
  const [suggestionNotice, setSuggestionNotice] = useState(false)
  const availabilityPresentation = getGiftAvailabilityPresentation(entry.availability)
  const matchingOutcome = outcome?.itemCode === entry.gift.code ? outcome : null

  function openForm() {
    dismissReservationOutcome()
    setFormOpen(true)
  }

  function closeForm() {
    dismissReservationOutcome()
    setFormOpen(false)
  }

  function showSuggestion() {
    setSuggestionNotice(true)
    showToast({ title: 'Demonstração: nenhum site externo foi aberto.' })
  }

  return (
    <div className="gift-details-content">
      <section className="gift-details" aria-labelledby="gift-details-title">
        <div className="gift-details__overview">
          <div className="gift-details__icon" aria-hidden="true">
            <CategoryIcon size={104} strokeWidth={1.45} />
          </div>
          <div>
            <p className="gift-details__category">{entry.category.name}</p>
            <Heading id="gift-details-title" tabIndex={-1}>
              {entry.gift.name}
            </Heading>
            <Badge tone={availabilityPresentation.tone}>{availabilityPresentation.label}</Badge>
          </div>
        </div>
        <div className="gift-details__preference">
          <h3>Nossa preferência</h3>
          <p>{entry.gift.preferences.join(', ')}</p>
        </div>
        <p className="gift-details__description">{entry.gift.description}</p>
        <p className="gift-details__equivalent">
          {entry.gift.acceptsEquivalent
            ? 'Aceitamos um produto equivalente que respeite estas preferências.'
            : 'Preferimos este presente conforme as preferências indicadas.'}
        </p>
        <div className="gift-details__suggestions" aria-label="Sugestões demonstrativas">
          {entry.gift.suggestions.map((suggestion) => (
            <Button key={suggestion.id} variant="ghost" onClick={showSuggestion}>
              Ver sugestão: {suggestion.label}
            </Button>
          ))}
        </div>
        {suggestionNotice ? (
          <p className="gift-details__notice" role="status">
            Demonstração: nenhum site externo foi aberto.
          </p>
        ) : null}
        {entry.availability.canReserve ? (
          <Button className="gift-details__reserve" fullWidth onClick={openForm}>
            Quero dar este presente
          </Button>
        ) : matchingOutcome?.kind === 'success' ? null : (
          <p className="gift-details__unavailable">
            Este presente não está mais disponível para reserva.
          </p>
        )}
      </section>

      {formOpen && matchingOutcome?.kind !== 'success' ? (
        <ReservationForm
          itemCode={entry.gift.code}
          availableQuantity={entry.availability.remainingQuantity}
          onClose={closeForm}
        />
      ) : null}
      {matchingOutcome ? <ReservationOutcome outcome={matchingOutcome} /> : null}
    </div>
  )
}
