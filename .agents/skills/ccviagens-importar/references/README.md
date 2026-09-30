# Sua Central de Viagens

A instalação inclui as Skills **ccviagens-onboarding** e **ccviagens-importar**, dentro do projeto e na mesma versão do pacote. A primeira conduz instalação/uso por etapa; a segunda busca e importa reservas pontualmente ou acompanha novidades autorizadas. Para a tarefa agendada, o onboarding oferece primeiro plugin + Skill + prompt curto: entrega **ccviagens-plugin.zip** e orienta [Plugins no ChatGPT](https://chatgpt.com/plugins) → **Adicionar → Enviar arquivo compactado do plugin**, verificando instalação, seleção e referências na nuvem. Não precisa submeter ao diretório público. Se você não quiser instalar ou faltar suporte, oferece o prompt completo e autossuficiente como fallback. Consulte docs/SKILLS.md: pacote/plugin local não comprova instalação cloud. A programação sugerida é três vezes por dia, a cada oito horas, com horários/fuso escolhidos.

Cada rodada termina com uma instrução concreta em **negrito**; ao abrir no celular, o Work também entrega a URL HTTPS completa da Central da pessoa em bloco de código para copiar.


O Work também opera o produto por [API do assistente](docs/API_ASSISTENTE.md): viagens, listas, locais, roteiro, reservas, revisões, documentos, capas e convidados. Após configurar a autenticação, consultar `/api/assistant/capabilities`, executar o pedido autorizado e conferir a persistência. Ensinar esse caminho durante o onboarding, sem substituir a prática inicial pela interface.

Seu site de viagens está pronto. O ChatGPT Work instala na sua conta do Sites, ajuda a importar suas reservas e ensina você a usar o painel.

## Como começar

1. **No computador, prepare a pasta e o projeto primeiro.** Crie ou escolha uma pasta sua, por exemplo **Central de Viagens** em Documentos, e associe-a ao projeto no ChatGPT desktop. Abra um chat Work desse projeto com acesso à pasta principal. Se ainda faltar esse vínculo, esse será o primeiro pedido do assistente; ele orienta e aguarda sua ação. Siga a [etapa0 do guia](CONFIGURAR_NO_WORK.md). Um vínculo já verificado pode ser reutilizado.
2. Peça nesse chat: `Instale https://github.com/rodrigoebeta/gpt-ccviagens`. O Work verifica o acesso à pasta e só depois começa a execução. [COMECE_AQUI.md](COMECE_AQUI.md) é a alternativa detalhada. Para um fluxo exclusivamente na nuvem, use projeto/fontes acessíveis ali conforme o guia; isso não dá acesso à pasta do computador.
3. O Work confere **Sites** na conta que será dona da Central. Se precisar habilitar o plugin, ele guia a ativação em **Plugins** e a retomada em novo chat do mesmo projeto/pasta. Os menus variam. [Sites](https://chatgpt.com/sites) é o painel de gerenciamento.
4. Com a pasta autorizada, o Work obtém o pacote completo do repositório ou usa a cópia/ZIP que você disponibilizar e confere sua integridade. Só este README não contém o aplicativo. Depois do aceite informado, instala e publica com acesso restrito, solicitando **ccviagens** ao Sites.
5. Entre na Central. O Work avisa e orienta a instalar no celular como PWA e a preparar a consulta offline. Crie sua viagem pela interface. Responda às perguntas no chat: opções clicáveis quando disponíveis, ou opções em texto se a pergunta não aparecer. Mesmo se adiar o cadastro, o Work continua ensinando importação, documentos, Scheduled Tasks, listas, roteiro e compartilhamento. Começa oferecendo e-mail conectado; arquivos, pastas e nuvem também podem ser usados com acesso autorizado. Gmail não é obrigatório.

Você não precisa programar, escolher um design ou executar comandos. Também não precisa de uma chave do Google Maps ou de IA. Autorizações acontecem nas interfaces oficiais; nunca envie senhas, tokens ou cookies na conversa.

## O que você poderá usar

- Viagens com capa própria e programação diária de reservas e lugares.
- Listas personalizadas, mapa, busca de lugares e marcação de visitados.
- Ordem do dia por arraste e ajustes manuais nas reservas.
- Documentos privados com visualização, páginas e zoom dentro do painel.
- Compartilhamento por viagem, com acesso para visualizar ou editar.

O Work conduz o [onboarding](ONBOARDING.md) usando sua viagem. O [guia do produto](GUIA_DO_PRODUTO.md) fica disponível para consulta depois.

## Licença, telemetria e atualizações

Leia [LICENSE.md](LICENSE.md) e [PRIVACIDADE.md](PRIVACIDADE.md). Uso pessoal e profissional interno é permitido; distribuição e comercialização exigem autorização. A oferta gratuita e sem anúncios inclui telemetria como parte essencial do modelo de manutenção: os indicadores de uso orientam a continuidade do projeto. Sem eles, o desenvolvimento e os recursos de versões futuras podem ser reduzidos ou encerrados, nos limites legais. A telemetria é obrigatória na distribuição oficial e é explicada antes do aceite durante a instalação. Os dados não são vendidos nem usados para publicidade. Fora de chatgpt.site também informa o domínio. Não há instalação de Docker/VPS pela audiência. O aplicativo apenas comunica-se com o serviço oficial.

O aviso sálvia de atualização permite copiar um pedido curto para o Work. Ele identifica a própria instalação e o repositório, preserva seus dados e exige publicação autorizada. Atualizações futuras não são garantidas.

**Liberado para instalação e uso real, com aceite explícito antes da coleta.** O Work conduz a configuração na sua conta e registra o que conseguiu verificar e qualquer limitação encontrada.

## Para o Work

Leia [AGENTS.md](AGENTS.md) e siga [CONFIGURAR_NO_WORK.md](CONFIGURAR_NO_WORK.md). O aplicativo completo está em `site/`; o manifesto e o verificador conferem a integridade antes da instalação. [Importação](docs/IMPORTACAO.md), [atualizações](docs/ATUALIZACOES.md) e [créditos](CREDITOS.md) complementam a entrega.

**Apresente a pergunta de verdade.** Consulte as ferramentas desta conversa e chame Question ou equivalente conforme seu contrato; mencionar um “quadro acima” não cria opções. Se a ferramenta faltar, falhar ou a pessoa relatar que a pergunta não apareceu, apresente imediatamente a mesma pergunta e duas ou três opções em texto, aceitando resposta natural. Preserve o trabalho e aguarde só a decisão pendente, sem repetir verificações já concluídas. Isso vale desde a escolha de pasta até o aceite e o onboarding; siga o procedimento de perguntas em CONFIGURAR_NO_WORK.md.

**Pasta vinculada antes da execução.** No fluxo no computador, oriente a pessoa a criar/escolher e associar a pasta ao projeto como primeiro pedido. Não prometa criar essa pasta inicial por ela, nem baixe o pacote em uma pasta temporária para antecipar a instalação. Aguarde o vínculo e confira acesso real antes de Sites/download/comandos. O procedimento, as fontes oficiais e a recuperação estão na etapa0 de CONFIGURAR_NO_WORK.md.

**Roteiro em validação.** A conclusão exige conferir o fluxo atualizado e a execução agendada autenticada. O Work verifica as capacidades da conta e informa impedimentos. A instalação começa sem viagens, documentos ou vínculo com outro Site.

A importação pode usar a API autenticada diretamente; se esse acesso não estiver disponível ao Work, ele prepara um arquivo para seleção no painel. No onboarding, o agente oferece uma tarefa opcional na nuvem, identifica fontes conectadas adequadas ou ajuda a conectar uma, como e-mail. Scheduled Tasks depende de acesso à fonte e de leitura/escrita autenticadas na Central, verificados no ambiente agendado; não há tarefa pré-ativada. Sugestões de IA no painel não estão incluídas. A consulta offline abrange o conteúdo já carregado; alterações e novos conteúdos precisam de internet.

A API de automação `/api/sync` vem incluída e desativada até sua configuração. Ao escolher ativar, o Work segue [Sincronização](docs/SINCRONIZACAO.md) e oferece primeiro [plugin e Skills](docs/SKILLS.md) com [prompt curto](docs/PROMPT_SCHEDULED_SKILL.md). Se você não quiser instalar ou faltar suporte, oferece o [prompt completo de fallback](docs/PROMPT_SCHEDULED_TASK.md). O agente preenche o modo escolhido com os dados da sua instalação e sem credenciais no texto. Cada instalação usa identidade e token próprios; o executor obtém a credencial a cada execução. O agente cria pela ferramenta nativa quando disponível ou entrega o prompt pronto para colar diretamente no Scheduled Tasks cloud. O início do acompanhamento fica fixo, e tarefa salva e importação efetivamente verificada são informadas separadamente.

## Telefone e acesso offline

**Instale a Central no celular como PWA. Ela funciona offline** para consultar viagens, reservas, listas e comprovantes já abertos neste aparelho. O assistente deve avisar e ensinar esse recurso no onboarding, mesmo que você adie a instalação ou ainda não tenha reservas. A primeira abertura e as alterações exigem conexão. Veja [instalação e teste em modo avião](docs/PWA.md); mapas offline e download integral da viagem não estão incluídos.
