# Sua Central de Viagens

Seu site de viagens está pronto. O ChatGPT Work instala na sua conta do Sites, ajuda a importar suas reservas e ensina você a usar o painel.

## Como começar

1. Abra uma conversa no ChatGPT Work na conta que será dona da central.
2. Disponibilize esta pasta completa: pelo repositório, pelo ZIP ou pela pasta acessível à conversa. Se o link não permitir ler o código, use o ZIP. Só este README não contém o aplicativo.
3. Peça: `Instale https://github.com/rodrigoebeta/gpt-ccviagens`. O Work lê este README e conduz a instalação. [COMECE_AQUI.md](COMECE_AQUI.md) é a alternativa detalhada.
4. Siga as orientações do Work para autorizar o Sites, entrar no painel e cadastrar sua primeira viagem. A conexão com Gmail é pedida somente na hora de importar reservas.

Você não precisa programar, escolher um design ou executar comandos. Também não precisa de uma chave do Google Maps ou de IA. Autorizações acontecem nas interfaces oficiais; nunca envie senhas, tokens ou cookies na conversa.

## O que você poderá usar

- Viagens com capa própria e programação diária de reservas e lugares.
- Listas personalizadas, mapa, busca de lugares e marcação de visitados.
- Ordem do dia por arraste e ajustes manuais nas reservas.
- Documentos privados com visualização, páginas e zoom dentro do painel.
- Compartilhamento por viagem, com acesso para visualizar ou editar.

O Work conduz o [onboarding](ONBOARDING.md) usando sua viagem. O [guia do produto](GUIA_DO_PRODUTO.md) fica disponível para consulta depois.

## Licença, telemetria e atualizações

Leia [LICENSE.md](LICENSE.md) e [PRIVACIDADE.md](PRIVACIDADE.md). Uso pessoal e profissional interno é permitido; distribuição e comercialização exigem autorização. A telemetria é obrigatória na distribuição oficial e é explicada antes do aceite. Fora de chatgpt.site também informa o domínio. Não há instalação de Docker/VPS pela audiência. O aplicativo apenas comunica-se com o serviço oficial.

O aviso sálvia de atualização permite copiar um pedido curto para o Work. Ele identifica a própria instalação e o repositório, preserva seus dados e exige publicação autorizada. Atualizações futuras não são garantidas.

**Entrega em preparação:** repositório oficial definido; validação do receptor, revisão dos termos e ensaio independente pendentes. Não ativar nem enviar telemetria enquanto `ready` estiver falso na configuração de distribuição.

## Para o Work

Leia [AGENTS.md](AGENTS.md) e siga [CONFIGURAR_NO_WORK.md](CONFIGURAR_NO_WORK.md). O aplicativo completo está em `site/`; o manifesto e o verificador conferem a integridade antes da instalação. [Importação](docs/IMPORTACAO.md), [atualizações](docs/ATUALIZACOES.md) e [créditos](CREDITOS.md) complementam a entrega.

**Instalação em conta independente ainda em validação.** O pacote contém o produto, mas o fluxo completo em outra conta ainda precisa ser confirmado. O Work deve verificar a disponibilidade do Sites na sua conta e informar qualquer impedimento. A instalação começa sem viagens, documentos ou vínculo com outro Site.

A importação atual usa um arquivo preparado pelo Work e carregado no painel autenticado. Sincronização automática do Gmail, sugestões de IA no painel e uso completo sem internet não estão incluídos.
