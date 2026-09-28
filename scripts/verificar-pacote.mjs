import { readFile, readdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const root = fileURLToPath(new URL('../', import.meta.url));
const manifest = JSON.parse(await readFile(path.join(root, 'MANIFESTO.json'), 'utf8'));
const expected = new Set(['MANIFESTO.json', ...manifest.files.map(f => f.path)]);
const problems = [];
for (const file of manifest.files) {
  const target = path.resolve(root, file.path);
  if (!target.startsWith(root)) throw Error('Manifesto contém caminho externo');
  try {
    const bytes = await readFile(target);
    if (createHash('sha256').update(bytes).digest('hex') !== file.sha256) problems.push(`Alterado: ${file.path}`);
  } catch { problems.push(`Ausente: ${file.path}`); }
}
async function walk(dir = '') {
  for (const e of await readdir(path.join(root, dir), { withFileTypes: true })) {
    const name = dir ? `${dir}/${e.name}` : e.name;
    if (e.name === '.git' && e.isDirectory()) continue;
    if (e.isSymbolicLink()) { problems.push(`Link: ${name}`); continue; }
    if (e.isDirectory()) await walk(name);
    else if (!expected.has(name)) problems.push(`Arquivo extra: ${name}`);
  }
}
await walk();
try {
  const bytes = await readFile(path.join(root, 'release.json'));
  const release = JSON.parse(bytes.toString('utf8'));
  const config = await readFile(path.join(root, 'site/lib/distribution-config.ts'), 'utf8');
  const literal = key => {
    const matches = [...config.matchAll(new RegExp(`^\\s*${key}:\\s*'([^'\\r\\n]+)',?\\s*$`, 'gm'))];
    if (matches.length !== 1) throw Error(`Campo inválido: ${key}`);
    return matches[0][1];
  };
  const github = /^https:\/\/github\.com\/([\w-]+)\/([\w.-]+)$/.exec(literal('repository'));
  if (bytes.length > 6000 || Object.keys(release).sort().join(',') !== 'notes,repository,version' || !/^\d+\.\d+\.\d+(?:-preview\.\d+)?$/.test(release.version) || typeof release.notes !== 'string' || !release.notes.trim() || release.notes.length > 2000) throw Error('Formato de anúncio inválido');
  if (release.version !== manifest.version || release.version !== literal('version') || release.repository !== literal('repository')) throw Error('Versão/repositório divergentes');
  if (!github || literal('releaseEndpoint') !== `https://raw.githubusercontent.com/${github[1]}/${github[2]}/main/release.json`) throw Error('Endereço do anúncio divergente');
} catch (error) { problems.push(`Anúncio de atualização: ${error.message}`); }
const hosting = JSON.parse(await readFile(path.join(root, 'site/.openai/hosting.example.json'), 'utf8'));
if (JSON.stringify(hosting) !== JSON.stringify({ d1: 'DB', r2: 'BUCKET' })) problems.push('Vínculo Sites não está neutro');
if (problems.length) { console.error(problems.join('\n')); process.exitCode = 1; }
else console.log(`${manifest.files.length} arquivos conferidos; pacote íntegro e sem arquivos extras. Execute antes de instalar/configurar.`);
