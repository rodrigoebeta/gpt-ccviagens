# Atualizações sem perder sua configuração

O pacote público é mantido junto do produto. Cada versão leva código, instruções e manifesto de hashes. Isso não atualiza automaticamente uma central já instalada.

## Pelo aviso do aplicativo

Quando houver versão nova confirmada, o proprietário vê uma faixa sálvia acima da navegação. Clique em Ver atualização e copie o pedido no modal. Ele inclui o endereço da sua instalação e o repositório oficial, para funcionar mesmo em outra conversa do Work. O assistente lê o README e este guia, obtém a release oficial e conduz os passos abaixo. O aviso não instala código automaticamente. É possível ocultá-lo durante a visita.

O servidor da Central consulta `release.json` no repositório público oficial, separadamente do envio de atividade. O anúncio acompanha o pacote na mesma publicação do repositório. Com a instalação ativada e os termos aceitos, a consulta ocorre durante o uso, normalmente uma vez a cada 24 horas; não é uma notificação imediata. Uma falha no envio de telemetria não impede a tentativa de consultar versões. O GitHub recebe a consulta ao arquivo público, sem identificador, domínio ou credencial da instalação. Nenhum acesso à infraestrutura do titular é necessário para atualizar a Central.

Sem aviso, pode-se pedir a conferência manual da versão. Não trate ausência do aviso como garantia de estar atualizado. Não existe garantia de manutenção permanente.

Para atualizar sua instalação, forneça a nova versão completa ao Work e peça: “Atualize minha central existente usando este pacote, preservando meu Site, acesso, viagens, comprovantes e capa. Leia docs/ATUALIZACOES.md antes de alterar.”

O Work deve:

1. Conferir o manifesto da nova cópia limpa, a versão instalada e o Site vinculado na cópia pessoal. Registrar adaptações próprias que precisam ser preservadas.
2. Preparar versão de retorno da fonte e conferir uma estratégia de recuperação dos dados antes de migrações. Reverter código não desfaz mudanças no banco.
3. Incorporar as diferenças de código numa cópia de trabalho; preservar `.openai/hosting.json`, banco, bucket, segredos, permissões, UUID Photon, identidade/credencial em central_installation, aceite, dados e arquivos privados. Nunca copiar estado de exemplo ou de outra pessoa por cima desses dados.
4. Instalar pelo lockfile, executar a conferência de tipos/build e verificar os fluxos afetados na instalação. Aplicar apenas migrações pendentes pelo fluxo oficial. Se houver alteração incompatível ou potencial perda de dados, preparar a solução e explicar o impacto antes de prosseguir.
5. O pedido de atualizar a instalação inclui publicar a atualização verificada no mesmo Site, salvo restrição expressa de apenas preparar. Informe o resultado e publique sem entrevista de design nem pergunta repetida de publicação. Respeite aprovações obrigatórias do ambiente e decisões sobre impactos incompatíveis. Confira URL, acesso restrito, dados anteriores e funções alteradas; registre evidências. Não amplie audiência.

Atualizar o repositório público não autoriza enviar os dados da instalação ao GitHub. A pasta configurada não deve ser redistribuída como se fosse o template limpo. O verificador de distribuição é executado antes da configuração; depois dela, hashes/arquivos extras podem mudar legitimamente.
