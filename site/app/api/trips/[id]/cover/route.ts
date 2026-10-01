import {writableInstallation} from '@/lib/service';
import {z} from 'zod';
import {access,AppError,bucket,csrf,database,decodeFile,handle,identity,readJson,respond,withTripUpload} from '@/lib/service';
export const dynamic='force-dynamic';
type Context={params:Promise<{id:string}>};
export async function GET(_:Request,{params}:Context){return handle(async()=>{
 const {id}=await params;await access(id,await identity());const row=await database().prepare('SELECT cover_key FROM trips WHERE id=?').bind(id).first<{cover_key:string|null}>();
 if(!row?.cover_key)throw new AppError(404,'Esta viagem usa a capa padrão.');const file=await bucket().get(row.cover_key);if(!file)throw new AppError(404,'Capa não encontrada.');
 return new Response(file.body,{headers:{'Content-Type':file.httpMetadata?.contentType??'image/jpeg','Cache-Control':'private, no-store','X-Content-Type-Options':'nosniff'}});
});}
export async function POST(req:Request,{params}:Context){return handle(async()=>{
 csrf(req);await writableInstallation(req.url);const raw=await readJson(req,2900000),{id}=await params;await access(id,await identity(),true);
 const input=z.object({revision:z.number().int().nonnegative(),mime:z.enum(['image/jpeg','image/png']),base64:z.string().min(4).max(2800000)}).strict().parse(raw);
 const bytes=decodeFile(input.base64,input.mime);if(bytes.length>2000000)throw new AppError(413,'Use uma imagem de até 2 MB após otimização.');
 const key='covers/'+id+'/'+crypto.randomUUID();return withTripUpload(id,[key],async()=>{
 await bucket().put(key,bytes,{httpMetadata:{contentType:input.mime}});
 const result=await database().prepare('UPDATE trips SET cover_key=?,cover_version=cover_version+1 WHERE id=? AND cover_version=?').bind(key,id,input.revision).run();
 if(!result.meta.changes)throw new AppError(409,'A capa mudou em outra edição. Atualize a viagem antes de trocar.');
 return respond({saved:true});
 });
});}
export async function DELETE(req:Request,{params}:Context){return handle(async()=>{
 csrf(req);await writableInstallation(req.url);const raw=await readJson(req,1000),{id}=await params;await access(id,await identity(),true);const {revision}=z.object({revision:z.number().int().nonnegative()}).strict().parse(raw);
 const result=await database().prepare('UPDATE trips SET cover_key=NULL,cover_version=cover_version+1 WHERE id=? AND cover_version=?').bind(id,revision).run();
 if(!result.meta.changes)throw new AppError(409,'A capa mudou em outra edição. Atualize a viagem antes de trocar.');return respond({saved:true});
});}
