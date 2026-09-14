import { createClient } from '@libsql/client/web';

export interface Env {
  TURSO_DATABASE_URL?: string;
  TURSO_AUTH_TOKEN?: string;
}

const DEFAULT_URL = 'libsql://unicore-abhinav29102005.aws-ap-northeast-1.turso.io';
const DEFAULT_TOKEN = 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3ODkzNDU3NTAsImlkIjoiMDFhMDlkNTEtNDgwMS03NDY2LWE3N2EtN2Q3OGE0NDVkZjU3Iiwia2lkIjoiYy1xeWVFV1NyU1hzQjBZQTZoQThEbFo2NmpUWldZZURFRmQ4aEduNVNNZyIsInJpZCI6Ijg2Y2ExY2VmLTg3MTQtNGI3Zi05ODA0LTZkZWZmZGQ0NzJhOSJ9.n6mEWGacLcsruZlKj_uST2lnPCkyPFg0QeOyqlK9Pp_RP5oDjK34WzLWytV2VhvG5hVEoSQPUJZUqqfVxjK7Cg';

function getDb(env: Env) {
  return createClient({
    url: env.TURSO_DATABASE_URL || DEFAULT_URL,
    authToken: env.TURSO_AUTH_TOKEN || DEFAULT_TOKEN,
  });
}

function jsonResponse(data: any, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      });
    }

    const url = new URL(request.url);
    const path = url.pathname;
    const db = getDb(env);

    try {
      if (path === '/' || path === '/health') {
        return jsonResponse({ status: 'healthy', service: 'UniCore Cloudflare Worker API' });
      }

      // ── Auth: Login ──
      if (path === '/api/auth/login' && request.method === 'POST') {
        const body: any = await request.json().catch(() => ({}));
        const { email, password } = body;
        if (!email || !password) {
          return jsonResponse({ error: 'Email and password are required' }, 400);
        }

        const res = await db.execute({
          sql: `
            SELECT u.id, u.email, u.first_name, u.last_name, u.status, r.name as role
            FROM auth_users u
            LEFT JOIN auth_user_roles ur ON ur.user_id = u.id
            LEFT JOIN auth_roles r ON r.id = ur.role_id
            WHERE u.email = ?1 AND u.deleted_at IS NULL
            LIMIT 1
          `,
          args: [email],
        });

        if (res.rows.length === 0 || !res.rows[0]) {
          return jsonResponse({ error: 'Invalid credentials' }, 401);
        }

        const user = res.rows[0] as any;
        if (user.status !== 'active') {
          return jsonResponse({ error: 'Account is not active' }, 403);
        }

        await db.execute({
          sql: `UPDATE auth_users SET last_login_at = CURRENT_TIMESTAMP WHERE id = ?1`,
          args: [user.id],
        });

        const roleKey = typeof user.role === 'string' ? user.role.toLowerCase() : '';
        const roleMap: Record<string, string> = {
          admin: 'Admin',
          faculty: 'Faculty',
          student: 'Student',
          staff: 'Staff',
        };

        const fullName = [user.first_name, user.last_name].filter(Boolean).join(' ') || String(user.email);
        return jsonResponse({
          user: {
            id: user.id,
            name: fullName,
            email: user.email,
            role: roleMap[roleKey] || user.role || 'Student',
          },
          token: 'unicore-jwt-' + String(user.id) + '-' + Date.now(),
        });
      }

      // ── Auth: Profile ──
      if (path.startsWith('/api/auth/profile/') && request.method === 'GET') {
        const userId = path.split('/api/auth/profile/')[1] || '';
        const res = await db.execute({
          sql: `
            SELECT u.id, u.email, u.first_name, u.last_name, u.status, u.last_login_at, r.name as role
            FROM auth_users u
            LEFT JOIN auth_user_roles ur ON ur.user_id = u.id
            LEFT JOIN auth_roles r ON r.id = ur.role_id
            WHERE u.id = ?1
            LIMIT 1
          `,
          args: [userId],
        });

        if (res.rows.length === 0 || !res.rows[0]) {
          return jsonResponse({ error: 'User not found' }, 404);
        }

        const u = res.rows[0] as any;
        const fullName = [u.first_name, u.last_name].filter(Boolean).join(' ') || String(u.email);
        return jsonResponse({
          id: u.id,
          name: fullName,
          email: u.email,
          role: u.role,
          status: u.status,
          lastLogin: u.last_login_at,
        });
      }

      // ── Admin: Stats ──
      if (path === '/api/admin/stats' && request.method === 'GET') {
        const res = await db.execute(`
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
        return jsonResponse(res.rows[0] || {});
      }

      // ── Admin: Users ──
      if (path === '/api/admin/users' && request.method === 'GET') {
        const page = parseInt(url.searchParams.get('page') || '1', 10) || 1;
        const limit = parseInt(url.searchParams.get('limit') || '20', 10) || 20;
        const offset = (page - 1) * limit;

        const countRes = await db.execute(`SELECT count(*) as count FROM auth_users WHERE deleted_at IS NULL`);
        const total = parseInt(String((countRes.rows[0] as any)?.count || '0'), 10);

        const res = await db.execute({
          sql: `
            SELECT u.id, u.email, u.first_name || ' ' || u.last_name as name, u.status, u.last_login_at,
                   r.name as role
            FROM auth_users u
            LEFT JOIN auth_user_roles ur ON ur.user_id = u.id
            LEFT JOIN auth_roles r ON r.id = ur.role_id
            WHERE u.deleted_at IS NULL
            ORDER BY u.created_at DESC
            LIMIT ?1 OFFSET ?2
          `,
          args: [limit, offset],
        });

        return jsonResponse({
          users: res.rows,
          pagination: { page, limit, total, pages: Math.ceil(total / limit) || 1 },
        });
      }

      // ── Admin: Departments ──
      if (path === '/api/admin/departments' && request.method === 'GET') {
        const res = await db.execute(`
          SELECT d.id, d.code, d.name,
            (SELECT count(*) FROM academic_students s WHERE s.department_id = d.id AND s.deleted_at IS NULL) as student_count,
            (SELECT count(*) FROM academic_faculty f WHERE f.department_id = d.id) as faculty_count,
            (SELECT count(*) FROM academic_courses c WHERE c.department_id = d.id) as course_count
          FROM academic_departments d
          ORDER BY d.name
        `);
        return jsonResponse(res.rows);
      }

      // ── Faculty Dashboard ──
      if (path.startsWith('/api/faculty/') && path.endsWith('/dashboard') && request.method === 'GET') {
        const id = path.replace('/api/faculty/', '').replace('/dashboard', '');
        const facultyRes = await db.execute({
          sql: `
            SELECT f.id, f.employee_no, f.designation, u.first_name || ' ' || u.last_name as name,
                   u.email, d.name as department, d.code as dept_code
            FROM academic_faculty f
            JOIN auth_users u ON f.user_id = u.id
            JOIN academic_departments d ON f.department_id = d.id
            WHERE f.employee_no = ?1 OR f.user_id = ?1
            LIMIT 1
          `,
          args: [id],
        });

        if (facultyRes.rows.length === 0 || !facultyRes.rows[0]) {
          return jsonResponse({ error: 'Faculty not found' }, 404);
        }

        const faculty = facultyRes.rows[0] as any;
        const deptCoursesRes = await db.execute({
          sql: `
            SELECT c.course_code, c.title, c.credits, sem.name as semester,
              (SELECT count(*) FROM academic_enrollments e WHERE e.course_offering_id = co.id) as enrolled_students
            FROM academic_course_offerings co
            JOIN academic_courses c ON co.course_id = c.id
            JOIN academic_semesters sem ON co.semester_id = sem.id
            JOIN academic_departments d ON c.department_id = d.id
            WHERE d.code = ?1
            ORDER BY sem.start_date DESC, c.course_code
          `,
          args: [faculty.dept_code],
        });

        const studentsRes = await db.execute({
          sql: `
            SELECT count(*) as total_students
            FROM academic_students s
            JOIN academic_departments d ON s.department_id = d.id
            WHERE d.code = ?1 AND s.deleted_at IS NULL
          `,
          args: [faculty.dept_code],
        });

        return jsonResponse({
          faculty: {
            id: faculty.id,
            name: faculty.name,
            email: faculty.email,
            employeeNo: faculty.employee_no,
            designation: faculty.designation,
            department: faculty.department,
          },
          courses: deptCoursesRes.rows,
          departmentStudents: parseInt(String((studentsRes.rows[0] as any)?.total_students || '0'), 10),
        });
      }

      // ── Student Dashboard ──
      if (path.startsWith('/api/student/') && path.endsWith('/dashboard') && request.method === 'GET') {
        const studentNo = path.replace('/api/student/', '').replace('/dashboard', '');
        const studentRes = await db.execute({
          sql: `
            SELECT s.id, s.student_no as roll, u.first_name || ' ' || u.last_name as name,
                   d.name as department, d.code as dept_code, s.admission_year,
                   s.current_semester as year, p.name as program, u.id as user_id
            FROM academic_students s
            JOIN auth_users u ON s.user_id = u.id
            JOIN academic_departments d ON s.department_id = d.id
            JOIN academic_programs p ON s.program_id = p.id
            WHERE s.student_no = ?1
            LIMIT 1
          `,
          args: [studentNo],
        });

        if (studentRes.rows.length === 0 || !studentRes.rows[0]) {
          return jsonResponse({ error: 'Student not found' }, 404);
        }

        const student = studentRes.rows[0] as any;
        const studentId = student.id;
        const userId = student.user_id;

        const gpaRes = await db.execute({
          sql: `
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
            WHERE fr.student_id = ?1
          `,
          args: [studentId],
        });

        const hostelRes = await db.execute({
          sql: `
            SELECT h.name as block, r.room_no as room, a.status
            FROM hostel_allocations a
            JOIN hostel_beds b ON a.bed_id = b.id
            JOIN hostel_rooms r ON b.room_id = r.id
            JOIN hostel_blocks bl ON r.block_id = bl.id
            JOIN hostel_hostels h ON bl.hostel_id = h.id
            WHERE a.student_id = ?1 AND a.status = 'active'
          `,
          args: [studentId],
        });

        const enrollRes = await db.execute({
          sql: `
            SELECT c.course_code, c.title as course_name, c.credits,
                   COALESCE(fr.grade_code, 'Pending') as grade,
                   fr.total_marks
            FROM academic_enrollments e
            JOIN academic_course_offerings co ON e.course_offering_id = co.id
            JOIN academic_courses c ON co.course_id = c.id
            LEFT JOIN exam_final_results fr ON fr.course_offering_id = co.id AND fr.student_id = e.student_id
            WHERE e.student_id = ?1
            ORDER BY c.course_code
          `,
          args: [studentId],
        });

        const libraryRes = await db.execute({
          sql: `
            SELECT b.title as book_title, i.due_at as due_date, i.issued_at
            FROM library_issues i
            JOIN library_book_copies bc ON i.copy_id = bc.id
            JOIN library_books b ON bc.book_id = b.id
            WHERE i.member_user_id = ?1 AND i.returned_at IS NULL
          `,
          args: [userId],
        });

        const attendanceRes = await db.execute({
          sql: `
            SELECT c.title as course_name, c.course_code,
              count(*) FILTER (WHERE a.status = 'present') as present,
              count(*) FILTER (WHERE a.status = 'absent') as absent,
              count(*) FILTER (WHERE a.status = 'late') as late,
              count(*) FILTER (WHERE a.status = 'excused') as excused,
              count(*) as total
            FROM academic_attendance a
            JOIN academic_course_offerings co ON a.course_offering_id = co.id
            JOIN academic_courses c ON co.course_id = c.id
            WHERE a.student_id = ?1
            GROUP BY c.title, c.course_code
            ORDER BY c.course_code
          `,
          args: [studentId],
        });

        const finesRes = await db.execute({
          sql: `
            SELECT amount, reason,
                   CASE WHEN settled_at IS NOT NULL THEN 'paid' ELSE 'unpaid' END as status,
                   created_at
            FROM library_fines
            WHERE member_user_id = ?1
            ORDER BY created_at DESC
          `,
          args: [userId],
        });

        return jsonResponse({
          student: {
            ...student,
            gpa: parseFloat(String((gpaRes.rows[0] as any)?.gpa || '0')),
          },
          hostel: hostelRes.rows.length > 0 ? hostelRes.rows[0] : null,
          enrollments: enrollRes.rows,
          library: libraryRes.rows,
          attendance: attendanceRes.rows,
          fines: finesRes.rows,
        });
      }

      // ── Student Attendance ──
      if (path.startsWith('/api/student/') && path.endsWith('/attendance') && request.method === 'GET') {
        const studentNo = path.replace('/api/student/', '').replace('/attendance', '');
        const studentRes = await db.execute({
          sql: `SELECT id FROM academic_students WHERE student_no = ?1 LIMIT 1`,
          args: [studentNo],
        });

        if (studentRes.rows.length === 0 || !studentRes.rows[0]) {
          return jsonResponse({ error: 'Student not found' }, 404);
        }

        const studentId = (studentRes.rows[0] as any).id;
        const res = await db.execute({
          sql: `
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
            WHERE a.student_id = ?1
            GROUP BY c.course_code, c.title
            ORDER BY c.course_code
          `,
          args: [studentId],
        });

        return jsonResponse({ attendance: res.rows });
      }

      // ── Student Results ──
      if (path.startsWith('/api/student/') && path.endsWith('/results') && request.method === 'GET') {
        const studentNo = path.replace('/api/student/', '').replace('/results', '');
        const studentRes = await db.execute({
          sql: `SELECT id FROM academic_students WHERE student_no = ?1 LIMIT 1`,
          args: [studentNo],
        });

        if (studentRes.rows.length === 0 || !studentRes.rows[0]) {
          return jsonResponse({ error: 'Student not found' }, 404);
        }

        const studentId = (studentRes.rows[0] as any).id;
        const res = await db.execute({
          sql: `
            SELECT c.course_code, c.title as course_name, c.credits,
                   fr.total_marks, fr.grade_code as grade,
                   gs.grade_points
            FROM exam_final_results fr
            JOIN academic_course_offerings co ON fr.course_offering_id = co.id
            JOIN academic_courses c ON co.course_id = c.id
            JOIN exam_grade_scale gs ON gs.grade_code = fr.grade_code
            WHERE fr.student_id = ?1
            ORDER BY c.course_code
          `,
          args: [studentId],
        });

        let totalWeighted = 0;
        let totalCredits = 0;
        for (const r of res.rows as any[]) {
          const gp = parseFloat(String(r.grade_points || '0'));
          const cr = parseInt(String(r.credits || '0'), 10);
          totalWeighted += gp * cr;
          totalCredits += cr;
        }
        const cgpa = totalCredits > 0 ? Math.round((totalWeighted / totalCredits) * 100) / 100 : 0;

        return jsonResponse({
          results: res.rows,
          summary: {
            totalCredits,
            cgpa,
            totalCourses: res.rows.length,
          },
        });
      }

      return jsonResponse({ error: 'Route not found' }, 404);
    } catch (err: any) {
      console.error('Worker API error:', err);
      return jsonResponse({ error: 'Internal server error', details: err.message }, 500);
    }
  },
};
