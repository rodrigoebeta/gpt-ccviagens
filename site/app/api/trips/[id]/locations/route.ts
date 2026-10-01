import {writableInstallation} from '@/lib/service';
import {z} from 'zod';
import {access,csrf,handle,identity,readJson,respond} from '@/lib/service';
import {listLocations,locateReservationPoint} from '@/lib/reservation-locations';
export const dynamic='force-dynamic';
export async function GET(_req:Request,{params}:{params:Promise<{id:string}>}){return handle(async()=>{const {id}=await params;await access(id,await identity());return respond({locations:await listLocations(id)});});}
export async function POST(req:Request,{params}:{params:Promise<{id:string}>}){return handle(async()=>{csrf(req);await writableInstallation(req.url);const {id}=await params;await access(id,await identity());const {key,retry}=z.object({key:z.string().min(1).max(400),retry:z.boolean().default(false)}).strict().parse(await readJson(req,2000));await locateReservationPoint(id,key,retry);return respond({locations:await listLocations(id)});});}
