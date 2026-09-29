import {createHash} from 'node:crypto';
import {readFile,readdir} from 'node:fs/promises';
import path from 'node:path';
import type {Plugin} from 'vite';

// Generated from the actual client bundle, including lazy PDF/map chunks.
// Kept in the Vite pipeline so both portable and hosted builds produce it.
export function pwa():Plugin {
 let root='';
 return {
  name:'central-pwa',apply:'build',
  configResolved(config){root=config.root;},
  async generateBundle(_options,bundle){
   if(this.environment.name!=='client')return;
   const assets=Object.keys(bundle).filter(p=>/\.(?:js|mjs|css|woff2?|ttf)$/.test(p)).map(p=>'/'+p);
   assets.push('/manifest.webmanifest','/icon-192.png','/icon-512.png','/icon-maskable-512.png','/apple-touch-icon.png','/alpes.jpg');
   for(let i=0;i<5;i++)assets.push('/design/manrope-'+i+'.ttf');
   // A later PDF page may need a font, CMap or decoder not used by page one.
   const pdfFiles=await readdir(path.join(root,'public/pdfjs'),{recursive:true,withFileTypes:true});
   assets.push(...pdfFiles.filter(file=>file.isFile()).map(file=>'/'+path.relative(path.join(root,'public'),path.join(file.parentPath,file.name)).split(path.sep).join('/')).sort());
   const source=await readFile(path.join(root,'build/service-worker.js'),'utf8');
   const hash=createHash('sha256').update(source+JSON.stringify(assets));
   for(const asset of assets)if(!asset.startsWith('/_next/'))hash.update(await readFile(path.join(root,'public',asset)));
   const revision=hash.digest('hex').slice(0,16);
   this.emitFile({type:'asset',fileName:'sw.js',source:source.replace('"__REVISION__"',JSON.stringify(revision)).replace('["__PRECACHE__"]',JSON.stringify(assets))});
  },
 };
}
