import { cn } from '@/lib/cn'
import type { HTMLAttributes } from 'react'

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'elevated' | 'flat'
}

export function Card({ className, variant = 'elevated', ...props }: CardProps) {
  return <div className={cn('ui-card', `ui-card--${variant}`, className)} {...props} />
}
