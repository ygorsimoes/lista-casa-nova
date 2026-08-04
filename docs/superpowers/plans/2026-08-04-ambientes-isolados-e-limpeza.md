# Ambientes Isolados e Limpeza da Lista Real Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Manter a lista funcional em desenvolvimento local com um Supabase Cloud exclusivo de desenvolvimento e publicar a `main` no GitHub Pages com configuração exclusiva de produção, removendo o legado demonstrativo que não participa do produto real.

**Architecture:** O cliente Vite lê variáveis em tempo de build. O desenvolvimento recebe apenas `.env.local` com o projeto Cloud de desenvolvimento, enquanto o job de publicação do Pages recebe variáveis explicitamente do ambiente protegido `github-pages`. Migrações versionadas reproduzem o catálogo fictício no projeto de desenvolvimento; os testes se dividem entre unidade rápida, navegador determinístico e integração real somente nesse projeto isolado.

**Tech Stack:** React 19, Vite 8, TypeScript, Vitest, Playwright, Supabase CLI, Supabase Auth/Postgres/RLS, GitHub Actions e GitHub Pages.

## Global Constraints

- A `main` é a fonte da publicação de produção; nenhuma variável de produção entra na CI de pull request ou no ambiente local.
- `.env.local`, chaves privadas, dados de convidados e exportações de produção não entram no Git.
- O navegador recebe somente a chave publicável do Supabase; `service_role` nunca é usada pelo aplicativo.
- Usar `app_metadata.role = "admin"` para autorização local e hospedada; nunca `user_metadata`.
- Toda operação no projeto de desenvolvimento usa o vínculo explícito desse projeto; operações de produção usam o vínculo de produção e começam por `--dry-run`, exigindo aprovação específica antes de escrita.
- Preservar as rotas reais `/#/`, `/#/pix`, `/#/pdf` e `/#/admin`.
- Não introduzir painel, relatórios, contas públicas ou outras funções novas.

---

## Estrutura de arquivos

| Arquivo                                                                      | Responsabilidade depois da mudança                                                                                                 |
| ---------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `.env.example`                                                               | Lista as cinco variáveis públicas sem valores e instrui a cópia para `.env.local`.                                                 |
| `supabase/config.toml`                                                       | Configuração do projeto e Auth, com redirecionamento para o Vite em `127.0.0.1:5173`.                                              |
| `supabase/migrations/20260804044343_seed_initial_gifts.sql`                  | Catálogo fictício local já versionado, sem pessoas, reservas ou credenciais de produção.                                           |
| `supabase/.gitignore`                                                        | Ignora somente arquivos gerados pelo CLI e credenciais locais.                                                                     |
| `scripts/verify-development-supabase.mjs`                                    | Prova, contra o projeto Cloud de desenvolvimento, o catálogo, uma reserva pública e a proibição de leitura de nomes por visitante. |
| `package.json`                                                               | Expõe comandos curtos para iniciar, redefinir e validar o Supabase local.                                                          |
| `.github/workflows/pages.yml`                                                | Injeta variáveis do ambiente protegido apenas no build de Pages.                                                                   |
| `src/app/App.tsx`, `src/app/routes.tsx`                                      | Conservam apenas a árvore da lista real.                                                                                           |
| `src/test/renderApp.tsx` e testes de fluxos reais                            | Renderização e contratos da aplicação sem o estado demonstrativo.                                                                  |
| `e2e/lista-real.spec.ts`, `e2e/support/live-test.ts`, `playwright.config.ts` | Jornada essencial de navegador sem guardas do protótipo antigo.                                                                    |
| `docs/development.md`                                                        | Instruções locais, bootstrap do admin local e checklist seguro de produção.                                                        |

### Task 1: Fixar a fronteira entre desenvolvimento Cloud e publicação

**Files:**

- Create: `docs/development.md`
- Add: `supabase/config.toml`, `supabase/.gitignore`
- Modify: `.env.example`, `package.json`, `.github/workflows/pages.yml`

**Interfaces:**

- Consumes: `import.meta.env.VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`, `VITE_PIX_COPY_AND_PASTE`, `VITE_PIX_RECEIVER_NAME`, `VITE_PIX_RECEIVER_CITY` já lidas por `src/lib/supabase.ts` e Pix.
- Produces: `npm run supabase:link:dev`, `npm run supabase:migrate:dev`, `npm run supabase:clean-test-data:dev` e `npm run test:integration:dev`; build de Pages com as cinco variáveis fornecidas pelo ambiente `github-pages`.

- [ ] **Step 1: Escrever a verificação que deve falhar quando o projeto de produção entra no desenvolvimento**

Criar `scripts/verify-development-supabase.mjs` para exigir a URL configurada do projeto de desenvolvimento e recusar a URL de produção antes de qualquer chamada:

```js
const url = process.env.VITE_SUPABASE_URL
if (!url || url === process.env.PRODUCTION_SUPABASE_URL) {
  throw new Error('A integração exige o projeto Supabase de desenvolvimento.')
}
```

- [ ] **Step 2: Executar a verificação sem variável de desenvolvimento**

Run: `node scripts/verify-development-supabase.mjs`

Expected: falha com a mensagem de que a URL de desenvolvimento é obrigatória.

- [ ] **Step 3: Implementar a configuração local mínima**

Versionar `supabase/config.toml` e ajustar o bloco Auth para:

```toml
[auth]
site_url = "http://127.0.0.1:5173"
additional_redirect_urls = ["http://127.0.0.1:5173"]
enable_signup = false
```

Manter `supabase/migrations/20260804044343_seed_initial_gifts.sql` como catálogo inicial fictício; não inserir em `auth.users` ou `public.reservations`. Atualizar `.env.example` sem valores e documentar que `.env.local` recebe a URL e a chave publicável do projeto Cloud de desenvolvimento, nunca do projeto de produção.

- [ ] **Step 4: Adicionar comandos e documentação operacional**

Adicionar ao `package.json`:

```json
"supabase:link:dev": "supabase link --project-ref $SUPABASE_DEV_PROJECT_REF",
"supabase:migrate:dev": "supabase db push --linked",
"supabase:clean-test-data:dev": "supabase db query --linked \"delete from public.reservations where guest_name = 'Teste de desenvolvimento';\"",
"test:integration:dev": "node scripts/verify-development-supabase.mjs"
```

O script de integração deve ler `.env.local`, validar que ela aponta ao projeto de desenvolvimento e não imprimir valores. Em `docs/development.md`, registrar este fluxo:

```text
1. Preencher .env.local com a URL e chave publicável do projeto Cloud de desenvolvimento
2. Definir SUPABASE_DEV_PROJECT_REF apenas na sessão local de terminal
3. npm run supabase:link:dev
4. npm run supabase:migrate:dev
5. Criar no painel Cloud de desenvolvimento um único usuário e definir app_metadata.role como admin
6. npm run dev
7. npm run test:integration:dev
```

- [ ] **Step 5: Isolar o build do GitHub Pages**

No passo `Gerar build` de `.github/workflows/pages.yml`, declarar explicitamente:

```yaml
env:
  VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
  VITE_SUPABASE_PUBLISHABLE_KEY: ${{ secrets.VITE_SUPABASE_PUBLISHABLE_KEY }}
  VITE_PIX_COPY_AND_PASTE: ${{ secrets.VITE_PIX_COPY_AND_PASTE }}
  VITE_PIX_RECEIVER_NAME: ${{ secrets.VITE_PIX_RECEIVER_NAME }}
  VITE_PIX_RECEIVER_CITY: ${{ secrets.VITE_PIX_RECEIVER_CITY }}
```

Configurar esses cinco valores no ambiente GitHub `github-pages`; não adicioná-los ao repositório nem à CI.

- [ ] **Step 6: Verificar localmente**

Run: `npm run supabase:link:dev && npm run supabase:migrate:dev && npm run test:integration:dev`

Expected: migrações aplicadas no banco de desenvolvimento com dados fictícios; a URL de produção é recusada pelo verificador.

- [ ] **Step 7: Commit**

```bash
git add .env.example package.json .github/workflows/pages.yml supabase scripts docs/development.md
git commit -m "chore: isolar ambientes da lista"
```

### Task 2: Remover a árvore demonstrativa sem tocar nos fluxos reais

**Files:**

- Modify: `src/app/App.tsx`, `src/app/routes.tsx`, `src/test/renderApp.tsx`
- Delete: `src/app/DemoStateProvider.tsx`, `src/app/DemoStateProvider.test.tsx`
- Delete: `src/data/catalog.ts`, `src/data/collections.ts`, `src/data/initial-state.ts`, `src/data/reservations.ts`, `src/data/settings.ts`, `src/data/fixtures.test.ts`
- Delete: `src/domain/demo-reducer.ts`, `src/domain/demo-reducer.test.ts`, `src/domain/selectors.ts`, `src/domain/selectors.test.ts`, `src/domain/types.ts`
- Delete: `src/features/catalog/CatalogFilters.tsx`, `CatalogPage.tsx`, `CatalogPage.test.tsx`, `CategoryList.tsx`, `GiftCard.tsx`, `GiftCard.test.tsx`, `GiftDetailsContent.tsx`, `GiftDetails.test.tsx`, `GiftDetailsDialog.tsx`, `GiftDetailsPage.tsx`, `GiftDetailsPage.test.tsx`, `GiftGrid.tsx`, `GiftVisual.tsx`, `GiftVisual.test.tsx`, `gift-presentation.ts`, `gift-presentation.test.ts`
- Delete: `src/features/collections/CollectionPage.tsx`, `CollectionPage.test.tsx`
- Delete: `src/features/reservations/ManageReservationPage.tsx`, `ManageReservationPage.test.tsx`, `ReservationForm.tsx`, `ReservationForm.test.tsx`, `ReservationOutcome.tsx`, `ReservationSummary.tsx`, `reservation-validation.ts`, `reservation-validation.test.ts`
- Delete: `src/features/admin/AdminDashboard.tsx`, `AdminGiftList.tsx`, `AdminReservations.tsx`, `AdminSummary.tsx`, `SiteSettingsForm.tsx`

**Interfaces:**

- Consumes: `LiveCatalogPage`, `PixPage`, `PdfPreviewPage`, `AdminPage`, `GiftListProvider`, `InitialLoadingGate` e `ToastProvider`.
- Produces: `AppRoutes` sem rotas de detalhe, coleção e gerenciamento simulados; `App` sem `DemoStateProvider`.

- [ ] **Step 1: Escrever os testes de rota que devem falhar**

Em `src/app/routes.test.tsx`, declarar somente as rotas reais como contrato:

```tsx
it.each(['/', '/pix', '/pdf', '/admin'])('renderiza a rota real %s', async (path) => {
  render(<App initialPath={path} />)
  expect(await screen.findByRole('main')).toBeInTheDocument()
})

it.each(['/item/x', '/colecao/sala', '/minha-reserva/x'])(
  'não preserva rota demonstrativa %s',
  (path) => {
    render(<App initialPath={path} />)
    expect(screen.getByText(/não encontrada/i)).toBeInTheDocument()
  },
)
```

- [ ] **Step 2: Executar o teste antes da remoção**

Run: `npm run test:unit -- src/app/routes.test.tsx`

Expected: falha porque as rotas demonstrativas ainda existem.

- [ ] **Step 3: Remover somente as importações e rotas demonstrativas**

Em `src/app/routes.tsx`, manter `/`, `/pix`, `/pdf`, `/admin` e `*`; remover `backgroundLocation`, `AppLocationState` e as rotas `/item/:code`, `/colecao/:slug` e `/minha-reserva/:token`. Em `src/app/App.tsx`, remover apenas `DemoStateProvider` e seu envoltório.

- [ ] **Step 4: Apagar os arquivos enumerados e simplificar o helper de teste**

Usar busca de importações antes de cada grupo. Não remover `src/domain/gifts.ts`, `LiveCatalogPage`, `catalog-api.ts`, `AdminPage.tsx`, `admin-api.ts`, Pix, PDF nem os componentes UI compartilhados. Ajustar `renderApp.tsx` para usar `GiftListProvider`, `ToastProvider` e `HashRouter`, sem estado demonstrativo.

- [ ] **Step 5: Rodar a suíte de tipo e rotas**

Run: `npm run typecheck && npm run test:unit -- src/app/routes.test.tsx`

Expected: sucesso sem importações para os arquivos removidos.

- [ ] **Step 6: Commit**

```bash
git add src
git commit -m "refactor: remover protótipo legado"
```

### Task 3: Substituir a suíte herdada por testes pequenos dos fluxos reais

**Files:**

- Modify: `src/features/catalog/LiveCatalogPage.test.tsx`, `src/features/catalog/LiveCatalogPage.filters.test.tsx`, `src/features/catalog/catalog-api.test.ts`, `src/features/admin/AdminPage.test.tsx`, `src/features/admin/admin-api.test.ts`, `src/features/pdf/ScaledPrintablePreview.test.tsx`
- Create: `src/features/pix/pix-payload.test.ts`, `src/app/routes.test.tsx`, `e2e/lista-real.spec.ts`, `e2e/support/live-test.ts`
- Modify: `playwright.config.ts`, `e2e/pix-pdf.spec.ts`
- Delete: `e2e/accessibility.states.spec.ts`, `admin.spec.ts`, `catalog.mobile.spec.ts`, `keyboard.spec.ts`, `reduced-motion.spec.ts`, `reservation-management.spec.ts`, `reservation.spec.ts`, `responsive.breakpoints.spec.ts`, `responsive.desktop.spec.ts`, `routing.spec.ts`, `visual-regression.spec.ts`, `e2e/support/assertions.ts`, `demo-scenarios.ts`, `flows.ts`, `test.ts`, `e2e/__screenshots__/`

**Interfaces:**

- Consumes: contratos reais `loadGifts`, `reserveGift`, APIs administrativas, `buildPixPayload` e componentes de lista/PDF.
- Produces: `npm run test:unit`, `npm run test:e2e` e `npm run test:integration:local` como três verificações de intenção distinta.

- [ ] **Step 1: Escrever os casos unitários essenciais**

Manter apenas estes casos por contrato:

```ts
// catálogo: carrega, mostra indisponível e impede nova reserva
await expect(reserveGift('gift-id', 'Ana')).resolves.toEqual({ kind: 'reserved' })
await expect(reserveGift('gift-id', 'Bia')).resolves.toEqual({ kind: 'already_reserved' })

// administração: convidado não recebe nomes; admin recebe catálogo e reserva
expect(await listAdminReservations(guestClient)).toEqual([])
expect(await listAdminReservations(adminClient)).toHaveLength(1)

// Pix/PDF: payload inclui campos configurados; impressão não exibe reservante
expect(buildPixPayload(config)).toContain('Ygor')
expect(printableText).not.toContain('Nome de quem reservou')
```

- [ ] **Step 2: Executar os testes selecionados para confirmar que o legado ainda falha**

Run: `npm run test:unit -- src/features/catalog/LiveCatalogPage.test.tsx src/features/admin/AdminPage.test.tsx`

Expected: falha até que os dublês e expectativas demonstrativas sejam substituídos.

- [ ] **Step 3: Implementar dublês determinísticos e remover expectativas de protótipo**

Os testes de componente devem dublar `src/lib/supabase.ts` e as APIs de recurso, sem chamar URL externa. Atualizar `playwright.config.ts` para um único projeto Chromium e `e2e/support/live-test.ts` para interceptar somente as chamadas REST necessárias com catálogo fictício e respostas de reserva previsíveis.

- [ ] **Step 4: Escrever uma jornada Playwright curta**

Em `e2e/lista-real.spec.ts`, cobrir este roteiro:

```ts
test('reserva um presente e mantém os dados da pessoa privados', async ({ page }) => {
  await page.goto('/')
  await page
    .getByRole('button', { name: /reservar/i })
    .first()
    .click()
  await page.getByLabel(/seu nome/i).fill('Ana')
  await page.getByRole('button', { name: /confirmar reserva/i }).click()
  await expect(page.getByText(/reservado em seu nome/i)).toBeVisible()
  await page.getByRole('button', { name: /voltar para a lista/i }).click()
  await expect(page.getByText('Ana')).not.toBeVisible()
})
```

Adicionar teste de Pix com botão copiar e teste de PDF verificando ausência de nomes, sem snapshot visual.

- [ ] **Step 5: Executar a suíte essencial**

Run: `npm run test:unit && npm run build && npm run test:e2e`

Expected: testes não acessam a instância hospedada; a jornada cobre reserva, Pix, PDF e login/admin com API simulada.

- [ ] **Step 6: Commit**

```bash
git add src e2e playwright.config.ts package.json
git commit -m "test: cobrir fluxos reais da lista"
```

### Task 4: Provar integração, RLS e publicação sem escrever na produção

**Files:**

- Modify: `scripts/verify-local-supabase.mjs`, `docs/development.md`
- Test: `supabase/migrations/20260804044015_create_gift_list.sql`, `supabase/migrations/20260804044115_harden_rls_auto_enable.sql`, `supabase/migrations/20260804044133_revoke_public_rls_trigger_execute.sql`, `supabase/migrations/20260804044343_seed_initial_gifts.sql`

**Interfaces:**

- Consumes: URL e chave publicável do projeto de desenvolvimento em `.env.local`.
- Produces: código de saída zero somente se a reserva anônima puder ocorrer uma vez, não revelar o reservante e a listagem administrativa exigir sessão com papel admin.

- [ ] **Step 1: Escrever a prova de integração no projeto de desenvolvimento**

Implementar `scripts/verify-development-supabase.mjs` para:

```js
const gifts = await select('/rest/v1/gifts?select=id,status&limit=1')
const reservation = await insert('/rest/v1/reservations', {
  gift_id: gifts[0].id,
  reserved_by_name: 'Teste local',
})
await expectForbidden('/rest/v1/reservations?select=reserved_by_name')
await expectConflict('/rest/v1/reservations', reservation)
```

Usar apenas `Teste desenvolvimento` e apagar essa reserva ao final no projeto de desenvolvimento, quando a política permitir; nenhuma chamada recebe URL de produção.

- [ ] **Step 2: Executar contra projeto de desenvolvimento recém-redefinido**

Run: `npm run supabase:migrate:dev && npm run test:integration:dev && npm run supabase:clean-test-data:dev`

Expected: catálogo de semente carregado; primeira reserva aceita; segunda rejeitada; nomes não são legíveis pelo visitante.

- [ ] **Step 3: Confirmar migrações e regras no projeto de desenvolvimento**

Run: `supabase migration list --linked && supabase db advisors --linked`

Expected: quatro migrações existentes aplicadas no projeto de desenvolvimento e nenhum novo aviso introduzido pelas regras expostas.

- [ ] **Step 4: Fazer apenas a prévia remota**

Run: `supabase db push --linked --dry-run`

Expected: nenhuma escrita remota. Se a prévia listar alteração, parar e apresentar o SQL ao usuário antes de qualquer `supabase db push --linked`.

- [ ] **Step 5: Validar o workflow sem revelar valores**

Criar uma execução manual de Pages somente depois de cadastrar as cinco variáveis no ambiente `github-pages`. Conferir nos logs que `Gerar build` recebeu as variáveis mascaradas e que o artefato da publicação foi gerado. Não imprimir os valores.

- [ ] **Step 6: Commit**

```bash
git add scripts docs/development.md
git commit -m "test: validar Supabase local"
```

### Task 5: Revisão final e promoção controlada para produção

**Files:**

- Review: `.github/workflows/ci.yml`, `.github/workflows/pages.yml`, `docs/development.md`, `.env.example`, `supabase/`, `src/app/`, `src/features/`, `e2e/`

**Interfaces:**

- Consumes: commits das Tasks 1–4 e configuração do ambiente GitHub `github-pages`.
- Produces: uma mudança pronta para revisão, sem dados remotos modificados.

- [ ] **Step 1: Rodar a validação completa no ambiente local**

Run: `npm run lint && npm run typecheck && npm run test:unit && npm run build && npm run test:e2e && npm run test:integration:dev`

Expected: todos passam; avisos conhecidos de tamanho de bundle são registrados separadamente e não mascaram falhas.

- [ ] **Step 2: Auditar referências e segredos**

Run: `rg -n "DemoStateProvider|/item/:code|/colecao/:slug|/minha-reserva/:token|service_role|SUPABASE_SERVICE" src e2e .github package.json docs`

Expected: nenhuma referência demonstrativa ou segredo no cliente; somente o texto de documentação de segurança pode mencionar `service_role`.

- [ ] **Step 3: Revisar alterações antes da promoção**

Run: `git diff main...HEAD -- . ':!package-lock.json' && git status --short`

Expected: inclui apenas a lista real, ambiente local, documentação e testes essenciais; não inclui `.env.local`, dados de produção ou arquivos gerados pelo Supabase.

- [ ] **Step 4: Commit final**

```bash
git add .
git commit -m "chore: finalizar isolamento da lista"
```

- [ ] **Step 5: Pedir aprovação antes da produção**

Apresentar ao usuário a prévia `supabase db push --linked --dry-run`, o diff e os resultados da suíte. Só depois de autorização explícita, integrar na `main` e permitir a publicação do Pages. Se não houver migração pendente, não executar `supabase db push --linked`.

## Revisão do plano

- Cobertura da especificação: Tasks 1 e 4 isolam ambientes e provam o Supabase local; Task 2 remove o legado; Task 3 reduz a suíte aos fluxos reais; Task 5 protege a promoção e a produção.
- Dados de produção: nenhuma tarefa exporta ou reutiliza usuários, reservas ou nomes hospedados.
- Segurança: a chave de serviço não é adicionada, autorização continua baseada em `app_metadata`, e a única prévia remota é sem escrita.
- Escopo: não inclui recursos novos; a única capacidade operacional adicional é verificar localmente o que já existe.
