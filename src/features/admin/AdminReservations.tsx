import { useDemoActions, useDemoSelector } from '@/app/DemoStateProvider'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { Notice } from '@/components/ui/Notice'
import { useToast } from '@/components/ui/Toast'
import type { DemoReservation, ReservationStatus } from '@/domain/types'
import { useEffect, useRef, useState } from 'react'

const statusPresentation: Record<
  ReservationStatus,
  { label: string; tone: 'reserved' | 'received' | 'neutral' }
> = {
  reserved: { label: 'Reservada', tone: 'reserved' },
  purchased: { label: 'Comprada', tone: 'reserved' },
  received: { label: 'Recebida', tone: 'received' },
  cancelled: { label: 'Cancelada', tone: 'neutral' },
}

function sourceLabel(source: DemoReservation['source']) {
  return source === 'web' ? 'Lista online' : source === 'paper' ? 'Anotação manual' : 'Painel'
}

function formatDate(createdAt: string) {
  return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'long', timeStyle: 'short' }).format(
    new Date(createdAt),
  )
}

export function AdminReservations() {
  const reservations = useDemoSelector((state) => state.reservations)
  const gifts = useDemoSelector((state) => state.gifts)
  const { cancelReservation, markReservationPurchased, markReservationReceived } = useDemoActions()
  const { showToast } = useToast()
  const [releaseToken, setReleaseToken] = useState<string | null>(null)
  const [feedback, setFeedback] = useState('')
  const focusTokenRef = useRef<string | null>(null)
  const rowsRef = useRef(new Map<string, HTMLElement>())

  useEffect(() => {
    const token = focusTokenRef.current
    if (!token) return
    rowsRef.current.get(token)?.focus()
    focusTokenRef.current = null
  }, [reservations])

  function findGiftName(reservation: DemoReservation) {
    return (
      gifts.find((gift) => gift.code === reservation.itemCode)?.name ?? 'Presente não encontrado'
    )
  }

  function completeAction(token: string, message: string, action: () => void) {
    action()
    setFeedback(message)
    focusTokenRef.current = token
    showToast({ title: message })
  }

  const reservationToRelease = releaseToken
    ? reservations.find((reservation) => reservation.token === releaseToken)
    : undefined

  return (
    <section className="admin-panel" aria-labelledby="admin-reservations-title">
      <div className="admin-panel__header">
        <div>
          <h2 id="admin-reservations-title" tabIndex={-1}>
            Reservas
          </h2>
          <p>Acompanhe as reservas fictícias e ajuste apenas os estados permitidos.</p>
        </div>
      </div>
      {feedback ? (
        <Notice className="admin-panel__feedback" tone="success" role="status">
          {feedback}
        </Notice>
      ) : null}
      <div className="admin-reservations" aria-label="Reservas demonstrativas">
        {reservations.map((reservation) => {
          const giftName = findGiftName(reservation)
          const status = statusPresentation[reservation.status]
          const canMarkPurchased = reservation.status === 'reserved'
          const canMarkReceived =
            reservation.status === 'reserved' || reservation.status === 'purchased'
          const canRelease = reservation.status === 'reserved' || reservation.status === 'purchased'

          return (
            <article
              className="admin-reservation"
              key={reservation.token}
              ref={(element) => {
                if (element) rowsRef.current.set(reservation.token, element)
                else rowsRef.current.delete(reservation.token)
              }}
              tabIndex={-1}
            >
              <div className="admin-reservation__identity">
                <p className="admin-reservation__name">{reservation.firstName}</p>
                <p>{giftName}</p>
              </div>
              <Badge tone={status.tone}>{status.label}</Badge>
              <dl className="admin-reservation__details">
                <div>
                  <dt>Quantidade</dt>
                  <dd>{reservation.quantity}</dd>
                </div>
                <div>
                  <dt>Origem</dt>
                  <dd>{sourceLabel(reservation.source)}</dd>
                </div>
                <div>
                  <dt>Data</dt>
                  <dd>{formatDate(reservation.createdAt)}</dd>
                </div>
              </dl>
              {canMarkPurchased || canMarkReceived || canRelease ? (
                <div className="admin-reservation__actions" aria-label={`Ações para ${giftName}`}>
                  {canMarkPurchased ? (
                    <Button
                      variant="secondary"
                      onClick={() =>
                        completeAction(
                          reservation.token,
                          `Reserva de ${giftName} marcada como comprada.`,
                          () => markReservationPurchased(reservation.token),
                        )
                      }
                      aria-label={`Marcar reserva de ${giftName} como comprada`}
                    >
                      Marcar como comprada
                    </Button>
                  ) : null}
                  {canMarkReceived ? (
                    <Button
                      variant="secondary"
                      onClick={() =>
                        completeAction(
                          reservation.token,
                          `Reserva de ${giftName} marcada como recebida.`,
                          () => markReservationReceived(reservation.token),
                        )
                      }
                      aria-label={`Marcar reserva de ${giftName} como recebida`}
                    >
                      Marcar como recebida
                    </Button>
                  ) : null}
                  {canRelease ? (
                    <Button
                      variant="danger"
                      onClick={() => setReleaseToken(reservation.token)}
                      aria-label={`Liberar reserva de ${giftName}`}
                    >
                      Liberar reserva
                    </Button>
                  ) : null}
                </div>
              ) : (
                <p className="admin-reservation__terminal">
                  Esta reserva não permite novas alterações.
                </p>
              )}
            </article>
          )
        })}
      </div>
      <ConfirmDialog
        open={reservationToRelease !== undefined}
        title="Liberar reserva"
        description={
          reservationToRelease
            ? `Liberar a reserva de ${findGiftName(reservationToRelease)} vai devolver a disponibilidade para a lista.`
            : ''
        }
        confirmLabel="Confirmar liberação"
        onConfirm={() => {
          if (!reservationToRelease) return
          const giftName = findGiftName(reservationToRelease)
          completeAction(
            reservationToRelease.token,
            `Reserva liberada: ${giftName} voltou a ficar disponível.`,
            () => cancelReservation(reservationToRelease.token),
          )
          setReleaseToken(null)
        }}
        onClose={() => setReleaseToken(null)}
      />
    </section>
  )
}
