import type { Category } from '@/domain/types'
import { cn } from '@/lib/cn'

const categoryEmojis: Record<Category['icon'], string> = {
  'cooking-pot': '🍳',
  'bed-double': '🛏️',
  bath: '🛁',
  'washing-machine': '🧺',
  lamp: '💡',
}

const giftEmojis: Readonly<Record<string, string>> = {
  'CZ-001': '🫖',
  'CZ-002': '🍳',
  'CZ-003': '🫙',
  'CZ-004': '☕',
  'QT-001': '🛏️',
  'QT-002': '☁️',
  'BN-001': '🧴',
  'BN-002': '🛁',
  'LV-001': '🧺',
  'LV-002': '👕',
  'DC-001': '💡',
}

export type GiftVisualSize = 'list' | 'detail' | 'summary'

export interface GiftVisualProps {
  itemCode: string
  categoryIcon: Category['icon']
  size?: GiftVisualSize
  className?: string
}

// Helpers compartilhados com as superfícies de catálogo.
// eslint-disable-next-line react-refresh/only-export-components
export function getCategoryEmoji(icon: Category['icon']) {
  return categoryEmojis[icon] ?? '🎁'
}

// eslint-disable-next-line react-refresh/only-export-components
export function getGiftEmoji(itemCode: string, categoryIcon: Category['icon']) {
  return giftEmojis[itemCode] ?? getCategoryEmoji(categoryIcon)
}

export function GiftVisual({ categoryIcon, className, itemCode, size = 'list' }: GiftVisualProps) {
  return (
    <span aria-hidden="true" className={cn('gift-visual', `gift-visual--${size}`, className)}>
      {getGiftEmoji(itemCode, categoryIcon)}
    </span>
  )
}
