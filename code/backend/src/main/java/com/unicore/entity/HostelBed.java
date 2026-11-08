package com.unicore.entity;

import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "hostel_beds")
public class HostelBed {

    @Id
    @Column(name = "id", length = 64)
    private String id;

    @Column(name = "room_id", nullable = false)
    private String roomId;

    @Column(name = "bed_no", nullable = false)
    private String bedNo;

    @Column(name = "status")
    private String status = "available";

    public HostelBed() {
        this.id = UUID.randomUUID().toString();
    }

    public HostelBed(String roomId, String bedNo, String status) {
        this.id = UUID.randomUUID().toString();
        this.roomId = roomId;
        this.bedNo = bedNo;
        this.status = status;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getRoomId() { return roomId; }
    public void setRoomId(String roomId) { this.roomId = roomId; }

    public String getBedNo() { return bedNo; }
    public void setBedNo(String bedNo) { this.bedNo = bedNo; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
