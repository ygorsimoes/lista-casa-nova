import { Heart } from 'lucide-react'
import { Link } from 'react-router-dom'

export function SiteHeader() {
  return (
    <header className="site-header">
      <Link className="site-header__brand" to="/" aria-label="Voltar para a lista de presentes">
        <Heart aria-hidden="true" size={24} strokeWidth={1.8} />
        <span>Lista da nossa casa nova</span>
      </Link>
      <Link className="site-header__pix" to="/pix">
        Pix
      </Link>
    </header>
  )
}
