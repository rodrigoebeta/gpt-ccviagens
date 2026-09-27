# Aplicativo da Central de Viagens

Esta pasta contém o produto pronto em TypeScript/React, executado no Sites com Vinext, banco D1 e arquivos R2. O GPT Work instala seguindo [CONFIGURAR_NO_WORK.md](../CONFIGURAR_NO_WORK.md); a pessoa começa por [COMECE_AQUI.md](../COMECE_AQUI.md).

O pacote inclui código, lockfile, recursos visuais, visualizador PDF, licenças, scripts de instalação/build e as oito migrações do banco. Não contém viagens ou vínculo com outra instalação.

`node scripts/preparar-local.mjs` prepara a configuração neutra sem sobrescrever uma existente. A instalação usa `npm run install:ci`; a conferência usa `node node_modules/typescript/bin/tsc --noEmit` e `npm run build`. Configuração, perfis do ambiente, migrações e publicação são responsabilidade do Work, conforme o roteiro da raiz.
