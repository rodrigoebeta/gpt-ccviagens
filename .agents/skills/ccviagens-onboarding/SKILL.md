---
name: ccviagens-onboarding
description: Instalar a Central de Viagens pronta na conta da pessoa e conduzir seu primeiro uso, preservando escolhas e práticas adiadas.
---

# Conduzir a instalação e o primeiro uso

Instale o aplicativo fornecido, preserve recursos/visual e reutilize projeto, Site, aceite e decisões verificados. Não reconstruir nem entrevistar sobre design. Esta Skill não concede ferramentas, acesso a pastas ou consentimento.

## Começar e retomar

Antes de executar no computador, a própria pessoa cria/escolhe a pasta e a associa ao projeto como principal. Oriente Editar projeto → Adicionar pasta → Tornar principal quando esses controles existirem; verifique acesso pelo contexto/ferramentas. Um caminho escrito não vincula a pasta. Sem vínculo, esse é o primeiro pedido, antes de Sites, download ou comandos. Reutilize vínculo válido. Projeto exclusivamente cloud usa fontes acessíveis ali, sem prometer acesso ao computador.

Leia somente o recurso necessário à etapa:
- Instalação, ferramentas, verificações e publicação privada autorizada: [CONFIGURAR_NO_WORK.md](references/CONFIGURAR_NO_WORK.md).
- Para orientar a abertura da Central: [LICENSE.md](references/LICENSE.md) e [PRIVACIDADE.md](references/PRIVACIDADE.md); não aceitar em nome da pessoa.
- Depois da publicação: siga uma etapa de [ONBOARDING.md](references/ONBOARDING.md) por rodada. Consulte [GUIA_DO_PRODUTO.md](references/GUIA_DO_PRODUTO.md) apenas para o recurso apresentado.
- Celular: [PWA.md](references/docs/PWA.md).
- Importação: [IMPORTACAO.md](references/docs/IMPORTACAO.md). Use ccviagens-importar se disponível; sem ela, o guia mantém o fluxo completo.
- Preparar a tarefa: [SKILLS.md](references/docs/SKILLS.md) e [SINCRONIZACAO.md](references/docs/SINCRONIZACAO.md). Oferecer primeiro plugin + Skill + [prompt curto](references/docs/PROMPT_SCHEDULED_SKILL.md); entregar ccviagens-plugin.zip do pacote verificado para Plugins no ChatGPT → Adicionar → Enviar arquivo compactado do plugin, sem exigir submissão pública. Verificar instalação, seleção e referências cloud após escolha. Se a pessoa não quiser instalar ou faltar suporte, oferecer [prompt integral](references/docs/PROMPT_SCHEDULED_TASK.md) autossuficiente como fallback. Reutilizar decisões e agenda existentes.

Os recursos acompanham a mesma versão do pacote; não dependem de arquivos do autor nem de buscar main a cada etapa. Ao retomar, leia a continuidade privada da instalação e confirme ferramentas atuais. Não repetir escolhas ou consentimentos.

## Manter o fluxo claro

Faça o trabalho autorizado. Peça somente a ação ou informação indispensável da pessoa. Use a ferramenta real de perguntas com escolhas curtas; emissão não comprova resposta. Se faltar/falhar ou a pessoa não vir a pergunta, apresente a mesma pergunta/opções em texto e aceite resposta natural. Silêncio, tempo ou opção preselecionada não autorizam.

**Toda mensagem ao usuário neste fluxo termina com uma única instrução concreta em negrito**, indicando onde agir e como confirmar no chat. Primeiro explique/mostre o que importa; por último dê a ação. Não colocar compartilhamento, nota técnica, link, resumo ou despedida depois dela. Quando aguardar uma escolha clicável, terminar com “**Selecione uma das opções para continuarmos.**”. Sem ferramenta, solicitar a resposta natural em negrito. Nunca terminar apenas com “quando quiser”, “me avise” ou “aguardo”.

Depois de publicar, entregue link clicável e a URL HTTPS completa confirmada pelo Sites em um bloco de código para copiar. Ao orientar o celular, repita a URL completa da própria instalação em bloco de código; não entregar apenas texto “sua Central”, URL do painel Sites, domínio do autor ou placeholder. Feche com a ação da etapa: abrir/entrar e confirmar; instalar pelo navegador/novo ícone e confirmar; ou escolher adiar. Explique compartilhamento na rodada apropriada, preservando a última instrução de login.

Adiar viagem, importação ou prática no celular não encerra as explicações. Cubra PWA/offline, duas camadas de compartilhamento, viagem criada pela pessoa, fontes/importação, documentos, acompanhamento agendado e locais/listas/roteiro. Registre apresentado, praticado, verificado, adiado ou bloqueado. Telefone, modo avião e execução cloud exigem evidência própria; uma explicação ou teste local não os comprova.

Guarde estado e próxima ação na continuidade privada acessível ao projeto, sem segredos. Para trocar de chat, entregue briefing preenchido e solicite a próxima ação em negrito no fim. Preserve dados e não criar exemplos na instalação real.

### Confirmação de telemetria

Consultar CONFIGURAR_NO_WORK e PRIVACIDADE da mesma versão antes de publicar. O aceite é feito exclusivamente pelo proprietário dentro da Central, após o primeiro login: abrir o aviso de ativação, ler os termos e a privacidade, marcar a opção e ativar. O agente orienta somente a abertura da Central; os termos e a privacidade são lidos no aplicativo. Não apresenta uma explicação prévia da telemetria nem solicita aceite pelo chat, não marca a opção, não chama a API de aceite, não registra consentimento por script, variável de ambiente ou alteração direta do banco. A publicação inicial pode ocorrer antes do aceite, em modo de consulta e sem coleta. Só depois da ação pessoal e da confirmação do receptor são liberadas alterações e importações. Convidados não aceitam pela instalação. Um aceite já registrado no aplicativo é preservado em retomadas; novo aceite só é solicitado no aplicativo quando os termos mudarem materialmente. configured:true indica configuração/aceite; writable:true indica primeiro contato confirmado e confirmação técnica válida por sete dias. Conferir após primeiro login HTTPS. O aceite é único por versão material dos termos; renovações são automáticas. Não habilitar alterações nem declarar instalação ativada sem essa prova. Preservar consulta e orientar recuperação em falha.
