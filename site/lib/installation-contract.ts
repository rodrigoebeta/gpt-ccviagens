import { z } from 'zod';
export const releaseInput = z.object({
  version: z.string().regex(/^\d+\.\d+\.\d+(?:-preview\.\d+)?$/),
  repository: z.string().url().startsWith('https://').max(500),
  notes: z.string().max(2000),
}).strict();
export type CentralRelease = z.infer<typeof releaseInput>;
export const telemetryInput = z.object({
  installationId: z.string().uuid(),
  version: releaseInput.shape.version,
  termsVersion: z.string().regex(/^\d{4}-\d{2}-\d{2}\.\d+$/),
  acceptedAt: z.string().datetime(),
  hosting: z.enum(['chatgpt.site', 'external']),
  domain: z.string().max(253).optional(),
}).strict().superRefine((value, context) => {
  if (value.hosting === 'chatgpt.site' && value.domain !== undefined)
    context.addIssue({code:'custom',message:'O domínio interno não deve ser enviado.'});
  if (value.hosting === 'external' && (!value.domain || !pukoPublicHostname(value.domain) || pukoSitesHostname(value.domain)))
    context.addIssue({code:'custom',message:'Domínio externo inválido.'});
});
export function pukoSitesHostname(host: string) {
  return host === 'chatgpt.site' || host.endsWith('.chatgpt.site');
}
export function pukoPublicHostname(host: string) {
  return host.length <= 253 && host === host.toLowerCase() && !host.endsWith('.') &&
    !host.endsWith('.localhost') && !host.endsWith('.local') && !host.endsWith('.test') && !host.endsWith('.invalid') && !host.endsWith('.example') &&
    /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/.test(host);
}
export function pukoNewerVersion(next: string, current: string) {
  const parse=(v:string)=>{const m=/^(\d+)\.(\d+)\.(\d+)(?:-preview\.(\d+))?$/.exec(v);return m?[Number(m[1]),Number(m[2]),Number(m[3]),m[4]===undefined?Infinity:Number(m[4])]:null;};
  const a=parse(next),b=parse(current);if(!a||!b)return false;
  for(let i=0;i<a.length;i++){if(a[i]!==b[i])return a[i]>b[i];}return false;
}
export function pukoUpdatePrompt(origin: string, repository: string) {
  return `Atualize minha Central de Viagens em ${origin}. Repositório oficial: ${repository}. Preserve meus dados e personalizações.`;
}
