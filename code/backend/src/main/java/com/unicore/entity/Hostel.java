package com.unicore.entity;

import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "hostel_hostels")
public class Hostel {

    @Id
    @Column(name = "id", length = 64)
    private String id;

    @Column(name = "code", nullable = false, unique = true)
    private String code;

    @Column(name = "name", nullable = false)
    private String name;

    public Hostel() {
        this.id = UUID.randomUUID().toString();
    }

    public Hostel(String code, String name) {
        this.id = UUID.randomUUID().toString();
        this.code = code;
        this.name = name;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
}
