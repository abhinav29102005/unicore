package com.unicore.entity;

import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "library_book_copies")
public class LibraryBookCopy {

    @Id
    @Column(name = "id", length = 64)
    private String id;

    @Column(name = "book_id", nullable = false)
    private String bookId;

    @Column(name = "barcode", nullable = false, unique = true)
    private String barcode;

    @Column(name = "status")
    private String status = "available";

    public LibraryBookCopy() {
        this.id = UUID.randomUUID().toString();
    }

    public LibraryBookCopy(String bookId, String barcode, String status) {
        this.id = UUID.randomUUID().toString();
        this.bookId = bookId;
        this.barcode = barcode;
        this.status = status;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getBookId() { return bookId; }
    public void setBookId(String bookId) { this.bookId = bookId; }

    public String getBarcode() { return barcode; }
    public void setBarcode(String barcode) { this.barcode = barcode; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
