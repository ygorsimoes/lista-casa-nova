import { useDemoSelector } from '@/app/DemoStateProvider'
import { AppShell } from '@/components/layout/AppShell'
import { Button } from '@/components/ui/Button'
import { useToast } from '@/components/ui/Toast'
import { CheckCircle2, Info } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { IllustrativeQr } from './IllustrativeQr'

export function PixPage() {
  const pix = useDemoSelector((state) => state.settings.pix)
  const { showToast } = useToast()
  const [copySimulated, setCopySimulated] = useState(false)

  function simulateCopy() {
    setCopySimulated(true)
    showToast({ title: 'Cópia simulada.', description: 'Nenhum dado foi copiado.' })
  }

  return (
    <AppShell>
      <section className="pix-page" aria-labelledby="pix-title">
        <Link className="pix-page__back" to="/">
          Voltar à lista
        </Link>
        <h1 id="pix-title" tabIndex={-1}>
          Contribuir por Pix
        </h1>
        <p className="pix-page__intro">
          Se preferir, você pode contribuir com qualquer valor para os nossos planos da casa nova.
        </p>

        <div className="pix-page__details">
          <dl>
            <div>
              <dt>Destinatário</dt>
              <dd>{pix.recipient}</dd>
            </div>
            <div>
              <dt>Instituição</dt>
              <dd>{pix.institution}</dd>
            </div>
          </dl>
          <label className="pix-page__payload">
            Pix Copia e Cola demonstrativo
            <code>{pix.copyAndPaste}</code>
          </label>
          <Button fullWidth onClick={simulateCopy}>
            Simular cópia
          </Button>
          {copySimulated ? (
            <p className="pix-page__feedback" role="status">
              <CheckCircle2 aria-hidden="true" size={22} />
              Cópia simulada: nenhum dado foi copiado.
            </p>
          ) : null}
        </div>

        <div className="pix-page__qr-card">
          <IllustrativeQr label="QR Code ilustrativo" />
          <p>Este padrão é apenas visual e não pode receber pagamentos.</p>
        </div>

        <aside className="pix-page__notice" aria-label="Aviso importante">
          <Info aria-hidden="true" size={28} />
          <div>
            <h2>Importante</h2>
            <p>Este é um protótipo visual. Nenhuma transferência será processada.</p>
          </div>
        </aside>
      </section>
    </AppShell>
  )
}
