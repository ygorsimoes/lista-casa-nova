import type { ReservationOutcome as ReservationOutcomeState } from '@/domain/types'
import { CheckCircle2 } from 'lucide-react'
import { Link } from 'react-router'

export interface ReservationOutcomeProps {
  outcome: ReservationOutcomeState
}

export function ReservationOutcome({ outcome }: ReservationOutcomeProps) {
  if (outcome.kind === 'success') {
    return (
      <section className="reservation-outcome reservation-outcome--success" aria-live="polite">
        <CheckCircle2 aria-hidden="true" />
        <div>
          <h2>Pronto, este presente está reservado para você!</h2>
          <p>Obrigado por celebrar com a gente.</p>
          <div className="reservation-outcome__links">
            <Link to={`/minha-reserva/${outcome.token}`}>Gerenciar esta reserva</Link>
            <Link to="/">Voltar à lista</Link>
          </div>
        </div>
      </section>
    )
  }

  if (outcome.kind === 'conflict') {
    return (
      <section className="reservation-outcome reservation-outcome--error" role="alert">
        <h2>Este presente acabou de ser reservado.</h2>
        <p>Se quiser, escolha outro presente da lista.</p>
        <Link to="/">Escolher outro presente</Link>
      </section>
    )
  }

  return (
    <section className="reservation-outcome reservation-outcome--error" role="alert">
      <h2>Este presente não está mais disponível.</h2>
      <p>Escolha outro presente da lista para continuar.</p>
      <Link to="/">Escolher outro presente</Link>
    </section>
  )
}
