'use client';

import {useRef,useState} from 'react';
import {LoaderCircle,Trash2} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {AlertDialog,AlertDialogCancel,AlertDialogContent,AlertDialogDescription,AlertDialogTitle} from '@/components/ui/alert-dialog';

export type PendingTripDeletion={id:string;name:string};
export type TripDeletionResult={deleted:true;filesCleaned:boolean;retryRequired:boolean;cleanupReason?:string};

export async function deleteTrip(trip:PendingTripDeletion):Promise<TripDeletionResult>{
 const response=await fetch('/api/trips/'+encodeURIComponent(trip.id),{method:'DELETE',headers:{'Content-Type':'application/json'},body:JSON.stringify({confirmName:trip.name}),signal:AbortSignal.timeout(30000)});
 const result=await response.json() as TripDeletionResult&{error?:string};
 if(!response.ok)throw Error((result.error||'Não foi possível excluir a viagem.')+(response.status===409?' Cancele e atualize a página para conferir os dados atuais.':''));
 if(result.deleted!==true||typeof result.filesCleaned!=='boolean')throw Error('Não foi possível confirmar a exclusão. Atualize a página para conferir o estado da viagem.');
 return result;
}

export default function TripDeleteDialog({trip,onCancel,onDeleted,returnFocus}:{trip:PendingTripDeletion;onCancel:()=>void;onDeleted:(result:TripDeletionResult)=>void;returnFocus:()=>void}){
 const [busy,setBusy]=useState(false),[error,setError]=useState('');
 const inFlight=useRef(false),removed=useRef(false);
 async function remove(){
  if(inFlight.current)return;inFlight.current=true;setBusy(true);setError('');
  try{const result=await deleteTrip(trip);removed.current=true;onDeleted(result);}
  catch(e){setError(e instanceof Error&&e.name==='TimeoutError'?'A resposta demorou. Não foi possível confirmar o resultado. Tente novamente ou atualize a página.':e instanceof Error?e.message:'Não foi possível concluir. Tente novamente.');}
  finally{inFlight.current=false;setBusy(false);}
 }
 return <AlertDialog open onOpenChange={open=>{if(!open&&!inFlight.current)onCancel();}}><AlertDialogContent className="travel-dialog trip-delete-dialog" onEscapeKeyDown={e=>{if(inFlight.current)e.preventDefault();}} onCloseAutoFocus={e=>{e.preventDefault();if(!removed.current)returnFocus();}} aria-busy={busy}>
  <AlertDialogTitle>Excluir viagem?</AlertDialogTitle>
  <AlertDialogDescription>Você vai excluir <strong>{trip.name}</strong>, incluindo reservas, documentos, lugares, listas e acessos de convidados. Essa ação não pode ser desfeita.</AlertDialogDescription>
  {error&&<p className="form-error" role="alert">{error}</p>}
  <div className="trip-delete-actions"><AlertDialogCancel disabled={busy}>Cancelar</AlertDialogCancel><Button type="button" variant="destructive" disabled={busy} onClick={remove}>{busy?<LoaderCircle className="spin" aria-hidden="true"/>:<Trash2 aria-hidden="true"/>}{busy?'Excluindo…':'Excluir viagem'}</Button></div>
 </AlertDialogContent></AlertDialog>;
}
