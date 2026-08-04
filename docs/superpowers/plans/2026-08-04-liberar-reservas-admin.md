# Liberação de Reservas no Painel Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Permitir que o administrador libere uma reserva por engano, com confirmação, data legível e atualização imediata da lista.

**Architecture:** `admin-api.ts` concentra a exclusão autenticada da reserva. `AdminPage` mantém o item a liberar no estado e usa o diálogo compartilhado para confirmação; após o sucesso, recarrega catálogo e reservas. A formatação de data fica em uma função local pura, coberta por teste.

**Tech Stack:** React, TypeScript, Supabase JS, Vitest e Testing Library.

## Global Constraints

- Apenas sessão com `app_metadata.role = "admin"` pode excluir uma reserva.
- Nenhum fluxo público, PDF ou Pix ganha ação de liberação.
- Confirmar antes de excluir e manter a reserva visível quando ocorrer erro.
- Não criar histórico, novas tabelas ou permissões públicas.

---

### Task 1: Expor a remoção administrativa de reserva

**Files:**

- Modify: `src/features/admin/admin-api.ts`
- Test: `src/features/admin/admin-api.test.ts`

**Interfaces:**

- Produces: `deleteAdminReservation(giftId: string): Promise<void>`.
- Consumes: `getSupabaseClient().from('reservations').delete().eq('gift_id', giftId)`.

- [ ] **Step 1: Escrever o teste que falha**

```ts
it('libera a reserva do presente indicado', async () => {
  const deleteEq = vi.fn().mockResolvedValueOnce({ error: null })
  remove.mockReturnValueOnce({ eq: deleteEq })

  await deleteAdminReservation('gift-2')

  expect(from).toHaveBeenCalledWith('reservations')
  expect(deleteEq).toHaveBeenCalledWith('gift_id', 'gift-2')
})
```

- [ ] **Step 2: Confirmar falha**

Run: `npm run test:unit -- src/features/admin/admin-api.test.ts`

Expected: falha porque `deleteAdminReservation` ainda não existe.

- [ ] **Step 3: Implementar o mínimo**

```ts
export async function deleteAdminReservation(giftId: string) {
  const { error } = await getSupabaseClient().from('reservations').delete().eq('gift_id', giftId)
  if (error) throw error
}
```

- [ ] **Step 4: Confirmar sucesso**

Run: `npm run test:unit -- src/features/admin/admin-api.test.ts`

Expected: todos os testes do módulo passam.

### Task 2: Confirmar e refletir a liberação no painel

**Files:**

- Modify: `src/features/admin/AdminPage.tsx`
- Test: `src/features/admin/AdminPage.test.tsx`

**Interfaces:**

- Consumes: `deleteAdminReservation`, `refresh()` e `loadAdminData()`.
- Produces: botão `Liberar presente`, diálogo `Liberar reserva` e texto de confirmação.

- [ ] **Step 1: Escrever os testes que falham**

```tsx
it('mostra a data da reserva e só libera após confirmação', async () => {
  renderPage()
  await screen.findByText('Reservado por Marina em 4 de agosto')

  fireEvent.click(screen.getByRole('button', { name: 'Liberar Jogo de toalhas' }))
  expect(screen.getByRole('heading', { name: 'Liberar reserva' })).toBeInTheDocument()
  fireEvent.click(screen.getByRole('button', { name: 'Liberar presente' }))

  expect(mocks.deleteAdminReservation).toHaveBeenCalledWith('gift-2')
  expect(mocks.refresh).toHaveBeenCalled()
  expect(await screen.findByRole('status')).toHaveTextContent(
    'Reserva liberada; o presente voltou a ficar disponível.',
  )
})
```

- [ ] **Step 2: Confirmar falha**

Run: `npm run test:unit -- src/features/admin/AdminPage.test.tsx`

Expected: falha porque não existe ação, diálogo nem data formatada.

- [ ] **Step 3: Implementar estado, formatação e atualização**

Adicionar `reservationToRelease`, `formatReservationDate(createdAt)` com `Intl.DateTimeFormat('pt-BR', { day: 'numeric', month: 'long' })` e `releaseReservation()`. A função chama `deleteAdminReservation`, depois `Promise.all([refresh(), loadAdminData()])`, fecha o diálogo e define a mensagem de sucesso.

- [ ] **Step 4: Aplicar hierarquia visual**

No item de reserva, manter presente em destaque, nome e data como texto auxiliar e botão `ghost` de liberação na extremidade. No CSS existente, aplicar espaçamento mínimo entre metadados e ação, preservando o empilhamento mobile.

- [ ] **Step 5: Confirmar sucesso**

Run: `npm run test:unit -- src/features/admin/AdminPage.test.tsx`

Expected: data, diálogo, exclusão e atualização passam; os testes existentes de criação, edição e filtro continuam verdes.

### Task 3: Validar permissão e qualidade

**Files:**

- Test: `src/features/admin/admin-api.test.ts`, `src/features/admin/AdminPage.test.tsx`

- [ ] **Step 1: Verificar erro de exclusão**

Adicionar um teste que configure `delete().eq()` com erro e confirme que `releaseReservation()` não mostra sucesso nem remove a linha.

- [ ] **Step 2: Rodar verificações completas**

Run: `npm run lint && npm run typecheck && npm run test && npm run build && npm run test:e2e && npm run test:integration:dev`

Expected: todos passam; a integração continua confirmando que visitantes não leem nomes de reservas.

- [ ] **Step 3: Revisar antes de integrar**

Run: `git diff --check && git diff -- src/features/admin src/styles/index.css`

Expected: apenas a ação administrativa, data, polimento e testes relacionados.
