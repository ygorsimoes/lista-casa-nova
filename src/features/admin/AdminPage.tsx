import { useGiftList } from '@/app/GiftListProvider'
import { AppShell } from '@/components/layout/AppShell'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Dialog } from '@/components/ui/Dialog'
import { Input } from '@/components/ui/Input'
import { Notice } from '@/components/ui/Notice'
import type { Gift } from '@/domain/gifts'
import { getSupabaseClient } from '@/lib/supabase'
import { ArrowLeft, ClipboardList, Gift as GiftIcon, ListChecks, Pencil, Plus, Search, Trash2 } from 'lucide-react'
import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { Link } from 'react-router'
import {
  createAdminGift,
  deleteAdminGift,
  fetchAdminReservations,
  updateAdminGift,
  type AdminGiftInput,
} from './admin-api'
import { AdminLogin } from './AdminLogin'

type CatalogFilter = 'all' | 'available' | 'reserved'

const blankGift = (sortOrder: number): AdminGiftInput => ({
  name: '', imageUrl: '', color: '', description: '', preferences: '', referenceValue: '', referenceUrl: '', sortOrder,
})

function toGiftInput(gift: Gift): AdminGiftInput {
  return {
    name: gift.name,
    imageUrl: gift.imageUrl ?? '',
    color: gift.color ?? '',
    description: gift.description ?? '',
    preferences: gift.preferences.join(', '),
    referenceValue: gift.referenceValue?.toString() ?? '',
    referenceUrl: gift.referenceUrl ?? '',
    sortOrder: gift.sortOrder,
  }
}

function pluralize(count: number, singular: string, plural: string) {
  return `${count} ${count === 1 ? singular : plural}`
}

export default function AdminPage() {
  const { gifts, refresh, reservedGiftIds } = useGiftList()
  const [signedIn, setSignedIn] = useState(false)
  const [reservations, setReservations] = useState<{ giftId: string; guestName: string; createdAt: string }[]>([])
  const [filter, setFilter] = useState<CatalogFilter>('all')
  const [query, setQuery] = useState('')
  const [editingGift, setEditingGift] = useState<Gift | null>(null)
  const [giftForm, setGiftForm] = useState<AdminGiftInput>(() => blankGift(1))
  const [giftToRemove, setGiftToRemove] = useState<Gift | null>(null)
  const [feedback, setFeedback] = useState<{ tone: 'success' | 'error'; message: string } | null>(null)
  const [saving, setSaving] = useState(false)

  async function loadAdminData() {
    const { data } = await getSupabaseClient().auth.getSession()
    setSignedIn(Boolean(data.session))
    if (!data.session) return
    try {
      setReservations(await fetchAdminReservations())
    } catch {
      setFeedback({ tone: 'error', message: 'Não foi possível carregar as reservas agora.' })
    }
  }

  useEffect(() => {
    const timer = window.setTimeout(() => void loadAdminData(), 0)
    return () => window.clearTimeout(timer)
  }, [])

  const availableCount = gifts.length - reservedGiftIds.size
  const filteredGifts = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase('pt-BR')
    return gifts.filter((gift) => {
      const matchesFilter = filter === 'all' || (filter === 'reserved' ? reservedGiftIds.has(gift.id) : !reservedGiftIds.has(gift.id))
      return matchesFilter && gift.name.toLocaleLowerCase('pt-BR').includes(normalizedQuery)
    })
  }, [filter, gifts, query, reservedGiftIds])

  function openCreateForm() {
    setEditingGift(null)
    setGiftForm(blankGift(gifts.length + 1))
    setFeedback(null)
  }

  function openEditForm(gift: Gift) {
    setEditingGift(gift)
    setGiftForm(toGiftInput(gift))
    setFeedback(null)
  }

  function updateForm<Field extends keyof AdminGiftInput>(field: Field, value: AdminGiftInput[Field]) {
    setGiftForm((current) => ({ ...current, [field]: value }))
  }

  async function saveGift(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSaving(true)
    setFeedback(null)
    try {
      if (editingGift) {
        await updateAdminGift(editingGift.id, giftForm)
        setFeedback({ tone: 'success', message: 'Presente atualizado na lista.' })
      } else {
        await createAdminGift(giftForm)
        setFeedback({ tone: 'success', message: 'Presente adicionado à lista.' })
      }
      await refresh()
      setEditingGift(null)
      setGiftForm(blankGift(gifts.length + 1))
    } catch {
      setFeedback({ tone: 'error', message: 'Não foi possível salvar este presente. Tente novamente.' })
    } finally {
      setSaving(false)
    }
  }

  async function removeGift() {
    if (!giftToRemove) return
    setSaving(true)
    setFeedback(null)
    try {
      await deleteAdminGift(giftToRemove.id)
      await Promise.all([refresh(), loadAdminData()])
      setFeedback({ tone: 'success', message: 'Presente removido da lista.' })
      setGiftToRemove(null)
    } catch {
      setFeedback({ tone: 'error', message: 'Não foi possível remover este presente. Tente novamente.' })
    } finally {
      setSaving(false)
    }
  }

  if (!signedIn) return <AppShell><AdminLogin onEnter={() => void loadAdminData()} /></AppShell>

  return (
    <AppShell>
      <section className="admin-page" aria-labelledby="admin-title">
        <header className="admin-page__header">
          <div>
            <p className="admin-page__eyebrow">Casa nova</p>
            <h1 id="admin-title">Painel da lista</h1>
            <p>Organize os presentes e acompanhe as escolhas com tranquilidade.</p>
          </div>
          <div className="admin-page__header-actions">
            <Link className="admin-page__back" to="/"><ArrowLeft aria-hidden="true" size={18} />Ver lista pública</Link>
            <Button variant="ghost" onClick={() => void getSupabaseClient().auth.signOut().then(loadAdminData)}>Sair</Button>
          </div>
        </header>

        <dl className="admin-overview" aria-label="Resumo da lista">
          <div><dt><GiftIcon aria-hidden="true" size={19} />Presentes</dt><dd>{pluralize(gifts.length, 'presente', 'presentes')}</dd></div>
          <div><dt><ListChecks aria-hidden="true" size={19} />Disponíveis</dt><dd>{pluralize(availableCount, 'disponível', 'disponíveis')}</dd></div>
          <div><dt><ClipboardList aria-hidden="true" size={19} />Reservados</dt><dd>{pluralize(reservedGiftIds.size, 'reservado', 'reservados')}</dd></div>
        </dl>

        {feedback ? <Notice className="admin-page__feedback" tone={feedback.tone} role="status">{feedback.message}</Notice> : null}

        <div className="admin-page__content">
          <section className="admin-section admin-section--form" aria-labelledby="gift-form-title">
            <div className="admin-section__heading">
              <div><p className="admin-section__kicker">Manutenção</p><h2 id="gift-form-title">{editingGift ? 'Editar presente' : 'Adicionar presente'}</h2></div>
              {editingGift ? <Button variant="ghost" onClick={openCreateForm}>Cancelar edição</Button> : <Plus aria-hidden="true" size={20} />}
            </div>
            <form className="admin-gift-form" onSubmit={saveGift}>
              <Input label="Nome do presente" value={giftForm.name} onChange={(event) => updateForm('name', event.target.value)} required />
              <Input label="Cor ou acabamento" value={giftForm.color} onChange={(event) => updateForm('color', event.target.value)} placeholder="Ex.: madeira clara" />
              <Input label="Imagem" value={giftForm.imageUrl} onChange={(event) => updateForm('imageUrl', event.target.value)} type="url" placeholder="https://..." />
              <div className="ui-field"><label className="ui-field__label" htmlFor="gift-description">Descrição</label><textarea id="gift-description" className="ui-textarea" value={giftForm.description} onChange={(event) => updateForm('description', event.target.value)} /></div>
              <Input label="Preferências" hint="Separe por vírgulas." value={giftForm.preferences} onChange={(event) => updateForm('preferences', event.target.value)} placeholder="Ex.: vidro, neutro" />
              <Input label="Valor de referência" value={giftForm.referenceValue} onChange={(event) => updateForm('referenceValue', event.target.value)} type="number" min="0" step="0.01" placeholder="Opcional" />
              <Input label="Link de inspiração" value={giftForm.referenceUrl} onChange={(event) => updateForm('referenceUrl', event.target.value)} type="url" placeholder="https://..." />
              <div className="admin-gift-form__actions"><Button type="submit" disabled={saving}>{editingGift ? 'Salvar alterações' : 'Adicionar à lista'}</Button></div>
            </form>
          </section>

          <section className="admin-section admin-section--catalog" aria-labelledby="catalog-title">
            <div className="admin-section__heading"><div><p className="admin-section__kicker">Catálogo</p><h2 id="catalog-title">Presentes da lista</h2></div><Button variant="secondary" onClick={openCreateForm}><Plus aria-hidden="true" size={18} />Novo presente</Button></div>
            <div className="admin-catalog-controls">
              <label className="admin-search"><Search aria-hidden="true" size={18} /><span className="sr-only">Buscar presente</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar presente" /></label>
              <label className="admin-filter">Filtrar catálogo<select value={filter} onChange={(event) => setFilter(event.target.value as CatalogFilter)}><option value="all">Todos</option><option value="available">Disponíveis</option><option value="reserved">Reservados</option></select></label>
            </div>
            <div className="admin-gift-list" aria-label="Catálogo de presentes">
              {filteredGifts.map((gift) => {
                const reserved = reservedGiftIds.has(gift.id)
                return <article className="admin-gift-row" key={gift.id}><div className="admin-gift-row__identity"><span className="admin-gift-row__mark" aria-hidden="true"><GiftIcon size={18} /></span><div><h3>{gift.name}</h3><p>{gift.color ?? 'Sem preferência de cor'}</p></div></div><Badge tone={reserved ? 'reserved' : 'available'}>{reserved ? 'Reservado' : 'Disponível'}</Badge><div className="admin-gift-row__actions"><Button variant="ghost" aria-label={`Editar ${gift.name}`} onClick={() => openEditForm(gift)}><Pencil aria-hidden="true" size={17} />Editar</Button><Button variant="ghost" aria-label={`Remover ${gift.name}`} onClick={() => setGiftToRemove(gift)}><Trash2 aria-hidden="true" size={17} />Remover</Button></div></article>
              })}
              {!filteredGifts.length ? <p className="admin-empty">Nenhum presente encontrado com esse filtro.</p> : null}
            </div>
          </section>

          <section className="admin-section admin-section--reservations" aria-labelledby="reservations-title">
            <div className="admin-section__heading"><div><p className="admin-section__kicker">Acompanhamento</p><h2 id="reservations-title">Reservas</h2></div><span className="admin-section__count">{pluralize(reservations.length, 'reserva', 'reservas')}</span></div>
            <div className="admin-reservation-list" aria-label="Reservas da lista">
              {reservations.map((reservation) => <article className="admin-reservation-row" key={reservation.giftId}><div><strong>{gifts.find((gift) => gift.id === reservation.giftId)?.name ?? 'Presente removido'}</strong><span>Reservado por {reservation.guestName}</span></div><Badge tone="reserved">Reservado</Badge></article>)}
              {!reservations.length ? <p className="admin-empty">Ainda não há presentes reservados.</p> : null}
            </div>
          </section>
        </div>
      </section>
      <Dialog open={giftToRemove !== null} title="Remover presente" description={giftToRemove && reservedGiftIds.has(giftToRemove.id) ? 'Este presente está reservado; removê-lo também libera a reserva.' : 'Esta ação remove o presente da lista pública.'} onClose={() => setGiftToRemove(null)}>
        <div className="admin-confirmation-actions"><Button variant="danger" onClick={() => void removeGift()} disabled={saving}>Remover presente</Button><Button variant="secondary" onClick={() => setGiftToRemove(null)}>Cancelar</Button></div>
      </Dialog>
    </AppShell>
  )
}
