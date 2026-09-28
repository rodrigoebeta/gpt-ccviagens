# Importação de reservas pelo Work

## Conferência automática de localização

Após importar uma reserva, o painel tenta localizar hospedagens, aeroportos, estações e terminais em segundo plano. A reserva é salva mesmo quando a consulta falha. Resultados ficam guardados para todos os participantes autorizados; alterações no nome/endereço ou destino de referência provocam nova verificação. Reservas ainda sem verificação são conferidas ao abrir a programação. Consultas interrompidas são retomadas; buscas usam o cache e o intervalo de requisições do Photon. Não é necessário abrir o mapa.

A central de pendências fica acima do roteiro e da hospedagem, mesmo com o mapa fechado. Ela reúne revisões dos dados e localizações não confirmadas, cada qual com sua ação. Conferir reserva abre os dados existentes; editores podem corrigi-los. Tentar localizar novamente respeita o intervalo do serviço. Falhas temporárias de conexão são identificadas separadamente e não significam endereço incorreto. Nenhuma pendência altera automaticamente os dados originais.

O aplicativo recebe um JSON por reserva com comprovantes embutidos. O contrato executável está em `site/lib/contracts.ts` (`importInput`); as verificações de limites, deduplicação e autorização estão em `site/lib/service.ts`. Consulte-os antes de preparar o arquivo. Não reconstrua nem invente códigos, bilhetes, dados faltantes ou fontes.

1. Confira a fonte escolhida e o recorte autorizado: conta de e-mail, pasta local, arquivos anexados, armazenamento em nuvem, página ou outra superfície acessível. Verifique as ferramentas disponíveis antes de prometer acesso. Um caminho local informado não torna a pasta acessível ao Work: se necessário, oriente o envio dos arquivos. Gmail é opcional. Pesquise pelas datas do serviço, incluindo o ano, não apenas pelo recebimento ou pela modificação dos arquivos.
2. Leia a confirmação completa e os anexos relevantes. Agrupe trechos/passageiros/comprovantes da mesma reserva, preservando fontes. Não envie mensagens, mova/apague arquivos nem altere a reserva no fornecedor.
3. Prepare `version: 1`, `reservation` e `documents`. `sourceKey` deve identificar de maneira estável a mesma reserva em reimportações. Não gere uma chave diferente por execução. Tipos: `train`, `flight`, `bus`, `hotel`, `activity`.
4. Use datas ISO com ano e horas locais `HH:mm`, sem conversão implícita de fuso. `timezone` e `endTimezone` preservam o contexto. `sources` exige pelo menos uma origem real; escolha a variante da tabela abaixo. Nunca fabrique identificadores nem referências.
5. Em `documents`, inclua nome, rótulo, MIME aceito e base64 dos bytes originais. A API aceita até 20 documentos; confira limites por arquivo/total em `service.ts`. Não use URL temporária no lugar do arquivo, nem screenshot como substituto silencioso de PDF.
6. Valide o JSON com `importInput.safeParse` antes de entregá-lo. Guarde-o em local privado temporário, nunca em `public/`, exemplos ou Git.
7. Sem operação autenticada de escrita disponível ao Work, entregue o JSON privadamente e oriente sua seleção no formulário de importação do painel. Não simule cabeçalhos de identidade no Site hospedado nem desative autenticação.
8. Confira reserva, anexos, recarga e reimportação sem duplicatas. Abra o documento no visualizador; quando precisar conferir integridade, use Baixar explicitamente e compare os bytes com a origem. Se o navegador não permitir, peça a verificação específica da pessoa e identifique esse limite.

Alterações/cancelamentos podem trazer `change.action` e `change.baseFingerprint`, obtido da versão atual do registro. Não adivinhe fingerprint. Propostas conflitantes ou fora do período ficam em Para revisar; ajustes manuais não devem ser apagados silenciosamente. Resolver revisão exige permissão de edição.

## Identificar a origem

Cada entrada em `sources` usa uma destas formas. Todas incluem `subject`, um assunto ou rótulo legível para a conferência.

| Origem | Campos obrigatórios além de `subject` |
| --- | --- |
| Gmail | `provider: "gmail"`, `messageId`: ID real da mensagem, hexadecimal de 10 a 40 caracteres. |
| Arquivo, inclusive de pasta local, anexo ou nuvem | `provider: "file"`, `filename`: nome do arquivo sem caminho absoluto, `sha256`: hash SHA-256 dos bytes originais, em 64 caracteres hexadecimais minúsculos. Calcule o hash; não o invente. |
| Outra fonte acessível | `provider: "external"`, `system`: nome do serviço/superfície, `reference`: ID estável ou URL real da fonte consultada. Não inclua tokens, cookies ou links temporários assinados. |

É possível combinar origens da mesma reserva. Essas referências são privadas na instalação e não entram na telemetria. A identificação registra a proveniência; não comprova por si só a autenticidade do fornecedor.

`sourceKey` identifica a reserva, não a pasta nem a execução. Ao encontrar a mesma reserva em outra superfície, confira o registro existente e reutilize sua chave. Chaves diferentes não são reconciliadas automaticamente. Uma mudança nas fontes de uma reserva existente pode gerar revisão; preserve os dados atuais e siga o fluxo de comparação.

**Não há sincronização automática das fontes com o Site nem agendamento pronto.** O assistente prepara a importação a partir do acesso que possui; o painel não lê pastas, caixas postais ou PDFs avulsos por conta própria. Uma autorização no Work não cria essa integração. Não configure agendamentos como parte desta instalação.

## Visualizar e baixar

PDF, JPEG, PNG, GIF, WebP e TXT abrem no visualizador do painel. PDF/TXT têm páginas; imagens e páginas começam ajustadas à tela. Use zoom, pinça, arraste e Ajustar. Baixar é uma ação separada e entrega os bytes originais. WebP usa MIME image/webp; Word/Excel/PowerPoint, HEIC e TIFF devem ser convertidos para um formato aceito antes da importação, com a pessoa ciente da conversão. Não substituir silenciosamente os originais.


Para os pontos no mapa, preencha `location` com a hospedagem ou origem e `destination` com o local da chegada. Prefira nome completo, cidade e país; não invente endereço nem use somente código de aeroporto quando o documento trouxer o nome. Em hotéis, mantenha o nome do estabelecimento no título. Ônibus usa `kind: "bus"`.
