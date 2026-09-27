'use client';
import {useState,type FormEvent} from 'react';
import {Check,LoaderCircle} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {DateField,TimeField} from './date-time-fields';
import {Dialog,DialogContent,DialogHeader,DialogTitle,DialogDescription} from '@/components/ui/dialog';
import type {Reservation,ReservationData,Trip} from '@/lib/contracts';
export default function ReservationEditor({reservation:r,trip,onClose,onSaved}:{reservation:Reservation;trip:Trip;onClose:()=>void;onSaved:()=>Promise<void>}){
 const [busy,setBusy]=useState(false),[error,setError]=useState('');
 async function save(e:FormEvent<HTMLFormElement>){e.preventDefault();setBusy(true);setError('');const f=new FormData(e.currentTarget),value=(key:string)=>String(f.get(key)??'').trim();
  const {id,documents,importedAt,fingerprint,status,updatedAt,...original}=r;void documents;void importedAt;void status;void updatedAt;
  const data:ReservationData={...original,title:value('title'),startDate:value('startDate'),endDate:value('endDate'),startTime:value('startTime')||undefined,endTime:value('endTime')||undefined,timezone:value('timezone')||undefined,endTimezone:value('endTimezone')||undefined,location:value('location'),destination:value('destination'),confirmation:value('confirmation'),notes:value('notes')};
  try{const response=await fetch('/api/trips/'+trip.id+'/reservations/'+id,{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({reservation:data,baseFingerprint:fingerprint})});const result=await response.json() as {error?:string};if(!response.ok)throw Error(result.error||'Não foi possível salvar.');await onSaved();onClose();}catch(e){setError((e as Error).message);}finally{setBusy(false);}
 }
 return <Dialog open onOpenChange={v=>!v&&!busy&&onClose()}><DialogContent className="travel-dialog reservation-edit-dialog"><DialogHeader><DialogTitle>Editar reserva</DialogTitle><DialogDescription>Ajuste os dados da programação. Os comprovantes originais e o histórico serão preservados.</DialogDescription></DialogHeader><form className="form-stack" onSubmit={save}>
  <label>Nome da reserva<input name="title" required maxLength={300} defaultValue={r.title}/></label>
  <div className="form-pair"><DateField label={r.kind==='hotel'?'Data de check-in':'Data de início'} name="startDate" required min={trip.start_date} max={trip.end_date} defaultValue={r.startDate}/><DateField label={r.kind==='hotel'?'Data de check-out':'Data de fim'} name="endDate" required min={trip.start_date} max={trip.end_date} defaultValue={r.endDate}/></div>
  <div className="form-pair"><TimeField label={r.kind==='hotel'?'Horário de check-in':'Horário de início'} name="startTime" defaultValue={r.startTime}/><TimeField label={r.kind==='hotel'?'Horário de check-out':'Horário de fim'} name="endTime" defaultValue={r.endTime}/></div>
  <p className="muted">Use horários locais. Para uma chegada após a meia-noite, ajuste também a data de fim. Ajustar aqui não altera a reserva com o fornecedor.</p>
  <div className="form-pair"><label>Fuso de início<input name="timezone" maxLength={100} placeholder="Ex.: Europe/Lisbon" defaultValue={r.timezone}/></label><label>Fuso de fim<input name="endTimezone" maxLength={100} placeholder="Igual ao início, se vazio" defaultValue={r.endTimezone}/></label></div>
  <label>{r.kind==='hotel'?'Local da hospedagem':'Local de início'}<input name="location" maxLength={1000} defaultValue={r.location}/></label><label>Destino / local de fim<input name="destination" maxLength={1000} defaultValue={r.destination}/></label>
  <label>Referência da reserva<input name="confirmation" maxLength={200} defaultValue={r.confirmation}/></label><label>Anotações<textarea name="notes" maxLength={12000} rows={4} defaultValue={r.notes}/></label>
  {error&&<p className="form-error" role="alert">{error}</p>}<Button className="primary" disabled={busy}>{busy?<LoaderCircle className="spin"/>:<Check/>} Salvar alterações</Button>
 </form></DialogContent></Dialog>;
}
