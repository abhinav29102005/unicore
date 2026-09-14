import { Router } from 'express';
import { getStudentDashboard, insertDummyData } from '../controllers/studentController';

const router = Router();

router.get('/student/:student_no/dashboard', getStudentDashboard);
router.post('/seed', insertDummyData);

export default router;
