import type { AdminSummaryData } from '@/domain/selectors'
import { CheckCircle2, Clock3, HandHeart, ListChecks } from 'lucide-react'

interface AdminSummaryProps {
  summary: AdminSummaryData
}

const summaryCards = [
  {
    key: 'availableItems',
    label: 'Itens disponíveis',
    Icon: CheckCircle2,
    tone: 'available',
  },
  {
    key: 'reservedItems',
    label: 'Itens reservados',
    Icon: Clock3,
    tone: 'reserved',
  },
  {
    key: 'receivedItems',
    label: 'Itens recebidos',
    Icon: HandHeart,
    tone: 'received',
  },
  {
    key: 'activeReservations',
    label: 'Reservas ativas',
    Icon: ListChecks,
    tone: 'active',
  },
] as const satisfies readonly {
  key: keyof AdminSummaryData
  label: string
  Icon: typeof CheckCircle2
  tone: string
}[]

export function AdminSummary({ summary }: AdminSummaryProps) {
  return (
    <dl className="admin-summary">
      {summaryCards.map(({ key, label, Icon, tone }) => (
        <div className={`admin-summary__card admin-summary__card--${tone}`} key={key}>
          <dt className="admin-summary__label">
            <Icon aria-hidden="true" size={28} strokeWidth={1.8} />
            <span>{label}</span>
          </dt>
          <dd className="admin-summary__value">{summary[key]}</dd>
        </div>
      ))}
    </dl>
  )
}
