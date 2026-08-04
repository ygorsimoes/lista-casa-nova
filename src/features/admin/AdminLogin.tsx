import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Info } from 'lucide-react'
import { useEffect, useRef } from 'react'

interface AdminLoginProps {
  onEnter(): void
  focusTitle?: boolean
}

export function AdminLogin({ focusTitle = false, onEnter }: AdminLoginProps) {
  const headingRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    if (focusTitle) headingRef.current?.focus()
  }, [focusTitle])

  return (
    <section className="admin-login" aria-labelledby="admin-login-title">
      <Card className="admin-login__panel" variant="flat">
        <Info aria-hidden="true" size={32} strokeWidth={1.8} />
        <h1 id="admin-login-title" ref={headingRef} tabIndex={-1}>
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
      </Card>
    </section>
  )
}
