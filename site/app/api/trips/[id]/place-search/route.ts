import {z} from 'zod';
import {dateValue} from '@/lib/contracts';
import {access,AppError,csrf,handle,identity,readJson,respond} from '@/lib/service';
import {searchPhoton} from '@/lib/photon';
import {searchContext} from '@/lib/search-context';
import {rankPlaces} from '@/lib/geography';
export const dynamic='force-dynamic';
export async function POST(req:Request,{params}:{params:Promise<{id:string}>}){return handle(async()=>{
 const input=await readJson(req,2000);csrf(req);
 const {query,day,nearby}=z.object({query:z.string().trim().min(3).max(200),day:dateValue.optional(),nearby:z.boolean().default(true)}).strict().parse(input);
 const {id}=await params,trip=await access(id,await identity(),true);
 if(day&&(day<trip.start_date||day>trip.end_date))throw new AppError(422,'Escolha um dia dentro da viagem.');
 const {anchors,fallback}=nearby?await searchContext(id,day):{anchors:[],fallback:''};
 const primary=anchors[0],results=await searchPhoton(query,{bias:primary,waitForGate:!!day});
 return respond({results:rankPlaces(results,anchors),provider:'Photon / OpenStreetMap',context:primary?{tier:primary.tier,label:primary.label}:null,contextNote:fallback});
});}
