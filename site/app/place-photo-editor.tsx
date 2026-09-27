'use client';
import {useState} from 'react';
import {ImagePlus,LoaderCircle,Search,Check} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {Dialog,DialogContent,DialogHeader,DialogTitle,DialogDescription} from '@/components/ui/dialog';
import type {Place} from '@/lib/contracts';
import type {PhotoSearch,PlacePhoto} from '@/lib/photo-contracts';
import {preparePhoto} from '@/lib/prepare-photo';
import PlacePhotoView,{PhotoCredit} from './place-photo';
export default function PlacePhotoEditor({place,tripId,onClose,onSaved,returnFocus}:{place:Place;tripId:string;onClose:()=>void;onSaved:()=>Promise<void>;returnFocus:()=>void}){
 const base='/api/trips/'+tripId+'/places/'+place.id;
 const [busy,setBusy]=useState(false),[searching,setSearching]=useState(false),[error,setError]=useState(''),[image,setImage]=useState(''),[selected,setSelected]=useState<PlacePhoto|null>(null),[results,setResults]=useState<PhotoSearch|null>(null);
 const blocked=busy||searching;
 async function search(){setSearching(true);setError('');try{const r=await fetch(base+'/photo-search',{method:'POST'}),d=await r.json() as PhotoSearch&{error?:string};if(!r.ok)throw Error(d.error);setResults(d);}catch(e){setError((e as Error).message||'Não foi possível buscar fotos.');}finally{setSearching(false);}}
 async function save(reset=false){setBusy(true);setError('');try{const r=await fetch(base+'/photo',{method:reset?'DELETE':'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({revision:place.revision,...(!reset?(image?{mime:'image/jpeg',base64:image.split(',')[1]}:{candidateId:selected?.id}):{})})}),d=await r.json() as {error?:string};if(!r.ok)throw Error(d.error);await onSaved();onClose();}catch(e){setError((e as Error).message||'Não foi possível salvar.');}finally{setBusy(false);}}
 return <Dialog open onOpenChange={v=>!v&&!blocked&&onClose()}><DialogContent className="travel-dialog photo-dialog" onCloseAutoFocus={e=>{e.preventDefault();returnFocus();}}><DialogHeader><DialogTitle>Foto do lugar</DialogTitle><DialogDescription>{place.name} · escolha uma imagem que ajude a reconhecer o local.</DialogDescription></DialogHeader>
 {(image||selected||place.photo)&&<div className="photo-selection">{image?<img className="cover-preview" src={image} alt="Prévia da foto enviada"/>:<PlacePhotoView key={(selected??place.photo)!.id} photo={(selected??place.photo)!} name={place.name}/>}</div>}
 <div className="photo-search-intro"><h3>Encontre uma foto</h3><p>Busque vistas em até 150 m no Panoramax e fotos vinculadas a este lugar no OpenStreetMap. Confira a fachada antes de escolher.</p><Button variant="outline" disabled={blocked} onClick={()=>void search()}>{searching?<LoaderCircle className="spin"/>:<Search/>}{searching?'Buscando fotos…':'Buscar fotos do lugar'}</Button></div>
 {results&&<>{results.messages.map(m=><p className="muted" role="status" key={m}>{m}</p>)}<div className="photo-candidates">{results.photos.map(p=><figure className={'photo-candidate'+(selected?.id===p.id?' is-selected':'')} key={p.id}><button disabled={blocked} aria-pressed={selected?.id===p.id} aria-label={'Selecionar '+p.label} onClick={()=>{setSelected(p);setImage('');setError('');}}><img src={p.provider==='Panoramax'?p.url.replace('/sd.jpg','/thumb.jpg'):p.url} alt={p.label} referrerPolicy="no-referrer" loading="lazy"/><span>{selected?.id===p.id&&<Check/>}{p.label}</span></button><PhotoCredit photo={p}/></figure>)}</div></>}
 <label className="file-drop"><ImagePlus/><strong>Ou envie uma foto sua</strong><span>JPG, PNG ou WebP · até 20 MB</span><input type="file" aria-label="Foto do lugar" accept="image/jpeg,image/png,image/webp" disabled={blocked} onChange={async e=>{const file=e.target.files?.[0];if(!file)return;setBusy(true);setError('');try{setImage(await preparePhoto(file));setSelected(null);}catch(e){setError((e as Error).message);}finally{setBusy(false);}}}/></label>
 <p className="muted">Sua foto fica disponível apenas para quem acessa esta viagem. Imagens públicas mantêm os créditos e dependem da disponibilidade da fonte.</p>
 {error&&<p className="form-error" role="alert">{error}</p>}<div className="dialog-actions">{place.photo&&<Button variant="outline" disabled={blocked} onClick={()=>void save(true)}>Remover foto</Button>}<Button className="primary" disabled={blocked||(!image&&!selected)} onClick={()=>void save()}>{busy&&<LoaderCircle className="spin"/>}Usar esta foto</Button></div>
 </DialogContent></Dialog>;
}
