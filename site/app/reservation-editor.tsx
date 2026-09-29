'use client';
import {useRef,useState,type FormEvent} from 'react';
import {ArrowLeft,Check,ChevronRight,Hotel,LoaderCircle,Plane,Ticket} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {DateField,TimeField} from './date-time-fields';
import {Dialog,DialogContent,DialogHeader,DialogTitle,DialogDescription} from '@/components/ui/dialog';
import type {Reservation,ReservationData,Trip} from '@/lib/contracts';
import {reservationLabels} from '@/lib/reservation-kinds';
import ReservationLocationField from './reservation-location-field';
import TimezoneField from './timezone-field';
import {FlightIdentityFields,FlightAirportFields,FlightTicketsField} from './flight-fields';
import {cleanFlightDetails,flightTitle} from '@/lib/flight-details';
import {fillAirport} from '@/lib/airport-autofill';
import ReservationDocumentsField,{type PendingDocument} from './reservation-documents-field';
import {readDocumentBase64} from '@/lib/document-upload';
type Draft=Omit<ReservationData,'sourceKey'|'sources'>;
export default function ReservationEditor({reservation:r,trip,day,onClose,onSaved}:{reservation?:Reservation;trip:Trip;day?:string;onClose:()=>void;onSaved:()=>Promise<void>}){
 const [busy,setBusy]=useState(false),[error,setError]=useState(''),[chosen,setChosen]=useState(!!r),[requestId]=useState(()=>crypto.randomUUID());
 const [documents,setDocuments]=useState<PendingDocument[]>([]);
 const lock=useRef(false),heading=useRef<HTMLHeadingElement>(null),trigger=useRef<HTMLElement|null>(typeof document!=='undefined'?document.activeElement as HTMLElement:null);
 const categoryButtons=useRef<Partial<Record<'hotel'|'flight'|'activity',HTMLButtonElement|null>>>({});
 const [draft,setDraft]=useState<Draft>(()=>({kind:r?.kind??'hotel',title:r?.title??'',startDate:r?.startDate??day??trip.start_date,endDate:r?.endDate??day??trip.start_date,startTime:r?.startTime,endTime:r?.endTime,timezone:r?.timezone??r?.endTimezone,endTimezone:r?.endTimezone,location:r?.location??'',destination:r?.destination??'',confirmation:r?.confirmation??'',travelers:r?.travelers??[],notes:r?.notes??'',locationPoint:r?.locationPoint,destinationPoint:r?.destinationPoint,flight:r?.flight}));
 const flight=draft.kind==='flight',hotel=draft.kind==='hotel',activity=draft.kind==='activity',car=draft.kind==='car',transport=!hotel&&!activity;
 const start=hotel?'check-in':car?'retirada':transport?'partida':'início',end=hotel?'check-out':car?'devolução':transport?'chegada':'fim';
 function update(patch:Partial<Draft>){setDraft(d=>({...d,...patch}));}
 function choose(kind:Draft['kind']){update({kind,...(kind!=='flight'?{flight:undefined}:{}),locationPoint:undefined,destinationPoint:undefined,...(kind==='hotel'||kind==='activity'?{destination:undefined}:{})});setChosen(true);setError('');requestAnimationFrame(()=>heading.current?.focus());}
 function changeCategory(){if(lock.current)return;setChosen(false);setError('');requestAnimationFrame(()=>categoryButtons.current[hotel?'hotel':activity?'activity':'flight']?.focus());}
 async function save(e:FormEvent<HTMLFormElement>){e.preventDefault();if(lock.current)return;lock.current=true;setBusy(true);setError('');
  const flightData=flight?cleanFlightDetails(draft.flight):undefined;
  const data:Draft={...draft,flight:flightData,title:draft.title.trim()||(flight?flightTitle(flightData).slice(0,300):''),travelers:draft.travelers.map(t=>t.trim()).filter(Boolean),...(hotel?{endTimezone:draft.timezone,destination:undefined,destinationPoint:undefined}:{}),startTime:draft.startTime||undefined,endTime:draft.endTime||undefined};
  try{const attachments=[];if(!r)for(const {file} of documents)attachments.push({filename:file.name,label:file.name,mime:file.type,base64:await readDocumentBase64(file)});
   const response=await fetch('/api/trips/'+trip.id+'/reservations'+(r?'/'+r.id:''),{method:r?'PATCH':'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(r?{reservation:{...data,sourceKey:r.sourceKey,sources:r.sources},baseFingerprint:r.fingerprint}:{requestId,reservation:data,documents:attachments})});const result=await response.json() as {error?:string};if(!response.ok)throw Error(result.error||'Não foi possível salvar.');await onSaved();onClose();}catch(e){setError((e as Error).message);}finally{lock.current=false;setBusy(false);}
 }
 const travelerCount=draft.travelers.filter(t=>t.trim()).length;
 const extraSummary=[draft.confirmation?.trim()?'Referência preenchida':'',travelerCount?travelerCount+' viajante'+(travelerCount===1?'':'s'):'',draft.notes?.trim()?'Anotações preenchidas':''].filter(Boolean).join(' · ');
 return <Dialog open onOpenChange={v=>!v&&!busy&&onClose()}><DialogContent className="travel-dialog reservation-edit-dialog" onOpenAutoFocus={e=>{if(r){e.preventDefault();heading.current?.focus({preventScroll:true});}}} onCloseAutoFocus={e=>{e.preventDefault();trigger.current?.focus();}}><DialogHeader className={chosen&&!r?'reservation-header-with-back':undefined}>
  {chosen&&!r&&<div className="reservation-header-navigation"><Button type="button" variant="ghost" className="reservation-category-back" disabled={busy} onClick={changeCategory}><ArrowLeft aria-hidden="true"/>Trocar categoria</Button></div>}
  <DialogTitle ref={heading} tabIndex={-1}>{!chosen?'Adicionar reserva':r?'Editar '+(hotel?'hospedagem':activity?'evento ou atividade':flight?'voo':'transporte'):'Adicionar '+(hotel?'hospedagem':activity?'evento ou atividade':flight?'voo':'transporte')}</DialogTitle><DialogDescription>{!chosen?'Qual tipo de reserva você quer guardar?':r?'Ajuste sua programação. Os comprovantes e o histórico serão preservados.':'Guarde os dados que você já tem. Isso não faz uma compra ou reserva no fornecedor.'}</DialogDescription></DialogHeader>
 {!chosen?<div className="reservation-category-picker">{[{kind:'hotel' as const,label:'Hospedagem',description:'Hotel, pousada, apartamento ou hostel',Icon:Hotel},{kind:'flight' as const,label:'Transporte',description:'Voo, trem, ônibus, carro, transfer ou ferry',Icon:Plane},{kind:'activity' as const,label:'Evento ou atividade',description:'Show, festival, passeio ou ingresso',Icon:Ticket}].map(({kind,label,description,Icon})=><Button ref={node=>{categoryButtons.current[kind]=node;}} type="button" variant="ghost" key={kind} onClick={()=>choose(kind)}><Icon/><span><strong>{label}</strong><small>{description}</small></span><ChevronRight/></Button>)}</div>:<form className="form-stack" onSubmit={save}><div className="reservation-editor-scroll"><fieldset className="reservation-fields" disabled={busy}>
  <div className="reservation-identity">
  {transport&&!r&&<label htmlFor="reservation-transport-kind">Tipo de transporte<select id="reservation-transport-kind" value={draft.kind} onChange={e=>update({kind:e.target.value as Draft['kind'],...(e.target.value!=='flight'?{flight:undefined}:{}),locationPoint:undefined,destinationPoint:undefined})}>{(['flight','train','bus','car','transfer','ferry'] as const).map(k=><option value={k} key={k}>{reservationLabels[k]}</option>)}</select></label>}
  {flight?<FlightIdentityFields value={draft.flight??{}} onChange={patch=>update({flight:{...draft.flight,...patch}})}/>:<label>{hotel?'Nome da hospedagem':activity?'Nome do evento ou atividade':car?'Locadora e veículo':'Nome do transporte'}<input required maxLength={300} placeholder={hotel?'Ex.: Hotel Aurora ou apartamento alugado':undefined} value={draft.title} onChange={e=>update({title:e.target.value})}/></label>}
  {!transport&&<ReservationLocationField trip={trip} day={draft.startDate} label={hotel?'Endereço da hospedagem':'Local do evento ou atividade'} value={draft.location??''} point={draft.locationPoint} hotelName={hotel?draft.title:undefined} onChange={location=>update({location,locationPoint:undefined})} onSelect={point=>update({location:point.address,locationPoint:point,...(hotel&&!draft.title.trim()?{title:point.name}:{})})}/>}
  </div>
  <div className={'reservation-stages'+(transport?' reservation-stages-transport':'')}>
   {([false,true] as const).map(isEnd=>{const stage=isEnd?end:start;return <fieldset className="reservation-stage" key={isEnd?'end':'start'}><legend>{stage.charAt(0).toUpperCase()+stage.slice(1)}</legend><div className="reservation-stage-fields">
    {flight&&<FlightAirportFields isEnd={isEnd} value={draft.flight??{}} location={(isEnd?draft.destination:draft.location)??''} disabled={busy} onChange={patch=>update({flight:{...draft.flight,...patch}})} onLookup={(code,airport,previous)=>setDraft(current=>fillAirport(current,isEnd,code,airport,previous))}/>}
    {transport&&<ReservationLocationField trip={trip} day={isEnd?draft.endDate:draft.startDate} label={(flight?'Localização do aeroporto de ':'Local de ')+stage} value={(isEnd?draft.destination:draft.location)??''} point={isEnd?draft.destinationPoint:draft.locationPoint} onChange={value=>update(isEnd?{destination:value,destinationPoint:undefined}:{location:value,locationPoint:undefined})} onSelect={point=>update(isEnd?{destination:point.address,destinationPoint:point}:{location:point.address,locationPoint:point})}/>}
    <div className="reservation-stage-time">
     <DateField label={'Data de '+stage} name={isEnd?'endDate':'startDate'} required min={isEnd?draft.startDate||trip.start_date:trip.start_date} max={trip.end_date} value={isEnd?draft.endDate:draft.startDate} onChange={value=>update(isEnd?{endDate:value}:{startDate:value})}/>
     <TimeField label={'Horário de '+stage} name={isEnd?'endTime':'startTime'} value={(isEnd?draft.endTime:draft.startTime)??''} onChange={value=>update(isEnd?{endTime:value}:{startTime:value})}/>
    </div>
    {!hotel&&<TimezoneField disabled={busy} label={'Fuso de '+stage} date={isEnd?draft.endDate:draft.startDate} inherit={isEnd} value={(isEnd?draft.endTimezone:draft.timezone)??''} onChange={value=>update(isEnd?{endTimezone:value}:{timezone:value})}/>}
   </div></fieldset>;})}
  </div>
  <div className="reservation-time-context">
   {hotel&&<TimezoneField disabled={busy} label="Fuso da hospedagem" date={draft.startDate} value={draft.timezone??''} onChange={value=>update({timezone:value})}/>}
   <p className="muted">Horários locais. GMT na data {hotel?'do check-in':'de cada etapa'}. {hotel?'Check-in e check-out usam o fuso da hospedagem.':'Se terminar depois da meia-noite, confira também a data de '+end+'.'}</p>
  </div>
  {flight&&<FlightTicketsField value={draft.flight??{}} onChange={patch=>update({flight:{...draft.flight,...patch}})}/>}
  {!r&&<ReservationDocumentsField files={documents} onChange={setDocuments} disabled={busy}/>}
  <details className="reservation-extra"><summary><span>Referência, viajantes e anotações</span><small>{extraSummary||'Informações opcionais'}</small></summary><div>
  {flight&&<label>Descrição da reserva <span className="muted">(opcional)</span><input maxLength={300} value={draft.title} onChange={e=>update({title:e.target.value})}/></label>}
  <label>{flight?'Outra referência da reserva':'Referência da reserva'}<input maxLength={200} value={draft.confirmation??''} onChange={e=>update({confirmation:e.target.value})}/></label>
  <label><span>Viajantes <span className="muted">(um por linha)</span></span><textarea rows={2} maxLength={9029} value={draft.travelers.join('\n')} onChange={e=>update({travelers:e.target.value.split('\n')})}/></label>
  <label>Anotações<textarea maxLength={12000} rows={3} value={draft.notes} onChange={e=>update({notes:e.target.value})}/></label>
  </div></details>
 </fieldset></div><div className="reservation-editor-actions">{error&&<p className="form-error" role="alert">{error}</p>}<div className="reservation-editor-footer"><Button type="button" variant="ghost" disabled={busy} onClick={onClose}>Cancelar</Button><Button className="primary" disabled={busy}>{busy?<LoaderCircle className="spin"/>:<Check/>}{busy?'Salvando reserva…':r?'Salvar alterações':'Adicionar reserva'}</Button></div></div></form>}
 </DialogContent></Dialog>;
}
