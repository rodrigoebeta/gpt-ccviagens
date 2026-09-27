import type {PlaceData} from './contracts';
import type {PlacePhoto,PhotoSearch} from './photo-contracts';
import {AppError,database} from './service';
const uuid=/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i;
const plain=(v:unknown)=>String(v??'').replace(/<[^>]*>/g,'').replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&#39;/g,"'").slice(0,600);
const https=(v:unknown)=>{try{const u=new URL(String(v));return u.protocol==='https:'&&!u.username&&!u.password?u.href:'';}catch{return '';}};
async function json(url:string){
 const r=await fetch(url,{headers:{Accept:'application/json','User-Agent':'TravelCommandCenter/1.0 (place photo selection)'},signal:AbortSignal.timeout(12000)});
 if(!r.ok)throw Error('Photo provider unavailable');
 const reader=r.body!.getReader(),chunks:Uint8Array[]=[];let size=0;
 while(true){const v=await reader.read();if(v.done)break;size+=v.value.length;if(size>4000000){await reader.cancel();throw Error('Provider response too large');}chunks.push(v.value);}
 const bytes=new Uint8Array(size);let offset=0;for(const c of chunks){bytes.set(c,offset);offset+=c.length;}
 return JSON.parse(new TextDecoder().decode(bytes));
}
export function photoCacheKey(trip:string,id:string,p:PlaceData){return 'photos:'+JSON.stringify([trip,id,p.url,p.latitude,p.longitude]);}
function distance(lon:number,lat:number,p:PlaceData){const rad=Math.PI/180,dl=(lon-p.longitude!)*rad,da=(lat-p.latitude!)*rad;const a=Math.sin(da/2)**2+Math.cos(lat*rad)*Math.cos(p.latitude!*rad)*Math.sin(dl/2)**2;return Math.round(12742000*Math.atan2(Math.sqrt(a),Math.sqrt(1-a)));}
async function panoramax(query:string,p:PlaceData,linked=false):Promise<PlacePhoto[]>{
 const data=await json('https://api.panoramax.xyz/api/search?'+query);
 return (data.features??[]).flatMap((f:Record<string,any>)=>{
  if(!uuid.test(f.id)||!f.properties?.license)return [];
  const coords=f.geometry?.coordinates,meters=coords&&p.latitude!==null?distance(coords[0],coords[1],p):undefined;
  if(!linked&&(meters===undefined||!Number.isFinite(meters)||meters>150))return [];
  const license=f.links?.find((l:Record<string,string>)=>l.rel==='license');
  return [{id:'panoramax:'+f.id,provider:'Panoramax',url:'https://api.panoramax.xyz/api/pictures/'+f.id+'/sd.jpg',source:'https://api.panoramax.xyz/#focus=pic&pic='+f.id,credit:plain(f.properties['geovisio:producer']??f.providers?.[0]?.name??'Comunidade Panoramax'),license:plain(f.properties.license),licenseUrl:https(license?.href),label:linked?'Vinculada no OpenStreetMap':'Vista próxima · '+meters+' m',distance:meters,date:plain(f.properties.datetime).slice(0,10),panorama:f.properties['pers:interior_orientation']?.field_of_view===360} as PlacePhoto];
 }).sort((a:PlacePhoto,b:PlacePhoto)=>(a.distance??0)-(b.distance??0)).slice(0,12);
}
async function commons(title:string):Promise<PlacePhoto[]>{
 if(!/^(File|Category):/i.test(title))return [];
 const params=new URLSearchParams({action:'query',format:'json',prop:'imageinfo',iiprop:'url|extmetadata|mime',iiurlwidth:'1200'});
 if(/^Category:/i.test(title)){params.set('generator','categorymembers');params.set('gcmtitle',title);params.set('gcmtype','file');params.set('gcmlimit','12');}else params.set('titles',title);
 const data=await json('https://commons.wikimedia.org/w/api.php?'+params);
 return Object.values(data.query?.pages??{}).flatMap((page:any)=>{
  const i=page.imageinfo?.[0],m=i?.extmetadata,url=https(i?.thumburl??i?.url);
  if(!i||!['image/jpeg','image/png','image/webp'].includes(i.mime)||!url||!['upload.wikimedia.org','thumb.wikimedia.org'].includes(new URL(url).hostname)||!m?.LicenseShortName?.value)return [];
  return [{id:'commons:'+page.pageid,provider:'Wikimedia Commons',url,source:'https://commons.wikimedia.org/wiki/'+encodeURIComponent(page.title),credit:plain(m.Artist?.value??m.Credit?.value??'Wikimedia Commons'),license:plain(m.LicenseShortName.value),licenseUrl:https(m.LicenseUrl?.value),label:plain(page.title.replace(/^File:/,''))} as PlacePhoto];
 });
}
async function osm(p:PlaceData):Promise<PlacePhoto[]>{
 const match=p.url.match(/^https:\/\/(?:www\.)?openstreetmap\.org\/(node|way|relation)\/(\d+)(?:[?#].*)?$/);if(!match)return [];
 const data=await json('https://api.openstreetmap.org/api/0.6/'+match[1]+'/'+match[2]+'.json'),tags=data.elements?.[0]?.tags??{};
 const ids=Object.entries(tags).filter(([k])=>/^panoramax(?::\d+)?$/.test(k)).flatMap(([,v])=>String(v).split(';')).filter(v=>uuid.test(v)).slice(0,12);
 let title=String(tags.wikimedia_commons??'');
 if(!title&&/^https:\/\/commons.wikimedia.org\/wiki\/File:/.test(tags.image??''))title=decodeURIComponent(new URL(tags.image).pathname.slice(6));
 const results=await Promise.allSettled([title?commons(title):Promise.resolve([]),ids.length?panoramax('ids='+ids.join(','),p,true):Promise.resolve([])]);
 const photos=results.flatMap(r=>r.status==='fulfilled'?r.value:[]);
 if(!photos.length&&results.some(r=>r.status==='rejected'))throw Error('OSM linked provider unavailable');
 return photos;
}
export async function findPlacePhotos(trip:string,id:string,p:PlaceData):Promise<PhotoSearch>{
 const db=database(),key=photoCacheKey(trip,id,p),now=Date.now();
 const cached=await db.prepare('SELECT data FROM place_search_cache WHERE query_hash=? AND expires_at>?').bind(key,now).first<{data:string}>();if(cached)return JSON.parse(cached.data);
 await db.prepare("INSERT INTO integration_settings(name,instance_id,next_request_at) VALUES ('photos',?,0) ON CONFLICT(name) DO NOTHING").bind(crypto.randomUUID()).run();
 const gate=await db.prepare("UPDATE integration_settings SET next_request_at=? WHERE name='photos' AND next_request_at<=?").bind(now+2500,now).run();if(!gate.meta.changes)throw new AppError(429,'Aguarde alguns segundos antes de buscar outras fotos.');
 const nearby=async()=>{if(p.latitude===null)return [];const dy=150/111320,dx=dy/Math.cos(p.latitude*Math.PI/180);return panoramax('limit=40&bbox='+[Math.max(-180,p.longitude!-dx),p.latitude-dy,Math.min(180,p.longitude!+dx),p.latitude+dy].join(','),p);};
 const results=await Promise.allSettled([nearby(),osm(p)]),messages:string[]=[];
 if(p.latitude===null)messages.push('Adicione a localização no mapa para buscar vistas próximas.');
 results.forEach((r,i)=>{if(r.status==='rejected')messages.push((i===0?'Panoramax':'Fotos vinculadas ao OSM')+' indisponível no momento. Você ainda pode enviar sua foto.');});
 const photos=results.flatMap(r=>r.status==='fulfilled'?r.value:[]).filter((p,i,a)=>a.findIndex(v=>v.id===p.id)===i);
 if(!photos.length&&!messages.length)messages.push('Não encontramos fotos nesta área nem imagens vinculadas ao lugar no OSM. Você pode enviar uma foto própria.');
 const output={photos,messages};
 await db.prepare('DELETE FROM place_search_cache WHERE query_hash LIKE ? AND expires_at<?').bind('photos:%',now).run();
 await db.prepare('INSERT INTO place_search_cache(query_hash,data,expires_at) VALUES (?,?,?) ON CONFLICT(query_hash) DO UPDATE SET data=excluded.data,expires_at=excluded.expires_at').bind(key,JSON.stringify(output),now+(results.some(r=>r.status==='rejected')?30000:86400000)).run();
 return output;
}
