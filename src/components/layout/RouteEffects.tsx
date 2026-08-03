import { useEffect, useRef } from 'react'
import { useLocation, useNavigationType } from 'react-router-dom'

const pageTitles: Record<string, string> = {
  '/': 'Lista da nossa casa nova',
  '/admin': 'Painel da lista',
  '/pdf': 'Lista para impressão',
  '/pix': 'Contribuir por Pix',
}

export function RouteEffects() {
  const location = useLocation()
  const navigationType = useNavigationType()
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
    const returnedFromDialogToCatalog =
      previousRouteWasDialog.current && navigationType === 'POP' && location.pathname === '/'
    previousRouteWasDialog.current = false
    if (returnedFromDialogToCatalog) {
      return
    }
    document.querySelector<HTMLElement>('h1[tabindex="-1"]')?.focus()
  }, [location.key, location.pathname, location.state, navigationType])

  return null
}
