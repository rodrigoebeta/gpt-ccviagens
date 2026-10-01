import {requireChatGPTUser} from '../chatgpt-auth';
import {policies} from '@/lib/distribution-policies';
import './policies.css';
export const dynamic='force-dynamic';
function Policy({text}:{text:string}){return text.replaceAll('\r\n','\n').split('\n\n').filter(Boolean).map((block,i)=>block.startsWith('# ')?<h2 key={i}>{block.slice(2)}</h2>:block.startsWith('## ')?<h3 key={i}>{block.slice(3)}</h3>:<p key={i}>{block.replaceAll('**','')}</p>);}
export default async function Conditions(){await requireChatGPTUser('/conditions');return <main className="central-policies"><a href="/">Voltar à Central</a><h1>Termos e privacidade</h1><section><Policy text={policies.license}/></section><section><Policy text={policies.privacy}/></section></main>;}
