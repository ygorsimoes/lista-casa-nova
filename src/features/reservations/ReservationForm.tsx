import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Notice } from '@/components/ui/Notice'
import type { CatalogEntry, ReserveGiftInput } from '@/domain/types'
import { GiftVisual } from '@/features/catalog/GiftVisual'
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from 'react'
import {
  validateReservationForm,
  type ReservationFormErrors,
  type ReservationFormValues,
} from './reservation-validation'

export interface ReservationFormProps {
  entry: CatalogEntry
  headingLevel: 'h1' | 'h2'
  values: ReservationFormValues
  contactExpanded: boolean
  notice?: ReactNode
  onValuesChange(values: ReservationFormValues): void
  onContactExpandedChange(expanded: boolean): void
  onSubmit(input: ReserveGiftInput): void
  onBack(): void
}

export function ReservationForm({
  contactExpanded,
  entry,
  headingLevel,
  notice,
  onBack,
  onContactExpandedChange,
  onSubmit,
  onValuesChange,
  values,
}: ReservationFormProps) {
  const [errors, setErrors] = useState<ReservationFormErrors>({})
  const formRef = useRef<HTMLFormElement>(null)
  const contactId = useId()
  const Heading = headingLevel

  const focusField = useCallback((name: string) => {
    formRef.current?.querySelector<HTMLInputElement>(`[name="${name}"]`)?.focus()
  }, [])

  useEffect(() => {
    focusField('firstName')
  }, [focusField])

  useEffect(() => {
    if (contactExpanded && errors.contact) focusField('contact')
  }, [contactExpanded, errors.contact, focusField])

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const nextErrors = validateReservationForm(values, entry.availability.remainingQuantity)
    setErrors(nextErrors)
    const firstError = (['firstName', 'contact', 'quantity'] as const).find(
      (field) => nextErrors[field],
    )
    if (firstError) {
      if (firstError === 'contact' && !contactExpanded) {
        onContactExpandedChange(true)
        return
      }
      focusField(firstError)
      return
    }

    onSubmit({
      itemCode: entry.gift.code,
      firstName: values.firstName.trim(),
      ...(values.contact.trim() ? { contact: values.contact.trim() } : {}),
      quantity: values.quantity,
    })
  }

  return (
    <section className="reservation-form" aria-labelledby="reservation-form-title">
      <button type="button" className="reservation-form__back" onClick={onBack}>
        Ver detalhes
      </button>
      <p className="reservation-form__step">2 de 3 · Reserve</p>
      <Heading id="reservation-form-title" tabIndex={-1}>
        Reserve em seu nome
      </Heading>
      <p>Só precisamos saber quem escolheu este presente.</p>
      <div className="reservation-form__summary">
        <GiftVisual itemCode={entry.gift.code} categoryIcon={entry.category.icon} size="summary" />
        <span>
          <strong>{entry.gift.name}</strong>
          <span>{entry.availability.remainingQuantity} disponível(is)</span>
        </span>
      </div>
      {notice}
      <form ref={formRef} noValidate onSubmit={submit}>
        <Input
          label="Seu primeiro nome"
          name="firstName"
          placeholder="Como podemos chamar você?"
          value={values.firstName}
          onChange={(event) => onValuesChange({ ...values, firstName: event.target.value })}
          error={errors.firstName}
          autoComplete="given-name"
          required
        />
        <button
          type="button"
          className="reservation-form__disclosure"
          aria-expanded={contactExpanded}
          aria-controls={contactId}
          onClick={() => onContactExpandedChange(!contactExpanded)}
        >
          {contactExpanded ? 'Ocultar contato opcional' : 'Adicionar contato opcional'}
        </button>
        {contactExpanded ? (
          <div id={contactId}>
            <Input
              label="Contato (opcional)"
              name="contact"
              value={values.contact}
              onChange={(event) => onValuesChange({ ...values, contact: event.target.value })}
              error={errors.contact}
              autoComplete="email"
            />
          </div>
        ) : null}
        {entry.availability.remainingQuantity > 1 ? (
          <Input
            label="Quantidade"
            name="quantity"
            type="number"
            min={1}
            max={entry.availability.remainingQuantity}
            value={values.quantity}
            onChange={(event) =>
              onValuesChange({ ...values, quantity: Number(event.target.value) })
            }
            error={errors.quantity}
            required
          />
        ) : null}
        <p className="reservation-form__privacy">Seu nome não será exibido para outras pessoas.</p>
        <Notice tone="demo">Protótipo visual: nenhuma informação é enviada ou salva.</Notice>
        <div className="reservation-form__actions">
          <Button type="submit" fullWidth>
            Confirmar reserva
          </Button>
          <Button variant="secondary" fullWidth onClick={onBack}>
            Agora não
          </Button>
        </div>
      </form>
    </section>
  )
}
