import { AppShell } from '@/components/layout/AppShell'
import { ErrorState } from '@/components/ui/ErrorState'
import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <AppShell>
      <ErrorState
        title="Página não encontrada"
        description="Não encontramos esta página, mas a lista de presentes continua aqui para você."
        action={<Link to="/">Voltar ao catálogo</Link>}
      />
    </AppShell>
  )
}
