import {writableInstallation} from '@/lib/service';
import {z} from 'zod';
import {dateValue,type Reservation} from '@/lib/contracts';
import {access,AppError,csrf,database,handle,identity,readJson,respond} from '@/lib/service';
import {destinationRefs} from '@/lib/geography';
import {reservationMapCandidates} from '@/lib/reservation-map';
import {resolveMapPoint} from '@/lib/resolve-map-point';
export const dynamic='force-dynamic';
export async function POST(req:Request,{params}:{params:Promise<{id:string}>}){return handle(async()=>{
 csrf(req);await writableInstallation(req.url);const {day,key}=z.object({day:dateValue,key:z.string().min(1).max(400)}).strict().parse(await readJson(req,2000));
 const {id}=await params,trip=await access(id,await identity());
 if(day<trip.start_date||day>trip.end_date)throw new AppError(422,'Escolha um dia dentro da viagem.');
 const db=database(),rows=await db.prepare("SELECT id,data,status FROM reservations WHERE trip_id=? AND status!='cancelled' AND start_date<=? AND end_date>=?").bind(id,day,day).all<{id:string;data:string;status:Reservation['status']}>();
 const candidates=reservationMapCandidates(rows.results.map(r=>({...JSON.parse(r.data),id:r.id,status:r.status})),day),candidate=candidates.find(p=>p.key===key);
 if(!candidate)throw new AppError(404,'Este ponto não pertence às reservas deste dia. Atualize a programação.');
 const row=await db.prepare('SELECT destination_locations FROM trips WHERE id=?').bind(id).first<{destination_locations:string}>();
 const point=await resolveMapPoint(candidate,destinationRefs(row?.destination_locations)[0]);
 return respond({point,note:point?'':candidate.address?'Localização não identificada com segurança. Confira o nome e o endereço na reserva.':'Local não informado na reserva.'});
});}
