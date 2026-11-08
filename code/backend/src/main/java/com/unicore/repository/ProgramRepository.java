package com.unicore.repository;

import com.unicore.entity.Program;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProgramRepository extends JpaRepository<Program, String> {
    Optional<Program> findByCode(String code);
}
