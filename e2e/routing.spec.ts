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

for (const { heading, path } of [
  { path: 'item/CODIGO-INEXISTENTE', heading: 'Presente não encontrado' },
  { path: 'minha-reserva/reserva-inexistente', heading: 'Reserva não encontrada' },
  { path: 'colecao/colecao-inexistente', heading: 'Coleção não encontrada' },
  { path: 'rota-inexistente', heading: 'Página não encontrada' },
] as const) {
  test(`estado inválido #/${path} oferece h1 focalizado e retorno`, async ({ page }) => {
    await page.goto(`./#/${path}`)

    const title = page.getByRole('heading', { level: 1, name: heading })
    await expect(title).toBeVisible()
    await expect(title).toBeFocused()
    await page.getByRole('link', { name: /voltar (ao catálogo|à lista)/i }).click()
    await expect(page).toHaveURL(/#\/$/)
    await expect(page.getByRole('heading', { name: 'Lista da nossa casa nova' })).toBeVisible()
  })
}
