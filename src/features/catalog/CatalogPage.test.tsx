import { renderWithApp } from '@/test/renderApp'
import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { CatalogPage } from './CatalogPage'

describe('CatalogPage', () => {
  it('combina busca, categoria e disponibilidade', async () => {
    const user = userEvent.setup()
    renderWithApp(<CatalogPage />)

    await user.type(screen.getByRole('searchbox', { name: /buscar um presente/i }), 'toalhas')
    await user.click(screen.getByRole('button', { name: 'Banheiro' }))
    await user.click(screen.getByRole('checkbox', { name: /somente disponíveis/i }))

    expect(screen.getByRole('status')).toHaveTextContent(/nenhum presente/i)
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
    await user.click(screen.getByRole('checkbox', { name: /somente disponíveis/i }))

    expect(screen.getByRole('status')).toHaveTextContent(/nenhum presente/i)
  })

  it('mantém os cartões na ordem das fixtures', () => {
    renderWithApp(<CatalogPage />)

    const names = within(screen.getByLabelText('Presentes encontrados'))
      .getAllByRole('heading', { level: 2 })
      .map((heading) => heading.textContent)
    expect(names.slice(0, 4)).toEqual([
      'Chaleira',
      'Jogo de panelas',
      'Potes herméticos',
      'Cafeteira elétrica',
    ])
  })
})
