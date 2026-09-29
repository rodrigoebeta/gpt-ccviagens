import {handle, listReservations, respond} from '@/lib/service';
import {syncIdentity, syncTripAccess} from '@/lib/sync';

export const dynamic = 'force-dynamic';
export async function GET(req: Request, {params}: {params: Promise<{id: string}>}) {
  return handle(async () => {
    const user = await syncIdentity(req), {id} = await params;
    const trip = await syncTripAccess(id, user);
    return respond({apiVersion: 1, trip, reservations: await listReservations(id)});
  });
}
