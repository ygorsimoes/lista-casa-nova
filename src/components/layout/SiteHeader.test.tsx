import { renderWithApp } from '@/test/renderApp'
import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { SiteHeader } from './SiteHeader'

describe('SiteHeader', () => {
  it('mantém identidade curta e contribuição secundária', () => {
    renderWithApp(<SiteHeader />)

    expect(screen.getByRole('link', { name: 'Nossa lista' })).toHaveAttribute('href', '/')
    expect(screen.getByRole('link', { name: 'Contribuir' })).toHaveAttribute('href', '/pix')
  })
})
