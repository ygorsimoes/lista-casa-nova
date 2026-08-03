import { useDemoActions, useDemoSelector } from '@/app/DemoStateProvider'
import { AppShell } from '@/components/layout/AppShell'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { Button } from '@/components/ui/Button'
import { ErrorState } from '@/components/ui/ErrorState'
import { useToast } from '@/components/ui/Toast'
import { selectGiftByCode, selectReservationByToken } from '@/domain/selectors'
import { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ReservationSummary } from './ReservationSummary'

export function ManageReservationPage() {
  const { token = '' } = useParams()
  const reservation = useDemoSelector((state) => selectReservationByToken(state, token))
  const gift = useDemoSelector((state) =>
    reservation ? selectGiftByCode(state, reservation.itemCode)?.gift : undefined,
  )
  const { cancelReservation, markReservationPurchased } = useDemoActions()
  const { showToast } = useToast()
  const [cancelConfirmationOpen, setCancelConfirmationOpen] = useState(false)
  const stateTitleRef = useRef<HTMLHeadingElement>(null)
  const previousStatusRef = useRef(reservation?.status)

  useEffect(() => {
    if (reservation && previousStatusRef.current !== reservation.status) {
      stateTitleRef.current?.focus()
      previousStatusRef.current = reservation.status
    }
  }, [reservation])

  if (!reservation || !gift) {
    return (
      <AppShell>
        <ErrorState
          title="Reserva não encontrada"
          description="Este link de reserva não é válido. Volte à lista para escolher um presente."
          action={<Link to="/">Voltar à lista</Link>}
        />
      </AppShell>
    )
  }

  function markAsPurchased() {
    markReservationPurchased(token)
    showToast({ title: 'Reserva marcada como comprada.' })
  }

  function confirmCancellation() {
    cancelReservation(token)
    setCancelConfirmationOpen(false)
    showToast({ title: 'Reserva cancelada.' })
  }

  const isReserved = reservation.status === 'reserved'

  return (
    <AppShell>
      <div className="manage-reservation">
        <ReservationSummary ref={stateTitleRef} reservation={reservation} gift={gift} />
        {isReserved ? (
          <div className="manage-reservation__actions" aria-label="Ações da reserva">
            <Button fullWidth onClick={markAsPurchased}>
              Já comprei
            </Button>
            <Button fullWidth variant="secondary" onClick={() => setCancelConfirmationOpen(true)}>
              Cancelar minha reserva
            </Button>
          </div>
        ) : null}
        <Link className="manage-reservation__back" to="/">
          Voltar à lista
        </Link>
      </div>
      <ConfirmDialog
        open={cancelConfirmationOpen}
        title="Cancelar reserva"
        description={`Você quer cancelar a reserva de ${gift.name}?`}
        confirmLabel="Cancelar reserva"
        onConfirm={confirmCancellation}
        onClose={() => setCancelConfirmationOpen(false)}
      />
    </AppShell>
  )
}
