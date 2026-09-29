'use client';
import {createContext,useContext,useEffect,useRef,useState,type ReactNode} from 'react';
import {Download,WifiOff} from 'lucide-react';
import './pwa.css';

type InstallEvent=Event&{prompt:()=>Promise<void>;userChoice:Promise<{outcome:string}>};
type PwaState={offline:boolean;reconnected:boolean;unavailable:boolean;install:InstallEvent|null;installApp:()=>void};
const PwaContext=createContext<PwaState>({offline:false,reconnected:false,unavailable:false,install:null,installApp:()=>{}});
export const usePwa=()=>useContext(PwaContext);
export default function PwaClient({account,children}:{account:string;children:ReactNode}){
 const [ready,setReady]=useState(false),[offline,setOffline]=useState(false),[reconnected,setReconnected]=useState(false);
 const [unavailable,setUnavailable]=useState(false),[denied,setDenied]=useState(false),[install,setInstall]=useState<InstallEvent|null>(null);
 const connected=useRef(false);
 useEffect(()=>{
  let active=true;
  const lost=()=>{setOffline(true);setReconnected(false);};
  const restored=()=>{setReconnected(true);};
  const offered=(event:Event)=>{event.preventDefault();setInstall(event as InstallEvent);};
  const installed=()=>setInstall(null);
  const message=(event:MessageEvent)=>{
   if(event.data?.type==='CENTRAL_OFFLINE')lost();
   if(event.data?.type==='CENTRAL_STORAGE_FULL')setUnavailable(true);
   if(event.data?.type==='CENTRAL_INSTALL_FAILED'){setUnavailable(true);console.warn('Preparação offline indisponível:',event.data.reason);}
   if(event.data?.type==='CENTRAL_SESSION_CLEARED'||(event.data?.type==='CENTRAL_ACCOUNT_CHANGED'&&event.data.account!==account&&connected.current))setDenied(true);
  };
  window.addEventListener('offline',lost);window.addEventListener('online',restored);
  window.addEventListener('beforeinstallprompt',offered);window.addEventListener('appinstalled',installed);
  navigator.serviceWorker?.addEventListener('message',message);
  setOffline(!navigator.onLine);
  async function start(){
   if(!('serviceWorker' in navigator)||!window.isSecureContext){setUnavailable(true);setReady(true);return;}
   try{
    // The dev server deliberately has no worker. Production and its local preview do.
    const existing=await navigator.serviceWorker.getRegistration('/');
    const registration=existing?.active?existing:await navigator.serviceWorker.register('/sw.js',{scope:'/',updateViaCache:'none'});
    if(existing?.active&&navigator.onLine)void existing.update().catch(()=>{});
    await Promise.race([navigator.serviceWorker.ready,new Promise((_,reject)=>setTimeout(()=>reject(Error('timeout')),20000))]);
    const worker=navigator.serviceWorker.controller??registration.active;
    if(!worker)throw Error('worker unavailable');
    const result=await new Promise<{ready:boolean;offline?:boolean;denied?:boolean}>((resolve,reject)=>{
     const channel=new MessageChannel(),timer=setTimeout(()=>{channel.port1.close();reject(Error('timeout'));},18000);
     channel.port1.onmessage=event=>{clearTimeout(timer);channel.port1.close();resolve(event.data);};
     worker.postMessage({type:'CENTRAL_CONNECT',account},[channel.port2]);
    });
    if(!active)return;
    if(result.denied){setDenied(true);return;}
    connected.current=result.ready;setUnavailable(!result.ready);setOffline(!!result.offline);setReady(true);
   }catch{if(active){setUnavailable(true);setReady(true);}}
  }
  void start();
  return()=>{active=false;window.removeEventListener('offline',lost);window.removeEventListener('online',restored);window.removeEventListener('beforeinstallprompt',offered);window.removeEventListener('appinstalled',installed);navigator.serviceWorker?.removeEventListener('message',message);};
 },[account]);
 async function installApp(){if(!install)return;try{await install.prompt();await install.userChoice;}finally{setInstall(null);}}
 if(denied)return <div className="app-shell"><main><h1>Entre novamente na Central</h1><p>A sessão mudou. As cópias offline desta conta foram removidas deste aparelho.</p><a className="text-button" href="/">Reabrir a Central</a></main></div>;
 if(!ready)return <div className="app-shell"><main><p role="status">Abrindo suas viagens…</p></main></div>;
 return <PwaContext.Provider value={{offline,reconnected,unavailable,install,installApp}}><div onSubmitCapture={event=>{if(offline){event.preventDefault();event.stopPropagation();}}}>{children}</div></PwaContext.Provider>;
}
export function OfflineNotice(){
 const {offline,reconnected}=usePwa();
 if(!offline)return null;
 return <div className="offline-notice" role="status"><WifiOff aria-hidden="true"/><div><strong>{reconnected?'Conexão restabelecida':'Você está offline'}</strong><p>Consultando dados salvos neste aparelho. Para atualizar ou salvar alterações, conecte-se.</p><a className="text-button" href="/">{reconnected?'Atualizar dados':'Tentar reconectar'}</a></div></div>;
}
export function PwaActions(){
 const {install,installApp,unavailable}=usePwa();
 return <>{install&&<button className="text-button pwa-install" type="button" onClick={installApp}><Download aria-hidden="true"/>Instalar aplicativo</button>}{unavailable&&<p className="pwa-storage-note" role="status">Não foi possível preparar o acesso offline. Confira o espaço disponível e reabra a Central com internet.</p>}</>;
}
