import {handle, respond} from '@/lib/service';
import {syncIdentity, syncTrips} from '@/lib/sync';
import {reservationImportContract} from '@/lib/import-contract';

export const dynamic = 'force-dynamic';
export async function GET(req: Request) {
  return handle(async () => respond({...await syncTrips(req, await syncIdentity(req)),reservationImportContract}));
}
