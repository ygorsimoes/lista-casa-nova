import { Dialog } from '@/components/ui/Dialog'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, it } from 'vitest'

function DialogHarness() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button type="button" onClick={() => setOpen(true)}>
        Abrir detalhes
      </button>
      <Dialog
        open={open}
        title="Detalhes do presente"
        description="Informações demonstrativas"
        onClose={() => setOpen(false)}
      >
        <p>Conteúdo do painel</p>
      </Dialog>
    </>
  )
}

describe('Dialog', () => {
  it('fecha com Escape e devolve o foco ao acionador', async () => {
    const user = userEvent.setup()
    render(<DialogHarness />)
    const trigger = screen.getByRole('button', { name: /abrir detalhes/i })

    await user.click(trigger)

    expect(screen.getByRole('dialog', { name: /detalhes do presente/i })).toHaveFocus()

    await user.keyboard('{Escape}')

    expect(trigger).toHaveFocus()
  })

  it('fecha pelo botão acessível de fechamento', async () => {
    const user = userEvent.setup()
    render(<DialogHarness />)

    await user.click(screen.getByRole('button', { name: /abrir detalhes/i }))
    await user.click(screen.getByRole('button', { name: /fechar/i }))

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
})
