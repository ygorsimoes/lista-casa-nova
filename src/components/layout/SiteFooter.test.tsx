import { renderWithApp } from '@/test/renderApp'
import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { SiteFooter } from './SiteFooter'

describe('SiteFooter', () => {
  it('mantém o acesso administrativo discreto e acessível', () => {
    renderWithApp(<SiteFooter />)

    expect(screen.getByRole('link', { name: 'Administrar lista' })).toHaveAttribute(
      'href',
      '/admin',
    )
    expect(screen.queryByText('Administrar')).not.toBeInTheDocument()
  })
})
