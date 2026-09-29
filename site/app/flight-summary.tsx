import {ArrowRight} from 'lucide-react';
import type {ReservationData} from '@/lib/contracts';
import {flightTitle} from '@/lib/flight-details';
import {shortReservationAddress} from './reservation-address';

export default function FlightSummary({reservation:r,card=false}:{reservation:ReservationData;card?:boolean}){
 const f=r.flight,tickets=f?.tickets?.filter(ticket=>ticket.number.trim())??[];
 const passengers=[...r.travelers,...(f?.tickets??[]).map(ticket=>ticket.passenger??'')]
  .map(name=>name.trim().replace(/\s+/g,' '))
  .filter((name,index,names)=>name&&names.findIndex(other=>other.toLocaleLowerCase('pt-BR')===name.toLocaleLowerCase('pt-BR'))===index);
 const showTickets=!card||(!f?.locator?.trim()&&tickets.length>0);
 return <div className="flight-summary">
  {!f?.originIata&&!f?.destinationIata&&<h3 className="flight-legacy-title">{r.title}</h3>}
  {(f?.originIata||f?.destinationIata)&&<h3 className="sr-only">{flightTitle(f)}</h3>}
  <dl className="flight-route"><div><dt>Origem</dt><dd><strong>{f?.originIata||'—'}</strong><span>{f?.originAirport||shortReservationAddress(r.location)||'Aeroporto não informado'}</span></dd></div><ArrowRight aria-hidden="true"/><div><dt>Destino</dt><dd><strong>{f?.destinationIata||'—'}</strong><span>{f?.destinationAirport||shortReservationAddress(r.destination)||'Aeroporto não informado'}</span></dd></div></dl>
  <dl className="flight-identifiers">
   <div><dt>Voo</dt><dd>{f?.number||'Não informado'}</dd></div>
   <div><dt>Localizador</dt><dd>{f?.locator||'Não informado'}</dd></div>
   {card&&<div className="flight-passengers"><dt>Passageiros</dt><dd>{passengers.length?passengers.join(' · '):'Não informados'}</dd></div>}
   {showTickets&&<div className="flight-ticket-numbers"><dt>{tickets.length===1?'Ticket':'Tickets'}</dt><dd>{tickets.length?<ul>{tickets.map((ticket,i)=><li key={i}><span>{ticket.number}</span>{!card&&ticket.passenger&&<small>{ticket.passenger}</small>}</li>)}</ul>:'Não informado'}</dd></div>}
  </dl>
 </div>;
}
