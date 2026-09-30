# Skills da Central e disponibilidade na nuvem

O pacote entrega **ccviagens-onboarding** (instalação/primeiro uso) e **ccviagens-importar** (importação pontual ou incremental). Instruções e referências são empacotadas da mesma versão das fontes públicas; não precisam ler arquivos privados do autor nem a branch main a cada execução. Campos e limites da API são descobertos ao vivo em capabilities. Nenhuma Skill contém dados de viagem, credenciais ou tarefa pré-ativada.

## Escolher como configurar a tarefa agendada

O onboarding oferece primeiro **plugin + ccviagens-importar + [prompt curto](PROMPT_SCHEDULED_SKILL.md)**. Explique que o plugin entrega as instruções e referências da rotina; as conexões autorizadas fornecem acesso às fontes e ao Sites. Use Question ou equivalente real: **Instalar plugin (recomendado)** / **Usar prompt completo** / **Configurar depois**. Reutilize uma escolha já confirmada; sem ferramenta de perguntas, apresente as mesmas opções em texto e aceite resposta natural. Termine a rodada com uma única instrução concreta em negrito.

Se a pessoa escolher o plugin, guie a instalação por uma rota oficial realmente disponível na conta, confira a seleção nativa de ccviagens-importar, seus recursos da mesma versão e as conexões no executor cloud. Então prepare o prompt curto preenchido e crie a tarefa autorizada. A primeira execução do agendador deve ser verificada separadamente; a configuração preparada não comprova funcionamento recorrente.

Se a pessoa preferir o procedimento completo, não quiser instalar, ou faltar a rota/plugin/Skill/referências na nuvem, ofereça [PROMPT_SCHEDULED_TASK.md](PROMPT_SCHEDULED_TASK.md) **integral e autossuficiente**, preenchido com as mesmas escolhas. Registre o modo adotado e continue o onboarding. Não tentar instalar novamente após recusa nem trocar automaticamente uma tarefa existente. Falta de fonte, Sites ou transporte HTTP continua sendo um bloqueio dos dois modos; o prompt completo resolve a dependência de Skill, não concede ferramentas ou acesso.

## No projeto do computador

Primeiro a pessoa cria/escolhe e vincula a pasta principal. Obtenha o pacote íntegro nessa pasta e execute scripts/verificar-pacote.mjs antes de modificar. Os diretórios `.agents/skills/ccviagens-onboarding/` e `.agents/skills/ccviagens-importar/` acompanham o pacote e são descobertos pelo Codex a partir da pasta principal. Não usar instalação global ou o destino pessoal padrão de skill-installer; não exportar outras Skills do projeto. Se a Skill já existir, verificar versão e preservar alterações antes de atualizar.

Confira o seletor/lista disponível e a leitura do SKILL.md e de um recurso. Se a Skill não aparecer, abra novo chat no mesmo projeto quando necessário, com briefing preenchido; reiniciar o app só se a detecção continuar ausente. Não repetir consentimento/instalação. Invoque `$ccviagens-onboarding` ou `$ccviagens-importar` na superfície Codex que reconhecer essa sintaxe. Em ChatGPT, use @ e escolha a Skill realmente exibida. Confirme seleção, não só texto digitado. Os guias completos permitem continuar a instalação se a descoberta local de Skills estiver indisponível.

## Instalar e verificar o plugin na nuvem

Uma Skill local não se torna automaticamente acessível ao executor na nuvem. [Build skills](https://learn.chatgpt.com/docs/build-skills) documenta plugins como distribuição de Skills para web/desktop/mobile e Skills locais para desktop/CLI/IDE. [Scheduled Tasks](https://learn.chatgpt.com/docs/automations) permite usar Skills/plugins disponíveis à conversa e guardar instruções duráveis no prompt salvo ou numa Skill vinculada, sem pasta/worktree persistente entre execuções web. Isso não comprova disponibilidade na conta atual nem identifica a causa de uma execução que falhou; não presumir que empacotar um plugin resolverá a falha.

O pacote entrega `plugins/ccviagens/` e **ccviagens-plugin.zip** na raiz, gerados juntos da mesma versão e das mesmas fontes públicas verificadas. O ZIP contém somente o manifesto portable e as duas Skills com referências autocontidas; não instala MCP, hooks ou conectores e não fornece acesso ao e-mail/Sites. O agente entrega o arquivo do pacote verificado ou um link HTTPS oficial de download confirmado, sem apresentar o ZIP de todo o repositório como plugin. Não exigir comandos da pessoa para montar o arquivo. Gerar ZIP não comprova importação na plataforma nem disponibilidade cloud; ferramentas internas do mantenedor continuam fora do pacote.

### Rota principal: enviar o ZIP no próprio ChatGPT

Esta instalação usa o envio privado do arquivo, quando o controle estiver disponível na conta; a submissão ao diretório público não é pré-requisito do onboarding.

1. Entregue **ccviagens-plugin.zip** do pacote verificado e indique [Plugins no ChatGPT](https://chatgpt.com/plugins), na mesma conta/workspace que executará a tarefa cloud.
2. Oriente **Adicionar → Enviar arquivo compactado do plugin**. No diálogo **Novo plugin**, selecionar/arrastar o ZIP e escolher **Adicionar plugin**. Usar os rótulos realmente exibidos, aceitando equivalentes em outro idioma. Não escolher **Criar aplicativo MCP**: este pacote contém apenas Skills.
3. Confira o resultado do upload, nome **Central de Viagens**, versão e presença de **ccviagens-onboarding** e **ccviagens-importar**. Se a importação criar um item ainda não instalado/habilitado, conduza a instalação pela ação efetivamente exibida e confira o estado; upload e uso são provas distintas.
4. Prepare um briefing pronto para copiar com versão, projeto/URL da própria Central, fontes/contas, escopo, T0 e horários/fuso já confirmados, sem credenciais; assim o novo chat preserva as decisões. Abra um novo chat do **Work na nuvem**, cole o briefing, digite @ e selecione **ccviagens-importar** realmente exibida. Confira leitura do SKILL.md e do procedimento/referências da mesma versão, com as conexões autorizadas necessárias.
5. Preencha o prompt curto para aquela instalação e salve a tarefa autorizada, conferindo a seleção/vínculo da Skill no executor quando exposto. Verifique a primeira execução real separadamente.

Depois de cada ação manual, termine a mensagem com uma única instrução concreta em negrito indicando onde agir e como confirmar no chat. Se faltar **Adicionar/Enviar arquivo compactado**, houver restrição do workspace, recusa da pessoa ou erro de importação/referências, informe o resultado específico e ofereça o prompt completo como fallback. Preserve agenda, fontes, consentimentos e T0. Não encaminhar a pessoa ao portal de publicação da Platform para instalar o plugin privado.

### Outras rotas, quando disponíveis

1. **Workspace com administrador:** importar o marketplace do repositório em Admin → Plugins → Add → Import marketplace, selecionando versão/tag/commit revisado. O catálogo `.agents/plugins/marketplace.json` referencia o plugin. O administrador configura acesso; a pessoa habilita o plugin disponível e suas próprias conexões. Não prometer esse menu a contas pessoais. [Importação oficial](https://learn.chatgpt.com/docs/enterprise/plugin-management).
2. **Plugin publicado no diretório universal:** instalar a versão oficial efetivamente publicada, iniciar novo chat e selecionar a Skill. Enquanto não houver ID/listagem oficial verificada, não inventar link/cartão de instalação. Submissão/publicação pelo mantenedor é uma etapa opcional e separada do envio privado do ZIP; não bloqueia o onboarding. [Empacotamento](https://developers.openai.com/plugins/build/plugins) e [publicação](https://developers.openai.com/plugins/deploy/submission).
3. **Plugin Creator habilitado no workspace:** a documentação permite criar um plugin privado em Chat/Work com Plugin Creator e fornecer instruções/referências. Confira a permissão Use plugins e o criador realmente exibido; use somente os arquivos públicos revisados deste pacote e confira a versão e as referências importadas. Isso prepara um plugin daquele workspace, sem prometer instalação universal ou acesso aos serviços. Compartilhar/publicar é uma ação separada. Não pressupor que todo workspace importe diretamente um ZIP. [Criação no Work web](https://learn.chatgpt.com/docs/build-plugins).
4. **Sem rota/plugin disponível, ou se a pessoa não quiser instalar:** explicar a limitação e oferecer o prompt integral autossuficiente PROMPT_SCHEDULED_TASK.md como fallback, continuando o onboarding. Se a pessoa quiser exclusivamente o modo Skill, manter a ativação pendente; não trocar por tarefa local, fingir instalação nem pedir plano pago automaticamente.

Quando a pessoa escolher o plugin e houver suporte, guie a ação manual na interface real. Registre separadamente preparado, instalado/habilitado, selecionável, referências legíveis e executado. Teste em um chat cloud regular da mesma conta com leitura autorizada de capacidades/viagens e leitura de fontes/originais conforme escopo. Prepare PROMPT_SCHEDULED_SKILL.md preenchido após confirmar esses pré-requisitos e que a Skill/conexões acompanharão a tarefa. A primeira execução **do agendador** continua sendo comprovação separada; teste local ou conversa cloud não substitui essa evidência. Se a Skill ou suas referências falharem nesse executor, informe a falha e ofereça migrar para o prompt completo, preservando agenda, fontes, escopo e T0. Confira o ID existente antes de repetir uma criação; não manter duas tarefas da mesma rotina.

## Programação e estado

Ofereça três vezes por dia, a cada oito horas, com horários/fuso confirmados; exemplo 00h/08h/16h. Reutilize escolha anterior sem perguntar de novo. A invocação define o método; os campos do agendador definem a programação. Salvar o prompt não cria a tarefa. Confira ID existente antes de repetir uma criação e preserve T0.

Não criar JSON de controle local como estado garantido da nuvem. A rotina reconsulta desde T0 e a Central deduplica reservas/documentos; consulte o estado real antes de escrever. Isso evita perder erros, anexos pendentes e mensagens que passam a corresponder a uma viagem depois. Um cursor persistente exigiria armazenamento durável, conclusão por fonte, concorrência, recuperação e reprocessamento; não é um recurso desta versão. Relatório privado opcional não avança janela. Se o volume tornar o método inviável, declarar parcial e solicitar ajuste, sem prometer processamento ilimitado.

## Atualizar

Atualizar o aplicativo não atualiza automaticamente Skills/plugins ou tarefas já salvas. Confira versões, recursos, seleção/binding e prompt armazenado; preserve T0, fontes, escopo e consentimentos. Não habilitar atualização diária do marketplace sem explicar o comportamento da rota administrativa. Um commit/tag fixo permanece nessa revisão. Não publicar, enviar ao GitHub ou criar tarefa real automaticamente durante desenvolvimento.
