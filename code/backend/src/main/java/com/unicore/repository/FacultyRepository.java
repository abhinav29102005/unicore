package com.unicore.repository;

import com.unicore.entity.Faculty;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Repository
public interface FacultyRepository extends JpaRepository<Faculty, String> {
    Optional<Faculty> findByEmployeeNoOrUserId(String employeeNo, String userId);

    @Query(value = """
        SELECT f.id as "id", f.employee_no as "employee_no", f.designation as "designation",
               (u.first_name || ' ' || u.last_name) as "name",
               u.email as "email", d.name as "department", d.code as "dept_code"
        FROM academic_faculty f
        JOIN auth_users u ON f.user_id = u.id
        JOIN academic_departments d ON f.department_id = d.id
        WHERE f.employee_no = :identifier OR f.user_id = :identifier
        LIMIT 1
    """, nativeQuery = true)
    Map<String, Object> findFacultyProfile(@Param("identifier") String identifier);

    @Query(value = """
        SELECT c.course_code as "course_code", c.title as "title", c.credits as "credits", sem.name as "semester",
          (SELECT count(*) FROM academic_enrollments e WHERE e.course_offering_id = co.id) as "enrolled_students"
        FROM academic_course_offerings co
        JOIN academic_courses c ON co.course_id = c.id
        JOIN academic_semesters sem ON co.semester_id = sem.id
        JOIN academic_departments d ON c.department_id = d.id
        WHERE d.code = :deptCode
        ORDER BY sem.start_date DESC, c.course_code
    """, nativeQuery = true)
    List<Map<String, Object>> findCoursesByDeptCode(@Param("deptCode") String deptCode);

    @Query(value = """
        SELECT count(*) as "total_students"
        FROM academic_students s
        JOIN academic_departments d ON s.department_id = d.id
        WHERE d.code = :deptCode AND s.deleted_at IS NULL
    """, nativeQuery = true)
    Long countStudentsByDeptCode(@Param("deptCode") String deptCode);
}
