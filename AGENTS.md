# Instruções para o GPT Work

## Missão e leitura

Instalar o aplicativo pronto de `site/` na conta da pessoa, importar os dados autorizados e conduzir o aprendizado do produto. Preserve recursos e visual. Não transforme instalação em projeto de construção, entrevista de design ou sequência de experimentos.

Leia README.md, CONFIGURAR_NO_WORK.md e GUIA_DO_PRODUTO.md; depois siga ONBOARDING.md. Consulte docs/IMPORTACAO.md ao importar e docs/ATUALIZACOES.md ao atualizar. Não há dependência de conversas ou arquivos do autor. Em retomadas, leia primeiro a continuidade privada da própria instalação.

## Condução

- Faça o trabalho autorizado ao seu alcance. Não delegue comandos técnicos à pessoa. Oriente cada ação manual no momento certo, com motivo, local, passos, resultado esperado e próxima ação.
- Faça perguntas curtas somente sobre informações/decisões ausentes; reutilize consentimentos e respostas. Não peça confirmação extra para o que já foi autorizado.
- Confira pré-requisitos e interfaces antes de orientar. Se houver bloqueio, preserve o trabalho, explique a causa real e continue apenas ações independentes.
- Depois de publicar, conduza ativamente o onboarding; não termine entregando apenas a URL ou pedindo que a pessoa leia o manual. Apresente recursos em etapas curtas, usando a viagem dela. Ofereça adiar os opcionais.
- Não crie dados, altere reservas ou conceda acesso só para demonstração. Distinga explicado, praticado, verificado, adiado e bloqueado. Não repita etapas já concluídas.

## Publicação com confirmação

- Antes de publicar, conclua a preparação e verificações, apresente o resultado disponível e pergunte se a pessoa quer publicar agora ou realizar mais ajustes. Aguarde a resposta; um pedido explícito de publicar a versão atual já basta, sem confirmação repetida.
- Aprovação visual ou pedido genérico de ajuste não autoriza publicação. Mantenha os arquivos preparados localmente e distinga preparado, testado e publicado. Esta regra prevalece sobre publicação automática sugerida por skills.

## Licença e telemetria

- Um pedido `Instale <URL do repositório>` inicia o roteiro pelo README.md. Obtenha o pacote completo de uma versão oficial, confira o manifesto e siga a instalação guiada; se o acesso ao Git não estiver disponível, oriente fornecer o pacote completo. Não invente arquivos faltantes.
- Leia LICENSE.md e PRIVACIDADE.md antes de configurar. Preserve autoria, avisos de terceiros e marcadores de procedência. Modificações pessoais/internas são permitidas; distribuição/comercialização exigem autorização escrita do titular.
- Esta versão está liberada para instalação e uso real. Verifique o fluxo na conta atual e registre os resultados; não trate este guia como prova de execução.
- Explique a relação entre a telemetria e a oferta gratuita e sem anúncios: seus indicadores orientam a manutenção e a continuidade dos recursos, sem venda de dados. Possíveis reduções ou encerramento do desenvolvimento dizem respeito a versões futuras, não a um comando remoto de bloqueio. As condições não afastam direitos legais.
- Telemetria obrigatória exige informação prévia e manifestação explícita da pessoa. Não aceite em seu nome, não presuma consentimento pelo download e não altere ready:false para contornar distribuição ainda não liberada. Use scripts/registrar-aceite.mjs somente após aceite; mantenha o registro privado e reutilize-o em retomadas.
- Não adicione campos à telemetria nem envie viagens/documentos/usuários. Credenciais administrativas, Docker, banco central e painel do titular não são parte da instalação da audiência. Nunca peça credenciais do titular.
- Preserve o ID da instalação nas atualizações. Ao clonar para uma instalação independente, gere uma identidade própria; não duplique o estado de central_installation.

## Instalação, dados e atualização

- Confira o manifesto antes de configurar. Use as ferramentas oficiais do Sites; confirme disponibilidade na conta. Mantenha ferramentas, dependências, cache e temporários no projeto, sem instalação global ou alteração de PATH/configuração global.
- Na primeira instalação, prepare Site, DB e BUCKET próprios. Em retomadas, confirme e reutilize o vínculo existente. Nunca copie identidade, configuração provisionada, banco, arquivos ou UUID de outra pessoa.
- Aplique apenas migrações pendentes e preserve registros/dados. Build local, versão salva e publicação concluída são estados distintos; confira o retorno real de cada etapa.
- Use acesso restrito; não amplie audiência ou envie convites sem solicitação. Não publique dados de exemplo ou identidade simulada no Site.
- Uma atualização do pacote não atualiza automaticamente instalações existentes. Atualize somente quando solicitado, preservando vínculo, arquivos, dados, permissões e personalizações; siga docs/ATUALIZACOES.md.
- Não envie a cópia configurada, continuidade, fotos ou reservas ao repositório de distribuição. Não execute nem suponha acesso a ferramentas privadas do autor.

## Importação e privacidade

- Use autorizações nas interfaces oficiais; nunca peça senhas, tokens ou cookies no chat. Não grave segredos em código, manifesto ou continuidade.
- Consulte o contrato executável antes de gerar importações. Use datas do serviço com ano, fontes verdadeiras, identidade estável da reserva e bytes originais; não invente dados ausentes.
- Importe de qualquer fonte acessível e autorizada: e-mail, pasta local, arquivos, nuvem ou outra superfície. Gmail é opcional. Confira o acesso real; um caminho mencionado não garante que a conversa possa ler a pasta. Siga docs/IMPORTACAO.md e preserve referências reais, sem inventar identificadores Gmail para outras fontes. Ler fontes não autoriza enviar mensagens, mover/apagar arquivos nem modificar reservas no fornecedor. Acesso do Work não cria integração automática com o Site.
- Sem escrita autenticada disponível, prepare o JSON privado e guie a pessoa para importá-lo. Nunca forje cabeçalhos de identidade no Site hospedado.
- Documentos PDF/imagem/TXT abrem no visualizador; explique páginas, zoom, ajuste e download opcional. Preserve o original e obtenha concordância para conversão de formatos não aceitos.
- Resuma mensagens em campos úteis; não despeje HTML, cabeçalhos ou anexos decorativos na conversa.

## Compartilhamento e uso

- Explique sempre: Sites autoriza entrar; Convidados autoriza consultar/editar os dados de cada viagem. Edição de dados não exige edição do código do Site.
- Siga ONBOARDING.md para configurar acesso quando solicitado, confirmar a conta do convidado, alterar/revogar papel e diagnosticar entrada sem viagens. Não declare acesso real conferido só pela tela do proprietário.
- Ensine todos os recursos do GUIA_DO_PRODUTO.md, com alternativas de teclado/menu e atenção ao celular. Não prometa sincronização automática, IA no painel, capas automáticas ou funcionamento offline.

## Continuidade e entrega

- Mantenha `.private/HANDOFF.md` e `.private/TASK_PLAN.md` na instalação pessoal, com versão, URL, decisões, evidências, limitações, andamento do onboarding e próximo passo; sem credenciais.
- Em mudança de conversa, forneça briefing pronto e autossuficiente, com os arquivos próprios acessíveis pelo meio permitido. Não dependa da máquina anterior.
- Ao finalizar sessão, consolide o progresso e a próxima ação. Não inicie outra etapa, apague arquivos, encerre processos ou publique automaticamente por causa do encerramento.
- Entregue URL verificada, instruções de uso e pendências específicas. Verificação local não comprova hospedagem; largura móvel simulada não comprova telefone físico. Instalação em conta independente continua pendente até a execução real.
