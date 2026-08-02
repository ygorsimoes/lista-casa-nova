import { cn } from '@/lib/cn'
import { useId, type InputHTMLAttributes } from 'react'

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string
  hint?: string
  error?: string
}

export function Checkbox({ className, error, hint, id, label, ...props }: CheckboxProps) {
  const generatedId = useId()
  const checkboxId = id ?? generatedId
  const hintId = `${checkboxId}-hint`
  const errorId = `${checkboxId}-error`
  const describedBy = [props['aria-describedby'], hint ? hintId : null, error ? errorId : null]
    .filter(Boolean)
    .join(' ')

  return (
    <div className="ui-field">
      <div className="ui-checkbox-row">
        <input
          id={checkboxId}
          type="checkbox"
          className={cn('ui-checkbox', error && 'ui-checkbox--error', className)}
          aria-describedby={describedBy || undefined}
          aria-invalid={error ? true : undefined}
          {...props}
        />
        <label className="ui-checkbox__label" htmlFor={checkboxId}>
          {label}
        </label>
      </div>
      {hint ? (
        <p id={hintId} className="ui-field__hint">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} className="ui-field__error">
          {error}
        </p>
      ) : null}
    </div>
  )
}
