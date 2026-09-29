# Conectar esta Central ao Work

Instalador: preencha projeto e origem com os valores retornados pelo Sites e entregue o texto abaixo ao usuário quando ele for continuar em outra conversa. Não inclua token. Remova este parágrafo e o título ao preparar o briefing final.

Quero usar esta Central de Viagens pelo GPT Work, com sua API HTTP. Operações devem decorrer dos meus pedidos; não crie agendamento nem altere dados apenas para demonstrar a conexão.

- Projeto Sites exato: `[PROJECT_ID_RETORNADO_PELO_SITES]`.
- Origem HTTPS confirmada: `[URL_ATUAL_DA_CENTRAL]`.
- A autenticação da API já foi configurada no servidor para o usuário desta instalação.

Use o conector Sites para `get_site` com esse projeto, sem `include_mcp_connection`. Confirme o projeto e a origem; obtenha `siwc_bypass_bearer_token` somente em memória. Não imprima, grave, inclua em URL ou coloque esse segredo no prompt. Não gere/rotacione token nem use cookies ou cabeçalhos de identidade do visitante.

Envie chamadas somente à origem confirmada, com redirects desativados e estes headers:

- `OAI-Sites-Authorization: Bearer <token>`
- `X-Central-Sync-Token: <token>`
- `Accept: application/json`
- `Content-Type: application/json` em escritas com corpo.

Primeiro consulte `GET /api/assistant/capabilities` e `GET /api/assistant/trips`, apenas para verificar a conexão. Leia os contratos instalados no catálogo. Se faltar conector, credencial ou transporte HTTP com headers/corpo, identifique o bloqueio concreto; não declare conexão pronta nem invente outro acesso.

Nas próximas solicitações, use as operações documentadas para viagens, listas, lugares, roteiro, reservas, revisões, documentos, imagens e convidados. Leia antes de editar, preserve campos não pedidos e use revisões/fingerprints atuais. Em409, compare o novo estado antes de decidir; em timeout de criação, confira se o recurso já apareceu antes de repetir.

Criar ou excluir viagens e alterar compartilhamento exige que meu pedido esteja explícito e que o alvo esteja claro. Excluir uma viagem apaga seu conteúdo; exige proprietário, `confirmName` exato e verificação de `filesCleaned`. Se a lista tiver lugares, preserve-os movendo para o destino escolhido. Não confunda tirar do roteiro com excluir. O token tem capacidades de gerenciamento; não o compartilhe com convidados.

Não use administração privada, aceite legal, segredos ou publicação para contornar erros. Acesso privado ao Site e convidados de cada viagem são camadas diferentes. Após as ações, confira a persistência e relate somente o que foi realizado.

Scheduled Tasks é um fluxo separado: se eu pedir automação, use o prompt de sincronização, obtenha viagens atuais/futuras em `/api/sync`, não crie viagens e valide uma execução real na nuvem. Uma chamada interativa bem-sucedida não comprova o agendador.

Antes de importar ou editar reservas, leia `reservationImportContract` da resposta de capacidades atual. Use `fields`, `flightFields`, `ticketFields`, `pointFields`, `schemas`, `byKind` e `rules` para enviar todos os campos comprovados e preservar os existentes. Não coloque tudo em título/notas nem descarte campos desconhecidos por um prompt antigo. Em voos, códigos IATA, nomes de aeroportos, número, localizador e tickets (passageiro opcional) têm campos próprios; referência original continua separada. Endereço preenchido não é validação OSM. A consulta de aeroporto por IATA é auxílio de preenchimento atual, não comprovação histórica/postal.
