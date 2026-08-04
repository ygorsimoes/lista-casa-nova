import { GiftListProvider } from '@/app/GiftListProvider'
import { InitialLoadingGate } from '@/app/InitialLoadingGate'
import { AppRoutes } from '@/app/routes'
import { ToastProvider } from '@/components/ui/Toast'
import { HashRouter } from 'react-router'

export function App() {
  return (
    <HashRouter>
      <GiftListProvider>
        <ToastProvider>
          <InitialLoadingGate>
            <AppRoutes />
          </InitialLoadingGate>
        </ToastProvider>
      </GiftListProvider>
    </HashRouter>
  )
}
