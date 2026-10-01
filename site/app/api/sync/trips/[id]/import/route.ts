import {AppError, handle, importReservation, readJson, respond} from '@/lib/service';
import {scheduleLocations} from '@/lib/schedule-locations';
import {syncIdentity, syncTripAccess} from '@/lib/sync';
import {assertInstallationWritable,reportInstallationActivity} from '@/lib/installation';

export async function POST(req: Request, {params}: {params: Promise<{id: string}>}) {
  return handle(async () => {
    const user = await syncIdentity(req), {id} = await params;
    await syncTripAccess(id, user);
    await reportInstallationActivity(req.url);
    await assertInstallationWritable();
    if (req.headers.get('content-type')?.split(';')[0].trim().toLowerCase() !== 'application/json') {
      throw new AppError(415, 'Envie application/json.');
    }
    const result = await importReservation(id, user, await readJson(req));
    if (!('reviewId' in result)) scheduleLocations(id, result.reservationId);
    return respond(result);
  });
}
