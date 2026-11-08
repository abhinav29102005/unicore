package com.unicore.repository;

import com.unicore.entity.GradeScale;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GradeScaleRepository extends JpaRepository<GradeScale, String> {
}
