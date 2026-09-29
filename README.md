# Sua Central de Viagens

O Work também opera o produto por [API do assistente](docs/API_ASSISTENTE.md): viagens, listas, locais, roteiro, reservas, revisões, documentos, capas e convidados. Após configurar a autenticação, consultar `/api/assistant/capabilities`, executar o pedido autorizado e conferir a persistência. Ensinar esse caminho durante o onboarding, sem substituir a prática inicial pela interface.

Seu site de viagens está pronto. O ChatGPT Work instala na sua conta do Sites, ajuda a importar suas reservas e ensina você a usar o painel.

## Como começar

1. Na conta que será dona da Central, confira **Sites** antes da instalação. Se precisar habilitar o plugin, abra **Plugins**, encontre Sites e conclua a ativação disponível. Os menus variam; o Work ajuda a localizar. Após instalar, inicie um novo chat Work para carregar o plugin. [Sites](https://chatgpt.com/sites) é o painel de gerenciamento.
2. Disponibilize esta pasta completa: pelo repositório, pelo ZIP ou pela pasta acessível à conversa. Se o link não permitir ler o código, use o ZIP. Só este README não contém o aplicativo.
3. Peça: `Instale https://github.com/rodrigoebeta/gpt-ccviagens`. O Work lê este README e conduz a instalação. [COMECE_AQUI.md](COMECE_AQUI.md) é a alternativa detalhada.
4. O Work reúne os chats em um projeto e reutiliza sua pasta; se não houver, sugere **Central de Viagens** em Documentos no desktop. Na web, usa fontes acessíveis ao projeto. Instala e publica com acesso restrito após seu aceite, solicitando **centraldeviagem** ao Sites.
5. Entre na Central e crie sua viagem pela interface. Responda às opções clicáveis no chat. Mesmo se adiar o cadastro, o Work continua ensinando importação, documentos, Scheduled Tasks, listas, roteiro e compartilhamento. Começa oferecendo e-mail conectado; arquivos, pastas e nuvem também podem ser usados com acesso autorizado. Gmail não é obrigatório.

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

**Roteiro em validação.** A conclusão exige conferir o fluxo atualizado e a execução agendada autenticada. O Work verifica as capacidades da conta e informa impedimentos. A instalação começa sem viagens, documentos ou vínculo com outro Site.

A importação pode usar a API autenticada diretamente; se esse acesso não estiver disponível ao Work, ele prepara um arquivo para seleção no painel. No onboarding, o agente oferece uma tarefa opcional na nuvem, identifica fontes conectadas adequadas ou ajuda a conectar uma, como e-mail. Scheduled Tasks depende de acesso à fonte e de leitura/escrita autenticadas na Central, verificados no ambiente agendado; não há tarefa pré-ativada. Sugestões de IA no painel e uso completo sem internet não estão incluídos.

A API de automação `/api/sync` vem incluída e desativada até sua configuração. Ao escolher ativar, o Work segue [Sincronização](docs/SINCRONIZACAO.md) e prepara o [prompt completo da tarefa](docs/PROMPT_SCHEDULED_TASK.md), com os dados da sua instalação e sem credenciais no texto. Cada instalação usa identidade e token próprios; o executor obtém a credencial a cada execução. O agente cria pela ferramenta nativa quando disponível ou entrega o prompt pronto para colar diretamente no Scheduled Tasks cloud. O início do acompanhamento fica fixo, e tarefa salva e importação efetivamente verificada são informadas separadamente.
