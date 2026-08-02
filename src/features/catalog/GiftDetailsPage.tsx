import { useDemoSelector } from '@/app/DemoStateProvider'
import { AppShell } from '@/components/layout/AppShell'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { ErrorState } from '@/components/ui/ErrorState'
import { selectGiftByCode } from '@/domain/selectors'
import { Link, useNavigate, useParams } from 'react-router-dom'

export function GiftDetailsPage() {
  const { code = '' } = useParams()
  const navigate = useNavigate()
  const entry = useDemoSelector((state) => selectGiftByCode(state, code))

  return (
    <AppShell>
      {entry ? (
        <section className="gift-details" aria-labelledby="gift-details-title">
          <p className="gift-details__category">{entry.category.name}</p>
          <h1 id="gift-details-title" tabIndex={-1}>
            {entry.gift.name}
          </h1>
          <Badge tone={entry.availability.canReserve ? 'available' : 'reserved'}>
            {entry.availability.canReserve ? 'Disponível' : 'Indisponível'}
          </Badge>
          <p>{entry.gift.description}</p>
          <Button variant="secondary" onClick={() => navigate('/')}>
            Voltar ao catálogo
          </Button>
        </section>
      ) : (
        <ErrorState
          title="Presente não encontrado"
          description="Este presente não faz parte da lista. Você pode voltar ao catálogo para escolher outro."
          action={<Link to="/">Voltar ao catálogo</Link>}
        />
      )}
    </AppShell>
  )
}
