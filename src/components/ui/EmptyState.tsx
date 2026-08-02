import type { ReactNode } from 'react'

export interface EmptyStateProps {
  title: string
  description: string
  action?: ReactNode
}

export function EmptyState({ action, description, title }: EmptyStateProps) {
  return (
    <section className="ui-state" aria-labelledby="empty-state-title">
      <h2 id="empty-state-title" className="ui-state__title">
        {title}
      </h2>
      <p className="ui-state__description">{description}</p>
      {action ? <div className="ui-state__action">{action}</div> : null}
    </section>
  )
}
