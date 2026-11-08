package com.unicore.repository;

import com.unicore.entity.HostelAllocation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Map;

@Repository
public interface HostelAllocationRepository extends JpaRepository<HostelAllocation, String> {

    @Query(value = """
        SELECT h.name as "block", r.room_no as "room", a.status as "status"
        FROM hostel_allocations a
        JOIN hostel_beds b ON a.bed_id = b.id
        JOIN hostel_rooms r ON b.room_id = r.id
        JOIN hostel_blocks bl ON r.block_id = bl.id
        JOIN hostel_hostels h ON bl.hostel_id = h.id
        WHERE a.student_id = :studentId AND a.status = 'active'
        LIMIT 1
    """, nativeQuery = true)
    Map<String, Object> findActiveHostelAllocation(@Param("studentId") String studentId);

    long countByStatus(String status);
}
