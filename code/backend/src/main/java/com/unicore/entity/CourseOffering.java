package com.unicore.entity;

import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "academic_course_offerings")
public class CourseOffering {

    @Id
    @Column(name = "id", length = 64)
    private String id;

    @Column(name = "course_id", nullable = false)
    private String courseId;

    @Column(name = "semester_id", nullable = false)
    private String semesterId;

    @Column(name = "faculty_id")
    private String facultyId;

    public CourseOffering() {
        this.id = UUID.randomUUID().toString();
    }

    public CourseOffering(String courseId, String semesterId, String facultyId) {
        this.id = UUID.randomUUID().toString();
        this.courseId = courseId;
        this.semesterId = semesterId;
        this.facultyId = facultyId;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getCourseId() { return courseId; }
    public void setCourseId(String courseId) { this.courseId = courseId; }

    public String getSemesterId() { return semesterId; }
    public void setSemesterId(String semesterId) { this.semesterId = semesterId; }

    public String getFacultyId() { return facultyId; }
    public void setFacultyId(String facultyId) { this.facultyId = facultyId; }
}
