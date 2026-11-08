package com.unicore.entity;

import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "academic_courses")
public class Course {

    @Id
    @Column(name = "id", length = 64)
    private String id;

    @Column(name = "course_code", nullable = false, unique = true)
    private String courseCode;

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "credits", nullable = false)
    private Integer credits = 3;

    @Column(name = "department_id", nullable = false)
    private String departmentId;

    public Course() {
        this.id = UUID.randomUUID().toString();
    }

    public Course(String courseCode, String title, Integer credits, String departmentId) {
        this.id = UUID.randomUUID().toString();
        this.courseCode = courseCode;
        this.title = title;
        this.credits = credits;
        this.departmentId = departmentId;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getCourseCode() { return courseCode; }
    public void setCourseCode(String courseCode) { this.courseCode = courseCode; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public Integer getCredits() { return credits; }
    public void setCredits(Integer credits) { this.credits = credits; }

    public String getDepartmentId() { return departmentId; }
    public void setDepartmentId(String departmentId) { this.departmentId = departmentId; }
}
