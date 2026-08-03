import { useDemoSelector } from '@/app/DemoStateProvider'
import { AppShell } from '@/components/layout/AppShell'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Notice } from '@/components/ui/Notice'
import { useToast } from '@/components/ui/Toast'
import { CheckCircle2, Info } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router'
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
          Nossa lista
        </Link>
        <p className="pix-page__eyebrow">
          Outra forma de presentear <span aria-hidden="true">✨</span>
        </p>
        <h1 id="pix-title" tabIndex={-1}>
          Contribuir por Pix
        </h1>
        <p className="pix-page__intro">
          Se preferir, qualquer valor ajuda nos planos para o nosso novo lar.
        </p>

        <Card variant="flat" className="pix-page__card">
          <section aria-label="Dados Pix demonstrativos">
            <p className="pix-page__label">Chave demonstrativa</p>
            <strong>Pix Copia e Cola</strong>
            <code>{pix.copyAndPaste}</code>
            <div className="pix-page__meta">
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
              <IllustrativeQr label="QR Code ilustrativo" />
            </div>
          </section>
        </Card>
        <Notice tone="demo" icon={<Info size={20} />}>
          Demonstração visual: nenhuma transferência é processada e nada é copiado.
        </Notice>
        <Button variant="secondary" fullWidth onClick={simulateCopy}>
          Simular cópia
        </Button>
        {copySimulated ? (
          <Notice
            tone="success"
            role="status"
            aria-label="Resultado da cópia"
            icon={<CheckCircle2 size={20} />}
          >
            Cópia simulada: nenhum dado foi copiado.
          </Notice>
        ) : null}
      </section>
    </AppShell>
  )
}
