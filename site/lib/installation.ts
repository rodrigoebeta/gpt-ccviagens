import { env } from 'cloudflare:workers';
import { database } from './service';
import { distribution } from './distribution-config';
import { pukoPublicHostname,pukoSitesHostname,releaseInput,telemetryInput,type CentralRelease } from './installation-contract';
const DAY=86400000;
type State={id:string;token:string;next_attempt_at:number;release_json:string|null;release_checked_at:number};
function settings(){
  const accepted=env.CENTRAL_TERMS_ACCEPTED_AT;
  const acceptedTime=Date.parse(accepted??'');
  if(!distribution.ready || env.CENTRAL_TERMS_VERSION!==distribution.termsVersion || !accepted || !Number.isFinite(acceptedTime) || acceptedTime>Date.now())return null;
  for(const raw of [distribution.telemetryEndpoint,distribution.releaseEndpoint,distribution.repository]){
    try{const u=new URL(raw);if(u.protocol!=='https:'||u.username||u.password||!pukoPublicHostname(u.hostname))return null;}catch{return null;}
  }
  return {acceptedAt:new Date(acceptedTime).toISOString()};
}
async function state():Promise<State>{
  const db=database();
  await db.prepare('INSERT OR IGNORE INTO central_installation (singleton,id,token) VALUES (1,?,?)').bind(crypto.randomUUID(),crypto.randomUUID()+crypto.randomUUID()).run();
  return (await db.prepare('SELECT * FROM central_installation WHERE singleton=1').first<State>())!;
}
export async function installationStatus(){
  if(!settings())return {configured:false,version:distribution.version,release:null};
  const s=await state();let release:CentralRelease|null=null;
  try{const parsed=releaseInput.safeParse(JSON.parse(s.release_json??'null'));if(parsed.success&&Date.now()-s.release_checked_at<7*DAY)release=parsed.data;}catch{/* A damaged cache must not prevent a later refresh. */}
  return {configured:true,version:distribution.version,release};
}
// Called only by an authenticated, same-origin activity request. No page-load identity is sent.
export async function reportInstallationActivity(requestUrl:string){
  const config=settings();if(!config)return;
  const url=new URL(requestUrl);if(url.protocol!=='https:'||!pukoPublicHostname(url.hostname))return;
  const s=await state(),db=database(),now=Date.now();
  const claimed=await db.prepare('UPDATE central_installation SET next_attempt_at=? WHERE singleton=1 AND next_attempt_at<=?').bind(now+15*60000,now).run();
  if(!claimed.meta.changes)return;
  const internal=pukoSitesHostname(url.hostname);
  const payload=telemetryInput.parse({installationId:s.id,version:distribution.version,termsVersion:distribution.termsVersion,acceptedAt:config.acceptedAt,hosting:internal?'chatgpt.site':'external',...(!internal?{domain:url.hostname}:{})});
  let delivered=false;
  try{
    const response=await fetch(distribution.telemetryEndpoint,{method:'POST',headers:{'Content-Type':'application/json',Authorization:`Bearer ${s.token}`},body:JSON.stringify(payload),signal:AbortSignal.timeout(5000),redirect:'manual'});
    delivered=response.ok;
  }catch{/* Keep travel access independent of telemetry availability. */}
  // Update discovery is independent of successful telemetry delivery.
  try{
    const response=await fetch(distribution.releaseEndpoint,{signal:AbortSignal.timeout(5000),redirect:'manual'});
    if(response.ok){
      const text=await limitedText(response,6000);const release=releaseInput.parse(JSON.parse(text));
      if(release.repository===distribution.repository)await db.prepare('UPDATE central_installation SET release_json=?,release_checked_at=? WHERE singleton=1').bind(JSON.stringify(release),now).run();
    }
  }catch{/* Retain the previous verified release, with an expiry in installationStatus. */}
  if(delivered)await db.prepare('UPDATE central_installation SET next_attempt_at=?,last_sent_at=? WHERE singleton=1').bind(now+DAY,now).run();
}
async function limitedText(response:Response,max:number){const reader=response.body?.getReader();if(!reader)throw Error('empty');let size=0,out='';const decoder=new TextDecoder();try{while(true){const {done,value}=await reader.read();if(done)break;size+=value.byteLength;if(size>max)throw Error('large');out+=decoder.decode(value,{stream:true});}return out+decoder.decode();}finally{await reader.cancel();}}
export type {CentralRelease};


