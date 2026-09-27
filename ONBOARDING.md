# Onboarding guiado pelo Work

## Localizações e pendências

Após importar uma reserva, o painel tenta localizar hospedagens, aeroportos, estações e terminais em segundo plano. A reserva é salva mesmo quando a consulta falha. Resultados ficam guardados para todos os participantes autorizados; alterações no nome/endereço ou destino de referência provocam nova verificação. Reservas antigas são verificadas ao abrir a programação. Consultas interrompidas são retomadas; buscas usam o cache e o intervalo de requisições do Photon. Não é necessário abrir o mapa.

A central de pendências fica acima do roteiro e da hospedagem, mesmo com o mapa fechado. Ela reúne revisões dos dados e localizações não confirmadas, cada qual com sua ação. Conferir reserva abre os dados existentes; editores podem corrigi-los. Tentar localizar novamente respeita o intervalo do serviço. Falhas temporárias de conexão são identificadas separadamente e não significam endereço incorreto. Nenhuma pendência altera automaticamente os dados originais.

Use este roteiro depois de concluir a instalação. A pessoa aprende usando sua própria central; você conduz a conversa e executa o que ela já autorizou. Leia [GUIA_DO_PRODUTO.md](GUIA_DO_PRODUTO.md) para conhecer os recursos antes de ensinar.

## Como conduzir

Apresente uma etapa curta de cada vez: objetivo, ação disponível e resultado. Quando depender da pessoa, diga onde clicar, por que e o que deverá aparecer. Confira a interface atual antes de nomear controles. Não despeje esta tabela inteira na conversa nem delegue comandos técnicos à pessoa.

Use dados reais autorizados. Não cadastre exemplos, altere reservas, marque visitados ou convide alguém apenas para demonstrar. Se a pessoa quiser aprender sem modificar dados, explique na tela e registre como apresentado, sem alegar que foi exercitado. Recursos opcionais podem ser pulados; registre para não perguntar novamente.

## Primeiros passos e passeio pelo produto

| Etapa | Trabalho do Work e ação da pessoa quando necessária | Conclusão e recuperação |
| --- | --- | --- |
| 1. Entrar | Entregue a URL publicada e ajude a concluir o login oficial. Mostre Viagens, Programação e Documentos da Viagem. | Confirme a conta correta e o acesso restrito. Se falhar, confira URL atual e sessão antes de alterar configurações. |
| 2. Criar a primeira viagem | Peça apenas nome, período com ano e destinos ainda ausentes. Cadastre pela sessão autenticada, ou guie a pessoa no formulário. Mostre como selecionar outra viagem e abrir Detalhes e convidados. | Confira os dados após recarregar. Se não persistirem, retome o diagnóstico de banco/migrações; não peça que cadastre repetidamente. |
| 3. Importar reservas | Quando houver reservas para importar, confira Gmail e recorte autorizado. Prepare o arquivo seguindo docs/IMPORTACAO.md. Se necessário, oriente Documentos da Viagem → Importar reserva → selecionar o arquivo privado preparado. | Confira uma reserva, suas datas, passageiros e documentos após recarga. Valide reimportação sem duplicata. Sem Gmail ou fonte compatível, explique o limite e siga com lugares; não invente dados. |
| 4. Ver documentos | Abra um comprovante disponível e mostre páginas, ajuste à tela, zoom, pinça no celular e Baixar como ação opcional. | O clique deve abrir o visualizador. Se falhar, confira formato/sessão e tente novamente; o original continua disponível para download. Não baixe cópias repetidas para ensinar. |
| 5. Guardar ideias | Mostre Queremos visitar, renomear e criar listas. Ajude a guardar um lugar escolhido pela pessoa usando busca ou nome/link. Explique lista, dia ou ambos. | Confira lista e localização. Se a busca falhar, use cadastro manual; não escolha um estabelecimento apenas pela semelhança do nome. |
| 6. Montar o dia | Selecione uma data; mostre faixa semanal e calendário. Programe um lugar escolhido usando Incluir no dia, ou adicione diretamente ao dia sem lista. Explique arrastar da lista no computador. | Lugar e reservas aparecem no Roteiro. Confira a data; não crie cópia do lugar para fazer a inclusão. |
| 7. Ordenar e acompanhar | Mostre arraste de todos os itens, alternativa pelo menu e teclado. Explique que horários existentes são referências e não mudam ao ordenar. Mostre visitado na lista/Roteiro e o mapa do dia: números para lugares, ícones para hospedagem durante toda a estadia e transportes na partida/chegada. Explique os pontos não localizados e como conferir o endereço da reserva. | Ao fazer uma mudança solicitada, confira após recarga. Visitado é o mesmo estado nos dois locais e sai do mapa. Em conflito, atualize antes de tentar novamente. |
| 8. Ajustar reservas e revisar | Mostre onde editar uma reserva e ajustar horários, incluindo check-in/out, sem reimportação. Apresente Para revisar; só resolva uma pendência real conforme a decisão da pessoa. | Explique que mudar a central não altera o fornecedor. Confira ajustes salvos; não crie um conflito para demonstrar a revisão. |
| 9. Personalizar, opcional | Ofereça capa própria da viagem, imagem inicial da conta e fotos de lugares. Diferencie as duas capas. Sugestões de fotos exigem conferência do local. | Se escolhida, confira imagem e recarga e mostre como retornar ao padrão. Falha de envio não impede o uso da central. |
| 10. Entender compartilhamento | Explique sempre as duas permissões descritas abaixo. Só execute o convite se solicitado. | A pessoa conhece a diferença entre entrada no Site, leitura/edição de dados e edição do código. Registre o compartilhamento como adiado quando não for desejado. |
| 11. Usar no celular, opcional | Oriente abrir a URL no telefone. Se desejar, ajude a adicionar à tela inicial pelo menu do navegador. Mostre navegação inferior, dia atual e controles de zoom no documento. | Peça retorno sobre login, navegação e pinça; distinga relato de teste observado. Um atalho não habilita funcionamento offline. |
| 12. Continuar usando | Recapitule apenas o que foi apresentado, o que a pessoa praticou e o que ficou adiado. Entregue URL e acesso ao guia. Explique como pedir novas importações e atualizações. | Registre o próximo passo concreto. Se a pessoa interromper o passeio, retome da etapa pendente, sem reinstalar ou repetir consentimentos. |

## Compartilhar uma viagem

Primeiro explique: **Sites permite entrar; Convidados permite acessar os dados de uma viagem e define se a pessoa pode editá-los.** Ambos precisam estar configurados. Não é necessário dar acesso de edição ao código do Site.

Quando solicitado, obtenha viagem, e-mail da conta e papel desejado. Pelo fluxo oficial do Sites, confira/libere a entrada. No painel, com a conta proprietária, abra a viagem → **Detalhes e convidados → Convidados**, informe o mesmo e-mail e escolha **Pode visualizar** ou **Pode editar**. Oriente a pessoa a salvar se a interação depender dela. O formulário do aplicativo não envia e-mail.

Confira as duas listas de acesso. Peça que o convidado entre com a conta autorizada e confirme a viagem. A tela do proprietário não comprova o acesso do convidado. Se ele entra mas não vê os dados, confira e-mail e autorização por viagem; se não entra, confira compartilhamento do Sites e login. Não torne o Site público para resolver.

Para mudar o papel, salve o mesmo e-mail com outra permissão; para revogar os dados da viagem, use Remover. Revogar a entrada no Sites é uma ação separada.

## Continuidade pessoal

Em `.private/HANDOFF.md`, registre URL, versão instalada, etapas apresentadas/praticadas/adiadas, evidências, limitações e próxima ação; em `.private/TASK_PLAN.md`, mantenha as pendências. Não guarde senhas, cookies ou conteúdo integral de e-mails. Ao mudar de conversa, forneça um briefing pronto com esses dados e disponibilize os arquivos da própria instalação pelo meio permitido, sem depender da máquina anterior.

O passeio está concluído quando a central está acessível, a pessoa consegue continuar sua viagem e cada recurso foi apresentado ou explicitamente adiado. Não bloqueie o uso porque não há convidados, fotos ou reservas disponíveis para demonstrar.

## Corrigir uma viagem

Mostre **Detalhes e convidados → Editar viagem**. A pessoa pode ajustar nome, datas e destinos sem recriar nada; proprietários e editores têm essa opção. Explique que mudar o período não remarca reservas ou lugares. Se algum item ficar fora, o painel pede para manter o intervalo ou ajustar os itens primeiro. Para transferir o roteiro para outro período, amplie o intervalo para incluir as duas datas, ajuste os itens e depois reduza. Confira o resultado salvo e a programação; não altere reservas com fornecedores por esse fluxo.

## Confirmar destinos e buscar por proximidade

Em Nova viagem ou Editar viagem, demonstre a busca de um destino e a seleção da cidade/região correta pelo estado e país. Preserve destinos antigos até confirmação ou remoção solicitada. Ao adicionar um lugar ao dia, explique a preferência por hospedagem, roteiro e destinos; confira a indicação de proximidade ou o aviso de que não foi possível localizar a hospedagem. Mostre como desativar o contexto para buscar outro local. Não prometa catálogo completo ou distância por trajeto.

Ao mudar o período, mostre o aviso amarelo com os itens afetados: nenhuma reserva será apagada, e o período incompatível não é salvo. Corrija a programação ou mantenha suas datas incluídas antes de salvar.

## Atualizações e privacidade

Mostre ao proprietário o acesso permanente a LICENSE.md e PRIVACIDADE.md pelo guia da instalação. Explique a faixa sálvia: ela só aparece quando uma versão mais recente foi confirmada. O modal copia o pedido com a URL da Central e do repositório; não é necessário memorizar comandos. Não simule uma atualização real na instalação da pessoa apenas para ensinar. Registre como apresentado se não houver versão nova.
