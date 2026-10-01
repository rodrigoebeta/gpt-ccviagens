import {writableInstallation} from '@/lib/service';
import {scheduleLocations} from '@/lib/schedule-locations';
import {csrf,createManualReservation,handle,identity,readJson,respond} from '@/lib/service';
export async function POST(req:Request,{params}:{params:Promise<{id:string}>}){return handle(async()=>{
 csrf(req);await writableInstallation(req.url);const {id}=await params,result=await createManualReservation(id,await identity(),await readJson(req,28050000));
 scheduleLocations(id,result.reservationId);return respond(result,result.created?201:200);
});}
