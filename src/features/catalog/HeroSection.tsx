import { Gift, Heart, HeartHandshake } from 'lucide-react'

interface HeroSectionProps {
  title: string
  message: string
}

const steps = [
  { icon: Gift, text: 'Escolha um presente' },
  { icon: HeartHandshake, text: 'Reserve em seu nome' },
  { icon: Heart, text: 'Obrigado' },
]

export function HeroSection({ message, title }: HeroSectionProps) {
  return (
    <section className="catalog-hero" aria-labelledby="catalog-title">
      <div className="catalog-hero__intro">
        <p className="catalog-hero__eyebrow">
          Um novo capítulo começa aqui <span aria-hidden="true">✨</span>
        </p>
        <h1 id="catalog-title" tabIndex={-1}>
          {title}
        </h1>
        <p className="catalog-hero__message">{message}</p>
      </div>
      <ol className="how-it-works__steps" aria-label="Como funciona">
        {steps.map(({ icon: Icon, text }) => (
          <li key={text}>
            <span className="how-it-works__icon">
              <Icon aria-hidden="true" size={22} strokeWidth={1.8} />
            </span>
            <span className="how-it-works__label">{text}</span>
          </li>
        ))}
      </ol>
    </section>
  )
}
