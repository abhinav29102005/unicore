import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import TopBar from './TopBar';
import DesktopSidebar from './DesktopSidebar';
import MobileNav from './MobileNav';

export default function ShellLayout() {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[var(--bg-color)] flex flex-col">
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
