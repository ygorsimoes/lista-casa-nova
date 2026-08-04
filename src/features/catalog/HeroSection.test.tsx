import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { HeroSection } from './HeroSection'

describe('HeroSection', () => {
  it('apresenta contexto afetivo e exatamente três passos', () => {
    render(<HeroSection title="Lista da nossa casa nova" message="Escolha com carinho." />)

    expect(screen.getByText(/um novo capítulo começa aqui/i)).toBeVisible()
    expect(screen.getByRole('heading', { name: 'Lista da nossa casa nova' })).toBeVisible()
    const steps = screen.getByRole('list', { name: 'Como funciona' })
    expect(within(steps).getAllByRole('listitem')).toHaveLength(3)
    expect(steps).toHaveTextContent('Escolha um presente')
    expect(steps).toHaveTextContent('Reserve em seu nome')
    expect(steps).toHaveTextContent('Obrigado')
    expect(screen.queryByRole('link')).not.toBeInTheDocument()
  })
})
