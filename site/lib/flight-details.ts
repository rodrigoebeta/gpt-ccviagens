import type {FlightDetails} from './contracts';

export function cleanFlightDetails(value:FlightDetails|undefined):FlightDetails|undefined{
 if(!value)return undefined;
 const result:FlightDetails={};
 for(const key of ['originIata','destinationIata','originAirport','destinationAirport','number','locator'] as const){
  const text=value[key]?.trim();if(text)result[key]=key.endsWith('Iata')?text.toUpperCase():text;
 }
 const tickets=value.tickets?.filter(t=>t.number.trim()||t.passenger?.trim()).map(t=>({number:t.number.trim(),...(t.passenger?.trim()?{passenger:t.passenger.trim()}:{})}));
 if(tickets?.length)result.tickets=tickets;
 return Object.keys(result).length?result:undefined;
}
export function flightTitle(flight:FlightDetails|undefined){
 const origin=flight?.originIata||flight?.originAirport,destination=flight?.destinationIata||flight?.destinationAirport;
 if(origin||destination)return (origin||'Origem')+' → '+(destination||'Destino');
 return flight?.number?'Voo '+flight.number:'Voo';
}
