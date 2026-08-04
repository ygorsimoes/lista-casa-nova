import { expectReducedMotionApplied } from './support/assertions.js'
import { openGiftDetails, unlockDemoAdmin } from './support/flows.js'
import { test } from './support/test.js'

test('@a11y reduz animações no catálogo, painel e administração', async ({ page }) => {
  await page.goto('./#/')
  await expectReducedMotionApplied(page)
  await openGiftDetails(page)
  await expectReducedMotionApplied(page)
  await unlockDemoAdmin(page)
  await page.getByRole('button', { name: 'Reservas' }).click()
  await expectReducedMotionApplied(page)
})
