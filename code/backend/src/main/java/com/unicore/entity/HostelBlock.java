package com.unicore.entity;

import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "hostel_blocks")
public class HostelBlock {

    @Id
    @Column(name = "id", length = 64)
    private String id;

    @Column(name = "hostel_id", nullable = false)
    private String hostelId;

    @Column(name = "name", nullable = false)
    private String name;

    public HostelBlock() {
        this.id = UUID.randomUUID().toString();
    }

    public HostelBlock(String hostelId, String name) {
        this.id = UUID.randomUUID().toString();
        this.hostelId = hostelId;
        this.name = name;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getHostelId() { return hostelId; }
    public void setHostelId(String hostelId) { this.hostelId = hostelId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
}
