package com.unicore.repository;

import com.unicore.entity.Department;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Repository
public interface DepartmentRepository extends JpaRepository<Department, String> {
    Optional<Department> findByCode(String code);

    @Query(value = """
        SELECT d.id as "id", d.code as "code", d.name as "name",
            (SELECT count(*) FROM academic_students s WHERE s.department_id = d.id AND s.deleted_at IS NULL) as "student_count",
            (SELECT count(*) FROM academic_faculty f WHERE f.department_id = d.id) as "faculty_count",
            (SELECT count(*) FROM academic_courses c WHERE c.department_id = d.id) as "course_count"
        FROM academic_departments d
        ORDER BY d.name
    """, nativeQuery = true)
    List<Map<String, Object>> getDepartmentSummaries();
}
