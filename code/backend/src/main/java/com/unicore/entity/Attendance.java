package com.unicore.entity;

import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "academic_attendance")
public class Attendance {

    @Id
    @Column(name = "id", length = 64)
    private String id;

    @Column(name = "student_id", nullable = false)
    private String studentId;

    @Column(name = "course_offering_id", nullable = false)
    private String courseOfferingId;

    @Column(name = "session_date", nullable = false)
    private String sessionDate;

    @Column(name = "status", nullable = false)
    private String status = "present";

    public Attendance() {
        this.id = UUID.randomUUID().toString();
    }

    public Attendance(String studentId, String courseOfferingId, String sessionDate, String status) {
        this.id = UUID.randomUUID().toString();
        this.studentId = studentId;
        this.courseOfferingId = courseOfferingId;
        this.sessionDate = sessionDate;
        this.status = status;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getStudentId() { return studentId; }
    public void setStudentId(String studentId) { this.studentId = studentId; }

    public String getCourseOfferingId() { return courseOfferingId; }
    public void setCourseOfferingId(String courseOfferingId) { this.courseOfferingId = courseOfferingId; }

    public String getSessionDate() { return sessionDate; }
    public void setSessionDate(String sessionDate) { this.sessionDate = sessionDate; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
