import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { App } from './App'

describe('App', () => {
  it('apresenta o propósito da lista', () => {
    render(<App />)

    expect(screen.getByRole('heading', { name: /lista da nossa casa nova/i })).toBeInTheDocument()
  })
})
