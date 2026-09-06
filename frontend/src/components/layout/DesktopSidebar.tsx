import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { Home, Users, BookOpen, Settings } from 'lucide-react';

export default function DesktopSidebar() {
  const { user } = useAuthStore();
  const role = user?.role?.toLowerCase() || 'student';

  const navItems = [
    { label: 'Dashboard', path: `/${role}`, icon: Home },
    { label: 'Profile', path: `/profile", icon: Users },
    { label: 'Courses', path: `/${role}/courses", icon: BookOpen },
    { label: 'Settings', path: `/settings", icon: Settings },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 border-r border-[var(--border-color)] bg-[var(--surface-color)] h-[calc(100vh-4rem)]">
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2 rounded-md transition-colors ${
                  isActive
                    ? 'bg-[var(--color-primary)] text-white'
                    : 'text-[var(--text-color)] hover:bg-gray-100 dark:hover:bg-slate-700'
                }`
              }
            >
              <Icon size={20} />
              <span className="font-medium">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}
