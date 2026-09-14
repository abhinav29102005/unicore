import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Home, GraduationCap, User, Library, Activity, MapPin } from 'lucide-react';

interface DashboardData {
  student: {
    name: string;
    roll: string;
    department: string;
    year: number;
    gpa: number;
  };
  hostel: {
    block: string;
    room: string;
    status: string;
  } | null;
  enrollments: {
    id: number;
    course_name: string;
    grade: string;
  }[];
  library: {
    id: number;
    book_title: string;
    due_date: string;
  }[];
}

export default function StudentDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('http://localhost:3000/api/student/1024030440/dashboard')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load data');
        return res.json();
      })
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-6 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl">
        Failed to load dashboard data: {error}
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* Header Profile Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-900 to-purple-900 p-8 shadow-2xl border border-white/10">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-extrabold text-white tracking-tight mb-2">
              Welcome back, {data.student.name.split(' ')[0]}
            </h1>
            <p className="text-indigo-200 flex items-center gap-2">
              <User size={18} /> {data.student.roll} | {data.student.department}, Year {data.student.year}
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm text-indigo-300 uppercase tracking-widest font-semibold mb-1">Current CGPA</div>
            <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-teal-200 to-emerald-400">
              {data.student.gpa ? Number(data.student.gpa).toFixed(2) : "N/A"}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Hostel Allocation */}
        <motion.div 
          whileHover={{ y: -5 }}
          className="bg-[var(--surface-color)] p-6 rounded-2xl border border-[var(--border-color)] shadow-xl relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Home size={100} />
          </div>
          <div className="flex items-center gap-3 mb-4 text-emerald-400">
            <MapPin size={24} />
            <h3 className="text-lg font-semibold text-[var(--text-color)]">Hostel Status</h3>
          </div>
          {data.hostel ? (
            <div className="space-y-2">
              <p className="text-3xl font-bold text-[var(--text-color)]">{data.hostel.block} - {data.hostel.room}</p>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-sm font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                {data.hostel.status}
              </div>
            </div>
          ) : (
            <p className="text-[var(--text-muted)]">No hostel allotted.</p>
          )}
        </motion.div>

        {/* Library Dues */}
        <motion.div 
          whileHover={{ y: -5 }}
          className="bg-[var(--surface-color)] p-6 rounded-2xl border border-[var(--border-color)] shadow-xl relative overflow-hidden group md:col-span-2"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Library size={100} />
          </div>
          <div className="flex items-center gap-3 mb-4 text-purple-400">
            <BookOpen size={24} />
            <h3 className="text-lg font-semibold text-[var(--text-color)]">Library Assets</h3>
          </div>
          {data.library.length > 0 ? (
            <ul className="space-y-4">
              {data.library.map((book) => (
                <li key={book.id} className="flex justify-between items-center bg-[var(--bg-color)] p-4 rounded-xl border border-[var(--border-color)]">
                  <div className="font-medium text-[var(--text-color)]">{book.book_title}</div>
                  <div className="text-sm flex flex-col items-end">
                    <span className="text-[var(--text-muted)]">Due Date</span>
                    <span className="text-amber-400 font-semibold">{book.due_date}</span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-[var(--text-muted)]">No books currently checked out.</p>
          )}
        </motion.div>

        {/* Academic Enrollments */}
        <motion.div 
          whileHover={{ y: -5 }}
          className="bg-[var(--surface-color)] p-6 rounded-2xl border border-[var(--border-color)] shadow-xl relative overflow-hidden group md:col-span-3"
        >
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <GraduationCap size={150} />
          </div>
          <div className="flex items-center gap-3 mb-6 text-indigo-400">
            <Activity size={24} />
            <h3 className="text-xl font-bold text-[var(--text-color)]">Recent Enrollments</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.enrollments.map((course) => (
              <div key={course.id} className="bg-[var(--bg-color)] p-5 rounded-xl border border-[var(--border-color)] flex justify-between items-center transition-all hover:border-indigo-500/50">
                <span className="font-semibold text-[var(--text-color)]">{course.course_name}</span>
                <span className="px-3 py-1 rounded-lg bg-indigo-500/20 text-indigo-300 font-bold text-lg">
                  {course.grade}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

      </div>
    </motion.div>
  );
}
