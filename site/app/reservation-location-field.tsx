'use client';
import {useEffect,useId,useRef,useState} from 'react';
import {Check,LoaderCircle,MapPin,Search} from 'lucide-react';
import {Button} from '@/components/ui/button';
import type {ReservationData,Trip} from '@/lib/contracts';
import type {GeoResult} from '@/lib/geography';
type Point=NonNullable<ReservationData['locationPoint']>;
export default function ReservationLocationField({trip,day,label,value,point,hotelName,onChange,onSelect}:{trip:Trip;day:string;label:string;value:string;point?:Point;hotelName?:string;onChange:(value:string)=>void;onSelect:(point:Point)=>void}){
 const id=useId(),[open,setOpen]=useState(false),[query,setQuery]=useState(''),[results,setResults]=useState<GeoResult[]>([]),[busy,setBusy]=useState(false),[done,setDone]=useState(false),[error,setError]=useState('');
 const controller=useRef<AbortController|null>(null),epoch=useRef(0),queryInput=useRef<HTMLInputElement>(null);
 useEffect(()=>()=>{epoch.current++;controller.current?.abort();},[]);
 function invalidate(){epoch.current++;controller.current?.abort();setBusy(false);setResults([]);setDone(false);setError('');}
 function begin(){invalidate();setQuery((hotelName||value).slice(0,200));setOpen(true);requestAnimationFrame(()=>queryInput.current?.focus());}
 async function search(){invalidate();const run=epoch.current,abort=new AbortController();controller.current=abort;setBusy(true);
  try{const response=await fetch('/api/trips/'+trip.id+'/place-search',{method:'POST',headers:{'Content-Type':'application/json'},signal:abort.signal,body:JSON.stringify({query:query.trim(),...(day?{day}:{}),nearby:true})});const data=await response.json() as {results:GeoResult[];error?:string};if(!response.ok)throw Error(data.error||'Não foi possível buscar.');if(run!==epoch.current)return;
   setResults(data.results.filter(r=>r.osmId&&r.osmType&&r.address&&(hotelName===undefined||['hotel','hostel','guest_house','motel','apartment','resort','chalet'].includes(r.kind))));setDone(true);
  }catch(e){if(run===epoch.current&&!(e instanceof DOMException&&e.name==='AbortError'))setError((e as Error).message);}finally{if(run===epoch.current)setBusy(false);}
 }
 function choose(r:GeoResult){onSelect({name:r.name,address:r.address,latitude:r.latitude,longitude:r.longitude,osmType:r.osmType!,osmId:r.osmId!,kind:r.kind});invalidate();setOpen(false);}
 return <div className="reservation-location-field">
  <label htmlFor={id}>{label}</label><textarea id={id} rows={2} maxLength={1000} value={value} onChange={e=>{invalidate();onChange(e.target.value);}}/>
  <div className="reservation-location-actions"><Button type="button" variant="outline" onClick={begin}><Search/>{hotelName!==undefined?'Buscar hotel / conferir endereço':'Buscar local / conferir endereço'}</Button>{point&&<span className="reservation-location-selected" role="status"><Check/>Local selecionado no mapa <a href={'https://www.openstreetmap.org/'+point.osmType+'/'+point.osmId} target="_blank" rel="noreferrer">Ver ponto</a></span>}</div>
  {open&&<section className="reservation-location-search" aria-label={'Busca de '+label.toLowerCase()}>
   <label htmlFor={id+'-query'}>{hotelName!==undefined?'Nome do hotel e cidade':'Nome do local e cidade'}</label>
   <div className="reservation-search-row"><input ref={queryInput} id={id+'-query'} value={query} maxLength={200} onChange={e=>{invalidate();setQuery(e.target.value);}} onKeyDown={e=>{if(e.key==='Enter'){e.preventDefault();if(query.trim().length>=3&&!busy)void search();}}}/><Button type="button" variant="outline" disabled={busy||query.trim().length<3} onClick={()=>void search()}>{busy?<LoaderCircle className="spin"/>:<Search/>}Buscar</Button></div>
   <p className="muted">Confira o nome e a cidade antes de escolher. Prefira a grafia local; o endereço será preenchido ao selecionar.</p>
   {error&&<p className="form-error" role="alert">{error}</p>}
   {done&&!results.length&&<p role="status">Nenhum local correspondente. Tente o nome original e a cidade, ou mantenha o endereço digitado sem um ponto no mapa.</p>}
   {!!results.length&&<ul className="reservation-location-results">{results.map(r=><li key={r.osmType+':'+r.osmId}><button type="button" onClick={()=>choose(r)}><MapPin/><span><strong>{r.name}</strong><span>{r.address}</span></span><Check/></button></li>)}</ul>}
   <div className="reservation-search-footer"><a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">Photon · © OpenStreetMap</a><Button type="button" variant="ghost" onClick={()=>{invalidate();setOpen(false);}}>Fechar busca</Button></div>
  </section>}
 </div>;
}
