import {
  expectNoHorizontalClipping,
  expectNoHorizontalOverflow,
  expectSingleEditorialColumn,
} from './support/assertions.js'
import { expect, test } from './support/test.js'

test('@desktop mantém catálogo editorial em uma coluna na primeira viewport', async ({ page }) => {
  await page.goto('./#/')
  const cards = page.locator('.gift-card')
  await expect(cards).toHaveCount(11)
  await expectSingleEditorialColumn(cards)
  await expect(page.locator('.gift-grid .ui-button--primary')).toHaveCount(0)
  const firstCard = await cards.first().boundingBox()
  expect(firstCard).not.toBeNull()
  expect((firstCard?.y ?? 901) + (firstCard?.height ?? 0)).toBeLessThanOrEqual(900)
  await expectNoHorizontalOverflow(page)
})

test('@desktop apresenta quatro cards administrativos na mesma linha', async ({ page }) => {
  await page.goto('./#/admin')
  await page.getByRole('button', { name: 'Entrar na demonstração' }).click()

  const cards = page.locator('.admin-summary__card')
  await expect(cards).toHaveCount(4)
  await expect(page.getByRole('navigation', { name: 'Administração' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Presentes da lista' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Reservas', exact: true })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Configurações da lista' })).toBeVisible()
  const rowTops = await cards.evaluateAll((elements) =>
    elements.map((element) => Math.round(element.getBoundingClientRect().top)),
  )
  expect(new Set(rowTops).size).toBe(1)
  const layout = await page.evaluate(() => {
    const sidebar = document.querySelector('.admin-shell__sidebar')?.getBoundingClientRect()
    const content = document.querySelector('.admin-shell__content')?.getBoundingClientRect()
    return { sidebarRight: sidebar?.right ?? 0, contentLeft: content?.left ?? 0 }
  })
  expect(layout.contentLeft).toBeGreaterThanOrEqual(layout.sidebarRight)
  await expectNoHorizontalOverflow(page)
})

test('@desktop mantém a prévia A4 centralizada e sem overflow', async ({ page }) => {
  await page.goto('./#/pdf')

  const frame = page.locator('.printable-sheet-frame')
  const canvas = page.locator('.printable-sheet-canvas')
  await expectNoHorizontalClipping(frame)
  const [frameBox, canvasBox] = await Promise.all([frame.boundingBox(), canvas.boundingBox()])
  expect(frameBox).not.toBeNull()
  expect(canvasBox).not.toBeNull()
  expect(canvasBox?.width).toBeLessThanOrEqual(frameBox?.width ?? 0)
  expect(Math.abs((canvasBox?.width ?? 0) / (canvasBox?.height ?? 1) - 210 / 297)).toBeLessThan(
    0.03,
  )
  await expectNoHorizontalOverflow(page)
})
