'use client';
import {useEffect,useRef,useState} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {Hotel,Plane,TrainFront,Bus} from 'lucide-react';
import type {Place} from '@/lib/contracts';
import type {MapKind,ReservationMapPoint} from '@/lib/reservation-map';
const icons={hotel:Hotel,flight:Plane,train:TrainFront,bus:Bus};
const labels={hotel:'Hospedagem',flight:'Aeroporto',train:'Estação',bus:'Terminal / parada'};
export default function DayMap({places,points,pending}:{places:Place[];points:ReservationMapPoint[];pending:number}){
 const el=useRef<HTMLDivElement>(null),[error,setError]=useState('');
 const signature=JSON.stringify([places.map(p=>[p.id,p.name,p.latitude,p.longitude,p.visited]),points]);
 const locatedPlaces=places.some(p=>!p.visited&&p.latitude!==null&&p.longitude!==null);
 useEffect(()=>{let disposed=false;let map:import('leaflet').Map|undefined;let resize:ResizeObserver|undefined;
  setError('');void import('leaflet').then(L=>{
   if(disposed||!el.current)return;map=L.map(el.current,{scrollWheelZoom:false,attributionControl:true});
   L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a>',referrerPolicy:'strict-origin-when-cross-origin'}).on('tileerror',()=>!disposed&&setError('O fundo do mapa não carregou. Os pontos continuam salvos; tente novamente mais tarde.')).addTo(map);
   const coordinates:import('leaflet').LatLngTuple[]=[];
   places.forEach((p,i)=>{if(p.visited||p.latitude===null||p.longitude===null)return;const point:[number,number]=[p.latitude,p.longitude];coordinates.push(point);
    const label=document.createElement('span');label.textContent=(i+1)+'. '+p.name;
    L.marker(point,{title:(i+1)+'. '+p.name,alt:p.name,icon:L.divIcon({className:'place-marker',html:String(i+1),iconSize:[32,32],iconAnchor:[16,16]})}).bindPopup(label).addTo(map!);
   });
   const groups=new Map<string,ReservationMapPoint[]>();
   for(const p of points){const key=p.kind+':'+p.latitude+':'+p.longitude;groups.set(key,[...(groups.get(key)??[]),p]);}
   for(const group of groups.values()){
    const p=group[0],point:[number,number]=[p.latitude,p.longitude],Icon=icons[p.kind];coordinates.push(point);
    const popup=document.createElement('div');
    for(const item of group){const row=document.createElement('p');row.textContent=item.title+' · '+item.label+' — '+item.resolvedName;popup.appendChild(row);}
    const title=labels[p.kind]+': '+group.map(item=>item.title+' · '+item.label).join('; ');
    L.marker(point,{title,alt:title,icon:L.divIcon({className:'reservation-map-marker reservation-map-marker-'+p.kind,html:renderToStaticMarkup(<Icon aria-hidden="true" size={20}/>),iconSize:[44,44],iconAnchor:[22,22]})}).bindPopup(popup).addTo(map!);
   }
   if(coordinates.length)map.fitBounds(L.latLngBounds(coordinates),{padding:[35,35],maxZoom:15});else map.setView([20,0],2);
   resize=new ResizeObserver(()=>map?.invalidateSize());resize.observe(el.current);
  }).catch(()=>!disposed&&setError('Não foi possível abrir o mapa. Tente novamente.'));
  return()=>{disposed=true;resize?.disconnect();map?.remove();};
 // Signature contains all rendered map data; order determines place numbers.
 // eslint-disable-next-line react-hooks/exhaustive-deps
 },[signature]);
 const kinds=[...new Set(points.map(p=>p.kind))] as MapKind[];
 return <div className="day-map-frame">
  {pending>0&&<p className="map-note" role="status">Localizando pontos das reservas… {pending} pendente(s).</p>}
  <div ref={el} className="day-map" aria-label="Mapa dos lugares e reservas do dia"/>
  <div className="map-support">
   {error&&<p className="form-error" role="alert">{error}</p>}
   {!pending&&!locatedPlaces&&!points.length&&<p className="map-empty-note" role="status">Nenhum ponto com localização confirmada neste dia.</p>}
   <div className="map-reading-guide">
    <ul className="map-legend" aria-label="Legenda do mapa"><li><span className="map-number-key" aria-hidden="true">1</span>Lugares na ordem da programação</li>{kinds.map(kind=>{const Icon=icons[kind];return <li key={kind}><Icon aria-hidden="true"/>{labels[kind]}</li>;})}</ul>
    <p className="map-reading-note">Lugares visitados ficam ocultos. Ícones identificam hospedagens e transportes do dia.</p>
    <div className="map-attribution"><span>Localizações: Photon / OpenStreetMap.</span><a href="https://www.openstreetmap.org/fixthemap" target="_blank" rel="noreferrer">Informar erro no mapa</a></div>
   </div>
  </div>
 </div>;
}
