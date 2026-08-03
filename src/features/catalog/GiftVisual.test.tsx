import { GiftVisual, getCategoryEmoji, getGiftEmoji } from './GiftVisual'
import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

describe('GiftVisual', () => {
  it('mapeia presente e usa fallback por categoria', () => {
    expect(getGiftEmoji('CZ-001', 'cooking-pot')).toBe('🫖')
    expect(getGiftEmoji('NOVO', 'bed-double')).toBe('🛏️')
    expect(getCategoryEmoji('washing-machine')).toBe('🧺')
  })

  it('permanece decorativo', () => {
    const { container } = render(
      <GiftVisual itemCode="CZ-001" categoryIcon="cooking-pot" size="detail" />,
    )
    expect(container.firstElementChild).toHaveAttribute('aria-hidden', 'true')
    expect(container.firstElementChild).toHaveTextContent('🫖')
  })
})
