import {z} from 'zod';
import {documentUploadTypes} from '@/lib/document-upload';
import {access,AppError,bucket,csrf,database,decodeFile,handle,identity,readJson,respond,withTripUpload} from '@/lib/service';
export const dynamic='force-dynamic';
const input=z.object({filename:z.string().trim().min(1).max(300),mime:z.enum(documentUploadTypes),base64:z.string().min(4).max(14000000)}).strict();
export async function POST(req:Request,{params}:{params:Promise<{id:string;reservationId:string}>}){return handle(async()=>{
 csrf(req);const {id,reservationId}=await params;await access(id,await identity(),true);
 const db=database();
 if(!await db.prepare('SELECT id FROM reservations WHERE id=? AND trip_id=?').bind(reservationId,id).first())throw new AppError(404,'Reserva não encontrada.');
 const file=input.parse(await readJson(req,14002000)),bytes=decodeFile(file.base64,file.mime);
 const hash=[...new Uint8Array(await crypto.subtle.digest('SHA-256',bytes as BufferSource))].map(b=>b.toString(16).padStart(2,'0')).join('');
 const existing=await db.prepare('SELECT id FROM documents WHERE reservation_id=? AND sha256=?').bind(reservationId,hash).first<{id:string}>();
 if(existing)return respond({id:existing.id,added:false});
 const documentId=crypto.randomUUID(),key='trips/'+id+'/'+reservationId+'/'+hash+'/'+documentId;
 return withTripUpload(id,[key],async()=>{
  await bucket().put(key,bytes,{httpMetadata:{contentType:file.mime}});
  const result=await db.prepare('INSERT INTO documents (id,reservation_id,object_key,filename,mime,label,bytes,sha256) SELECT ?,?,?,?,?,?,?,? WHERE EXISTS (SELECT 1 FROM reservations WHERE id=? AND trip_id=?) ON CONFLICT(reservation_id,sha256) DO NOTHING').bind(documentId,reservationId,key,file.filename,file.mime,file.filename,bytes.length,hash,reservationId,id).run();
  const saved=await db.prepare('SELECT id FROM documents WHERE reservation_id=? AND sha256=?').bind(reservationId,hash).first<{id:string}>();
  if(!saved)throw new AppError(404,'Reserva não encontrada.');
  return respond({id:saved.id,added:result.meta.changes===1},result.meta.changes?201:200);
 });
});}
