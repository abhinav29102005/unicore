import { Router } from 'express';
import { getStudentDashboard, getStudentAttendance, getStudentResults } from '../controllers/studentController.js';
import { login, getProfile } from '../controllers/authController.js';
import { getStats, getUsers, getDepartments } from '../controllers/adminController.js';
import { getFacultyDashboard } from '../controllers/facultyController.js';
import { seedDatabase } from '../controllers/seedController.js';

const router = Router();

// ── Auth ──
router.post('/auth/login', login);
router.get('/auth/profile/:id', getProfile);

// ── Admin ──
router.get('/admin/stats', getStats);
router.get('/admin/users', getUsers);
router.get('/admin/departments', getDepartments);

// ── Faculty ──
router.get('/faculty/:id/dashboard', getFacultyDashboard);

// ── Student ──
router.get('/student/:student_no/dashboard', getStudentDashboard);
router.get('/student/:student_no/attendance', getStudentAttendance);
router.get('/student/:student_no/results', getStudentResults);

// ── Seed (development only) ──
router.post('/seed', seedDatabase);

export default router;
