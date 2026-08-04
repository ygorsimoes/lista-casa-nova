# Painel administrativo enxuto Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Disponibilizar uma administração real, organizada e delicada para gerenciar presentes e acompanhar reservas.

**Architecture:** A página autenticada passa a consumir uma pequena API administrativa tipada, isolando as consultas e mutações do Supabase da interface. A página deriva resumo, estado e filtros dos presentes e reservas já carregados, sem criar entidades, permissões ou persistência novas.

**Tech Stack:** React 19, TypeScript, Supabase JS, Lucide, CSS e Vitest com Testing Library.

## Global Constraints

- Somente usuários com `app_metadata.role = admin` podem ler nomes de reservas ou alterar presentes.
- O cliente público continua sem sessão persistente e nunca recebe nomes de convidados.
- Sem novas dependências, relatórios, painel demonstrativo ou mudanças de esquema.
- Valor e link são somente referências opcionais.

---

### Task 1: Contrato administrativo real

**Files:**

- Modify: `src/features/admin/admin-api.ts`
- Create: `src/features/admin/admin-api.test.ts`

**Interfaces:**

- Produces `fetchAdminReservations`, `createAdminGift`, `updateAdminGift` e `deleteAdminGift`.
- Consumes o cliente autenticado retornado por `getSupabaseClient`.

- [ ] **Step 1: Escrever os testes que falham**

Cobrir a conversão entre `Gift` e as colunas do banco, criação com dados
opcionais normalizados, atualização pelo identificador e propagação de falha do
Supabase. Cada teste deve observar o payload enviado e o resultado público da
função.

- [ ] **Step 2: Executar os testes vermelhos**

Run: `npx vitest run src/features/admin/admin-api.test.ts`

Expected: FAIL porque as mutações administrativas ainda não existem.

- [ ] **Step 3: Implementar o mínimo para o contrato**

Definir `AdminGiftInput` com os campos editáveis, normalizar vazios para
`null` ou lista vazia e usar `insert`, `update(...).eq('id', id)` e
`delete().eq('id', id)`. Preservar `sort_order` na criação.

- [ ] **Step 4: Executar os testes verdes**

Run: `npx vitest run src/features/admin/admin-api.test.ts`

Expected: PASS.

### Task 2: Comportamentos da página de administração

**Files:**

- Modify: `src/features/admin/AdminPage.tsx`
- Create: `src/features/admin/AdminPage.test.tsx`

**Interfaces:**

- Consumes `AdminGiftInput` e as mutações de `admin-api.ts`.
- Produces interface autenticada com resumo, formulário, busca/filtro, catálogo e reservas.

- [ ] **Step 1: Escrever os testes que falham**

Cobrir: resumo derivado; filtro de itens reservados; abertura de edição com
valores existentes; submissão de edição e atualização da lista; confirmação
antes de remover; reserva associada ao presente correto; estado vazio de
reservas. Mockar somente a borda de rede e manter as interações reais da tela.

- [ ] **Step 2: Executar os testes vermelhos**

Run: `npx vitest run src/features/admin/AdminPage.test.tsx`

Expected: FAIL porque a página atual tem apenas adição por nome e lista simples.

- [ ] **Step 3: Implementar a interface mínima**

Substituir a sequência solta por seções semânticas: cabeçalho, resumo,
formulário, controles de catálogo, lista de presentes e reservas. Usar os
componentes de UI existentes, ícones Lucide e avisos textuais para operações.
Manter a confirmação nativa somente como último recurso; preferir o diálogo de
confirmação do projeto quando compatível.

- [ ] **Step 4: Executar os testes verdes**

Run: `npx vitest run src/features/admin/AdminPage.test.tsx`

Expected: PASS.

### Task 3: Refinamento responsivo e validação integrada

**Files:**

- Modify: `src/styles/index.css`
- Modify: `src/features/admin/AdminPage.tsx` somente se a acessibilidade exigir ajustes pequenos.

**Interfaces:**

- Consumes classes semânticas da página administrativa.
- Produces um painel responsivo, legível e com ações distinguíveis.

- [ ] **Step 1: Ajustar o CSS de forma incremental**

Criar uma hierarquia aberta e leve: faixa de cabeçalho, resumo compacto,
formulário em grade, linhas de catálogo com ações alinhadas e reservas em
ordem clara. Em tela pequena, empilhar campos e manter botões com área de toque
adequada. Não estilizar a administração como cartões de presente.

- [ ] **Step 2: Validar a tela renderizada**

Exercitar no navegador: entrar como administrador, verificar resumo, filtrar o
catálogo, abrir a edição e confirmar a leitura de reservas. Verificar desktop e
uma largura móvel; registrar qualquer limitação de dados sem criar conteúdo de
teste no catálogo real.

- [ ] **Step 3: Validar Supabase e regressões**

Verificar uma leitura administrativa autenticada e a política que limita nomes
de convidados ao administrador. Executar:

```bash
npm run lint
npm run typecheck
npm run build
npm run test
```

Expected: verificações de código passam; a checagem remota confirma catálogo e
reservas no painel sem expor dados de convidados à lista pública.

- [ ] **Step 4: Commit lógico**

```bash
git add src/features/admin src/styles/index.css docs/superpowers/specs/2026-08-04-painel-admin-enxuto-design.md docs/superpowers/plans/2026-08-04-painel-admin-enxuto.md
git commit -m "feat: refinar painel administrativo"
```
