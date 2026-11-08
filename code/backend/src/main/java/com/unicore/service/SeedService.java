package com.unicore.service;

import com.unicore.entity.*;
import com.unicore.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class SeedService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final UserRoleRepository userRoleRepository;
    private final DepartmentRepository departmentRepository;
    private final ProgramRepository programRepository;
    private final FacultyRepository facultyRepository;
    private final StudentRepository studentRepository;
    private final SemesterRepository semesterRepository;
    private final CourseRepository courseRepository;
    private final CourseOfferingRepository courseOfferingRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final AttendanceRepository attendanceRepository;
    private final HostelRepository hostelRepository;
    private final HostelBlockRepository hostelBlockRepository;
    private final HostelRoomRepository hostelRoomRepository;
    private final HostelBedRepository hostelBedRepository;
    private final HostelAllocationRepository hostelAllocationRepository;
    private final LibraryBookRepository libraryBookRepository;
    private final LibraryBookCopyRepository libraryBookCopyRepository;
    private final LibraryIssueRepository libraryIssueRepository;
    private final LibraryFineRepository libraryFineRepository;
    private final GradeScaleRepository gradeScaleRepository;
    private final FinalResultRepository finalResultRepository;

    public SeedService(
            UserRepository userRepository,
            RoleRepository roleRepository,
            UserRoleRepository userRoleRepository,
            DepartmentRepository departmentRepository,
            ProgramRepository programRepository,
            FacultyRepository facultyRepository,
            StudentRepository studentRepository,
            SemesterRepository semesterRepository,
            CourseRepository courseRepository,
            CourseOfferingRepository courseOfferingRepository,
            EnrollmentRepository enrollmentRepository,
            AttendanceRepository attendanceRepository,
            HostelRepository hostelRepository,
            HostelBlockRepository hostelBlockRepository,
            HostelRoomRepository hostelRoomRepository,
            HostelBedRepository hostelBedRepository,
            HostelAllocationRepository hostelAllocationRepository,
            LibraryBookRepository libraryBookRepository,
            LibraryBookCopyRepository libraryBookCopyRepository,
            LibraryIssueRepository libraryIssueRepository,
            LibraryFineRepository libraryFineRepository,
            GradeScaleRepository gradeScaleRepository,
            FinalResultRepository finalResultRepository
    ) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.userRoleRepository = userRoleRepository;
        this.departmentRepository = departmentRepository;
        this.programRepository = programRepository;
        this.facultyRepository = facultyRepository;
        this.studentRepository = studentRepository;
        this.semesterRepository = semesterRepository;
        this.courseRepository = courseRepository;
        this.courseOfferingRepository = courseOfferingRepository;
        this.enrollmentRepository = enrollmentRepository;
        this.attendanceRepository = attendanceRepository;
        this.hostelRepository = hostelRepository;
        this.hostelBlockRepository = hostelBlockRepository;
        this.hostelRoomRepository = hostelRoomRepository;
        this.hostelBedRepository = hostelBedRepository;
        this.hostelAllocationRepository = hostelAllocationRepository;
        this.libraryBookRepository = libraryBookRepository;
        this.libraryBookCopyRepository = libraryBookCopyRepository;
        this.libraryIssueRepository = libraryIssueRepository;
        this.libraryFineRepository = libraryFineRepository;
        this.gradeScaleRepository = gradeScaleRepository;
        this.finalResultRepository = finalResultRepository;
    }

    @Transactional
    public void seedAll() {
        // 1. Clean existing records
        libraryFineRepository.deleteAllInBatch();
        libraryIssueRepository.deleteAllInBatch();
        libraryBookCopyRepository.deleteAllInBatch();
        libraryBookRepository.deleteAllInBatch();
        hostelAllocationRepository.deleteAllInBatch();
        hostelBedRepository.deleteAllInBatch();
        hostelRoomRepository.deleteAllInBatch();
        hostelBlockRepository.deleteAllInBatch();
        hostelRepository.deleteAllInBatch();
        finalResultRepository.deleteAllInBatch();
        gradeScaleRepository.deleteAllInBatch();
        attendanceRepository.deleteAllInBatch();
        enrollmentRepository.deleteAllInBatch();
        courseOfferingRepository.deleteAllInBatch();
        courseRepository.deleteAllInBatch();
        semesterRepository.deleteAllInBatch();
        studentRepository.deleteAllInBatch();
        facultyRepository.deleteAllInBatch();
        programRepository.deleteAllInBatch();
        departmentRepository.deleteAllInBatch();
        userRoleRepository.deleteAllInBatch();
        roleRepository.deleteAllInBatch();
        userRepository.deleteAllInBatch();

        // 2. Roles
        Role adminRole = roleRepository.save(new Role("ADMIN", "admin", "System administrator"));
        Role facultyRole = roleRepository.save(new Role("FACULTY", "faculty", "Teaching faculty"));
        Role studentRole = roleRepository.save(new Role("STUDENT", "student", "Enrolled student"));
        Role staffRole = roleRepository.save(new Role("STAFF", "staff", "University staff"));

        // 3. Users
        String pwHash = "$2b$10$dummyHashForPrototypeEnvironmentOnly";
        User admin = userRepository.save(new User("admin@unicore.edu", "System", "Admin", pwHash, "active"));
        User abhinav = userRepository.save(new User("abhinav@unicore.edu", "Abhinav", "Kumar", pwHash, "active"));
        User priya = userRepository.save(new User("priya@unicore.edu", "Priya", "Sharma", pwHash, "active"));
        User rahul = userRepository.save(new User("rahul@unicore.edu", "Rahul", "Verma", pwHash, "active"));
        User sneha = userRepository.save(new User("sneha@unicore.edu", "Sneha", "Patel", pwHash, "active"));
        User amit = userRepository.save(new User("amit@unicore.edu", "Amit", "Gupta", pwHash, "active"));
        User neha = userRepository.save(new User("neha@unicore.edu", "Neha", "Joshi", pwHash, "active"));
        User vikram = userRepository.save(new User("vikram@unicore.edu", "Vikram", "Malhotra", pwHash, "active"));
        User ananya = userRepository.save(new User("ananya@unicore.edu", "Ananya", "Deshmukh", pwHash, "active"));
        User rohan = userRepository.save(new User("rohan@unicore.edu", "Rohan", "Mehta", pwHash, "active"));
        User kavita = userRepository.save(new User("kavita@unicore.edu", "Kavita", "Nair", pwHash, "active"));

        User drKumar = userRepository.save(new User("dr.kumar@unicore.edu", "Dr. Rajesh", "Kumar", pwHash, "active"));
        User drSingh = userRepository.save(new User("dr.singh@unicore.edu", "Dr. Meena", "Singh", pwHash, "active"));
        User drSharma = userRepository.save(new User("dr.sharma@unicore.edu", "Dr. Anil", "Sharma", pwHash, "active"));
        User drPatel = userRepository.save(new User("dr.patel@unicore.edu", "Dr. Sunita", "Patel", pwHash, "active"));
        User drReddy = userRepository.save(new User("dr.reddy@unicore.edu", "Dr. Venkat", "Reddy", pwHash, "active"));

        User staff1 = userRepository.save(new User("staff1@unicore.edu", "Ramesh", "Yadav", pwHash, "active"));
        User staff2 = userRepository.save(new User("staff2@unicore.edu", "Suresh", "Pillai", pwHash, "active"));

        // 4. Assign Roles
        userRoleRepository.save(new UserRole(admin.getId(), adminRole.getId()));
        userRoleRepository.save(new UserRole(staff1.getId(), staffRole.getId()));
        userRoleRepository.save(new UserRole(staff2.getId(), staffRole.getId()));

        userRoleRepository.save(new UserRole(drKumar.getId(), facultyRole.getId()));
        userRoleRepository.save(new UserRole(drSingh.getId(), facultyRole.getId()));
        userRoleRepository.save(new UserRole(drSharma.getId(), facultyRole.getId()));
        userRoleRepository.save(new UserRole(drPatel.getId(), facultyRole.getId()));
        userRoleRepository.save(new UserRole(drReddy.getId(), facultyRole.getId()));

        List<User> students = List.of(abhinav, priya, rahul, sneha, amit, neha, vikram, ananya, rohan, kavita);
        for (User s : students) {
            userRoleRepository.save(new UserRole(s.getId(), studentRole.getId()));
        }

        // 5. Departments
        Department cse = departmentRepository.save(new Department("CSE", "Computer Science & Engineering"));
        Department ece = departmentRepository.save(new Department("ECE", "Electronics & Communication"));
        Department me = departmentRepository.save(new Department("ME", "Mechanical Engineering"));
        Department ce = departmentRepository.save(new Department("CE", "Civil Engineering"));
        Department ee = departmentRepository.save(new Department("EE", "Electrical Engineering"));

        // 6. Programs
        Program btechCse = programRepository.save(new Program(cse.getId(), "BTECH-CSE", "B.Tech Computer Science", "BTech", 8));
        Program btechEce = programRepository.save(new Program(ece.getId(), "BTECH-ECE", "B.Tech Electronics", "BTech", 8));
        Program btechMe = programRepository.save(new Program(me.getId(), "BTECH-ME", "B.Tech Mechanical", "BTech", 8));
        Program btechCe = programRepository.save(new Program(ce.getId(), "BTECH-CE", "B.Tech Civil", "BTech", 8));
        Program btechEe = programRepository.save(new Program(ee.getId(), "BTECH-EE", "B.Tech Electrical", "BTech", 8));

        // 7. Faculty
        facultyRepository.save(new Faculty(drKumar.getId(), "FAC001", cse.getId(), "Professor"));
        facultyRepository.save(new Faculty(drSingh.getId(), "FAC002", ece.getId(), "Associate Professor"));
        facultyRepository.save(new Faculty(drSharma.getId(), "FAC003", me.getId(), "Professor"));
        facultyRepository.save(new Faculty(drPatel.getId(), "FAC004", ce.getId(), "Assistant Professor"));
        facultyRepository.save(new Faculty(drReddy.getId(), "FAC005", ee.getId(), "Professor"));

        // 8. Students
        Student studentAbhinav = studentRepository.save(new Student(abhinav.getId(), "1024030440", cse.getId(), btechCse.getId(), 2024, 3));
        studentRepository.save(new Student(priya.getId(), "1024030441", cse.getId(), btechCse.getId(), 2024, 3));
        studentRepository.save(new Student(rahul.getId(), "1024030442", ece.getId(), btechEce.getId(), 2024, 3));
        studentRepository.save(new Student(sneha.getId(), "1024030443", me.getId(), btechMe.getId(), 2023, 5));
        studentRepository.save(new Student(amit.getId(), "1024030444", ce.getId(), btechCe.getId(), 2023, 5));
        studentRepository.save(new Student(neha.getId(), "1024030445", ee.getId(), btechEe.getId(), 2022, 7));
        studentRepository.save(new Student(vikram.getId(), "1024030446", cse.getId(), btechCse.getId(), 2022, 7));
        studentRepository.save(new Student(ananya.getId(), "1024030447", ece.getId(), btechEce.getId(), 2023, 5));
        studentRepository.save(new Student(rohan.getId(), "1024030448", me.getId(), btechMe.getId(), 2024, 3));
        studentRepository.save(new Student(kavita.getId(), "1024030449", ce.getId(), btechCe.getId(), 2022, 7));

        // 9. Semesters & Courses
        Semester fall2025 = semesterRepository.save(new Semester("FALL2025", "Fall 2025", 2025, "2025-08-01", "2025-12-15", 1));
        semesterRepository.save(new Semester("SPRING2026", "Spring 2026", 2026, "2026-01-15", "2026-05-30", 0));

        Course cs301 = courseRepository.save(new Course("CS301", "Distributed Systems", 4, cse.getId()));
        Course cs302 = courseRepository.save(new Course("CS302", "Cloud Computing", 3, cse.getId()));
        Course cs303 = courseRepository.save(new Course("CS303", "Database Management Systems", 4, cse.getId()));
        Course cs304 = courseRepository.save(new Course("CS304", "Machine Learning", 4, cse.getId()));
        courseRepository.save(new Course("EC301", "Signal Processing", 3, ece.getId()));
        courseRepository.save(new Course("EC302", "VLSI Design", 4, ece.getId()));
        courseRepository.save(new Course("ME301", "Thermodynamics", 3, me.getId()));
        courseRepository.save(new Course("ME302", "Fluid Mechanics", 4, me.getId()));
        courseRepository.save(new Course("CE301", "Structural Analysis", 4, ce.getId()));
        courseRepository.save(new Course("EE301", "Power Systems", 3, ee.getId()));

        CourseOffering off1 = courseOfferingRepository.save(new CourseOffering(cs301.getId(), fall2025.getId(), null));
        CourseOffering off2 = courseOfferingRepository.save(new CourseOffering(cs302.getId(), fall2025.getId(), null));
        CourseOffering off3 = courseOfferingRepository.save(new CourseOffering(cs303.getId(), fall2025.getId(), null));
        CourseOffering off4 = courseOfferingRepository.save(new CourseOffering(cs304.getId(), fall2025.getId(), null));

        // 10. Enrollments & Attendance
        enrollmentRepository.save(new Enrollment(studentAbhinav.getId(), off1.getId(), "enrolled"));
        enrollmentRepository.save(new Enrollment(studentAbhinav.getId(), off2.getId(), "enrolled"));
        enrollmentRepository.save(new Enrollment(studentAbhinav.getId(), off3.getId(), "enrolled"));
        enrollmentRepository.save(new Enrollment(studentAbhinav.getId(), off4.getId(), "enrolled"));

        attendanceRepository.save(new Attendance(studentAbhinav.getId(), off1.getId(), "2025-09-01", "present"));
        attendanceRepository.save(new Attendance(studentAbhinav.getId(), off1.getId(), "2025-09-03", "present"));
        attendanceRepository.save(new Attendance(studentAbhinav.getId(), off1.getId(), "2025-09-05", "absent"));
        attendanceRepository.save(new Attendance(studentAbhinav.getId(), off2.getId(), "2025-09-02", "present"));
        attendanceRepository.save(new Attendance(studentAbhinav.getId(), off2.getId(), "2025-09-04", "late"));
        attendanceRepository.save(new Attendance(studentAbhinav.getId(), off3.getId(), "2025-09-01", "present"));
        attendanceRepository.save(new Attendance(studentAbhinav.getId(), off4.getId(), "2025-09-02", "present"));

        // 11. Grade Scale & Final Results
        gradeScaleRepository.save(new GradeScale("A+", 10.0, 90.0, 100.0));
        gradeScaleRepository.save(new GradeScale("A", 9.0, 80.0, 89.9));
        gradeScaleRepository.save(new GradeScale("B+", 8.0, 70.0, 79.9));
        gradeScaleRepository.save(new GradeScale("B", 7.0, 60.0, 69.9));
        gradeScaleRepository.save(new GradeScale("C", 6.0, 50.0, 59.9));
        gradeScaleRepository.save(new GradeScale("F", 0.0, 0.0, 49.9));

        finalResultRepository.save(new FinalResult(studentAbhinav.getId(), off1.getId(), 73.0, "B+"));
        finalResultRepository.save(new FinalResult(studentAbhinav.getId(), off2.getId(), 94.0, "A+"));
        finalResultRepository.save(new FinalResult(studentAbhinav.getId(), off3.getId(), 71.0, "B+"));
        finalResultRepository.save(new FinalResult(studentAbhinav.getId(), off4.getId(), 62.0, "B"));

        // 12. Hostel
        Hostel hostel = hostelRepository.save(new Hostel("TAGORE", "Tagore Hall"));
        hostelRepository.save(new Hostel("NEHRU", "Nehru Hall"));

        HostelBlock blockA = hostelBlockRepository.save(new HostelBlock(hostel.getId(), "Block A"));
        HostelRoom room301 = hostelRoomRepository.save(new HostelRoom(blockA.getId(), "301", 2));
        HostelBed bed1 = hostelBedRepository.save(new HostelBed(room301.getId(), "Bed-1", "occupied"));
        hostelBedRepository.save(new HostelBed(room301.getId(), "Bed-2", "available"));

        hostelAllocationRepository.save(new HostelAllocation(studentAbhinav.getId(), bed1.getId(), "active"));

        // 13. Library
        LibraryBook book1 = libraryBookRepository.save(new LibraryBook("978-1449373320", "Designing Data-Intensive Applications"));
        libraryBookRepository.save(new LibraryBook("978-0132350884", "Clean Code: A Handbook of Agile Software Craftsmanship"));

        LibraryBookCopy copy1 = libraryBookCopyRepository.save(new LibraryBookCopy(book1.getId(), "DDIA-001", "issued"));
        libraryIssueRepository.save(new LibraryIssue(copy1.getId(), abhinav.getId(), LocalDateTime.now().minusDays(10), LocalDateTime.now().plusDays(5), null));

        libraryFineRepository.save(new LibraryFine(abhinav.getId(), 0.0, "No fines currently outstanding", LocalDateTime.now()));
    }
}
