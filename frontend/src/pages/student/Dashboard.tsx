import React from 'react';
import { motion } from 'framer-motion';

export default function StudentDashboard() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <h1 className="text-2xl font-bold">Student Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-[var(--surface-color)] p-6 rounded-xl border border-[var(--border-color)] shadow-sm">
            <h3 className="font-medium text-[var(--text-muted)] mb-2">Metric ${i}</h3>
            <p className="text-3xl font-bold">{Math.floor(Math.random() * 1000)}</p>
          </div>
        ))}
      </div>
      <div className="bg-[var(--surface-color)] p-6 rounded-xl border border-[var(--border-color)] shadow-sm min-h-[300px] flex items-center justify-center">
        <p className="text-[var(--text-muted)]">Charts and data tables will go here.</p>
      </div>
    </motion.div>
  );
}
