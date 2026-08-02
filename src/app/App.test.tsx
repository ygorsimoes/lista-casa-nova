import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { App } from './App'

describe('App', () => {
  it('apresenta o propósito da lista após o carregamento inicial', async () => {
    render(<App />)

    expect(
      await screen.findByRole('heading', { name: /lista da nossa casa nova/i }),
    ).toBeInTheDocument()
  })
})
