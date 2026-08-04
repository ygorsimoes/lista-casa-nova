import { useGiftList } from '@/app/GiftListProvider'
import { AppShell } from '@/components/layout/AppShell'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { getSupabaseClient } from '@/lib/supabase'
import { useEffect, useState, type FormEvent } from 'react'
import { fetchAdminReservations } from './admin-api'
import { AdminLogin } from './AdminLogin'

export default function AdminPage() {
  const { gifts, refresh } = useGiftList()
  const [signedIn, setSignedIn] = useState(false)
  const [name, setName] = useState('')
  const [reservations, setReservations] = useState<{ giftId: string; guestName: string }[]>([])

  async function loadAdminData() {
    const { data } = await getSupabaseClient().auth.getSession()
    setSignedIn(Boolean(data.session))
    if (data.session) setReservations(await fetchAdminReservations())
  }

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadAdminData()
    }, 0)
    return () => window.clearTimeout(timer)
  }, [])

  async function addGift(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!name.trim()) return
    await getSupabaseClient().from('gifts').insert({ name: name.trim(), preferences: [], sort_order: gifts.length + 1 })
    setName('')
    await refresh()
  }

  async function removeGift(id: string) {
    if (!window.confirm('Remover este presente da lista?')) return
    await getSupabaseClient().from('gifts').delete().eq('id', id)
    await refresh()
    await loadAdminData()
  }

  if (!signedIn) return <AppShell><AdminLogin onEnter={() => void loadAdminData()} /></AppShell>

  return (
    <AppShell>
      <section className="admin-page" aria-labelledby="admin-title">
        <h1 id="admin-title">Administrar lista</h1>
        <form onSubmit={addGift}>
          <Input label="Novo presente" value={name} onChange={(event) => setName(event.target.value)} required />
          <Button type="submit">Adicionar</Button>
        </form>
        <h2>Presentes</h2>
        <ul>{gifts.map((gift) => <li key={gift.id}>{gift.name} <Button variant="danger" onClick={() => void removeGift(gift.id)}>Remover</Button></li>)}</ul>
        <h2>Reservas</h2>
        <ul>{reservations.map((reservation) => <li key={reservation.giftId}>{gifts.find((gift) => gift.id === reservation.giftId)?.name ?? 'Presente removido'} — {reservation.guestName}</li>)}</ul>
        <Button variant="secondary" onClick={() => void getSupabaseClient().auth.signOut().then(loadAdminData)}>Sair</Button>
      </section>
    </AppShell>
  )
}
