import {readFile,mkdir,writeFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
const root=fileURLToPath(new URL('../',import.meta.url));
const config=await readFile(path.join(root,'site/lib/distribution-config.ts'),'utf8');
if(!/ready:\s*true/.test(config))throw Error('Distribuição ainda não liberada. Não registrar aceite nem ativar telemetria. Consulte o responsável.');
if(!process.argv.includes('--aceite-explicito-confirmado'))throw Error('Apresente LICENSE.md e PRIVACIDADE.md e obtenha a manifestação explícita da pessoa antes de executar.');
const version=/termsVersion:\s*'([^']+)'/.exec(config)?.[1];if(!version)throw Error('Versão dos termos ausente.');
const target=path.join(root,'.private','aceite.json');
let previous;try{previous=JSON.parse(await readFile(target,'utf8'));}catch(e){if(e.code!=='ENOENT')throw e;}
if(previous?.termsVersion===version){console.log('Aceite desta versão já registrado. Reutilize-o; não repita a pergunta.');process.exit(0);}
const acceptedAt=new Date().toISOString();
await mkdir(path.dirname(target),{recursive:true});
await writeFile(target,JSON.stringify({termsVersion:version,acceptedAt,scope:'instalação própria; aceite manifestado pela pessoa'},null,2)+'\n');
console.log(`Aceite registrado privadamente. Configure no ambiente hospedado: CENTRAL_TERMS_VERSION=${version} e CENTRAL_TERMS_ACCEPTED_AT=${acceptedAt}. Esses campos não são credenciais. Preserve o registro em atualizações.`);
