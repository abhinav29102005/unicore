import { Request, Response } from 'express';
import pool from '../config/db';

export const seedDatabase = async (_req: Request, res: Response) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // ── Truncate all data (cascade) for idempotency ──
    await client.query(`TRUNCATE auth.users CASCADE`);
    await client.query(`TRUNCATE academic.departments CASCADE`);
    await client.query(`TRUNCATE exam.grade_scale CASCADE`);
    await client.query(`TRUNCATE exam.exam_types CASCADE`);
    await client.query(`TRUNCATE hostel.hostels CASCADE`);
    await client.query(`TRUNCATE library.books CASCADE`);
    await client.query(`TRUNCATE auth.roles CASCADE`);

    // ── Auth: Roles ──
    await client.query(`
      INSERT INTO auth.roles (code, name, description, is_system) VALUES
        ('ADMIN', 'admin', 'System administrator', true),
        ('FACULTY', 'faculty', 'Teaching faculty', true),
        ('STUDENT', 'student', 'Enrolled student', true),
        ('STAFF', 'staff', 'University staff', true)
    `);

    // ── Auth: Users ──
    const pwHash = '$2b$10$abcdefghijklmnopqrstuuABCDEFGHIJKLMNOPQRSTUVWXYZ012345';

    const usersRes = await client.query(`
      INSERT INTO auth.users (email, first_name, last_name, password_hash, status) VALUES
        ('admin@unicore.edu', 'System', 'Admin', $1, 'active'),
        ('abhinav@unicore.edu', 'Abhinav Kumar', 'Singh', $1, 'active'),
        ('priya@unicore.edu', 'Priya', 'Sharma', $1, 'active'),
        ('rahul@unicore.edu', 'Rahul', 'Verma', $1, 'active'),
        ('sneha@unicore.edu', 'Sneha', 'Patel', $1, 'active'),
        ('amit@unicore.edu', 'Amit', 'Gupta', $1, 'active'),
        ('neha@unicore.edu', 'Neha', 'Reddy', $1, 'active'),
        ('vikram@unicore.edu', 'Vikram', 'Joshi', $1, 'active'),
        ('ananya@unicore.edu', 'Ananya', 'Iyer', $1, 'active'),
        ('rohan@unicore.edu', 'Rohan', 'Deshmukh', $1, 'active'),
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

    // ── Auth: Assign roles ──
    const adminRoleId = (await client.query(`SELECT id FROM auth.roles WHERE code = 'ADMIN'`)).rows[0].id;
    const facultyRoleId = (await client.query(`SELECT id FROM auth.roles WHERE code = 'FACULTY'`)).rows[0].id;
    const studentRoleId = (await client.query(`SELECT id FROM auth.roles WHERE code = 'STUDENT'`)).rows[0].id;
    const staffRoleId = (await client.query(`SELECT id FROM auth.roles WHERE code = 'STAFF'`)).rows[0].id;

    await client.query(`INSERT INTO auth.user_roles (user_id, role_id) VALUES ($1, $2)`, [userMap['admin@unicore.edu'], adminRoleId]);
    await client.query(`INSERT INTO auth.user_roles (user_id, role_id) VALUES ($1, $2)`, [userMap['staff1@unicore.edu'], staffRoleId]);
    await client.query(`INSERT INTO auth.user_roles (user_id, role_id) VALUES ($1, $2)`, [userMap['staff2@unicore.edu'], staffRoleId]);

    for (const email of ['dr.kumar@unicore.edu', 'dr.singh@unicore.edu', 'dr.sharma@unicore.edu', 'dr.patel@unicore.edu', 'dr.reddy@unicore.edu']) {
      await client.query(`INSERT INTO auth.user_roles (user_id, role_id) VALUES ($1, $2)`, [userMap[email], facultyRoleId]);
    }

    for (const email of ['abhinav@unicore.edu', 'priya@unicore.edu', 'rahul@unicore.edu', 'sneha@unicore.edu', 'amit@unicore.edu', 'neha@unicore.edu', 'vikram@unicore.edu', 'ananya@unicore.edu', 'rohan@unicore.edu', 'kavita@unicore.edu']) {
      await client.query(`INSERT INTO auth.user_roles (user_id, role_id) VALUES ($1, $2)`, [userMap[email], studentRoleId]);
    }

    // ── Academic: Departments ──
    const deptsRes = await client.query(`
      INSERT INTO academic.departments (code, name) VALUES
        ('CSE', 'Computer Science & Engineering'),
        ('ECE', 'Electronics & Communication'),
        ('ME', 'Mechanical Engineering'),
        ('CE', 'Civil Engineering'),
        ('EE', 'Electrical Engineering')
      RETURNING id, code
    `);
    const deptMap: Record<string, string> = {};
    for (const row of deptsRes.rows) deptMap[row.code] = row.id;

    // ── Academic: Programs ──
    const progsRes = await client.query(`
      INSERT INTO academic.programs (department_id, code, name, degree_type, duration_semesters) VALUES
        ($1, 'BTECH-CSE', 'B.Tech Computer Science', 'BTech', 8),
        ($2, 'BTECH-ECE', 'B.Tech Electronics', 'BTech', 8),
        ($3, 'BTECH-ME', 'B.Tech Mechanical', 'BTech', 8),
        ($4, 'BTECH-CE', 'B.Tech Civil', 'BTech', 8),
        ($5, 'BTECH-EE', 'B.Tech Electrical', 'BTech', 8)
      RETURNING id, code
    `, [deptMap['CSE'], deptMap['ECE'], deptMap['ME'], deptMap['CE'], deptMap['EE']]);
    const progMap: Record<string, string> = {};
    for (const row of progsRes.rows) progMap[row.code] = row.id;

    // ── Academic: Faculty ──
    const facultyData = [
      { email: 'dr.kumar@unicore.edu', empNo: 'FAC001', dept: 'CSE', designation: 'Professor' },
      { email: 'dr.singh@unicore.edu', empNo: 'FAC002', dept: 'ECE', designation: 'Associate Professor' },
      { email: 'dr.sharma@unicore.edu', empNo: 'FAC003', dept: 'ME', designation: 'Professor' },
      { email: 'dr.patel@unicore.edu', empNo: 'FAC004', dept: 'CE', designation: 'Assistant Professor' },
      { email: 'dr.reddy@unicore.edu', empNo: 'FAC005', dept: 'EE', designation: 'Professor' },
    ];
    const facultyIds: Record<string, string> = {};
    for (const f of facultyData) {
      const r = await client.query(
        `INSERT INTO academic.faculty (user_id, employee_no, department_id, designation) VALUES ($1, $2, $3, $4) RETURNING id`,
        [userMap[f.email], f.empNo, deptMap[f.dept], f.designation]
      );
      facultyIds[f.empNo] = r.rows[0].id;
    }

    // ── Academic: Students ──
    const studentData = [
      { email: 'abhinav@unicore.edu', roll: '1024030440', dept: 'CSE', prog: 'BTECH-CSE', year: 2024, sem: 3 },
      { email: 'priya@unicore.edu', roll: '1024030441', dept: 'CSE', prog: 'BTECH-CSE', year: 2024, sem: 3 },
      { email: 'rahul@unicore.edu', roll: '1024030442', dept: 'ECE', prog: 'BTECH-ECE', year: 2024, sem: 3 },
      { email: 'sneha@unicore.edu', roll: '1024030443', dept: 'ME', prog: 'BTECH-ME', year: 2023, sem: 5 },
      { email: 'amit@unicore.edu', roll: '1024030444', dept: 'CE', prog: 'BTECH-CE', year: 2023, sem: 5 },
      { email: 'neha@unicore.edu', roll: '1024030445', dept: 'EE', prog: 'BTECH-EE', year: 2022, sem: 7 },
      { email: 'vikram@unicore.edu', roll: '1024030446', dept: 'CSE', prog: 'BTECH-CSE', year: 2022, sem: 7 },
      { email: 'ananya@unicore.edu', roll: '1024030447', dept: 'ECE', prog: 'BTECH-ECE', year: 2023, sem: 5 },
      { email: 'rohan@unicore.edu', roll: '1024030448', dept: 'ME', prog: 'BTECH-ME', year: 2024, sem: 3 },
      { email: 'kavita@unicore.edu', roll: '1024030449', dept: 'CE', prog: 'BTECH-CE', year: 2022, sem: 7 },
    ];
    const studentIds: Record<string, string> = {};
    for (const s of studentData) {
      const r = await client.query(
        `INSERT INTO academic.students (user_id, student_no, department_id, program_id, admission_year, current_semester) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
        [userMap[s.email], s.roll, deptMap[s.dept], progMap[s.prog], s.year, s.sem]
      );
      studentIds[s.roll] = r.rows[0].id;
    }

    // ── Academic: Semesters ──
    const semsRes = await client.query(`
      INSERT INTO academic.semesters (code, name, academic_year, start_date, end_date) VALUES
        ('FALL2025', 'Fall 2025', 2025, '2025-08-01', '2025-12-15'),
        ('SPRING2026', 'Spring 2026', 2026, '2026-01-15', '2026-05-30')
      RETURNING id, code
    `);
    const semMap: Record<string, string> = {};
    for (const row of semsRes.rows) semMap[row.code] = row.id;

    // ── Academic: Courses ──
    const coursesRes = await client.query(`
      INSERT INTO academic.courses (course_code, title, credits, department_id) VALUES
        ('CS301', 'Distributed Systems', 4, $1),
        ('CS302', 'Cloud Computing', 3, $1),
        ('CS303', 'Database Management Systems', 4, $1),
        ('CS304', 'Machine Learning', 4, $1),
        ('EC301', 'Signal Processing', 3, $2),
        ('EC302', 'VLSI Design', 4, $2),
        ('ME301', 'Thermodynamics', 3, $3),
        ('ME302', 'Fluid Mechanics', 4, $3),
        ('CE301', 'Structural Analysis', 4, $4),
        ('EE301', 'Power Systems', 3, $5)
      RETURNING id, course_code
    `, [deptMap['CSE'], deptMap['ECE'], deptMap['ME'], deptMap['CE'], deptMap['EE']]);
    const courseMap: Record<string, string> = {};
    for (const row of coursesRes.rows) courseMap[row.course_code] = row.id;

    // ── Academic: Course Offerings ──
    const offeringMap: Record<string, string> = {};
    for (const code of Object.keys(courseMap)) {
      const r = await client.query(
        `INSERT INTO academic.course_offerings (course_id, semester_id, capacity) VALUES ($1, $2, $3) RETURNING id`,
        [courseMap[code], semMap['FALL2025'], 60]
      );
      offeringMap[code] = r.rows[0].id;
    }

    // ── Academic: Enrollments ──
    const enrollments = [
      { roll: '1024030440', courses: ['CS301', 'CS302', 'CS303', 'CS304'] },
      { roll: '1024030441', courses: ['CS301', 'CS303', 'CS304'] },
      { roll: '1024030442', courses: ['EC301', 'EC302'] },
      { roll: '1024030443', courses: ['ME301', 'ME302'] },
      { roll: '1024030444', courses: ['CE301'] },
      { roll: '1024030445', courses: ['EE301'] },
      { roll: '1024030446', courses: ['CS301', 'CS302'] },
      { roll: '1024030447', courses: ['EC301', 'EC302'] },
      { roll: '1024030448', courses: ['ME301', 'ME302'] },
      { roll: '1024030449', courses: ['CE301'] },
    ];
    for (const e of enrollments) {
      for (const c of e.courses) {
        await client.query(`INSERT INTO academic.enrollments (student_id, course_offering_id) VALUES ($1, $2)`, [studentIds[e.roll], offeringMap[c]]);
      }
    }

    // ── Academic: Attendance (20 days per enrollment - Batch) ──
    const statuses = ['present', 'present', 'present', 'present', 'present', 'present', 'present', 'absent', 'late', 'excused'];
    const attVals: string[] = [];
    const attParams: any[] = [];
    let attIdx = 1;
    for (const e of enrollments) {
      for (const c of e.courses) {
        for (let day = 1; day <= 20; day++) {
          const d = '2025-09-' + String(day).padStart(2, '0');
          const status = statuses[Math.floor(Math.random() * statuses.length)];
          attVals.push(`($${attIdx}, $${attIdx+1}, $${attIdx+2}, $${attIdx+3})`);
          attParams.push(studentIds[e.roll], offeringMap[c], d, status);
          attIdx += 4;
        }
      }
    }
    if (attVals.length > 0) {
      const chunkSize = 2000; 
      for (let i = 0; i < attVals.length; i += chunkSize) {
        const chunkVals = attVals.slice(i, i + chunkSize);
        const chunkParams = attParams.slice(i * 4, (i + chunkSize) * 4);
        
        const reindexedVals = chunkVals.map((_, index) => `($${index*4+1}, $${index*4+2}, $${index*4+3}, $${index*4+4})`);
        
        await client.query(
          `INSERT INTO academic.attendance (student_id, course_offering_id, date, status) VALUES ${reindexedVals.join(',')}`, 
          chunkParams
        );
      }
    }

    // ── Exam: Grade Scale ──
    await client.query(`
      INSERT INTO exam.grade_scale (grade_code, grade_points, min_marks, max_marks, effective_from) VALUES
        ('A+', 10.0, 90, 100, '2020-01-01'), ('A', 9.0, 80, 89, '2020-01-02'), ('B+', 8.0, 70, 79, '2020-01-03'),
        ('B', 7.0, 60, 69, '2020-01-04'), ('C+', 6.0, 50, 59, '2020-01-05'), ('C', 5.0, 40, 49, '2020-01-06'), ('F', 0.0, 0, 39, '2020-01-07');

    // ── Exam: Exam Types ──
    const examTypesRes = await client.query(`
      INSERT INTO exam.exam_types (name, code) VALUES ('Mid Semester', 'MID'), ('End Semester', 'END') RETURNING id, code
    `);
    const examTypeMap: Record<string, string> = {};
    for (const row of examTypesRes.rows) examTypeMap[row.code] = row.id;

    // ── Exam: Exams + Marks + Final Results (batch) ──
    const marksValues: string[] = [];
    const marksParams: any[] = [];
    let mIdx = 1;
    const frValues: string[] = [];
    const frParams: any[] = [];
    let frIdx = 1;

    for (const courseCode of Object.keys(offeringMap)) {
      const midExam = await client.query(
        `INSERT INTO exam.exams (course_offering_id, exam_type_id, max_marks, scheduled_date) VALUES ($1, $2, 100, '2025-10-15') RETURNING id`,
        [offeringMap[courseCode], examTypeMap['MID']]
      );
      const examId = midExam.rows[0].id;

      for (const e of enrollments) {
        if (!e.courses.includes(courseCode)) continue;
        const marks = 55 + Math.floor(Math.random() * 40);
        marksValues.push(`($${mIdx}, $${mIdx+1}, $${mIdx+2}, $${mIdx+3})`);
        marksParams.push(studentIds[e.roll], examId, marks, userMap['dr.kumar@unicore.edu']);
        mIdx += 4;

        const grade = marks >= 90 ? 'A+' : marks >= 80 ? 'A' : marks >= 70 ? 'B+' : marks >= 60 ? 'B' : marks >= 50 ? 'C+' : marks >= 40 ? 'C' : 'F';
        frValues.push(`($${frIdx}, $${frIdx+1}, $${frIdx+2}, $${frIdx+3})`);
        frParams.push(studentIds[e.roll], offeringMap[courseCode], marks, grade);
        frIdx += 4;
      }
    }
    if (marksValues.length > 0) {
      await client.query(`INSERT INTO exam.marks (student_id, exam_id, marks_obtained, graded_by) VALUES ${marksValues.join(', ')}`, marksParams);
    }
    if (frValues.length > 0) {
      await client.query(`INSERT INTO exam.final_results (student_id, course_offering_id, total_marks, grade_code) VALUES ${frValues.join(', ')} ON CONFLICT DO NOTHING`, frParams);
    }

    // ── Hostel ──
    const hostelRes = await client.query(`
      INSERT INTO hostel.hostels (name, code, gender_type) VALUES
        ('Tagore Hall', 'TH', 'male'), ('Raman Hall', 'RH', 'female')
      RETURNING id, code
    `);
    const hostelMap: Record<string, string> = {};
    for (const row of hostelRes.rows) hostelMap[row.code] = row.id;

    const block1 = (await client.query(`INSERT INTO hostel.blocks (hostel_id, name, floor_count) VALUES ($1, 'Block A', 5) RETURNING id`, [hostelMap['TH']])).rows[0].id;
    const block2 = (await client.query(`INSERT INTO hostel.blocks (hostel_id, name, floor_count) VALUES ($1, 'Block B', 4) RETURNING id`, [hostelMap['RH']])).rows[0].id;

    const roomBedMap: Record<string, string> = {};
    const roomNumbers = ['101', '102', '201', '202', '301', '302', '401', '402', '501', '502'];
    for (let i = 0; i < roomNumbers.length; i++) {
      const blockId = i < 5 ? block1 : block2;
      const floor = Math.floor(parseInt(roomNumbers[i]) / 100);
      const roomRes = await client.query(`INSERT INTO hostel.rooms (block_id, room_no, floor_no, capacity) VALUES ($1, $2, $3, 2) RETURNING id`, [blockId, roomNumbers[i], floor]);
      const bedRes = await client.query(`INSERT INTO hostel.beds (room_id, bed_label) VALUES ($1, 'A') RETURNING id`, [roomRes.rows[0].id]);
      roomBedMap[roomNumbers[i]] = bedRes.rows[0].id;
    }

    for (const a of [
      { roll: '1024030440', room: '301' }, { roll: '1024030441', room: '302' },
      { roll: '1024030442', room: '101' }, { roll: '1024030443', room: '201' },
      { roll: '1024030446', room: '401' }, { roll: '1024030447', room: '102' },
      { roll: '1024030448', room: '202' },
    ]) {
      await client.query(`INSERT INTO hostel.allocations (student_id, bed_id) VALUES ($1, $2)`, [studentIds[a.roll], roomBedMap[a.room]]);
    }

    await client.query(`
      INSERT INTO hostel.complaints (student_id, category, subject, description, status) VALUES
        ($1, 'maintenance', 'Broken fan', 'The ceiling fan in room 301 is not working', 'open'),
        ($2, 'cleanliness', 'Washroom issue', 'Washroom on 3rd floor needs cleaning', 'in_progress')
    `, [studentIds['1024030440'], studentIds['1024030441']]);

    await client.query(`
      INSERT INTO hostel.outpasses (student_id, leave_date, return_date, reason, status) VALUES
        ($1, '2025-10-01', '2025-10-03', 'Family function', 'approved'),
        ($2, '2025-10-05', '2025-10-06', 'Medical appointment', 'pending')
    `, [studentIds['1024030440'], studentIds['1024030442']]);

    // ── Library ──
    const booksRes = await client.query(`
      INSERT INTO library.books (isbn, title) VALUES
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

    const copyIds: string[] = [];
    for (const isbn of Object.keys(bookMap)) {
      for (let c = 1; c <= 3; c++) {
        const r = await client.query(`INSERT INTO library.book_copies (book_id, barcode) VALUES ($1, $2) RETURNING id`, [bookMap[isbn], isbn.slice(-4) + '-' + String(c).padStart(2, '0')]);
        copyIds.push(r.rows[0].id);
      }
    }

    await client.query(`
      INSERT INTO library.issues (copy_id, member_user_id, issued_by, due_at) VALUES
        ($1, $2, $3, '2026-10-15'), ($4, $5, $3, '2026-10-20'), ($6, $7, $3, '2026-09-30')
    `, [copyIds[0], userMap['abhinav@unicore.edu'], userMap['admin@unicore.edu'], copyIds[3], userMap['priya@unicore.edu'], copyIds[6], userMap['rahul@unicore.edu']]);

    await client.query(`
      INSERT INTO library.fines (member_user_id, amount, reason, status) VALUES
        ($1, 50.00, 'Late return - 5 days overdue', 'unpaid'), ($2, 25.00, 'Late return - 2 days overdue', 'paid')
    `, [userMap['sneha@unicore.edu'], userMap['amit@unicore.edu']]);

    await client.query('COMMIT');

    const counts = await pool.query(`
      SELECT
        (SELECT count(*) FROM auth.users) as users,
        (SELECT count(*) FROM academic.students) as students,
        (SELECT count(*) FROM academic.faculty) as faculty,
        (SELECT count(*) FROM academic.departments) as departments,
        (SELECT count(*) FROM academic.courses) as courses,
        (SELECT count(*) FROM academic.enrollments) as enrollments,
        (SELECT count(*) FROM academic.attendance) as attendance_records,
        (SELECT count(*) FROM exam.final_results) as results,
        (SELECT count(*) FROM hostel.allocations) as hostel_allocations,
        (SELECT count(*) FROM library.issues) as library_issues,
        (SELECT count(*) FROM library.books) as books
    `);

    res.json({ message: 'Database seeded successfully', counts: counts.rows[0] });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Seed error:', err);
    res.status(500).json({ error: 'Seed failed', details: (err as Error).message });
  } finally {
    client.release();
  }
};
