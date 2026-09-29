import {env} from 'cloudflare:workers';
import {timingSafeEqual} from 'node:crypto';
import type {ChatGPTUser} from '@/app/chatgpt-auth';
import {destinationRefs} from './geography';
import {access, AppError, database} from './service';

// Service authentication for sync and assistant routes. Browser identity headers,
// cookies and the Sites gateway header are deliberately not used as app identity.
export async function syncIdentity(req: Request): Promise<ChatGPTUser> {
  const hash = env.CENTRAL_SYNC_TOKEN_SHA256;
  const userId = env.CENTRAL_SYNC_USER_ID;
  const email = env.CENTRAL_SYNC_USER_EMAIL;
  if (!hash || !/^[a-f0-9]{64}$/.test(hash) || !userId?.trim() || !email?.trim()) {
    throw new AppError(503, 'Sincronização não configurada nesta instalação.');
  }
  const token = req.headers.get('x-central-sync-token');
  if (!token || token.length > 4096) throw new AppError(401, 'Credencial de sincronização inválida.');
  const actual = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(token));
  const expected = new Uint8Array(hash.match(/../g)!.map(byte => parseInt(byte, 16)));
  if (!timingSafeEqual(new Uint8Array(actual), expected)) {
    throw new AppError(401, 'Credencial de sincronização inválida.');
  }
  const origin = req.headers.get('origin');
  if (origin && origin !== new URL(req.url).origin) throw new AppError(403, 'Origem não autorizada.');
  // No caller-supplied ID/email can change the service principal.
  return {userId: userId.trim(), email: email.trim().toLowerCase(), fullName: null, displayName: 'Sincronização'};
}

export function syncDate(): string {
  try {
    const parts = new Intl.DateTimeFormat('en-CA', {
      timeZone: env.CENTRAL_SYNC_TIMEZONE || 'UTC', year: 'numeric', month: '2-digit', day: '2-digit',
    }).formatToParts(new Date());
    const value = (type: string) => parts.find(part => part.type === type)!.value;
    return `${value('year')}-${value('month')}-${value('day')}`;
  } catch {
    throw new AppError(503, 'Fuso da sincronização inválido.');
  }
}

type SyncTrip = {
  id: string; name: string; start_date: string; end_date: string;
  destinations: string; destination_locations: string | null; role: 'owner' | 'editor';
};

function presentTrip({destination_locations, ...trip}: SyncTrip) {
  return {...trip, destinationLocations: destinationRefs(destination_locations)};
}

export async function syncTrips(req: Request, user: ChatGPTUser) {
  const value = new URL(req.url).searchParams.get('offset') ?? '0';
  if (!/^\d{1,5}$/.test(value) || Number(value) > 10000) throw new AppError(400, 'Página inválida.');
  const offset = Number(value), asOf = syncDate(), pageSize = 50;
  const {results} = await database().prepare(`
    SELECT t.id,t.name,t.start_date,t.end_date,t.destinations,t.destination_locations,
      CASE WHEN t.owner_id=? THEN 'owner' ELSE m.role END AS role
    FROM trips t LEFT JOIN members m ON m.trip_id=t.id AND m.email=?
      AND (m.user_id IS NULL OR m.user_id=?)
    WHERE t.end_date>=? AND (t.owner_id=? OR m.role='editor')
    ORDER BY t.start_date,t.id LIMIT ? OFFSET ?
  `).bind(user.userId, user.email, user.userId, asOf, user.userId, pageSize + 1, offset).all<SyncTrip>();
  return {
    apiVersion: 1, asOf, timezone: env.CENTRAL_SYNC_TIMEZONE || 'UTC',
    trips: results.slice(0, pageSize).map(presentTrip),
    nextOffset: results.length > pageSize ? offset + pageSize : null,
  };
}

export async function syncTripAccess(id: string, user: ChatGPTUser) {
  if (!id || id.length > 100) throw new AppError(400, 'Viagem inválida.');
  const permission = await access(id, user, true);
  if (permission.end_date < syncDate()) throw new AppError(403, 'Viagem encerrada fora do escopo da sincronização.');
  const trip = await database().prepare(`
    SELECT id,name,start_date,end_date,destinations,destination_locations FROM trips WHERE id=?
  `).bind(id).first<Omit<SyncTrip, 'role'>>();
  if (!trip) throw new AppError(404, 'Viagem não encontrada.');
  return presentTrip({...trip, role: permission.role === 'owner' ? 'owner' : 'editor'});
}
