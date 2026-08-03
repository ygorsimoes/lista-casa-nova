import { DemoStateProvider, useDemoActions, useDemoSelector } from '@/app/DemoStateProvider'
import { selectAvailability } from '@/domain/selectors'
import { render, screen } from '@testing-library/react'
import { useEffect } from 'react'
import { describe, expect, it, vi } from 'vitest'

function ReservationProbe({ reserveOnMount }: { reserveOnMount: boolean }) {
  const { reserveGift } = useDemoActions()
  const remainingQuantity = useDemoSelector(
    (state) => selectAvailability(state, 'CZ-001')?.remainingQuantity,
  )

  useEffect(() => {
    if (reserveOnMount) {
      reserveGift({ itemCode: 'CZ-001', firstName: 'Nina', quantity: 1 })
    }
  }, [reserveGift, reserveOnMount])

  return <output aria-label="quantidade disponível">{remainingQuantity}</output>
}

describe('DemoStateProvider', () => {
  it('mantém a reserva somente enquanto o provider está montado', async () => {
    const localStorageSetItem = vi.spyOn(window.localStorage, 'setItem')
    const sessionStorageSetItem = vi.spyOn(window.sessionStorage, 'setItem')
    const firstMount = render(
      <DemoStateProvider>
        <ReservationProbe reserveOnMount />
      </DemoStateProvider>,
    )

    expect(await screen.findByRole('status', { name: /quantidade disponível/i })).toHaveTextContent(
      '0',
    )
    expect(localStorageSetItem).not.toHaveBeenCalled()
    expect(sessionStorageSetItem).not.toHaveBeenCalled()

    firstMount.unmount()

    render(
      <DemoStateProvider>
        <ReservationProbe reserveOnMount={false} />
      </DemoStateProvider>,
    )

    expect(screen.getByRole('status', { name: /quantidade disponível/i })).toHaveTextContent('1')
  })
})
