import { useDemoSelector } from '@/app/DemoStateProvider'
import { Dialog } from '@/components/ui/Dialog'
import { selectGiftByCode } from '@/domain/selectors'
import { useRef } from 'react'
import { useNavigate, useParams } from 'react-router'
import { GiftDetailsContent } from './GiftDetailsContent'

export function GiftDetailsDialog() {
  const { code = '' } = useParams()
  const navigate = useNavigate()
  const originScrollY = useRef(window.scrollY)
  const entry = useDemoSelector((state) => selectGiftByCode(state, code))

  if (!entry) return null

  function closeAndRestoreCatalogContext() {
    const scrollY = originScrollY.current
    navigate(-1)
    requestAnimationFrame(() => {
      window.scrollTo(0, scrollY)
      document.getElementById(`gift-card-action-${code}`)?.focus()
    })
  }

  return (
    <Dialog
      open
      className="gift-details-dialog"
      title="Detalhes do presente"
      onClose={closeAndRestoreCatalogContext}
    >
      <GiftDetailsContent entry={entry} headingLevel="h2" />
    </Dialog>
  )
}
