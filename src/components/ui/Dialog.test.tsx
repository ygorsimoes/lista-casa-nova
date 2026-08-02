import { Dialog } from '@/components/ui/Dialog'
import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useRef, useState } from 'react'
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

function FocusDialogHarness() {
  const [open, setOpen] = useState(false)
  const initialFocusRef = useRef<HTMLButtonElement>(null)

  return (
    <>
      <button type="button" onClick={() => setOpen(true)}>
        Abrir painel
      </button>
      <Dialog
        open={open}
        title="Painel com ações"
        initialFocusRef={initialFocusRef}
        onClose={() => setOpen(false)}
      >
        <button ref={initialFocusRef} type="button">
          Primeira ação
        </button>
        <button type="button">Última ação</button>
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

  it('fecha ao clicar no backdrop e devolve o foco ao acionador', async () => {
    const user = userEvent.setup()
    render(<DialogHarness />)
    const trigger = screen.getByRole('button', { name: /abrir detalhes/i })

    await user.click(trigger)
    fireEvent.click(screen.getByRole('dialog'))

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(trigger).toHaveFocus()
  })

  it('move o foco inicial solicitado e mantém Tab dentro do diálogo', async () => {
    const user = userEvent.setup()
    render(<FocusDialogHarness />)

    await user.click(screen.getByRole('button', { name: /abrir painel/i }))
    const closeButton = screen.getByRole('button', { name: /fechar/i })
    const firstAction = screen.getByRole('button', { name: /primeira ação/i })
    const lastAction = screen.getByRole('button', { name: /última ação/i })

    expect(firstAction).toHaveFocus()

    lastAction.focus()
    await user.tab()
    expect(closeButton).toHaveFocus()

    await user.tab({ shift: true })
    expect(lastAction).toHaveFocus()
  })
})
