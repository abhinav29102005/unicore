import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Book, Code, Shield, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';

export default function Docs() {
  return (
    <div className="min-h-screen bg-[var(--bg-color)] flex flex-col">
      <header className="h-16 border-b border-[var(--border-color)] bg-[var(--surface-color)] flex items-center px-6 lg:px-12 sticky top-0 z-10">
        <Link to="/" className="flex items-center gap-2 text-[var(--text-muted)] hover:text-[var(--color-primary)] transition-colors">
          <ArrowLeft size={20} />
          <span className="font-medium">Back to Home</span>
        </Link>
        <div className="ml-auto text-xl font-bold text-[var(--color-primary)]">UNICORE Docs</div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto w-full p-6 lg:p-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-12"
        >
          <div className="text-center space-y-4">
            <h1 className="text-4xl lg:text-5xl font-extrabold text-[var(--text-color)]">Documentation</h1>
            <p className="text-xl text-[var(--text-muted)] max-w-2xl mx-auto">
              Learn how to integrate, deploy, and manage the UNICORE system for your campus.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="hover:border-[var(--color-primary)] transition-colors cursor-pointer">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center mb-4">
                  <Book size={24} />
                </div>
                <CardTitle>Getting Started</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-[var(--text-muted)]">A comprehensive guide on deploying the UNICORE dashboard and setting up your initial databases.</p>
              </CardContent>
            </Card>

            <Card className="hover:border-[var(--color-primary)] transition-colors cursor-pointer">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-green-100 dark:bg-green-900/30 text-[var(--color-primary)] flex items-center justify-center mb-4">
                  <Code size={24} />
                </div>
                <CardTitle>API Reference</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-[var(--text-muted)]">Explore our REST and GraphQL APIs for deep integrations with your existing campus tools.</p>
              </CardContent>
            </Card>

            <Card className="hover:border-[var(--color-primary)] transition-colors cursor-pointer">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-orange-100 dark:bg-orange-900/30 text-orange-600 flex items-center justify-center mb-4">
                  <Shield size={24} />
                </div>
                <CardTitle>Authentication</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-[var(--text-muted)]">Learn about Role-Based Access Control (RBAC) for Admins, Faculty, Students, and Staff.</p>
              </CardContent>
            </Card>

            <Card className="hover:border-[var(--color-primary)] transition-colors cursor-pointer">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-purple-100 dark:bg-purple-900/30 text-purple-600 flex items-center justify-center mb-4">
                  <Zap size={24} />
                </div>
                <CardTitle>Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-[var(--text-muted)]">Best practices for keeping UNICORE blazing fast, including caching strategies and CDN deployment.</p>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
