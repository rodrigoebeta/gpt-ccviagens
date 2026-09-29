import {Hotel,Plane,TrainFront,Bus,Car,Ship,Ticket,CarTaxiFront,MapPin} from 'lucide-react';
const icons={hotel:Hotel,flight:Plane,train:TrainFront,bus:Bus,car:Car,transfer:CarTaxiFront,ferry:Ship,activity:Ticket};
export default function ReservationIcon({kind}:{kind:string}){const Icon=icons[kind as keyof typeof icons]??MapPin;return <Icon/>;}
