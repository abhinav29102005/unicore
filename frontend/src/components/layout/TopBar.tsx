import React from 'react';
import { useAuthStore } from '../../store/authStore';
import { Menu, Moon, Sun, User as UserIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function TopBar({ toggleMobileNav }: { toggleMobileNav: () => void }) {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [isDark, setIsDark] = React.useState(document.body.classList.contains('dark'));

  const toggleTheme = () => {
    document.body.classList.toggle('dark');
    setIsDark(!isDark);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="h-16 flex items-center justify-between px-4 lg:px-8 border-b border-[var(--border-color)] bg-[var(--surface-color)]">
      <div className="flex items-center gap-4">
        <button onClick={toggleMobileNav} className="lg:hidden p-2 rounded-md hover:bg-gray-200 dark:hover:bg-slate-700">
          <Menu size={24} />
        </button>
        <h1 className="text-xl font-bold text-[var(--color-primary)] hidden lg:block">UNICORE</h1>
      </div>
      <div className="flex items-center gap-4">
        <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-slate-700">
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        {user && (
          <div className="flex items-center gap-3">
            <div className="flex flex-col text-right hidden sm:flex">
              <span className="text-sm font-medium">{user.name}</span>
              <span className="text-xs text-[var(--text-muted)]">{user.role}</span>
            </div>
            <div className="h-8 w-8 rounded-full bg-[var(--color-secondary)] flex items-center justify-center text-white font-bold">
              {user.avatar ? <img src={user.avatar} className="rounded-full" alt="avatar" /> : <UserIcon size={16} />}
            </div>
            <button onClick={handleLogout} className="text-sm text-red-500 hover:underline ml-2">Logout</button>
          </div>
        )}
      </div>
    </header>
  );
}
