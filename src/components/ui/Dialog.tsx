import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/cn'
import { useEffect, useId, useRef, type MouseEvent, type ReactNode, type RefObject } from 'react'

export interface DialogProps {
  open: boolean
  title: string
  description?: string
  onClose(): void
  initialFocusRef?: RefObject<HTMLElement | null>
  children: ReactNode
}

export function Dialog({
  children,
  description,
  initialFocusRef,
  onClose,
  open,
  title,
}: DialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)
  const titleId = useId()
  const descriptionId = useId()

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (open) {
      previousFocusRef.current = document.activeElement as HTMLElement | null
      if (!dialog.open) dialog.showModal()
      const target = initialFocusRef?.current ?? dialog
      target.focus()
      return
    }

    if (dialog.open) dialog.close()
    previousFocusRef.current?.focus()
    previousFocusRef.current = null
  }, [initialFocusRef, open])

  useEffect(
    () => () => {
      previousFocusRef.current?.focus()
    },
    [],
  )

  function handleBackdropClick(event: MouseEvent<HTMLDialogElement>) {
    if (event.target === event.currentTarget) onClose()
  }

  return (
    <dialog
      ref={dialogRef}
      hidden={!open}
      className="ui-dialog"
      tabIndex={-1}
      aria-labelledby={titleId}
      aria-describedby={description ? descriptionId : undefined}
      aria-modal="true"
      onCancel={(event) => {
        event.preventDefault()
        onClose()
      }}
      onClick={handleBackdropClick}
      onKeyDown={(event) => {
        if (event.key === 'Escape') {
          event.preventDefault()
          onClose()
        }
      }}
    >
      <div className={cn('ui-dialog__surface')}>
        <div className="ui-dialog__header">
          <div>
            <h2 id={titleId} className="ui-dialog__title">
              {title}
            </h2>
            {description ? (
              <p id={descriptionId} className="ui-dialog__description">
                {description}
              </p>
            ) : null}
          </div>
          <Button
            variant="ghost"
            className="ui-dialog__close"
            onClick={onClose}
            aria-label="Fechar"
          >
            Fechar
          </Button>
        </div>
        <div className="ui-dialog__content">{children}</div>
      </div>
    </dialog>
  )
}
