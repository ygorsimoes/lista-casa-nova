import { useDemoSelector } from '@/app/DemoStateProvider'
import { AppShell } from '@/components/layout/AppShell'
import { Button } from '@/components/ui/Button'
import { ErrorState } from '@/components/ui/ErrorState'
import { selectGiftByCode } from '@/domain/selectors'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { GiftDetailsContent } from './GiftDetailsContent'

export function GiftDetailsPage() {
  const { code = '' } = useParams()
  const navigate = useNavigate()
  const entry = useDemoSelector((state) => selectGiftByCode(state, code))

  if (!entry) {
    return (
      <AppShell>
        <ErrorState
          title="Presente não encontrado"
          description="Este presente não faz parte da lista. Você pode voltar ao catálogo para escolher outro."
          action={<Link to="/">Voltar ao catálogo</Link>}
        />
      </AppShell>
    )
  }

  return (
    <AppShell>
      <GiftDetailsContent entry={entry} />
      <Button className="gift-details-page__back" variant="secondary" onClick={() => navigate('/')}>
        Voltar ao catálogo
      </Button>
    </AppShell>
  )
}
