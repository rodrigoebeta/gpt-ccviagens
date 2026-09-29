'use client';
import type {TransitDetails} from '@/lib/contracts';

export default function TransitStationFields({value,onChange,isEnd,kind}:{value:TransitDetails;onChange:(patch:Partial<TransitDetails>)=>void;isEnd:boolean;kind:'train'|'bus'}){
 const station=isEnd?'destinationStation':'originStation',city=isEnd?'destinationCity':'originCity',stage=isEnd?'chegada':'partida';
 return <div className="transit-station-fields">
  <label>{(kind==='train'?'Estação de ':'Terminal de ')+stage}<input maxLength={300} value={value[station]??''} onChange={e=>onChange({[station]:e.target.value})}/></label>
  <label>Cidade de {stage}<input maxLength={300} value={value[city]??''} onChange={e=>onChange({[city]:e.target.value})}/></label>
 </div>;
}
