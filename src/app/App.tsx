import { GiftListProvider } from '@/app/GiftListProvider'
import { DemoStateProvider } from '@/app/DemoStateProvider'
import { InitialLoadingGate } from '@/app/InitialLoadingGate'
import { AppRoutes } from '@/app/routes'
import { ToastProvider } from '@/components/ui/Toast'
import { HashRouter } from 'react-router'

export function App() {
  return (
    <HashRouter>
      <GiftListProvider>
        <DemoStateProvider>
          <ToastProvider>
            <InitialLoadingGate>
              <AppRoutes />
            </InitialLoadingGate>
          </ToastProvider>
        </DemoStateProvider>
      </GiftListProvider>
    </HashRouter>
  )
}
