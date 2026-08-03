import { act, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { InitialLoadingGate } from './InitialLoadingGate'

describe('InitialLoadingGate', () => {
  it('mostra o carregamento inicial por 250 ms antes do conteúdo', () => {
    vi.useFakeTimers()

    render(
      <InitialLoadingGate>
        <p>Catálogo pronto</p>
      </InitialLoadingGate>,
    )

    expect(screen.getByRole('status')).toHaveTextContent(/carregando a lista/i)
    expect(screen.queryByText('Catálogo pronto')).not.toBeInTheDocument()

    act(() => vi.advanceTimersByTime(250))

    expect(screen.queryByRole('status')).not.toBeInTheDocument()
    expect(screen.getByText('Catálogo pronto')).toBeVisible()
  })
})
