package com.unicore.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "academic_students")
public class Student {

    @Id
    @Column(name = "id", length = 64)
    private String id;

    @Column(name = "user_id", nullable = false)
    private String userId;

    @Column(name = "student_no", nullable = false, unique = true)
    private String studentNo;

    @Column(name = "department_id", nullable = false)
    private String departmentId;

    @Column(name = "program_id", nullable = false)
    private String programId;

    @Column(name = "admission_year")
    private Integer admissionYear;

    @Column(name = "current_semester")
    private Integer currentSemester = 1;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;

    public Student() {
        this.id = UUID.randomUUID().toString();
    }

    public Student(String userId, String studentNo, String departmentId, String programId, Integer admissionYear, Integer currentSemester) {
        this.id = UUID.randomUUID().toString();
        this.userId = userId;
        this.studentNo = studentNo;
        this.departmentId = departmentId;
        this.programId = programId;
        this.admissionYear = admissionYear;
        this.currentSemester = currentSemester;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getStudentNo() { return studentNo; }
    public void setStudentNo(String studentNo) { this.studentNo = studentNo; }

    public String getDepartmentId() { return departmentId; }
    public void setDepartmentId(String departmentId) { this.departmentId = departmentId; }

    public String getProgramId() { return programId; }
    public void setProgramId(String programId) { this.programId = programId; }

    public Integer getAdmissionYear() { return admissionYear; }
    public void setAdmissionYear(Integer admissionYear) { this.admissionYear = admissionYear; }

    public Integer getCurrentSemester() { return currentSemester; }
    public void setCurrentSemester(Integer currentSemester) { this.currentSemester = currentSemester; }

    public LocalDateTime getDeletedAt() { return deletedAt; }
    public void setDeletedAt(LocalDateTime deletedAt) { this.deletedAt = deletedAt; }
}
