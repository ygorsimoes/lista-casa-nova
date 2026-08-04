# Ambientes isolados e limpeza da lista real

## Objetivo

Deixar a Lista da Casa Nova pequena, verificável e segura: desenvolvimento usa exclusivamente um projeto Supabase Cloud isolado; a publicação do GitHub Pages, a partir da `main`, usa exclusivamente a configuração do Supabase de produção.

## Limites de escopo

- Preservar os fluxos reais: catálogo público, reserva por nome, Pix, PDF sem nomes e painel administrativo.
- Remover somente o protótipo demonstrativo e suas rotas, dados, componentes e testes que já não participam desses fluxos.
- Não copiar dados de convidados, reservas ou usuários de produção para o ambiente local.
- Não expor chave `service_role`, credenciais de banco ou segredos em arquivos do cliente, commits ou logs.
- Não alterar esquema nem dados de produção nesta etapa. Qualquer migração futura passa primeiro pelo Supabase local e requer aprovação específica antes de `db push` remoto.

## Ambientes

| Contexto                               | Fonte de configuração                             | Banco usado                       | Regra                                                                   |
| -------------------------------------- | ------------------------------------------------- | --------------------------------- | ----------------------------------------------------------------------- |
| Desenvolvimento local                  | `.env.local`, ignorado pelo Git                   | Supabase Cloud de desenvolvimento | Nunca aponta para o projeto de produção.                                |
| Teste de integração de desenvolvimento | variáveis efêmeras do ambiente de desenvolvimento | Supabase Cloud de desenvolvimento | Usa somente dados fictícios e limpa a reserva de teste ao final.        |
| CI de qualidade                        | dublês determinísticos                            | Nenhum banco remoto               | Não recebe variáveis de produção.                                       |
| GitHub Pages em `main`                 | variáveis do ambiente `github-pages`              | Supabase hospedado de produção    | O workflow injeta as variáveis somente no passo de build de publicação. |

## Dados e autenticação local

As migrações, inclusive a migração de catálogo inicial já existente, ficam versionadas; `.env.local` continua ignorado. O Auth de desenvolvimento aceita apenas um usuário administrador próprio, criado no painel desse projeto e com `app_metadata.role = "admin"`. Nenhuma conta, reserva ou dado de produção é reutilizado.

## Estratégia de testes

- Vitest cobre contratos de catálogo, reserva, Pix, PDF e administração com dublês pequenos e determinísticos.
- Playwright cobre a jornada pública e o painel com uma API local controlada, sem dependência de produção nem captura visual redundante.
- Um comando de integração valida o projeto Cloud de desenvolvimento, confirma migrações e prova as permissões de reserva e de administrador. Ele nunca recebe a configuração de produção.
- A publicação continua dependente da CI, mas nenhum teste normal faz escrita na instância hospedada.

## Critério de pronto

Em uma máquina nova, os comandos documentados apontam para o projeto Cloud de desenvolvimento, entregam catálogo e reserva reais com dados fictícios, e executam a suíte essencial. A `main` faz build do Pages com variáveis de produção configuradas apenas no ambiente protegido do GitHub.
