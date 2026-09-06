import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
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
          <Link to="/docs"><Button variant="ghost">Docs</Button></Link>
          <Link to="/sign?mode=login"><Button variant="outline">Sign In</Button></Link>
          <Link to="/sign?mode=register"><Button>Sign Up</Button></Link>
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
            <Link to="/sign?mode=register"><Button size="lg" className="text-lg px-8">Get Started</Button></Link>
            <Link to="/docs"><Button size="lg" variant="outline" className="text-lg px-8">Read Docs</Button></Link>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
