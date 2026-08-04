import type { Locator, Page } from '@playwright/test'
import { expectComputedFocusVisible } from './support/assertions.js'
import { unlockDemoAdmin } from './support/flows.js'
import { expect, test } from './support/test.js'

async function tabTo(page: Page, target: Locator, limit = 30) {
  for (let index = 0; index < limit; index += 1) {
    if (await target.evaluate((element) => element === document.activeElement)) {
      await target.evaluate(
        () =>
          new Promise<void>((resolve) =>
            requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
          ),
      )
      return
    }
    await page.keyboard.press('Tab')
  }
  throw new Error(`Foco não alcançou o controle após ${limit} Tabs.`)
}

test('conclui a reserva pelo teclado com foco visível em cada etapa', async ({ page }) => {
  await page.goto('./#/')
  await expect(
    page.getByRole('heading', { name: 'Lista da nossa casa nova', level: 1 }),
  ).toBeFocused()

  const search = page.getByRole('searchbox', { name: 'Buscar um presente' })
  await tabTo(page, search)
  await expectComputedFocusVisible(search)
  await page.keyboard.type('chaleira')
  await expect(search).toHaveValue('chaleira')

  const openGift = page.getByRole('button', { name: 'Ver Chaleira' })
  await tabTo(page, openGift)
  await expectComputedFocusVisible(openGift)
  await page.keyboard.press('Enter')

  const reserve = page.getByRole('button', { name: 'Quero dar este presente', exact: true })
  await tabTo(page, reserve)
  await expectComputedFocusVisible(reserve)
  await page.keyboard.press('Enter')

  const firstName = page.getByLabel('Seu primeiro nome')
  await tabTo(page, firstName)
  await expectComputedFocusVisible(firstName)
  await page.keyboard.type('Nina')
  await expect(firstName).toHaveValue('Nina')
  const confirm = page.getByRole('button', { name: 'Confirmar reserva' })
  await tabTo(page, confirm)
  await expectComputedFocusVisible(confirm)
  await page.keyboard.press('Enter')

  await expect(page.getByRole('heading', { name: 'Este presente ficou com você' })).toBeFocused()
})

test('opera filtros com Enter e Espaço', async ({ page }) => {
  await page.goto('./#/')
  await expect(
    page.getByRole('heading', {
      name: 'Lista da nossa casa nova',
      exact: true,
    }),
  ).toBeFocused()

  const kitchen = page.getByRole('button', { name: 'Cozinha', exact: true })
  await kitchen.focus()
  await page.keyboard.press('Enter')
  await expect(kitchen).toHaveAttribute('aria-pressed', 'true')
  const bedroom = page.getByRole('button', { name: 'Quarto', exact: true })
  await bedroom.focus()
  await page.keyboard.press('Space')
  await expect(bedroom).toHaveAttribute('aria-pressed', 'true')
})

test('prende foco no diálogo, fecha com Escape e devolve ao cartão', async ({ page }) => {
  await page.goto('./#/')
  await page.getByRole('button', { name: 'Cozinha', exact: true }).click()
  await page.getByRole('checkbox', { name: 'Só disponíveis' }).check()
  await page.evaluate(() => window.scrollTo(0, 300))
  const trigger = page.getByRole('button', { name: 'Ver Chaleira' })
  await trigger.scrollIntoViewIfNeeded()
  const originScrollY = await page.evaluate(() => window.scrollY)
  await trigger.click()

  const dialog = page.getByRole('dialog', { name: 'Detalhes do presente' })
  await expect(dialog).toBeFocused()
  await page.keyboard.press('Tab')
  expect(await dialog.evaluate((element) => element.contains(document.activeElement))).toBe(true)
  await page.keyboard.press('Escape')
  await expect(dialog).toBeHidden()
  await expect(trigger).toBeFocused()
  await expect(page.getByRole('button', { name: 'Cozinha' })).toHaveAttribute(
    'aria-pressed',
    'true',
  )
  await expect(page.getByRole('checkbox', { name: 'Só disponíveis' })).toBeChecked()
  await expect
    .poll(async () => Math.abs((await page.evaluate(() => window.scrollY)) - originScrollY))
    .toBeLessThanOrEqual(2)
})

test('prende foco nos diálogos de cancelamento e liberação', async ({ page }) => {
  await page.goto('./#/minha-reserva/reserva-demo-valida')
  const cancel = page.getByRole('button', { name: 'Cancelar minha reserva' })
  await cancel.click()
  const cancelDialog = page.getByRole('dialog', { name: 'Cancelar reserva' })
  await expect(cancelDialog.getByRole('button', { name: 'Manter reserva' })).toBeFocused()
  await page.keyboard.press('Tab')
  expect(await cancelDialog.evaluate((element) => element.contains(document.activeElement))).toBe(
    true,
  )
  await page.keyboard.press('Escape')
  await expect(cancel).toBeFocused()

  await unlockDemoAdmin(page)
  const release = page.getByRole('button', { name: 'Liberar reserva de Cesto de roupas' })
  await release.click()
  const releaseDialog = page.getByRole('dialog', { name: 'Liberar reserva' })
  await expect(releaseDialog.getByRole('button', { name: 'Manter reserva' })).toBeFocused()
  await page.keyboard.press('Tab')
  expect(await releaseDialog.evaluate((element) => element.contains(document.activeElement))).toBe(
    true,
  )
  await page.keyboard.press('Escape')
  await expect(release).toBeFocused()
})

test('move foco para o h1 após navegação', async ({ page }) => {
  await page.goto('./#/')
  const pixLink = page.getByRole('link', { name: 'Contribuir', exact: true })
  await pixLink.focus()
  await page.keyboard.press('Enter')

  await expect(page.getByRole('heading', { name: 'Contribuir por Pix' })).toBeFocused()
})
