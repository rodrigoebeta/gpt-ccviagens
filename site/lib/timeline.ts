import type {Place,Reservation} from './contracts';
export const orderedPlaces=(places:Place[],day:string,ids:string[]=[])=>{
 const ranks=new Map(ids.map((id,i)=>[id,i]));
 return places.filter(p=>p.date===day).sort((a,b)=>(ranks.get(a.id)??Infinity)-(ranks.get(b.id)??Infinity)||(a.time??'99').localeCompare(b.time??'99')||a.position-b.position||a.id.localeCompare(b.id));
};
export type TimelineEvent={id:string;time?:string;label:string;reservation?:Reservation;place?:Place;number?:number;order:number};
export function dayTimeline(reservations:Reservation[],places:Place[],day:string,ids:string[]=[]):TimelineEvent[]{
 const events:TimelineEvent[]=[];
 for(const r of reservations){
  if(r.status==='cancelled')continue;
  if(r.kind==='hotel'){
   if(r.startDate===day)events.push({id:r.id+'-in',time:r.startTime,label:'Check-in',reservation:r,order:0});
   if(r.endDate===day)events.push({id:r.id+'-out',time:r.endTime,label:'Check-out',reservation:r,order:0});
  }else{
   const label=r.kind==='train'?'Trem':r.kind==='flight'?'Voo':r.kind==='bus'?'Ônibus':'Atividade';
   if(r.startDate===day)events.push({id:r.id+'-start',time:r.startTime,label,reservation:r,order:0});
   if(r.endDate===day&&r.endDate!==r.startDate)events.push({id:r.id+'-end',time:r.endTime,label:'Chegada / fim · '+label,reservation:r,order:0});
  }
 }
 orderedPlaces(places,day).forEach((p,i)=>events.push({id:p.id,time:p.time??undefined,label:'Lugar',place:p,number:i+1,order:p.position}));
 // Before the first manual arrangement, preserve the previous chronological view.
 // Once saved, order is independent of times. New items append; missing items disappear.
 const baseline=events.sort((a,b)=>(a.time??'99').localeCompare(b.time??'99')||a.order-b.order||a.id.localeCompare(b.id));
 const ranks=new Map(mergeEventOrder(ids,baseline.map(e=>e.id)).map((id,i)=>[id,i]));
 const sorted=baseline.sort((a,b)=>ranks.get(a.id)!-ranks.get(b.id)!);
 let number=0;return sorted.map(e=>e.place?{...e,number:++number}:e);
}
export function mergeEventOrder(saved:string[],current:string[]):string[]{
 const allowed=new Set(current),seen=new Set<string>();
 return [...saved,...current].filter(id=>{if(!allowed.has(id)||seen.has(id))return false;seen.add(id);return true;});
}

// Remove obsolete saved ranks for the returning place before inserting it.
export function insertEventAt(current:string[],id:string,index:number):string[]{
 const ids=current.filter(value=>value!==id);
 ids.splice(Math.max(0,Math.min(index,ids.length)),0,id);
 return ids;
}
