-- UniCore Dummy Data Insertion Script
-- This script contains mock data for testing the application frontend.
-- Do NOT include Turso DB URLs or Auth tokens here.

-- 1. Insert Dummy Students
INSERT INTO students (roll, name, department, year, gpa) VALUES
('1024030440', 'Abhinav Kumar Singh', 'Computer Science', 3, 9.8),
('1024030441', 'Priya Sharma', 'Electrical Engineering', 2, 8.5),
('1024030442', 'Rahul Verma', 'Mechanical Engineering', 4, 7.9),
('1024030443', 'Sneha Gupta', 'Civil Engineering', 1, 9.1),
('1024030444', 'Vikram Singh', 'Computer Science', 3, 8.2);

-- 2. Insert Dummy Hostels
INSERT INTO hostels (student_roll, block, room, status) VALUES
('1024030440', 'Block M', 'Room 405', 'Allotted'),
('1024030441', 'Block G', 'Room 102', 'Allotted'),
('1024030442', 'Block H', 'Room 205', 'Allotted'),
('1024030444', 'Block M', 'Room 410', 'Allotted');

-- 3. Insert Dummy Enrollments
INSERT INTO enrollments (student_roll, course_name, grade) VALUES
('1024030440', 'Distributed Systems', 'A+'),
('1024030440', 'Cloud Computing', 'A'),
('1024030440', 'Database Management', 'A'),
('1024030441', 'Circuit Analysis', 'B+'),
('1024030441', 'Signals and Systems', 'A-'),
('1024030442', 'Thermodynamics', 'B'),
('1024030443', 'Structural Engineering', 'A+'),
('1024030444', 'Operating Systems', 'A-');

-- 4. Insert Dummy Library Books
INSERT INTO library (student_roll, book_title, due_date) VALUES
('1024030440', 'Designing Data-Intensive Applications', '2026-09-30'),
('1024030441', 'Fundamentals of Electric Circuits', '2026-10-15'),
('1024030443', 'Engineering Mechanics', '2026-09-20'),
('1024030444', 'Modern Operating Systems', '2026-09-25');
