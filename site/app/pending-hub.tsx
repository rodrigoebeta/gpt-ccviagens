'use client';
import {ChevronDown,ChevronRight,FileText,MapPinOff,LoaderCircle,RefreshCw} from 'lucide-react';
import type {Review} from '@/lib/contracts';
import type {LocationState} from '@/lib/reservation-map';
export default function PendingHub({reviews,locations,error,busy,onReview,onReservation,onRetry,onRefresh}:{reviews:Review[];locations:LocationState[];error:string;busy:boolean;onReview:(r:Review)=>void;onReservation:(id:string)=>void;onRetry:(key:string)=>void;onRefresh:()=>void}){
 const issues=locations.filter(l=>l.status==='unresolved'||l.status==='temporary'),pending=locations.filter(l=>l.status==='pending'||l.status==='processing').length,total=reviews.length+issues.length;
 if(!total&&!pending&&!error)return null;
 const counts=[reviews.length?`${reviews.length} ${reviews.length===1?'reserva para revisar':'reservas para revisar'}`:'',issues.length?`${issues.length} ${issues.length===1?'localização para conferir':'localizações para conferir'}`:''].filter(Boolean).join(' · ');
 return <details className="pending-hub" id="revisoes">
  <summary><span className="hub-heading"><strong>{total?`${total} ${total===1?'pendência':'pendências'} na viagem`:error?'Localizações indisponíveis':'Conferindo localizações'}</strong><small>{counts||'Reservas salvas; a programação continua disponível.'}{pending>0&&<span className="hub-progress"><LoaderCircle aria-hidden="true" className="spin"/>Verificando {pending} {pending===1?'localização':'localizações'}…</span>}</small></span><span className="hub-action"><span className="hub-show">Ver pendências</span><span className="hub-hide">Recolher</span><ChevronDown aria-hidden="true"/></span></summary>
  <div className="hub-body">
   {reviews.map(r=><section className="pending-row" key={r.id}><FileText aria-hidden="true" className="pending-icon"/><div className="pending-copy"><div className="pending-title"><h3>{r.reservation.title}</h3><span>Dados da reserva</span></div><p>{r.reason}</p></div><div className="pending-actions"><button className="pending-primary" onClick={()=>onReview(r)}>Revisar dados<ChevronRight aria-hidden="true"/></button></div></section>)}
   {issues.map(l=><section className="pending-row" key={l.key}><MapPinOff aria-hidden="true" className="pending-icon"/><div className="pending-copy"><div className="pending-title"><h3>{l.title} · {l.label}</h3><span>{l.status==='temporary'?'Consulta indisponível':'Localização no mapa'}</span></div><p>{l.note}</p>{l.status==='temporary'&&<p>A reserva está salva. A falha na consulta não significa que o endereço está incorreto.</p>}</div><div className="pending-actions"><button className="pending-primary" onClick={()=>onReservation(l.reservationId)}>Conferir reserva<ChevronRight aria-hidden="true"/></button><button className="pending-retry" disabled={busy} onClick={()=>onRetry(l.key)}>{busy?'Consultando…':'Tentar localizar novamente'}</button></div></section>)}
   {error&&<div className="pending-load-error"><p role="alert">{error}</p><button onClick={onRefresh}><RefreshCw aria-hidden="true"/>Tentar novamente</button></div>}
   {pending>0&&<p className="pending-checking" role="status">A busca continua em segundo plano. Você pode seguir usando a programação.</p>}
  </div>
 </details>;
}
