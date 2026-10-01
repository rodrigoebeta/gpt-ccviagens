import {writableInstallation} from '@/lib/service';
import {destinationRefs} from '@/lib/geography';
import {csrf,database,handle,identity,readJson,respond} from '@/lib/service';
import {tripInput} from '@/lib/contracts';
export const dynamic='force-dynamic';
export async function GET(){return handle(async()=>{
 const u=await identity(),db=database();
 const {results}=await db.prepare("SELECT t.*,CASE WHEN t.owner_id=? THEN 'owner' ELSE m.role END AS role FROM trips t LEFT JOIN members m ON m.trip_id=t.id AND m.email=? AND (m.user_id IS NULL OR m.user_id=?) WHERE t.owner_id=? OR m.email IS NOT NULL ORDER BY t.start_date DESC").bind(u.userId,u.email.toLowerCase(),u.userId,u.userId).all();
 const pending=await db.prepare('SELECT id,confirm_name AS name FROM trip_deletions WHERE owner_id=? ORDER BY created_at,id').bind(u.userId).all<{id:string;name:string}>();
 return respond({trips:results.map(({owner_id,cover_key,destination_locations,...t})=>({...t,has_cover:!!cover_key,destinationLocations:destinationRefs(destination_locations)})),pendingDeletions:pending.results});
});}
export async function POST(req:Request){return handle(async()=>{csrf(req);await writableInstallation(req.url);const u=await identity(),t=tripInput.parse(await readJson(req,50000)),id=crypto.randomUUID();await database().prepare('INSERT INTO trips (id,owner_id,name,start_date,end_date,destinations,destination_locations,created_at) VALUES (?,?,?,?,?,?,?,?)').bind(id,u.userId,t.name,t.startDate,t.endDate,t.destinations,JSON.stringify(t.destinationLocations),new Date().toISOString()).run();return respond({id},201);});}
