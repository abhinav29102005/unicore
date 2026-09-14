import type { Request, Response } from 'express';
import pool from '../config/db.js';

export const getStats = async (_req: Request, res: Response): Promise<void> => {
  try {
    const result = await pool.query(`
      SELECT
        (SELECT count(*) FROM academic_students WHERE deleted_at IS NULL) as total_students,
        (SELECT count(*) FROM academic_faculty) as total_faculty,
        (SELECT count(*) FROM academic_courses) as total_courses,
        (SELECT count(*) FROM academic_departments) as total_departments,
        (SELECT count(*) FROM hostel_allocations WHERE status = 'active') as hostel_occupancy,
        (SELECT count(*) FROM hostel_beds) as hostel_capacity,
        (SELECT count(*) FROM library_issues WHERE returned_at IS NULL) as active_issues,
        (SELECT count(*) FROM library_books) as total_books,
        (SELECT count(*) FROM library_fines WHERE settled_at IS NULL) as unpaid_fines,
        (SELECT count(*) FROM academic_enrollments) as total_enrollments
    `);

    res.json(result.rows[0] || {});
  } catch (err) {
    console.error('Stats error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getUsers = async (req: Request, res: Response): Promise<void> => {
  const page = parseInt(String(req.query.page || '1'), 10) || 1;
  const limit = parseInt(String(req.query.limit || '20'), 10) || 20;
  const offset = (page - 1) * limit;

  try {
    const countResult = await pool.query(`SELECT count(*) as count FROM auth_users WHERE deleted_at IS NULL`);
    const total = parseInt(String((countResult.rows[0] as any)?.count || '0'), 10);

    const result = await pool.query(
      `
      SELECT u.id, u.email, u.first_name || ' ' || u.last_name as name, u.status, u.last_login_at,
             r.name as role
      FROM auth_users u
      LEFT JOIN auth_user_roles ur ON ur.user_id = u.id
      LEFT JOIN auth_roles r ON r.id = ur.role_id
      WHERE u.deleted_at IS NULL
      ORDER BY u.created_at DESC
      LIMIT $1 OFFSET $2
    `,
      [limit, offset]
    );

    res.json({
      users: result.rows,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) || 1 },
    });
  } catch (err) {
    console.error('Users error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getDepartments = async (_req: Request, res: Response): Promise<void> => {
  try {
    const result = await pool.query(`
      SELECT d.id, d.code, d.name,
        (SELECT count(*) FROM academic_students s WHERE s.department_id = d.id AND s.deleted_at IS NULL) as student_count,
        (SELECT count(*) FROM academic_faculty f WHERE f.department_id = d.id) as faculty_count,
        (SELECT count(*) FROM academic_courses c WHERE c.department_id = d.id) as course_count
      FROM academic_departments d
      ORDER BY d.name
    `);

    res.json(result.rows);
  } catch (err) {
    console.error('Departments error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
