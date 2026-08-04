import type { Gift, ReserveResult } from '@/domain/gifts'
import { fetchGifts, fetchReservedGiftIds, reserveGift } from '@/features/catalog/catalog-api'
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type PropsWithChildren } from 'react'

interface GiftListContextValue {
  gifts: Gift[]
  reservedGiftIds: Set<string>
  loading: boolean
  error: string | null
  reserve(giftId: string, guestName: string): Promise<ReserveResult>
  refresh(): Promise<void>
}

const GiftListContext = createContext<GiftListContextValue | null>(null)

export function GiftListProvider({ children }: PropsWithChildren) {
  const [gifts, setGifts] = useState<Gift[]>([])
  const [reservedGiftIds, setReservedGiftIds] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [nextGifts, nextReservedGiftIds] = await Promise.all([fetchGifts(), fetchReservedGiftIds()])
      setGifts(nextGifts)
      setReservedGiftIds(nextReservedGiftIds)
    } catch {
      setError('Não foi possível carregar a lista agora. Tente novamente em instantes.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void refresh()
  }, [refresh])

  const reserve = useCallback(
    async (giftId: string, guestName: string) => {
      const result = await reserveGift(giftId, guestName)
      if (result.kind === 'reserved') await refresh()
      return result
    },
    [refresh],
  )

  const value = useMemo(
    () => ({ gifts, reservedGiftIds, loading, error, reserve, refresh }),
    [error, gifts, loading, refresh, reserve, reservedGiftIds],
  )

  return <GiftListContext value={value}>{children}</GiftListContext>
}

// O hook é o contrato público dos dados reais da lista.
// eslint-disable-next-line react-refresh/only-export-components
export function useGiftList(): GiftListContextValue {
  const value = useContext(GiftListContext)
  if (!value) throw new Error('useGiftList deve ser usado dentro de GiftListProvider.')
  return value
}
