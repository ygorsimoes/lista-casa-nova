import { createInitialDemoState } from '@/data/initial-state'
import { selectGiftByCode } from '@/domain/selectors'
import { renderWithApp } from '@/test/renderApp'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { ReservationForm } from './ReservationForm'
import { createReservationFormValues, type ReservationFormValues } from './reservation-validation'

function FormHarness({ code = 'CZ-001', contactInitiallyExpanded = false, onSubmit = vi.fn() }) {
  const entry = selectGiftByCode(createInitialDemoState(), code)
  const [values, setValues] = useState<ReservationFormValues>(createReservationFormValues)
  const [contactExpanded, setContactExpanded] = useState(contactInitiallyExpanded)
  if (!entry) throw new Error(`Fixture ausente: ${code}`)

  return (
    <ReservationForm
      entry={entry}
      headingLevel="h1"
      values={values}
      contactExpanded={contactExpanded}
      onValuesChange={setValues}
      onContactExpandedChange={setContactExpanded}
      onSubmit={onSubmit}
      onBack={() => undefined}
    />
  )
}

describe('ReservationForm', () => {
  it('foca e valida o primeiro nome obrigatório', async () => {
    const user = userEvent.setup()
    renderWithApp(<FormHarness />)
    const firstName = screen.getByLabelText('Seu primeiro nome')

    expect(firstName).toHaveFocus()
    await user.click(screen.getByRole('button', { name: 'Confirmar reserva' }))
    expect(firstName).toHaveFocus()
    expect(firstName).toHaveAttribute('aria-invalid', 'true')
  })

  it('revela contato opcional e oculta quantidade única', async () => {
    const user = userEvent.setup()
    renderWithApp(<FormHarness />)
    const disclosure = screen.getByRole('button', { name: 'Adicionar contato opcional' })

    expect(disclosure).toHaveAttribute('aria-expanded', 'false')
    expect(screen.queryByLabelText('Contato (opcional)')).not.toBeInTheDocument()
    expect(screen.queryByLabelText('Quantidade')).not.toBeInTheDocument()
    await user.click(disclosure)
    expect(disclosure).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByLabelText('Contato (opcional)')).toBeVisible()
  })

  it('mostra quantidade quando há escolha e envia valores válidos', async () => {
    const onSubmit = vi.fn()
    const user = userEvent.setup()
    renderWithApp(<FormHarness code="QT-002" onSubmit={onSubmit} />)

    await user.type(screen.getByLabelText('Seu primeiro nome'), 'Nina')
    await user.clear(screen.getByLabelText('Quantidade'))
    await user.type(screen.getByLabelText('Quantidade'), '2')
    await user.click(screen.getByRole('button', { name: 'Confirmar reserva' }))

    expect(onSubmit).toHaveBeenCalledWith({ itemCode: 'QT-002', firstName: 'Nina', quantity: 2 })
  })

  it('reabre e foca o contato inválido que estava recolhido', async () => {
    const user = userEvent.setup()
    renderWithApp(<FormHarness />)
    const disclosure = screen.getByRole('button', { name: 'Adicionar contato opcional' })
    await user.click(disclosure)
    await user.type(screen.getByLabelText('Contato (opcional)'), 'x'.repeat(101))
    await user.click(screen.getByRole('button', { name: 'Ocultar contato opcional' }))
    await user.type(screen.getByLabelText('Seu primeiro nome'), 'Nina')
    await user.click(screen.getByRole('button', { name: 'Confirmar reserva' }))

    expect(screen.getByLabelText('Contato (opcional)')).toHaveFocus()
    expect(screen.getByLabelText('Contato (opcional)')).toHaveAttribute('aria-invalid', 'true')
  })

  it('mantém o foco no primeiro nome quando nome e contato estão inválidos', async () => {
    const user = userEvent.setup()
    renderWithApp(<FormHarness contactInitiallyExpanded />)
    const firstName = screen.getByLabelText('Seu primeiro nome')
    const contact = screen.getByLabelText('Contato (opcional)')

    await user.type(contact, 'x'.repeat(101))
    await user.click(screen.getByRole('button', { name: 'Confirmar reserva' }))

    expect(firstName).toHaveFocus()
    expect(firstName).toHaveAttribute('aria-invalid', 'true')
    expect(contact).toHaveAttribute('aria-invalid', 'true')
  })
})
