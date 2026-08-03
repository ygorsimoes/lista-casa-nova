import { AppShell } from '@/components/layout/AppShell'
import { CatalogPage } from '@/features/catalog/CatalogPage'
import { GiftDetailsDialog } from '@/features/catalog/GiftDetailsDialog'
import { GiftDetailsPage } from '@/features/catalog/GiftDetailsPage'
import { NotFoundPage } from '@/features/not-found/NotFoundPage'
import type { Location } from 'react-router-dom'
import { Route, Routes, useLocation } from 'react-router-dom'

export interface AppLocationState {
  backgroundLocation?: Location
}

export function AppRoutes() {
  const location = useLocation() as Location<AppLocationState>
  const backgroundLocation = location.state?.backgroundLocation

  return (
    <>
      <Routes location={backgroundLocation ?? location}>
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
      {backgroundLocation ? (
        <Routes>
          <Route path="/item/:code" element={<GiftDetailsDialog />} />
        </Routes>
      ) : null}
    </>
  )
}
