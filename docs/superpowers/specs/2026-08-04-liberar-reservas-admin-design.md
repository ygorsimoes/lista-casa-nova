# Liberação de reservas no painel administrativo

## Objetivo

Permitir que somente o administrador desfaça uma reserva criada por engano, com confirmação explícita, e tornar a leitura das reservas mais clara e acolhedora.

## Fluxo

Cada linha em “Reservas” mostra o presente, o nome de quem reservou e a data formatada em português. Ao lado, o botão “Liberar presente” abre um diálogo explicando que o item voltará a ficar disponível. A confirmação remove somente a reserva daquele presente, atualiza o catálogo e os contadores e mostra uma mensagem de sucesso. Falhas preservam a linha e mostram uma mensagem clara.

## Segurança e limites

- A remoção usa o cliente autenticado do Supabase e as regras atuais, que já permitem exclusão somente a administradores.
- O botão não existe na lista pública nem no PDF.
- Não há histórico, relatórios, recuperação automática ou novas permissões públicas.

## Interface e testes

A seção de reservas ganha uma composição mais legível: nome do presente como foco, nome e data em texto secundário e ações afastadas do conteúdo. Os testes cobrem a chamada de remoção, confirmação, atualização de dados e ausência da ação para visitantes.
