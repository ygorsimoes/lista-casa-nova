import { expectNoHorizontalOverflow } from './support/assertions.js'
import { expect, test } from './support/test.js'
import { demoScenarios } from './support/demo-scenarios.js'

test('coleção válida mantém sugestões dentro do protótipo', async ({ page }) => {
  await page.goto(`./#/colecao/${demoScenarios.validCollection}`)

  const reference = page.getByRole('button', { name: 'Ver referência: Chaleira em inox' })
  await expect(reference).not.toHaveAttribute('href')
  await reference.click()
  await expect(
    page.getByText('Referência selecionada: Chaleira em inox. Nenhum site externo foi aberto.', {
      exact: true,
    }),
  ).toBeVisible()
})

test('coleção inválida apresenta erro amigável', async ({ page }) => {
  await page.goto('./#/colecao/colecao-inexistente')

  await expect(page.getByRole('heading', { name: 'Coleção não encontrada' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Voltar à lista' })).toHaveAttribute('href', '#/')
})

test('Pix simula cópia sem integração ou persistência', async ({ page }) => {
  await page.goto('./#/pix')

  await expect(page.getByText('DEMO-PIX-NAO-UTILIZAR-0002016304ABCD')).toBeVisible()
  await expect(
    page.getByText('Demonstração visual: nenhuma transferência é processada e nada é copiado.', {
      exact: true,
    }),
  ).toBeVisible()
  const copy = page.getByRole('button', { name: 'Simular cópia' })
  await expect(copy).toHaveClass(/ui-button--secondary/)
  await copy.click()
  await expect(
    page.getByText('Cópia simulada: nenhum dado foi copiado.', { exact: true }),
  ).toBeVisible()
  await expectNoHorizontalOverflow(page)
})

test('prévia A4 filtra e simula download sem gerar arquivo', async ({ page }) => {
  await page.goto('./#/pdf')

  const sheet = page.getByRole('region', { name: 'Folha A4 demonstrativa' })
  await expect(sheet).toContainText('Chaleira')
  const summary = page.getByRole('status', { name: 'Resumo da prévia' })
  await expect(summary).toContainText('11 ideias na prévia.')
  await page.getByRole('button', { name: 'Disponíveis', exact: true }).click()
  await expect(sheet).not.toContainText('Jogo de toalhas')
  await expect(summary).toContainText('8 ideias na prévia.')
  const downloadStarted = page
    .waitForEvent('download', { timeout: 500 })
    .then(() => true)
    .catch(() => false)
  await page.getByRole('button', { name: 'Simular download' }).click()
  await expect(
    page.getByText('Download simulado: nenhum arquivo foi gerado.', { exact: true }),
  ).toBeVisible()
  expect(await downloadStarted).toBe(false)
  await expect(page.getByRole('link', { name: /download/i })).toHaveCount(0)
  await expectNoHorizontalOverflow(page)
})
