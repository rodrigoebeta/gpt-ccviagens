import {writableInstallation} from '@/lib/service';
import {z} from 'zod';
import {access,csrf,database,handle,identity,readJson,respond,AppError,listReservations} from '@/lib/service';
import {dateValue,placeInput,type Reservation} from '@/lib/contracts';
import {dayTimeline} from '@/lib/timeline';
export const dynamic='force-dynamic';
type Context={params:Promise<{id:string}>};
async function currentIds(tripId:string,day:string){
 const [reservations,rows]=await Promise.all([listReservations(tripId),database().prepare('SELECT id,data,position,revision FROM places WHERE trip_id=? AND date=?').bind(tripId,day).all<{id:string;data:string;position:number;revision:number}>()]);
 const places=rows.results.map(p=>({...placeInput.parse(JSON.parse(p.data)),id:p.id,position:p.position,revision:p.revision}));
 return dayTimeline(reservations as Reservation[],places,day).map(e=>e.id);
}
export async function GET(req:Request,{params}:Context){return handle(async()=>{
 const {id}=await params,trip=await access(id,await identity()),day=dateValue.parse(new URL(req.url).searchParams.get('day'));
 if(day<trip.start_date||day>trip.end_date)throw new AppError(422,'Escolha um dia dentro da viagem.');
 const row=await database().prepare('SELECT event_ids,revision FROM day_orders WHERE trip_id=? AND day=?').bind(id,day).first<{event_ids:string;revision:number}>();
 // Return only saved ranks. The client also has the current events and merges new arrivals.
 return respond({ids:row?JSON.parse(row.event_ids):[],currentIds:await currentIds(id,day),revision:row?.revision??0});
});}
export async function POST(req:Request,{params}:Context){return handle(async()=>{
 csrf(req);await writableInstallation(req.url);const input=z.object({day:dateValue,revision:z.number().int().min(0),ids:z.array(z.string().min(1).max(200)).max(2000)}).strict().parse(await readJson(req,450000));
 const {id}=await params,trip=await access(id,await identity(),true);
 if(input.day<trip.start_date||input.day>trip.end_date)throw new AppError(422,'Escolha um dia dentro da viagem.');
 const current=await currentIds(id,input.day),sent=new Set(input.ids);
 if(sent.size!==input.ids.length||current.length!==input.ids.length||current.some(key=>!sent.has(key)))throw new AppError(409,'Os itens do dia mudaram. Atualize a programação e tente novamente.');
 const db=database(),encoded=JSON.stringify(input.ids);
 const result=input.revision===0
  ?await db.prepare('INSERT INTO day_orders (trip_id,day,event_ids,revision) VALUES (?,?,?,1) ON CONFLICT(trip_id,day) DO NOTHING').bind(id,input.day,encoded).run()
  :await db.prepare('UPDATE day_orders SET event_ids=?,revision=revision+1 WHERE trip_id=? AND day=? AND revision=?').bind(encoded,id,input.day,input.revision).run();
 if(!result.meta.changes)throw new AppError(409,'A ordem mudou em outra edição. Atualize a programação antes de reorganizar.');
 return respond({ids:input.ids,revision:input.revision+1});
});}
