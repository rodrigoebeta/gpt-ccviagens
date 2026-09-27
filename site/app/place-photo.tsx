'use client';
import {useState} from 'react';
import type {PlacePhoto} from '@/lib/photo-contracts';
export function PhotoCredit({photo}:{photo:PlacePhoto}){return <figcaption>{photo.provider==='upload'?photo.credit:<><a href={photo.source} target="_blank" rel="noreferrer">{photo.provider}{photo.panorama?' · Vista 360°':''}</a><span>{photo.credit}{photo.date?' · '+photo.date:''} · {photo.licenseUrl?<a href={photo.licenseUrl} target="_blank" rel="noreferrer">{photo.license}</a>:photo.license}</span></>}</figcaption>;}
export default function PlacePhotoView({photo,name}:{photo:PlacePhoto;name:string}){
 const [failed,setFailed]=useState(false);
 return <figure className={'place-photo'+(photo.panorama?' is-panorama':'')}>{failed?<p className="photo-unavailable">Esta imagem está indisponível.</p>:<img src={photo.url} referrerPolicy="no-referrer" alt={'Foto escolhida para '+name} loading="lazy" onError={()=>setFailed(true)}/>}<PhotoCredit photo={photo}/></figure>;
}
