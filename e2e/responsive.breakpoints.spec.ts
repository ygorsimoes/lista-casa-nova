import type { Page } from '@playwright/test'
import {
  expectNoHorizontalClipping,
  expectNoHorizontalOverflow,
  expectSingleEditorialColumn,
} from './support/assertions.js'
import { unlockDemoAdmin } from './support/flows.js'
import { expect, test } from './support/test.js'

async function openCatalogAt(page: Page, width: number, height = 900) {
  await page.setViewportSize({ width, height })
  await page.goto('./#/')
  await expect(page.getByRole('banner').getByRole('link', { name: 'Nossa lista' })).toBeVisible()
  await expectSingleEditorialColumn(page.locator('.gift-card'))
  await expectNoHorizontalOverflow(page)
}

test('@layout preserva marca e coluna única em 480/481 e 639/640', async ({ page }) => {
  for (const width of [480, 481, 639, 640]) await openCatalogAt(page, width)
})

test('@layout escala a folha A4 sem corte em 520/521', async ({ page }) => {
  await page.setViewportSize({ width: 520, height: 900 })
  await page.goto('./#/pdf')

  const readPreviewBounds = async () => {
    const frame = page.locator('.printable-sheet-frame')
    await expectNoHorizontalClipping(frame)
    return page.evaluate(() => {
      const frameBox = document.querySelector('.printable-sheet-frame')?.getBoundingClientRect()
      const canvasBox = document.querySelector('.printable-sheet-canvas')?.getBoundingClientRect()
      return {
        frame: frameBox
          ? {
              left: frameBox.left,
              right: frameBox.right,
              width: frameBox.width,
              height: frameBox.height,
            }
          : null,
        canvas: canvasBox
          ? {
              left: canvasBox.left,
              right: canvasBox.right,
              width: canvasBox.width,
              height: canvasBox.height,
            }
          : null,
      }
    })
  }

  const at520 = await readPreviewBounds()
  expect(at520.frame).not.toBeNull()
  expect(at520.canvas).not.toBeNull()
  expect(
    Math.abs((at520.canvas?.width ?? 0) / (at520.canvas?.height ?? 1) - 210 / 297),
  ).toBeLessThan(0.03)
  expect(at520.canvas?.left ?? -1).toBeGreaterThanOrEqual((at520.frame?.left ?? 0) - 0.5)
  expect(at520.canvas?.right ?? 1).toBeLessThanOrEqual((at520.frame?.right ?? 0) + 0.5)

  await page.setViewportSize({ width: 521, height: 900 })
  await expect
    .poll(async () => (await readPreviewBounds()).canvas?.width ?? 0)
    .toBeGreaterThan(at520.canvas?.width ?? 0)
  const at521 = await readPreviewBounds()
  expect(at521.canvas?.right ?? 1).toBeLessThanOrEqual((at521.frame?.right ?? 0) + 0.5)
  await expectNoHorizontalOverflow(page)
})

test('@layout move apenas a administração para a lateral em 899/900', async ({ page }) => {
  for (const width of [899, 900]) {
    await page.setViewportSize({ width, height: 900 })
    await unlockDemoAdmin(page)
    const boxes = await page.evaluate(() => {
      const sidebar = document.querySelector('.admin-shell__sidebar')?.getBoundingClientRect()
      const content = document.querySelector('.admin-shell__content')?.getBoundingClientRect()
      return {
        sidebarRight: sidebar?.right ?? 0,
        sidebarBottom: sidebar?.bottom ?? 0,
        contentLeft: content?.left ?? 0,
        contentTop: content?.top ?? 0,
      }
    })
    if (width === 899) expect(boxes.contentTop).toBeGreaterThanOrEqual(boxes.sidebarBottom)
    if (width === 900) expect(boxes.contentLeft).toBeGreaterThanOrEqual(boxes.sidebarRight)
    await expectNoHorizontalOverflow(page)
  }
})

test('@layout preserva ordem e foco administrativo em 1199/1200', async ({ page }) => {
  for (const width of [1199, 1200]) {
    await page.setViewportSize({ width, height: 900 })
    await unlockDemoAdmin(page)
    const order = await page
      .locator(
        '#admin-dashboard-title, #admin-gifts-title, #admin-reservations-title, #site-settings-title',
      )
      .evaluateAll((headings) => headings.map((heading) => heading.id))
    expect(order).toEqual([
      'admin-dashboard-title',
      'admin-gifts-title',
      'admin-reservations-title',
      'site-settings-title',
    ])
    await page.getByRole('button', { name: 'Reservas' }).click()
    await expect(page.locator('#admin-reservations-title')).toBeFocused()
  }
})

test('@layout mantém tablet e celular em paisagem sem corte', async ({ page }) => {
  for (const viewport of [
    { width: 768, height: 1024 },
    { width: 844, height: 390 },
  ]) {
    await page.setViewportSize(viewport)
    await page.goto('./#/')
    await expect(page.getByRole('banner').getByRole('link', { name: 'Nossa lista' })).toBeVisible()
    await expectSingleEditorialColumn(page.locator('.gift-card'))
    await expectNoHorizontalOverflow(page)
  }
})

test('@layout não corta cartões, painel de detalhe ou administração', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 })
  await page.goto('./#/')
  await expectNoHorizontalClipping(page.locator('.gift-card').first())
  await page.getByRole('button', { name: 'Ver Chaleira' }).click()
  await expectNoHorizontalClipping(page.locator('.ui-dialog__surface'))

  await unlockDemoAdmin(page)
  await expectNoHorizontalClipping(page.locator('.admin-shell'))
  const panels = page.locator('.admin-panel')
  for (let index = 0; index < (await panels.count()); index += 1) {
    await expectNoHorizontalClipping(panels.nth(index))
  }
  await expectNoHorizontalOverflow(page)
})
