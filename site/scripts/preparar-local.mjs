import { copyFile, mkdir, readFile, constants } from 'node:fs/promises';
const root = new URL('../', import.meta.url);
await mkdir(new URL('.sites-runtime/tmp/', root), { recursive: true });
await mkdir(new URL('.sites-runtime/npm-cache/', root), { recursive: true });
const target = new URL('.openai/hosting.json', root);
try {
  await copyFile(new URL('.openai/hosting.example.json', root), target, constants.COPYFILE_EXCL);
  console.log('Configuração local criada sem vínculo com Site. Provisionar pelo fluxo oficial.');
} catch (e) {
  if (e.code !== 'EEXIST') throw e;
  const existing = JSON.parse(await readFile(target, 'utf8'));
  if (existing.d1 !== 'DB' || existing.r2 !== 'BUCKET') throw Error('Bindings existentes diferentes; reconciliar sem sobrescrever.');
  console.log('Configuração existente preservada.');
}
