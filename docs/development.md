# Desenvolvimento

## Ambientes

- Desenvolvimento usa exclusivamente o projeto Supabase Cloud de desenvolvimento.
- Produção é publicada pela `main` no GitHub Pages e recebe suas variáveis apenas no ambiente protegido `github-pages`.
- Nunca copie reservas, usuários ou dados pessoais de produção para desenvolvimento.

## Preparação local

1. Copie `.env.example` para `.env.local` somente se ele ainda não existir.
2. Para o Vite em desenvolvimento, crie ou atualize `.env.development.local` com a URL e a chave publicável do projeto de desenvolvimento.
3. No diretório do repositório, vincule o CLI ao projeto de desenvolvimento: `supabase link --project-ref <referencia-do-projeto-de-desenvolvimento>`.
4. Aplique as migrações: `supabase db push --linked`.
5. No painel do Supabase de desenvolvimento, crie um usuário exclusivo para testes administrativos e defina `app_metadata.role` como `admin`.
6. Rode `npm run dev`.

## Verificação antes de publicar

1. Confirme que o CLI está vinculado ao projeto de desenvolvimento antes de qualquer comando de banco.
2. Rode `supabase db push --linked --dry-run` antes de aplicar migrações nesse projeto.
3. Para produção, revise o diff e peça aprovação explícita antes de vincular o CLI ao projeto de produção ou aplicar uma migração.
4. Cadastre no ambiente GitHub `github-pages` as cinco variáveis `VITE_*` de produção. Elas não devem ser adicionadas ao Git.
