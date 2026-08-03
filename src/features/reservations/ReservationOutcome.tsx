import { Notice } from '@/components/ui/Notice'
import type { ReservationOutcome as ReservationOutcomeState } from '@/domain/types'
import type { RefObject } from 'react'
import { Link } from 'react-router'

type SuccessfulReservationOutcome = Extract<ReservationOutcomeState, { kind: 'success' }>

export interface ReservationOutcomeProps {
  outcome: SuccessfulReservationOutcome
  giftName: string
  headingLevel: 'h1' | 'h2'
  headingRef: RefObject<HTMLHeadingElement | null>
}

export function ReservationOutcome({
  giftName,
  headingLevel,
  headingRef,
  outcome,
}: ReservationOutcomeProps) {
  const Heading = headingLevel
  return (
    <section className="reservation-outcome reservation-outcome--success" aria-live="polite">
      <span className="reservation-outcome__heart" aria-hidden="true">
        💛
      </span>
      <p className="reservation-outcome__eyebrow">Reserva confirmada</p>
      <Heading ref={headingRef} tabIndex={-1}>
        Este presente ficou com você
      </Heading>
      <p>{giftName} está reservado em seu nome. Obrigado por fazer parte da nossa casa nova.</p>
      <Notice tone="success">
        <strong>3 · Combine a entrega</strong>
        <p>Agora é só combinar com a gente quando e como entregar o presente.</p>
      </Notice>
      <div className="reservation-outcome__links">
        <Link className="ui-button ui-button--primary" to={`/minha-reserva/${outcome.token}`}>
          Ver minha reserva
        </Link>
        <Link className="ui-button ui-button--secondary" to="/">
          Voltar para a lista
        </Link>
      </div>
      <p className="reservation-outcome__demo">
        Nesta demonstração, recarregar a página restaura o estado inicial.
      </p>
    </section>
  )
}
