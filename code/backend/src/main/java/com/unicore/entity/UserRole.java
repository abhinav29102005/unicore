package com.unicore.entity;

import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "auth_user_roles")
public class UserRole {

    @Id
    @Column(name = "id", length = 64)
    private String id;

    @Column(name = "user_id", nullable = false)
    private String userId;

    @Column(name = "role_id", nullable = false)
    private String roleId;

    public UserRole() {
        this.id = UUID.randomUUID().toString();
    }

    public UserRole(String userId, String roleId) {
        this.id = UUID.randomUUID().toString();
        this.userId = userId;
        this.roleId = roleId;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getRoleId() { return roleId; }
    public void setRoleId(String roleId) { this.roleId = roleId; }
}
