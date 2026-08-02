# Protótipo visual da Lista da Casa Nova

## Objetivo

Construir um protótipo visual, navegável e responsivo de uma lista de presentes
para casa nova. A experiência deve priorizar celulares e pessoas com pouca
familiaridade digital, usando linguagem direta e uma ação principal por tela.

O protótipo serve para validar conteúdo, navegação, hierarquia visual, estados
da interface e responsividade. Ele não será uma aplicação de produção e não
terá qualquer integração com backend, banco de dados ou serviço externo.

## Escopo aprovado

- Aplicação estática com React 19, Vite e TypeScript.
- Estilização com Tailwind CSS 4.
- Navegação com React Router e `HashRouter`, compatível com GitHub Pages.
- Catálogo demonstrativo armazenado em fixtures TypeScript.
- Telas públicas e administrativas navegáveis.
- Busca, filtros, diálogos, painéis e feedback visual interativos.
- Estado temporário mantido somente na memória da aba.
- QR Code, Pix e PDF apresentados como prévias demonstrativas.
- Testes unitários, de componentes e ponta a ponta para os principais fluxos.
- CI e implantação estática no GitHub Pages.

## Fora do escopo

- Supabase, PostgreSQL, migrations, RLS ou funções RPC.
- APIs, servidor próprio, Edge Functions ou qualquer outro backend.
- Persistência em `localStorage`, `sessionStorage` ou IndexedDB.
- Autenticação ou autorização reais.
- Reservas concorrentes ou sincronização entre usuários.
- Geração funcional de QR Codes ou documentos PDF.
- Pix real, payload bancário ou integração financeira.
- Download real de arquivos e scraping de links externos.
- Painel administrativo com segurança ou persistência reais.
- Fotos externas de produtos, analytics, cookies, PWA ou Realtime.

## Princípios de produto

O site representa uma lista de presentes, não uma loja virtual nem uma
plataforma de pagamentos. As duas ações públicas mais importantes são:

1. "Quero dar este presente".
2. "Contribuir com qualquer valor".

A interface não usará "assinar" como ação, não exigirá conta de convidado e
não apresentará processos técnicos ou termos de comércio eletrônico.

## Arquitetura

A aplicação será uma SPA estática. O catálogo inicial será composto por dados
fictícios e imutáveis. Um provedor React baseado em `useReducer` manterá apenas
o estado necessário para demonstrar alterações durante a sessão.

```text
fixtures tipadas
      │
      ▼
DemoStateProvider + useReducer
      │
      ├── seletores de catálogo e disponibilidade
      ├── ações simuladas de reserva
      └── ações simuladas de administração
             │
             ▼
        rotas e componentes
```

Recarregar a página sempre restaura os dados originais. Não haverá camada de
persistência, cliente HTTP ou biblioteca para sincronização de dados remotos.
TanStack Query e bibliotecas globais de estado ficam deliberadamente de fora.

As partes mais pesadas ou menos frequentes, como a prévia do PDF e o painel
administrativo, serão carregadas por rota com `React.lazy`.

## Organização por funcionalidade

```text
src/
├── app/
│   ├── App.tsx
│   ├── routes.tsx
│   └── DemoStateProvider.tsx
├── components/
│   ├── layout/
│   └── ui/
├── features/
│   ├── catalog/
│   ├── reservations/
│   ├── collections/
│   ├── pix/
│   ├── pdf/
│   └── admin/
├── data/
│   ├── catalog.ts
│   └── settings.ts
├── domain/
│   ├── types.ts
│   ├── selectors.ts
│   └── demo-reducer.ts
├── test/
└── styles/
```

Cada arquivo terá uma responsabilidade clara. Componentes de funcionalidade
consumirão seletores e ações expostos pelo provedor, sem conhecer detalhes do
reducer.

## Modelo demonstrativo

As fixtures usarão tipos equivalentes aos conceitos do produto:

- `Category`: identificador, nome, slug, ícone e ordem.
- `GiftItem`: código, categoria, nome, descrição, preferências, quantidade,
  estado visual e sugestões.
- `Suggestion`: rótulo, varejista, URL fictícia e indicação de destaque.
- `ShoppingCollection`: título, slug, categoria e URL fictícia.
- `DemoReservation`: token, item, nome, contato opcional, quantidade e status.
- `SiteSettings`: título, mensagem, dados Pix fictícios e rodapé da lista.

O catálogo terá exemplos suficientes para demonstrar cozinha, quarto,
banheiro, lavanderia e itens esgotados. Todo conteúdo sensível ou financeiro
será explicitamente fictício.

## Rotas

| Rota | Finalidade |
| --- | --- |
| `#/` | Catálogo, busca, categorias e chamadas principais |
| `#/item/:code` | Detalhes e início da reserva demonstrativa |
| `#/colecao/:slug` | Coleção fictícia de sugestões externas |
| `#/minha-reserva/:token` | Gerenciamento visual de uma reserva |
| `#/pix` | Contribuição visual com QR e código fictícios |
| `#/pdf` | Prévia visual da lista para impressão |
| `#/admin` | Login ilustrativo e painel demonstrativo |
| `*` | Página de rota não encontrada |

Links profundos devem funcionar por meio do `HashRouter`. Códigos e tokens que
não existirem nas fixtures mostrarão um estado de erro amigável.

## Experiência pública

### Página inicial

- Cabeçalho com título e mensagem acolhedora.
- Explicação curta em "Como funciona".
- Campo de busca por nome, descrição ou preferência.
- Lista horizontal de categorias.
- Controle "Mostrar somente disponíveis".
- Cartões com categoria, nome, preferência curta, disponibilidade e ação.
- Chamada secundária para contribuição por Pix.
- Acesso à prévia da lista para impressão.

No desktop, os cartões formarão uma grade dentro de um contêiner central. No
celular, o fluxo será linear e os filtros permanecerão fáceis de alcançar.

### Detalhes do presente

A rota de detalhes mostrará categoria, disponibilidade, preferências,
possibilidade de produto equivalente e sugestões demonstrativas. A ação
principal será "Quero dar este presente".

Ao navegar a partir do catálogo, a transição deve preservar a sensação de um
painel amplo. Um link profundo abrirá o mesmo conteúdo como página completa.

### Reserva demonstrativa

O formulário pedirá primeiro nome, contato opcional e quantidade. A confirmação
alterará apenas o estado React da sessão e exibirá uma mensagem de sucesso.

O fluxo também terá um cenário explícito de conflito, acionável por um item
marcado para demonstração, e um cenário de item indisponível. Nenhum dado será
enviado ou persistido.

### Gerenciamento da reserva

Uma fixture conterá um token demonstrativo válido. A tela permitirá simular
"Já comprei" e "Cancelar reserva". Tokens desconhecidos apresentarão uma
mensagem clara e um caminho de volta ao catálogo.

### Pix

A tela exibirá nome de destinatário, instituição, QR ilustrativo e uma sequência
fictícia de Pix Copia e Cola. O botão de copiar produzirá apenas feedback
visual; o conteúdo deve permanecer identificado como demonstração.

### PDF

A rota apresentará uma prévia em formato A4 com título, instruções, itens,
espaço para assinatura e QR ilustrativo. O botão de download mostrará uma
mensagem explicando que a exportação não faz parte do protótipo.

## Painel administrativo demonstrativo

A rota administrativa começará com uma tela de login ilustrativa. Ela deve
informar que não existe autenticação real e oferecer uma ação direta para
entrar na demonstração.

O painel terá:

- resumo de itens disponíveis, reservados e recebidos;
- lista de reservas fictícias;
- ações visuais para liberar, marcar como comprado ou recebido;
- listagem de itens e suas disponibilidades;
- formulário visual de configurações do site;
- acesso à prévia para impressão.

Todas as alterações existirão apenas até a próxima atualização da página.

## Sistema visual

- Fundo marfim ou areia muito clara.
- Superfícies brancas e bordas discretas.
- Texto grafite com contraste adequado.
- Terracota como destaque primário.
- Verde-oliva para confirmações e disponibilidade.
- Fonte de sistema, sem requisição externa.
- Ícones simples por categoria, sem fotografias de produtos.
- Sombras suaves e bastante espaço em branco.
- Controles principais com altura mínima de 44 px.
- Corpo de texto com no mínimo 16 px em campos e conteúdo principal.

O protótipo não terá carrossel, menu complexo, animações longas, ações apenas
por ícone, dependência de `hover` ou excesso de cores.

## Componentes compartilhados

Serão criados apenas os componentes necessários:

- `Button`, `Input`, `Textarea` e `Checkbox`;
- `Dialog` e painel de detalhes;
- `Badge`, `Card`, `Toast` e `Skeleton`;
- estados vazios e mensagens de erro;
- cabeçalho, navegação e rodapé.

Os componentes devem aceitar rótulos acessíveis, preservar foco visível e
respeitar `prefers-reduced-motion`.

## Estados e tratamento de erros

O protótipo deve apresentar intencionalmente:

- carregamento inicial por tempo curto e determinístico;
- busca sem resultados;
- categoria sem itens disponíveis;
- item reservado ou recebido;
- conflito visual de reserva;
- token de reserva inválido;
- item, coleção ou rota inexistente;
- confirmação de ação por toast;
- mensagem explícita para funções apenas demonstrativas.

Erros nunca aparecerão como exceções técnicas ou telas em branco.

## Testes e qualidade

### Testes unitários

- busca normalizada por nome, descrição e preferência;
- filtro por categoria e disponibilidade;
- cálculo demonstrativo de disponibilidade;
- transições do reducer para reservar, comprar, cancelar e receber;
- restauração do estado inicial ao recriar o provider.

### Testes de componentes

- cartões apresentam ação e estado corretos;
- formulário possui rótulos, mensagens e foco adequados;
- estados vazios e mensagens de erro são anunciados;
- login administrativo comunica que é apenas uma demonstração.

### Testes ponta a ponta

- navegar e filtrar o catálogo em 360 × 800;
- abrir um item e concluir uma reserva demonstrativa;
- visualizar um conflito;
- gerenciar a reserva de fixture;
- acessar Pix e confirmar a cópia visual;
- abrir a prévia do PDF;
- entrar no painel administrativo demonstrativo;
- abrir links profundos e a rota inexistente;
- repetir os fluxos críticos em Chromium e WebKit.

## CI e implantação

O repositório usará npm e manterá o lockfile versionado. O workflow de CI deve
executar em Pull Requests e na branch principal:

```text
npm ci
npm run format:check
npm run lint
npm run typecheck
npm run test
npm run build
npm run test:e2e
```

Na branch principal, o artefato estático será publicado no GitHub Pages depois
das validações. Nenhum secret ou variável de backend será necessário.

## Critérios de conclusão

- Todas as rotas planejadas são navegáveis por toque e teclado.
- O layout funciona de 360 px até desktop sem rolagem horizontal indevida.
- Os fluxos públicos e administrativos demonstrativos possuem começo, resposta
  visual e caminho de retorno.
- Atualizar a página restaura o catálogo original.
- Nenhuma chamada de rede funcional, banco ou persistência local é usada.
- Nenhum dado Pix, contato ou credencial real existe no código.
- Estados de carregamento, vazio, sucesso, conflito e erro estão representados.
- Os comandos de formatação, lint, tipos, testes, build e E2E são executáveis.
- O build estático é compatível com GitHub Pages.
