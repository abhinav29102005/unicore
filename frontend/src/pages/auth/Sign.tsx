import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../../components/ui/Button';
import { Card, CardContent } from '../../components/ui/Card';

export default function Sign() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialMode = searchParams.get('mode') === 'register' ? 'register' : 'login';
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const { login } = useAuthStore();

  useEffect(() => {
    setMode(searchParams.get('mode') === 'register' ? 'register' : 'login');
  }, [searchParams]);

  const handleLogin = (role: 'Admin' | 'Faculty' | 'Student' | 'Staff') => {
    login({ id: '1', name: `Dummy ${role}`, role, email: `${role.toLowerCase()}@unicore.edu` }, 'dummy-token');
    navigate(`/${role.toLowerCase()}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-color)] p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full"
      >
        <Card className="overflow-hidden shadow-2xl">
          <div className="flex border-b border-[var(--border-color)] bg-[var(--surface-color)]">
            <button 
              className={`flex-1 py-4 font-medium transition-colors ${mode === 'login' ? 'text-[var(--color-primary)] border-b-2 border-[var(--color-primary)]' : 'text-[var(--text-muted)] hover:text-[var(--text-color)]'}`}
              onClick={() => setMode('login')}
            >
              Sign In
            </button>
            <button 
              className={`flex-1 py-4 font-medium transition-colors ${mode === 'register' ? 'text-[var(--color-primary)] border-b-2 border-[var(--color-primary)]' : 'text-[var(--text-muted)] hover:text-[var(--text-color)]'}`}
              onClick={() => setMode('register')}
            >
              Sign Up
            </button>
          </div>
          
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-[var(--color-primary)] mb-2">UNICORE</h1>
              <p className="text-[var(--text-muted)]">{mode === 'login' ? 'Welcome back!' : 'Create your account'}</p>
            </div>
            
            <AnimatePresence mode="wait">
              <motion.div
                key={mode}
                initial={{ opacity: 0, x: mode === 'login' ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: mode === 'login' ? 20 : -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                {mode === 'register' && (
                  <p className="text-sm text-center text-orange-500 mb-4">*This is a prototype. Simply click a role below to simulate account creation.</p>
                )}
                <Button className="w-full py-6 text-lg" onClick={() => handleLogin('Admin')}>Continue as Admin</Button>
                <Button variant="outline" className="w-full py-6 text-lg text-blue-500 border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20" onClick={() => handleLogin('Faculty')}>Continue as Faculty</Button>
                <Button variant="outline" className="w-full py-6 text-lg text-orange-500 border-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20" onClick={() => handleLogin('Student')}>Continue as Student</Button>
                <Button variant="outline" className="w-full py-6 text-lg text-purple-500 border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/20" onClick={() => handleLogin('Staff')}>Continue as Staff</Button>
              </motion.div>
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
