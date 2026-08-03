import { renderWithApp } from '@/test/renderApp'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { CollectionPage } from './CollectionPage'

function renderCollection(slug: string) {
  return renderWithApp(<CollectionPage />, {
    route: `/colecao/${slug}`,
    routePath: '/colecao/:slug',
  })
}

describe('CollectionPage', () => {
  it('preserva a rota como referência secundária sem CTA comercial', () => {
    renderCollection('sugestoes-cozinha')

    expect(screen.getByRole('heading', { name: 'Sugestões para a cozinha' })).toBeVisible()
    const notice = screen.getByText(/endereços desta tela são fictícios/i)
    const actions = screen.getAllByRole('button', { name: /ver referência/i })
    expect(actions.length).toBeGreaterThan(0)
    for (const action of actions) {
      expect(action).not.toHaveAttribute('href')
      expect(action).toHaveClass('ui-button--ghost')
      expect(action).not.toHaveClass('ui-button--primary')
    }
    expect(
      notice.compareDocumentPosition(actions[0]) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy()
  })

  it('mantém a referência fictícia na página e confirma a ação visualmente', async () => {
    const user = userEvent.setup()
    renderCollection('sugestoes-cozinha')

    await user.click(screen.getByRole('button', { name: /ver referência: chaleira em inox/i }))

    const feedback = screen
      .getByText(/referência selecionada: chaleira em inox/i)
      .closest('[role="status"]')
    expect(feedback).toHaveAttribute('role', 'status')
    expect(feedback).toHaveTextContent(/nenhum site externo/i)
  })

  it('explica a coleção inexistente e oferece retorno ao catálogo', () => {
    renderCollection('colecao-inexistente')

    expect(screen.getByRole('heading', { name: /coleção não encontrada/i })).toBeVisible()
    expect(screen.getByRole('link', { name: /voltar à lista/i })).toHaveAttribute('href', '/')
  })
})
