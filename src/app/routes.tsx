import { AppShell } from '@/components/layout/AppShell'
import { LiveCatalogPage } from '@/features/catalog/LiveCatalogPage'
import { GiftDetailsDialog } from '@/features/catalog/GiftDetailsDialog'
import { GiftDetailsPage } from '@/features/catalog/GiftDetailsPage'
import { CollectionPage } from '@/features/collections/CollectionPage'
import { NotFoundPage } from '@/features/not-found/NotFoundPage'
import { PixPage } from '@/features/pix/PixPage'
import { ManageReservationPage } from '@/features/reservations/ManageReservationPage'
import type { Location } from 'react-router'
import { lazy, Suspense } from 'react'
import { Route, Routes, useLocation } from 'react-router'

const PdfPreviewPage = lazy(() => import('@/features/pdf/PdfPreviewPage'))
const AdminPage = lazy(() => import('@/features/admin/AdminPage'))

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
              <LiveCatalogPage />
            </AppShell>
          }
        />
        <Route path="/item/:code" element={<GiftDetailsPage />} />
        <Route path="/colecao/:slug" element={<CollectionPage />} />
        <Route path="/minha-reserva/:token" element={<ManageReservationPage />} />
        <Route path="/pix" element={<PixPage />} />
        <Route
          path="/pdf"
          element={
            <Suspense fallback={<p role="status">Carregando prévia</p>}>
              <PdfPreviewPage />
            </Suspense>
          }
        />
        <Route
          path="/admin"
          element={
            <Suspense fallback={<p role="status">Carregando painel</p>}>
              <AdminPage />
            </Suspense>
          }
        />
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
