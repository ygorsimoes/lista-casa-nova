import { renderWithApp } from '@/test/renderApp'
import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { SiteHeader } from './SiteHeader'

describe('SiteHeader', () => {
  it('mantém a contribuição por Pix em destaque', () => {
    renderWithApp(<SiteHeader />)

    expect(screen.getByRole('link', { name: 'Nossa lista' })).toHaveAttribute('href', '/')
    expect(screen.getByRole('link', { name: 'Contribuir por Pix' })).toHaveAttribute('href', '/pix')
    expect(screen.getByRole('link', { name: 'Contribuir por Pix' })).toHaveClass(
      'site-header__contribute',
    )
  })
})
