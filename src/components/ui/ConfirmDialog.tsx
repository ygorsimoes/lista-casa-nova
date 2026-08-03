import { Button } from '@/components/ui/Button'
import { Dialog } from '@/components/ui/Dialog'
import { useRef } from 'react'

export interface ConfirmDialogProps {
  open: boolean
  title: string
  description: string
  confirmLabel: string
  onConfirm(): void
  onClose(): void
}

export function ConfirmDialog({
  confirmLabel,
  description,
  onClose,
  onConfirm,
  open,
  title,
}: ConfirmDialogProps) {
  const dismissButtonRef = useRef<HTMLButtonElement>(null)

  return (
    <Dialog
      open={open}
      title={title}
      description={description}
      initialFocusRef={dismissButtonRef}
      onClose={onClose}
    >
      <div className="confirm-dialog__actions">
        <Button variant="danger" onClick={onConfirm}>
          {confirmLabel}
        </Button>
        <Button ref={dismissButtonRef} variant="secondary" onClick={onClose}>
          Manter reserva
        </Button>
      </div>
    </Dialog>
  )
}
