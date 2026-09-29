import {z} from 'zod';
import type {ChatGPTUser} from '@/app/chatgpt-auth';
import {destinationRefs} from './geography';
import {access, AppError, bucket, database, listReservations} from './service';

type TripRow = {id:string;owner_id:string;name:string;start_date:string;end_date:string;destinations:string;destination_locations:string;cover_key:string|null;role:'owner'|'editor'|'reader'};
const present = ({owner_id, cover_key, destination_locations, ...trip}: TripRow) => ({...trip, has_cover:!!cover_key, destinationLocations:destinationRefs(destination_locations)});
export async function assistantTrip(id:string,user:ChatGPTUser) {
  const permission=await access(id,user);
  const row=await database().prepare('SELECT * FROM trips WHERE id=?').bind(id).first<TripRow>();
  if(!row)throw new AppError(404,'Viagem não encontrada.');
  const trip=present({...row,role:permission.role as TripRow['role']});
  return {trip,base:{name:trip.name,startDate:trip.start_date,endDate:trip.end_date,destinations:trip.destinations,destinationLocations:trip.destinationLocations},reservations:await listReservations(id)};
}
type DeletionJob={id:string;owner_id:string;confirm_name:string;object_keys:string};
export async function deleteAssistantTrip(id:string,user:ChatGPTUser,input:unknown) {
  const {confirmName}=z.object({confirmName:z.string().min(1).max(300)}).strict().parse(input),db=database();
  let job=await db.prepare('SELECT * FROM trip_deletions WHERE id=?').bind(id).first<DeletionJob>();
  if(!job){
    await access(id,user,true,true);
    const row=await db.prepare('SELECT name FROM trips WHERE id=?').bind(id).first<{name:string}>();
    if(row?.name!==confirmName)throw new AppError(409,'Confirme o nome exato da viagem antes de excluir.');
    // Save the cleanup receipt in the same transaction that removes the data.
    // R2 failures can then be retried by the same owner without losing object keys.
    const guard=' AND EXISTS (SELECT 1 FROM trip_deletions j WHERE j.id=? AND j.owner_id=? AND j.confirm_name=?)';
    const statements=[db.prepare(`INSERT INTO trip_deletions(id,owner_id,confirm_name,object_keys,created_at)
      SELECT t.id,t.owner_id,t.name,COALESCE((SELECT json_group_array(object_key) FROM (
        SELECT d.object_key FROM documents d JOIN reservations r ON r.id=d.reservation_id WHERE r.trip_id=t.id
        UNION SELECT object_key FROM reviews WHERE trip_id=t.id
        UNION SELECT photo_key AS object_key FROM places WHERE trip_id=t.id AND photo_key IS NOT NULL
        UNION SELECT cover_key AS object_key FROM trips WHERE id=t.id AND cover_key IS NOT NULL
      )),'[]'),? FROM trips t WHERE t.id=? AND t.owner_id=? AND t.name=?`)
      .bind(new Date().toISOString(),id,user.userId,confirmName)];
    for(const table of ['reservation_locations','reviews','places','place_lists','day_orders','members'])
      statements.push(db.prepare(`DELETE FROM ${table} WHERE trip_id=?`+guard).bind(id,id,user.userId,confirmName));
    for(const table of ['documents','reservation_changes'])
      statements.push(db.prepare(`DELETE FROM ${table} WHERE reservation_id IN (SELECT id FROM reservations WHERE trip_id=?)`+guard).bind(id,id,user.userId,confirmName));
    statements.push(db.prepare('DELETE FROM reservations WHERE trip_id=?'+guard).bind(id,id,user.userId,confirmName));
    statements.push(db.prepare('DELETE FROM trips WHERE id=?'+guard).bind(id,id,user.userId,confirmName));
    const results=await db.batch(statements);
    if(!results.at(-1)?.meta.changes)throw new AppError(409,'A viagem mudou. Releia os detalhes antes de excluir.');
    job=await db.prepare('SELECT * FROM trip_deletions WHERE id=?').bind(id).first<DeletionJob>();
  }
  if(!job||job.owner_id!==user.userId)throw new AppError(403,'Somente o proprietário pode excluir esta viagem.');
  if(job.confirm_name!==confirmName)throw new AppError(409,'Confirme o nome exato da viagem antes de excluir.');
  try{
    // Registration and removal of the trip are serialized by D1. Once the trip
    // is gone no new upload can register; active writes must finish before any
    // cleanup receipt can be considered complete.
    const uploads=await db.prepare('SELECT id,object_keys,status,created_at FROM trip_uploads WHERE trip_id=?').bind(id).all<{id:string;object_keys:string;status:string;created_at:string}>();
    const active=uploads.results.filter(upload=>upload.status==='active');
    if(active.length)return {deleted:true,filesCleaned:false,retryRequired:true,cleanupReason:'uploads_in_progress',pendingUploads:active.length,pendingUploadIds:active.slice(0,50).map(upload=>upload.id),oldestUploadAt:active.map(upload=>upload.created_at).sort()[0],recoveryHint:'Aguarde os uploads terminarem e repita esta exclusão. Se uma execução foi interrompida, a manutenção deve confirmar seu encerramento antes de liberar o registro pendente; o prazo sozinho não comprova o encerramento.'};
    const keys=[...new Set([...(JSON.parse(job.object_keys) as string[]),...uploads.results.flatMap(upload=>JSON.parse(upload.object_keys) as string[])])],storage=bucket();
    for(let offset=0;offset<keys.length;offset+=1000)await storage.delete(keys.slice(offset,offset+1000));
    // Also remove superseded covers and staged documents scoped to this trip.
    for(const prefix of ['trips/','reviews/','covers/']){
      let cursor:string|undefined;
      do{
        const page=await storage.list({prefix:prefix+id+'/',limit:1000,...(cursor?{cursor}:{})});
        if(page.objects.length)await storage.delete(page.objects.map(object=>object.key));
        cursor=page.truncated?page.cursor:undefined;
      }while(cursor);
    }
    await db.batch([db.prepare('DELETE FROM trip_uploads WHERE trip_id=?').bind(id),db.prepare('DELETE FROM trip_deletions WHERE id=? AND owner_id=?').bind(id,user.userId)]);
    return {deleted:true,filesCleaned:true,retryRequired:false};
  }catch{
    return {deleted:true,filesCleaned:false,retryRequired:true};
  }
}
