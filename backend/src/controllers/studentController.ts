import { Request, Response } from 'express';
import pool from '../config/db';

export const getStudentDashboard = async (req: Request, res: Response) => {
  const { student_no } = req.params;
  try {
    const studentQuery = `
      SELECT s.id, s.student_no as roll, u.first_name || ' ' || u.last_name as name,
             d.name as department, d.code as dept_code, s.admission_year,
             s.current_semester as year, p.name as program, u.id as user_id
      FROM academic.students s
      JOIN auth.users u ON s.user_id = u.id
      JOIN academic.departments d ON s.department_id = d.id
      JOIN academic.programs p ON s.program_id = p.id
      WHERE s.student_no = $1
    `;
    const studentRes = await pool.query(studentQuery, [student_no]);

    if (studentRes.rows.length === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }

    const student = studentRes.rows[0];
    const studentId = student.id;
    const userId = student.user_id;

    // Calculate GPA from final_results
    const gpaRes = await pool.query(`
      SELECT
        COALESCE(
          ROUND(
            SUM(gs.gpa_points * c.credits)::numeric / NULLIF(SUM(c.credits), 0),
            2
          ), 0
        ) as gpa
      FROM exam.final_results fr
      JOIN exam.grade_scale gs ON gs.letter = fr.grade_code
      JOIN academic.course_offerings co ON fr.course_offering_id = co.id
      JOIN academic.courses c ON co.course_id = c.id
      WHERE fr.student_id = $1
    `, [studentId]);

    // Hostel
    const hostelRes = await pool.query(`
      SELECT h.name as block, r.room_no as room, a.status
      FROM hostel.allocations a
      JOIN hostel.beds b ON a.bed_id = b.id
      JOIN hostel.rooms r ON b.room_id = r.id
      JOIN hostel.blocks bl ON r.block_id = bl.id
      JOIN hostel.hostels h ON bl.hostel_id = h.id
      WHERE a.student_id = $1 AND a.status = 'active'
    `, [studentId]);

    // Enrollments with grades
    const enrollRes = await pool.query(`
      SELECT c.course_code, c.title as course_name, c.credits,
             COALESCE(fr.grade_code, 'Pending') as grade,
             fr.total_marks
      FROM academic.enrollments e
      JOIN academic.course_offerings co ON e.course_offering_id = co.id
      JOIN academic.courses c ON co.course_id = c.id
      LEFT JOIN exam.final_results fr ON fr.course_offering_id = co.id AND fr.student_id = e.student_id
      WHERE e.student_id = $1
      ORDER BY c.course_code
    `, [studentId]);

    // Library issues
    const libraryRes = await pool.query(`
      SELECT b.title as book_title, i.due_at as due_date, i.issued_at
      FROM library.issues i
      JOIN library.book_copies bc ON i.copy_id = bc.id
      JOIN library.books b ON bc.book_id = b.id
      WHERE i.member_user_id = $1 AND i.returned_at IS NULL
    `, [userId]);

    // Attendance summary
    const attendanceRes = await pool.query(`
      SELECT c.title as course_name, c.course_code,
        count(*) FILTER (WHERE a.status = 'present') as present,
        count(*) FILTER (WHERE a.status = 'absent') as absent,
        count(*) FILTER (WHERE a.status = 'late') as late,
        count(*) FILTER (WHERE a.status = 'excused') as excused,
        count(*) as total
      FROM academic.attendance a
      JOIN academic.course_offerings co ON a.course_offering_id = co.id
      JOIN academic.courses c ON co.course_id = c.id
      WHERE a.student_id = $1
      GROUP BY c.title, c.course_code
      ORDER BY c.course_code
    `, [studentId]);

    // Library fines
    const finesRes = await pool.query(`
      SELECT amount, reason, status, created_at
      FROM library.fines
      WHERE member_user_id = $1
      ORDER BY created_at DESC
    `, [userId]);

    res.json({
      student: {
        ...student,
        gpa: parseFloat(gpaRes.rows[0].gpa),
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

export const getStudentAttendance = async (req: Request, res: Response) => {
  const { student_no } = req.params;
  try {
    const studentRes = await pool.query(`SELECT id FROM academic.students WHERE student_no = $1`, [student_no]);
    if (studentRes.rows.length === 0) return res.status(404).json({ error: 'Student not found' });
    const studentId = studentRes.rows[0].id;

    const result = await pool.query(`
      SELECT c.course_code, c.title as course_name,
        count(*) FILTER (WHERE a.status = 'present') as present,
        count(*) FILTER (WHERE a.status = 'absent') as absent,
        count(*) FILTER (WHERE a.status = 'late') as late,
        count(*) FILTER (WHERE a.status = 'excused') as excused,
        count(*) as total,
        ROUND(count(*) FILTER (WHERE a.status IN ('present', 'late'))::numeric / NULLIF(count(*), 0) * 100, 1) as percentage
      FROM academic.attendance a
      JOIN academic.course_offerings co ON a.course_offering_id = co.id
      JOIN academic.courses c ON co.course_id = c.id
      WHERE a.student_id = $1
      GROUP BY c.course_code, c.title
      ORDER BY c.course_code
    `, [studentId]);

    res.json({ attendance: result.rows });
  } catch (err) {
    console.error('Attendance error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getStudentResults = async (req: Request, res: Response) => {
  const { student_no } = req.params;
  try {
    const studentRes = await pool.query(`SELECT id FROM academic.students WHERE student_no = $1`, [student_no]);
    if (studentRes.rows.length === 0) return res.status(404).json({ error: 'Student not found' });
    const studentId = studentRes.rows[0].id;

    const resultsRes = await pool.query(`
      SELECT c.course_code, c.title as course_name, c.credits,
             fr.total_marks, fr.grade_code as grade,
             gs.gpa_points
      FROM exam.final_results fr
      JOIN academic.course_offerings co ON fr.course_offering_id = co.id
      JOIN academic.courses c ON co.course_id = c.id
      JOIN exam.grade_scale gs ON gs.letter = fr.grade_code
      WHERE fr.student_id = $1
      ORDER BY c.course_code
    `, [studentId]);

    // Calculate CGPA
    let totalWeighted = 0;
    let totalCredits = 0;
    for (const r of resultsRes.rows) {
      totalWeighted += parseFloat(r.gpa_points) * parseInt(r.credits);
      totalCredits += parseInt(r.credits);
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
