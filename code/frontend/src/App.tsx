import React,{useEffect} from 'react';
import {api} from './lib/api';
import {useAuthStore} from './store/authStore';
import { RouterProvider } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { queryClient } from './lib/queryClient';
import { router } from './router';

function App() {
  const ready=useAuthStore(s=>s.ready);
  useEffect(()=>{api('/auth/me').then(data=>useAuthStore.getState().login(data.user,data.sampleData)).catch(()=>useAuthStore.getState().initialized());},[]);
  if(!ready)return <div className="p-8">Connecting to UniCore…</div>;
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <Toaster position="top-right" />
    </QueryClientProvider>
  );
}

export default App;
