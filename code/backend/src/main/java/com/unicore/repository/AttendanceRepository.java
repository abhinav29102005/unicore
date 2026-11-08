package com.unicore.repository;

import com.unicore.entity.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, String> {

    @Query(value = """
        SELECT c.title as "course_name", c.course_code as "course_code",
          SUM(CASE WHEN a.status = 'present' THEN 1 ELSE 0 END) as "present",
          SUM(CASE WHEN a.status = 'absent' THEN 1 ELSE 0 END) as "absent",
          SUM(CASE WHEN a.status = 'late' THEN 1 ELSE 0 END) as "late",
          SUM(CASE WHEN a.status = 'excused' THEN 1 ELSE 0 END) as "excused",
          COUNT(*) as "total"
        FROM academic_attendance a
        JOIN academic_course_offerings co ON a.course_offering_id = co.id
        JOIN academic_courses c ON co.course_id = c.id
        WHERE a.student_id = :studentId
        GROUP BY c.title, c.course_code
        ORDER BY c.course_code
    """, nativeQuery = true)
    List<Map<String, Object>> findAttendanceSummary(@Param("studentId") String studentId);

    @Query(value = """
        SELECT c.course_code as "course_code", c.title as "course_name",
          SUM(CASE WHEN a.status = 'present' THEN 1 ELSE 0 END) as "present",
          SUM(CASE WHEN a.status = 'absent' THEN 1 ELSE 0 END) as "absent",
          SUM(CASE WHEN a.status = 'late' THEN 1 ELSE 0 END) as "late",
          SUM(CASE WHEN a.status = 'excused' THEN 1 ELSE 0 END) as "excused",
          COUNT(*) as "total",
          ROUND(100.0 * SUM(CASE WHEN a.status IN ('present', 'late') THEN 1 ELSE 0 END) / NULLIF(COUNT(*), 0), 1) as "percentage"
        FROM academic_attendance a
        JOIN academic_course_offerings co ON a.course_offering_id = co.id
        JOIN academic_courses c ON co.course_id = c.id
        WHERE a.student_id = :studentId
        GROUP BY c.course_code, c.title
        ORDER BY c.course_code
    """, nativeQuery = true)
    List<Map<String, Object>> findDetailedAttendance(@Param("studentId") String studentId);
}
