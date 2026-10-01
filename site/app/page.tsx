import {requireChatGPTUser} from './chatgpt-auth';
import TravelApp from './travel-app';
import InstallationClient from './installation-client';
import {installationStatus} from '@/lib/installation';
import {env} from 'cloudflare:workers';
import {distribution} from '@/lib/distribution-config';
import {profileNavigation} from '@/lib/profile-navigation';
import PwaClient from './pwa-client';
import {InstallationAccessProvider} from './installation-access';
export const dynamic='force-dynamic';
export default async function Home(){
 const user=await requireChatGPTUser('/'),name=user.fullName?.split(' ')[0]??'Viajante';
 const account=[...new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(user.userId)))].map(b=>b.toString(16).padStart(2,'0')).join('');
 const status=await installationStatus().catch(()=>({configured:false,writable:false,termsVersion:distribution.termsVersion,confirmedAt:null,release:null}));
 return <><meta name="central-offline-account" content={account}/><PwaClient account={account}><InstallationAccessProvider initial={status}><InstallationClient canUpdate={user.userId===env.CENTRAL_INSTALLATION_OWNER_ID} version={distribution.version} initialRelease={status.release}/><TravelApp name={name} profileMenu={profileNavigation(user.userId,name)}/></InstallationAccessProvider></PwaClient></>;
}
