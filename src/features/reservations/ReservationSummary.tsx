import { Badge } from '@/components/ui/Badge'
import type { DemoReservation, GiftItem, ReservationStatus } from '@/domain/types'
import { CheckCircle2, PackageCheck, Undo2 } from 'lucide-react'
import { forwardRef } from 'react'

interface StatusPresentation {
  label: string
  description: string
  tone: 'available' | 'reserved' | 'received' | 'neutral'
  Icon: typeof CheckCircle2
}

const statusPresentation: Record<ReservationStatus, StatusPresentation> = {
  reserved: {
    label: 'Reserva ativa',
    description: 'Seu presente continua reservado para você.',
    tone: 'available',
    Icon: CheckCircle2,
  },
  purchased: {
    label: 'Comprado',
    description: 'Você informou que já comprou este presente. Obrigado por celebrar com a gente.',
    tone: 'reserved',
    Icon: PackageCheck,
  },
  received: {
    label: 'Presente recebido',
    description: 'Este presente já foi recebido e a reserva está concluída.',
    tone: 'received',
    Icon: CheckCircle2,
  },
  cancelled: {
    label: 'Reserva cancelada',
    description: 'A reserva foi cancelada e este presente voltou a ficar disponível.',
    tone: 'neutral',
    Icon: Undo2,
  },
}

export interface ReservationSummaryProps {
  reservation: DemoReservation
  gift: GiftItem
}

export const ReservationSummary = forwardRef<HTMLHeadingElement, ReservationSummaryProps>(
  function ReservationSummary({ gift, reservation }, ref) {
    const presentation = statusPresentation[reservation.status]
    const StatusIcon = presentation.Icon

    return (
      <section className="reservation-summary" aria-labelledby="reservation-summary-title">
        <p className="reservation-summary__eyebrow">Minha reserva</p>
        <h1 id="reservation-summary-title">{gift.name}</h1>
        <p className="reservation-summary__quantity">
          {reservation.quantity === 1
            ? '1 unidade reservada'
            : `${reservation.quantity} unidades reservadas`}
        </p>
        <div className="reservation-summary__state" role="status" aria-label="Estado da reserva">
          <StatusIcon aria-hidden="true" />
          <div>
            <h2 ref={ref} tabIndex={-1}>
              Estado da reserva
            </h2>
            <Badge tone={presentation.tone}>{presentation.label}</Badge>
            <p>{presentation.description}</p>
          </div>
        </div>
        {reservation.status === 'reserved' ? (
          <p className="reservation-summary__hint">
            Quando comprar o presente, volte aqui para marcar a reserva como concluída.
          </p>
        ) : null}
      </section>
    )
  },
)
