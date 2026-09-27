import {database} from './service';
import {destinationRefs,unambiguousPoint,stationReference,unambiguousStation,type Anchor,type GeoPoint} from './geography';
import {searchPhoton} from './photon';
type Booking={kind:string;title:string;location?:string;destination?:string;startDate:string;endDate:string};
export async function searchContext(tripId:string,day?:string){
 const db=database(),row=await db.prepare('SELECT destination_locations FROM trips WHERE id=?').bind(tripId).first<{destination_locations:string}>();
 const destinations=destinationRefs(row?.destination_locations),anchors:Anchor[]=destinations.map(d=>({...d,label:d.name,tier:2}));
 let fallback='';
 if(!day)return {anchors,fallback};
 const [reservations,places]=await Promise.all([
  db.prepare("SELECT data FROM reservations WHERE trip_id=? AND status!='cancelled' AND start_date<=? AND end_date>=? ORDER BY start_date DESC,id").bind(tripId,day,day).all<{data:string}>(),
  db.prepare('SELECT data FROM places WHERE trip_id=? AND date=? ORDER BY position,id').bind(tripId,day).all<{data:string}>()
 ]);
 for(const p of places.results){const v=JSON.parse(p.data) as GeoPoint&{name:string};if(Number.isFinite(v.latitude)&&Number.isFinite(v.longitude))anchors.push({...v,label:v.name,tier:1});}
 const bookings=reservations.results.map(r=>JSON.parse(r.data) as Booking),hotels=bookings.filter(r=>r.kind==='hotel'&&r.location?.trim());
 // Resolve one address per search at most; all other anchors already have coordinates.
 // Prefer the arrival stay on changeover days; exclude cancelled and other-day stays.
 const hotel=hotels[0],other=bookings.find(r=>r.kind!=='hotel'&&((r.startDate===day&&r.location)||(r.endDate===day&&r.destination)));
 const address=hotel?.location??(other?.startDate===day?other?.location:other?.destination);
 if(address&&(hotel||!anchors.some(a=>a.tier===1))){
  try{
   const station=!hotel&&other?.kind==='train'?stationReference(address):null;
   const query=(station?.query??(hotel?hotel.title+' '+address:address)).slice(0,200),results=await searchPhoton(query,{stations:!!station,bias:destinations[0],waitForGate:true}),point=station?unambiguousStation(results,station.name):unambiguousPoint(results,query,hotel?.title);
   if(point)anchors.push({...point,label:hotel?hotel.title:station?'Estação '+point.name:address,tier:hotel?0:1});
   else fallback=hotel?'Não foi possível identificar a hospedagem com segurança; usando o roteiro e os destinos disponíveis.':'Não foi possível identificar o local da reserva com segurança; usando os destinos disponíveis, se houver.';
  }catch{fallback=hotel?'Localização da hospedagem indisponível; usando o roteiro e os destinos disponíveis.':'Localização da reserva indisponível; usando os destinos disponíveis, se houver.';}
 }
 return {anchors:anchors.sort((a,b)=>a.tier-b.tier),fallback};
}
