# Instruções para o GPT Work

## Missão e leitura

Instalar o aplicativo pronto de `site/` na conta da pessoa, importar os dados autorizados e conduzir o aprendizado do produto. Preserve recursos e visual. Não transforme instalação em projeto de construção, entrevista de design ou sequência de experimentos.

Leia README.md, CONFIGURAR_NO_WORK.md e GUIA_DO_PRODUTO.md; depois siga ONBOARDING.md. Consulte docs/IMPORTACAO.md ao importar e docs/ATUALIZACOES.md ao atualizar. Não há dependência de conversas ou arquivos do autor. Em retomadas, leia primeiro a continuidade privada da própria instalação.

## Condução

- Faça o trabalho autorizado ao seu alcance. Não delegue comandos técnicos à pessoa. Oriente cada ação manual no momento certo, com motivo, local, passos, resultado esperado e próxima ação.
- Use a ferramenta de perguntas (Question, ou equivalente disponível) em todas as rodadas: escolhas simples e confirmações de etapas devem ter opções clicáveis, em português, com resposta livre opcional. Faça uma pergunta curta por vez, com duas ou três opções. Texto livre somente quando uma informação não puder ser inferida ou escolhida; nesse caso também use Question. Não peça que a pessoa digite “sim”, números ou comandos. Se a ferramenta não existir nessa conversa, explique a limitação uma vez e use a alternativa mais curta disponível, sem simular botões. Reutilize consentimentos e respostas; opção pré-selecionada e silêncio não são confirmação.
- Confira pré-requisitos e interfaces antes de orientar. Se houver bloqueio, preserve o trabalho, explique a causa real e continue apenas ações independentes.
- Depois de publicar, conduza ativamente ONBOARDING.md até explicar compartilhamento nas duas camadas, criação da viagem pela própria pessoa na Central, fontes/importação de reservas e documentos, Scheduled Tasks e inclusão de locais em listas/roteiros. Não termine só com a URL, nem porque a pessoa adiou criar a viagem ou não encontrou reservas. Adiar a prática não pula a explicação nem as próximas rodadas. Uma pausa explícita da pessoa deve ser respeitada e registrada para retomada.
- Não crie dados, altere reservas ou conceda acesso só para demonstração. Distinga explicado, praticado, verificado, adiado e bloqueado. Não repita etapas já concluídas.

## Publicação da instalação pronta

- O pedido de instalar esta Central inclui configurar e publicar o produto fornecido, com acesso restrito, após o aceite informado dos termos. Execute verificações e publicação sem a pergunta “publicar agora ou fazer mais ajustes?”. Não abra escolhas de design, recursos ou arquitetura. Respeite pedidos expressos de apenas preparar e aprovações obrigatórias do ambiente; não tente contorná-las.
- Atualizações solicitadas para a instalação existente seguem docs/ATUALIZACOES.md, preservando dados e audiência. Nada se atualiza sozinho. Distinga preparado, testado e publicado.

## Licença e telemetria

- Um pedido `Instale <URL do repositório>` inicia pelo README.md e pela verificação de Sites em CONFIGURAR_NO_WORK.md, antes de configuração/build. Se Sites precisar ser habilitado, oriente a ação da pessoa e ofereça “SIM, ativei o Sites” / “Não encontrei essa opção”; confirme a ferramenta no chat de execução. Após instalar o plugin, oriente novo chat conforme a documentação oficial, com briefing pronto e retomada no mesmo projeto. Não prometa ativação ou botão de continuação inexistentes. Obtenha o pacote completo de uma versão oficial e confira o manifesto; não invente arquivos faltantes.
- Leia LICENSE.md e PRIVACIDADE.md antes de configurar. Preserve autoria, avisos de terceiros e marcadores de procedência. Modificações pessoais/internas são permitidas; distribuição/comercialização exigem autorização escrita do titular.
- Esta versão está liberada para instalação e uso real. Verifique o fluxo na conta atual e registre os resultados; não trate este guia como prova de execução.
- Explique a relação entre a telemetria e a oferta gratuita e sem anúncios: seus indicadores orientam a manutenção e a continuidade dos recursos, sem venda de dados. Possíveis reduções ou encerramento do desenvolvimento dizem respeito a versões futuras, não a um comando remoto de bloqueio. As condições não afastam direitos legais.
- Telemetria obrigatória exige informação prévia e manifestação explícita da pessoa. Não aceite em seu nome, não presuma consentimento pelo download e não altere ready:false para contornar distribuição ainda não liberada. Use scripts/registrar-aceite.mjs somente após aceite; mantenha o registro privado e reutilize-o em retomadas.
- Não adicione campos à telemetria nem envie viagens/documentos/usuários. Credenciais administrativas, Docker, banco central e painel do titular não são parte da instalação da audiência. Nunca peça credenciais do titular.
- Preserve o ID da instalação nas atualizações. Ao clonar para uma instalação independente, gere uma identidade própria; não duplique o estado de central_installation.

## Instalação, dados e atualização

- Confira o manifesto antes de configurar. Use as ferramentas oficiais do Sites; confirme disponibilidade na conta. Mantenha ferramentas, dependências, cache e temporários no projeto, sem instalação global ou alteração de PATH/configuração global.
- Reutilize projeto/pasta já selecionados. Caso não existam, ofereça um projeto “Central de Viagens” e a pasta de mesmo nome em Documentos. Com acesso local autorizado, o agente cria a pasta e clona o repositório; a pessoa cria/vincula o projeto no Work quando não houver ferramenta oficial para isso. Confirme por Question e verifique a associação. Na web, use projeto com fontes acessíveis; uma pasta local não fica acessível só por ser mencionada. Siga a etapa de projeto em CONFIGURAR_NO_WORK.md.
- Na primeira instalação, solicite o slug `centraldeviagem` ao Sites e prepare Site, DB e BUCKET próprios. Use a URL retornada pelo serviço, sem deduzir o identificador da conta. Se o nome estiver indisponível, ofereça alternativas por Question. Em retomadas, reutilize o vínculo existente; não renomeie uma instalação existente para impor o padrão. Nunca copie identidade, configuração provisionada, banco, arquivos ou UUID de outra pessoa.
- Aplique apenas migrações pendentes e preserve registros/dados. Build local, versão salva e publicação concluída são estados distintos; confira o retorno real de cada etapa.
- Use acesso restrito; não amplie audiência ou envie convites sem solicitação. Não publique dados de exemplo ou identidade simulada no Site.
- Uma atualização do pacote não atualiza automaticamente instalações existentes. Atualize somente quando solicitado, preservando vínculo, arquivos, dados, permissões e personalizações; siga docs/ATUALIZACOES.md.
- Não envie a cópia configurada, continuidade, fotos ou reservas ao repositório de distribuição. Não execute nem suponha acesso a ferramentas privadas do autor.

## Importação e privacidade

- Use autorizações nas interfaces oficiais; nunca peça senhas, tokens ou cookies no chat. Não grave segredos em código, manifesto ou continuidade.
- Consulte o contrato executável antes de gerar importações. Use datas do serviço com ano, fontes verdadeiras, identidade estável da reserva e bytes originais; não invente dados ausentes.
- Importe de qualquer fonte acessível e autorizada: e-mail, pasta local, arquivos, nuvem ou outra superfície. Gmail é opcional. Confira o acesso real; um caminho mencionado não garante que a conversa possa ler a pasta. Siga docs/IMPORTACAO.md e preserve referências reais, sem inventar identificadores Gmail para outras fontes. Ler fontes não autoriza enviar mensagens, mover/apagar arquivos nem modificar reservas no fornecedor. Acesso do Work não cria integração automática com o Site.
- Sem escrita autenticada disponível, prepare o JSON privado e guie a pessoa para importá-lo. Nunca forje cabeçalhos de identidade no Site hospedado.
- A primeira viagem é cadastrada pela pessoa em Viagens → Nova viagem. Não solicite seus campos no chat para cadastrá-la pelo agente. Ofereça “SIM, criei pela Central” / “Quero criar depois” / “Preciso de ajuda” e prossiga para as opções de importação em todos os caminhos.
- Antes de perguntar sobre a fonte, verifique quais ferramentas de e-mail estão conectadas, sem ler conteúdo só para testar conexão. Sugira o e-mail conectado com a autorização de busca e o recorte. Sem conexão, ofereça conectar e-mail, fornecer arquivos ou conhecer o fluxo. Não confunda plugin disponível no catálogo com conta conectada.
- Explique sempre Scheduled Tasks, mas só crie após a escolha explícita da pessoa e a verificação das capacidades necessárias. A busca recorrente atende somente viagens já cadastradas e autorizadas, pelas datas reais dos serviços dentro do período dessas viagens. Nunca cria viagens; sem viagem elegível, não pesquisa a caixa postal. Confira viagem atual, duplicatas, anexos e escrita autenticada a cada execução; veja docs/IMPORTACAO.md para teste, recuperação e alternativa assistida. Não chame preparação de arquivo de importação automática.
- Documentos PDF/imagem/TXT abrem no visualizador; explique páginas, zoom, ajuste e download opcional. Preserve o original e obtenha concordância para conversão de formatos não aceitos.
- Resuma mensagens em campos úteis; não despeje HTML, cabeçalhos ou anexos decorativos na conversa.

## Compartilhamento e uso

- Explique sempre: Sites autoriza entrar; Convidados autoriza consultar/editar os dados de cada viagem. Edição de dados não exige edição do código do Site.
- Antes de encerrar a instalação, entregue o link https://chatgpt.com/sites para o compartilhamento do Site e a URL real da Central com o caminho Viagens → Detalhes e convidados → Convidados. Só use links mais específicos quando verificados; não invente URL que abre um modal.
- Siga ONBOARDING.md para configurar acesso quando solicitado, confirmar a conta do convidado, alterar/revogar papel e diagnosticar entrada sem viagens. Não declare acesso real conferido só pela tela do proprietário.
- Ensine todos os recursos do GUIA_DO_PRODUTO.md, com alternativas de teclado/menu e atenção ao celular. Não prometa sincronização automática, IA no painel, capas automáticas ou funcionamento offline.

## Continuidade e entrega

- Mantenha `.private/HANDOFF.md` e `.private/TASK_PLAN.md` na instalação pessoal, com versão, URL, decisões, evidências, limitações, andamento do onboarding e próximo passo; sem credenciais.
- Em mudança de conversa, forneça briefing pronto e autossuficiente, com os arquivos próprios acessíveis pelo meio permitido. Não dependa da máquina anterior.
- Ao finalizar sessão, consolide o progresso e a próxima ação. Não inicie outra etapa, apague arquivos, encerre processos ou publique automaticamente por causa do encerramento.
- Entregue URL verificada, instruções de uso e pendências específicas. Verificação local não comprova hospedagem; largura móvel simulada não comprova telefone físico. Instalação em conta independente continua pendente até a execução real.
