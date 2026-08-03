import { useDemoSelector } from '@/app/DemoStateProvider'
import { Dialog } from '@/components/ui/Dialog'
import { selectGiftByCode } from '@/domain/selectors'
import { useNavigate, useParams } from 'react-router-dom'
import { GiftDetailsContent } from './GiftDetailsContent'

export function GiftDetailsDialog() {
  const { code = '' } = useParams()
  const navigate = useNavigate()
  const entry = useDemoSelector((state) => selectGiftByCode(state, code))

  if (!entry) return null

  function closeAndRestoreCardFocus() {
    navigate(-1)
    requestAnimationFrame(() => {
      document.getElementById(`gift-card-action-${code}`)?.focus()
    })
  }

  return (
    <Dialog
      open
      className="gift-details-dialog"
      title="Detalhes do presente"
      onClose={closeAndRestoreCardFocus}
    >
      <GiftDetailsContent entry={entry} headingLevel="h2" />
    </Dialog>
  )
}
