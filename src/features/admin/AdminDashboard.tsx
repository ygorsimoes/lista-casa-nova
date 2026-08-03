import { Button } from '@/components/ui/Button'
import { selectAdminSummary } from '@/domain/selectors'
import { useDemoSelector } from '@/app/DemoStateProvider'
import { useEffect, useRef, useState } from 'react'
import { AdminGiftList } from './AdminGiftList'
import { AdminReservations } from './AdminReservations'
import { AdminSummary } from './AdminSummary'
import { SiteSettingsForm } from './SiteSettingsForm'

interface AdminDashboardProps {
  onExit(): void
}

const sectionLabels = ['Resumo', 'Presentes', 'Reservas', 'Configurações'] as const
type AdminSection = (typeof sectionLabels)[number]

export function AdminDashboard({ onExit }: AdminDashboardProps) {
  const summary = useDemoSelector(selectAdminSummary)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const [activeSection, setActiveSection] = useState<AdminSection>('Resumo')

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
            aria-current={label === activeSection ? 'page' : undefined}
            onClick={() => setActiveSection(label)}
            variant="ghost"
          >
            {label}
          </Button>
        ))}
      </nav>

      {activeSection === 'Resumo' ? <AdminSummary summary={summary} /> : null}
      {activeSection === 'Presentes' ? <AdminGiftList /> : null}
      {activeSection === 'Reservas' ? <AdminReservations /> : null}
      {activeSection === 'Configurações' ? <SiteSettingsForm /> : null}
    </section>
  )
}
