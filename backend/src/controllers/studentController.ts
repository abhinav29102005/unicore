import { Request, Response } from 'express';
import pool from '../config/db';

export const getStudentDashboard = async (req: Request, res: Response) => {
  const { student_no } = req.params;
  try {
    const studentQuery = `
      SELECT s.id, s.student_no as roll, u.first_name || ' ' || u.last_name as name, d.name as department, s.admission_year, s.current_semester as year 
      FROM academic.students s
      JOIN auth.users u ON s.user_id = u.id
      JOIN academic.departments d ON s.department_id = d.id
      WHERE s.student_no = $1
    `;
    const studentRes = await pool.query(studentQuery, [student_no]);

    if (studentRes.rows.length === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }

    const studentId = studentRes.rows[0].id;
    const userId = (await pool.query('SELECT user_id FROM academic.students WHERE id = $1', [studentId])).rows[0].user_id;

    // Fetch Hostel
    const hostelQuery = `
      SELECT h.name as block, r.room_no as room, a.status 
      FROM hostel.allocations a
      JOIN hostel.beds b ON a.bed_id = b.id
      JOIN hostel.rooms r ON b.room_id = r.id
      JOIN hostel.blocks bl ON r.block_id = bl.id
      JOIN hostel.hostels h ON bl.hostel_id = h.id
      WHERE a.student_id = $1 AND a.status = 'active'
    `;
    const hostelRes = await pool.query(hostelQuery, [studentId]);

    // Fetch Enrollments
    const enrollQuery = `
      SELECT c.title as course_name, 
             COALESCE(fr.grade_code, 'Pending') as grade
      FROM academic.enrollments e
      JOIN academic.course_offerings co ON e.course_offering_id = co.id
      JOIN academic.courses c ON co.course_id = c.id
      LEFT JOIN exam.final_results fr ON fr.course_offering_id = co.id AND fr.student_id = e.student_id
      WHERE e.student_id = $1
    `;
    const enrollRes = await pool.query(enrollQuery, [studentId]);

    // Fetch Library
    const libraryQuery = `
      SELECT b.title as book_title, i.due_at as due_date
      FROM library.issues i
      JOIN library.book_copies bc ON i.copy_id = bc.id
      JOIN library.books b ON bc.book_id = b.id
      WHERE i.member_user_id = $1 AND i.returned_at IS NULL
    `;
    const libraryRes = await pool.query(libraryQuery, [userId]);

    res.json({
      student: studentRes.rows[0],
      hostel: hostelRes.rows.length > 0 ? hostelRes.rows[0] : null,
      enrollments: enrollRes.rows,
      library: libraryRes.rows
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const insertDummyData = async (req: Request, res: Response) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    // Insert user & student
    const userRes = await client.query(`
      INSERT INTO auth.users (email, first_name, last_name, password_hash)
      VALUES ('abhinav@example.com', 'Abhinav Kumar', 'Singh', 'hashed')
      RETURNING id
    `);
    const userId = userRes.rows[0].id;

    const deptRes = await client.query(`
      INSERT INTO academic.departments (code, name) VALUES ('CSE', 'Computer Science')
      RETURNING id
    `);
    const deptId = deptRes.rows[0].id;

    const progRes = await client.query(`
      INSERT INTO academic.programs (department_id, code, name, degree_type, duration_semesters)
      VALUES ($1, 'BTECH-CSE', 'B.Tech in CSE', 'BTech', 8)
      RETURNING id
    `, [deptId]);
    const progId = progRes.rows[0].id;

    const studentRes = await client.query(`
      INSERT INTO academic.students (user_id, student_no, department_id, program_id, admission_year, current_semester)
      VALUES ($1, '1024030440', $2, $3, 2024, 3)
      RETURNING id
    `, [userId, deptId, progId]);
    const studentId = studentRes.rows[0].id;

    // Courses
    const course1 = await client.query(`INSERT INTO academic.courses (course_code, title, credits, department_id) VALUES ('CS301', 'Distributed Systems', 4, $1) RETURNING id`, [deptId]);
    const course2 = await client.query(`INSERT INTO academic.courses (course_code, title, credits, department_id) VALUES ('CS302', 'Cloud Computing', 3, $1) RETURNING id`, [deptId]);
    
    const sem = await client.query(`INSERT INTO academic.semesters (code, name, academic_year, start_date, end_date) VALUES ('FALL2024', 'Fall 2024', 2024, '2024-08-01', '2024-12-15') RETURNING id`);
    
    const off1 = await client.query(`INSERT INTO academic.course_offerings (course_id, semester_id, capacity) VALUES ($1, $2, 100) RETURNING id`, [course1.rows[0].id, sem.rows[0].id]);
    const off2 = await client.query(`INSERT INTO academic.course_offerings (course_id, semester_id, capacity) VALUES ($1, $2, 100) RETURNING id`, [course2.rows[0].id, sem.rows[0].id]);

    await client.query(`INSERT INTO academic.enrollments (student_id, course_offering_id) VALUES ($1, $2)`, [studentId, off1.rows[0].id]);
    await client.query(`INSERT INTO academic.enrollments (student_id, course_offering_id) VALUES ($1, $2)`, [studentId, off2.rows[0].id]);

    // Hostel
    const hostel = await client.query(`INSERT INTO hostel.hostels (name, code, gender_type) VALUES ('Block M', 'BM', 'male') RETURNING id`);
    const block = await client.query(`INSERT INTO hostel.blocks (hostel_id, name, floor_count) VALUES ($1, 'Main', 5) RETURNING id`, [hostel.rows[0].id]);
    const room = await client.query(`INSERT INTO hostel.rooms (block_id, room_no, floor_no, capacity) VALUES ($1, '405', 4, 1) RETURNING id`, [block.rows[0].id]);
    const bed = await client.query(`INSERT INTO hostel.beds (room_id, bed_label) VALUES ($1, 'A') RETURNING id`, [room.rows[0].id]);
    
    await client.query(`INSERT INTO hostel.allocations (student_id, bed_id) VALUES ($1, $2)`, [studentId, bed.rows[0].id]);

    // Library
    const book = await client.query(`INSERT INTO library.books (isbn, title) VALUES ('9781449373320', 'Designing Data-Intensive Applications') RETURNING id`);
    const copy = await client.query(`INSERT INTO library.book_copies (book_id, barcode) VALUES ($1, 'DDIA-01') RETURNING id`, [book.rows[0].id]);
    
    // User issued by (sys admin)
    const admin = await client.query(`INSERT INTO auth.users (email, first_name, last_name, password_hash) VALUES ('admin@example.com', 'Admin', 'User', 'hashed') RETURNING id`);
    await client.query(`INSERT INTO library.issues (copy_id, member_user_id, issued_by, due_at) VALUES ($1, $2, $3, '2026-09-30 00:00:00')`, [copy.rows[0].id, userId, admin.rows[0].id]);

    await client.query('COMMIT');
    res.json({ message: 'Dummy data inserted successfully' });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ error: 'Failed to insert dummy data' });
  } finally {
    client.release();
  }
};
