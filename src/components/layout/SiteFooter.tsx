import { Heart, Settings } from 'lucide-react'
import { Link } from 'react-router'

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <nav className="site-footer__links" aria-label="Links da lista">
        <Link to="/">Nossa lista</Link>
        <Link to="/pdf">Lista para impressão</Link>
        <Link className="site-footer__admin" to="/admin" aria-label="Administrar lista">
          <Settings aria-hidden="true" size={17} strokeWidth={1.8} />
        </Link>
      </nav>
      <p className="site-footer__note">
        <Heart aria-hidden="true" size={16} strokeWidth={1.8} />
        Obrigado por celebrar este momento com a gente.
      </p>
    </footer>
  )
}
