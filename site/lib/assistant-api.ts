import * as trips from '@/app/api/trips/route';
import * as trip from '@/app/api/trips/[id]/route';
import * as documents from '@/app/api/documents/[id]/route';
import * as ingest from '@/app/api/trips/[id]/import/route';
import * as lists from '@/app/api/trips/[id]/lists/route';
import * as places from '@/app/api/trips/[id]/places/route';
import * as timeline from '@/app/api/trips/[id]/timeline/route';
import * as members from '@/app/api/trips/[id]/members/route';
import * as reviews from '@/app/api/trips/[id]/reviews/route';
import * as reservations from '@/app/api/trips/[id]/reservations/[reservationId]/route';
import * as period from '@/app/api/trips/[id]/period-items/route';
import * as locations from '@/app/api/trips/[id]/locations/route';
import * as mapPoint from '@/app/api/trips/[id]/map-point/route';
import * as search from '@/app/api/trips/[id]/place-search/route';
import * as photo from '@/app/api/trips/[id]/places/[placeId]/photo/route';
import * as photoSearch from '@/app/api/trips/[id]/places/[placeId]/photo-search/route';
import * as cover from '@/app/api/trips/[id]/cover/route';
import * as profileCover from '@/app/api/profile/cover/route';
import * as destinations from '@/app/api/destinations/search/route';
import {withAssistantIdentity} from './assistant-context';
import {AppError,handle,respond} from './service';
import {syncIdentity} from './sync';

type Handler=(req:Request,context:{params:Promise<Record<string,string>>})=>Promise<Response>;
type Entry={path:string;module:object;contract:Record<string,string>};
const routes:Entry[]=[
 {path:'trips',module:trips,contract:{GET:'Todas as viagens acessíveis, inclusive encerradas; trips contém role e cover_version. pendingDeletions contém id/name dos recibos de limpeza ainda pendentes, somente do proprietário autenticado.',POST:'Trip. Cria com o proprietário configurado no servidor; retorna id. Somente mediante pedido explícito.'}},
 {path:'trips/{id}',module:trip,contract:{GET:'Retorna trip, base para edição, role e reservations com documentos/fingerprints.',PATCH:'{trip:Trip,base:Trip}. Reutilizar base de GET; não excluir datas com itens existentes.',DELETE:'{confirmName:string}. Nome exato e pedido explícito; apenas proprietário. Remove a viagem e seu conteúdo. Em202/retryRequired, aguardar e repetir o mesmo DELETE para concluir limpeza; cleanupReason=uploads_in_progress inclui pendingUploads e recoveryHint. Só confirmar arquivos removidos com filesCleaned:true.'}},
 {path:'trips/{id}/lists',module:lists,contract:{GET:'Listas com id,name,revision; cria a lista padrão se ausente.',POST:'{name:string[1..100]}',PATCH:'{id:string,name:string[1..100],revision:integer>0}',DELETE:'{id:string,revision:integer>0,moveToListId?:string}. Lista ocupada exige destino para preservar lugares; padrão pode ser renomeada, não excluída.'}},
 {path:'trips/{id}/places',module:places,contract:{GET:'Lugares com id,revision,position e Place.',POST:'Place',PATCH:'{id:string,revision:integer>0,place:Place,position?:number}. Corpo completo; date=null,time=null tira do roteiro mantendo listId; visited marca visita; listId move entre listas.',DELETE:'{id:string,revision:integer>0}. Remove o lugar; pedido explícito.'}},
 {path:'trips/{id}/timeline',module:timeline,contract:{GET:'Query day=YYYY-MM-DD. Retorna ids salvos,currentIds atuais,revision.',POST:'{day:date,revision:integer>=0,ids:string[]}. Todos os currentIds, uma vez cada, na ordem desejada.'}},
 {path:'trips/{id}/import',module:ingest,contract:{POST:'ImportBundle. Importação interativa; para rotina agendada usar /api/sync/trips/{id}/import, que também limita por período.'}},
 {path:'trips/{id}/reservations/{reservationId}',module:reservations,contract:{PATCH:'{baseFingerprint:sha256,reservation:Reservation}. Edição manual completa com fingerprint atual; preserva proteção contra substituição automática.'}},
 {path:'trips/{id}/reviews',module:reviews,contract:{GET:'Revisões pendentes, reserva atual e baseFingerprint.',POST:'{id:string,action:accept|dismiss,baseFingerprint:string|null,reservation?:Reservation}. Aceite exige conferência; não tratar revisão como alteração aplicada.'}},
 {path:'documents/{id}',module:documents,contract:{GET:'Bytes originais do documento; requer permissão da viagem. Query download=1 opcional. URLs /api/... retornadas pela UI podem usar o prefixo /api/assistant/... para este cliente.'}},
 {path:'trips/{id}/members',module:members,contract:{GET:'Convidados da viagem. Somente proprietário.',POST:'{email:string,role:reader|editor}. Somente proprietário e pedido explícito de compartilhar; acesso ao Site é separado.',DELETE:'{email:string}. Somente proprietário e pedido explícito de revogar.'}},
 {path:'trips/{id}/period-items',module:period,contract:{GET:'Datas de reservas e lugares agendados para conferir mudanças no período.'}},
 {path:'trips/{id}/locations',module:locations,contract:{GET:'Localizações persistidas e pendências das reservas.',POST:'{key:string,retry?:boolean}. Resolver/tentar novamente uma chave retornada pelo GET.'}},
 {path:'trips/{id}/map-point',module:mapPoint,contract:{POST:'{day:date,key:string}. Somente chave de ponto pertencente às reservas desse dia.'}},
 {path:'trips/{id}/place-search',module:search,contract:{POST:'{query:string[3..200],day?:date,nearby?:boolean}. Pesquisa de lugares contextualizada; respeita limites do provedor.'}},
 {path:'destinations/search',module:destinations,contract:{POST:'{query:string[2..200]}. Referências de destinos retornam name,address,latitude,longitude,osmType,osmId,kind e bbox opcional.'}},
 {path:'trips/{id}/places/{placeId}/photo-search',module:photoSearch,contract:{POST:'Sem campos; busca candidatos de foto para o lugar existente. Não inventar candidateId.'}},
 {path:'trips/{id}/places/{placeId}/photo',module:photo,contract:{GET:'Bytes da foto enviada.',POST:'{revision:integer>0,candidateId?:string,mime?:image/jpeg|image/png,base64?:string}. Usar candidato retornado ou upload de até2MB; ver contrato completo no guia.',DELETE:'{revision:integer>0}. Restaura apresentação sem foto personalizada.'}},
 {path:'trips/{id}/cover',module:cover,contract:{GET:'Bytes da capa; cover_version vem de GET trips.',POST:'ImageUpload',DELETE:'{revision:integer>=0}. Restaura capa padrão.'}},
 {path:'profile/cover',module:profileCover,contract:{GET:'Query metadata=1 retorna has_cover,cover_version; sem query retorna bytes.',POST:'ImageUpload',DELETE:'{revision:integer>=0}. Restaura capa pessoal padrão.'}},
];

export function assistantCapabilities(){return {
 apiVersion:1,basePath:'/api/assistant',credentialScope:'O token permite as operações abaixo com as permissões atuais do usuário configurado. Não compartilhar com convidados. O prompt limita a tarefa agendada a /api/sync; o token não é exclusivo dessa tarefa.',
 authentication:{gateway:'OAI-Sites-Authorization: Bearer <token>',application:'X-Central-Sync-Token: <token>',source:'get_site.siwc_bypass_bearer_token em memória, sem rotacionar ou persistir',contentType:'application/json'},
 rules:['Não enviar identidade do usuário por headers/corpo.','Ler antes de editar; preservar campos não solicitados.','Em409, reler e comparar; não sobrescrever à força.','Exclusão, compartilhamento e criação de viagem dependem de pedido explícito.','Não há API de administração de telemetria, aceite legal, segredos ou publicação neste gateway.'],
 schemas:{
  Trip:'{name:string[1..300],startDate:date,endDate:date,destinations:string<=1000,destinationLocations?:Destination[]<=20}; intervalo de até366dias.',
  Destination:'{name:string[1..300],address:string<=1000,latitude:number[-85..85],longitude:number[-180..180],osmType:node|way|relation,osmId:string de dígitos,kind:string[1..40],bbox?:[west,south,east,north]}. Usar resultados de destinations/search; não inventar coordenadas.',
  Place:'{name:string[1..300],address?:string<=1000,url?:http(s),listId:string|null,date:date|null,time:HH:mm|null,latitude?:number|null,longitude?:number|null,notes?:string<=4000,visited?:boolean}; listId ou date obrigatório; latitude/longitude em par; data dentro da viagem.',
  Reservation:'{sourceKey:string,kind:train|flight|bus|hotel|activity,title:string,startDate:date,endDate:date,startTime?:HH:mm,endTime?:HH:mm,timezone?:string,endTimezone?:string,location?:string,destination?:string,confirmation?:string,travelers?:string[],notes?:string,sources:Source[]}. Preservar sourceKey/proveniência.',
  Source:'{provider:gmail,messageId:hex real[10..40],subject:string} ou {provider:file,filename:string,sha256:hex64,subject:string} ou {provider:external,system:string,reference:string,subject:string}.',
  ImportBundle:'{version:1,reservation:Reservation,documents:Document[],change?:{action:update|cancel,baseFingerprint:hex64},reviewReason?:string}. Máx25MB HTTP,20documentos,10MB/documento. Cancelamento usa importação com change.action=cancel.',
  Document:'{filename:string,label:string,mime:application/pdf|image/png|image/jpeg|image/gif|image/webp|text/plain,base64:string}; bytes originais.',
  ImageUpload:'{revision:integer>=0,mime:image/jpeg|image/png,base64:string}; até2MB decodificados.',
 },
 operations:routes.map(({path,module,contract})=>({path:'/api/assistant/'+path,methods:Object.keys(module).filter(key=>['GET','POST','PATCH','DELETE'].includes(key)),contract})),
};}

export async function dispatchAssistant(req:Request,{params}:{params:Promise<{path:string[]}>}){return handle(async()=>{
 const user=await syncIdentity(req),parts=(await params).path;
 if(!Array.isArray(parts)||parts.some(part=>!part||part.length>200||part.includes('/')||part.includes('\\')))throw new AppError(400,'Caminho inválido.');
 if(parts.length===1&&parts[0]==='capabilities'){
  if(req.method!=='GET')return respond({error:'Método não permitido.'},405);
  return respond(assistantCapabilities());
 }
 for(const entry of routes){
  const pattern=entry.path.split('/'),values:Record<string,string>={};
  if(pattern.length!==parts.length||!pattern.every((part,index)=>part.startsWith('{')?(values[part.slice(1,-1)]=parts[index],true):part===parts[index]))continue;
  const handler=(entry.module as Record<string,unknown>)[req.method];
  if(typeof handler!=='function')return new Response(JSON.stringify({error:'Método não permitido.'}),{status:405,headers:{'Content-Type':'application/json','Cache-Control':'private, no-store',Allow:Object.keys(entry.contract).join(', ')}});
  if(req.method!=='GET'&&req.body&&req.headers.get('content-type')?.split(';')[0].trim().toLowerCase()!=='application/json')throw new AppError(415,'Envie application/json.');
  return withAssistantIdentity(user,()=>(handler as Handler)(req,{params:Promise.resolve(values)}));
 }
 throw new AppError(404,'Operação não disponível para o assistente.');
});}
