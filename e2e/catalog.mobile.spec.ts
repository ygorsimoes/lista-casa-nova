import {
  expectMinimumFieldFontSize,
  expectMinimumTouchTarget,
  expectNoHorizontalOverflow,
  expectNoSeriousAccessibilityViolations,
} from './support/assertions.js'
import { expect, test } from './support/test.js'

test.beforeEach(async ({ page }) => {
  await page.goto('./#/')
  await expect(page.getByRole('heading', { name: 'Lista da nossa casa nova' })).toBeVisible()
})

test('filtra o catálogo com acento e caixa na largura móvel sem overflow', async ({ page }) => {
  await page.getByRole('searchbox', { name: 'Buscar um presente' }).fill('CHÁLEIRA')

  await expect(page.getByRole('heading', { name: 'Chaleira' })).toBeVisible()
  await expect(page.getByRole('status').filter({ hasText: '1 presente encontrado' })).toBeVisible()
  await expectNoHorizontalOverflow(page)
})

test('combina categoria, disponibilidade e estado vazio', async ({ page }) => {
  await page.getByRole('searchbox', { name: 'Buscar um presente' }).fill('toalhas')
  await page.getByRole('button', { name: 'Banheiro', exact: true }).click()
  await page.getByRole('checkbox', { name: 'Mostrar somente disponíveis' }).check()

  await expect(page.getByRole('heading', { name: 'Nenhum presente encontrado' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Banheiro', exact: true })).toHaveAttribute(
    'aria-pressed',
    'true',
  )
})

test('mantém controles principais confortáveis para toque e leitura', async ({ page }) => {
  const search = page.getByRole('searchbox', { name: 'Buscar um presente' })
  const brand = page.getByRole('link', { name: 'Voltar para a lista de presentes' })
  await expectMinimumFieldFontSize(search)
  await expectMinimumTouchTarget(search)
  await expectMinimumTouchTarget(brand)
  const brandBox = await brand.boundingBox()
  expect(brandBox?.width).toBeGreaterThanOrEqual(43.5)
  await expectMinimumTouchTarget(page.getByRole('button', { name: 'Todas', exact: true }))
  await expectMinimumTouchTarget(
    page.getByRole('button', { name: 'Quero dar este presente: Chaleira' }),
  )
  await expectNoHorizontalOverflow(page)
})

test('centraliza o ícone de busca no campo em 360 px', async ({ page }) => {
  const input = page.getByRole('searchbox', { name: 'Buscar um presente' })
  const icon = page.locator('.catalog-search__icon')

  await expect(input).toHaveCount(1)
  await expect(icon).toHaveCount(1)
  await expect(input).toBeVisible()
  await expect(icon).toBeVisible()

  const inputBox = await input.boundingBox()
  const iconBox = await icon.boundingBox()
  expect(inputBox).not.toBeNull()
  expect(iconBox).not.toBeNull()

  if (!inputBox || !iconBox) {
    throw new Error('O campo e o ícone de busca precisam ter caixas mensuráveis.')
  }

  const inputCenter = inputBox.y + inputBox.height / 2
  const iconCenter = iconBox.y + iconBox.height / 2
  expect(Math.abs(inputCenter - iconCenter)).toBeLessThanOrEqual(1)
})

test('não possui violações sérias ou críticas no catálogo', async ({ page }) => {
  await expectNoSeriousAccessibilityViolations(page)
})
