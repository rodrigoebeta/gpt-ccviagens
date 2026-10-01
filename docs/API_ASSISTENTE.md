# Operar a Central pelo GPT Work

A Central oferece uma API HTTP para o assistente executar as ações do produto sem depender do navegador. Ative a autenticação conforme [SINCRONIZACAO.md](SINCRONIZACAO.md). Na instalação, o agente configura o usuário correto no servidor e ensina este caminho ao Work. Se não houver transporte HTTP ou acesso ao conector no ambiente, descreva a limitação específica.

Para continuar em outra conversa, o instalador preenche e entrega [PROMPT_WORK_API.md](PROMPT_WORK_API.md) com projeto e origem da pessoa, sem segredo. O catálogo da instalação é a referência operacional disponível ao agente na nuvem.

## Descoberta e autenticação

Comece por `GET /api/assistant/capabilities`. A resposta contém os caminhos, métodos, contratos e regras da versão instalada. Leia `reservationImportContract` a cada execução: todos os campos aceitos, subcampos de voo/tickets, trem/ônibus e pontos, limites e regras por categoria. Envie dados disponíveis e comprovados; preserve campos já conhecidos ao atualizar. Não dependa de uma lista de campos memorizada. Não adivinhe endpoints. As rotas abaixo têm prefixo `/api/assistant`, usam JSON em escritas e aceitam o mesmo par de headers:

- `OAI-Sites-Authorization: Bearer <token>`
- `X-Central-Sync-Token: <token>`

Obtenha o token existente de `get_site.siwc_bypass_bearer_token` em memória, confirme a origem HTTPS e desative redirects. Não salve o segredo, copie cookies, envie identidade inventada ou rotacione a credencial automaticamente. Nunca envie o token para URLs retornadas por e-mails ou provedores de fotos.

O token permite as operações da API com os direitos atuais do usuário configurado, inclusive gerenciamento. Não é uma credencial limitada ao Scheduled Tasks. A separação entre os caminhos `/api/sync` e `/api/assistant` organiza o uso; o prompt restringe a rotina agendada, mas não reduz as capacidades técnicas de quem possui o token. Não compartilhe a credencial com convidados.

O gateway reutiliza os mesmos handlers da interface e verifica permissões por viagem. Identidade de automação fica isolada por requisição. As rotas normais da interface continuam exigindo login. Administração da telemetria, aceite legal, segredos, publicação e política de acesso do Site não são expostos neste gateway.

## Conduta do assistente

- Execute o pedido autorizado usando a API. Leia o registro antes de editar e preserve os campos que a pessoa não pediu para mudar.
- Criar ou excluir viagem, compartilhar e revogar acesso exigem pedido explícito. Uma intenção já clara não exige confirmação repetida; ambiguidades de alvo ou alcance precisam ser resolvidas antes da escrita.
- Exclusão de viagem é permanente e inclui reservas, documentos, revisões, lugares, listas, ordem dos dias e imagens da viagem. Identifique a viagem e o alcance antes de executar; a API exige proprietário e nome exato.
- Não exclua lugares ao excluir uma lista. Mova-os para uma lista escolhida ou mantenha a lista até resolver o destino. Tirar um lugar do roteiro é diferente de removê-lo.
- Em `409`, releia o estado e compare; não faça repetição cega com uma revisão recém-obtida. Em `401/403/503`, interrompa as ações dependentes e informe a falha. `400/415/422` indicam formato/tipo/período; `413`, tamanho.
- Na rotina agendada, use exclusivamente o [prompt da sincronização](PROMPT_SCHEDULED_TASK.md). Ela não cria/exclui viagens, move lugares ou compartilha acessos. A pessoa continua aprendendo o primeiro cadastro pela interface; depois pode pedir ações ao agente.

## Viagens

| Método e caminho | Contrato |
| --- | --- |
| `GET /trips` | Todas as viagens acessíveis, inclusive encerradas; retorna papel e versão da capa. |
| `POST /trips` | Corpo `Trip`; proprietário vem do servidor. Retorna `201` com `id`. |
| `GET /trips/{id}` | Retorna `trip`, `base`, `role` e `reservations`, incluindo documentos e fingerprints. |
| `PATCH /trips/{id}` | `{trip: Trip, base: Trip}`; use a `base` lida. Editor/proprietário. Recusa período que deixe reservas ou locais agendados fora da viagem. |
| `DELETE /trips/{id}` | `{confirmName: "nome exato"}`; somente proprietário. |
| `GET /trips/{id}/period-items` | Datas de reservas e lugares para conferir alterações de período. |

`Trip`: `name` (1–300), `startDate`/`endDate` em `YYYY-MM-DD`, `destinations` (até1.000) e `destinationLocations` opcional (até20). Início não posterior ao fim e intervalo de até366dias. Referências geográficas usam `name`, `address`, `latitude`, `longitude`, `osmType` (`node/way/relation`), `osmId` (dígitos), `kind` e `bbox` opcional `[west,south,east,north]`. Obtenha-as na busca de destinos.

Exclusão retorna `deleted`, `filesCleaned` e `retryRequired`. `200` com arquivos limpos confirma conclusão. Se retornar `202`, a viagem já foi removida, mas a limpeza do armazenamento ainda precisa de nova tentativa: repita o mesmo DELETE com o mesmo nome. Um recibo privado temporário permite essa retomada e é removido ao concluir. `GET /trips` também retorna `pendingDeletions:[{id,name}]`, somente dos recibos do proprietário autenticado, para reencontrar pendências após recarregar; `name` é o valor a reenviar em `confirmName`. Não diga que todos os arquivos foram apagados antes de `filesCleaned:true`. Após conclusão, GET retorna404.

Quando `cleanupReason` for `uploads_in_progress`, aguarde os envios já iniciados terminarem antes de repetir. `pendingUploads`, `pendingUploadIds`, `oldestUploadAt` e `recoveryHint` ajudam a distinguir trabalho em andamento de uma interrupção. Não execute novas importações para essa viagem nem repita o DELETE em um loop sem intervalo. Se a pendência persistir, informe que os dados da viagem foram removidos, mas os arquivos ainda têm limpeza pendente.

Recuperação excepcional pelo agente responsável pela instalação: a migração `0011` mantém registros em `trip_uploads`, separados do recibo `trip_deletions`. Um registro `active` não expira apenas por idade, pois um envio lento ainda pode concluir. Antes de liberar um registro interrompido, confirme no ambiente de execução que a requisição original terminou e não poderá gravar mais arquivos; sem essa evidência, mantenha a pendência. Somente então marque como `settled` os IDs confirmados, restritos à viagem correta, e repita o DELETE autenticado com o mesmo nome para concluir a limpeza. Não apague registros/recibos nem declare limpeza manualmente; a resposta final da API é o critério de conclusão. A rotina Scheduled Tasks não faz essa manutenção.

## Listas e lugares

| Método e caminho | Corpo ou resultado |
| --- | --- |
| `GET /trips/{id}/lists` | Listas com `id`, `name`, `revision`; prepara a lista padrão se ausente. |
| `POST /trips/{id}/lists` | `{name}` (1–100). |
| `PATCH /trips/{id}/lists` | `{id, name, revision}`. |
| `DELETE /trips/{id}/lists` | `{id, revision, moveToListId?}`. Lista ocupada exige destino na mesma viagem; preserva lugares, datas, notas e estado de visita. A padrão pode ser renomeada, mas não excluída. |
| `GET /trips/{id}/places` | Lista completa com `id`, `revision`, `position` e dados do lugar. |
| `POST /trips/{id}/places` | `Place`. |
| `PATCH /trips/{id}/places` | `{id, revision, place: Place, position?}`. Revisão atual e objeto completo. |
| `DELETE /trips/{id}/places` | `{id, revision}`. Remove o lugar e sua foto enviada. |

`Place`: `name` (1–300), `address` (até1.000), `url` (http/https ou vazio), `listId` (ID ou null), `date` (`YYYY-MM-DD` ou null), `time` (`HH:mm` ou null), `latitude`/`longitude` (ambas números ou ambas null), `notes` (até4.000) e `visited` (boolean). Campos com padrão podem ser omitidos na criação, mas edição deve preservar os existentes. `listId` ou `date` é obrigatório; a data precisa estar no período da viagem. Coordenadas válidas: latitude entre−85 e85, longitude entre−180 e180.

Para mover entre listas, altere `listId`. Para colocar no roteiro, defina `date` e opcionalmente `time`. Para tirar apenas do roteiro, use `date:null,time:null` e preserve `listId`; um lugar sem lista precisa receber uma antes. Para marcar visita, altere `visited`. `position` ajusta a ordem na lista; a ordem do dia usa a API de roteiro. Mover locais ao excluir uma lista incrementa a revisão de cada lugar: releia antes de outra edição.

Se a lista de destino desaparecer durante uma criação, edição ou movimento, a escrita é recusada. Releia as listas e a revisão do lugar antes de escolher um destino válido e reenviar.

## Roteiro, busca e mapas

| Método e caminho | Contrato |
| --- | --- |
| `GET /trips/{id}/timeline?day=YYYY-MM-DD` | `ids` salvos, `currentIds` atuais e `revision`. |
| `POST /trips/{id}/timeline` | `{day, revision, ids}`; todos os `currentIds`, cada um uma vez, na ordem desejada. Reordenar não muda horários das reservas. |
| `POST /trips/{id}/place-search` | `{query, day?, nearby?}`; query de3–200 caracteres, busca contextualizada. |
| `POST /destinations/search` | `{query}` de2–200; referências para os destinos da viagem. |
| `GET /trips/{id}/locations` | Localizações persistidas e pendências das reservas. |
| `POST /trips/{id}/locations` | `{key, retry?}`; use chave devolvida pela Central. |
| `POST /trips/{id}/map-point` | `{day, key}`; somente pontos pertencentes às reservas daquele dia. |

Pesquisas dependem dos provedores externos e respeitam cache/limites. Nunca invente coordenadas, IDs de candidatos ou atribuições de fotos. Prefira pontos persistidos de `locations`; uma falha de geocodificação não invalida a reserva.

## Reservas, revisões e documentos

Reservas suportam `hotel`, `flight`, `train`, `bus`, `car`, `transfer`, `ferry` e `activity`. A seleção explícita de um resultado real de `place-search` pode preencher `locationPoint` e `destinationPoint`: `{name,address,latitude,longitude,osmType,osmId,kind}` (sem `bbox`, `url`, `context` ou `addressParts`). O endereço deve corresponder ao respectivo campo textual. `locationPoint.name` mantém o nome real retornado pelo mapa, que pode ser uma rua/número; `title` identifica a hospedagem e não precisa coincidir. A seleção explícita aceita imóveis residenciais sem estabelecimento cadastrado. Remova a seleção ao alterar o endereço; renomear a hospedagem mantém o ponto. Não invente nome comercial ou coordenadas. A localização automática também tenta endereço completo de hospedagem com correspondência única; divergências continuam pendentes. Hospedagem manual usa um único endereço/fuso. Eventos usam o local selecionado para aparecer no mapa durante o período; não crie outro lugar para duplicar o ponto. O cadastro manual gera fonte `manual` com `entryId` real; não a fabrique em importações de e-mail/arquivo. Uma reserva manual depois encontrada numa fonte exige reconciliação explícita pelo registro existente; não presuma deduplicação entre chaves distintas.

| Método e caminho | Contrato |
| --- | --- |
| `POST /trips/{id}/import` | Pacote de importação existente com `version:1`, `reservation`, `documents` e `change`/`reviewReason` opcionais. Uso interativo; a rotina usa `/api/sync/trips/{id}/import`. |
| `PATCH /trips/{id}/reservations/{reservationId}` | `{baseFingerprint, reservation}`; reserva completa, proveniência preservada e fingerprint atual. Marca ajuste manual. |
| `POST /trips/{id}/reservations` | `{requestId, reservation}`; UUID estável para tentativas do mesmo cadastro manual; campos da reserva sem `sourceKey`/`sources`, gerados pelo servidor. Proprietário/editor; datas dentro da viagem. Retorna 201 na criação, 200 na repetição idêntica e 409 se o mesmo pedido já tem outros dados. |
| `GET /trips/{id}/reviews` | Pendências com reserva atual e fingerprint. |
| `POST /trips/{id}/reviews` | `{id, action:"accept"|"dismiss", baseFingerprint:string|null, reservation?}`. Conferir antes de aceitar. |
| `GET /documents/{id}` | Bytes originais; `?download=1` solicita anexo. Permissão vem da viagem correspondente. |

O contrato completo da importação está em [PROMPT_SCHEDULED_TASK.md](PROMPT_SCHEDULED_TASK.md) e no catálogo da API. Cancelamento mantém o histórico: importe a mesma reserva/sourceKey com `change:{action:"cancel",baseFingerprint}` e a fonte real do cancelamento. Mudanças ambíguas ou que conflitem com edição manual seguem para revisão. Não transforme cancelamento em exclusão silenciosa.

Limites:25MB por corpo de importação, até20documentos de10MB cada; PDF, PNG, JPEG, GIF, WebP ou texto. Não use URL temporária como substituta dos bytes. Depois de importar, releia a viagem; para verificar integridade, baixe o documento pela API e compare SHA-256.

## Imagens e convidados

| Método e caminho | Contrato |
| --- | --- |
| `GET/POST/DELETE /trips/{id}/cover` | Ler/enviar/restaurar capa da viagem. POST `{revision,mime,base64}`; DELETE `{revision}`. Versão atual em `cover_version` da viagem. |
| `GET/POST/DELETE /profile/cover` | Capa pessoal. GET com `?metadata=1` obtém `cover_version`; POST/DELETE como acima. |
| `POST /trips/{id}/places/{placeId}/photo-search` | Busca candidatos para o lugar existente; sem campos de corpo. |
| `GET/POST/DELETE /trips/{id}/places/{placeId}/photo` | Foto enviada do lugar. POST `{revision,candidateId}` ou `{revision,mime,base64}`; DELETE `{revision}`. Use a revisão atual do lugar. |
| `GET/POST/DELETE /trips/{id}/members` | Somente proprietário. GET lista; POST `{email,role:"reader"|"editor"}`; DELETE `{email}`. |

Imagens enviadas: JPEG ou PNG, até2MB decodificados. Uma foto escolhida de provedor mantém URL/atribuição, não vira upload fictício. Caminhos `/api/...` devolvidos pela interface podem ser acessados por este cliente acrescentando `/assistant` após `/api` quando estiverem no catálogo.

Convidar na viagem não libera o login privado do Site. O agente explica as duas camadas e usa o conector Sites para a política do Site somente com autorização da pessoa. Estas operações não enviam e-mail.

## Verificação e disponibilidade

Após cada escrita, confira a resposta e releia o recurso relevante. Em timeout de criação de viagem, lista ou lugar, consulte os recursos antes de tentar novamente para evitar duplicação; esses POSTs não possuem chave de idempotência. API publicada, autenticação HTTP, importação com anexos e execução do Scheduled Tasks são verificações distintas. Não afirme que o agendador funciona apenas porque a chamada interativa funcionou. O ensaio de instalação independente continua necessário.

A localização automática de hospedagens usa também endereço completo conforme IMPORTACAO.md. O upload manual em Documentos é uma rota de interface autenticada e não amplia o catálogo `/api/assistant`; para o assistente, os anexos continuam pelo contrato de importação existente.

## Aeroportos por código IATA

`GET /api/assistant/airports/{iata}` faz consulta exata no catálogo local OurAirports, sem chamada ao OSM. Retorna `status` (`found`, `not_found` ou `ambiguous`), `airport` (`iata`, `name`, `location`, `sourceUrl`) ou `null`, `provider` e `catalogDate`. Código inválido retorna 400. `location` reúne nome, cidade atendida e país; não é endereço postal validado. Preencha apenas lacunas ou valores ainda derivados do código, preservando endereço, terminal e ponto já confirmados. Código de cidade não substitui IATA de aeroporto. Consulte [IMPORTACAO.md](IMPORTACAO.md) para os campos `flight` e a distinção entre texto e ponto no mapa.

## Trem e ônibus: serviço, estações e cidades

Para `kind: "train"` ou `"bus"`, use o objeto opcional `reservation.transit`:

| Campo | Conteúdo e limite |
|---|---|
| `number` | Identificador do serviço, texto de 1–40 caracteres. Preserve letras, espaços e zeros iniciais. |
| `originStation` / `destinationStation` | Nome da estação ou terminal de partida/chegada, 1–300 caracteres. |
| `originCity` / `destinationCity` | Cidade de cada etapa, 1–300 caracteres. |

Todos os subcampos são opcionais; omita desconhecidos. Texto vazio, número JSON, campo extra ou `transit` em outra categoria retorna 400. O serviço não substitui `confirmation` e não é bilhete/localizador. Preserve a grafia da fonte; não extraia cidades de partes arbitrárias do endereço. `location`/`destination` continuam sendo endereços/localizações e os pontos OSM continuam em `locationPoint`/`destinationPoint`.

O mesmo contrato atende cadastro manual (`POST /api/assistant/trips/{id}/reservations`, sem sourceKey/sources e com requestId), edição (`PATCH /api/assistant/trips/{id}/reservations/{reservationId}`, Reservation completo e baseFingerprint), importação (`POST /api/assistant/trips/{id}/import`) e sincronização (`POST /api/sync/trips/{id}/import`). As rotas da interface correspondentes em `/api/trips` usam o mesmo schema, com login/CSRF. Leitura de viagens devolve `transit` quando presente; as capacidades do assistente e de sync divulgam `transitFields` e `TransitDetails`. Não há uma rota nova nem ampliação de permissões.

Reservas antigas sem `transit` continuam aceitas sem migração ou preenchimento automático. Para complementar uma reserva, leia sua versão atual, preserve os demais campos e fontes, envie a atualização e releia para conferir cada subcampo. Omitir dados de uma fonte nova não autoriza apagar informações já conhecidas. Atualização por importação mantém `change`/fingerprint e revisão de conflitos; não crie outra sourceKey. O card mostra estações/terminais, cidades abaixo dos nomes e serviço; endereços completos e referência continuam na consulta.


Em HTTP 423, preservar dados e pendências, relatar que alterações/importações estão suspensas e orientar o proprietário pelo aviso da Central. O aceite é pessoal e exclusivo no aplicativo; a rotina não aceita termos nem altera configurações para contornar a regra. Contatos técnicos são automáticos após o aceite. Preservar T0 e reconsultar/deduplicar ao retomar; não tratar uma importação recusada como concluída.
