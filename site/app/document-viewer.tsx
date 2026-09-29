'use client';
import {useEffect,useMemo,useRef,useState,type RefObject} from 'react';
import {ChevronLeft,ChevronRight,Download,Maximize,Minus,Plus,X,LoaderCircle,FileWarning} from 'lucide-react';
import {TransformWrapper,TransformComponent,type ReactZoomPanPinchRef} from 'react-zoom-pan-pinch';
import type {PDFDocumentProxy,PDFDocumentLoadingTask} from 'pdfjs-dist';
import {Dialog,DialogContent,DialogTitle,DialogDescription} from '@/components/ui/dialog';
import {Button} from '@/components/ui/button';
import {documentKind,documentFormat} from '@/lib/document-preview';
import type {Doc} from '@/lib/contracts';

type Size={width:number;height:number};
export default function DocumentViewer({document:doc,localFile,onClose,returnFocus}:{document:Doc;localFile?:File;onClose:()=>void;returnFocus:RefObject<HTMLButtonElement|null>}){
 const kind=documentKind(doc.mime),url='/api/documents/'+encodeURIComponent(doc.id);
 const [localUrl,setLocalUrl]=useState('');
 useEffect(()=>{if(!localFile)return;const value=URL.createObjectURL(localFile);setLocalUrl(value);return()=>URL.revokeObjectURL(value);},[localFile]);
 const [pdf,setPdf]=useState<PDFDocumentProxy|null>(null),[image,setImage]=useState(''),[text,setText]=useState('');
 const [loading,setLoading]=useState(true),[error,setError]=useState(''),[attempt,setAttempt]=useState(0);
 const [pageText,setPageText]=useState('');
 const [page,setPage]=useState(1),[pageReady,setPageReady]=useState(false),[natural,setNatural]=useState<Size>({width:0,height:0});
 const [area,setArea]=useState<Size>({width:0,height:0}),[zoom,setZoom]=useState(1),[renderZoom,setRenderZoom]=useState(1);
 const [passwordPrompt,setPasswordPrompt]=useState(''),[password,setPassword]=useState('');
 const passwordReply=useRef<((value:string)=>void)|null>(null),canvas=useRef<HTMLCanvasElement>(null),transform=useRef<ReactZoomPanPinchRef>(null);
 const [stage,setStage]=useState<HTMLDivElement|null>(null);
 const heading=useRef<HTMLHeadingElement>(null);
 const textPages=useMemo(()=>{const lines=text.replace(/\r\n?/g,'\n').replace(/\t/g,'    ').split('\n').flatMap(line=>line.match(/.{1,70}/gu)??['']);const pages:string[]=[];for(let i=0;i<lines.length;i+=40)pages.push(lines.slice(i,i+40).join('\n'));return pages;},[text]);
 const pageCount=pdf?.numPages??(kind==='text'?textPages.length:1);
 const fit=natural.width&&area.width?Math.min((area.width-24)/natural.width,(area.height-24)/natural.height):0;
 const size={width:Math.max(1,natural.width*fit),height:Math.max(1,natural.height*fit)};
 useEffect(()=>{
  const element=stage;if(!element)return;
  const observer=new ResizeObserver(([entry])=>setArea({width:entry.contentRect.width,height:entry.contentRect.height}));observer.observe(element);return()=>observer.disconnect();
 },[stage]);
 useEffect(()=>{const timer=setTimeout(()=>setRenderZoom(zoom),150);return()=>clearTimeout(timer);},[zoom]);
 useEffect(()=>{
  let alive=true,objectUrl='',task:PDFDocumentLoadingTask|undefined;const controller=new AbortController();
  setLoading(true);setError('');setPdf(null);setImage('');setText('');setPage(1);setNatural({width:0,height:0});setPageReady(false);setPasswordPrompt('');passwordReply.current=null;
  if(kind==='unsupported'){setLoading(false);return;}
  (async()=>{
   let blob:Blob;
   if(localFile)blob=localFile;
   else{const response=await fetch(url,{signal:controller.signal,credentials:'same-origin',cache:'no-store'});
    if(!response.ok)throw Error(response.status===401||response.status===403?'Seu acesso a este documento não está disponível. Feche a prévia e entre novamente.':response.status===503?'Não foi possível carregar este documento. Abra-o com internet antes de consultá-lo offline.':'Não foi possível carregar o arquivo. Tente novamente.');
    blob=await response.blob();}
   if(!alive)return;
   if(kind==='pdf'){
    const lib=await import('pdfjs-dist');if(!alive)return;
    const assets='/pdfjs/'+lib.version+'/';lib.GlobalWorkerOptions.workerSrc=assets+'pdf.worker.min.mjs';
    task=lib.getDocument({data:new Uint8Array(await blob.arrayBuffer()),cMapUrl:assets+'cmaps/',cMapPacked:true,standardFontDataUrl:assets+'standard_fonts/',wasmUrl:assets+'wasm/',iccUrl:assets+'iccs/',enableXfa:false});
    task.onPassword=(reply:(value:string)=>void,reason:number)=>{if(alive){passwordReply.current=reply;setPassword('');setPasswordPrompt(reason===lib.PasswordResponses.INCORRECT_PASSWORD?'Senha incorreta. Tente novamente.':'Este PDF precisa de senha para abrir.');setLoading(false);}};
    const result=await task.promise;if(!alive)return;setPdf(result);setPasswordPrompt('');
   }else if(kind==='image'){
    objectUrl=URL.createObjectURL(new Blob([blob],{type:doc.mime}));setImage(objectUrl);
   }else {setText(await blob.text());setNatural({width:720,height:900});}
   if(alive)setLoading(false);
  })().catch(e=>{if(alive&&e.name!=='AbortError'){setLoading(false);setError(e.message?.startsWith('Seu acesso')||e.message?.startsWith('Não foi possível carregar')?e.message:'Não foi possível exibir este arquivo. Ele pode estar incompleto ou ter um formato incompatível.');}});
  return()=>{alive=false;controller.abort();passwordReply.current=null;if(objectUrl)URL.revokeObjectURL(objectUrl);if(task)void task.destroy().catch(()=>{});};
 },[url,kind,doc.mime,attempt,localFile]);
 useEffect(()=>{
  if(!pdf)return;let alive=true;setPageReady(false);
  setPageText('');pdf.getPage(page).then(async p=>{if(alive){const v=p.getViewport({scale:1});setNatural({width:v.width,height:v.height});setPageReady(true);const content=await p.getTextContent();if(alive)setPageText(content.items.map(item=>'str' in item?item.str:'').join(' '));}}).catch(()=>{if(alive)setError('Não foi possível abrir esta página. Tente novamente.');});
  return()=>{alive=false;};
 },[pdf,page]);
 useEffect(()=>{
  if(!pdf||!pageReady||!fit||!canvas.current)return;
  let cancelled=false,render:ReturnType<Awaited<ReturnType<PDFDocumentProxy['getPage']>>['render']>|undefined;
  const target=canvas.current;
  pdf.getPage(page).then(p=>{
   if(cancelled)return;
   // Bound bitmap memory while retaining sharper text as the reader zooms.
   const density=Math.min((window.devicePixelRatio||1)*renderZoom,Math.sqrt(12_000_000/(size.width*size.height)),8192/Math.max(size.width,size.height));
   const viewport=p.getViewport({scale:fit*density});target.width=Math.ceil(viewport.width);target.height=Math.ceil(viewport.height);
   render=p.render({canvas:target,viewport});return render.promise;
  }).catch(e=>{if(!cancelled&&e.name!=='RenderingCancelledException')setError('Não foi possível desenhar esta página. Tente novamente.');});
  return()=>{cancelled=true;render?.cancel();};
 },[pdf,page,pageReady,fit,size.width,size.height,renderZoom]);
 const available=!loading&&!error&&!passwordPrompt&&(kind==='image'?natural.width>0:kind==='pdf'?pageReady:kind==='text');
 const reset=()=>{void transform.current?.centerView(1,0);setZoom(1);};
 return <Dialog open onOpenChange={open=>{if(!open)onClose();}}><DialogContent className="document-viewer" positioning="viewport" showCloseButton={false} onOpenAutoFocus={event=>{event.preventDefault();heading.current?.focus({preventScroll:true});}} onCloseAutoFocus={event=>{event.preventDefault();returnFocus.current?.focus({preventScroll:true});}}>
  <header className="document-viewer-header"><div><DialogTitle ref={heading} tabIndex={-1}>{doc.label}</DialogTitle><DialogDescription>{documentFormat(doc.mime)} · {doc.filename}</DialogDescription></div><Button variant="ghost" size="icon" aria-label="Fechar documento" onClick={onClose}><X/></Button></header>
  <div className="document-viewer-toolbar">
   <div className="document-pages" aria-label="Páginas"><Button variant="ghost" size="icon" aria-label="Página anterior" disabled={!available||page<=1} onClick={()=>setPage(p=>p-1)}><ChevronLeft/></Button><span aria-live="polite">{page} / {pageCount}</span><Button variant="ghost" size="icon" aria-label="Próxima página" disabled={!available||page>=pageCount} onClick={()=>setPage(p=>p+1)}><ChevronRight/></Button></div>
   <div className="document-zoom"><Button variant="ghost" size="icon" aria-label="Diminuir zoom" disabled={!available||zoom<=1.01} onClick={()=>void transform.current?.zoomOut(.25,0)}><Minus/></Button><output aria-label="Zoom">{Math.round(zoom*100)}%</output><Button variant="ghost" size="icon" aria-label="Aumentar zoom" disabled={!available||zoom>=5} onClick={()=>void transform.current?.zoomIn(.25,0)}><Plus/></Button><Button variant="ghost" className="document-fit" disabled={!available} onClick={reset}><Maximize/>Ajustar</Button></div>
   <Button asChild variant="outline"><a href={localFile?localUrl:url+'?download=1'} download={doc.filename}><Download/>Baixar</a></Button>
  </div>
  <div className="document-stage" ref={setStage}>
   {loading&&<p className="document-message" role="status"><LoaderCircle className="animate-spin"/>Carregando documento…</p>}
   {error&&<div className="document-message" role="alert"><FileWarning/><p>{error}</p><Button variant="outline" onClick={()=>setAttempt(a=>a+1)}>Tentar novamente</Button></div>}
   {passwordPrompt&&<form className="document-password form-stack" onSubmit={e=>{e.preventDefault();setLoading(true);setPasswordPrompt('');passwordReply.current?.(password);setPassword('');}}><p>{passwordPrompt}</p><label>Senha do PDF<input type="password" value={password} onChange={e=>setPassword(e.target.value)} autoComplete="off" required/></label><Button>Abrir PDF</Button></form>}
   {kind==='unsupported'&&<div className="document-message"><FileWarning/><p>Prévia indisponível para este formato.</p><p>Use Baixar para abrir o arquivo no seu aplicativo.</p></div>}
   {kind!=='unsupported'&&!loading&&!error&&!passwordPrompt&&area.width>0&&<TransformWrapper key={`${page}-${area.width}-${area.height}-${attempt}`} ref={transform} minScale={1} maxScale={5} centerOnInit centerZoomedOut doubleClick={{mode:'toggle',step:1}} wheel={{step:.15}} velocityAnimation={{disabled:true}} onTransform={context=>setZoom(context.state.scale)} onInit={()=>setZoom(1)}>
    <TransformComponent wrapperClass="document-transform" contentClass="document-surface">
     {kind==='pdf'&&pageReady&&<div><canvas ref={canvas} style={{width:size.width,height:size.height}} role="img" aria-label={`${doc.label}, página ${page} de ${pdf?.numPages}`}/><p className="sr-only">{pageText}</p></div>}
     {kind==='image'&&image&&<img src={image} alt={doc.label} draggable={false} style={natural.width?{width:size.width,height:size.height}: {maxWidth:area.width-24,maxHeight:area.height-24}} onLoad={e=>{setNatural({width:e.currentTarget.naturalWidth,height:e.currentTarget.naturalHeight});setPageReady(true);}} onError={()=>setError('Esta imagem não pôde ser aberta. Use Baixar para tentar em outro aplicativo.')}/>}
     {kind==='text'&&<div style={{width:size.width,height:size.height}}><pre className="document-text" style={{width:720,height:900,transform:`scale(${fit})`,transformOrigin:"top left"}}>{textPages[page-1]||'(Arquivo de texto vazio)'}</pre></div>}
    </TransformComponent>
   </TransformWrapper>}
  </div>
  <p className="document-viewer-help">Use dois dedos ou os botões para ampliar. Arraste para mover. Ajustar volta à tela inteira.</p>
 </DialogContent></Dialog>;
}
