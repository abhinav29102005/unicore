package com.unicore.entity;

import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "hostel_rooms")
public class HostelRoom {

    @Id
    @Column(name = "id", length = 64)
    private String id;

    @Column(name = "block_id", nullable = false)
    private String blockId;

    @Column(name = "room_no", nullable = false)
    private String roomNo;

    @Column(name = "capacity")
    private Integer capacity = 2;

    public HostelRoom() {
        this.id = UUID.randomUUID().toString();
    }

    public HostelRoom(String blockId, String roomNo, Integer capacity) {
        this.id = UUID.randomUUID().toString();
        this.blockId = blockId;
        this.roomNo = roomNo;
        this.capacity = capacity;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getBlockId() { return blockId; }
    public void setBlockId(String blockId) { this.blockId = blockId; }

    public String getRoomNo() { return roomNo; }
    public void setRoomNo(String roomNo) { this.roomNo = roomNo; }

    public Integer getCapacity() { return capacity; }
    public void setCapacity(Integer capacity) { this.capacity = capacity; }
}
