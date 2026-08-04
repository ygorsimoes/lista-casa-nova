import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { getSupabaseClient } from '@/lib/supabase'
import { useState, type FormEvent } from 'react'

export function AdminLogin({ onEnter }: { onEnter(): void }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    const { error: signInError } = await getSupabaseClient().auth.signInWithPassword({ email, password })
    if (signInError) {
      setError('E-mail ou senha inválidos.')
      return
    }
    onEnter()
  }

  return (
    <section className="admin-login" aria-labelledby="admin-login-title">
      <Card className="admin-login__panel" variant="flat">
        <h1 id="admin-login-title">Painel da lista</h1>
        <p>Entre para adicionar presentes e ver as reservas.</p>
        <form onSubmit={submit}>
          <Input label="E-mail" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
          <Input label="Senha" type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required />
          {error ? <p role="alert">{error}</p> : null}
          <Button type="submit" fullWidth>Entrar</Button>
        </form>
      </Card>
    </section>
  )
}
