# Polimento afetivo editorial da UI e UX

## Status

Design aprovado em 3 de agosto de 2026. Este documento consolida a direção
visual **B — afetiva editorial** e substitui apenas as decisões de apresentação
e experiência do protótipo original. A arquitetura funcional, os dados
fictícios e os limites demonstrativos continuam válidos.

## Resumo

A Lista da Casa Nova deve parecer uma lista pessoal preparada por um casal, não
um catálogo comercial. A pessoa chega geralmente com um presente em mente,
encontra esse item rapidamente, reconhece se ele ainda está disponível e
conclui uma reserva simples em seu nome.

A experiência inteira continua organizada em três passos:

1. escolher um presente;
2. reservar em seu nome;
3. combinar a entrega.

O refinamento reaproveita a aplicação atual e atua sobre hierarquia, linguagem,
tipografia, espaçamento, componentes, foco e estados. Não haverá reconstrução
da aplicação nem expansão funcional.

Alterações locais não relacionadas que já existam no worktree ficam fora do
escopo deste design e de sua implementação. Este trabalho não adicionará
dependências de produção nem de desenvolvimento.

## Problemas observados no estado atual

- O bloco inicial ocupa a maior parte da primeira tela em 360 px e empurra a
  busca e os presentes para baixo.
- No desktop, o título e o bloco “Como funciona” também impedem que o catálogo
  apareça na primeira viewport.
- Cartões brancos elevados, badges e botões terracota repetidos aproximam a
  interface de um marketplace.
- O cabeçalho esconde o texto da marca em telas estreitas e deixa apenas o
  coração e o acesso a Pix.
- Os presentes repetem ícones genéricos de categoria e carecem de contexto
  visual próprio.
- Ao iniciar uma reserva, o formulário é acrescentado abaixo do detalhe e pode
  aparecer fora da área visível, sem uma transição clara de etapa.
- Pix, sugestões de varejistas e ações administrativas recebem mais peso visual
  do que a jornada principal exige.
- A prévia A4 fica comprimida no celular.
- O CSS acumulou regras duplicadas para detalhes de presente e hierarquias
  visuais inconsistentes.
- Alguns títulos de rota removem o contorno de foco, contrariando o requisito
  de foco visível.

## Objetivos

- Tornar a ação principal compreensível no primeiro contato com a tela.
- Permitir que alguém encontre “jogo de panelas”, “toalhas” ou outro presente
  que já tinha em mente sem aprender a interface.
- Fazer disponibilidade e indisponibilidade serem reconhecíveis antes de abrir
  o item.
- Criar uma estética simples, delicada, acolhedora e bem acabada.
- Reduzir sinais visuais de loja, vitrine, checkout ou marketplace.
- Manter os três passos como toda a explicação necessária para a jornada.
- Melhorar foco, leitura, toque, responsividade e tratamento de estados.
- Reaproveitar rotas, fixtures, estado, seletores, reducer e componentes atuais.

## Fora do escopo

- Backend, banco de dados, APIs ou sincronização entre pessoas.
- `localStorage`, `sessionStorage`, IndexedDB ou qualquer persistência local.
- Autenticação e autorização reais.
- Pix, QR Code, PDF, cópia, download ou links de varejistas funcionais.
- Fotos, preços, carrinho, checkout, comparação de produtos ou avaliações.
- Novas áreas de produto, analytics, relatórios ou gestão avançada.
- Novas dependências de interface, ícones ou fontes.
- Alteração da regra de disponibilidade derivada das reservas.

## Direção escolhida

### B — afetiva editorial

A direção escolhida combina uma camada afetiva contida com controles muito
objetivos. Títulos de contexto usam uma fonte serifada do sistema; busca,
filtros, botões, formulários e informações operacionais permanecem em uma fonte
sem serifa do sistema.

Emojis identificam categorias e presentes e acrescentam calor visual. Ícones
Lucide continuam reservados a ações, navegação, avisos e passos. A interface não
usa fotografia, ilustração pesada ou decoração sem função.

### Alternativas descartadas

- **Refino fiel:** seria a mudança de menor risco, mas conservaria parte da
  aparência de catálogo comercial e não criaria contexto afetivo suficiente.
- **Essencial delicada:** seria ainda mais minimalista, porém retiraria sinais
  de acolhimento que ajudam a diferenciar esta lista de uma ferramenta genérica.

## Princípios de experiência

1. **Uma intenção, uma ação:** cada tela evidencia somente a decisão necessária
   naquele momento.
2. **Lista, não loja:** não há preços, fotos, promoções, botões de compra ou uma
   grade de produtos elevada.
3. **Uma etapa por vez:** detalhe, reserva e confirmação ocupam o mesmo contexto
   sem crescer indefinidamente para baixo.
4. **Afeto com moderação:** serifas e emojis criam personalidade sem reduzir
   legibilidade ou objetividade.
5. **Estado sempre explícito:** disponibilidade, erro, conflito e sucesso são
   comunicados por texto, não apenas por cor, emoji ou toast.
6. **Apoio não compete:** Pix, impressão, referências e administração continuam
   acessíveis, mas não disputam atenção com escolher e reservar.

## Jornada pública principal

```text
Nossa lista
    │
    ├── busca e filtros ──► presente já escolhido por outra pessoa
    │                              └── detalhe informativo, sem reserva
    │
    └── presente disponível
            └── detalhe
                  └── reservar em seu nome
                        ├── erro ou conflito no mesmo contexto
                        └── confirmação
                              └── combinar a entrega
```

O catálogo continua sendo a entrada principal. A pessoa não precisa criar
conta, escolher loja, informar endereço ou concluir pagamento.

## Experiência detalhada

### Cabeçalho

- A identidade textual **“Nossa lista”** permanece visível inclusive em 360 px.
- O coração continua como marca decorativa e acompanha o texto, em vez de
  substituí-lo.
- A única ação secundária no cabeçalho público é **“Contribuir”**, levando à
  rota demonstrativa de Pix.
- O cabeçalho é compacto e não usa navegação de marketplace.
- Nas rotas internas, o retorno usa “Nossa lista” ou “Voltar à lista” e mantém a
  origem clara.

O título editável das configurações continua alimentando o título principal e
a impressão. A identidade curta “Nossa lista” é fixa para permanecer estável e
reconhecível.

### Entrada e explicação dos três passos

- O conteúdo começa com a linha **“Um novo capítulo começa aqui ✨”**. A estrela
  é decorativa e fica em um elemento com `aria-hidden="true"`.
- O título principal continua **“Lista da nossa casa nova”**, vindo das
  configurações demonstrativas.
- A mensagem é curta e acolhedora. O novo valor inicial da fixture é
  **“Escolha com carinho algo que você já imaginou para o nosso lar.”**;
  `settings.message` continua sendo a fonte renderizada e permanece editável na
  administração demonstrativa.
- Os três passos aparecem em um único bloco compacto, com números pequenos,
  ícones Lucide e frases curtas.
- O título isolado “Como funciona” pode ser ocultado visualmente; o nome
  acessível do bloco continua presente.
- Pix e impressão deixam de ocupar links de destaque dentro do hero. Pix já
  está no cabeçalho; impressão fica como ação de apoio no rodapé e no painel.

Com as fixtures iniciais, em 360 × 800, identidade, título, três passos, busca e
o começo útil do catálogo devem aparecer na primeira viewport. Categoria, nome,
estado e ação “Ver” do primeiro item precisam estar inteiramente dentro desses
800 px, sem rolagem inicial. Textos editados no painel continuam responsivos e
sem overflow, mas não precisam preservar essa dobra quando forem mais longos.

### Busca e filtros

- A busca aparece imediatamente depois dos três passos e é o controle de maior
  destaque antes da lista.
- Rótulo acessível: **“Buscar um presente”**.
- Placeholder: **“Buscar: panelas, toalhas, quarto...”**.
- A busca continua cobrindo nome, descrição e preferências por meio do seletor
  existente.
- As categorias são chips horizontais com emoji e texto: `✨ Todos`,
  `🍳 Cozinha`, `🛏️ Quarto`, `🛁 Banheiro`, `🧺 Lavanderia` e
  `💡 Decoração`.
- A faixa de chips pode rolar horizontalmente sem criar overflow no documento.
- O filtro de disponibilidade usa o texto curto **“Só disponíveis”**.
- O estado selecionado continua exposto semanticamente por `aria-pressed` ou
  pelo controle nativo correspondente.
- A contagem usa linguagem de lista: **“11 ideias para escolher”**, ajustada à
  quantidade encontrada, em vez de linguagem de estoque ou resultados de loja.

### Lista de presentes

- A apresentação deixa de ser uma grade de tiles comerciais e passa a ser uma
  lista editorial contínua em todos os tamanhos.
- No celular, cada item é uma linha compacta com visual, categoria, nome,
  preferência curta, estado e ação.
- No desktop, a lista ganha respiro e largura, mas não se divide em uma grade de
  produtos.
- As superfícies são planas, com borda discreta e sem sombra recorrente.
- Cada item recebe um emoji próprio em um fundo suave. O mapeamento visual fica
  na camada de apresentação, com fallback por categoria, sem alterar
  disponibilidade ou regras de domínio.
- A categoria aparece como apoio; o nome é a informação principal.
- As preferências são resumidas com separadores simples, sem especificações de
  e-commerce.
- O estado público usa:
  - **“Disponível”** quando toda a quantidade pode ser reservada;
  - **“N de M disponíveis”** quando ainda resta parte da quantidade;
  - **“Já foi escolhido”** quando não há quantidade restante, seja o item
    reservado, comprado ou recebido.
- Estados internos específicos continuam disponíveis na administração e no
  gerenciamento da reserva.
- A ação visual do item é sempre **“Ver”**, acompanhada de chevron Lucide. Seu
  nome acessível inclui o presente, por exemplo “Ver Jogo de panelas”.
- Itens já escolhidos continuam navegáveis e ficam levemente atenuados, mas não
  dependem da opacidade para comunicar o estado.
- O botão sólido “Quero dar este presente” não aparece na lista.

Mapeamento inicial dos emojis dos presentes:

| Código   | Presente           | Emoji |
| -------- | ------------------ | ----- |
| `CZ-001` | Chaleira           | 🫖    |
| `CZ-002` | Jogo de panelas    | 🍳    |
| `CZ-003` | Potes herméticos   | 🫙    |
| `CZ-004` | Cafeteira elétrica | ☕    |
| `QT-001` | Jogo de cama queen | 🛏️    |
| `QT-002` | Travesseiros       | ☁️    |
| `BN-001` | Kit lavabo         | 🧴    |
| `BN-002` | Jogo de toalhas    | 🛁    |
| `LV-001` | Cesto de roupas    | 🧺    |
| `LV-002` | Varal de chão      | 👕    |
| `DC-001` | Luminária de mesa  | 💡    |

Todos esses emojis são decorativos e ficam ocultos da árvore de acessibilidade.

### Detalhe do presente

O detalhe continua abrindo como painel sobre o catálogo quando há uma rota de
origem e como página completa em link profundo. Os dois contextos renderizam o
mesmo conteúdo.

- O topo indica **“1 de 3 · Escolha”**.
- Emoji, categoria, título serifado e estado aparecem juntos.
- “Nossa preferência” organiza os atributos principais em um bloco curto.
- Descrição e aceitação de equivalentes formam um único texto humano.
- A sugestão comercial vira **“Ver uma referência opcional”**, sem foto, preço,
  loja destacada ou URL executável.
- Selecionar a referência apenas mostra um aviso persistente de demonstração.
- O único CTA sólido desta etapa é **“Quero dar este presente”**.
- Quando o item já foi escolhido, o detalhe permanece legível, elimina o CTA e
  explica: **“Este presente já foi escolhido por outra pessoa.”**

### Reserva em seu nome

Ao acionar o CTA, o detalhe é substituído dentro do mesmo painel ou página. O
formulário não é acrescentado abaixo dele.

- O topo passa a indicar **“2 de 3 · Reserve”**.
- O retorno **“Ver detalhes”** volta à etapa anterior sem fechar o painel.
- Um resumo compacto mantém emoji, nome e disponibilidade do presente.
- O único campo obrigatório é **“Seu primeiro nome”**, com placeholder
  **“Como podemos chamar você?”**.
- O contato opcional começa recolhido sob **“Adicionar contato opcional”** e usa
  um controle com `aria-expanded` e `aria-controls`.
- Primeiro nome é o único dado que exige preenchimento manual. Quantidade começa
  com o valor válido `1` e aparece como escolha somente quando há mais de uma
  unidade restante. Quando há uma única unidade, `1` é enviado sem mostrar o
  campo.
- O texto de privacidade informa que o nome não será exibido para outras
  pessoas.
- A tela informa permanentemente que nada é enviado ou salvo.
- **“Confirmar reserva”** é a ação principal; **“Agora não”** é secundária.
- Ao entrar nesta etapa, o primeiro campo recebe foco.

Os valores do formulário permanecem em estado local enquanto o painel estiver
aberto. Voltar ao detalhe e retornar à reserva, ou receber um conflito, não
apaga o primeiro nome já digitado.

“Ver detalhes” e “Agora não” executam o mesmo retorno sem perda de dados. O
primeiro oferece navegação no topo; o segundo oferece a alternativa secundária
ao final do formulário. Há somente uma ação primária na etapa.

### Confirmação

Depois de uma reserva demonstrativa bem-sucedida, o mesmo contexto mostra uma
confirmação persistente:

- linha **“Reserva confirmada”**;
- título **“Este presente ficou com você”**;
- confirmação do nome do presente;
- bloco explícito **“3 · Combine a entrega”** com uma orientação breve;
- ação principal **“Ver minha reserva”**;
- ação secundária **“Voltar para a lista”**;
- aviso de que recarregar restaura o estado inicial.

O foco vai para o título da confirmação. Toast pode reforçar a ação, mas nunca
é a única confirmação.

### Gerenciamento da reserva

- A tela mostra somente o presente, a quantidade, o estado e o próximo passo.
- O próximo passo é **“Combine a entrega”**.
- Enquanto a reserva estiver ativa, as únicas ações são **“Já comprei”** e
  **“Cancelar minha reserva”**.
- O cancelamento sempre exige confirmação em diálogo.
- Depois de marcar como comprado ou cancelar, o novo estado recebe foco e fica
  escrito na página.
- Token inválido apresenta erro humano e retorno para a lista.

### Pix demonstrativo

- Pix é apresentado como **“Outra forma de presentear ✨”**, nunca como checkout.
- A rota mantém chave, QR, destinatário, instituição e simulação de cópia
  fictícios.
- Chave e QR ficam reunidos em uma única superfície compacta.
- O aviso de demonstração é curto, persistente e usa o componente comum de
  aviso.
- O feedback de cópia permanece textual na página; toast é apenas reforço.
- Nenhuma transferência é processada e nenhum valor real é copiado.

### Prévia para impressão

- A rota continua oferecendo filtros “Todos” e “Disponíveis” e download
  simulado.
- A prévia preserva proporção e estrutura de uma folha A4.
- Em telas estreitas, a folha inteira é reduzida proporcionalmente dentro de um
  contêiner; a tabela não é convertida em cartões comprimidos.
- A folha reduzida é uma miniatura visual, não a única forma de consultar os
  itens. Filtros, aviso e um resumo textual com quantidade e retorno à lista
  permanecem em tamanho legível; a estrutura semântica da folha continua
  disponível a tecnologias assistivas e ao zoom do navegador.
- A versão impressa continua usando dimensões próprias em `print.css`.
- O aviso de que nenhum PDF ou arquivo é gerado permanece visível.

### Coleções e referências

- Coleções deixam de ser um destino principal e não recebem chamada no catálogo.
- As referências opcionais ficam dentro do detalhe do presente.
- A rota `#/colecao/:slug` é preservada para não quebrar links profundos e
  testes existentes, mas recebe apresentação secundária e aviso demonstrativo.
- Não há fotos, preços, destaque de varejista ou navegação externa.

### Painel administrativo demonstrativo

O painel mantém exatamente as informações e ações atuais: resumo, presentes,
reservas e configurações.

- A estética é mais sóbria que a área pública, mas usa a mesma paleta, raios e
  tipografia serifada nos títulos de contexto.
- Ações e estados administrativos usam Lucide, sem emojis decorativos.
- Painéis e métricas são planos; sombras ficam reservadas a diálogos.
- A navegação indica visual e semanticamente a seção ativa, usando
  `aria-current="location"` no controle correspondente.
- Selecionar uma seção rola até ela e move o foco para o título correspondente.
- Ações comuns são secundárias. Liberar ou cancelar exige confirmação explícita.
- No celular, a barra lateral vira uma navegação compacta de salto para Resumo,
  Presentes, Reservas e Configurações. Não são criadas novas abas ou rotas.
- O aviso “Modo demonstração — alterações não são salvas” permanece persistente.
- Login, configurações e operações continuam totalmente fictícios.

## Sistema visual

### Cores

A paleta atual é preservada e normalizada em tokens reutilizáveis:

- areia de fundo: `#fbf8f1`;
- areia de apoio: `#f3ecdf`;
- grafite principal: `#211f1d`;
- grafite secundário: `#3f3b37`;
- terracota principal: `#a94f34`;
- terracota escuro: `#995039`;
- oliva principal: `#6f7b52`;
- oliva escuro: `#4d5838`;
- bordas neutras derivadas da paleta, sempre com contraste perceptível.

Terracota identifica ação principal e foco. Oliva reforça disponibilidade e
sucesso, sempre acompanhado de texto. Não serão adicionadas novas famílias de
cor para estados equivalentes.

### Tipografia

- Títulos afetivos usam a pilha local
  `ui-serif, Georgia, Cambria, "Times New Roman", serif`.
- Corpo, filtros, botões, campos e dados usam
  `ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`.
- Não há download de fonte externa.
- A serifa é aplicada somente a títulos de contexto, não a controles ou textos
  longos.
- O título principal usa aproximadamente 40 px em 360 px e cresce até o máximo
  de 60 px no desktop; títulos internos ficam entre 30 e 34 px.
- Corpo e campos permanecem em 16 px; informações auxiliares não ficam menores
  que 14 px na interface real.
- Escalas evitam títulos gigantes: o título principal deve caber com conforto
  em 360 px e não dominar a viewport no desktop.

### Formas, espaçamento e elevação

- A escala de espaçamento usa 4, 8, 12, 16, 24, 32 e 48 px.
- Controles usam raio de 12 px, itens e painéis usam 16 px e sobreposições usam
  24 px.
- Bordas discretas separam itens; cartões não flutuam como produtos.
- Sombras são removidas de listas, métricas e blocos recorrentes.
- Uma única sombra suave de overlay fica reservada a diálogos, painéis modais e
  confirmações.
- A escala reduz áreas vazias sem comprimir a leitura.

### Ícones e emojis

- Lucide continua sendo a única biblioteca de ícones e já faz parte do projeto.
- Ícones funcionais sempre têm texto ou nome acessível.
- Emojis aparecem somente em categorias, presentes e pequenos detalhes afetivos.
- Emojis não representam ações, validação, disponibilidade ou gravidade.
- Nenhum significado necessário depende da aparência do emoji no sistema
  operacional.

### Hierarquia de botões

- `primary`: uma ação decisiva por contexto; sólido em terracota.
- `secondary`: alternativa segura, com superfície clara e borda discreta.
- `ghost`: navegação ou referência de baixo peso.
- `danger`: ação destrutiva somente após confirmação e com texto explícito.

Na lista, “Ver” tem aparência de link de ação e não de CTA preenchido.

## Arquitetura e reutilização

### Base preservada

- React, Vite, TypeScript e `HashRouter`.
- `DemoStateProvider`, `useReducer`, ações e fixtures existentes.
- Seletores de catálogo, busca e disponibilidade.
- Rotas públicas, administrativas e carregamento tardio de PDF/admin.
- Componentes de formulário, diálogo, confirmação e feedback existentes.
- Estado somente em memória; recarregar restaura as fixtures.

A disponibilidade continuará sendo calculada por `selectAvailability` a partir
das reservas com estado `reserved`, `purchased` ou `received`. Nenhum campo de
disponibilidade será adicionado a `GiftItem`.

### Ajustes compartilhados planejados

- **`GiftVisual`:** encapsula o mapeamento de emoji por código e o fallback por
  categoria. Renderiza apenas conteúdo decorativo e oferece tamanhos de lista,
  detalhe e resumo.
- **`Notice`:** unifica avisos informativos, demonstrativos, de sucesso e de
  erro. O chamador define se o conteúdo usa `role="status"`, `role="alert"` ou
  apenas texto estático.
- **`Card`:** recebe uma variante plana. Listas, métricas e painéis recorrentes
  usam essa apresentação; elevação fica somente nos componentes de overlay. A
  API atual permanece compatível durante a migração dos consumidores.
- **`Button`:** mantém as variantes atuais, mas recebe hierarquia visual e uso
  consistentes. Nenhuma variante nova é necessária.

`GiftDetailsContent` é estendido como coordenador local do fluxo. Ele passa a
ser dono de `phase`, rascunho do formulário e expansão do contato;
`ReservationForm` recebe valores e callbacks controlados. O reducer global
continua responsável apenas pela tentativa de reserva e pelo resultado de
domínio demonstrativo.

### Limpeza direcionada de estilos

- Consolidar tokens de cor, tipografia, raio, espaçamento e sombra no início de
  `src/styles/index.css`.
- Unificar os blocos duplicados de `.gift-details`.
- Organizar regras por componente e manter media queries próximas ou claramente
  agrupadas.
- Remover regras de `outline: none` dos títulos focáveis.
- Não migrar o sistema de estilos nem fazer refatoração sem relação com este
  polimento.

## Fluxo de dados e estado

1. `CatalogPage` mantém busca, categoria e disponibilidade em estado local.
2. `selectCatalogEntries` normaliza a busca e combina presentes, categorias e
   disponibilidade derivada.
3. `GiftVisual` acrescenta somente apresentação; não altera a entrada de
   catálogo.
4. Abrir “Ver” navega para `/item/:code`, preservando `backgroundLocation`
   quando a origem é o catálogo.
5. O detalhe inicia na fase `detail`.
6. “Quero dar este presente” limpa qualquer resultado antigo, marca a tentativa
   atual, muda a fase local para `reservation` e move foco para o primeiro nome.
7. Validação inválida permanece local e foca o primeiro campo com erro.
8. Envio válido chama a ação `reserveGift` existente.
9. Apenas o resultado correspondente ao item e à tentativa atual é consumido.
   Sucesso muda a fase para `confirmation`; conflito ou indisponibilidade
   permanecem na fase de reserva com aviso persistente.
10. O token gerado continua levando ao gerenciamento demonstrativo.
11. Fechar o painel devolve foco à ação “Ver” do item de origem e preserva
    busca, filtros e posição de rolagem do catálogo.
12. Fechar ou abandonar o detalhe descarta o rascunho visual e limpa o resultado
    transitório; a reserva bem-sucedida permanece no reducer.

Não haverá novo estado global para controlar fases visuais, contato recolhido,
foco ou filtros.

## Comportamento e acessibilidade

- Suporte obrigatório a partir de 360 px.
- Controles principais têm pelo menos 44 px de largura e altura.
- A faixa de chips pode rolar internamente, mas documento, painéis e cartões não
  podem gerar overflow horizontal.
- Foco visível usa contorno terracota com contraste e afastamento.
- Títulos que recebem foco programático mantêm o contorno quando o foco for
  visível.
- Abrir a reserva foca o primeiro campo; sucesso foca o título; erro foca o
  campo ou aviso correspondente.
- Voltar à etapa anterior mantém contexto e valores já preenchidos.
- Fechar um diálogo ou painel devolve foco ao controle que o abriu.
- Navegação completa por teclado não depende de hover ou gesto.
- Mudanças de estado relevantes permanecem escritas e são anunciadas por live
  region adequada.
- Cancelamento e liberação exigem confirmação com foco contido e retorno ao
  disparador.
- `prefers-reduced-motion` reduz transições e desativa rolagem animada.
- Estados não dependem apenas de cor, opacidade, emoji ou toast.
- Erros de rota, código, coleção e token oferecem explicação humana e retorno.
- Pix, QR, impressão, referências, login e administração informam explicitamente
  que são demonstrações.

## Contrato responsivo

### 360 a 479 px

- Cabeçalho com marca e “Contribuir” visíveis.
- Hero compacto, três passos em três colunas e busca na primeira viewport.
- Categorias em faixa horizontal rolável.
- Presentes em linhas de três áreas: visual, conteúdo e “Ver”.
- Detalhe e reserva ocupam painel inferior ou página sem conteúdo escondido.
- Administração usa navegação compacta de salto.
- A4 é reduzido proporcionalmente.

### 480 a 899 px

- Conteúdo ganha margens maiores sem ampliar excessivamente o título.
- Lista permanece em uma coluna.
- Painel de detalhe usa largura controlada e conserva a sequência de fases.
- Layout administrativo reduz densidade gradualmente antes da barra lateral.

Os limites intermediários têm expectativas explícitas:

- em 480/481, a marca nunca desaparece e o catálogo continua em uma coluna;
- em 520/521, a miniatura A4 muda de escala sem corte ou overflow do documento;
- em 639/640, a lista continua em uma coluna e não recupera a grade comercial.

### 900 px ou mais

- Conteúdo público permanece centralizado e editorial, sem grade de produtos.
- Hero, busca e início da lista aparecem na primeira viewport de 900 px de
  altura.
- Linhas de presente usam o espaço horizontal para preferências e estado.
- Administração usa barra lateral e conteúdo principal.
- A prévia A4 pode ser exibida em escala natural quando houver espaço.

Em 899/900, apenas a administração passa para barra lateral; o catálogo continua
editorial. Em 1199/1200, operações administrativas podem reorganizar suas
colunas, mas conteúdo, foco e ordem de leitura permanecem equivalentes.

## Estados e tratamento de erros

### Busca vazia

Exibir “Nenhuma ideia encontrada” e orientar a limpar busca ou filtros. A ação
de limpar deve estar disponível quando algum filtro estiver ativo.

### Presente já escolhido

Manter o detalhe informativo, mostrar “Já foi escolhido” e retirar o CTA de
reserva. Oferecer retorno à lista, sem sugerir compra alternativa.

### Validação

Mostrar a mensagem junto ao campo, associada por `aria-describedby`, e focar o
primeiro campo inválido. Toast não participa da validação.

### Conflito de reserva

Mostrar aviso dentro da etapa de reserva, preservar o nome digitado e oferecer
“Voltar para a lista”. O item passa a refletir a disponibilidade derivada que o
estado demonstrativo fornecer.

### Sucesso

Substituir a etapa por confirmação persistente e anunciar o título. Não fechar
o painel automaticamente.

### Operação demonstrativa

Pix, referência, download e configurações mostram resultado textual persistente
e podem reforçá-lo por toast.

## Estratégia de testes

### Testes unitários e de componentes

- Manter cobertura de busca normalizada e disponibilidade derivada.
- Testar o mapeamento público de “Disponível”, disponibilidade parcial e “Já
  foi escolhido”.
- Testar `GiftVisual`, fallback e ocultação acessível do emoji.
- Testar `Notice` nos papéis semânticos suportados.
- Testar conteúdo, nome acessível da ação “Ver” e ausência da variante `primary`
  no catálogo. Aparência plana e compactação ficam nas verificações visuais do
  navegador, não no DOM simulado.
- Testar os três passos e seus textos.
- Testar fases `detalhe → reserva → confirmação`.
- Testar foco inicial, retorno ao detalhe e preservação do nome.
- Testar contato recolhido e quantidade condicional.
- Testar validação, conflito, indisponibilidade e sucesso persistentes.
- Testar navegação administrativa, foco de seção e confirmações destrutivas.
- Atualizar testes de Pix, PDF, coleção e gerenciamento para a nova hierarquia.
- Testar as cópias de contagem para zero, uma e múltiplas ideias.

### Testes ponta a ponta

O fluxo principal completo — buscar, abrir, reservar e chegar à confirmação —
roda em Chromium mobile de 360 × 800, WebKit mobile de 390 × 844 e Chromium
desktop de 1280 × 900. Os demais fluxos de apoio podem permanecer distribuídos
pelos projetos atuais, com smoke e layout direcionados no desktop:

- buscar um presente já imaginado e reconhecer sua disponibilidade;
- filtrar por categoria e por disponibilidade;
- abrir detalhe e concluir uma reserva;
- retornar entre detalhe e formulário sem perder o nome;
- visualizar conflito, indisponibilidade e sucesso;
- gerenciar, comprar e cancelar a reserva demonstrativa;
- acessar Pix, impressão, coleção preservada, administração e rotas inválidas;
- concluir jornadas críticas somente com teclado;
- verificar retorno de foco ao fechar painel e confirmações;
- verificar restauração de busca, filtros e `scrollY` com tolerância de 2 px ao
  fechar o detalhe sobre o catálogo;
- afirmar uma única coluna editorial no desktop.

Os limites de layout serão verificados de forma dirigida, sem multiplicar toda
a suíte: 480/481, 520/521, 639/640, 899/900 e 1199/1200 px, além de tablet em
768 px e celular em paisagem de 844 × 390.

### Acessibilidade e robustez

- Executar axe também em estados transitórios: vazio, formulário inválido,
  conflito, sucesso, confirmação, administração desbloqueada e erros.
- Falhar para violações axe de qualquer impacto, exceto regras registradas em
  uma allowlist curta com justificativa no próprio teste.
- Verificar largura e altura mínimas de 44 px nos controles principais.
- Verificar foco visível por estilo computado e ordem de tabulação.
- Verificar `scrollWidth <= clientWidth` no documento, diálogos, cartões,
  administração e moldura da prévia. A faixa de categorias é a única região
  com rolagem horizontal intencional.
- Verificar `prefers-reduced-motion` e a duração computada de transições e
  animações.
- Verificar ausência de erros e avisos no console.
- Tornar as guardas de armazenamento do navegador e de rede externa parte da
  fixture E2E compartilhada, e não apenas de cenários isolados.

### Regressão visual

Usar `toHaveScreenshot`, já incluído no Playwright, sem nova dependência. O
ambiente canônico dos baselines é o Chromium no Ubuntu da CI, com animações e
caret desativados, snapshots separados por projeto e
`maxDiffPixelRatio` de `0.01`. Baselines novos ou alterados são revisados
manualmente contra os conceitos aprovados antes de serem aceitos.

Criar referências estáveis para:

- catálogo em 360 × 800;
- catálogo em 1280 × 900;
- detalhe, formulário e confirmação;
- vazio, conflito e sucesso;
- administração em 1280 × 900;
- prévia A4 em 360 px e 1280 px.

A validação manual final cobre Chromium e WebKit nos tamanhos suportados e
absorve diferenças de renderização de fontes do sistema e emojis fora do
ambiente canônico.

## Critérios de conclusão

- Com as fixtures iniciais, em 360 × 800, a primeira viewport mostra identidade,
  propósito, três passos, busca e o primeiro item completo com categoria, nome,
  estado e ação.
- As buscas `panelas`, `café` e `algodão` encontram, respectivamente, conteúdo
  por nome, descrição e preferência sem exigir acentos ou caixa exatos.
- As contagens usam “Nenhuma ideia encontrada”, “1 ideia para escolher” e
  “N ideias para escolher”.
- Disponibilidade está escrita em cada item antes de abrir o detalhe.
- “Nossa lista” permanece visível nos viewports definidos neste documento.
- O catálogo tem uma coluna e zero botões `primary` nos viewports definidos.
- Cada fase disponível tem no máximo um botão `primary`; item indisponível pode
  não ter nenhum.
- Somente uma das fases detalhe, reserva ou confirmação permanece no DOM.
- Primeiro nome é o único campo obrigatório sempre visível.
- Conflito preserva o nome e sucesso explica “Combine a entrega”.
- Emojis acrescentam contexto sem assumir função operacional.
- Ícones Lucide e texto identificam ações.
- Pix, QR, PDF, referências, login e administração continuam demonstrativos.
- Nenhuma dependência, backend, persistência ou integração real é adicionada.
- Disponibilidade continua derivada exclusivamente das reservas.
- A aplicação funciona por toque e teclado nos viewports definidos, com foco
  visível, movimento reduzido e estados textuais persistentes.
- Ao fechar o painel, foco, filtros e rolagem do catálogo são restaurados.
- Apenas a faixa de categorias tem rolagem horizontal intencional; documento e
  demais contêineres testados não cortam nem extravasam conteúdo.
- Não há erro ou aviso de console, acesso a armazenamento ou chamada para origem
  externa.
- Passam os comandos:

```text
npm run format:check
npm run lint
npm run typecheck
npm run test
npm run build
npm run test:e2e
```
