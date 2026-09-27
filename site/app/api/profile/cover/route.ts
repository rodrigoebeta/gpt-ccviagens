import {z} from 'zod';
import {AppError,bucket,csrf,database,decodeFile,handle,identity,readJson,respond} from '@/lib/service';
export const dynamic='force-dynamic';
type CoverRow={cover_key:string|null;cover_version:number};
const revisionInput=z.object({revision:z.number().int().nonnegative()}).strict();
const imageInput=revisionInput.extend({mime:z.enum(['image/jpeg','image/png']),base64:z.string().min(4).max(2800000)});
export async function GET(req:Request){return handle(async()=>{
 const user=await identity();
 const row=await database().prepare('SELECT cover_key,cover_version FROM user_preferences WHERE user_id=?').bind(user.userId).first<CoverRow>();
 if(new URL(req.url).searchParams.get('metadata')==='1')return respond({has_cover:!!row?.cover_key,cover_version:row?.cover_version??0});
 if(!row?.cover_key)throw new AppError(404,'Você está usando a imagem padrão.');
 const file=await bucket().get(row.cover_key);if(!file)throw new AppError(404,'Imagem não encontrada.');
 return new Response(file.body,{headers:{'Content-Type':file.httpMetadata?.contentType??'image/jpeg','Cache-Control':'private, no-store','X-Content-Type-Options':'nosniff'}});
});}
async function save(req:Request,reset:boolean){return handle(async()=>{
 // Read the bounded body before returning errors, including on a reused connection.
 const raw=await readJson(req,reset?1000:2900000);
 csrf(req);const user=await identity();
 const image=reset?null:imageInput.parse(raw);
 const input=image??revisionInput.parse(raw);
 let bytes:Uint8Array|undefined;
 if(image){bytes=decodeFile(image.base64,image.mime);if(bytes.length>2000000)throw new AppError(413,'Use uma imagem de até 2 MB após otimização.');}
 const db=database();
 await db.prepare('INSERT INTO user_preferences (user_id) VALUES (?) ON CONFLICT(user_id) DO NOTHING').bind(user.userId).run();
 const previous=await db.prepare('SELECT cover_key,cover_version FROM user_preferences WHERE user_id=?').bind(user.userId).first<CoverRow>();
 if(previous?.cover_version!==input.revision)throw new AppError(409,'A imagem mudou em outro dispositivo. Feche e reabra a personalização antes de salvar.');
 const key=bytes?'home-covers/'+crypto.randomUUID():null;
 if(key&&bytes&&image)await bucket().put(key,bytes,{httpMetadata:{contentType:image.mime}});
 try{
  const result=await db.prepare('UPDATE user_preferences SET cover_key=?,cover_version=cover_version+1 WHERE user_id=? AND cover_version=?').bind(key,user.userId,input.revision).run();
  if(!result.meta.changes)throw new AppError(409,'A imagem mudou em outro dispositivo. Feche e reabra a personalização antes de salvar.');
 }catch(error){if(key)await bucket().delete(key);throw error;}
 if(previous.cover_key)try{await bucket().delete(previous.cover_key);}catch{console.error('Old home cover cleanup failed');}
 return respond({saved:true,has_cover:!!key,cover_version:input.revision+1});
});}
export async function POST(req:Request){return save(req,false);}
export async function DELETE(req:Request){return save(req,true);}
