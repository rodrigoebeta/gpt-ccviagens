# Instalar a Central de Viagens no Sites

Roteiro técnico para o GPT Work. Leia [AGENTS.md](AGENTS.md) e [GUIA_DO_PRODUTO.md](GUIA_DO_PRODUTO.md). Execute estas etapas; a pessoa participa apenas das autorizações, informações e ações de interface que dependerem dela. Use [ONBOARDING.md](ONBOARDING.md) depois da publicação.

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

Dentro de `site/`:

1. Execute `node scripts/preparar-local.mjs`. Ele cria `.openai/hosting.json` a partir do exemplo neutro apenas se o arquivo ainda não existir. `DB` e `BUCKET` são bindings, não credenciais.
2. Configure, só no processo, `npm_config_cache` para o caminho absoluto `.sites-runtime/npm-cache` e `TEMP`, `TMP`, `TMPDIR` para `.sites-runtime/tmp`. Não use HOME como variável auxiliar.
3. Siga o perfil/helper da habilidade oficial disponível (portable ou managed-linux). No Linux, confira a execução dos scripts `.sh` e, se necessário, aplique `chmod +x scripts/*.sh` apenas a eles.
4. Execute `npm run install:ci`, `node node_modules/typescript/bin/tsc --noEmit` e `npm run build`, com os helpers oficiais quando exigidos pelo ambiente.

O build também prepara os recursos locais do visualizador PDF. Preserve fontes, ícones, créditos, recursos PDF.js e arquivos de licença. Não atualize dependências ou altere o visual para instalar. Se houver incompatibilidade, registre a causa e faça somente a adaptação necessária.

**Conclusão:** tipos e build passam; `dist/` contém Worker, assets e configuração. Se falhar, corrija a causa antes de avançar. Uma prévia local não comprova login nem persistência hospedados.

## 3. Vincular banco e armazenamento próprios

Se houver vínculo anterior na cópia pessoal, confirme a identidade/propriedade e reutilize o Site. Na primeira instalação, crie um Site na conta da pessoa pelo fluxo oficial, com banco D1 `DB`, arquivos R2 `BUCKET` e acesso restrito. Salve o `project_id` retornado em `.openai/hosting.json`; não invente ou reutilize dados de outra instalação.

Crie `.private/HANDOFF.md` e `.private/TASK_PLAN.md` para registrar versão do pacote, estado, verificações, bloqueios e próxima ação. Configuração provisionada, viagens, comprovantes e continuidade permanecem privados; não os envie ao repositório de distribuição. As autorizações são feitas nas interfaces oficiais; não peça senha, cookie ou token no chat.

**Conclusão:** vínculo confirmado na conta correta e ambos os bindings disponíveis. Em retomadas, inspecione o estado antes de repetir provisionamento.

## 4. Aplicar migrações e publicar

O banco novo recebe as migrações de `site/drizzle/`, de `0000` a `0009`, em ordem, com journal/snapshots preservados. Não gere migrações para instalar. Use o procedimento oficial para o banco hospedado e confirme aplicação; migrar uma prévia local não migra a produção. Em retomadas/atualizações, aplique somente as pendentes.

Prepare fonte e artefato pelo fluxo oficial. O artefato deve corresponder ao mesmo commit de fonte e conter a saída `dist/`, inclusive `.openai/hosting.json` e `.openai/drizzle/`. Após vincular a instalação, compile novamente se o build anterior não contiver o vínculo correto. Não inclua dependências instaladas, caches, estado local ou segredos no artefato.

Apresente a preparação e verificações concluídas e confirme se a pessoa quer publicar agora ou fazer mais ajustes. Aguarde a resposta, salvo pedido explícito de publicar a versão atual já recebido. Só então salve uma versão e publique-a com o acesso restrito solicitado. Se a ferramenta aceitar um artefato compilado localmente, ele pode ser fornecido no formato oficial compatível. Se houver erro no build remoto, compare perfil, lockfile e registros; não altere todas as dependências por tentativa. Em falha de publicação, consulte o estado da operação antes de repetir.

**Conclusão:** o serviço informa publicação concluída e retorna a URL atual. Uma versão salva não equivale a Site publicado. Não amplie a audiência para resolver falhas de acesso.

## 5. Verificar e iniciar o onboarding

Abra a URL publicada, conclua o login oficial quando a pessoa precisar participar e confirme que a sessão usa a conta esperada. Use a primeira viagem e os dados autorizados durante o onboarding, sem povoar a instalação com exemplos.

| Conferência | Evidência e recuperação |
| --- | --- |
| Acesso privado | Conferir audiência e que uma sessão não autorizada não obtém dados/arquivos; não forjar identidade em produção. Se faltar uma segunda sessão para comprovar, registrar a limitação. |
| Viagem e armazenamento | Criar a viagem solicitada e recarregar. Com a primeira reserva autorizada, conferir persistência e abertura dos documentos; se falhar, revisar bindings/migrações e erro do serviço. |
| Importação | Seguir docs/IMPORTACAO.md, conferir datas e anexos e repetir a mesma importação sem duplicar. Sem transferência autenticada direta, entregar o JSON privado e guiar a seleção no painel. |
| Planejamento | Ao praticar uma alteração solicitada, conferir lugar/lista/dia, ordem ou visitado após recarga; não alterar dados apenas para demonstrar. |
| Compartilhamento | Explicar sempre as duas camadas; conferir convidado real somente quando solicitado, conforme ONBOARDING.md. |
| Celular | Orientar teste no telefone quando disponível. Registrar o que foi observado ou relatado; uma janela estreita não substitui aparelho físico. |

Se surgir `Failed to fetch`, confira primeiro URL atual e login: uma aba com endereço antigo pode mostrar dados já carregados e falhar nas novas consultas. Se persistir, examine a requisição e os registros do serviço antes de mudar permissões.

Siga as etapas de [ONBOARDING.md](ONBOARDING.md), sem entregar toda a lista de uma vez. Peça acesso somente à fonte escolhida no momento da importação: e-mail, pasta local, arquivos ou outra superfície disponível ao assistente. Um caminho local por si só não dá acesso ao Work; se necessário, oriente o envio dos arquivos. Não condicione a instalação, listas ou mapa ao Gmail ou a outro conector de reservas.

## Conferir telemetria e versão

Depois da publicação e do primeiro acesso autenticado, confira o estado local da instalação e a recepção pelo serviço oficial pelos meios autorizados; não declare entrega somente porque uma tarefa foi agendada. O ID persiste no banco entre atualizações. Não envie dados reais de viagem para testar. Falhas não bloqueiam a Central; aguarde o intervalo de recuperação. Distinga ausência de versão nova, consulta pendente e falha de conexão. O painel administrativo do autor não faz parte desta instalação.

## 6. Entregar e retomar

Entregue a URL, o que foi verificado, as limitações específicas e a próxima ação. Registre também as etapas de uso apresentadas, praticadas ou adiadas. O guia não substitui esse acompanhamento.

Se precisar mudar de conversa/ambiente, forneça briefing pronto com versão, URL da própria instalação, vínculo privado disponível pelo meio permitido, decisões, etapas concluídas, bloqueio e próxima ação. Não inclua segredos ou dependências da máquina anterior. Para atualizar uma central existente, siga [docs/ATUALIZACOES.md](docs/ATUALIZACOES.md).

Registre a evidência da instalação atual antes de declará-la concluída; não trate este roteiro como prova de execução.
