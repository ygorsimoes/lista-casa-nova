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
  it.each([
    ['CZ-001', 'Disponível', 'Ver Chaleira'],
    ['CZ-003', '1 de 2 disponíveis', 'Ver Potes herméticos'],
    ['LV-001', 'Já foi escolhido', 'Ver Cesto de roupas'],
    ['BN-002', 'Já foi escolhido', 'Ver Jogo de toalhas'],
  ])('mostra estado e ação editorial para %s', (code, status, action) => {
    renderCard(code)

    expect(screen.getByText(status)).toBeVisible()
    const button = screen.getByRole('button', { name: action })
    expect(button).toHaveClass('ui-button--ghost')
    expect(button).not.toHaveClass('ui-button--primary')
  })

  it('navega para o item ao acionar o cartão', async () => {
    const user = userEvent.setup()
    renderCard('CZ-001')

    await user.click(screen.getByRole('button', { name: 'Ver Chaleira' }))

    expect(screen.getByRole('status')).toHaveTextContent('"pathname":"/item/CZ-001"')
    expect(screen.getByRole('status')).toHaveTextContent('"backgroundLocation":{"pathname":"/"')
  })
})
