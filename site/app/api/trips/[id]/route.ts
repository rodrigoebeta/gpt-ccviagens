import {z} from 'zod';
import {tripInput} from '@/lib/contracts';
import {assistantTrip,deleteAssistantTrip} from '@/lib/assistant-trips';
import {access,AppError,csrf,database,handle,identity,readJson,respond} from '@/lib/service';
export const dynamic='force-dynamic';
export async function GET(_:Request,{params}:{params:Promise<{id:string}>}){return handle(async()=>{const {id}=await params,data=await assistantTrip(id,await identity());return respond({...data,role:data.trip.role});});}
export async function DELETE(req:Request,{params}:{params:Promise<{id:string}>}){return handle(async()=>{csrf(req);const {id}=await params;const result=await deleteAssistantTrip(id,await identity(),await readJson(req,2000));return respond(result,result.retryRequired?202:200);});}
export async function PATCH(req:Request,{params}:{params:Promise<{id:string}>}){return handle(async()=>{
 const input=await readJson(req,100000);csrf(req);const {id}=await params;await access(id,await identity(),true);
 const {trip:t,base}=z.object({trip:tripInput,base:tripInput}).strict().parse(input);
 const db=database();
 // Keep the range check in the write itself, so an existing item cannot be hidden.
 const result=await db.prepare(`UPDATE trips SET name=?,start_date=?,end_date=?,destinations=?,destination_locations=?
 WHERE id=? AND name=? AND start_date=? AND end_date=? AND destinations=? AND destination_locations=?
 AND NOT EXISTS (SELECT 1 FROM reservations WHERE trip_id=? AND (start_date<? OR end_date>?))
 AND NOT EXISTS (SELECT 1 FROM places WHERE trip_id=? AND (date<? OR date>?))`)
 .bind(t.name,t.startDate,t.endDate,t.destinations,JSON.stringify(t.destinationLocations),id,base.name,base.startDate,base.endDate,base.destinations,JSON.stringify(base.destinationLocations),id,t.startDate,t.endDate,id,t.startDate,t.endDate).run();
 if(!result.meta.changes){
  const current=await db.prepare('SELECT name,start_date,end_date,destinations,destination_locations FROM trips WHERE id=?').bind(id).first<{name:string;start_date:string;end_date:string;destinations:string;destination_locations:string}>();
  if(!current||current.name!==base.name||current.start_date!==base.startDate||current.end_date!==base.endDate||current.destinations!==base.destinations||current.destination_locations!==JSON.stringify(base.destinationLocations))throw new AppError(409,'Esta viagem mudou em outra edição. Feche este formulário e atualize a página antes de tentar novamente.');
  throw new AppError(422,'Há reservas ou lugares agendados fora deste período. Mantenha essas datas na viagem ou ajuste os itens na programação antes de encurtar o período. Nenhum item foi alterado.');
 }
 return respond({saved:true});
});}
