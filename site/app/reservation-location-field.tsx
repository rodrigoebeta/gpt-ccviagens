'use client';
import {useEffect,useId,useRef,useState} from 'react';
import {Check,LoaderCircle,Search} from 'lucide-react';
import {Button} from '@/components/ui/button';
import type {ReservationData,Trip} from '@/lib/contracts';
import type {GeoResult} from '@/lib/geography';
type Point=NonNullable<ReservationData['locationPoint']>;
export default function ReservationLocationField({trip,day,label,value,point,hotelName,onChange,onSelect}:{trip:Trip;day:string;label:string;value:string;point?:Point;hotelName?:string;onChange:(value:string)=>void;onSelect:(point:Point)=>void}){
 const id=useId(),[open,setOpen]=useState(false),[query,setQuery]=useState(''),[results,setResults]=useState<GeoResult[]>([]),[busy,setBusy]=useState(false),[done,setDone]=useState(false),[error,setError]=useState('');
 const controller=useRef<AbortController|null>(null),epoch=useRef(0),queryInput=useRef<HTMLInputElement>(null),searchTrigger=useRef<HTMLButtonElement>(null);
 useEffect(()=>()=>{epoch.current++;controller.current?.abort();},[]);
 function invalidate(){epoch.current++;controller.current?.abort();setBusy(false);setResults([]);setDone(false);setError('');}
 function begin(){invalidate();setQuery((value||hotelName||'').slice(0,200));setOpen(true);requestAnimationFrame(()=>queryInput.current?.focus());}
 async function search(){invalidate();const run=epoch.current,abort=new AbortController();controller.current=abort;setBusy(true);
  try{const response=await fetch('/api/trips/'+trip.id+'/place-search',{method:'POST',headers:{'Content-Type':'application/json'},signal:abort.signal,body:JSON.stringify({query:query.trim(),...(day?{day}:{}),nearby:true})});const data=await response.json() as {results:GeoResult[];error?:string};if(!response.ok)throw Error(data.error||'Não foi possível buscar.');if(run!==epoch.current)return;
   setResults(data.results.filter(r=>r.osmId&&r.osmType&&r.address));setDone(true);
  }catch(e){if(run===epoch.current&&!(e instanceof DOMException&&e.name==='AbortError'))setError((e as Error).message);}finally{if(run===epoch.current)setBusy(false);}
 }
 function close(){invalidate();setOpen(false);requestAnimationFrame(()=>searchTrigger.current?.focus({preventScroll:true}));}
 function choose(r:GeoResult){onSelect({name:r.name,address:r.address,latitude:r.latitude,longitude:r.longitude,osmType:r.osmType!,osmId:r.osmId!,kind:r.kind});close();}
 return <div className="reservation-location-field">
  <label htmlFor={id}>{label}</label><textarea id={id} rows={2} maxLength={1000} value={value} onChange={e=>{invalidate();onChange(e.target.value);}}/>
  {(!open||point)&&<div className="reservation-location-actions">{point&&<span className="reservation-location-selected" role="status"><Check/>Local selecionado <a href={'https://www.openstreetmap.org/'+point.osmType+'/'+point.osmId} target="_blank" rel="noreferrer">Ver no mapa</a></span>}{!open&&<Button ref={searchTrigger} type="button" variant={point?'ghost':'outline'} onClick={begin}>{!point&&<Search/>}{point?'Alterar local':'Buscar nome ou endereço'}</Button>}</div>}
  {open&&<section className="reservation-location-search" aria-label={'Busca de '+label.toLowerCase()}>
   <div className="reservation-search-heading"><label htmlFor={id+'-query'}>Nome ou endereço</label><Button type="button" variant="ghost" onClick={close}>Fechar busca</Button></div>
   <div className="reservation-search-query">
    <div className="reservation-search-row"><input ref={queryInput} id={id+'-query'} aria-describedby={id+'-hint'} value={query} maxLength={200} onChange={e=>{invalidate();setQuery(e.target.value);}} onKeyDown={e=>{if(e.key==='Enter'){e.preventDefault();if(query.trim().length>=3&&!busy)void search();}}}/><Button type="button" variant="outline" disabled={busy||query.trim().length<3} onClick={()=>void search()}>{busy?<LoaderCircle className="spin"/>:<Search/>}{busy?'Buscando…':'Buscar'}</Button></div>
    <p className="muted" id={id+'-hint'}>Use o nome e a cidade, ou rua, número e cidade.</p>
   </div>
   {busy&&<p className="sr-only" role="status">Buscando locais…</p>}
   {error&&<p className="form-error" role="alert">{error}</p>}
   {done&&!results.length&&<div className="reservation-search-empty" role="status"><strong>Nenhum local encontrado</strong><p>Tente outra grafia ou mantenha o endereço sem ponto no mapa.</p></div>}
   {!!results.length&&<div className="reservation-search-matches"><p className="reservation-search-results-heading" role="status">{results.length} {results.length===1?'resultado':'resultados'} · Confira o endereço antes de escolher.</p><ul className="reservation-location-results">{results.map(r=><li key={r.osmType+':'+r.osmId}><strong>{r.name}</strong><p>{r.address}</p><Button type="button" variant="outline" aria-label={'Usar este local: '+r.name} onClick={()=>choose(r)}>Usar este local</Button></li>)}</ul></div>}
   <a className="reservation-search-attribution" href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">Photon · © OpenStreetMap</a>
  </section>}
 </div>;
}
