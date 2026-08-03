import { expect, test } from '@playwright/test'
import { expectNoSeriousAccessibilityViolations } from './support/assertions.js'

test('opera filtros com Enter e Espaço', async ({ page }) => {
  await page.goto('./#/')
  const kitchen = page.getByRole('button', { name: 'Cozinha', exact: true })
  await kitchen.focus()
  await page.keyboard.press('Enter')
  await expect(kitchen).toHaveAttribute('aria-pressed', 'true')
  const bedroom = page.getByRole('button', { name: 'Quarto', exact: true })
  await bedroom.focus()
  await page.keyboard.press('Space')
  await expect(bedroom).toHaveAttribute('aria-pressed', 'true')
})

test('prende foco no diálogo, fecha com Escape e devolve ao cartão', async ({ page }) => {
  await page.goto('./#/')
  const trigger = page.getByRole('button', { name: 'Quero dar este presente: Chaleira' })
  await trigger.focus()
  await page.keyboard.press('Enter')

  const dialog = page.getByRole('dialog', { name: 'Detalhes do presente' })
  await expect(dialog).toBeFocused()
  await page.keyboard.press('Tab')
  expect(await dialog.evaluate((element) => element.contains(document.activeElement))).toBe(true)
  await page.keyboard.press('Escape')
  await expect(dialog).toBeHidden()
  await expect(trigger).toBeFocused()
})

test('move foco para o h1 após navegação', async ({ page }) => {
  await page.goto('./#/')
  const pixLink = page.getByRole('link', { name: 'Contribuir com qualquer valor' })
  await pixLink.focus()
  await page.keyboard.press('Enter')

  await expect(page.getByRole('heading', { name: 'Contribuir por Pix' })).toBeFocused()
})

test('rotas principais não têm violações axe sérias ou críticas', async ({ page }) => {
  for (const route of ['', 'item/CZ-001', 'pix', 'pdf', 'admin']) {
    await page.goto(`./#/${route}`)
    await expect(page.locator('main')).toBeVisible()
    await expectNoSeriousAccessibilityViolations(page)
  }
})
