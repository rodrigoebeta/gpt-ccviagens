import {writableInstallation} from '@/lib/service';
import {scheduleLocations} from '@/lib/schedule-locations';
import {csrf,handle,identity,importReservation,readJson,respond} from '@/lib/service';
export async function POST(req:Request,{params}:{params:Promise<{id:string}>}){return handle(async()=>{csrf(req);await writableInstallation(req.url);const u=await identity(),{id}=await params;const result=await importReservation(id,u,await readJson(req));if(!('reviewId' in result))scheduleLocations(id,result.reservationId);return respond(result);});}
