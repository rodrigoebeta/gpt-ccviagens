'use client';
import ReservationIcon from './reservation-icon';
import {reservationOffset} from '@/lib/timezone-options';
import {compactAddress} from '@/lib/place-presentation';
import PlacePhotoView from './place-photo';
import {CalendarMinus,ImagePlus,GripVertical,ArrowDown,ArrowUp,ArrowUpRight,MoreHorizontal,Trash2,Check,ChevronRight,FileText,Hotel,Bus,MapPin,Pencil,Plane,TrainFront} from 'lucide-react';
import type {Place,Reservation} from '@/lib/contracts';
import {dayTimeline,type TimelineEvent} from '@/lib/timeline';
import {Fragment,useRef,useState,type ReactNode} from 'react';
import {useDroppable} from '@dnd-kit/core';
import {SortableContext,useSortable,verticalListSortingStrategy,arrayMove} from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';
import type {DayPlanningControls} from './planning-workspace';
import {DropdownMenu,DropdownMenuContent,DropdownMenuItem,DropdownMenuSeparator,DropdownMenuTrigger} from '@/components/ui/dropdown-menu';
import {Skeleton} from '@/components/ui/skeleton';
export default function DayTimeline({reservations,places,day,loading,canEdit,busy,onReservation,onEditReservation,controls}:{reservations:Reservation[];places:Place[];day:string;loading:boolean;canEdit:boolean;busy:boolean;onReservation:(r:Reservation,tab?:string)=>void;onEditReservation:(r:Reservation)=>void;controls:DayPlanningControls}){
 const {setNodeRef:setDropRef,isOver}=useDroppable({id:'day-schedule',disabled:!canEdit||loading||busy||controls.busy||controls.order.saving||!controls.order.ready});
 const [fullAddresses,setFullAddresses]=useState<Set<string>>(()=>new Set());
 function toggleAddress(id:string){setFullAddresses(current=>{const next=new Set(current);if(next.has(id))next.delete(id);else next.add(id);return next;});}
 const blocked=busy||controls.busy||controls.order.saving||!controls.order.ready;
 const events=dayTimeline(reservations,places,day,controls.order.ids),visited=places.filter(p=>p.date===day&&p.visited).length;
 const ids=events.map(e=>e.id);
 function move(id:string,delta:-1|1){const i=ids.indexOf(id),to=i+delta;if(i<0||to<0||to>=ids.length||blocked)return;void controls.order.reorder(arrayMove(ids,i,to));}
 return <section ref={setDropRef} className={"schedule"+(controls.draggingPlace?" accepting-place":"")+(isOver?" drop-ready":"")} aria-label="Programação do dia">{controls.draggingPlace&&<div className="schedule-drop-hint">Solte na linha para escolher a posição</div>}<div className="section-heading route-heading"><h2 id="route-title" tabIndex={-1}>Roteiro</h2><span>{loading?'Carregando…':`${events.length} ${events.length===1?'item':'itens'}`}</span></div>
 <div className="timeline-toolbar">{controls.toolbar}</div>{controls.map}
 {controls.order.error&&<div className="timeline-order-error" role="alert"><p>{controls.order.error}</p><button className="text-button" onClick={()=>void controls.onRefresh()}>Atualizar programação</button></div>}
 {controls.order.saving&&<p className="muted" role="status">Salvando ordem…</p>}{controls.order.notice&&!controls.order.saving&&<p className="planning-notice" role="status">{controls.order.notice}</p>}
 {visited>0&&<p className="visit-progress">{visited} {visited===1?'lugar visitado':'lugares visitados'} neste dia</p>}
 {loading?<Skeleton className="h-64 w-full"/>:<>
 <SortableContext items={ids} strategy={verticalListSortingStrategy}><ol className="day-timeline">{events.map((e,index)=>{const p=e.place,r=e.reservation;return <Fragment key={e.id}><InsertionSlot index={index} active={controls.draggingPlace} disabled={!canEdit||blocked}/><SortableEvent event={e} canEdit={canEdit} blocked={blocked} index={ids.indexOf(e.id)} count={ids.length} onMove={delta=>move(e.id,delta)} onRemove={p?()=>controls.onRemove(p):undefined} extraActions={p?(defer)=><>{p.address&&<DropdownMenuItem onSelect={()=>toggleAddress(p.id)}><MapPin/>{fullAddresses.has(p.id)?'Resumir endereço':'Ver endereço completo'}</DropdownMenuItem>}<DropdownMenuItem asChild><a href={p.url||'https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(p.name+' '+p.address)} target="_blank" rel="noreferrer"><ArrowUpRight/>Abrir página do lugar</a></DropdownMenuItem>{canEdit&&<><DropdownMenuSeparator/><DropdownMenuItem disabled={blocked} onSelect={()=>defer(()=>controls.onPhoto(p))}><ImagePlus/>{p.photo?'Trocar foto':'Adicionar foto'}</DropdownMenuItem><DropdownMenuItem disabled={blocked} onSelect={()=>defer(()=>controls.onEdit(p))}><Pencil/>Editar lugar</DropdownMenuItem>{p.listId&&<DropdownMenuItem disabled={blocked} onSelect={()=>defer(()=>controls.onUnschedule(p))}><CalendarMinus/>Remover do roteiro</DropdownMenuItem>}</>}</>:undefined}>

  {p?<TimelinePlace place={p} fullAddress={fullAddresses.has(p.id)} canEdit={canEdit} blocked={blocked} onVisited={()=>controls.onVisited(p)}/>:r&&<article className="timeline-card"><div className="timeline-card-top"><span>{<ReservationIcon kind={r.kind}/>}{e.label}</span><span>{r.documents.length} arquivo(s)</span></div><h3>{r.title}</h3><p>{e.id.endsWith('-end')?r.destination:r.location}</p>{r.kind!=='hotel'&&!e.id.endsWith('-end')&&<p className="muted">{r.kind==='activity'?'Fim':r.kind==='car'?'Devolução':'Chegada'}: {r.endTime??'a consultar'}{r.endTime?' · '+reservationOffset(r.endTimezone||r.timezone,r.endDate,r.endTime):''}{r.endDate!==r.startDate?' · '+new Date(r.endDate+'T12:00:00').toLocaleDateString('pt-BR',{day:'numeric',month:'short'}):''}{r.destination?' · '+r.destination:''}</p>}<small className="muted">{e.id.endsWith('-end')||e.id.endsWith('-out')?r.endTimezone||r.timezone||'Horário local':r.timezone||'Horário local'}</small><div className="timeline-actions">{r.documents.length>0&&<button onClick={()=>onReservation(r,'docs')}><FileText/> Documentos</button>}<button onClick={()=>onReservation(r)}>Ver reserva <ChevronRight/></button>{canEdit&&<button onClick={()=>onEditReservation(r)}><Pencil/> Editar reserva</button>}</div></article>}
 </SortableEvent></Fragment>;})}<InsertionSlot index={events.length} active={controls.draggingPlace} disabled={!canEdit||blocked}/></ol></SortableContext>
 {!events.length&&<div className="empty-state"><MapPin/><h2>Um dia em aberto.</h2><p>Adicione um lugar ao dia, escolha um das suas listas ou importe uma reserva.</p><a className="text-button" href="#planejamento">Escolher das listas <ChevronRight/></a></div>}</>}

 {events.length>0&&<details className="route-help"><summary>Sobre a ordem e os horários</summary><p>{canEdit?'Arraste pela alça para organizar o dia ou use Mais opções. ':''}Os horários são referências das reservas; mudar a ordem não altera horários nem datas.</p></details>}</section>;
}

function InsertionSlot({index,active,disabled}:{index:number;active:boolean;disabled:boolean}){
 const {setNodeRef,isOver}=useDroppable({id:'day-insert:'+index,data:{kind:'insertion',index},disabled:disabled||!active});
 return <li ref={setNodeRef} aria-hidden="true" className={'timeline-insertion'+(active?' is-active':'')+(isOver?' is-target':'')}><span>{isOver?'Inserir aqui':null}</span></li>;
}

function SortableEvent({event,canEdit,blocked,index,count,onMove,onRemove,extraActions,children}:{event:TimelineEvent;canEdit:boolean;blocked:boolean;index:number;count:number;onMove:(delta:-1|1)=>void;onRemove?:()=>void;extraActions?:(defer:(action:()=>void)=>void)=>ReactNode;children:ReactNode}){
 const {attributes,listeners,setNodeRef,setActivatorNodeRef,transform,transition,isDragging}=useSortable({id:event.id,disabled:!canEdit||blocked});
 const menuTrigger=useRef<HTMLButtonElement|null>(null),pendingAction=useRef<(()=>void)|null>(null);
 const name=event.place?.name??((event.reservation?.title??'Reserva')+' · '+event.label);
 return <li ref={setNodeRef} style={{transform:CSS.Transform.toString(transform),transition,opacity:isDragging?0.35:1}} className={'timeline-entry'+(event.place?.visited?' is-visited':'')}>
  <div className="timeline-row-controls"><span className={'timeline-dot'+(event.place?' timeline-place-number':'')} aria-label={event.place?'Lugar '+event.number:undefined} aria-hidden={event.place?undefined:true}>{event.place?event.number:null}</span>{event.time&&<time className="timeline-time">{event.time}{event.reservation&&<small>{event.id.endsWith('-end')||event.id.endsWith('-out')?reservationOffset(event.reservation.endTimezone||event.reservation.timezone,event.reservation.endDate,event.time):reservationOffset(event.reservation.timezone,event.reservation.startDate,event.time)}</small>}</time>}
  {(canEdit||extraActions)&&<div className="timeline-reorder-controls">{canEdit&&<button ref={setActivatorNodeRef} {...attributes} {...listeners} className="timeline-drag-handle" aria-label={'Reordenar '+name} title="Arrastar para reordenar" disabled={blocked}><GripVertical/></button>}
  <DropdownMenu><DropdownMenuTrigger asChild><button ref={menuTrigger} className="icon-button" aria-label={'Mais opções de '+name}><MoreHorizontal/></button></DropdownMenuTrigger><DropdownMenuContent align="end" onCloseAutoFocus={e=>{if(pendingAction.current){e.preventDefault();const action=pendingAction.current;pendingAction.current=null;menuTrigger.current?.focus();action();}}}>{extraActions?.(action=>{pendingAction.current=action;})}{canEdit&&<>{extraActions&&<DropdownMenuSeparator/>}<DropdownMenuItem disabled={blocked||index===0} onSelect={()=>onMove(-1)}><ArrowUp/> Mover para cima</DropdownMenuItem><DropdownMenuItem disabled={blocked||index===count-1} onSelect={()=>onMove(1)}><ArrowDown/> Mover para baixo</DropdownMenuItem>{onRemove&&<DropdownMenuItem disabled={blocked} variant="destructive" onSelect={onRemove}><Trash2/> Remover lugar</DropdownMenuItem>}</>}</DropdownMenuContent></DropdownMenu></div>}
  </div>{children}
 </li>;
}

function TimelinePlace({place:p,fullAddress,canEdit,blocked,onVisited}:{place:Place;fullAddress:boolean;canEdit:boolean;blocked:boolean;onVisited:()=>void}){
 const address=compactAddress(p.address),destination=p.latitude!==null?p.latitude+','+p.longitude:p.name+' '+p.address;
 return <article className="timeline-card timeline-place"><h3>{p.name}</h3>{p.address&&<p className="timeline-place-address">{fullAddress?p.address:<>{address.street}{address.locality&&<span> · {address.locality}</span>}</>}</p>}{p.photo&&<PlacePhotoView key={p.photo.id} photo={p.photo} name={p.name}/>}
 {p.notes&&<p className="timeline-place-note">{p.notes}</p>}
 <div className="timeline-place-footer"><a href={'https://www.google.com/maps/dir/?api=1&destination='+encodeURIComponent(destination)} target="_blank" rel="noreferrer">Como chegar <ArrowUpRight/></a>{canEdit?<button className="visit-toggle" aria-label={p.visited?'Desmarcar visita':'Marcar como visitado'} aria-pressed={p.visited} disabled={blocked} onClick={onVisited}><Check/>Visitado</button>:p.visited&&<span className="visited-label"><Check/>Visitado</span>}</div></article>;
}
