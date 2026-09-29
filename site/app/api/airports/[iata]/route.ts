import {findAirport} from '@/lib/airports';
import {AppError,handle,identity,respond} from '@/lib/service';
export const dynamic='force-dynamic';
export async function GET(_req:Request,{params}:{params:Promise<{iata:string}>}){return handle(async()=>{
 await identity();const {iata}=await params;
 if(!/^[A-Za-z]{3}$/.test(iata))throw new AppError(400,'Use um código IATA de três letras.');
 return respond(findAirport(iata));
});}
