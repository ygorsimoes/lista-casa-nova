import { expect, test } from '@playwright/test'
import { expectNoHorizontalOverflow } from './support/assertions.js'

test('@desktop organiza catálogo em múltiplas colunas dentro do contêiner', async ({ page }) => {
  await page.goto('./#/')

  const cards = page.locator('.gift-card')
  await expect(cards).toHaveCount(11)
  const layout = await page.evaluate(() => {
    const main = document.querySelector('.app-shell__main')
    const cards = Array.from(document.querySelectorAll('.gift-card'))
    const firstTop = cards[0]?.getBoundingClientRect().top
    const mainBox = main?.getBoundingClientRect()
    return {
      firstRowColumns: cards.filter(
        (card) =>
          firstTop !== undefined && Math.abs(card.getBoundingClientRect().top - firstTop) < 2,
      ).length,
      mainLeft: mainBox?.left ?? 0,
      mainRight: mainBox?.right ?? 0,
      viewportWidth: document.documentElement.clientWidth,
    }
  })

  expect(layout.firstRowColumns).toBeGreaterThan(1)
  expect(layout.mainLeft).toBeGreaterThan(0)
  expect(layout.viewportWidth - layout.mainRight).toBeGreaterThan(0)
  await expectNoHorizontalOverflow(page)
})

test('@desktop apresenta quatro cards administrativos na mesma linha', async ({ page }) => {
  await page.goto('./#/admin')
  await page.getByRole('button', { name: 'Entrar na demonstração' }).click()

  const cards = page.locator('.admin-summary__card')
  await expect(cards).toHaveCount(4)
  const rowTops = await cards.evaluateAll((elements) =>
    elements.map((element) => Math.round(element.getBoundingClientRect().top)),
  )
  expect(new Set(rowTops).size).toBe(1)
  await expectNoHorizontalOverflow(page)
})

test('@desktop mantém a prévia A4 centralizada e sem overflow', async ({ page }) => {
  await page.goto('./#/pdf')

  const sheet = page.getByRole('region', { name: 'Folha A4 demonstrativa' })
  const box = await sheet.boundingBox()
  expect(box).not.toBeNull()
  expect(box?.width).toBeLessThanOrEqual(794)
  expect(Math.abs((box?.width ?? 0) / (box?.height ?? 1) - 210 / 297)).toBeLessThan(0.03)
  await expectNoHorizontalOverflow(page)
})
