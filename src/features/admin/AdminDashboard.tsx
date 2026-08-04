import { useDemoSelector } from '@/app/DemoStateProvider'
import { Button } from '@/components/ui/Button'
import { Notice } from '@/components/ui/Notice'
import { selectAdminSummary } from '@/domain/selectors'
import { ArrowLeft, ClipboardList, Gift, House, Info, LogOut, Settings } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
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

type AdminSectionId = (typeof sectionLinks)[number]['id']

export function AdminDashboard({ onExit }: AdminDashboardProps) {
  const summary = useDemoSelector(selectAdminSummary)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const [activeSectionId, setActiveSectionId] = useState<AdminSectionId>('admin-dashboard-title')

  useEffect(() => {
    headingRef.current?.focus()
  }, [])

  function moveToSection(id: AdminSectionId) {
    const heading = document.getElementById(id)
    if (!heading) return
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    setActiveSectionId(id)
    heading.scrollIntoView({ block: 'start', behavior: reducedMotion ? 'auto' : 'smooth' })
    heading.focus({ preventScroll: true })
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
            <button
              key={id}
              type="button"
              aria-current={activeSectionId === id ? 'location' : undefined}
              onClick={() => moveToSection(id)}
            >
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
          <Notice
            className="admin-dashboard__notice"
            tone="demo"
            icon={<Info size={20} strokeWidth={1.8} />}
            aria-label="Modo demonstrativo"
          >
            Modo demonstração — alterações não são salvas
          </Notice>
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
