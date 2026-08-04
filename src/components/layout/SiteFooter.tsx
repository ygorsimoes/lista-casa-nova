import { useDemoSelector } from '@/app/DemoStateProvider'
import { Heart } from 'lucide-react'
import { Link } from 'react-router'

export function SiteFooter() {
  const footer = useDemoSelector((state) => state.settings.footer)

  return (
    <footer className="site-footer">
      <nav className="site-footer__links" aria-label="Links do protótipo">
        <Link to="/">Nossa lista</Link>
        <Link to="/pdf">Prévia para impressão</Link>
        <Link to="/admin">Painel demonstrativo</Link>
      </nav>
      <p className="site-footer__note">
        <Heart aria-hidden="true" size={16} strokeWidth={1.8} />
        {footer} Protótipo visual: nenhuma ação é salva.
      </p>
    </footer>
  )
}
