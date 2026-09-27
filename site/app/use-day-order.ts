'use client';
import {useEffect,useRef,useState} from 'react';
type Order={key:string;ids:string[];revision:number;ready:boolean};
type ResponseData={error?:string;ids:string[];revision:number};
export function useDayOrder(tripId:string,day:string,refreshKey:number){
 const key=tripId+'/'+day,url='/api/trips/'+tripId+'/timeline?day='+day;
 const current=useRef(key);current.current=key;
 const epoch=useRef(0),locked=useRef(false);
 const [order,setOrder]=useState<Order>({key:'',ids:[],revision:0,ready:false});
 const [saving,setSaving]=useState(false),[error,setError]=useState(''),[notice,setNotice]=useState('');
 async function reload(){
  const version=++epoch.current;setError('');setOrder(v=>({...v,ready:false}));
  try{const r=await fetch(url);const d=await r.json() as ResponseData;if(!r.ok)throw Error(d.error??'Não foi possível carregar a ordem do dia.');
   if(current.current===key&&version===epoch.current)setOrder({key,ids:d.ids,revision:d.revision,ready:true});
  }catch(e){if(current.current===key&&version===epoch.current){setError((e as Error).message);setOrder({key,ids:[],revision:0,ready:false});}}
 }
 useEffect(()=>{setNotice('');void reload();return()=>{epoch.current++;};},[key,refreshKey]);
 async function reorder(ids:string[]){
  if(locked.current||order.key!==key||!order.ready)return false;
  locked.current=true;setSaving(true);setError('');setNotice('');const previous=order;
  setOrder({...order,ids});
  try{
   const r=await fetch('/api/trips/'+tripId+'/timeline',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({day,ids,revision:order.revision})});
   const d=await r.json() as ResponseData;if(!r.ok)throw Error(d.error??'Não foi possível salvar a ordem.');
   if(current.current===key){setOrder({key,ids:d.ids,revision:d.revision,ready:true});setNotice('Ordem do dia salva.');}return true;
  }catch(e){if(current.current===key){setError((e as Error).message+' A ordem não foi confirmada. Atualize antes de tentar novamente.');setOrder({...previous,ready:false});}return false;
  }finally{locked.current=false;setSaving(false);}
 }
 return {ids:order.key===key?order.ids:[],ready:order.key===key&&order.ready,saving,error,notice,reload,reorder};
}
