export type PlacePhoto={id:string;provider:'Panoramax'|'Wikimedia Commons'|'upload';url:string;source:string;credit:string;license:string;licenseUrl:string;label:string;panorama?:boolean;distance?:number;date?:string};
export type PhotoSearch={photos:PlacePhoto[];messages:string[]};
