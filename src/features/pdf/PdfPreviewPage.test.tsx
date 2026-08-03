import { renderWithApp } from '@/test/renderApp'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import PdfPreviewPage from './PdfPreviewPage'

const originalCreateObjectUrl = Object.getOwnPropertyDescriptor(URL, 'createObjectURL')
const originalPrint = Object.getOwnPropertyDescriptor(window, 'print')

afterEach(() => {
  if (originalCreateObjectUrl) {
    Object.defineProperty(URL, 'createObjectURL', originalCreateObjectUrl)
  } else {
    Reflect.deleteProperty(URL, 'createObjectURL')
  }
  if (originalPrint) Object.defineProperty(window, 'print', originalPrint)
  vi.restoreAllMocks()
})

describe('PdfPreviewPage', () => {
  it('apresenta a lista A4 demonstrativa sem oferecer download real', () => {
    renderWithApp(<PdfPreviewPage />, { route: '/pdf' })

    expect(screen.getByRole('heading', { name: /prévia para impressão/i })).toBeVisible()
    expect(screen.getByRole('region', { name: /folha a4 demonstrativa/i })).toHaveTextContent(
      /chaleira/i,
    )
    expect(screen.getByText(/escolha um item e escreva seu nome/i)).toBeVisible()
    expect(screen.getByRole('columnheader', { name: /nome\/assinatura/i })).toBeVisible()
    expect(screen.getAllByText(/disponível/i)).not.toHaveLength(0)
    expect(screen.getByText(/^indisponível$/i)).toBeVisible()
    expect(screen.getByRole('img', { name: /qr code ilustrativo, não utilizável/i })).toBeVisible()
    expect(screen.queryByRole('link', { name: /download/i })).not.toBeInTheDocument()
  })

  it('simula o download sem criar arquivos ou chamar a impressão do navegador', async () => {
    const createObjectUrl = vi.fn()
    const print = vi.fn()
    Object.defineProperty(URL, 'createObjectURL', { configurable: true, value: createObjectUrl })
    Object.defineProperty(window, 'print', { configurable: true, value: print })
    const user = userEvent.setup()
    renderWithApp(<PdfPreviewPage />, { route: '/pdf' })

    await user.click(screen.getByRole('button', { name: /simular download/i }))

    expect(createObjectUrl).not.toHaveBeenCalled()
    expect(print).not.toHaveBeenCalled()
    expect(
      screen
        .getAllByRole('status')
        .some((status) => /nenhum arquivo foi gerado/i.test(status.textContent ?? '')),
    ).toBe(true)
  })
})
