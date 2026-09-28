# Instalar a Central de Viagens no Sites

Roteiro técnico para o GPT Work. Leia [AGENTS.md](AGENTS.md) e [GUIA_DO_PRODUTO.md](GUIA_DO_PRODUTO.md). Execute estas etapas; a pessoa participa apenas das autorizações, informações e ações de interface que dependerem dela. Use [ONBOARDING.md](ONBOARDING.md) depois da publicação.

## 0. Sites primeiro: conta, ativação e novo chat

Antes de baixar dependências, configurar ou publicar, confira se as ferramentas e habilidades oficiais de Sites estão disponíveis nesta conversa e nesta conta. Uma consulta de leitura à lista de Sites, quando permitida, confirma acesso sem criar nada. Se já estiverem disponíveis, não peça reinstalação nem novo chat desnecessário.

Se faltarem, explique: “Precisamos habilitar o Sites no seu próprio ChatGPT para instalar sua Central”. Oriente abrir **Plugins**, procurar **Sites** e usar a ação de instalar/habilitar apresentada. A posição pode variar: confira a interface antes de afirmar que Plugins ou Sites ficam no menu **(...) / Mais** da lateral. [Abrir Sites](https://chatgpt.com/sites) leva ao gerenciamento; abrir essa página não comprova instalação do plugin. Se não houver a opção, confira conta, plano e disponibilidade, sem sugerir outra hospedagem.

Use Question com **SIM, ativei o Sites** / **Não encontrei essa opção**. Aguarde a resposta, ajude se necessário e verifique novamente a capacidade. A confirmação da pessoa não substitui a chamada de leitura bem-sucedida. Só ofereça cartão oficial de instalação se a ferramenta retornar o plugin exato e elegível; a pessoa conclui a ativação. Não prometa instalação silenciosa nem invente IDs ou instale plugins de outros provedores.

A [documentação de plugins](https://learn.chatgpt.com/docs/plugins) orienta iniciar **novo chat após instalar**, para carregar suas habilidades. Prepare a retomada antes dessa troca. Só ofereça um botão nativo para continuar em novo chat se a ferramenta disponível suportar explicitamente esse tipo de conversa; uma ferramenta de fork de Codex não comprova suporte a um chat do Work. O caminho de menu “Continue in → Continue in a new chat” só deve ser indicado se confirmado na interface atual. Caso contrário, oriente abrir novo chat no mesmo projeto, se já existir, e entregue este briefing pronto para copiar:

> Continue a instalação e publicação privada da Central de Viagens de https://github.com/rodrigoebeta/gpt-ccviagens usando Sites. Preserve o aplicativo pronto e siga README.md, AGENTS.md e CONFIGURAR_NO_WORK.md. Sites foi habilitado; confirme as ferramentas nesta conversa. Estado já verificado: [preencher]. Projeto/arquivos acessíveis: [preencher ou indicar ainda não preparado]. Aceite: [registrado, com localização privada, ou ainda não solicitado]. Próxima ação: [preencher]. Não repita etapas confirmadas nem crie uma segunda instalação. Conduza decisões por Question e complete ONBOARDING.md, mesmo se eu adiar criar a viagem.

Preencha os campos antes de entregar. No novo chat, leia a continuidade disponível, confirme projeto/arquivos e ferramentas e prossiga. Se ainda faltarem, registre o bloqueio concreto; não entre em um ciclo de abrir chats.

**Conclusão:** Sites utilizável na conversa de execução; instalação/habilitação relatada e acesso verificado são estados distintos. A documentação de [Sites](https://learn.chatgpt.com/docs/sites) confirma **Mais → Sites** na web; não confirma a posição exata no desktop nem instalação automática.

## 0.1. Reunir chats e arquivos no projeto

Inspecione primeiro o projeto e a pasta já selecionados. Se pertencerem à instalação, reutilize-os; não crie duplicatas. O projeto reúne os chats no Work; o Site é a aplicação hospedada e tem vínculo separado.

**Desktop com acesso local:** ofereça em Question **Usar Central de Viagens em Documentos** / **Escolher outra pasta** / **Já tenho um projeto**. Depois da escolha, descubra a pasta Documentos real do sistema (ela pode estar no OneDrive ou redirecionada); não monte um caminho presumindo nome de usuário. Crie somente a subpasta escolhida e clone nela o repositório oficial, se vazia. Se contiver arquivos, confira antes de reutilizar e nunca sobrescreva uma pasta desconhecida. Mantenha ferramentas/cache/temporários dentro dela. Se a conversa não tiver permissão, oriente a pessoa a criar/selecionar essa pasta pelo seletor oficial e retome ali; não tente ampliar permissões silenciosamente.

Use a ferramenta oficial de criação/associação de projeto somente quando existir e cobrir o ambiente atual. Quando não existir, guie a pessoa a abrir **Projetos**, criar **Central de Viagens** e selecionar a pasta preparada como pasta principal do projeto local. Para projeto existente, a documentação descreve **Editar projeto → Adicionar pasta**. Confira os controles exibidos antes de dar instruções mais específicas. Não prometa automatizar o próprio desktop do ChatGPT por Computer Use. Use Question **SIM, projeto e pasta vinculados** / **Preciso de ajuda**; confirme a associação por listagem oficial/contexto do chat. Se depender só do relato, registre isso. Mantenha os próximos chats dentro desse projeto; se for preciso abrir um chat nele, forneça briefing de retomada preenchido.

**Work na web/nuvem:** guie a criação ou seleção de um projeto ChatGPT e o início de um chat Work dentro dele. Disponibilize o pacote completo por repositório/upload ou fonte conectada acessível ao ambiente. Uma pasta em Documentos pode servir de cópia pessoal, mas não é requisito de execução na nuvem nem cria acesso a arquivos locais. Preserve instruções e continuidade acessíveis ao projeto entre chats; não dependa de uma pasta temporária que desaparece ao encerrar a execução.

**Conclusão:** projeto identificado, conversa associada e arquivos legíveis pelo ambiente de execução. Se um desses pontos faltar, conclua o passo manual correspondente antes da instalação dependente. [Projetos e chats](https://learn.chatgpt.com/docs/projects) distingue projetos locais de projetos com fontes enviadas/conectadas.

## 1. Conferir pacote, conta e ferramentas

Na raiz da cópia limpa, execute `node scripts/verificar-pacote.mjs` antes de modificar arquivos. Confira `site/package.json`, `site/app/travel-app.tsx`, lockfile, assets, migrações e manifesto. Se faltar algo ou um hash divergir, obtenha uma cópia íntegra; não complete o aplicativo com código inventado.

Node >=22.13 e Git são requisitos do ambiente do agente. Use as ferramentas existentes; se for necessário instalar algo, mantenha dentro do projeto, sem instalação global ou alteração de PATH.

Confira as ferramentas/habilidades oficiais do Sites na conta atual e consulte a [documentação oficial](https://learn.chatgpt.com/docs/sites). Ela descreve publicação de projetos existentes, vínculo em `.openai/hosting.json`, armazenamento D1/R2 e as etapas distintas de salvar e publicar uma versão. Oriente ativação/consentimento apenas se faltarem. Se a ferramenta estiver indisponível ou houver limite da conta, registre o bloqueio e preserve a preparação; não crie outra hospedagem como substituta.

**Conclusão:** pacote íntegro e acesso oficial ao Sites confirmado. A pessoa não precisa executar comandos ou fornecer chaves Cloudflare.

## Aceite antes da configuração

Depois da conferência somente de leitura, consulte LICENSE.md, PRIVACIDADE.md e site/lib/distribution-config.ts. Se ready estiver false ou se repository, telemetryEndpoint ou releaseEndpoint estiverem ausentes, preserve o trabalho e informe que a distribuição oficial ainda não foi liberada; não invente endereços nem remova esse bloqueio.

Apresente uso permitido/restrições, coleta obrigatória, finalidade, campos, envio do hostname externo, responsável, retenção e direitos. Explique que a telemetria integra o modelo que viabiliza a oferta gratuita e sem anúncios, orienta o investimento e a continuidade dos recursos, sem venda de dados. Sem os indicadores, o desenvolvimento ou funções de versões futuras podem ser reduzidos ou encerrados; isso não é bloqueio remoto da instalação. Depois de apresentar essas informações e os documentos completos, peça uma única confirmação clara: a pessoa aceita os termos e o aviso de privacidade e deseja prosseguir com a instalação nessas condições? Não trate o pedido inicial de instalação como resposta antecipada. Obtenha manifestação explícita antes de ativar a coleta. Não aceite por ela. Só depois execute node scripts/registrar-aceite.mjs --aceite-explicito-confirmado. Preserve .private/aceite.json e não repita aceite válido nas retomadas. O aceite contratual não comprova por si só conformidade legal.

No ambiente hospedado, configure CENTRAL_TERMS_VERSION e CENTRAL_TERMS_ACCEPTED_AT a partir do registro; configure CENTRAL_INSTALLATION_OWNER_ID com a identidade oficial verificada do proprietário, nunca inventada. O aviso de versão é apresentado ao proprietário; convidados não recebem instruções para atualizar o código. Não configure credenciais do receptor nem instale Docker: isso pertence ao titular da distribuição.

## 2. Preparar e compilar o aplicativo

Todas as escolhas do roteiro usam Question, inclusive o aceite: **Li e aceito; instalar minha Central** / **Quero esclarecer os termos** / **Não aceito**. Não avance sem resposta explícita após a apresentação dos termos. A recusa encerra a ativação sem telemetria; dúvidas recebem explicação antes de nova decisão. Escolher “SIM, ativei o Sites” não é aceite dos termos da Central.

Dentro de `site/`:

1. Execute `node scripts/preparar-local.mjs`. Ele cria `.openai/hosting.json` a partir do exemplo neutro apenas se o arquivo ainda não existir. `DB` e `BUCKET` são bindings, não credenciais.
2. Configure, só no processo, `npm_config_cache` para o caminho absoluto `.sites-runtime/npm-cache` e `TEMP`, `TMP`, `TMPDIR` para `.sites-runtime/tmp`. Não use HOME como variável auxiliar.
3. Siga o perfil/helper da habilidade oficial disponível (portable ou managed-linux). No Linux, confira a execução dos scripts `.sh` e, se necessário, aplique `chmod +x scripts/*.sh` apenas a eles.
4. Execute `npm run install:ci`, `node node_modules/typescript/bin/tsc --noEmit` e `npm run build`, com os helpers oficiais quando exigidos pelo ambiente.

O build também prepara os recursos locais do visualizador PDF. Preserve fontes, ícones, créditos, recursos PDF.js e arquivos de licença. Não atualize dependências ou altere o visual para instalar. Se houver incompatibilidade, registre a causa e faça somente a adaptação necessária.

**Conclusão:** tipos e build passam; `dist/` contém Worker, assets e configuração. Se falhar, corrija a causa antes de avançar. Uma prévia local não comprova login nem persistência hospedados.

## 3. Vincular banco e armazenamento próprios

Se houver vínculo anterior na cópia pessoal, confirme a identidade/propriedade e reutilize o Site. Na primeira instalação, crie um Site na conta da pessoa pelo fluxo oficial, com banco D1 `DB`, arquivos R2 `BUCKET` e acesso restrito. Salve o `project_id` retornado em `.openai/hosting.json`; não invente ou reutilize dados de outra instalação.

Solicite **`centraldeviagem`** como slug padrão. A forma esperada é `centraldeviagem.<identificador-da-conta>.chatgpt.site`, mas só entregue como endereço real a URL retornada pelo Sites. Se o nome não estiver disponível, ofereça duas alternativas válidas em Question e use a escolhida, sem excluir outro Site. Não crie novamente um Site já provisionado nem renomeie uma instalação existente só para impor esse padrão.

Crie `.private/HANDOFF.md` e `.private/TASK_PLAN.md` para registrar versão do pacote, estado, verificações, bloqueios e próxima ação. Configuração provisionada, viagens, comprovantes e continuidade permanecem privados; não os envie ao repositório de distribuição. As autorizações são feitas nas interfaces oficiais; não peça senha, cookie ou token no chat.

**Conclusão:** vínculo confirmado na conta correta e ambos os bindings disponíveis. Em retomadas, inspecione o estado antes de repetir provisionamento.

## 4. Aplicar migrações e publicar

O banco novo recebe as migrações de `site/drizzle/`, de `0000` a `0009`, em ordem, com journal/snapshots preservados. Não gere migrações para instalar. Use o procedimento oficial para o banco hospedado e confirme aplicação; migrar uma prévia local não migra a produção. Em retomadas/atualizações, aplique somente as pendentes.

Prepare fonte e artefato pelo fluxo oficial. O artefato deve corresponder ao mesmo commit de fonte e conter a saída `dist/`, inclusive `.openai/hosting.json` e `.openai/drizzle/`. Após vincular a instalação, compile novamente se o build anterior não contiver o vínculo correto. Não inclua dependências instaladas, caches, estado local ou segredos no artefato.

O pedido de instalação deste produto pronto inclui sua publicação privada. Após aceite, preparação e verificações, salve a versão e publique com acesso restrito, sem perguntar “publicar agora ou fazer mais ajustes?”. A pessoa usará o produto fornecido; não ofereça decisões de design ou construção. Respeite uma restrição expressa de apenas preparar e aprovações obrigatórias das ferramentas. Se a ferramenta aceitar um artefato compilado localmente, forneça-o no formato oficial. Se houver erro remoto, compare perfil, lockfile e registros; não altere dependências por tentativa. Em falha, consulte o estado da operação antes de repetir.

**Conclusão:** o serviço informa publicação concluída e retorna a URL atual. Uma versão salva não equivale a Site publicado. Não amplie a audiência para resolver falhas de acesso.

## 5. Verificar e iniciar o onboarding

Abra a URL publicada, conclua o login oficial quando a pessoa precisar participar e confirme que a sessão usa a conta esperada. Use a primeira viagem e os dados autorizados durante o onboarding, sem povoar a instalação com exemplos.

| Conferência | Evidência e recuperação |
| --- | --- |
| Acesso privado | Conferir audiência e que uma sessão não autorizada não obtém dados/arquivos; não forjar identidade em produção. Se faltar uma segunda sessão para comprovar, registrar a limitação. |
| Viagem e armazenamento | Guiar a pessoa em Viagens → Nova viagem, confirmar por Question e conferir após recarga. Não cadastrar por ela. Se adiar, registrar prática pendente e continuar a apresentação da importação, Scheduled Tasks e locais. Com a primeira reserva autorizada, conferir persistência e documentos; se falhar, revisar bindings/migrações. |
| Importação | Seguir docs/IMPORTACAO.md, conferir datas e anexos e repetir a mesma importação sem duplicar. Sem transferência autenticada direta, entregar o JSON privado e guiar a seleção no painel. |
| Planejamento | Ao praticar uma alteração solicitada, conferir lugar/lista/dia, ordem ou visitado após recarga; não alterar dados apenas para demonstrar. |
| Compartilhamento | Explicar sempre as duas camadas; conferir convidado real somente quando solicitado, conforme ONBOARDING.md. |
| Celular | Orientar teste no telefone quando disponível. Registrar o que foi observado ou relatado; uma janela estreita não substitui aparelho físico. |

Se surgir `Failed to fetch`, confira primeiro URL atual e login: uma aba com endereço antigo pode mostrar dados já carregados e falhar nas novas consultas. Se persistir, examine a requisição e os registros do serviço antes de mudar permissões.

Siga as etapas de [ONBOARDING.md](ONBOARDING.md), sem entregar toda a lista de uma vez. Peça acesso somente à fonte escolhida no momento da importação: e-mail, pasta local, arquivos ou outra superfície disponível ao assistente. Um caminho local por si só não dá acesso ao Work; se necessário, oriente o envio dos arquivos. Não condicione a instalação, listas ou mapa ao Gmail ou a outro conector de reservas.

## Conferir telemetria e versão

Depois da publicação e do primeiro acesso autenticado, confira o estado local da instalação e a recepção pelo serviço oficial pelos meios autorizados; não declare entrega somente porque uma tarefa foi agendada. O ID persiste no banco entre atualizações. Não envie dados reais de viagem para testar. Falhas não bloqueiam a Central; aguarde o intervalo de recuperação. Distinga ausência de versão nova, consulta pendente e falha de conexão. O painel administrativo do autor não faz parte desta instalação.

## 6. Entregar e retomar

Antes de encerrar a instalação, explique as duas permissões: no [painel Sites](https://chatgpt.com/sites), abrir a Central → Compartilhar libera a entrada; na URL real da Central, **Viagens → Detalhes e convidados → Convidados** libera os dados de cada viagem para o mesmo e-mail. Entregue ambos os links, mas não invente link direto para o modal de convidados. Não envie convites sem pedido. Prossiga no onboarding obrigatório até importação/documentos, Scheduled Tasks e locais em listas/roteiro, mesmo sem viagem ou reservas para praticar. Só uma pausa explícita da pessoa interrompe esse acompanhamento; registre onde retomar.

Entregue a URL, o que foi verificado, as limitações específicas e a próxima ação. Registre também as etapas de uso apresentadas, praticadas ou adiadas. O guia não substitui esse acompanhamento.

Se precisar mudar de conversa/ambiente, forneça briefing pronto com versão, URL da própria instalação, vínculo privado disponível pelo meio permitido, decisões, etapas concluídas, bloqueio e próxima ação. Não inclua segredos ou dependências da máquina anterior. Para atualizar uma central existente, siga [docs/ATUALIZACOES.md](docs/ATUALIZACOES.md).

Registre a evidência da instalação atual antes de declará-la concluída; não trate este roteiro como prova de execução.
