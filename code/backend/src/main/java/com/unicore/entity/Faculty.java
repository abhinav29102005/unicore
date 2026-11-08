package com.unicore.entity;

import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "academic_faculty")
public class Faculty {

    @Id
    @Column(name = "id", length = 64)
    private String id;

    @Column(name = "user_id", nullable = false)
    private String userId;

    @Column(name = "employee_no", nullable = false, unique = true)
    private String employeeNo;

    @Column(name = "department_id", nullable = false)
    private String departmentId;

    @Column(name = "designation")
    private String designation;

    public Faculty() {
        this.id = UUID.randomUUID().toString();
    }

    public Faculty(String userId, String employeeNo, String departmentId, String designation) {
        this.id = UUID.randomUUID().toString();
        this.userId = userId;
        this.employeeNo = employeeNo;
        this.departmentId = departmentId;
        this.designation = designation;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getEmployeeNo() { return employeeNo; }
    public void setEmployeeNo(String employeeNo) { this.employeeNo = employeeNo; }

    public String getDepartmentId() { return departmentId; }
    public void setDepartmentId(String departmentId) { this.departmentId = departmentId; }

    public String getDesignation() { return designation; }
    public void setDesignation(String designation) { this.designation = designation; }
}
