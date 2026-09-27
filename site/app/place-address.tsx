import {compactAddress} from '@/lib/place-presentation';
export default function PlaceAddress({address}:{address:string}){
 const a=compactAddress(address);if(!address)return null;
 return <div className="place-address"><p>{a.street}</p>{a.locality&&<p className="address-locality">{a.locality}</p>}{address!==[a.street,a.locality].filter(Boolean).join(', ')&&<details><summary>Endereço completo</summary><p>{a.full}</p></details>}</div>;
}
