import { renderWithApp } from '@/test/renderApp'
import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { CatalogPage } from './CatalogPage'

describe('CatalogPage', () => {
  it('não promove coleções como destino do catálogo', () => {
    renderWithApp(<CatalogPage />)

    expect(
      document.querySelector('a[href^="/colecao/"], a[href^="#/colecao/"]'),
    ).not.toBeInTheDocument()
  })

  it('combina busca, categoria e disponibilidade', async () => {
    const user = userEvent.setup()
    renderWithApp(<CatalogPage />)

    await user.type(screen.getByRole('searchbox', { name: /buscar um presente/i }), 'toalhas')
    await user.click(screen.getByRole('button', { name: 'Banheiro' }))
    await user.click(screen.getByRole('checkbox', { name: 'Só disponíveis' }))

    expect(screen.getByRole('status')).toHaveTextContent('Nenhuma ideia encontrada')
  })

  it('expõe o estado selecionado da categoria', async () => {
    const user = userEvent.setup()
    renderWithApp(<CatalogPage />)
    const cozinha = screen.getByRole('button', { name: 'Cozinha' })

    await user.click(cozinha)

    expect(cozinha).toHaveAttribute('aria-pressed', 'true')
  })

  it('limpa a busca e restaura todos os presentes', async () => {
    const user = userEvent.setup()
    renderWithApp(<CatalogPage />)
    const search = screen.getByRole('searchbox', { name: /buscar um presente/i })

    await user.type(search, 'chaleira')
    await user.click(screen.getByRole('button', { name: /limpar busca/i }))

    expect(search).toHaveValue('')
    expect(screen.getByRole('heading', { name: 'Jogo de toalhas' })).toBeVisible()
  })

  it('restaura a categoria Todas após uma seleção', async () => {
    const user = userEvent.setup()
    renderWithApp(<CatalogPage />)

    await user.click(screen.getByRole('button', { name: 'Decoração' }))
    await user.click(screen.getByRole('button', { name: 'Todas' }))

    expect(screen.getByRole('button', { name: 'Todas' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('heading', { name: 'Chaleira' })).toBeVisible()
  })

  it('mostra um estado vazio para decoração disponível', async () => {
    const user = userEvent.setup()
    renderWithApp(<CatalogPage />)

    await user.click(screen.getByRole('button', { name: 'Decoração' }))
    await user.click(screen.getByRole('checkbox', { name: 'Só disponíveis' }))

    expect(screen.getByRole('status')).toHaveTextContent('Nenhuma ideia encontrada')
  })

  it('mantém os cartões na ordem das fixtures', () => {
    renderWithApp(<CatalogPage />)

    const names = within(screen.getByLabelText('Escolha um presente'))
      .getAllByRole('heading', { level: 3 })
      .map((heading) => heading.textContent)
    expect(names.slice(0, 4)).toEqual([
      'Chaleira',
      'Jogo de panelas',
      'Potes herméticos',
      'Cafeteira elétrica',
    ])
  })

  it('usa o elemento search para reunir o campo de busca', () => {
    const { container } = renderWithApp(<CatalogPage />)

    expect(container.querySelector('search')).toContainElement(
      screen.getByRole('searchbox', { name: /buscar um presente/i }),
    )
  })

  it('mantém ações de apoio fora do hero', () => {
    renderWithApp(<CatalogPage />)

    expect(
      screen.queryByRole('link', { name: /contribuir com qualquer valor/i }),
    ).not.toBeInTheDocument()
    expect(
      screen.queryByRole('link', { name: /ver lista para impressão/i }),
    ).not.toBeInTheDocument()
  })

  it('usa linguagem de ideias para zero, uma e várias entradas', async () => {
    const user = userEvent.setup()
    renderWithApp(<CatalogPage />)
    const search = screen.getByRole('searchbox', { name: 'Buscar um presente' })

    expect(screen.getByRole('status')).toHaveTextContent('11 ideias para escolher')
    await user.type(search, 'chaleira')
    expect(screen.getByRole('status')).toHaveTextContent('1 ideia para escolher')
    await user.clear(search)
    await user.type(search, 'resultado impossível')
    expect(screen.getByRole('status')).toHaveTextContent('Nenhuma ideia encontrada')
  })

  it('limpa todos os filtros a partir do estado vazio', async () => {
    const user = userEvent.setup()
    renderWithApp(<CatalogPage />)
    await user.type(screen.getByRole('searchbox', { name: 'Buscar um presente' }), 'inexistente')
    await user.click(screen.getByRole('button', { name: 'Limpar busca e filtros' }))

    expect(screen.getByRole('status')).toHaveTextContent('11 ideias para escolher')
  })
})
