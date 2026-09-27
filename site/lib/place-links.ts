// Only coordinates belonging to the selected place are used. The /@lat,lng
// camera position in a Google Maps URL is deliberately not a place location.
export function parsePlaceLink(value:string):{name?:string;latitude?:number;longitude?:number}{
 try{
  const u=new URL(value);if(u.protocol!=='https:'&&u.protocol!=='http:')return {};
  const google=/^(www\.|maps\.)?google\.(com|com\.br)$/.test(u.hostname),osm=/^(www\.)?openstreetmap\.org$/.test(u.hostname);
  if(!google&&!osm)return {};
  const text=decodeURIComponent(u.pathname+u.search),match=text.match(/!3d(-?\d+(?:\.\d+)?)!4d(-?\d+(?:\.\d+)?)/);
  const query=u.searchParams.get('query')??u.searchParams.get('q')??'',pair=query.match(/^(-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)$/);
  const latitude=Number(match?.[1]??pair?.[1]??(osm?u.searchParams.get('mlat')??undefined:undefined));
  const longitude=Number(match?.[2]??pair?.[2]??(osm?u.searchParams.get('mlon')??undefined:undefined));
  const name=google?decodeURIComponent(u.pathname.match(/\/place\/([^/]+)/)?.[1]??'').replace(/\+/g,' '):'';
  return {...(name?{name}:{}),...(Number.isFinite(latitude)&&Number.isFinite(longitude)&&Math.abs(latitude)<=85&&Math.abs(longitude)<=180?{latitude,longitude}:{})};
 }catch{return {};}
}
