package com.unicore.repository;

import com.unicore.entity.Enrollment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository
public interface EnrollmentRepository extends JpaRepository<Enrollment, String> {

    @Query(value = """
        SELECT c.course_code as "course_code", c.title as "course_name", c.credits as "credits",
               COALESCE(fr.grade_code, 'Pending') as "grade",
               fr.total_marks as "total_marks"
        FROM academic_enrollments e
        JOIN academic_course_offerings co ON e.course_offering_id = co.id
        JOIN academic_courses c ON co.course_id = c.id
        LEFT JOIN exam_final_results fr ON fr.course_offering_id = co.id AND fr.student_id = e.student_id
        WHERE e.student_id = :studentId
        ORDER BY c.course_code
    """, nativeQuery = true)
    List<Map<String, Object>> findEnrollmentsWithGrades(@Param("studentId") String studentId);
}
