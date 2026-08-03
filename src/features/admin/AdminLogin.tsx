import { Button } from '@/components/ui/Button'
import { Info } from 'lucide-react'

interface AdminLoginProps {
  onEnter(): void
}

export function AdminLogin({ onEnter }: AdminLoginProps) {
  return (
    <section className="admin-login" aria-labelledby="admin-login-title">
      <div className="admin-login__panel ui-card">
        <Info aria-hidden="true" size={32} strokeWidth={1.8} />
        <h1 id="admin-login-title" tabIndex={-1}>
          Painel demonstrativo
        </h1>
        <p>
          Não existe autenticação real neste protótipo. Entre sem credenciais para conhecer o resumo
          da lista.
        </p>
        <p className="admin-login__notice">
          O acesso e qualquer alteração existem apenas em memória; recarregar a página restaura a
          demonstração inicial.
        </p>
        <Button fullWidth onClick={onEnter}>
          Entrar na demonstração
        </Button>
      </div>
    </section>
  )
}
