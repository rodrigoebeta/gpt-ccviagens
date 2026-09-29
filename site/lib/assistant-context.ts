import {AsyncLocalStorage} from 'node:async_hooks';
import type {ChatGPTUser} from '@/app/chatgpt-auth';

// Only the authenticated assistant gateway can establish this request context.
// It cannot be selected through HTTP identity headers, cookies or body fields.
const context=new AsyncLocalStorage<ChatGPTUser>();
export const assistantIdentity=()=>context.getStore();
export const withAssistantIdentity=<T>(user:ChatGPTUser,run:()=>T):T=>context.run(user,run);
