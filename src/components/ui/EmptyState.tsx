import { useId, type ReactNode } from 'react'

export interface EmptyStateProps {
  title: string
  description: string
  action?: ReactNode
}

export function EmptyState({ action, description, title }: EmptyStateProps) {
  const titleId = useId()

  return (
    <section className="ui-state" aria-labelledby={titleId}>
      <h2 id={titleId} className="ui-state__title">
        {title}
      </h2>
      <p className="ui-state__description">{description}</p>
      {action ? <div className="ui-state__action">{action}</div> : null}
    </section>
  )
}
