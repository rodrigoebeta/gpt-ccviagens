'use client';
import {createContext,useContext,useState,type ReactNode} from 'react';
export type InstallationAccess={configured:boolean;writable:boolean;termsVersion:string;confirmedAt:number|null};
const Context=createContext<InstallationAccess&{update:(status:InstallationAccess)=>void}>({configured:false,writable:false,termsVersion:'',confirmedAt:null,update:()=>{}});
export function InstallationAccessProvider({initial,children}:{initial:InstallationAccess;children:ReactNode}){
 const [status,update]=useState(initial);
 return <Context.Provider value={{...status,update}}>{children}</Context.Provider>;
}
export const useInstallationAccess=()=>useContext(Context);
