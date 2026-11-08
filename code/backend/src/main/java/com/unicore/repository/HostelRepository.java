package com.unicore.repository;

import com.unicore.entity.Hostel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface HostelRepository extends JpaRepository<Hostel, String> {
    Optional<Hostel> findByCode(String code);
}
