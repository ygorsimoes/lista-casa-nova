import { useId, type ReactNode } from 'react'

export interface ErrorStateProps {
  title: string
  description: string
  action?: ReactNode
}

export function ErrorState({ action, description, title }: ErrorStateProps) {
  const titleId = useId()

  return (
    <section className="ui-state ui-state--error" role="alert" aria-labelledby={titleId}>
      <h1 id={titleId} className="ui-state__title" tabIndex={-1}>
        {title}
      </h1>
      <p className="ui-state__description">{description}</p>
      {action ? <div className="ui-state__action">{action}</div> : null}
    </section>
  )
}
