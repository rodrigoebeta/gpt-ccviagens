# Onboarding guiado pelo Work

Comece após publicação e login. Leia GUIA_DO_PRODUTO.md e confira os controles atuais da Central. Apresente uma etapa curta por rodada e use **Question** (ou ferramenta equivalente) com opções clicáveis. Os rótulos abaixo orientam a criação das perguntas; não são botões de Markdown.

## Continuidade obrigatória

O onboarding deve cobrir: compartilhamento nas duas camadas; criação da viagem pela pessoa na Central; oferta de importação; reservas e documentos; Scheduled Tasks; locais em listas e roteiro. **Não encerre porque a pessoa adiou a viagem, não tem reservas ou não conectou e-mail.** Adiar a prática não pula a explicação nem as próximas rodadas. Respeite uma pausa explícita da pessoa e registre onde retomar.

Use duas ou três opções curtas por pergunta, com resposta livre opcional. Texto livre pela ferramenta Question somente quando a informação não puder ser escolhida ou inferida. Não peça para digitar “sim”, números ou prompts para continuar no mesmo chat. Se a ferramenta não estiver disponível, explique uma vez e use a alternativa mais curta, sem simular botões. Espere a resposta real para ações dependentes dela; silêncio ou opção pré-selecionada não são confirmação.

Registre por etapa: apresentado, praticado, verificado, prática adiada ou bloqueado. Não marque uma explicação obrigatória como adiada só porque faltam dados para praticar. Não crie dados de exemplo. Não repita decisões confirmadas.

## 1. Entrar e entender o compartilhamento

Entregue a URL confirmada pelo Sites, guie o login oficial e apresente Viagens, Programação e Documentos da Viagem. Question: **SIM, abri minha Central** / **Preciso de ajuda para entrar**. Se falhar, confira URL e sessão antes de alterar configurações.

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

**Com viagem:** leia as viagens autorizadas e suas datas. Se houver várias, ofereça escolha. Busque pelas datas dos serviços e referências da viagem, não só pelo recebimento da mensagem: uma compra feita meses antes pode pertencer ao período. Confira a correspondência e permissão de edição antes de importar.

**Sem viagem:** ainda ofereça conexão, arquivos e explicação. Para salvar, será necessário criar uma viagem na Central. Pode haver busca exploratória pontual autorizada de confirmações recentes: ofereça **Últimos 30 dias de mensagens** / **Últimos 90 dias de mensagens** e explique que isso é um recorte inicial de mensagens, não filtro de datas dos serviços nem automação. Resuma somente reservas relevantes, sem criar viagem ou importar. Oriente a criação na interface com base nas datas conferidas. Se a pessoa adiar novamente, prossiga com documentos, Scheduled Tasks e locais, sem insistir nem iniciar busca recorrente irrestrita.

Sem resultados ou reservas, registre prática adiada e continue. Não termine o onboarding nessa etapa.

## 4. Reservas e documentos

Explique: o Work lê confirmações e comprovantes autorizados, extrai os dados, reúne os documentos e envia à viagem existente. A Central guarda a reserva e os anexos; reimportações reconhecem a mesma reserva. Divergências ficam para conferir, preservando ajustes manuais.

Siga docs/IMPORTACAO.md. **Priorize a API autenticada**, já existente em `POST /api/trips/{id}/import`, sem usar a interface. Confira identidade oficial, viagem, edição e contrato. Não grave diretamente no banco/bucket para contornar a API. Se o chat não tiver transporte autenticado, prepare o arquivo privado e guie **Documentos da Viagem → Importar reserva → selecionar arquivo**, explicando que é a alternativa manual.

Confira datas, passageiros, documentos, recarga e reimportação sem duplicatas. Diferencie salvo, já existente, atualizado e **Para revisar**. Mostre abrir o documento, páginas, zoom, Ajustar, pinça no celular e Baixar (opcional). PDF/imagens/TXT são aceitos; siga o guia para conversões. Sem comprovante, explique sem inventar arquivo.

Question: **Entendi; ver automação** / **Preciso de ajuda com a importação**. Resolva a dúvida e continue; não use “quer aprender mais?” como portão para encerrar.

## 5. Scheduled Tasks: explicação obrigatória

Explique: “Uma tarefa agendada pode procurar novas confirmações e documentos para viagens que você já cadastrou. Ela **não cria viagens**. O período de referência vem de cada viagem da Central; a seleção usa as datas reais do voo, hospedagem, transporte ou atividade, com ano, e não apenas quando o e-mail chegou.”

Cada execução relê viagens e permissões antes de pesquisar. Sem viagens elegíveis, não pesquisa a caixa postal. Não importa serviços fora do período nem escolhe entre viagens sobrepostas arbitrariamente. A busca retorna candidatos; é preciso ler as datas dos serviços para confirmar a correspondência. Alterações/cancelamentos de reservas vinculadas seguem revisão, sem mudar datas ou criar viagens silenciosamente.

Question: **Quero configurar a tarefa** / **Entendi; configurar depois** / **Tenho uma dúvida**. A explicação é obrigatória, a ativação é opcional e depende da escolha. Siga o procedimento de docs/IMPORTACAO.md; obtenha frequência/horário/fuso ausentes por Question, oferecendo escolhas quando possível.

Ter a API não comprova acesso de uma tarefa na nuvem. Verifique transporte autenticado, leitura das viagens, e-mail, anexos e escrita **no ambiente agendado**. Só declare automação completa após uma execução real confirmada. Se faltar conexão, informe o bloqueio e registre a configuração pendente; não crie um lembrete ou uma rotina de preparar arquivos como se fossem importação automática. Prossiga para locais.

No desktop, tarefas com arquivos locais exigem computador ligado e aplicativo executando. Para funcionar com o computador desligado, use nuvem com fontes e ferramentas acessíveis ali. Mostre **Scheduled / Agendadas**, ou o link real retornado pela ferramenta, para consultar, pausar e editar. Agendamento salvo não comprova importação executada.

## 6. Locais em listas e roteiros

Guie **Programação → Guardar lugar**: buscar nome/cidade, usar link ou cadastrar manualmente. Confira nome/endereço e correspondência. Em **Guardar em**, escolher lista, dia ou ambos. **Queremos visitar** guarda ideias e pode ser renomeada; outras listas são opcionais.

Selecione o dia e use **Incluir no dia** para programar um lugar. No computador, pode arrastar da lista até **Inserir aqui** na posição desejada; teclado: Espaço, setas, Espaço; Escape cancela. Reordenar não muda horários das reservas. **Remover do roteiro**, quando o local pertence a uma lista, retira a data e preserva local/lista; excluir o lugar é outra ação.

Question: **Quero adicionar um local** / **Entendi; praticar depois** / **Preciso de ajuda**. Sem viagem, explique e registre a prática futura. Se praticar, confira lista/dia e persistência; não salve lugares só para demonstrar.

Mostre mapa do dia, números dos lugares, hospedagem durante a estadia e transportes na partida/chegada. Um link sozinho não garante coordenadas. Visitado é compartilhado entre lista/roteiro e retira o ponto do mapa. Explique **Priorizar o contexto do dia**, referência usada e desativação. Busca não garante catálogo completo nem distância por trajeto.

## 7. Revisão, opcionais e conclusão

Apresente edição e pendências: **Detalhes e convidados → Editar viagem** corrige nome, datas e destinos. Se itens ficarem fora do período, a Central exige ajustes prévios e não apaga reservas. Editar a Central não altera o fornecedor. Não provoque conflitos para demonstrar.

Localizações de reservas são verificadas em segundo plano e guardadas para participantes autorizados. A reserva fica salva se a busca falhar. A central de pendências reúne revisões e locais não confirmados: **Conferir reserva** abre os dados; **Tentar localizar novamente** respeita o intervalo do serviço. Falha de conexão não prova endereço incorreto.

Fotos/capas e celular são opcionais: Question **Quero experimentar** / **Deixar para depois**. Diferencie capa da viagem e imagem inicial da conta. Atalho no telefone não oferece uso offline. Mostre **Sobre este painel**, termos, privacidade e faixa sálvia quando houver atualização. Não simule uma atualização real para ensinar.

Só declare onboarding apresentado depois das etapas obrigatórias 1 a 6. Entregue URL real, links de compartilhamento, estado da importação e automação (verificada, adiada ou bloqueada), práticas e pendências. Distinga **instalação publicada**, **onboarding apresentado** e **fluxos verificados**. Sem viagem não é possível comprovar persistência/importação, mas é possível explicar todo o uso.

Registre versão, projeto, URL, decisões, evidências, etapas e próxima ação em `.private/HANDOFF.md` e `.private/TASK_PLAN.md`; inclua identificação não secreta da tarefa se existir. Na nuvem, preserve continuidade privada acessível ao projeto. Não guarde credenciais nem conteúdo integral de e-mails. Na troca de chat, forneça briefing preenchido e retome sem reinstalar ou repetir consentimentos.
