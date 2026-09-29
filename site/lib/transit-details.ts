import type {TransitDetails} from './contracts';

export function cleanTransitDetails(value:TransitDetails|undefined):TransitDetails|undefined{
 if(!value)return undefined;
 const result:TransitDetails={};
 for(const key of ['number','originStation','originCity','destinationStation','destinationCity'] as const){
  const text=value[key]?.trim();if(text)result[key]=text;
 }
 return Object.keys(result).length?result:undefined;
}
export function transitTitle(transit:TransitDetails|undefined,kind:'train'|'bus'){
 const origin=transit?.originStation,destination=transit?.destinationStation;
 if(origin||destination)return (origin||'Partida')+' → '+(destination||'Chegada');
 const label=kind==='train'?'Trem':'Ônibus';
 return transit?.number?label+' '+transit.number:label;
}
