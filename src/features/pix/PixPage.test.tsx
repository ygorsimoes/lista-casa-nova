import { renderWithApp } from '@/test/renderApp'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { PixPage } from './PixPage'

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('PixPage', () => {
  it('apresenta o aviso inequívoco de protótipo antes da ação Pix', () => {
    renderWithApp(<PixPage />, { route: '/pix' })

    expect(screen.getByText(/marina e rafael — demonstração/i)).toBeVisible()
    expect(screen.getByText(/banco fictício/i)).toBeVisible()
    expect(screen.getByText(/^chave pix$/i)).toBeVisible()
    expect(screen.getByText(/demo-pix-nao-utilizar/i)).toBeVisible()
    expect(
      screen.getByText(/protótipo visual.*nenhuma transferência será processada/i),
    ).toBeVisible()
    expect(screen.getByRole('img', { name: /qr code ilustrativo, não utilizável/i })).toBeVisible()
    expect(screen.getByRole('link', { name: /voltar à lista/i })).toHaveAttribute('href', '/')

    const notice = screen.getByText(/protótipo visual.*nenhuma transferência será processada/i)
    const action = screen.getByRole('button', { name: /simular cópia/i })

    expect(notice.compareDocumentPosition(action) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
  })

  it('simula cópia sem chamar a Clipboard API', async () => {
    const writeText = vi.fn()
    vi.stubGlobal('navigator', { clipboard: { writeText } })
    const user = userEvent.setup()
    renderWithApp(<PixPage />, { route: '/pix' })

    await user.click(screen.getByRole('button', { name: /simular cópia/i }))

    expect(writeText).not.toHaveBeenCalled()
    expect(screen.getByText(/cópia simulada: nenhum dado foi copiado/i)).toBeVisible()
  })
})
