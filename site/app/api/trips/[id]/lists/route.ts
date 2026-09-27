import {z} from 'zod';
import {access,csrf,database,handle,identity,readJson,respond,AppError} from '@/lib/service';
export const dynamic='force-dynamic';
type Context={params:Promise<{id:string}>};
const name=z.string().trim().min(1).max(100);
export async function GET(_:Request,{params}:Context){return handle(async()=>{
 const {id}=await params;await access(id,await identity());
 await database().prepare('INSERT INTO place_lists (id,trip_id,name,revision) VALUES (?,?,?,1) ON CONFLICT(id) DO NOTHING').bind('default:'+id,id,'Queremos visitar').run();
 const {results}=await database().prepare('SELECT id,name,revision FROM place_lists WHERE trip_id=? ORDER BY rowid').bind(id).all();return respond({lists:results});
});}
export async function POST(req:Request,{params}:Context){return handle(async()=>{
 csrf(req);const input=z.object({name}).strict().parse(await readJson(req,2000)),{id}=await params;await access(id,await identity(),true);
 const key=crypto.randomUUID();await database().prepare('INSERT INTO place_lists (id,trip_id,name,revision) VALUES (?,?,?,1)').bind(key,id,input.name).run();return respond({id:key},201);
});}
export async function PATCH(req:Request,{params}:Context){return handle(async()=>{
 csrf(req);const input=z.object({id:z.string(),name,revision:z.number().int().positive()}).strict().parse(await readJson(req,2000)),{id}=await params;await access(id,await identity(),true);
 const r=await database().prepare('UPDATE place_lists SET name=?,revision=revision+1 WHERE id=? AND trip_id=? AND revision=?').bind(input.name,input.id,id,input.revision).run();
 if(!r.meta.changes)throw new AppError(409,'A lista mudou em outra edição. Atualize e tente novamente.');return respond({saved:true});
});}
