import { Checkbox } from '@/components/ui/Checkbox'
import { Input } from '@/components/ui/Input'
import type { Category } from '@/domain/types'
import { Search, X } from 'lucide-react'
import { CategoryList } from './CategoryList'

interface CatalogFiltersProps {
  categories: readonly Category[]
  query: string
  categorySlug: string | null
  availableOnly: boolean
  onQueryChange(query: string): void
  onCategoryChange(slug: string | null): void
  onAvailableOnlyChange(availableOnly: boolean): void
}

export function CatalogFilters({
  availableOnly,
  categories,
  categorySlug,
  onAvailableOnlyChange,
  onCategoryChange,
  onQueryChange,
  query,
}: CatalogFiltersProps) {
  return (
    <section className="catalog-filters" aria-label="Filtros do catálogo">
      <search className="catalog-search">
        <Search className="catalog-search__icon" aria-hidden="true" size={22} />
        <Input
          type="search"
          label="Buscar um presente"
          placeholder="Buscar: panelas, toalhas, quarto..."
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
        />
        {query ? (
          <button
            type="button"
            className="catalog-search__clear"
            onClick={() => onQueryChange('')}
            aria-label="Limpar busca"
          >
            <X aria-hidden="true" size={20} />
          </button>
        ) : null}
      </search>
      <CategoryList
        categories={categories}
        selectedSlug={categorySlug}
        onSelect={onCategoryChange}
      />
      <div className="catalog-filters__list-heading">
        <h2 id="catalog-list-title">Escolha um presente</h2>
        <Checkbox
          label="Só disponíveis"
          checked={availableOnly}
          onChange={(event) => onAvailableOnlyChange(event.target.checked)}
        />
      </div>
    </section>
  )
}
