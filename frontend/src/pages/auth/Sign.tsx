import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Logo from '../../components/common/Logo';
import { useAuthStore } from '../../store/authStore';
import { motion } from 'framer-motion';
import { Button } from '../../components/ui/Button';
import { Card, CardContent } from '../../components/ui/Card';
import { User, GraduationCap, Shield, Briefcase, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import { api } from '../../lib/api';

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
        } catch (e) {
          console.warn('Backend login fallback to local credentials:', e);
        }

        login(
          {
            id: '7b669c2a40a0403f785eccd291f51b6a',
            name: 'Abhinav Kumar',
            role: 'Student',
            email: 'abhinav@unicore.edu',
            rollNo: '1024030440',
          },
          token
        );
        navigate('/student');
        return;
      }

      if (selectedRole === 'Admin') {
        let token = 'unicore-jwt-admin';
        try {
          const res = await api('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email: 'admin@unicore.edu', password: 'any' }),
          });
          if (res?.token) token = res.token;
        } catch (e) {
          console.warn('Backend login fallback:', e);
        }
        login({ id: '880455bf4b7a8ce0a2841a3c0d15bd9a', name: 'System Admin', role: 'Admin', email: 'admin@unicore.edu' }, token);
        navigate('/admin');
        return;
      }

      if (selectedRole === 'Faculty') {
        let token = 'unicore-jwt-faculty';
        try {
          const res = await api('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email: 'dr.kumar@unicore.edu', password: 'any' }),
          });
          if (res?.token) token = res.token;
        } catch (e) {
          console.warn('Backend login fallback:', e);
        }
        login({ id: '165695f67301606026a1b3c9db7633db', name: 'Dr. Rajesh Kumar', role: 'Faculty', email: 'dr.kumar@unicore.edu' }, token);
        navigate('/faculty');
        return;
      }

      login({ id: 'staff1', name: 'Ramesh Yadav', role: 'Staff', email: 'staff1@unicore.edu' }, 'unicore-jwt-staff');
      navigate('/staff');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-color)] p-4 relative overflow-hidden">
      {/* Dynamic Background Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-xl w-full"
      >
        <Card className="overflow-hidden shadow-2xl border border-[var(--border-color)] bg-[var(--surface-color)]/80 backdrop-blur-xl">
          <div className="p-8 pb-6 border-b border-[var(--border-color)] text-center flex flex-col items-center">
            <Link to="/" className="mb-4 inline-block hover:opacity-90 transition-opacity">
              <Logo size="lg" />
            </Link>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-semibold mb-2">
              <Sparkles size={14} /> UniCore Campus Portal
            </div>
            <h1 className="text-2xl font-extrabold text-[var(--text-color)] tracking-tight">Sign In to UniCore</h1>
            <p className="text-[var(--text-muted)] text-sm mt-1">Select your account profile to continue instantly</p>
          </div>

          <CardContent className="p-8 space-y-6">
            {/* Role Selection Tabs */}
            <div className="grid grid-cols-4 gap-2 p-1.5 bg-[var(--bg-color)] rounded-xl border border-[var(--border-color)]">
              {(['Student', 'Faculty', 'Admin', 'Staff'] as const).map((role) => (
                <button
                  key={role}
                  onClick={() => setSelectedRole(role)}
                  className={`py-2 px-3 rounded-lg text-xs md:text-sm font-semibold transition-all ${
                    selectedRole === role
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                      : 'text-[var(--text-muted)] hover:text-[var(--text-color)]'
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
                className="p-5 rounded-2xl bg-gradient-to-br from-indigo-950/40 to-purple-950/40 border border-indigo-500/30 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-black text-xl shadow-lg">
                      AK
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-lg text-white">Abhinav Kumar</h3>
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">
                          <CheckCircle2 size={10} /> Active Student
                        </span>
                      </div>
                      <p className="text-xs text-indigo-200">abhinav@unicore.edu</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] uppercase tracking-wider text-indigo-300 font-semibold">CGPA</div>
                    <div className="text-2xl font-black text-emerald-400">8.13</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs border-t border-white/10 pt-3">
                  <div className="bg-[var(--bg-color)]/60 p-2.5 rounded-lg border border-white/5">
                    <span className="text-[var(--text-muted)] block text-[10px]">Roll Number</span>
                    <span className="font-bold text-[var(--text-color)]">1024030440</span>
                  </div>
                  <div className="bg-[var(--bg-color)]/60 p-2.5 rounded-lg border border-white/5">
                    <span className="text-[var(--text-muted)] block text-[10px]">Program</span>
                    <span className="font-bold text-[var(--text-color)]">B.Tech Computer Science</span>
                  </div>
                  <div className="bg-[var(--bg-color)]/60 p-2.5 rounded-lg border border-white/5">
                    <span className="text-[var(--text-muted)] block text-[10px]">Department</span>
                    <span className="font-bold text-[var(--text-color)]">CSE (Year 3)</span>
                  </div>
                  <div className="bg-[var(--bg-color)]/60 p-2.5 rounded-lg border border-white/5">
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
                className="p-5 rounded-2xl bg-gradient-to-br from-red-950/40 to-orange-950/40 border border-orange-500/30 space-y-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                    <Shield size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-white">System Administrator</h3>
                    <p className="text-xs text-orange-200">admin@unicore.edu</p>
                  </div>
                </div>
                <p className="text-xs text-[var(--text-muted)]">Full access to manage departments, users, courses, and platform metrics.</p>
              </motion.div>
            )}

            {selectedRole === 'Faculty' && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-5 rounded-2xl bg-gradient-to-br from-blue-950/40 to-cyan-950/40 border border-blue-500/30 space-y-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                    <GraduationCap size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-white">Dr. Rajesh Kumar</h3>
                    <p className="text-xs text-blue-200">Professor - Computer Science & Engineering</p>
                  </div>
                </div>
                <p className="text-xs text-[var(--text-muted)]">Manage course offerings, student grades, attendance, and departmental analytics.</p>
              </motion.div>
            )}

            {selectedRole === 'Staff' && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-5 rounded-2xl bg-gradient-to-br from-purple-950/40 to-pink-950/40 border border-purple-500/30 space-y-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                    <Briefcase size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-white">Ramesh Yadav</h3>
                    <p className="text-xs text-purple-200">staff1@unicore.edu</p>
                  </div>
                </div>
                <p className="text-xs text-[var(--text-muted)]">Oversee hostel room bed allocations, maintenance complaints, and library assets.</p>
              </motion.div>
            )}

            {/* Single Action Button */}
            <Button 
              className="w-full py-6 text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2"
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
