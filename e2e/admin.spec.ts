import type { Page } from '@playwright/test'
import {
  expectEmptyBrowserStorage,
  expectNoHorizontalOverflow,
  observeForbiddenRequests,
} from './support/assertions.js'
import { expect, test } from './support/test.js'

function summaryCard(page: Page, label: string) {
  return page.getByText(label, { exact: true }).locator('..')
}

test('entra sem credenciais, atualiza reservas e configurações e reseta no reload', async ({
  page,
}) => {
  const expectNoForbiddenRequests = observeForbiddenRequests(page)
  await page.goto('./#/admin')

  await expect(page.getByText('Não existe autenticação real neste protótipo.')).toBeVisible()
  await expect(page.getByRole('textbox')).toHaveCount(0)
  await page.getByRole('button', { name: 'Entrar na demonstração' }).click()
  await expect(page.getByRole('heading', { name: 'Visão geral' })).toBeFocused()
  await expect(summaryCard(page, 'Itens disponíveis')).toContainText('8')
  await expect(summaryCard(page, 'Reservas ativas')).toContainText('5')

  await page.getByRole('button', { name: 'Reservas', exact: true }).click()
  await page.getByRole('button', { name: 'Liberar reserva de Cesto de roupas' }).click()
  await page.getByRole('button', { name: 'Confirmar liberação' }).click()
  await expect(page.getByRole('region', { name: 'Reservas' }).getByRole('status')).toContainText(
    'Reserva liberada: Cesto de roupas voltou a ficar disponível.',
  )
  await page.getByRole('button', { name: 'Resumo', exact: true }).click()
  await expect(summaryCard(page, 'Itens disponíveis')).toContainText('9')
  await expect(summaryCard(page, 'Reservas ativas')).toContainText('4')

  await page.getByRole('button', { name: 'Configurações', exact: true }).click()
  await page.getByLabel('Título do site').fill('Nosso novo lar')
  await page.getByRole('button', { name: 'Salvar alterações' }).click()
  await expect(
    page.getByRole('region', { name: 'Configurações da lista' }).getByRole('status'),
  ).toContainText(
    'Alterações mantidas somente nesta sessão. Recarregar restaura os dados iniciais.',
  )
  await expectEmptyBrowserStorage(page)
  await expectNoHorizontalOverflow(page)
  expectNoForbiddenRequests()

  await page.reload()
  await expect(page.getByRole('heading', { name: 'Painel demonstrativo' })).toBeVisible()
  await expect(page.getByRole('textbox')).toHaveCount(0)
  await page.goto('./#/')
  await expect(page.getByRole('heading', { name: 'Lista da nossa casa nova' })).toBeVisible()
})
