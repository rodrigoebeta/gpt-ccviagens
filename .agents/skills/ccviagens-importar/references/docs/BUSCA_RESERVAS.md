# Buscar reservas na primeira importação

Este método seleciona candidatos, não autoriza salvar nem comprova que todas as reservas foram encontradas. Leia viagens/destinos/período com ano e permissão atual; descubra fontes/contas, filtros, paginação e originais disponíveis. A pessoa autoriza o escopo de leitura e depois os grupos a importar. Agrupe fontes da mesma reserva, preserve dúvidas e siga IMPORTACAO.md.

## Busca em camadas

Faça buscas menores, independentes e complementares. Não exigir cidade + mês + confirmação + anexo simultaneamente; uma confirmação pode conter só localizador e link. Adapte operadores ao conector; a sintaxe de Gmail não é universal.

| Pista | Como usar e conferir |
|---|---|
| Cidades/regiões | Destinos cadastrados, nomes oficiais, grafias PT/EN/locais, variantes com/sem acentos, cidades de origem/conexão e aeroportos/estações. Expandir só com evidência ou referência geográfica confiável; não inventar códigos IATA. |
| País | Nome PT/EN/local verificado, combinado com sinais de reserva quando necessário. País é pista ampla, não prova de destino nem filtro obrigatório; pode aparecer apenas no endereço do fornecedor. |
| Mês e datas do serviço | Nomes/abreviações PT/EN e formatos dia/mês, mês/dia ou ISO com ano. Abranger todos os meses da viagem, inclusive virada de ano; comparar as datas originais antes de associar. Buscar no corpo/assunto/nome do anexo, não só por data de recebimento. |
| Confirmações PT | confirmação, reserva, reservado, comprovante, voucher, bilhete, passagem, ingresso, itinerário, hospedagem, check-in, localizador, número de reserva. |
| Confirmações EN | booking, reservation, confirmation, confirmed, itinerary, e-ticket, ticket, voucher, receipt, accommodation, check-in, booking reference, PNR. |
| Categoria | hotel/apartamento, voo/flight, trem/train/rail, ônibus/bus/coach, ferry, rental/car hire, transfer/shuttle, tour/activity/event. Combinar conforme o tipo e idioma; não confundir publicidade com compra. |
| Fornecedores/remetentes | Hotéis, operadores, intermediários e domínios realmente encontrados. Ampliar pelo nome do estabelecimento e pelo remetente; domínio/assunto sozinho não comprova reserva. |
| Referências e versões | Localizador, número de reserva/bilhete e assunto de candidatos encontrados; buscar mensagens da conversa e referências relacionadas, incluindo encaminhamentos. Ler cada mensagem, não tratar conversa inteira como uma única versão. |
| Arquivos | Nome/MIME de PDF, imagens, passbook/itinerário e outros anexos realmente disponíveis. Procurar corpo e nome do arquivo, inclusive mensagem sem a cidade no assunto. Formatos não aceitos exigem conversão informada; não renomear extensão para simular suporte. |
| Mudanças e cancelamentos | alteração, remarcação, cancelamento, reembolso; changed, updated, rescheduled, cancelled/canceled, refund. Conferir cronologia/versão confiável antes de propor salvar. |

Comece pelos destinos e sinais de reserva, amplie por referências/fornecedores e confronte os meses/datas do serviço. Não filtrar a primeira importação apenas por mensagens recebidas nos meses da viagem: compras podem ocorrer muito antes. Use um período de recebimento anterior só quando autorizado e com seu limite explicado; não examinar indiscriminadamente toda a caixa sem escopo. Datas numéricas ambíguas não definem país/formato; falta de ano precisa de evidência complementar.

Exemplo de sintaxe **apenas se o conector aceitar a pesquisa Gmail**: `(reservation OR booking OR confirmação OR reserva) ("[cidade confirmada]" OR "[país confirmado]")`. Substitua pistas por valores reais e execute também buscas complementares sem localização, por fornecedor/referência/anexos. `after:`/`before:` filtram mensagens, não datas dos serviços. Use `has:attachment` ou `filename:pdf` apenas em uma passagem complementar, pois reservas sem anexo também são válidas. Não mostrar consultas com placeholders como tarefas concluídas.

## Conferir e apresentar

- Percorra páginas; reduza leituras com metadados, depois leia candidatos e anexos originais. Se houver truncamento sem paginação, declare cobertura parcial e peça somente ajuste necessário do recorte.
- Confira viagem/período/ano, viajantes quando presentes, estabelecimentos, segmentos e estado final confirmado. Mês/destino isolados são insuficientes; excluir marketing e compras não relacionadas. Preservar trechos intermediários comprovados e viagens sobrepostas como dúvida, sem associação arbitrária.
- Agrupe por reserva real, referências, serviço e datas, com todas as fontes úteis. Um localizador comum pode conter vários trechos; não colapsar voos diferentes. Não gerar nova sourceKey para reencontro da mesma reserva; chaves diferentes não são reconciliadas automaticamente pelo servidor.
- Mostre os grupos e ambiguidades com dados mínimos necessários, peça autorização de escrita e monte o JSON pelo contrato atual. Buscar é diferente de importar. Confira persistência, anexos, versões e localizações após salvar.

## Acompanhamento posterior

Primeira importação histórica e acompanhamento desde T0 são autorizações distintas. O incremental reutiliza destinos/fornecedores atuais e pesquisa itens novos/alterados da fonte entre T0 fixo e início do run; a data do serviço continua definindo a viagem. Não reutilizar o filtro de meses da viagem como filtro de recebimento. Siga a Skill ccviagens-importar, SINCRONIZACAO.md e PROMPT_SCHEDULED_TASK.md; sem persistência comprovada, não pressupor JSON de controle/cursor entre execuções.
