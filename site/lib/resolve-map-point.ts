import {searchPhoton} from './photon';
import {unambiguousPoint,unambiguousStation,unambiguousAddress,stationReference,type GeoPoint} from './geography';
import type {MapCandidate,ReservationMapPoint} from './reservation-map';
export async function resolveMapPoint(candidate:MapCandidate,bias?:GeoPoint):Promise<ReservationMapPoint|null>{
 if(candidate.selectedPoint){const {latitude,longitude,name}=candidate.selectedPoint;return {...candidate,latitude,longitude,resolvedName:name};}
 if(['car','transfer','activity'].includes(candidate.kind))return null;
 if(!candidate.address)return null;
 const station=candidate.kind==='train'?stationReference(candidate.address):null;
 const query=(station?.query??(candidate.kind==='hotel'?candidate.title+' '+candidate.address:candidate.address)).slice(0,200);
 const results=await searchPhoton(query,{stations:!!station,bias,waitForGate:true});
 const kinds=candidate.kind==='hotel'?['hotel','hostel','guest_house','motel','apartment','resort']:candidate.kind==='flight'?['aerodrome','airport','terminal']:candidate.kind==='ferry'?['ferry_terminal']:['bus_station','bus_stop','station'];
 // A map pin needs a stronger name match than a ranked search suggestion.
 const words=(text:string):string[]=>text.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().match(/[\p{L}\p{N}]{3,}/gu)??[];
 const generic=new Set(['hotel','hostel','resort','pousada','the','and','airport','aeroporto','international','internacional','terminal','bus','station','rodoviaria','estacao']);
 const expected=words((candidate.kind==='hotel'?candidate.title:candidate.address.split(',')[0]).replace(/\([A-Z]{3}\)/g,'')).filter(w=>!generic.has(w));
 const matched=results.filter(r=>{const actual=words(candidate.kind==='hotel'?r.name:r.name+' '+r.address);return kinds.includes(r.kind)&&expected.length>0&&expected.every(w=>actual.includes(w));});
 let result=station?unambiguousStation(results,station.name):unambiguousPoint(matched,query,candidate.kind==='hotel'?candidate.title:undefined);
 if(!result&&candidate.kind==='hotel')result=unambiguousAddress(await searchPhoton(candidate.address.slice(0,200),{bias,waitForGate:true}),candidate.address);
 return result?{...candidate,latitude:result.latitude,longitude:result.longitude,resolvedName:result.name}:null;
}
