# Guia da Central de Viagens

## Reservas e documentos — versão 0.2.2

Em **Adicionar reserva**, todas as categorias oferecem Documentos opcionais: seleção múltipla de PDF/imagens, até 10 MB por arquivo, 20 MB e 20 documentos por cadastro. Cada arquivo aparece como pill com abertura para conferência e remoção antes de salvar; não há prévia embutida. Arquivos ficam apenas no rascunho até salvar, inclusive ao trocar categoria; cancelar descarta a seleção. Reserva e documentos são salvos juntos, com validação e repetição sem duplicar. Depois, a consulta continua em **Ver reserva → Documentos**, cujo **Adicionar documento** permanece disponível em reservas manuais e importadas automaticamente.

A navegação e a página usam **Reservas da Viagem**; o contador indica reservas. Cada reserva mantém a aba Documentos, com **Adicionar documento** para proprietário/editor: PDF, JPG, PNG, WebP ou GIF, até 10 MB por arquivo. A seleção envia um arquivo por vez; valida formato/tamanho no cliente e servidor, preserva bytes e dados da reserva e evita duplicatas pelo conteúdo. Leitores continuam apenas consultando. Arquivos de texto já importados permanecem acessíveis, mas não são aceitos nesse upload manual.

No roteiro, cada horário de reserva mostra GMT ao lado, incluindo chegada/fim e check-out, com data e fuso da etapa. Horários ausentes não são inventados; fuso ausente/inválido ou hora ambígua/inexistente na mudança de horário de verão fica explícito. Fusos são selecionados em dropdown com identificador e GMT±HH:MM, calculado para a data de referência (check-in para hospedagem; data de cada etapa para transporte/evento), incluindo horário de verão. Um fuso rege a hospedagem inteira; chegada/fim pode herdar o inicial. Identificadores antigos são preservados se não reconhecidos.

A localização automática de hospedagens também tenta o endereço quando o nome não corresponde: exige rua, número e cidade presentes, todos os termos fornecidos compatíveis e um único ponto OSM. Endereço incompleto, divergente ou ambíguo continua pendente. Isso não comprova validade da reserva nem endereço histórico. A busca manual aceita nome ou endereço e permite selecionar imóveis sem nome comercial. Nome da hospedagem e ponto selecionado são independentes. O check indica apenas seleção efetiva; resultados oferecem Usar este local.

O visualizador ocupa a janela sem deslocamento de centralização e retorna à reserva ao fechar. Avisos gerais do painel (inclusive escolher viagem) e confirmações de ações em lugares são toasts centralizados horizontalmente no rodapé (acima da navegação móvel), temporários de 5 segundos, pausados durante interação e dispensáveis pelo botão Fechar aviso; não ocupam linha no roteiro nem dependem de limpar ao navegar. Erros permanecem próximos à ação.


Distribuição liberada para instalação e uso real. A coleta está habilitada no produto (ready:true), mas só funciona após o aceite explícito e a configuração dos termos de cada instalação. A atividade vai ao endpoint oficial /telemetria-ccv/v1/activity; anúncios de atualização são consultados pelo servidor no release.json do repositório oficial no GitHub. Quem instala usa os endereços fornecidos: não instala receptor, Docker ou VPS.

Na Programação, as hospedagens ativas aparecem em uma faixa acima do roteiro, com período e ação Ver reserva. No dia da saída, o rótulo indica o check-out. A faixa permanece visível em dias sem eventos de entrada ou saída.

Referência do aplicativo incluído no pacote. Para instalar, siga [CONFIGURAR_NO_WORK.md](CONFIGURAR_NO_WORK.md); para aprender com o Work, siga [ONBOARDING.md](ONBOARDING.md).

## Viagens e navegação

A API autenticada `/api/assistant` permite ao GPT Work operar viagens, listas, lugares, roteiro, reservas, revisões, documentos, imagens e convidados mediante os pedidos da pessoa. O catálogo `/api/assistant/capabilities` descreve as operações instaladas, e [API do assistente](docs/API_ASSISTENTE.md) documenta contratos e permissões. O cadastro inicial continua sendo ensinado pela Central; depois a pessoa também pode pedir ao agente para criar viagens. A rotina agendada não usa operações de gerenciamento.

O proprietário pode excluir uma viagem em **Editar viagem → Excluir viagem**. A confirmação identifica a viagem salva e informa que reservas, documentos, locais e acessos serão removidos sem possibilidade de desfazer. Cancelar preserva a viagem e a edição em andamento. A exclusão de uma viagem só confirma a limpeza completa dos arquivos depois que os envios em andamento terminarem; se houver pendência, a Central oferece uma nova tentativa, inclusive após recarregar a página.

Ao excluir uma lista pela API, seus lugares são preservados no destino escolhido; se esse destino mudar durante a operação, o assistente precisa reler as listas. Pendências de armazenamento devem ser informadas e tratadas conforme o contrato da API.

Na instalação, o Work verifica Sites primeiro e orienta ativação/novo chat se necessário. Reúne os chats em um projeto, reutilizando a pasta selecionada ou sugerindo **Central de Viagens** em Documentos no desktop; na web, usa fontes acessíveis ao projeto. Solicita **centraldeviagem** como nome do Site e entrega a URL efetivamente retornada. O pedido de instalação inclui publicação privada do produto fornecido após verificações e aceite, sem escolhas de design ou confirmação repetida de publicação.

O acompanhamento usa perguntas de múltipla escolha. Você cria sua viagem em **Viagens → Nova viagem** e confirma no chat. Mesmo se deixar a criação para depois, o Work continua ensinando importação/documentos, Scheduled Tasks, locais em listas/roteiros e compartilhamento. A prática pode ficar pendente sem interromper as explicações.

No rodapé, **Sobre este painel** reúne informações sobre sua privacidade, telemetria e condições de uso. Abra a seção para consultar o resumo, os termos completos e o contato para permissões. Os créditos da imagem e **Sair da conta** ficam ao final da seção.

Em **Detalhes e convidados → Editar viagem**, o proprietário e quem tem permissão **Pode editar** podem corrigir o nome, o período e os destinos. Não é preciso criar outra viagem: capa, convidados, documentos, reservas, listas e lugares são preservados. Os horários e as datas dos itens não mudam automaticamente. O período precisa conter todas as reservas salvas e os lugares agendados; se necessário, amplie o período, ajuste os itens na programação e só então encurte. Ao alterar as datas, um aviso lista antecipadamente os itens que ficariam fora e impede salvar esse período. **Nenhuma reserva é apagada.** Uma edição concorrente pede atualização da página antes de tentar novamente.

No editor, os campos rolam quando necessário e as ações Cancelar/Salvar ficam visíveis no rodapé.

As áreas principais são **Viagens**, **Programação** e **Reservas da Viagem**. No celular, a navegação principal fica na parte inferior. Confira a viagem selecionada antes de incluir ou alterar dados. O destaque da seção selecionada é independente do contorno de foco do teclado. Use Tab para percorrer os controles; ao fechar Nova viagem, o foco retorna ao botão ou seletor que abriu o formulário.

Os cartões mostram nome, status, Período e Destinos sobre fundo claro. O botão verde abre a programação; Detalhes e convidados tem destaque suave. O status aparece por escrito em um selo: planejada, em viagem ou período encerrado; a cor é apenas um apoio. As datas incluem o ano no início e no fim; Período encerrado identifica datas já passadas. Cada viagem tem nome livre, período com ano e destinos. O nome não determina a foto: a capa começa com uma imagem padrão e pode ser substituída por foto própria. A imagem inicial de Viagens é uma personalização separada, por conta, compartilhada entre os dispositivos dessa pessoa.

**Detalhes e convidados** aparece em cada cartão de viagem e em cada viagem do seletor de Programação. Ali você consulta os dados e o seu acesso; o proprietário gerencia convidados. No seletor, a viagem atual tem destaque verde e uma marca de seleção. Cada viagem forma um cartão próprio: nome e datas na parte superior e Detalhes e convidados no rodapé integrado. O contorno reúne as duas ações; o espaço entre cartões separa as viagens. O rodapé abre os dados daquela viagem sem entrar na programação. No seletor, passar o mouse destaca suavemente o fundo; navegar pelo teclado acrescenta um contorno interno ao item em foco.

## Destinos e sugestões por proximidade

Ao criar ou editar uma viagem, busque cidades, municípios, estados, regiões ou países e escolha a correspondência do OpenStreetMap. Confira estado e país para evitar nomes iguais. É possível selecionar vários destinos.

Ao adicionar um lugar, a busca usa o dia selecionado para priorizar: **hospedagem daquele dia → lugares do roteiro → destinos confirmados da viagem**. Uma hospedagem precisa ter nome/endereço identificáveis no OSM; se houver dúvida ou indisponibilidade, o painel informa e utiliza as outras referências. Hospedagens canceladas e de outros dias não entram nessa preferência. Na troca de hotéis, a hospedagem que começa mais recentemente tem preferência.

Sem hospedagem ou lugares com coordenadas, uma reserva do dia também pode fornecer referência. Para trens, o painel identifica a estação pelo nome e local informados, mostra qual estação foi usada e evita escolher correspondências ambíguas. No dia da partida usa a origem; na chegada em outro dia usa o destino. Se não conseguir identificar o local, informa a limitação e aproveita os destinos confirmados disponíveis.

As correspondências encontradas aparecem por proximidade dentro desses grupos. O painel usa até25km para referências pontuais e a extensão aproximada de regiões quando disponível; os demais resultados continuam acessíveis. A cobertura depende do OSM e do limite de resultados do Photon: não é um inventário completo de todos os estabelecimentos próximos. Distâncias são em linha reta. Use o controle **Priorizar o contexto do dia**, com estado Ativado/Desativado. A referência usada aparece logo abaixo da explicação. Desative para pesquisar outra região; os resultados anteriores são retirados até uma nova busca. O controle também funciona com Espaço ou Enter no teclado.

O cache evita repetir consultas e distingue regiões diferentes. Nome/endereço e ponto de referência são usados na consulta ao Photon; não há chave do Google ou serviço adicional para configurar. O aplicativo mantém o limite de uso compartilhado e respeita o cooldown do provedor.

## Datas e horários

Os formulários de viagem, lugar, reserva e revisão usam o mesmo calendário em português. Digite a data em dd/mm/aaaa ou abra o calendário pelo ícone; os separadores são inseridos automaticamente ao digitar números. Quando houver limite da viagem, dias fora do período ficam indisponíveis. Limpar data remove a escolha, mas campos obrigatórios precisam ser preenchidos antes de salvar.

Os horários usam 24 horas (hh:mm). Você pode digitar ou escolher hora e minuto pelo ícone do relógio; Aplicar leva a escolha ao formulário, sem salvar a reserva. Limpar horário permite deixar um horário opcional vazio. Os horários locais e fusos da reserva continuam separados; não há arredondamento dos minutos. Teclado, foco e mensagens de formato inválido são suportados.

## Programação do dia

O **Roteiro** reúne lugares, transportes, atividades, check-ins e check-outs. Escolha a data pela faixa de dias, pelas setas ou pelo calendário. O painel mantém o alinhamento lateral ao alternar entre dias com itens e dias vazios. A faixa avança em blocos de até sete dias a partir do início da viagem; o calendário destaca dias com programação.

Todos os itens do dia podem ser reordenados por arraste. A alça também aceita teclado (Espaço, setas e Escape); o menu oferece mover para cima ou para baixo. A ordem é compartilhada e permanece após recarregar. Em conflito com uma alteração de outra pessoa, atualize os dados antes de tentar novamente.

Horários aparecem nos itens que os possuem. Mudar a ordem não muda os horários ou as datas da reserva. Lugares novos não exigem nem apresentam campo de horário. Para alterar o dia de um lugar já programado, edite sua data.

## Listas, lugares e mapa

Para incluir vários lugares juntos, abra a lista e use **Selecionar lugares**. Marque os itens ou **Selecionar todos**, escolha **Dia do roteiro** e confirme **Incluir no roteiro**. A data começa no dia aberto e deve estar dentro da viagem. Os lugares continuam na lista; os que já têm data ficam identificados e não entram na seleção. A inclusão não cria cópias nem define horários. **Cancelar seleção** descarta somente a seleção; trocar de lista também a encerra. Proprietários e editores podem incluir até 500 lugares por vez. Se um item tiver mudado, nenhum é incluído naquela tentativa: confira a lista atualizada, que preserva a seleção dos itens ainda disponíveis e inalterados.

A lista inicial **Queremos visitar** pode ser renomeada; você pode criar outras listas. Elas guardam ideias, enquanto o Roteiro mostra o que foi programado para cada dia.

Um lugar pode ficar em uma lista, em um dia ou nos dois. Ao adicionar pelo dia, a data vem preenchida e a lista é opcional; pela lista, a lista vem preenchida e a data é opcional. É necessário escolher pelo menos um dos dois.

Use **Guardar lugar**, pesquise o nome e confira o resultado. A busca usa Photon/OpenStreetMap e não exige chave. Você também pode cadastrar por nome ou link. Um link sozinho não garante coordenadas: apenas lugares com localização podem aparecer no mapa. Se a busca estiver indisponível, use o cadastro manual; evite repetir tentativas em sequência.

Use **Incluir no dia** para programar um lugar guardado. No computador, também é possível arrastar um lugar sem data da lista até a posição desejada no roteiro do dia aberto. A linha “Inserir aqui” indica o destino; pelo teclado, use Espaço, setas e Espaço para soltar (Escape cancela). **Mais opções** reúne endereço completo, página original, direções, fotos, edição e remoção conforme os dados disponíveis.

No menu de um local do roteiro, **Remover do roteiro** limpa a data e o horário e mantém o mesmo local na lista de origem, com foto, notas e estado de visita preservados. A opção aparece somente quando o local pertence a uma lista. **Remover lugar** continua sendo a exclusão completa, com confirmação.

Marcar como **visitado** atualiza o mesmo lugar na lista e no Roteiro. Os visitados deixam de aparecer no mapa, mantendo a numeração dos demais; desmarcar restaura sua exibição. Abra o mapa pelas ações do Roteiro. O mapa também inclui reservas ativas: hotéis em todos os dias entre check-in e checkout (inclusive), aeroportos nos dias do voo e estações/terminais nos dias de partida ou chegada. Origem e destino aparecem juntos quando são no mesmo dia. Esses pontos usam ícones próprios e não criam itens extras na linha do tempo; cancelamentos são excluídos. O mapa pode ser aberto mesmo quando há somente uma hospedagem no dia.

Após importar uma reserva, o painel tenta localizar hospedagens, aeroportos, estações e terminais em segundo plano. A reserva é salva mesmo quando a consulta falha. Resultados ficam guardados para todos os participantes autorizados; alterações no nome/endereço ou destino de referência provocam nova verificação. Reservas ainda sem verificação são conferidas ao abrir a programação. Consultas interrompidas são retomadas; buscas usam o cache e o intervalo de requisições do Photon. Não é necessário abrir o mapa.

A central de pendências fica acima do roteiro e da hospedagem, mesmo com o mapa fechado. Ela reúne revisões dos dados e localizações não confirmadas, cada qual com sua ação. Conferir reserva abre os dados existentes; editores podem corrigi-los. Tentar localizar novamente respeita o intervalo do serviço. Falhas temporárias de conexão são identificadas separadamente e não significam endereço incorreto. Nenhuma pendência altera automaticamente os dados originais. Informe o nome completo do hotel, aeroporto ou estação e cidade/país. Dados do OpenStreetMap podem estar incompletos.

Fotos podem ser próprias ou vir das fontes oferecidas pelo aplicativo. Confira a correspondência antes de escolher uma sugestão: imagens próximas não garantem que sejam do estabelecimento. Os créditos são preservados.

## Reservas e revisões

Em **Programação → Adicionar reserva**, ao lado de Adicionar lugar, escolha **Hospedagem**, **Transporte** ou **Evento ou atividade**. Transporte inclui voo, trem, ônibus, aluguel de carro, transfer e ferry. Proprietários e editores podem cadastrar os dados manualmente; leitores apenas consultam. O cadastro fica identificado como manual, não exige comprovante e não faz uma reserva no fornecedor.

Os campos se adaptam ao tipo: hospedagem pede um nome para identificar o hotel ou apartamento, endereço, check-in/check-out e um único fuso, sem local de chegada. Aluguel de carro usa retirada/devolução. Referência, viajantes e anotações ficam em uma seção opcional. As datas devem caber na viagem.

Cadastro e edição compartilham o mesmo formulário, inclusive nas reservas importadas abertas pelo roteiro, pelo cartão de hospedagem ou pelos documentos. A edição abre pelo topo; referência, viajantes e anotações começam recolhidos, com um resumo do que está preenchido. Abra essa seção para consultar ou alterar os dados, que permanecem preservados quando recolhidos. Endereços usam um campo de múltiplas linhas para facilitar a conferência.

Os campos seguem cada etapa: check-in/check-out na hospedagem, partida/chegada no transporte (retirada/devolução para carro) e início/fim no evento. No celular, cada etapa é apresentada por inteiro antes da próxima. Salvar e cancelar permanecem acessíveis enquanto os campos rolam. **Trocar categoria**, no cabeçalho com seta de voltar, retorna à escolha inicial e preserva os campos compartilhados do rascunho. Trocar para hospedagem ou evento remove o local de chegada que só se aplica ao transporte.

Use **Buscar nome ou endereço**. O campo **Nome ou endereço** aceita o nome e a cidade, ou rua, número e cidade — inclusive um apartamento sem nome comercial. A busca começa com o endereço informado ou, se vazio, o nome da hospedagem; você pode editar a consulta. Confira o endereço do resultado e escolha **Usar este local**. Isso preenche o endereço e guarda o ponto com a reserva, sem criar outro lugar no roteiro. O nome da hospedagem é preservado; só é preenchido pelo resultado quando estiver vazio. **Alterar local** abre uma nova busca. Mudar o endereço remove a seleção; renomear a hospedagem mantém o ponto escolhido. A busca automática após importar continua conservadora: endereços residenciais sem correspondência automática podem exigir esta seleção explícita. Sem resultado, é possível salvar o endereço digitado sem ponto confirmado. Preserve a grafia original de hotéis, ruas e estações; a busca multilíngue não garante todas as traduções. Um ponto selecionado no OSM não comprova a validade da reserva nem o endereço histórico.

Na busca autorizada, o assistente usa cidades e regiões cadastradas na viagem, incluindo variações dos nomes, e amplia a pesquisa pelos estabelecimentos encontrados. Confere as datas dos serviços, o ano, alterações e cancelamentos. Você também pode pedir a importação de uma viagem passada; isso é separado do acompanhamento agendado de viagens atuais/futuras. Ausência de resultado não comprova ausência de reserva.

Depois de importar, o assistente tenta completar e conferir endereços de hotéis, eventos, estações, aeroportos e outros lugares em fontes oficiais. Preserva a origem e identifica dúvidas, inclusive mudanças de endereço ou edição em viagens passadas. Endereço extraído, endereço conferido externamente e ponto encontrado no mapa são resultados distintos. A busca automática cobre hotéis, voos, trens, ônibus e ferry; carro e transfer usam pontos selecionados no formulário. Eventos aparecem no mapa quando seu local é selecionado explicitamente, sem dedução automática pelo título. Reservas permanecem salvas mesmo com localização pendente; o resumo informa a cobertura e o que não foi possível confirmar.

O assistente importa trens, voos, ônibus, hotéis e atividades de fontes acessíveis e autorizadas: e-mail, pasta local, arquivos ou nuvem. Primeiro verifica se há e-mail conectado e oferece usá-lo; Gmail não é obrigatório. Com acesso oficialmente autenticado, envia diretamente à API da viagem existente, sem usar o painel. Se esse acesso faltar, prepara um arquivo para selecionar em **Reservas da Viagem → Importar reserva**. Cada importação contém uma reserva e seus documentos; o painel não interpreta PDFs ou mensagens avulsas. Veja [Importação](docs/IMPORTACAO.md).

No onboarding, o agente oferece uma tarefa na nuvem para procurar novas reservas nas fontes que você escolher. Ele verifica as conexões disponíveis e quais permitem ler os dados e comprovantes no ambiente agendado. Pode usar e-mail ou outra fonte conectada adequada; se nenhuma estiver pronta, ajuda a conectar uma ou permite configurar depois. A ativação é opcional e não interrompe o restante do aprendizado.

Você escolhe fonte/conta, viagens e frequência/horário. O agente prepara o prompt completo com o projeto e a URL da **sua instalação**. Cada instalação tem credencial própria, obtida pelo executor a cada execução e nunca incluída no prompt. Com ferramenta de agendamento disponível, a escolha **Criar tarefa** permite ao agente cadastrá-la; sem essa ferramenta, ele entrega o texto pronto para colar diretamente em uma nova Scheduled Task na nuvem. Uma opção clicável ou um prompt preparado não significa que a tarefa já foi salva.

O acompanhamento começa no marco de cadastro/ativação apresentado e confirmado, que fica fixo mesmo ao pausar ou recriar a tarefa. A cada execução, consulta novidades desde esse marco e evita duplicatas; a importação inicial de documentos anteriores é separada. A data de recebimento/disponibilização identifica a novidade; as datas reais do serviço, incluindo ano e contexto, determinam a viagem. Compras antecipadas também podem corresponder. **Não cria nem exclui viagens**: relê as atuais/futuras autorizadas e, sem viagem elegível, não pesquisa fontes. Ambiguidades, alterações conflitantes e anexos indisponíveis são informados para conferência, preservando ajustes manuais e cancelamentos.

O agente confere a tarefa salva e uma execução real na sua conta. Sem novidades, uma execução vazia não comprova importação com anexos. Quando a leitura for incompleta ou exceder os limites das ferramentas, a tarefa deve avisar; não promete cobertura ilimitada ou processamento instantâneo. A configuração é opcional, sua explicação faz parte do onboarding, e a rotina mantém as importações na Central. Veja [Sincronização](docs/SINCRONIZACAO.md) para configuração e recuperação.

A API específica `/api/sync` permite listar e reler viagens em andamento/futuras com permissão de proprietário/editor e importar pelo mesmo mecanismo de validação, documentos, deduplicação e revisão da interface. Ela começa desativada. Quando a pessoa escolhe ativar, o agente configura no servidor o hash da credencial e a identidade da instalação, preenche o prompt integral e o salva pela ferramenta disponível ou o entrega para colar diretamente em Scheduled Tasks cloud. A credencial é obtida pelo conector Sites em cada execução; nunca faz parte do prompt. Consulte [Sincronização](docs/SINCRONIZACAO.md) e [Prompt da tarefa](docs/PROMPT_SCHEDULED_TASK.md). O caminho sync não cria viagens ou administra convidados, mas o mesmo token também autoriza o gerenciamento em /api/assistant com as permissões do usuário configurado. As instruções da tarefa limitam suas ações, não o poder técnico do token. Não compartilhar a credencial. O teste completo no ambiente agendado continua obrigatório antes de declarar o fluxo verificado.

Reimportar a mesma reserva não deve duplicá-la. Alterações, cancelamentos, conflitos com edições manuais e dados fora do período podem exigir decisão em **Para revisar**. Confira a versão atual e a proposta antes de resolver uma pendência.

Reservas podem ser editadas no painel, inclusive horários de check-in e check-out, sem reimportar. A edição organiza seus dados na central; não modifica a reserva no hotel, companhia aérea ou outro fornecedor.

## Documentos

Clicar em um documento abre o visualizador dentro do painel. PDF e TXT têm navegação por páginas; JPEG, PNG, GIF e WebP são exibidos como imagens. O conteúdo começa ajustado à área disponível. Use pinça ou botões para ampliar, arraste para mover e **Ajustar** para voltar ao enquadramento. **Baixar** é uma ação separada e entrega os bytes originais.

Um PDF protegido pode pedir senha no próprio visualizador. Se houver falha, use nova tentativa ou baixe o original para abrir em um aplicativo compatível. Word, Excel, PowerPoint, HEIC e TIFF precisam ser convertidos para um formato aceito antes da importação; o Work deve explicar a conversão e preservar o original.

Os documentos ficam no armazenamento privado da instalação e são acessíveis apenas a quem tem acesso à viagem; o visualizador não envia o arquivo a um serviço externo.

### Organização da página de documentos

O cabeçalho reúne a contagem e Importar reserva para quem pode editar. Cada reserva mostra seus dados e a quantidade de arquivos, inclusive no celular. Se ainda não houver reservas, use a mesma ação no cabeçalho para iniciar.

## Compartilhamento

Existem duas permissões independentes:

Abra o [painel Sites](https://chatgpt.com/sites) e o compartilhamento da sua Central para liberar a entrada. Depois use a URL da própria Central, **Viagens → Detalhes e convidados → Convidados**, para liberar cada viagem ao mesmo e-mail. O Work entrega os dois links durante o onboarding; não existe link próprio para abrir diretamente o modal de convidados.

| Onde | O que permite |
| --- | --- |
| Compartilhamento do Sites | Entrar no aplicativo com a conta autorizada |
| Convidados de cada viagem | Ver os dados daquela viagem ou também editá-los |

O proprietário abre **Detalhes e convidados → Convidados**, informa o e-mail do ChatGPT, escolhe **Pode visualizar** ou **Pode editar** e salva. Salvar de novo o mesmo e-mail altera o papel; **Remover** revoga o acesso àquela viagem. Esse formulário não envia e-mail. Para compartilhar outra viagem, repita nela; para retirar a entrada no Site, revogue também no compartilhamento do Sites.

O convidado vê os mesmos dados da viagem compartilhada. Um leitor consulta; um editor pode modificar os dados. Isso não exige permissão para editar o código ou publicar o Site. Se alguém entra mas não vê a viagem, confira a conta, o e-mail e a autorização daquela viagem.

## Configuração e limites atuais

O Work prepara Sites, banco e armazenamento da própria pessoa. O aplicativo começa vazio. A busca/mapa usam serviços abertos; o aplicativo já inclui cache e controle local de consultas. A identificação da instalação é gerada automaticamente; não é uma chave nem uma garantia de cota do Photon. Nenhum cadastro adicional é exigido para esse recurso.

A Central precisa de internet. Um atalho no celular não garante uso offline. Sugestões de IA dentro do painel e busca automática de capas não fazem parte da entrega. Uma fonte autorizada no Work não dá ao Site acesso automático à caixa postal ou pasta. Scheduled Tasks requer configuração e validação próprias; execução local com arquivos depende de computador ligado e aplicativo aberto, enquanto a nuvem precisa de fontes/conexões acessíveis ali.

O Work deve conferir publicação, login e persistência dos dados na sua instalação antes de declará-la concluída. Teste o acesso pelo seu celular; uma simulação de largura não substitui essa conferência.


### Aviso de revisão na programação

Quando há reservas da viagem para conferir, um aviso abaixo do calendário mostra a quantidade e a ação **Conferir**, que leva à seção **Para revisar**. A contagem pertence à viagem inteira, não apenas ao dia selecionado. Sem pendências, o aviso desaparece; a seção de revisão continua no fim da página.

No painel de uma reserva, **Editar reserva** fica no cabeçalho junto à data, acima das abas Informações e Documentos, para quem possui permissão de edição. Em telas estreitas, a ação pode aparecer abaixo da data no mesmo grupo.

## Licenciamento, telemetria e versões

A distribuição usa licença proprietária com uso pessoal/profissional interno e modificações próprias permitidos; redistribuição/comercialização dependem de autorização expressa. LICENSE.md e PRIVACIDADE.md detalham as condições. Instalação por pedido curto com URL do repositório, guiada pelo Work. A oferta gratuita e sem anúncios inclui telemetria como parte essencial do modelo de manutenção: os indicadores de uso orientam a continuidade do projeto. Sem eles, o desenvolvimento e os recursos de versões futuras podem ser reduzidos ou encerrados, nos limites legais. Aceite explícito, após apresentação dos termos, precede ativação da telemetria obrigatória; fora de chatgpt.site inclui hostname, sem dados de viagens. Uso real liberado com ready:true; o aceite continua obrigatório por instalação.

Faixa sálvia acima da navegação, para o proprietário, com modal que copia pedido de atualização contendo instalação e repositório. Anúncio e manifesto usam a mesma versão do aplicativo, publicados junto do pacote. Consulta periódica pelo servidor ao GitHub sem identificador, domínio ou credencial da instalação; normalmente uma vez a cada 24 horas de uso após ativação. Descoberta de versão não instala automaticamente. O Work prepara backup/recuperação, preserva dados/personalizações e publica após autorização. O painel central e a infraestrutura de telemetria pertencem ao titular e não são distribuídos; entregas comuns do pacote não exigem sua atualização.

Proteção da telemetria: receptor com registros identificadores cifrados e backups criptografados; leitura administrativa autorizada e assinada pelo servidor privado. Chaves e infraestrutura do titular não pertencem à instalação pública. Os controles não representam certificação de conformidade ou proteção absoluta contra comprometimento da infraestrutura.

