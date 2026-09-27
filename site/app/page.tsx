import {requireChatGPTUser} from './chatgpt-auth';
import TravelApp from './travel-app';
import InstallationClient from './installation-client';
import {installationStatus} from '@/lib/installation';
import {env} from 'cloudflare:workers';
import {distribution} from '@/lib/distribution-config';
export const dynamic='force-dynamic';
export default async function Home(){const user=await requireChatGPTUser('/');const status=await installationStatus().catch(()=>({configured:false,release:null}));return <><InstallationClient enabled={status.configured} canUpdate={user.userId===env.CENTRAL_INSTALLATION_OWNER_ID} version={distribution.version} initialRelease={status.release}/><TravelApp name={user.fullName?.split(' ')[0]??'Viajante'}/></>;}
