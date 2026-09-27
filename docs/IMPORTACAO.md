# Importação de reservas pelo Work

## Conferência automática de localização

Após importar uma reserva, o painel tenta localizar hospedagens, aeroportos, estações e terminais em segundo plano. A reserva é salva mesmo quando a consulta falha. Resultados ficam guardados para todos os participantes autorizados; alterações no nome/endereço ou destino de referência provocam nova verificação. Reservas antigas são verificadas ao abrir a programação. Consultas interrompidas são retomadas; buscas usam o cache e o intervalo de requisições do Photon. Não é necessário abrir o mapa.

A central de pendências fica acima do roteiro e da hospedagem, mesmo com o mapa fechado. Ela reúne revisões dos dados e localizações não confirmadas, cada qual com sua ação. Conferir reserva abre os dados existentes; editores podem corrigi-los. Tentar localizar novamente respeita o intervalo do serviço. Falhas temporárias de conexão são identificadas separadamente e não significam endereço incorreto. Nenhuma pendência altera automaticamente os dados originais.

O aplicativo recebe um JSON por reserva com comprovantes embutidos. O contrato executável está em `site/lib/contracts.ts` (`importInput`); as verificações de limites, deduplicação e autorização estão em `site/lib/service.ts`. Consulte-os antes de preparar o arquivo. Não reconstrua nem invente códigos, bilhetes, dados faltantes ou fontes.

1. Confira conta Gmail e recorte autorizado. Pesquise pelas datas do serviço, incluindo o ano, não apenas pelo recebimento das mensagens.
2. Leia a confirmação completa e os anexos relevantes. Agrupe trechos/passageiros/comprovantes da mesma reserva, preservando fontes. Não envie e-mails nem altere a reserva no fornecedor.
3. Prepare `version: 1`, `reservation` e `documents`. `sourceKey` deve identificar de maneira estável a mesma reserva em reimportações. Não gere uma chave diferente por execução. Tipos: `train`, `flight`, `bus`, `hotel`, `activity`.
4. Use datas ISO com ano e horas locais `HH:mm`, sem conversão implícita de fuso. `timezone` e `endTimezone` preservam o contexto. `sources` exige pelo menos uma origem Gmail com `messageId` real em hexadecimal e assunto. Não fabrique esse identificador para uma fonte diferente: suporte a outros provedores é uma limitação do contrato atual.
5. Em `documents`, inclua nome, rótulo, MIME aceito e base64 dos bytes originais. A API aceita até 20 documentos; confira limites por arquivo/total em `service.ts`. Não use URL temporária no lugar do arquivo, nem screenshot como substituto silencioso de PDF.
6. Valide o JSON com `importInput.safeParse` antes de entregá-lo. Guarde-o em local privado temporário, nunca em `public/`, exemplos ou Git.
7. Sem operação autenticada de escrita disponível ao Work, entregue o JSON privadamente e oriente sua seleção no formulário de importação do painel. Não simule cabeçalhos de identidade no Site hospedado nem desative autenticação.
8. Confira reserva, anexos, recarga e reimportação sem duplicatas. Abra o documento no visualizador; quando precisar conferir integridade, use Baixar explicitamente e compare os bytes com a origem. Se o navegador não permitir, peça a verificação específica da pessoa e identifique esse limite.

Alterações/cancelamentos podem trazer `change.action` e `change.baseFingerprint`, obtido da versão atual do registro. Não adivinhe fingerprint. Propostas conflitantes ou fora do período ficam em Para revisar; ajustes manuais não devem ser apagados silenciosamente. Resolver revisão exige permissão de edição.

**Ainda não há sincronização automática Gmail→Site nem agendamento pronto.** Uma autorização Gmail do Work não cria essa integração. Não configure agendamentos como parte desta instalação.

## Visualizar e baixar

PDF, JPEG, PNG, GIF, WebP e TXT abrem no visualizador do painel. PDF/TXT têm páginas; imagens e páginas começam ajustadas à tela. Use zoom, pinça, arraste e Ajustar. Baixar é uma ação separada e entrega os bytes originais. WebP usa MIME image/webp; Word/Excel/PowerPoint, HEIC e TIFF devem ser convertidos para um formato aceito antes da importação, com a pessoa ciente da conversão. Não substituir silenciosamente os originais.


Para os pontos no mapa, preencha `location` com a hospedagem ou origem e `destination` com o local da chegada. Prefira nome completo, cidade e país; não invente endereço nem use somente código de aeroporto quando o documento trouxer o nome. Em hotéis, mantenha o nome do estabelecimento no título. Ônibus usa `kind: "bus"`. Categorias antigas não são reclassificadas automaticamente.
