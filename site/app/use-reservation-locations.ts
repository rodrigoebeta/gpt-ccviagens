'use client';
import {useEffect,useState} from 'react';
import type {LocationState} from '@/lib/reservation-map';
export function useReservationLocations(tripId:string,refreshKey:number){
 const [locations,setLocations]=useState<LocationState[]>([]),[error,setError]=useState(''),[busy,setBusy]=useState(false),[reload,setReload]=useState(0);
 useEffect(()=>{
  const controller=new AbortController();let active=true;let timer:ReturnType<typeof setTimeout>|undefined;
  setLocations([]);setError('');
  async function read(body?:unknown){const r=await fetch('/api/trips/'+tripId+'/locations',{method:body?'POST':'GET',headers:body?{'Content-Type':'application/json'}:undefined,body:body?JSON.stringify(body):undefined,signal:controller.signal});const data=await r.json() as {locations:LocationState[];error?:string};if(!r.ok)throw Error(data.error||'Não foi possível conferir as localizações.');return data.locations;}
  async function step(){try{
   let rows=await read();if(!active)return;setLocations(rows);
   const pending=rows.find(r=>r.status==='pending');
   if(pending){rows=await read({key:pending.key});if(!active)return;setLocations(rows);}
   if(rows.some(r=>r.status==='pending'||r.status==='processing'))timer=setTimeout(step,2200);
  }catch(e){if(active)setError((e as Error).message);}}
  void step();return()=>{active=false;controller.abort();if(timer)clearTimeout(timer);};
 },[tripId,refreshKey,reload]);
 async function retry(key:string){if(busy)return;setBusy(true);setError('');try{const r=await fetch('/api/trips/'+tripId+'/locations',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({key,retry:true})});const data=await r.json() as {error?:string};if(!r.ok)throw Error(data.error||'Não foi possível tentar novamente.');setReload(n=>n+1);}catch(e){setError((e as Error).message);}finally{setBusy(false);}}
 return {locations,error,busy,retry,refresh:()=>setReload(n=>n+1)};
}
