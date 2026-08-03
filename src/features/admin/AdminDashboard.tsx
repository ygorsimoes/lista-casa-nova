import { Button } from '@/components/ui/Button'
import { selectAdminSummary } from '@/domain/selectors'
import { useDemoSelector } from '@/app/DemoStateProvider'
import { useEffect, useRef } from 'react'
import { AdminSummary } from './AdminSummary'

interface AdminDashboardProps {
  onExit(): void
}

const sectionLabels = ['Resumo', 'Presentes', 'Reservas', 'Configurações'] as const

export function AdminDashboard({ onExit }: AdminDashboardProps) {
  const summary = useDemoSelector(selectAdminSummary)
  const headingRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    headingRef.current?.focus()
  }, [])

  return (
    <section className="admin-dashboard" aria-labelledby="admin-dashboard-title">
      <aside className="admin-dashboard__notice" aria-label="Modo demonstrativo">
        Alterações não são salvas: este painel é apenas uma demonstração visual.
      </aside>
      <header className="admin-dashboard__header">
        <div>
          <h1 id="admin-dashboard-title" ref={headingRef} tabIndex={-1}>
            Visão geral
          </h1>
          <p>Acompanhe a disponibilidade da lista com dados derivados das reservas.</p>
        </div>
        <Button onClick={onExit} variant="secondary">
          Sair da demonstração
        </Button>
      </header>

      <nav className="admin-dashboard__sections" aria-label="Seções do painel">
        {sectionLabels.map((label) => (
          <Button
            key={label}
            aria-current={label === 'Resumo' ? 'page' : undefined}
            disabled={label !== 'Resumo'}
            variant="ghost"
          >
            {label}
          </Button>
        ))}
      </nav>

      <AdminSummary summary={summary} />
      <p className="admin-dashboard__scope">
        Nesta etapa, a visão geral está disponível. Operações sobre presentes e configurações
        continuam fora do escopo deste protótipo.
      </p>
    </section>
  )
}
