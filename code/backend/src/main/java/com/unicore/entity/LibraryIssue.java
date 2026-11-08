package com.unicore.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "library_issues")
public class LibraryIssue {

    @Id
    @Column(name = "id", length = 64)
    private String id;

    @Column(name = "copy_id", nullable = false)
    private String copyId;

    @Column(name = "member_user_id", nullable = false)
    private String memberUserId;

    @Column(name = "issued_at", nullable = false)
    private LocalDateTime issuedAt;

    @Column(name = "due_at", nullable = false)
    private LocalDateTime dueAt;

    @Column(name = "returned_at")
    private LocalDateTime returnedAt;

    public LibraryIssue() {
        this.id = UUID.randomUUID().toString();
    }

    public LibraryIssue(String copyId, String memberUserId, LocalDateTime issuedAt, LocalDateTime dueAt, LocalDateTime returnedAt) {
        this.id = UUID.randomUUID().toString();
        this.copyId = copyId;
        this.memberUserId = memberUserId;
        this.issuedAt = issuedAt;
        this.dueAt = dueAt;
        this.returnedAt = returnedAt;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getCopyId() { return copyId; }
    public void setCopyId(String copyId) { this.copyId = copyId; }

    public String getMemberUserId() { return memberUserId; }
    public void setMemberUserId(String memberUserId) { this.memberUserId = memberUserId; }

    public LocalDateTime getIssuedAt() { return issuedAt; }
    public void setIssuedAt(LocalDateTime issuedAt) { this.issuedAt = issuedAt; }

    public LocalDateTime getDueAt() { return dueAt; }
    public void setDueAt(LocalDateTime dueAt) { this.dueAt = dueAt; }

    public LocalDateTime getReturnedAt() { return returnedAt; }
    public void setReturnedAt(LocalDateTime returnedAt) { this.returnedAt = returnedAt; }
}
