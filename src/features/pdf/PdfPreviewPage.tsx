import { useGiftList } from '@/app/GiftListProvider'
import { AppShell } from '@/components/layout/AppShell'
import { Button } from '@/components/ui/Button'
import { Link } from 'react-router'
import './print.css'

export default function PdfPreviewPage() {
  const { gifts, reservedGiftIds } = useGiftList()

  return (
    <AppShell>
      <section className="pdf-preview" aria-labelledby="pdf-preview-title">
        <div className="pdf-preview__chrome no-print">
          <Link className="pdf-preview__back" to="/">
            Voltar para a lista
          </Link>
          <div className="pdf-preview__heading">
            <h1 id="pdf-preview-title" tabIndex={-1}>
              Lista para impressão
            </h1>
            <p className="pdf-preview__intro">
              Uma folha atualizada e pronta para guardar, imprimir ou salvar em PDF.
            </p>
          </div>
          <Button className="pdf-preview__print" onClick={() => window.print()} variant="secondary">
            Imprimir ou salvar em PDF
          </Button>
        </div>
        <article className="printable-list" aria-labelledby="printable-list-title">
          <header className="printable-list__header">
            <p className="printable-list__kicker">Nossa casa nova</p>
            <h2 id="printable-list-title">Lista da Casa Nova</h2>
            <p>Presentes escolhidos com carinho para este novo capítulo.</p>
          </header>
          <ol className="printable-list__items" aria-label="Presentes da lista">
            {gifts.map((gift) => (
              <li key={gift.id}>
                <span className="printable-list__number" aria-hidden="true">
                  {String(gift.sortOrder).padStart(2, '0')}
                </span>
                <strong>{gift.name}</strong>
                <span
                  className={`printable-list__status${reservedGiftIds.has(gift.id) ? ' is-reserved' : ''}`}
                >
                  {reservedGiftIds.has(gift.id) ? 'Reservado' : 'Disponível'}
                </span>
              </li>
            ))}
          </ol>
          <footer className="printable-list__footer">
            <span>Nomes de reservas não aparecem nesta lista.</span>
            <span>Com carinho, para a nossa casa nova.</span>
          </footer>
        </article>
      </section>
    </AppShell>
  )
}
