package com.unicore.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "exam_grade_scale")
public class GradeScale {

    @Id
    @Column(name = "grade_code", length = 10)
    private String gradeCode;

    @Column(name = "grade_points", nullable = false)
    private Double gradePoints;

    @Column(name = "min_marks")
    private Double minMarks;

    @Column(name = "max_marks")
    private Double maxMarks;

    public GradeScale() {}

    public GradeScale(String gradeCode, Double gradePoints, Double minMarks, Double maxMarks) {
        this.gradeCode = gradeCode;
        this.gradePoints = gradePoints;
        this.minMarks = minMarks;
        this.maxMarks = maxMarks;
    }

    public String getGradeCode() { return gradeCode; }
    public void setGradeCode(String gradeCode) { this.gradeCode = gradeCode; }

    public Double getGradePoints() { return gradePoints; }
    public void setGradePoints(Double gradePoints) { this.gradePoints = gradePoints; }

    public Double getMinMarks() { return minMarks; }
    public void setMinMarks(Double minMarks) { this.minMarks = minMarks; }

    public Double getMaxMarks() { return maxMarks; }
    public void setMaxMarks(Double maxMarks) { this.maxMarks = maxMarks; }
}
