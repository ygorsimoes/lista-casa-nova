# Topo e passos delicados Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Tornar a primeira dobra mais compacta e transformar os três passos em uma orientação amigável, delicada e estática.

**Architecture:** A `HeroSection` preserva os mesmos três textos e ícones. A alteração é limitada às classes existentes no CSS global, removendo a moldura contínua da jornada e aplicando cartões independentes, responsivos e sem impacto em reservas ou dados.

**Tech Stack:** React, TypeScript, CSS, Vitest e Testing Library.

## Global Constraints

- Preservar textos, rotas, reserva, Pix, PDF e administração.
- Não introduzir dependências, componentes de negócio ou dados novos.
- Manter leitura e alvo de toque adequados em telas pequenas e grandes.

---

### Task 1: Refino visual do topo e dos passos

**Files:**
- Modify: `src/styles/index.css`
- Test: `src/features/catalog/HeroSection.test.tsx`

**Interfaces:**
- Consumes: a marcação existente de `.catalog-hero` e `.journey-steps` em `HeroSection`.
- Produces: mesma estrutura React com aparência compacta e três cartões de orientação.

- [ ] **Step 1: Confirmar o contrato textual existente**

O teste deve continuar exigindo três itens, com os textos:

```tsx
expect(within(steps).getAllByRole('listitem')).toHaveLength(3)
expect(steps).toHaveTextContent('Escolha um presente')
expect(steps).toHaveTextContent('Reserve em seu nome')
expect(steps).toHaveTextContent('Escolha onde comprar')
```

- [ ] **Step 2: Executar o teste de contrato**

Run: `npx vitest run src/features/catalog/HeroSection.test.tsx`

Expected: PASS, pois a mudança é puramente visual.

- [ ] **Step 3: Aplicar o CSS mínimo**

Compactar o espaçamento da hero e redefinir a faixa para uma grade de três itens sem borda compartilhada:

```css
.catalog-hero { gap: 1rem; }
.journey-steps { display: grid; gap: 0.75rem; border: 0; background: transparent; }
.journey-steps li { border: 1px solid rgb(151 77 57 / 0.12); border-radius: 1rem; background: rgb(255 255 255 / 0.56); }
```

Manter ícones em superfícies terracota suaves, remover destaque numérico e garantir uma coluna em tela pequena, três colunas em telas largas.

- [ ] **Step 4: Validar renderização e comportamento**

Run: `npm run lint && npm run typecheck && npm run build && npm run test`

Expected: todos os comandos passam; a faixa segue estática e não altera a reserva.

- [ ] **Step 5: Revisar no navegador local e registrar o commit**

Verificar que o topo traz a grade à primeira dobra e que os três cartões não parecem etapas de formulário.

```bash
git add src/styles/index.css
git commit -m "style: suavizar topo e passos"
```
