'use client';
import {preparePhoto} from '@/lib/prepare-photo';
import {useState} from 'react';
import {ImagePlus,LoaderCircle} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {Dialog,DialogContent,DialogHeader,DialogTitle,DialogDescription} from '@/components/ui/dialog';
import type {Trip} from '@/lib/contracts';
type Props=({trip:Trip;homeCover?:never}|{trip?:never;homeCover:{has_cover:boolean;cover_version:number}})&{onClose:()=>void;onSaved:()=>Promise<void>;returnFocus?:()=>void};
export default function CoverEditor({trip,homeCover,onClose,onSaved,returnFocus}:Props){
 const cover=trip??homeCover;
 const endpoint=trip?'/api/trips/'+trip.id+'/cover':'/api/profile/cover';
 const [image,setImage]=useState(''),[busy,setBusy]=useState(false),[error,setError]=useState('');
 async function prepare(file?:File){if(!file)return;setBusy(true);setError('');setImage('');try{
  setImage(await preparePhoto(file));
 }catch(e){setError((e as Error).message||'Não foi possível abrir esta foto.');}finally{setBusy(false);}}
 async function save(reset=false){setBusy(true);setError('');try{const response=await fetch(endpoint,{method:reset?'DELETE':'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({revision:cover.cover_version??0,...(!reset?{mime:'image/jpeg',base64:image.split(',')[1]}:{})})});const result=await response.json() as {error?:string};if(!response.ok)throw Error(result.error||'Não foi possível salvar a capa.');await onSaved();onClose();}catch(e){setError((e as Error).message);}finally{setBusy(false);}}
 return <Dialog open onOpenChange={v=>!v&&!busy&&onClose()}><DialogContent className="travel-dialog cover-dialog" onCloseAutoFocus={e=>{if(returnFocus){e.preventDefault();returnFocus();}}}><DialogHeader><DialogTitle>{trip?'Capa da viagem':'Imagem inicial'}</DialogTitle><DialogDescription>Escolha uma foto própria ou mantenha a capa ilustrativa padrão.</DialogDescription></DialogHeader>{image&&<img className="cover-preview" src={image} alt="Prévia da nova capa"/>}<label className="file-drop"><ImagePlus/><strong>Escolher foto</strong><span>JPG, PNG ou WebP · até 20 MB</span><input type="file" accept="image/jpeg,image/png,image/webp" aria-label={trip?'Foto da viagem':'Imagem inicial'} disabled={busy} onChange={e=>prepare(e.target.files?.[0])}/></label><p className="muted">{trip?'A foto será otimizada antes do envio e ficará disponível somente para quem pode acessar esta viagem.':'Esta imagem é pessoal: aparece na sua página de viagens em todos os seus dispositivos. As capas das viagens não mudam.'}</p>{error&&<p className="form-error" role="alert">{error}</p>}<div className="dialog-actions">{cover.has_cover&&<Button variant="outline" disabled={busy} onClick={()=>save(true)}>{trip?'Usar capa padrão':'Usar imagem padrão'}</Button>}<Button className="primary" disabled={busy||!image} onClick={()=>save()}>{busy&&<LoaderCircle className="spin"/>} {trip?'Salvar capa':'Salvar imagem'}</Button></div></DialogContent></Dialog>;
}
