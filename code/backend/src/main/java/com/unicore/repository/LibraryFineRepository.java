package com.unicore.repository;

import com.unicore.entity.LibraryFine;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository
public interface LibraryFineRepository extends JpaRepository<LibraryFine, String> {

    @Query(value = """
        SELECT amount as "amount", reason as "reason",
               CASE WHEN settled_at IS NOT NULL THEN 'paid' ELSE 'unpaid' END as "status",
               created_at as "created_at"
        FROM library_fines
        WHERE member_user_id = :userId
        ORDER BY created_at DESC
    """, nativeQuery = true)
    List<Map<String, Object>> findFinesByUserId(@Param("userId") String userId);

    long countBySettledAtIsNull();
}
