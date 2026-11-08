package com.unicore.entity;

import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "academic_programs")
public class Program {

    @Id
    @Column(name = "id", length = 64)
    private String id;

    @Column(name = "department_id", nullable = false)
    private String departmentId;

    @Column(name = "code", nullable = false, unique = true)
    private String code;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "degree_type")
    private String degreeType;

    @Column(name = "duration_semesters")
    private Integer durationSemesters = 8;

    public Program() {
        this.id = UUID.randomUUID().toString();
    }

    public Program(String departmentId, String code, String name, String degreeType, Integer durationSemesters) {
        this.id = UUID.randomUUID().toString();
        this.departmentId = departmentId;
        this.code = code;
        this.name = name;
        this.degreeType = degreeType;
        this.durationSemesters = durationSemesters;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getDepartmentId() { return departmentId; }
    public void setDepartmentId(String departmentId) { this.departmentId = departmentId; }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDegreeType() { return degreeType; }
    public void setDegreeType(String degreeType) { this.degreeType = degreeType; }

    public Integer getDurationSemesters() { return durationSemesters; }
    public void setDurationSemesters(Integer durationSemesters) { this.durationSemesters = durationSemesters; }
}
