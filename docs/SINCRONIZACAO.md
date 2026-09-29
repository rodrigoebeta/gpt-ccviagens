# Configurar sincronização na nuvem

O produto inclui uma API específica para automação. Ela começa desativada e não agenda tarefas por conta própria. A ativação é opcional, escolhida no onboarding. A execução real na nuvem deve ser validada em cada instalação; ter código, credencial e prompt não comprova acesso às ferramentas do ambiente agendado.

## Oferta e escolha das fontes

Siga a etapa5 de [ONBOARDING.md](../ONBOARDING.md). Descubra as ferramentas e conexões realmente presentes, usando metadados de acesso/conta antes de ler conteúdo. Avalie quais fontes conseguem listar novidades por um campo temporal confiável, ler conteúdo/IDs estáveis e obter bytes originais de documentos no executor cloud. E-mail é uma opção, não requisito: pastas/nuvem e outros serviços podem ser usados quando essas capacidades estiverem disponíveis. Caminho local, plugin no catálogo ou prévia textual de anexo não comprovam acesso cloud aos arquivos.

Com fonte apta, ofereça por Question **Configurar com esta fonte** / **Escolher outra fonte** / **Agora não**, adaptando rótulos ao serviço confirmado. Com várias, obtenha a conta/pasta/recorte escolhido em uma rodada curta. Sem conexão apta, ofereça **Conectar uma fonte** / **Agora não**; sugira e-mail ou uma fonte adequada às reservas da pessoa, descubra o plugin correto e conduza a autorização oficial. Se ferramentas novas exigirem outra conversa, entregue o briefing da instalação para retomar; não reinicie onboarding nem repita escolhas.

A escolha de ativar autoriza somente as fontes/contas e viagens apresentadas, com leitura da fonte e importação na Central; não autoriza alterações na fonte. Reutilize decisões de importação já confirmadas, mas confirme a inclusão na rotina recorrente quando essa autorização ainda faltar. Explique que a tarefa consulta novidades a cada execução, e obtenha frequência, horários e fuso IANA, por exemplo **Uma vez ao dia** / **Duas vezes ao dia** / **Escolher outro horário**. Não imponha horários ou conta pessoal do autor. A regra de período da viagem e o recorte desde o cadastro são independentes. Reservas anteriores ao início escolhido pertencem à importação inicial, autorizada separadamente.

## Responsabilidades de autenticação

O Sites aceita `OAI-Sites-Authorization: Bearer <token>` para atravessar seu login sem identidade de visitante. A Central valida separadamente `X-Central-Sync-Token: <token>` contra um SHA-256 configurado no servidor e usa a identidade fixa dessa configuração. No fluxo de instalação abaixo, os dois cabeçalhos recebem o mesmo `siwc_bypass_bearer_token` obtido de `get_site`. Não confiar no encaminhamento do primeiro cabeçalho ao aplicativo, nem enviar `oai-authenticated-user-*` para simular login.

Quem obtém esse token pode usar as operações de sincronização e de gerenciamento da [API do assistente](API_ASSISTENTE.md) com as permissões do usuário configurado. O prompt da tarefa limita seu uso a /api/sync, mas o token não possui escopo exclusivo de sincronização. Não é uma credencial para compartilhar com convidados. O agente verifica que a pessoa é proprietária do Site e do usuário escolhido para a automação. As rotas da interface continuam exigindo o login normal.

**Cada instalação tem seu próprio projeto, URL, token, hash e principal no servidor.** Releia esses dados na conta da pessoa. Nunca use valores do autor, de outra instalação ou de um exemplo; não copie uma configuração de runtime junto do pacote. `get_site` deve corresponder ao vínculo da própria instalação, e o hash configurado deve derivar do token desse mesmo projeto. Tokens de fontes conectadas ficam sob a autorização dos respectivos conectores, não no prompt nem nas variáveis da Central. O agente não pede à pessoa que copie segredos.

## Etapas conduzidas pelo agente

| Etapa | Ação do agente | Ação da pessoa | Conclusão e recuperação |
| --- | --- | --- | --- |
| Escolha | Inventariar conexões reais e avaliar fonte/conta, campo temporal e acesso aos originais; explicar viagens elegíveis e frequência por Question. | Ativar, escolher fonte/conta/escopo e horário/fuso, ou adiar. | Decisões anteriores são reutilizadas. Adiar não interrompe o restante do onboarding. |
| Pré-requisitos | Conferir o Site correto, propriedade, API incluída, conector Sites e ferramentas da fonte e HTTP no ambiente cloud. | Autorizar apenas conexões ausentes pelo fluxo oficial. | Sem HTTP com headers/corpo, Sites ou fonte apta, registrar a capacidade faltante; não prometer sincronização. |
| Identidade | Usar a sessão autenticada quando disponível ou ler pelo conector Sites o `owner_id` de uma viagem confirmada da pessoa e o e-mail do proprietário. `account_user_id` da política do Sites pode ser diferente do `owner_id` das viagens. | Criar a primeira viagem pela interface, se ainda não houver identidade comprovada. | Nunca escolher arbitrariamente outro proprietário em instalação com várias pessoas. Não usar ID/e-mail inventados. |
| Credencial | Chamar `get_site` para o projeto exato e obter o token existente em memória, sem imprimi-lo. Não pedir MCP nesse passo. | Se não existir token, autorizar explicitamente sua geração quando o agente apresentar essa necessidade. | `generate_siwc_bypass_token` cria ou rotaciona; não chamá-lo automaticamente a cada teste. Se a credencial foi exposta, orientar rotação coordenada. |
| Configuração | Calcular SHA-256 dos bytes UTF-8 do token em memória e atualizar somente as quatro variáveis abaixo pelo conector Sites. Preservar as demais. | Nenhuma cópia manual de segredo é necessária quando as ferramentas suportam essa operação. | Nunca usar prompt, Git, arquivo público, URL ou logs para transportar o token. Não gravar valores provisionados em `.openai/hosting.json`. |
| Aplicação | Publicar o código aprovado e aplicar a revisão de ambiente. Na instalação pública, a publicação privada integra o pedido de instalar; preservar vínculos e audiência. | Apenas ações que o ambiente realmente exigir. | Mudança de ambiente só passa a valer após deploy. Falha de configuração mantém as rotas desativadas. |
| Pré-verificação | Fazer GET autenticado de viagens e conferir capacidades da fonte; com reserva autorizada, verificar importação/persistência/anexos sem repetir ensaio já comprovado. | Escolher a reserva/documento apenas se o escopo ainda faltar. | Não povoar instalação com exemplos. Sem itens elegíveis, registrar leitura verificada e importação aguardando ocorrência real; não alterar a viagem para fabricar teste. |
| Criação | Preparar prompt integral, marco T0 fixo e resumo da configuração. Conferir tarefas existentes quando a ferramenta permitir, evitando duplicação da mesma instalação/fonte. Seguir o fluxo de criação abaixo. | Escolher **Criar tarefa**, se a autorização ainda não tiver sido dada; no fallback, salvar o prompt na tela Scheduled cloud. | Selecionar uma opção ou gerar o texto não comprova tarefa cadastrada; conferir estado retornado ou confirmação específica da pessoa. |
| Execução | Conferir uma execução real na nuvem e os dados persistidos, distinguindo fonte, API, importação e documentos. | Informar o relatório do executor quando não for possível consultá-lo diretamente. | Sem novidades/viagem, não declarar importação validada. Erros preservam T0 para recuperação; acompanhar sem interromper demais etapas do onboarding. |

Variáveis de runtime (sem valores padrão de instalação no pacote):

| Variável | Valor |
| --- | --- |
| `CENTRAL_SYNC_TOKEN_SHA256` | SHA-256 hexadecimal minúsculo do token do Sites, 64 caracteres. Marcar como segredo. Nunca usar o próprio hash no cabeçalho: o cliente envia o token original. |
| `CENTRAL_SYNC_USER_ID` | ID real e estável do usuário no aplicativo (`owner_id` de sua viagem confirmada). |
| `CENTRAL_SYNC_USER_EMAIL` | E-mail confirmado da mesma pessoa; o servidor usa esse valor para suas participações nas viagens. Marcar como segredo. |
| `CENTRAL_SYNC_TIMEZONE` | Fuso IANA escolhido para a tarefa. Sem valor, o corte de viagens encerradas usa UTC. |

A configuração é por instalação e representa uma pessoa. Ela permite listar/ler/importar apenas viagens em andamento ou futuras em que essa pessoa é dona ou editora; leitores e viagens sem vínculo ficam de fora. Permissões são verificadas novamente em cada chamada. A tarefa pode restringir mais o escopo conforme a escolha da pessoa. As rotas não criam viagens, não administram convidados, não alteram configurações e não aceitam identidade enviada no corpo/cabeçalhos pelo cliente.

## Contrato HTTP

Todas as chamadas usam HTTPS, `Accept: application/json`, os dois cabeçalhos de autenticação e redirects desativados. O token só pode ser enviado à origem exata retornada pelo Sites para o projeto escolhido. O POST também exige `Content-Type: application/json`. `Origin` não é necessário para um cliente de servidor; se enviado, precisa corresponder à origem da requisição.

| Operação | Endpoint e resposta |
| --- | --- |
| Viagens elegíveis | `GET /api/sync/trips` retorna `apiVersion`, `asOf`, `timezone`, `trips` e `nextOffset`. Viagens incluem `id`, `name`, `start_date`, `end_date`, `destinations`, `destinationLocations` e `role`. Enquanto `nextOffset` não for nulo, consultar `?offset=<nextOffset>`. |
| Contexto/releitura | `GET /api/sync/trips/{id}` retorna `{apiVersion:1,trip,reservations}`. Datas da viagem são `trip.start_date`/`trip.end_date`; `reservations` fica na raiz e suas datas usam `startDate`/`endDate`. Inclui `sourceKey`, fontes, `fingerprint`, status e metadados de documentos em `reservations[i].documents`; não entrega bytes ou hashes desses anexos. |
| Importar | `POST /api/sync/trips/{id}/import` recebe o mesmo contrato `version:1` de [IMPORTACAO.md](IMPORTACAO.md) e `site/lib/contracts.ts`. Retorna os indicadores existentes `reservationId`, `created`, `documentsAdded`, `updated`, `cancelled` ou `reviewId`/`reviewRequired`/`reviewStatus`. |

O importador reutiliza validação de datas, fontes e documentos, armazenamento D1/R2, deduplicação, proteção de ajustes manuais e revisão de divergências. Não altera silenciosamente uma viagem para acomodar um documento. O corpo tem limite de 25 MB, cada arquivo decodificado de 10 MB e cada pacote de 20 documentos. Uma reserva com muitos anexos pode ser reenviada com o mesmo `sourceKey`/dados e outros documentos, respeitando os limites; os anexos são deduplicados pelos bytes.

## Prompt entregue à tarefa

Use [PROMPT_SCHEDULED_TASK.md](PROMPT_SCHEDULED_TASK.md) como a fonte única do texto executável. O agente preenche todos os campos; a pessoa não precisa escrever prompts nem preencher parâmetros técnicos. Confira:

- Projeto e origem HTTPS pertencem à instalação atual, confirmados por get_site/vínculo; nenhum ID, domínio, conta ou segredo de outra instalação.
- Cada fonte contém serviço, conexão/conta exata, recorte/pasta autorizados, campo temporal e instrução compatível com suas ferramentas para listar, ler e obter originais; nenhuma fonte genérica indecisa.
- Escopo de viagens escolhido: todas as elegíveis, incluindo novas futuras, ou IDs explícitos daquela instalação.
- Frequência, horários/fuso e `INICIO_MONITORAMENTO_UTC` fixos e confirmados; definição de T0 indicada abaixo.
- Instruções completas de autenticação em runtime, janela, seleção, contrato, anexos, versões, deduplicação, verificação e falhas, sem token/hash/cookies.
- Nenhum placeholder restante, caminho local necessário, referência a conversa anterior ou instrução do instalador no prompt final. Não substitua o contrato por resumo.

Salve **todo o conteúdo** no agendamento; uma tarefa cloud não pode depender do arquivo do computador do instalador. Se for preciso recriar a tarefa, entregue novamente o prompt inteiro e preserve T0, fontes e escopo anteriores, a menos que a pessoa escolha reiniciar. Não peça para "continuar o probe anterior" nem acrescente criação/exclusão de viagens da rotina de teste.

## Escolha clicável e criação efetiva

Apresente um resumo curto da Central, fontes/contas, escopo, frequência/fuso e início. Se faltar autorização final, use Question **Criar tarefa** / **Ajustar opções** / **Agora não**. A resposta **Criar tarefa** autoriza o agente a executar a criação daquele resultado concreto; não peça a mesma autorização em outro turno. Se o pedido já contiver todos os parâmetros e autorização, prossiga. Opção pré-selecionada ou ausência de resposta não autoriza.

1. **Ferramenta nativa de agendamento disponível:** use seu schema real para criar no ambiente cloud com o prompt completo, conexões e programação escolhida. Se ela expuser um cartão/botão de criação, use-o. Aguarde o resultado real antes de dizer que foi criada. Question coleta uma decisão; não é por si só uma ferramenta de agendamento.
2. **Sem criação nativa neste chat:** entregue o prompt preenchido integralmente em um bloco copiável e, separado, nome sugerido da tarefa, frequência, horários/fuso e opção de execução na nuvem. Oriente a abrir **Scheduled / Agendadas**, criar uma nova tarefa cloud e colar o texto no campo de instruções, conforme os controles realmente disponíveis. Não obrigue a abrir outro chat Work. Se a superfície permitir criação por conversa, pode oferecer essa alternativa com o texto já pronto, sem depender do histórico.
3. **Após salvar:** confira ID/link retornado, projeto/origem, execução cloud, fontes/conexões, programação, T0 e prompt armazenado quando houver leitura disponível. Se houve timeout, consulte a tarefa antes de repetir. Se só a pessoa puder ver a tela, peça uma confirmação específica do salvamento/horário/ambiente, sem exigir dados que ela não consegue obter; registre o que foi relatado. Não invente ID, deep link, ferramenta ou botão em Markdown. No desktop, uma tarefa vinculada apenas à pasta/worktree local não equivale à nuvem.
4. **Primeiro run:** diferencie `prompt preparado`, `tarefa cadastrada`, `acesso cloud verificado` e `importação com documentos verificada`. Mostre o gerenciamento real para consultar/pausar/editar. Sem uma reserva nova elegível, a tarefa pode ficar configurada aguardando uma ocorrência; não marque uma execução vazia como importação comprovada. Se faltar acesso à fonte/anexos/API no executor, informe a falha e resolva a dependência, preservando a configuração preparada.

A documentação oficial descreve [criação de tarefas pelo chat e uso de conexões cloud](https://learn.chatgpt.com/docs/automations). Ela não estabelece um botão universal de onboarding para criar qualquer tarefa. Um botão de mensagem em [UI própria de plugin/MCP](https://developers.openai.com/plugins/build/chatgpt-ui) requer essa integração e não comprova criação do agendamento. Este produto não depende dela: use a decisão clicável e as ferramentas efetivamente expostas na conta. Não habilite eventos ou outra modalidade de execução sem escolha e verificação específicas; o roteiro padrão é periódico.

## Marco inicial, repetição e limites

T0 marca o início da autorização para acompanhar novidades, não a primeira execução. Prefira o instante real de cadastro retornado pelo agendador. Se esse dado só surgir depois da criação, mantenha a primeira execução futura/pausada quando suportado e grave o ISO 8601 UTC literal no prompt antes do primeiro run. Não salve placeholders executáveis. Se isso não for possível, use o instante da confirmação **Criar tarefa**, capturado pelo agente, apresentando claramente **"acompanhar a partir de agora"**. Esse segundo caso inclui o intervalo entre a confirmação e o salvamento; não o descreva como created_at exato do serviço.

No fallback manual, o agente entrega um instante literal escolhido para início junto do prompt; a pessoa apenas copia. Se a pessoa exigir exatamente o horário do salvamento e o ambiente não o fornecer, orientar a captura desse horário e devolver o prompt completo atualizado antes da primeira execução. Nunca substitua esse requisito silenciosamente por "primeiro run". Preserve T0 ao pausar, retomar, recriar ou trocar de conversa. Alterar o recorte anterior exige escolha explícita.

Na implementação atual, não há cursor/registro de mensagens processadas por tarefa no backend. O prompt adota reconsulta completa de T0 ao início de cada execução, com paginação/divisão temporal e deduplicação de reservas/bytes. Não depende de memória entre runs, checkpoint local ou endpoint inexistente. Novas viagens podem assim aproveitar mensagens recebidas desde T0 mesmo quando antes não havia viagem elegível. Mais de uma execução pode reencontrar o mesmo item; isso não autoriza reverter uma versão mais nova.

O custo cresce com a janela. Se o executor não cobrir todos os resultados dentro dos limites, deve informar varredura parcial e o recorte pendente; não encurtar T0 por conta própria nem dizer que toda a caixa foi processada. Aumentar a frequência não resolve sozinho um acúmulo maior que a capacidade. Um cursor persistente seria uma evolução separada e precisaria preservar falhas, anexos pendentes e mudanças nas viagens; não o prometer como recurso já instalado.

## Falhas, troca de credencial e desativação

- **401:** token ausente/incorreto ou diferente do hash configurado. Não tentar e-mail/ID alternativos nem gerar credenciais repetidamente.
- **403:** recusa do Sites, origem divergente, permissão insuficiente ou viagem encerrada. Conferir a camada que respondeu e o vínculo atual da pessoa.
- **503 de sincronização:** configuração incompleta ou fuso inválido. Corrigir somente os valores necessários e aplicar a revisão de ambiente por deploy.
- **400/413/415:** revisar contrato, tamanho e Content-Type. Não descartar ou converter anexos sem informar a pessoa.
- **409:** reler a reserva e tratar concorrência/revisão. Não sobrescrever às cegas.
- **Rotação:** se autorizada, rotacionar o bypass do Sites, recalcular o hash, atualizar `CENTRAL_SYNC_TOKEN_SHA256` e aplicar o ambiente. A tarefa relê o token com `get_site` em cada execução, portanto o prompt não muda. Até concluir as duas camadas, tratar a sincronização como indisponível. A rotação apenas do gateway não substitui a revogação da credencial dentro do aplicativo.
- **Pausar a rotina:** pausar/remover somente a tarefa identificada, quando solicitado. Dados importados permanecem. Não revogar a API apenas porque a pessoa adiou a automação; a API do assistente também a utiliza.
- **Revogar o acesso da API:** quando solicitado, remover `CENTRAL_SYNC_TOKEN_SHA256` do runtime e aplicar a revisão por deploy. As rotas sync e assistant passam a recusar essa credencial. Informar esse alcance; dados e login normal da Central são preservados.

Não transmitir dados de viagem à telemetria para testar. A instalação independente e a tarefa real precisam ser conferidas na conta da pessoa; não anunciar compatibilidade universal com todos os ambientes a partir de teste local.

## Contrato atualizado e tarefas já existentes

Em toda execução, ler `GET /api/sync/capabilities` e seu `reservationImportContract` antes de montar pacotes. O mesmo contrato acompanha `GET /api/sync/trips` e `GET /api/sync/trips/{id}`, com todos os campos, dados de voo/tickets, pontos OSM, limites e regras por categoria. A rotina usa exclusivamente `/api/sync`; a descoberta não autoriza gerenciamento nem amplia o escopo confirmado.

Uma atualização da Central não reescreve prompts salvos no agendador. Ao atualizar uma tarefa existente, substituir suas instruções pelo PROMPT_SCHEDULED_TASK.md atual, preenchendo os dados daquela instalação e preservando T0, frequência, fuso, fontes, contas e escopo. Não recriar a tarefa com um novo marco inicial. Verificar a primeira execução na nuvem e a leitura posterior dos campos; testes locais da API não comprovam essa execução.
