package com.unicore.entity;

import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "exam_final_results")
public class FinalResult {

    @Id
    @Column(name = "id", length = 64)
    private String id;

    @Column(name = "student_id", nullable = false)
    private String studentId;

    @Column(name = "course_offering_id", nullable = false)
    private String courseOfferingId;

    @Column(name = "total_marks")
    private Double totalMarks;

    @Column(name = "grade_code", length = 10)
    private String gradeCode;

    public FinalResult() {
        this.id = UUID.randomUUID().toString();
    }

    public FinalResult(String studentId, String courseOfferingId, Double totalMarks, String gradeCode) {
        this.id = UUID.randomUUID().toString();
        this.studentId = studentId;
        this.courseOfferingId = courseOfferingId;
        this.totalMarks = totalMarks;
        this.gradeCode = gradeCode;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getStudentId() { return studentId; }
    public void setStudentId(String studentId) { this.studentId = studentId; }

    public String getCourseOfferingId() { return courseOfferingId; }
    public void setCourseOfferingId(String courseOfferingId) { this.courseOfferingId = courseOfferingId; }

    public Double getTotalMarks() { return totalMarks; }
    public void setTotalMarks(Double totalMarks) { this.totalMarks = totalMarks; }

    public String getGradeCode() { return gradeCode; }
    public void setGradeCode(String gradeCode) { this.gradeCode = gradeCode; }
}
