package com.unicore.repository;

import com.unicore.entity.HostelRoom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface HostelRoomRepository extends JpaRepository<HostelRoom, String> {
    Optional<HostelRoom> findByBlockIdAndRoomNo(String blockId, String roomNo);
}
