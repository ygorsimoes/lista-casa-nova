import { useDemoSelector } from '@/app/DemoStateProvider'
import { Badge } from '@/components/ui/Badge'
import { selectCatalogEntries } from '@/domain/selectors'
import { getGiftAvailabilityPresentation } from '@/features/catalog/gift-presentation'

export function AdminGiftList() {
  const entries = useDemoSelector((state) =>
    selectCatalogEntries(state, { query: '', categorySlug: null, availableOnly: false }),
  )

  return (
    <section className="admin-panel" aria-labelledby="admin-gifts-title">
      <div className="admin-panel__header">
        <div>
          <h2 id="admin-gifts-title" tabIndex={-1}>
            Presentes da lista
          </h2>
          <p>Código, categoria e disponibilidade são calculados a partir das reservas atuais.</p>
        </div>
      </div>
      <p className="admin-panel__legend">
        Código · Categoria · Desejado · Restante · Estado público
      </p>
      <div className="admin-gift-list" aria-label="Disponibilidade dos presentes">
        {entries.map(({ availability, category, gift }) => {
          const presentation = getGiftAvailabilityPresentation(availability)
          return (
            <article className="admin-gift-list__item" key={gift.code}>
              <p className="admin-gift-list__code">{gift.code}</p>
              <div>
                <h3>{gift.name}</h3>
                <p>{category.name}</p>
              </div>
              <dl>
                <div>
                  <dt>Desejado</dt>
                  <dd>{gift.desiredQuantity}</dd>
                </div>
                <div>
                  <dt>Restante</dt>
                  <dd>
                    {availability.remainingQuantity} restante
                    {availability.remainingQuantity === 1 ? '' : 's'}
                  </dd>
                </div>
              </dl>
              <Badge tone={presentation.tone}>{presentation.label}</Badge>
            </article>
          )
        })}
      </div>
    </section>
  )
}
