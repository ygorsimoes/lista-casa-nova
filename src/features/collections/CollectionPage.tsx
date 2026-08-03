import { useDemoSelector } from '@/app/DemoStateProvider'
import { AppShell } from '@/components/layout/AppShell'
import { Button } from '@/components/ui/Button'
import { ErrorState } from '@/components/ui/ErrorState'
import { useToast } from '@/components/ui/Toast'
import { selectCollectionBySlug } from '@/domain/selectors'
import { useState } from 'react'
import { Link, useParams } from 'react-router'

export function CollectionPage() {
  const { slug = '' } = useParams()
  const collection = useDemoSelector((state) => selectCollectionBySlug(state, slug))
  const category = useDemoSelector((state) =>
    collection ? state.categories.find(({ id }) => id === collection.categoryId) : undefined,
  )
  const gifts = useDemoSelector((state) =>
    collection ? state.gifts.filter(({ categoryId }) => categoryId === collection.categoryId) : [],
  )
  const { showToast } = useToast()
  const [selectedSuggestion, setSelectedSuggestion] = useState<string | null>(null)

  if (!collection || !category) {
    return (
      <AppShell>
        <ErrorState
          title="Coleção não encontrada"
          description="Esta seleção demonstrativa não existe. Volte à lista para encontrar outro presente."
          action={<Link to="/">Voltar à lista</Link>}
        />
      </AppShell>
    )
  }

  function selectSuggestion(label: string) {
    setSelectedSuggestion(label)
    showToast({ title: 'Demonstração: nenhum site externo foi aberto.' })
  }

  return (
    <AppShell>
      <section className="collection-page" aria-labelledby="collection-title">
        <Link className="collection-page__back" to="/">
          Voltar à lista
        </Link>
        <p className="collection-page__category">{category.name}</p>
        <h1 id="collection-title" tabIndex={-1}>
          {collection.title}
        </h1>
        <p className="collection-page__description">{collection.description}</p>
        <p className="collection-page__notice">
          Todos os endereços desta tela são fictícios. Nenhum site externo será aberto.
        </p>
        <div className="collection-page__gifts" aria-label="Sugestões demonstrativas">
          {gifts.map((gift) => (
            <article key={gift.code} className="collection-page__gift">
              <div>
                <h2>{gift.name}</h2>
                <p>{gift.description}</p>
              </div>
              {gift.suggestions.map((suggestion) => (
                <Button
                  key={suggestion.id}
                  variant="secondary"
                  fullWidth
                  onClick={() => selectSuggestion(suggestion.label)}
                >
                  Ver sugestão demonstrativa: {suggestion.label}
                </Button>
              ))}
            </article>
          ))}
        </div>
        {selectedSuggestion ? (
          <p className="collection-page__feedback" role="status">
            Sugestão demonstrativa selecionada: {selectedSuggestion}. Nenhum site externo foi
            aberto.
          </p>
        ) : null}
      </section>
    </AppShell>
  )
}
