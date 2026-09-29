/* Browser-local copies only. Never cache login, admin, assistant, sync or writes. */
const REVISION = "__REVISION__";
const PRECACHE = ["__PRECACHE__"];
const STATIC = 'central-static-' + REVISION;
const PRIVATE = 'central-private-v1';
const META = 'central-offline-meta-v1';
const STATE = new URL('/__offline_state__', self.location.origin).href;
const ROOT = new URL('/', self.location.origin).href;
let queue = Promise.resolve();
const locked = task => { const next = queue.then(task); queue = next.catch(() => {}); return next; };
const json = (error, status = 503) => Response.json({error}, {status});
const missing = () => json('Este conteúdo ainda não está salvo neste aparelho. Conecte-se para carregá-lo.');
const accountFrom = html => html.match(/<meta name="central-offline-account" content="([a-f0-9]{64})"\s*\/?\s*>/)?.[1];
const privatePath = p => p === '/api/trips' || p === '/api/profile/cover' || /^\/api\/documents\/[^/]+$/.test(p) || /^\/api\/trips\/[^/]+(?:\/(?:places|lists|reviews|locations|timeline|cover)|\/places\/[^/]+\/photo)?$/.test(p);
const staticPath = p => PRECACHE.includes(p) || p.startsWith('/_next/static/') || p.startsWith('/pdfjs/');
const tripPath = p => p.match(/^\/api\/trips\/([^/]+)/)?.[1];
const valid = r => r.ok && !r.redirected && r.type !== 'opaque';
async function state() { return (await (await caches.open(META)).match(STATE))?.json() ?? null; }
async function saveState(s) { await (await caches.open(META)).put(STATE, Response.json(s)); }
async function tell(message, clientId) {
 const clients = await self.clients.matchAll({type:'window',includeUncontrolled:true});
 for (const client of clients) if (!clientId || client.id === clientId) client.postMessage(message);
}
async function clear() {
 await caches.delete(PRIVATE);
 await caches.delete(META);
 await tell({type:'CENTRAL_SESSION_CLEARED'});
}
async function network(request, timeout = 6500) {
 const controller = new AbortController(), timer = setTimeout(() => controller.abort(), timeout);
 try { return await fetch(request, {signal:controller.signal}); } finally { clearTimeout(timer); }
}
async function put(cache, key, response, maxEntries = 300) {
 try {
  await cache.put(key, response);
  const keys = await cache.keys();
  for (const entry of keys.slice(0, Math.max(0, keys.length - maxEntries))) if (entry.url !== ROOT) await cache.delete(entry);
 } catch { await tell({type:'CENTRAL_STORAGE_FULL'}); }
}
async function rememberRoot(response, clientId, expected) {
 if (!valid(response) || !response.headers.get('content-type')?.includes('text/html')) return null;
 const account = accountFrom(await response.clone().text());
 if (!account) return null;
 return locked(async () => {
  let s = await state();
  if (s?.account !== account) {
   await caches.delete(PRIVATE);
   s = {account, generation:crypto.randomUUID(), revision:0, clients:{}, docTrips:{}};
   await tell({type:'CENTRAL_ACCOUNT_CHANGED',account}, undefined);
  }
  // A stale tab cannot replace its identity with another account's cached data.
  if (expected && expected !== account) { await saveState(s); return null; }
  if (clientId) s.clients[clientId] = s.generation;
  const live = new Set((await self.clients.matchAll({type:'window',includeUncontrolled:true})).map(c=>c.id));
  for (const id of Object.keys(s.clients)) if (id !== clientId && !live.has(id)) delete s.clients[id];
  await saveState(s);
  await put(await caches.open(PRIVATE), ROOT, response.clone());
  return s;
 });
}
async function bindOffline(clientId, expected) {
 return locked(async () => {
  const s = await state();
  if (!s || (expected && expected !== s.account) || !await (await caches.open(PRIVATE)).match(ROOT)) return false;
  s.clients[clientId] = s.generation;
  await saveState(s);
  return true;
 });
}
async function authorized(clientId) {
 const s = await state();
 return s && s.clients[clientId] === s.generation ? s : null;
}
async function purgeTrip(cache, id) {
 const base = '/api/trips/' + id;
 const index = await cache.match(new URL('/api/trips', ROOT));
 if (index) {
  const data = await index.json();
  data.trips = data.trips.filter(trip => trip.id !== id);
  if (Array.isArray(data.pendingDeletions)) data.pendingDeletions = data.pendingDeletions.filter(trip => trip.id !== id);
  await put(cache, new URL('/api/trips', ROOT), Response.json(data));
 }
 const detail = await cache.match(new URL(base, ROOT));
 const s = await state();
 const known = Object.entries(s?.docTrips ?? {}).filter(([,trip]) => trip === id).map(([doc]) => '/api/documents/' + doc);
 let docs = known;
 try { docs = [...known, ...((await detail?.json())?.reservations?.flatMap(r => r.documents.map(d => '/api/documents/' + d.id)) ?? [])]; } catch {}
 for (const key of await cache.keys()) {
  const p = new URL(key.url).pathname;
  if (p === base || p.startsWith(base + '/') || docs.includes(p)) await cache.delete(key);
 }
 if (s) { for (const [doc,trip] of Object.entries(s.docTrips ?? {})) if (trip === id) delete s.docTrips[doc]; s.revision++; await saveState(s); }
}
async function invalidateTripWrite(cache, id, path, method) {
 const base = '/api/trips/' + id, suffix = path.slice(base.length);
 if (!suffix && method === 'DELETE') return purgeTrip(cache, id);
 // Editing a reservation does not revoke the trip or remove its documents.
 // Keep the index that makes cached trips reachable and preserve unrelated media.
 const affected = /^\/(?:reservations|import|reviews)(?:\/|$)/.test(suffix)
  ? [base, base+'/reviews', base+'/locations', base+'/timeline']
  : /^\/(?:places|lists)(?:\/|$)/.test(suffix)
   ? [base+'/places', base+'/lists', base+'/timeline']
   : suffix === '/timeline' ? [base+'/timeline']
   : suffix === '/cover' ? [base+'/cover']
   : suffix === '/members' ? [base] : [];
 for (const key of await cache.keys()) {
  const p = new URL(key.url).pathname;
  if (affected.includes(p) || (suffix.endsWith('/photo') && p === path) ||
   (suffix === '/places' && method === 'DELETE' && p.startsWith(base+'/places/') && p.endsWith('/photo'))) await cache.delete(key);
 }
}
async function reconcile(cache, request, response) {
 const url = new URL(request.url);
 if (url.pathname === '/api/trips') {
  const ids = new Set((await response.clone().json()).trips.map(t => t.id));
  const oldIds = new Set([...(await cache.keys()).map(k => tripPath(new URL(k.url).pathname)).filter(Boolean), ...Object.values((await state())?.docTrips ?? {})]);
  for (const id of oldIds) if (!ids.has(id)) await purgeTrip(cache, id);
 } else if (/^\/api\/trips\/[^/]+$/.test(url.pathname)) {
  const s = await state();
  if (!s) return;
  s.docTrips ??= {};
  const id = tripPath(url.pathname);
  const current = new Set((await response.clone().json()).reservations.flatMap(r => r.documents.map(d => d.id)));
  const removed = Object.entries(s.docTrips).filter(([doc,trip]) => trip === id && !current.has(doc)).map(([doc]) => doc);
  for (const key of await cache.keys()) if (removed.includes(new URL(key.url).pathname.split('/api/documents/')[1])) await cache.delete(key);
  for (const doc of removed) delete s.docTrips[doc];
  for (const doc of current) s.docTrips[doc] = id;
  if (removed.length) s.revision++;
  await saveState(s);
 }
}
async function privateRead(event) {
 const {request, clientId} = event, before = await authorized(clientId);
 let response;
 try { response = await network(request, request.url.includes('/documents/') ? 15000 : 6500); } catch {}
 if (response && response.status < 500) {
  if ([401,403,404].includes(response.status) || response.redirected || response.headers.get('content-type')?.includes('text/html')) {
   await locked(async () => {
    const current = await state();
    if (!before || current?.generation !== before.generation) return;
    if (response.status === 401 || response.redirected || response.headers.get('content-type')?.includes('text/html')) await clear();
    else {
     const cache = await caches.open(PRIVATE), id = tripPath(new URL(request.url).pathname);
     if (id) await purgeTrip(cache, id);
     else {
      for (const key of await cache.keys()) if (new URL(key.url).pathname === new URL(request.url).pathname) await cache.delete(key);
      current.revision++; await saveState(current);
     }
    }
   });
   return response;
  }
  if (before && valid(response)) await locked(async () => {
   const current = await state();
   if (current?.generation !== before.generation || current.revision !== before.revision) return;
   const cache = await caches.open(PRIVATE);
   if (response.headers.get('content-type')?.includes('application/json')) await reconcile(cache, request, response);
   // Reject login HTML returned with 200 by an upstream gateway.
   if (!response.headers.get('content-type')?.includes('text/html')) await put(cache, request, response.clone());
  });
  return response;
 }
 // Only connectivity/server failure may use a copy, never an access denial.
 if (before && (await state())?.generation === before.generation) {
  const cache = await caches.open(PRIVATE);
  let cached = await cache.match(request);
  const url = new URL(request.url);
  if (!cached && url.pathname.startsWith('/api/documents/') && url.search === '?download=1') {
   cached = await cache.match(new URL(url.pathname, ROOT));
   if (cached) {
    const headers = new Headers(cached.headers);
    headers.set('Content-Disposition', (headers.get('Content-Disposition') || 'inline').replace(/^inline/, 'attachment'));
    cached = new Response(cached.body, {headers});
   }
  }
  await tell({type:'CENTRAL_OFFLINE'}, clientId);
  const current = await state();
  if (cached && current?.generation === before.generation && current.revision === before.revision) return cached;
 }
 return missing();
}
async function navigation(event) {
 try {
  const response = await network(event.request);
  if (response.status < 500) {
   const s = await rememberRoot(response, event.resultingClientId);
   if (!s) await locked(clear);
   return response;
  }
 } catch {}
 if (await bindOffline(event.resultingClientId)) return (await caches.open(PRIVATE)).match(ROOT);
 return new Response('<!doctype html><html lang="pt-BR"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Conexão necessária</title><body><h1>Conecte-se para abrir a Central</h1><p>As viagens ainda não foram salvas neste aparelho. Abra a Central com internet antes de usá-la offline.</p><a href="/">Tentar novamente</a></body></html>', {status:503,headers:{'Content-Type':'text/html; charset=utf-8'}});
}
async function asset(request) {
 const cache = await caches.open(STATIC);
 const cached = await cache.match(request);
 if (cached) return cached;
 try {
  const response = await network(request, 15000);
  if (valid(response) && !response.headers.get('content-type')?.includes('text/html')) await put(cache, request, response.clone(), 450);
  if (response.ok || response.status < 500) return response;
 } catch {}
 for (const name of await caches.keys()) if (name.startsWith('central-static-')) {
  const previous = await (await caches.open(name)).match(request);
  if (previous) return previous;
 }
 return Response.error();
}
self.addEventListener('install', event => {
 event.waitUntil((async () => {
  const cache = await caches.open(STATIC);
  // Fail installation atomically if a login page/error replaced any app asset.
  let next = 0;
  const results = await Promise.allSettled(Array.from({length:Math.min(6,PRECACHE.length)}, async () => {
   while (next < PRECACHE.length) {
    const path = PRECACHE[next++];
    const r = await network(new Request(new URL(path, ROOT), {credentials:'include',cache:'reload'}), 15000);
    if (!valid(r) || r.headers.get('content-type')?.includes('text/html')) throw Error('PWA asset unavailable');
    // Consume each body immediately and bound downloads on a mobile connection.
    await cache.put(path, r);
   }
  }));
  const failed = results.find(r => r.status === 'rejected');
  if (failed) { await caches.delete(STATIC); throw failed.reason; }
 })().catch(async error => { await (await caches.open(META)).put(new URL('/__offline_install_error__',ROOT), Response.json({reason:error.name,message:error.message})); await tell({type:'CENTRAL_INSTALL_FAILED',reason:error.name}); throw error; }));
});
self.addEventListener('activate', event => {
 event.waitUntil((async () => {
  // Keep one previous build for a cached page awaiting its next online refresh.
  const old = (await caches.keys()).filter(n => n.startsWith('central-static-') && n !== STATIC);
  for (const name of old.slice(0,-1)) await caches.delete(name);
  await self.clients.claim();
 })());
});
self.addEventListener('message', event => {
 if (event.data?.type !== 'CENTRAL_CONNECT' || !event.source?.id) return;
 event.waitUntil((async () => {
  let result;
  try {
   const response = await network(new Request(ROOT, {credentials:'include',cache:'no-store'}));
   if (response.status >= 500) throw Error('offline');
   const s = await rememberRoot(response, event.source.id, event.data.account);
   if (!s) { if (!valid(response) || !accountFrom(await response.clone().text())) await locked(clear); result = {ready:false, denied:true}; }
   else result = {ready:true, offline:false};
  } catch { result = {ready:await bindOffline(event.source.id, event.data.account), offline:true}; }
  event.ports[0]?.postMessage(result);
 })());
});
self.addEventListener('fetch', event => {
 const url = new URL(event.request.url);
 if (url.origin !== self.location.origin) return;
 if (url.pathname === '/signout-with-chatgpt' || url.pathname === '/signin-with-chatgpt' || url.pathname === '/callback') {
  event.respondWith((async () => { await locked(clear); return fetch(event.request); })()); return;
 }
 if (event.request.method !== 'GET') {
  if (!url.pathname.startsWith('/api/') || url.pathname.startsWith('/api/assistant') || url.pathname.startsWith('/api/sync')) return;
  event.respondWith((async () => {
   const before = await authorized(event.clientId);
   let response;
   try { response = await fetch(event.request); } catch { await tell({type:'CENTRAL_OFFLINE'},event.clientId); return json('Sem conexão. A alteração não foi confirmada; reconecte-se e confira os dados antes de tentar novamente.'); }
   if (response.ok) await locked(async () => {
    const current = await state();
    if (!before || current?.generation !== before.generation) return;
    if (!url.pathname.endsWith('/locations')) { current.revision++; await saveState(current); }
    const cache = await caches.open(PRIVATE), id = tripPath(url.pathname);
    if (id && url.pathname.endsWith('/locations')) await put(cache, new URL(url.pathname,ROOT), response.clone());
    else if (id) await invalidateTripWrite(cache,id,url.pathname,event.request.method);
    else if (url.pathname === '/api/trips') await cache.delete(new URL('/api/trips',ROOT));
    else if (url.pathname === '/api/profile/cover') for (const key of await cache.keys()) if (new URL(key.url).pathname === url.pathname) await cache.delete(key);
   });
   return response;
  })()); return;
 }
 if (event.request.mode === 'navigate' && url.pathname === '/') { event.respondWith(navigation(event)); return; }
 if (privatePath(url.pathname)) { event.respondWith(privateRead(event)); return; }
 if (staticPath(url.pathname)) event.respondWith(asset(event.request));
});
