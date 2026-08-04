import { expectNoHorizontalOverflow } from './support/assertions.js'
import { demoScenarios } from './support/demo-scenarios.js'
import { reserveGiftFromCatalog } from './support/flows.js'
import { expect, test } from './support/test.js'

test('reserva pelo painel, gera token e restaura o item ao recarregar', async ({ page }) => {
  await page.goto('./#/')

  const dialog = await reserveGiftFromCatalog(page)

  await expect(dialog.getByRole('heading', { name: 'Este presente ficou com você' })).toBeVisible()
  await expect(dialog.getByRole('link', { name: 'Ver minha reserva' })).toHaveAttribute(
    'href',
    '#/minha-reserva/reserva-cz-001-1',
  )

  await page.reload()
  await expect(page.getByRole('dialog', { name: 'Detalhes do presente' })).toContainText(
    'Disponível',
  )
  await expectNoHorizontalOverflow(page)
})

test('leva o foco ao título ao gerenciar a reserva criada no diálogo', async ({ page }) => {
  await page.goto('./#/')

  const dialog = await reserveGiftFromCatalog(page)
  await dialog.getByRole('link', { name: 'Ver minha reserva' }).click()

  await expect(
    page.getByRole('heading', { name: 'Tudo certo com seu presente', level: 1 }),
  ).toBeFocused()
})

test('mantém os dados do formulário ao simular conflito', async ({ page }) => {
  await page.goto(`./#/item/${demoScenarios.conflictItem}`)
  await page.getByRole('button', { name: 'Quero dar este presente', exact: true }).click()
  await page.getByLabel('Seu primeiro nome').fill('Nina')
  await page.getByRole('button', { name: 'Confirmar reserva' }).click()

  await expect(page.getByRole('alert')).toContainText('Este presente acabou de ser reservado.')
  await expect(page.getByLabel('Seu primeiro nome')).toHaveValue('Nina')
})

test('explica item indisponível sem oferecer formulário', async ({ page }) => {
  await page.goto(`./#/item/${demoScenarios.unavailableItem}`)

  await expect(page.getByRole('heading', { name: 'Cesto de roupas' })).toBeVisible()
  await expect(page.getByText('Este presente já foi escolhido por outra pessoa.')).toBeVisible()
  await expect(
    page.getByRole('button', { name: 'Quero dar este presente', exact: true }),
  ).toHaveCount(0)
})

test('apresenta estado amigável para código de item inexistente', async ({ page }) => {
  await page.goto('./#/item/CODIGO-INEXISTENTE')

  const errorState = page.getByRole('alert')
  await expect(errorState.getByRole('heading', { name: 'Presente não encontrado' })).toBeVisible()
  await expect(errorState).toContainText(
    'Este presente não faz parte da lista. Você pode voltar ao catálogo para escolher outro.',
  )
  await errorState.getByRole('link', { name: 'Voltar ao catálogo' }).click()
  await expect(page.getByRole('heading', { name: 'Lista da nossa casa nova' })).toBeFocused()
})
