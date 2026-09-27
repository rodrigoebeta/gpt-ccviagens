const shift=(day:string,n:number)=>new Date(Date.parse(day+'T12:00:00Z')+n*86400000).toISOString().slice(0,10);
export function dateWindow(day:string,start:string,end:string){
 const clamped=[start,day,end].sort()[1];
 const offset=Math.floor((Date.parse(clamped+'T12:00:00Z')-Date.parse(start+'T12:00:00Z'))/86400000);
 const first=shift(start,Math.floor(offset/7)*7);
 return Array.from({length:7},(_,i)=>shift(first,i)).filter(d=>d<=end);
}
// A compact reading aid only; the saved original is always available in full.
export function compactAddress(address:string){
 const parts=address.split(',').map(p=>p.trim().split(/\s+-\s+|\s+\/\s+/)[0]).filter(Boolean);
 const unique=parts.filter((p,i)=>parts.findIndex(v=>v.toLocaleLowerCase()===p.toLocaleLowerCase())===i);
 let street=unique.shift()??'';
 if(unique[0]&&/^\d+[\w/-]*$/.test(unique[0]))street+=' '+unique.shift();
 return {street,locality:unique[0]??'',full:address};
}
