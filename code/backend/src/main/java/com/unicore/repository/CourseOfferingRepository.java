package com.unicore.repository;

import com.unicore.entity.CourseOffering;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CourseOfferingRepository extends JpaRepository<CourseOffering, String> {
    Optional<CourseOffering> findByCourseIdAndSemesterId(String courseId, String semesterId);
}
