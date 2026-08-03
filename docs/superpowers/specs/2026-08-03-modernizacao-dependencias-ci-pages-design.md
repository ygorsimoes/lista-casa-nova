# Modernização de dependências, CI e GitHub Pages

## Contexto

O repositório acumulou sete Pull Requests do Dependabot com atualizações
isoladas e bases divergentes. Todos foram abertos contra
`codex/prototipo-visual`, que ainda estava configurada como branch padrão do
GitHub, embora o código consolidado já estivesse em `main`. Cinco PRs de
GitHub Actions também nasceram antes da correção do lockfile multiplataforma e
falham em `npm ci` por carregarem uma versão antiga do arquivo.

O workflow atual reúne qualidade, testes ponta a ponta, empacotamento do Pages
e implantação em um único arquivo. Em Pull Requests, o job `deploy` aparece
como ignorado porque sua condição aceita apenas pushes em `main`. Esse
comportamento é seguro, mas a apresentação induz a interpretação de que a
publicação está quebrada.

A execução `30785419986`, citada na investigação, foi disparada pelo Pull
Request 4. Por isso, o job `91598256515` foi corretamente ignorado. Depois do
merge, a execução `30785607854`, referente ao push `d693aa8` em `main`, concluiu
qualidade e implantação com sucesso. O deployment `5721076008` publicou
`https://ygorsimoes.github.io/lista-casa-nova/`, que respondeu HTTP 200 durante
a auditoria.

Além da dívida de automação, a árvore atual contém duas decisões de dependência
que exigem tratamento conjunto:

- `react-router-dom@7.18.2` traz `react-router@7.18.2`, atingido pelo alerta
  GHSA-qwww-vcr4-c8h2. A aplicação não usa as APIs instáveis de React Server
  Components afetadas pelo alerta, mas a versão corrigida está na linha 8.
- TypeScript 7 fornece o compilador nativo mais recente, porém ainda não expõe
  a API programática esperada pelo `typescript-eslint@8.65.0`. Atualizar apenas
  o pacote `typescript` torna a instalação incompatível.

Esta especificação reúne essas mudanças em uma única migração coerente, em vez
de tentar integrar separadamente os sete PRs automatizados.

## Objetivos

- Tornar `main` a referência canônica local e remota do projeto.
- Atualizar dependências com uma estratégia compatível e reproduzível.
- Remover o alerta conhecido do React Router sem alterar a navegação da SPA.
- Adotar o compilador nativo do TypeScript 7 sem romper ESLint nem sua API de
  análise.
- Fixar GitHub Actions por SHA imutável e manter versões legíveis.
- Separar CI de implantação para que Pull Requests não exibam um deploy
  deliberadamente ignorado.
- Publicar no Pages somente um commit de `main` aprovado por toda a CI.
- Tornar flakiness de Playwright visível e corrigir a corrida de foco já
  observada no WebKit.
- Reduzir o ruído futuro do Dependabot por agrupamento e alinhamento de branch.
- Aplicar proteções remotas mínimas para impedir bypass acidental da qualidade.
- Documentar com precisão os requisitos locais, comandos e fluxo de entrega.

## Fora do escopo

- Alterar o desenho visual, conteúdo ou funcionalidades do protótipo.
- Adicionar backend, persistência, autenticação ou serviços externos.
- Migrar a hospedagem para outro provedor.
- Adotar Node.js 26 antes de ele ser a linha LTS validada pelo projeto.
- Exigir revisão humana para todo push em `main`; o repositório continua
  adequado a manutenção individual.
- Excluir `codex/prototipo-visual` ou qualquer outra branch remota existente.
- Integrar individualmente os sete PRs atuais do Dependabot.

## Estado de referência

A implementação parte de `main` no commit
`d693aa8cba3dd1dc4cb723e89186dacfd437ba1b`. O trabalho será isolado em
`codex/modernizar-dependencias-ci` e entregue em um único Pull Request para
`main`.

Antes de publicar a nova branch, a branch padrão do repositório no GitHub será
alterada de `codex/prototipo-visual` para `main`. Assim, novos PRs, regras de
proteção, execução do Dependabot e navegação do repositório passam a apontar
para a linha correta de desenvolvimento.

## Estratégia de dependências

### React Router 8

`react-router-dom` será removido e substituído por `react-router@8.3.0`. Todos
os imports de `HashRouter`, `Routes`, `Route`, `Link`, hooks, tipos e utilitários
passarão de `react-router-dom` para `react-router`.

A aplicação continuará usando `HashRouter`; não haverá mudança de URLs, base do
Vite ou comportamento de links profundos no GitHub Pages. React 19.2.8 e Node
24 já satisfazem os requisitos da versão 8. A migração foi exercitada em cópia
descartável do repositório com instalação limpa, lint, tipos, 107 testes
unitários/de componentes, build e 69 testes E2E aprovados.

### TypeScript 7 com ponte de compatibilidade

O projeto adotará os aliases recomendados para o período de transição:

```json
{
  "devDependencies": {
    "@typescript/native": "npm:typescript@7.0.2",
    "typescript": "npm:@typescript/typescript6@6.0.3"
  }
}
```

O binário `tsc` usado por `typecheck` e `build` virá do compilador nativo 7.0.2.
O pacote instalado no nome `typescript` continuará expondo a API 6.0.3 de que
o `typescript-eslint` precisa. Essa ponte é intencional, deve permanecer
documentada e poderá ser removida quando o ecossistema usado pelo projeto
suportar a API da linha 7.

O `package-lock.json` será regenerado uma única vez a partir do manifesto final
e validado com `npm ci`. Não serão editadas entradas do lockfile manualmente.

### Node.js e tipos

O runtime suportado permanecerá na linha LTS 24:

- `.nvmrc` continuará declarando `24`;
- `engines.node` será alinhado para `24.x`;
- CI e Pages lerão a versão de `.nvmrc`;
- `@types/node` permanecerá em 24.13.3, a versão mais recente da linha 24 na
  data da auditoria.

O PR 8 do Dependabot, que propõe `@types/node@26.1.2`, será rejeitado porque
modelaria APIs de um runtime diferente. A configuração futura ignorará somente
atualizações major desse pacote enquanto Node 24 for a linha suportada.

### GitHub Actions

Todas as ações reutilizáveis externas ao repositório serão fixadas no SHA
integral do release auditado, com o número da versão no comentário da mesma
linha para legibilidade e para as atualizações do Dependabot:

| Ação                            | Versão | SHA                                        |
| ------------------------------- | ------ | ------------------------------------------ |
| `actions/checkout`              | 7.0.1  | `3d3c42e5aac5ba805825da76410c181273ba90b1` |
| `actions/setup-node`            | 7.0.0  | `820762786026740c76f36085b0efc47a31fe5020` |
| `actions/configure-pages`       | 6.0.0  | `45bfe0192ca1faeb007ade9deae92b16b8254a0d` |
| `actions/upload-artifact`       | 7.0.1  | `043fb46d1a93c77aae656e7c1c64a875d1fc6a0a` |
| `actions/upload-pages-artifact` | 5.0.0  | `fc324d3547104276b827a68afc52ff2a11cc49c9` |
| `actions/deploy-pages`          | 5.0.0  | `cd2ce8fcbc39b97be8ca5fce6e763baed58fa128` |

`persist-credentials: false` será usado no checkout porque nenhum job precisa
fazer push. O cache do npm apontará explicitamente para `package-lock.json`.

## Arquitetura de automação

O arquivo monolítico `.github/workflows/ci-pages.yml` será removido e
substituído por dois workflows com responsabilidades distintas.

```text
Pull Request para main ─┐
                        ├── CI / quality ── CI / e2e
Push em main ───────────┘                       │
                                               │ sucesso de push
                                               ▼
                                      GitHub Pages / deploy
                                               │
                                               ▼
                                      ambiente github-pages
```

### Workflow `CI`

`.github/workflows/ci.yml` será disparado por:

- Pull Requests cujo destino seja `main`;
- pushes em `main`;
- `workflow_dispatch` para diagnóstico manual.

O workflow terá somente `contents: read` e concorrência por PR ou referência,
com cancelamento de execuções obsoletas. Os jobs terão nomes estáveis, limites
de tempo explícitos e passos nomeados.

#### Job `quality`

Executará, nesta ordem:

1. checkout sem persistência de credenciais;
2. Node definido em `.nvmrc`, com cache npm;
3. `npm ci`;
4. auditoria de dependências de produção em severidade alta ou superior;
5. `npm run format:check`;
6. `npm run lint`;
7. `npm run typecheck`;
8. `npm run test`, incluindo cobertura;
9. `npm run build`.

Qualquer falha interrompe a cadeia. A auditoria não ignorará vulnerabilidades
de produção; alertas apenas de ferramentas de desenvolvimento continuarão
sendo avaliados nas atualizações periódicas sem bloquear automaticamente esta
entrega estática.

#### Job `e2e`

Dependerá de `quality` e repetirá checkout, Node, `npm ci` e build em um runner
limpo. Em seguida instalará somente os navegadores bloqueados pelo Playwright,
com `npx --no-install playwright install --with-deps chromium webkit`, e
executará `npm run test:e2e:ci`.

Em falha, `playwright-report` e `test-results` serão publicados como um único
artefato de diagnóstico, com retenção limitada e ausência de arquivos tratada
sem mascarar a falha original. O upload não será executado em sucesso.

O Playwright manterá uma repetição na CI para produzir trace comparativo, mas
`failOnFlakyTests: true` fará a execução falhar quando um caso só passar na
segunda tentativa. Assim, a repetição ajuda o diagnóstico sem converter uma
instabilidade em check verde.

### Corrida de foco no WebKit

O caso `opera filtros com Enter e Espaço` falhou uma vez no projeto
`mobile-webkit`: após o foco programático em `Cozinha`, o efeito inicial de
rota moveu o foco para o `h1` antes do `Enter`, deixando `aria-pressed` como
`false`. A repetição passou e tornou a execução final aparentemente saudável.

O teste será sincronizado com o contrato observável da página: primeiro
aguardará o foco inicial no título aplicado por `RouteEffects`; somente depois
focará o botão e enviará a tecla. Não serão adicionados sleeps, timeouts
arbitrários nem mudança no comportamento de produção.

### Workflow `GitHub Pages`

`.github/workflows/pages.yml` será disparado por:

- conclusão do workflow `CI`, filtrada para a branch de origem `main`;
- `workflow_dispatch` para republicação manual do commit atual de `main`.

Para eventos `workflow_run`, o job de implantação só será elegível quando:

- o workflow de origem tiver sido disparado por `push`;
- a branch de origem for `main`;
- a conclusão for `success`.

No disparo manual, o job também exigirá `refs/heads/main`; selecionar outra
referência não concederá um caminho alternativo para o ambiente de produção.

Logo, uma CI de Pull Request nunca cria sequer um job de deploy visível no
próprio workflow de validação, e uma falha em `quality` ou `e2e` impede a
publicação. O evento `workflow_run` será tratado como entrada não confiável:
nenhum artefato ou script vindo de uma execução de PR será consumido.

O deploy fará checkout do `head_sha` aprovado pela CI, instalará pelo lockfile
e reconstruirá `dist` em runner limpo. A reconstrução evita promover um
artefato gravável por outro contexto e garante que a publicação corresponde ao
commit auditado. No disparo manual, será usado o SHA atual de `main`.

O workflow terá concorrência própria para Pages, sem cancelar uma implantação
já iniciada, e permissões globais mínimas. Apenas o job de deploy receberá:

- `contents: read`;
- `pages: write`;
- `id-token: write`.

O ambiente continuará sendo `github-pages`, com a URL fornecida por
`actions/deploy-pages`. A fonte do Pages permanecerá `GitHub Actions` e a
política do ambiente continuará restrita a `main`.

## Dependabot

`.github/dependabot.yml` continuará com execução semanal no fuso
`America/Bahia`, mas passará a usar a branch padrão correta e reduzir PRs
redundantes:

- atualizações npm minor e patch compatíveis serão agrupadas por tipo de
  dependência;
- atualizações major continuarão isoladas para revisão explícita;
- atualizações de GitHub Actions serão agrupadas;
- majors de `@types/node` serão ignorados enquanto o runtime for Node 24;
- atualizações de segurança permanecerão habilitadas e prioritárias.

Não será necessário declarar `target-branch` depois que `main` se tornar a
branch padrão. Os sete PRs atuais serão fechados somente depois que a migração
consolidada estiver integrada, com comentário informando o PR substituto.

## Governança remota

Após a nova CI existir em `main`, serão aplicadas as seguintes configurações no
GitHub:

- branch padrão: `main`;
- vulnerability alerts: habilitados;
- Dependabot security updates: habilitados;
- proteção de `main` exigindo os checks `quality` e `e2e` atualizados;
- exigência de branch atualizada antes da integração;
- force push e exclusão de `main`: bloqueados;
- revisão humana obrigatória: desabilitada.

Os nomes `quality` e `e2e` são parte do contrato de governança e não devem ser
renomeados sem atualizar a proteção. A regra só será criada ou ajustada depois
que esses checks tiverem sido materializados pelo novo workflow, evitando uma
proteção impossível de satisfazer.

## Documentação

O README será atualizado para refletir:

- suporte exclusivo à linha Node 24;
- ponte temporária entre compilador TypeScript 7 e API TypeScript 6;
- comandos reais de qualidade e E2E;
- separação entre CI e GitHub Pages;
- publicação apenas após push aprovado em `main`;
- motivo pelo qual Pull Requests não possuem job de deploy.

Não será documentada nenhuma garantia que dependa de configuração remota antes
de ela ser verificada no GitHub.

## Sequência de entrega

1. Partir de `main` sincronizada e criar a branch de modernização.
2. Atualizar manifesto, imports, lockfile, Playwright, workflows, Dependabot e
   README.
3. Executar todas as validações locais e revisar o diff completo.
4. Alterar a branch padrão remota para `main`.
5. Publicar o Pull Request consolidado contra `main`.
6. Aguardar `quality` e `e2e`; corrigir qualquer falha sem fazer bypass.
7. Integrar o PR somente com ambos os checks verdes.
8. Confirmar a execução subsequente do workflow de Pages, o deployment e a
   resposta HTTP do site publicado.
9. Habilitar vulnerability alerts e Dependabot security updates e aplicar a
   proteção de `main` usando os checks novos.
10. Fechar os sete PRs antigos do Dependabot como substituídos.

As mutações remotas ficam deliberadamente depois da validação local. O
fechamento dos PRs antigos fica depois da validação do deployment para preservar
um caminho claro de investigação até a entrega estar confirmada.

## Validação

A implementação só estará pronta para publicação se passar, em ambiente Node
24 e com instalação reproduzível:

```bash
npm ci
npm audit --omit=dev --audit-level=high
npm run format:check
npm run lint
npm run typecheck
npm run test
npm run build
npx --no-install playwright install chromium webkit
npm run test:e2e:ci
```

Também serão obrigatórios:

- validação sintática e estrutural dos YAMLs;
- `git diff --check` sem erros;
- confirmação de que não restaram imports de `react-router-dom`;
- confirmação de que todas as ações estão fixadas por SHA;
- `npm audit` do lockfile sem vulnerabilidade de produção alta ou crítica;
- inspeção dos nomes e permissões efetivas dos jobs;
- CI remota verde no Pull Request;
- deployment de Pages associado ao SHA integrado;
- site publicado respondendo HTTP 200 na URL canônica.

## Falhas, recuperação e rollback

- Se a instalação ou qualquer check local falhar, a branch não será publicada.
- Se a CI do PR falhar, não haverá merge nem implantação.
- Se a CI do push em `main` falhar, o `workflow_run` não será elegível para
  deploy e a versão atualmente publicada permanecerá no ar.
- Se o build ou deploy de Pages falhar, os PRs antigos não serão fechados e a
  execução será investigada pelo SHA exato.
- Se a nova versão causar regressão após o merge, o PR consolidado poderá ser
  revertido por um novo commit em `main`; a próxima CI verde republicará a
  versão revertida.
- Nenhuma branch remota será apagada durante essa migração.

## Critérios de sucesso

A modernização estará concluída quando:

- `main` for a branch padrão e protegida do repositório;
- vulnerability alerts e Dependabot security updates estiverem habilitados;
- não houver alerta de dependência conhecido no lockfile de produção;
- React Router 8 e o compilador TypeScript 7 estiverem ativos;
- lint e ferramentas TypeScript continuarem operando pela ponte compatível;
- Node e `@types/node` permanecerem alinhados na linha 24;
- os workflows separados tiverem permissões mínimas e ações fixadas por SHA;
- PRs executarem somente `quality` e `e2e`, sem deploy ignorado;
- um push verde em `main` disparar e concluir o Pages automaticamente;
- flakiness fizer a CI falhar e o caso WebKit estiver sincronizado;
- README e Dependabot descreverem e sustentarem o novo fluxo;
- os sete PRs antigos estiverem fechados como substituídos somente após a
  validação final.
