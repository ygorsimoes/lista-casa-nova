import { IllustrativeQr } from '@/features/pix/IllustrativeQr'
import type { CatalogEntry, SiteSettings } from '@/domain/types'

export interface PrintableGiftListProps {
  entries: readonly CatalogEntry[]
  settings: SiteSettings
}

function availabilityLabel(entry: CatalogEntry) {
  const { availability } = entry

  if (availability.visualState === 'available') return 'Disponível'
  if (availability.visualState === 'partially-reserved') {
    return `${availability.remainingQuantity} de ${availability.desiredQuantity} disponível(is)`
  }
  if (availability.visualState === 'received') return 'Presente recebido'
  return 'Indisponível'
}

export function PrintableGiftList({ entries, settings }: PrintableGiftListProps) {
  return (
    <section className="printable-sheet" aria-label="Folha A4 demonstrativa">
      <header className="printable-sheet__header">
        <div>
          <h2>{settings.title}</h2>
          <p>Lista demonstrativa para acompanhar os presentes escolhidos.</p>
        </div>
        <IllustrativeQr label="QR ilustrativo" size="small" />
      </header>

      <p className="printable-sheet__instructions">
        Escolha um item e escreva seu nome na coluna de assinatura. Esta folha é apenas uma prévia
        visual do protótipo.
      </p>

      <table className="printable-sheet__table">
        <caption>Presentes da lista</caption>
        <thead>
          <tr>
            <th scope="col">Código</th>
            <th scope="col">Presente</th>
            <th scope="col">Disponibilidade</th>
            <th scope="col">Nome/assinatura</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry) => (
            <tr key={entry.gift.code}>
              <th scope="row" data-label="Código">
                {entry.gift.code}
              </th>
              <td data-label="Presente">{entry.gift.name}</td>
              <td data-label="Disponibilidade">{availabilityLabel(entry)}</td>
              <td data-label="Nome/assinatura">
                <span className="printable-sheet__signature" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <footer className="printable-sheet__footer">
        <span>Prévia A4 demonstrativa</span>
        <span>Página 1 de 1</span>
      </footer>
    </section>
  )
}
