package com.unicore.entity;

import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "hostel_allocations")
public class HostelAllocation {

    @Id
    @Column(name = "id", length = 64)
    private String id;

    @Column(name = "student_id", nullable = false)
    private String studentId;

    @Column(name = "bed_id", nullable = false)
    private String bedId;

    @Column(name = "status")
    private String status = "active";

    public HostelAllocation() {
        this.id = UUID.randomUUID().toString();
    }

    public HostelAllocation(String studentId, String bedId, String status) {
        this.id = UUID.randomUUID().toString();
        this.studentId = studentId;
        this.bedId = bedId;
        this.status = status;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getStudentId() { return studentId; }
    public void setStudentId(String studentId) { this.studentId = studentId; }

    public String getBedId() { return bedId; }
    public void setBedId(String bedId) { this.bedId = bedId; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
