export const documentUploadTypes=['application/pdf','image/png','image/jpeg','image/gif','image/webp'] as const;
export const documentUploadLimit=10_000_000;
export const reservationDocumentsLimit=20_000_000;
export const reservationDocumentsCount=20;
export function documentFileError(file:{type:string;size:number;name:string}){
 if(!documentUploadTypes.some(type=>type===file.type))return 'Escolha um PDF ou uma imagem JPG, PNG, WebP ou GIF.';
 if(!file.size||file.size>documentUploadLimit)return 'Escolha um arquivo não vazio de até 10 MB.';
 if(file.name.length>300)return 'Encurte o nome do arquivo para até 300 caracteres.';
 return '';
}
export function readDocumentBase64(file:File){
 return new Promise<string>((resolve,reject)=>{const reader=new FileReader();reader.onerror=()=>reject(Error('Não foi possível ler o arquivo. Selecione-o novamente.'));reader.onload=()=>resolve(String(reader.result).split(',')[1]);reader.readAsDataURL(file);});
}
