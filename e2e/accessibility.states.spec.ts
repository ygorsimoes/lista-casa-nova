import { expectNoAccessibilityViolations } from './support/assertions.js'
import { reserveGiftFromCatalog, unlockDemoAdmin } from './support/flows.js'
import { expect, test } from './support/test.js'

test('@a11y cobre catálogo vazio e formulário inválido', async ({ page }) => {
  await page.goto('./#/')
  await page.getByRole('searchbox', { name: 'Buscar um presente' }).fill('resultado impossível')
  await expect(page.getByRole('heading', { name: 'Nenhuma ideia encontrada' })).toBeVisible()
  await expectNoAccessibilityViolations(page)

  await page.goto('./#/item/CZ-001')
  await page.getByRole('button', { name: 'Quero dar este presente' }).click()
  await page.getByRole('button', { name: 'Confirmar reserva' }).click()
  await expect(page.getByLabel('Seu primeiro nome')).toHaveAttribute('aria-invalid', 'true')
  await expectNoAccessibilityViolations(page)
})

test('@a11y cobre conflito e confirmação', async ({ page }) => {
  await page.goto('./#/item/CZ-004')
  await page.getByRole('button', { name: 'Quero dar este presente' }).click()
  await page.getByLabel('Seu primeiro nome').fill('Nina')
  await page.getByRole('button', { name: 'Confirmar reserva' }).click()
  await expect(page.getByRole('alert')).toBeVisible()
  await expectNoAccessibilityViolations(page)

  await page.goto('./#/')
  await reserveGiftFromCatalog(page)
  await expectNoAccessibilityViolations(page)
})

test('@a11y cobre gerenciamento, confirmação destrutiva e administração', async ({ page }) => {
  await page.goto('./#/minha-reserva/reserva-demo-valida')
  await page.getByRole('button', { name: 'Já comprei' }).click()
  await expectNoAccessibilityViolations(page)

  await page.reload()
  await page.getByRole('button', { name: 'Cancelar minha reserva' }).click()
  await expect(page.getByRole('dialog', { name: 'Cancelar reserva' })).toBeVisible()
  await expectNoAccessibilityViolations(page)

  await unlockDemoAdmin(page)
  await expectNoAccessibilityViolations(page)
})

test('@a11y cobre todas as rotas inválidas', async ({ page }) => {
  for (const route of [
    'item/CODIGO-INEXISTENTE',
    'minha-reserva/reserva-inexistente',
    'colecao/colecao-inexistente',
    'rota-inexistente',
  ]) {
    await page.goto(`./#/${route}`)
    await expect(page.getByRole('heading', { level: 1 })).toBeFocused()
    await expectNoAccessibilityViolations(page)
  }
})
