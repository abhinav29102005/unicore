import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Home, GraduationCap, User, Library, Activity, MapPin } from 'lucide-react';
import { api } from '../../lib/api';
import { useAuthStore } from '../../store/authStore';

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
    id?: number;
    course_code?: string;
    course_name: string;
    grade: string;
    total_marks?: number;
  }[];
  library: {
    id?: number;
    book_title: string;
    due_date: string;
  }[];
}

const defaultStudentData: DashboardData = {
  student: {
    name: 'Abhinav Kumar',
    roll: '1024030440',
    department: 'Computer Science & Engineering',
    year: 3,
    gpa: 8.13,
  },
  hostel: {
    block: 'Tagore Hall',
    room: '301',
    status: 'active',
  },
  enrollments: [
    { course_name: 'Distributed Systems', grade: 'B+', total_marks: 73 },
    { course_name: 'Cloud Computing', grade: 'A+', total_marks: 94 },
    { course_name: 'Database Management Systems', grade: 'B+', total_marks: 71 },
    { course_name: 'Machine Learning', grade: 'B', total_marks: 62 },
  ],
  library: [
    { book_title: 'Designing Data-Intensive Applications', due_date: '2026-10-15' },
  ],
};

export default function StudentDashboard() {
  const { user } = useAuthStore();
  const [data, setData] = useState<DashboardData>(defaultStudentData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const rollNo = user?.rollNo || '1024030440';

  useEffect(() => {
    let mounted = true;
    api(`/student/${rollNo}/dashboard`)
      .then((json) => {
        if (mounted) {
          setData(json);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.warn('Live API fetch error, using cached seed data:', err.message);
        if (mounted) {
          setData(defaultStudentData);
          setLoading(false);
        }
      });
    return () => {
      mounted = false;
    };
  }, [rollNo]);

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
              {data.student.gpa ? Number(data.student.gpa).toFixed(2) : "8.13"}
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
          {data.library && data.library.length > 0 ? (
            <ul className="space-y-4">
              {data.library.map((book, i) => (
                <li key={i} className="flex justify-between items-center bg-[var(--bg-color)] p-4 rounded-xl border border-[var(--border-color)]">
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
            {data.enrollments && data.enrollments.map((course, i) => (
              <div key={i} className="bg-[var(--bg-color)] p-5 rounded-xl border border-[var(--border-color)] flex justify-between items-center transition-all hover:border-indigo-500/50">
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
