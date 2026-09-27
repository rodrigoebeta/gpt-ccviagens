export async function preparePhoto(file:File){
 if(!['image/jpeg','image/png','image/webp'].includes(file.type)||file.size>20000000)throw Error('Escolha uma foto JPG, PNG ou WebP de até 20 MB.');
 const bitmap=await createImageBitmap(file);
 try{const scale=Math.min(1,1600/Math.max(bitmap.width,bitmap.height)),canvas=document.createElement('canvas');canvas.width=Math.max(1,Math.round(bitmap.width*scale));canvas.height=Math.max(1,Math.round(bitmap.height*scale));const context=canvas.getContext('2d');if(!context)throw Error('Não foi possível preparar a foto.');context.fillStyle='#f3f3f1';context.fillRect(0,0,canvas.width,canvas.height);context.drawImage(bitmap,0,0,canvas.width,canvas.height);const data=canvas.toDataURL('image/jpeg',.85);if(data.length>2600000)throw Error('Esta foto ainda está muito grande. Escolha uma menor.');return data;}finally{bitmap.close();}
}
