import { Link } from 'react-router-dom'
import { Gift, HeartHandshake, Truck } from 'lucide-react'

interface HeroSectionProps {
  title: string
  message: string
}

const steps = [
  { icon: Gift, text: 'Escolha um presente' },
  { icon: HeartHandshake, text: 'Reserve em seu nome' },
  { icon: Truck, text: 'Combine a entrega' },
]

export function HeroSection({ message, title }: HeroSectionProps) {
  return (
    <section className="catalog-hero" aria-labelledby="catalog-title">
      <div className="catalog-hero__intro">
        <h1 id="catalog-title" tabIndex={-1}>
          {title}
        </h1>
        <p>{message}</p>
      </div>

      <section className="how-it-works" aria-labelledby="how-it-works-title">
        <h2 id="how-it-works-title">Como funciona</h2>
        <ol className="how-it-works__steps">
          {steps.map(({ icon: Icon, text }, index) => (
            <li key={text}>
              <Icon aria-hidden="true" size={42} strokeWidth={1.8} />
              <span className="how-it-works__number">{index + 1}</span>
              <span>{text}</span>
            </li>
          ))}
        </ol>
      </section>

      <div className="catalog-hero__links" aria-label="Outras opções da lista">
        <Link to="/pix">Contribuir com qualquer valor</Link>
        <Link to="/pdf">Ver lista para impressão</Link>
      </div>
    </section>
  )
}
