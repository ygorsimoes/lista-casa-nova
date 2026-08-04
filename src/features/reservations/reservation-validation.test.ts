import { describe, expect, it } from 'vitest'
import { createReservationFormValues, validateReservationForm } from './reservation-validation'

describe('createReservationFormValues', () => {
  it('cria um novo rascunho válido com quantidade um', () => {
    const first = createReservationFormValues()
    const second = createReservationFormValues()

    expect(first).toEqual({ firstName: '', contact: '', quantity: 1 })
    expect(first).not.toBe(second)
  })
})

describe('validateReservationForm', () => {
  it('rejeita nome curto e quantidade maior que a disponível', () => {
    expect(validateReservationForm({ firstName: 'A', contact: '', quantity: 2 }, 1)).toEqual({
      firstName: 'Informe pelo menos 2 caracteres.',
      quantity: 'Escolha entre 1 e 1 unidade.',
    })
  })

  it('aceita contato opcional e quantidade inteira disponível', () => {
    expect(validateReservationForm({ firstName: 'Nina', contact: '', quantity: 1 }, 1)).toEqual({})
  })

  it('rejeita contato longo e quantidade não inteira', () => {
    expect(
      validateReservationForm({ firstName: 'Nina', contact: 'a'.repeat(101), quantity: 1.5 }, 2),
    ).toEqual({
      contact: 'Informe no máximo 100 caracteres.',
      quantity: 'Escolha entre 1 e 2 unidades.',
    })
  })
})
