// The same Lucide Compass geometry as the app brand (ISC, lucide-react).
import {writeFile} from 'node:fs/promises';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
import {renderToStaticMarkup} from 'react-dom/server';
import {createElement} from 'react';
import {Compass} from 'lucide-react';
const require=createRequire(import.meta.url);
const sharp=require(require.resolve('sharp',{paths:[require.resolve('miniflare')]}));
const compass=renderToStaticMarkup(createElement(Compass,{color:'#252724',strokeWidth:1.65}));
const art=(inset,size)=>`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" fill="#f3f3f1"/><g transform="translate(${inset} ${inset}) scale(${size/24})">${compass}</g></svg>`;
const standard=art(5,54),maskable=art(8,48);
await writeFile(new URL('../public/favicon.svg',import.meta.url),standard+'\n');
for(const [name,size,svg] of [['icon-32.png',32,standard],['apple-touch-icon.png',180,standard],['icon-192.png',192,standard],['icon-512.png',512,standard],['icon-maskable-512.png',512,maskable]]){
 await sharp(Buffer.from(svg)).resize(size,size).png().toFile(fileURLToPath(new URL('../public/'+name,import.meta.url)));
}
console.log('Compass icons generated.');
