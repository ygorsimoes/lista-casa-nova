import { expectNoHorizontalOverflow } from './support/assertions.js'
import { demoScenarios } from './support/demo-scenarios.js'
import { reserveGiftFromCatalog } from './support/flows.js'
import { expect, test } from './support/test.js'

test('@canonical busca, abre o detalhe, reserva e chega à confirmação', async ({ page }) => {
  await page.goto('./#/')
  const search = page.getByRole('searchbox', { name: 'Buscar um presente' })
  await search.fill('chaleira')
  await expect(page.getByRole('status').filter({ hasText: '1 ideia para escolher' })).toBeVisible()
  await expect(page.getByText('Disponível', { exact: true })).toBeVisible()

  const dialog = await reserveGiftFromCatalog(page)
  await expect(dialog.getByText('3 · Combine a entrega')).toBeVisible()
  await expect(dialog.getByRole('link', { name: 'Ver minha reserva' })).toHaveAttribute(
    'href',
    '#/minha-reserva/reserva-cz-001-1',
  )
  await expect(dialog.getByLabel('Seu primeiro nome')).toHaveCount(0)

  await page.reload()
  await expect(page.getByRole('dialog', { name: 'Detalhes do presente' })).toContainText(
    'Disponível',
  )
  await expectNoHorizontalOverflow(page)
})

test('retorna ao detalhe e preserva o nome digitado ao reabrir a reserva', async ({ page }) => {
  await page.goto('./#/item/CZ-001')
  await page.getByRole('button', { name: 'Quero dar este presente', exact: true }).click()
  const firstName = page.getByLabel('Seu primeiro nome')
  await firstName.fill('Nina')

  await page.getByRole('button', { name: 'Ver detalhes' }).click()
  await expect(page.getByRole('heading', { name: 'Chaleira', level: 1 })).toBeVisible()
  await page.getByRole('button', { name: 'Quero dar este presente', exact: true }).click()
  await expect(firstName).toHaveValue('Nina')
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

  const conflict = page.getByRole('alert')
  await expect(conflict).toContainText('Este presente acabou de ser reservado.')
  await expect(conflict).toBeFocused()
  await expect(conflict.getByRole('link', { name: 'Voltar para a lista' })).toHaveAttribute(
    'href',
    '#/',
  )
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
