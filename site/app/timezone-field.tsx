'use client';
import {useEffect,useId,useMemo,useState} from 'react';
import {timezoneLabel,timezoneOptions} from '@/lib/timezone-options';
import {Select,SelectContent,SelectItem,SelectTrigger,SelectValue} from '@/components/ui/select';
export default function TimezoneField({label,value,date,onChange,inherit=false,disabled=false}:{label:string;value:string;date:string;onChange:(value:string)=>void;inherit?:boolean;disabled?:boolean}){
 const id=useId();
 const [zones,setZones]=useState<string[]>(value?[value]:[]);
 useEffect(()=>{setZones(timezoneOptions(value));},[value]);
 const options=useMemo(()=>zones.map(zone=>({zone,label:timezoneLabel(zone,date)})),[zones,date]);
 return <div className="timezone-field"><label htmlFor={id}>{label}</label><Select value={value||'unset'} disabled={disabled} onValueChange={zone=>onChange(zone==='unset'?'':zone)}><SelectTrigger id={id} aria-label={label}><SelectValue/></SelectTrigger><SelectContent className="timezone-options" position="popper" side="bottom" align="start"><SelectItem value="unset">{inherit?'Mesmo fuso do início':'Não informado'}</SelectItem>{options.map(option=><SelectItem key={option.zone} value={option.zone}>{option.label}</SelectItem>)}</SelectContent></Select></div>;
}
