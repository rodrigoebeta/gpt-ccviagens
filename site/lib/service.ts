import {env} from 'cloudflare:workers';
import {getChatGPTUser,type ChatGPTUser} from '@/app/chatgpt-auth';
import {assistantIdentity} from './assistant-context';
import {importInput,reservationInput,manualReservationInput,type ReservationData} from './contracts';
export class AppError extends Error{constructor(public status:number,message:string){super(message)}}
export function database(){if(!env.DB)throw new AppError(503,'Armazenamento indisponível. Tente novamente.');return env.DB;}
export function bucket(){if(!env.BUCKET)throw new AppError(503,'Comprovantes indisponíveis. Tente novamente.');return env.BUCKET;}
export async function identity(){const u=assistantIdentity()??await getChatGPTUser();if(!u)throw new AppError(401,'Entre com sua conta do ChatGPT.');return u;}
export async function writableInstallation(requestUrl:string){await identity();const {assertInstallationWritable,reportInstallationActivity}=await import('./installation');await reportInstallationActivity(requestUrl);await assertInstallationWritable();}
export async function access(id:string,u:ChatGPTUser,write=false,owner=false){
 const db=database();const trip=await db.prepare('SELECT * FROM trips WHERE id=?').bind(id).first<{owner_id:string;start_date:string;end_date:string}>();
 if(!trip)throw new AppError(404,'Viagem não encontrada.');if(trip.owner_id===u.userId)return {...trip,role:'owner'};
 const m=await db.prepare('SELECT role,user_id FROM members WHERE trip_id=? AND email=?').bind(id,u.email.toLowerCase()).first<{role:string;user_id:string|null}>();
 if(!m||(m.user_id&&m.user_id!==u.userId)||owner||(write&&m.role!=='editor'))throw new AppError(403,'Você não tem permissão para esta ação.');
 if(!m.user_id)await db.prepare('UPDATE members SET user_id=? WHERE trip_id=? AND email=? AND user_id IS NULL').bind(u.userId,id,u.email.toLowerCase()).run();
 return {...trip,role:m.role};
}
export function csrf(req:Request){if(!assistantIdentity()&&req.headers.get('origin')!==new URL(req.url).origin)throw new AppError(403,'Reabra o painel para continuar.');}
export async function readJson(req:Request,max=25000000){
 if(Number(req.headers.get('content-length')??0)>max)throw new AppError(413,'Arquivo muito grande. Limite: 25 MB.');
 const reader=req.body?.getReader();if(!reader)throw new AppError(400,'Arquivo vazio.');let size=0;const chunks:Uint8Array[]=[];
 while(true){const {done,value}=await reader.read();if(done)break;size+=value.length;if(size>max){await reader.cancel();throw new AppError(413,'Arquivo muito grande.');}chunks.push(value);}
 const bytes=new Uint8Array(size);let offset=0;for(const c of chunks){bytes.set(c,offset);offset+=c.length;}
 try{return JSON.parse(new TextDecoder().decode(bytes));}catch{throw new AppError(400,'Não foi possível ler a importação.');}
}
export function respond(data:unknown,status=200){return Response.json(data,{status,headers:{'Cache-Control':'private, no-store'}});}
export async function handle(fn:()=>Promise<Response>){try{return await fn();}catch(e){if(e instanceof AppError)return respond({error:e.message},e.status);if(e instanceof Error&&e.name==='ZodError')return respond({error:'Confira os campos e as datas. Formato inválido.'},400);console.error('Travel operation failed',e instanceof Error?e.name:'unknown');return respond({error:'Não foi possível concluir. Seus dados foram preservados; tente novamente.'},503);}}
async function digest(value:string|Uint8Array){const bytes=typeof value==='string'?new TextEncoder().encode(value):value;return [...new Uint8Array(await crypto.subtle.digest('SHA-256',bytes as BufferSource))].map(b=>b.toString(16).padStart(2,'0')).join('');}
export function decodeFile(base64:string,mime:string){
 if(!/^[A-Za-z0-9+/]+={0,2}$/.test(base64))throw new AppError(400,'Comprovante inválido.');
 let b:Uint8Array;try{b=Uint8Array.from(atob(base64),x=>x.charCodeAt(0));}catch{throw new AppError(400,'Comprovante inválido.');}
 if(b.length>10000000)throw new AppError(413,'Cada comprovante deve ter até 10 MB.');
 const head=new TextDecoder().decode(b.slice(0,8));const valid=mime==='application/pdf'?head.startsWith('%PDF-'):mime==='image/png'?b[0]===137&&head.slice(1,4)==='PNG':mime==='image/jpeg'?b[0]===255&&b[1]===216:mime==='image/gif'?head.startsWith('GIF8'):mime==='image/webp'?head.startsWith('RIFF')&&new TextDecoder().decode(b.slice(8,12))==='WEBP':true;
 if(!valid)throw new AppError(400,'O formato do comprovante não corresponde ao arquivo.');return b;
}
export async function listReservations(tripId:string){const db=database();const {results}=await db.prepare('SELECT id,data,imported_at,fingerprint,status,updated_at FROM reservations WHERE trip_id=? ORDER BY start_date,id').bind(tripId).all<{id:string;data:string;imported_at:string;fingerprint:string;status:string;updated_at:string|null}>();const docs=await db.prepare('SELECT d.id,d.reservation_id,d.filename,d.label,d.mime,d.bytes FROM documents d JOIN reservations r ON r.id=d.reservation_id WHERE r.trip_id=?').bind(tripId).all();return results.map(r=>({...JSON.parse(r.data) as ReservationData,id:r.id,importedAt:r.imported_at,fingerprint:r.fingerprint,status:r.status,updatedAt:r.updated_at,documents:docs.results.filter(d=>d.reservation_id===r.id)}));}

type ImportBundle=ReturnType<typeof importInput.parse>;
type StoredReservation={fingerprint:string;data:string;status:string;manual_override?:number};
// A durable fence prevents trip deletion from finishing while an R2 write can
// still arrive. Each attempt owns unique keys: a losing import may safely remove
// its own bytes without deleting a concurrent winner's document or review.
export async function withTripUpload<T>(tripId:string,keys:string[],write:()=>Promise<T>):Promise<T>{
 if(!keys.length)return write();
 const db=database(),uploadId=crypto.randomUUID();
 const registered=await db.prepare(`INSERT INTO trip_uploads(id,trip_id,object_keys,status,created_at)
  SELECT ?,id,?,'active',? FROM trips WHERE id=? AND NOT EXISTS (SELECT 1 FROM trip_deletions WHERE id=?)`)
  .bind(uploadId,JSON.stringify(keys),new Date().toISOString(),tripId,tripId).run();
 if(!registered.meta.changes)throw new AppError(404,'Viagem não encontrada.');
 try{return await write();}finally{
  try{
   // All PUT promises have settled before this flag changes. Never expire an
   // active fence by age: a slow or interrupted request must not lose its guard.
   await db.prepare("UPDATE trip_uploads SET status='settled' WHERE id=?").bind(uploadId).run();
   for(const key of keys){
    const referenced=await db.prepare(`SELECT 1 FROM documents WHERE object_key=? UNION ALL
     SELECT 1 FROM reviews WHERE object_key=? UNION ALL SELECT 1 FROM places WHERE photo_key=? UNION ALL
     SELECT 1 FROM trips WHERE cover_key=? LIMIT 1`).bind(key,key,key,key).first();
    if(!referenced)await bucket().delete(key);
   }
   await db.prepare('DELETE FROM trip_uploads WHERE id=?').bind(uploadId).run();
  }catch{
   // Retain keys for the deletion retry instead of losing cleanup evidence.
   console.error('Trip upload cleanup pending',uploadId);
  }
 }
}
async function queueReview(tripId:string,id:string,bundle:ImportBundle,reason:string,base:string|null){
 const key=await digest(tripId+'\n'+JSON.stringify(bundle)),objectKey='reviews/'+tripId+'/'+key+'/'+crypto.randomUUID();
 return withTripUpload(tripId,[objectKey],async()=>{
  await bucket().put(objectKey,JSON.stringify(bundle),{httpMetadata:{contentType:'application/json'}});
  await database().prepare('INSERT INTO reviews (id,trip_id,reservation_id,object_key,reason,status,base_fingerprint,created_at) VALUES (?,?,?,?,?,?,?,?) ON CONFLICT(id) DO NOTHING').bind(key,tripId,id,objectKey,reason,'pending',base,new Date().toISOString()).run();
  const row=await database().prepare('SELECT status FROM reviews WHERE id=?').bind(key).first<{status:string}>();
  if(!row)throw new AppError(404,'Viagem não encontrada.');
  return {reservationId:id,created:false,documentsAdded:0,reviewId:key,reviewRequired:row.status==='pending',reviewStatus:row.status};
 });
}
// Original bytes are staged in R2 first. D1 commits the reservation, history and
// file references in one batch, guarded by the version the caller inspected.
async function persistBundle(tripId:string,id:string,bundle:ImportBundle,existing:StoredReservation|null,reviewId?:string,manual=false){
 const db=database(),r=bundle.reservation,status=bundle.change?.action==='cancel'?'cancelled':'active';
 const data=JSON.stringify(r),fingerprint=status==='active'?await digest(data):await digest(data+'\ncancelled'),now=new Date().toISOString();
 const decoded=await Promise.all(bundle.documents.map(async f=>{const bytes=decodeFile(f.base64,f.mime),hash=await digest(bytes);return {...f,bytes,hash,id:await digest(id+'\n'+hash),key:'trips/'+tripId+'/'+id+'/'+hash+'/'+crypto.randomUUID()};}));
 const files=[...new Map(decoded.map(f=>[f.hash,f])).values()];
 const staged:typeof files=[];
 for(const f of files){const saved=await db.prepare('SELECT object_key FROM documents WHERE reservation_id=? AND sha256=?').bind(id,f.hash).first<{object_key:string}>();if(saved)f.key=saved.object_key;else staged.push(f);}
 return withTripUpload(tripId,staged.map(f=>f.key),async()=>{
 for(const f of staged)await bucket().put(f.key,f.bytes,{httpMetadata:{contentType:f.mime}});
 const statements=[];
 const reviewGuard=reviewId?' AND EXISTS (SELECT 1 FROM reviews WHERE id=? AND status=\'pending\')':'';
 const reviewArgs=reviewId?[reviewId]:[];
 if(existing&&existing.fingerprint!==fingerprint){
  statements.push(db.prepare('INSERT INTO reservation_changes (id,reservation_id,data,changed_at,action) SELECT ?,id,data,?,? FROM reservations WHERE id=? AND fingerprint=?'+reviewGuard).bind(crypto.randomUUID(),now,manual?'manual':bundle.change?.action??'update',id,existing.fingerprint,...reviewArgs));
  statements.push(db.prepare('UPDATE reservations SET kind=?,title=?,start_date=?,end_date=?,data=?,fingerprint=?,status=?,updated_at=?,manual_override=? WHERE id=? AND fingerprint=?'+reviewGuard).bind(r.kind,r.title,r.startDate,r.endDate,data,fingerprint,status,now,manual?1:0,id,existing.fingerprint,...reviewArgs));
 }else if(!existing){
  statements.push(db.prepare('INSERT INTO reservations (id,trip_id,source_key,kind,title,start_date,end_date,data,fingerprint,imported_at,status,manual_override) SELECT ?,?,?,?,?,?,?,?,?,?,?,? WHERE 1=1'+reviewGuard+' ON CONFLICT(id) DO NOTHING').bind(id,tripId,r.sourceKey,r.kind,r.title,r.startDate,r.endDate,data,fingerprint,now,status,manual?1:0,...reviewArgs));
 }
 for(const f of files)statements.push(db.prepare('INSERT INTO documents (id,reservation_id,object_key,filename,mime,label,bytes,sha256) SELECT ?,?,?,?,?,?,?,? WHERE EXISTS (SELECT 1 FROM reservations WHERE id=? AND fingerprint=?)'+reviewGuard+' ON CONFLICT(reservation_id,sha256) DO NOTHING').bind(f.id,id,f.key,f.filename,f.mime,f.label,f.bytes.length,f.hash,id,fingerprint,...reviewArgs));
 if(reviewId)statements.push(db.prepare("UPDATE reviews SET status='accepted' WHERE id=? AND status='pending' AND EXISTS (SELECT 1 FROM reservations WHERE id=? AND fingerprint=?)").bind(reviewId,id,fingerprint));
 const results=statements.length?await db.batch(statements):[];
 const documentsOffset=existing?(existing.fingerprint!==fingerprint?2:0):1;
 const added=results.slice(documentsOffset,documentsOffset+files.length).reduce((count,result)=>count+result.meta.changes,0);
 const saved=await db.prepare('SELECT fingerprint FROM reservations WHERE id=?').bind(id).first<{fingerprint:string}>();
 if(saved?.fingerprint!==fingerprint)throw new AppError(409,'A reserva mudou em outra edição. Atualize e compare novamente.');
 if(reviewId){const resolved=await db.prepare('SELECT status FROM reviews WHERE id=?').bind(reviewId).first<{status:string}>();if(resolved?.status!=='accepted')throw new AppError(409,'Esta revisão foi resolvida em outra edição. Atualize a lista.');}
 return {reservationId:id,created:!existing&&results[0]?.meta.changes===1,documentsAdded:added,updated:!!existing&&existing.fingerprint!==fingerprint,cancelled:status==='cancelled'};
 });
}
export async function importReservation(tripId:string,user:ChatGPTUser,input:unknown){
 const trip=await access(tripId,user,true),bundle=importInput.parse(input),r=bundle.reservation;
 // Validate files before accepting a review item, even when dates are ambiguous.
 for(const f of bundle.documents)decodeFile(f.base64,f.mime);
 const id=await digest(tripId+'\n'+r.sourceKey),data=JSON.stringify(r),db=database();
 const existing=await db.prepare('SELECT fingerprint,data,status,manual_override FROM reservations WHERE id=?').bind(id).first<StoredReservation>();
 const desired= bundle.change?.action==='cancel'?await digest(data+'\ncancelled'):await digest(data);
 const reason=bundle.reviewReason||(r.startDate<trip.start_date||r.endDate>trip.end_date?'As datas estão fora do período desta viagem.':null)
  ||(bundle.change&&!existing?'Não foi encontrada a reserva original desta alteração.':null)
  ||(existing&&existing.fingerprint!==desired&&existing.manual_override?'Esta reserva recebeu ajustes manuais. Compare antes de substituir.':null)
  ||(existing&&existing.fingerprint!==desired&&(!bundle.change||bundle.change.baseFingerprint!==existing.fingerprint)?'A reserva já existe com outra versão. Compare antes de substituir.':null);
 if(reason)return queueReview(tripId,id,bundle,reason,existing?.fingerprint??null);
 try{return await persistBundle(tripId,id,bundle,existing);}catch(e){if(e instanceof AppError&&e.status===409)return queueReview(tripId,id,bundle,'A reserva mudou durante a importação. Confira as duas versões.',existing?.fingerprint??null);throw e;}
}
export async function createManualReservation(tripId:string,user:ChatGPTUser,input:unknown){
 const trip=await access(tripId,user,true),parsed=manualReservationInput.parse(input),r=reservationInput.parse({...parsed.reservation,sourceKey:'manual:'+parsed.requestId,sources:[{provider:'manual',entryId:parsed.requestId,subject:'Cadastro manual'}]});
 if(r.startDate<trip.start_date||r.endDate>trip.end_date)throw new AppError(422,'Escolha datas dentro do período da viagem.');
 const id=await digest(tripId+'\n'+r.sourceKey),existing=await database().prepare('SELECT fingerprint,data,status,manual_override FROM reservations WHERE id=?').bind(id).first<StoredReservation>();
 if(existing&&(existing.status!=='active'||existing.fingerprint!==await digest(JSON.stringify(r))))throw new AppError(409,'Este cadastro já foi salvo com outros dados. Atualize a programação antes de editar.');
 return persistBundle(tripId,id,{version:1,reservation:r,documents:parsed.documents},existing,undefined,true);
}
export async function editReservation(tripId:string,id:string,user:ChatGPTUser,base:string,input:unknown){
 const trip=await access(tripId,user,true),r=reservationInput.parse(input),db=database();
 if(r.startDate<trip.start_date||r.endDate>trip.end_date)throw new AppError(422,'Escolha datas dentro do período da viagem.');
 const existing=await db.prepare('SELECT fingerprint,data,status FROM reservations WHERE id=? AND trip_id=?').bind(id,tripId).first<StoredReservation>();
 if(!existing)throw new AppError(404,'Reserva não encontrada.');
 if(existing.fingerprint!==base)throw new AppError(409,'A reserva mudou em outra edição. Feche, atualize e confira antes de salvar.');
 const original=JSON.parse(existing.data) as ReservationData;
 if(r.sourceKey!==original.sourceKey||r.kind!==original.kind||JSON.stringify(r.sources)!==JSON.stringify(original.sources))throw new AppError(400,'Preserve a identificação e as fontes da reserva.');
 return persistBundle(tripId,id,{version:1,reservation:r,documents:[],change:{action:existing.status==='cancelled'?'cancel':'update',baseFingerprint:base}},existing,undefined,true);
}
export async function listReviews(tripId:string){
 const {results}=await database().prepare("SELECT * FROM reviews WHERE trip_id=? AND status='pending' ORDER BY created_at,id").bind(tripId).all<{id:string;object_key:string;reason:string;created_at:string;status:string;reservation_id:string}>();
 const reservations=await listReservations(tripId);
 return Promise.all(results.map(async row=>{const object=await bucket().get(row.object_key);if(!object)throw new AppError(503,'Uma revisão não pôde ser carregada. Tente novamente.');const bundle=importInput.parse(await object.json());const current=reservations.find(r=>r.id===row.reservation_id)??null;return {id:row.id,reason:row.reason,created_at:row.created_at,status:row.status,reservation:bundle.reservation,documents:bundle.documents.map(d=>({filename:d.filename,label:d.label})),current,baseFingerprint:current?.fingerprint??null,action:bundle.change?.action??'update'};}));
}
export async function resolveReview(tripId:string,user:ChatGPTUser,reviewId:string,action:'accept'|'dismiss',base:string|null,reservation?:ReservationData){
 const trip=await access(tripId,user,true),db=database();
 const row=await db.prepare('SELECT * FROM reviews WHERE id=? AND trip_id=?').bind(reviewId,tripId).first<{status:string;object_key:string;reservation_id:string}>();
 if(!row)throw new AppError(404,'Revisão não encontrada.');if(row.status!=='pending')throw new AppError(409,'Esta revisão já foi resolvida. Atualize a lista.');
 if(action==='dismiss'){await db.prepare("UPDATE reviews SET status='dismissed' WHERE id=? AND status='pending'").bind(reviewId).run();return {dismissed:true};}
 const obj=await bucket().get(row.object_key);if(!obj)throw new AppError(503,'Conteúdo indisponível. Tente novamente.');const bundle=importInput.parse(await obj.json());
 if(reservation){if(reservation.sourceKey!==bundle.reservation.sourceKey)throw new AppError(400,'A identificação da reserva deve ser preservada.');bundle.reservation=reservation;}
 const r=bundle.reservation;if(r.startDate<trip.start_date||r.endDate>trip.end_date)throw new AppError(422,'Corrija as datas para o período desta viagem ou descarte para importar na viagem correta.');
 const existing=await db.prepare('SELECT fingerprint,data,status FROM reservations WHERE id=?').bind(row.reservation_id).first<StoredReservation>();
 if((existing?.fingerprint??null)!==base)throw new AppError(409,'A reserva mudou desde que você abriu a revisão. Atualize a lista e compare novamente.');
 if(bundle.change?.action==='cancel'&&!existing)throw new AppError(422,'Não há reserva original para cancelar.');
 return persistBundle(tripId,row.reservation_id,bundle,existing,reviewId);
}
