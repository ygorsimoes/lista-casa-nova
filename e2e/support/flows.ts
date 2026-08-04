import { expect, type Locator, type Page } from '@playwright/test'

export async function openGiftDetails(page: Page, giftName = 'Chaleira'): Promise<Locator> {
  await page.getByRole('button', { name: `Ver ${giftName}` }).click()
  const dialog = page.getByRole('dialog', { name: 'Detalhes do presente' })
  await expect(dialog).toBeVisible()
  return dialog
}

export async function openReservationForm(page: Page, giftName = 'Chaleira') {
  const dialog = await openGiftDetails(page, giftName)
  await dialog.getByRole('button', { name: 'Quero dar este presente', exact: true }).click()
  await expect(dialog.getByLabel('Seu primeiro nome')).toBeFocused()
  return dialog
}

export async function reserveGiftFromCatalog(
  page: Page,
  { giftName = 'Chaleira', firstName = 'Nina' } = {},
) {
  const dialog = await openReservationForm(page, giftName)
  await dialog.getByLabel('Seu primeiro nome').fill(firstName)
  await dialog.getByRole('button', { name: 'Confirmar reserva' }).click()
  await expect(dialog.getByRole('heading', { name: 'Este presente ficou com você' })).toBeFocused()
  return dialog
}

export async function unlockDemoAdmin(page: Page) {
  await page.goto('./#/admin')
  const enter = page.getByRole('button', { name: 'Entrar na demonstração' })
  const dashboardTitle = page.getByRole('heading', { name: 'Painel da lista' })
  await expect(enter.or(dashboardTitle)).toBeVisible()
  if (await enter.isVisible()) await enter.click()
  else await page.getByRole('button', { name: 'Resumo' }).click()
  await expect(dashboardTitle).toBeFocused()
}
