# Telemetria e privacidade da distribuição

Versão 2026-09-27.1. Responsável: **Rodrigo Purchio**. Contato para dúvidas, permissões e exercício de direitos: **contato@rodrigoebeta.com**.

**Rascunho: não distribuir como instalação pronta.** Repositório oficial, endereço do receptor, acesso entre instalações e base legal ainda precisam ser definidos/validados. A coleta permanece desativada no código até a conclusão dessa preparação. Infraestrutura de hospedagem não representa certificação automática de conformidade com a LGPD.

## Finalidades e dados

A telemetria obrigatória da distribuição serve para medir adoção e atividade, orientar a continuidade e qualidade do desenvolvimento, acompanhar versões e identificar instalações externas para conferência do licenciamento. Não determina automaticamente que exista exploração comercial ou violação.

O servidor da instalação envia: identificador aleatório persistente da instalação, versão do produto, versão dos termos, momento do aceite e indicação de domínio chatgpt.site ou externo. Somente no segundo caso envia o hostname público, sem caminho, parâmetros, credenciais ou conteúdo de páginas. O receptor registra primeiro e último contato. O sinal ocorre no máximo uma vez a cada 24 horas de uso informado; tentativas após falhas usam intervalo mínimo de 15 minutos. A instalação no computador local não é reportada.

Não são incluídos nomes de viajantes, e-mails de usuários, viagens, destinos, reservas, comprovantes ou conteúdo digitado. O identificador é pseudônimo: não prometemos anonimato absoluto, pois um domínio pode identificar seu responsável. O identificador de credencial gerado localmente autentica contatos posteriores da mesma instalação e é armazenado como hash no receptor.

## Acesso, infraestrutura e retenção

Os registros não são vendidos nem usados para publicidade. O painel administrativo e sua API são restritos ao responsável configurado. O receptor e o banco de telemetria ficam na infraestrutura privada do responsável (VPS/container). O painel privado no Sites consulta esses registros pelo servidor; a chave privada que assina consultas nunca é entregue ao navegador ou à audiência. Fornecedores da infraestrutura podem processar dados e metadados técnicos conforme seus contratos e políticas; a aplicação não grava IP ou cabeçalhos completos na base de telemetria. Identificadores e domínios são cifrados nos registros do receptor; horários de contato, categoria de hospedagem e contagens permanecem metadados legíveis para agregação. Backups completos usam criptografia própria. Isso não impede acesso por administradores da infraestrutura ou pelo processo autorizado. A configuração e retenção de logs da plataforma devem ser verificadas antes da ativação.

Proposta implementada de retenção: registros identificáveis são removidos após **180 dias sem contato**, na limpeza horária do serviço ou na próxima recepção ou consulta administrativa. Não há promessa de exclusão automática de backups/logs dos fornecedores sem conferir suas políticas. O painel informa explicitamente que o total corresponde aos registros retidos. Pedidos de acesso, correção e exclusão são tratados pelo contato indicado, com verificação proporcional da solicitação; não envie senhas ou documentos de viagem.

## Aceite e ativação

O assistente apresenta os termos antes de configurar a coleta e solicita manifestação explícita. A pessoa pode recusar e encerrar a instalação. O registro do aceite contratual não autoriza qualquer tratamento: a base legal aplicável, as informações sobre operadores/transferências e os procedimentos para exercício de direitos devem ser revisados antes da distribuição. Não declarar a solução "LGPD aprovada".

## Atualizações

A consulta da última versão é uma operação separada da recepção de atividade, ainda que ocorra na mesma rotina. O aviso não instala código nem dá acesso remoto à sua conta. As atualizações são conduzidas pelo seu assistente, preservando dados, permissões e personalizações, com publicação autorizada. A consulta pode falhar e não representa garantia de manutenção futura.

Uma falha temporária no envio não impede o uso da Central. O serviço não contém comando de bloqueio remoto. Instalações que removam ou bloqueiem o mecanismo podem não aparecer nas métricas; os números não representam uma contagem certificada de todas as cópias existentes.


