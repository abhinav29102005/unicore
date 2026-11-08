package com.unicore.controller;

import com.unicore.repository.FacultyRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/faculty")
public class FacultyController {

    private final FacultyRepository facultyRepository;

    public FacultyController(FacultyRepository facultyRepository) {
        this.facultyRepository = facultyRepository;
    }

    @GetMapping("/{id}/dashboard")
    public ResponseEntity<?> getFacultyDashboard(@PathVariable("id") String id) {
        Map<String, Object> profile = facultyRepository.findFacultyProfile(id);
        if (profile == null || profile.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Faculty not found"));
        }

        String deptCode = (String) profile.get("dept_code");
        List<Map<String, Object>> courses = facultyRepository.findCoursesByDeptCode(deptCode);
        Long totalStudents = facultyRepository.countStudentsByDeptCode(deptCode);

        Map<String, Object> facultyDetails = new HashMap<>();
        facultyDetails.put("id", profile.get("id"));
        facultyDetails.put("name", profile.get("name"));
        facultyDetails.put("email", profile.get("email"));
        facultyDetails.put("employeeNo", profile.get("employee_no"));
        facultyDetails.put("designation", profile.get("designation"));
        facultyDetails.put("department", profile.get("department"));

        Map<String, Object> response = new HashMap<>();
        response.put("faculty", facultyDetails);
        response.put("courses", courses != null ? courses : Collections.emptyList());
        response.put("departmentStudents", totalStudents != null ? totalStudents : 0L);

        return ResponseEntity.ok(response);
    }
}
