import { RouteEffects } from '@/components/layout/RouteEffects'
import { SiteFooter } from '@/components/layout/SiteFooter'
import { SiteHeader } from '@/components/layout/SiteHeader'
import { ToastProvider } from '@/components/ui/Toast'
import type { PropsWithChildren } from 'react'

export function AppShell({ children }: PropsWithChildren) {
  return (
    <ToastProvider>
      <RouteEffects />
      <div className="app-shell">
        <SiteHeader />
        <main className="app-shell__main">{children}</main>
        <SiteFooter />
      </div>
    </ToastProvider>
  )
}
