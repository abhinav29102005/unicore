package com.unicore.repository;

import com.unicore.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, String> {

    Optional<User> findByEmailAndDeletedAtIsNull(String email);

    Page<User> findByDeletedAtIsNullOrderByCreatedAtDesc(Pageable pageable);

    long countByDeletedAtIsNull();

    @Query(value = """
        SELECT r.name FROM auth_roles r
        JOIN auth_user_roles ur ON ur.role_id = r.id
        WHERE ur.user_id = :userId
        LIMIT 1
    """, nativeQuery = true)
    String findRoleNameByUserId(@Param("userId") String userId);
}
