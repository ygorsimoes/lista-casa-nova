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
        <Link className="pdf-preview__back" to="/">Voltar para a lista</Link>
        <h1 id="pdf-preview-title" tabIndex={-1}>Lista para impressão</h1>
        <p className="pdf-preview__intro">Imprima ou salve em PDF a lista atualizada. Nomes de reservas não aparecem aqui.</p>
        <Button className="no-print" onClick={() => window.print()} variant="secondary">Imprimir ou salvar em PDF</Button>
        <ul className="pdf-preview__list">
          {gifts.map((gift) => (
            <li key={gift.id}>
              <strong>{gift.name}</strong>
              <span>{reservedGiftIds.has(gift.id) ? 'Reservado' : 'Disponível'}</span>
            </li>
          ))}
        </ul>
      </section>
    </AppShell>
  )
}
