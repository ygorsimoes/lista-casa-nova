import { useDemoActions, useDemoSelector } from '@/app/DemoStateProvider'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Notice } from '@/components/ui/Notice'
import type { CatalogEntry, ReserveGiftInput } from '@/domain/types'
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'
import { ReservationForm } from '../reservations/ReservationForm'
import { ReservationOutcome } from '../reservations/ReservationOutcome'
import { createReservationFormValues } from '../reservations/reservation-validation'
import { GiftVisual } from './GiftVisual'
import { getGiftAvailabilityPresentation } from './gift-presentation'

export interface GiftDetailsContentProps {
  entry: CatalogEntry
  headingLevel?: 'h1' | 'h2'
}

type GiftDetailsPhase = 'detail' | 'reservation' | 'confirmation'

export function GiftDetailsContent({ entry, headingLevel = 'h1' }: GiftDetailsContentProps) {
  const Heading = headingLevel
  const { dismissReservationOutcome, reserveGift } = useDemoActions()
  const [phase, setPhase] = useState<GiftDetailsPhase>('detail')
  const [draft, setDraft] = useState(createReservationFormValues)
  const [contactExpanded, setContactExpanded] = useState(false)
  const [awaitingOutcome, setAwaitingOutcome] = useState(false)
  const [suggestionNotice, setSuggestionNotice] = useState(false)
  const confirmationHeadingRef = useRef<HTMLHeadingElement>(null)
  const issueNoticeRef = useRef<HTMLDivElement>(null)
  const outcome = useDemoSelector((state) => state.reservationOutcome)
  const matchingOutcome = outcome?.itemCode === entry.gift.code ? outcome : null
  const availabilityPresentation = getGiftAvailabilityPresentation(entry.availability)
  const suggestion = entry.gift.suggestions[0]

  useEffect(() => {
    if (!awaitingOutcome || !matchingOutcome) return
    // A resposta do reducer global conclui a submissão iniciada por este componente.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAwaitingOutcome(false)
    if (matchingOutcome.kind === 'success') {
      setPhase('confirmation')
      return
    }
    issueNoticeRef.current?.focus()
  }, [awaitingOutcome, matchingOutcome])

  useEffect(() => {
    if (phase === 'confirmation') confirmationHeadingRef.current?.focus()
  }, [phase])

  useEffect(
    () => () => {
      dismissReservationOutcome()
    },
    [dismissReservationOutcome],
  )

  function openReservation() {
    dismissReservationOutcome()
    setAwaitingOutcome(false)
    setPhase('reservation')
  }

  function restoreDetail() {
    dismissReservationOutcome()
    setAwaitingOutcome(false)
    setPhase('detail')
  }

  function submitReservation(input: ReserveGiftInput) {
    dismissReservationOutcome()
    setAwaitingOutcome(true)
    reserveGift(input)
  }

  if (phase === 'confirmation' && matchingOutcome?.kind === 'success') {
    return (
      <ReservationOutcome
        outcome={matchingOutcome}
        giftName={entry.gift.name}
        headingLevel={headingLevel}
        headingRef={confirmationHeadingRef}
      />
    )
  }

  if (phase === 'reservation') {
    const issue =
      matchingOutcome?.kind === 'conflict' || matchingOutcome?.kind === 'unavailable'
        ? matchingOutcome.kind
        : null
    const notice = issue ? (
      <Notice ref={issueNoticeRef} tone="error" role="alert" tabIndex={-1}>
        <strong>
          {issue === 'conflict'
            ? 'Este presente acabou de ser reservado.'
            : 'Este presente não está mais disponível.'}
        </strong>
        <p>Seu nome foi preservado. Você pode voltar à lista e escolher outro presente.</p>
        <Link to="/">Voltar para a lista</Link>
      </Notice>
    ) : undefined

    return (
      <ReservationForm
        entry={entry}
        headingLevel={headingLevel}
        values={draft}
        contactExpanded={contactExpanded}
        notice={notice}
        onValuesChange={setDraft}
        onContactExpandedChange={setContactExpanded}
        onSubmit={submitReservation}
        onBack={restoreDetail}
      />
    )
  }

  return (
    <div className="gift-details-content">
      <section className="gift-details" aria-labelledby="gift-details-title">
        <p className="gift-details__step">1 de 3 · Escolha</p>
        <div className="gift-details__overview">
          <GiftVisual itemCode={entry.gift.code} categoryIcon={entry.category.icon} size="detail" />
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
        <p className="gift-details__description">
          {entry.gift.description}{' '}
          {entry.gift.acceptsEquivalent
            ? 'Aceitamos um produto equivalente que respeite estas preferências.'
            : 'Preferimos este presente conforme as preferências indicadas.'}
        </p>
        {suggestion ? (
          <div className="gift-details__suggestions" aria-label="Referência demonstrativa">
            <Button variant="ghost" onClick={() => setSuggestionNotice(true)}>
              Ver uma referência opcional
            </Button>
          </div>
        ) : null}
        {suggestionNotice ? (
          <Notice tone="demo" role="status">
            <strong>Demonstração</strong>
            <p>Nenhum site externo foi aberto.</p>
          </Notice>
        ) : null}
        {entry.availability.canReserve ? (
          <Button className="gift-details__reserve" fullWidth onClick={openReservation}>
            Quero dar este presente
          </Button>
        ) : (
          <p className="gift-details__unavailable">
            Este presente já foi escolhido por outra pessoa.
          </p>
        )}
      </section>
    </div>
  )
}
