import {scheduleLocations} from '@/lib/schedule-locations';
import {z} from 'zod';
import {csrf,editReservation,handle,identity,readJson,respond} from '@/lib/service';
import {reservationInput} from '@/lib/contracts';
export const dynamic='force-dynamic';
export async function PATCH(req:Request,{params}:{params:Promise<{id:string;reservationId:string}>}){return handle(async()=>{
 csrf(req);const {id,reservationId}=await params;
 const input=z.object({baseFingerprint:z.string().regex(/^[a-f0-9]{64}$/),reservation:reservationInput}).strict().parse(await readJson(req,32000));
 const result=await editReservation(id,reservationId,await identity(),input.baseFingerprint,input.reservation);scheduleLocations(id,reservationId);return respond(result);
});}
