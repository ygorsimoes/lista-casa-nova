import { AppShell } from '@/components/layout/AppShell'
import { LiveCatalogPage } from '@/features/catalog/LiveCatalogPage'
import { NotFoundPage } from '@/features/not-found/NotFoundPage'
import { PixPage } from '@/features/pix/PixPage'
import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router'

const PdfPreviewPage = lazy(() => import('@/features/pdf/PdfPreviewPage'))
const AdminPage = lazy(() => import('@/features/admin/AdminPage'))

export function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <AppShell>
            <LiveCatalogPage />
          </AppShell>
        }
      />
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
  )
}
