export interface ReservationFormValues {
  firstName: string
  contact: string
  quantity: number
}

export type ReservationFormErrors = Partial<Record<'firstName' | 'contact' | 'quantity', string>>

export function validateReservationForm(
  values: ReservationFormValues,
  availableQuantity: number,
): ReservationFormErrors {
  const errors: ReservationFormErrors = {}
  const firstName = values.firstName.trim()

  if (firstName.length < 2) {
    errors.firstName = 'Informe pelo menos 2 caracteres.'
  } else if (firstName.length > 40) {
    errors.firstName = 'Informe no máximo 40 caracteres.'
  }

  if (values.contact.trim().length > 100) {
    errors.contact = 'Informe no máximo 100 caracteres.'
  }

  if (
    !Number.isInteger(values.quantity) ||
    values.quantity < 1 ||
    values.quantity > availableQuantity
  ) {
    errors.quantity = `Escolha entre 1 e ${availableQuantity} ${availableQuantity === 1 ? 'unidade.' : 'unidades.'}`
  }

  return errors
}
