import type {FlightDetails,TransitDetails,ReservationData} from './contracts';

const fields={
 sourceKey:'string[1..300], obrigatório; identidade estável da mesma reserva',
 kind:'train|flight|bus|car|transfer|ferry|hotel|activity, obrigatório',
 title:'string[1..300], obrigatório',startDate:'YYYY-MM-DD válido, obrigatório',endDate:'YYYY-MM-DD válido >= startDate, obrigatório',
 startTime:'HH:mm opcional',endTime:'HH:mm opcional',timezone:'string<=100 opcional; fuso IANA',endTimezone:'string<=100 opcional; fuso IANA da chegada/fim',
 location:'string<=1000 opcional; endereço/localização da partida, hospedagem ou evento',destination:'string<=1000 opcional; chegada/devolução do transporte',
 confirmation:'string<=200 opcional; referência original, distinta do localizador do voo',travelers:'string[1..300][] opcional, até30',notes:'string<=12000 opcional',
 sources:'Source[] obrigatório, 1..50; proveniência real',locationPoint:'ReservationPoint opcional; ponto OSM selecionado da origem/local',destinationPoint:'ReservationPoint opcional; ponto OSM selecionado da chegada',
 flight:'FlightDetails opcional; dados estruturados do voo',
 transit:'TransitDetails opcional, somente train/bus; número do serviço, estações/terminais e cidades',
} satisfies Record<keyof ReservationData,string>;
const flightFields={originIata:'3 letras maiúsculas opcionais; aeroporto de partida',destinationIata:'3 letras maiúsculas opcionais; aeroporto de chegada',originAirport:'string[1..300] opcional; nome do aeroporto de partida',destinationAirport:'string[1..300] opcional; nome do aeroporto de chegada',number:'string[1..40] opcional; companhia e número do voo',locator:'string[1..100] opcional; localizador explícito',tickets:'FlightTicket[] opcional, até30'} satisfies Record<keyof FlightDetails,string>;
const ticketFields={number:'string[1..100] obrigatório; preservar zeros iniciais',passenger:'string[1..300] opcional'} satisfies Record<keyof NonNullable<FlightDetails['tickets']>[number],string>;
const transitFields={number:'string[1..40] opcional; número/identificador do serviço, preservar letras e zeros iniciais; não é localizador nem ticket',originStation:'string[1..300] opcional; nome da estação/terminal de partida',originCity:'string[1..300] opcional; cidade de partida',destinationStation:'string[1..300] opcional; nome da estação/terminal de chegada',destinationCity:'string[1..300] opcional; cidade de chegada'} satisfies Record<keyof TransitDetails,string>;
const pointFields={name:'string[1..300]',address:'string<=1000, igual a location/destination',latitude:'number[-85..85]',longitude:'number[-180..180]',osmType:'node|way|relation',osmId:'string de dígitos',kind:'string[1..40]'} satisfies Record<keyof NonNullable<ReservationData['locationPoint']>,string>;
const describe=(value:Record<string,string>)=>'{'+Object.entries(value).map(([key,description])=>key+': '+description).join('; ')+'}';
export const importSchemas={
 Reservation:describe(fields),FlightDetails:describe(flightFields),FlightTicket:describe(ticketFields),TransitDetails:describe(transitFields),
 ReservationPoint:describe(pointFields)+'. Copiar resultado OSM real sem bbox/url/context/addressParts. Nome do ponto independe do título da hospedagem. Remover ponto ao alterar endereço, preservá-lo ao renomear a reserva.',
 Source:'{provider:gmail,messageId:hex real minúsculo[10..40],subject:string[1..300]} ou {provider:file,filename:string[1..300],sha256:hex64,subject:string[1..300]} ou {provider:external,system:string[1..300],reference:string[1..2000],subject:string[1..300]}. manual/entryId:uuid só é gerado no cadastro manual; não fabricar para importação.',
 ImportBundle:'{version:1,reservation:Reservation,documents:Document[],change?:{action:update|cancel,baseFingerprint:hex64},reviewReason?:string[1..1000]}. JSON estrito, até25MB HTTP; documents obrigatório, até20, [] permitido.',
 Document:'{filename:string[1..300],label:string[1..300],mime:application/pdf|image/png|image/jpeg|image/gif|image/webp|text/plain,base64:string}; bytes originais, até10MB decodificados por arquivo.',
};
export const reservationImportContract={
 revision:'2026-09-29.3',bundleVersion:1,strict:true,fields,flightFields,transitFields,ticketFields,pointFields,schemas:importSchemas,
 byKind:{hotel:'Nome da hospedagem em title; um location e timezone; início/check-in e fim/check-out; omitir destination/destinationPoint; endTimezone, se enviado, igual a timezone.',flight:'Preencher flight com dados comprovados. Um trecho por reserva, vários tickets/passageiro opcional. Horários/fusos e localizações separados por etapa.',train:'Preencher transit com número do serviço, estações e cidades comprovados; endereço/ponto, horários/fusos separados por etapa.',bus:'Preencher transit com número do serviço, terminais e cidades comprovados; endereço/ponto, horários/fusos separados por etapa.',car:'Retirada e devolução; title identifica locadora/veículo.',transfer:'Partida e chegada, locais e horários por etapa.',ferry:'Partida e chegada, terminais e horários/fusos por etapa.',activity:'Nome em title, local em location, datas inicial/final inclusivas; a Central exibe os dias intermediários sem inventar horário.'},
 rules:['Consulte este contrato a cada execução; ele inclui os campos da versão instalada. Envie todos os campos disponíveis e comprovados, omitindo os desconhecidos. Não envie metadados de resposta dentro de reservation.',
 'Preserve sourceKey, fontes, campos já preenchidos e fingerprint atual nas alterações. Um campo opcional ausente na nova fonte não autoriza apagar o valor existente. Não converta confirmation em flight.locator sem evidência.',
 'IATA identifica aeroporto, não terminal, endereço postal ou fuso. Não derive códigos só pelo nome da cidade. Catálogo OurAirports é auxílio atual, não prova histórica nem validação OSM.',
 'localização textual, conferência externa e ponto OSM são estados distintos. Não invente osmId/coordenadas nem afirme localização validada por apenas preencher texto.',
 'Em trem/ônibus, transit.number é texto: preserve letras, espaços e zeros iniciais. Estação/terminal e cidade são independentes do endereço/ponto. Não deduza esses campos do título ou do localizador. Omitir transit preserva contratos antigos.',
 'Formato inválido retorna400; período/versões/ambiguidades seguem revisão. Limites, autenticação, deduplicação, documentos originais e cancelamentos continuam obrigatórios.'],
};
