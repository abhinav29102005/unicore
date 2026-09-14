import { Request, Response } from 'express';
import pool from '../config/db';

export const getFacultyDashboard = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    // Find faculty by employee_no or user_id
    const facultyRes = await pool.query(`
      SELECT f.id, f.employee_no, f.designation, u.first_name || ' ' || u.last_name as name,
             u.email, d.name as department, d.code as dept_code
      FROM academic.faculty f
      JOIN auth.users u ON f.user_id = u.id
      JOIN academic.departments d ON f.department_id = d.id
      WHERE f.employee_no = $1 OR f.user_id = $1::uuid
    `, [id]);

    if (facultyRes.rows.length === 0) {
      return res.status(404).json({ error: 'Faculty not found' });
    }

    const faculty = facultyRes.rows[0];

    // Courses taught (via department courses that have offerings)
    const coursesRes = await pool.query(`
      SELECT c.course_code, c.title, c.credits, sem.name as semester,
        (SELECT count(*) FROM academic.enrollments e WHERE e.course_offering_id = co.id) as enrolled_students
      FROM academic.course_offerings co
      JOIN academic.courses c ON co.course_id = c.id
      JOIN academic.semesters sem ON co.semester_id = sem.id
      WHERE c.department_id = $1
      ORDER BY sem.start_date DESC, c.course_code
    `, [faculty.id.replace ? undefined : undefined]);

    // Use department_id from faculty
    const deptCoursesRes = await pool.query(`
      SELECT c.course_code, c.title, c.credits, sem.name as semester,
        (SELECT count(*) FROM academic.enrollments e WHERE e.course_offering_id = co.id) as enrolled_students
      FROM academic.course_offerings co
      JOIN academic.courses c ON co.course_id = c.id
      JOIN academic.semesters sem ON co.semester_id = sem.id
      JOIN academic.departments d ON c.department_id = d.id
      WHERE d.code = $1
      ORDER BY sem.start_date DESC, c.course_code
    `, [faculty.dept_code]);

    // Department students
    const studentsRes = await pool.query(`
      SELECT count(*) as total_students
      FROM academic.students s
      JOIN academic.departments d ON s.department_id = d.id
      WHERE d.code = $1 AND s.deleted_at IS NULL
    `, [faculty.dept_code]);

    res.json({
      faculty: {
        id: faculty.id,
        name: faculty.name,
        email: faculty.email,
        employeeNo: faculty.employee_no,
        designation: faculty.designation,
        department: faculty.department,
      },
      courses: deptCoursesRes.rows,
      departmentStudents: parseInt(studentsRes.rows[0].total_students),
    });
  } catch (err) {
    console.error('Faculty dashboard error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
