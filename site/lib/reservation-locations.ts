import {database,AppError} from './service';
import type {Reservation} from './contracts';
import {allReservationCandidates,type LocationState} from './reservation-map';
import {destinationRefs} from './geography';
import {resolveMapPoint} from './resolve-map-point';
type Row={key:string;input_hash:string;status:LocationState['status'];point:string|null;note:string;lease_until:number;retry_at:number};
async function snapshot(tripId:string,reservationId?:string){
 const db=database(),rows=await db.prepare('SELECT id,data,status,fingerprint FROM reservations WHERE trip_id=?'+(reservationId?' AND id=?':'')).bind(...(reservationId?[tripId,reservationId]:[tripId])).all<{id:string;data:string;status:Reservation['status'];fingerprint:string}>();
 const trip=await db.prepare('SELECT destination_locations FROM trips WHERE id=?').bind(tripId).first<{destination_locations:string}>();
 const bias=destinationRefs(trip?.destination_locations)[0];
 const inputs=await Promise.all(rows.results.flatMap(r=>allReservationCandidates([{...JSON.parse(r.data),id:r.id,status:r.status}]).map(async candidate=>{
  const bytes=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(JSON.stringify({v:1,candidate,bias})));
  return {candidate,hash:[...new Uint8Array(bytes)].map(b=>b.toString(16).padStart(2,'0')).join(''),fingerprint:r.fingerprint};
 })));
 // Compare the source version inside SQL so an older request cannot reset a newer edit.
 if(inputs.length)await db.batch(inputs.map(({candidate:c,hash,fingerprint})=>db.prepare(`INSERT INTO reservation_locations (key,trip_id,reservation_id,input_hash,status,note) SELECT ?,?,?,?,'pending','' WHERE EXISTS(SELECT 1 FROM reservations WHERE id=? AND trip_id=? AND fingerprint=? AND status!='cancelled') ON CONFLICT(key) DO UPDATE SET input_hash=excluded.input_hash,status='pending',point=NULL,note='',lease=NULL,lease_until=0,retry_at=0 WHERE reservation_locations.input_hash!=excluded.input_hash`).bind(c.key,tripId,c.reservationId,hash,c.reservationId,tripId,fingerprint)));
 await db.prepare("DELETE FROM reservation_locations WHERE trip_id=? AND reservation_id IN (SELECT id FROM reservations WHERE trip_id=? AND (status='cancelled' OR kind NOT IN ('hotel','flight','train','bus')))").bind(tripId,tripId).run();
 return {inputs,bias};
}
export async function listLocations(tripId:string):Promise<LocationState[]>{
 const {inputs}=await snapshot(tripId),rows=await database().prepare('SELECT * FROM reservation_locations WHERE trip_id=?').bind(tripId).all<Row>();
 return inputs.map(({candidate,hash})=>{const row=rows.results.find(r=>r.key===candidate.key&&r.input_hash===hash);return {...candidate,status:!row||row.status==='processing'&&row.lease_until<Date.now()?'pending':row.status,point:row?.point?JSON.parse(row.point):null,note:row?.note??'',retryAt:row?.retry_at??0};});
}
export async function locateReservationPoint(tripId:string,key:string,retry=false){
 const {inputs,bias}=await snapshot(tripId,key.slice(0,key.lastIndexOf(':'))),input=inputs.find(i=>i.candidate.key===key);
 if(!input)throw new AppError(404,'Este ponto não pertence às reservas ativas da viagem.');
 const db=database(),now=Date.now(),lease=crypto.randomUUID();
 const claimed=await db.prepare(`UPDATE reservation_locations SET status='processing',lease=?,lease_until=?,note='' WHERE key=? AND trip_id=? AND input_hash=? AND ((status='pending') OR (status='processing' AND lease_until<?) OR (?=1 AND status IN ('unresolved','temporary') AND retry_at<=?)) RETURNING key`).bind(lease,now+30000,key,tripId,input.hash,now,retry?1:0,now).first();
 if(!claimed)return;
 let status:LocationState['status']='unresolved',point=null,note='',retryAt=0;
 try{point=await resolveMapPoint(input.candidate,bias);status=point?'resolved':'unresolved';note=point?'':input.candidate.address?'Não foi possível confirmar a localização. Confira o nome e o endereço na reserva.':'Informe o local na reserva para mostrá-lo no mapa.';retryAt=Date.now()+2000;}
 catch(e){status='temporary';note=e instanceof AppError?e.message:'Não foi possível consultar o serviço agora. Tente novamente mais tarde.';retryAt=Date.now()+60000;}
 // A late response must never replace the result of an edited/cancelled reservation.
 await db.prepare(`UPDATE reservation_locations SET status=?,point=?,note=?,retry_at=?,lease=NULL,lease_until=0 WHERE key=? AND trip_id=? AND input_hash=? AND lease=? AND EXISTS(SELECT 1 FROM reservations WHERE id=? AND fingerprint=? AND status!='cancelled')`).bind(status,point?JSON.stringify(point):null,note,retryAt,key,tripId,input.hash,lease,input.candidate.reservationId,input.fingerprint).run();
}
export async function locateImportedReservation(tripId:string,reservationId:string){
 const {inputs}=await snapshot(tripId,reservationId);
 for(const {candidate} of inputs)await locateReservationPoint(tripId,candidate.key);
}
