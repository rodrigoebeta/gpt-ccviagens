'use client';
import {useId,useRef,useState,type ChangeEvent} from 'react';
import {FileText,Paperclip,X} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {documentFileError,documentUploadTypes,reservationDocumentsCount,reservationDocumentsLimit} from '@/lib/document-upload';
import DocumentViewer from './document-viewer';
export type PendingDocument={id:string;file:File};
export default function ReservationDocumentsField({files,onChange,disabled}:{files:PendingDocument[];onChange:(files:PendingDocument[])=>void;disabled:boolean}){
 const input=useRef<HTMLInputElement>(null),addButton=useRef<HTMLButtonElement>(null),previewTrigger=useRef<HTMLButtonElement|null>(null),hint=useId(),heading=useId();
 const [error,setError]=useState(''),[preview,setPreview]=useState<PendingDocument|null>(null);
 function select(e:ChangeEvent<HTMLInputElement>){
  const selected=Array.from(e.target.files??[]);e.target.value='';if(disabled||!selected.length)return;
  const next=[...files],errors:string[]=[];
  for(const file of selected){
   const invalid=documentFileError(file);
   if(invalid){errors.push(file.name+': '+invalid);continue;}
   if(next.some(item=>item.file.name===file.name&&item.file.size===file.size&&item.file.lastModified===file.lastModified))continue;
   if(next.length>=reservationDocumentsCount){errors.push('Use até 20 documentos por cadastro. Você pode adicionar mais depois em Ver reserva.');break;}
   if(next.reduce((total,item)=>total+item.file.size,0)+file.size>reservationDocumentsLimit){errors.push(file.name+': o total deve ser de até 20 MB. Você pode adicionar mais depois em Ver reserva.');continue;}
   next.push({id:crypto.randomUUID(),file});
  }
  onChange(next);setError(errors.join(' '));
 }
 return <section className="reservation-draft-documents" aria-labelledby={heading}>
  <div className="reservation-documents-heading"><h3 id={heading}>Documentos <span className="muted">(opcional)</span></h3><Button ref={addButton} type="button" variant="outline" disabled={disabled} aria-describedby={hint} onClick={()=>input.current?.click()}><Paperclip aria-hidden="true"/>Adicionar documento</Button></div>
  <input hidden ref={input} type="file" multiple accept={documentUploadTypes.join(',')} onChange={select}/>
  <p id={hint} className="muted">PDF, JPG, PNG, WebP ou GIF · até 10 MB por arquivo, 20 MB no total.</p>
  {files.length>0&&<ul className="reservation-document-pills" aria-label="Documentos para anexar">{files.map(item=><li className="reservation-document-pill" key={item.id}><button type="button" disabled={disabled} className="reservation-document-open" aria-label={'Abrir '+item.file.name} onClick={e=>{previewTrigger.current=e.currentTarget;setPreview(item);}}><FileText aria-hidden="true"/><span>{item.file.name}</span></button><Button type="button" variant="ghost" size="icon" disabled={disabled} aria-label={'Remover '+item.file.name} onClick={()=>{onChange(files.filter(file=>file.id!==item.id));setError('');addButton.current?.focus({preventScroll:true});}}><X aria-hidden="true"/></Button></li>)}</ul>}
  {error&&<p role="alert" className="form-error">{error}</p>}
  {files.length>0&&<p className="muted">Serão anexados ao salvar. Depois, acesse em Ver reserva → Documentos.</p>}
  {preview&&<DocumentViewer key={preview.id} document={{id:preview.id,filename:preview.file.name,label:preview.file.name,mime:preview.file.type,bytes:preview.file.size}} localFile={preview.file} onClose={()=>setPreview(null)} returnFocus={previewTrigger}/>}
 </section>;
}
