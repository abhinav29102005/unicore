import React, { useState } from 'react';
import {useAuthStore} from '../../store/authStore';
import { Outlet } from 'react-router-dom';
import TopBar from './TopBar';
import DesktopSidebar from './DesktopSidebar';
import MobileNav from './MobileNav';

export default function ShellLayout() {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const samples=useAuthStore(s=>s.sampleData);
  return (
    <div className="min-h-screen bg-[var(--bg-color)] flex flex-col">
      {samples&&<p className="p-2 text-center bg-amber-900 text-amber-100 text-sm">Sample campus dataset · values come from the server database.</p>}
      <TopBar toggleMobileNav={() => setIsMobileNavOpen(true)} />
      <div className="flex flex-1 overflow-hidden">
        <DesktopSidebar />
        <MobileNav isOpen={isMobileNavOpen} onClose={() => setIsMobileNavOpen(false)} />
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
