import { env } from 'cloudflare:workers';
import { AppError,database,identity } from './service';
import { assistantIdentity } from './assistant-context';
import { distribution } from './distribution-config';
import { pukoPublicHostname,pukoSitesHostname,releaseInput,telemetryInput,type CentralRelease } from './installation-contract';
const DAY=86400000;
export const CONFIRMATION_GRACE=7*DAY;
type State={id:string;token:string;next_attempt_at:number;last_sent_at:number|null;release_json:string|null;release_checked_at:number;terms_version:string|null;terms_accepted_at:string|null;confirmed_terms_version:string|null};
async function state():Promise<State>{
  const db=database();
  await db.prepare('INSERT OR IGNORE INTO central_installation (singleton,id,token) VALUES (1,?,?)').bind(crypto.randomUUID(),crypto.randomUUID()+crypto.randomUUID()).run();
  return (await db.prepare('SELECT * FROM central_installation WHERE singleton=1').first<State>())!;
}
function settings(s:State){
  const stored=s.terms_version===distribution.termsVersion;
  const accepted=stored?s.terms_accepted_at:null;
  const time=Date.parse(accepted??'');
  if(!distribution.ready||!accepted||!Number.isFinite(time)||time>Date.now())return null;
  for(const raw of [distribution.telemetryEndpoint,distribution.releaseEndpoint,distribution.repository]){
    try{const u=new URL(raw);if(u.protocol!=='https:'||u.username||u.password||!pukoPublicHostname(u.hostname))return null;}catch{return null;}
  }
  if(new URL(distribution.telemetryEndpoint).origin!==new URL(distribution.releaseEndpoint).origin)return null;
  return {acceptedAt:new Date(time).toISOString()};
}
export async function installationStatus(){
  const s=await state(),configured=!!settings(s),now=Date.now();
  const confirmed=configured&&s.confirmed_terms_version===distribution.termsVersion&&s.last_sent_at!==null&&s.last_sent_at<=now&&now-s.last_sent_at<CONFIRMATION_GRACE;
  let release:CentralRelease|null=null;
  if(confirmed)try{const parsed=releaseInput.safeParse(JSON.parse(s.release_json??'null'));if(parsed.success&&now-s.release_checked_at<CONFIRMATION_GRACE&&parsed.data.repository===distribution.repository)release=parsed.data;}catch{/* Refresh a damaged cache later. */}
  return {configured,writable:confirmed,version:distribution.version,termsVersion:distribution.termsVersion,confirmedAt:s.confirmed_terms_version===distribution.termsVersion?s.last_sent_at:null,release};
}
export async function assertInstallationWritable(){
  const status=await installationStatus();
  if(!status.writable)throw new AppError(423,'Central em modo de consulta. O proprietário precisa ativar a telemetria ou renovar a confirmação. Viagens e comprovantes foram preservados.');
}
export async function acceptInstallationTerms(termsVersion:string){
  const user=await identity();
  if(assistantIdentity()||!env.CENTRAL_INSTALLATION_OWNER_ID||user.userId!==env.CENTRAL_INSTALLATION_OWNER_ID)throw new AppError(403,'Somente o proprietário pode aceitar os termos nesta Central.');
  if(termsVersion!==distribution.termsVersion||!distribution.ready)throw new AppError(409,'Os termos mudaram. Reabra o aviso antes de aceitar.');
  await state();
  await database().prepare('UPDATE central_installation SET terms_version=?,terms_accepted_at=?,confirmed_terms_version=NULL,last_sent_at=NULL,next_attempt_at=0,release_json=NULL,release_checked_at=0 WHERE singleton=1 AND (terms_version IS NULL OR terms_version<>?)').bind(termsVersion,new Date().toISOString(),termsVersion).run();
}
// Authenticated, same-origin activity only; never invent acceptance on page load.
export async function reportInstallationActivity(requestUrl:string){
  const url=new URL(requestUrl);if(url.protocol!=='https:'||!pukoPublicHostname(url.hostname))return;
  const s=await state(),config=settings(s);if(!config)return;
  const db=database(),now=Date.now();
  const claimed=await db.prepare('UPDATE central_installation SET next_attempt_at=? WHERE singleton=1 AND next_attempt_at<=?').bind(now+15*60000,now).run();
  if(!claimed.meta.changes)return;
  const internal=pukoSitesHostname(url.hostname);
  const payload=telemetryInput.parse({installationId:s.id,version:distribution.version,termsVersion:distribution.termsVersion,acceptedAt:config.acceptedAt,hosting:internal?'chatgpt.site':'external',...(!internal?{domain:url.hostname}:{})});
  const headers={Authorization:`Bearer ${s.token}`,'X-Central-Installation':s.id};
  try{
    const response=await fetch(distribution.telemetryEndpoint,{method:'POST',headers:{'Content-Type':'application/json',Authorization:headers.Authorization},body:JSON.stringify(payload),signal:AbortSignal.timeout(5000),redirect:'manual'});
    if(response.status===401||response.status===403){await db.prepare('UPDATE central_installation SET confirmed_terms_version=NULL,release_json=NULL WHERE singleton=1').run();return;}
    if(!response.ok)return;
    const receipt=JSON.parse(await limitedText(response,2048));if(receipt?.received!==true)return;
    await db.prepare('UPDATE central_installation SET next_attempt_at=?,last_sent_at=?,confirmed_terms_version=? WHERE singleton=1').bind(now+DAY,now,distribution.termsVersion).run();
  }catch{return;}
  try{
    const response=await fetch(distribution.releaseEndpoint,{headers,signal:AbortSignal.timeout(5000),redirect:'manual'});
    if(response.status===401||response.status===403){await db.prepare('UPDATE central_installation SET confirmed_terms_version=NULL,release_json=NULL,next_attempt_at=? WHERE singleton=1').bind(now+15*60000).run();return;}
    if(response.ok){
      const release=releaseInput.parse(JSON.parse(await limitedText(response,6000)));
      if(release.repository===distribution.repository)await db.prepare('UPDATE central_installation SET release_json=?,release_checked_at=? WHERE singleton=1').bind(JSON.stringify(release),now).run();
    }
  }catch{/* Keep only a bounded, previously confirmed notice. */}
}
async function limitedText(response:Response,max:number){const reader=response.body?.getReader();if(!reader)throw Error('empty');let size=0,out='';const decoder=new TextDecoder();try{while(true){const {done,value}=await reader.read();if(done)break;size+=value.byteLength;if(size>max)throw Error('large');out+=decoder.decode(value,{stream:true});}return out+decoder.decode();}finally{await reader.cancel();}}
export type {CentralRelease};
