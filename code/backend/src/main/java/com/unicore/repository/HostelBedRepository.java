package com.unicore.repository;

import com.unicore.entity.HostelBed;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface HostelBedRepository extends JpaRepository<HostelBed, String> {
    Optional<HostelBed> findByRoomIdAndBedNo(String roomId, String bedNo);
}
