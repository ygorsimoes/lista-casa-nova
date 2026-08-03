import { cn } from '@/lib/cn'
import { forwardRef, type HTMLAttributes, type ReactNode } from 'react'

export type NoticeTone = 'info' | 'demo' | 'success' | 'error'

export interface NoticeProps extends HTMLAttributes<HTMLDivElement> {
  tone?: NoticeTone
  icon?: ReactNode
}

export const Notice = forwardRef<HTMLDivElement, NoticeProps>(function Notice(
  { children, className, icon, tone = 'info', ...props },
  ref,
) {
  return (
    <div ref={ref} className={cn('ui-notice', `ui-notice--${tone}`, className)} {...props}>
      {icon ? (
        <span className="ui-notice__icon" aria-hidden="true">
          {icon}
        </span>
      ) : null}
      <div className="ui-notice__content">{children}</div>
    </div>
  )
})
