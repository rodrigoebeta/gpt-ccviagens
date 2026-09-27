import {access,AppError,csrf,database,handle,identity,respond} from '@/lib/service';
import {placeInput} from '@/lib/contracts';
import {findPlacePhotos} from '@/lib/place-photos';
export const dynamic='force-dynamic';
export async function POST(req:Request,{params}:{params:Promise<{id:string;placeId:string}>}){return handle(async()=>{
 csrf(req);const {id,placeId}=await params;await access(id,await identity(),true);
 const row=await database().prepare('SELECT data FROM places WHERE id=? AND trip_id=?').bind(placeId,id).first<{data:string}>();if(!row)throw new AppError(404,'Lugar não encontrado.');
 return respond(await findPlacePhotos(id,placeId,placeInput.parse(JSON.parse(row.data))));
});}
