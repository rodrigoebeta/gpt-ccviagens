import { z } from 'zod';
import { csrf,handle,readJson,respond } from '@/lib/service';
import { acceptInstallationTerms,installationStatus,reportInstallationActivity } from '@/lib/installation';
export const dynamic='force-dynamic';
export async function POST(req:Request){return handle(async()=>{
  csrf(req);
  const input=z.object({accepted:z.literal(true),termsVersion:z.string()}).strict().parse(await readJson(req,1000));
  await acceptInstallationTerms(input.termsVersion);
  await reportInstallationActivity(req.url);
  return respond(await installationStatus());
});}
