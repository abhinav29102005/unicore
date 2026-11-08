package com.unicore.repository;

import com.unicore.entity.LibraryIssue;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository
public interface LibraryIssueRepository extends JpaRepository<LibraryIssue, String> {

    @Query(value = """
        SELECT b.title as "book_title", i.due_at as "due_date", i.issued_at as "issued_at"
        FROM library_issues i
        JOIN library_book_copies bc ON i.copy_id = bc.id
        JOIN library_books b ON bc.book_id = b.id
        WHERE i.member_user_id = :userId AND i.returned_at IS NULL
    """, nativeQuery = true)
    List<Map<String, Object>> findActiveIssuesByUserId(@Param("userId") String userId);

    long countByReturnedAtIsNull();
}
