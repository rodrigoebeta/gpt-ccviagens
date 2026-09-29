import {z} from 'zod';
import {access,csrf,database,handle,identity,readJson,respond,AppError} from '@/lib/service';
import {dateValue} from '@/lib/contracts';
export const dynamic='force-dynamic';
const inputSchema=z.object({
 listId:z.string().min(1).max(100),date:dateValue,
 places:z.array(z.object({id:z.string().min(1).max(100),revision:z.number().int().positive()}).strict()).min(1).max(500),
}).strict().refine(v=>new Set(v.places.map(p=>p.id)).size===v.places.length,'Selecione cada lugar uma vez.');
export async function POST(req:Request,{params}:{params:Promise<{id:string}>}){return handle(async()=>{
 csrf(req);const input=inputSchema.parse(await readJson(req,80000));
 const {id}=await params,trip=await access(id,await identity(),true);
 if(input.date<trip.start_date||input.date>trip.end_date)throw new AppError(422,'Escolha uma data dentro da viagem.');
 // Materialize the matching revisions before updating any row. The count guard
 // makes the entire selection succeed or fail in one statement, including races.
 const result=await database().prepare(`
  WITH eligible AS MATERIALIZED (
   SELECT p.id FROM places p JOIN json_each(?) s
    ON p.id=json_extract(s.value,'$.id') AND p.revision=json_extract(s.value,'$.revision')
   WHERE p.trip_id=? AND p.date IS NULL AND json_extract(p.data,'$.date') IS NULL
    AND json_extract(p.data,'$.listId')=?
    AND EXISTS(SELECT 1 FROM place_lists WHERE id=? AND trip_id=?)
  )
  UPDATE places SET data=json_set(data,'$.date',?),date=?,revision=revision+1
  WHERE id IN (SELECT id FROM eligible) AND (SELECT COUNT(*) FROM eligible)=?
 `).bind(JSON.stringify(input.places),id,input.listId,input.listId,id,input.date,input.date,input.places.length).run();
 if(!result.meta.changes)throw new AppError(409,'A lista mudou. Nenhum lugar foi incluído nesta tentativa. Confira os lugares e selecione novamente.');
 return respond({scheduled:result.meta.changes,date:input.date});
});}
