'use client';
import {useEffect,useId,useRef,useState} from 'react';
import {Plus,X} from 'lucide-react';
import type {FlightDetails} from '@/lib/contracts';
import type {AirportDetails} from '@/lib/airports';

type Props={value:FlightDetails;onChange:(patch:Partial<FlightDetails>)=>void};
export function FlightIdentityFields({value,onChange}:Props){
 return <div className="flight-identity-fields"><label>Número do voo<input maxLength={40} placeholder="Ex.: AB 1234" value={value.number??''} onChange={e=>onChange({number:e.target.value})}/></label><label>Localizador<input maxLength={100} placeholder="Código da reserva" value={value.locator??''} onChange={e=>onChange({locator:e.target.value})}/></label></div>;
}
export function FlightAirportFields({value,onChange,isEnd,location,disabled,onLookup}:{isEnd:boolean;location:string;disabled:boolean;onLookup:(code:string,airport:AirportDetails|null,previous:AirportDetails|null)=>void}&Props){
 const code=isEnd?'destinationIata':'originIata',name=isEnd?'destinationAirport':'originAirport',stage=isEnd?'chegada':'partida';
 const iata=value[code]??'',id=useId(),generated=useRef<AirportDetails|null>(null),lookup=useRef(onLookup);
 lookup.current=onLookup;
 const [result,setResult]=useState<{status:string;airport?:AirportDetails}>({status:'idle'});
 useEffect(()=>{
  if(disabled)return;
  const previous=generated.current;
  if(previous&&previous.iata!==iata){lookup.current(iata,null,previous);generated.current=null;}
  if(!/^[A-Z]{3}$/.test(iata)){setResult({status:'idle'});return;}
  const abort=new AbortController();let active=true;setResult({status:'loading'});
  const timer=setTimeout(async()=>{try{
   const response=await fetch('/api/airports/'+iata,{signal:abort.signal});
   if(!response.ok)throw Error('lookup');
   const data=await response.json() as {status:string;airport:AirportDetails|null};if(!active)return;
   if(data.status==='found'&&data.airport){lookup.current(iata,data.airport,generated.current);generated.current=data.airport;setResult({status:'found',airport:data.airport});}
   else setResult({status:data.status});
  }catch{if(active)setResult({status:'error'});}},250);
  return ()=>{active=false;clearTimeout(timer);abort.abort();};
 },[iata,disabled]);
 const matchesName=result.airport?.name===value[name],matchesLocation=result.airport?.location===location;
 const message=result.status==='loading'?'Consultando código…':result.status==='error'?'Consulta indisponível. Preencha manualmente.':result.status==='not_found'?'Código não encontrado. Preencha manualmente.':result.status==='ambiguous'?'Código com mais de um aeroporto. Confira os dados manualmente.':result.status==='found'?(matchesName&&matchesLocation?'Nome e cidade preenchidos pelo código.':matchesName?'Nome preenchido. Confira a localização mantida.':'Confira se nome e localização correspondem a '+iata+'.'):'Três letras preenchem o nome e a cidade disponíveis.';
 return <div className="flight-airport-fields"><label>Código IATA de {stage}<input aria-describedby={id} maxLength={3} pattern="[A-Za-z]{3}" title="Três letras do código do aeroporto" autoCapitalize="characters" spellCheck={false} placeholder="3 letras" value={iata} onChange={e=>onChange({[code]:e.target.value.toUpperCase()})}/></label><label>Nome do aeroporto de {stage}<input maxLength={300} value={value[name]??''} onChange={e=>onChange({[name]:e.target.value})}/></label><p id={id} className="flight-airport-hint muted" role="status">{message}</p></div>;
}
export function FlightTicketsField({value,onChange}:Props){
 const tickets=value.tickets??[];
 const edit=(index:number,patch:Partial<NonNullable<FlightDetails['tickets']>[number]>)=>onChange({tickets:tickets.map((ticket,i)=>i===index?{...ticket,...patch}:ticket)});
 return <section className="flight-tickets-field" aria-label="Tickets do voo"><div className="flight-tickets-heading"><h3>Tickets</h3><button type="button" disabled={tickets.length>=30} onClick={()=>onChange({tickets:[...tickets,{number:''}]})}><Plus aria-hidden="true"/>Adicionar ticket</button></div><p className="muted">Um por passageiro. Preencha quando disponível no comprovante.</p>{tickets.map((ticket,i)=><div className="flight-ticket-fields" key={i}><label>Número do ticket {i+1}<input maxLength={100} required={!!ticket.passenger?.trim()} value={ticket.number} onChange={e=>edit(i,{number:e.target.value})}/></label><label><span>Passageiro do ticket {i+1} <span className="muted">(opcional)</span></span><input maxLength={300} value={ticket.passenger??''} onChange={e=>edit(i,{passenger:e.target.value})}/></label><button type="button" className="icon-button" aria-label={'Remover ticket '+(i+1)} onClick={()=>onChange({tickets:tickets.filter((_,n)=>n!==i)})}><X aria-hidden="true"/></button></div>)}</section>;
}
