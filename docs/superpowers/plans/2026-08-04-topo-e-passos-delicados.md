# Topo e passos delicados Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Tornar a primeira dobra mais compacta e transformar os três passos em uma jornada contínua, amigável, delicada e estática.

**Architecture:** A `HeroSection` mantém a mesma marcação semântica de lista, com o fechamento textual "Obrigado". A alteração é limitada às classes existentes no CSS global, usando uma linha, pontos e ícones discretos em vez de cartões, sem impacto em reservas ou dados.

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

Compactar o espaçamento da hero e redefinir a faixa como uma jornada contínua:

```css
.catalog-hero {
  gap: 1rem;
}
.journey-steps {
  position: relative;
  display: grid;
  gap: 1rem;
  background: transparent;
}
.journey-steps::before {
  background: linear-gradient(to right, transparent, rgb(151 77 57 / 0.32), transparent);
}
.journey-steps li {
  background: transparent;
  padding: 0.15rem 0;
}
```

Manter ícones em círculos claros, usar um coração no fechamento "Obrigado" e garantir linha vertical em telas pequenas e horizontal em telas largas.

- [ ] **Step 4: Validar renderização e comportamento**

Run: `npm run lint && npm run typecheck && npm run build && npm run test`

Expected: todos os comandos passam; a faixa segue estática e não altera a reserva.

- [ ] **Step 5: Revisar no navegador local e registrar o commit**

Verificar que o topo traz a grade à primeira dobra e que os três cartões não parecem etapas de formulário.

```bash
git add src/styles/index.css
git commit -m "style: suavizar topo e passos"
```
