import { cn } from '@/lib/cn'
import type { HTMLAttributes, ReactNode } from 'react'

type BadgeTone = 'available' | 'reserved' | 'received' | 'neutral'

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone
  children: ReactNode
}

export function Badge({ children, className, tone = 'neutral', ...props }: BadgeProps) {
  return (
    <span className={cn('ui-badge', `ui-badge--${tone}`, className)} {...props}>
      <span className="ui-badge__dot" aria-hidden="true" />
      {children}
    </span>
  )
}
