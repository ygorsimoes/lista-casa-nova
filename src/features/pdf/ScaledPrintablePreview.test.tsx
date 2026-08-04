import { createInitialDemoState } from '@/data/initial-state'
import { selectCatalogEntries } from '@/domain/selectors'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import {
  ScaledPrintablePreview,
  getPrintableScale,
  printableHeight,
  printableWidth,
} from './ScaledPrintablePreview'

describe('ScaledPrintablePreview', () => {
  it('limita a escala entre zero e um', () => {
    expect(getPrintableScale(397)).toBeCloseTo(0.5)
    expect(getPrintableScale(794)).toBe(1)
    expect(getPrintableScale(1200)).toBe(1)
    expect(getPrintableScale(-10)).toBe(0)
    expect(printableHeight / printableWidth).toBeCloseTo(297 / 210, 2)
  })

  it('preserva a tabela semântica sem ResizeObserver', () => {
    const state = createInitialDemoState()
    const entries = selectCatalogEntries(state, {
      query: '',
      categorySlug: null,
      availableOnly: false,
    })

    render(<ScaledPrintablePreview entries={entries} settings={state.settings} />)

    expect(screen.getByRole('table', { name: 'Presentes da lista' })).toBeVisible()
    expect(screen.getByRole('columnheader', { name: 'Nome/assinatura' })).toBeVisible()
  })
})
