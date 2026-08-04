import { AppShell } from '@/components/layout/AppShell'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Link } from 'react-router'
import QRCode from 'qrcode'
import { useEffect, useState } from 'react'
import { createPixPayload } from './pix-payload'

const pixCode = import.meta.env.VITE_PIX_COPY_AND_PASTE as string | undefined
const pixReceiverName = import.meta.env.VITE_PIX_RECEIVER_NAME as string | undefined
const pixReceiverCity = import.meta.env.VITE_PIX_RECEIVER_CITY as string | undefined

export function PixPage() {
  const [copied, setCopied] = useState(false)
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null)
  const payload = pixCode && pixReceiverName && pixReceiverCity ? createPixPayload(pixCode, pixReceiverName, pixReceiverCity) : null

  useEffect(() => {
    if (!payload) return
    void QRCode.toDataURL(payload, { width: 320, margin: 1 }).then(setQrCodeUrl)
  }, [payload])

  async function copyPix() {
    if (!payload) return
    await navigator.clipboard.writeText(payload)
    setCopied(true)
  }

  return (
    <AppShell>
      <section className="pix-page" aria-labelledby="pix-title">
        <Link className="pix-page__back" to="/">Nossa lista</Link>
        <p className="pix-page__eyebrow">Outra forma de presentear <span aria-hidden="true">✨</span></p>
        <h1 id="pix-title" tabIndex={-1}>Contribuir por Pix</h1>
        <p className="pix-page__intro">Se preferir, qualquer valor ajuda nos planos para o nosso novo lar.</p>
        {payload ? (
          <>
            <Card variant="flat" className="pix-page__card">
              <p className="pix-page__label">Pix Copia e Cola</p>
              <code>{payload}</code>
              {qrCodeUrl ? <img src={qrCodeUrl} alt="QR Code para contribuição por Pix" /> : <p>Gerando QR Code…</p>}
            </Card>
            <Button variant="secondary" fullWidth onClick={() => void copyPix()}>Copiar código Pix</Button>
            {copied ? <p role="status">Código Pix copiado.</p> : null}
          </>
        ) : (
          <Card variant="flat" className="pix-page__card">
            <p>Os dados do Pix ainda serão adicionados pelos anfitriões.</p>
          </Card>
        )}
      </section>
    </AppShell>
  )
}
