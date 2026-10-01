# Telemetria e privacidade da distribuição

Versão 2026-10-01.1. Responsável: **Rodrigo Purchio**. Contato para dúvidas, permissões e exercício de direitos: **contato@rodrigoebeta.com**.

## Por que esta oferta inclui telemetria

A Central de Viagens é disponibilizada gratuitamente pelo titular e sem anúncios no aplicativo. A telemetria é parte essencial do modelo adotado para viabilizar sua existência e continuidade: os indicadores de uso permitem avaliar a adoção, priorizar correções e decidir quais recursos podem continuar recebendo manutenção. Os dados não são vendidos nem usados para publicidade.

Essa oferta inclui telemetria obrigatória, informada antes da instalação, e está condicionada aos termos de LICENSE.md, a este aviso e à legislação aplicável. Sem esses indicadores, ou se não houver condições de manter o projeto, o desenvolvimento poderá ser reduzido ou encerrado e funções poderão ser alteradas ou retiradas de versões futuras, observados os direitos aplicáveis e a comunicação de mudanças materiais. A regra de confirmação técnica limita alterações conforme descrito em Aceite e ativação, preservando a consulta aos dados.

## Finalidades e dados

A telemetria obrigatória da distribuição serve para medir adoção e atividade, orientar a continuidade e qualidade do desenvolvimento, acompanhar versões e identificar instalações externas para conferência do licenciamento. Não determina automaticamente que exista exploração comercial ou violação.

O servidor da instalação envia: identificador aleatório persistente da instalação, versão do produto, versão dos termos, momento do aceite e indicação de domínio chatgpt.site ou externo. Somente no segundo caso envia o hostname público, sem caminho, parâmetros, credenciais ou conteúdo de páginas. O receptor registra primeiro e último contato. O sinal ocorre no máximo uma vez a cada 24 horas de uso informado; tentativas após falhas usam intervalo mínimo de 15 minutos. A instalação no computador local não é reportada.

Não são incluídos nomes de viajantes, e-mails de usuários, viagens, destinos, reservas, comprovantes ou conteúdo digitado. O identificador é pseudônimo: não prometemos anonimato absoluto, pois um domínio pode identificar seu responsável. O identificador de credencial gerado localmente autentica contatos posteriores da mesma instalação e é armazenado como hash no receptor.

## Acesso, infraestrutura e retenção

Os registros não são vendidos nem usados para publicidade. O painel administrativo e sua API são restritos ao responsável configurado. O receptor e o banco de telemetria ficam na infraestrutura privada do responsável (VPS/container). O painel privado no Sites consulta esses registros pelo servidor; a chave privada que assina consultas nunca é entregue ao navegador ou à audiência. Fornecedores da infraestrutura podem processar dados e metadados técnicos conforme seus contratos e políticas; a aplicação não grava IP ou cabeçalhos completos na base de telemetria. Identificadores e domínios são cifrados nos registros do receptor; horários de contato, categoria de hospedagem e contagens permanecem metadados legíveis para agregação. Backups completos usam criptografia própria. Isso não impede acesso por administradores da infraestrutura ou pelo processo autorizado. A configuração e retenção de logs da plataforma devem ser verificadas antes da ativação.

Proposta implementada de retenção: registros identificáveis são removidos após **180 dias sem contato**, na limpeza horária do serviço ou na próxima recepção ou consulta administrativa. Não há promessa de exclusão automática de backups/logs dos fornecedores sem conferir suas políticas. O painel informa explicitamente que o total corresponde aos registros retidos. Pedidos de acesso, correção e exclusão são tratados pelo contato indicado, com verificação proporcional da solicitação; não envie senhas ou documentos de viagem.

## Aceite e ativação

A ativação exige aceite explícito e primeiro contato confirmado pelo receptor. O aceite não se repete no uso normal: contatos automáticos durante o uso renovam a confirmação, normalmente a cada 24 horas. Após sete dias sem confirmação válida, a instalação impede alterações e importações, inclusive pelas APIs assistant/sync, e mantém consulta a viagens e comprovantes. O contato confirmado restabelece as alterações automaticamente. Uma falha de rede não comprova descumprimento. Novos avisos de versão dependem da telemetria confirmada; não há instalação automática de código.

Nas instalações atualizadas, o proprietário pode aceitar a nova versão dos termos no aviso do painel. O registro privado guarda versão e horário; não envia identidade pessoal. Uma instalação com aceite antigo não é convertida silenciosamente para termos materialmente diferentes.

As condições são apresentadas dentro da Central depois do login; o assistente somente orienta a abertura do aplicativo, sem explicação prévia da telemetria ou pedido de aceite no chat. O proprietário pode ler os documentos completos, marcar a opção explícita e ativar pessoalmente. A versão e o momento dessa ação ficam no banco da própria instalação. O assistente não solicita aceite no chat nem o registra por script, configuração ou chamada de API em nome da pessoa. Download e pedido inicial de instalação não equivalem a aceitar os termos. Sem aceite, não há coleta; a Central permanece em modo de consulta e preserva dados existentes.

O aceite se refere às condições da oferta e às finalidades descritas, não a uma autorização genérica para qualquer uso de dados. Ele não dispensa o responsável de adotar uma base legal apropriada para cada tratamento de dados pessoais e de cumprir os deveres de transparência e os direitos previstos na legislação aplicável. A gratuidade não afasta esses deveres. Você pode exercer seus direitos pelo contato acima, inclusive revogar consentimento quando essa for a base legal do tratamento. O exercício desses direitos não implica sua renúncia a outras proteções legais.

Mudanças materiais nas finalidades, nos dados coletados ou nas condições da oferta serão informadas antes de sua adoção, com novo aceite quando necessário. Este aviso não autoriza coleta retroativa nem ampliação silenciosa da telemetria.

## Atualizações

O servidor da Central só consulta o anúncio no receptor depois de um envio de telemetria confirmado. Usa a identidade aleatória e a credencial da própria instalação, sem enviá-las ao navegador, em URL ou ao GitHub. O receptor confere registro, credencial, versão dos termos e contato nos últimos sete dias antes de entregar a versão. O receptor lê o anúncio oficial no GitHub sem encaminhar dados ou credenciais da instalação. A consulta não instala código nem dá acesso remoto à conta.

O arquivo público release.json fica congelado no último aviso de transição da versão 0.4.0. Versões antigas só incorporam a regra quando forem atualizadas; versões alteradas podem remover as verificações locais. O código público ainda permite conferir versões manualmente, sem garantia de avisos ou manutenção permanente. Instalações que removam ou bloqueiem o mecanismo podem não aparecer nas métricas; os números não representam uma contagem certificada de todas as cópias existentes.



## Cópias locais para consulta offline

O navegador pode armazenar neste aparelho consultas de viagens, reservas, listas, localizações, capas/fotos próprias e comprovantes abertos, além dos arquivos que executam o aplicativo. Essas cópias permitem consulta offline e não são enviadas à telemetria. Não incluem credenciais de automação. Sair da conta ou detectar troca de conta remove as cópias pessoais; uma revogação feita em outro aparelho só pode ser detectada com conexão. O armazenamento do navegador não é um cofre criptografado e pode ser removido por falta de espaço ou limpeza. Em aparelho compartilhado, saia da conta e remova os dados do site. Veja docs/PWA.md.
