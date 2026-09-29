# Onboarding guiado pelo Work

O Work também opera o produto por [API do assistente](docs/API_ASSISTENTE.md): viagens, listas, locais, roteiro, reservas, revisões, documentos, capas e convidados. Após configurar a autenticação, consultar `/api/assistant/capabilities`, executar o pedido autorizado e conferir a persistência. Ensinar esse caminho durante o onboarding, sem substituir a prática inicial pela interface.

Comece após publicação e login. Leia GUIA_DO_PRODUTO.md e confira os controles atuais da Central. Apresente uma etapa curta por rodada e use **Question** (ou ferramenta equivalente) com opções clicáveis. Os rótulos abaixo orientam a criação das perguntas; não são botões de Markdown.

## Continuidade obrigatória

O onboarding deve cobrir: compartilhamento nas duas camadas; criação da viagem pela pessoa na Central; oferta de importação; reservas e documentos; Scheduled Tasks; locais em listas e roteiro. **Não encerre porque a pessoa adiou a viagem, não tem reservas ou não conectou e-mail.** Adiar a prática não pula a explicação nem as próximas rodadas. Respeite uma pausa explícita da pessoa e registre onde retomar.

Use duas ou três opções curtas por pergunta, com resposta livre opcional. Texto livre pela ferramenta Question somente quando a informação não puder ser escolhida ou inferida. Não peça para digitar “sim”, números ou prompts para continuar no mesmo chat. Se a ferramenta não estiver disponível, explique uma vez e use a alternativa mais curta, sem simular botões. Espere a resposta real para ações dependentes dela; silêncio ou opção pré-selecionada não são confirmação.

Registre por etapa: apresentado, praticado, verificado, prática adiada ou bloqueado. Não marque uma explicação obrigatória como adiada só porque faltam dados para praticar. Não crie dados de exemplo. Não repita decisões confirmadas.

## 1. Entrar e entender o compartilhamento

Entregue a URL confirmada pelo Sites, guie o login oficial e apresente Viagens, Programação e Reservas da Viagem. Question: **SIM, abri minha Central** / **Preciso de ajuda para entrar**. Se falhar, confira URL e sessão antes de alterar configurações.

Antes de encerrar o turno de instalação, explique as duas permissões:

- No [painel Sites](https://chatgpt.com/sites), abrir a Central → **Compartilhar / Share** libera a entrada no aplicativo para outras contas. Mantenha acesso somente aos convidados, conforme as opções disponíveis. Não é preciso conceder edição do Site.
- Na **URL real da Central**, abrir **Viagens → Detalhes e convidados → Convidados** libera os dados daquela viagem para o mesmo e-mail. Escolher **Pode visualizar** ou **Pode editar**. Repetir em cada viagem que quiser compartilhar.

Inclua a URL real da Central como link, junto ao caminho. Use um link de gerenciamento mais específico apenas se retornado e verificado. O modal de convidados não tem endereço próprio no aplicativo atual; não invente parâmetros para abri-lo.

Question: **Entendi; continuar** / **Quero ajuda para compartilhar**. A explicação é obrigatória; convites só quando solicitados. Sem viagem, apresente o fluxo e adie a prática. Se solicitado, obtenha somente destinatário, viagem e papel ausentes por Question. Confira ambas as listas. O formulário da Central não envia e-mail. A tela do proprietário não comprova o acesso do convidado: confirme com a conta autorizada quando possível. Entrou sem ver dados? Confira e-mail e permissão da viagem. Não entrou? Confira Sites e login. Revogar uma camada não revoga automaticamente a outra.

## 2. A pessoa cria a viagem pela Central

Oriente **Viagens → Nova viagem**, preencher nome, período com ano e destinos, selecionar a cidade/região correta e salvar. Esses campos são preenchidos no formulário, não coletados no chat para o agente cadastrar. Se a viagem já existe, reconheça e use-a; não peça outra.

Question: **SIM, criei pela Central** / **Quero criar depois** / **Preciso de ajuda**.

- Criou: confira dados e persistência após recarga, por leitura autenticada quando disponível. Identifique o que foi observado e o que foi relatado.
- Depois: registre prática adiada e siga imediatamente à oferta de importação.
- Ajuda: oriente o formulário, confirme ou permita adiar a prática e siga para importação.

Falha de persistência exige diagnóstico de login, banco e migrações; não solicite repetidos cadastros. Continue as explicações independentes.

## 3. Sempre oferecer importação, começando pelo e-mail conectado

Verifique primeiro quais ferramentas e conexões de e-mail estão disponíveis, sem ler conteúdo só para descobrir a conta. Plugin no catálogo, instalado e conta autenticada são estados diferentes. Considere qualquer serviço acessível, incluindo Gmail e Outlook; não exija Gmail.

Com conexão confirmada, identifique o serviço e proponha buscar reservas de viagens recentes. Question: **Buscar no e-mail conectado** / **Usar arquivos ou outra fonte** / **Conhecer o fluxo por enquanto**. Se houver várias contas, ofereça escolha quando necessário. A opção de busca autoriza somente o recorte explicado; não autoriza enviar, apagar ou alterar mensagens.

Sem conexão, Question: **Conectar meu e-mail** / **Usar arquivos ou outra fonte** / **Conhecer o fluxo por enquanto**. Descubra o plugin correto e conduza autorização oficial; siga o guia de instalação para eventual novo chat. Para arquivos, oriente o controle de anexar ou a fonte/pasta acessível. Não solicite upload numa ferramenta Question que só aceite texto; use-a apenas para escolhas e confirmação. Não prometa acesso local no Work da web.

**Com viagem:** leia as viagens autorizadas, suas datas e os destinos cadastrados. Se houver várias, ofereça escolha. Use cidades/regiões e variações dos nomes para orientar a busca; amplie pelos estabelecimentos e operadores encontrados. Confira datas dos serviços, ano, alterações e cancelamentos, não só o recebimento da mensagem: uma compra feita meses antes pode pertencer ao período. Pedidos pontuais podem incluir viagens passadas pela API do assistente, sem alterar o escopo da rotina agendada. Confira a correspondência e permissão de edição antes de importar; ausência de resultados não comprova ausência de reserva.

**Sem viagem:** ainda ofereça conexão, arquivos e explicação. Para salvar, será necessário criar uma viagem na Central. Pode haver busca exploratória pontual autorizada de confirmações recentes: ofereça **Últimos 30 dias de mensagens** / **Últimos 90 dias de mensagens** e explique que isso é um recorte inicial de mensagens, não filtro de datas dos serviços nem automação. Resuma somente reservas relevantes, sem criar viagem ou importar. Oriente a criação na interface com base nas datas conferidas. Se a pessoa adiar novamente, prossiga com documentos, Scheduled Tasks e locais, sem insistir nem iniciar busca recorrente irrestrita.

Sem resultados ou reservas, registre prática adiada e continue. Não termine o onboarding nessa etapa.

## 4. Reservas e documentos

Apresente **Programação → Adicionar reserva**, ao lado de Adicionar lugar: Hospedagem, Transporte (voo, trem, ônibus, aluguel de carro, transfer, ferry) e Evento ou atividade. Não exige comprovante; o registro identifica cadastro manual. Hospedagem usa nome do hotel, endereço, check-in/check-out e um único fuso; carro usa retirada/devolução. Referência, viajantes e anotações são opcionais. Não crie um registro só para demonstrar; pratique se houver uma reserva real que a pessoa queira cadastrar.

Mostre **Buscar nome ou endereço** dentro do formulário. **Nome da hospedagem** identifica o hotel ou apartamento; **Nome ou endereço** é a consulta ao mapa: nome e cidade, ou rua, número e cidade. Imóveis sem nome comercial também podem ser encontrados. Confira o endereço e use **Usar este local**; a seleção preenche endereço/ponto e preserva o nome já informado. **Alterar local** permite refazer a escolha. Digitar sem selecionar não confirma um ponto; alterar endereço desfaz a seleção, renomear hospedagem não. Na importação, hospedagem não encontrada pelo nome também é pesquisada pelo endereço: só uma correspondência única com rua/número/cidade e sem divergências é aceita. Pendências continuam visíveis quando faltam dados, há ambiguidade ou falha do provedor. Confira persistência/mapa quando autorizado. Evento no mapa usa seleção explícita, não dedução pelo título.

Explique: o Work lê confirmações e comprovantes autorizados, extrai os dados, reúne os documentos e envia à viagem existente. A Central guarda a reserva e os anexos; reimportações reconhecem a mesma reserva. Divergências ficam para conferir, preservando ajustes manuais.

Siga docs/IMPORTACAO.md. **Priorize a API autenticada do assistente**, em `POST /api/assistant/trips/{id}/import`, após configurar a autenticação da própria instalação conforme docs/SINCRONIZACAO.md. Confira identidade oficial, viagem, edição e `reservationImportContract` das capacidades atuais. Ensine o agente a preencher todos os campos comprovados de cada categoria, incluindo voo/tickets e pontos, e a conferir a leitura após importar; campo aceito não significa dado encontrado. Não grave diretamente no banco/bucket para contornar a API. Se o chat não tiver transporte autenticado, prepare o arquivo privado e guie **Reservas da Viagem → Importar reserva → selecionar arquivo**, explicando que é a alternativa manual.

Confira datas, passageiros, documentos, recarga e reimportação sem duplicatas. Diferencie salvo, já existente, atualizado e **Para revisar**. Mostre abrir o documento, páginas, zoom, Ajustar, pinça no celular e Baixar (opcional). PDF/imagens/TXT são aceitos; siga o guia para conversões. Sem comprovante, explique sem inventar arquivo.

**Conferir endereços e mapa:** o agente lê os endereços importados e o estado das localizações, pesquisa em fontes oficiais para completar/conferir hotéis, eventos, estações, aeroportos e outros lugares, e salva apenas correções sustentadas, preservando fontes e a versão atual. Siga a etapa de endereços em docs/IMPORTACAO.md. Para viagens passadas, confirme o endereço da época/edição; o site atual pode ter mudado. A pessoa só precisa esclarecer ambiguidades que as fontes não resolvem.

**Critério de conclusão:** separar reserva/comprovantes salvos, endereços conferidos e pontos localizados; mostrar pendências específicas. Endereço preenchido não significa ponto confirmado. A busca automática cobre hotéis, voos, trens, ônibus e ferry; carro e transfer usam pontos selecionados no formulário. Eventos aparecem no mapa quando seu local é selecionado explicitamente, sem dedução automática pelo título. **Recuperação:** falhas temporárias respeitam o intervalo; sem correspondência, revisar a evidência antes de repetir; sem acesso à pesquisa, registrar o limite e seguir o onboarding. Não inventar coordenadas nem criar lugares duplicados para contornar a limitação.

Question: **Entendi; ver automação** / **Preciso de ajuda com a importação**. Resolva a dúvida e continue; não use “quer aprender mais?” como portão para encerrar.

## 5. Scheduled Tasks: oferecer sincronização opcional na nuvem

Explique: “Uma tarefa na nuvem pode consultar sua Central em horários combinados, procurar novas reservas em uma fonte que você autorizar e salvar os dados e comprovantes nas viagens existentes. Ela **não cria viagens** nem precisa do computador ligado quando todas as ferramentas e fontes estão disponíveis na nuvem. A busca acontece a cada execução; não é uma atualização instantânea a cada mensagem.”

O recorte inicial é o instante de cadastro da tarefa, chamado **T0**, e permanece fixo. Em e-mail, ele considera mensagens recebidas desde esse instante; nas outras fontes, exige um marcador temporal equivalente confirmado. A associação usa separadamente as datas reais dos serviços, com ano, e os destinos das viagens. A rotina relê viagens e permissões em cada execução, não pesquisa fontes sem viagens elegíveis e encaminha ambiguidades para conferência. Não escolhe viagens sobrepostas arbitrariamente, altera suas datas nem apaga reservas automaticamente.

### 5.1. Descobrir fontes e oferecer a escolha

Inspecione as ferramentas e os metadados das conexões disponíveis, sem ler mensagens ou documentos para inventariar contas. Reutilize as escolhas da importação, mas confirme sua disponibilidade no executor na nuvem. Plugin no catálogo, plugin instalado, conta autenticada no chat e ferramenta disponível no executor são verificações diferentes.

Avalie cada fonte pelo que suas ferramentas realmente permitem: busca ou listagem paginada com datas, identificadores estáveis, leitura do conteúdo e obtenção dos bytes originais de anexos. Identifique a conta autorizada. E-mail é um exemplo; uma pasta em nuvem também pode ser adequada se oferecer essas capacidades. Um arquivo local ou uma conexão só no desktop não vira fonte da tarefa na nuvem. Ferramenta apenas de busca textual não comprova transferência de anexos. Explique limitações concretas antes de oferecer ativação completa.

- Com uma fonte apta já conectada, use Question: **Configurar com [fonte]** / **Escolher outra fonte** / **Configurar depois**. Substitua o rótulo pela conexão real; se houver várias fontes/contas aptas, ofereça as opções reais em uma rodada curta. Não suponha que todas foram autorizadas.
- Sem fonte apta, use Question: **Conectar uma fonte** / **Conhecer o fluxo** / **Configurar depois**. Sugira e-mail quando fizer sentido e ofereça somente conectores confirmados para aquela conta. Conduza a autorização oficial e verifique a conexão; não peça senha ou token. Se a conexão exigir novo chat, entregue a retomada e preserve decisões já tomadas.

A explicação é obrigatória; ativar é opcional. Adiar, não conectar uma fonte ou ainda não ter viagem não encerra o onboarding: registre o estado e continue para locais. Se faltar identidade comprovada ou viagem para validar a instalação, prepare as escolhas e o prompt, mas registre a ativação/verificação pendente conforme docs/SINCRONIZACAO.md. Não crie viagem fictícia para completar o onboarding.

### 5.2. Preparar a tarefa da própria instalação

Obtenha somente o que ainda faltar por Question, com duas ou três escolhas por rodada: fonte/conta e pasta ou caixa autorizada, todas as viagens elegíveis ou viagens específicas, frequência/horário e fuso IANA. Uma sugestão de frequência não é escolha confirmada. Informe que o recorte começa no cadastro e que importações históricas anteriores a T0 são uma ação separada. Confirme também a política de avisos de novas importações, revisões e falhas conforme as opções reais do agendador.

Siga [docs/SINCRONIZACAO.md](docs/SINCRONIZACAO.md) para conferir o Site, a identidade real e a autenticação. **Cada instalação tem seu próprio projeto, URL, identidade e credencial.** Obtenha o token existente pelo `get_site` daquele projeto somente em memória, configure o hash/principal no servidor e aplique a revisão de ambiente quando necessário. Reutilize configuração válida; não repita provisionamento nem rotacione credenciais automaticamente. Explique uma vez que a mesma credencial também permite operações da API do assistente, embora esta rotina use apenas `/api/sync`.

Preencha [docs/PROMPT_SCHEDULED_TASK.md](docs/PROMPT_SCHEDULED_TASK.md) integralmente com os dados e decisões dessa instalação. Não copie projeto, URL, identidade ou conta do autor ou de outra pessoa. O texto da tarefa não contém token, hash, cookies ou outros segredos; o executor obtém a credencial própria por `get_site` a cada execução. Inclua os contratos e instruções necessários no próprio prompt, sem depender deste arquivo local, de outro chat ou de links que o executor precise descobrir.

Defina T0 uma única vez, em UTC com data e hora completas, e guarde-o no prompt e na continuidade privada. Prefira o horário real de criação retornado pelo agendador, salvando-o no texto antes da primeira execução. Se esse horário não for exposto, registre o instante em que a pessoa confirmar **Criar tarefa**, explicando “acompanhar a partir de agora”; nesse caso, o intervalo entre confirmação e salvamento também será pesquisado. No cadastro manual, registre o instante escolhido antes de entregar o texto. Não grave apenas a expressão “agora” para o executor resolver depois. Em retomadas, falha de criação ou recriação, preserve T0; não o mova para a última execução. A rotina consulta novamente o intervalo desde T0 até o início de cada execução, com paginação e deduplicação persistida na Central. Não prometa cursor entre execuções: ele não faz parte deste fluxo. Se o volume exceder o que o executor consegue examinar, a execução deve relatar cobertura incompleta; não avançar um marco imaginário e perder mensagens.

### 5.3. Criar com o menor número de ações

Apresente um resumo curto com fonte/conta, escopo, frequência, fuso, início do acompanhamento e destino na Central. Se a criação ainda não estiver autorizada, use Question: **Criar tarefa** / **Ajustar opções** / **Configurar depois**. A resposta **Criar tarefa** autoriza o agente a executar a criação descrita; não peça uma segunda confirmação equivalente. Se a pessoa já autorizou esse mesmo resumo, prossiga diretamente. Question coleta a decisão: por si só não cria nem envia o prompt a um agendador.

Descubra a ferramenta nativa disponível e leia seu contrato. Se ela permitir criar uma tarefa com execução **na nuvem**, use-a com o prompt integral e a programação confirmada. Exiba botão/cartão nativo de criação somente quando uma ferramenta real suportar essa ação e preencher esse conteúdo. Não invente botão Markdown, deep link, ID de ferramenta ou parâmetro para encaminhar o prompt, nem use uma automação local como substituta.

Sem ferramenta de criação neste chat, entregue diretamente à pessoa o **prompt integral preenchido**, pronto para colar no campo de instruções de uma nova **Scheduled Task na nuvem**, e os campos separados de nome, frequência/horário e fuso. Indique os controles efetivamente disponíveis e as conexões que devem acompanhar a tarefa. Não exija passar por outro chat do Work como etapa intermediária. Registre T0 e explique seu significado antes de entregar o texto; não deixe um placeholder literal no prompt. Se a pessoa retomar mais tarde, preserve o marco já escolhido e informe o intervalo que será pesquisado.

Antes de repetir uma criação que sofreu timeout, consulte o agendador e confira se a tarefa já existe. Preserve e reutilize o ID confirmado; não duplique recorrências. Após salvar, confira ID, ambiente de execução na nuvem, estado habilitado, recorrência, próxima execução, fuso, texto integral salvo, T0 e conexões selecionadas, usando os campos que a ferramenta realmente disponibilizar. Quando depender de confirmação da pessoa, registre que foi relatado. A ausência de um campo não autoriza inventá-lo.

### 5.4. Conferir a primeira execução e continuar

Separe **preparada**, **cadastrada**, **executada** e **importação verificada**. Uma execução real precisa confirmar, nessa conta, acesso a Sites e HTTP autenticado, leitura das viagens e da fonte, seleção temporal e transferência de anexos quando houver. Para comprovar importação, releia a reserva/documentos persistidos e a deduplicação de uma reserva real autorizada. Sem viagens ou novidades, uma execução vazia é válida, mas não comprova importação/anexos. Um teste prévio em outra instalação não dispensa essa conferência.

Se faltar ferramenta, conexão ou acesso, registre o bloqueio específico e a próxima ação; não troque silenciosamente por lembrete ou preparação manual de arquivos. Não encerre o onboarding esperando uma primeira execução futura: registre a verificação pendente e siga para locais. Quando o resultado chegar, confira-o sem reiniciar a instalação ou repetir consentimentos.

Mostre **Scheduled / Agendadas**, ou o link real retornado pelo agendador, para consultar resultados, pausar e editar. Explique que as importações da rotina ficam na Central; a tarefa não exclui reservas após processá-las. Registre ID/link não secreto da tarefa, T0, fontes/contas, escolhas, evidências e eventuais limitações na continuidade privada acessível ao projeto, sem conteúdo integral de mensagens nem credenciais.

## 6. Locais em listas e roteiros

Guie **Programação → Guardar lugar**: buscar nome/cidade, usar link ou cadastrar manualmente. Confira nome/endereço e correspondência. Em **Guardar em**, escolher lista, dia ou ambos. **Queremos visitar** guarda ideias e pode ser renomeada; outras listas são opcionais.

Selecione o dia e use **Incluir no dia** para programar um lugar. No computador, pode arrastar da lista até **Inserir aqui** na posição desejada; teclado: Espaço, setas, Espaço; Escape cancela. Reordenar não muda horários das reservas. **Remover do roteiro**, quando o local pertence a uma lista, retira a data e preserva local/lista; excluir o lugar é outra ação.

Para vários locais, mostre **Selecionar lugares → marcar itens ou Selecionar todos → Dia do roteiro → Incluir no roteiro**. A data começa no dia aberto. Os locais permanecem na lista; itens já programados mantêm sua data e ficam fora da seleção. Cancelar ou trocar de lista descarta somente a seleção. Em conflito, conferir a lista atualizada antes de repetir; não há inclusão parcial.

Question: **Quero adicionar um local** / **Entendi; praticar depois** / **Preciso de ajuda**. Sem viagem, explique e registre a prática futura. Se praticar, confira lista/dia e persistência; não salve lugares só para demonstrar.

Mostre mapa do dia, números dos lugares, hospedagem durante a estadia e transportes na partida/chegada. Um link sozinho não garante coordenadas. Visitado é compartilhado entre lista/roteiro e retira o ponto do mapa. Explique **Priorizar o contexto do dia**, referência usada e desativação. Busca não garante catálogo completo nem distância por trajeto.

## 7. Revisão, opcionais e conclusão

Apresente edição e pendências: **Detalhes e convidados → Editar viagem** corrige nome, datas e destinos. Se itens ficarem fora do período, a Central exige ajustes prévios e não apaga reservas. Editar a Central não altera o fornecedor. Não provoque conflitos para demonstrar.

A busca automática cobre hotéis, voos, trens, ônibus e ferry; carro e transfer usam pontos selecionados no formulário. Eventos aparecem no mapa quando seu local é selecionado explicitamente, sem dedução automática pelo título. Localizações são guardadas para participantes autorizados. A reserva fica salva se a busca falhar. A central de pendências reúne revisões e locais não confirmados: **Conferir reserva** abre os dados; **Tentar localizar novamente** respeita o intervalo do serviço. Falha de conexão não prova endereço incorreto. Retome o resultado da etapa 4, sem apresentar importação concluída como confirmação de todos os endereços.

Fotos/capas e celular são opcionais: Question **Quero experimentar** / **Deixar para depois**. Diferencie capa da viagem e imagem inicial da conta. Atalho no telefone não oferece uso offline. Mostre **Sobre este painel**, termos, privacidade e faixa sálvia quando houver atualização. Não simule uma atualização real para ensinar.

Só declare onboarding apresentado depois das etapas obrigatórias 1 a 6. Entregue URL real, links de compartilhamento, estado da importação e automação (verificada, adiada ou bloqueada), práticas e pendências. Distinga **instalação publicada**, **onboarding apresentado** e **fluxos verificados**. Sem viagem não é possível comprovar persistência/importação, mas é possível explicar todo o uso.

Registre versão, projeto, URL, decisões, evidências, etapas e próxima ação em `.private/HANDOFF.md` e `.private/TASK_PLAN.md`; inclua identificação não secreta da tarefa se existir. Na nuvem, preserve continuidade privada acessível ao projeto. Não guarde credenciais nem conteúdo integral de e-mails. Na troca de chat, forneça briefing preenchido e retome sem reinstalar ou repetir consentimentos.

### Anexar um comprovante manualmente

Abra uma reserva, entre em **Documentos** e use **Adicionar documento**. Aceita PDF ou imagens JPG, PNG, WebP e GIF, até 10 MB por arquivo. Proprietário e editores podem anexar; leitores visualizam. O envio começa ao selecionar o arquivo, mantém o original e informa se já estava anexado. Em falha, confira o formato/tamanho e tente novamente; a reserva e os documentos anteriores são preservados. Abra o arquivo para conferir a prévia e feche para voltar à reserva.

Para reunir tudo em um passo, use **Adicionar reserva → escolha a categoria → Documentos**. Selecione um ou vários arquivos: até 10 MB cada, 20 MB e 20 documentos por cadastro. Clique no nome da pill para conferir e no X para remover da seleção. Os arquivos só são anexados ao salvar a reserva; cancelar descarta o rascunho. Depois, abra **Ver reserva → Documentos** para consultar ou enviar mais. Esse caminho posterior também funciona em reservas importadas automaticamente. O agente apresenta ambas as opções; a conclusão é conferir um arquivo na reserva salva. Se o salvamento falhar, os campos e arquivos continuam no modal para nova tentativa sem duplicação.

Ao editar horários, escolha o fuso no dropdown; o GMT exibido acompanha a data indicada. Hospedagem usa um fuso; transportes podem ter fusos diferentes na partida e chegada.
