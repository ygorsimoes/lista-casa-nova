import { expect, test } from '@playwright/test'

test('carrega o catálogo real do ambiente de desenvolvimento', async ({ page }) => {
  await page.goto('/')

  await expect(page.getByRole('heading', { name: 'Lista da Casa Nova' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Presentes para escolher' })).toBeVisible()
  await expect(page.getByRole('button', { name: /Disponíveis \(\d+\)/ })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Reservar' }).first()).toBeVisible()
})

test('mantém Pix e lista imprimível disponíveis sem nomes de convidados', async ({ page }) => {
  await page.goto('/#/pix')
  await expect(page.getByRole('heading', { name: 'Contribuir por Pix' })).toBeVisible()
  await expect(page.getByRole('img', { name: 'QR Code para contribuição por Pix' })).toBeVisible()

  await page.goto('/#/pdf')
  await expect(page.getByRole('heading', { name: 'Lista para impressão' })).toBeVisible()
  await expect(page.getByText(/nomes de reservas não aparecem/i)).toBeVisible()
  await expect(page.locator('body')).not.toContainText('Teste de desenvolvimento')
})
