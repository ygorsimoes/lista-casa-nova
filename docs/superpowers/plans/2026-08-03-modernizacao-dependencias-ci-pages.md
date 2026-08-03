# Modernização de dependências, CI e GitHub Pages Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Modernizar as dependências compatíveis, separar validação e publicação, corrigir a instabilidade E2E e entregar o GitHub Pages automaticamente a partir de uma `main` protegida.

**Architecture:** A SPA continua estática, com `HashRouter`, mas passa a usar React Router 8 e o compilador nativo TypeScript 7 lado a lado com a API TypeScript 6 exigida pelo linter. O workflow `CI` produz os checks estáveis `quality` e `e2e`; um workflow privilegiado e separado de Pages reconstrói somente o SHA atual de `main` aprovado por essa CI.

**Tech Stack:** Node.js 24 LTS, npm 11, React 19.2.8, React Router 8.3.0, TypeScript nativo 7.0.2, API TypeScript 6 via `@typescript/typescript6@6.0.2`, Vite 8.2.0, Vitest 4.1.10, Playwright 1.62.1, GitHub Actions e GitHub Pages.

## Global Constraints

- Trabalhar somente em `codex/modernizar-dependencias-ci`, partindo de `main` no commit `d693aa8cba3dd1dc4cb723e89186dacfd437ba1b` ou de seu descendente sincronizado.
- Usar exclusivamente Node `>=24.15.0 <25`; `.nvmrc` permanece `24` e `@types/node` permanece `24.13.3`.
- Executar comandos locais `node`, `npm` e `npx` na mesma sessão selecionada por `nvm use 24`; em um shell novo, validar novamente `node --version` antes de prosseguir.
- Usar npm e tratar `package-lock.json` como fonte reproduzível; nunca editar entradas do lockfile manualmente.
- Substituir `react-router-dom@7.18.2` por `react-router@8.3.0` sem alterar `HashRouter`, URLs ou a base `/lista-casa-nova/`.
- Usar `@typescript/native: npm:typescript@7.0.2` para o binário `tsc` e `typescript: npm:@typescript/typescript6@6.0.2` para a API consumida por `typescript-eslint@8.65.0`.
- Não usar `--force`, `--legacy-peer-deps`, atualizações automáticas forçadas nem `npm audit fix --force`.
- Fixar todas as Actions em SHA integral, mantendo o release em comentário na mesma linha.
- Pull Requests executam apenas `quality` e `e2e`; nenhum contexto de PR pode publicar no Pages.
- O Pages só promove um `push` verde no tip de `main`, exigindo `workflow_run.head_sha == github.sha`; o disparo manual também fica restrito a `main`.
- Manter retries do Playwright em CI, mas reprovar qualquer teste classificado como flaky.
- Não alterar produto, interface, fixtures, persistência, rotas ou conteúdo demonstrativo além da documentação técnica.
- Não excluir branches locais ou remotas, inclusive `codex/prototipo-visual` e a branch desta migração.
- Fazer mutações remotas somente depois da validação local completa.
- Integrar o PR consolidado somente com `quality` e `e2e` verdes e sem bypass administrativo.
- Habilitar alertas, security updates e proteção de `main` somente depois do merge e da confirmação do novo deployment.
- Fechar os sete PRs antigos somente depois de Pages e HTTP estarem confirmados.
- Antes de cada commit, revisar `git diff --cached`, `git diff --cached --check` e o padrão dos commits recentes.

---

## Mapa de arquivos

### Dependências e runtime

- `package.json`: versões, aliases TypeScript e faixa de Node suportada.
- `package-lock.json`: resolução npm reproduzível e dependências opcionais multiplataforma.
- `.nvmrc`: permanece como seletor da linha Node 24.

### Migração de roteamento

Dezoito arquivos contêm dezenove imports que mudam somente a origem de
`react-router-dom` para `react-router`:

- `src/app/App.tsx`
- `src/app/routes.tsx`
- `src/components/layout/RouteEffects.tsx`
- `src/components/layout/SiteFooter.tsx`
- `src/components/layout/SiteHeader.tsx`
- `src/features/admin/AdminDashboard.tsx`
- `src/features/catalog/GiftCard.test.tsx`
- `src/features/catalog/GiftCard.tsx`
- `src/features/catalog/GiftDetailsDialog.tsx`
- `src/features/catalog/GiftDetailsPage.tsx`
- `src/features/catalog/HeroSection.tsx`
- `src/features/collections/CollectionPage.tsx`
- `src/features/not-found/NotFoundPage.tsx`
- `src/features/pdf/PdfPreviewPage.tsx`
- `src/features/pix/PixPage.tsx`
- `src/features/reservations/ManageReservationPage.tsx`
- `src/features/reservations/ReservationOutcome.tsx`
- `src/test/renderApp.tsx`

### Testes ponta a ponta

- `e2e/keyboard.spec.ts`: sincroniza o teste com o foco inicial aplicado por `RouteEffects`.
- `playwright.config.ts`: mantém retry diagnóstico e transforma flaky em falha da CI.

### Automação e manutenção

- Delete: `.github/workflows/ci-pages.yml`.
- Create: `.github/workflows/ci.yml`, responsável apenas por `quality` e `e2e`.
- Create: `.github/workflows/pages.yml`, responsável apenas por reconstruir e publicar `main`.
- Modify: `.github/dependabot.yml`, agrupando atualizações compatíveis e preservando a linha Node 24.
- Modify: `README.md`, documentando runtime, ponte TypeScript e fluxo de entrega.

### Estado remoto

Não há arquivo local para estas operações: branch padrão, Pull Request,
deployments, vulnerability alerts, Dependabot security updates, ruleset de
`main` e fechamento dos PRs substituídos serão administrados pela API do
GitHub após os checkpoints locais e remotos correspondentes.

## Referências primárias

- [Migração oficial do React Router 7 para 8](https://reactrouter.com/upgrading/v7)
- [Execução lado a lado de TypeScript 7 e 6](https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/)
- [Semântica e segurança de `workflow_run`](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows#workflow_run)
- [Uso de `GITHUB_SHA` no `deploy-pages@v5`](https://github.com/actions/deploy-pages/blob/cd2ce8fcbc39b97be8ca5fce6e763baed58fa128/src/internal/context.js)
- [Fixação segura de Actions por SHA](https://docs.github.com/en/actions/reference/security/secure-use)
- [Opções oficiais do Dependabot](https://docs.github.com/en/code-security/reference/supply-chain-security/dependabot-options-reference)

---

### Task 1: Migrar React Router, TypeScript e contrato de Node

**Files:**

- Modify: `package.json`
- Modify: `package-lock.json`
- Modify: os dezoito arquivos de import listados em “Migração de roteamento”
- Verify unchanged: `.nvmrc`

**Interfaces:**

- Consumes: scripts npm atuais, `HashRouter`, `Location`, `Link`, `Route`, `Routes` e hooks já usados pela aplicação.
- Produces: `react-router@8.3.0`, `tsc` 7.0.2, API TypeScript 6 compatível com `typescript-eslint` e runtime limitado à linha Node 24 suportada.

- [ ] **Step 1: Selecionar uma versão Node 24 dentro do contrato**

Run:

```bash
nvm install 24
nvm use 24
node -e "const [major, minor] = process.versions.node.split('.').map(Number); if (major !== 24 || minor < 15) process.exit(1); console.log(process.version)"
```

Expected: versão `v24.15.0` ou superior, sempre abaixo de 25, e código de saída zero.

- [ ] **Step 2: Registrar a caracterização antes da migração**

Run:

```bash
npm ci
npm run test:unit
npm run typecheck
npm run build
```

Expected: 24 arquivos e 107 testes aprovados, typecheck sem diagnóstico e build Vite concluído. O alerta de React Router ainda existe nesta linha de base e será eliminado nesta tarefa.

- [ ] **Step 3: Confirmar que o manifesto ainda não satisfaz o destino**

Run:

```bash
node <<'NODE'
const pkg = require('./package.json')
const valid =
  pkg.engines.node === '>=24.15.0 <25' &&
  pkg.dependencies['react-router'] === '8.3.0' &&
  !pkg.dependencies['react-router-dom'] &&
  pkg.devDependencies['@typescript/native'] === 'npm:typescript@7.0.2' &&
  pkg.devDependencies.typescript === 'npm:@typescript/typescript6@6.0.2'
if (!valid) process.exit(1)
NODE
```

Expected: FAIL com código 1 porque o manifesto ainda declara `>=24`, `react-router-dom@7.18.2` e `typescript@6.0.3`.

- [ ] **Step 4: Aplicar as versões finais ao manifesto**

Em `package.json`, deixar exatamente estes campos:

```json
{
  "engines": {
    "node": ">=24.15.0 <25"
  },
  "dependencies": {
    "lucide-react": "1.28.0",
    "react": "19.2.8",
    "react-dom": "19.2.8",
    "react-router": "8.3.0"
  },
  "devDependencies": {
    "@typescript/native": "npm:typescript@7.0.2",
    "typescript": "npm:@typescript/typescript6@6.0.2"
  }
}
```

Preservar todas as demais devDependencies e todos os scripts sem alteração.

- [ ] **Step 5: Migrar as dezenove declarações de importação**

Nos dezoito arquivos listados no mapa, aplicar esta substituição exata e
nenhuma outra mudança de código:

```diff
-from 'react-router-dom'
+from 'react-router'
```

`src/app/routes.tsx` possui duas declarações, uma com `import type { Location }`
e outra com os valores `Route`, `Routes` e `useLocation`; ambas mudam para
`react-router`. Não criar import de `react-router/dom`, pois o projeto não usa
`RouterProvider`.

- [ ] **Step 6: Regenerar a resolução npm a partir do manifesto final**

Run:

```bash
npm install --package-lock-only
npm ci
```

Expected: instalação limpa sem `ERESOLVE`, sem `--force` e com os aliases registrados no lockfile.

- [ ] **Step 7: Verificar versões, binários e remoção do pacote antigo**

Run:

```bash
npx --no-install tsc --version
node -e "const pkg = require('typescript/package.json'); const ts = require('typescript'); console.log(JSON.stringify({ packageVersion: pkg.version, apiVersion: ts.version, bin: pkg.bin }))"
npm ls --depth=0 @typescript/native typescript react-router
test ! -d node_modules/react-router-dom
if rg -n "from ['\"]react-router-dom['\"]" src; then exit 1; fi
```

Expected:

```text
Version 7.0.2
{"packageVersion":"6.0.2","apiVersion":"6.0.3","bin":{"tsc6":"./bin/tsc6"}}
@typescript/native@npm:typescript@7.0.2
react-router@8.3.0
typescript@npm:@typescript/typescript6@6.0.2
```

O `rg` não imprime ocorrências e `react-router-dom` não existe em
`node_modules`.

- [ ] **Step 8: Executar a suíte relevante da migração**

Run:

```bash
npm audit --omit=dev --audit-level=high
npm run lint
npm run typecheck
npm run test:unit
npm run build
git diff --check
```

Expected: zero vulnerabilidades de produção, 24 arquivos/107 testes aprovados,
lint e tipos sem diagnóstico, build concluído e diff sem erros.

- [ ] **Step 9: Revisar e commitar a migração**

Run:

```bash
git add package.json package-lock.json \
  src/app/App.tsx \
  src/app/routes.tsx \
  src/components/layout/RouteEffects.tsx \
  src/components/layout/SiteFooter.tsx \
  src/components/layout/SiteHeader.tsx \
  src/features/admin/AdminDashboard.tsx \
  src/features/catalog/GiftCard.test.tsx \
  src/features/catalog/GiftCard.tsx \
  src/features/catalog/GiftDetailsDialog.tsx \
  src/features/catalog/GiftDetailsPage.tsx \
  src/features/catalog/HeroSection.tsx \
  src/features/collections/CollectionPage.tsx \
  src/features/not-found/NotFoundPage.tsx \
  src/features/pdf/PdfPreviewPage.tsx \
  src/features/pix/PixPage.tsx \
  src/features/reservations/ManageReservationPage.tsx \
  src/features/reservations/ReservationOutcome.tsx \
  src/test/renderApp.tsx
git diff --cached --stat
git diff --cached --check
git diff --cached
git log -8 --pretty=format:'%h %s'
git commit -m "build: migrar roteamento e compilador TypeScript" -m "Adota React Router 8 e o compilador nativo TypeScript 7, mantendo a API TypeScript 6 compatível com o linter e alinhando o runtime à linha Node 24 suportada."
```

Expected: commit contém somente manifesto, lockfile e as dezenove mudanças de importação.

---

### Task 2: Tornar a corrida de foco determinística e reprovar flakiness

**Files:**

- Modify: `e2e/keyboard.spec.ts:4`
- Modify: `playwright.config.ts:6`

**Interfaces:**

- Consumes: foco inicial no `h1` aplicado por `RouteEffects` e retry único já configurado na CI.
- Produces: teste sincronizado por estado observável e `failOnFlakyTests: true` quando `CI` estiver definido.

- [ ] **Step 1: Registrar a evidência RED já observada no GitHub**

Run:

```bash
gh run view 30785607854 -R ygorsimoes/lista-casa-nova --log | rg -n "flaky|opera filtros com Enter e Espaço|aria-pressed"
```

Expected: o log mostra `mobile-webkit`, `aria-pressed` permanecendo `false` na
primeira tentativa e o caso classificado como flaky após passar no retry.

- [ ] **Step 2: Sincronizar o teste com o foco inicial da rota**

Em `e2e/keyboard.spec.ts`, deixar o início do teste assim:

```ts
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
```

Preservar o restante do teste. Não alterar `RouteEffects`, não adicionar sleep
e não aumentar timeout.

- [ ] **Step 3: Fazer a CI falhar quando um retry for necessário**

Em `playwright.config.ts`, manter o retry e acrescentar a opção adjacente:

```ts
fullyParallel: true,
forbidOnly: Boolean(process.env.CI),
failOnFlakyTests: Boolean(process.env.CI),
retries: process.env.CI ? 1 : 0,
```

- [ ] **Step 4: Exercitar repetidamente o caso WebKit**

Run:

```bash
npm run build
CI=1 npx --no-install playwright test e2e/keyboard.spec.ts --project=mobile-webkit --grep "opera filtros com Enter e Espaço" --repeat-each=20 --workers=1
```

Expected: 20 aprovações, nenhuma classificação flaky e código de saída zero.

- [ ] **Step 5: Executar a matriz E2E completa**

Run:

```bash
npm run test:e2e
```

Expected: 69 testes aprovados em mobile Chromium, mobile WebKit e desktop Chromium.

- [ ] **Step 6: Revisar e commitar o endurecimento E2E**

Run:

```bash
git add e2e/keyboard.spec.ts playwright.config.ts
git diff --cached --check
git diff --cached
git log -8 --pretty=format:'%h %s'
git commit -m "test(e2e): sincronizar foco inicial no WebKit" -m "Aguarda o contrato de foco da rota antes de operar os filtros e mantém o retry apenas como diagnóstico, fazendo a CI reprovar qualquer execução flaky."
```

Expected: commit contém somente o teste de teclado e a configuração Playwright.

---

### Task 3: Separar CI e publicação do GitHub Pages

**Files:**

- Delete: `.github/workflows/ci-pages.yml`
- Create: `.github/workflows/ci.yml`
- Create: `.github/workflows/pages.yml`

**Interfaces:**

- Consumes: scripts npm validados nas Tasks 1 e 2, `.nvmrc`, `package-lock.json` e `dist` produzido por Vite.
- Produces: checks obrigatórios `quality` e `e2e`; workflow `GitHub Pages` elegível apenas para o SHA atual de um push verde em `main` ou dispatch manual de `main`.

- [ ] **Step 1: Confirmar as referências móveis do workflow antigo**

Run:

```bash
rg -n 'actions/.+@v[0-9]+' .github/workflows/ci-pages.yml
```

Expected: referências móveis para checkout, configure/upload/deploy Pages e upload de diagnóstico.

- [ ] **Step 2: Criar o workflow `CI`**

Criar `.github/workflows/ci.yml` com o conteúdo integral:

```yaml
name: CI

on:
  pull_request:
    branches: [main]
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read

concurrency:
  group: ci-${{ github.event_name }}-${{ github.event.pull_request.number || github.ref }}
  cancel-in-progress: true

jobs:
  quality:
    name: quality
    runs-on: ubuntu-latest
    timeout-minutes: 15
    steps:
      - name: Obter código
        uses: actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1 # v7.0.1
        with:
          persist-credentials: false
      - name: Configurar Node.js
        uses: actions/setup-node@820762786026740c76f36085b0efc47a31fe5020 # v7.0.0
        with:
          node-version-file: .nvmrc
          cache: npm
          cache-dependency-path: package-lock.json
      - name: Instalar dependências
        run: npm ci
      - name: Auditar dependências de produção
        run: npm audit --omit=dev --audit-level=high
      - name: Validar formatação
        run: npm run format:check
      - name: Executar lint
        run: npm run lint
      - name: Validar tipos
        run: npm run typecheck
      - name: Executar testes com cobertura
        run: npm run test
      - name: Gerar build
        run: npm run build

  e2e:
    name: e2e
    needs: quality
    runs-on: ubuntu-latest
    timeout-minutes: 30
    steps:
      - name: Obter código
        uses: actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1 # v7.0.1
        with:
          persist-credentials: false
      - name: Configurar Node.js
        uses: actions/setup-node@820762786026740c76f36085b0efc47a31fe5020 # v7.0.0
        with:
          node-version-file: .nvmrc
          cache: npm
          cache-dependency-path: package-lock.json
      - name: Instalar dependências
        run: npm ci
      - name: Gerar build
        run: npm run build
      - name: Instalar navegadores do Playwright
        run: npx --no-install playwright install --with-deps chromium webkit
      - name: Executar testes ponta a ponta
        id: e2e
        run: npm run test:e2e:ci
      - name: Enviar diagnóstico do Playwright
        if: ${{ failure() && steps.e2e.outcome == 'failure' }}
        uses: actions/upload-artifact@043fb46d1a93c77aae656e7c1c64a875d1fc6a0a # v7.0.1
        with:
          name: playwright-report-${{ github.run_id }}-${{ github.run_attempt }}
          path: |
            playwright-report/
            test-results/
          if-no-files-found: ignore
          retention-days: 7
```

- [ ] **Step 3: Criar o workflow `GitHub Pages`**

Criar `.github/workflows/pages.yml` com o conteúdo integral:

```yaml
name: GitHub Pages

on:
  workflow_run:
    workflows: [CI]
    types: [completed]
    branches: [main]
  workflow_dispatch:

permissions: {}

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  deploy:
    name: deploy
    if: >-
      (github.event_name == 'workflow_run' &&
      github.event.workflow_run.event == 'push' &&
      github.event.workflow_run.head_branch == 'main' &&
      github.event.workflow_run.conclusion == 'success' &&
      github.event.workflow_run.head_sha == github.sha) ||
      (github.event_name == 'workflow_dispatch' &&
      github.ref == 'refs/heads/main')
    runs-on: ubuntu-latest
    timeout-minutes: 15
    permissions:
      contents: read
      pages: write
      id-token: write
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Obter código aprovado
        uses: actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1 # v7.0.1
        with:
          ref: ${{ github.event_name == 'workflow_run' && github.event.workflow_run.head_sha || github.sha }}
          persist-credentials: false
      - name: Configurar Node.js
        uses: actions/setup-node@820762786026740c76f36085b0efc47a31fe5020 # v7.0.0
        with:
          node-version-file: .nvmrc
          cache: npm
          cache-dependency-path: package-lock.json
      - name: Instalar dependências
        run: npm ci
      - name: Gerar build
        run: npm run build
      - name: Configurar GitHub Pages
        uses: actions/configure-pages@45bfe0192ca1faeb007ade9deae92b16b8254a0d # v6.0.0
      - name: Enviar artefato do GitHub Pages
        uses: actions/upload-pages-artifact@fc324d3547104276b827a68afc52ff2a11cc49c9 # v5.0.0
        with:
          name: github-pages
          path: dist
          retention-days: 1
      - name: Publicar GitHub Pages
        id: deployment
        uses: actions/deploy-pages@cd2ce8fcbc39b97be8ca5fce6e763baed58fa128 # v5.0.0
        with:
          artifact_name: github-pages
```

- [ ] **Step 4: Remover o workflow monolítico**

Excluir `.github/workflows/ci-pages.yml`. Não deixar um redirect, cópia ou
workflow desabilitado com o nome antigo.

- [ ] **Step 5: Validar formatação, sintaxe e políticas locais**

Run:

```bash
npx --no-install prettier --check .github/workflows/ci.yml .github/workflows/pages.yml
ruby -e 'require "yaml"; ARGV.each { |file| YAML.parse_file(file) }' .github/workflows/ci.yml .github/workflows/pages.yml
test ! -e .github/workflows/ci-pages.yml
test "$(rg -o 'uses: [^@[:space:]]+@[0-9a-f]{40}' .github/workflows | wc -l | tr -d ' ')" = 10
if rg -n 'uses: [^#[:space:]]+@(v[0-9]+|main|master)([[:space:]]|$)' .github/workflows; then exit 1; fi
rg -n 'workflow_run.head_sha == github.sha' .github/workflows/pages.yml
git diff --check
```

Expected: Prettier e parser YAML aprovam; existem exatamente dez usos fixados
em SHA; não há tag móvel; o guard de identidade aparece uma vez; o arquivo
antigo não existe.

- [ ] **Step 6: Validar semanticamente os workflows com actionlint fixado**

Run:

```bash
actionlint_dir="$(mktemp -d /tmp/lista-casa-actionlint.XXXXXX)"
gh release download v1.7.12 -R rhysd/actionlint -p 'actionlint_1.7.12_darwin_arm64.tar.gz' -p 'actionlint_1.7.12_checksums.txt' -D "$actionlint_dir"
expected_checksum="$(awk '$2 == "actionlint_1.7.12_darwin_arm64.tar.gz" { print $1 }' "$actionlint_dir/actionlint_1.7.12_checksums.txt")"
actual_checksum="$(shasum -a 256 "$actionlint_dir/actionlint_1.7.12_darwin_arm64.tar.gz" | awk '{ print $1 }')"
test -n "$expected_checksum"
test "$actual_checksum" = "$expected_checksum"
tar -xzf "$actionlint_dir/actionlint_1.7.12_darwin_arm64.tar.gz" -C "$actionlint_dir"
"$actionlint_dir/actionlint" .github/workflows/ci.yml .github/workflows/pages.yml
```

Expected: checksum corresponde ao release oficial e actionlint encerra sem
saída nem erro. O binário permanece apenas no diretório temporário, fora do
repositório.

- [ ] **Step 7: Revisar e commitar a separação de workflows**

Run:

```bash
git add .github/workflows/ci.yml .github/workflows/pages.yml .github/workflows/ci-pages.yml
git diff --cached --stat
git diff --cached --check
git diff --cached
git log -8 --pretty=format:'%h %s'
git commit -m "ci: separar validação e deploy do Pages" -m "Cria checks independentes de qualidade e E2E e restringe a publicação ao SHA atual de main aprovado pela CI, com permissões mínimas e Actions imutáveis."
```

Expected: commit cria dois workflows e remove somente o monolítico.

---

### Task 4: Agrupar atualizações futuras do Dependabot

**Files:**

- Modify: `.github/dependabot.yml`

**Interfaces:**

- Consumes: `main` como futura branch padrão, runtime Node 24 e Actions fixadas por SHA.
- Produces: grupos semanais de minor/patch npm, grupo de Actions, majors npm isoladas e ignore exclusivo do major de `@types/node`.

- [ ] **Step 1: Substituir a configuração do Dependabot**

Deixar `.github/dependabot.yml` exatamente assim:

```yaml
version: 2
updates:
  - package-ecosystem: npm
    directory: /
    schedule:
      interval: weekly
      day: monday
      time: '09:00'
      timezone: America/Bahia
    open-pull-requests-limit: 5
    groups:
      production-minor-patch:
        applies-to: version-updates
        dependency-type: production
        patterns:
          - '*'
        update-types:
          - minor
          - patch
      development-minor-patch:
        applies-to: version-updates
        dependency-type: development
        patterns:
          - '*'
        update-types:
          - minor
          - patch
    ignore:
      - dependency-name: '@types/node'
        update-types:
          - version-update:semver-major

  - package-ecosystem: github-actions
    directory: /
    schedule:
      interval: weekly
      day: monday
      time: '09:00'
      timezone: America/Bahia
    open-pull-requests-limit: 5
    groups:
      github-actions:
        applies-to: version-updates
        patterns:
          - '*'
```

Não adicionar `target-branch`: depois da correção remota, o destino implícito é
`main`. `applies-to: version-updates` mantém security updates fora dos grupos
periódicos.

- [ ] **Step 2: Validar YAML e decisões de agrupamento**

Run:

```bash
npx --no-install prettier --check .github/dependabot.yml
ruby -e 'require "yaml"; YAML.parse_file(ARGV.fetch(0))' .github/dependabot.yml
rg -n "applies-to: version-updates|version-update:semver-major|time: '09:00'" .github/dependabot.yml
if rg -n 'target-branch' .github/dependabot.yml; then exit 1; fi
git diff --check
```

Expected: parser e Prettier aprovam; dois `applies-to`, um ignore major de
`@types/node`, dois horários explícitos e nenhuma `target-branch`.

- [ ] **Step 3: Revisar e commitar a política do Dependabot**

Run:

```bash
git add .github/dependabot.yml
git diff --cached --check
git diff --cached
git log -8 --pretty=format:'%h %s'
git commit -m "ci(dependabot): agrupar atualizações compatíveis" -m "Agrupa versões minor e patch por responsabilidade, mantém majors isoladas e impede que os tipos Node avancem além do runtime LTS adotado."
```

Expected: commit contém somente `.github/dependabot.yml`.

---

### Task 5: Atualizar a documentação operacional

**Files:**

- Modify: `README.md`

**Interfaces:**

- Consumes: versões e nomes finais dos workflows das Tasks 1 a 4.
- Produces: requisitos locais e runbook curto coerentes com o comportamento real de CI e Pages.

- [ ] **Step 1: Substituir os requisitos do README**

Usar este conteúdo em `## Requisitos`:

```markdown
## Requisitos

- Node.js `>=24.15.0 <25`. O `.nvmrc` seleciona a versão disponível mais recente da linha LTS 24.
- npm, com o `package-lock.json` versionado como fonte das dependências.
- O binário `tsc` vem do TypeScript nativo 7.0.2. O pacote de compatibilidade `@typescript/typescript6@6.0.2` permanece instalado no nome `typescript` para fornecer a API da linha 6 exigida pelo `typescript-eslint@8.65.0`.
```

- [ ] **Step 2: Documentar a preparação local reproduzível**

Usar este bloco no início de `## Uso local`:

```bash
nvm install
nvm use
npm ci
npm run dev
```

Preservar a explicação de `npm run build` e `npm run preview`.

- [ ] **Step 3: Corrigir a instalação local de navegadores**

Depois da lista de comandos de qualidade, documentar:

```markdown
`npm run test` executa os testes unitários e de componentes com cobertura. `npm run test:e2e` gera o build e executa os 69 casos Playwright em Chromium móvel, WebKit móvel e Chromium desktop. Depois de `npm ci`, a primeira execução local pode exigir `npx --no-install playwright install chromium webkit`.
```

- [ ] **Step 4: Substituir a seção de CI e Pages**

Usar este conteúdo integral:

```markdown
## CI e GitHub Pages

O workflow `CI` valida Pull Requests para `main`, pushes em `main` e execuções manuais. O job `quality` executa instalação limpa, auditoria de produção, formatação, lint, tipos, cobertura e build; o job `e2e` repete a instalação e o build em runner limpo e executa Playwright. Um caso que só passe no retry é tratado como falha, com relatório e traces anexados ao job.

Pull Requests não criam job de deploy. Depois que `quality` e `e2e` aprovam um push no commit atual de `main`, o workflow `GitHub Pages` reconstrói esse mesmo SHA pelo lockfile e publica `dist` em [GitHub Pages](https://ygorsimoes.github.io/lista-casa-nova/). O workflow também permite republicar manualmente o commit atual de `main`; outras branches não são elegíveis.

No repositório, **Settings → Pages → Build and deployment → Source** permanece configurado como **GitHub Actions**. A publicação não usa secrets nem variáveis de backend.
```

Remover a afirmação antiga de que o Pages publica o mesmo diretório `dist`
executado pelo Playwright; o contrato novo é o mesmo SHA reconstruído em runner
limpo.

- [ ] **Step 5: Validar e commitar a documentação**

Run:

```bash
npx --no-install prettier --check README.md
rg -n 'Node.js `>=24.15.0 <25`|workflow `CI`|workflow `GitHub Pages`|Pull Requests não criam job de deploy' README.md
if rg -n 'CI e GitHub Pages` valida|mesmo diretório `dist`' README.md; then exit 1; fi
git diff --check
git add README.md
git diff --cached --check
git diff --cached
git log -8 --pretty=format:'%h %s'
git commit -m "docs: atualizar requisitos e fluxo de entrega" -m "Documenta a ponte TypeScript 7/6, o contrato da linha Node 24 e a separação entre checks de Pull Request e publicação do commit aprovado no Pages."
```

Expected: README formatado, sem descrição obsoleta, e commit contendo apenas documentação operacional.

---

### Task 6: Executar a barreira local de publicação

**Files:**

- Verify: todos os arquivos alterados desde `origin/main`
- Modify: nenhum arquivo, salvo formatação estritamente necessária revelada pelos checks; qualquer correção exige repetir a suíte afetada e commit próprio.

**Interfaces:**

- Consumes: todos os commits locais das Tasks 1 a 5.
- Produces: branch limpa, reproduzível e pronta para mutações remotas.

- [ ] **Step 1: Confirmar branch, runtime e instalação limpa**

Run:

```bash
test "$(git branch --show-current)" = "codex/modernizar-dependencias-ci"
nvm use 24
node -e "const [major, minor] = process.versions.node.split('.').map(Number); if (major !== 24 || minor < 15) process.exit(1); console.log(process.version)"
npm ci
```

Expected: branch correta, Node dentro do contrato e instalação limpa sem erro de engine ou peer dependency.

- [ ] **Step 2: Executar auditoria e qualidade completas**

Run:

```bash
npm audit --omit=dev --audit-level=high
npm audit --audit-level=high
npm run format:check
npm run lint
npm run typecheck
npm run test
npm run build
```

Expected: zero vulnerabilidades altas/críticas, formatação/lint/tipos aprovados,
107 testes com cobertura acima dos thresholds e build concluído.

- [ ] **Step 3: Executar a matriz E2E da definição de pronto**

Run:

```bash
npx --no-install playwright install chromium webkit
npm run test:e2e
```

Expected: build concluído e 69 testes aprovados sem flaky.

- [ ] **Step 4: Auditar o diff e os contratos estáticos**

Run:

```bash
git diff origin/main...HEAD --check
git diff origin/main...HEAD --stat
git diff origin/main...HEAD
test "$(rg -o 'uses: [^@[:space:]]+@[0-9a-f]{40}' .github/workflows | wc -l | tr -d ' ')" = 10
if rg -n "from ['\"]react-router-dom['\"]" src; then exit 1; fi
if rg -n 'actions/.+@(v[0-9]+|main|master)' .github/workflows; then exit 1; fi
if rg -n 'ci-pages.yml|CI e GitHub Pages` valida' .github README.md; then exit 1; fi
git status --short
```

Expected: diff sem whitespace inválido, exatamente dez Actions imutáveis,
nenhum import/padrão obsoleto e `git status --short` sem saída.

- [ ] **Step 5: Confirmar os commits que serão publicados**

Run:

```bash
git log --oneline --decorate origin/main..HEAD
```

Expected: especificação, correção factual e commits granulares de dependências,
E2E, workflows, Dependabot e README; nenhum commit ou arquivo alheio ao escopo.

---

### Task 7: Canonicalizar `main` e abrir o Pull Request consolidado

**Files:**

- Modify remote: branch padrão do repositório
- Publish remote: `codex/modernizar-dependencias-ci`
- Create remote: Pull Request para `main`

**Interfaces:**

- Consumes: branch local limpa e integralmente validada pela Task 6.
- Produces: repositório apontando para `main` e PR consolidado apto a executar `quality` e `e2e`.

- [ ] **Step 1: Validar autenticação, permissão e ausência de divergência**

Run:

```bash
repo_slug='ygorsimoes/lista-casa-nova'
gh auth status
gh repo view "$repo_slug" --json viewerPermission,defaultBranchRef,url
git fetch origin
git merge-base --is-ancestor origin/main HEAD
git status --short
```

Expected: autenticação válida, `viewerPermission` igual a `ADMIN`, `origin/main`
ancestral de `HEAD` e worktree limpa. Se a ancestralidade falhar, não fazer
mutação remota: atualizar a branch contra `origin/main` e repetir integralmente
a Task 6 antes de retornar.

- [ ] **Step 2: Alterar a branch padrão para `main`**

Run:

```bash
gh api --method PATCH -H 'Accept: application/vnd.github+json' -H 'X-GitHub-Api-Version: 2026-03-10' repos/ygorsimoes/lista-casa-nova -f default_branch=main
gh repo view ygorsimoes/lista-casa-nova --json defaultBranchRef --jq '.defaultBranchRef.name'
git remote set-head origin -a
```

Expected: API e `origin/HEAD` passam a apontar para `main`. Não excluir a branch padrão anterior.

- [ ] **Step 3: Publicar a branch validada**

Run:

```bash
git push -u origin codex/modernizar-dependencias-ci
git ls-remote --heads origin codex/modernizar-dependencias-ci
```

Expected: o SHA remoto é igual a `git rev-parse HEAD`.

- [ ] **Step 4: Revisar o diff final e abrir o PR**

Revalidar `git diff origin/main...HEAD` e os commits. Se corresponderem ao plano,
executar:

````bash
gh pr create -R ygorsimoes/lista-casa-nova --base main --head codex/modernizar-dependencias-ci --title 'ci: modernizar dependências e entrega do Pages' --body-file - <<'EOF'
## Contexto

A branch padrão e os PRs automatizados estavam desalinhados com `main`, enquanto a CI reunia validação e Pages no mesmo workflow. Isso deixava deploys deliberadamente ignorados visíveis em Pull Requests, Actions em tags móveis e uma vulnerabilidade de produção no React Router.

## O que mudou

- migra `react-router-dom` 7 para `react-router` 8 sem alterar o `HashRouter`;
- adota o compilador nativo TypeScript 7 com a API TypeScript 6 compatível com o linter;
- mantém Node e seus tipos na linha LTS 24;
- separa os checks `quality` e `e2e` da publicação no GitHub Pages;
- restringe o Pages ao SHA atual de `main` aprovado pela CI e fixa Actions por SHA;
- reprova testes flaky e sincroniza a corrida de foco observada no WebKit;
- agrupa atualizações compatíveis do Dependabot e atualiza o README.

## Como validar

Executados localmente com instalação limpa:

```bash
npm audit --omit=dev --audit-level=high
npm audit --audit-level=high
npm run format:check
npm run lint
npm run typecheck
npm run test
npm run build
npm run test:e2e
```

Também foram validados os YAMLs, os SHAs imutáveis das Actions e a ausência de imports de `react-router-dom`. Os checks remotos esperados são `quality` e `e2e`.

## Riscos e impactos

O TypeScript 7 ainda não oferece a API programática usada pelo `typescript-eslint`; por isso, a API da linha 6 permanece instalada por alias. O Pages reconstrói o commit aprovado em runner limpo e não consome artefatos de Pull Requests.

## Rollout e rollback

O merge só deve ocorrer com os dois checks verdes. Depois do push em `main`, o workflow de Pages deve publicar o mesmo SHA; em falha, a versão atualmente publicada permanece disponível e a mudança pode ser revertida por um novo PR.

## Orientação para revisão

Priorize `package.json`/`package-lock.json`, as condições e permissões de `.github/workflows/pages.yml` e os nomes estáveis dos jobs em `.github/workflows/ci.yml`.
EOF

````

Expected: PR aberto contra `main`, com head `codex/modernizar-dependencias-ci`.

- [ ] **Step 5: Capturar identidade imutável do PR**

Run:

```bash
pr_number="$(gh pr view codex/modernizar-dependencias-ci -R ygorsimoes/lista-casa-nova --json number --jq '.number')"
expected_head="$(gh pr view "$pr_number" -R ygorsimoes/lista-casa-nova --json headRefOid --jq '.headRefOid')"
test "$expected_head" = "$(git rev-parse HEAD)"
gh pr view "$pr_number" -R ygorsimoes/lista-casa-nova --json number,baseRefName,headRefName,headRefOid,state,url
```

Expected: base `main`, estado `OPEN` e SHA igual ao commit local. Não fechar os PRs antigos nesta tarefa.

---

### Task 8: Validar checks, integrar e confirmar o Pages

**Files:**

- Merge remote: Pull Request consolidado
- Observe remote: runs `CI` e `GitHub Pages`, artefato e deployment
- Verify external: site e asset JavaScript publicados

**Interfaces:**

- Consumes: PR e SHA capturados na Task 7.
- Produces: merge em `main`, CI do push verde e deployment de Pages associado ao mesmo SHA.

- [ ] **Step 1: Aguardar os checks sem bypass**

Run:

```bash
pr_number="$(gh pr view codex/modernizar-dependencias-ci -R ygorsimoes/lista-casa-nova --json number --jq '.number')"
expected_head="$(gh pr view "$pr_number" -R ygorsimoes/lista-casa-nova --json headRefOid --jq '.headRefOid')"
gh pr checks "$pr_number" -R ygorsimoes/lista-casa-nova --watch --fail-fast --interval 10
gh api repos/ygorsimoes/lista-casa-nova/commits/$expected_head/check-runs --jq '.check_runs[] | select(.name == "quality" or .name == "e2e") | [.name, .app.id, .status, .conclusion] | @tsv'
```

Expected: `quality` e `e2e`, ambos do app GitHub Actions ID `15368`, aparecem como `completed/success`. Qualquer falha volta à tarefa proprietária do arquivo; não fazer merge parcial ou bypass.

- [ ] **Step 2: Integrar preservando o SHA validado**

Run:

```bash
pr_number="$(gh pr view codex/modernizar-dependencias-ci -R ygorsimoes/lista-casa-nova --json number --jq '.number')"
expected_head="$(gh pr view "$pr_number" -R ygorsimoes/lista-casa-nova --json headRefOid --jq '.headRefOid')"
gh pr merge "$pr_number" -R ygorsimoes/lista-casa-nova --merge --match-head-commit "$expected_head"
merge_sha="$(gh pr view "$pr_number" -R ygorsimoes/lista-casa-nova --json mergeCommit --jq '.mergeCommit.oid')"
test -n "$merge_sha"
test "$merge_sha" = "$(gh api repos/ygorsimoes/lista-casa-nova/branches/main --jq '.commit.sha')"
```

Expected: PR `MERGED`, `main` no merge commit capturado e branch remota da feature preservada.

- [ ] **Step 3: Aguardar a CI do push em `main`**

Run a consulta abaixo até ela retornar um ID; não selecionar run de outro SHA:

```bash
pr_number="$(gh pr view codex/modernizar-dependencias-ci -R ygorsimoes/lista-casa-nova --json number --jq '.number')"
merge_sha="$(gh pr view "$pr_number" -R ygorsimoes/lista-casa-nova --json mergeCommit --jq '.mergeCommit.oid')"
ci_run_id="$(gh run list -R ygorsimoes/lista-casa-nova --workflow ci.yml --branch main --event push --commit "$merge_sha" --limit 1 --json databaseId --jq '.[0].databaseId')"
test -n "$ci_run_id"
gh run watch "$ci_run_id" -R ygorsimoes/lista-casa-nova --exit-status
gh run view "$ci_run_id" -R ygorsimoes/lista-casa-nova --json headSha,event,status,conclusion,jobs,url
```

Expected: `headSha` igual ao merge, evento `push`, conclusão `success` e jobs `quality`/`e2e` aprovados.

- [ ] **Step 4: Aguardar o workflow de Pages encadeado**

Run a consulta até ela retornar um ID para o mesmo SHA:

```bash
pr_number="$(gh pr view codex/modernizar-dependencias-ci -R ygorsimoes/lista-casa-nova --json number --jq '.number')"
merge_sha="$(gh pr view "$pr_number" -R ygorsimoes/lista-casa-nova --json mergeCommit --jq '.mergeCommit.oid')"
pages_run_id="$(gh run list -R ygorsimoes/lista-casa-nova --workflow pages.yml --branch main --event workflow_run --commit "$merge_sha" --limit 1 --json databaseId --jq '.[0].databaseId')"
test -n "$pages_run_id"
gh run watch "$pages_run_id" -R ygorsimoes/lista-casa-nova --exit-status
gh run view "$pages_run_id" -R ygorsimoes/lista-casa-nova --json headSha,event,status,conclusion,jobs,url
```

Expected: evento `workflow_run`, `headSha` igual ao merge, job `deploy` executado e conclusão `success`, sem job ignorado.

- [ ] **Step 5: Verificar artefato e deployment pelo SHA**

Run:

```bash
pr_number="$(gh pr view codex/modernizar-dependencias-ci -R ygorsimoes/lista-casa-nova --json number --jq '.number')"
merge_sha="$(gh pr view "$pr_number" -R ygorsimoes/lista-casa-nova --json mergeCommit --jq '.mergeCommit.oid')"
pages_run_id="$(gh run list -R ygorsimoes/lista-casa-nova --workflow pages.yml --branch main --event workflow_run --commit "$merge_sha" --limit 1 --json databaseId --jq '.[0].databaseId')"
gh api repos/ygorsimoes/lista-casa-nova/actions/runs/$pages_run_id/artifacts --jq '.artifacts[] | select(.name == "github-pages") | {id,name,digest,expired,workflow_run}'
gh api -H 'X-GitHub-Api-Version: 2026-03-10' repos/ygorsimoes/lista-casa-nova/pages/deployments/$merge_sha
```

Expected: artefato `github-pages` não expirado, associado ao run observado, e resposta do deployment com `status: succeed`.

- [ ] **Step 6: Fazer smoke test do HTML e do asset publicado**

Run:

```bash
site_url='https://ygorsimoes.github.io/lista-casa-nova/'
curl --fail --silent --show-error --location --retry 6 --retry-delay 5 --retry-all-errors --head "$site_url"
site_html="$(curl --fail --silent --show-error --location --retry 6 --retry-delay 5 --retry-all-errors "$site_url")"
asset_path="$(printf '%s\n' "$site_html" | sed -nE 's/.*src="([^"]+\.js)".*/\1/p' | head -n 1)"
test -n "$asset_path"
curl --fail --silent --show-error --location --retry 6 --retry-delay 5 --retry-all-errors --head "https://ygorsimoes.github.io$asset_path"
```

Expected: HTML e JavaScript respondem HTTP 200. Se CI ou Pages falhar, interromper a sequência, preservar a página anterior e investigar o run exato; não habilitar governança nem fechar PRs antigos até o deployment ser confirmado.

---

### Task 9: Habilitar segurança, proteger `main` e encerrar PRs substituídos

**Files:**

- Modify remote: vulnerability alerts e Dependabot security updates
- Create remote: ruleset `Proteção da main`
- Close remote: PRs 1, 2, 3, 5, 6, 7 e 8
- Verify remote: branches, checks, Pages e estado final

**Interfaces:**

- Consumes: merge e deployment confirmados na Task 8, checks `quality`/`e2e` do app ID `15368`.
- Produces: `main` protegida sem force push/deleção, atualizações de segurança habilitadas e fila antiga do Dependabot encerrada com trilha de auditoria.

- [ ] **Step 1: Revalidar que não existe ruleset conflitante**

Run:

```bash
gh api -H 'X-GitHub-Api-Version: 2026-03-10' repos/ygorsimoes/lista-casa-nova/rulesets
test "$(gh api -H 'X-GitHub-Api-Version: 2026-03-10' repos/ygorsimoes/lista-casa-nova/rulesets --jq 'map(select(.name == "Proteção da main")) | length')" = 0
```

Expected: nenhum ruleset com esse nome e nenhuma regra existente que exija checks incompatíveis.

- [ ] **Step 2: Habilitar alertas e atualizações de segurança**

Run:

```bash
gh api --method PUT -H 'Accept: application/vnd.github+json' -H 'X-GitHub-Api-Version: 2026-03-10' repos/ygorsimoes/lista-casa-nova/vulnerability-alerts
gh api --method PUT -H 'Accept: application/vnd.github+json' -H 'X-GitHub-Api-Version: 2026-03-10' repos/ygorsimoes/lista-casa-nova/automated-security-fixes
gh api --include -H 'X-GitHub-Api-Version: 2026-03-10' repos/ygorsimoes/lista-casa-nova/vulnerability-alerts
gh api -H 'X-GitHub-Api-Version: 2026-03-10' repos/ygorsimoes/lista-casa-nova/automated-security-fixes
gh api repos/ygorsimoes/lista-casa-nova --jq '.security_and_analysis'
```

Expected: alerts retorna HTTP 204, automated security fixes informa `enabled: true` e a análise do repositório aparece habilitada.

- [ ] **Step 3: Criar o ruleset ativo de `main`**

Run:

```bash
gh api --method POST -H 'Accept: application/vnd.github+json' -H 'X-GitHub-Api-Version: 2026-03-10' repos/ygorsimoes/lista-casa-nova/rulesets --input - <<'JSON'
{
  "name": "Proteção da main",
  "target": "branch",
  "enforcement": "active",
  "bypass_actors": [],
  "conditions": {
    "ref_name": {
      "include": ["refs/heads/main"],
      "exclude": []
    }
  },
  "rules": [
    {
      "type": "deletion"
    },
    {
      "type": "non_fast_forward"
    },
    {
      "type": "pull_request",
      "parameters": {
        "allowed_merge_methods": ["merge", "squash", "rebase"],
        "dismiss_stale_reviews_on_push": false,
        "require_code_owner_review": false,
        "require_last_push_approval": false,
        "required_approving_review_count": 0,
        "required_review_thread_resolution": false
      }
    },
    {
      "type": "required_status_checks",
      "parameters": {
        "do_not_enforce_on_create": true,
        "required_status_checks": [
          {
            "context": "quality",
            "integration_id": 15368
          },
          {
            "context": "e2e",
            "integration_id": 15368
          }
        ],
        "strict_required_status_checks_policy": true
      }
    }
  ]
}
JSON
```

Expected: ruleset criado com `enforcement: active`, sem bypass, sem revisão obrigatória e com checks `quality`/`e2e` estritos.

- [ ] **Step 4: Verificar a proteção efetiva**

Run:

```bash
ruleset_id="$(gh api -H 'X-GitHub-Api-Version: 2026-03-10' repos/ygorsimoes/lista-casa-nova/rulesets --jq '.[] | select(.name == "Proteção da main") | .id')"
test -n "$ruleset_id"
gh api -H 'X-GitHub-Api-Version: 2026-03-10' repos/ygorsimoes/lista-casa-nova/rulesets/$ruleset_id
gh api -H 'X-GitHub-Api-Version: 2026-03-10' repos/ygorsimoes/lista-casa-nova/rules/branches/main
```

Expected: bloqueios de deleção e non-fast-forward, exigência de PR e ambos os checks obrigatórios aparecem para `main`.

- [ ] **Step 5: Fechar somente os sete PRs substituídos**

Run:

```bash
replacement_pr_url="$(gh pr view codex/modernizar-dependencias-ci -R ygorsimoes/lista-casa-nova --json url --jq '.url')"
for dependabot_pr_number in 1 2 3 5 6 7 8; do
  dependabot_pr_state="$(gh pr view "$dependabot_pr_number" -R ygorsimoes/lista-casa-nova --json state --jq '.state')"
  if [[ "$dependabot_pr_state" == 'OPEN' ]]; then
    gh pr close "$dependabot_pr_number" -R ygorsimoes/lista-casa-nova --comment "Substituído por $replacement_pr_url, que consolida as atualizações compatíveis contra main e registra as decisões específicas para TypeScript e para manter @types/node na linha 24."
  fi
done
```

Expected: PRs 1, 2, 3, 5, 6, 7 e 8 fechados, sem `--delete-branch`, com comentário apontando para a migração consolidada.

- [ ] **Step 6: Executar a auditoria final local e remota**

Run:

```bash
gh repo view ygorsimoes/lista-casa-nova --json defaultBranchRef --jq '.defaultBranchRef.name'
gh pr list -R ygorsimoes/lista-casa-nova --state open --json number,baseRefName,headRefName,title
gh api repos/ygorsimoes/lista-casa-nova/branches/codex/prototipo-visual --jq '.name'
gh api repos/ygorsimoes/lista-casa-nova/branches/codex/modernizar-dependencias-ci --jq '.name'
gh api -H 'X-GitHub-Api-Version: 2026-03-10' repos/ygorsimoes/lista-casa-nova/pages --jq '{build_type,html_url,https_enforced,status}'
gh api repos/ygorsimoes/lista-casa-nova/environments/github-pages/deployment-branch-policies --jq '.branch_policies[] | {name,type}'
curl --fail --silent --show-error --location --head https://ygorsimoes.github.io/lista-casa-nova/
git status --short --branch
```

Expected: default `main`; nenhum dos sete PRs permanece aberto; as duas
branches preservadas existem; Pages usa workflow, HTTPS e status saudável; URL
responde HTTP 200; o ambiente `github-pages` aceita somente a branch `main`;
worktree local permanece limpa.

Se o ruleset for criado com configuração incorreta, consultar novamente seu ID
e removê-lo antes de tentar outra criação:

```bash
ruleset_id="$(gh api -H 'X-GitHub-Api-Version: 2026-03-10' repos/ygorsimoes/lista-casa-nova/rulesets --jq '.[] | select(.name == "Proteção da main") | .id')"
test -n "$ruleset_id"
gh api --method DELETE -H 'X-GitHub-Api-Version: 2026-03-10' repos/ygorsimoes/lista-casa-nova/rulesets/$ruleset_id
```

Não desabilitar vulnerability alerts como rollback rotineiro e não usar force
push ou reset de `main`.
