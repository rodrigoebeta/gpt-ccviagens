'use client';
import {usePwa} from './pwa-client';
import {useEffect,useRef,useState} from 'react';
import {RefreshCw,ChevronRight,Copy,Check,X} from 'lucide-react';
import {Dialog,DialogContent,DialogHeader,DialogTitle,DialogDescription} from '@/components/ui/dialog';
import {Button} from '@/components/ui/button';
import {pukoNewerVersion,pukoUpdatePrompt,releaseInput,type CentralRelease} from '@/lib/installation-contract';
import './installation.css';
import {useInstallationAccess,type InstallationAccess} from './installation-access';
export default function InstallationClient({canUpdate,version,initialRelease=null}:{canUpdate:boolean;version:string;initialRelease?:CentralRelease|null}){
 const {offline}=usePwa();
 const access=useInstallationAccess();
 const [activationOpen,setActivationOpen]=useState(false),[accepted,setAccepted]=useState(false),[activating,setActivating]=useState(false),[activationError,setActivationError]=useState('');
 const [release,setRelease]=useState<CentralRelease|null>(initialRelease),[open,setOpen]=useState(false),[copied,setCopied]=useState(false),[copyError,setCopyError]=useState(false),[dismissed,setDismissed]=useState('');
 const text=useRef<HTMLTextAreaElement>(null);
 const [origin,setOrigin]=useState('');
 useEffect(()=>{
  setOrigin(window.location.origin);if(offline||!navigator.onLine)return;
  let last=0,timer:ReturnType<typeof setTimeout>|undefined,alive=true;
  const discover=async()=>{try{const response=await fetch('/api/installation');if(!response.ok)return;const status=await response.json() as InstallationAccess&{release:unknown};const parsed=releaseInput.safeParse(status.release);if(alive){access.update(status);setRelease(parsed.success?parsed.data:null);}}catch{/* Preserve the current consultation during a network failure. */}};
  const activity=()=>{if(document.visibilityState!=='visible'||Date.now()-last<3600000)return;last=Date.now();void discover();void fetch('/api/installation',{method:'POST'}).catch(()=>{});timer=setTimeout(()=>void discover(),12000);};
  const interval=setInterval(()=>{if(document.visibilityState==='visible'){activity();void discover();}},60000);
  activity();document.addEventListener('visibilitychange',activity);window.addEventListener('pointerdown',activity,{passive:true});window.addEventListener('keydown',activity);
  return()=>{alive=false;clearInterval(interval);clearTimeout(timer);document.removeEventListener('visibilitychange',activity);window.removeEventListener('pointerdown',activity);window.removeEventListener('keydown',activity);};
 },[offline,access.update]);
 const activate=async()=>{
  setActivating(true);setActivationError('');
  try{
   const response=await fetch(access.configured?'/api/installation':'/api/installation/consent',{method:'POST',headers:{'Content-Type':'application/json'},...(!access.configured?{body:JSON.stringify({accepted:true,termsVersion:access.termsVersion})}:{})});
   const data=await response.json() as InstallationAccess&{error?:string};if(!response.ok)throw Error(data.error??'Não foi possível ativar.');
   if(access.configured)await new Promise(resolve=>setTimeout(resolve,12000));
   const result=access.configured?await fetch('/api/installation').then(r=>{if(!r.ok)throw Error('Não foi possível conferir a confirmação.');return r.json() as Promise<InstallationAccess>;}):data;
   access.update(result);if(result.writable){setActivationOpen(false);window.location.reload();}else setActivationError('Seu aceite foi preservado. O receptor ainda não confirmou o contato; a Central tentará novamente automaticamente. Se a falha continuar, confira a configuração com o Work.');
  }catch(e){setActivationError(e instanceof Error?e.message:'Não foi possível confirmar o contato. Tente novamente.');}finally{setActivating(false);}
 };
 if(!access.writable&&!offline)return <><aside className="puko-update-strip central-consultation-strip" aria-label="Central em modo de consulta"><span>Modo de consulta. Viagens e comprovantes continuam disponíveis.</span>{canUpdate?<button className="puko-update-open" onClick={()=>{setActivationOpen(true);setActivationError('');setAccepted(false);}}><strong>{access.configured?'Restabelecer alterações':'Ativar telemetria e atualizações'}</strong></button>:<span>O proprietário precisa confirmar a ativação.</span>}</aside>
  <Dialog open={activationOpen} onOpenChange={setActivationOpen}><DialogContent className="central-update-dialog"><DialogHeader><DialogTitle>{access.configured?'Restabelecer alterações':'Telemetria e atualizações'}</DialogTitle><DialogDescription>{access.configured?'Não é preciso aceitar novamente. O contato é automático; este botão tenta renovar a confirmação do servidor.':'A telemetria é uma condição de uso da Central e ajuda a medir a adoção e melhorar a ferramenta.'}</DialogDescription></DialogHeader>
   {!access.configured&&<><p className="central-activation-summary">Enviamos identificador aleatório da instalação, versão, aceite e atividade. Em domínio externo, também o hostname. Não enviamos viagens, comprovantes, nomes ou e-mails de viajantes. Registros são removidos após 180 dias sem contato.</p><p className="central-activation-summary">Após a ativação, os contatos são automáticos. Sem confirmação por sete dias, alterações e novos avisos ficam suspensos; a consulta aos dados continua. O contato confirmado libera as alterações novamente.</p><a className="central-conditions-link" href="/conditions" target="_blank" rel="noopener">Ler os termos completos e o aviso de privacidade</a><label className="central-activation-choice"><input type="checkbox" checked={accepted} onChange={e=>setAccepted(e.target.checked)}/><span>Li e aceito os termos e o aviso de privacidade desta versão.</span></label></>}
   <Button disabled={activating||(!access.configured&&!accepted)} onClick={()=>void activate()}>{activating?'Confirmando contato…':access.configured?'Tentar contato agora':'Ativar telemetria e atualizações'}</Button><p className="central-update-feedback" role="status">{activationError}</p>
  </DialogContent></Dialog></>;
 if(!access.writable||!canUpdate||!release||!pukoNewerVersion(release.version,version)||dismissed===release.version)return null;
 const prompt=pukoUpdatePrompt(origin,release.repository);
 const copy=async()=>{try{await navigator.clipboard.writeText(prompt);setCopied(true);setCopyError(false);}catch{setCopyError(true);text.current?.focus();text.current?.select();}};
 return <><aside className="puko-update-strip" aria-label="Atualização da Central" data-puko="update"><button className="puko-update-open" onClick={()=>{setOpen(true);setCopied(false);setCopyError(false);}}><RefreshCw aria-hidden="true"/><span>Uma nova versão da Central está disponível.</span><strong>Ver atualização</strong><ChevronRight aria-hidden="true"/></button><button className="puko-update-dismiss" aria-label="Ocultar aviso nesta visita" onClick={()=>setDismissed(release.version)}><X aria-hidden="true"/></button></aside>
  <Dialog open={open} onOpenChange={setOpen}><DialogContent className="central-update-dialog"><DialogHeader><span className="central-update-symbol"><RefreshCw aria-hidden="true"/></span><DialogTitle>Sua Central pode ficar ainda melhor.</DialogTitle><DialogDescription>Copie o pedido abaixo e envie ao GPT Work. Ele confere a nova versão e preserva seus dados e personalizações.</DialogDescription></DialogHeader>
   <div className="central-update-copy"><label htmlFor="central-update-prompt">Mensagem para o GPT Work</label><textarea id="central-update-prompt" ref={text} readOnly value={prompt}/></div>
   <p className="central-update-summary">{release.notes}</p>
   <Button onClick={copy}>{copied?<Check aria-hidden="true"/>:<Copy aria-hidden="true"/>}{copied?'Pedido copiado':'Copiar pedido de atualização'}</Button>
   <p className="central-update-feedback" role="status">{copyError?'Não foi possível copiar automaticamente. Selecione e copie o texto acima.':copied?'Cole o pedido no GPT Work com acesso à sua instalação.':''}</p>
   <p className="central-update-note">A atualização será preparada pelo Work. A publicação acontece depois da sua autorização.</p>
  </DialogContent></Dialog></>;
}
