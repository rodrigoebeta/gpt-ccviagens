'use client';
import {useEffect,useRef,useState} from 'react';
import {Pencil} from 'lucide-react';
import CoverEditor from './cover-editor';
type Cover={has_cover:boolean;cover_version:number};
export default function HomeCover(){
 const trigger=useRef<HTMLButtonElement>(null);
 const [cover,setCover]=useState<Cover>({has_cover:false,cover_version:0});
 const [open,setOpen]=useState(false),[loading,setLoading]=useState(true),[error,setError]=useState('');
 async function refresh(){
  const response=await fetch('/api/profile/cover?metadata=1');
  const data=await response.json() as Cover&{error?:string};if(!response.ok)throw Error(data.error||'Não foi possível carregar sua imagem.');
  setCover(data);
 }
 useEffect(()=>{refresh().catch(e=>setError(e.message)).finally(()=>setLoading(false));},[]);
 async function customize(){setLoading(true);setError('');try{await refresh();setOpen(true);}catch(e){setError((e as Error).message);}finally{setLoading(false);}}
 return <>
  <section className="travel-cover" aria-label="Imagem inicial">
   <img src={cover.has_cover?`/api/profile/cover?v=${cover.cover_version}`:'/alpes.jpg'} alt={cover.has_cover?'Sua imagem inicial personalizada':'Trem vermelho no Viaduto Landwasser, nos Alpes suíços. Foto ilustrativa.'}/>
   <div className="travel-cover-content"><h2>Tudo pronto para<br/>a próxima parada.</h2></div>
   <button ref={trigger} className="home-cover-action" onClick={customize} disabled={loading}><Pencil/><span>{loading?'Carregando…':'Personalizar imagem'}</span></button>
  </section>
  {error&&<p className="form-error home-cover-error" role="alert">{error} Use Personalizar imagem para tentar novamente.</p>}
  {open&&<CoverEditor homeCover={cover} returnFocus={()=>trigger.current?.focus()} onClose={()=>setOpen(false)} onSaved={refresh}/>}
 </>;
}
