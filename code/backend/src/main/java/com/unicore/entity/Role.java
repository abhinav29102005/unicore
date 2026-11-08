package com.unicore.entity;

import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "auth_roles")
public class Role {

    @Id
    @Column(name = "id", length = 64)
    private String id;

    @Column(name = "code", nullable = false, unique = true)
    private String code;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "description")
    private String description;

    @Column(name = "is_system")
    private Boolean isSystem = true;

    public Role() {
        this.id = UUID.randomUUID().toString();
    }

    public Role(String code, String name, String description) {
        this.id = UUID.randomUUID().toString();
        this.code = code;
        this.name = name;
        this.description = description;
        this.isSystem = true;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Boolean getIsSystem() { return isSystem; }
    public void setIsSystem(Boolean isSystem) { this.isSystem = isSystem; }
}
