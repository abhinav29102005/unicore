package com.unicore.repository;

import com.unicore.entity.FinalResult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository
public interface FinalResultRepository extends JpaRepository<FinalResult, String> {

    @Query(value = """
        SELECT
          COALESCE(
            ROUND(
              (1.0 * SUM(gs.grade_points * c.credits)) / NULLIF(SUM(c.credits), 0),
              2
            ), 0
          ) as "gpa"
        FROM exam_final_results fr
        JOIN exam_grade_scale gs ON gs.grade_code = fr.grade_code
        JOIN academic_course_offerings co ON fr.course_offering_id = co.id
        JOIN academic_courses c ON co.course_id = c.id
        WHERE fr.student_id = :studentId
    """, nativeQuery = true)
    Double calculateGpaForStudent(@Param("studentId") String studentId);

    @Query(value = """
        SELECT c.course_code as "course_code", c.title as "course_name", c.credits as "credits",
               fr.total_marks as "total_marks", fr.grade_code as "grade",
               gs.grade_points as "grade_points"
        FROM exam_final_results fr
        JOIN academic_course_offerings co ON fr.course_offering_id = co.id
        JOIN academic_courses c ON co.course_id = c.id
        JOIN exam_grade_scale gs ON gs.grade_code = fr.grade_code
        WHERE fr.student_id = :studentId
        ORDER BY c.course_code
    """, nativeQuery = true)
    List<Map<String, Object>> findDetailedResultsForStudent(@Param("studentId") String studentId);
}
