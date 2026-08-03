import { ToastProvider, useToast } from '@/components/ui/Toast'
import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

function ToastHarness() {
  const { showToast } = useToast()

  return (
    <>
      <p>Conteúdo persistente da página</p>
      <button
        type="button"
        onClick={() => showToast({ title: 'Ação demonstrada', description: 'Nada foi salvo.' })}
      >
        Confirmar
      </button>
    </>
  )
}

describe('Toast', () => {
  it('anuncia uma confirmação sem substituir o conteúdo persistente', async () => {
    const user = userEvent.setup()
    render(
      <ToastProvider>
        <ToastHarness />
      </ToastProvider>,
    )

    await user.click(screen.getByRole('button', { name: /confirmar/i }))

    expect(screen.getByRole('status')).toHaveTextContent(/ação demonstrada/i)
    expect(screen.getByText(/conteúdo persistente da página/i)).toBeInTheDocument()
  })

  it('remove a confirmação depois de cinco segundos', () => {
    vi.useFakeTimers()
    render(
      <ToastProvider>
        <ToastHarness />
      </ToastProvider>,
    )

    act(() => {
      screen.getByRole('button', { name: /confirmar/i }).click()
    })

    expect(screen.getByRole('status')).toBeInTheDocument()

    act(() => {
      vi.advanceTimersByTime(5_000)
    })

    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })
})
