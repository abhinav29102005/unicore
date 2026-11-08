package com.unicore.repository;

import com.unicore.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Map;
import java.util.Optional;

@Repository
public interface StudentRepository extends JpaRepository<Student, String> {
    Optional<Student> findByStudentNoAndDeletedAtIsNull(String studentNo);

    Optional<Student> findByStudentNo(String studentNo);

    long countByDeletedAtIsNull();

    @Query(value = """
        SELECT s.id as "id", s.student_no as "roll", (u.first_name || ' ' || u.last_name) as "name",
               d.name as "department", d.code as "dept_code", s.admission_year as "admission_year",
               s.current_semester as "year", p.name as "program", u.id as "user_id"
        FROM academic_students s
        JOIN auth_users u ON s.user_id = u.id
        JOIN academic_departments d ON s.department_id = d.id
        JOIN academic_programs p ON s.program_id = p.id
        WHERE s.student_no = :studentNo
        LIMIT 1
    """, nativeQuery = true)
    Map<String, Object> findStudentDashboardProfile(@Param("studentNo") String studentNo);
}
