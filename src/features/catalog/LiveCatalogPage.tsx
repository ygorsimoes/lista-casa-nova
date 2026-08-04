import { useGiftList } from '@/app/GiftListProvider'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Dialog } from '@/components/ui/Dialog'
import { Input } from '@/components/ui/Input'
import type { Gift, ReserveResult } from '@/domain/gifts'
import { Gift as GiftIcon, Grid2X2, Sparkles } from 'lucide-react'
import { HeroSection } from './HeroSection'
import { useMemo, useState, type FormEvent } from 'react'

export function ReservationDialog({ gift, onClose }: { gift: Gift | null; onClose(): void }) {
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
      className="reservation-dialog"
      open={gift !== null}
      title={gift ? `Reservar ${gift.name}` : 'Reservar presente'}
      description="Informe apenas seu nome para marcar este presente."
      onClose={onClose}
    >
      {result?.kind === 'reserved' ? (
        <div className="reservation-dialog__success">
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
  const [showAllGifts, setShowAllGifts] = useState(false)
  const availableGifts = useMemo(() => gifts.filter((gift) => !reservedGiftIds.has(gift.id)), [gifts, reservedGiftIds])
  const orderedGifts = useMemo(
    () => [...availableGifts, ...gifts.filter((gift) => reservedGiftIds.has(gift.id))],
    [availableGifts, gifts, reservedGiftIds],
  )
  const visibleGifts = showAllGifts ? orderedGifts : availableGifts

  return (
    <>
      <HeroSection
        title="Lista da Casa Nova"
        message="Escolha um presente, reserve com seu nome e compre onde preferir."
      />
      <section aria-labelledby="catalog-list-title" aria-label="Presentes para escolher">
        <div className="catalog-filters__list-heading live-catalog__heading">
          <div>
            <h2 id="catalog-list-title"><Sparkles aria-hidden="true" size={20} strokeWidth={1.8} />Presentes para escolher</h2>
          </div>
          <div className="live-catalog__filters" aria-label="Exibição dos presentes">
            <Button variant={showAllGifts ? 'ghost' : 'secondary'} aria-pressed={!showAllGifts} onClick={() => setShowAllGifts(false)}>
              <GiftIcon aria-hidden="true" size={16} />Disponíveis ({availableGifts.length})
            </Button>
            <Button variant={showAllGifts ? 'secondary' : 'ghost'} aria-pressed={showAllGifts} onClick={() => setShowAllGifts(true)}>
              <Grid2X2 aria-hidden="true" size={16} />Todos ({gifts.length})
            </Button>
          </div>
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
            {visibleGifts.map((gift, index) => {
              const reserved = reservedGiftIds.has(gift.id)
              return (
                <Card key={gift.id} variant="flat" className={`gift-card${reserved ? ' gift-card--chosen' : ` gift-card--available gift-card--tone-${['peach', 'sage', 'butter'][index % 3]}`}`}>
                  <article>
                    {gift.imageUrl ? <img className="gift-visual gift-visual--image" src={gift.imageUrl} alt="" /> : <span className="gift-visual gift-visual--fallback" aria-hidden="true"><GiftIcon size={20} strokeWidth={1.65} /></span>}
                    <div className="gift-card__content">
                      {gift.color ? <p className="gift-card__category">{gift.color}</p> : null}
                      <h3>{gift.name}</h3>
                      <p className="gift-card__preference">{gift.preferences.slice(0, 2).join(' · ') || gift.description}</p>
                      <p className="gift-card__status">{reserved ? 'Reservado' : 'Disponível'}</p>
                    </div>
                    <Button className="gift-card__open" variant={reserved ? 'secondary' : 'primary'} disabled={reserved} onClick={() => setSelectedGift(gift)}>
                      {reserved ? 'Reservado' : 'Reservar'}
                    </Button>
                  </article>
                </Card>
              )
            })}
            {!visibleGifts.length ? <p className="live-catalog__empty">Todos os presentes desta lista já foram reservados. Obrigado pelo carinho!</p> : null}
          </div>
        ) : null}
      </section>
      <ReservationDialog key={selectedGift?.id ?? 'closed'} gift={selectedGift} onClose={() => { setSelectedGift(null) }} />
    </>
  )
}
