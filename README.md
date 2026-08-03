# Lista da Casa Nova

Protótipo visual, navegável e mobile-first de uma lista de presentes para casa nova. Ele permite avaliar o catálogo, reservas simuladas, coleções, contribuição por Pix, prévia para impressão e painel administrativo sem integrar serviços reais.

![Catálogo do protótipo em uma tela móvel](docs/design/concepts/catalogo-mobile.png)

> [!IMPORTANT]
> Este é somente um protótipo estático. Não há backend, persistência, Pix, PDF nem autenticação reais. Nenhum dado é enviado, salvo ou processado fora da memória temporária da aba.

## Requisitos

- Node.js `>=24.15.0 <25`. O `.nvmrc` seleciona a versão disponível mais recente da linha LTS 24.
- npm, com o `package-lock.json` versionado como fonte das dependências.
- O binário `tsc` vem do TypeScript nativo 7.0.2. O pacote de compatibilidade `@typescript/typescript6@6.0.2` permanece instalado no nome `typescript` para fornecer a API da linha 6 exigida pelo `typescript-eslint@8.65.0`.

## Uso local

```bash
nvm install
nvm use
npm ci
npm run dev
```

O Vite informa o endereço local. Para validar o build usado pelo GitHub Pages:

```bash
npm run build
npm run preview
```

## Comandos de qualidade

```bash
npm run format:check
npm run lint
npm run typecheck
npm run test
npm run build
npm run test:e2e
```

`npm run test` executa os testes unitários e de componentes com cobertura. `npm run test:e2e` gera o build e executa os 69 casos Playwright em Chromium móvel, WebKit móvel e Chromium desktop. Depois de `npm ci`, a primeira execução local pode exigir `npx --no-install playwright install chromium webkit`.

## Rotas

| Rota                     | Finalidade                            |
| ------------------------ | ------------------------------------- |
| `#/`                     | Catálogo, busca, categorias e filtros |
| `#/item/:code`           | Detalhes e reserva demonstrativa      |
| `#/colecao/:slug`        | Coleção fictícia de sugestões         |
| `#/minha-reserva/:token` | Gerenciamento visual da reserva       |
| `#/pix`                  | Contribuição e QR ilustrativos        |
| `#/pdf`                  | Prévia A4 sem geração de arquivo      |
| `#/admin`                | Login e painel demonstrativos         |

O `HashRouter` mantém as rotas profundas compatíveis com o subdiretório `/lista-casa-nova/` do GitHub Pages.

## Cenários determinísticos

| Cenário                     | Identificador                 |
| --------------------------- | ----------------------------- |
| Item disponível             | `CZ-001` — Chaleira           |
| Item parcialmente reservado | `CZ-003` — Potes herméticos   |
| Conflito de reserva         | `CZ-004` — Cafeteira elétrica |
| Item indisponível           | `LV-001` — Cesto de roupas    |
| Item recebido               | `BN-002` — Jogo de toalhas    |
| Categoria sem disponíveis   | `decoracao`                   |
| Reserva válida              | `reserva-demo-valida`         |
| Reserva inválida            | `reserva-inexistente`         |
| Coleção válida              | `sugestoes-cozinha`           |
| Coleção inválida            | `colecao-inexistente`         |

Atualizar a página restaura todos os dados iniciais do protótipo.

## CI e GitHub Pages

O workflow `CI` valida Pull Requests para `main`, pushes em `main` e execuções manuais. O job `quality` executa instalação limpa, auditoria de produção, formatação, lint, tipos, cobertura e build; o job `e2e` repete a instalação e o build em runner limpo e executa Playwright. Um caso que só passe no retry é tratado como falha, com relatório e traces anexados ao job.

Pull Requests não criam job de deploy. Depois que `quality` e `e2e` aprovam um push no commit atual de `main`, o workflow `GitHub Pages` reconstrói esse mesmo SHA pelo lockfile e publica `dist` em [GitHub Pages](https://ygorsimoes.github.io/lista-casa-nova/). O workflow também permite republicar manualmente o commit atual de `main`; outras branches não são elegíveis.

No repositório, **Settings → Pages → Build and deployment → Source** permanece configurado como **GitHub Actions**. A publicação não usa secrets nem variáveis de backend.
