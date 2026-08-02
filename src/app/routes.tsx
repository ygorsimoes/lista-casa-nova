import { AppShell } from '@/components/layout/AppShell'
import { CatalogPage } from '@/features/catalog/CatalogPage'
import { GiftDetailsPage } from '@/features/catalog/GiftDetailsPage'
import { NotFoundPage } from '@/features/not-found/NotFoundPage'
import type { Location } from 'react-router-dom'
import { Route, Routes } from 'react-router-dom'

export interface AppLocationState {
  backgroundLocation?: Location
}

export function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <AppShell>
            <CatalogPage />
          </AppShell>
        }
      />
      <Route path="/item/:code" element={<GiftDetailsPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
