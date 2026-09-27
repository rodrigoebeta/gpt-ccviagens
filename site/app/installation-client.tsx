'use client';
import {useEffect,useRef,useState} from 'react';
import {RefreshCw,ChevronRight,Copy,Check,X} from 'lucide-react';
import {Dialog,DialogContent,DialogHeader,DialogTitle,DialogDescription} from '@/components/ui/dialog';
import {Button} from '@/components/ui/button';
import {pukoNewerVersion,pukoUpdatePrompt,releaseInput,type CentralRelease} from '@/lib/installation-contract';
import './installation.css';
export default function InstallationClient({enabled,canUpdate,version,initialRelease=null}:{enabled:boolean;canUpdate:boolean;version:string;initialRelease?:CentralRelease|null}){
 const [release,setRelease]=useState<CentralRelease|null>(initialRelease),[open,setOpen]=useState(false),[copied,setCopied]=useState(false),[copyError,setCopyError]=useState(false),[dismissed,setDismissed]=useState('');
 const text=useRef<HTMLTextAreaElement>(null);
 const [origin,setOrigin]=useState('');
 useEffect(()=>{
  setOrigin(window.location.origin);if(!enabled)return;
  let last=0,timer:ReturnType<typeof setTimeout>|undefined,alive=true;
  const discover=async()=>{if(!canUpdate)return;try{const response=await fetch('/api/installation');if(!response.ok)return;const status=await response.json() as {release:unknown};const parsed=releaseInput.safeParse(status.release);if(alive)setRelease(parsed.success?parsed.data:null);}catch{/* No interruption when discovery is unavailable. */}};
  const activity=()=>{if(document.visibilityState!=='visible'||Date.now()-last<3600000)return;last=Date.now();void discover();void fetch('/api/installation',{method:'POST'}).catch(()=>{});timer=setTimeout(()=>void discover(),12000);};
  activity();document.addEventListener('visibilitychange',activity);window.addEventListener('pointerdown',activity,{passive:true});window.addEventListener('keydown',activity);
  return()=>{alive=false;clearTimeout(timer);document.removeEventListener('visibilitychange',activity);window.removeEventListener('pointerdown',activity);window.removeEventListener('keydown',activity);};
 },[enabled,canUpdate]);
 if(!canUpdate||!release||!pukoNewerVersion(release.version,version)||dismissed===release.version)return null;
 const prompt=pukoUpdatePrompt(origin,release.repository);
 const copy=async()=>{try{await navigator.clipboard.writeText(prompt);setCopied(true);setCopyError(false);}catch{setCopyError(true);text.current?.focus();text.current?.select();}};
 return <><aside className="puko-update-strip" aria-label="Atualização da Central" data-puko="update"><button className="puko-update-open" onClick={()=>{setOpen(true);setCopied(false);setCopyError(false);}}><RefreshCw aria-hidden="true"/><span>Uma nova versão da Central está disponível.</span><strong>Ver atualização</strong><ChevronRight aria-hidden="true"/></button><button className="puko-update-dismiss" aria-label="Ocultar aviso nesta visita" onClick={()=>setDismissed(release.version)}><X aria-hidden="true"/></button></aside>
  <Dialog open={open} onOpenChange={setOpen}><DialogContent className="central-update-dialog"><DialogHeader><span className="central-update-symbol"><RefreshCw aria-hidden="true"/></span><DialogTitle>Sua Central pode ficar ainda melhor.</DialogTitle><DialogDescription>Copie o pedido abaixo e envie ao GPT Work. Ele confere a nova versão e preserva seus dados e personalizações.</DialogDescription></DialogHeader>
   <div className="central-update-copy"><label htmlFor="central-update-prompt">Mensagem para o GPT Work</label><textarea id="central-update-prompt" ref={text} readOnly value={prompt}/></div>
   <Button onClick={copy}>{copied?<Check aria-hidden="true"/>:<Copy aria-hidden="true"/>}{copied?'Pedido copiado':'Copiar pedido de atualização'}</Button>
   <p className="central-update-feedback" role="status">{copyError?'Não foi possível copiar automaticamente. Selecione e copie o texto acima.':copied?'Cole o pedido no GPT Work com acesso à sua instalação.':''}</p>
   <p className="central-update-note">A atualização será preparada pelo Work. A publicação acontece depois da sua autorização.</p>
  </DialogContent></Dialog></>;
}
