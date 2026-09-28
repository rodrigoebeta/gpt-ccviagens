import {destinationInput,type Destination} from './geography';
import type {PlacePhoto} from './photo-contracts';
import {z} from 'zod';
export const dateValue=z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine(v=>!Number.isNaN(Date.parse(v))&&new Date(v).toISOString().slice(0,10)===v,'Data inválida');
const short=z.string().trim().min(1).max(300);
export const tripInput=z.object({name:short,startDate:dateValue,endDate:dateValue,destinations:z.string().trim().max(1000),destinationLocations:z.array(destinationInput).max(20).default([])}).strict().refine(v=>v.startDate<=v.endDate,'Confira o período').refine(v=>(Date.parse(v.endDate)-Date.parse(v.startDate))/86400000<=366,'Use viagens de até um ano');
const time=z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/).optional();
// Preserve the original Gmail shape for existing imports and fingerprints.
export const reservationSourceInput=z.discriminatedUnion('provider',[
 z.object({provider:z.literal('gmail'),messageId:z.string().regex(/^[a-f0-9]{10,40}$/),subject:short}),
 z.object({provider:z.literal('file'),filename:short,sha256:z.string().regex(/^[a-f0-9]{64}$/),subject:short}).strict(),
 z.object({provider:z.literal('external'),system:short,reference:z.string().trim().min(1).max(2000),subject:short}).strict(),
]);
export const reservationInput=z.object({
 sourceKey:short,kind:z.enum(['train','flight','bus','hotel','activity']),title:short,startDate:dateValue,endDate:dateValue,
 startTime:time,endTime:time,timezone:z.string().max(100).optional(),endTimezone:z.string().max(100).optional(),
 location:z.string().max(1000).optional(),destination:z.string().max(1000).optional(),confirmation:z.string().max(200).optional(),
 travelers:z.array(short).max(30).default([]),notes:z.string().max(12000).default(''),
 sources:z.array(reservationSourceInput).min(1).max(50),
}).strict().refine(v=>v.startDate<=v.endDate,'Confira as datas');
export const importInput=z.object({version:z.literal(1),reservation:reservationInput,documents:z.array(z.object({
 filename:short,label:short,mime:z.enum(['application/pdf','image/png','image/jpeg','image/gif','image/webp','text/plain']),base64:z.string().min(4).max(14000000)
}).strict()).max(20),change:z.object({action:z.enum(['update','cancel']),baseFingerprint:z.string().regex(/^[a-f0-9]{64}$/)}).strict().optional(),reviewReason:z.string().trim().min(1).max(1000).optional()}).strict();
export type ReservationData=z.infer<typeof reservationInput>;
export type Trip={id:string;name:string;start_date:string;end_date:string;destinations:string;role:'owner'|'editor'|'reader';destinationLocations?:Destination[];has_cover?:boolean;cover_version?:number};
export type Doc={id:string;filename:string;label:string;mime:string;bytes:number};
export type Reservation=ReservationData&{id:string;importedAt:string;documents:Doc[];fingerprint:string;status:'active'|'cancelled';updatedAt:string|null};

const safeUrl=z.string().max(2000).refine(v=>{try{return !v||/^https?:$/.test(new URL(v).protocol);}catch{return false;}},'Use um link http ou https');
export const placeInput=z.object({
 name:short,address:z.string().trim().max(1000).default(''),url:safeUrl.default(''),listId:z.string().min(1).max(100).nullable().default(null),
 date:dateValue.nullable(),time:z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/).nullable().default(null),
 latitude:z.number().min(-85).max(85).nullable().default(null),longitude:z.number().min(-180).max(180).nullable().default(null),
 notes:z.string().trim().max(4000).default(''),visited:z.boolean().default(false),
}).strict().refine(v=>(v.latitude===null)===(v.longitude===null),'Informe latitude e longitude juntas').refine(v=>v.listId!==null||v.date!==null,'Escolha um dia ou uma lista para guardar o lugar');
export type PlaceData=z.infer<typeof placeInput>;
export type Place=PlaceData&{id:string;position:number;revision:number;photo?:PlacePhoto|null};
export type PlaceList={id:string;name:string;revision:number};
export type Review={id:string;reason:string;created_at:string;status:string;reservation:ReservationData;current:Reservation|null;documents:{filename:string;label:string}[];baseFingerprint:string|null;action:'update'|'cancel'};
