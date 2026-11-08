package com.unicore.controller;

import com.unicore.entity.User;
import com.unicore.repository.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final FacultyRepository facultyRepository;
    private final CourseRepository courseRepository;
    private final DepartmentRepository departmentRepository;
    private final HostelAllocationRepository hostelAllocationRepository;
    private final HostelBedRepository hostelBedRepository;
    private final LibraryIssueRepository libraryIssueRepository;
    private final LibraryBookRepository libraryBookRepository;
    private final LibraryFineRepository libraryFineRepository;
    private final EnrollmentRepository enrollmentRepository;

    public AdminController(
            UserRepository userRepository,
            StudentRepository studentRepository,
            FacultyRepository facultyRepository,
            CourseRepository courseRepository,
            DepartmentRepository departmentRepository,
            HostelAllocationRepository hostelAllocationRepository,
            HostelBedRepository hostelBedRepository,
            LibraryIssueRepository libraryIssueRepository,
            LibraryBookRepository libraryBookRepository,
            LibraryFineRepository libraryFineRepository,
            EnrollmentRepository enrollmentRepository
    ) {
        this.userRepository = userRepository;
        this.studentRepository = studentRepository;
        this.facultyRepository = facultyRepository;
        this.courseRepository = courseRepository;
        this.departmentRepository = departmentRepository;
        this.hostelAllocationRepository = hostelAllocationRepository;
        this.hostelBedRepository = hostelBedRepository;
        this.libraryIssueRepository = libraryIssueRepository;
        this.libraryBookRepository = libraryBookRepository;
        this.libraryFineRepository = libraryFineRepository;
        this.enrollmentRepository = enrollmentRepository;
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("total_students", studentRepository.countByDeletedAtIsNull());
        stats.put("total_faculty", facultyRepository.count());
        stats.put("total_courses", courseRepository.count());
        stats.put("total_departments", departmentRepository.count());
        stats.put("hostel_occupancy", hostelAllocationRepository.countByStatus("active"));
        stats.put("hostel_capacity", hostelBedRepository.count());
        stats.put("active_issues", libraryIssueRepository.countByReturnedAtIsNull());
        stats.put("total_books", libraryBookRepository.count());
        stats.put("unpaid_fines", libraryFineRepository.countBySettledAtIsNull());
        stats.put("total_enrollments", enrollmentRepository.count());

        return ResponseEntity.ok(stats);
    }

    @GetMapping("/users")
    public ResponseEntity<Map<String, Object>> getUsers(
            @RequestParam(name = "page", defaultValue = "1") int page,
            @RequestParam(name = "limit", defaultValue = "20") int limit
    ) {
        int pageIndex = Math.max(0, page - 1);
        Page<User> userPage = userRepository.findByDeletedAtIsNullOrderByCreatedAtDesc(PageRequest.of(pageIndex, limit));

        List<Map<String, Object>> userList = new ArrayList<>();
        for (User u : userPage.getContent()) {
            Map<String, Object> uMap = new HashMap<>();
            uMap.put("id", u.getId());
            uMap.put("email", u.getEmail());
            uMap.put("name", (u.getFirstName() + " " + u.getLastName()).trim());
            uMap.put("status", u.getStatus());
            uMap.put("last_login_at", u.getLastLoginAt());
            uMap.put("role", userRepository.findRoleNameByUserId(u.getId()));
            userList.add(uMap);
        }

        long total = userPage.getTotalElements();
        int totalPages = userPage.getTotalPages();

        Map<String, Object> pagination = new HashMap<>();
        pagination.put("page", page);
        pagination.put("limit", limit);
        pagination.put("total", total);
        pagination.put("pages", totalPages > 0 ? totalPages : 1);

        Map<String, Object> response = new HashMap<>();
        response.put("users", userList);
        response.put("pagination", pagination);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/departments")
    public ResponseEntity<List<Map<String, Object>>> getDepartments() {
        List<Map<String, Object>> deptSummaries = departmentRepository.getDepartmentSummaries();
        return ResponseEntity.ok(deptSummaries != null ? deptSummaries : Collections.emptyList());
    }
}
