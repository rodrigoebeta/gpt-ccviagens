import {ArrowRight} from 'lucide-react';
import type {ReservationData} from '@/lib/contracts';
import {transitTitle} from '@/lib/transit-details';
import './transit.css';

export default function TransitSummary({reservation:r,card=false}:{reservation:ReservationData;card?:boolean}){
 const t=r.transit,origin=t?.originStation||r.locationPoint?.name,destination=t?.destinationStation||r.destinationPoint?.name;
 const station=r.kind==='bus'?'Terminal não informado':'Estação não informada';
 return <div className="transit-summary">
  {card&&(!origin&&!destination?<h3>{r.title}</h3>:<h3 className="sr-only">{transitTitle({...t,originStation:origin,destinationStation:destination},r.kind==='bus'?'bus':'train')}</h3>)}
  <dl className="transit-route">
   <div><dt>Partida</dt><dd><strong>{origin||station}</strong><span>{t?.originCity||'Cidade não informada'}</span></dd></div>
   <ArrowRight aria-hidden="true"/>
   <div><dt>Chegada</dt><dd><strong>{destination||station}</strong><span>{t?.destinationCity||'Cidade não informada'}</span></dd></div>
  </dl>
  <dl className="transit-service"><div><dt>Número do serviço</dt><dd>{t?.number||'Não informado'}</dd></div></dl>
 </div>;
}
