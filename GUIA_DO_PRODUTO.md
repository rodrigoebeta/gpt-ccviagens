# Guia da Central de Viagens

Distribuição liberada para instalação e uso real. A coleta está habilitada no produto (ready:true), mas só funciona após o aceite explícito e a configuração dos termos de cada instalação. A atividade vai ao endpoint oficial /telemetria-ccv/v1/activity; anúncios de atualização são consultados pelo servidor no release.json do repositório oficial no GitHub. Quem instala usa os endereços fornecidos: não instala receptor, Docker ou VPS.

Na Programação, as hospedagens ativas aparecem em uma faixa acima do roteiro, com período e ação Ver reserva. No dia da saída, o rótulo indica o check-out. A faixa permanece visível em dias sem eventos de entrada ou saída.

Referência do aplicativo incluído no pacote. Para instalar, siga [CONFIGURAR_NO_WORK.md](CONFIGURAR_NO_WORK.md); para aprender com o Work, siga [ONBOARDING.md](ONBOARDING.md).

## Viagens e navegação

No rodapé, **Sobre este painel** reúne informações sobre sua privacidade, telemetria e condições de uso. Abra a seção para consultar o resumo, os termos completos e o contato para permissões. Os créditos da imagem e **Sair da conta** ficam ao final da seção.

Em **Detalhes e convidados → Editar viagem**, o proprietário e quem tem permissão **Pode editar** podem corrigir o nome, o período e os destinos. Não é preciso criar outra viagem: capa, convidados, documentos, reservas, listas e lugares são preservados. Os horários e as datas dos itens não mudam automaticamente. O período precisa conter todas as reservas salvas e os lugares agendados; se necessário, amplie o período, ajuste os itens na programação e só então encurte. Ao alterar as datas, um aviso lista antecipadamente os itens que ficariam fora e impede salvar esse período. **Nenhuma reserva é apagada.** Uma edição concorrente pede atualização da página antes de tentar novamente.

No editor, os campos rolam quando necessário e as ações Cancelar/Salvar ficam visíveis no rodapé.

As áreas principais são **Viagens**, **Programação** e **Documentos da Viagem**. No celular, a navegação principal fica na parte inferior. Confira a viagem selecionada antes de incluir ou alterar dados. O destaque da seção selecionada é independente do contorno de foco do teclado. Use Tab para percorrer os controles; ao fechar Nova viagem, o foco retorna ao botão ou seletor que abriu o formulário.

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

O assistente prepara a importação de trens, voos, ônibus, hotéis e atividades a partir de qualquer fonte que consiga acessar com autorização: e-mail, pasta local, arquivos anexados, armazenamento em nuvem ou outra superfície. Gmail é uma opção. O acesso depende das ferramentas disponíveis naquela conversa; quando necessário, a pessoa fornece os arquivos por um meio acessível. Em **Documentos da Viagem → Importar reserva**, selecione o arquivo preparado. O painel recebe um JSON por reserva com seus documentos; não interpreta diretamente PDFs ou mensagens avulsas. O procedimento do agente está em [Importação](docs/IMPORTACAO.md).

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

| Onde | O que permite |
| --- | --- |
| Compartilhamento do Sites | Entrar no aplicativo com a conta autorizada |
| Convidados de cada viagem | Ver os dados daquela viagem ou também editá-los |

O proprietário abre **Detalhes e convidados → Convidados**, informa o e-mail do ChatGPT, escolhe **Pode visualizar** ou **Pode editar** e salva. Salvar de novo o mesmo e-mail altera o papel; **Remover** revoga o acesso àquela viagem. Esse formulário não envia e-mail. Para compartilhar outra viagem, repita nela; para retirar a entrada no Site, revogue também no compartilhamento do Sites.

O convidado vê os mesmos dados da viagem compartilhada. Um leitor consulta; um editor pode modificar os dados. Isso não exige permissão para editar o código ou publicar o Site. Se alguém entra mas não vê a viagem, confira a conta, o e-mail e a autorização daquela viagem.

## Configuração e limites atuais

O Work prepara Sites, banco e armazenamento da própria pessoa. O aplicativo começa vazio. A busca/mapa usam serviços abertos; o aplicativo já inclui cache e controle local de consultas. A identificação da instalação é gerada automaticamente; não é uma chave nem uma garantia de cota do Photon. Nenhum cadastro adicional é exigido para esse recurso.

A central precisa de internet. Um atalho na tela inicial do celular facilita o acesso, mas não garante uso offline. Sincronização automática das fontes de reservas, sugestões de IA dentro do painel e busca automática de capas não fazem parte da entrega. Uma fonte autorizada no Work não dá ao Site acesso automático à caixa postal, pasta ou serviço.

O Work deve conferir publicação, login e persistência dos dados na sua instalação antes de declará-la concluída. Teste o acesso pelo seu celular; uma simulação de largura não substitui essa conferência.


### Aviso de revisão na programação

Quando há reservas da viagem para conferir, um aviso abaixo do calendário mostra a quantidade e a ação **Conferir**, que leva à seção **Para revisar**. A contagem pertence à viagem inteira, não apenas ao dia selecionado. Sem pendências, o aviso desaparece; a seção de revisão continua no fim da página.

No painel de uma reserva, **Editar reserva** fica no cabeçalho junto à data, acima das abas Informações e Documentos, para quem possui permissão de edição. Em telas estreitas, a ação pode aparecer abaixo da data no mesmo grupo.

## Licenciamento, telemetria e versões

A distribuição usa licença proprietária com uso pessoal/profissional interno e modificações próprias permitidos; redistribuição/comercialização dependem de autorização expressa. LICENSE.md e PRIVACIDADE.md detalham as condições. Instalação por pedido curto com URL do repositório, guiada pelo Work. A oferta gratuita e sem anúncios inclui telemetria como parte essencial do modelo de manutenção: os indicadores de uso orientam a continuidade do projeto. Sem eles, o desenvolvimento e os recursos de versões futuras podem ser reduzidos ou encerrados, nos limites legais. Aceite explícito, após apresentação dos termos, precede ativação da telemetria obrigatória; fora de chatgpt.site inclui hostname, sem dados de viagens. Uso real liberado com ready:true; o aceite continua obrigatório por instalação.

Faixa sálvia acima da navegação, para o proprietário, com modal que copia pedido de atualização contendo instalação e repositório. Anúncio e manifesto usam a mesma versão do aplicativo, publicados junto do pacote. Consulta periódica pelo servidor ao GitHub sem identificador, domínio ou credencial da instalação; normalmente uma vez a cada 24 horas de uso após ativação. Descoberta de versão não instala automaticamente. O Work prepara backup/recuperação, preserva dados/personalizações e publica após autorização. O painel central e a infraestrutura de telemetria pertencem ao titular e não são distribuídos; entregas comuns do pacote não exigem sua atualização.

Proteção da telemetria: receptor com registros identificadores cifrados e backups criptografados; leitura administrativa autorizada e assinada pelo servidor privado. Chaves e infraestrutura do titular não pertencem à instalação pública. Os controles não representam certificação de conformidade ou proteção absoluta contra comprometimento da infraestrutura.

