package com.unicore.controller;

import com.unicore.entity.Student;
import com.unicore.repository.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/student")
public class StudentController {

    private final StudentRepository studentRepository;
    private final FinalResultRepository finalResultRepository;
    private final HostelAllocationRepository hostelAllocationRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final LibraryIssueRepository libraryIssueRepository;
    private final AttendanceRepository attendanceRepository;
    private final LibraryFineRepository libraryFineRepository;

    public StudentController(
            StudentRepository studentRepository,
            FinalResultRepository finalResultRepository,
            HostelAllocationRepository hostelAllocationRepository,
            EnrollmentRepository enrollmentRepository,
            LibraryIssueRepository libraryIssueRepository,
            AttendanceRepository attendanceRepository,
            LibraryFineRepository libraryFineRepository
    ) {
        this.studentRepository = studentRepository;
        this.finalResultRepository = finalResultRepository;
        this.hostelAllocationRepository = hostelAllocationRepository;
        this.enrollmentRepository = enrollmentRepository;
        this.libraryIssueRepository = libraryIssueRepository;
        this.attendanceRepository = attendanceRepository;
        this.libraryFineRepository = libraryFineRepository;
    }

    @GetMapping("/{studentNo}/dashboard")
    @org.springframework.security.access.prepost.PreAuthorize("@scope.student(authentication,#studentNo)")
    public ResponseEntity<?> getStudentDashboard(@PathVariable("studentNo") String studentNo) {
        Map<String, Object> studentProfile = studentRepository.findStudentDashboardProfile(studentNo);
        if (studentProfile == null || studentProfile.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Student not found"));
        }

        String studentId = (String) studentProfile.get("id");
        String userId = (String) studentProfile.get("user_id");

        Double gpaVal = finalResultRepository.calculateGpaForStudent(studentId);
        double gpa = (gpaVal != null) ? Math.round(gpaVal * 100.0) / 100.0 : 0.0;

        Map<String, Object> studentMap = new HashMap<>(studentProfile);
        studentMap.put("gpa", gpa);

        Map<String, Object> hostel = hostelAllocationRepository.findActiveHostelAllocation(studentId);
        List<Map<String, Object>> enrollments = enrollmentRepository.findEnrollmentsWithGrades(studentId);
        List<Map<String, Object>> library = libraryIssueRepository.findActiveIssuesByUserId(userId);
        List<Map<String, Object>> attendance = attendanceRepository.findAttendanceSummary(studentId);
        List<Map<String, Object>> fines = libraryFineRepository.findFinesByUserId(userId);

        Map<String, Object> response = new HashMap<>();
        response.put("student", studentMap);
        response.put("hostel", hostel != null && !hostel.isEmpty() ? hostel : null);
        response.put("enrollments", enrollments != null ? enrollments : Collections.emptyList());
        response.put("library", library != null ? library : Collections.emptyList());
        response.put("attendance", attendance != null ? attendance : Collections.emptyList());
        response.put("fines", fines != null ? fines : Collections.emptyList());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{studentNo}/attendance")
    @org.springframework.security.access.prepost.PreAuthorize("@scope.student(authentication,#studentNo)")
    public ResponseEntity<?> getStudentAttendance(@PathVariable("studentNo") String studentNo) {
        Optional<Student> studentOpt = studentRepository.findByStudentNo(studentNo);
        if (studentOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Student not found"));
        }

        String studentId = studentOpt.get().getId();
        List<Map<String, Object>> attendance = attendanceRepository.findDetailedAttendance(studentId);

        return ResponseEntity.ok(Map.of("attendance", attendance != null ? attendance : Collections.emptyList()));
    }

    @GetMapping("/{studentNo}/results")
    @org.springframework.security.access.prepost.PreAuthorize("@scope.student(authentication,#studentNo)")
    public ResponseEntity<?> getStudentResults(@PathVariable("studentNo") String studentNo) {
        Optional<Student> studentOpt = studentRepository.findByStudentNo(studentNo);
        if (studentOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Student not found"));
        }

        String studentId = studentOpt.get().getId();
        List<Map<String, Object>> results = finalResultRepository.findDetailedResultsForStudent(studentId);

        double totalWeighted = 0.0;
        int totalCredits = 0;

        if (results != null) {
            for (Map<String, Object> r : results) {
                Object gpObj = r.get("grade_points");
                Object crObj = r.get("credits");
                double gp = (gpObj instanceof Number) ? ((Number) gpObj).doubleValue() : 0.0;
                int cr = (crObj instanceof Number) ? ((Number) crObj).intValue() : 0;
                totalWeighted += gp * cr;
                totalCredits += cr;
            }
        }

        double cgpa = totalCredits > 0 ? Math.round((totalWeighted / totalCredits) * 100.0) / 100.0 : 0.0;

        Map<String, Object> summary = new HashMap<>();
        summary.put("totalCredits", totalCredits);
        summary.put("cgpa", cgpa);
        summary.put("totalCourses", results != null ? results.size() : 0);

        Map<String, Object> response = new HashMap<>();
        response.put("results", results != null ? results : Collections.emptyList());
        response.put("summary", summary);

        return ResponseEntity.ok(response);
    }
}
