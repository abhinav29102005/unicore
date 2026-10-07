import type { Request, Response } from 'express';
import pool, { client as rawClient } from '../config/db.js';

export const seedDatabase = async (_req: Request, res: Response): Promise<void> => {
  try {
    // ── 1. Batch Clean Up All Existing Data ──
    await rawClient.batch([
      'DELETE FROM library_fines',
      'DELETE FROM library_issues',
      'DELETE FROM library_book_copies',
      'DELETE FROM library_books',
      'DELETE FROM hostel_outpasses',
      'DELETE FROM hostel_complaints',
      'DELETE FROM hostel_allocations',
      'DELETE FROM hostel_beds',
      'DELETE FROM hostel_rooms',
      'DELETE FROM hostel_blocks',
      'DELETE FROM hostel_hostels',
      'DELETE FROM exam_final_results',
      'DELETE FROM exam_marks',
      'DELETE FROM exam_exams',
      'DELETE FROM exam_exam_types',
      'DELETE FROM exam_grade_scale',
      'DELETE FROM academic_attendance',
      'DELETE FROM academic_enrollments',
      'DELETE FROM academic_course_offerings',
      'DELETE FROM academic_courses',
      'DELETE FROM academic_semesters',
      'DELETE FROM academic_students',
      'DELETE FROM academic_faculty',
      'DELETE FROM academic_programs',
      'DELETE FROM academic_departments',
      'DELETE FROM auth_user_roles',
      'DELETE FROM auth_roles',
      'DELETE FROM auth_users',
    ], 'write');

    // ── 2. Auth: Roles ──
    const rolesRes = await pool.query(`
      INSERT INTO auth_roles (code, name, description, is_system) VALUES
        ('ADMIN', 'admin', 'System administrator', 1),
        ('FACULTY', 'faculty', 'Teaching faculty', 1),
        ('STUDENT', 'student', 'Enrolled student', 1),
        ('STAFF', 'staff', 'University staff', 1)
      RETURNING id, code
    `);
    const roleMap: Record<string, string> = {};
    for (const r of rolesRes.rows) roleMap[r.code] = r.id;

    // ── 3. Auth: Users ──
    const pwHash = '$2b$10$dummyHashForPrototypeEnvironmentOnly';
    const usersRes = await pool.query(`
      INSERT INTO auth_users (email, first_name, last_name, password_hash, status) VALUES
        ('admin@unicore.edu', 'System', 'Admin', $1, 'active'),
        ('abhinav@unicore.edu', 'Abhinav', 'Kumar', $1, 'active'),
        ('priya@unicore.edu', 'Priya', 'Sharma', $1, 'active'),
        ('rahul@unicore.edu', 'Rahul', 'Verma', $1, 'active'),
        ('sneha@unicore.edu', 'Sneha', 'Patel', $1, 'active'),
        ('amit@unicore.edu', 'Amit', 'Gupta', $1, 'active'),
        ('neha@unicore.edu', 'Neha', 'Joshi', $1, 'active'),
        ('vikram@unicore.edu', 'Vikram', 'Malhotra', $1, 'active'),
        ('ananya@unicore.edu', 'Ananya', 'Deshmukh', $1, 'active'),
        ('rohan@unicore.edu', 'Rohan', 'Mehta', $1, 'active'),
        ('kavita@unicore.edu', 'Kavita', 'Nair', $1, 'active'),
        ('dr.kumar@unicore.edu', 'Dr. Rajesh', 'Kumar', $1, 'active'),
        ('dr.singh@unicore.edu', 'Dr. Meena', 'Singh', $1, 'active'),
        ('dr.sharma@unicore.edu', 'Dr. Anil', 'Sharma', $1, 'active'),
        ('dr.patel@unicore.edu', 'Dr. Sunita', 'Patel', $1, 'active'),
        ('dr.reddy@unicore.edu', 'Dr. Venkat', 'Reddy', $1, 'active'),
        ('staff1@unicore.edu', 'Ramesh', 'Yadav', $1, 'active'),
        ('staff2@unicore.edu', 'Suresh', 'Pillai', $1, 'active')
      RETURNING id, email
    `, [pwHash]);

    const userMap: Record<string, string> = {};
    for (const row of usersRes.rows) userMap[row.email] = row.id;

    // ── 4. Auth: Assign Roles ──
    const userRoleInserts = [
      `('${userMap['admin@unicore.edu']}', '${roleMap['ADMIN']}')`,
      `('${userMap['staff1@unicore.edu']}', '${roleMap['STAFF']}')`,
      `('${userMap['staff2@unicore.edu']}', '${roleMap['STAFF']}')`,
      `('${userMap['dr.kumar@unicore.edu']}', '${roleMap['FACULTY']}')`,
      `('${userMap['dr.singh@unicore.edu']}', '${roleMap['FACULTY']}')`,
      `('${userMap['dr.sharma@unicore.edu']}', '${roleMap['FACULTY']}')`,
      `('${userMap['dr.patel@unicore.edu']}', '${roleMap['FACULTY']}')`,
      `('${userMap['dr.reddy@unicore.edu']}', '${roleMap['FACULTY']}')`,
      `('${userMap['abhinav@unicore.edu']}', '${roleMap['STUDENT']}')`,
      `('${userMap['priya@unicore.edu']}', '${roleMap['STUDENT']}')`,
      `('${userMap['rahul@unicore.edu']}', '${roleMap['STUDENT']}')`,
      `('${userMap['sneha@unicore.edu']}', '${roleMap['STUDENT']}')`,
      `('${userMap['amit@unicore.edu']}', '${roleMap['STUDENT']}')`,
      `('${userMap['neha@unicore.edu']}', '${roleMap['STUDENT']}')`,
      `('${userMap['vikram@unicore.edu']}', '${roleMap['STUDENT']}')`,
      `('${userMap['ananya@unicore.edu']}', '${roleMap['STUDENT']}')`,
      `('${userMap['rohan@unicore.edu']}', '${roleMap['STUDENT']}')`,
      `('${userMap['kavita@unicore.edu']}', '${roleMap['STUDENT']}')`,
    ];
    await pool.query(`INSERT INTO auth_user_roles (user_id, role_id) VALUES ${userRoleInserts.join(', ')}`);

    // ── 5. Academic: Departments & Programs ──
    const deptsRes = await pool.query(`
      INSERT INTO academic_departments (code, name) VALUES
        ('CSE', 'Computer Science & Engineering'),
        ('ECE', 'Electronics & Communication'),
        ('ME', 'Mechanical Engineering'),
        ('CE', 'Civil Engineering'),
        ('EE', 'Electrical Engineering')
      RETURNING id, code
    `);
    const deptMap: Record<string, string> = {};
    for (const row of deptsRes.rows) deptMap[row.code] = row.id;

    const progsRes = await pool.query(`
      INSERT INTO academic_programs (department_id, code, name, degree_type, duration_semesters) VALUES
        ('${deptMap['CSE']}', 'BTECH-CSE', 'B.Tech Computer Science', 'BTech', 8),
        ('${deptMap['ECE']}', 'BTECH-ECE', 'B.Tech Electronics', 'BTech', 8),
        ('${deptMap['ME']}', 'BTECH-ME', 'B.Tech Mechanical', 'BTech', 8),
        ('${deptMap['CE']}', 'BTECH-CE', 'B.Tech Civil', 'BTech', 8),
        ('${deptMap['EE']}', 'BTECH-EE', 'B.Tech Electrical', 'BTech', 8)
      RETURNING id, code
    `);
    const progMap: Record<string, string> = {};
    for (const row of progsRes.rows) progMap[row.code] = row.id;

    // ── 6. Academic: Faculty ──
    const facultyRes = await pool.query(`
      INSERT INTO academic_faculty (user_id, employee_no, department_id, designation) VALUES
        ('${userMap['dr.kumar@unicore.edu']}', 'FAC001', '${deptMap['CSE']}', 'Professor'),
        ('${userMap['dr.singh@unicore.edu']}', 'FAC002', '${deptMap['ECE']}', 'Associate Professor'),
        ('${userMap['dr.sharma@unicore.edu']}', 'FAC003', '${deptMap['ME']}', 'Professor'),
        ('${userMap['dr.patel@unicore.edu']}', 'FAC004', '${deptMap['CE']}', 'Assistant Professor'),
        ('${userMap['dr.reddy@unicore.edu']}', 'FAC005', '${deptMap['EE']}', 'Professor')
      RETURNING id, employee_no
    `);
    const facultyIds: Record<string, string> = {};
    for (const row of facultyRes.rows) facultyIds[row.employee_no] = row.id;

    // ── 7. Academic: Students ──
    const studentsRes = await pool.query(`
      INSERT INTO academic_students (user_id, student_no, department_id, program_id, admission_year, current_semester) VALUES
        ('${userMap['abhinav@unicore.edu']}', '1024030440', '${deptMap['CSE']}', '${progMap['BTECH-CSE']}', 2024, 3),
        ('${userMap['priya@unicore.edu']}', '1024030441', '${deptMap['CSE']}', '${progMap['BTECH-CSE']}', 2024, 3),
        ('${userMap['rahul@unicore.edu']}', '1024030442', '${deptMap['ECE']}', '${progMap['BTECH-ECE']}', 2024, 3),
        ('${userMap['sneha@unicore.edu']}', '1024030443', '${deptMap['ME']}', '${progMap['BTECH-ME']}', 2023, 5),
        ('${userMap['amit@unicore.edu']}', '1024030444', '${deptMap['CE']}', '${progMap['BTECH-CE']}', 2023, 5),
        ('${userMap['neha@unicore.edu']}', '1024030445', '${deptMap['EE']}', '${progMap['BTECH-EE']}', 2022, 7),
        ('${userMap['vikram@unicore.edu']}', '1024030446', '${deptMap['CSE']}', '${progMap['BTECH-CSE']}', 2022, 7),
        ('${userMap['ananya@unicore.edu']}', '1024030447', '${deptMap['ECE']}', '${progMap['BTECH-ECE']}', 2023, 5),
        ('${userMap['rohan@unicore.edu']}', '1024030448', '${deptMap['ME']}', '${progMap['BTECH-ME']}', 2024, 3),
        ('${userMap['kavita@unicore.edu']}', '1024030449', '${deptMap['CE']}', '${progMap['BTECH-CE']}', 2022, 7)
      RETURNING id, student_no
    `);
    const studentIds: Record<string, string> = {};
    for (const row of studentsRes.rows) studentIds[row.student_no] = row.id;

    // ── 8. Academic: Semesters, Courses, Offerings ──
    const semsRes = await pool.query(`
      INSERT INTO academic_semesters (code, name, academic_year, start_date, end_date, is_current) VALUES
        ('FALL2025', 'Fall 2025', 2025, '2025-08-01', '2025-12-15', 1),
        ('SPRING2026', 'Spring 2026', 2026, '2026-01-15', '2026-05-30', 0)
      RETURNING id, code
    `);
    const semMap: Record<string, string> = {};
    for (const row of semsRes.rows) semMap[row.code] = row.id;

    const coursesRes = await pool.query(`
      INSERT INTO academic_courses (course_code, title, credits, department_id) VALUES
        ('CS301', 'Distributed Systems', 4, '${deptMap['CSE']}'),
        ('CS302', 'Cloud Computing', 3, '${deptMap['CSE']}'),
        ('CS303', 'Database Management Systems', 4, '${deptMap['CSE']}'),
        ('CS304', 'Machine Learning', 4, '${deptMap['CSE']}'),
        ('EC301', 'Signal Processing', 3, '${deptMap['ECE']}'),
        ('EC302', 'VLSI Design', 4, '${deptMap['ECE']}'),
        ('ME301', 'Thermodynamics', 3, '${deptMap['ME']}'),
        ('ME302', 'Fluid Mechanics', 4, '${deptMap['ME']}'),
        ('CE301', 'Structural Analysis', 4, '${deptMap['CE']}'),
        ('EE301', 'Power Systems', 3, '${deptMap['EE']}')
      RETURNING id, course_code
    `);
    const courseMap: Record<string, string> = {};
    for (const row of coursesRes.rows) courseMap[row.course_code] = row.id;

    const offeringInserts = Object.keys(courseMap).map(
      (code) => `('${courseMap[code]}', '${semMap['FALL2025']}', 60, '${code}')`
    );
    const offeringsRes = await pool.query(`
      INSERT INTO academic_course_offerings (course_id, semester_id, capacity, section_code) VALUES
        ${offeringInserts.join(', ')}
      RETURNING id, section_code
    `);
    const offeringMap: Record<string, string> = {};
    for (const row of offeringsRes.rows) offeringMap[row.section_code] = row.id;

    // ── 9. Academic: Enrollments ──
    const enrollmentList = [
      { roll: '1024030440', courses: ['CS301', 'CS302', 'CS303', 'CS304'] },
      { roll: '1024030441', courses: ['CS301', 'CS302', 'CS303', 'CS304'] },
      { roll: '1024030442', courses: ['EC301', 'EC302', 'CS301'] },
      { roll: '1024030443', courses: ['ME301', 'ME302', 'CS302'] },
      { roll: '1024030444', courses: ['CE301', 'CS303'] },
      { roll: '1024030445', courses: ['EE301', 'EC301'] },
      { roll: '1024030446', courses: ['CS301', 'CS302', 'CS303', 'CS304'] },
      { roll: '1024030447', courses: ['EC301', 'EC302'] },
      { roll: '1024030448', courses: ['ME301', 'ME302'] },
      { roll: '1024030449', courses: ['CE301', 'CS301'] },
    ];

    const enrollmentRows: string[] = [];
    for (const e of enrollmentList) {
      for (const c of e.courses) {
        enrollmentRows.push(`('${studentIds[e.roll]}', '${offeringMap[c]}')`);
      }
    }
    await pool.query(`INSERT INTO academic_enrollments (student_id, course_offering_id) VALUES ${enrollmentRows.join(', ')}`);

    // ── 10. Academic: Attendance ──
    const dates = ['2025-09-01', '2025-09-03', '2025-09-05', '2025-09-08', '2025-09-10'];
    const attendanceInserts: string[] = [];
    for (const e of enrollmentList) {
      const sid = studentIds[e.roll];
      for (const c of e.courses) {
        const coid = offeringMap[c];
        for (const dt of dates) {
          const rand = Math.random();
          const status = rand > 0.2 ? 'present' : rand > 0.1 ? 'late' : 'absent';
          attendanceInserts.push(`('${sid}', '${coid}', '${dt}', '${status}')`);
        }
      }
    }
    await pool.query(`INSERT INTO academic_attendance (student_id, course_offering_id, date, status) VALUES ${attendanceInserts.join(', ')}`);

    // ── 11. Exam: Grade Scale & Types ──
    await pool.query(`
      INSERT INTO exam_grade_scale (grade_code, grade_points, min_marks, max_marks, effective_from) VALUES
        ('A+', 10.0, 90, 100, '2020-01-01'),
        ('A', 9.0, 80, 89, '2020-01-02'),
        ('B+', 8.0, 70, 79, '2020-01-03'),
        ('B', 7.0, 60, 69, '2020-01-04'),
        ('C+', 6.0, 50, 59, '2020-01-05'),
        ('C', 5.0, 40, 49, '2020-01-06'),
        ('F', 0.0, 0, 39, '2020-01-07')
    `);

    const examTypesRes = await pool.query(`
      INSERT INTO exam_exam_types (name, code) VALUES ('Mid Semester', 'MID'), ('End Semester', 'END') RETURNING id, code
    `);
    const examTypeMap: Record<string, string> = {};
    for (const row of examTypesRes.rows) examTypeMap[row.code] = row.id;

    // ── 12. Exam: Exams, Marks, Results ──
    const examInserts = Object.keys(offeringMap).map(
      (code) => `('${offeringMap[code]}', '${examTypeMap['MID']}', 'Mid Term - ${code}', 100, 30.0, '2025-10-15', '${code}')`
    );
    const examsRes = await pool.query(`
      INSERT INTO exam_exams (course_offering_id, exam_type_id, name, max_marks, weightage_percent, scheduled_at, room_no) VALUES
        ${examInserts.join(', ')}
      RETURNING id, room_no
    `);
    const examMap: Record<string, string> = {};
    for (const row of examsRes.rows) examMap[row.room_no] = row.id;

    const marksInserts: string[] = [];
    const resultsInserts: string[] = [];
    for (const e of enrollmentList) {
      for (const c of e.courses) {
        const marks = 60 + Math.floor(Math.random() * 35);
        const grade = marks >= 90 ? 'A+' : marks >= 80 ? 'A' : marks >= 70 ? 'B+' : marks >= 60 ? 'B' : marks >= 50 ? 'C+' : marks >= 40 ? 'C' : 'F';
        const gp = marks >= 90 ? 10.0 : marks >= 80 ? 9.0 : marks >= 70 ? 8.0 : marks >= 60 ? 7.0 : marks >= 50 ? 6.0 : marks >= 40 ? 5.0 : 0.0;
        marksInserts.push(`('${examMap[c]}', '${studentIds[e.roll]}', ${marks}, '${userMap['dr.kumar@unicore.edu']}')`);
        resultsInserts.push(`('${studentIds[e.roll]}', '${offeringMap[c]}', ${marks}, '${grade}', ${gp})`);
      }
    }
    await pool.query(`INSERT INTO exam_marks (exam_id, student_id, marks_obtained, graded_by) VALUES ${marksInserts.join(', ')}`);
    await pool.query(`INSERT INTO exam_final_results (student_id, course_offering_id, total_marks, grade_code, grade_points) VALUES ${resultsInserts.join(', ')}`);

    // ── 13. Hostel ──
    const hostelRes = await pool.query(`
      INSERT INTO hostel_hostels (name, code, gender_type) VALUES
        ('Tagore Hall', 'TH', 'male'),
        ('Raman Hall', 'RH', 'female')
      RETURNING id, code
    `);
    const hostelMap: Record<string, string> = {};
    for (const row of hostelRes.rows) hostelMap[row.code] = row.id;

    const blocksRes = await pool.query(`
      INSERT INTO hostel_blocks (hostel_id, name, floor_count) VALUES
        ('${hostelMap['TH']}', 'Block A', 5),
        ('${hostelMap['RH']}', 'Block B', 4)
      RETURNING id, name
    `);
    const blockMap: Record<string, string> = {};
    for (const row of blocksRes.rows) blockMap[row.name] = row.id;

    const roomInserts = [
      `('${blockMap['Block A']}', '101', 1, 2)`,
      `('${blockMap['Block A']}', '102', 1, 2)`,
      `('${blockMap['Block A']}', '201', 2, 2)`,
      `('${blockMap['Block A']}', '202', 2, 2)`,
      `('${blockMap['Block A']}', '301', 3, 2)`,
      `('${blockMap['Block B']}', '302', 3, 2)`,
      `('${blockMap['Block B']}', '401', 4, 2)`,
      `('${blockMap['Block B']}', '402', 4, 2)`,
      `('${blockMap['Block B']}', '501', 5, 2)`,
      `('${blockMap['Block B']}', '502', 5, 2)`,
    ];
    const roomsRes = await pool.query(`
      INSERT INTO hostel_rooms (block_id, room_no, floor_no, capacity) VALUES
        ${roomInserts.join(', ')}
      RETURNING id, room_no
    `);
    const roomMap: Record<string, string> = {};
    for (const row of roomsRes.rows) roomMap[row.room_no] = row.id;

    const bedInserts = Object.keys(roomMap).map((rNo) => `('${roomMap[rNo]}', 'A', '${rNo}')`);
    const bedsRes = await pool.query(`
      INSERT INTO hostel_beds (room_id, bed_label, qr_code_id) VALUES
        ${bedInserts.join(', ')}
      RETURNING id, qr_code_id
    `);
    const bedMap: Record<string, string> = {};
    for (const row of bedsRes.rows) bedMap[row.qr_code_id] = row.id;

    const allocations = [
      `('${studentIds['1024030440']}', '${bedMap['301']}')`,
      `('${studentIds['1024030441']}', '${bedMap['302']}')`,
      `('${studentIds['1024030442']}', '${bedMap['101']}')`,
      `('${studentIds['1024030443']}', '${bedMap['201']}')`,
      `('${studentIds['1024030446']}', '${bedMap['401']}')`,
      `('${studentIds['1024030447']}', '${bedMap['102']}')`,
      `('${studentIds['1024030448']}', '${bedMap['202']}')`,
    ];
    await pool.query(`INSERT INTO hostel_allocations (student_id, bed_id) VALUES ${allocations.join(', ')}`);

    await pool.query(`
      INSERT INTO hostel_complaints (student_id, category, description, status, priority) VALUES
        ('${studentIds['1024030440']}', 'Electrical', 'The ceiling fan in room 301 is not working', 'pending', 'medium'),
        ('${studentIds['1024030441']}', 'Cleaning', 'Washroom on 3rd floor needs cleaning', 'in_progress', 'high')
    `);

    await pool.query(`
      INSERT INTO hostel_outpasses (student_id, destination, out_time, in_time, reason, status) VALUES
        ('${studentIds['1024030440']}', 'Home', '2025-10-01 09:00:00', '2025-10-03 18:00:00', 'Family function', 'approved'),
        ('${studentIds['1024030442']}', 'City Clinic', '2025-10-05 10:00:00', '2025-10-05 16:00:00', 'Medical appointment', 'pending')
    `);

    // ── 14. Library ──
    const booksRes = await pool.query(`
      INSERT INTO library_books (isbn, title) VALUES
        ('9781449373320', 'Designing Data-Intensive Applications'),
        ('9780134685991', 'Effective Java'),
        ('9780596517748', 'JavaScript: The Good Parts'),
        ('9780262046305', 'Introduction to Algorithms'),
        ('9781491950357', 'JavaScript Patterns'),
        ('9780201633610', 'Design Patterns'),
        ('9780134757599', 'Refactoring'),
        ('9780596007126', 'Head First Design Patterns')
      RETURNING id, isbn
    `);
    const bookMap: Record<string, string> = {};
    for (const row of booksRes.rows) bookMap[row.isbn] = row.id;

    const copyInserts: string[] = [];
    for (const isbn of Object.keys(bookMap)) {
      for (let c = 1; c <= 2; c++) {
        copyInserts.push(`('${bookMap[isbn]}', '${isbn.slice(-4)}-${c}')`);
      }
    }
    const copiesRes = await pool.query(`
      INSERT INTO library_book_copies (book_id, barcode) VALUES
        ${copyInserts.join(', ')}
      RETURNING id
    `);
    const copyIds = copiesRes.rows.map((r: any) => r.id);

    const issuesRes = await pool.query(`
      INSERT INTO library_issues (copy_id, member_user_id, issued_by, due_at) VALUES
        ('${copyIds[0]}', '${userMap['abhinav@unicore.edu']}', '${userMap['admin@unicore.edu']}', '2026-10-15 00:00:00'),
        ('${copyIds[1]}', '${userMap['priya@unicore.edu']}', '${userMap['admin@unicore.edu']}', '2026-10-20 00:00:00'),
        ('${copyIds[2]}', '${userMap['rahul@unicore.edu']}', '${userMap['admin@unicore.edu']}', '2026-09-30 00:00:00')
      RETURNING id
    `);
    const issueIds = issuesRes.rows.map((r: any) => r.id);

    await pool.query(`
      INSERT INTO library_fines (issue_id, member_user_id, amount, reason, settled_at) VALUES
        ('${issueIds[0]}', '${userMap['sneha@unicore.edu']}', 50.00, 'overdue', NULL),
        ('${issueIds[1]}', '${userMap['amit@unicore.edu']}', 25.00, 'overdue', CURRENT_TIMESTAMP)
    `);

    // ── 15. Summary Counts ──
    const counts = await pool.query(`
      SELECT
        (SELECT count(*) FROM auth_users) as users,
        (SELECT count(*) FROM academic_students) as students,
        (SELECT count(*) FROM academic_faculty) as faculty,
        (SELECT count(*) FROM academic_departments) as departments,
        (SELECT count(*) FROM academic_courses) as courses,
        (SELECT count(*) FROM academic_enrollments) as enrollments,
        (SELECT count(*) FROM academic_attendance) as attendance_records,
        (SELECT count(*) FROM exam_final_results) as results,
        (SELECT count(*) FROM hostel_allocations) as hostel_allocations,
        (SELECT count(*) FROM library_issues) as library_issues,
        (SELECT count(*) FROM library_books) as books
    `);

    res.json({ message: 'Database seeded successfully', counts: counts.rows[0] || {} });
  } catch (err) {
    console.error('Seed error:', err);
    res.status(500).json({ error: 'Seed failed', details: (err as Error).message });
  }
};
