import type { Category } from '@/domain/types'

interface CategoryListProps {
  categories: readonly Category[]
  selectedSlug: string | null
  onSelect(slug: string | null): void
}

export function CategoryList({ categories, onSelect, selectedSlug }: CategoryListProps) {
  return (
    <div className="category-list" aria-label="Filtrar por categoria">
      <button
        type="button"
        className="category-list__button"
        aria-pressed={selectedSlug === null}
        onClick={() => onSelect(null)}
      >
        Todas
      </button>
      {categories.map((category) => (
        <button
          key={category.id}
          type="button"
          className="category-list__button"
          aria-pressed={selectedSlug === category.slug}
          onClick={() => onSelect(category.slug)}
        >
          {category.name}
        </button>
      ))}
    </div>
  )
}
