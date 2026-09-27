import {scheduleLocations} from '@/lib/schedule-locations';
import {z} from 'zod';
import {access,csrf,handle,identity,listReviews,readJson,respond,resolveReview} from '@/lib/service';
import {reservationInput} from '@/lib/contracts';
export const dynamic='force-dynamic';
type Context={params:Promise<{id:string}>};
export async function GET(_:Request,{params}:Context){return handle(async()=>{const {id}=await params;await access(id,await identity());return respond({reviews:await listReviews(id)});});}
export async function POST(req:Request,{params}:Context){return handle(async()=>{
 csrf(req);const input=z.object({id:z.string(),action:z.enum(['accept','dismiss']),baseFingerprint:z.string().nullable(),reservation:reservationInput.optional()}).strict().parse(await readJson(req,60000));
 const {id}=await params;const result=await resolveReview(id,await identity(),input.id,input.action,input.baseFingerprint,input.reservation);if('reservationId' in result)scheduleLocations(id,result.reservationId);return respond(result);
});}
