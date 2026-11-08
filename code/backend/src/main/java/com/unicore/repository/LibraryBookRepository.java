package com.unicore.repository;

import com.unicore.entity.LibraryBook;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface LibraryBookRepository extends JpaRepository<LibraryBook, String> {
    Optional<LibraryBook> findByIsbn(String isbn);
}
