'use client';
import {useEffect,useRef,useState} from 'react';
import {createPortal} from 'react-dom';
import {Check,X} from 'lucide-react';
export default function NoticeToast({message,onClose}:{message:string;onClose:()=>void}){
 const [paused,setPaused]=useState(false);
 useEffect(()=>setPaused(false),[message]);
 const close=useRef(onClose);useEffect(()=>{close.current=onClose;},[onClose]);
 useEffect(()=>{if(!message||paused)return;const timer=setTimeout(()=>close.current(),5000);return()=>clearTimeout(timer);},[message,paused]);
 if(!message)return null;
 return createPortal(<div className="notice-toast" onPointerEnter={()=>setPaused(true)} onPointerLeave={()=>setPaused(false)} onFocusCapture={()=>setPaused(true)} onBlurCapture={()=>setPaused(false)}><p role="status"><Check aria-hidden="true"/>{message}</p><button type="button" aria-label="Fechar aviso" onClick={onClose}><X aria-hidden="true"/></button></div>,document.body);
}
