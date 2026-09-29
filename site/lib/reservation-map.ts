import type {Reservation} from './contracts';
import type {GeoPoint} from './geography';
export type MapKind=Reservation['kind'];
export type MapCandidate={key:string;reservationId:string;kind:MapKind;title:string;label:string;address:string;selectedPoint?:Reservation['locationPoint']};
export type ReservationMapPoint=MapCandidate&GeoPoint&{resolvedName:string};
type Booking=Pick<Reservation,'id'|'kind'|'title'|'location'|'destination'|'startDate'|'endDate'|'status'|'locationPoint'|'destinationPoint'>;
export type LocationState=MapCandidate&{status:'pending'|'processing'|'resolved'|'unresolved'|'temporary';point:ReservationMapPoint|null;note:string;retryAt:number};
export function allReservationCandidates(reservations:Booking[]):MapCandidate[]{
 return reservations.flatMap(r=>[...new Map([...reservationMapCandidates([r],r.startDate),...reservationMapCandidates([r],r.endDate)].map(c=>[c.key,c])).values()]);
}
export function reservationMapCandidates(reservations:Booking[],day:string):MapCandidate[]{
 return reservations.flatMap(r=>{
  if(r.status==='cancelled')return [];
  const kind=r.kind as MapKind;
  const point=(end:'stay'|'start'|'end',label:string,address?:string):MapCandidate=>{const selected=end==='end'?r.destinationPoint:r.locationPoint;return {key:r.id+':'+end,reservationId:r.id,kind,title:r.title,label,address:address?.trim()??'',...(selected&&selected.address===address&&(kind!=='hotel'||selected.name===r.title)?{selectedPoint:selected}:{})};};
  if(kind==='hotel')return r.startDate<=day&&r.endDate>=day?[point('stay','Hospedagem',r.location)]:[];
  if(kind==='activity')return r.locationPoint&&r.startDate<=day&&r.endDate>=day?[point('stay','Evento / atividade',r.location)]:[];
  return [...(r.startDate===day?[point('start',kind==='car'?'Retirada':'Partida',r.location)]:[]),...(r.endDate===day?[point('end',kind==='car'?'Devolução':'Chegada',r.destination)]:[])];
 });
}
