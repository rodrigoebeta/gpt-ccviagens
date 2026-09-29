export function timezoneOffset(zone:string,date:string){
 try{
  const reference=new Date(/^\d{4}-\d{2}-\d{2}$/.test(date)?date+'T12:00:00Z':'2000-01-01T12:00:00Z');
  const offset=new Intl.DateTimeFormat('en',{timeZone:zone,timeZoneName:'longOffset'}).formatToParts(reference).find(p=>p.type==='timeZoneName')?.value;
  return offset==='GMT'?'GMT+00:00':offset??null;
 }catch{return null;}
}
export function timezoneLabel(zone:string,date:string){const offset=timezoneOffset(zone,date);return zone.replaceAll('_',' ')+' · '+(offset??'Fuso não reconhecido');}
export function timezoneOptions(current:string){return [...new Set(['UTC',...Intl.supportedValuesOf('timeZone'),...(current?[current]:[])])].sort();}
// Match the stored wall clock to real instants; gaps and repeated DST hours need confirmation.
export function reservationOffset(zone:string|undefined,date:string,time:string|undefined){
 if(!zone)return 'Fuso não informado';
 if(!time)return timezoneOffset(zone,date)??'Fuso não reconhecido';
 try{
  const target=Date.parse(date+'T'+time+':00Z');
  const formatter=new Intl.DateTimeFormat('en-CA',{timeZone:zone,year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit',hourCycle:'h23'});
  const local=(instant:number)=>{const parts=Object.fromEntries(formatter.formatToParts(new Date(instant)).map(p=>[p.type,p.value]));return Date.parse(`${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}:${parts.second}Z`);};
  const offsets=new Set([-86400000,0,86400000].map(delta=>local(target+delta)-(target+delta)));
  const matches=[...offsets].filter(offset=>local(target-offset)===target);
  if(matches.length!==1)return 'GMT a confirmar';
  const minutes=matches[0]/60000;return 'GMT'+(minutes<0?'-':'+')+String(Math.floor(Math.abs(minutes)/60)).padStart(2,'0')+':'+String(Math.abs(minutes)%60).padStart(2,'0');
 }catch{return 'Fuso não reconhecido';}
}
