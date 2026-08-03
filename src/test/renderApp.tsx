import { DemoStateProvider } from '@/app/DemoStateProvider'
import { ToastProvider } from '@/components/ui/Toast'
import { render } from '@testing-library/react'
import type { ReactElement } from 'react'
import { MemoryRouter, Route, Routes } from 'react-router'

export interface RenderWithAppOptions {
  route?: string
  routePath?: string
}

export function renderWithApp(
  ui: ReactElement,
  { route = '/', routePath = '*' }: RenderWithAppOptions = {},
) {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <DemoStateProvider>
        <ToastProvider>
          <Routes>
            <Route path={routePath} element={ui} />
          </Routes>
        </ToastProvider>
      </DemoStateProvider>
    </MemoryRouter>,
  )
}
