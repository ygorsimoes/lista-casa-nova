import { DemoStateProvider } from '@/app/DemoStateProvider'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { MemoryRouter, Route, Routes, useLocation } from 'react-router'
import { GiftCard } from './GiftCard'

function LocationProbe() {
  const location = useLocation()
  return <output>{JSON.stringify({ pathname: location.pathname, state: location.state })}</output>
}

function renderCard(code: string) {
  return render(
    <MemoryRouter initialEntries={['/']}>
      <DemoStateProvider>
        <Routes>
          <Route path="/" element={<GiftCard code={code} />} />
          <Route path="/item/:code" element={<LocationProbe />} />
        </Routes>
      </DemoStateProvider>
    </MemoryRouter>,
  )
}

describe('GiftCard', () => {
  it('mostra ação reservável e rótulo disponível para a chaleira', () => {
    renderCard('CZ-001')

    expect(screen.getByText('Disponível')).toBeVisible()
    expect(screen.getByRole('button', { name: /quero dar este presente: chaleira/i })).toBeVisible()
  })

  it('mostra detalhes e indisponibilidade para toalhas recebidas', () => {
    renderCard('BN-002')

    expect(screen.getByText('Presente recebido')).toBeVisible()
    expect(screen.getByRole('button', { name: /ver detalhes: jogo de toalhas/i })).toBeVisible()
  })

  it('mostra a quantidade restante para um presente parcialmente reservado', () => {
    renderCard('CZ-003')

    expect(screen.getByText('1 de 2 disponíveis')).toBeVisible()
    expect(
      screen.getByRole('button', { name: /quero dar este presente: potes herméticos/i }),
    ).toBeVisible()
  })

  it('mostra detalhes para um presente reservado', () => {
    renderCard('LV-001')

    expect(screen.getByText('Indisponível')).toBeVisible()
    expect(screen.getByRole('button', { name: /ver detalhes: cesto de roupas/i })).toBeVisible()
  })

  it('navega para o item ao acionar o cartão', async () => {
    const user = userEvent.setup()
    renderCard('CZ-001')

    await user.click(screen.getByRole('button', { name: /chaleira/i }))

    expect(screen.getByRole('status')).toHaveTextContent('"pathname":"/item/CZ-001"')
    expect(screen.getByRole('status')).toHaveTextContent('"backgroundLocation":{"pathname":"/"')
  })
})
