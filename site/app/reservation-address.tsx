import {compactAddress} from '@/lib/place-presentation';

export function shortReservationAddress(value:string|undefined){
 if(!value)return '';
 const {street,locality}=compactAddress(value);return [street,locality].filter(Boolean).join(' · ');
}
export default function ReservationAddress({value}:{value:string|undefined}){
 if(!value)return null;
 const {street,locality}=compactAddress(value);
 return <p className="reservation-address" aria-label="Endereço resumido"><span>{street}</span>{locality&&<small>{locality}</small>}</p>;
}
