import type {Reservation} from './contracts';
import type {GeoPoint} from './geography';
export type MapKind='hotel'|'flight'|'train'|'bus';
export type MapCandidate={key:string;reservationId:string;kind:MapKind;title:string;label:string;address:string};
export type ReservationMapPoint=MapCandidate&GeoPoint&{resolvedName:string};
type Booking=Pick<Reservation,'id'|'kind'|'title'|'location'|'destination'|'startDate'|'endDate'|'status'>;
export type LocationState=MapCandidate&{status:'pending'|'processing'|'resolved'|'unresolved'|'temporary';point:ReservationMapPoint|null;note:string;retryAt:number};
export function allReservationCandidates(reservations:Booking[]):MapCandidate[]{
 return reservations.flatMap(r=>[...new Map([...reservationMapCandidates([r],r.startDate),...reservationMapCandidates([r],r.endDate)].map(c=>[c.key,c])).values()]);
}
export function reservationMapCandidates(reservations:Booking[],day:string):MapCandidate[]{
 return reservations.flatMap(r=>{
  if(r.status==='cancelled'||!['hotel','flight','train','bus'].includes(r.kind))return [];
  const kind=r.kind as MapKind;
  const point=(end:'stay'|'start'|'end',label:string,address?:string):MapCandidate=>({key:r.id+':'+end,reservationId:r.id,kind,title:r.title,label,address:address?.trim()??''});
  if(kind==='hotel')return r.startDate<=day&&r.endDate>=day?[point('stay','Hospedagem',r.location)]:[];
  return [...(r.startDate===day?[point('start','Partida',r.location)]:[]),...(r.endDate===day?[point('end','Chegada',r.destination)]:[])];
 });
}
