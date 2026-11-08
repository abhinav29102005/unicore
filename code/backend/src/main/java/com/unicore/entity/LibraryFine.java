package com.unicore.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "library_fines")
public class LibraryFine {

    @Id
    @Column(name = "id", length = 64)
    private String id;

    @Column(name = "member_user_id", nullable = false)
    private String memberUserId;

    @Column(name = "amount", nullable = false)
    private Double amount;

    @Column(name = "reason")
    private String reason;

    @Column(name = "settled_at")
    private LocalDateTime settledAt;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public LibraryFine() {
        this.id = UUID.randomUUID().toString();
    }

    public LibraryFine(String memberUserId, Double amount, String reason, LocalDateTime settledAt) {
        this.id = UUID.randomUUID().toString();
        this.memberUserId = memberUserId;
        this.amount = amount;
        this.reason = reason;
        this.settledAt = settledAt;
        this.createdAt = LocalDateTime.now();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getMemberUserId() { return memberUserId; }
    public void setMemberUserId(String memberUserId) { this.memberUserId = memberUserId; }

    public Double getAmount() { return amount; }
    public void setAmount(Double amount) { this.amount = amount; }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }

    public LocalDateTime getSettledAt() { return settledAt; }
    public void setSettledAt(LocalDateTime settledAt) { this.settledAt = settledAt; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
