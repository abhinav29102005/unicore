package com.unicore.repository;

import com.unicore.entity.LibraryBookCopy;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface LibraryBookCopyRepository extends JpaRepository<LibraryBookCopy, String> {
    Optional<LibraryBookCopy> findByBarcode(String barcode);
}
