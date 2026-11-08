package com.unicore.dto;

import java.time.LocalDateTime;

public class ProfileResponse {
    private String id;
    private String name;
    private String email;
    private String role;
    private String status;
    private LocalDateTime lastLogin;

    public ProfileResponse() {}

    public ProfileResponse(String id, String name, String email, String role, String status, LocalDateTime lastLogin) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.role = role;
        this.status = status;
        this.lastLogin = lastLogin;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getLastLogin() { return lastLogin; }
    public void setLastLogin(LocalDateTime lastLogin) { this.lastLogin = lastLogin; }
}
