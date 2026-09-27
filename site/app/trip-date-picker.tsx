'use client';
import {useEffect,useRef,useState} from 'react';
import {CalendarDays} from 'lucide-react';
import {ptBR} from 'react-day-picker/locale';
import {Calendar} from '@/components/ui/calendar';
import {Popover,PopoverContent,PopoverTrigger} from '@/components/ui/popover';

const localDate=(value:string)=>new Date(value+'T12:00:00');
const dateValue=(date:Date)=>`${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
export default function TripDatePicker({value,start,end,scheduledDays,onChange}:{value:string;start:string;end:string;scheduledDays:ReadonlySet<string>;onChange:(value:string)=>void}){
 const [open,setOpen]=useState(false);
 const trigger=useRef<HTMLButtonElement>(null),[maxHeight,setMaxHeight]=useState(440);
 // Measure the anchor, not the popup: its own size must not feed back into its height.
 function measureSpace(){const rect=trigger.current?.getBoundingClientRect();if(rect)setMaxHeight(Math.floor(Math.min(440,Math.max(rect.top-16,window.innerHeight-rect.bottom-16))));}
 useEffect(()=>{if(!open)return;measureSpace();window.addEventListener('resize',measureSpace);return()=>window.removeEventListener('resize',measureSpace);},[open]);
 const today=dateValue(new Date()),canChooseToday=today>=start&&today<=end;
 function choose(date:Date){const next=dateValue(date);if(next<start||next>end)return;onChange(next);setOpen(false);}
 return <Popover open={open} onOpenChange={next=>{if(next)measureSpace();setOpen(next);}}>
  <PopoverTrigger asChild><button ref={trigger} type="button" className="calendar-control" aria-label="Escolher dia"><CalendarDays/><span>Escolher data</span></button></PopoverTrigger>
  <PopoverContent className="trip-date-popover" style={{maxHeight}} align="end" sideOffset={8} collisionPadding={8} aria-label="Escolher dia da viagem">
   <Calendar className="trip-calendar" mode="single" required autoFocus locale={ptBR} selected={localDate(value)} defaultMonth={localDate(value)} startMonth={localDate(start)} endMonth={localDate(end)} disabled={[{before:localDate(start)},{after:localDate(end)}]} modifiers={{scheduled:date=>scheduledDays.has(dateValue(date))}} modifiersClassNames={{scheduled:'has-schedule'}} labels={{labelDayButton:(date,modifiers)=>[date.toLocaleDateString('pt-BR',{weekday:'long',day:'numeric',month:'long',year:'numeric'}),modifiers.today?'hoje':null,modifiers.selected?'selecionado':null,modifiers.scheduled?'com programação':null].filter(Boolean).join(', ')}} onSelect={choose}/>
   <div className="trip-calendar-footer"><button type="button" disabled={!canChooseToday} onClick={()=>choose(localDate(today))}>Hoje</button><button type="button" onClick={()=>setOpen(false)}>Fechar</button></div>
  </PopoverContent>
 </Popover>;
}
