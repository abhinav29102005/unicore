import { create } from 'zustand';
export type UserRole='Admin'|'Faculty'|'Student'|'Staff';
export interface UserProfile {id:string;name:string;role:UserRole;email:string;rollNo?:string;employeeNo?:string;avatar?:string}
interface AuthState {user:UserProfile|null;isAuthenticated:boolean;ready:boolean;sampleData:boolean;login:(user:UserProfile,samples?:boolean)=>void;logout:()=>void;initialized:()=>void}
// The server's HttpOnly session is the credential. Nothing in localStorage grants access.
localStorage.removeItem('unicore-auth-storage');
export const useAuthStore=create<AuthState>(set=>({user:null,isAuthenticated:false,ready:false,sampleData:false,
 login:(user,sampleData=false)=>set({user,isAuthenticated:true,ready:true,sampleData}),logout:()=>set({user:null,isAuthenticated:false,ready:true,sampleData:false}),initialized:()=>set({ready:true})}));
