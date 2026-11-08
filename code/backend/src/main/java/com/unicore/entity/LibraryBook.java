package com.unicore.entity;

import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "library_books")
public class LibraryBook {

    @Id
    @Column(name = "id", length = 64)
    private String id;

    @Column(name = "isbn", unique = true)
    private String isbn;

    @Column(name = "title", nullable = false)
    private String title;

    public LibraryBook() {
        this.id = UUID.randomUUID().toString();
    }

    public LibraryBook(String isbn, String title) {
        this.id = UUID.randomUUID().toString();
        this.isbn = isbn;
        this.title = title;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getIsbn() { return isbn; }
    public void setIsbn(String isbn) { this.isbn = isbn; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
}
