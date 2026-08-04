import { renderWithApp } from '@/test/renderApp'
import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { PixPage } from './PixPage'

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('PixPage', () => {
  it('apresenta Pix como outra forma demonstrativa de presentear', () => {
    renderWithApp(<PixPage />, { route: '/pix' })

    expect(screen.getByText(/outra forma de presentear/i)).toBeVisible()
    expect(screen.getByRole('heading', { name: 'Contribuir por Pix' })).toBeVisible()
    const details = screen.getByRole('region', { name: 'Dados Pix demonstrativos' })
    expect(details).toHaveTextContent('DEMO-PIX-NAO-UTILIZAR-0002016304ABCD')
    expect(details).toHaveTextContent('Marina e Rafael — demonstração')
    expect(details).toHaveTextContent('Banco Fictício')
    expect(within(details).getByRole('img', { name: /qr code ilustrativo/i })).toBeVisible()

    const notice = screen.getByText(/nenhuma transferência é processada/i)
    const action = screen.getByRole('button', { name: 'Simular cópia' })

    expect(notice.compareDocumentPosition(action) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    expect(action).toHaveClass('ui-button--secondary')
  })

  it('simula cópia sem chamar a Clipboard API', async () => {
    const writeText = vi.fn()
    vi.stubGlobal('navigator', { clipboard: { writeText } })
    const user = userEvent.setup()
    renderWithApp(<PixPage />, { route: '/pix' })

    await user.click(screen.getByRole('button', { name: /simular cópia/i }))

    expect(writeText).not.toHaveBeenCalled()
    expect(screen.getByText(/cópia simulada: nenhum dado foi copiado/i)).toBeVisible()
    expect(screen.getByRole('status', { name: 'Resultado da cópia' })).toHaveTextContent(
      'Cópia simulada: nenhum dado foi copiado.',
    )
  })
})
