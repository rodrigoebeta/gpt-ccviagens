import {z} from 'zod';
import {access,AppError,bucket,csrf,database,decodeFile,handle,identity,readJson,respond,withTripUpload} from '@/lib/service';
import {placeInput} from '@/lib/contracts';
import {photoCacheKey} from '@/lib/place-photos';
import type {PhotoSearch,PlacePhoto} from '@/lib/photo-contracts';
export const dynamic='force-dynamic';
type Context={params:Promise<{id:string;placeId:string}>};
const rev=z.object({revision:z.number().int().positive()}).strict();
const input=z.union([rev.extend({candidateId:z.string().max(200)}),rev.extend({mime:z.enum(['image/jpeg','image/png']),base64:z.string().min(4).max(2800000)})]);
export async function GET(_:Request,{params}:Context){return handle(async()=>{
 const {id,placeId}=await params;await access(id,await identity());
 const row=await database().prepare('SELECT photo_key FROM places WHERE id=? AND trip_id=?').bind(placeId,id).first<{photo_key:string|null}>();if(!row?.photo_key)throw new AppError(404,'Foto não encontrada.');
 const file=await bucket().get(row.photo_key);if(!file)throw new AppError(404,'Foto não encontrada.');
 return new Response(file.body,{headers:{'Content-Type':file.httpMetadata?.contentType??'image/jpeg','Cache-Control':'private, no-store','X-Content-Type-Options':'nosniff'}});
});}
async function save(req:Request,{params}:Context,reset:boolean){return handle(async()=>{
 const raw=await readJson(req,reset?1000:2900000);csrf(req);const data:{revision:number;candidateId?:string;mime?:'image/jpeg'|'image/png';base64?:string}=reset?rev.parse(raw):input.parse(raw),{id,placeId}=await params;await access(id,await identity(),true);
 const db=database(),row=await db.prepare('SELECT data,photo_key,revision FROM places WHERE id=? AND trip_id=?').bind(placeId,id).first<{data:string;photo_key:string|null;revision:number}>();
 if(!row)throw new AppError(404,'Lugar não encontrado.');if(row.revision!==data.revision)throw new AppError(409,'Este lugar mudou. Feche a foto e atualize a programação antes de salvar.');
 let photo:PlacePhoto|null=null,key:string|null=null,bytes:Uint8Array|undefined;
 if(data.candidateId){const cache=await db.prepare('SELECT data FROM place_search_cache WHERE query_hash=? AND expires_at>?').bind(photoCacheKey(id,placeId,placeInput.parse(JSON.parse(row.data))),Date.now()).first<{data:string}>();photo=cache?(JSON.parse(cache.data) as PhotoSearch).photos.find(p=>p.id===data.candidateId)??null:null;if(!photo)throw new AppError(409,'Busque as fotos novamente antes de selecionar.');}
 else if(data.base64&&data.mime){bytes=decodeFile(data.base64,data.mime);if(bytes.length>2000000)throw new AppError(413,'Use uma foto de até 2 MB após otimização.');key='place-photos/'+crypto.randomUUID();photo={id:crypto.randomUUID(),provider:'upload',url:'',source:'',credit:'Foto personalizada',license:'',licenseUrl:'',label:'Foto escolhida para este lugar'};}
 return withTripUpload(id,[key,row.photo_key].filter((value):value is string=>!!value),async()=>{
 if(key&&bytes)await bucket().put(key,bytes,{httpMetadata:{contentType:data.mime}});
 const saved=await db.prepare('UPDATE places SET photo_key=?,photo_data=?,revision=revision+1 WHERE id=? AND trip_id=? AND revision=?').bind(key,photo?JSON.stringify(photo):null,placeId,id,data.revision).run();if(!saved.meta.changes)throw new AppError(409,'Este lugar mudou. Atualize a programação antes de salvar.');
 return respond({saved:true});
 });
});}
export async function POST(req:Request,ctx:Context){return save(req,ctx,false);}
export async function DELETE(req:Request,ctx:Context){return save(req,ctx,true);}
