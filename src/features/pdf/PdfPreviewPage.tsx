import { useDemoSelector } from '@/app/DemoStateProvider'
import { AppShell } from '@/components/layout/AppShell'
import { Button } from '@/components/ui/Button'
import { useToast } from '@/components/ui/Toast'
import { selectCatalogEntries } from '@/domain/selectors'
import { CheckCircle2, Download } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { PrintableGiftList } from './PrintableGiftList'
import './print.css'

type PreviewFilter = 'all' | 'available'

export default function PdfPreviewPage() {
  const [filter, setFilter] = useState<PreviewFilter>('all')
  const [downloadSimulated, setDownloadSimulated] = useState(false)
  const { showToast } = useToast()
  const settings = useDemoSelector((state) => state.settings)
  const entries = useDemoSelector((state) =>
    selectCatalogEntries(state, {
      query: '',
      categorySlug: null,
      availableOnly: filter === 'available',
    }),
  )

  function simulateDownload() {
    setDownloadSimulated(true)
    showToast({
      title: 'Download simulado.',
      description: 'Nenhum arquivo foi gerado.',
    })
  }

  return (
    <AppShell>
      <section className="pdf-preview" aria-labelledby="pdf-preview-title">
        <Link className="pdf-preview__back" to="/">
          Voltar para a lista
        </Link>
        <h1 id="pdf-preview-title" tabIndex={-1}>
          Prévia para impressão
        </h1>
        <p className="pdf-preview__intro">
          Confira a lista em uma folha A4 antes de compartilhar. Nenhum PDF será criado neste
          protótipo.
        </p>

        <div className="pdf-preview__controls prototype-controls" aria-label="Filtros da prévia">
          <div className="pdf-preview__filters" aria-label="Filtrar itens da lista">
            <Button
              aria-pressed={filter === 'all'}
              onClick={() => setFilter('all')}
              variant={filter === 'all' ? 'primary' : 'secondary'}
            >
              Todos
            </Button>
            <Button
              aria-pressed={filter === 'available'}
              onClick={() => setFilter('available')}
              variant={filter === 'available' ? 'primary' : 'secondary'}
            >
              Disponíveis
            </Button>
          </div>
          <Button onClick={simulateDownload} variant="secondary">
            <Download aria-hidden="true" size={20} />
            Simular download
          </Button>
        </div>

        <PrintableGiftList entries={entries} settings={settings} />

        <aside className="pdf-preview__notice" aria-label="Limite da prévia">
          <CheckCircle2 aria-hidden="true" size={26} />
          <p>Prévia visual: nenhum PDF será gerado e nenhum arquivo será baixado.</p>
        </aside>
        {downloadSimulated ? (
          <p className="pdf-preview__feedback" role="status">
            Download simulado: nenhum arquivo foi gerado.
          </p>
        ) : null}
      </section>
    </AppShell>
  )
}
