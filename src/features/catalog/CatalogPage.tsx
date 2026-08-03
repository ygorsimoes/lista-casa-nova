import { useDemoSelector } from '@/app/DemoStateProvider'
import { EmptyState } from '@/components/ui/EmptyState'
import { selectCatalogEntries } from '@/domain/selectors'
import { useState } from 'react'
import { CatalogFilters } from './CatalogFilters'
import { GiftGrid } from './GiftGrid'
import { HeroSection } from './HeroSection'

export interface CatalogViewState {
  query: string
  categorySlug: string | null
  availableOnly: boolean
}

const initialViewState: CatalogViewState = {
  query: '',
  categorySlug: null,
  availableOnly: false,
}

export function CatalogPage() {
  const [filters, setFilters] = useState<CatalogViewState>(initialViewState)
  const categories = useDemoSelector((state) => state.categories)
  const settings = useDemoSelector((state) => state.settings)
  const entries = useDemoSelector((state) => selectCatalogEntries(state, filters))

  return (
    <>
      <HeroSection title={settings.title} message={settings.message} />
      <CatalogFilters
        categories={categories}
        query={filters.query}
        categorySlug={filters.categorySlug}
        availableOnly={filters.availableOnly}
        onQueryChange={(query) => setFilters((current) => ({ ...current, query }))}
        onCategoryChange={(categorySlug) => setFilters((current) => ({ ...current, categorySlug }))}
        onAvailableOnlyChange={(availableOnly) =>
          setFilters((current) => ({ ...current, availableOnly }))
        }
      />
      <p className="catalog-results" role="status" aria-live="polite">
        {entries.length === 0
          ? 'Nenhum presente encontrado'
          : entries.length === 1
            ? '1 presente encontrado'
            : `${entries.length} presentes encontrados`}
      </p>
      {entries.length ? (
        <GiftGrid entries={entries} />
      ) : (
        <EmptyState
          title="Nenhum presente encontrado"
          description="Tente mudar a busca ou os filtros para ver outros presentes."
        />
      )}
    </>
  )
}
