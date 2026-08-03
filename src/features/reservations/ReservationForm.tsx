import { useDemoActions } from '@/app/DemoStateProvider'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useRef, useState, type FormEvent } from 'react'
import {
  validateReservationForm,
  type ReservationFormErrors,
  type ReservationFormValues,
} from './reservation-validation'

export interface ReservationFormProps {
  itemCode: string
  availableQuantity: number
  onClose(): void
}

const initialValues: ReservationFormValues = {
  firstName: '',
  contact: '',
  quantity: 1,
}

export function ReservationForm({ availableQuantity, itemCode, onClose }: ReservationFormProps) {
  const { reserveGift } = useDemoActions()
  const [values, setValues] = useState<ReservationFormValues>(initialValues)
  const [errors, setErrors] = useState<ReservationFormErrors>({})
  const formRef = useRef<HTMLFormElement>(null)

  function focusField(name: string) {
    formRef.current?.querySelector<HTMLInputElement>(`[name="${name}"]`)?.focus()
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const nextErrors = validateReservationForm(values, availableQuantity)
    setErrors(nextErrors)

    if (nextErrors.firstName) {
      focusField('firstName')
      return
    }
    if (nextErrors.contact) {
      focusField('contact')
      return
    }
    if (nextErrors.quantity) {
      focusField('quantity')
      return
    }

    reserveGift({
      itemCode,
      firstName: values.firstName.trim(),
      ...(values.contact.trim() ? { contact: values.contact.trim() } : {}),
      quantity: values.quantity,
    })
  }

  return (
    <section className="reservation-form" aria-labelledby="reservation-form-title">
      <div className="reservation-form__handle" aria-hidden="true" />
      <h2 id="reservation-form-title">Reservar este presente</h2>
      <p>Deixe seu nome para sabermos que este item já foi escolhido.</p>
      <form ref={formRef} noValidate onSubmit={handleSubmit}>
        <Input
          label="Primeiro nome"
          name="firstName"
          value={values.firstName}
          onChange={(event) =>
            setValues((current) => ({ ...current, firstName: event.target.value }))
          }
          error={errors.firstName}
          autoComplete="given-name"
          required
        />
        <Input
          label="Contato (opcional)"
          name="contact"
          value={values.contact}
          onChange={(event) =>
            setValues((current) => ({ ...current, contact: event.target.value }))
          }
          error={errors.contact}
          autoComplete="email"
        />
        <Input
          label="Quantidade"
          name="quantity"
          type="number"
          min={1}
          max={availableQuantity}
          value={values.quantity}
          onChange={(event) =>
            setValues((current) => ({ ...current, quantity: Number(event.target.value) }))
          }
          error={errors.quantity}
          required
        />
        <p className="reservation-form__privacy">Seu nome não será exibido publicamente.</p>
        <div className="reservation-form__actions">
          <Button type="submit" fullWidth>
            Confirmar reserva
          </Button>
          <Button variant="secondary" fullWidth onClick={onClose}>
            Agora não
          </Button>
        </div>
      </form>
    </section>
  )
}
