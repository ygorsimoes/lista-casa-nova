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
  it('apresenta coleção com aviso antes das sugestões demonstrativas', () => {
    renderCollection('sugestoes-cozinha')

    const notice = screen.getByText(/todos os endereços desta tela são fictícios/i)
    const action = screen.getByRole('button', {
      name: /ver sugestão demonstrativa: chaleira em inox/i,
    })

    expect(screen.getByRole('heading', { name: /sugestões para a cozinha/i })).toBeVisible()
    expect(screen.getByText(/^cozinha$/i)).toBeVisible()
    expect(notice.compareDocumentPosition(action) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    expect(action).not.toHaveAttribute('href')
  })

  it('mantém a sugestão fictícia na página e confirma a ação visualmente', async () => {
    const user = userEvent.setup()
    renderCollection('sugestoes-cozinha')

    await user.click(
      screen.getByRole('button', { name: /ver sugestão demonstrativa: chaleira em inox/i }),
    )

    expect(screen.getByText(/sugestão demonstrativa selecionada/i)).toHaveTextContent(
      /nenhum site externo/i,
    )
  })

  it('explica a coleção inexistente e oferece retorno ao catálogo', () => {
    renderCollection('colecao-inexistente')

    expect(screen.getByRole('heading', { name: /coleção não encontrada/i })).toBeVisible()
    expect(screen.getByRole('link', { name: /voltar à lista/i })).toHaveAttribute('href', '/')
  })
})
