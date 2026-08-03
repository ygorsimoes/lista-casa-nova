import { expect, test } from '@playwright/test'
import {
  expectEmptyBrowserStorage,
  expectNoHorizontalOverflow,
  observeForbiddenRequests,
} from './support/assertions.js'
import { demoScenarios } from './support/demo-scenarios.js'

test('reserva pelo painel, gera token e restaura o item ao recarregar', async ({ page }) => {
  const expectNoForbiddenRequests = observeForbiddenRequests(page)
  await page.goto('./#/')

  const trigger = page.getByRole('button', { name: 'Quero dar este presente: Chaleira' })
  await trigger.click()
  const dialog = page.getByRole('dialog', { name: 'Detalhes do presente' })
  await expect(dialog).toBeVisible()
  await expect(dialog).toBeFocused()
  await dialog.getByRole('button', { name: 'Quero dar este presente', exact: true }).click()
  await dialog.getByLabel('Primeiro nome', { exact: true }).fill('Nina')
  await dialog.getByRole('button', { name: 'Confirmar reserva' }).click()

  await expect(
    dialog.getByRole('heading', { name: 'Pronto, este presente está reservado para você!' }),
  ).toBeVisible()
  await expect(dialog.getByRole('link', { name: 'Gerenciar esta reserva' })).toHaveAttribute(
    'href',
    '#/minha-reserva/reserva-cz-001-1',
  )
  await expectEmptyBrowserStorage(page)
  expectNoForbiddenRequests()

  await page.reload()
  await expect(page.getByRole('dialog', { name: 'Detalhes do presente' })).toContainText(
    'Disponível',
  )
  await expectNoHorizontalOverflow(page)
})

test('mantém os dados do formulário ao simular conflito', async ({ page }) => {
  const expectNoForbiddenRequests = observeForbiddenRequests(page)
  await page.goto(`./#/item/${demoScenarios.conflictItem}`)
  await page.getByRole('button', { name: 'Quero dar este presente', exact: true }).click()
  await page.getByLabel('Primeiro nome', { exact: true }).fill('Nina')
  await page.getByRole('button', { name: 'Confirmar reserva' }).click()

  await expect(page.getByRole('alert')).toContainText('Este presente acabou de ser reservado.')
  await expect(page.getByLabel('Primeiro nome', { exact: true })).toHaveValue('Nina')
  await expectEmptyBrowserStorage(page)
  expectNoForbiddenRequests()
})

test('explica item indisponível sem oferecer formulário', async ({ page }) => {
  await page.goto(`./#/item/${demoScenarios.unavailableItem}`)

  await expect(page.getByRole('heading', { name: 'Cesto de roupas' })).toBeVisible()
  await expect(page.getByText('Este presente não está mais disponível para reserva.')).toBeVisible()
  await expect(
    page.getByRole('button', { name: 'Quero dar este presente', exact: true }),
  ).toHaveCount(0)
})
