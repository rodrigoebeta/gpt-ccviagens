import { after } from 'next/server';
import { csrf,handle,identity,respond } from '@/lib/service';
import { installationStatus,reportInstallationActivity } from '@/lib/installation';
export const dynamic='force-dynamic';
export async function GET(){return handle(async()=>{await identity();return respond(await installationStatus());});}
export async function POST(req:Request){return handle(async()=>{csrf(req);await identity();after(async()=>{try{await reportInstallationActivity(req.url);}catch{console.warn('Installation service unavailable');}});return respond({scheduled:true},202);});}
