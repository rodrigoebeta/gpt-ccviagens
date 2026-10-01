import {writableInstallation} from '@/lib/service';
import {z} from 'zod';
import {access,csrf,database,handle,identity,readJson,respond,AppError} from '@/lib/service';
import {installationStatus} from '@/lib/installation';
export const dynamic='force-dynamic';
type Context={params:Promise<{id:string}>};
const name=z.string().trim().min(1).max(100);
export async function GET(_:Request,{params}:Context){return handle(async()=>{
 const {id}=await params;await access(id,await identity());
 if((await installationStatus()).writable)await database().prepare('INSERT INTO place_lists (id,trip_id,name,revision) VALUES (?,?,?,1) ON CONFLICT(id) DO NOTHING').bind('default:'+id,id,'Queremos visitar').run();
 const {results}=await database().prepare('SELECT id,name,revision FROM place_lists WHERE trip_id=? ORDER BY rowid').bind(id).all();return respond({lists:results});
});}
export async function POST(req:Request,{params}:Context){return handle(async()=>{
 csrf(req);await writableInstallation(req.url);const input=z.object({name}).strict().parse(await readJson(req,2000)),{id}=await params;await access(id,await identity(),true);
 const key=crypto.randomUUID();await database().prepare('INSERT INTO place_lists (id,trip_id,name,revision) VALUES (?,?,?,1)').bind(key,id,input.name).run();return respond({id:key},201);
});}
export async function PATCH(req:Request,{params}:Context){return handle(async()=>{
 csrf(req);await writableInstallation(req.url);const input=z.object({id:z.string(),name,revision:z.number().int().positive()}).strict().parse(await readJson(req,2000)),{id}=await params;await access(id,await identity(),true);
 const r=await database().prepare('UPDATE place_lists SET name=?,revision=revision+1 WHERE id=? AND trip_id=? AND revision=?').bind(input.name,input.id,id,input.revision).run();
 if(!r.meta.changes)throw new AppError(409,'A lista mudou em outra edição. Atualize e tente novamente.');return respond({saved:true});
});}
export async function DELETE(req:Request,{params}:Context){return handle(async()=>{
 csrf(req);await writableInstallation(req.url);const input=z.object({id:z.string().min(1),revision:z.number().int().positive(),moveToListId:z.string().min(1).optional()}).strict().parse(await readJson(req,3000));
 const {id}=await params;await access(id,await identity(),true);const db=database();
 if(input.id==='default:'+id)throw new AppError(400,'A lista padrão pode ser renomeada, mas não excluída.');
 const list=await db.prepare('SELECT revision FROM place_lists WHERE id=? AND trip_id=?').bind(input.id,id).first<{revision:number}>();
 if(!list||list.revision!==input.revision)throw new AppError(409,'A lista mudou. Atualize antes de excluir.');
 if(input.moveToListId&&(input.moveToListId===input.id||!await db.prepare('SELECT id FROM place_lists WHERE id=? AND trip_id=?').bind(input.moveToListId,id).first()))throw new AppError(400,'Escolha outra lista desta viagem para preservar os lugares.');
 const count=await db.prepare("SELECT COUNT(*) AS n FROM places WHERE trip_id=? AND json_extract(data,'$.listId')=?").bind(id,input.id).first<{n:number}>();
 if(count?.n&&!input.moveToListId)throw new AppError(409,'Esta lista contém lugares. Informe moveToListId para preservá-los.');
 const statements=[];
 // The destination may disappear after the preflight read. Validate it inside
 // the same transaction as the move and deletion, including an empty source.
 if(input.moveToListId)statements.push(db.prepare("UPDATE places SET data=json_set(data,'$.listId',?),revision=revision+1 WHERE trip_id=? AND json_extract(data,'$.listId')=? AND EXISTS (SELECT 1 FROM place_lists WHERE id=? AND trip_id=? AND revision=?) AND EXISTS (SELECT 1 FROM place_lists WHERE id=? AND trip_id=?)").bind(input.moveToListId,id,input.id,input.id,id,input.revision,input.moveToListId,id));
 statements.push(db.prepare("DELETE FROM place_lists WHERE id=? AND trip_id=? AND revision=? AND NOT EXISTS (SELECT 1 FROM places WHERE trip_id=? AND json_extract(data,'$.listId')=?) AND (? IS NULL OR EXISTS (SELECT 1 FROM place_lists WHERE id=? AND trip_id=?))").bind(input.id,id,input.revision,id,input.id,input.moveToListId??null,input.moveToListId??null,id));
 const result=await db.batch(statements);if(!result.at(-1)?.meta.changes)throw new AppError(409,'A lista mudou. Atualize antes de excluir.');
 return respond({removed:true,movedPlaces:result.length>1?result[0].meta.changes:0});
});}
