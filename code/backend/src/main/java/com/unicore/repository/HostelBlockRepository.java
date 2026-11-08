package com.unicore.repository;

import com.unicore.entity.HostelBlock;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface HostelBlockRepository extends JpaRepository<HostelBlock, String> {
    Optional<HostelBlock> findByHostelIdAndName(String hostelId, String name);
}
