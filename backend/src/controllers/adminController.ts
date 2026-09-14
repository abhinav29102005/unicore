import { Request, Response } from 'express';
import pool from '../config/db';

export const getStats = async (_req: Request, res: Response) => {
  try {
    const result = await pool.query(`
      SELECT
        (SELECT count(*) FROM academic.students WHERE deleted_at IS NULL) as total_students,
        (SELECT count(*) FROM academic.faculty) as total_faculty,
        (SELECT count(*) FROM academic.courses) as total_courses,
        (SELECT count(*) FROM academic.departments) as total_departments,
        (SELECT count(*) FROM hostel.allocations WHERE status = 'active') as hostel_occupancy,
        (SELECT count(*) FROM hostel.beds) as hostel_capacity,
        (SELECT count(*) FROM library.issues WHERE returned_at IS NULL) as active_issues,
        (SELECT count(*) FROM library.books) as total_books,
        (SELECT count(*) FROM library.fines WHERE status = 'unpaid') as unpaid_fines,
        (SELECT count(*) FROM academic.enrollments) as total_enrollments
    `);

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Stats error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getUsers = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;
  const offset = (page - 1) * limit;

  try {
    const countResult = await pool.query(`SELECT count(*) FROM auth.users WHERE deleted_at IS NULL`);
    const total = parseInt(countResult.rows[0].count);

    const result = await pool.query(`
      SELECT u.id, u.email, u.first_name || ' ' || u.last_name as name, u.status, u.last_login_at,
             r.name as role
      FROM auth.users u
      LEFT JOIN auth.user_roles ur ON ur.user_id = u.id
      LEFT JOIN auth.roles r ON r.id = ur.role_id
      WHERE u.deleted_at IS NULL
      ORDER BY u.created_at DESC
      LIMIT $1 OFFSET $2
    `, [limit, offset]);

    res.json({
      users: result.rows,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (err) {
    console.error('Users error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getDepartments = async (_req: Request, res: Response) => {
  try {
    const result = await pool.query(`
      SELECT d.id, d.code, d.name,
        (SELECT count(*) FROM academic.students s WHERE s.department_id = d.id AND s.deleted_at IS NULL) as student_count,
        (SELECT count(*) FROM academic.faculty f WHERE f.department_id = d.id) as faculty_count,
        (SELECT count(*) FROM academic.courses c WHERE c.department_id = d.id) as course_count
      FROM academic.departments d
      ORDER BY d.name
    `);

    res.json(result.rows);
  } catch (err) {
    console.error('Departments error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
