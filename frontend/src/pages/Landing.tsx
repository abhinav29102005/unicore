import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/Button';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[var(--bg-color)] flex flex-col">
      {/* Navbar */}
      <header className="h-20 border-b border-[var(--border-color)] bg-[var(--surface-color)] flex items-center justify-between px-6 lg:px-12">
        <div className="text-2xl font-extrabold text-[var(--color-primary)]">UNICORE</div>
        <div className="flex gap-4">
          <Button variant="ghost" onClick={() => navigate('/docs')}>Docs</Button>
          <Button variant="outline" onClick={() => navigate('/sign?mode=login')}>Sign In</Button>
          <Button onClick={() => navigate('/sign?mode=register')}>Sign Up</Button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex items-center justify-center p-6 text-center">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl"
        >
          <h1 className="text-5xl lg:text-7xl font-bold mb-6 text-[var(--text-color)]">
            The Future of <span className="text-[var(--color-primary)]">Campus Management</span>
          </h1>
          <p className="text-xl text-[var(--text-muted)] mb-10">
            A blazing fast, ultra-premium platform to manage everything from student enrollments to faculty administration.
          </p>
          <div className="flex items-center justify-center gap-6">
            <Button size="lg" onClick={() => navigate('/sign?mode=register')} className="text-lg px-8">Get Started</Button>
            <Button size="lg" variant="outline" onClick={() => navigate('/docs')} className="text-lg px-8">Read Docs</Button>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
