import {cp,mkdir,readFile} from 'node:fs/promises';
const source=new URL('../node_modules/pdfjs-dist/',import.meta.url);
const {version}=JSON.parse(await readFile(new URL('package.json',source),'utf8'));
const target=new URL('../public/pdfjs/'+version+'/',import.meta.url);
await mkdir(target,{recursive:true});
for(const name of ['cmaps','standard_fonts','wasm','iccs','LICENSE']) await cp(new URL(name,source),new URL(name,target),{recursive:true});
await cp(new URL('build/pdf.worker.min.mjs',source),new URL('pdf.worker.min.mjs',target));
