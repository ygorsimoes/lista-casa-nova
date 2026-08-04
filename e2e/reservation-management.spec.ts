import { demoScenarios } from './support/demo-scenarios.js'
import { expect, test } from './support/test.js'

test('marca a reserva válida como comprada e reseta após reload', async ({ page }) => {
  await page.goto(`./#/minha-reserva/${demoScenarios.validToken}`)

  await page.getByRole('button', { name: 'Já comprei' }).click()
  const state = page.getByRole('status', { name: 'Estado da reserva' })
  await expect(state).toContainText('Comprado')
  await expect(state.getByRole('heading', { name: 'Estado da reserva' })).toBeFocused()
  await page.reload()
  await expect(page.getByRole('button', { name: 'Já comprei' })).toBeVisible()
  await expect(page.getByRole('status', { name: 'Estado da reserva' })).toContainText(
    'Reserva ativa',
  )
})

test('cancela a reserva somente após confirmação', async ({ page }) => {
  await page.goto(`./#/minha-reserva/${demoScenarios.validToken}`)

  const cancel = page.getByRole('button', { name: 'Cancelar minha reserva' })
  await cancel.click()
  const dialog = page.getByRole('dialog', { name: 'Cancelar reserva' })
  await expect(dialog.getByRole('button', { name: 'Manter reserva' })).toBeFocused()
  await dialog.getByRole('button', { name: 'Cancelar reserva' }).click()

  await expect(page.getByRole('status', { name: 'Estado da reserva' })).toContainText(
    'Reserva cancelada',
  )
})

test('oferece retorno para token inválido', async ({ page }) => {
  await page.goto(`./#/minha-reserva/${demoScenarios.invalidToken}`)

  await expect(page.getByRole('heading', { name: 'Reserva não encontrada' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Voltar à lista' })).toHaveAttribute('href', '#/')
})
