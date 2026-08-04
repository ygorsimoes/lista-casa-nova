import { useGiftList } from '@/app/GiftListProvider'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Dialog } from '@/components/ui/Dialog'
import { Input } from '@/components/ui/Input'
import type { Gift, ReserveResult } from '@/domain/gifts'
import { HeroSection } from './HeroSection'
import { useState, type FormEvent } from 'react'

function ReservationDialog({ gift, onClose }: { gift: Gift | null; onClose(): void }) {
  const { reserve } = useGiftList()
  const [name, setName] = useState('')
  const [result, setResult] = useState<ReserveResult | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!gift || !name.trim()) return
    setSubmitting(true)
    setResult(await reserve(gift.id, name))
    setSubmitting(false)
  }

  return (
    <Dialog
      open={gift !== null}
      title={gift ? `Reservar ${gift.name}` : 'Reservar presente'}
      description="Informe apenas seu nome para marcar este presente."
      onClose={onClose}
    >
      {result?.kind === 'reserved' ? (
        <div>
          <p role="status">Pronto! Este presente ficou reservado em seu nome.</p>
          <Button fullWidth onClick={onClose}>Voltar para a lista</Button>
        </div>
      ) : (
        <form className="live-reservation-form" onSubmit={submit} noValidate>
          <Input
            label="Seu nome"
            name="guestName"
            autoComplete="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
          />
          <div className="live-reservation-form__feedback">
            {result?.kind === 'already-reserved' ? <p role="alert">Este presente já foi reservado.</p> : null}
            {result?.kind === 'unavailable' ? <p role="alert">Este presente não está mais disponível.</p> : null}
            {result?.kind === 'failure' ? <p role="alert">Não foi possível reservar agora. Tente novamente.</p> : null}
          </div>
          <div className="reservation-form__actions">
            <Button type="submit" fullWidth disabled={submitting || !name.trim()}>
              {submitting ? 'Reservando…' : 'Confirmar reserva'}
            </Button>
            <Button variant="secondary" fullWidth onClick={onClose}>Agora não</Button>
          </div>
        </form>
      )}
    </Dialog>
  )
}

export function LiveCatalogPage() {
  const { error, gifts, loading, reservedGiftIds, refresh } = useGiftList()
  const [selectedGift, setSelectedGift] = useState<Gift | null>(null)

  return (
    <>
      <HeroSection
        title="Lista da Casa Nova"
        message="Escolha um presente, reserve com seu nome e compre onde preferir."
      />
      <section aria-labelledby="catalog-list-title">
        <div className="catalog-filters__list-heading live-catalog__heading">
          <h2 id="catalog-list-title">Presentes para escolher</h2>
          <p>{gifts.length} itens</p>
        </div>
        {loading ? <p role="status">Carregando a lista…</p> : null}
        {error ? (
          <div>
            <p role="alert">{error}</p>
            <Button variant="secondary" onClick={() => void refresh()}>Tentar novamente</Button>
          </div>
        ) : null}
        {!loading && !error ? (
          <div className="gift-grid">
            {gifts.map((gift) => {
              const reserved = reservedGiftIds.has(gift.id)
              return (
                <Card key={gift.id} variant="flat" className={`gift-card${reserved ? ' gift-card--chosen' : ''}`}>
                  <article>
                    {gift.imageUrl ? <img className="gift-visual" src={gift.imageUrl} alt="" /> : <span className="gift-visual" aria-hidden="true">🎁</span>}
                    <div className="gift-card__content">
                      {gift.color ? <p className="gift-card__category">{gift.color}</p> : null}
                      <h3>{gift.name}</h3>
                      <p className="gift-card__preference">{gift.preferences.slice(0, 2).join(' · ') || gift.description}</p>
                      <p className="gift-card__status">{reserved ? 'Reservado' : 'Disponível'}</p>
                    </div>
                    <Button className="gift-card__open" variant={reserved ? 'secondary' : 'ghost'} disabled={reserved} onClick={() => setSelectedGift(gift)}>
                      {reserved ? 'Reservado' : 'Reservar'}
                    </Button>
                  </article>
                </Card>
              )
            })}
          </div>
        ) : null}
      </section>
      <ReservationDialog gift={selectedGift} onClose={() => { setSelectedGift(null) }} />
    </>
  )
}
