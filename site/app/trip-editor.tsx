'use client';

import {useEffect,useRef,useState,type FormEvent} from 'react';

import {Check,LoaderCircle,Trash2,TriangleAlert} from 'lucide-react';

import {Button} from '@/components/ui/button';

import {Dialog,DialogContent,DialogHeader,DialogTitle,DialogDescription} from '@/components/ui/dialog';

import {DateField} from './date-time-fields';

import {tripInput,type Trip} from '@/lib/contracts';

import DestinationPicker from './destination-picker';
import TripDeleteDialog,{type TripDeletionResult} from './trip-delete-dialog';

type PeriodItem={id:string;name:string;startDate:string;endDate:string;kind:'reservation'|'place'};



export default function TripEditor({trip,onClose,onSaved,onDeleted}:{trip:Trip;onClose:()=>void;onSaved:(updated:Trip)=>void;onDeleted:(result:TripDeletionResult)=>void}){

 const [busy,setBusy]=useState(false),[error,setError]=useState('');
 const [confirmDelete,setConfirmDelete]=useState(false),deleteTrigger=useRef<HTMLButtonElement>(null),removed=useRef(false);

 const [start,setStart]=useState(trip.start_date),[end,setEnd]=useState(trip.end_date),[items,setItems]=useState<PeriodItem[]|null>(null),[periodError,setPeriodError]=useState(''),[retry,setRetry]=useState(0);

 const [destinations,setDestinations]=useState(trip.destinationLocations??[]),[legacy,setLegacy]=useState(trip.destinations.split(' · ').filter(name=>!trip.destinationLocations?.some(d=>d.name===name)).join(' · '));

 useEffect(()=>{let active=true;setPeriodError('');fetch('/api/trips/'+trip.id+'/period-items').then(async r=>{const d=await r.json() as {error?:string;items:PeriodItem[]};if(!r.ok)throw Error(d.error||'Não foi possível conferir os itens da viagem.');if(active)setItems(d.items);}).catch(e=>{if(active)setPeriodError((e as Error).message);});return()=>{active=false;};},[trip.id,retry]);

 const outside=start&&end&&start<=end?(items??[]).filter(i=>i.startDate<start||i.endDate>end):[];

 const returnFocus=useRef(typeof document==='undefined'?null:document.activeElement as HTMLElement|null);

 async function save(e:FormEvent<HTMLFormElement>){

  e.preventDefault();if(busy||confirmDelete||!items||outside.length)return;setError('');const fields=new FormData(e.currentTarget),parsed=tripInput.safeParse({...Object.fromEntries(fields),destinations:[legacy,...destinations.map(d=>d.name)].filter(Boolean).join(' · '),destinationLocations:destinations});

  if(!parsed.success){setError('Confira o nome e as datas. O fim deve ser igual ou posterior ao início, com período de até um ano.');return;}

  setBusy(true);const data=parsed.data;

  try{

   const response=await fetch('/api/trips/'+trip.id,{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({trip:data,base:{name:trip.name,startDate:trip.start_date,endDate:trip.end_date,destinations:trip.destinations,destinationLocations:trip.destinationLocations??[]}})});

   const result=await response.json() as {error?:string};if(!response.ok)throw Error(result.error||'Não foi possível salvar a viagem.');

   onSaved({...trip,name:data.name,start_date:data.startDate,end_date:data.endDate,destinations:data.destinations,destinationLocations:data.destinationLocations});onClose();

  }catch(e){setError((e as Error).message);}finally{setBusy(false);}

 }

 return <Dialog open onOpenChange={open=>!open&&!busy&&!confirmDelete&&onClose()}><DialogContent className="travel-dialog trip-edit-dialog" onCloseAutoFocus={e=>{e.preventDefault();if(removed.current)(document.getElementById('trips-title')??document.getElementById('main'))?.focus();else returnFocus.current?.focus();}}><DialogHeader><DialogTitle>Editar viagem</DialogTitle><DialogDescription>Atualize o nome, o período e os destinos desta viagem.</DialogDescription></DialogHeader>

  <form className="form-stack" onSubmit={save}><div className="trip-edit-scroll"><fieldset disabled={busy} className="trip-edit-fields">

   <label>Nome da viagem<input name="name" required maxLength={300} defaultValue={trip.name}/></label>

   <div className="form-pair"><DateField label="Início" name="startDate" required value={start} onChange={setStart}/><DateField label="Fim" name="endDate" required value={end} onChange={setEnd}/></div>

   <p className="trip-edit-preservation">Reservas, lugares, documentos e convidados serão mantidos. Alterar o período não muda as datas das reservas nem dos lugares agendados.</p>

   {outside.length>0&&<div className="period-warning" role="alert"><TriangleAlert/><div><strong>{outside.length===1?'Um item ficaria fora da viagem':`${outside.length} itens ficariam fora da viagem`}</strong><p>Nenhuma reserva será apagada. Para salvar, mantenha esses dias no período ou ajuste os itens na programação primeiro.</p><ul>{outside.slice(0,5).map(i=><li key={i.kind+i.id}>{i.kind==='reservation'?'Reserva':'Lugar'}: {i.name} · {i.startDate.split('-').reverse().join('/')}{i.endDate!==i.startDate?' — '+i.endDate.split('-').reverse().join('/'):''}</li>)}</ul>{outside.length>5&&<p>E mais {outside.length-5} itens.</p>}</div></div>}

   {!items&&!periodError&&<p className="place-help" role="status">Conferindo reservas e lugares…</p>}

   {periodError&&<p role="alert" className="form-error">{periodError} <button type="button" className="text-button" onClick={()=>setRetry(n=>n+1)}>Tentar novamente</button></p>}

   <DestinationPicker value={destinations} onChange={next=>{setDestinations(next);setLegacy(old=>old.split(' · ').filter(name=>!next.some(d=>d.name===name)).join(' · '));}} legacy={legacy} onLegacyChange={setLegacy}/>

  </fieldset></div>

  <div className="trip-edit-footer">{error&&<p role="alert" className="form-error">{error}</p>}

   <div className="trip-edit-footer-actions">{trip.role==='owner'&&<Button ref={deleteTrigger} type="button" variant="ghost" className="trip-delete-trigger" disabled={busy} onClick={()=>setConfirmDelete(true)}><Trash2 aria-hidden="true"/>Excluir viagem</Button>}<div className="trip-edit-actions"><Button type="button" variant="ghost" disabled={busy} onClick={onClose}>Cancelar</Button><Button type="submit" className="primary" disabled={busy||!items||outside.length>0}>{busy?<LoaderCircle className="spin"/>:<Check/>}{busy?'Salvando…':'Salvar alterações'}</Button></div></div>

  </div></form>

 {confirmDelete&&<TripDeleteDialog trip={{id:trip.id,name:trip.name}} onCancel={()=>setConfirmDelete(false)} returnFocus={()=>deleteTrigger.current?.focus()} onDeleted={result=>{removed.current=true;onDeleted(result);}}/>}
 </DialogContent></Dialog>;

}
