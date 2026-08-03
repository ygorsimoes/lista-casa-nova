import { DemoStateProvider } from '@/app/DemoStateProvider'
import { InitialLoadingGate } from '@/app/InitialLoadingGate'
import { AppRoutes } from '@/app/routes'
import { ToastProvider } from '@/components/ui/Toast'
import { HashRouter } from 'react-router-dom'

export function App() {
  return (
    <HashRouter>
      <DemoStateProvider>
        <ToastProvider>
          <InitialLoadingGate>
            <AppRoutes />
          </InitialLoadingGate>
        </ToastProvider>
      </DemoStateProvider>
    </HashRouter>
  )
}
