import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'

function ConfirmDialogHarness({ onConfirm = vi.fn() }: { onConfirm?: () => void }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button type="button" onClick={() => setOpen(true)}>
        Cancelar minha reserva
      </button>
      <ConfirmDialog
        open={open}
        title="Cancelar reserva"
        description="Você quer cancelar a reserva da Chaleira?"
        confirmLabel="Cancelar reserva"
        onConfirm={() => {
          onConfirm()
          setOpen(false)
        }}
        onClose={() => setOpen(false)}
      />
    </>
  )
}

describe('ConfirmDialog', () => {
  it('confirma a ação e devolve o foco ao acionador', async () => {
    const user = userEvent.setup()
    const onConfirm = vi.fn()
    render(<ConfirmDialogHarness onConfirm={onConfirm} />)

    const trigger = screen.getByRole('button', { name: /cancelar minha reserva/i })
    await user.click(trigger)
    await user.click(screen.getByRole('button', { name: /^cancelar reserva$/i }))

    expect(onConfirm).toHaveBeenCalledOnce()
    expect(trigger).toHaveFocus()
  })

  it('fecha sem executar a ação quando a pessoa desiste', async () => {
    const user = userEvent.setup()
    const onConfirm = vi.fn()
    render(<ConfirmDialogHarness onConfirm={onConfirm} />)

    await user.click(screen.getByRole('button', { name: /cancelar minha reserva/i }))
    await user.click(screen.getByRole('button', { name: /manter reserva/i }))

    expect(onConfirm).not.toHaveBeenCalled()
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
})
