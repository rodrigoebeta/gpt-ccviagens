import {AppError,database} from './service';
import {photonResults,type GeoPoint,type GeoResult} from './geography';
type Options={areas?:boolean;stations?:boolean;bias?:GeoPoint;waitForGate?:boolean};
export async function searchPhoton(query:string,options:Options={}):Promise<GeoResult[]>{
 const db=database(),now=Date.now(),normalized=query.trim().toLowerCase();
 const spec=JSON.stringify({v:4,q:normalized,areas:!!options.areas,stations:!!options.stations,bias:options.bias?[options.bias.latitude.toFixed(3),options.bias.longitude.toFixed(3)]:null});
 const key=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(spec)))).map(v=>v.toString(16).padStart(2,'0')).join('');
 const hit=await db.prepare('SELECT data FROM place_search_cache WHERE query_hash=? AND expires_at>?').bind(key,now).first<{data:string}>();if(hit)return JSON.parse(hit.data);
 await db.prepare("INSERT INTO integration_settings (name,instance_id,next_request_at) VALUES ('photon',?,0) ON CONFLICT(name) DO NOTHING").bind(crypto.randomUUID()).run();
 let gate=await db.prepare("UPDATE integration_settings SET next_request_at=? WHERE name='photon' AND next_request_at<=? RETURNING instance_id").bind(now+2000,now).first<{instance_id:string}>();
 if(!gate&&options.waitForGate){const state=await db.prepare("SELECT next_request_at FROM integration_settings WHERE name='photon'").first<{next_request_at:number}>(),wait=(state?.next_request_at??0)-Date.now();if(wait>0&&wait<=2100){await new Promise(r=>setTimeout(r,wait+25));const time=Date.now();gate=await db.prepare("UPDATE integration_settings SET next_request_at=? WHERE name='photon' AND next_request_at<=? RETURNING instance_id").bind(time+2000,time).first<{instance_id:string}>();}}
 if(!gate)throw new AppError(429,'Aguarde alguns segundos antes de buscar novamente.');
 const url=new URL('https://photon.komoot.io/api/');url.searchParams.set('q',query.trim());url.searchParams.set('limit','20');
 if(options.areas){url.searchParams.append('osm_tag','place');url.searchParams.append('osm_tag','boundary:administrative');}
 if(options.stations)url.searchParams.append('osm_tag','railway:station');
 if(options.bias){url.searchParams.set('lat',options.bias.latitude.toFixed(3));url.searchParams.set('lon',options.bias.longitude.toFixed(3));url.searchParams.set('zoom','12');url.searchParams.set('location_bias_scale','0.2');}
 let response:Response;try{response=await fetch(url.toString(),{signal:AbortSignal.timeout(10000),headers:{Accept:'application/json','User-Agent':'TravelCommandCenter/1.0 (instance/'+gate.instance_id+')'}});}catch{throw new AppError(503,'A busca está indisponível. Tente novamente em instantes.');}
 if([429,403,503].includes(response.status)){const retry=response.headers.get('Retry-After'),wait=retry&&/^\d+$/.test(retry)?Number(retry)*1000:retry?Date.parse(retry)-Date.now():0;await db.prepare("UPDATE integration_settings SET next_request_at=MAX(next_request_at,?) WHERE name='photon'").bind(Date.now()+Math.max(60000,Number.isFinite(wait)?wait:0)).run();throw new AppError(503,'O serviço de busca está temporariamente limitado. Aguarde e tente mais tarde.');}
 if(!response.ok)throw new AppError(503,'A busca está indisponível. Tente novamente em instantes.');
 const results=photonResults(await response.json(),options.areas);
 await db.batch([db.prepare('DELETE FROM place_search_cache WHERE expires_at<?').bind(now),db.prepare('INSERT INTO place_search_cache (query_hash,data,expires_at) VALUES (?,?,?) ON CONFLICT(query_hash) DO UPDATE SET data=excluded.data,expires_at=excluded.expires_at').bind(key,JSON.stringify(results),now+86400000)]);
 return results;
}
