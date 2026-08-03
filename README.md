# Lista da Casa Nova

Protótipo visual, navegável e mobile-first de uma lista de presentes para casa nova. Ele permite avaliar o catálogo, reservas simuladas, coleções, contribuição por Pix, prévia para impressão e painel administrativo sem integrar serviços reais.

![Catálogo do protótipo em uma tela móvel](docs/design/concepts/catalogo-mobile.png)

> [!IMPORTANT]
> Este é somente um protótipo estático. Não há backend, persistência, Pix, PDF nem autenticação reais. Nenhum dado é enviado, salvo ou processado fora da memória temporária da aba.

## Requisitos

- Node.js 24 ou mais recente.
- npm, com o `package-lock.json` versionado como fonte das dependências.

## Uso local

```bash
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

`npm run test` executa os testes unitários e de componentes com cobertura. `npm run test:e2e` gera o build e executa os 61 casos Playwright em Chromium e WebKit. A primeira execução local pode exigir `npx playwright install chromium webkit`.

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

O workflow `CI e GitHub Pages` valida Pull Requests e pushes para `main` com instalação limpa, formatação, lint, tipos, cobertura, build e os testes E2E. Pull Requests nunca publicam. Somente um push aprovado em `main` envia o mesmo diretório `dist` exercitado pelo Playwright e inicia a publicação em [GitHub Pages](https://ygorsimoes.github.io/lista-casa-nova/), sem secrets ou variáveis de backend.

No repositório, configure **Settings → Pages → Build and deployment → Source** como **GitHub Actions**. O deploy remoto só pode ser confirmado depois que o workflow executar no GitHub.
