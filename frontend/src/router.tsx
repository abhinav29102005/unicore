import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';

import Landing from './pages/Landing';
import Sign from './pages/auth/Sign';
import ShellLayout from './components/layout/ShellLayout';
import AdminDashboard from './pages/admin/Dashboard';
import FacultyDashboard from './pages/faculty/Dashboard';
import StudentDashboard from './pages/student/Dashboard';
import StaffDashboard from './pages/staff/Dashboard';

const ProtectedRoute = ({ children, allowedRoles }: { children: React.ReactNode; allowedRoles?: string[] }) => {
  const { isAuthenticated, user } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/sign" replace />;
  if (allowedRoles && user && !allowedRoles.includes(user.role)) return <Navigate to="/" replace />;
  return <>{children}</>;
};

const RootRedirect = () => {
  const { isAuthenticated, user } = useAuthStore();
  if (!isAuthenticated) return <Landing />;
  
  switch (user?.role) {
    case 'Admin': return <Navigate to="/admin" replace />;
    case 'Faculty': return <Navigate to="/faculty" replace />;
    case 'Student': return <Navigate to="/student" replace />;
    case 'Staff': return <Navigate to="/staff" replace />;
    default: return <Landing />;
  }
};

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootRedirect />
  },
  {
    path: '/sign',
    element: <Sign />
  },
  {
    path: '/',
    element: <ShellLayout />,
    children: [
      { path: 'admin', element: <ProtectedRoute allowedRoles={['Admin']}><AdminDashboard /></ProtectedRoute> },
      { path: 'faculty', element: <ProtectedRoute allowedRoles={['Faculty']}><FacultyDashboard /></ProtectedRoute> },
      { path: 'student', element: <ProtectedRoute allowedRoles={['Student']}><StudentDashboard /></ProtectedRoute> },
      { path: 'staff', element: <ProtectedRoute allowedRoles={['Staff']}><StaffDashboard /></ProtectedRoute> }
    ]
  },
  {
    path: '*',
    element: <Navigate to="/" replace />
  }
], { basename: '/unicore' });
