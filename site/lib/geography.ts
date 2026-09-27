import {z} from 'zod';
export const destinationInput=z.object({name:z.string().min(1).max(300),address:z.string().max(1000),latitude:z.number().min(-85).max(85),longitude:z.number().min(-180).max(180),osmType:z.enum(['node','way','relation']),osmId:z.string().regex(/^\d+$/),kind:z.string().min(1).max(40),bbox:z.tuple([z.number(),z.number(),z.number(),z.number()]).optional()}).strict();
export type Destination=z.infer<typeof destinationInput>;
export type GeoPoint={latitude:number;longitude:number};
export type GeoResult=GeoPoint&{name:string;address:string;url:string;osmType?:Destination['osmType'];osmId?:string;kind:string;bbox?:Destination['bbox']};
export type Anchor=GeoPoint&{label:string;tier:0|1|2;bbox?:Destination['bbox']};
export function distanceKm(a:GeoPoint,b:GeoPoint){const r=Math.PI/180,lat=(b.latitude-a.latitude)*r,lon=(b.longitude-a.longitude)*r;return 12742*Math.asin(Math.min(1,Math.sqrt(Math.sin(lat/2)**2+Math.cos(a.latitude*r)*Math.cos(b.latitude*r)*Math.sin(lon/2)**2)));}
export function destinationRefs(raw:unknown):Destination[]{try{return z.array(destinationInput).max(20).parse(typeof raw==='string'?JSON.parse(raw):raw??[]);}catch{return [];}}
const areaKinds=new Set(['city','town','village','hamlet','municipality','county','state','country','region','province','continent','district','locality','administrative']);
export function photonResults(data:unknown,areas=false):GeoResult[]{
 const features=(data as {features?:unknown[]})?.features;if(!Array.isArray(features))return [];
 return features.flatMap(feature=>{const f=feature as {geometry?:{coordinates?:number[]};properties?:Record<string,unknown>},p=f.properties??{},c=f.geometry?.coordinates;
  if(!c||!Number.isFinite(c[0])||!Number.isFinite(c[1])||Math.abs(c[0])>180||Math.abs(c[1])>85||typeof p.name!=='string')return [];
  const kind=String(p.osm_value==='administrative'&&areaKinds.has(String(p.type))?p.type:p.osm_value??p.type??'place'),type=p.osm_type==='N'?'node':p.osm_type==='W'?'way':p.osm_type==='R'?'relation':undefined,id=/^\d+$/.test(String(p.osm_id))?String(p.osm_id):undefined;
  if(areas&&(!areaKinds.has(kind)||!type||!id))return [];
  const extent=p.extent as number[]|undefined;
  // Photon extent is west,north,east,south; store west,south,east,north.
  const bbox:Destination['bbox']=Array.isArray(extent)&&extent.length===4&&extent.every(Number.isFinite)?[extent[0],extent[3],extent[2],extent[1]]:undefined;
  return [{name:p.name.slice(0,300),address:[p.street,p.housenumber,p.district,p.city,p.county,p.state,p.country].filter((v,i,a)=>typeof v==='string'&&v.length&&a.indexOf(v)===i).join(', ').slice(0,1000),latitude:c[1],longitude:c[0],url:type&&id?'https://www.openstreetmap.org/'+type+'/'+id:'',osmType:type,osmId:id,kind,bbox}];
 });
}
export function rankPlaces(results:GeoResult[],anchors:Anchor[]){
 const seen=new Set<string>();
 return results.flatMap((result,index)=>{const key=result.url||`${result.name}:${result.latitude}:${result.longitude}`;if(seen.has(key))return [];seen.add(key);
  const nearby=anchors.map(a=>({a,km:distanceKm(result,a)})).filter(({a,km})=>a.tier===2&&a.bbox?result.longitude>=a.bbox[0]&&result.longitude<=a.bbox[2]&&result.latitude>=a.bbox[1]&&result.latitude<=a.bbox[3]:km<=25).sort((a,b)=>a.a.tier-b.a.tier||a.km-b.km);
  const match=nearby[0];return [{...result,context:match?{label:match.a.label,tier:match.a.tier,distanceKm:Math.round(match.km*10)/10}:null,_order:index}];
 }).sort((a,b)=>(a.context?.tier??3)-(b.context?.tier??3)||(a.context?.distanceKm??0)-(b.context?.distanceKm??0)||a._order-b._order).map(({_order,...r})=>r);
}
export function unambiguousPoint(results:GeoResult[],query:string,expectedName?:string):GeoResult|null{
 const words=(s:string):string[]=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().match(/[\p{L}\p{N}]{3,}/gu)??[];
 const common=new Set(['hotel','hostel','resort','pousada','hospedagem','the','and','rua','avenida','street','road','rue']);
 const expected=words(expectedName??'').filter(w=>!common.has(w)),q=new Set(words(query).filter(w=>!common.has(w)));
 const candidates=results.filter(r=>{const name=words(r.name);return !areaKinds.has(r.kind)&&(expected.length?expected.filter(w=>name.includes(w)).length>=Math.ceil(expected.length/2):name.some(w=>q.has(w)));});
 if(!candidates.length||candidates.some(r=>distanceKm(r,candidates[0])>2))return null;
 return candidates[0];
}
// OSM station names usually omit descriptors such as "railway station".
// Keep the municipality/country in the query, but compare the actual station name.
export function stationReference(address:string){
 const parts=address.split(',').map(s=>s.trim()),name=parts[0].replace(/\b(?:(?:railway|railroad|train)\s+station|station|gare(?:\s+de)?|estação(?:\s+ferroviária)?(?:\s+de)?)\b/giu,'').trim();
 return {name,query:[name,...parts.slice(1)].filter(Boolean).join(', ').slice(0,200)};
}
export function unambiguousStation(results:GeoResult[],name:string):GeoResult|null{
 const normalize=(s:string)=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^\p{L}\p{N}]+/gu,' ').trim();
 const expected=normalize(name);if(!expected)return null;
 const matches=results.filter(r=>r.kind==='station'&&normalize(stationReference(r.name).name)===expected);
 if(!matches.length||matches.some(r=>distanceKm(r,matches[0])>2))return null;
 return matches[0];
}
