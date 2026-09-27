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
const hosting = JSON.parse(await readFile(path.join(root, 'site/.openai/hosting.example.json'), 'utf8'));
if (JSON.stringify(hosting) !== JSON.stringify({ d1: 'DB', r2: 'BUCKET' })) problems.push('Vínculo Sites não está neutro');
if (problems.length) { console.error(problems.join('\n')); process.exitCode = 1; }
else console.log(`${manifest.files.length} arquivos conferidos; pacote íntegro e sem arquivos extras. Execute antes de instalar/configurar.`);
