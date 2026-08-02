import { Skeleton } from '@/components/ui/Skeleton'
import { useEffect, useState, type PropsWithChildren } from 'react'

export function InitialLoadingGate({ children }: PropsWithChildren) {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = window.setTimeout(() => setIsLoading(false), 250)
    return () => window.clearTimeout(timer)
  }, [])

  if (!isLoading) return children

  return (
    <main className="loading-gate" role="status" aria-live="polite">
      <span className="loading-gate__label">Carregando a lista</span>
      <Skeleton className="loading-gate__title" />
      <Skeleton className="loading-gate__copy" />
      <Skeleton className="loading-gate__card" />
      <Skeleton className="loading-gate__card" />
    </main>
  )
}
