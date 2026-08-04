import { Heart } from 'lucide-react'
import { Link } from 'react-router'

export function SiteHeader() {
  return (
    <header className="site-header">
      <Link className="site-header__brand" to="/" aria-label="Nossa lista">
        <Heart aria-hidden="true" size={22} strokeWidth={1.8} />
        <span>Nossa lista</span>
      </Link>
      <Link className="site-header__contribute" to="/pix">
        <Heart aria-hidden="true" size={16} strokeWidth={2} />
        <span>Contribuir por Pix</span>
      </Link>
    </header>
  )
}
