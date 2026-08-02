import type { ReactNode } from 'react'

export interface ErrorStateProps {
  title: string
  description: string
  action?: ReactNode
}

export function ErrorState({ action, description, title }: ErrorStateProps) {
  return (
    <section className="ui-state ui-state--error" role="alert" aria-labelledby="error-state-title">
      <h2 id="error-state-title" className="ui-state__title">
        {title}
      </h2>
      <p className="ui-state__description">{description}</p>
      {action ? <div className="ui-state__action">{action}</div> : null}
    </section>
  )
}
