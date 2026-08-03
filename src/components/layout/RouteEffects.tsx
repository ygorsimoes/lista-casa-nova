import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'

const pageTitles: Record<string, string> = {
  '/': 'Lista da nossa casa nova',
  '/admin': 'Painel da lista',
  '/pdf': 'Lista para impressão',
  '/pix': 'Contribuir por Pix',
}

export function RouteEffects() {
  const location = useLocation()
  const previousRouteWasDialog = useRef(false)

  useEffect(() => {
    const title = pageTitles[location.pathname] ?? 'Lista da nossa casa nova'
    document.title = `${title} | Protótipo`

    const backgroundLocation = (
      location.state as { backgroundLocation?: unknown } | null | undefined
    )?.backgroundLocation
    if (backgroundLocation) {
      previousRouteWasDialog.current = true
      return
    }

    window.scrollTo(0, 0)
    if (previousRouteWasDialog.current) {
      previousRouteWasDialog.current = false
      return
    }
    document.querySelector<HTMLElement>('h1[tabindex="-1"]')?.focus()
  }, [location.key, location.pathname, location.state])

  return null
}
