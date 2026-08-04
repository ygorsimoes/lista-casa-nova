# Polimento rápido de interface Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Corrigir as discrepâncias visuais urgentes sem alterar os fluxos funcionais da lista.

**Architecture:** O polimento se concentra nas classes já usadas pela página pública e pelo diálogo de reserva. Uma escala curta de espaçamento e ajustes de layout substituem margens isoladas; conteúdo, dados e rotas permanecem inalterados.

**Tech Stack:** React, CSS existente, Vite e Playwright local para inspeção visual.

## Global Constraints

- Manter a identidade editorial e acolhedora já existente.
- Não alterar Supabase, reserva, Pix, PDF, administração, rotas ou o React Grab.
- Preservar 360 px, foco visível e alvos de toque de pelo menos 44 px.
- Não adicionar dependências.

---

### Task 1: Ajustar ritmo da página pública

**Files:**

- Modify: `src/styles/index.css`
- Modify: `src/features/catalog/LiveCatalogPage.tsx`
- Test: inspeção local em desktop e mobile

**Interfaces:** Consome as classes existentes de hero, cartões e diálogo; produz espaçamento uniforme e texto coerente.

- [ ] **Step 1: Registrar a falha visual**

No servidor local, verifique que o título mostra contorno pesado, que o hero deixa espaço excessivo e que os cartões de desktop afastam demais o botão de reserva do conteúdo.

- [ ] **Step 2: Aplicar a escala de respiro**

No CSS, reduza o espaçamento superior do hero, use `gap` consistente entre título, introdução e jornada, e troque o foco do título por um indicador discreto que só aparece via teclado. Para os cartões, limite a largura visual do conteúdo e alinhe a ação abaixo ou próxima do status em telas estreitas e largas.

- [ ] **Step 3: Corrigir conteúdo fora do fluxo**

Troque a terceira instrução da jornada para “Escolha onde comprar”, preservando o componente e a ordem visual.

- [ ] **Step 4: Validar no navegador**

Recarregue a página local, faça captura desktop e mobile e confirme ausência de sobreposição, ação distante, contorno agressivo ou referência à entrega.

- [ ] **Step 5: Commit**

```bash
git add src/styles/index.css src/features/catalog/LiveCatalogPage.tsx
git commit -m "style: polir ritmo da lista"
```

### Task 2: Separar formulário e ações

**Files:**

- Modify: `src/styles/index.css`
- Modify: `src/features/catalog/LiveCatalogPage.tsx`
- Test: diálogo de reserva local

**Interfaces:** Consome `ReservationDialog`; produz grupos legíveis de campo, feedback e ações.

- [ ] **Step 1: Registrar a falha visual**

Abra a reserva de um presente disponível e confirme que campo, erro e botões aparentam estar colados.

- [ ] **Step 2: Aplicar agrupamento explícito**

Use uma classe dedicada no formulário para definir `gap` entre campo, mensagens e ações; aplique margem superior nas ações e fundo leve no resumo, sem reduzir a área clicável dos botões.

- [ ] **Step 3: Validar e commit**

No diálogo, confira foco inicial, espaçamento e fechamento. Rode `npm run lint`, `npm run typecheck` e `npm run build`, depois:

```bash
git add src/styles/index.css src/features/catalog/LiveCatalogPage.tsx
git commit -m "style: dar respiro ao formulario de reserva"
```

## Revisão do plano

- Cobertura: topo, título, cartões, texto da jornada e formulário correspondem às cinco discrepâncias aprovadas.
- Escopo: nenhum fluxo funcional, dado ou dependência é modificado.
- Risco residual: o resultado será confirmado em desktop e em largura móvel com o servidor local.
