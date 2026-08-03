# Protótipo visual da Lista da Casa Nova Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Entregar um protótipo visual mobile-first, inteiramente estático e navegável da Lista da Casa Nova, com catálogo, reservas simuladas, coleções, Pix, prévia de PDF e painel administrativo demonstrativo.

**Architecture:** Uma SPA React com `HashRouter` lê fixtures TypeScript e mantém alterações somente em um `DemoStateProvider` baseado em `useReducer`. Disponibilidade, cartões e resumos administrativos são derivados das reservas, evitando um segundo status mutável nos itens; rotas de PDF e administração são carregadas sob demanda.

**Tech Stack:** Node.js 24, npm, React 19.2.8, TypeScript 6.0.3, Vite 8.2.0, Tailwind CSS 4.3.3, React Router 7.18.2, Lucide React, Vitest 4.1.10, Testing Library e Playwright 1.62.1.

O TypeScript permanece fixado em `6.0.3`, versão compatível com a faixa de peer
dependency `<6.1.0` declarada por `typescript-eslint@8.65.0`. O TypeScript
`7.0.2` não é executável com essa combinação de versões.

## Global Constraints

- Não criar backend, banco de dados, API, autenticação real ou chamadas de rede funcionais.
- Não usar `localStorage`, `sessionStorage`, IndexedDB, cookies ou service worker.
- Todos os dados pessoais, URLs e dados Pix devem ser fictícios e identificados como demonstração.
- Recarregar a aplicação deve recriar o estado inicial a partir das fixtures.
- QR, Pix, PDF, login e links externos devem ser somente representações visuais.
- A interface deve funcionar a partir de 360 px sem rolagem horizontal indevida.
- Controles principais devem ter pelo menos 44 px e campos devem usar fonte mínima de 16 px.
- Acessibilidade deve seguir WCAG 2.2 AA nos critérios aplicáveis ao protótipo.
- Status nunca deve depender apenas de cor; usar sempre rótulo textual e ícone decorativo oculto de tecnologia assistiva.
- Erros, conflitos e sucessos importantes devem permanecer no conteúdo; toast é apenas reforço.
- Categorias usam botões com `aria-pressed`, e não tabs, porque filtram o mesmo conteúdo.
- Sugestões externas são botões demonstrativos sem `href`; nenhuma ação pode abrir origem externa.
- npm é o único gerenciador e todas as versões ficam fixadas no `package-lock.json`.
- PDF e administração usam `React.lazy`; o restante permanece no bundle principal.
- Cada tarefa segue RED → verificação da falha → GREEN mínimo → suíte relevante → refatoração → commit.

---

## Contratos funcionais consolidados

### Disponibilidade e status

`GiftItem` não possui status mutável. Para um item, reservas com status
`reserved`, `purchased` ou `received` consomem quantidade; `cancelled` não
consome. A quantidade restante é:

```ts
remainingQuantity = Math.max(0, gift.desiredQuantity - activeReservationsQuantity)
```

O estado visual público é derivado assim:

| Condição                             | Estado visual        | Rótulo público     |
| ------------------------------------ | -------------------- | ------------------ |
| restante igual à quantidade desejada | `available`          | Disponível         |
| restante entre 1 e desejada - 1      | `partially-reserved` | N de M disponíveis |
| restante 0 e existe reserva recebida | `received`           | Presente recebido  |
| restante 0 nos demais casos          | `reserved`           | Indisponível       |

Transições permitidas:

| Origem      | Ação                              | Destino     |
| ----------- | --------------------------------- | ----------- |
| `reserved`  | convidado marca “Já comprei”      | `purchased` |
| `reserved`  | convidado cancela ou admin libera | `cancelled` |
| `reserved`  | admin marca como recebido         | `received`  |
| `purchased` | admin marca como recebido         | `received`  |
| `purchased` | admin libera                      | `cancelled` |
| `received`  | nenhuma                           | terminal    |
| `cancelled` | nenhuma                           | terminal    |

Reservas aceitam inteiros entre 1 e a quantidade restante. O item `CZ-004`
sempre devolve conflito demonstrativo, conserva o formulário preenchido e não
altera o estado.

### Cenários determinísticos

| Cenário                          | Identificador                 |
| -------------------------------- | ----------------------------- |
| item disponível                  | `CZ-001` — Chaleira           |
| item parcialmente reservado      | `CZ-003` — Potes herméticos   |
| item de conflito                 | `CZ-004` — Cafeteira elétrica |
| item indisponível reservado      | `LV-001` — Cesto de roupas    |
| item recebido                    | `BN-002` — Jogo de toalhas    |
| categoria sem disponíveis        | `decoracao`                   |
| token válido para gerenciamento  | `reserva-demo-valida`         |
| token inválido usado em testes   | `reserva-inexistente`         |
| coleção válida                   | `sugestoes-cozinha`           |
| coleção inválida usada em testes | `colecao-inexistente`         |

Uma nova reserva gera `reserva-<codigo-em-minusculas>-<sequencia>`. O resultado
de sucesso oferece um link para `#/minha-reserva/:token`.

### Navegação e feedback

- Abertura de item pelo catálogo usa `location.state.backgroundLocation` e
  mostra um diálogo/painel sobre o catálogo preservado.
- Acesso frio a `#/item/:code` mostra o mesmo conteúdo em uma página completa.
- Fechar o painel navega `-1`, restaura o foco ao cartão e preserva filtros e
  rolagem porque o catálogo continuou montado.
- Toda rota atualiza `document.title`, rola para o topo quando apropriado e
  move foco para o `h1` quando não estiver abrindo um diálogo.
- Toasts usam `role="status"`, duram cinco segundos e nunca são a única fonte
  de informação de sucesso, conflito ou erro.
- “Simular cópia”, “Simular download” e “Ver sugestão demonstrativa” descrevem
  honestamente que nenhuma operação real será executada.
- Configurações administrativas editáveis: título, mensagem de abertura e
  rodapé da lista. Dados Pix permanecem fictícios e somente leitura.
- Login administrativo permanece liberado enquanto o provider estiver montado,
  oferece “Sair da demonstração” e volta ao estado bloqueado após recarregar.

---

### Task 1: Fundação React, qualidade e primeiro teste

**Files:**

- Create: `.gitignore`
- Create: `.nvmrc`
- Create: `.prettierrc.json`
- Create: `eslint.config.js`
- Create: `index.html`
- Create: `package.json`
- Create: `package-lock.json`
- Create: `tsconfig.json`
- Create: `tsconfig.app.json`
- Create: `tsconfig.node.json`
- Create: `vite.config.ts`
- Create: `vitest.config.ts`
- Create: `src/vite-env.d.ts`
- Create: `src/test/setup.ts`
- Create: `src/app/App.test.tsx`
- Create: `src/app/App.tsx`
- Create: `src/main.tsx`
- Create: `src/styles/index.css`

**Interfaces:**

- Consumes: apenas a especificação aprovada.
- Produces: `App(): JSX.Element`, scripts npm, alias `@/*` e ambiente Vitest/jsdom.

- [ ] **Step 1: Criar o manifesto e as configurações sem criar a aplicação**

Use este manifesto com versões fixas verificadas em 2026-08-02:

```json
{
  "name": "lista-casa-nova",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "engines": { "node": ">=24" },
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "lint": "eslint . --max-warnings=0",
    "typecheck": "tsc -b --pretty false",
    "test": "vitest run --coverage",
    "test:unit": "vitest run",
    "test:watch": "vitest",
    "test:e2e": "npm run build && playwright test",
    "test:e2e:headed": "npm run build && playwright test --headed"
  },
  "dependencies": {
    "lucide-react": "1.28.0",
    "react": "19.2.8",
    "react-dom": "19.2.8",
    "react-router-dom": "7.18.2"
  },
  "devDependencies": {
    "@axe-core/playwright": "4.12.1",
    "@eslint/js": "10.0.1",
    "@playwright/test": "1.62.1",
    "@tailwindcss/vite": "4.3.3",
    "@testing-library/dom": "10.4.1",
    "@testing-library/jest-dom": "7.0.0",
    "@testing-library/react": "16.3.2",
    "@testing-library/user-event": "14.6.1",
    "@types/node": "24.13.3",
    "@types/react": "19.2.18",
    "@types/react-dom": "19.2.4",
    "@vitejs/plugin-react": "6.0.5",
    "@vitest/coverage-v8": "4.1.10",
    "eslint": "10.8.0",
    "eslint-config-prettier": "10.1.8",
    "eslint-plugin-react-hooks": "7.1.1",
    "eslint-plugin-react-refresh": "0.5.3",
    "globals": "17.9.0",
    "jsdom": "30.0.1",
    "prettier": "3.9.6",
    "tailwindcss": "4.3.3",
    "typescript": "6.0.3",
    "typescript-eslint": "8.65.0",
    "vite": "8.2.0",
    "vitest": "4.1.10"
  }
}
```

Use `24` em `.nvmrc` e esta configuração de formatação:

```json
{
  "semi": false,
  "singleQuote": true,
  "trailingComma": "all",
  "printWidth": 100
}
```

Use os tsconfigs atuais do template Vite, acrescentando o alias:

```json
// tsconfig.json
{
  "files": [],
  "references": [{ "path": "./tsconfig.app.json" }, { "path": "./tsconfig.node.json" }]
}
```

```json
// tsconfig.app.json
{
  "compilerOptions": {
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.app.tsbuildinfo",
    "target": "ES2023",
    "lib": ["ES2023", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "types": ["vite/client"],
    "allowArbitraryExtensions": true,
    "skipLibCheck": true,
    "moduleResolution": "Bundler",
    "allowImportingTsExtensions": true,
    "verbatimModuleSyntax": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "erasableSyntaxOnly": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": { "@/*": ["src/*"] }
  },
  "include": ["src"]
}
```

```json
// tsconfig.node.json
{
  "compilerOptions": {
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.node.tsbuildinfo",
    "target": "ES2023",
    "lib": ["ES2023"],
    "types": ["node"],
    "skipLibCheck": true,
    "module": "NodeNext",
    "allowImportingTsExtensions": true,
    "verbatimModuleSyntax": true,
    "moduleDetection": "force",
    "noEmit": true,
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "erasableSyntaxOnly": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["vite.config.ts", "vitest.config.ts", "playwright.config.ts", "e2e/**/*.ts"]
}
```

Configure build e testes assim:

```ts
// vite.config.ts
import { fileURLToPath, URL } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  base: '/lista-casa-nova/',
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
})
```

```ts
// vitest.config.ts
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    clearMocks: true,
    restoreMocks: true,
    include: ['src/**/*.test.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      thresholds: { lines: 80, functions: 80, statements: 80, branches: 75 },
      exclude: ['src/main.tsx', 'src/**/*.d.ts', 'src/domain/types.ts', 'src/test/**'],
    },
  },
})
```

Use ESLint flat config e ignore artefatos:

```js
// eslint.config.js
import js from '@eslint/js'
import prettier from 'eslint-config-prettier'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import globals from 'globals'
import { defineConfig, globalIgnores } from 'eslint/config'
import tseslint from 'typescript-eslint'

export default defineConfig([
  globalIgnores(['dist', 'coverage', 'playwright-report', 'test-results']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
      prettier,
    ],
    languageOptions: {
      ecmaVersion: 2023,
      globals: { ...globals.browser, ...globals.node },
    },
  },
])
```

`.gitignore` deve conter `node_modules/`, `dist/`, `coverage/`,
`playwright-report/`, `test-results/`, `*.local`, `.DS_Store` e
`node_modules/.tmp/`.

Prepare o jsdom sem mocks de rede ou armazenamento:

```ts
// src/test/setup.ts
import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach, vi } from 'vitest'

afterEach(() => {
  cleanup()
  vi.useRealTimers()
  vi.unstubAllGlobals()
})

Object.defineProperty(window, 'matchMedia', {
  configurable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: query.includes('prefers-reduced-motion'),
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})
```

`src/vite-env.d.ts` contém somente `/// <reference types="vite/client" />`.

- [ ] **Step 2: Instalar as dependências e produzir o lockfile**

Run: `npm install`

Expected: `package-lock.json` criado sem dependências não declaradas.

- [ ] **Step 3: Escrever o teste de fumaça antes de criar `App.tsx`**

```tsx
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { App } from './App'

describe('App', () => {
  it('apresenta o propósito da lista', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: /lista da nossa casa nova/i })).toBeInTheDocument()
  })
})
```

- [ ] **Step 4: Executar o teste e confirmar a falha correta**

Run: `npx vitest run src/app/App.test.tsx`

Expected: FAIL porque `src/app/App.tsx` ainda não existe.

- [ ] **Step 5: Implementar a menor aplicação que passa**

```tsx
// src/app/App.tsx
export function App() {
  return (
    <main>
      <h1>Lista da nossa casa nova</h1>
    </main>
  )
}
```

```tsx
// src/main.tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from '@/app/App'
import '@/styles/index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

O CSS começa com `@import "tailwindcss";`, tokens marfim/grafite/terracota/
oliva em `@theme`, `color-scheme: light`, foco visível global e regra para
`prefers-reduced-motion`. O `index.html` define `lang="pt-BR"`, viewport, título
e descrição do protótipo.

```html
<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="Protótipo visual da lista de presentes da nossa casa nova." />
    <title>Lista da nossa casa nova</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 6: Verificar a fundação**

Run: `npm run format && npm run lint && npm run typecheck && npm run test:unit && npm run build`

Expected: todos os comandos encerram com código 0 e `dist/index.html` existe.

- [ ] **Step 7: Commit**

```bash
git add .gitignore .nvmrc .prettierrc.json eslint.config.js index.html package.json package-lock.json tsconfig.json tsconfig.app.json tsconfig.node.json vite.config.ts vitest.config.ts src
git commit -m "build: preparar fundação React do protótipo"
```

---

### Task 2: Domínio, fixtures e seletores do catálogo

**Files:**

- Create: `src/domain/types.ts`
- Create: `src/domain/selectors.ts`
- Create: `src/domain/selectors.test.ts`
- Create: `src/data/catalog.ts`
- Create: `src/data/collections.ts`
- Create: `src/data/reservations.ts`
- Create: `src/data/settings.ts`
- Create: `src/data/initial-state.ts`
- Create: `src/data/fixtures.test.ts`

**Interfaces:**

- Consumes: alias e ambiente de testes da Task 1.
- Produces: `DemoState`, fixtures determinísticas e seletores públicos abaixo.

```ts
export type ReservationStatus = 'reserved' | 'purchased' | 'received' | 'cancelled'

export interface Category {
  id: string
  name: string
  slug: string
  icon: 'cooking-pot' | 'bed-double' | 'bath' | 'washing-machine' | 'lamp'
  sortOrder: number
}

export interface Suggestion {
  id: string
  label: string
  retailer: 'Shopee'
  url: string
  featured: boolean
}

export interface GiftItem {
  code: string
  categoryId: string
  name: string
  description: string
  preferences: readonly string[]
  desiredQuantity: number
  acceptsEquivalent: boolean
  demoScenario?: 'conflict'
  suggestions: readonly Suggestion[]
  sortOrder: number
}

export interface DemoReservation {
  token: string
  itemCode: string
  firstName: string
  contact?: string
  quantity: number
  status: ReservationStatus
  source: 'web' | 'paper' | 'admin'
  createdAt: string
}

export interface ShoppingCollection {
  title: string
  slug: string
  categoryId: string
  description: string
  url: string
}

export interface SiteSettings {
  title: string
  message: string
  howItWorks: string
  footer: string
  pix: {
    recipient: string
    institution: string
    copyAndPaste: string
  }
}

export type EditableSiteSettings = Pick<SiteSettings, 'title' | 'message' | 'footer'>

export interface ReserveGiftInput {
  itemCode: string
  firstName: string
  contact?: string
  quantity: number
}

export type ReservationOutcome =
  | { kind: 'success'; itemCode: string; token: string }
  | { kind: 'conflict'; itemCode: string }
  | { kind: 'unavailable'; itemCode: string }

export interface DemoState {
  categories: readonly Category[]
  gifts: readonly GiftItem[]
  collections: readonly ShoppingCollection[]
  reservations: readonly DemoReservation[]
  settings: SiteSettings
  nextReservationNumber: number
  reservationOutcome: ReservationOutcome | null
  adminUnlocked: boolean
}

export type GiftVisualState = 'available' | 'partially-reserved' | 'reserved' | 'received'

export interface GiftAvailability {
  desiredQuantity: number
  reservedQuantity: number
  purchasedQuantity: number
  receivedQuantity: number
  remainingQuantity: number
  canReserve: boolean
  visualState: GiftVisualState
}

export interface CatalogFilters {
  query: string
  categorySlug: string | null
  availableOnly: boolean
}

export interface CatalogEntry {
  gift: GiftItem
  category: Category
  availability: GiftAvailability
}

export function selectAvailability(state: DemoState, itemCode: string): GiftAvailability | undefined

export function selectCatalogEntries(
  state: DemoState,
  filters: CatalogFilters,
): readonly CatalogEntry[]

export function selectGiftByCode(state: DemoState, code: string): CatalogEntry | undefined

export function selectReservationByToken(
  state: DemoState,
  token: string,
): DemoReservation | undefined

export function selectCollectionBySlug(
  state: DemoState,
  slug: string,
): ShoppingCollection | undefined
```

- [ ] **Step 1: Escrever testes de disponibilidade, busca e integridade das fixtures**

```ts
it('ignora acentos e caixa ao buscar preferências', () => {
  const result = selectCatalogEntries(createInitialDemoState(), {
    query: 'neutros',
    categorySlug: null,
    availableOnly: false,
  })
  expect(result.map(({ gift }) => gift.code)).toContain('CZ-001')
})

it('libera quantidade de reservas canceladas', () => {
  const state = createInitialDemoState()
  const availability = selectAvailability(state, 'CZ-003')
  expect(availability).toMatchObject({
    desiredQuantity: 2,
    remainingQuantity: 1,
    visualState: 'partially-reserved',
  })
})

it('mantém identificadores e URLs demonstrativos seguros', () => {
  const state = createInitialDemoState()
  expect(new Set(state.gifts.map(({ code }) => code)).size).toBe(state.gifts.length)
  expect(
    state.gifts
      .flatMap(({ suggestions }) => suggestions)
      .every(({ url }) => new URL(url).hostname.endsWith('.invalid')),
  ).toBe(true)
})
```

Também cubra filtros combinados, consulta vazia, ordenação, categoria sem
disponíveis, item inexistente e garantia de que seletores não mutam entradas.

- [ ] **Step 2: Executar os testes e confirmar a falha correta**

Run: `npx vitest run src/domain/selectors.test.ts src/data/fixtures.test.ts`

Expected: FAIL porque tipos, fixtures e seletores ainda não existem.

- [ ] **Step 3: Criar os tipos e fixtures exatos**

As categorias são `cozinha`, `quarto`, `banheiro`, `lavanderia` e `decoracao`.
Codifique estes itens, nesta ordem:

| Código   | Categoria  | Nome               | Quantidade | Cenário                |
| -------- | ---------- | ------------------ | ---------- | ---------------------- |
| `CZ-001` | cozinha    | Chaleira           | 1          | normal                 |
| `CZ-002` | cozinha    | Jogo de panelas    | 1          | normal                 |
| `CZ-003` | cozinha    | Potes herméticos   | 2          | normal                 |
| `CZ-004` | cozinha    | Cafeteira elétrica | 1          | `conflict`             |
| `QT-001` | quarto     | Jogo de cama queen | 2          | normal                 |
| `QT-002` | quarto     | Travesseiros       | 4          | normal                 |
| `BN-001` | banheiro   | Kit lavabo         | 2          | normal, duas sugestões |
| `BN-002` | banheiro   | Jogo de toalhas    | 2          | recebido               |
| `LV-001` | lavanderia | Cesto de roupas    | 1          | reservado              |
| `LV-002` | lavanderia | Varal de chão      | 1          | normal                 |
| `DC-001` | decoracao  | Luminária de mesa  | 1          | recebido               |

Use preferências realistas e neutras. Todas as sugestões usam
`https://produto.example.invalid/...`. Crie as coleções `sugestoes-cozinha` e
`sugestoes-banheiro` com `https://colecao.example.invalid/...`.

As configurações iniciais são:

```ts
{
  title: 'Lista da nossa casa nova',
  message: 'Escolha um presente para fazer parte deste novo começo.',
  howItWorks: 'Escolha um item, faça uma reserva demonstrativa ou veja a opção de contribuição.',
  footer: 'Obrigado por celebrar este momento com a gente.',
  pix: {
    recipient: 'Marina e Rafael — demonstração',
    institution: 'Banco Fictício',
    copyAndPaste: 'DEMO-PIX-NAO-UTILIZAR-0002016304ABCD',
  },
}
```

As reservas iniciais são:

```ts
;[
  {
    token: 'reserva-demo-ana',
    itemCode: 'CZ-003',
    quantity: 1,
    status: 'reserved',
  },
  {
    token: 'reserva-demo-paulo',
    itemCode: 'QT-001',
    quantity: 1,
    status: 'purchased',
  },
  {
    token: 'reserva-demo-lia',
    itemCode: 'BN-002',
    quantity: 2,
    status: 'received',
  },
  {
    token: 'reserva-demo-valida',
    itemCode: 'LV-001',
    quantity: 1,
    status: 'reserved',
  },
  {
    token: 'reserva-demo-bia',
    itemCode: 'DC-001',
    quantity: 1,
    status: 'received',
  },
]
```

Acrescente nomes fictícios, contatos `@example.invalid`, origem e datas ISO
fixas. `createInitialDemoState()` deve criar novos arrays/objetos a cada chamada
e iniciar `nextReservationNumber` em 1, `reservationOutcome` em `null` e
`adminUnlocked` em `false`.

- [ ] **Step 4: Implementar os seletores mínimos**

```ts
const consumingStatuses = new Set<ReservationStatus>(['reserved', 'purchased', 'received'])

export function normalizeSearch(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLocaleLowerCase('pt-BR')
}
```

Some quantidades por status, derive `visualState` pela tabela global, associe a
categoria e aplique busca → categoria → disponibilidade sem reordenar fixtures.

- [ ] **Step 5: Executar os testes e a suíte da fundação**

Run: `npx vitest run src/domain/selectors.test.ts src/data/fixtures.test.ts && npm run typecheck && npm run lint`

Expected: PASS em todos os casos.

- [ ] **Step 6: Commit**

```bash
git add src/domain src/data
git commit -m "feat(catalogo): modelar fixtures e disponibilidade"
```

---

### Task 3: Reducer e provider de estado efêmero

**Files:**

- Create: `src/domain/demo-reducer.ts`
- Create: `src/domain/demo-reducer.test.ts`
- Create: `src/app/DemoStateProvider.tsx`
- Create: `src/app/DemoStateProvider.test.tsx`
- Create: `src/test/renderApp.tsx`

**Interfaces:**

- Consumes: `DemoState`, `ReserveGiftInput`, fixtures e seletores da Task 2.
- Produces: `demoReducer`, `useDemoSelector()` e `useDemoActions()`.

```ts
export interface DemoActions {
  reserveGift(input: ReserveGiftInput): void
  markReservationPurchased(token: string): void
  cancelReservation(token: string): void
  markReservationReceived(token: string): void
  dismissReservationOutcome(): void
  unlockAdmin(): void
  lockAdmin(): void
  updateSiteSettings(settings: EditableSiteSettings): void
}
```

- [ ] **Step 1: Escrever testes das transições antes do reducer**

```ts
it('cria uma reserva e reduz a disponibilidade', () => {
  const before = createInitialDemoState()
  const after = demoReducer(before, {
    type: 'reservation/submitted',
    input: { itemCode: 'CZ-001', firstName: 'Nina', quantity: 1 },
  })

  expect(after.reservationOutcome).toEqual({
    kind: 'success',
    itemCode: 'CZ-001',
    token: 'reserva-cz-001-1',
  })
  expect(selectAvailability(after, 'CZ-001')?.remainingQuantity).toBe(0)
  expect(before.reservations).toHaveLength(5)
})

it('preserva o estado ao simular conflito', () => {
  const before = createInitialDemoState()
  const after = demoReducer(before, {
    type: 'reservation/submitted',
    input: { itemCode: 'CZ-004', firstName: 'Nina', quantity: 1 },
  })
  expect(after.reservations).toBe(before.reservations)
  expect(after.reservationOutcome).toEqual({
    kind: 'conflict',
    itemCode: 'CZ-004',
  })
})
```

Cubra quantidade inválida, indisponibilidade, compra, cancelamento/liberação,
recebimento, transições terminais idempotentes, configurações e imutabilidade.

- [ ] **Step 2: Executar e confirmar a falha correta**

Run: `npx vitest run src/domain/demo-reducer.test.ts`

Expected: FAIL porque `demoReducer` ainda não existe.

- [ ] **Step 3: Implementar o reducer sem efeitos colaterais**

```ts
export type DemoAction =
  | { type: 'reservation/submitted'; input: ReserveGiftInput }
  | { type: 'reservation/purchased'; token: string }
  | { type: 'reservation/cancelled'; token: string }
  | { type: 'reservation/received'; token: string }
  | { type: 'reservation/outcomeDismissed' }
  | { type: 'admin/unlocked' }
  | { type: 'admin/locked' }
  | { type: 'settings/updated'; settings: EditableSiteSettings }
```

Valide disponibilidade dentro do reducer, gere tokens determinísticos, mude
somente a reserva-alvo e ignore transições não permitidas. Não leia nem escreva
qualquer API de armazenamento do navegador.

- [ ] **Step 4: Escrever o teste do provider antes da implementação**

Crie um consumidor de teste que reserva `CZ-001`. Verifique que o item fica
indisponível durante a montagem, que um novo mount restaura disponibilidade e
que spies sobre `localStorage.setItem` e `sessionStorage.setItem` não recebem
chamadas.

- [ ] **Step 5: Executar e confirmar a falha do provider**

Run: `npx vitest run src/app/DemoStateProvider.test.tsx`

Expected: FAIL porque o provider e hooks ainda não existem.

- [ ] **Step 6: Implementar contexts separados para estado e ações**

```tsx
export function useDemoSelector<T>(selector: (state: DemoState) => T): T
export function useDemoActions(): DemoActions

export function DemoStateProvider({ children }: PropsWithChildren) {
  const [state, dispatch] = useReducer(demoReducer, undefined, createInitialDemoState)
  // Memoize ações que apenas encapsulam dispatch e forneça contexts separados.
}
```

`src/test/renderApp.tsx` deve envolver `MemoryRouter`, `Routes`,
`DemoStateProvider` e, depois da Task 4, `ToastProvider`:

```tsx
export interface RenderWithAppOptions {
  route?: string
  routePath?: string
}

export function renderWithApp(
  ui: ReactElement,
  { route = '/', routePath = '*' }: RenderWithAppOptions = {},
) {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <DemoStateProvider>
        <Routes>
          <Route path={routePath} element={ui} />
        </Routes>
      </DemoStateProvider>
    </MemoryRouter>,
  )
}
```

- [ ] **Step 7: Verificar reducer, provider e cobertura**

Run: `npx vitest run src/domain/demo-reducer.test.ts src/app/DemoStateProvider.test.tsx && npm run typecheck && npm run lint`

Expected: PASS, sem mutações ou acesso a armazenamento.

- [ ] **Step 8: Commit**

```bash
git add src/domain/demo-reducer.ts src/domain/demo-reducer.test.ts src/app/DemoStateProvider.tsx src/app/DemoStateProvider.test.tsx src/test/renderApp.tsx
git commit -m "feat: criar estado demonstrativo em memória"
```

---

### Task 4: Sistema visual, componentes acessíveis e shell

**Files:**

- Modify: `src/styles/index.css`
- Modify: `src/test/setup.ts`
- Modify: `src/test/renderApp.tsx`
- Create: `src/lib/cn.ts`
- Create: `src/components/ui/Button.tsx`
- Create: `src/components/ui/Input.tsx`
- Create: `src/components/ui/Textarea.tsx`
- Create: `src/components/ui/Checkbox.tsx`
- Create: `src/components/ui/Badge.tsx`
- Create: `src/components/ui/Card.tsx`
- Create: `src/components/ui/Dialog.tsx`
- Create: `src/components/ui/Dialog.test.tsx`
- Create: `src/components/ui/Toast.tsx`
- Create: `src/components/ui/Toast.test.tsx`
- Create: `src/components/ui/Skeleton.tsx`
- Create: `src/components/ui/EmptyState.tsx`
- Create: `src/components/ui/ErrorState.tsx`
- Create: `src/components/layout/AppShell.tsx`
- Create: `src/components/layout/SiteHeader.tsx`
- Create: `src/components/layout/SiteFooter.tsx`
- Create: `src/components/layout/RouteEffects.tsx`

**Interfaces:**

- Consumes: React e ambiente de teste da Task 1; provider da Task 3.
- Produces: primitives visuais, `ToastProvider`, `useToast()` e `AppShell`.

```ts
export interface ToastMessage {
  id: string
  title: string
  description?: string
}

export interface DialogProps {
  open: boolean
  title: string
  description?: string
  onClose(): void
  initialFocusRef?: RefObject<HTMLElement | null>
  children: ReactNode
}
```

- [ ] **Step 1: Escrever testes do diálogo e do toast**

```tsx
it('fecha com Escape e devolve o foco ao acionador', async () => {
  const user = userEvent.setup()
  render(<DialogHarness />)
  const trigger = screen.getByRole('button', { name: /abrir/i })
  await user.click(trigger)
  expect(screen.getByRole('dialog', { name: /detalhes/i })).toHaveFocus()
  await user.keyboard('{Escape}')
  expect(trigger).toHaveFocus()
})

it('anuncia uma confirmação sem substituir o conteúdo persistente', async () => {
  render(<ToastHarness />)
  await userEvent.click(screen.getByRole('button', { name: /confirmar/i }))
  expect(screen.getByRole('status')).toHaveTextContent(/ação demonstrada/i)
})
```

O teste do diálogo cobre nome acessível, clique no fechamento e foco. Teste o
toast com relógio falso para remoção após cinco segundos, sem depender disso em
testes de feature.

- [ ] **Step 2: Executar e confirmar as falhas corretas**

Run: `npx vitest run src/components/ui/Dialog.test.tsx src/components/ui/Toast.test.tsx`

Expected: FAIL porque os componentes ainda não existem.

- [ ] **Step 3: Implementar primitives nativas e acessíveis**

`Button` expõe variantes `primary`, `secondary`, `ghost` e `danger`, sempre com
`min-h-11`. `Input`, `Textarea` e `Checkbox` recebem rótulo, ajuda, erro e IDs
associados por `aria-describedby`.

Implemente `Dialog` sobre `<dialog>`:

```tsx
useEffect(() => {
  const dialog = dialogRef.current
  if (!dialog) return
  const previousFocus = document.activeElement as HTMLElement | null

  if (open && !dialog.open) {
    dialog.showModal()
    const target = initialFocusRef?.current ?? dialog
    target.focus()
  }
  if (!open && dialog.open) dialog.close()

  return () => previousFocus?.focus()
}, [open])
```

Trate `cancel` para Escape, feche ao clicar no backdrop e mantenha um botão de
fechar com texto acessível. Adicione em `src/test/setup.ts` polyfills mínimos de
`showModal()` e `close()` apenas se jsdom não os fornecer.

- [ ] **Step 4: Consolidar tokens e estados globais**

Em `src/styles/index.css`, defina:

```css
@import 'tailwindcss';

@theme {
  --color-sand-50: #fbf8f1;
  --color-sand-100: #f3ecdf;
  --color-graphite-700: #3f3b37;
  --color-graphite-900: #211f1d;
  --color-terracotta-500: #b76549;
  --color-terracotta-600: #995039;
  --color-olive-500: #6f7b52;
  --color-olive-700: #4d5838;
  --shadow-card: 0 12px 35px rgb(63 59 55 / 0.08);
}
```

Inclua `body` sem margem, fundo areia, fonte de sistema, `overflow-wrap`, foco de
3 px e redução global de animação/transição sob `prefers-reduced-motion`.

- [ ] **Step 5: Implementar shell e efeitos de rota**

`SiteHeader` liga a marca ao catálogo e oferece Pix como ação curta. O rodapé
contém links para catálogo, prévia, painel demonstrativo e aviso de protótipo.
`RouteEffects` observa `useLocation()`, atualiza título, rola ao topo e foca o
primeiro `h1[tabindex="-1"]`, exceto quando `backgroundLocation` indicar painel.

- [ ] **Step 6: Verificar componentes e integração do provider**

Run: `npm run format && npx vitest run src/components/ui && npm run typecheck && npm run lint`

Expected: PASS; diálogo e toast são navegáveis por teclado.

- [ ] **Step 7: Commit**

```bash
git add src/styles src/lib src/components src/test/setup.ts src/test/renderApp.tsx
git commit -m "feat(ui): criar sistema visual acessível"
```

---

### Task 5: Roteamento, catálogo, busca e filtros

**Files:**

- Modify: `src/app/App.tsx`
- Create: `src/app/routes.tsx`
- Create: `src/app/InitialLoadingGate.tsx`
- Create: `src/app/InitialLoadingGate.test.tsx`
- Create: `src/features/catalog/CatalogPage.tsx`
- Create: `src/features/catalog/CatalogPage.test.tsx`
- Create: `src/features/catalog/HeroSection.tsx`
- Create: `src/features/catalog/CatalogFilters.tsx`
- Create: `src/features/catalog/CategoryList.tsx`
- Create: `src/features/catalog/GiftCard.tsx`
- Create: `src/features/catalog/GiftCard.test.tsx`
- Create: `src/features/catalog/GiftGrid.tsx`
- Create: `src/features/catalog/GiftDetailsPage.tsx`
- Create: `src/features/not-found/NotFoundPage.tsx`

**Interfaces:**

- Consumes: `selectCatalogEntries`, `AppShell`, primitives e provider.
- Produces: rota `#/`, navegação preservável para itens e rota `*`.

```ts
export interface AppLocationState {
  backgroundLocation?: Location
}

export interface CatalogViewState {
  query: string
  categorySlug: string | null
  availableOnly: boolean
}
```

- [ ] **Step 1: Escrever testes do carregamento e catálogo antes da página**

```tsx
it('combina busca, categoria e disponibilidade', async () => {
  renderWithApp(<CatalogPage />)
  await userEvent.type(screen.getByRole('searchbox', { name: /buscar um presente/i }), 'toalhas')
  await userEvent.click(screen.getByRole('button', { name: 'Banheiro' }))
  await userEvent.click(screen.getByRole('checkbox', { name: /somente disponíveis/i }))
  expect(screen.getByRole('status')).toHaveTextContent(/nenhum presente/i)
})

it('expõe o estado selecionado da categoria', async () => {
  renderWithApp(<CatalogPage />)
  const cozinha = screen.getByRole('button', { name: 'Cozinha' })
  await userEvent.click(cozinha)
  expect(cozinha).toHaveAttribute('aria-pressed', 'true')
})
```

Teste também limpar busca, “Todas”, categoria `decoracao` sem disponíveis,
ordem dos cartões, rótulos de disponibilidade e estado não encontrado.

- [ ] **Step 2: Executar e confirmar as falhas corretas**

Run: `npx vitest run src/app/InitialLoadingGate.test.tsx src/features/catalog`

Expected: FAIL porque gate, página e cartões ainda não existem.

- [ ] **Step 3: Implementar o gate determinístico**

`InitialLoadingGate` mostra skeletons com `role="status"` e texto “Carregando a
lista” durante 250 ms uma única vez por montagem do app. Use timer cancelável;
o teste controla o relógio com `vi.useFakeTimers()`.

- [ ] **Step 4: Implementar a página do catálogo**

Mantenha os filtros em `useState` dentro de `CatalogPage`. Use um `<search>` com
campo rotulado, grupo horizontal de botões `aria-pressed`, checkbox e resultado
textual `aria-live="polite"`.

Cada `GiftCard` deve:

- exibir categoria, nome, primeira preferência e rótulo textual de status;
- usar “Quero dar este presente” quando reservável;
- usar “Ver detalhes” quando indisponível;
- navegar para `/item/:code` com `{ backgroundLocation: location }`;
- ter ação com nome acessível que inclua o presente.

O hero apresenta “Como funciona”, CTAs secundários para `/pix` e `/pdf` e não
usa carrossel ou imagens remotas.

- [ ] **Step 5: Integrar `HashRouter` e a rota não encontrada**

```tsx
export function App() {
  return (
    <HashRouter>
      <DemoStateProvider>
        <ToastProvider>
          <InitialLoadingGate>
            <AppRoutes />
          </InitialLoadingGate>
        </ToastProvider>
      </DemoStateProvider>
    </HashRouter>
  )
}
```

Neste ponto `AppRoutes` declara `/`, `/item/:code` e `*`. A primeira versão de
`GiftDetailsPage` mostra nome, disponibilidade e retorno ao catálogo, tornando
o link dos cartões funcional; a Task 6 expande essa página e adiciona o painel.
A rota desconhecida mostra título “Página não encontrada”, texto não técnico e
link para o catálogo.

- [ ] **Step 6: Verificar catálogo e build**

Run: `npm run format && npx vitest run src/app src/features/catalog && npm run typecheck && npm run lint && npm run build`

Expected: PASS, sem chamadas de rede nem overflow criado pelo CSS do catálogo.

- [ ] **Step 7: Commit**

```bash
git add src/app src/features/catalog src/features/not-found
git commit -m "feat(catalogo): implementar catálogo interativo"
```

---

### Task 6: Detalhes e reserva demonstrativa

**Files:**

- Modify: `src/app/routes.tsx`
- Create: `src/features/catalog/GiftDetailsContent.tsx`
- Modify: `src/features/catalog/GiftDetailsPage.tsx`
- Create: `src/features/catalog/GiftDetailsDialog.tsx`
- Create: `src/features/catalog/GiftDetails.test.tsx`
- Create: `src/features/reservations/reservation-validation.ts`
- Create: `src/features/reservations/reservation-validation.test.ts`
- Create: `src/features/reservations/ReservationForm.tsx`
- Create: `src/features/reservations/ReservationForm.test.tsx`
- Create: `src/features/reservations/ReservationOutcome.tsx`

**Interfaces:**

- Consumes: `AppLocationState`, seletores, `reserveGift()` e `Dialog`.
- Produces: rota `#/item/:code`, formulário e resultados visuais.

```ts
export interface ReservationFormValues {
  firstName: string
  contact: string
  quantity: number
}

export type ReservationFormErrors = Partial<Record<'firstName' | 'contact' | 'quantity', string>>

export function validateReservationForm(
  values: ReservationFormValues,
  availableQuantity: number,
): ReservationFormErrors
```

- [ ] **Step 1: Escrever testes da validação e do fluxo antes da UI**

```ts
it('rejeita nome curto e quantidade maior que a disponível', () => {
  expect(validateReservationForm({ firstName: 'A', contact: '', quantity: 2 }, 1)).toEqual({
    firstName: 'Informe pelo menos 2 caracteres.',
    quantity: 'Escolha entre 1 e 1 unidade.',
  })
})
```

```tsx
it('mantém os campos e mostra recuperação após conflito', async () => {
  renderWithApp(<GiftDetailsPage />, {
    route: '/item/CZ-004',
    routePath: '/item/:code',
  })
  await userEvent.click(screen.getByRole('button', { name: /quero dar este presente/i }))
  await userEvent.type(screen.getByLabelText(/primeiro nome/i), 'Nina')
  await userEvent.click(screen.getByRole('button', { name: /confirmar/i }))
  expect(screen.getByRole('alert')).toHaveTextContent(/acabou de ser reservado/i)
  expect(screen.getByLabelText(/primeiro nome/i)).toHaveValue('Nina')
})
```

Cubra item inválido, indisponível, contato opcional, foco no primeiro erro,
sucesso com token determinístico e sugestão sem navegação externa.

- [ ] **Step 2: Executar e confirmar as falhas corretas**

Run: `npx vitest run src/features/catalog/GiftDetails.test.tsx src/features/reservations`

Expected: FAIL porque detalhes e formulário ainda não existem.

- [ ] **Step 3: Implementar conteúdo compartilhado de detalhes**

`GiftDetailsContent` recebe um `CatalogEntry`, mostra disponibilidade,
preferências, equivalência e sugestões. Sugestões são botões que exibem texto
persistente e toast “Demonstração: nenhum site externo foi aberto”.

`GiftDetailsPage` renderiza o conteúdo dentro de `AppShell`. Código inexistente
usa `ErrorState` com “Presente não encontrado” e link de retorno.

- [ ] **Step 4: Implementar painel por rota de fundo**

```tsx
const location = useLocation() as Location<AppLocationState>
const backgroundLocation = location.state?.backgroundLocation

return (
  <>
    <Routes location={backgroundLocation ?? location}>{mainRoutes}</Routes>
    {backgroundLocation ? (
      <Routes>
        <Route path="/item/:code" element={<GiftDetailsDialog />} />
      </Routes>
    ) : null}
  </>
)
```

O diálogo fecha com `navigate(-1)`. Acesso direto usa a página completa. Ambos
compartilham exatamente `GiftDetailsContent`.

- [ ] **Step 5: Implementar formulário e resultados**

Nome: 2–40 caracteres. Contato: opcional, máximo 100. Quantidade: inteiro entre
1 e restante. Associe erros a campos e foque o primeiro inválido.
Ao abrir ou fechar o formulário, descarte `reservationOutcome` anterior para
que sucesso ou conflito de outro item nunca seja reaproveitado.

Após sucesso, mostre no conteúdo:

```text
Pronto, este presente está reservado para você!
[Gerenciar esta reserva]
[Voltar à lista]
```

Conflito usa `role="alert"`, conserva campos e oferece “Escolher outro
presente”. Item indisponível explica o motivo e não abre o formulário.

- [ ] **Step 6: Verificar detalhes, reserva e regressões**

Run: `npm run format && npx vitest run src/features/catalog src/features/reservations src/domain && npm run typecheck && npm run lint`

Expected: PASS; a reserva altera somente o provider atual.

- [ ] **Step 7: Commit**

```bash
git add src/app/routes.tsx src/features/catalog src/features/reservations
git commit -m "feat(reservas): demonstrar reserva de presentes"
```

---

### Task 7: Gerenciamento da reserva

**Files:**

- Modify: `src/app/routes.tsx`
- Create: `src/features/reservations/ManageReservationPage.tsx`
- Create: `src/features/reservations/ManageReservationPage.test.tsx`
- Create: `src/features/reservations/ReservationSummary.tsx`
- Create: `src/components/ui/ConfirmDialog.tsx`
- Create: `src/components/ui/ConfirmDialog.test.tsx`

**Interfaces:**

- Consumes: token da rota, seletores e ações de status da Task 3.
- Produces: rota `#/minha-reserva/:token` e confirmação reutilizável.

- [ ] **Step 1: Escrever testes dos estados e confirmações**

```tsx
it('marca a reserva válida como comprada', async () => {
  renderWithApp(<ManageReservationPage />, {
    route: '/minha-reserva/reserva-demo-valida',
    routePath: '/minha-reserva/:token',
  })
  await userEvent.click(screen.getByRole('button', { name: /já comprei/i }))
  expect(screen.getByRole('status', { name: /estado da reserva/i })).toHaveTextContent(/comprado/i)
})

it('oferece retorno para token inexistente', () => {
  renderWithApp(<ManageReservationPage />, {
    route: '/minha-reserva/reserva-inexistente',
    routePath: '/minha-reserva/:token',
  })
  expect(screen.getByRole('heading', { name: /reserva não encontrada/i })).toBeVisible()
  expect(screen.getByRole('link', { name: /voltar à lista/i })).toHaveAttribute('href', '/')
})
```

Cubra cancelamento confirmado, desistência do diálogo, estados comprado,
recebido e cancelado, além de foco restaurado ao botão de cancelamento.

- [ ] **Step 2: Executar e confirmar as falhas corretas**

Run: `npx vitest run src/features/reservations/ManageReservationPage.test.tsx src/components/ui/ConfirmDialog.test.tsx`

Expected: FAIL porque página e confirmação ainda não existem.

- [ ] **Step 3: Implementar resumo, ações condicionais e mensagens persistentes**

Somente `reserved` mostra “Já comprei” e “Cancelar minha reserva”. A confirmação
de cancelamento nomeia o presente. Estados terminais mostram texto persistente,
badge e retorno ao catálogo, sem botões inválidos.

Após ação, foque o título “Estado da reserva” e emita um toast secundário. A
rota inválida usa `ErrorState`, nunca uma exceção técnica.

- [ ] **Step 4: Integrar a rota e executar regressões**

Run: `npm run format && npx vitest run src/features/reservations src/components/ui/ConfirmDialog.test.tsx && npm run typecheck && npm run lint`

Expected: PASS em todos os estados.

- [ ] **Step 5: Commit**

```bash
git add src/app/routes.tsx src/features/reservations src/components/ui/ConfirmDialog.tsx src/components/ui/ConfirmDialog.test.tsx
git commit -m "feat(reservas): permitir gerenciar reserva demonstrativa"
```

---

### Task 8: Coleções e Pix demonstrativos

**Files:**

- Modify: `src/app/routes.tsx`
- Create: `src/features/collections/CollectionPage.tsx`
- Create: `src/features/collections/CollectionPage.test.tsx`
- Create: `src/features/pix/IllustrativeQr.tsx`
- Create: `src/features/pix/PixPage.tsx`
- Create: `src/features/pix/PixPage.test.tsx`

**Interfaces:**

- Consumes: coleções/settings, primitives e toast.
- Produces: rotas `#/colecao/:slug`, `#/pix` e `IllustrativeQr` reutilizável.

```ts
export interface IllustrativeQrProps {
  label: string
  size?: 'small' | 'large'
}
```

- [ ] **Step 1: Escrever testes das páginas secundárias**

```tsx
it('não transforma sugestão fictícia em link externo', async () => {
  renderWithApp(<CollectionPage />, {
    route: '/colecao/sugestoes-cozinha',
    routePath: '/colecao/:slug',
  })
  const action = screen.getByRole('button', {
    name: /ver sugestão demonstrativa/i,
  })
  expect(action).not.toHaveAttribute('href')
  await userEvent.click(action)
  expect(screen.getByRole('status')).toHaveTextContent(/nenhum site externo/i)
})

it('simula cópia sem chamar a Clipboard API', async () => {
  const writeText = vi.fn()
  vi.stubGlobal('navigator', { clipboard: { writeText } })
  renderWithApp(<PixPage />, { route: '/pix' })
  await userEvent.click(screen.getByRole('button', { name: /simular cópia/i }))
  expect(writeText).not.toHaveBeenCalled()
  expect(screen.getByText(/nenhum dado foi copiado/i)).toBeVisible()
})
```

Cubra slug inexistente, aviso anterior às ações, alternativa textual do QR e
retorno ao catálogo.

- [ ] **Step 2: Executar e confirmar as falhas corretas**

Run: `npx vitest run src/features/collections src/features/pix`

Expected: FAIL porque as páginas ainda não existem.

- [ ] **Step 3: Implementar coleção sem navegação externa**

A página mostra título, categoria, explicação, cartões de sugestões e aviso
“Todos os endereços desta tela são fictícios”. Cada botão apenas mostra
feedback persistente e toast. Slug inválido usa “Coleção não encontrada”.

- [ ] **Step 4: Implementar Pix e QR ilustrativos**

`IllustrativeQr` cria um padrão CSS/SVG próprio, usa `role="img"` e
`aria-label="QR Code ilustrativo, não utilizável"`; não codifica dados.

`PixPage` mostra destinatário “Marina e Rafael — demonstração”, instituição
“Banco Fictício”, payload iniciado por `DEMO-PIX-NAO-UTILIZAR` e botão “Simular
cópia”. O clique não usa clipboard e mantém a explicação visível.

- [ ] **Step 5: Integrar rotas e verificar**

Run: `npm run format && npx vitest run src/features/collections src/features/pix && npm run typecheck && npm run lint`

Expected: PASS, sem elementos `a` para URLs `.invalid`.

- [ ] **Step 6: Commit**

```bash
git add src/app/routes.tsx src/features/collections src/features/pix
git commit -m "feat: adicionar coleções e contribuição Pix"
```

---

### Task 9: Prévia visual da lista para impressão

**Files:**

- Modify: `src/app/routes.tsx`
- Create: `src/features/pdf/PdfPreviewPage.tsx`
- Create: `src/features/pdf/PdfPreviewPage.test.tsx`
- Create: `src/features/pdf/PrintableGiftList.tsx`
- Create: `src/features/pdf/print.css`

**Interfaces:**

- Consumes: entradas de catálogo, settings e `IllustrativeQr` da Task 8.
- Produces: chunk lazy padrão e rota `#/pdf`.

- [ ] **Step 1: Escrever o teste da prévia antes da página**

```tsx
it('apresenta lista sem oferecer download real', async () => {
  renderWithApp(<PdfPreviewPage />, { route: '/pdf' })
  expect(screen.getByRole('heading', { name: /prévia para impressão/i })).toBeVisible()
  expect(screen.getByRole('region', { name: /folha a4 demonstrativa/i })).toHaveTextContent(
    /chaleira/i,
  )
  expect(screen.queryByRole('link', { name: /download/i })).not.toBeInTheDocument()

  await userEvent.click(screen.getByRole('button', { name: /simular download/i }))
  expect(screen.getByText(/nenhum arquivo foi gerado/i)).toBeVisible()
})
```

Espione `URL.createObjectURL` e confirme que não foi chamado. Teste título,
instruções, coluna de assinatura, estados textuais e alternativa do QR.

- [ ] **Step 2: Executar e confirmar a falha correta**

Run: `npx vitest run src/features/pdf/PdfPreviewPage.test.tsx`

Expected: FAIL porque a prévia ainda não existe.

- [ ] **Step 3: Implementar a folha A4 responsiva**

`PrintableGiftList` é HTML semântico, não uma imagem. Use título, instruções e
uma lista com colunas “Código”, “Presente”, “Disponibilidade” e “Nome/
assinatura”. O contêiner tem `width: min(100%, 794px)`, `min-width: 0` e quebra
de texto para caber em 360 px.

```css
.printable-sheet {
  width: min(100%, 794px);
  margin-inline: auto;
  background: white;
  aspect-ratio: 210 / 297;
}

@media print {
  .prototype-controls {
    display: none;
  }
  .printable-sheet {
    box-shadow: none;
    width: 100%;
  }
}
```

O QR é explicitamente ilustrativo. “Simular download” mostra mensagem
persistente e toast, sem Blob, link `download`, `window.print()` ou biblioteca
de PDF.

- [ ] **Step 4: Integrar como rota lazy**

```tsx
const PdfPreviewPage = lazy(() => import('@/features/pdf/PdfPreviewPage'))

<Route
  path="/pdf"
  element={
    <Suspense fallback={<RouteSkeleton label="Carregando prévia" />}>
      <PdfPreviewPage />
    </Suspense>
  }
/>
```

`PdfPreviewPage.tsx` deve ter `export default function PdfPreviewPage()`.

- [ ] **Step 5: Verificar prévia e chunk separado**

Run: `npm run format && npx vitest run src/features/pdf && npm run typecheck && npm run lint && npm run build`

Expected: PASS; `dist/assets` contém chunk separado da página de PDF.

- [ ] **Step 6: Commit**

```bash
git add src/app/routes.tsx src/features/pdf
git commit -m "feat(pdf): criar prévia visual da lista"
```

---

### Task 10: Entrada administrativa e resumo derivado

**Files:**

- Modify: `src/app/routes.tsx`
- Modify: `src/domain/selectors.ts`
- Modify: `src/domain/selectors.test.ts`
- Create: `src/features/admin/AdminPage.tsx`
- Create: `src/features/admin/AdminPage.test.tsx`
- Create: `src/features/admin/AdminLogin.tsx`
- Create: `src/features/admin/AdminDashboard.tsx`
- Create: `src/features/admin/AdminSummary.tsx`

**Interfaces:**

- Consumes: `adminUnlocked`, ações de login e disponibilidades derivadas.
- Produces: chunk lazy `#/admin` e `selectAdminSummary()`.

```ts
export interface AdminSummaryData {
  availableItems: number
  reservedItems: number
  receivedItems: number
  activeReservations: number
}

export function selectAdminSummary(state: DemoState): AdminSummaryData
```

- [ ] **Step 1: Escrever testes do resumo e da entrada demonstrativa**

```tsx
it('explica que o acesso não possui autenticação real', () => {
  renderWithApp(<AdminPage />, { route: '/admin' })
  expect(screen.getByRole('heading', { name: /painel demonstrativo/i })).toBeVisible()
  expect(screen.getByText(/não existe autenticação real/i)).toBeVisible()
  expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
})

it('entra e sai da demonstração sem credenciais', async () => {
  renderWithApp(<AdminPage />, { route: '/admin' })
  await userEvent.click(screen.getByRole('button', { name: /entrar na demonstração/i }))
  expect(screen.getByRole('heading', { name: /visão geral/i })).toHaveFocus()
  await userEvent.click(screen.getByRole('button', { name: /sair da demonstração/i }))
  expect(screen.getByText(/não existe autenticação real/i)).toBeVisible()
})
```

Teste `selectAdminSummary` antes da implementação, inclusive após cancelamento
e recebimento, para confirmar que nenhum contador vem de campo duplicado.

- [ ] **Step 2: Executar e confirmar as falhas corretas**

Run: `npx vitest run src/features/admin/AdminPage.test.tsx src/domain/selectors.test.ts`

Expected: FAIL pelos exports ainda ausentes.

- [ ] **Step 3: Implementar resumo exclusivamente por seletores**

Conte itens com quantidade restante, itens totalmente consumidos sem recebido,
itens com reserva recebida e reservas ativas. Não grave totais no `DemoState`.

- [ ] **Step 4: Implementar login ilustrativo e shell administrativo**

`AdminLogin` mostra aviso antes do botão e não renderiza campos falsos.
`AdminDashboard` mostra título focalizável, quatro cards de resumo, navegação por
seções com botões simples e “Sair da demonstração”.

Use cards empilháveis, nunca tabela larga, para funcionar em 360 px. A rota é
lazy e `AdminPage.tsx` usa export padrão.

- [ ] **Step 5: Integrar a rota e verificar reset por novo provider**

Run: `npm run format && npx vitest run src/features/admin/AdminPage.test.tsx src/domain/selectors.test.ts src/app/DemoStateProvider.test.tsx && npm run typecheck && npm run lint && npm run build`

Expected: PASS; novo mount volta ao login.

- [ ] **Step 6: Commit**

```bash
git add src/app/routes.tsx src/domain/selectors.ts src/domain/selectors.test.ts src/features/admin
git commit -m "feat(admin): criar acesso e resumo demonstrativos"
```

---

### Task 11: Operações administrativas e configurações visuais

**Files:**

- Modify: `src/features/admin/AdminDashboard.tsx`
- Modify: `src/features/admin/AdminPage.test.tsx`
- Create: `src/features/admin/AdminReservations.tsx`
- Create: `src/features/admin/AdminReservations.test.tsx`
- Create: `src/features/admin/AdminGiftList.tsx`
- Create: `src/features/admin/SiteSettingsForm.tsx`
- Create: `src/features/admin/SiteSettingsForm.test.tsx`

**Interfaces:**

- Consumes: seletores, transições de status, settings e `ConfirmDialog`.
- Produces: seções “Reservas”, “Presentes” e “Configurações”.

- [ ] **Step 1: Escrever testes das operações antes dos painéis**

```tsx
it('libera uma reserva após confirmação', async () => {
  renderWithApp(<AdminPage />, { route: '/admin' })
  await userEvent.click(screen.getByRole('button', { name: /entrar na demonstração/i }))
  await userEvent.click(screen.getByRole('button', { name: /reservas/i }))
  await userEvent.click(screen.getByRole('button', { name: /liberar reserva de cesto de roupas/i }))
  await userEvent.click(screen.getByRole('button', { name: /confirmar liberação/i }))
  expect(screen.getByText(/reserva liberada/i)).toBeVisible()
  expect(screen.getByText(/cesto de roupas/i).closest('article')).toHaveTextContent(/cancelada/i)
})

it('atualiza apenas configurações públicas editáveis', async () => {
  renderWithApp(<AdminPage />, { route: '/admin' })
  await userEvent.click(screen.getByRole('button', { name: /entrar na demonstração/i }))
  await userEvent.click(screen.getByRole('button', { name: /configurações/i }))
  await userEvent.clear(screen.getByLabelText(/título do site/i))
  await userEvent.type(screen.getByLabelText(/título do site/i), 'Nosso novo lar')
  await userEvent.click(screen.getByRole('button', { name: /salvar alterações/i }))
  expect(screen.getByText(/alterações mantidas somente nesta sessão/i)).toBeVisible()
  expect(screen.getByText(/banco fictício/i)).toBeVisible()
})
```

Cubra ações condicionais por status, recebimento, compra, cancelamento do
diálogo, lista de disponibilidades derivadas, campos obrigatórios vazios e foco
no primeiro erro.

- [ ] **Step 2: Executar e confirmar as falhas corretas**

Run: `npx vitest run src/features/admin`

Expected: FAIL porque os painéis ainda não existem.

- [ ] **Step 3: Implementar reservas administrativas como cards móveis**

Cada card mostra nome fictício, presente, quantidade, origem, data e status
textual. Ações:

- `reserved`: marcar comprado, marcar recebido ou liberar;
- `purchased`: marcar recebido ou liberar;
- `received` e `cancelled`: nenhuma ação mutável.

“Liberar” usa confirmação; todas as ações mantêm mensagem persistente, toast e
foco na linha alterada.

- [ ] **Step 4: Implementar lista derivada de presentes**

Mostre código, categoria, desejado, restante e rótulo público. A lista é
somente leitura e deve refletir imediatamente operações de reserva sem manter
estado próprio.

- [ ] **Step 5: Implementar configurações editáveis da sessão**

Campos: título (2–60), mensagem (10–240) e rodapé (2–120). Inicialize estado do
formulário a partir do provider e só faça dispatch após validação. Mostre Pix
como bloco somente leitura com “Dados fictícios”. Ao salvar, catálogo, cabeçalho
e prévia usam os novos valores enquanto a aba permanecer aberta.

- [ ] **Step 6: Integrar seções e verificar regressões públicas**

Run: `npm run format && npx vitest run src/features/admin src/features/catalog src/features/pdf src/domain && npm run typecheck && npm run lint`

Expected: PASS; admin e catálogo exibem a mesma fonte de verdade.

- [ ] **Step 7: Commit**

```bash
git add src/features/admin
git commit -m "feat(admin): adicionar operações e configurações"
```

---

### Task 12: Fluxos ponta a ponta, acessibilidade e responsividade

**Files:**

- Create: `playwright.config.ts`
- Create: `e2e/support/demo-scenarios.ts`
- Create: `e2e/support/assertions.ts`
- Create: `e2e/catalog.mobile.spec.ts`
- Create: `e2e/reservation.spec.ts`
- Create: `e2e/reservation-management.spec.ts`
- Create: `e2e/pix-pdf.spec.ts`
- Create: `e2e/admin.spec.ts`
- Create: `e2e/routing.spec.ts`
- Create: `e2e/keyboard.spec.ts`
- Create: `e2e/responsive.desktop.spec.ts`
- Modify: `.gitignore`

**Interfaces:**

- Consumes: todas as rotas e cenários determinísticos.
- Produces: suíte Playwright contra o build de produção sob o subdiretório do Pages.

```ts
export const demoScenarios = {
  availableItem: 'CZ-001',
  conflictItem: 'CZ-004',
  unavailableItem: 'LV-001',
  validToken: 'reserva-demo-valida',
  invalidToken: 'reserva-inexistente',
  validCollection: 'sugestoes-cozinha',
} as const
```

- [ ] **Step 1: Configurar projetos mobile e servidor de preview**

```ts
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: 'http://127.0.0.1:4173/lista-casa-nova/',
    locale: 'pt-BR',
    reducedMotion: 'reduce',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'mobile-chromium',
      grepInvert: /@desktop/,
      use: { ...devices['Pixel 7'], viewport: { width: 360, height: 800 } },
    },
    {
      name: 'mobile-webkit',
      grepInvert: /@desktop/,
      use: { ...devices['iPhone 13'], viewport: { width: 390, height: 844 } },
    },
    {
      name: 'desktop-chromium',
      grep: /@desktop/,
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1280, height: 900 },
      },
    },
  ],
  webServer: {
    command: 'npm run preview -- --host 127.0.0.1 --port 4173',
    url: 'http://127.0.0.1:4173/lista-casa-nova/',
    reuseExistingServer: !process.env.CI,
  },
})
```

Ignore `coverage/`, `playwright-report/` e `test-results/`.

- [ ] **Step 2: Escrever primeiro o teste do catálogo e confirmar RED**

```ts
test('filtra o catálogo em 360 px sem overflow', async ({ page }) => {
  await page.goto('./#/')
  await expect(page.getByRole('heading', { name: /lista da nossa casa nova/i })).toBeVisible()
  await page.getByRole('searchbox', { name: /buscar um presente/i }).fill('chaleira')
  await expect(page.getByRole('heading', { name: 'Chaleira' })).toBeVisible()
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= document.documentElement.clientWidth,
    ),
  ).toBe(true)
})
```

Run: `npm run test:e2e -- --project=mobile-chromium e2e/catalog.mobile.spec.ts`

Expected: PASS se a integração estiver correta. Uma falha revela um contrato
entre rotas, build ou CSS que não foi coberto pelos testes menores; antes de
corrigir produção, adicione um teste unitário ou de componente quando possível.

- [ ] **Step 3: Cobrir os fluxos públicos em Chromium e WebKit**

Implemente testes sem `waitForTimeout` para:

- busca com acento/caixa, categorias, somente disponíveis e vazio;
- alvo de toque `>= 43.5 px`, campo `>= 16 px` e ausência de overflow;
- painel de detalhe, reserva feliz, token gerado e reset após `page.reload()`;
- conflito `CZ-004` e item indisponível `LV-001`;
- gerenciamento por token válido e erro por token inválido;
- coleção válida/inválida, Pix e PDF demonstrativos;
- abertura fria e reload de todas as rotas hash;
- rota desconhecida com retorno ao catálogo.

Use roles e nomes acessíveis. Não faça snapshot grande de DOM ou screenshot como
asserção funcional.

- [ ] **Step 4: Cobrir teclado, foco e auditoria axe**

Teste Tab/Enter/Espaço, foco do diálogo, Escape, retorno ao cartão e foco do
`h1` após navegação. Use `AxeBuilder` nas rotas principais e rejeite violações
`serious` ou `critical`; mensagens de negócio continuam testadas separadamente.

- [ ] **Step 5: Cobrir administração e desktop**

No admin, entre sem credenciais, altere status/configuração, valide contadores e
confirme reset após reload. Em `@desktop`, confirme grade com múltiplas colunas,
contêiner central, cards administrativos e prévia A4 sem overflow.

- [ ] **Step 6: Provar ausência de integração e persistência**

Registre requests e falhe se uma ação provocar `fetch`/XHR ou origem externa;
assets e chunks da própria origem continuam permitidos. Ao fim de cada fluxo
mutável, verifique:

```ts
expect(
  await page.evaluate(() => ({
    local: localStorage.length,
    session: sessionStorage.length,
  })),
).toEqual({ local: 0, session: 0 })
```

- [ ] **Step 7: Executar toda a suíte E2E**

Run: `npx playwright install chromium webkit && npm run test:e2e`

Expected: PASS nos dois projetos móveis e no projeto desktop.

- [ ] **Step 8: Commit**

```bash
git add .gitignore playwright.config.ts e2e
git commit -m "test(e2e): cobrir fluxos do protótipo"
```

---

### Task 13: CI, GitHub Pages e documentação operacional

**Files:**

- Create: `.github/workflows/ci-pages.yml`
- Create: `.github/dependabot.yml`
- Create: `AGENTS.md`
- Create: `README.md`

**Interfaces:**

- Consumes: scripts npm e `dist` exercitado pela Task 12.
- Produces: validação em PR/main, deploy condicionado à main e instruções locais.

- [ ] **Step 1: Criar o workflow com validação antes do deploy**

```yaml
name: CI e GitHub Pages

on:
  pull_request:
  push:
    branches: [main]

permissions:
  contents: read

concurrency:
  group: pages-${{ github.ref }}
  cancel-in-progress: true

jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v6
      - uses: actions/setup-node@v7
        with:
          node-version: 24
          cache: npm
      - run: npm ci
      - run: npm run format:check
      - run: npm run lint
      - run: npm run typecheck
      - run: npm run test
      - run: npm run build
      - run: npx playwright install --with-deps chromium webkit
      - run: npm run test:e2e
      - if: failure()
        uses: actions/upload-artifact@v4
        with:
          name: playwright-report
          path: |
            playwright-report
            test-results
      - if: github.event_name == 'push' && github.ref == 'refs/heads/main'
        uses: actions/configure-pages@v5
      - if: github.event_name == 'push' && github.ref == 'refs/heads/main'
        uses: actions/upload-pages-artifact@v4
        with:
          path: dist

  deploy:
    if: github.event_name == 'push' && github.ref == 'refs/heads/main'
    needs: quality
    runs-on: ubuntu-latest
    permissions:
      pages: write
      id-token: write
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Publicar
        id: deployment
        uses: actions/deploy-pages@v4
```

Não adicione secrets, variáveis Supabase ou `OPENAI_API_KEY`.

- [ ] **Step 2: Configurar Dependabot semanal**

Crie entradas `npm` e `github-actions`, diretório `/`, frequência semanal,
limite de cinco PRs abertas e timezone `America/Bahia`.

- [ ] **Step 3: Documentar uso e limites do protótipo**

`README.md` deve conter objetivo, captura/descrição breve, requisitos Node 24 +
npm, comandos, rotas, cenários determinísticos, deploy Pages e uma caixa visível
informando que não há backend, persistência, Pix, PDF ou autenticação reais.

`AGENTS.md` deve conter:

```md
# Objetivo

- Protótipo visual mobile-first de uma lista de presentes.
- Toda linguagem de interface deve ser simples e em Português do Brasil.

# Restrições

- Não adicionar backend, banco, autenticação real ou persistência local.
- Não executar URLs externas nem inserir dados pessoais ou Pix reais.
- Disponibilidade deve ser derivada das reservas, nunca duplicada no item.
- Não adicionar dependências sem justificar.

# UX e acessibilidade

- Suportar 360 px, teclado, foco visível e movimento reduzido.
- Controles principais devem ter pelo menos 44 px.
- Estados não podem depender apenas de cor ou toast.

# Definition of done

- npm run format:check
- npm run lint
- npm run typecheck
- npm run test
- npm run build
- npm run test:e2e
```

- [ ] **Step 4: Executar cada comando da Definition of Done separadamente**

Run:

```bash
npm run format:check
npm run lint
npm run typecheck
npm run test
npm run build
npm run test:e2e
```

Expected: todos encerram com código 0. Não afirme sucesso para comandos não
executados; registre falhas reais e corrija a causa antes de continuar.

- [ ] **Step 5: Fazer revisão visual final**

Inspecione as rotas principais em 360 × 800, 390 × 844 e 1280 × 900. Confirme
hierarquia, texto cortado, foco, contraste, diálogo, admin e A4. Se houver
defeito, escreva primeiro um teste de regressão quando o comportamento for
automatizável, corrija e repita a suíte relevante.

- [ ] **Step 6: Conferir diff e ausência de dados/integracões proibidos**

Run:

```bash
git diff --check
rg -n "supabase|service_role|localStorage|sessionStorage|indexedDB|fetch\(|axios|OPENAI_API_KEY" . \
  -g '!package-lock.json' -g '!docs/**' -g '!e2e/**'
git status --short
```

Expected: `git diff --check` limpo; ocorrências restantes aparecem somente em
testes negativos, documentação de restrições ou código de verificação explícito.

- [ ] **Step 7: Commit**

```bash
git add .github AGENTS.md README.md
git commit -m "ci: validar e publicar protótipo no Pages"
```

---

## Ordem de execução e revisão

```text
1 Fundação
└── 2 Domínio e fixtures
    └── 3 Estado em memória
        └── 4 Sistema visual
            └── 5 Catálogo
                ├── 6 Detalhes e reserva ── 7 Gerenciamento
                ├── 8 Coleções e Pix ── 9 Prévia PDF
                └── 10 Admin básico ── 11 Operações admin
                                      └── 12 E2E
                                          └── 13 CI e documentação
```

Apesar de algumas features serem conceitualmente paralelas, todas alteram
`src/app/routes.tsx`. Para evitar conflitos no mesmo worktree, implemente na
ordem acima ou faça a integração de rotas em uma única tarefa serializada.

Ao concluir cada tarefa, o revisor deve verificar primeiro conformidade com a
especificação e depois qualidade do código. A implementação só avança quando os
dois níveis estiverem aprovados.
