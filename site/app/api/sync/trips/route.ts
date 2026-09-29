import {handle, respond} from '@/lib/service';
import {syncIdentity, syncTrips} from '@/lib/sync';

export const dynamic = 'force-dynamic';
export async function GET(req: Request) {
  return handle(async () => respond(await syncTrips(req, await syncIdentity(req))));
}
