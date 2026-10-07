import type { Request, Response } from 'express';
import pool from '../config/db.js';

export const getStudentDashboard = async (req: Request, res: Response): Promise<void> => {
  const { student_no } = req.params;
  try {
    const studentQuery = `
      SELECT s.id, s.student_no as roll, u.first_name || ' ' || u.last_name as name,
             d.name as department, d.code as dept_code, s.admission_year,
             s.current_semester as year, p.name as program, u.id as user_id
      FROM academic_students s
      JOIN auth_users u ON s.user_id = u.id
      JOIN academic_departments d ON s.department_id = d.id
      JOIN academic_programs p ON s.program_id = p.id
      WHERE s.student_no = $1
      LIMIT 1
    `;
    const studentRes = await pool.query(studentQuery, [student_no]);

    if (studentRes.rows.length === 0 || !studentRes.rows[0]) {
      res.status(404).json({ error: 'Student not found' });
      return;
    }

    const student = studentRes.rows[0] as Record<string, any>;
    const studentId = student.id;
    const userId = student.user_id;

    // Calculate GPA from final_results
    const gpaRes = await pool.query(
      `
      SELECT
        COALESCE(
          ROUND(
            (1.0 * SUM(gs.grade_points * c.credits)) / NULLIF(SUM(c.credits), 0),
            2
          ), 0
        ) as gpa
      FROM exam_final_results fr
      JOIN exam_grade_scale gs ON gs.grade_code = fr.grade_code
      JOIN academic_course_offerings co ON fr.course_offering_id = co.id
      JOIN academic_courses c ON co.course_id = c.id
      WHERE fr.student_id = $1
    `,
      [studentId]
    );

    // Hostel
    const hostelRes = await pool.query(
      `
      SELECT h.name as block, r.room_no as room, a.status
      FROM hostel_allocations a
      JOIN hostel_beds b ON a.bed_id = b.id
      JOIN hostel_rooms r ON b.room_id = r.id
      JOIN hostel_blocks bl ON r.block_id = bl.id
      JOIN hostel_hostels h ON bl.hostel_id = h.id
      WHERE a.student_id = $1 AND a.status = 'active'
    `,
      [studentId]
    );

    // Enrollments with grades
    const enrollRes = await pool.query(
      `
      SELECT c.course_code, c.title as course_name, c.credits,
             COALESCE(fr.grade_code, 'Pending') as grade,
             fr.total_marks
      FROM academic_enrollments e
      JOIN academic_course_offerings co ON e.course_offering_id = co.id
      JOIN academic_courses c ON co.course_id = c.id
      LEFT JOIN exam_final_results fr ON fr.course_offering_id = co.id AND fr.student_id = e.student_id
      WHERE e.student_id = $1
      ORDER BY c.course_code
    `,
      [studentId]
    );

    // Library issues
    const libraryRes = await pool.query(
      `
      SELECT b.title as book_title, i.due_at as due_date, i.issued_at
      FROM library_issues i
      JOIN library_book_copies bc ON i.copy_id = bc.id
      JOIN library_books b ON bc.book_id = b.id
      WHERE i.member_user_id = $1 AND i.returned_at IS NULL
    `,
      [userId]
    );

    // Attendance summary
    const attendanceRes = await pool.query(
      `
      SELECT c.title as course_name, c.course_code,
        count(*) FILTER (WHERE a.status = 'present') as present,
        count(*) FILTER (WHERE a.status = 'absent') as absent,
        count(*) FILTER (WHERE a.status = 'late') as late,
        count(*) FILTER (WHERE a.status = 'excused') as excused,
        count(*) as total
      FROM academic_attendance a
      JOIN academic_course_offerings co ON a.course_offering_id = co.id
      JOIN academic_courses c ON co.course_id = c.id
      WHERE a.student_id = $1
      GROUP BY c.title, c.course_code
      ORDER BY c.course_code
    `,
      [studentId]
    );

    // Library fines (status computed from settled_at)
    const finesRes = await pool.query(
      `
      SELECT amount, reason,
             CASE WHEN settled_at IS NOT NULL THEN 'paid' ELSE 'unpaid' END as status,
             created_at
      FROM library_fines
      WHERE member_user_id = $1
      ORDER BY created_at DESC
    `,
      [userId]
    );

    const gpaVal = parseFloat(String((gpaRes.rows[0] as any)?.gpa || '0'));

    res.json({
      student: {
        ...student,
        gpa: gpaVal,
      },
      hostel: hostelRes.rows.length > 0 ? hostelRes.rows[0] : null,
      enrollments: enrollRes.rows,
      library: libraryRes.rows,
      attendance: attendanceRes.rows,
      fines: finesRes.rows,
    });
  } catch (err) {
    console.error('Student dashboard error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getStudentAttendance = async (req: Request, res: Response): Promise<void> => {
  const { student_no } = req.params;
  try {
    const studentRes = await pool.query(`SELECT id FROM academic_students WHERE student_no = $1 LIMIT 1`, [student_no]);
    if (studentRes.rows.length === 0 || !studentRes.rows[0]) {
      res.status(404).json({ error: 'Student not found' });
      return;
    }
    const studentId = (studentRes.rows[0] as any).id;

    const result = await pool.query(
      `
      SELECT c.course_code, c.title as course_name,
        count(*) FILTER (WHERE a.status = 'present') as present,
        count(*) FILTER (WHERE a.status = 'absent') as absent,
        count(*) FILTER (WHERE a.status = 'late') as late,
        count(*) FILTER (WHERE a.status = 'excused') as excused,
        count(*) as total,
        ROUND(100.0 * count(*) FILTER (WHERE a.status IN ('present', 'late')) / NULLIF(count(*), 0), 1) as percentage
      FROM academic_attendance a
      JOIN academic_course_offerings co ON a.course_offering_id = co.id
      JOIN academic_courses c ON co.course_id = c.id
      WHERE a.student_id = $1
      GROUP BY c.course_code, c.title
      ORDER BY c.course_code
    `,
      [studentId]
    );

    res.json({ attendance: result.rows });
  } catch (err) {
    console.error('Attendance error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getStudentResults = async (req: Request, res: Response): Promise<void> => {
  const { student_no } = req.params;
  try {
    const studentRes = await pool.query(`SELECT id FROM academic_students WHERE student_no = $1 LIMIT 1`, [student_no]);
    if (studentRes.rows.length === 0 || !studentRes.rows[0]) {
      res.status(404).json({ error: 'Student not found' });
      return;
    }
    const studentId = (studentRes.rows[0] as any).id;

    const resultsRes = await pool.query(
      `
      SELECT c.course_code, c.title as course_name, c.credits,
             fr.total_marks, fr.grade_code as grade,
             gs.grade_points
      FROM exam_final_results fr
      JOIN academic_course_offerings co ON fr.course_offering_id = co.id
      JOIN academic_courses c ON co.course_id = c.id
      JOIN exam_grade_scale gs ON gs.grade_code = fr.grade_code
      WHERE fr.student_id = $1
      ORDER BY c.course_code
    `,
      [studentId]
    );

    // Calculate CGPA
    let totalWeighted = 0;
    let totalCredits = 0;
    for (const r of resultsRes.rows as any[]) {
      const gp = parseFloat(String(r.grade_points || '0'));
      const cr = parseInt(String(r.credits || '0'), 10);
      totalWeighted += gp * cr;
      totalCredits += cr;
    }
    const cgpa = totalCredits > 0 ? Math.round((totalWeighted / totalCredits) * 100) / 100 : 0;

    res.json({
      results: resultsRes.rows,
      summary: {
        totalCredits,
        cgpa,
        totalCourses: resultsRes.rows.length,
      },
    });
  } catch (err) {
    console.error('Results error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
