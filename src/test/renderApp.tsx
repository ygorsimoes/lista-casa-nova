import { DemoStateProvider } from '@/app/DemoStateProvider'
import { render } from '@testing-library/react'
import type { ReactElement } from 'react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'

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
        <Routes>
          <Route path={routePath} element={ui} />
        </Routes>
      </DemoStateProvider>
    </MemoryRouter>,
  )
}
