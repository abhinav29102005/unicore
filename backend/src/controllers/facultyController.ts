import type { Request, Response } from 'express';
import pool from '../config/db.js';

export const getFacultyDashboard = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    // Find faculty by employee_no or user_id
    const facultyRes = await pool.query(
      `
      SELECT f.id, f.employee_no, f.designation, u.first_name || ' ' || u.last_name as name,
             u.email, d.name as department, d.code as dept_code
      FROM academic_faculty f
      JOIN auth_users u ON f.user_id = u.id
      JOIN academic_departments d ON f.department_id = d.id
      WHERE f.employee_no = $1 OR f.user_id = $1
      LIMIT 1
    `,
      [id]
    );

    if (facultyRes.rows.length === 0 || !facultyRes.rows[0]) {
      res.status(404).json({ error: 'Faculty not found' });
      return;
    }

    const faculty = facultyRes.rows[0] as Record<string, any>;

    // Department courses with offerings
    const deptCoursesRes = await pool.query(
      `
      SELECT c.course_code, c.title, c.credits, sem.name as semester,
        (SELECT count(*) FROM academic_enrollments e WHERE e.course_offering_id = co.id) as enrolled_students
      FROM academic_course_offerings co
      JOIN academic_courses c ON co.course_id = c.id
      JOIN academic_semesters sem ON co.semester_id = sem.id
      JOIN academic_departments d ON c.department_id = d.id
      WHERE d.code = $1
      ORDER BY sem.start_date DESC, c.course_code
    `,
      [faculty.dept_code]
    );

    // Department students count
    const studentsRes = await pool.query(
      `
      SELECT count(*) as total_students
      FROM academic_students s
      JOIN academic_departments d ON s.department_id = d.id
      WHERE d.code = $1 AND s.deleted_at IS NULL
    `,
      [faculty.dept_code]
    );

    const totalStudents = parseInt(String((studentsRes.rows[0] as any)?.total_students || '0'), 10);

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
      departmentStudents: totalStudents,
    });
  } catch (err) {
    console.error('Faculty dashboard error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
