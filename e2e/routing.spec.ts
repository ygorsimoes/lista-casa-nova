import { expect, test } from './support/test.js'

const deepLinks = [
  { path: '', heading: 'Lista da nossa casa nova' },
  { path: 'item/CZ-001', heading: 'Chaleira' },
  { path: 'colecao/sugestoes-cozinha', heading: 'Sugestões para a cozinha' },
  { path: 'minha-reserva/reserva-demo-valida', heading: 'Cesto de roupas' },
  { path: 'pix', heading: 'Contribuir por Pix' },
  { path: 'pdf', heading: 'Prévia para impressão' },
  { path: 'admin', heading: 'Painel demonstrativo' },
] as const

for (const { heading, path } of deepLinks) {
  test(`abre e recarrega o link hash #/${path || ''}`, async ({ page }) => {
    await page.goto(`./#/${path}`)
    await expect(page.getByRole('heading', { name: heading, exact: true })).toBeVisible()
    await page.reload()
    await expect(page.getByRole('heading', { name: heading, exact: true })).toBeVisible()
  })
}

test('rota desconhecida retorna ao catálogo', async ({ page }) => {
  await page.goto('./#/rota-inexistente')

  await expect(page.getByRole('heading', { name: 'Página não encontrada' })).toBeVisible()
  await page.getByRole('link', { name: 'Voltar ao catálogo' }).click()
  await expect(page).toHaveURL(/#\/$/)
  await expect(page.getByRole('heading', { name: 'Lista da nossa casa nova' })).toBeVisible()
})
