import { useDemoSelector } from '@/app/DemoStateProvider'
import { Button } from '@/components/ui/Button'
import { selectAdminSummary } from '@/domain/selectors'
import { ArrowLeft, ClipboardList, Gift, House, Info, LogOut, Settings } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { Link } from 'react-router'
import { AdminGiftList } from './AdminGiftList'
import { AdminReservations } from './AdminReservations'
import { AdminSummary } from './AdminSummary'
import { SiteSettingsForm } from './SiteSettingsForm'

interface AdminDashboardProps {
  onExit(): void
}

const sectionLinks = [
  { id: 'admin-dashboard-title', label: 'Resumo', Icon: House },
  { id: 'admin-gifts-title', label: 'Presentes', Icon: Gift },
  { id: 'admin-reservations-title', label: 'Reservas', Icon: ClipboardList },
  { id: 'site-settings-title', label: 'Configurações', Icon: Settings },
] as const

export function AdminDashboard({ onExit }: AdminDashboardProps) {
  const summary = useDemoSelector(selectAdminSummary)
  const headingRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    headingRef.current?.focus()
  }, [])

  function moveToSection(id: string) {
    document.getElementById(id)?.scrollIntoView({ block: 'start' })
  }

  return (
    <div className="admin-shell">
      <aside className="admin-shell__sidebar">
        <div className="admin-shell__identity">
          <span className="admin-shell__mark" aria-hidden="true">
            CN
          </span>
          <strong>Administração</strong>
        </div>
        <nav className="admin-shell__nav" aria-label="Administração">
          {sectionLinks.map(({ Icon, id, label }) => (
            <button key={id} type="button" onClick={() => moveToSection(id)}>
              <Icon aria-hidden="true" size={20} strokeWidth={1.8} />
              {label}
            </button>
          ))}
        </nav>
        <div className="admin-shell__actions">
          <Link to="/">
            <ArrowLeft aria-hidden="true" size={20} strokeWidth={1.8} />
            Voltar para a lista
          </Link>
          <Button fullWidth onClick={onExit} variant="ghost">
            <LogOut aria-hidden="true" size={20} strokeWidth={1.8} />
            Sair da demonstração
          </Button>
        </div>
      </aside>
      <main className="admin-shell__content">
        <section className="admin-dashboard" aria-labelledby="admin-dashboard-title">
          <aside className="admin-dashboard__notice" aria-label="Modo demonstrativo">
            <Info aria-hidden="true" size={20} strokeWidth={1.8} />
            Modo demonstração — alterações não são salvas
          </aside>
          <header className="admin-dashboard__header">
            <h1 id="admin-dashboard-title" ref={headingRef} tabIndex={-1}>
              Painel da lista
            </h1>
            <p>Acompanhe e ajuste o protótipo visual.</p>
          </header>
          <AdminSummary summary={summary} />
          <div className="admin-dashboard__operations">
            <AdminGiftList />
            <AdminReservations />
            <SiteSettingsForm />
          </div>
        </section>
      </main>
    </div>
  )
}
