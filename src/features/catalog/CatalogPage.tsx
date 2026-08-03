import { useDemoSelector } from '@/app/DemoStateProvider'
import { EmptyState } from '@/components/ui/EmptyState'
import { selectCatalogEntries } from '@/domain/selectors'
import { useState } from 'react'
import { Button } from '@/components/ui/Button'
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

// Compartilhado com a atualização acessível da quantidade de ideias.
// eslint-disable-next-line react-refresh/only-export-components
export function getCatalogResultLabel(count: number) {
  if (count === 0) return 'Nenhuma ideia encontrada'
  if (count === 1) return '1 ideia para escolher'
  return `${count} ideias para escolher`
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
        {getCatalogResultLabel(entries.length)}
      </p>
      {entries.length ? (
        <GiftGrid entries={entries} />
      ) : (
        <EmptyState
          title="Nenhuma ideia encontrada"
          description="Tente mudar a busca ou os filtros para ver outros presentes."
          action={
            filters.query || filters.categorySlug || filters.availableOnly ? (
              <Button variant="secondary" onClick={() => setFilters(initialViewState)}>
                Limpar busca e filtros
              </Button>
            ) : undefined
          }
        />
      )}
    </>
  )
}
