# Instalação no telefone e consulta offline

No onboarding, entregar link clicável e a URL HTTPS completa confirmada desta Central em um bloco de código para copiar no celular. Nunca apenas “sua Central”, endereço do painel Sites ou placeholder. Colocar passos e limites antes e terminar com a ação necessária em negrito, por exemplo abrir pelo novo ícone e confirmar no chat.

A Central pode funcionar como aplicativo instalado, em uma janela própria. A primeira abertura, o login e a preparação dos arquivos precisam de internet. Essa preparação inclui fontes e recursos do leitor de PDF, mesmo os usados apenas em páginas posteriores. O Site continua privado.

## Orientação obrigatória no onboarding

O assistente deve avisar no onboarding, após o primeiro login: instale a Central no celular como PWA para abri-la como aplicativo; ela funciona offline para consultar viagens e comprovantes já carregados nesse aparelho. Ensine a instalação e o preparo, não apenas entregue um link. A pessoa pode adiar a prática; a explicação é obrigatória. Registre separadamente instalação, preparo e teste em modo avião.

## Instalar

1. Abra a URL publicada diretamente no Chrome do Android e entre com a conta autorizada. Evite o navegador interno de outro aplicativo.
2. Aguarde as viagens carregarem. Se o navegador oferecer **Instalar aplicativo** no rodapé da Central, toque nesse botão e confirme a instalação. Também é possível usar a opção de instalação no menu do Chrome; o nome varia conforme a versão.
3. No iPhone, abra no Safari e use **Compartilhar → Adicionar à Tela de Início**. Quando houver a opção, mantenha **Abrir como App** ativada.
4. Abra pelo novo ícone e confira se a Central aparece em sua própria janela. Um atalho antigo pode precisar ser substituído pela instalação nova.

O botão da Central só aparece quando o navegador disponibiliza a instalação. A ausência do botão, sozinha, não comprova falha: o app pode já estar instalado ou o navegador usar apenas seu menu próprio.

## Preparar a consulta sem internet

Com conexão, abra as viagens, a programação e as listas que pretende consultar. Abra também cada comprovante necessário e aguarde sua visualização. A lista de documentos salva o nome dos arquivos; somente abrir o arquivo guarda seus bytes neste aparelho. Não existe download automático da viagem inteira.

Antes de sair, faça o teste no aparelho: feche a Central, ative o modo avião e reabra pelo ícone. Confira uma viagem, o roteiro e um PDF já aberto. A faixa **Você está offline** identifica a consulta das cópias locais. Um conteúdo ainda não armazenado informa que precisa de conexão.

O aplicativo guarda sua estrutura, fontes e código, as consultas de viagens/reservas/listas/programação/localizações, capas e fotos próprias carregadas e comprovantes abertos. Esses dados podem estar desatualizados. Edição, importação, upload, compartilhamento, pesquisa e sincronização precisam de conexão; não há fila de alterações para envio posterior. Um envio interrompido pode ter chegado ao servidor: reconecte-se e confira antes de repetir.

O fundo dos mapas, fotos externas e links de rotas dependem dos serviços externos e de seus caches normais. Não há download de mapas nem promessa de mapas offline. Pontos, endereços e horários presentes nas consultas salvas continuam disponíveis.

## Dados neste aparelho

As cópias pertencem ao navegador e à conta usada na instalação. Sair da conta remove as cópias de viagens e documentos. Uma troca de conta detectada também limpa essas cópias; abas antigas deixam de consultar os dados da conta anterior. A estrutura do aplicativo pode permanecer em cache, sem reservas ou comprovantes.

Uma revogação feita em outro dispositivo só pode ser detectada quando este aparelho volta a se comunicar com o servidor. Recusas de acesso não são substituídas por dados antigos. As cópias offline não são um cofre criptografado nem substituem a proteção do telefone. Em aparelho compartilhado, saia da conta e remova os dados do site nas configurações do navegador.

O navegador pode remover arquivos por falta de espaço, limpeza de dados ou navegação privada. A Central limita a quantidade de respostas locais e informa falhas de armazenamento; não promete retenção permanente. Confira os comprovantes antes de depender do modo avião. Para cópias independentes do navegador, use o download explícito dos documentos.

## Se aparecer apenas “criar atalho”

O agente deve conferir a versão publicada, a única referência ao manifesto com `crossorigin="use-credentials"`, a resposta autenticada JSON do manifesto, os ícones PNG de 192 e 512 pixels e `/sw.js` servido como JavaScript. Não tornar o Site público, remover autenticação ou colocar credenciais no manifesto para resolver a instalação. Se o app informar que não conseguiu preparar o acesso offline, confira a conexão e o espaço disponível e reabra com internet.

Uma atualização nova do aplicativo aguarda as abas antigas fecharem para substituir o worker. Reabra com internet depois disso e confirme novamente o modo avião. Se o problema persistir, registre navegador, versão, sistema, tipo de acesso e resposta dos recursos; teste o Site publicado no telefone. Testes locais não substituem esse aceite.

Na condução pelo Work, o agente prepara e verifica os recursos publicados; a pessoa confirma a instalação e o teste em modo avião no próprio aparelho. Registre separadamente instalado, conteúdo consultado, offline verificado ou prática adiada. Adiar essa prática não encerra as demais etapas de onboarding.
