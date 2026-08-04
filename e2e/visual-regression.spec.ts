import type { Page } from '@playwright/test'
import {
  openGiftDetails,
  openReservationForm,
  reserveGiftFromCatalog,
  unlockDemoAdmin,
} from './support/flows.js'
import { expect, test } from './support/test.js'

async function waitForVisualStability(page: Page) {
  await page.evaluate(() => document.fonts.ready)
}

test.describe('@visual-mobile composição móvel', () => {
  test('catálogo em 360', async ({ page }) => {
    await page.goto('./#/')
    await expect(page.getByRole('heading', { name: 'Lista da nossa casa nova' })).toBeVisible()
    await expect(page.locator('.gift-card').first()).toBeVisible()
    await waitForVisualStability(page)
    await expect(page).toHaveScreenshot('catalogo-360.png')
  })

  test('detalhe em 360', async ({ page }) => {
    await page.goto('./#/')
    const dialog = await openGiftDetails(page)
    await waitForVisualStability(page)
    await expect(dialog).toBeVisible()
    await expect(page).toHaveScreenshot('detalhe-360.png')
  })

  test('formulário em 360', async ({ page }) => {
    await page.goto('./#/')
    const dialog = await openReservationForm(page)
    await waitForVisualStability(page)
    await expect(dialog.getByLabel('Seu primeiro nome')).toBeFocused()
    await expect(page).toHaveScreenshot('formulario-360.png')
  })

  test('confirmação em 360', async ({ page }) => {
    await page.goto('./#/')
    const dialog = await reserveGiftFromCatalog(page)
    await waitForVisualStability(page)
    await expect(
      dialog.getByRole('heading', { name: 'Este presente ficou com você' }),
    ).toBeFocused()
    await expect(page).toHaveScreenshot('confirmacao-reserva-360.png')
  })

  test('estado vazio em 360', async ({ page }) => {
    await page.goto('./#/')
    await page.getByRole('searchbox', { name: 'Buscar um presente' }).fill('resultado impossível')
    await expect(page.getByRole('heading', { name: 'Nenhuma ideia encontrada' })).toBeVisible()
    await waitForVisualStability(page)
    await expect(page.locator('main')).toHaveScreenshot('vazio-360.png')
  })

  test('conflito em 360', async ({ page }) => {
    await page.goto('./#/item/CZ-004')
    await page.getByRole('button', { name: 'Quero dar este presente' }).click()
    await page.getByLabel('Seu primeiro nome').fill('Nina')
    await page.getByRole('button', { name: 'Confirmar reserva' }).click()
    await expect(page.getByRole('alert')).toBeVisible()
    await waitForVisualStability(page)
    await expect(page.locator('.reservation-form')).toHaveScreenshot('conflito-360.png')
  })

  test('sucesso de gerenciamento em 360', async ({ page }) => {
    await page.goto('./#/minha-reserva/reserva-demo-valida')
    await page.getByRole('button', { name: 'Já comprei' }).click()
    await expect(page.getByRole('status', { name: 'Estado da reserva' })).toContainText('Comprado')
    await waitForVisualStability(page)
    await expect(page.locator('.manage-reservation')).toHaveScreenshot(
      'sucesso-gerenciamento-360.png',
    )
  })

  test('prévia A4 em 360', async ({ page }) => {
    await page.goto('./#/pdf')
    await expect(page.locator('.printable-sheet-frame')).toBeVisible()
    await waitForVisualStability(page)
    await expect(page.locator('main')).toHaveScreenshot('a4-360.png')
  })
})

test.describe('@visual-desktop composição desktop', () => {
  test('catálogo em 1280', async ({ page }) => {
    await page.goto('./#/')
    await expect(page.getByRole('heading', { name: 'Lista da nossa casa nova' })).toBeVisible()
    await expect(page.locator('.gift-card').first()).toBeVisible()
    await waitForVisualStability(page)
    await expect(page).toHaveScreenshot('catalogo-1280.png')
  })

  test('admin em 1280', async ({ page }) => {
    await unlockDemoAdmin(page)
    await waitForVisualStability(page)
    await expect(page).toHaveScreenshot('admin-1280.png')
  })

  test('prévia A4 em 1280', async ({ page }) => {
    await page.goto('./#/pdf')
    await expect(page.locator('.printable-sheet-frame')).toBeVisible()
    await waitForVisualStability(page)
    await expect(page.locator('main')).toHaveScreenshot('a4-1280.png')
  })
})
