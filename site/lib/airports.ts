import data from './airport-data.json';
export type AirportDetails={iata:string;name:string;location:string;sourceUrl:string};
export function findAirport(value:string){
 const iata=value.trim().toUpperCase();
 const row=(data.airports as Record<string,string[]>)[iata];
 const metadata={provider:'OurAirports',catalogDate:data.updated};
 if(!row)return {...metadata,status:(data.ambiguous as string[]).includes(iata)?'ambiguous':'not_found',airport:null};
 const [name,city,country,ident]=row;
 let countryName=country;try{countryName=new Intl.DisplayNames(['pt-BR'],{type:'region'}).of(country)||country;}catch{}
 const airport:AirportDetails={iata,name,location:[name,city,countryName].filter(Boolean).join(', '),sourceUrl:'https://ourairports.com/airports/'+encodeURIComponent(ident)+'/'};
 return {...metadata,status:'found',airport};
}
