export const localDate=(value:string)=>new Date(value+'T12:00:00');
export const dateValue=(date:Date)=>`${String(date.getFullYear()).padStart(4,'0')}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
export function dateEntry(text:string){const digits=text.replace(/\D/g,'').slice(0,8);return [digits.slice(0,2),digits.slice(2,4),digits.slice(4)].filter(Boolean).join('/');}
export function timeEntry(text:string){const digits=text.replace(/\D/g,'').slice(0,4);return [digits.slice(0,2),digits.slice(2)].filter(Boolean).join(':');}
export const displayDate=(value:string)=>/^\d{4}-\d{2}-\d{2}$/.test(value)?value.split('-').reverse().join('/'):'';
export function parseDisplayDate(text:string):string|null{
 const match=/^(\d{2})\/(\d{2})\/(\d{4})$/.exec(text);
 if(!match)return null;
 const [,day,month,year]=match,iso=`${year}-${month}-${day}`;
 if(Number(year)<1||dateValue(localDate(iso))!==iso)return null;
 return iso;
}
export const parseDisplayTime=(text:string)=>/^([01]\d|2[0-3]):[0-5]\d$/.test(text)?text:null;
export function dateFieldError(text:string,required:boolean,min?:string,max?:string){
 if(!text)return required?'Informe a data.':'';
 const value=parseDisplayDate(text);
 if(!value)return 'Use uma data válida no formato dd/mm/aaaa.';
 if(min&&value<min)return `Escolha uma data a partir de ${displayDate(min)}.`;
 if(max&&value>max)return `Escolha uma data até ${displayDate(max)}.`;
 return '';
}
export const timeFieldError=(text:string,required:boolean)=>!text?(required?'Informe o horário.':''):parseDisplayTime(text)?'':'Use um horário de 00:00 a 23:59.';
