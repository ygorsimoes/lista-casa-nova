# Painel administrativo enxuto e refinado

## Objetivo

Transformar a administração em uma área pequena, acolhedora e confiável para
manter a lista de presentes e acompanhar as reservas reais.

## Escopo aprovado

- Cabeçalho organizado, com retorno à lista e saída discreta.
- Resumo com totais de presentes, itens disponíveis e itens reservados.
- Formulário para criar e editar um presente com nome obrigatório e imagem,
  cor, descrição, preferências, valor e link de referência opcionais.
- Catálogo administrativo pesquisável e filtrável por disponibilidade, com
  estado visível, edição e remoção com confirmação.
- Reservas organizadas por data, mostrando o presente e o nome informado pelo
  convidado apenas para a pessoa administradora.
- Estados claros de carregamento, vazio, sucesso e falha.
- Dados reais via Supabase, preservando a reserva pública e as regras de RLS.

## Fora do escopo

- Relatórios, gráficos, múltiplos perfis de administração, entrega,
  cancelamento público de reserva, pagamentos ou automações.
- Reaproveitar o painel demonstrativo e seus dados fictícios.

## Critérios de aceitação

- A pessoa administradora entende rapidamente o estado da lista e encontra um
  presente sem percorrer uma sequência confusa de blocos.
- Criar, editar e remover presentes atualiza a lista real; a remoção exige
  confirmação.
- A área de reservas mostra corretamente os itens reservados e seus nomes sem
  tornar esses nomes públicos.
- Busca e filtro funcionam no catálogo sem alterar os dados.
- Os testes cobrem o comportamento de manutenção e a integração real continua
  restrita pelas políticas atuais do Supabase.
