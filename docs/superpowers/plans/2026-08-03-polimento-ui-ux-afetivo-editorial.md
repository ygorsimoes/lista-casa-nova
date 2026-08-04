# Plano de implementação do polimento afetivo editorial da UI e UX

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refinar a Lista da Casa Nova existente para uma experiência afetiva editorial, simples e objetiva, na qual a pessoa encontra um presente, reserva em seu nome e entende como combinar a entrega sem aparência de marketplace.

**Architecture:** A SPA React existente continua usando `HashRouter`, fixtures tipadas e `DemoStateProvider`; disponibilidade permanece derivada das reservas. O trabalho acrescenta somente apresentação compartilhada (`GiftVisual`, `Notice` e `Card` plano), mantém o fluxo visual de detalhe/reserva/confirmação como estado local de `GiftDetailsContent` e preserva o reducer de domínio sem novas ações.

**Tech Stack:** Node.js `>=24.15.0 <25`, npm, React 19.2.8, TypeScript 6.0.2, Vite 8.2.0, React Router 8.3.0, Tailwind CSS 4.3.3, Lucide React 1.28.0, Vitest 4.1.10, Testing Library, Playwright 1.62.1 e axe-core Playwright 4.12.1.

## Global Constraints

- Partir do commit de especificação `b8e5fae` em um worktree isolado criado no início da execução; branch sugerido: `codex/polimento-ui-ux-afetivo-editorial`.
- Não incluir no branch mudanças locais preexistentes de `package.json`, `package-lock.json`, `src/main.tsx` ou `.agents/` do worktree original.
- Não adicionar nem atualizar dependências de produção ou desenvolvimento.
- Não criar backend, banco, API, autenticação real, sincronização ou persistência local.
- Não usar `localStorage`, `sessionStorage`, IndexedDB, cookies ou service worker.
- Não executar URLs externas nem adicionar dados pessoais, bancários ou Pix reais.
- Pix, QR, PDF, cópia, download, referências, login e administração continuam demonstrativos.
- `GiftItem` não recebe campo de disponibilidade; `selectAvailability` continua derivando estado de reservas `reserved`, `purchased` e `received`.
- Recarregar a aplicação continua restaurando as fixtures iniciais.
- O catálogo público usa uma única coluna em todos os viewports e não contém botão `primary`.
- Cada fase de detalhe/reserva/confirmação contém no máximo uma ação `primary` e somente uma fase permanece no DOM.
- A identidade “Nossa lista” permanece visível; o cabeçalho usa “Contribuir” como ação secundária.
- Emojis são decorativos, aparecem somente em categorias, presentes e detalhes afetivos e usam `aria-hidden="true"`.
- Ícones funcionais usam Lucide e possuem texto visível ou nome acessível.
- Títulos afetivos usam `ui-serif, Georgia, Cambria, "Times New Roman", serif`; controles e corpo usam fontes de sistema sem serifa.
- Cores permanecem areia `#fbf8f1`/`#f3ecdf`, grafite `#211f1d`/`#3f3b37`, terracota `#a94f34`/`#995039` e oliva `#6f7b52`/`#4d5838`.
- Controles principais medem no mínimo 44 × 44 px; campos e corpo usam no mínimo 16 px e informações auxiliares, 14 px.
- Estados importantes permanecem escritos na página; cor, opacidade, emoji e toast nunca são a única comunicação.
- Foco é visível, retorno de foco é determinístico e `prefers-reduced-motion` elimina movimento não essencial.
- Em 360 × 800 com fixtures iniciais, cabeçalho, propósito, três passos, busca e o primeiro presente completo aparecem sem rolagem inicial.
- A faixa de categorias é a única região com rolagem horizontal intencional.
- A rota `#/colecao/:slug` permanece válida, mas sem chamada principal no catálogo.
- A prévia móvel mantém uma miniatura A4 proporcional e um resumo textual legível fora dela.
- Snapshots usam Chromium no Ubuntu da CI, animações/caret desativados e `maxDiffPixelRatio: 0.01`.
- Cada tarefa segue RED → confirmar a falha correta → GREEN mínimo → suíte relevante → commit.
- A conclusão exige `npm run format:check`, `npm run lint`, `npm run typecheck`, `npm run test`, `npm run build` e `npm run test:e2e`.

---

## Estrutura de arquivos planejada

### Novos arquivos

| Arquivo                                            | Responsabilidade                                                                   |
| -------------------------------------------------- | ---------------------------------------------------------------------------------- |
| `src/components/ui/Notice.tsx`                     | Superfície comum para avisos estáticos, status e alertas sem papel ARIA implícito. |
| `src/components/ui/Notice.test.tsx`                | Contrato semântico e visual de `Notice`.                                           |
| `src/components/ui/Card.test.tsx`                  | Compatibilidade da variante elevada e contrato da variante plana.                  |
| `src/components/ui/Button.test.tsx`                | Congelar hierarquia, tipo padrão, largura total e encaminhamento de ref.           |
| `src/features/catalog/GiftVisual.tsx`              | Mapa decorativo de emojis por presente com fallback por categoria.                 |
| `src/features/catalog/GiftVisual.test.tsx`         | Mapeamento, fallback e ocultação acessível dos emojis.                             |
| `src/features/catalog/HeroSection.test.tsx`        | Conteúdo afetivo e três passos compactos.                                          |
| `src/components/layout/SiteHeader.test.tsx`        | Marca curta permanente e ação secundária.                                          |
| `src/features/catalog/gift-presentation.test.ts`   | Rótulos públicos derivados da disponibilidade.                                     |
| `src/features/pdf/ScaledPrintablePreview.tsx`      | Medição e escala proporcional da folha A4 dentro da moldura móvel.                 |
| `src/features/pdf/ScaledPrintablePreview.test.tsx` | Cálculo de escala, semântica preservada e fallback sem `ResizeObserver`.           |
| `e2e/accessibility.states.spec.ts`                 | Axe em estados transitórios e administração desbloqueada.                          |
| `e2e/responsive.breakpoints.spec.ts`               | Contratos dirigidos em 480/481, 520/521, 639/640, 899/900 e 1199/1200 px.          |
| `e2e/reduced-motion.spec.ts`                       | Preferência e durações computadas sob movimento reduzido.                          |
| `e2e/visual-regression.spec.ts`                    | Snapshots canônicos do catálogo, fluxo, estados, admin e A4.                       |
| `e2e/__screenshots__/visual-regression.spec.ts/`   | Baselines Chromium/Ubuntu versionados por projeto.                                 |

### Arquivos modificados

- Fundação visual: `src/styles/index.css`, `src/features/pdf/print.css` e `src/components/ui/Card.tsx`.
- Entrada e catálogo: `src/data/settings.ts`, `src/components/layout/SiteHeader.tsx`, `src/components/layout/SiteFooter.tsx`, `src/features/catalog/HeroSection.tsx`, `CatalogFilters.tsx`, `CategoryList.tsx`, `CatalogPage.tsx`, `GiftGrid.tsx`, `GiftCard.tsx` e `gift-presentation.ts`.
- Reserva principal: `src/features/catalog/GiftDetailsContent.tsx`, `GiftDetailsDialog.tsx`, `GiftDetailsPage.tsx`, `src/features/reservations/ReservationForm.tsx` e `ReservationOutcome.tsx`.
- Rotas de apoio: `src/features/reservations/ManageReservationPage.tsx`, `ReservationSummary.tsx`, `src/features/pix/PixPage.tsx`, `src/features/collections/CollectionPage.tsx`, `src/features/pdf/PdfPreviewPage.tsx` e `PrintableGiftList.tsx`.
- Administração: `src/features/admin/AdminDashboard.tsx`, `AdminSummary.tsx`, `AdminGiftList.tsx`, `AdminReservations.tsx`, `SiteSettingsForm.tsx` e `AdminLogin.tsx`.
- Testes de componentes correspondentes, `src/test/setup.ts`, arquivos em `e2e/`,
  `e2e/support/assertions.ts`, `e2e/support/test.ts`, `playwright.config.ts` e o runner E2E em
  `.github/workflows/ci.yml`.

---

### Task 1: Criar a fundação visual compartilhada

**Files:**

- Create: `src/components/ui/Notice.tsx`
- Create: `src/components/ui/Notice.test.tsx`
- Modify: `src/components/ui/Card.tsx`
- Create: `src/components/ui/Card.test.tsx`
- Create: `src/components/ui/Button.test.tsx`
- Create: `src/features/catalog/GiftVisual.tsx`
- Create: `src/features/catalog/GiftVisual.test.tsx`
- Modify: `src/styles/index.css`
- Modify: `src/features/pdf/print.css`

**Interfaces:**

- Consumes: `Category['icon']`, atributos HTML nativos, `cn()` e as variantes atuais de `Button`.
- Produces:

```ts
export type NoticeTone = 'info' | 'demo' | 'success' | 'error'

export interface NoticeProps extends HTMLAttributes<HTMLDivElement> {
  tone?: NoticeTone
  icon?: ReactNode
}

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'elevated' | 'flat'
}

export type GiftVisualSize = 'list' | 'detail' | 'summary'

export interface GiftVisualProps {
  itemCode: string
  categoryIcon: Category['icon']
  size?: GiftVisualSize
  className?: string
}

export function getCategoryEmoji(icon: Category['icon']): string
export function getGiftEmoji(itemCode: string, categoryIcon: Category['icon']): string
```

- `Notice` não escolhe `role` nem `aria-live`; o consumidor passa esses atributos quando o conteúdo realmente precisa ser anunciado.
- `Card` mantém `elevated` como padrão para compatibilidade durante a migração.
- `ButtonProps` e suas quatro variantes permanecem inalterados.

- [ ] **Step 1: Escrever testes RED para as novas primitivas e caracterizar `Button`**

```tsx
// src/components/ui/Notice.test.tsx
import { Notice } from '@/components/ui/Notice'
import { render, screen } from '@testing-library/react'
import { createRef } from 'react'
import { describe, expect, it } from 'vitest'

describe('Notice', () => {
  it('não cria região viva implicitamente e encaminha ref', () => {
    const ref = createRef<HTMLDivElement>()
    const { container } = render(
      <Notice ref={ref} tone="demo">
        Nada é enviado ou salvo.
      </Notice>,
    )
    expect(container.firstElementChild).not.toHaveAttribute('role')
    expect(container.firstElementChild).not.toHaveAttribute('aria-live')
    expect(ref.current).toBe(container.firstElementChild)
  })

  it('propaga papel, nome e classe sem expor o ícone', () => {
    render(
      <Notice
        tone="error"
        role="alert"
        aria-label="Conflito de reserva"
        className="reservation-notice"
        icon={<svg data-testid="notice-icon" />}
      >
        Este presente acabou de ser reservado.
      </Notice>,
    )

    expect(screen.getByRole('alert', { name: 'Conflito de reserva' })).toHaveClass(
      'ui-notice--error',
      'reservation-notice',
    )
    expect(screen.getByTestId('notice-icon').parentElement).toHaveAttribute('aria-hidden', 'true')
  })
})
```

```tsx
// src/components/ui/Card.test.tsx
import { Card } from '@/components/ui/Card'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

describe('Card', () => {
  it('preserva elevação por padrão e oferece superfície plana', () => {
    const { rerender } = render(<Card data-testid="card">Elevado</Card>)
    expect(screen.getByTestId('card')).toHaveClass('ui-card--elevated')

    rerender(
      <Card data-testid="card" variant="flat" className="gift-card">
        Plano
      </Card>,
    )
    expect(screen.getByTestId('card')).toHaveClass('ui-card--flat', 'gift-card')
  })
})
```

```tsx
// src/components/ui/Button.test.tsx
import { Button } from '@/components/ui/Button'
import { render, screen } from '@testing-library/react'
import { createRef } from 'react'
import { describe, expect, it } from 'vitest'

describe('Button', () => {
  it('mantém type button, variantes, largura e ref', () => {
    const ref = createRef<HTMLButtonElement>()
    render(
      <Button ref={ref} variant="ghost" fullWidth aria-label="Ver presente">
        Ver
      </Button>,
    )

    const button = screen.getByRole('button', { name: 'Ver presente' })
    expect(button).toHaveAttribute('type', 'button')
    expect(button).toHaveClass('ui-button--ghost', 'ui-button--full')
    expect(ref.current).toBe(button)
  })
})
```

```tsx
// src/features/catalog/GiftVisual.test.tsx
import { GiftVisual, getCategoryEmoji, getGiftEmoji } from './GiftVisual'
import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

describe('GiftVisual', () => {
  it('mapeia presente e usa fallback por categoria', () => {
    expect(getGiftEmoji('CZ-001', 'cooking-pot')).toBe('🫖')
    expect(getGiftEmoji('NOVO', 'bed-double')).toBe('🛏️')
    expect(getCategoryEmoji('washing-machine')).toBe('🧺')
  })

  it('permanece decorativo', () => {
    const { container } = render(
      <GiftVisual itemCode="CZ-001" categoryIcon="cooking-pot" size="detail" />,
    )
    expect(container.firstElementChild).toHaveAttribute('aria-hidden', 'true')
    expect(container.firstElementChild).toHaveTextContent('🫖')
  })
})
```

- [ ] **Step 2: Executar os testes e confirmar a falha RED**

Run:

```bash
npm run test:unit -- \
  src/components/ui/Notice.test.tsx \
  src/components/ui/Card.test.tsx \
  src/components/ui/Button.test.tsx \
  src/features/catalog/GiftVisual.test.tsx
```

Expected: os testes de `Notice`, `GiftVisual` e `CardProps.variant` FAIL porque os contratos ainda
não existem; o teste de caracterização de `Button` PASS e congela a API que não deve mudar.

- [ ] **Step 3: Implementar os contratos mínimos**

```tsx
// src/components/ui/Notice.tsx
import { cn } from '@/lib/cn'
import { forwardRef, type HTMLAttributes, type ReactNode } from 'react'

export type NoticeTone = 'info' | 'demo' | 'success' | 'error'

export interface NoticeProps extends HTMLAttributes<HTMLDivElement> {
  tone?: NoticeTone
  icon?: ReactNode
}

export const Notice = forwardRef<HTMLDivElement, NoticeProps>(function Notice(
  { children, className, icon, tone = 'info', ...props },
  ref,
) {
  return (
    <div ref={ref} className={cn('ui-notice', `ui-notice--${tone}`, className)} {...props}>
      {icon ? (
        <span className="ui-notice__icon" aria-hidden="true">
          {icon}
        </span>
      ) : null}
      <div className="ui-notice__content">{children}</div>
    </div>
  )
})
```

```tsx
// src/components/ui/Card.tsx
import { cn } from '@/lib/cn'
import type { HTMLAttributes } from 'react'

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'elevated' | 'flat'
}

export function Card({ className, variant = 'elevated', ...props }: CardProps) {
  return <div className={cn('ui-card', `ui-card--${variant}`, className)} {...props} />
}
```

```tsx
// src/features/catalog/GiftVisual.tsx
import type { Category } from '@/domain/types'
import { cn } from '@/lib/cn'

const categoryEmojis: Record<Category['icon'], string> = {
  'cooking-pot': '🍳',
  'bed-double': '🛏️',
  bath: '🛁',
  'washing-machine': '🧺',
  lamp: '💡',
}

const giftEmojis: Readonly<Record<string, string>> = {
  'CZ-001': '🫖',
  'CZ-002': '🍳',
  'CZ-003': '🫙',
  'CZ-004': '☕',
  'QT-001': '🛏️',
  'QT-002': '☁️',
  'BN-001': '🧴',
  'BN-002': '🛁',
  'LV-001': '🧺',
  'LV-002': '👕',
  'DC-001': '💡',
}

export type GiftVisualSize = 'list' | 'detail' | 'summary'

export interface GiftVisualProps {
  itemCode: string
  categoryIcon: Category['icon']
  size?: GiftVisualSize
  className?: string
}

export function getCategoryEmoji(icon: Category['icon']) {
  return categoryEmojis[icon] ?? '🎁'
}

export function getGiftEmoji(itemCode: string, categoryIcon: Category['icon']) {
  return giftEmojis[itemCode] ?? getCategoryEmoji(categoryIcon)
}

export function GiftVisual({ categoryIcon, className, itemCode, size = 'list' }: GiftVisualProps) {
  return (
    <span aria-hidden="true" className={cn('gift-visual', `gift-visual--${size}`, className)}>
      {getGiftEmoji(itemCode, categoryIcon)}
    </span>
  )
}
```

Mantenha `Button.tsx` sem mudança de API. Acrescente os tokens e as classes abaixo no início e na seção de primitivas de `src/styles/index.css`:

```css
:root {
  color-scheme: light;
  --font-affective: ui-serif, Georgia, Cambria, 'Times New Roman', serif;
  --font-operational:
    ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-6: 1.5rem;
  --space-8: 2rem;
  --space-12: 3rem;
  --radius-control: 0.75rem;
  --radius-surface: 1rem;
  --radius-overlay: 1.5rem;
  --border-soft: rgb(63 59 55 / 0.16);
  --accent-muted: rgb(169 79 52 / 0.09);
  --success-muted: rgb(111 123 82 / 0.11);
  --error-muted: rgb(153 80 57 / 0.1);
  --shadow-overlay: 0 18px 50px rgb(33 31 29 / 0.16);
}

body {
  font-family: var(--font-operational);
}

.ui-card--elevated {
  box-shadow: var(--shadow-card);
}

.ui-card--flat {
  border: 1px solid var(--border-soft);
  background: rgb(255 255 255 / 0.72);
  box-shadow: none;
}

.ui-notice {
  display: flex;
  gap: var(--space-3);
  margin: 0;
  border: 1px solid var(--border-soft);
  border-radius: var(--radius-surface);
  padding: var(--space-4);
}

.ui-notice--info,
.ui-notice--demo {
  background: var(--accent-muted);
  color: var(--color-graphite-700);
}

.ui-notice--success {
  background: var(--success-muted);
  color: var(--color-olive-700);
}

.ui-notice--error {
  background: var(--error-muted);
  color: var(--color-terracotta-600);
}

.ui-notice__icon {
  display: grid;
  flex: 0 0 auto;
  place-items: start;
}

.gift-visual {
  display: grid;
  flex: 0 0 auto;
  place-items: center;
  border-radius: var(--radius-surface);
  background: var(--accent-muted);
  line-height: 1;
}

.gift-visual--list,
.gift-visual--summary {
  width: 3rem;
  height: 3rem;
  font-size: 1.5rem;
}

.gift-visual--detail {
  width: 5rem;
  height: 5rem;
  font-size: 2.5rem;
}

.ui-state__title {
  font-family: var(--font-affective);
  letter-spacing: -0.02em;
}
```

Remova as regras específicas `outline: 0` ou `outline: none` de títulos focáveis em `src/styles/index.css` e `src/features/pdf/print.css`; o `:focus-visible` global permanece responsável pelo indicador.

- [ ] **Step 4: Executar testes e verificações direcionadas**

Run:

```bash
npm run test:unit -- \
  src/components/ui/Notice.test.tsx \
  src/components/ui/Card.test.tsx \
  src/components/ui/Button.test.tsx \
  src/features/catalog/GiftVisual.test.tsx
npm run typecheck
rg -n "outline:\s*(0|none)" src/styles/index.css src/features/pdf/print.css
```

Expected: testes e tipos PASS; `rg` não encontra remoção de foco visível e encerra com código 1 sem saída.

- [ ] **Step 5: Commit da fundação visual**

```bash
git add src/components/ui/Notice.tsx src/components/ui/Notice.test.tsx \
  src/components/ui/Card.tsx src/components/ui/Card.test.tsx \
  src/components/ui/Button.test.tsx \
  src/features/catalog/GiftVisual.tsx src/features/catalog/GiftVisual.test.tsx \
  src/styles/index.css src/features/pdf/print.css
git commit -m "feat(ui): criar fundação visual afetiva editorial"
```

---

### Task 2: Compactar identidade, abertura e três passos

**Files:**

- Modify: `src/data/settings.ts`
- Modify: `src/data/fixtures.test.ts`
- Modify: `src/components/layout/SiteHeader.tsx`
- Create: `src/components/layout/SiteHeader.test.tsx`
- Modify: `src/components/layout/SiteFooter.tsx`
- Modify: `src/features/catalog/HeroSection.tsx`
- Create: `src/features/catalog/HeroSection.test.tsx`
- Modify: `src/features/catalog/CatalogPage.test.tsx`
- Modify: `src/styles/index.css`

**Interfaces:**

- Consumes: `settings.title`, `settings.message`, `Heart` e os ícones Lucide já usados nos passos.
- Produces: cabeçalho público com links acessíveis “Nossa lista” e “Contribuir”; `HeroSectionProps` permanece `{ title: string; message: string }`.
- O rodapé continua oferecendo “Prévia para impressão” e “Painel demonstrativo”; nenhuma chamada de impressão permanece no hero.

- [ ] **Step 1: Escrever os testes falhando para a nova hierarquia**

```tsx
// src/components/layout/SiteHeader.test.tsx
import { SiteHeader } from './SiteHeader'
import { renderWithApp } from '@/test/renderApp'
import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

describe('SiteHeader', () => {
  it('mantém identidade curta e contribuição secundária', () => {
    renderWithApp(<SiteHeader />)

    expect(screen.getByRole('link', { name: 'Nossa lista' })).toHaveAttribute('href', '/')
    expect(screen.getByRole('link', { name: 'Contribuir' })).toHaveAttribute('href', '/pix')
  })
})
```

```tsx
// src/features/catalog/HeroSection.test.tsx
import { HeroSection } from './HeroSection'
import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

describe('HeroSection', () => {
  it('apresenta contexto afetivo e exatamente três passos', () => {
    render(<HeroSection title="Lista da nossa casa nova" message="Escolha com carinho." />)

    expect(screen.getByText(/um novo capítulo começa aqui/i)).toBeVisible()
    expect(screen.getByRole('heading', { name: 'Lista da nossa casa nova' })).toBeVisible()
    const steps = screen.getByRole('list', { name: 'Como funciona' })
    expect(within(steps).getAllByRole('listitem')).toHaveLength(3)
    expect(steps).toHaveTextContent('Escolha um presente')
    expect(steps).toHaveTextContent('Reserve em seu nome')
    expect(steps).toHaveTextContent('Combine a entrega')
    expect(screen.queryByRole('link')).not.toBeInTheDocument()
  })
})
```

Substitua o teste antigo “oferece CTAs do hero” em `CatalogPage.test.tsx` por:

```tsx
it('mantém ações de apoio fora do hero', () => {
  renderWithApp(<CatalogPage />)

  expect(
    screen.queryByRole('link', { name: /contribuir com qualquer valor/i }),
  ).not.toBeInTheDocument()
  expect(screen.queryByRole('link', { name: /ver lista para impressão/i })).not.toBeInTheDocument()
})
```

- [ ] **Step 2: Executar os testes e confirmar a falha RED**

Run:

```bash
npm run test:unit -- \
  src/components/layout/SiteHeader.test.tsx \
  src/features/catalog/HeroSection.test.tsx \
  src/features/catalog/CatalogPage.test.tsx
```

Expected: FAIL porque o cabeçalho ainda usa o título longo/Pix e o hero ainda contém links e não possui eyebrow.

- [ ] **Step 3: Implementar cabeçalho, fixture e hero compactos**

Substitua `SiteHeader` por:

```tsx
import { Heart } from 'lucide-react'
import { Link } from 'react-router'

export function SiteHeader() {
  return (
    <header className="site-header">
      <Link className="site-header__brand" to="/" aria-label="Nossa lista">
        <Heart aria-hidden="true" size={22} strokeWidth={1.8} />
        <span>Nossa lista</span>
      </Link>
      <Link className="site-header__contribute" to="/pix">
        Contribuir
      </Link>
    </header>
  )
}
```

Em `settings.ts`, use este valor inicial e mantenha os demais campos fictícios:

```ts
message: 'Escolha com carinho algo que você já imaginou para o nosso lar.',
```

Atualize somente a expectativa correspondente de `settings.message` em `fixtures.test.ts`; os
demais campos, quantidades, códigos e dados fictícios permanecem congelados pelo teste.

Em `HeroSection.tsx`, remova `Link`, mantenha o array de três passos e renderize:

```tsx
export function HeroSection({ message, title }: HeroSectionProps) {
  return (
    <section className="catalog-hero" aria-labelledby="catalog-title">
      <div className="catalog-hero__intro">
        <p className="catalog-hero__eyebrow">
          Um novo capítulo começa aqui <span aria-hidden="true">✨</span>
        </p>
        <h1 id="catalog-title" tabIndex={-1}>
          {title}
        </h1>
        <p className="catalog-hero__message">{message}</p>
      </div>
      <ol className="how-it-works__steps" aria-label="Como funciona">
        {steps.map(({ icon: Icon, text }, index) => (
          <li key={text}>
            <span className="how-it-works__icon">
              <Icon aria-hidden="true" size={22} strokeWidth={1.8} />
              <span className="how-it-works__number">{index + 1}</span>
            </span>
            <span>{text}</span>
          </li>
        ))}
      </ol>
    </section>
  )
}
```

No rodapé, mantenha os três destinos atuais, mas renomeie “Catálogo” para “Nossa lista”. Substitua
os blocos atuais de hero e passos — especialmente `.catalog-hero__intro p`, o grid antigo dos itens
e as bordas verticais — pelos blocos centrais abaixo em `index.css`:

```css
.site-header__brand,
.site-header__contribute {
  display: inline-flex;
  min-width: 44px;
  min-height: 44px;
  align-items: center;
}

.site-header__brand {
  gap: var(--space-2);
  color: var(--color-terracotta-600);
  font-weight: 750;
  text-decoration: none;
}

.site-header__contribute {
  justify-content: center;
  color: var(--color-terracotta-600);
  font-weight: 700;
  text-underline-offset: 0.2em;
}

.catalog-hero {
  display: grid;
  gap: var(--space-3);
}

.catalog-hero__eyebrow {
  margin: 0 0 var(--space-1);
  color: var(--color-terracotta-600);
  font-size: 0.875rem;
  font-weight: 750;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.catalog-hero h1 {
  max-width: 12ch;
  margin: 0;
  font-family: var(--font-affective);
  font-size: clamp(2.5rem, 10vw, 3.75rem);
  font-weight: 700;
  letter-spacing: -0.025em;
  line-height: 0.98;
}

.catalog-hero__message {
  max-width: 36rem;
  margin: var(--space-2) 0 0;
  color: var(--color-graphite-700);
  font-size: 1rem;
}

.how-it-works__steps {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  margin: 0;
  border: 1px solid var(--border-soft);
  border-radius: var(--radius-surface);
  background: rgb(255 255 255 / 0.72);
  padding: var(--space-2) var(--space-1);
  list-style: none;
}

.how-it-works__steps li {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  min-width: 0;
  justify-items: center;
  gap: var(--space-1);
  padding: var(--space-1);
  font-size: 0.875rem;
  font-weight: 700;
  line-height: 1.2;
  text-align: center;
}

.how-it-works__steps li + li {
  border-top: 0;
  border-left: 1px solid var(--border-soft);
}

.how-it-works__steps li > span:last-child {
  font-size: 0.875rem;
  font-weight: 700;
}

.how-it-works__icon {
  position: relative;
  display: grid;
  min-width: 2rem;
  min-height: 2rem;
  place-items: center;
  color: var(--color-terracotta-500);
}

.how-it-works__number {
  position: absolute;
  top: -0.2rem;
  right: -0.15rem;
  display: grid;
  width: 1rem;
  height: 1rem;
  place-items: center;
  border-radius: 999px;
  background: var(--color-sand-100);
  font-size: 0.6875rem;
}
```

Remova a media query que oculta `.site-header__brand span` abaixo de 480 px e os estilos de `.catalog-hero__links`.

- [ ] **Step 4: Executar a suíte direcionada e o build**

Run:

```bash
npm run test:unit -- \
  src/components/layout/SiteHeader.test.tsx \
  src/features/catalog/HeroSection.test.tsx \
  src/features/catalog/CatalogPage.test.tsx src/data/fixtures.test.ts
npm run typecheck
npm run build
```

Expected: todos os comandos PASS e o build não inclui requisição de fonte externa.

- [ ] **Step 5: Commit da entrada afetiva**

```bash
git add src/data/settings.ts src/data/fixtures.test.ts src/components/layout/SiteHeader.tsx \
  src/components/layout/SiteHeader.test.tsx src/components/layout/SiteFooter.tsx \
  src/features/catalog/HeroSection.tsx src/features/catalog/HeroSection.test.tsx \
  src/features/catalog/CatalogPage.test.tsx src/styles/index.css
git commit -m "feat(catalogo): compactar entrada afetiva da lista"
```

---

### Task 3: Transformar o catálogo em lista editorial

**Files:**

- Modify: `src/features/catalog/CategoryList.tsx`
- Modify: `src/features/catalog/CatalogFilters.tsx`
- Modify: `src/features/catalog/CatalogPage.tsx`
- Modify: `src/features/catalog/CatalogPage.test.tsx`
- Modify: `src/features/catalog/GiftGrid.tsx`
- Modify: `src/features/catalog/GiftCard.tsx`
- Modify: `src/features/catalog/GiftCard.test.tsx`
- Modify: `src/features/catalog/gift-presentation.ts`
- Create: `src/features/catalog/gift-presentation.test.ts`
- Modify: `src/styles/index.css`

**Interfaces:**

- Consumes: `GiftVisual`, `Card variant="flat"`, filtros locais atuais, `getCategoryEmoji()` e disponibilidade derivada.
- Produces: `getCatalogResultLabel(count: number): string`; `GiftAvailabilityPresentation` mantém a interface existente.
- `GiftCardProps` permanece `{ code: string }`; o id `gift-card-action-${code}` permanece estável para restauração de foco.

- [ ] **Step 1: Escrever testes falhando para rótulos, contagens e ação editorial**

```ts
// src/features/catalog/gift-presentation.test.ts
import { createInitialDemoState } from '@/data/initial-state'
import { selectAvailability } from '@/domain/selectors'
import { describe, expect, it } from 'vitest'
import { getGiftAvailabilityPresentation } from './gift-presentation'

describe('getGiftAvailabilityPresentation', () => {
  it.each([
    ['CZ-001', 'Disponível'],
    ['CZ-003', '1 de 2 disponíveis'],
    ['LV-001', 'Já foi escolhido'],
    ['BN-002', 'Já foi escolhido'],
  ])('apresenta %s como %s', (code, label) => {
    const availability = selectAvailability(createInitialDemoState(), code)
    expect(availability).toBeDefined()
    expect(getGiftAvailabilityPresentation(availability!).label).toBe(label)
  })
})
```

Substitua as expectativas de ação em `GiftCard.test.tsx` por:

```tsx
it.each([
  ['CZ-001', 'Disponível', 'Ver Chaleira'],
  ['CZ-003', '1 de 2 disponíveis', 'Ver Potes herméticos'],
  ['LV-001', 'Já foi escolhido', 'Ver Cesto de roupas'],
  ['BN-002', 'Já foi escolhido', 'Ver Jogo de toalhas'],
])('mostra estado e ação editorial para %s', (code, status, action) => {
  renderCard(code)
  expect(screen.getByText(status)).toBeVisible()
  const button = screen.getByRole('button', { name: action })
  expect(button).toHaveClass('ui-button--ghost')
  expect(button).not.toHaveClass('ui-button--primary')
})
```

Acrescente em `CatalogPage.test.tsx`:

```tsx
it('usa linguagem de ideias para zero, uma e várias entradas', async () => {
  const user = userEvent.setup()
  renderWithApp(<CatalogPage />)
  const search = screen.getByRole('searchbox', { name: 'Buscar um presente' })

  expect(screen.getByRole('status')).toHaveTextContent('11 ideias para escolher')
  await user.type(search, 'chaleira')
  expect(screen.getByRole('status')).toHaveTextContent('1 ideia para escolher')
  await user.clear(search)
  await user.type(search, 'resultado impossível')
  expect(screen.getByRole('status')).toHaveTextContent('Nenhuma ideia encontrada')
})

it('limpa todos os filtros a partir do estado vazio', async () => {
  const user = userEvent.setup()
  renderWithApp(<CatalogPage />)
  await user.type(screen.getByRole('searchbox', { name: 'Buscar um presente' }), 'inexistente')
  await user.click(screen.getByRole('button', { name: 'Limpar busca e filtros' }))
  expect(screen.getByRole('status')).toHaveTextContent('11 ideias para escolher')
})
```

No teste existente “mantém os cartões na ordem das fixtures”, troque o nível dos títulos dos
presentes de `2` para `3`, pois o novo `h2` pertence à seção “Escolha um presente”:

```tsx
const names = within(screen.getByLabelText('Escolha um presente'))
  .getAllByRole('heading', { level: 3 })
  .map((heading) => heading.textContent)
```

- [ ] **Step 2: Executar os testes e confirmar a falha RED**

Run:

```bash
npm run test:unit -- \
  src/features/catalog/gift-presentation.test.ts \
  src/features/catalog/GiftCard.test.tsx \
  src/features/catalog/CatalogPage.test.tsx
```

Expected: FAIL com os rótulos antigos, CTA repetido e contagem “presente encontrado”.

- [ ] **Step 3: Implementar chips, contagem e linha de presente**

Em `gift-presentation.ts`, mantenha o caso parcial e substitua os casos finais por:

```ts
if (availability.visualState === 'available') {
  return { label: 'Disponível', tone: 'available' }
}
if (availability.visualState === 'partially-reserved') {
  return {
    label: `${availability.remainingQuantity} de ${availability.desiredQuantity} disponíveis`,
    tone: 'available',
  }
}
return {
  label: 'Já foi escolhido',
  tone: availability.visualState === 'received' ? 'received' : 'reserved',
}
```

Em `CategoryList.tsx`, use `getCategoryEmoji()` e renderize os emojis dentro de `span[aria-hidden="true"]`; o texto acessível dos botões continua “Todas”, “Cozinha”, “Quarto”, “Banheiro”, “Lavanderia” e “Decoração”.

Em `CatalogFilters.tsx`, altere o placeholder para `Buscar: panelas, toalhas, quarto...`, o checkbox para `Só disponíveis` e agrupe o título operacional com o filtro:

```tsx
<div className="catalog-filters__list-heading">
  <h2 id="catalog-list-title">Escolha um presente</h2>
  <Checkbox
    label="Só disponíveis"
    checked={availableOnly}
    onChange={(event) => onAvailableOnlyChange(event.target.checked)}
  />
</div>
```

Em `CatalogPage.tsx`, exporte e use:

```ts
export function getCatalogResultLabel(count: number) {
  if (count === 0) return 'Nenhuma ideia encontrada'
  if (count === 1) return '1 ideia para escolher'
  return `${count} ideias para escolher`
}
```

No estado vazio, passe ao `EmptyState`:

```tsx
action={
  filters.query || filters.categorySlug || filters.availableOnly ? (
    <Button variant="secondary" onClick={() => setFilters(initialViewState)}>
      Limpar busca e filtros
    </Button>
  ) : undefined
}
```

Substitua o conteúdo de `GiftCard` pelo contrato abaixo, mantendo a navegação existente:

```tsx
<Card variant="flat" className={cn('gift-card', !canReserve && 'gift-card--chosen')}>
  <article>
    <GiftVisual itemCode={entry.gift.code} categoryIcon={entry.category.icon} />
    <div className="gift-card__content">
      <p className="gift-card__category">{entry.category.name}</p>
      <h3>{entry.gift.name}</h3>
      <p className="gift-card__preference">{entry.gift.preferences.slice(0, 2).join(' · ')}</p>
      <p className="gift-card__status">{availabilityPresentation.label}</p>
    </div>
    <Button
      id={`gift-card-action-${entry.gift.code}`}
      className="gift-card__open"
      variant="ghost"
      onClick={() =>
        navigate(`/item/${entry.gift.code}`, {
          state: { backgroundLocation: location },
        })
      }
      aria-label={`Ver ${entry.gift.name}`}
    >
      Ver
      <ChevronRight aria-hidden="true" size={18} />
    </Button>
  </article>
</Card>
```

Importe `cn`, `GiftVisual` e `ChevronRight`; remova os ícones de categoria, `Badge` e o CTA condicional. Em `GiftGrid`, troque `aria-label` por `aria-labelledby="catalog-list-title"`.

- [ ] **Step 4: Implementar a apresentação de uma única coluna**

Substitua os blocos de catálogo correspondentes em `index.css` por:

```css
.catalog-filters {
  display: grid;
  gap: var(--space-3);
  margin-top: var(--space-4);
}

.catalog-search .ui-input {
  min-height: 48px;
  padding-right: 3.75rem;
  padding-left: 3rem;
  font-size: 1rem;
}

.category-list {
  display: flex;
  flex-wrap: nowrap;
  gap: var(--space-2);
  margin-inline: -1rem;
  overflow-x: auto;
  overscroll-behavior-inline: contain;
  padding: 0 1rem var(--space-1);
  scrollbar-width: thin;
}

.category-list__button {
  display: inline-flex;
  min-width: 44px;
  min-height: 44px;
  flex: 0 0 auto;
  align-items: center;
  gap: var(--space-1);
  border: 1px solid var(--border-soft);
  border-radius: 999px;
  background: rgb(255 255 255 / 0.72);
  padding: 0 var(--space-3);
  color: var(--color-graphite-700);
  font-weight: 700;
}

.catalog-filters__list-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
}

.catalog-filters__list-heading h2 {
  margin: 0;
  font-family: var(--font-affective);
  font-size: 1.5rem;
  letter-spacing: -0.02em;
}

.gift-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: var(--space-2);
}

.gift-card article {
  display: grid;
  grid-template-columns: 3rem minmax(0, 1fr) auto;
  min-height: 5rem;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3);
}

.gift-card h3 {
  margin: var(--space-1) 0 0;
  font-size: 1.125rem;
  line-height: 1.15;
}

.gift-card__preference,
.gift-card__status {
  margin: var(--space-1) 0 0;
  color: var(--color-graphite-700);
  font-size: 0.875rem;
}

.gift-card__status {
  color: var(--color-olive-700);
  font-weight: 750;
}

.gift-card--chosen .gift-card__status {
  color: var(--color-graphite-700);
}

.gift-card--chosen .gift-visual,
.gift-card--chosen .gift-card__content {
  opacity: 0.68;
}

.gift-card__open {
  min-width: 48px;
  padding-inline: var(--space-1);
}
```

Remova todas as media queries que mudam `.gift-grid` para duas colunas. O item escolhido mantém estado textual e ação com opacidade integral; somente conteúdo decorativo e descritivo é atenuado.

- [ ] **Step 5: Executar testes, tipos e build**

Run:

```bash
npm run test:unit -- \
  src/features/catalog/gift-presentation.test.ts \
  src/features/catalog/GiftCard.test.tsx \
  src/features/catalog/CatalogPage.test.tsx
npm run typecheck
npm run build
```

Expected: todos os comandos PASS; nenhum seletor de teste procura CTA “Quero dar” no catálogo.

- [ ] **Step 6: Commit da lista editorial**

```bash
git add src/features/catalog/CategoryList.tsx \
  src/features/catalog/CatalogFilters.tsx src/features/catalog/CatalogPage.tsx \
  src/features/catalog/CatalogPage.test.tsx src/features/catalog/GiftGrid.tsx \
  src/features/catalog/GiftCard.tsx src/features/catalog/GiftCard.test.tsx \
  src/features/catalog/gift-presentation.ts \
  src/features/catalog/gift-presentation.test.ts src/styles/index.css
git commit -m "feat(catalogo): adotar lista editorial de presentes"
```

---

### Task 4: Tornar o formulário de reserva controlado e progressivo

**Files:**

- Modify: `src/features/reservations/reservation-validation.ts`
- Modify: `src/features/reservations/reservation-validation.test.ts`
- Modify: `src/features/reservations/ReservationForm.tsx`
- Modify: `src/features/reservations/ReservationForm.test.tsx`
- Modify: `src/features/catalog/GiftDetailsContent.tsx`
- Modify: `src/styles/index.css`

**Interfaces:**

- Consumes: `CatalogEntry`, `ReserveGiftInput`, `GiftVisual`, `Notice`, `Input` e `validateReservationForm()`.
- Produces:

```ts
export function createReservationFormValues(): ReservationFormValues

export interface ReservationFormProps {
  entry: CatalogEntry
  headingLevel: 'h1' | 'h2'
  values: ReservationFormValues
  contactExpanded: boolean
  notice?: ReactNode
  onValuesChange(values: ReservationFormValues): void
  onContactExpandedChange(expanded: boolean): void
  onSubmit(input: ReserveGiftInput): void
  onBack(): void
}
```

- `ReservationForm` mantém erros e foco localmente, mas não possui mais o rascunho nem chama o provider.
- `GiftDetailsContent` passa a possuir rascunho e expansão do contato; nesta tarefa ele pode manter o booleano `formOpen` atual para preservar um commit executável.

- [ ] **Step 1: Escrever testes falhando para o rascunho inicial e o formulário controlado**

Acrescente em `reservation-validation.test.ts`:

```ts
it('cria um novo rascunho válido com quantidade um', () => {
  const first = createReservationFormValues()
  const second = createReservationFormValues()

  expect(first).toEqual({ firstName: '', contact: '', quantity: 1 })
  expect(first).not.toBe(second)
})
```

Substitua `ReservationForm.test.tsx` por um harness controlado:

```tsx
import { createInitialDemoState } from '@/data/initial-state'
import { selectGiftByCode } from '@/domain/selectors'
import { renderWithApp } from '@/test/renderApp'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { ReservationForm } from './ReservationForm'
import { createReservationFormValues, type ReservationFormValues } from './reservation-validation'

function FormHarness({ code = 'CZ-001', onSubmit = vi.fn() }) {
  const entry = selectGiftByCode(createInitialDemoState(), code)
  const [values, setValues] = useState<ReservationFormValues>(createReservationFormValues)
  const [contactExpanded, setContactExpanded] = useState(false)
  if (!entry) throw new Error(`Fixture ausente: ${code}`)

  return (
    <ReservationForm
      entry={entry}
      headingLevel="h1"
      values={values}
      contactExpanded={contactExpanded}
      onValuesChange={setValues}
      onContactExpandedChange={setContactExpanded}
      onSubmit={onSubmit}
      onBack={() => undefined}
    />
  )
}

describe('ReservationForm', () => {
  it('foca e valida o primeiro nome obrigatório', async () => {
    const user = userEvent.setup()
    renderWithApp(<FormHarness />)
    const firstName = screen.getByLabelText('Seu primeiro nome')

    expect(firstName).toHaveFocus()
    await user.click(screen.getByRole('button', { name: 'Confirmar reserva' }))
    expect(firstName).toHaveFocus()
    expect(firstName).toHaveAttribute('aria-invalid', 'true')
  })

  it('revela contato opcional e oculta quantidade única', async () => {
    const user = userEvent.setup()
    renderWithApp(<FormHarness />)
    const disclosure = screen.getByRole('button', { name: 'Adicionar contato opcional' })

    expect(disclosure).toHaveAttribute('aria-expanded', 'false')
    expect(screen.queryByLabelText('Contato (opcional)')).not.toBeInTheDocument()
    expect(screen.queryByLabelText('Quantidade')).not.toBeInTheDocument()
    await user.click(disclosure)
    expect(disclosure).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByLabelText('Contato (opcional)')).toBeVisible()
  })

  it('mostra quantidade quando há escolha e envia valores válidos', async () => {
    const onSubmit = vi.fn()
    const user = userEvent.setup()
    renderWithApp(<FormHarness code="QT-002" onSubmit={onSubmit} />)

    await user.type(screen.getByLabelText('Seu primeiro nome'), 'Nina')
    await user.clear(screen.getByLabelText('Quantidade'))
    await user.type(screen.getByLabelText('Quantidade'), '2')
    await user.click(screen.getByRole('button', { name: 'Confirmar reserva' }))

    expect(onSubmit).toHaveBeenCalledWith({ itemCode: 'QT-002', firstName: 'Nina', quantity: 2 })
  })

  it('reabre e foca o contato inválido que estava recolhido', async () => {
    const user = userEvent.setup()
    renderWithApp(<FormHarness />)
    const disclosure = screen.getByRole('button', { name: 'Adicionar contato opcional' })
    await user.click(disclosure)
    await user.type(screen.getByLabelText('Contato (opcional)'), 'x'.repeat(101))
    await user.click(screen.getByRole('button', { name: 'Ocultar contato opcional' }))
    await user.type(screen.getByLabelText('Seu primeiro nome'), 'Nina')
    await user.click(screen.getByRole('button', { name: 'Confirmar reserva' }))

    expect(screen.getByLabelText('Contato (opcional)')).toHaveFocus()
    expect(screen.getByLabelText('Contato (opcional)')).toHaveAttribute('aria-invalid', 'true')
  })
})
```

- [ ] **Step 2: Executar os testes e confirmar a falha RED**

Run:

```bash
npm run test:unit -- \
  src/features/reservations/reservation-validation.test.ts \
  src/features/reservations/ReservationForm.test.tsx
```

Expected: FAIL porque o formulário ainda possui estado interno, contato e quantidade sempre visíveis e não foca na montagem.

- [ ] **Step 3: Implementar o rascunho controlado e a revelação progressiva**

Acrescente em `reservation-validation.ts`:

```ts
export function createReservationFormValues(): ReservationFormValues {
  return { firstName: '', contact: '', quantity: 1 }
}
```

Em `ReservationForm.tsx`, remova `useDemoActions` e o `initialValues` privado. Importe
`useCallback`, `useEffect`, `useId`, `useRef` e `useState`, implemente a interface produzida e use
este núcleo:

```tsx
const [errors, setErrors] = useState<ReservationFormErrors>({})
const formRef = useRef<HTMLFormElement>(null)
const contactId = useId()
const Heading = headingLevel

const focusField = useCallback((name: string) => {
  formRef.current?.querySelector<HTMLInputElement>(`[name="${name}"]`)?.focus()
}, [])

useEffect(() => {
  focusField('firstName')
}, [focusField])

useEffect(() => {
  if (contactExpanded && errors.contact) focusField('contact')
}, [contactExpanded, errors.contact, focusField])

function submit(event: FormEvent<HTMLFormElement>) {
  event.preventDefault()
  const nextErrors = validateReservationForm(values, entry.availability.remainingQuantity)
  setErrors(nextErrors)
  const firstError = (['firstName', 'contact', 'quantity'] as const).find(
    (field) => nextErrors[field],
  )
  if (firstError) {
    if (firstError === 'contact' && !contactExpanded) {
      onContactExpandedChange(true)
      return
    }
    focusField(firstError)
    return
  }

  onSubmit({
    itemCode: entry.gift.code,
    firstName: values.firstName.trim(),
    ...(values.contact.trim() ? { contact: values.contact.trim() } : {}),
    quantity: values.quantity,
  })
}
```

O JSX da fase usa exatamente esta ordem:

```tsx
<section className="reservation-form" aria-labelledby="reservation-form-title">
  <button type="button" className="reservation-form__back" onClick={onBack}>
    Ver detalhes
  </button>
  <p className="reservation-form__step">2 de 3 · Reserve</p>
  <Heading id="reservation-form-title" tabIndex={-1}>
    Reserve em seu nome
  </Heading>
  <p>Só precisamos saber quem escolheu este presente.</p>
  <div className="reservation-form__summary">
    <GiftVisual itemCode={entry.gift.code} categoryIcon={entry.category.icon} size="summary" />
    <span>
      <strong>{entry.gift.name}</strong>
      <span>{entry.availability.remainingQuantity} disponível(is)</span>
    </span>
  </div>
  {notice}
  <form ref={formRef} noValidate onSubmit={submit}>
    <Input
      label="Seu primeiro nome"
      name="firstName"
      placeholder="Como podemos chamar você?"
      value={values.firstName}
      onChange={(event) => onValuesChange({ ...values, firstName: event.target.value })}
      error={errors.firstName}
      autoComplete="given-name"
      required
    />
    <button
      type="button"
      className="reservation-form__disclosure"
      aria-expanded={contactExpanded}
      aria-controls={contactId}
      onClick={() => onContactExpandedChange(!contactExpanded)}
    >
      {contactExpanded ? 'Ocultar contato opcional' : 'Adicionar contato opcional'}
    </button>
    {contactExpanded ? (
      <div id={contactId}>
        <Input
          label="Contato (opcional)"
          name="contact"
          value={values.contact}
          onChange={(event) => onValuesChange({ ...values, contact: event.target.value })}
          error={errors.contact}
          autoComplete="email"
        />
      </div>
    ) : null}
    {entry.availability.remainingQuantity > 1 ? (
      <Input
        label="Quantidade"
        name="quantity"
        type="number"
        min={1}
        max={entry.availability.remainingQuantity}
        value={values.quantity}
        onChange={(event) => onValuesChange({ ...values, quantity: Number(event.target.value) })}
        error={errors.quantity}
        required
      />
    ) : null}
    <p className="reservation-form__privacy">Seu nome não será exibido para outras pessoas.</p>
    <Notice tone="demo">Protótipo visual: nenhuma informação é enviada ou salva.</Notice>
    <div className="reservation-form__actions">
      <Button type="submit" fullWidth>
        Confirmar reserva
      </Button>
      <Button variant="secondary" fullWidth onClick={onBack}>
        Agora não
      </Button>
    </div>
  </form>
</section>
```

Em `GiftDetailsContent`, acrescente temporariamente:

```ts
const [draft, setDraft] = useState(createReservationFormValues)
const [contactExpanded, setContactExpanded] = useState(false)
const { dismissReservationOutcome, reserveGift } = useDemoActions()
```

Passe `entry`, `headingLevel`, `draft`, expansão, setters, `reserveGift` e o retorno atual para `ReservationForm`. Essa adaptação mantém a aplicação compilável até a Task 5 substituir `formOpen` por fases exclusivas.

- [ ] **Step 4: Estilizar o formulário como uma etapa única**

Substitua o bloco atual de `.reservation-form`; não apenas acrescente declarações ao bloco com
sombra existente:

```css
.reservation-form {
  display: grid;
  gap: var(--space-4);
  max-width: 38rem;
  margin-inline: auto;
  border: 0;
  background: transparent;
  padding: 0;
  box-shadow: none;
}

.reservation-form h1,
.reservation-form h2 {
  margin: 0;
  font-family: var(--font-affective);
  font-size: clamp(1.875rem, 8vw, 2.125rem);
  letter-spacing: -0.02em;
  line-height: 1.05;
}

.reservation-form__back,
.reservation-form__disclosure {
  display: inline-flex;
  width: fit-content;
  min-width: 44px;
  min-height: 44px;
  align-items: center;
  border: 0;
  background: transparent;
  padding: 0;
  color: var(--color-terracotta-600);
  font-weight: 700;
  text-decoration: underline;
  text-underline-offset: 0.2em;
}

.reservation-form__summary {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  border: 1px solid var(--border-soft);
  border-radius: var(--radius-surface);
  padding: var(--space-3);
}

.reservation-form__summary > span,
.reservation-form__summary > span > span {
  display: grid;
}

.reservation-form form {
  display: grid;
  gap: var(--space-4);
}
```

- [ ] **Step 5: Executar testes e integração existente**

Run:

```bash
npm run test:unit -- \
  src/features/reservations/reservation-validation.test.ts \
  src/features/reservations/ReservationForm.test.tsx \
  src/features/catalog/GiftDetails.test.tsx \
  src/features/catalog/GiftDetailsPage.test.tsx
npm run typecheck
npm run build
```

Expected: todos os comandos PASS; reducer, provider e seletores permanecem inalterados.

- [ ] **Step 6: Commit do formulário progressivo**

```bash
git add src/features/reservations/reservation-validation.ts \
  src/features/reservations/reservation-validation.test.ts \
  src/features/reservations/ReservationForm.tsx \
  src/features/reservations/ReservationForm.test.tsx \
  src/features/catalog/GiftDetailsContent.tsx src/styles/index.css
git commit -m "feat(reserva): tornar formulario simples e progressivo"
```

---

### Task 5: Coordenar detalhe, reserva e confirmação em fases exclusivas

**Files:**

- Modify: `src/features/catalog/GiftDetailsContent.tsx`
- Modify: `src/features/catalog/GiftDetails.test.tsx`
- Modify: `src/features/catalog/GiftDetailsPage.test.tsx`
- Modify: `src/features/catalog/GiftDetailsDialog.tsx`
- Modify: `src/features/reservations/ReservationOutcome.tsx`
- Modify: `src/app/routes.test.tsx`
- Modify: `src/styles/index.css`

**Interfaces:**

- Consumes: formulário controlado da Task 4, `DemoActions.reserveGift`, `reservationOutcome`, `GiftVisual`, `Notice` e `backgroundLocation` existente.
- Produces: estado local interno `type GiftDetailsPhase = 'detail' | 'reservation' | 'confirmation'`.
- `ReservationOutcomeProps` passa a aceitar somente sucesso:

```ts
type SuccessfulReservationOutcome = Extract<ReservationOutcomeState, { kind: 'success' }>

export interface ReservationOutcomeProps {
  outcome: SuccessfulReservationOutcome
  giftName: string
  headingLevel: 'h1' | 'h2'
  headingRef: RefObject<HTMLHeadingElement | null>
}
```

- Não criar reducer visual, contexto, provider nem novas ações de domínio.

- [ ] **Step 1: Atualizar os testes para exigir uma fase por vez**

Em `GiftDetails.test.tsx`, preserve item inválido e referência demonstrativa e substitua os cenários de fluxo por:

```tsx
it('troca detalhe por reserva e preserva o nome ao voltar', async () => {
  const user = userEvent.setup()
  renderWithApp(<GiftDetailsPage />, { route: '/item/CZ-001', routePath: '/item/:code' })

  await user.click(screen.getByRole('button', { name: 'Quero dar este presente' }))
  expect(screen.queryByText('Nossa preferência')).not.toBeInTheDocument()
  await user.type(screen.getByLabelText('Seu primeiro nome'), 'Nina')
  await user.click(screen.getByRole('button', { name: 'Ver detalhes' }))
  expect(screen.getByText('Nossa preferência')).toBeVisible()

  await user.click(screen.getByRole('button', { name: 'Quero dar este presente' }))
  expect(screen.getByLabelText('Seu primeiro nome')).toHaveValue('Nina')
})

it('mantém conflito dentro do formulário e preserva o rascunho', async () => {
  const user = userEvent.setup()
  renderWithApp(<GiftDetailsPage />, { route: '/item/CZ-004', routePath: '/item/:code' })

  await user.click(screen.getByRole('button', { name: 'Quero dar este presente' }))
  await user.type(screen.getByLabelText('Seu primeiro nome'), 'Nina')
  await user.click(screen.getByRole('button', { name: 'Confirmar reserva' }))

  expect(screen.getByRole('alert')).toHaveTextContent('Este presente acabou de ser reservado.')
  expect(screen.getByRole('alert')).toHaveFocus()
  expect(screen.getByLabelText('Seu primeiro nome')).toHaveValue('Nina')
  expect(screen.getByRole('button', { name: 'Confirmar reserva' })).toBeVisible()
})

it('substitui o formulário pela confirmação e foca seu título', async () => {
  const user = userEvent.setup()
  renderWithApp(<GiftDetailsPage />, { route: '/item/CZ-001', routePath: '/item/:code' })

  await user.click(screen.getByRole('button', { name: 'Quero dar este presente' }))
  await user.type(screen.getByLabelText('Seu primeiro nome'), 'Nina')
  await user.click(screen.getByRole('button', { name: 'Confirmar reserva' }))

  const title = screen.getByRole('heading', { name: 'Este presente ficou com você' })
  expect(title).toHaveFocus()
  expect(screen.getByText('3 · Combine a entrega')).toBeVisible()
  expect(screen.getByRole('link', { name: 'Ver minha reserva' })).toHaveAttribute(
    'href',
    '/minha-reserva/reserva-cz-001-1',
  )
  expect(screen.queryByLabelText('Seu primeiro nome')).not.toBeInTheDocument()
  expect(screen.queryByText('Nossa preferência')).not.toBeInTheDocument()
})
```

Em `GiftDetailsPage.test.tsx`, altere os rótulos finais para “Já foi escolhido”. Em `routes.test.tsx`, troque o disparador por `Ver Chaleira`.

- [ ] **Step 2: Executar os testes e confirmar a falha RED**

Run:

```bash
npm run test:unit -- \
  src/features/catalog/GiftDetails.test.tsx \
  src/features/catalog/GiftDetailsPage.test.tsx \
  src/app/routes.test.tsx
```

Expected: FAIL porque detalhe, formulário e resultado ainda coexistem e a cópia de sucesso é antiga.

- [ ] **Step 3: Implementar o coordenador local em `GiftDetailsContent`**

Use estes estados e efeitos, mantendo `entry` e `headingLevel` como props:

```tsx
type GiftDetailsPhase = 'detail' | 'reservation' | 'confirmation'

const [phase, setPhase] = useState<GiftDetailsPhase>('detail')
const [draft, setDraft] = useState(createReservationFormValues)
const [contactExpanded, setContactExpanded] = useState(false)
const [awaitingOutcome, setAwaitingOutcome] = useState(false)
const confirmationHeadingRef = useRef<HTMLHeadingElement>(null)
const issueNoticeRef = useRef<HTMLDivElement>(null)
const outcome = useDemoSelector((state) => state.reservationOutcome)
const matchingOutcome = outcome?.itemCode === entry.gift.code ? outcome : null

useEffect(() => {
  if (!awaitingOutcome || !matchingOutcome) return
  setAwaitingOutcome(false)
  if (matchingOutcome.kind === 'success') {
    setPhase('confirmation')
    return
  }
  issueNoticeRef.current?.focus()
}, [awaitingOutcome, matchingOutcome])

useEffect(() => {
  if (phase === 'confirmation') confirmationHeadingRef.current?.focus()
}, [phase])

useEffect(
  () => () => {
    dismissReservationOutcome()
  },
  [dismissReservationOutcome],
)

function openReservation() {
  dismissReservationOutcome()
  setAwaitingOutcome(false)
  setPhase('reservation')
}

function restoreDetail() {
  dismissReservationOutcome()
  setAwaitingOutcome(false)
  setPhase('detail')
}

function submitReservation(input: ReserveGiftInput) {
  dismissReservationOutcome()
  setAwaitingOutcome(true)
  reserveGift(input)
}
```

Renderize por retornos exclusivos:

```tsx
if (phase === 'confirmation' && matchingOutcome?.kind === 'success') {
  return (
    <ReservationOutcome
      outcome={matchingOutcome}
      giftName={entry.gift.name}
      headingLevel={headingLevel}
      headingRef={confirmationHeadingRef}
    />
  )
}

if (phase === 'reservation') {
  const issue =
    matchingOutcome?.kind === 'conflict' || matchingOutcome?.kind === 'unavailable'
      ? matchingOutcome.kind
      : null
  const notice = issue ? (
    <Notice ref={issueNoticeRef} tone="error" role="alert" tabIndex={-1}>
      <strong>
        {issue === 'conflict'
          ? 'Este presente acabou de ser reservado.'
          : 'Este presente não está mais disponível.'}
      </strong>
      <p>Seu nome foi preservado. Você pode voltar à lista e escolher outro presente.</p>
      <Link to="/">Voltar para a lista</Link>
    </Notice>
  ) : undefined

  return (
    <ReservationForm
      entry={entry}
      headingLevel={headingLevel}
      values={draft}
      contactExpanded={contactExpanded}
      notice={notice}
      onValuesChange={setDraft}
      onContactExpandedChange={setContactExpanded}
      onSubmit={submitReservation}
      onBack={restoreDetail}
    />
  )
}
```

Na fase de detalhe:

- use `GiftVisual size="detail"` no lugar do Lucide de categoria;
- mostre `1 de 3 · Escolha`;
- una descrição e equivalência em um texto;
- renderize somente a primeira sugestão destacada, com texto “Ver uma referência opcional”;
- use `Notice tone="demo" role="status"` para o resultado da referência;
- use `openReservation` no único botão `primary`;
- para indisponível, use “Este presente já foi escolhido por outra pessoa.” e nenhum CTA.

Atualize os imports de `GiftDetailsContent` para incluir `Link`, `useEffect`, `useRef`,
`ReserveGiftInput`, `GiftVisual` e `Notice`; remova os Lucide de categoria e os imports que deixarem
de ser usados.

- [ ] **Step 4: Reescrever a confirmação persistente**

```tsx
// src/features/reservations/ReservationOutcome.tsx
import { Notice } from '@/components/ui/Notice'
import type { ReservationOutcome as ReservationOutcomeState } from '@/domain/types'
import type { RefObject } from 'react'
import { Link } from 'react-router'

type SuccessfulReservationOutcome = Extract<ReservationOutcomeState, { kind: 'success' }>

export interface ReservationOutcomeProps {
  outcome: SuccessfulReservationOutcome
  giftName: string
  headingLevel: 'h1' | 'h2'
  headingRef: RefObject<HTMLHeadingElement | null>
}

export function ReservationOutcome({
  giftName,
  headingLevel,
  headingRef,
  outcome,
}: ReservationOutcomeProps) {
  const Heading = headingLevel
  return (
    <section className="reservation-outcome reservation-outcome--success" aria-live="polite">
      <span className="reservation-outcome__heart" aria-hidden="true">
        💛
      </span>
      <p className="reservation-outcome__eyebrow">Reserva confirmada</p>
      <Heading ref={headingRef} tabIndex={-1}>
        Este presente ficou com você
      </Heading>
      <p>{giftName} está reservado em seu nome. Obrigado por fazer parte da nossa casa nova.</p>
      <Notice tone="success">
        <strong>3 · Combine a entrega</strong>
        <p>Agora é só combinar com a gente quando e como entregar o presente.</p>
      </Notice>
      <div className="reservation-outcome__links">
        <Link className="ui-button ui-button--primary" to={`/minha-reserva/${outcome.token}`}>
          Ver minha reserva
        </Link>
        <Link className="ui-button ui-button--secondary" to="/">
          Voltar para a lista
        </Link>
      </div>
      <p className="reservation-outcome__demo">
        Nesta demonstração, recarregar a página restaura o estado inicial.
      </p>
    </section>
  )
}
```

- [ ] **Step 5: Consolidar estilos de detalhe e fases**

Unifique os dois blocos `.gift-details` existentes em um único bloco. Use títulos serifados de 30–34 px, corpo de 16 px, uma superfície plana para preferência e sombra somente no `.ui-dialog__surface`. Defina:

```css
.gift-details-content {
  min-width: 0;
}

.gift-details,
.reservation-outcome {
  display: grid;
  max-width: 38rem;
  gap: var(--space-4);
  margin-inline: auto;
  border: 0;
  padding-block: var(--space-4);
}

.reservation-outcome--success {
  grid-template-columns: minmax(0, 1fr);
  color: inherit;
}

.gift-details__overview {
  display: flex;
  align-items: center;
  gap: var(--space-4);
}

.gift-details h1,
.gift-details h2,
.reservation-outcome h1,
.reservation-outcome h2 {
  margin: 0;
  font-family: var(--font-affective);
  font-size: clamp(1.875rem, 8vw, 2.125rem);
  letter-spacing: -0.02em;
  line-height: 1.05;
}

.gift-details__preference {
  border: 1px solid var(--border-soft);
  border-radius: var(--radius-surface);
  background: rgb(255 255 255 / 0.72);
  padding: var(--space-4);
}

.ui-dialog__surface {
  box-shadow: var(--shadow-overlay);
}

.reservation-outcome__links {
  display: grid;
  gap: var(--space-2);
  margin: 0;
}

.reservation-outcome__links .ui-button {
  text-decoration: none;
}
```

- [ ] **Step 6: Preservar rolagem e foco ao fechar o painel**

Em `GiftDetailsDialog.tsx`, capture a rolagem no mount e mantenha o id estável da Task 3:

```tsx
const originScrollY = useRef(window.scrollY)

function closeAndRestoreCatalogContext() {
  const scrollY = originScrollY.current
  navigate(-1)
  requestAnimationFrame(() => {
    window.scrollTo(0, scrollY)
    document.getElementById(`gift-card-action-${code}`)?.focus()
  })
}
```

Passe essa função a `Dialog.onClose`. Não altere `RouteEffects` enquanto o teste existente continuar provando que o retorno de diálogo não rola o catálogo para o topo.

- [ ] **Step 7: Executar a suíte do fluxo e o build**

Run:

```bash
npm run test:unit -- \
  src/features/catalog/GiftDetails.test.tsx \
  src/features/catalog/GiftDetailsPage.test.tsx \
  src/features/reservations/ReservationForm.test.tsx \
  src/app/routes.test.tsx
npm run typecheck
npm run build
```

Expected: todos os comandos PASS; os testes encontram exatamente uma fase por vez e preservam o rascunho no conflito.

- [ ] **Step 8: Commit do fluxo em três etapas**

```bash
git add src/features/catalog/GiftDetailsContent.tsx \
  src/features/catalog/GiftDetails.test.tsx \
  src/features/catalog/GiftDetailsPage.test.tsx \
  src/features/catalog/GiftDetailsDialog.tsx \
  src/features/reservations/ReservationOutcome.tsx \
  src/app/routes.test.tsx src/styles/index.css
git commit -m "feat(reserva): organizar fluxo em tres etapas"
```

---

### Task 6: Refinar o gerenciamento da reserva

**Files:**

- Modify: `src/features/reservations/ReservationSummary.tsx`
- Modify: `src/features/reservations/ManageReservationPage.tsx`
- Modify: `src/features/reservations/ManageReservationPage.test.tsx`
- Modify: `src/styles/index.css`

**Interfaces:**

- Consumes: `GiftVisual`, `Notice`, `ConfirmDialog` e ações atuais `markReservationPurchased`/`cancelReservation`.
- Produces:

```ts
export interface ReservationSummaryProps {
  reservation: DemoReservation
  gift: GiftItem
  categoryIcon: Category['icon']
}
```

- `ManageReservationPage` seleciona o `CatalogEntry` completo; disponibilidade e emoji não são duplicados na reserva.
- `ConfirmDialogProps`, reducer e transições de reserva permanecem inalterados.

- [ ] **Step 1: Escrever o teste falhando para o terceiro passo**

Acrescente ao primeiro cenário de `ManageReservationPage.test.tsx` antes de clicar em “Já comprei”:

```tsx
expect(screen.getByText('Combine a entrega')).toBeVisible()
expect(screen.getByText(/quando estiver com o presente, combine com a gente/i)).toBeVisible()
expect(screen.getByRole('button', { name: 'Já comprei' })).toBeVisible()
expect(screen.getByRole('button', { name: 'Cancelar minha reserva' })).toBeVisible()
```

Acrescente um teste de composição:

```tsx
it('mostra o presente reservado com contexto afetivo e estado textual', () => {
  renderReservation('reserva-demo-valida')

  expect(screen.getByText('Minha reserva')).toBeVisible()
  expect(screen.getByRole('heading', { name: 'Tudo certo com seu presente' })).toBeVisible()
  expect(screen.getByText('Cesto de roupas')).toBeVisible()
  expect(screen.getByRole('status', { name: 'Estado da reserva' })).toHaveTextContent(
    'Reserva ativa',
  )
})
```

- [ ] **Step 2: Executar o teste e confirmar a falha RED**

Run:

```bash
npm run test:unit -- src/features/reservations/ManageReservationPage.test.tsx
```

Expected: FAIL porque o título e o bloco “Combine a entrega” ainda não existem.

- [ ] **Step 3: Implementar a hierarquia afetiva sem alterar ações**

Em `ReservationSummary`, preserve `statusPresentation` e o `forwardRef`, mas use esta estrutura principal:

```tsx
<section className="reservation-summary" aria-labelledby="reservation-summary-title">
  <p className="reservation-summary__eyebrow">Minha reserva</p>
  <h1 id="reservation-summary-title" tabIndex={-1}>
    Tudo certo com seu presente
  </h1>
  <div className="reservation-summary__gift">
    <GiftVisual itemCode={gift.code} categoryIcon={categoryIcon} size="summary" />
    <div>
      <strong>{gift.name}</strong>
      <p>
        {reservation.quantity === 1
          ? '1 unidade reservada em seu nome.'
          : `${reservation.quantity} unidades reservadas em seu nome.`}
      </p>
    </div>
  </div>
  <div className="reservation-summary__state" role="status" aria-label="Estado da reserva">
    <StatusIcon aria-hidden="true" />
    <div>
      <h2 ref={ref} tabIndex={-1}>
        Estado da reserva
      </h2>
      <Badge tone={presentation.tone}>{presentation.label}</Badge>
      <p>{presentation.description}</p>
    </div>
  </div>
  {reservation.status === 'reserved' ? (
    <Notice tone="success" className="reservation-summary__next">
      <strong>Combine a entrega</strong>
      <p>Quando estiver com o presente, combine com a gente a melhor forma de entregar.</p>
    </Notice>
  ) : null}
</section>
```

Como `GiftItem` contém apenas `categoryId`, `ManageReservationPage` deve selecionar o `CatalogEntry`
completo e passar `entry.gift` e `entry.category.icon` a `ReservationSummary`. Substitua o seletor
local de `gift` por:

```tsx
const entry = useDemoSelector((state) =>
  reservation ? selectGiftByCode(state, reservation.itemCode) : undefined,
)
```

Use `!reservation || !entry` na guarda, `entry.gift.name` na confirmação e:

```tsx
<ReservationSummary
  ref={stateTitleRef}
  reservation={reservation}
  gift={entry.gift}
  categoryIcon={entry.category.icon}
/>
```

Atualize a interface e o teste com o tipo exato acima; não grave emoji ou disponibilidade na
reserva.

Mantenha o novo estado persistente dentro de `ReservationSummary`; o toast atual pode reforçar
compra ou cancelamento, mas não substitui o texto focado na página. Preserve o diálogo de
cancelamento e a mudança de foco já cobertos.

- [ ] **Step 4: Aplicar superfícies planas e ações hierarquizadas**

```css
.manage-reservation,
.reservation-summary {
  display: grid;
  gap: var(--space-4);
}

.reservation-summary h1 {
  margin: 0;
  font-family: var(--font-affective);
  font-size: clamp(1.875rem, 8vw, 2.125rem);
  letter-spacing: -0.02em;
}

.reservation-summary__gift,
.reservation-summary__state {
  display: flex;
  align-items: flex-start;
  gap: var(--space-3);
  border: 1px solid var(--border-soft);
  border-radius: var(--radius-surface);
  background: rgb(255 255 255 / 0.72);
  padding: var(--space-4);
  box-shadow: none;
}
```

- [ ] **Step 5: Executar testes relevantes e build**

Run:

```bash
npm run test:unit -- \
  src/features/reservations/ManageReservationPage.test.tsx \
  src/components/ui/ConfirmDialog.test.tsx \
  src/domain/demo-reducer.test.ts \
  src/domain/selectors.test.ts
npm run typecheck
npm run build
```

Expected: todos os comandos PASS e nenhuma mudança no contrato do reducer ou da disponibilidade.

- [ ] **Step 6: Commit do gerenciamento delicado**

```bash
git add src/features/reservations/ReservationSummary.tsx \
  src/features/reservations/ManageReservationPage.tsx \
  src/features/reservations/ManageReservationPage.test.tsx src/styles/index.css
git commit -m "feat(reserva): destacar entrega no gerenciamento"
```

---

### Task 7: Rebaixar Pix para alternativa afetiva e demonstrativa

**Files:**

- Modify: `src/features/pix/PixPage.tsx`
- Modify: `src/features/pix/PixPage.test.tsx`
- Modify: `src/app/routes.test.tsx`
- Modify: `src/styles/index.css`

**Interfaces:**

- Consumes: `Notice`, `Card variant="flat"`, `IllustrativeQr`, settings Pix fictícios e toast existente.
- Produces: nenhum contrato novo; `PixPage()` continua sendo a rota `#/pix`.
- A Clipboard API permanece proibida; o botão usa variante `secondary`.

- [ ] **Step 1: Escrever o teste falhando para a nova composição**

Substitua o primeiro teste de `PixPage.test.tsx` por:

```tsx
it('apresenta Pix como outra forma demonstrativa de presentear', () => {
  renderWithApp(<PixPage />, { route: '/pix' })

  expect(screen.getByText(/outra forma de presentear/i)).toBeVisible()
  expect(screen.getByRole('heading', { name: 'Contribuir por Pix' })).toBeVisible()
  const details = screen.getByRole('region', { name: 'Dados Pix demonstrativos' })
  expect(details).toHaveTextContent('DEMO-PIX-NAO-UTILIZAR-0002016304ABCD')
  expect(details).toHaveTextContent('Marina e Rafael — demonstração')
  expect(details).toHaveTextContent('Banco Fictício')
  expect(within(details).getByRole('img', { name: /qr code ilustrativo/i })).toBeVisible()

  const notice = screen.getByText(/nenhuma transferência é processada/i)
  const action = screen.getByRole('button', { name: 'Simular cópia' })
  expect(notice.compareDocumentPosition(action) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
  expect(action).toHaveClass('ui-button--secondary')
})
```

Mantenha o teste da Clipboard API e acrescente:

```tsx
expect(screen.getByRole('status', { name: 'Resultado da cópia' })).toHaveTextContent(
  'Cópia simulada: nenhum dado foi copiado.',
)
```

Importe `within` de Testing Library.

- [ ] **Step 2: Executar o teste e confirmar a falha RED**

Run:

```bash
npm run test:unit -- src/features/pix/PixPage.test.tsx src/app/routes.test.tsx
```

Expected: FAIL porque chave e QR estão separados, a ação ainda é primária e os avisos não usam `Notice`.

- [ ] **Step 3: Implementar a composição compacta de Pix**

Mantenha `simulateCopy()` sem chamar `navigator.clipboard` e use esta estrutura dentro de `AppShell`:

```tsx
<section className="pix-page" aria-labelledby="pix-title">
  <Link className="pix-page__back" to="/">
    Nossa lista
  </Link>
  <p className="pix-page__eyebrow">
    Outra forma de presentear <span aria-hidden="true">✨</span>
  </p>
  <h1 id="pix-title" tabIndex={-1}>
    Contribuir por Pix
  </h1>
  <p className="pix-page__intro">
    Se preferir, qualquer valor ajuda nos planos para o nosso novo lar.
  </p>
  <Card variant="flat" className="pix-page__card">
    <section aria-label="Dados Pix demonstrativos">
      <p className="pix-page__label">Chave demonstrativa</p>
      <strong>Pix Copia e Cola</strong>
      <code>{pix.copyAndPaste}</code>
      <div className="pix-page__meta">
        <dl>
          <div>
            <dt>Destinatário</dt>
            <dd>{pix.recipient}</dd>
          </div>
          <div>
            <dt>Instituição</dt>
            <dd>{pix.institution}</dd>
          </div>
        </dl>
        <IllustrativeQr label="QR Code ilustrativo" />
      </div>
    </section>
  </Card>
  <Notice tone="demo" icon={<Info size={20} />}>
    Demonstração visual: nenhuma transferência é processada e nada é copiado.
  </Notice>
  <Button variant="secondary" fullWidth onClick={simulateCopy}>
    Simular cópia
  </Button>
  {copySimulated ? (
    <Notice
      tone="success"
      role="status"
      aria-label="Resultado da cópia"
      icon={<CheckCircle2 size={20} />}
    >
      Cópia simulada: nenhum dado foi copiado.
    </Notice>
  ) : null}
</section>
```

Remova o `<label>` em torno do `<code>`; “Chave demonstrativa” e “Pix Copia e Cola” fornecem contexto sem rotular texto estático como controle.

- [ ] **Step 4: Aplicar hierarquia editorial e superfície plana**

```css
.pix-page {
  display: grid;
  width: min(100%, 38rem);
  gap: var(--space-4);
  margin-inline: auto;
}

.pix-page__eyebrow,
.pix-page__label {
  margin: 0;
  color: var(--color-terracotta-600);
  font-size: 0.875rem;
  font-weight: 750;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.pix-page h1 {
  margin: 0;
  font-family: var(--font-affective);
  font-size: clamp(1.875rem, 8vw, 2.125rem);
  letter-spacing: -0.02em;
}

.pix-page__card {
  display: grid;
  gap: var(--space-3);
  padding: var(--space-4);
}

.pix-page__card section,
.pix-page__meta,
.pix-page__meta dl {
  display: grid;
  gap: var(--space-3);
}

.pix-page__card code {
  overflow-wrap: anywhere;
  border-radius: var(--radius-control);
  background: var(--color-sand-50);
  padding: var(--space-3);
}

@media (min-width: 480px) {
  .pix-page__meta {
    grid-template-columns: minmax(0, 1fr) auto;
    align-items: end;
  }
}
```

- [ ] **Step 5: Executar testes e build**

Run:

```bash
npm run test:unit -- src/features/pix/PixPage.test.tsx src/app/routes.test.tsx
npm run typecheck
npm run build
```

Expected: todos os comandos PASS; nenhuma Clipboard API, URL ou payload real é usado.

- [ ] **Step 6: Commit da alternativa Pix**

```bash
git add src/features/pix/PixPage.tsx src/features/pix/PixPage.test.tsx \
  src/app/routes.test.tsx src/styles/index.css
git commit -m "feat(pix): apresentar contribuicao como alternativa afetiva"
```

---

### Task 8: Manter coleções como rota secundária

**Files:**

- Modify: `src/features/collections/CollectionPage.tsx`
- Modify: `src/features/collections/CollectionPage.test.tsx`
- Modify: `src/features/catalog/CatalogPage.test.tsx`
- Modify: `src/styles/index.css`

**Interfaces:**

- Consumes: rota, fixtures e seletor de coleção atuais, `Notice`, `Card` e `Button`.
- Produces: nenhum contrato novo; slug válido, slug inválido e URLs fictícias permanecem iguais.
- Nenhuma ação de referência recebe `href` ou variante `primary`.

- [ ] **Step 1: Escrever testes falhando para o baixo peso comercial**

Atualize o primeiro cenário de `CollectionPage.test.tsx`:

```tsx
it('preserva a rota como referência secundária sem CTA comercial', () => {
  renderCollection('sugestoes-cozinha')

  expect(screen.getByRole('heading', { name: 'Sugestões para a cozinha' })).toBeVisible()
  const notice = screen.getByText(/endereços desta tela são fictícios/i)
  const actions = screen.getAllByRole('button', { name: /ver referência/i })
  expect(actions.length).toBeGreaterThan(0)
  for (const action of actions) {
    expect(action).not.toHaveAttribute('href')
    expect(action).toHaveClass('ui-button--ghost')
    expect(action).not.toHaveClass('ui-button--primary')
  }
  expect(notice.compareDocumentPosition(actions[0]) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
})
```

Atualize o cenário de feedback para exigir `role="status"`. Acrescente em `CatalogPage.test.tsx`:

```tsx
it('não promove coleções como destino do catálogo', () => {
  renderWithApp(<CatalogPage />)
  expect(document.querySelector('a[href^="/colecao/"]')).not.toBeInTheDocument()
})
```

- [ ] **Step 2: Executar testes e confirmar a falha RED**

Run:

```bash
npm run test:unit -- \
  src/features/collections/CollectionPage.test.tsx \
  src/features/catalog/CatalogPage.test.tsx
```

Expected: FAIL porque as ações ainda são `secondary`, repetem linguagem de sugestão e o feedback não usa `Notice`.

- [ ] **Step 3: Implementar lista plana de referências demonstrativas**

Mantenha as guardas de coleção/categoria e `selectSuggestion()`. Substitua aviso, lista e feedback por:

```tsx
<Notice tone="demo">
  Todos os endereços desta tela são fictícios. Nenhum site externo será aberto.
</Notice>
<div className="collection-page__gifts" aria-label="Referências demonstrativas">
  {gifts.map((gift) => (
    <Card key={gift.code} variant="flat" className="collection-page__gift">
      <article>
        <div>
          <h2>{gift.name}</h2>
          <p>{gift.description}</p>
        </div>
        {gift.suggestions.map((suggestion) => (
          <Button
            key={suggestion.id}
            variant="ghost"
            fullWidth
            onClick={() => selectSuggestion(suggestion.label)}
          >
            Ver referência: {suggestion.label}
          </Button>
        ))}
      </article>
    </Card>
  ))}
</div>
{selectedSuggestion ? (
  <Notice tone="demo" role="status">
    Referência selecionada: {selectedSuggestion}. Nenhum site externo foi aberto.
  </Notice>
) : null}
```

Não modifique `collections.ts`, `selectors.ts` nem `routes.tsx`.

- [ ] **Step 4: Remover aparência de vitrine**

```css
.collection-page__gifts {
  display: grid;
  gap: var(--space-3);
}

.collection-page__gift {
  padding: 0;
  box-shadow: none;
}

.collection-page__gift article {
  display: grid;
  gap: var(--space-3);
  padding: var(--space-4);
}

.collection-page__gift h2,
.collection-page__gift p {
  margin: 0;
}

.collection-page h1 {
  font-family: var(--font-affective);
  font-size: clamp(1.875rem, 8vw, 2.125rem);
  letter-spacing: -0.02em;
}

.collection-page__gift .ui-button {
  justify-content: flex-start;
  text-align: left;
}
```

- [ ] **Step 5: Executar testes relevantes**

Run:

```bash
npm run test:unit -- \
  src/features/collections/CollectionPage.test.tsx \
  src/features/catalog/CatalogPage.test.tsx \
  src/app/routes.test.tsx
npm run typecheck
npm run build
```

Expected: todos os comandos PASS e a rota profunda continua navegável.

- [ ] **Step 6: Commit da rota secundária**

```bash
git add src/features/collections/CollectionPage.tsx \
  src/features/collections/CollectionPage.test.tsx \
  src/features/catalog/CatalogPage.test.tsx src/styles/index.css
git commit -m "refactor(colecoes): reduzir peso comercial das referencias"
```

---

### Task 9: Exibir uma miniatura A4 proporcional e acessível

**Files:**

- Create: `src/features/pdf/ScaledPrintablePreview.tsx`
- Create: `src/features/pdf/ScaledPrintablePreview.test.tsx`
- Modify: `src/features/pdf/PdfPreviewPage.tsx`
- Modify: `src/features/pdf/PdfPreviewPage.test.tsx`
- Modify: `src/features/pdf/PrintableGiftList.tsx`
- Modify: `src/features/pdf/print.css`

**Interfaces:**

- Consumes: `PrintableGiftListProps`, `Notice`, filtros e download simulado atuais.
- Produces:

```ts
export const printableWidth = 794
export const printableHeight = 1123
export function getPrintableScale(frameWidth: number): number
export function ScaledPrintablePreview(props: PrintableGiftListProps): JSX.Element
```

- `PrintableGiftListProps` e a tabela semântica permanecem inalterados.
- `ResizeObserver` apenas recalcula escala; o fallback usa `window.resize` e não falha em jsdom.

- [ ] **Step 1: Escrever testes falhando para escala e resumo legível**

```tsx
// src/features/pdf/ScaledPrintablePreview.test.tsx
import { createInitialDemoState } from '@/data/initial-state'
import { selectCatalogEntries } from '@/domain/selectors'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import {
  ScaledPrintablePreview,
  getPrintableScale,
  printableHeight,
  printableWidth,
} from './ScaledPrintablePreview'

describe('ScaledPrintablePreview', () => {
  it('limita a escala entre zero e um', () => {
    expect(getPrintableScale(397)).toBeCloseTo(0.5)
    expect(getPrintableScale(794)).toBe(1)
    expect(getPrintableScale(1200)).toBe(1)
    expect(getPrintableScale(-10)).toBe(0)
    expect(printableHeight / printableWidth).toBeCloseTo(297 / 210, 2)
  })

  it('preserva a tabela semântica sem ResizeObserver', () => {
    const state = createInitialDemoState()
    const entries = selectCatalogEntries(state, {
      query: '',
      categorySlug: null,
      availableOnly: false,
    })
    render(<ScaledPrintablePreview entries={entries} settings={state.settings} />)
    expect(screen.getByRole('table', { name: 'Presentes da lista' })).toBeVisible()
    expect(screen.getByRole('columnheader', { name: 'Nome/assinatura' })).toBeVisible()
  })
})
```

Em `PdfPreviewPage.test.tsx`, acrescente:

```tsx
expect(screen.getByRole('status', { name: 'Resumo da prévia' })).toHaveTextContent(
  '11 ideias na prévia',
)
expect(screen.getByRole('table', { name: 'Presentes da lista' })).toBeVisible()
expect(screen.getAllByText('Já foi escolhido').length).toBeGreaterThan(0)
expect(screen.queryByText('Indisponível')).not.toBeInTheDocument()
await user.click(screen.getByRole('button', { name: 'Disponíveis' }))
expect(screen.getByRole('status', { name: 'Resumo da prévia' })).toHaveTextContent(
  '8 ideias na prévia',
)
expect(screen.queryByText('Já foi escolhido')).not.toBeInTheDocument()
```

- [ ] **Step 2: Executar testes e confirmar a falha RED**

Run:

```bash
npm run test:unit -- \
  src/features/pdf/ScaledPrintablePreview.test.tsx \
  src/features/pdf/PdfPreviewPage.test.tsx
```

Expected: FAIL porque moldura, escala e resumo não existem e o CSS móvel transforma a tabela em cartões.

- [ ] **Step 3: Implementar a moldura proporcional**

```tsx
// src/features/pdf/ScaledPrintablePreview.tsx
import { useLayoutEffect, useRef, useState } from 'react'
import { PrintableGiftList, type PrintableGiftListProps } from './PrintableGiftList'

export const printableWidth = 794
export const printableHeight = 1123

export function getPrintableScale(frameWidth: number) {
  return Math.min(1, Math.max(0, frameWidth) / printableWidth)
}

export function ScaledPrintablePreview(props: PrintableGiftListProps) {
  const frameRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)

  useLayoutEffect(() => {
    const frame = frameRef.current
    if (!frame) return
    const update = () => {
      if (frame.clientWidth > 0) setScale(getPrintableScale(frame.clientWidth))
    }
    update()
    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', update)
      return () => window.removeEventListener('resize', update)
    }
    const observer = new ResizeObserver(update)
    observer.observe(frame)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={frameRef} className="printable-sheet-frame">
      <div
        className="printable-sheet-sizer"
        style={{
          width: `${printableWidth * scale}px`,
          height: `${printableHeight * scale}px`,
        }}
      >
        <div
          className="printable-sheet-canvas"
          style={{
            width: `${printableWidth}px`,
            height: `${printableHeight}px`,
            transform: `scale(${scale})`,
          }}
        >
          <PrintableGiftList {...props} />
        </div>
      </div>
    </div>
  )
}
```

Em `PdfPreviewPage`, troque `PrintableGiftList` por `ScaledPrintablePreview` e insira antes da moldura:

```tsx
<p className="pdf-preview__summary" role="status" aria-label="Resumo da prévia">
  {entries.length === 1 ? '1 ideia na prévia.' : `${entries.length} ideias na prévia.`}{' '}
  <Link to="/">Consulte a lista principal para ler e reservar.</Link>
</p>
```

Troque aviso e feedback por `Notice`; o feedback de download mantém `role="status"` e o botão não chama `URL.createObjectURL` nem `window.print`.

Em `PrintableGiftList`, remova `availabilityLabel()` e reutilize a apresentação pública já
testada:

```tsx
import { getGiftAvailabilityPresentation } from '@/features/catalog/gift-presentation'

;<td data-label="Disponibilidade">{getGiftAvailabilityPresentation(entry.availability).label}</td>
```

- [ ] **Step 4: Preservar A4 intrínseco e remover cartões móveis**

Em `print.css`, remova toda a media query que converte `table`, `tbody`, `tr`, `th` e `td` para `display: block`. Use:

```css
.printable-sheet-frame {
  width: min(100%, 794px);
  min-width: 0;
  margin-inline: auto;
  overflow: hidden;
}

.pdf-preview h1 {
  font-family: var(--font-affective);
  font-size: clamp(1.875rem, 8vw, 2.125rem);
  letter-spacing: -0.02em;
}

.printable-sheet-sizer {
  position: relative;
  max-width: 100%;
  overflow: hidden;
}

.printable-sheet-canvas {
  transform-origin: top left;
}

.printable-sheet {
  display: grid;
  width: 794px;
  height: 1123px;
  align-content: start;
  gap: 1.5rem;
  overflow: hidden;
  border: 1px solid var(--border-soft);
  background: white;
  padding: 3rem;
  box-shadow: none;
}

@media print {
  .printable-sheet-frame,
  .printable-sheet-sizer,
  .printable-sheet-canvas {
    width: 210mm !important;
    height: 297mm !important;
    overflow: visible;
    transform: none !important;
  }

  .printable-sheet {
    width: 210mm;
    height: 297mm;
    border: 0;
    box-shadow: none;
  }
}
```

Mantenha caption, `thead`, cabeçalhos e células de `PrintableGiftList` como tabela real em todos os viewports.

- [ ] **Step 5: Executar testes, tipos e build**

Run:

```bash
npm run test:unit -- \
  src/features/pdf/ScaledPrintablePreview.test.tsx \
  src/features/pdf/PdfPreviewPage.test.tsx
npm run typecheck
npm run build
```

Expected: todos os comandos PASS; a tabela permanece consultável semanticamente e nenhum arquivo é gerado.

- [ ] **Step 6: Commit da prévia proporcional**

```bash
git add src/features/pdf/ScaledPrintablePreview.tsx \
  src/features/pdf/ScaledPrintablePreview.test.tsx \
  src/features/pdf/PdfPreviewPage.tsx src/features/pdf/PdfPreviewPage.test.tsx \
  src/features/pdf/PrintableGiftList.tsx src/features/pdf/print.css
git commit -m "feat(pdf): preservar miniatura a4 proporcional"
```

---

### Task 10: Refinar administração, navegação e foco

**Files:**

- Modify: `src/features/admin/AdminDashboard.tsx`
- Modify: `src/features/admin/AdminPage.test.tsx`
- Modify: `src/features/admin/AdminSummary.tsx`
- Modify: `src/features/admin/AdminGiftList.tsx`
- Modify: `src/features/admin/AdminReservations.tsx`
- Modify: `src/features/admin/SiteSettingsForm.tsx`
- Modify: `src/features/admin/AdminLogin.tsx`
- Modify: `src/features/admin/AdminReservations.test.tsx`
- Modify: `src/features/admin/SiteSettingsForm.test.tsx`
- Modify: `src/test/setup.ts`
- Modify: `src/styles/index.css`

**Interfaces:**

- Consumes: seções e ações administrativas atuais, `Notice`, Lucide, `ConfirmDialog` e estado em memória.
- Produces: tipo interno `AdminSectionId = (typeof sectionLinks)[number]['id']`; nenhum contrato exportado novo.
- Cada título alvo usa `tabIndex={-1}`; somente o botão ativo usa `aria-current="location"`.

- [ ] **Step 1: Escrever testes falhando para salto, foco e estado ativo**

Acrescente a `AdminPage.test.tsx`:

```tsx
it('indica a seção ativa e move foco sem criar abas', async () => {
  const user = userEvent.setup()
  renderWithApp(<AdminPage />, { route: '/admin' })
  await user.click(screen.getByRole('button', { name: 'Entrar na demonstração' }))

  const giftsButton = screen.getByRole('button', { name: 'Presentes' })
  await user.click(giftsButton)
  expect(giftsButton).toHaveAttribute('aria-current', 'location')
  expect(screen.getByRole('heading', { name: 'Presentes da lista' })).toHaveFocus()
  expect(screen.getByRole('heading', { name: 'Reservas' })).toBeInTheDocument()
  expect(screen.getByRole('heading', { name: 'Configurações da lista' })).toBeInTheDocument()

  const reservationsButton = screen.getByRole('button', { name: 'Reservas' })
  await user.click(reservationsButton)
  expect(giftsButton).not.toHaveAttribute('aria-current')
  expect(reservationsButton).toHaveAttribute('aria-current', 'location')
  expect(screen.getByRole('heading', { name: 'Reservas' })).toHaveFocus()
})
```

Preserve integralmente os testes existentes de confirmação de liberação, descarte, transições válidas e disponibilidade derivada.

- [ ] **Step 2: Executar os testes e confirmar a falha RED**

Run:

```bash
npm run test:unit -- \
  src/features/admin/AdminPage.test.tsx \
  src/features/admin/AdminReservations.test.tsx \
  src/features/admin/SiteSettingsForm.test.tsx
```

Expected: FAIL porque a navegação não possui estado ativo e `moveToSection()` não move foco.

- [ ] **Step 3: Implementar navegação de salto com movimento reduzido**

Acrescente ao setup de testes o método de layout ausente no jsdom:

```ts
Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', {
  configurable: true,
  value: vi.fn(),
})
```

Em `AdminDashboard.tsx`, acrescente:

```tsx
type AdminSectionId = (typeof sectionLinks)[number]['id']

const [activeSectionId, setActiveSectionId] = useState<AdminSectionId>('admin-dashboard-title')

function moveToSection(id: AdminSectionId) {
  const heading = document.getElementById(id)
  if (!heading) return
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  setActiveSectionId(id)
  heading.scrollIntoView({ block: 'start', behavior: reducedMotion ? 'auto' : 'smooth' })
  heading.focus({ preventScroll: true })
}
```

Nos botões de `sectionLinks`, use:

```tsx
aria-current={activeSectionId === id ? 'location' : undefined}
```

Adicione `tabIndex={-1}` aos títulos `admin-gifts-title`, `admin-reservations-title` e `site-settings-title`. Migre:

- aviso de modo do dashboard para `Notice tone="demo"`;
- feedback de `AdminReservations` para `Notice tone="success" role="status"`;
- feedback de `SiteSettingsForm` para `Notice tone="success" role="status"`;
- “Salvar alterações” de `SiteSettingsForm` para `Button variant="secondary"`;
- painel do login para `Card variant="flat"`.

Não modifique `ConfirmDialog`, `demoReducer` ou `selectAdminSummary`.

- [ ] **Step 4: Aplicar layout sóbrio mobile/desktop**

```css
.admin-summary__card,
.admin-panel,
.admin-reservation,
.admin-gift-list__item {
  border: 1px solid var(--border-soft);
  background: rgb(255 255 255 / 0.72);
  box-shadow: none;
}

.admin-dashboard h1,
.admin-panel h2,
.admin-login h1 {
  font-family: var(--font-affective);
  font-size: clamp(1.875rem, 4vw, 2.125rem);
  letter-spacing: -0.02em;
  line-height: 1.05;
}

.admin-shell__nav {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--space-2);
}

.admin-shell__nav button {
  min-width: 44px;
  min-height: 44px;
  border: 1px solid var(--border-soft);
  border-radius: var(--radius-control);
  background: white;
}

.admin-shell__nav button[aria-current='location'] {
  border-color: rgb(169 79 52 / 0.34);
  background: var(--accent-muted);
  color: var(--color-terracotta-600);
}

@media (min-width: 900px) {
  .admin-shell {
    display: grid;
    grid-template-columns: 14rem minmax(0, 1fr);
  }

  .admin-shell__sidebar {
    position: sticky;
    top: 0;
    min-height: 100dvh;
  }

  .admin-shell__nav {
    grid-template-columns: minmax(0, 1fr);
  }
}
```

Mantenha a ordem DOM Resumo → Presentes → Reservas → Configurações. Em 1200 px, somente o grid visual de operações pode mudar.

- [ ] **Step 5: Executar testes administrativos e build**

Run:

```bash
npm run test:unit -- \
  src/features/admin/AdminPage.test.tsx \
  src/features/admin/AdminReservations.test.tsx \
  src/features/admin/SiteSettingsForm.test.tsx \
  src/domain/demo-reducer.test.ts \
  src/domain/selectors.test.ts
npm run typecheck
npm run build
```

Expected: todos os comandos PASS; liberação continua confirmada e disponibilidade continua derivada.

- [ ] **Step 6: Commit do painel sóbrio**

```bash
git add src/features/admin/AdminDashboard.tsx src/features/admin/AdminPage.test.tsx \
  src/features/admin/AdminSummary.tsx src/features/admin/AdminGiftList.tsx \
  src/features/admin/AdminReservations.tsx src/features/admin/SiteSettingsForm.tsx \
  src/features/admin/AdminLogin.tsx src/features/admin/AdminReservations.test.tsx \
  src/features/admin/SiteSettingsForm.test.tsx src/test/setup.ts src/styles/index.css
git commit -m "feat(admin): refinar navegacao e hierarquia visual"
```

---

### Task 11: Tornar as guardas E2E automáticas e separar os projetos canônicos

**Files:**

- Modify: `playwright.config.ts`
- Modify: `e2e/support/test.ts`
- Modify: `e2e/support/assertions.ts`
- Create: `e2e/support/flows.ts`
- Modify: `e2e/catalog.mobile.spec.ts`
- Modify: `e2e/keyboard.spec.ts`
- Modify: `e2e/reservation.spec.ts`
- Modify: `e2e/reservation-management.spec.ts`
- Modify: `e2e/pix-pdf.spec.ts`
- Modify: `e2e/admin.spec.ts`
- Temporary create/delete: `e2e/prototype-boundary.probe.spec.ts`

**Interfaces:**

- Consumes: `baseURL`, `BrowserContext`, `Page`, `Locator`, `AxeBuilder` e as fixtures Playwright atuais.
- Produces:

```ts
export interface AxeAllowlistEntry {
  ruleId: string
  target: string
  reason: string
}

export async function expectNoAccessibilityViolations(
  page: Page,
  allowlist?: readonly AxeAllowlistEntry[],
): Promise<void>
export async function expectMinimumTouchTarget(locator: Locator): Promise<void>
export async function expectComputedFocusVisible(locator: Locator): Promise<void>
export async function expectNoHorizontalClipping(locator: Locator): Promise<void>
export async function expectHorizontalScrollContained(page: Page, scroller: Locator): Promise<void>
export async function expectSingleEditorialColumn(items: Locator): Promise<void>
export async function expectReducedMotionApplied(page: Page): Promise<void>

export async function openGiftDetails(page: Page, giftName?: string): Promise<Locator>
export async function openReservationForm(page: Page, giftName?: string): Promise<Locator>
export async function reserveGiftFromCatalog(
  page: Page,
  options?: { giftName?: string; firstName?: string },
): Promise<Locator>
export async function unlockDemoAdmin(page: Page): Promise<void>
```

- `runtimeIssueGuard` continua automático.
- A nova fixture automática bloqueia e relata qualquer chamada funcional, método mutável,
  origem externa, WebSocket ou acesso às APIs de armazenamento.
- Requisições `GET`/`HEAD` para documentos, scripts, CSS, imagens e fontes da própria origem
  continuam permitidas para carregar o protótipo.

- [ ] **Step 1: Criar uma sonda temporária que caracteriza a ausência das guardas globais**

```ts
// e2e/prototype-boundary.probe.spec.ts
import { test } from './support/test.js'

test('sonda temporária de efeitos proibidos', async ({ page }) => {
  await page.goto('./#/')
  await page.evaluate(async () => {
    localStorage.getItem('probe')
    await fetch(window.location.href).catch(() => undefined)
  })
})
```

Run:

```bash
npm run build
npm run test:e2e:ci -- --project=mobile-chromium e2e/prototype-boundary.probe.spec.ts
```

Expected: PASS no estado atual, documentando que a fixture compartilhada ainda não detecta
armazenamento nem `fetch` quando o teste não instala guardas manualmente.

- [ ] **Step 2: Configurar projetos funcionais, de layout e de imagem**

Substitua `playwright.config.ts` por esta matriz, preservando `webServer`:

```ts
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  failOnFlakyTests: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: [['list'], ['html', { open: 'never' }]],
  snapshotPathTemplate: '{testDir}/__screenshots__/{testFilePath}/{projectName}/{arg}{ext}',
  expect: {
    toHaveScreenshot: {
      animations: 'disabled',
      caret: 'hide',
      scale: 'css',
      maxDiffPixelRatio: 0.01,
    },
  },
  use: {
    baseURL: 'http://127.0.0.1:4173/lista-casa-nova/',
    locale: 'pt-BR',
    timezoneId: 'America/Bahia',
    colorScheme: 'light',
    reducedMotion: 'reduce',
    serviceWorkers: 'block',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'mobile-chromium',
      grepInvert: /@(desktop|layout|a11y|visual-mobile|visual-desktop)/,
      use: { ...devices['Pixel 7'], viewport: { width: 360, height: 800 } },
    },
    {
      name: 'mobile-webkit',
      grep: /@canonical/,
      use: { ...devices['iPhone 13'], viewport: { width: 390, height: 844 } },
    },
    {
      name: 'desktop-chromium',
      grep: /@(desktop|canonical)/,
      use: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 900 } },
    },
    {
      name: 'layout-chromium',
      grep: /@layout/,
      use: { ...devices['Desktop Chrome'], viewport: { width: 360, height: 800 } },
    },
    {
      name: 'a11y-chromium',
      grep: /@a11y/,
      use: { ...devices['Desktop Chrome'], viewport: { width: 360, height: 800 } },
    },
    {
      name: 'visual-mobile-chromium',
      grep: /@visual-mobile/,
      ignoreSnapshots: process.platform !== 'linux',
      use: { ...devices['Pixel 7'], viewport: { width: 360, height: 800 } },
    },
    {
      name: 'visual-desktop-chromium',
      grep: /@visual-desktop/,
      ignoreSnapshots: process.platform !== 'linux',
      use: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 900 } },
    },
  ],
  webServer: {
    command: 'npm run preview -- --host 127.0.0.1 --port 4173',
    url: 'http://127.0.0.1:4173/lista-casa-nova/',
    reuseExistingServer: !process.env.CI,
  },
})
```

Não use `contextOptions` para `reducedMotion`; a opção tipada fica diretamente em `use`.

- [ ] **Step 3: Implementar a fronteira automática de runtime, rede e armazenamento**

Mantenha o coletor atual de console e `pageerror` e acrescente a segunda fixture automática em
`e2e/support/test.ts`:

```ts
/// <reference lib="dom" />

import { expect, test as base } from '@playwright/test'

type RuntimeIssue = {
  kind: 'console.error' | 'console.warn' | 'pageerror'
  message: string
}

type PrototypeSideEffect = {
  kind: 'network' | 'storage' | 'websocket'
  detail: string
}

declare global {
  interface Window {
    __recordPrototypeSideEffect?: (
      kind: PrototypeSideEffect['kind'],
      detail: string,
    ) => Promise<void>
  }
}

export const test = base.extend<{
  runtimeIssueGuard: void
  prototypeBoundaryGuard: void
}>({
  runtimeIssueGuard: [
    async ({ page }, use) => {
      const runtimeIssues: RuntimeIssue[] = []
      page.on('console', (entry) => {
        if (entry.type() === 'error') {
          runtimeIssues.push({ kind: 'console.error', message: entry.text() })
        }
        if (entry.type() === 'warning') {
          runtimeIssues.push({ kind: 'console.warn', message: entry.text() })
        }
      })
      page.on('pageerror', (error) => {
        runtimeIssues.push({ kind: 'pageerror', message: error.message })
      })

      await use()
      expect(runtimeIssues, 'erros ou avisos relevantes no runtime do navegador').toEqual([])
    },
    { auto: true },
  ],
  prototypeBoundaryGuard: [
    async ({ baseURL, context }, use) => {
      if (!baseURL) throw new Error('baseURL é obrigatória para proteger a fronteira do protótipo.')
      const allowedOrigin = new URL(baseURL).origin
      const sideEffects: PrototypeSideEffect[] = []

      await context.exposeBinding(
        '__recordPrototypeSideEffect',
        (_source, kind: PrototypeSideEffect['kind'], detail: string) => {
          sideEffects.push({ kind, detail })
        },
      )

      await context.addInitScript(() => {
        const record = (kind: PrototypeSideEffect['kind'], detail: string) => {
          void window.__recordPrototypeSideEffect?.(kind, detail)
        }

        function findDescriptor(target: object, name: PropertyKey) {
          let current: object | null = target
          while (current) {
            const descriptor = Object.getOwnPropertyDescriptor(current, name)
            if (descriptor) return descriptor
            current = Object.getPrototypeOf(current) as object | null
          }
          return undefined
        }

        for (const name of ['localStorage', 'sessionStorage', 'indexedDB', 'caches'] as const) {
          const descriptor = findDescriptor(window, name)
          if (!descriptor?.get) continue
          Object.defineProperty(window, name, {
            configurable: true,
            enumerable: descriptor.enumerable,
            get() {
              record('storage', `${name}:read`)
              return descriptor.get?.call(window)
            },
          })
        }

        const storageDescriptor = findDescriptor(navigator, 'storage')
        if (storageDescriptor?.get) {
          Object.defineProperty(navigator, 'storage', {
            configurable: true,
            enumerable: storageDescriptor.enumerable,
            get() {
              record('storage', 'navigator.storage:read')
              return storageDescriptor.get?.call(navigator)
            },
          })
        }

        const cookieDescriptor = findDescriptor(document, 'cookie')
        if (cookieDescriptor?.get && cookieDescriptor.set) {
          Object.defineProperty(document, 'cookie', {
            configurable: true,
            enumerable: cookieDescriptor.enumerable,
            get() {
              record('storage', 'document.cookie:read')
              return cookieDescriptor.get?.call(document) ?? ''
            },
            set(value: string) {
              record('storage', 'document.cookie:write')
              cookieDescriptor.set?.call(document, value)
            },
          })
        }
      })

      await context.route('**/*', async (route) => {
        const request = route.request()
        const url = new URL(request.url())
        const isHttp = url.protocol === 'http:' || url.protocol === 'https:'
        const isExternal = isHttp && url.origin !== allowedOrigin
        const isFunctional = ['fetch', 'xhr', 'eventsource', 'ping'].includes(
          request.resourceType(),
        )
        const mutatesServer = !['GET', 'HEAD'].includes(request.method())

        if (isExternal || isFunctional || mutatesServer) {
          sideEffects.push({
            kind: 'network',
            detail: `${request.method()} ${request.resourceType()} ${request.url()}`,
          })
          await route.abort('blockedbyclient')
          return
        }
        await route.continue()
      })

      await context.routeWebSocket(/.*/, async (webSocket) => {
        sideEffects.push({ kind: 'websocket', detail: webSocket.url() })
        await webSocket.close({ code: 1008, reason: 'Protótipo sem integrações' })
      })

      await use()

      const storageState = await context.storageState({ indexedDB: true })
      expect(sideEffects, 'rede externa, chamadas funcionais ou armazenamento').toEqual([])
      expect(storageState.cookies, 'cookies do contexto').toEqual([])
      expect(storageState.origins, 'localStorage ou IndexedDB do contexto').toEqual([])
    },
    { auto: true },
  ],
})

export { expect }
```

A referência ao tipo `PrototypeSideEffect` dentro de `addInitScript` é removida pelo TypeScript;
não passe closures ou valores Node para o contexto do navegador além dos literais acima.

- [ ] **Step 4: Confirmar que a sonda agora falha pelo motivo correto e removê-la**

Run:

```bash
npm run test:e2e:ci -- --project=mobile-chromium e2e/prototype-boundary.probe.spec.ts
```

Expected: FAIL na desmontagem da fixture, listando `localStorage:read` e a requisição `fetch`.
Remova `e2e/prototype-boundary.probe.spec.ts` logo após essa confirmação; ela não entra no commit.

- [ ] **Step 5: Fortalecer as asserções reutilizáveis**

Em `e2e/support/assertions.ts`, remova `observeForbiddenRequests()`,
`expectEmptyBrowserStorage()` e `expectNoSeriousAccessibilityViolations()`. Preserve
`expectNoHorizontalOverflow()` e `expectMinimumFieldFontSize()` e implemente:

```ts
export interface AxeAllowlistEntry {
  ruleId: string
  target: string
  reason: string
}

function axeTarget(target: readonly (string | string[])[]) {
  return target.map((part) => (Array.isArray(part) ? part.join(' ') : part)).join(' > ')
}

export async function expectNoAccessibilityViolations(
  page: Page,
  allowlist: readonly AxeAllowlistEntry[] = [],
) {
  for (const entry of allowlist) {
    expect(entry.reason.trim(), `justificativa axe para ${entry.ruleId}`).not.toBe('')
  }

  const results = await new AxeBuilder({ page }).analyze()
  const unexpected = results.violations.flatMap((violation) =>
    violation.nodes
      .filter((node) => {
        const target = axeTarget(node.target)
        return !allowlist.some((entry) => entry.ruleId === violation.id && entry.target === target)
      })
      .map((node) => ({
        id: violation.id,
        impact: violation.impact,
        target: axeTarget(node.target),
        html: node.html,
      })),
  )

  expect(unexpected, 'violações axe não justificadas').toEqual([])
}

export async function expectMinimumTouchTarget(locator: Locator) {
  const target = await locator.boundingBox()
  expect(target, 'controle visível para medição').not.toBeNull()
  expect(target?.width).toBeGreaterThanOrEqual(44)
  expect(target?.height).toBeGreaterThanOrEqual(44)
}

export async function expectComputedFocusVisible(locator: Locator) {
  await expect(locator).toBeFocused()
  const style = await locator.evaluate((element) => {
    const computed = getComputedStyle(element)
    return {
      outlineColor: computed.outlineColor,
      outlineOffset: Number.parseFloat(computed.outlineOffset),
      outlineStyle: computed.outlineStyle,
      outlineWidth: Number.parseFloat(computed.outlineWidth),
    }
  })
  expect(style.outlineStyle, 'estilo do indicador de foco').not.toBe('none')
  expect(style.outlineWidth, 'largura do indicador de foco').toBeGreaterThan(0)
  expect(style.outlineOffset, 'afastamento do indicador de foco').toBeGreaterThan(0)
  expect(style.outlineColor, 'cor do indicador de foco').not.toBe('rgba(0, 0, 0, 0)')
}

export async function expectNoHorizontalClipping(locator: Locator) {
  const dimensions = await locator.evaluate((element) => ({
    clientWidth: element.clientWidth,
    scrollWidth: element.scrollWidth,
  }))
  expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth)
}

export async function expectHorizontalScrollContained(page: Page, scroller: Locator) {
  await expectNoHorizontalOverflow(page)
  const dimensions = await scroller.evaluate((element) => {
    const initialScrollLeft = element.scrollLeft
    element.scrollLeft = element.scrollWidth
    const finalScrollLeft = element.scrollLeft
    element.scrollLeft = initialScrollLeft
    return {
      clientWidth: element.clientWidth,
      scrollWidth: element.scrollWidth,
      overflowX: getComputedStyle(element).overflowX,
      initialScrollLeft,
      finalScrollLeft,
    }
  })
  expect(['auto', 'scroll']).toContain(dimensions.overflowX)
  expect(dimensions.scrollWidth).toBeGreaterThan(dimensions.clientWidth)
  expect(dimensions.finalScrollLeft).toBeGreaterThan(dimensions.initialScrollLeft)
  await expectNoHorizontalOverflow(page)
}

export async function expectSingleEditorialColumn(items: Locator) {
  const boxes = await items.evaluateAll((elements) =>
    elements.map((element) => {
      const box = element.getBoundingClientRect()
      return { left: Math.round(box.left), top: box.top, bottom: box.bottom }
    }),
  )
  expect(boxes.length).toBeGreaterThan(0)
  expect(new Set(boxes.map(({ left }) => left)).size).toBe(1)
  for (let index = 1; index < boxes.length; index += 1) {
    expect(boxes[index].top).toBeGreaterThanOrEqual(boxes[index - 1].bottom - 1)
  }
}

export async function expectReducedMotionApplied(page: Page) {
  const result = await page.evaluate(() => {
    const toMilliseconds = (value: string) =>
      value.endsWith('ms')
        ? Number.parseFloat(value)
        : Number.parseFloat(value.replace('s', '')) * 1000
    const durations = Array.from(document.querySelectorAll('*')).flatMap((element) => {
      const style = getComputedStyle(element)
      return [...style.transitionDuration.split(','), ...style.animationDuration.split(',')]
        .map((value) => toMilliseconds(value.trim()))
        .filter(Number.isFinite)
    })
    return {
      matches: matchMedia('(prefers-reduced-motion: reduce)').matches,
      maxDuration: Math.max(0, ...durations),
      scrollBehavior: getComputedStyle(document.documentElement).scrollBehavior,
    }
  })
  expect(result.matches).toBe(true)
  expect(result.maxDuration).toBeLessThanOrEqual(0.01)
  expect(result.scrollBehavior).not.toBe('smooth')
}
```

- [ ] **Step 6: Centralizar apenas os fluxos repetidos**

```ts
// e2e/support/flows.ts
import { expect, type Locator, type Page } from '@playwright/test'

export async function openGiftDetails(page: Page, giftName = 'Chaleira'): Promise<Locator> {
  await page.getByRole('button', { name: `Ver ${giftName}` }).click()
  const dialog = page.getByRole('dialog', { name: 'Detalhes do presente' })
  await expect(dialog).toBeVisible()
  return dialog
}

export async function openReservationForm(page: Page, giftName = 'Chaleira') {
  const dialog = await openGiftDetails(page, giftName)
  await dialog.getByRole('button', { name: 'Quero dar este presente', exact: true }).click()
  await expect(dialog.getByLabel('Seu primeiro nome')).toBeFocused()
  return dialog
}

export async function reserveGiftFromCatalog(
  page: Page,
  { giftName = 'Chaleira', firstName = 'Nina' } = {},
) {
  const dialog = await openReservationForm(page, giftName)
  await dialog.getByLabel('Seu primeiro nome').fill(firstName)
  await dialog.getByRole('button', { name: 'Confirmar reserva' }).click()
  await expect(dialog.getByRole('heading', { name: 'Este presente ficou com você' })).toBeFocused()
  return dialog
}

export async function unlockDemoAdmin(page: Page) {
  await page.goto('./#/admin')
  const enter = page.getByRole('button', { name: 'Entrar na demonstração' })
  if (await enter.isVisible()) await enter.click()
  await expect(page.getByRole('heading', { name: 'Painel da lista' })).toBeFocused()
}
```

Não crie helpers para seletores usados uma única vez.

- [ ] **Step 7: Migrar os testes existentes para as guardas automáticas**

- Remova imports, instalações e chamadas de `observeForbiddenRequests()` e
  `expectEmptyBrowserStorage()` de `reservation.spec.ts`,
  `reservation-management.spec.ts`, `pix-pdf.spec.ts` e `admin.spec.ts`.
- Troque `expectNoSeriousAccessibilityViolations()` por
  `expectNoAccessibilityViolations()` em `catalog.mobile.spec.ts` e `keyboard.spec.ts`,
  inclusive os títulos que ainda dizem “sérias ou críticas”.
- Atualize seletores já alterados pelas Tasks 2–10: “Ver Chaleira”, “Seu primeiro nome”,
  “Este presente ficou com você”, “Ver minha reserva”, “Só disponíveis”,
  “Ver referência” e os novos títulos de gerenciamento.
- Use `openGiftDetails()`, `reserveGiftFromCatalog()` e `unlockDemoAdmin()` apenas onde
  eliminarem uma sequência idêntica.

- [ ] **Step 8: Executar infraestrutura e todos os cenários migrados**

Run:

```bash
npm run build
npm run test:e2e:ci -- --project=mobile-chromium
npm run test:e2e:ci -- --project=desktop-chromium
npm run typecheck
```

Expected: todos os comandos PASS; não existe mais teste capaz de esquecer a guarda de console,
rede ou armazenamento.

- [ ] **Step 9: Commit da infraestrutura E2E**

```bash
git add playwright.config.ts e2e/support/test.ts e2e/support/assertions.ts \
  e2e/support/flows.ts e2e/catalog.mobile.spec.ts e2e/keyboard.spec.ts \
  e2e/reservation.spec.ts e2e/reservation-management.spec.ts \
  e2e/pix-pdf.spec.ts e2e/admin.spec.ts
git commit -m "test(e2e): fortalecer guardas do prototipo"
```

---

### Task 12: Completar a matriz funcional, responsiva e acessível

**Files:**

- Modify: `e2e/catalog.mobile.spec.ts`
- Modify: `e2e/reservation.spec.ts`
- Modify: `e2e/reservation-management.spec.ts`
- Modify: `e2e/keyboard.spec.ts`
- Modify: `e2e/pix-pdf.spec.ts`
- Modify: `e2e/admin.spec.ts`
- Modify: `e2e/responsive.desktop.spec.ts`
- Modify: `e2e/routing.spec.ts`
- Create: `e2e/accessibility.states.spec.ts`
- Create: `e2e/responsive.breakpoints.spec.ts`
- Create: `e2e/reduced-motion.spec.ts`
- Modify: `e2e/support/flows.ts`

**Interfaces:**

- Consumes: as guardas e helpers da Task 11, fixtures atuais e rotas `HashRouter` existentes.
- Produces: nenhum contrato de aplicação; somente cobertura observável nos projetos
  `mobile-chromium`, `mobile-webkit`, `desktop-chromium`, `layout-chromium` e
  `a11y-chromium`.
- O cenário `@canonical` é o único fluxo obrigatoriamente triplicado nos três navegadores/
  viewports principais.
- O projeto `@layout` percorre os limites dirigidos sem replicar os fluxos de domínio.

- [ ] **Step 1: Atualizar o catálogo móvel com critérios de aceitação explícitos**

Em `catalog.mobile.spec.ts`, substitua a busca isolada por:

```ts
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
```

Acrescente os critérios da primeira viewport e da única rolagem horizontal:

```ts
test('mostra a jornada e o primeiro presente completos na primeira viewport de 360 px', async ({
  page,
}) => {
  const visibleInViewport = [
    page.getByRole('link', { name: 'Nossa lista' }),
    page.getByRole('heading', { name: 'Lista da nossa casa nova' }),
    page.getByRole('list', { name: 'Como funciona' }),
    page.getByRole('searchbox', { name: 'Buscar um presente' }),
    page.locator('.gift-card').first(),
  ]
  for (const locator of visibleInViewport) {
    const box = await locator.boundingBox()
    expect(box, 'elemento mensurável na primeira viewport').not.toBeNull()
    expect((box?.y ?? 801) + (box?.height ?? 0)).toBeLessThanOrEqual(800)
  }
  await expect(page.locator('.gift-grid .ui-button--primary')).toHaveCount(0)
})

test('contém a rolagem horizontal somente na faixa de categorias', async ({ page }) => {
  await expectHorizontalScrollContained(page, page.locator('.category-list'))
  await expectNoHorizontalClipping(page.locator('.gift-grid'))
  await expectNoHorizontalClipping(page.locator('.gift-card').first())
})
```

No teste de toque, meça busca, marca, “Contribuir”, “Todas” e “Ver Chaleira” usando
`expectMinimumTouchTarget()`; o helper já cobre largura e altura. Mantenha o teste do ícone de
busca centralizado.

- [ ] **Step 2: Fazer o fluxo principal canônico rodar nos três projetos**

Substitua o primeiro cenário de `reservation.spec.ts` pelo fluxo completo:

```ts
test('@canonical busca, abre o detalhe, reserva e chega à confirmação', async ({ page }) => {
  await page.goto('./#/')
  const search = page.getByRole('searchbox', { name: 'Buscar um presente' })
  await search.fill('chaleira')
  await expect(page.getByRole('status').filter({ hasText: '1 ideia para escolher' })).toBeVisible()
  await expect(page.getByText('Disponível', { exact: true })).toBeVisible()

  const dialog = await reserveGiftFromCatalog(page)
  await expect(dialog.getByText('3 · Combine a entrega')).toBeVisible()
  await expect(dialog.getByRole('link', { name: 'Ver minha reserva' })).toHaveAttribute(
    'href',
    '#/minha-reserva/reserva-cz-001-1',
  )
  await expect(dialog.getByLabel('Seu primeiro nome')).toHaveCount(0)

  await page.reload()
  await expect(page.getByRole('dialog', { name: 'Detalhes do presente' })).toContainText(
    'Disponível',
  )
})
```

Mantenha e atualize os cenários de retorno ao detalhe com nome preservado, conflito,
indisponibilidade e código inexistente. No conflito, exija o link “Voltar para a lista”.
Exija também que o próprio `role="alert"` receba foco quando o conflito chegar.

- [ ] **Step 3: Cobrir teclado, retorno de foco, filtros e rolagem**

Acrescente a `keyboard.spec.ts` um helper local deliberadamente orientado por `Tab`:

```ts
async function tabTo(page: Page, target: Locator, limit = 30) {
  for (let index = 0; index < limit; index += 1) {
    if (await target.evaluate((element) => element === document.activeElement)) return
    await page.keyboard.press('Tab')
  }
  throw new Error(`Foco não alcançou o controle após ${limit} Tabs.`)
}
```

Use-o em um cenário que parte do `h1` focalizado, alcança a busca, digita “chaleira”, alcança
“Ver Chaleira”, abre com `Enter`, alcança “Quero dar este presente”, confirma com o teclado e
termina no título “Este presente ficou com você”. Depois de cada `tabTo`, chame
`expectComputedFocusVisible()`.

Atualize o cenário de `Escape` para preparar contexto antes de abrir o painel:

```ts
await page.getByRole('button', { name: 'Cozinha', exact: true }).click()
await page.getByRole('checkbox', { name: 'Só disponíveis' }).check()
await page.evaluate(() => window.scrollTo(0, 300))
const trigger = page.getByRole('button', { name: 'Ver Chaleira' })
await trigger.scrollIntoViewIfNeeded()
const originScrollY = await page.evaluate(() => window.scrollY)
await trigger.click()
await page.keyboard.press('Escape')

await expect(trigger).toBeFocused()
await expect(page.getByRole('button', { name: 'Cozinha' })).toHaveAttribute('aria-pressed', 'true')
await expect(page.getByRole('checkbox', { name: 'Só disponíveis' })).toBeChecked()
await expect
  .poll(async () => Math.abs((await page.evaluate(() => window.scrollY)) - originScrollY))
  .toBeLessThanOrEqual(2)
```

Mantenha a verificação de foco contido nos diálogos de detalhe, cancelamento e liberação.

- [ ] **Step 4: Atualizar os fluxos de apoio sem mudar seus contratos demonstrativos**

Faça estas mudanças dirigidas nos testes existentes:

| Arquivo                          | Cobertura obrigatória                                                                                                                                                   |
| -------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `reservation-management.spec.ts` | “Tudo certo com seu presente”, “Combine a entrega”, compra, cancelamento confirmado, foco no estado e reset após reload.                                                |
| `pix-pdf.spec.ts`                | Pix secundário, aviso antes da ação, cópia simulada; “Ver referência” sem `href`; resumo da prévia, filtro e download simulado sem arquivo.                             |
| `admin.spec.ts`                  | login sem campo, navegação de salto com `aria-current`, foco no título de destino, liberação confirmada, configuração em memória e reset após reload.                   |
| `routing.spec.ts`                | recarga das rotas válidas, incluindo “Tudo certo com seu presente”; erros de item, token, coleção e rota com `h1` focalizado, `expectComputedFocusVisible()` e retorno. |

Cada arquivo continua importando `test` de `./support/test.js`, garantindo as fronteiras automáticas.

- [ ] **Step 5: Reescrever as expectativas desktop para a lista editorial**

Substitua o primeiro cenário de `responsive.desktop.spec.ts` por:

```ts
test('@desktop mantém catálogo editorial em uma coluna na primeira viewport', async ({ page }) => {
  await page.goto('./#/')
  const cards = page.locator('.gift-card')
  await expect(cards).toHaveCount(11)
  await expectSingleEditorialColumn(cards)
  await expect(page.locator('.gift-grid .ui-button--primary')).toHaveCount(0)
  const firstCard = await cards.first().boundingBox()
  expect(firstCard).not.toBeNull()
  expect((firstCard?.y ?? 901) + (firstCard?.height ?? 0)).toBeLessThanOrEqual(900)
  await expectNoHorizontalOverflow(page)
})
```

No cenário administrativo, preserve os quatro resumos e acrescente posição lateral da navegação.
Na prévia, meça `.printable-sheet-frame`, confirme razão `210 / 297` com tolerância `0.03` e
use `expectNoHorizontalClipping()`.

- [ ] **Step 6: Criar testes dirigidos para todos os limites responsivos**

Implemente `responsive.breakpoints.spec.ts` com este núcleo:

```ts
import type { Page } from '@playwright/test'
import {
  expectNoHorizontalClipping,
  expectNoHorizontalOverflow,
  expectSingleEditorialColumn,
} from './support/assertions.js'
import { unlockDemoAdmin } from './support/flows.js'
import { expect, test } from './support/test.js'

async function openCatalogAt(page: Page, width: number, height = 900) {
  await page.setViewportSize({ width, height })
  await page.goto('./#/')
  await expect(page.getByRole('link', { name: 'Nossa lista' })).toBeVisible()
  await expectSingleEditorialColumn(page.locator('.gift-card'))
  await expectNoHorizontalOverflow(page)
}

test('@layout preserva marca e coluna única em 480/481 e 639/640', async ({ page }) => {
  for (const width of [480, 481, 639, 640]) await openCatalogAt(page, width)
})

test('@layout escala a folha A4 sem corte em 520/521', async ({ page }) => {
  await page.setViewportSize({ width: 520, height: 900 })
  await page.goto('./#/pdf')

  const readPreviewBounds = async () => {
    const frame = page.locator('.printable-sheet-frame')
    await expectNoHorizontalClipping(frame)
    return page.evaluate(() => {
      const frameBox = document.querySelector('.printable-sheet-frame')?.getBoundingClientRect()
      const canvasBox = document.querySelector('.printable-sheet-canvas')?.getBoundingClientRect()
      return {
        frame: frameBox
          ? {
              left: frameBox.left,
              right: frameBox.right,
              width: frameBox.width,
              height: frameBox.height,
            }
          : null,
        canvas: canvasBox
          ? {
              left: canvasBox.left,
              right: canvasBox.right,
              width: canvasBox.width,
              height: canvasBox.height,
            }
          : null,
      }
    })
  }

  const at520 = await readPreviewBounds()
  expect(at520.frame).not.toBeNull()
  expect(at520.canvas).not.toBeNull()
  expect(
    Math.abs((at520.canvas?.width ?? 0) / (at520.canvas?.height ?? 1) - 210 / 297),
  ).toBeLessThan(0.03)
  expect(at520.canvas?.left ?? -1).toBeGreaterThanOrEqual((at520.frame?.left ?? 0) - 0.5)
  expect(at520.canvas?.right ?? 1).toBeLessThanOrEqual((at520.frame?.right ?? 0) + 0.5)

  await page.setViewportSize({ width: 521, height: 900 })
  await expect
    .poll(async () => (await readPreviewBounds()).canvas?.width ?? 0)
    .toBeGreaterThan(at520.canvas?.width ?? 0)
  const at521 = await readPreviewBounds()
  expect(at521.canvas?.right ?? 1).toBeLessThanOrEqual((at521.frame?.right ?? 0) + 0.5)
  await expectNoHorizontalOverflow(page)
})

test('@layout move apenas a administração para a lateral em 899/900', async ({ page }) => {
  for (const width of [899, 900]) {
    await page.setViewportSize({ width, height: 900 })
    await unlockDemoAdmin(page)
    const boxes = await page.evaluate(() => {
      const sidebar = document.querySelector('.admin-shell__sidebar')?.getBoundingClientRect()
      const content = document.querySelector('.admin-shell__content')?.getBoundingClientRect()
      return {
        sidebarRight: sidebar?.right ?? 0,
        sidebarBottom: sidebar?.bottom ?? 0,
        contentLeft: content?.left ?? 0,
        contentTop: content?.top ?? 0,
      }
    })
    if (width === 899) expect(boxes.contentTop).toBeGreaterThanOrEqual(boxes.sidebarBottom)
    if (width === 900) expect(boxes.contentLeft).toBeGreaterThanOrEqual(boxes.sidebarRight)
    await expectNoHorizontalOverflow(page)
  }
})

test('@layout preserva ordem e foco administrativo em 1199/1200', async ({ page }) => {
  for (const width of [1199, 1200]) {
    await page.setViewportSize({ width, height: 900 })
    await unlockDemoAdmin(page)
    const order = await page
      .locator(
        '#admin-dashboard-title, #admin-gifts-title, #admin-reservations-title, #site-settings-title',
      )
      .evaluateAll((headings) => headings.map((heading) => heading.id))
    expect(order).toEqual([
      'admin-dashboard-title',
      'admin-gifts-title',
      'admin-reservations-title',
      'site-settings-title',
    ])
    await page.getByRole('button', { name: 'Reservas' }).click()
    await expect(page.locator('#admin-reservations-title')).toBeFocused()
  }
})

test('@layout mantém tablet e celular em paisagem sem corte', async ({ page }) => {
  for (const viewport of [
    { width: 768, height: 1024 },
    { width: 844, height: 390 },
  ]) {
    await page.setViewportSize(viewport)
    await page.goto('./#/')
    await expectSingleEditorialColumn(page.locator('.gift-card'))
    await expectNoHorizontalOverflow(page)
  }
})

test('@layout não corta cartões, painel de detalhe ou administração', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 })
  await page.goto('./#/')
  await expectNoHorizontalClipping(page.locator('.gift-card').first())
  await page.getByRole('button', { name: 'Ver Chaleira' }).click()
  await expectNoHorizontalClipping(page.locator('.ui-dialog__surface'))

  await unlockDemoAdmin(page)
  await expectNoHorizontalClipping(page.locator('.admin-shell'))
  const panels = page.locator('.admin-panel')
  for (let index = 0; index < (await panels.count()); index += 1) {
    await expectNoHorizontalClipping(panels.nth(index))
  }
  await expectNoHorizontalOverflow(page)
})
```

- [ ] **Step 7: Executar axe em estados permanentes e transitórios**

Crie `accessibility.states.spec.ts`; cada estado abaixo deve terminar com
`expectNoAccessibilityViolations(page)` sem allowlist inicial:

```ts
import { expectNoAccessibilityViolations } from './support/assertions.js'
import { reserveGiftFromCatalog, unlockDemoAdmin } from './support/flows.js'
import { expect, test } from './support/test.js'

test('@a11y cobre catálogo vazio e formulário inválido', async ({ page }) => {
  await page.goto('./#/')
  await page.getByRole('searchbox', { name: 'Buscar um presente' }).fill('resultado impossível')
  await expect(page.getByRole('heading', { name: 'Nenhuma ideia encontrada' })).toBeVisible()
  await expectNoAccessibilityViolations(page)

  await page.goto('./#/item/CZ-001')
  await page.getByRole('button', { name: 'Quero dar este presente' }).click()
  await page.getByRole('button', { name: 'Confirmar reserva' }).click()
  await expect(page.getByLabel('Seu primeiro nome')).toHaveAttribute('aria-invalid', 'true')
  await expectNoAccessibilityViolations(page)
})

test('@a11y cobre conflito e confirmação', async ({ page }) => {
  await page.goto('./#/item/CZ-004')
  await page.getByRole('button', { name: 'Quero dar este presente' }).click()
  await page.getByLabel('Seu primeiro nome').fill('Nina')
  await page.getByRole('button', { name: 'Confirmar reserva' }).click()
  await expect(page.getByRole('alert')).toBeVisible()
  await expectNoAccessibilityViolations(page)

  await page.goto('./#/')
  await reserveGiftFromCatalog(page)
  await expectNoAccessibilityViolations(page)
})

test('@a11y cobre gerenciamento, confirmação destrutiva e administração', async ({ page }) => {
  await page.goto('./#/minha-reserva/reserva-demo-valida')
  await page.getByRole('button', { name: 'Já comprei' }).click()
  await expectNoAccessibilityViolations(page)

  await page.reload()
  await page.getByRole('button', { name: 'Cancelar minha reserva' }).click()
  await expect(page.getByRole('dialog', { name: 'Cancelar reserva' })).toBeVisible()
  await expectNoAccessibilityViolations(page)

  await unlockDemoAdmin(page)
  await expectNoAccessibilityViolations(page)
})

test('@a11y cobre todas as rotas inválidas', async ({ page }) => {
  for (const route of [
    'item/CODIGO-INEXISTENTE',
    'minha-reserva/reserva-inexistente',
    'colecao/colecao-inexistente',
    'rota-inexistente',
  ]) {
    await page.goto(`./#/${route}`)
    await expect(page.getByRole('heading', { level: 1 })).toBeFocused()
    await expectNoAccessibilityViolations(page)
  }
})
```

Remova os dois casos axe genéricos de `catalog.mobile.spec.ts` e `keyboard.spec.ts`; a cobertura
passa a pertencer ao projeto `a11y-chromium`, sem duplicar auditorias em specs funcionais.

Se axe encontrar um falso positivo comprovado, adicione somente o par exato
`{ ruleId, target, reason }` no teste afetado. Não desative tags, impactos ou regras inteiras.

- [ ] **Step 8: Verificar movimento reduzido por estilo computado**

```ts
// e2e/reduced-motion.spec.ts
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
```

- [ ] **Step 9: Executar a matriz em fatias diagnósticas**

Run:

```bash
npm run build
npm run test:e2e:ci -- --grep @canonical
npm run test:e2e:ci -- --project=layout-chromium
npm run test:e2e:ci -- --project=a11y-chromium
npm run test:e2e:ci -- --project=mobile-chromium
npm run typecheck
```

Expected: todos os comandos PASS; o canônico aparece em três projetos, layout somente no projeto
dirigido e axe falha para qualquer impacto não justificado.

- [ ] **Step 10: Commit da matriz de estados e layouts**

```bash
git add e2e/catalog.mobile.spec.ts e2e/reservation.spec.ts \
  e2e/reservation-management.spec.ts e2e/keyboard.spec.ts e2e/pix-pdf.spec.ts \
  e2e/admin.spec.ts e2e/responsive.desktop.spec.ts e2e/routing.spec.ts \
  e2e/accessibility.states.spec.ts e2e/responsive.breakpoints.spec.ts \
  e2e/reduced-motion.spec.ts e2e/support/flows.ts
git commit -m "test(e2e): cobrir estados e layouts do polimento"
```

---

### Task 13: Versionar regressão visual canônica e concluir o Definition of Done

**Files:**

- Create: `e2e/visual-regression.spec.ts`
- Create: `e2e/__screenshots__/visual-regression.spec.ts/visual-mobile-chromium/*.png`
- Create: `e2e/__screenshots__/visual-regression.spec.ts/visual-desktop-chromium/*.png`
- Modify: `.github/workflows/ci.yml`

**Interfaces:**

- Consumes: `toHaveScreenshot`, projetos visuais da Task 11, helpers da Task 11 e o ambiente
  canônico Chromium/Ubuntu.
- Produces: baselines versionados separados por projeto; nenhuma imagem gerada em macOS é aceita
  como referência.
- Snapshots de viewport cobrem catálogo e as três fases dentro do contexto real do painel;
  snapshots de locator ficam restritos a estados de página cujo entorno não participa do contrato.

- [ ] **Step 1: Escrever o arquivo visual e confirmar RED no Ubuntu sem baselines**

```ts
// e2e/visual-regression.spec.ts
import type { Page } from '@playwright/test'
import {
  openGiftDetails,
  openReservationForm,
  reserveGiftFromCatalog,
  unlockDemoAdmin,
} from './support/flows.js'
import { expect, test } from './support/test.js'

async function waitForVisualStability(page: Page) {
  await page.evaluate(() => document.fonts.ready)
}

test.describe('@visual-mobile composição móvel', () => {
  test('catálogo em 360', async ({ page }) => {
    await page.goto('./#/')
    await expect(page.getByRole('heading', { name: 'Lista da nossa casa nova' })).toBeVisible()
    await expect(page.locator('.gift-card').first()).toBeVisible()
    await waitForVisualStability(page)
    await expect(page).toHaveScreenshot('catalogo-360.png')
  })

  test('detalhe em 360', async ({ page }) => {
    await page.goto('./#/')
    const dialog = await openGiftDetails(page)
    await waitForVisualStability(page)
    await expect(dialog).toBeVisible()
    await expect(page).toHaveScreenshot('detalhe-360.png')
  })

  test('formulário em 360', async ({ page }) => {
    await page.goto('./#/')
    const dialog = await openReservationForm(page)
    await waitForVisualStability(page)
    await expect(dialog.getByLabel('Seu primeiro nome')).toBeFocused()
    await expect(page).toHaveScreenshot('formulario-360.png')
  })

  test('confirmação em 360', async ({ page }) => {
    await page.goto('./#/')
    const dialog = await reserveGiftFromCatalog(page)
    await waitForVisualStability(page)
    await expect(
      dialog.getByRole('heading', { name: 'Este presente ficou com você' }),
    ).toBeFocused()
    await expect(page).toHaveScreenshot('confirmacao-reserva-360.png')
  })

  test('estado vazio em 360', async ({ page }) => {
    await page.goto('./#/')
    await page.getByRole('searchbox', { name: 'Buscar um presente' }).fill('resultado impossível')
    await expect(page.getByRole('heading', { name: 'Nenhuma ideia encontrada' })).toBeVisible()
    await waitForVisualStability(page)
    await expect(page.locator('main')).toHaveScreenshot('vazio-360.png')
  })

  test('conflito em 360', async ({ page }) => {
    await page.goto('./#/item/CZ-004')
    await page.getByRole('button', { name: 'Quero dar este presente' }).click()
    await page.getByLabel('Seu primeiro nome').fill('Nina')
    await page.getByRole('button', { name: 'Confirmar reserva' }).click()
    await expect(page.getByRole('alert')).toBeVisible()
    await waitForVisualStability(page)
    await expect(page.locator('.reservation-form')).toHaveScreenshot('conflito-360.png')
  })

  test('sucesso de gerenciamento em 360', async ({ page }) => {
    await page.goto('./#/minha-reserva/reserva-demo-valida')
    await page.getByRole('button', { name: 'Já comprei' }).click()
    await expect(page.getByRole('status', { name: 'Estado da reserva' })).toContainText('Comprado')
    await waitForVisualStability(page)
    await expect(page.locator('.manage-reservation')).toHaveScreenshot(
      'sucesso-gerenciamento-360.png',
    )
  })

  test('prévia A4 em 360', async ({ page }) => {
    await page.goto('./#/pdf')
    await expect(page.locator('.printable-sheet-frame')).toBeVisible()
    await waitForVisualStability(page)
    await expect(page.locator('main')).toHaveScreenshot('a4-360.png')
  })
})

test.describe('@visual-desktop composição desktop', () => {
  test('catálogo em 1280', async ({ page }) => {
    await page.goto('./#/')
    await expect(page.getByRole('heading', { name: 'Lista da nossa casa nova' })).toBeVisible()
    await expect(page.locator('.gift-card').first()).toBeVisible()
    await waitForVisualStability(page)
    await expect(page).toHaveScreenshot('catalogo-1280.png')
  })

  test('admin em 1280', async ({ page }) => {
    await unlockDemoAdmin(page)
    await waitForVisualStability(page)
    await expect(page).toHaveScreenshot('admin-1280.png')
  })

  test('prévia A4 em 1280', async ({ page }) => {
    await page.goto('./#/pdf')
    await expect(page.locator('.printable-sheet-frame')).toBeVisible()
    await waitForVisualStability(page)
    await expect(page.locator('main')).toHaveScreenshot('a4-1280.png')
  })
})
```

Formate o import longo em múltiplas linhas antes do commit. No Ubuntu, execute sem
`--update-snapshots` uma vez.

Run:

```bash
docker run --rm --ipc=host -e CI=1 \
  -v "$PWD:/work" -v /work/node_modules -w /work \
  mcr.microsoft.com/playwright:v1.62.1-noble \
  bash -lc 'npm ci && npm run build && npx playwright test --project=visual-mobile-chromium --project=visual-desktop-chromium'
```

Expected: FAIL somente porque os onze arquivos de referência ainda não existem. Se houver falha
de runtime, axe, rede, armazenamento ou seletor, corrija-a antes de gerar imagens.

- [ ] **Step 2: Fixar o runner e gerar baselines somente no ambiente canônico**

Em `.github/workflows/ci.yml`, fixe o job `e2e` na mesma imagem usada para gerar os PNGs:

```yaml
e2e:
  name: e2e
  needs: quality
  runs-on: ubuntu-24.04
  container:
    image: mcr.microsoft.com/playwright:v1.62.1-noble
    options: --ipc=host
```

Preserve todos os steps atuais do job, inclusive Node vindo de `.nvmrc`, build, instalação de
Chromium/WebKit, execução normal de `npm run test:e2e:ci` e upload de diagnóstico em falha. O job
continua read-only e nunca usa `--update-snapshots`; geração e comparação passam a compartilhar
imagem, fontes, emojis, bibliotecas do sistema e navegador Playwright 1.62.1.

Run:

```bash
docker run --rm --ipc=host -e CI=1 \
  -v "$PWD:/work" -v /work/node_modules -w /work \
  mcr.microsoft.com/playwright:v1.62.1-noble \
  bash -lc 'npm ci && npm run build && npx playwright test --project=visual-mobile-chromium --project=visual-desktop-chromium --update-snapshots'
```

Expected: PASS e criação destes onze baselines:

```text
e2e/__screenshots__/visual-regression.spec.ts/visual-mobile-chromium/catalogo-360.png
e2e/__screenshots__/visual-regression.spec.ts/visual-mobile-chromium/detalhe-360.png
e2e/__screenshots__/visual-regression.spec.ts/visual-mobile-chromium/formulario-360.png
e2e/__screenshots__/visual-regression.spec.ts/visual-mobile-chromium/confirmacao-reserva-360.png
e2e/__screenshots__/visual-regression.spec.ts/visual-mobile-chromium/vazio-360.png
e2e/__screenshots__/visual-regression.spec.ts/visual-mobile-chromium/conflito-360.png
e2e/__screenshots__/visual-regression.spec.ts/visual-mobile-chromium/sucesso-gerenciamento-360.png
e2e/__screenshots__/visual-regression.spec.ts/visual-mobile-chromium/a4-360.png
e2e/__screenshots__/visual-regression.spec.ts/visual-desktop-chromium/catalogo-1280.png
e2e/__screenshots__/visual-regression.spec.ts/visual-desktop-chromium/admin-1280.png
e2e/__screenshots__/visual-regression.spec.ts/visual-desktop-chromium/a4-1280.png
```

Se Docker/Ubuntu não estiver disponível, esta tarefa permanece incompleta; não gere nem aceite
baselines do macOS como substitutos.

- [ ] **Step 3: Revisar manualmente cada baseline contra a especificação aprovada**

Abra os onze PNGs e confirme, um por um:

- identidade curta, título serifado, três passos e primeiro item completos no catálogo móvel;
- uma única coluna, ausência de linguagem comercial e hierarquia clara em ambos os catálogos;
- emoji decorativo, estado textual e ação “Ver” equilibrados;
- uma fase por vez em detalhe, formulário e confirmação;
- aviso persistente e nome preservado no conflito;
- feedback de gerenciamento escrito na página;
- administração sóbria, sem emojis, com navegação lateral no desktop;
- A4 proporcional sem corte, acompanhado de resumo legível.

Não aceite baseline apenas para silenciar uma diferença. Corrija a UI ou, se a especificação tiver
mudado, atualize primeiro o documento de design com nova aprovação.

Faça também a inspeção manual final dos navegadores suportados com o inspetor Playwright,
avançando pelo fluxo `@canonical` e conferindo catálogo, detalhe, formulário e confirmação:

```bash
npm run build
PWDEBUG=1 npx playwright test --project=mobile-chromium --grep @canonical
PWDEBUG=1 npx playwright test --project=mobile-webkit --grep @canonical
PWDEBUG=1 npx playwright test --project=desktop-chromium --grep @canonical
```

Expected: Chromium 360 × 800, WebKit 390 × 844 e Chromium 1280 × 900 mantêm conteúdo legível,
foco visível, uma coluna e uma fase por vez, sem diferenças de fonte ou emoji que prejudiquem a
compreensão. Registre essa inspeção como manual; ela não substitui os testes automatizados.

- [ ] **Step 4: Reexecutar os snapshots sem atualização**

Run:

```bash
docker run --rm --ipc=host -e CI=1 \
  -v "$PWD:/work" -v /work/node_modules -w /work \
  mcr.microsoft.com/playwright:v1.62.1-noble \
  bash -lc 'npm ci && npm run build && npx playwright test --project=visual-mobile-chromium --project=visual-desktop-chromium'
```

Expected: PASS com `maxDiffPixelRatio: 0.01`, animações desativadas e caret oculto.

- [ ] **Step 5: Auditar as fronteiras do protótipo antes da suíte completa**

Run:

```bash
git diff --exit-code b8e5fae -- package.json package-lock.json \
  src/domain/types.ts src/domain/demo-reducer.ts src/domain/selectors.ts
rg -n "localStorage|sessionStorage|indexedDB|navigator\.clipboard|window\.print|URL\.createObjectURL|fetch\(|WebSocket" \
  src --glob '!**/*.test.*'
git diff --check
```

Expected: os dois primeiros comandos não mostram mudanças proibidas; `rg` encerra com código 1
sem saída; `git diff --check` encerra com código 0.

- [ ] **Step 6: Executar o Definition of Done completo**

Run, nesta ordem:

```bash
npm run format:check
npm run lint
npm run typecheck
npm run test
npm run build
npm run test:e2e
```

Depois, execute toda a suíte E2E no ambiente canônico para incluir a comparação real dos
snapshots:

```bash
docker run --rm --ipc=host -e CI=1 \
  -v "$PWD:/work" -v /work/node_modules -w /work \
  mcr.microsoft.com/playwright:v1.62.1-noble \
  bash -lc 'npm ci && npm run build && npm run test:e2e:ci'
```

Expected: todos os seis comandos locais e a suíte Ubuntu PASS. Não registre como concluído um
comando não executado, ignorado ou falho.

- [ ] **Step 7: Fazer a revisão final do diff e commit da regressão visual**

Confirme que o diff contém somente UI, testes e baselines previstos, que não há arquivo da sonda
temporária e que `git status --short` não mostra mudanças inesperadas no worktree isolado.

```bash
git add e2e/visual-regression.spec.ts e2e/__screenshots__ .github/workflows/ci.yml
git diff --cached --check
git diff --cached --stat
git commit -m "test(e2e): adicionar regressao visual editorial"
git status --short
```

Expected: commit criado; o worktree isolado fica limpo e o protótipo satisfaz integralmente a
especificação aprovada e o Definition of Done.
