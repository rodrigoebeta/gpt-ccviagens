'use client';
import {Plus,X} from 'lucide-react';
import type {FlightDetails} from '@/lib/contracts';

type Props={value:FlightDetails;onChange:(patch:Partial<FlightDetails>)=>void};
export function FlightIdentityFields({value,onChange}:Props){
 return <div className="flight-identity-fields"><label>Número do voo<input maxLength={40} placeholder="Ex.: AB 1234" value={value.number??''} onChange={e=>onChange({number:e.target.value})}/></label><label>Localizador<input maxLength={100} placeholder="Código da reserva" value={value.locator??''} onChange={e=>onChange({locator:e.target.value})}/></label></div>;
}
export function FlightAirportFields({value,onChange,isEnd}:{isEnd:boolean}&Props){
 const code=isEnd?'destinationIata':'originIata',name=isEnd?'destinationAirport':'originAirport',stage=isEnd?'chegada':'partida';
 return <div className="flight-airport-fields"><label>Código IATA de {stage}<input maxLength={3} pattern="[A-Za-z]{3}" title="Três letras do código do aeroporto" autoCapitalize="characters" spellCheck={false} placeholder="3 letras" value={value[code]??''} onChange={e=>onChange({[code]:e.target.value.toUpperCase()})}/></label><label>Nome do aeroporto de {stage}<input maxLength={300} value={value[name]??''} onChange={e=>onChange({[name]:e.target.value})}/></label></div>;
}
export function FlightTicketsField({value,onChange}:Props){
 const tickets=value.tickets??[];
 const edit=(index:number,patch:Partial<NonNullable<FlightDetails['tickets']>[number]>)=>onChange({tickets:tickets.map((ticket,i)=>i===index?{...ticket,...patch}:ticket)});
 return <section className="flight-tickets-field" aria-label="Tickets do voo"><div className="flight-tickets-heading"><h3>Tickets</h3><button type="button" disabled={tickets.length>=30} onClick={()=>onChange({tickets:[...tickets,{number:''}]})}><Plus aria-hidden="true"/>Adicionar ticket</button></div><p className="muted">Um por passageiro. Preencha quando disponível no comprovante.</p>{tickets.map((ticket,i)=><div className="flight-ticket-fields" key={i}><label>Número do ticket {i+1}<input maxLength={100} required={!!ticket.passenger?.trim()} value={ticket.number} onChange={e=>edit(i,{number:e.target.value})}/></label><label><span>Passageiro do ticket {i+1} <span className="muted">(opcional)</span></span><input maxLength={300} value={ticket.passenger??''} onChange={e=>edit(i,{passenger:e.target.value})}/></label><button type="button" className="icon-button" aria-label={'Remover ticket '+(i+1)} onClick={()=>onChange({tickets:tickets.filter((_,n)=>n!==i)})}><X aria-hidden="true"/></button></div>)}</section>;
}
