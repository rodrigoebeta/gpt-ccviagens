import {ArrowRight} from 'lucide-react';
import type {ReservationData} from '@/lib/contracts';
import {flightTitle} from '@/lib/flight-details';
import {shortReservationAddress} from './reservation-address';

export default function FlightSummary({reservation:r}:{reservation:ReservationData}){
 const f=r.flight;
 return <div className="flight-summary">
  {!f?.originIata&&!f?.destinationIata&&<h3 className="flight-legacy-title">{r.title}</h3>}
  {(f?.originIata||f?.destinationIata)&&<h3 className="sr-only">{flightTitle(f)}</h3>}
  <dl className="flight-route"><div><dt>Origem</dt><dd><strong>{f?.originIata||'—'}</strong><span>{f?.originAirport||shortReservationAddress(r.location)||'Aeroporto não informado'}</span></dd></div><ArrowRight aria-hidden="true"/><div><dt>Destino</dt><dd><strong>{f?.destinationIata||'—'}</strong><span>{f?.destinationAirport||shortReservationAddress(r.destination)||'Aeroporto não informado'}</span></dd></div></dl>
  <dl className="flight-identifiers"><div><dt>Voo</dt><dd>{f?.number||'Não informado'}</dd></div><div><dt>Localizador</dt><dd>{f?.locator||'Não informado'}</dd></div><div className="flight-ticket-numbers"><dt>{f?.tickets?.length===1?'Ticket':'Tickets'}</dt><dd>{f?.tickets?.length?<ul>{f.tickets.map((ticket,i)=><li key={i}><span>{ticket.number}</span>{ticket.passenger&&<small>{ticket.passenger}</small>}</li>)}</ul>:'Não informado'}</dd></div></dl>
 </div>;
}
