# Telemetria e privacidade da distribuição

Versão 2026-09-27.3. Responsável: **Rodrigo Purchio**. Contato para dúvidas, permissões e exercício de direitos: **contato@rodrigoebeta.com**.

## Por que esta oferta inclui telemetria

A Central de Viagens é disponibilizada gratuitamente pelo titular e sem anúncios no aplicativo. A telemetria é parte essencial do modelo adotado para viabilizar sua existência e continuidade: os indicadores de uso permitem avaliar a adoção, priorizar correções e decidir quais recursos podem continuar recebendo manutenção. Os dados não são vendidos nem usados para publicidade.

Essa oferta inclui telemetria obrigatória, informada antes da instalação, e está condicionada aos termos de LICENSE.md, a este aviso e à legislação aplicável. Sem esses indicadores, ou se não houver condições de manter o projeto, o desenvolvimento poderá ser reduzido ou encerrado e funções poderão ser alteradas ou retiradas de versões futuras, observados os direitos aplicáveis e a comunicação de mudanças materiais. Isso não é um mecanismo de bloqueio remoto nem de retirada automática de funções da sua cópia.

## Finalidades e dados

A telemetria obrigatória da distribuição serve para medir adoção e atividade, orientar a continuidade e qualidade do desenvolvimento, acompanhar versões e identificar instalações externas para conferência do licenciamento. Não determina automaticamente que exista exploração comercial ou violação.

O servidor da instalação envia: identificador aleatório persistente da instalação, versão do produto, versão dos termos, momento do aceite e indicação de domínio chatgpt.site ou externo. Somente no segundo caso envia o hostname público, sem caminho, parâmetros, credenciais ou conteúdo de páginas. O receptor registra primeiro e último contato. O sinal ocorre no máximo uma vez a cada 24 horas de uso informado; tentativas após falhas usam intervalo mínimo de 15 minutos. A instalação no computador local não é reportada.

Não são incluídos nomes de viajantes, e-mails de usuários, viagens, destinos, reservas, comprovantes ou conteúdo digitado. O identificador é pseudônimo: não prometemos anonimato absoluto, pois um domínio pode identificar seu responsável. O identificador de credencial gerado localmente autentica contatos posteriores da mesma instalação e é armazenado como hash no receptor.

## Acesso, infraestrutura e retenção

Os registros não são vendidos nem usados para publicidade. O painel administrativo e sua API são restritos ao responsável configurado. O receptor e o banco de telemetria ficam na infraestrutura privada do responsável (VPS/container). O painel privado no Sites consulta esses registros pelo servidor; a chave privada que assina consultas nunca é entregue ao navegador ou à audiência. Fornecedores da infraestrutura podem processar dados e metadados técnicos conforme seus contratos e políticas; a aplicação não grava IP ou cabeçalhos completos na base de telemetria. Identificadores e domínios são cifrados nos registros do receptor; horários de contato, categoria de hospedagem e contagens permanecem metadados legíveis para agregação. Backups completos usam criptografia própria. Isso não impede acesso por administradores da infraestrutura ou pelo processo autorizado. A configuração e retenção de logs da plataforma devem ser verificadas antes da ativação.

Proposta implementada de retenção: registros identificáveis são removidos após **180 dias sem contato**, na limpeza horária do serviço ou na próxima recepção ou consulta administrativa. Não há promessa de exclusão automática de backups/logs dos fornecedores sem conferir suas políticas. O painel informa explicitamente que o total corresponde aos registros retidos. Pedidos de acesso, correção e exclusão são tratados pelo contato indicado, com verificação proporcional da solicitação; não envie senhas ou documentos de viagem.

## Aceite e ativação

O assistente apresenta estes termos, as finalidades, os dados coletados e as consequências da recusa antes de configurar a coleta. Ao confirmar que deseja prosseguir com a instalação após receber e aceitar essas informações, você concorda com as condições da oferta. A confirmação deve ser explícita e registrada; baixar o código ou pedir inicialmente para instalá-lo não equivale a aceitar informações que ainda não foram apresentadas. O assistente não pode aceitar em seu nome. Se você não concordar, a instalação é encerrada antes de ativar a coleta.

O aceite se refere às condições da oferta e às finalidades descritas, não a uma autorização genérica para qualquer uso de dados. Ele não dispensa o responsável de adotar uma base legal apropriada para cada tratamento de dados pessoais e de cumprir os deveres de transparência e os direitos previstos na legislação aplicável. A gratuidade não afasta esses deveres. Você pode exercer seus direitos pelo contato acima, inclusive revogar consentimento quando essa for a base legal do tratamento. O exercício desses direitos não implica sua renúncia a outras proteções legais.

Mudanças materiais nas finalidades, nos dados coletados ou nas condições da oferta serão informadas antes de sua adoção, com novo aceite quando necessário. Este aviso não autoriza coleta retroativa nem ampliação silenciosa da telemetria.

## Atualizações

A consulta da última versão é uma operação separada da recepção de atividade, ainda que ocorra na mesma rotina. O servidor da Central obtém o arquivo público `release.json` do repositório oficial pelo domínio `raw.githubusercontent.com`, operado pelo GitHub. Essa requisição não inclui identificador, domínio, credencial da instalação ou dados de viagens; parte do servidor, não do navegador da pessoa. O provedor pode processar metadados técnicos de rede, como o IP de saída do servidor, conforme suas políticas. O aviso não instala código nem dá acesso remoto à sua conta. As atualizações são conduzidas pelo seu assistente, preservando dados, permissões e personalizações, com publicação autorizada. A consulta pode falhar e não representa garantia de manutenção futura.

Uma falha temporária no envio não impede o uso da Central. O serviço não contém comando de bloqueio remoto. Instalações que removam ou bloqueiem o mecanismo podem não aparecer nas métricas; os números não representam uma contagem certificada de todas as cópias existentes.


