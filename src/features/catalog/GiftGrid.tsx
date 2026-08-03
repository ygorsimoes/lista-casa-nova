import type { CatalogEntry } from '@/domain/types'
import { GiftCard } from './GiftCard'

interface GiftGridProps {
  entries: readonly CatalogEntry[]
}

export function GiftGrid({ entries }: GiftGridProps) {
  return (
    <div className="gift-grid" aria-label="Presentes encontrados">
      {entries.map(({ gift }) => (
        <GiftCard key={gift.code} code={gift.code} />
      ))}
    </div>
  )
}
