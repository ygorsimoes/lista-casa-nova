import { Checkbox } from '@/components/ui/Checkbox'
import { EmptyState } from '@/components/ui/EmptyState'
import { ErrorState } from '@/components/ui/ErrorState'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

describe('controles de formulário', () => {
  it('preserva a descrição do consumidor junto de ajuda e erro', () => {
    render(
      <>
        <p id="descricao-consumidor">Descrição adicional</p>
        <Input
          label="Nome"
          aria-describedby="descricao-consumidor"
          hint="Use apenas o primeiro nome"
          error="Informe seu nome"
        />
        <Textarea
          label="Mensagem"
          aria-describedby="descricao-consumidor"
          hint="Opcional"
          error="Mensagem inválida"
        />
        <Checkbox
          label="Aceito o convite"
          aria-describedby="descricao-consumidor"
          hint="Você pode mudar depois"
          error="Confirme para continuar"
        />
      </>,
    )

    for (const control of [
      screen.getByRole('textbox', { name: 'Nome' }),
      screen.getByRole('textbox', { name: 'Mensagem' }),
      screen.getByRole('checkbox', { name: 'Aceito o convite' }),
    ]) {
      expect(control).toHaveAttribute(
        'aria-describedby',
        expect.stringContaining('descricao-consumidor'),
      )
      expect(control).toHaveAttribute('aria-describedby', expect.stringContaining('-hint'))
      expect(control).toHaveAttribute('aria-describedby', expect.stringContaining('-error'))
    }
  })

  it('torna toda a linha do checkbox acionável pelo rótulo', async () => {
    const user = userEvent.setup()
    render(<Checkbox label="Mostrar somente disponíveis" />)

    const label = screen.getByText('Mostrar somente disponíveis')
    await user.click(label)

    expect(screen.getByRole('checkbox')).toBeChecked()
    expect(label.closest('label')).toHaveClass('ui-checkbox-row')
  })
})

describe('estados de conteúdo', () => {
  it('usa rótulos únicos quando há mais de um estado na página', () => {
    render(
      <>
        <EmptyState title="Nenhum presente" description="Tente outra busca." />
        <EmptyState title="Nenhuma coleção" description="Volte depois." />
        <ErrorState title="Reserva indisponível" description="Escolha outro item." />
        <ErrorState title="Coleção não encontrada" description="Volte ao catálogo." />
      </>,
    )

    const headings = screen.getAllByRole('heading')
    expect(new Set(headings.map((heading) => heading.id)).size).toBe(headings.length)
  })
})
