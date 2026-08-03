import { Badge } from '@/components/ui/Badge'
import { Notice } from '@/components/ui/Notice'
import type { Category, DemoReservation, GiftItem, ReservationStatus } from '@/domain/types'
import { GiftVisual } from '@/features/catalog/GiftVisual'
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
  categoryIcon: Category['icon']
}

export const ReservationSummary = forwardRef<HTMLHeadingElement, ReservationSummaryProps>(
  function ReservationSummary({ categoryIcon, gift, reservation }, ref) {
    const presentation = statusPresentation[reservation.status]
    const StatusIcon = presentation.Icon

    return (
      <section className="reservation-summary" aria-labelledby="reservation-summary-title">
        <p className="reservation-summary__eyebrow">Minha reserva</p>
        <h1 id="reservation-summary-title" tabIndex={-1}>
          Tudo certo com seu presente
        </h1>
        <div className="reservation-summary__gift">
          <GiftVisual itemCode={gift.code} categoryIcon={categoryIcon} size="summary" />
          <div>
            <strong>{gift.name}</strong>
            <p>
              {reservation.quantity === 1
                ? '1 unidade reservada em seu nome.'
                : `${reservation.quantity} unidades reservadas em seu nome.`}
            </p>
          </div>
        </div>
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
          <Notice tone="success" className="reservation-summary__next">
            <strong>Combine a entrega</strong>
            <p>Quando estiver com o presente, combine com a gente a melhor forma de entregar.</p>
          </Notice>
        ) : null}
      </section>
    )
  },
)
