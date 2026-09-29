'use client';
import {useId,useRef,useState,type ChangeEvent} from 'react';
import {LoaderCircle,Plus} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {documentFileError,documentUploadTypes,readDocumentBase64} from '@/lib/document-upload';
export default function DocumentUpload({tripId,reservationId,onUploaded}:{tripId:string;reservationId:string;onUploaded:()=>Promise<void>}){
 const input=useRef<HTMLInputElement>(null),lock=useRef(false),hint=useId();
 const [busy,setBusy]=useState(false),[error,setError]=useState(''),[notice,setNotice]=useState('');
 async function upload(e:ChangeEvent<HTMLInputElement>){
  const file=e.target.files?.[0];e.target.value='';if(!file||lock.current)return;setError('');setNotice('');
  const invalid=documentFileError(file);if(invalid){setError(invalid);return;}
  lock.current=true;setBusy(true);
  try{
   const base64=await readDocumentBase64(file);
   const response=await fetch('/api/trips/'+tripId+'/reservations/'+reservationId+'/documents',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({filename:file.name,mime:file.type,base64})});
   const result=await response.json() as {error?:string;added?:boolean};if(!response.ok)throw Error(result.error??'Não foi possível anexar. Tente novamente.');
   await onUploaded();setNotice(result.added?'Documento adicionado.':'Este documento já está na reserva.');
  }catch(e){setError((e as Error).message);}finally{lock.current=false;setBusy(false);}
 }
 return <div className="reservation-document-upload"><input hidden ref={input} type="file" accept={documentUploadTypes.join(',')} onChange={upload}/><Button type="button" variant="outline" disabled={busy} aria-describedby={hint} onClick={()=>input.current?.click()}>{busy?<LoaderCircle className="spin" aria-hidden="true"/>:<Plus aria-hidden="true"/>}{busy?'Adicionando…':'Adicionar documento'}</Button><p id={hint} className="muted">PDF ou imagens (JPG, PNG, WebP e GIF). Até 10 MB por arquivo.</p>{error&&<p role="alert" className="form-error">{error}</p>}{notice&&<p role="status">{notice}</p>}</div>;
}
