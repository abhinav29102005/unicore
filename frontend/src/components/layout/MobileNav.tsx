import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { Home, Users, BookOpen, Settings, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function MobileNav({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { user } = useAuthStore();
  const role = user?.role?.toLowerCase() || 'student';

  const navItems = [
    { label: 'Dashboard', path: `/${role}`, icon: Home },
    { label: 'Profile', path: `/profile`, icon: Users },
    { label: 'Courses', path: `/${role}/courses`, icon: BookOpen },
    { label: 'Settings', path: `/settings`, icon: Settings },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black z-40 lg:hidden"
          />
          <motion.aside
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', bounce: 0, duration: 0.3 }}
            className="fixed inset-y-0 left-0 w-64 bg-[var(--surface-color)] shadow-xl z-50 lg:hidden flex flex-col"
          >
            <div className="p-4 flex items-center justify-between border-b border-[var(--border-color)]">
              <h2 className="text-xl font-bold text-[var(--color-primary)]">UNICORE</h2>
              <button onClick={onClose} className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-slate-700">
                <X size={20} />
              </button>
            </div>
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={onClose}
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
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
