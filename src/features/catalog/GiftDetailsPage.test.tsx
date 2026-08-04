import { renderWithApp } from '@/test/renderApp'
import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { GiftDetailsPage } from './GiftDetailsPage'

describe('GiftDetailsPage', () => {
  it.each([
    ['CZ-001', 'Disponível'],
    ['CZ-003', '1 de 2 disponíveis'],
    ['LV-001', 'Já foi escolhido'],
    ['BN-002', 'Já foi escolhido'],
  ])('expõe o status canônico de %s', (code, status) => {
    renderWithApp(<GiftDetailsPage />, {
      route: `/item/${code}`,
      routePath: '/item/:code',
    })

    expect(screen.getByText(status)).toBeVisible()
  })
})
