import {z} from 'zod';
import {bucket,access,csrf,database,handle,identity,readJson,respond,AppError} from '@/lib/service';
import {placeInput} from '@/lib/contracts';
export const dynamic='force-dynamic';
type Context={params:Promise<{id:string}>};
export async function GET(_:Request,{params}:Context){return handle(async()=>{
 const {id}=await params;await access(id,await identity());
 const {results}=await database().prepare('SELECT id,data,position,revision,photo_data FROM places WHERE trip_id=? ORDER BY position,id').bind(id).all<{id:string;data:string;position:number;revision:number;photo_data:string|null}>();
 return respond({places:results.map(p=>({...placeInput.parse(JSON.parse(p.data)),id:p.id,position:p.position,revision:p.revision,photo:p.photo_data?{...JSON.parse(p.photo_data),...(JSON.parse(p.photo_data).provider==='upload'?{url:'/api/trips/'+id+'/places/'+p.id+'/photo?v='+p.revision}:{})}:null}))});
});}
export async function POST(req:Request,{params}:Context){return handle(async()=>{
 csrf(req);const input=await readJson(req,16000),{id}=await params,trip=await access(id,await identity(),true),data=placeInput.parse(input);
 if(data.date&&(data.date<trip.start_date||data.date>trip.end_date))throw new AppError(422,'Escolha uma data dentro da viagem.');
 if(data.listId!==null&&!await database().prepare('SELECT id FROM place_lists WHERE id=? AND trip_id=?').bind(data.listId,id).first())throw new AppError(400,'Escolha uma lista desta viagem.');
 const key=crypto.randomUUID(),saved=await database().prepare('INSERT INTO places (id,trip_id,data,date,position,revision) SELECT ?,?,?,?,(SELECT COALESCE(MAX(position),0)+1024 FROM places WHERE trip_id=?),1 WHERE ? IS NULL OR EXISTS (SELECT 1 FROM place_lists WHERE id=? AND trip_id=?)').bind(key,id,JSON.stringify(data),data.date,id,data.listId,data.listId,id).run();
 if(!saved.meta.changes)throw new AppError(409,'A lista mudou. Atualize e escolha uma lista existente.');
 return respond({id:key},201);
});}
export async function PATCH(req:Request,{params}:Context){return handle(async()=>{
 csrf(req);const input=z.object({id:z.string(),revision:z.number().int().positive(),place:placeInput,position:z.number().finite().min(-1e12).max(1e12).optional()}).strict().parse(await readJson(req,16000));
 const {id}=await params,trip=await access(id,await identity(),true),data=input.place;
 if(data.date&&(data.date<trip.start_date||data.date>trip.end_date))throw new AppError(422,'Escolha uma data dentro da viagem.');
 if(data.listId!==null&&!await database().prepare('SELECT id FROM place_lists WHERE id=? AND trip_id=?').bind(data.listId,id).first())throw new AppError(400,'Escolha uma lista desta viagem.');
 const result=await database().prepare('UPDATE places SET data=?,date=?,position=COALESCE(?,position),revision=revision+1 WHERE id=? AND trip_id=? AND revision=? AND (? IS NULL OR EXISTS (SELECT 1 FROM place_lists WHERE id=? AND trip_id=?))').bind(JSON.stringify(data),data.date,input.position??null,input.id,id,input.revision,data.listId,data.listId,id).run();
 if(!result.meta.changes)throw new AppError(409,'Este lugar mudou em outra edição. Atualize a lista e confira antes de salvar.');
 return respond({saved:true});
});}
export async function DELETE(req:Request,{params}:Context){return handle(async()=>{
 csrf(req);const input=z.object({id:z.string(),revision:z.number().int().positive()}).strict().parse(await readJson(req,2000)),{id}=await params;
 await access(id,await identity(),true);const old=await database().prepare('SELECT photo_key FROM places WHERE id=? AND trip_id=?').bind(input.id,id).first<{photo_key:string|null}>();const result=await database().prepare('DELETE FROM places WHERE id=? AND trip_id=? AND revision=?').bind(input.id,id,input.revision).run();
 if(!result.meta.changes)throw new AppError(409,'Este lugar mudou em outra edição. Atualize a lista antes de remover.');if(old?.photo_key)try{await bucket().delete(old.photo_key);}catch{console.error('Removed place photo cleanup failed');}return respond({removed:true});
});}
