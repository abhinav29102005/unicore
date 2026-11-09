import { useAuthStore } from '../store/authStore';
export const BASE_URL=import.meta.env.VITE_API_URL || '/unicore/api';
let token:string|null=null;
export async function csrf(){const response=await fetch(BASE_URL+'/auth/csrf',{credentials:'same-origin',cache:'no-store'});if(!response.ok)throw new Error('Cannot connect to the server');token=(await response.json()).token;return token;}
export async function api(endpoint:string,options:RequestInit={}) {
 const headers=new Headers(options.headers);const method=options.method||'GET';
 if(!['GET','HEAD'].includes(method)){if(!token)await csrf();headers.set('X-CSRF-TOKEN',token!);headers.set('Content-Type','application/json');}
 const response=await fetch(BASE_URL+endpoint,{...options,headers,credentials:'same-origin',cache:'no-store'});
 const data=await response.json().catch(()=>({}));
 if(!response.ok){if(response.status===401&&!endpoint.endsWith('/login'))useAuthStore.getState().logout();throw new Error(data.message||data.error||(response.status===429?'Too many attempts. Try again later.':'Request failed'));}
 if(endpoint==='/auth/login'||endpoint==='/auth/logout'){token=null;await csrf();}
 return data;
}
export async function signOut(){try{await api('/auth/logout',{method:'POST',body:'{}'});}finally{useAuthStore.getState().logout();}}
