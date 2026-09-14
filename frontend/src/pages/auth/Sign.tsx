import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { motion } from 'framer-motion';
import { Button } from '../../components/ui/Button';
import { Card, CardContent } from '../../components/ui/Card';
import { GraduationCap, Shield, Briefcase, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import { api } from '../../lib/api';
import Logo from '../../components/common/Logo';

export default function Sign() {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<'Student' | 'Admin' | 'Faculty' | 'Staff'>('Student');
  const [loading, setLoading] = useState(false);
  const { login } = useAuthStore();

  const handleContinue = async () => {
    setLoading(true);
    try {
      if (selectedRole === 'Student') {
        let token = 'unicore-jwt-abhinav';
        try {
          const res = await api('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email: 'abhinav@unicore.edu', password: 'any' }),
          });
          if (res?.token) token = res.token;
        } catch {
          // fallback to offline dev token
        }

        login(
          {
            id: '1024030440',
            email: 'abhinav@unicore.edu',
            role: 'student',
            name: 'Abhinav Kumar',
            department: 'Computer Science and Engineering',
            year: 3,
            cgpa: 8.13,
            hostel: 'Tagore Hall - 301',
          } as any,
          token
        );
        navigate('/student');
        return;
      }

      if (selectedRole === 'Admin') {
        login(
          {
            id: 'admin-1',
            email: 'admin@unicore.edu',
            role: 'admin',
            name: 'System Administrator',
          } as any,
          'unicore-admin-token'
        );
        navigate('/admin');
        return;
      }

      if (selectedRole === 'Faculty') {
        login(
          {
            id: 'fac-1',
            email: 'faculty1@unicore.edu',
            role: 'faculty',
            name: 'Dr. Rajesh Kumar',
            department: 'Computer Science and Engineering',
          } as any,
          'unicore-faculty-token'
        );
        navigate('/faculty');
        return;
      }

      if (selectedRole === 'Staff') {
        login(
          {
            id: 'staff-1',
            email: 'staff1@unicore.edu',
            role: 'staff',
            name: 'Ramesh Yadav',
            department: 'Hostel Administration',
          } as any,
          'unicore-staff-token'
        );
        navigate('/staff');
        return;
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-color)] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Radiant theme backdrop accents */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 dark:bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-xl w-full relative z-10"
      >
        <Card className="overflow-hidden shadow-2xl border border-[var(--border-color)] bg-[var(--surface-color)]/95 backdrop-blur-xl">
          <div className="p-8 pb-6 border-b border-[var(--border-color)] text-center flex flex-col items-center">
            <Link to="/" className="mb-4 inline-block hover:opacity-90 transition-opacity">
              <Logo size="lg" />
            </Link>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-semibold mb-2">
              <Sparkles size={14} /> Campus Operating Platform
            </div>
            <h1 className="text-2xl font-extrabold text-[var(--text-color)] tracking-tight">Sign In to UniCore</h1>
            <p className="text-[var(--text-muted)] text-sm mt-1">Select your account profile to continue instantly</p>
          </div>

          <CardContent className="p-8 space-y-6">
            {/* Role Selection Tabs */}
            <div className="grid grid-cols-4 gap-1.5 p-1.5 bg-[var(--bg-color)] rounded-xl border border-[var(--border-color)]">
              {(['Student', 'Faculty', 'Admin', 'Staff'] as const).map((role) => (
                <button
                  key={role}
                  onClick={() => setSelectedRole(role)}
                  className={`py-2 px-3 rounded-lg text-xs md:text-sm font-semibold transition-all ${
                    selectedRole === role
                      ? 'bg-emerald-600 dark:bg-emerald-500 text-white shadow-md shadow-emerald-600/20'
                      : 'text-[var(--text-muted)] hover:text-[var(--text-color)] hover:bg-[var(--surface-color)]'
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>

            {/* Profile Identity Card Preview */}
            {selectedRole === 'Student' && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-5 rounded-2xl bg-emerald-500/5 dark:bg-emerald-950/20 border border-emerald-500/30 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-emerald-500/20">
                      AK
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-lg text-[var(--text-color)]">Abhinav Kumar</h3>
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
                          <CheckCircle2 size={10} /> Active Student
                        </span>
                      </div>
                      <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">abhinav@unicore.edu</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] font-semibold">CGPA</div>
                    <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">8.13</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs border-t border-[var(--border-color)] pt-3">
                  <div className="bg-[var(--bg-color)] p-2.5 rounded-lg border border-[var(--border-color)]">
                    <span className="text-[var(--text-muted)] block text-[10px]">Roll Number</span>
                    <span className="font-bold text-[var(--text-color)]">1024030440</span>
                  </div>
                  <div className="bg-[var(--bg-color)] p-2.5 rounded-lg border border-[var(--border-color)]">
                    <span className="text-[var(--text-muted)] block text-[10px]">Program</span>
                    <span className="font-bold text-[var(--text-color)]">B.Tech Computer Science</span>
                  </div>
                  <div className="bg-[var(--bg-color)] p-2.5 rounded-lg border border-[var(--border-color)]">
                    <span className="text-[var(--text-muted)] block text-[10px]">Department</span>
                    <span className="font-bold text-[var(--text-color)]">CSE (Year 3)</span>
                  </div>
                  <div className="bg-[var(--bg-color)] p-2.5 rounded-lg border border-[var(--border-color)]">
                    <span className="text-[var(--text-muted)] block text-[10px]">Hostel</span>
                    <span className="font-bold text-[var(--text-color)]">Tagore Hall - 301</span>
                  </div>
                </div>
              </motion.div>
            )}

            {selectedRole === 'Admin' && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-5 rounded-2xl bg-amber-500/5 dark:bg-amber-950/20 border border-amber-500/30 space-y-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-amber-500/20">
                    <Shield size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-[var(--text-color)]">System Administrator</h3>
                    <p className="text-xs text-amber-600 dark:text-amber-400 font-medium">admin@unicore.edu</p>
                  </div>
                </div>
                <p className="text-xs text-[var(--text-muted)]">Full access to manage departments, users, courses, and platform metrics.</p>
              </motion.div>
            )}

            {selectedRole === 'Faculty' && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-5 rounded-2xl bg-blue-500/5 dark:bg-blue-950/20 border border-blue-500/30 space-y-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-blue-500/20">
                    <GraduationCap size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-[var(--text-color)]">Dr. Rajesh Kumar</h3>
                    <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">Professor - Computer Science & Engineering</p>
                  </div>
                </div>
                <p className="text-xs text-[var(--text-muted)]">Manage course offerings, student grades, attendance, and departmental analytics.</p>
              </motion.div>
            )}

            {selectedRole === 'Staff' && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-5 rounded-2xl bg-purple-500/5 dark:bg-purple-950/20 border border-purple-500/30 space-y-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-purple-500/20">
                    <Briefcase size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-[var(--text-color)]">Ramesh Yadav</h3>
                    <p className="text-xs text-purple-600 dark:text-purple-400 font-medium">staff1@unicore.edu</p>
                  </div>
                </div>
                <p className="text-xs text-[var(--text-muted)]">Oversee hostel room bed allocations, maintenance complaints, and library assets.</p>
              </motion.div>
            )}

            {/* Single Action Button */}
            <Button 
              className="w-full py-6 text-lg font-bold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-xl shadow-emerald-600/25 border-0 flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-[1.01]"
              onClick={handleContinue}
              disabled={loading}
            >
              {loading ? 'Authenticating...' : (
                <>
                  Continue as {selectedRole === 'Student' ? 'Abhinav (Student)' : selectedRole}
                  <ArrowRight size={20} />
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
