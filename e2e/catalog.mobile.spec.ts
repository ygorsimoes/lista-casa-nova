import {
  expectHorizontalScrollContained,
  expectMinimumFieldFontSize,
  expectMinimumTouchTarget,
  expectNoHorizontalClipping,
  expectNoHorizontalOverflow,
} from './support/assertions.js'
import { expect, test } from './support/test.js'

test.beforeEach(async ({ page }) => {
  await page.goto('./#/')
  await expect(page.getByRole('heading', { name: 'Lista da nossa casa nova' })).toBeVisible()
})

test('encontra ideias por nome, descrição e preferência sem depender de acento ou caixa', async ({
  page,
}) => {
  const search = page.getByRole('searchbox', { name: 'Buscar um presente' })
  for (const { query, gift } of [
    { query: 'PANELAS', gift: 'Jogo de panelas' },
    { query: 'cafe', gift: 'Chaleira' },
    { query: 'ALGODAO', gift: 'Jogo de cama' },
  ]) {
    await search.fill(query)
    await expect(page.getByRole('heading', { name: gift, level: 3 })).toBeVisible()
  }
})

test('combina categoria, disponibilidade e estado vazio', async ({ page }) => {
  await page.getByRole('searchbox', { name: 'Buscar um presente' }).fill('toalhas')
  await page.getByRole('button', { name: 'Banheiro', exact: true }).click()
  await page.getByRole('checkbox', { name: 'Só disponíveis' }).check()

  await expect(page.getByRole('heading', { name: 'Nenhuma ideia encontrada' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Banheiro', exact: true })).toHaveAttribute(
    'aria-pressed',
    'true',
  )
})

test('mantém controles principais confortáveis para toque e leitura', async ({ page }) => {
  const search = page.getByRole('searchbox', { name: 'Buscar um presente' })
  const brand = page.getByRole('banner').getByRole('link', { name: 'Nossa lista' })
  await expectMinimumFieldFontSize(search)
  await expectMinimumTouchTarget(search)
  await expectMinimumTouchTarget(brand)
  await expectMinimumTouchTarget(page.getByRole('link', { name: 'Contribuir', exact: true }))
  await expectMinimumTouchTarget(page.getByRole('button', { name: 'Todas', exact: true }))
  await expectMinimumTouchTarget(page.getByRole('button', { name: 'Ver Chaleira' }))
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

test('mostra a jornada e o primeiro presente completos na primeira viewport de 360 px', async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile-chromium', 'A medição cobre a viewport de 360 × 800.')

  const viewportHeight = await page.evaluate(() => window.innerHeight)
  const visibleInViewport = [
    page.getByRole('banner').getByRole('link', { name: 'Nossa lista' }),
    page.getByRole('heading', { name: 'Lista da nossa casa nova' }),
    page.getByRole('list', { name: 'Como funciona' }),
    page.getByRole('searchbox', { name: 'Buscar um presente' }),
    page.locator('.gift-card').first(),
  ]

  expect(viewportHeight).toBe(800)
  expect(await page.evaluate(() => window.scrollY)).toBe(0)
  for (const locator of visibleInViewport) {
    const box = await locator.boundingBox()
    expect(box, 'elemento mensurável na primeira viewport').not.toBeNull()
    expect(box?.y ?? -1).toBeGreaterThanOrEqual(0)
    expect((box?.y ?? 801) + (box?.height ?? 0)).toBeLessThanOrEqual(viewportHeight)
  }
  await expect(page.locator('.gift-grid .ui-button--primary')).toHaveCount(0)
})

test('contém a rolagem horizontal somente na faixa de categorias', async ({ page }) => {
  await expectHorizontalScrollContained(page, page.locator('.category-list'))
  await expectNoHorizontalClipping(page.locator('.gift-grid'))
  await expectNoHorizontalClipping(page.locator('.gift-card').first())
})
