'use client';
import {useEffect,useId,useRef,useState} from 'react';
import {CalendarDays,Clock} from 'lucide-react';
import {ptBR} from 'react-day-picker/locale';
import {Calendar} from '@/components/ui/calendar';
import {Popover,PopoverContent,PopoverTrigger} from '@/components/ui/popover';
import {Select,SelectContent,SelectItem,SelectTrigger,SelectValue} from '@/components/ui/select';
import {dateEntry,dateFieldError,dateValue,displayDate,localDate,parseDisplayDate,parseDisplayTime,timeEntry,timeFieldError} from '@/lib/date-time-fields';

type FieldProps={label:string;name?:string;value?:string|null;defaultValue?:string;onChange?:(value:string)=>void;required?:boolean;describedBy?:string};
function useField(props:FieldProps,format:(value:string)=>string,parse:(text:string)=>string|null,validate:(text:string)=>string){
 const id=useId(),input=useRef<HTMLInputElement>(null),trigger=useRef<HTMLButtonElement>(null),lastEmitted=useRef(props.value??props.defaultValue??'');
 const [text,setText]=useState(()=>format(lastEmitted.current)),[touched,setTouched]=useState(false),[open,setOpen]=useState(false),[maxHeight,setMaxHeight]=useState(440);
 // Only the anchor determines available space; measuring the popup feeds back into positioning.
 function measureSpace(){const rect=trigger.current?.getBoundingClientRect();if(rect)setMaxHeight(Math.floor(Math.min(440,Math.max(rect.top-16,window.innerHeight-rect.bottom-16))));}
 function toggleOpen(next:boolean){if(next)measureSpace();setOpen(next);}
 useEffect(()=>{if(!open)return;measureSpace();window.addEventListener('resize',measureSpace);return()=>window.removeEventListener('resize',measureSpace);},[open]);
 const error=validate(text),accepted=error?'':parse(text)??'';
 useEffect(()=>{if(props.value!==undefined&&(props.value??'')!==lastEmitted.current){lastEmitted.current=props.value??'';setText(format(props.value??''));}},[props.value,format]);
 useEffect(()=>{input.current?.setCustomValidity(error);},[error]);
 function update(next:string){setText(next);const value=validate(next)?'':parse(next)??'';lastEmitted.current=value;props.onChange?.(value);}
 function choose(value:string){update(format(value));setTouched(false);setOpen(false);}
 const describedBy=[props.describedBy,touched&&error?id+'-error':null].filter(Boolean).join(' ')||undefined;
 return {id,input,trigger,maxHeight,text,error,accepted,touched,setTouched,open,setOpen:toggleOpen,update,choose,describedBy};
}
const identity=(value:string)=>value;

export function DateField({min,max,...props}:FieldProps&{min?:string;max?:string}){
 const f=useField(props,displayDate,parseDisplayDate,text=>dateFieldError(text,!!props.required,min,max));
 const today=dateValue(new Date()),initial=f.accepted||(min&&today<min?min:max&&today>max?max:today);
 return <div className="temporal-field">
  <label htmlFor={f.id}>{props.label}</label>
  <Popover open={f.open} onOpenChange={f.setOpen}>
   <div className="temporal-input">
    <input ref={f.input} id={f.id} type="text" inputMode="numeric" autoComplete="off" placeholder="dd/mm/aaaa" maxLength={10} value={f.text} required={props.required} aria-describedby={f.describedBy} aria-invalid={f.touched&&!!f.error||undefined} onChange={e=>f.update(dateEntry(e.target.value))} onBlur={()=>f.setTouched(true)} onInvalid={()=>f.setTouched(true)}/>
    <PopoverTrigger asChild><button ref={f.trigger} type="button" aria-label={`Abrir calendário: ${props.label}`}><CalendarDays/></button></PopoverTrigger>
   </div>
   <PopoverContent className="trip-date-popover field-date-popover" style={{maxHeight:f.maxHeight}} align="end" sideOffset={8} collisionPadding={8} aria-label={`Calendário: ${props.label}`}>
    <Calendar className="trip-calendar" mode="single" required autoFocus locale={ptBR} selected={f.accepted?localDate(f.accepted):undefined} defaultMonth={localDate(initial)} startMonth={min?localDate(min):undefined} endMonth={max?localDate(max):undefined} disabled={[...(min?[{before:localDate(min)}]:[]),...(max?[{after:localDate(max)}]:[])]} labels={{labelDayButton:(date,modifiers)=>[date.toLocaleDateString('pt-BR',{weekday:'long',day:'numeric',month:'long',year:'numeric'}),modifiers.today?'hoje':null,modifiers.selected?'selecionado':null].filter(Boolean).join(', ')}} onSelect={date=>{const next=dateValue(date);if(!dateFieldError(displayDate(next),!!props.required,min,max))f.choose(next);}}/>
    <div className="trip-calendar-footer"><button type="button" disabled={!f.text} onClick={()=>f.choose('')}>Limpar data</button><button type="button" onClick={()=>f.setOpen(false)}>Fechar</button></div>
   </PopoverContent>
  </Popover>
  {props.name&&<input type="hidden" name={props.name} value={f.accepted}/>}
  {f.touched&&f.error&&<p className="temporal-error" id={f.id+'-error'} role="alert">{f.error}</p>}
 </div>;
}

export function TimeField(props:FieldProps){
 const f=useField(props,identity,parseDisplayTime,text=>timeFieldError(text,!!props.required));
 const [hour,setHour]=useState('00'),[minute,setMinute]=useState('00');
 function open(next:boolean){if(next){const parts=(f.accepted||'00:00').split(':');setHour(parts[0]);setMinute(parts[1]);}f.setOpen(next);}
 return <div className="temporal-field">
  <label htmlFor={f.id}>{props.label}</label>
  <Popover open={f.open} onOpenChange={open}>
   <div className="temporal-input">
    <input ref={f.input} id={f.id} type="text" inputMode="numeric" autoComplete="off" placeholder="hh:mm" maxLength={5} value={f.text} required={props.required} aria-describedby={f.describedBy} aria-invalid={f.touched&&!!f.error||undefined} onChange={e=>f.update(timeEntry(e.target.value))} onBlur={()=>f.setTouched(true)} onInvalid={()=>f.setTouched(true)}/>
    <PopoverTrigger asChild><button ref={f.trigger} type="button" aria-label={`Escolher horário: ${props.label}`}><Clock/></button></PopoverTrigger>
   </div>
   <PopoverContent className="time-field-popover" style={{maxHeight:f.maxHeight}} align="end" sideOffset={8} collisionPadding={8} aria-label={`Escolher ${props.label.toLowerCase()}`}>
    <p className="time-field-title">{props.label}</p><p className="time-field-hint">Formato de 24 horas</p>
    <div className="time-field-columns">
     <div><label id={f.id+'-hour'}>Hora</label><Select value={hour} onValueChange={setHour}><SelectTrigger aria-labelledby={f.id+'-hour'}><SelectValue/></SelectTrigger><SelectContent>{Array.from({length:24},(_,i)=>String(i).padStart(2,'0')).map(value=><SelectItem key={value} value={value}>{value}</SelectItem>)}</SelectContent></Select></div>
     <div><label id={f.id+'-minute'}>Minuto</label><Select value={minute} onValueChange={setMinute}><SelectTrigger aria-labelledby={f.id+'-minute'}><SelectValue/></SelectTrigger><SelectContent>{Array.from({length:60},(_,i)=>String(i).padStart(2,'0')).map(value=><SelectItem key={value} value={value}>{value}</SelectItem>)}</SelectContent></Select></div>
    </div>
    <div className="time-field-footer"><button type="button" disabled={!f.text} onClick={()=>f.choose('')}>Limpar horário</button><button type="button" className="primary" onClick={()=>f.choose(hour+':'+minute)}>Aplicar</button></div>
   </PopoverContent>
  </Popover>
  {props.name&&<input type="hidden" name={props.name} value={f.accepted}/>}
  {f.touched&&f.error&&<p className="temporal-error" id={f.id+'-error'} role="alert">{f.error}</p>}
 </div>;
}
