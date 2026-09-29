'use client';
import {usePwa} from './pwa-client';
import NoticeToast from './notice-toast';
import {useEffect,useRef,useState,type FormEvent,type ReactNode} from 'react';
import {ArrowRight,ArrowUpRight,CalendarPlus,Check,ChevronRight,FolderPlus,LoaderCircle,Map,MapPin,Pencil,Plus,RefreshCw,Trash2} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {Checkbox} from '@/components/ui/checkbox';
import {Select,SelectContent,SelectItem,SelectTrigger,SelectValue} from '@/components/ui/select';
import {Dialog,DialogContent,DialogHeader,DialogTitle,DialogDescription} from '@/components/ui/dialog';
import {DropdownMenu,DropdownMenuContent,DropdownMenuItem,DropdownMenuSeparator,DropdownMenuTrigger} from '@/components/ui/dropdown-menu';
import type {Place,PlaceData,PlaceList,Review,Trip,Reservation} from '@/lib/contracts';
import {parsePlaceLink} from '@/lib/place-links';
import {compactAddress} from '@/lib/place-presentation';
import PlacePhotoView from './place-photo';
import PlacePhotoEditor from './place-photo-editor';
import {DateField} from './date-time-fields';
import type {GeoResult} from '@/lib/geography';
type SearchResult=GeoResult&{context:{label:string;tier:0|1|2;distanceKm:number}|null};
import {ImagePlus,GripVertical,ChevronDown,MoreHorizontal} from 'lucide-react';
import {DndContext,DragOverlay,PointerSensor,KeyboardSensor,pointerWithin,closestCenter,useDraggable,useSensor,useSensors} from '@dnd-kit/core';
import {sortableKeyboardCoordinates,arrayMove} from '@dnd-kit/sortable';
import DayMap from './day-map';
import PendingHub from './pending-hub';
import {useReservationLocations} from './use-reservation-locations';
import {reservationMapCandidates} from '@/lib/reservation-map';
import {orderedPlaces,dayTimeline,insertEventAt} from '@/lib/timeline';
import {useDayOrder} from './use-day-order';
const dateLabel=(d:string)=>new Date(d+'T12:00:00').toLocaleDateString('pt-BR',{day:'numeric',month:'short'});
async function request(path:string,body?:unknown,method=body?'POST':'GET'){
 const r=await fetch(path,{method,headers:body?{'Content-Type':'application/json'}:undefined,body:body?JSON.stringify(body):undefined});const d=await r.json() as {error?:string;places:Place[];lists:PlaceList[];reviews:Review[];id?:string;results:SearchResult[];context:{label:string;tier:number}|null;contextNote:string};if(!r.ok)throw Error(d.error??'Não foi possível concluir.');return d;
}
function placeData(p:Place):PlaceData{const {id,position,revision,photo,...data}=p;void id;void position;void revision;void photo;return data;}
export type DayPlanningControls={toolbar:ReactNode;map:ReactNode;lists:ReactNode;draggingPlace:boolean;daily:Place[];busy:boolean;onEdit:(p:Place)=>void;onPhoto:(p:Place)=>void;onVisited:(p:Place)=>void;onRemove:(p:Place)=>void;onUnschedule:(p:Place)=>void;order:ReturnType<typeof useDayOrder>;onRefresh:()=>Promise<void>};
export default function PlanningWorkspace({trip,day,reservations,refreshKey,onChanged,onPlaces,onLoading,onReservation,onAddReservation,renderDay}:{trip:Trip;day:string;reservations:Reservation[];refreshKey:number;onChanged:()=>Promise<void>;onPlaces:(places:Place[])=>void;onLoading:(loading:boolean)=>void;onReservation:(reservation:Reservation)=>void;onAddReservation:()=>void;renderDay:(controls:DayPlanningControls)=>ReactNode}){
 const {offline}=usePwa();
 const base='/api/trips/'+trip.id,canEdit=!offline&&trip.role!=='reader';
 const locationState=useReservationLocations(trip.id,refreshKey);
 const order=useDayOrder(trip.id,day,refreshKey);
 const [draggedId,setDraggedId]=useState<string|null>(null),scheduleLock=useRef(false);
 useEffect(()=>setDraggedId(null),[day]);
 const sensors=useSensors(useSensor(PointerSensor,{activationConstraint:{distance:8}}),useSensor(KeyboardSensor,{coordinateGetter:(event,args)=>{
  if(!String(args.context.active?.id).startsWith('list-place:'))return sortableKeyboardCoordinates(event,args);
  if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(event.code))return undefined;
  event.preventDefault();
  const slots=args.context.droppableContainers.getEnabled().filter(c=>c.data.current?.kind==='insertion').sort((a,b)=>a.data.current!.index-b.data.current!.index);
  const current=slots.findIndex(c=>c.id===args.context.over?.id);
  const index=current<0?0:Math.max(0,Math.min(slots.length-1,current+(event.code==='ArrowUp'||event.code==='ArrowLeft'?-1:1)));
  const rect=slots[index]&&args.context.droppableRects.get(slots[index].id);
  return rect?{x:rect.left+rect.width/2,y:rect.top+rect.height/2}:undefined;
 }}));
 const [places,setPlaces]=useState<Place[]>([]),[lists,setLists]=useState<PlaceList[]>([]),[reviews,setReviews]=useState<Review[]>([]);
 const [listId,setListId]=useState(''),[loading,setLoading]=useState(true),[busy,setBusy]=useState(false),[error,setError]=useState(''),[notice,setNotice]=useState('');
 const [selecting,setSelecting]=useState(false),[selected,setSelected]=useState<{id:string;revision:number}[]>([]),[selectionDay,setSelectionDay]=useState(day),[selectionError,setSelectionError]=useState('');
 const selectionTrigger=useRef<HTMLButtonElement|null>(null),selectAll=useRef<HTMLButtonElement|null>(null);
 useEffect(()=>{setSelecting(false);setSelected([]);setSelectionError('');},[listId,base,canEdit]);
 useEffect(()=>{setSelected(current=>current.filter(s=>places.some(p=>p.id===s.id&&p.revision===s.revision&&p.listId===listId&&!p.date)));},[places,listId]);
 useEffect(()=>{if(selecting)selectAll.current?.focus();},[selecting]);
 const [draft,setDraft]=useState<PlaceData|null>(null),[editing,setEditing]=useState<Place|null>(null),[removing,setRemoving]=useState<Place|null>(null);
 const [listEditor,setListEditor]=useState<PlaceList|'new'|null>(null),[listName,setListName]=useState(''),[showMap,setShowMap]=useState(false),[linkNote,setLinkNote]=useState('');
 const listMenuTrigger=useRef<HTMLButtonElement|null>(null),pendingListAction=useRef<(()=>void)|null>(null);
 const [searchQuery,setSearchQuery]=useState(''),[searchResults,setSearchResults]=useState<SearchResult[]>([]),[searchBusy,setSearchBusy]=useState(false),[searchDone,setSearchDone]=useState(false);
 const [nearby,setNearby]=useState(true),[searchContextNote,setSearchContextNote]=useState('');
 const [entryMode,setEntryMode]=useState<'search'|'link'|'details'>('search');const placeField=useRef<HTMLInputElement|null>(null);
 const draftOpen=!!draft;useEffect(()=>{if(draftOpen){const frame=requestAnimationFrame(()=>placeField.current?.focus());return()=>cancelAnimationFrame(frame);}},[entryMode,draftOpen]);
 const [photoPlace,setPhotoPlace]=useState<Place|null>(null);const photoTrigger=useRef<HTMLElement|null>(null),editTrigger=useRef<HTMLElement|null>(null);
 function openPhoto(p:Place){photoTrigger.current=document.activeElement as HTMLElement;setPhotoPlace(p);}
 const reviewTrigger=useRef<HTMLElement|null>(null);
 const reviewHeading=useRef<HTMLHeadingElement>(null),searchEpoch=useRef(0),removeTrigger=useRef<HTMLElement|null>(null);
 const [review,setReview]=useState<Review|null>(null),[reviewDates,setReviewDates]=useState({startDate:'',endDate:''});
 async function refresh(){const [p,l,r]=await Promise.all([request(base+'/places'),request(base+'/lists'),request(base+'/reviews')]);setPlaces(p.places);onPlaces(p.places);setLists(l.lists);setReviews(r.reviews);setListId(v=>v||l.lists[0]?.id||'');}
 useEffect(()=>{let active=true;setLoading(true);onLoading(true);Promise.all([request(base+'/places'),request(base+'/lists'),request(base+'/reviews')]).then(([p,l,r])=>{if(active){setPlaces(p.places);onPlaces(p.places);setLists(l.lists);setReviews(r.reviews);setListId(v=>v||l.lists[0]?.id||'');}}).catch(e=>active&&setError(e.message)).finally(()=>{if(active){setLoading(false);onLoading(false);}});return()=>{active=false;};},[base,refreshKey]);
 async function run(fn:()=>Promise<void>,message:string){setBusy(true);setError('');setNotice('');try{await fn();await refresh();setNotice(message);return true;}catch(e){setError((e as Error).message);return false;}finally{setBusy(false);}}
 const draggedPlace=places.find(p=>'list-place:'+p.id===draggedId)??null;
 const events=dayTimeline(reservations,places,day,order.ids),eventIds=events.map(e=>e.id);
 const draggedEvent=events.find(e=>e.id===draggedId);
 const dragTitle=draggedPlace?.name??draggedEvent?.place?.name??draggedEvent?.reservation?.title;
 const daily=orderedPlaces(places,day,order.ids),visible=places.filter(p=>p.listId===listId),currentList=lists.find(l=>l.id===listId);
 const eligible=visible.filter(p=>!p.date),selectedIds=new Set(selected.map(p=>p.id));
 function closeSelection(){setSelecting(false);setSelected([]);setSelectionError('');requestAnimationFrame(()=>{(selectionTrigger.current??document.getElementById('planning-title'))?.focus();});}
 async function scheduleSelection(e:FormEvent){
  e.preventDefault();if(!canEdit||busy||scheduleLock.current||!selected.length||!selectionDay)return;
  scheduleLock.current=true;setBusy(true);setSelectionError('');setNotice('');
  const count=selected.length,date=selectionDay;
  try{
   await request(base+'/places/schedule',{listId,date,places:selected});
   setNotice(count===1?'Lugar incluído em '+dateLabel(date)+'.':count+' lugares incluídos em '+dateLabel(date)+'.');
   try{await refresh();}catch{setError('Os lugares foram incluídos. Atualize a página para conferir o roteiro.');}
   closeSelection();
  }catch(e){
   setSelectionError((e as Error).message);
   try{await refresh();}catch{setSelected([]);setSelectionError('Não foi possível confirmar a inclusão. Atualize a página e confira o roteiro antes de tentar novamente.');}
  }finally{setBusy(false);scheduleLock.current=false;}
 }
 function add(toDay=false){editTrigger.current=document.activeElement as HTMLElement;setEntryMode('search');searchEpoch.current++;setSearchBusy(false);setSearchQuery('');setSearchResults([]);setSearchDone(false);setEditing(null);setLinkNote('');setError('');setDraft({name:'',address:'',url:'',date:toDay?day:null,time:null,latitude:null,longitude:null,notes:'',visited:false,listId:toDay?null:(listId||lists[0]?.id||null)});}
 function edit(p:Place){setEntryMode('details');editTrigger.current=document.activeElement as HTMLElement;searchEpoch.current++;setSearchBusy(false);setSearchQuery('');setSearchResults([]);setSearchDone(false);setError('');setEditing(p);setLinkNote('');setDraft(placeData(p));}
 async function save(e:FormEvent){e.preventDefault();if(!draft)return;if(!draft.name.trim()){setError('Informe o nome do lugar.');placeField.current?.focus();return;}if(!draft.date&&!draft.listId){setError('Escolha um dia ou uma lista para guardar o lugar.');return;}if(draft.date&&(draft.date<trip.start_date||draft.date>trip.end_date)){setError('Escolha um dia dentro do período da viagem.');return;}const ok=await run(async()=>{await request(base+'/places',editing?{id:editing.id,revision:editing.revision,place:draft}:draft,editing?'PATCH':'POST');},'Lugar salvo.');if(ok)setDraft(null);}
 async function schedule(p:Place,index?:number){
  if(!canEdit||busy||scheduleLock.current||p.date||!order.ready||order.saving)return;
  scheduleLock.current=true;let placementFailed=false;
  try{await run(async()=>{
   await request(base+'/places',{id:p.id,revision:p.revision,place:{...placeData(p),date:day}},'PATCH');
   if(index!==undefined)placementFailed=!await order.reorder(insertEventAt(eventIds,p.id,index));
  },'Lugar incluído em '+dateLabel(day));
  if(placementFailed){setNotice('');setError('O lugar foi incluído no dia, mas a posição não foi confirmada. Atualize a programação e confira a ordem.');}
  }finally{scheduleLock.current=false;}
 }
 async function unschedule(p:Place){
  if(!canEdit||busy||scheduleLock.current||order.saving)return;
  const destination=p.listId;
  if(!destination)return;
  scheduleLock.current=true;
  try{const ok=await run(async()=>{await request(base+'/places',{id:p.id,revision:p.revision,place:{...placeData(p),date:null,time:null,listId:destination}},'PATCH');},'Lugar guardado em '+(lists.find(l=>l.id===destination)?.name??'sua lista')+'.');
   if(ok){setListId(destination);document.getElementById('route-title')?.focus();}
  }finally{scheduleLock.current=false;}
 }
 function readLink(){if(!draft)return;const parsed=parsePlaceLink(draft.url);setDraft({...draft,...parsed});setLinkNote(parsed.latitude!==undefined?'Localização encontrada no link. Confira o nome e o ponto antes de salvar.':parsed.name?'Nome encontrado. Confira antes de adicionar.':'Não foi possível obter os dados deste link. Ele será guardado; informe o nome do lugar.');setEntryMode('details');}
 function chooseEntry(mode:'search'|'link'|'details'){searchEpoch.current++;setSearchBusy(false);setError('');setLinkNote('');setEntryMode(mode);}
 async function searchPlaces(e:FormEvent){e.preventDefault();if(searchBusy||searchQuery.trim().length<3)return;const epoch=++searchEpoch.current;setSearchBusy(true);setError('');setSearchDone(false);setSearchResults([]);try{const d=await request(base+'/place-search',{query:searchQuery,day:draft?.date??day,nearby});if(epoch!==searchEpoch.current)return;setSearchResults(d.results);setSearchContextNote(d.contextNote||(d.context?`Prioridade: ${d.context.tier===0?'hospedagem':d.context.tier===1?'roteiro do dia':'destino'} · ${d.context.label}`:'Sem localização de referência; resultados pela correspondência com a busca.'));setSearchDone(true);}catch(e){if(epoch===searchEpoch.current)setError((e as Error).message);}finally{if(epoch===searchEpoch.current)setSearchBusy(false);}}
 function closePlace(){if(busy)return;searchEpoch.current++;setDraft(null);setError('');}
 async function resolve(action:'accept'|'dismiss'){
  if(!review)return;const ok=await run(async()=>{await request(base+'/reviews',{id:review.id,action,baseFingerprint:review.baseFingerprint,...(action==='accept'?{reservation:{...review.reservation,...reviewDates}}:{})});await onChanged();},action==='accept'?'Revisão aplicada.':'Proposta descartada; reserva salva preservada.');if(ok)setReview(null);
 }
 const listsPanel=(<section id="planejamento" className="planning-workspace" aria-labelledby="planning-title">
  <div className="section-heading"><h2 id="planning-title" tabIndex={-1}>Listas de lugares</h2><Button variant="ghost" size="icon" aria-label="Atualizar lugares e revisões" disabled={busy||loading} onClick={()=>run(refresh,'Listas e revisões atualizadas.')}><RefreshCw/></Button></div>
  <div className="planning-toolbar"><div className="list-picker-row"><Select value={listId} onValueChange={setListId} disabled={busy||loading||!lists.length}><SelectTrigger aria-label="Lista de lugares"><SelectValue placeholder={loading?'Carregando listas…':'Nenhuma lista'}/></SelectTrigger><SelectContent>{lists.map(l=><SelectItem key={l.id} value={l.id}>{l.name}</SelectItem>)}</SelectContent></Select>{canEdit&&!selecting&&<DropdownMenu><DropdownMenuTrigger asChild><Button ref={listMenuTrigger} variant="ghost" size="icon" aria-label="Opções da lista" disabled={busy}><MoreHorizontal/></Button></DropdownMenuTrigger><DropdownMenuContent align="end" onCloseAutoFocus={e=>{if(pendingListAction.current){e.preventDefault();const action=pendingListAction.current;pendingListAction.current=null;listMenuTrigger.current?.focus();action();}}}><DropdownMenuItem disabled={!currentList} onSelect={()=>{pendingListAction.current=()=>{setListEditor(currentList!);setListName(currentList!.name);setError('');};}}><Pencil/>Renomear lista</DropdownMenuItem><DropdownMenuItem onSelect={()=>{pendingListAction.current=()=>{setListEditor('new');setListName('');setError('');};}}><FolderPlus/>Nova lista</DropdownMenuItem></DropdownMenuContent></DropdownMenu>}</div>{canEdit&&!selecting&&<div className="list-entry-actions"><Button variant="outline" className="list-add" disabled={busy||loading||!lists.length} onClick={()=>add()}><Plus/> Guardar lugar</Button>
   {!!eligible.length&&<Button ref={selectionTrigger} variant="ghost" className="list-select-action" disabled={busy||loading} onClick={()=>{setSelectionDay(day);setSelected([]);setSelectionError('');setSelecting(true);}}>Selecionar lugares</Button>}
  </div>}</div>
  {selecting&&<form className="list-selection-controls" onSubmit={scheduleSelection} aria-label="Incluir lugares no roteiro">
   <div className="list-selection-heading"><span role="status">{selected.length} {selected.length===1?'selecionado':'selecionados'}</span><Button type="button" variant="ghost" disabled={busy} onClick={closeSelection}>Cancelar seleção</Button></div>
   <fieldset disabled={busy} className="list-selection-destination form-stack">
    <DateField label="Dia do roteiro" value={selectionDay} onChange={setSelectionDay} min={trip.start_date} max={trip.end_date} required/>
    <Button type="submit" disabled={busy||!selected.length||!selectionDay||selected.length>500}>{busy?<LoaderCircle className="spin"/>:<CalendarPlus/>}{busy?'Incluindo…':'Incluir no roteiro'}</Button>
   </fieldset>
   {selectionError&&<p role="alert" className="form-error">{selectionError}</p>}
   {selected.length>500&&<p role="alert" className="form-error">Inclua até 500 lugares por vez.</p>}
   {visible.some(p=>p.date)&&<p className="list-selection-hint">Lugares já programados mantêm sua data.</p>}
   <label className="list-select-all"><Checkbox ref={selectAll} disabled={busy||!eligible.length} checked={!!eligible.length&&selected.length===eligible.length?true:selected.length?'indeterminate':false} onCheckedChange={checked=>setSelected(checked===true?eligible.map(p=>({id:p.id,revision:p.revision})):[])}/>Selecionar todos</label>
  </form>}
  {canEdit&&!selecting&&visible.some(p=>!p.date)&&<p className="list-drag-hint">Arraste até a posição desejada no roteiro ou use Incluir no dia.</p>}

  {loading?<p role="status">Carregando lugares…</p>:<>   {visible.length?<ol className="place-list">{visible.map(p=><ListPlace key={p.id} place={p} canDrag={canEdit&&!selecting&&!p.date&&!busy&&!loading&&order.ready&&!order.saving} day={day}>
    {selecting?<SelectablePlace place={p} checked={selectedIds.has(p.id)} disabled={busy} onChange={checked=>{setSelectionError('');setSelected(current=>checked?[...current.filter(s=>s.id!==p.id),{id:p.id,revision:p.revision}]:current.filter(s=>s.id!==p.id));}}/>:<ListPlaceContent place={p} day={day} canEdit={canEdit} busy={busy||!order.ready||order.saving} onSchedule={()=>schedule(p)} onEdit={()=>edit(p)} onPhoto={()=>openPhoto(p)} onRemove={()=>{removeTrigger.current=document.activeElement as HTMLElement;setRemoving(p);setError('');}} onVisited={()=>void run(async()=>{await request(base+'/places',{id:p.id,revision:p.revision,place:{...placeData(p),visited:!p.visited}},'PATCH');},p.visited?'Visita desmarcada.':'Lugar marcado como visitado.')}/>}
   </ListPlace>)}</ol>:<div className="planning-empty"><p>Esta lista ainda está vazia.<br/>Guarde lugares para escolher o dia depois.</p></div>}
</>}
  </section>);
 const mapCandidates=reservationMapCandidates(reservations,day);
 const mappable=mapCandidates.length>0||daily.some(p=>!p.visited&&p.latitude!==null&&p.longitude!==null);
 const controls:DayPlanningControls={
  lists:listsPanel,draggingPlace:!!draggedPlace,
  daily,busy,onUnschedule:p=>void unschedule(p),onEdit:edit,onPhoto:openPhoto,onVisited:p=>{void run(async()=>{await request(base+'/places',{id:p.id,revision:p.revision,place:{...placeData(p),visited:!p.visited}},'PATCH');},p.visited?'Visita desmarcada.':'Lugar marcado como visitado.');},onRemove:p=>{setRemoving(p);setError('');},order,onRefresh:async()=>{await Promise.all([refresh(),onChanged(),order.reload()]);},
  toolbar:<div className="day-actions">{<Button variant="outline" disabled={loading||(!showMap&&!mappable)} title={showMap||mappable?undefined:'Não há lugares ou reservas com localização neste dia'} aria-expanded={showMap} onClick={()=>setShowMap(!showMap)}><Map/>{showMap?'Fechar mapa':'Ver mapa'}</Button>}{canEdit&&<><Button className="primary" onClick={()=>add(true)} disabled={loading||busy}><Plus/> Adicionar lugar</Button><Button variant="outline" onClick={onAddReservation} disabled={loading||busy}><Plus/> Adicionar reserva</Button></>}</div>,
  map:showMap?(mappable?<DayMap key={trip.id+day} places={daily} points={locationState.locations.filter(l=>mapCandidates.some(c=>c.key===l.key)&&l.point).map(l=>l.point!)} pending={locationState.locations.filter(l=>mapCandidates.some(c=>c.key===l.key)&&(l.status==='pending'||l.status==='processing')).length}/>:<p className="map-empty" role="status">Nenhum lugar ou reserva disponível no mapa deste dia.</p>):null
 };
 return <>
  {error&&!draft&&!review&&!listEditor&&!removing&&<p role="alert" className="form-error">{error}</p>}
  <NoticeToast message={notice} onClose={()=>setNotice('')}/><div className="planning-status-row"><div className="planning-jump"><a className="lists-jump" href="#planejamento"><MapPin/> Listas de lugares <ChevronDown/></a></div></div>
  <PendingHub reviews={loading?[]:reviews} locations={locationState.locations} error={locationState.error} busy={locationState.busy} onRetry={key=>void locationState.retry(key)} onRefresh={locationState.refresh} onReservation={id=>{const r=reservations.find(r=>r.id===id);if(r)onReservation(r);}} onReview={r=>{reviewTrigger.current=document.activeElement as HTMLElement;setReview(r);setReviewDates({startDate:r.reservation.startDate,endDate:r.reservation.endDate});setError('');}}/>
  <DndContext key={day} sensors={sensors} collisionDetection={args=>{
   if(String(args.active.id).startsWith('list-place:')){
    const slots=args.droppableContainers.filter(c=>c.data.current?.kind==='insertion');
    if(args.pointerCoordinates&&!pointerWithin({...args,droppableContainers:args.droppableContainers.filter(c=>c.id==='day-schedule')}).length)return [];
    return closestCenter({...args,droppableContainers:slots});
   }
   return closestCenter({...args,droppableContainers:args.droppableContainers.filter(c=>eventIds.includes(String(c.id)))});
  }} onDragStart={({active})=>setDraggedId(String(active.id))} onDragCancel={()=>setDraggedId(null)} onDragEnd={({active,over})=>{
   setDraggedId(null);if(!over||busy||order.saving||!order.ready)return;
   const p=places.find(p=>'list-place:'+p.id===active.id);
   if(p&&over.data.current?.kind==='insertion')void schedule(p,over.data.current.index);
   else if(!p&&active.id!==over.id){const from=eventIds.indexOf(String(active.id)),to=eventIds.indexOf(String(over.id));if(from>=0&&to>=0)void order.reorder(arrayMove(eventIds,from,to));}
  }} accessibility={{screenReaderInstructions:{draggable:'Pressione espaço para pegar. Use as setas para escolher a posição no roteiro e espaço para soltar. Escape cancela.'},announcements:{onDragStart:()=> 'Item selecionado. Use as setas para escolher a posição.',onDragOver:({over})=>over?'Posição '+((over.data.current?.index??eventIds.indexOf(String(over.id)))+1)+' no roteiro.':'Fora do roteiro.',onDragEnd:({over})=>over?'Item solto. Salvando programação.':'Movimento cancelado.',onDragCancel:()=> 'Movimento cancelado.'}}}>
   {renderDay(controls)}
   <DragOverlay dropAnimation={null}>{dragTitle&&<div className="timeline-drag-preview"><GripVertical/><span>{dragTitle}</span></div>}</DragOverlay>
  </DndContext>
  {photoPlace&&<PlacePhotoEditor place={photoPlace} tripId={trip.id} onClose={()=>setPhotoPlace(null)} onSaved={refresh} returnFocus={()=>photoTrigger.current?.focus()}/>}
  <Dialog open={!!draft} onOpenChange={v=>{if(!v)closePlace();}}><DialogContent className="travel-dialog place-dialog" onOpenAutoFocus={e=>{e.preventDefault();placeField.current?.focus();}} onCloseAutoFocus={e=>{if(editTrigger.current?.isConnected){e.preventDefault();editTrigger.current.focus();}}}>
   <DialogHeader><DialogTitle>{editing?'Editar lugar':'Adicionar lugar'}</DialogTitle><DialogDescription>{entryMode==='details'?'Confira o lugar e onde quer guardá-lo.':'Encontre o lugar por nome ou use um link.'}</DialogDescription></DialogHeader>
   {draft&&(entryMode!=='details'?<div className="place-entry">
    <div className="place-modal-scroll">
     <div className="place-entry-methods" role="group" aria-label="Como encontrar o lugar"><button type="button" aria-pressed={entryMode==='search'} onClick={()=>chooseEntry('search')}>Buscar por nome</button><button type="button" aria-pressed={entryMode==='link'} onClick={()=>chooseEntry('link')}>Usar um link</button></div>
     {entryMode==='search'?<form className="form-stack place-lookup" onSubmit={searchPlaces}>
      <label htmlFor="place-query">Nome do lugar</label><div className="place-lookup-row"><input ref={placeField} id="place-query" value={searchQuery} maxLength={200} placeholder="Ex.: Louvre, Paris" onChange={e=>{setSearchQuery(e.target.value);setSearchDone(false);setSearchResults([]);searchEpoch.current++;setSearchBusy(false);}}/><Button className="primary" disabled={searchBusy||searchQuery.trim().length<3}>{searchBusy?<LoaderCircle className="spin"/>:<MapPin/>} Buscar</Button></div>
      <div className="search-context-control">
       <button type="button" className="search-context-toggle" role="switch" aria-checked={nearby} aria-label="Priorizar o contexto do dia" aria-describedby="search-context-help" onClick={()=>{setNearby(v=>!v);setSearchResults([]);setSearchDone(false);searchEpoch.current++;setSearchBusy(false);}}>
        <span>Priorizar o contexto do dia</span><span className="search-context-state" aria-hidden="true">{nearby?'Ativado':'Desativado'}<span className="search-context-track"><span/></span></span>
       </button>
       <p id="search-context-help" className="place-help">{nearby?'Hospedagem → roteiro do dia → destinos da viagem. Desative para pesquisar outra região.':'Busque em outra região incluindo a cidade no nome do lugar.'}</p>
       {searchDone&&<p role="status" className="search-context-reference"><MapPin aria-hidden="true"/><span>{nearby?searchContextNote:'Contexto do dia desativado; resultados pela correspondência com a busca.'}</span></p>}
      </div>
      {searchDone&&!searchResults.length&&<p role="status" className="place-help">Nenhum resultado. Tente incluir a cidade ou adicione manualmente.</p>}
      {searchResults.length>0&&<div className="place-search-matches"><p role="status" className="place-help">Selecione o lugar para conferir e salvar.</p><div className="search-results">{searchResults.map((r,i)=><button type="button" key={i} onClick={()=>{setDraft({...draft,name:r.name,address:r.address,url:r.url,latitude:r.latitude,longitude:r.longitude});setSearchResults([]);setSearchDone(false);setLinkNote('');setEntryMode('details');}}><strong>{r.name}</strong><small>{r.address}</small>{r.context&&<span className="search-proximity">{r.context.tier===0?"Perto da hospedagem":r.context.tier===1?"Perto do roteiro":"Na região do destino"}{r.context.tier<2?` · ${r.context.distanceKm.toLocaleString("pt-BR")} km em linha reta`:""}</span>}</button>)}</div></div>}
      <p className="place-source">Busca por Photon / OpenStreetMap.</p>
     </form>:<form className="form-stack place-lookup" onSubmit={e=>{e.preventDefault();readLink();}}>
      <label htmlFor="place-link-import">Link do lugar</label><input ref={placeField} id="place-link-import" type="url" required value={draft.url} maxLength={2000} placeholder="Cole um link do Google Maps ou de outro site" onChange={e=>setDraft({...draft,url:e.target.value})}/><p className="place-help">Se o link não trouxer os dados, você poderá completar o nome a seguir.</p><Button className="primary" disabled={!draft.url.trim()}>Continuar com este link <ChevronRight/></Button>
     </form>}
     {error&&<p className="form-error" role="alert">{error}</p>}
    </div>
    <div className="place-modal-footer place-entry-footer"><button type="button" className="place-inline-action" onClick={()=>chooseEntry('details')}>{draft.name?'Voltar aos dados do lugar':'Adicionar manualmente'}</button></div>
   </div>:<form onSubmit={save} className="place-edit-form" onInvalidCapture={e=>{let parent=(e.target as HTMLElement).parentElement;while(parent){if(parent instanceof HTMLDetailsElement)parent.open=true;parent=parent.parentElement;}}}>
    <div className="place-modal-scroll form-stack">
     <button type="button" className="place-inline-action place-change-source" onClick={()=>chooseEntry('search')}>Buscar outro lugar</button>
     {linkNote&&<p role="status" className="place-help">{linkNote}</p>}
     <label>Nome do lugar <span className="field-requirement">Obrigatório</span><input ref={placeField} required maxLength={300} value={draft.name} placeholder="Ex.: Museu do Louvre" onChange={e=>setDraft({...draft,name:e.target.value})}/></label>
     <label>Endereço <span className="field-requirement">Opcional</span><input maxLength={1000} value={draft.address} placeholder="Rua, número e cidade" onChange={e=>setDraft({...draft,address:e.target.value})}/></label>
     <fieldset className="place-destination"><legend>Guardar em</legend><p className="place-help" id="place-destination-hint">Escolha um dia, uma lista ou os dois.</p><div className="form-pair">
      <DateField label="Dia" describedBy="place-destination-hint" value={draft.date} min={trip.start_date} max={trip.end_date} required={!draft.listId} onChange={date=>setDraft({...draft,date:date||null})}/>
      <label>Lista<Select value={draft.listId??'__none__'} onValueChange={value=>setDraft({...draft,listId:value==='__none__'?null:value})}><SelectTrigger aria-label="Lista" aria-describedby="place-destination-hint"><SelectValue/></SelectTrigger><SelectContent><SelectItem value="__none__">Sem lista</SelectItem>{lists.map(l=><SelectItem key={l.id} value={l.id}>{l.name}</SelectItem>)}</SelectContent></Select></label>
     </div></fieldset>
     <details className="place-optional"><summary>Anotações e outros detalhes <span>Opcional</span></summary><div className="form-stack">
      <label>Anotações<textarea maxLength={4000} rows={3} value={draft.notes} placeholder="O que você quer lembrar sobre este lugar?" onChange={e=>setDraft({...draft,notes:e.target.value})}/></label>
      <label>Link do lugar<input type="url" value={draft.url} maxLength={2000} placeholder="https://" onChange={e=>setDraft({...draft,url:e.target.value})}/></label><button className="place-inline-action" type="button" disabled={!draft.url.trim()} onClick={readLink}>Atualizar dados pelo link</button>
      <details className="coordinate-fields"><summary>Localização no mapa</summary><p>{draft.latitude!==null&&draft.longitude!==null?'Localização preenchida. Altere apenas se precisar corrigir o ponto.':'Se souber, informe as duas coordenadas para mostrar o lugar no mapa.'}</p><div className="form-pair"><label>Latitude<input type="number" step="any" min="-85" max="85" value={draft.latitude??''} onChange={e=>setDraft({...draft,latitude:e.target.value===''?null:Number(e.target.value)})}/></label><label>Longitude<input type="number" step="any" min="-180" max="180" value={draft.longitude??''} onChange={e=>setDraft({...draft,longitude:e.target.value===''?null:Number(e.target.value)})}/></label></div>
      {draft.name&&<a className="place-search-link" target="_blank" rel="noreferrer" href={'https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(draft.name+' '+(draft.address||trip.destinations))}>Consultar no Google Maps <ArrowUpRight/></a>}</details>
     </div></details>
    </div>
    <div className="place-modal-footer">{error&&<p className="form-error" role="alert">{error}</p>}{!draft.date&&!draft.listId&&<p className="place-help">Escolha um dia ou uma lista para continuar.</p>}<div><Button type="button" variant="ghost" disabled={busy} onClick={closePlace}>Cancelar</Button><Button className="primary" disabled={busy||!draft.name.trim()||(!draft.date&&!draft.listId)}>{busy&&<LoaderCircle className="spin"/>}{editing?'Salvar alterações':'Adicionar lugar'}</Button></div></div>
   </form>)}
  </DialogContent></Dialog>
  <Dialog open={!!listEditor} onOpenChange={v=>!v&&!busy&&setListEditor(null)}><DialogContent className="travel-dialog" onCloseAutoFocus={e=>{if(listMenuTrigger.current?.isConnected){e.preventDefault();listMenuTrigger.current.focus();}}}><DialogHeader><DialogTitle>{listEditor==='new'?'Nova lista':'Renomear lista'}</DialogTitle><DialogDescription>Organize os lugares desta viagem como preferir.</DialogDescription></DialogHeader><form className="form-stack" onSubmit={async e=>{e.preventDefault();const ok=await run(async()=>{const r=await request(base+'/lists',listEditor==='new'?{name:listName}:{...listEditor,name:listName},listEditor==='new'?'POST':'PATCH');if(r.id)setListId(r.id);},'Lista salva.');if(ok)setListEditor(null);}}><label>Nome da lista<input required maxLength={100} value={listName} onChange={e=>setListName(e.target.value)}/></label>{error&&<p className="form-error" role="alert">{error}</p>}<Button className="primary" disabled={busy}>Salvar lista</Button></form></DialogContent></Dialog>
  <Dialog open={!!removing} onOpenChange={v=>!v&&!busy&&setRemoving(null)}><DialogContent className="travel-dialog" onCloseAutoFocus={e=>{if(removeTrigger.current){e.preventDefault();if(removeTrigger.current.isConnected)removeTrigger.current.focus();else listMenuTrigger.current?.focus();removeTrigger.current=null;}}}><DialogHeader><DialogTitle>Remover este lugar?</DialogTitle><DialogDescription>{removing?.name} será removido da lista e da programação. Você pode apenas tirar a data em Editar lugar para mantê-lo na lista.</DialogDescription></DialogHeader>{error&&<p role="alert" className="form-error">{error}</p>}<div className="dialog-actions"><Button variant="outline" onClick={()=>setRemoving(null)} disabled={busy}>Manter lugar</Button><Button variant="destructive" disabled={busy} onClick={async()=>{if(!removing)return;const ok=await run(async()=>{await request(base+'/places',{id:removing.id,revision:removing.revision},'DELETE');},'Lugar removido.');if(ok)setRemoving(null);}}>Remover lugar</Button></div></DialogContent></Dialog>
  <Dialog open={!!review} onOpenChange={v=>!v&&!busy&&setReview(null)}><DialogContent className="travel-dialog review-dialog" onCloseAutoFocus={e=>{e.preventDefault();if(reviewTrigger.current?.isConnected)reviewTrigger.current.focus();else document.querySelector<HTMLElement>('.pending-hub>summary')?.focus();}} onOpenAutoFocus={e=>{e.preventDefault();reviewHeading.current?.focus();}}><DialogHeader><DialogTitle ref={reviewHeading} tabIndex={-1}>Revisar reserva</DialogTitle><DialogDescription>{review?.reason}</DialogDescription></DialogHeader>{review&&<>
   {review.action==='cancel'&&<p className="form-error">Proposta de cancelamento. Os comprovantes serão preservados.</p>}
   <div className="review-comparison">{[review.current,review.reservation].map((r,i)=><section key={i}><h3>{i===0?'Versão salva':'Proposta recebida'}</h3>{r?<><strong>{r.title}</strong><p>{dateLabel(r.startDate)} — {dateLabel(r.endDate)}</p><p>{r.startTime||'Sem horário'} — {r.endTime||'Sem horário'}</p><p>{r.location}</p><p>{r.destination}</p><p>{r.travelers.join(' · ')}</p>{r.notes&&<p className="notes">{r.notes}</p>}<small>{r.sources.map(s=>s.subject).join(' · ')}</small></>:<p>Reserva ainda não cadastrada.</p>}</section>)}</div>
   <p>{review.documents.length} comprovante(s) na proposta: {review.documents.map(d=>d.label).join(' · ')||'nenhum'}. Comprovantes anteriores serão preservados.</p>
   {canEdit?<><div className="form-stack"><div className="form-pair"><DateField label="Início" required min={trip.start_date} max={trip.end_date} value={reviewDates.startDate} onChange={startDate=>setReviewDates({...reviewDates,startDate})}/><DateField label="Fim" required min={trip.start_date} max={trip.end_date} value={reviewDates.endDate} onChange={endDate=>setReviewDates({...reviewDates,endDate})}/></div></div><p className="muted">Se pertencer a outra viagem, descarte esta proposta e importe o pacote na viagem correta.</p>{error&&<p className="form-error" role="alert">{error}</p>}<div className="dialog-actions"><Button variant="outline" disabled={busy} onClick={()=>resolve('dismiss')}>Descartar proposta</Button><Button className="primary" disabled={busy||!reviewDates.startDate||!reviewDates.endDate} onClick={()=>resolve('accept')}>{review.action==='cancel'?'Confirmar cancelamento':'Aplicar proposta'}</Button></div></>:<p className="muted">Somente quem pode editar a viagem pode resolver esta revisão.</p>}
  </>}</DialogContent></Dialog>
 </>;
}

function ListPlace({place,canDrag,day,children}:{place:Place;canDrag:boolean;day:string;children:ReactNode}){
 const {attributes,listeners,setNodeRef,setActivatorNodeRef,isDragging}=useDraggable({id:'list-place:'+place.id,disabled:!canDrag});
 return <li ref={setNodeRef} className={'place-row'+(place.visited?' is-visited':'')+(isDragging?' is-dragging':'')}>
 {canDrag&&<button ref={setActivatorNodeRef} {...attributes} {...listeners} className="list-drag-handle" aria-label={'Arrastar '+place.name+' para '+dateLabel(day)} title="Arrastar para a programação"><GripVertical/></button>}{children}</li>;
}

function ListPlaceContent({place:p,day,canEdit,busy,onSchedule,onEdit,onPhoto,onRemove,onVisited}:{place:Place;day:string;canEdit:boolean;busy:boolean;onSchedule:()=>Promise<void>;onEdit:()=>void;onPhoto:()=>void;onRemove:()=>void;onVisited:()=>void}){
 const [fullAddress,setFullAddress]=useState(false),trigger=useRef<HTMLButtonElement|null>(null),pending=useRef<(()=>void)|null>(null);
 const address=compactAddress(p.address),destination=p.latitude!==null?p.latitude+','+p.longitude:p.name+' '+p.address;
 return <div className="saved-place">
  <div className="saved-place-heading"><h3>{p.name}</h3><DropdownMenu><DropdownMenuTrigger asChild><button ref={trigger} className="icon-button" aria-label={'Mais opções de '+p.name+' na lista'}><MoreHorizontal/></button></DropdownMenuTrigger><DropdownMenuContent align="end" onCloseAutoFocus={e=>{if(pending.current){e.preventDefault();const action=pending.current;pending.current=null;trigger.current?.focus();action();}}}>
   {p.address&&<DropdownMenuItem onSelect={()=>setFullAddress(!fullAddress)}><MapPin/>{fullAddress?'Resumir endereço':'Ver endereço completo'}</DropdownMenuItem>}
   <DropdownMenuItem asChild><a target="_blank" rel="noreferrer" href={p.url||'https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(destination)}><ArrowUpRight/>Abrir página do lugar</a></DropdownMenuItem>
   <DropdownMenuItem asChild><a target="_blank" rel="noreferrer" href={'https://www.google.com/maps/dir/?api=1&destination='+encodeURIComponent(destination)}><Map/>Como chegar</a></DropdownMenuItem>
   {canEdit&&<><DropdownMenuSeparator/><DropdownMenuItem disabled={busy} onSelect={()=>{pending.current=onPhoto;}}><ImagePlus/>{p.photo?'Trocar foto':'Adicionar foto'}</DropdownMenuItem><DropdownMenuItem disabled={busy} onSelect={onVisited}><Check/>{p.visited?'Desmarcar visita':'Marcar como visitado'}</DropdownMenuItem><DropdownMenuItem disabled={busy} onSelect={()=>{pending.current=onEdit;}}><Pencil/>Editar lugar</DropdownMenuItem><DropdownMenuSeparator/><DropdownMenuItem variant="destructive" disabled={busy} onSelect={()=>{pending.current=onRemove;}}><Trash2/>Remover lugar</DropdownMenuItem></>}
  </DropdownMenuContent></DropdownMenu></div>
  {p.address&&<p className="saved-place-address">{fullAddress?p.address:<>{address.street}{address.locality&&' · '+address.locality}</>}</p>}
  {p.photo&&<PlacePhotoView key={p.photo.id} photo={p.photo} name={p.name}/>}
  {p.notes&&<p className="saved-place-note">{p.notes}</p>}
  {(p.date||p.visited)&&<div className="saved-place-status">{p.date&&<span>Programado para {dateLabel(p.date)}{p.time&&' · '+p.time}</span>}{p.visited&&<span className="visited-label"><Check/>Visitado</span>}</div>}
  {canEdit&&!p.date&&<Button variant="outline" className="saved-place-schedule" disabled={busy} onClick={async()=>{await onSchedule();trigger.current?.focus();}}><CalendarPlus/>Incluir em {dateLabel(day)}</Button>}
 </div>;
}
// Place search uses the selected day; results never change the saved itinerary.

function SelectablePlace({place,checked,disabled,onChange}:{place:Place;checked:boolean;disabled:boolean;onChange:(checked:boolean)=>void}){
 const address=compactAddress(place.address),content=<span className="selectable-place-copy"><strong>{place.name}</strong>{place.address&&<span>{address.street}{address.locality&&' · '+address.locality}</span>}{place.date&&<span>Programado para {dateLabel(place.date)}</span>}{place.visited&&<span>Visitado</span>}</span>;
 return place.date?<div className="selectable-place is-scheduled">{content}</div>:<label className={'selectable-place'+(checked?' is-selected':'')}><Checkbox checked={checked} disabled={disabled} aria-label={'Selecionar '+place.name} onCheckedChange={value=>onChange(value===true)}/>{content}</label>;
}
