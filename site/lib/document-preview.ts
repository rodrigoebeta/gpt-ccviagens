export function documentKind(mime:string):'pdf'|'image'|'text'|'unsupported'{
 const type=mime.split(';')[0].trim().toLowerCase();
 if(type==='application/pdf')return 'pdf';
 if(['image/jpeg','image/png','image/webp','image/gif'].includes(type))return 'image';
 return type==='text/plain'?'text':'unsupported';
}
export function documentFormat(mime:string){return ({'application/pdf':'PDF','image/jpeg':'JPEG','image/png':'PNG','image/webp':'WebP','image/gif':'GIF','text/plain':'TXT'} as Record<string,string>)[mime]??'Arquivo';}
