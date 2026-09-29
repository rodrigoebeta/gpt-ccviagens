import {reservationImportContract} from '@/lib/import-contract';
import {handle,respond} from '@/lib/service';
import {syncIdentity} from '@/lib/sync';
export const dynamic='force-dynamic';
export async function GET(req:Request){return handle(async()=>{await syncIdentity(req);return respond({apiVersion:1,basePath:'/api/sync',reservationImportContract,operations:[{method:'GET',path:'/api/sync/trips'},{method:'GET',path:'/api/sync/trips/{id}'},{method:'POST',path:'/api/sync/trips/{id}/import'}]});});}
