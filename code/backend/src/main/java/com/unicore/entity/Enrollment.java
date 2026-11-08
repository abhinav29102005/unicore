package com.unicore.entity;

import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "academic_enrollments")
public class Enrollment {

    @Id
    @Column(name = "id", length = 64)
    private String id;

    @Column(name = "student_id", nullable = false)
    private String studentId;

    @Column(name = "course_offering_id", nullable = false)
    private String courseOfferingId;

    @Column(name = "status")
    private String status = "enrolled";

    public Enrollment() {
        this.id = UUID.randomUUID().toString();
    }

    public Enrollment(String studentId, String courseOfferingId, String status) {
        this.id = UUID.randomUUID().toString();
        this.studentId = studentId;
        this.courseOfferingId = courseOfferingId;
        this.status = status;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getStudentId() { return studentId; }
    public void setStudentId(String studentId) { this.studentId = studentId; }

    public String getCourseOfferingId() { return courseOfferingId; }
    public void setCourseOfferingId(String courseOfferingId) { this.courseOfferingId = courseOfferingId; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
