import {writableInstallation} from '@/lib/service';
import {z} from 'zod';
import {csrf,handle,identity,readJson,respond} from '@/lib/service';
import {searchPhoton} from '@/lib/photon';
export const dynamic='force-dynamic';
export async function POST(req:Request){return handle(async()=>{const input=await readJson(req,2000);csrf(req);await writableInstallation(req.url);await identity();const {query}=z.object({query:z.string().trim().min(2).max(200)}).strict().parse(input);const results=await searchPhoton(query,{areas:true});return respond({results:results.map(({url,...r})=>r),provider:'Photon / OpenStreetMap'});});}
