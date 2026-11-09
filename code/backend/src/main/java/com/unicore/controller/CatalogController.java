package com.unicore.controller;
import com.unicore.repository.*;
import java.util.*;
import org.springframework.web.bind.annotation.*;
@RestController
public class CatalogController {
    private final DepartmentRepository departments;private final ProgramRepository programs;private final CourseRepository courses;private final LibraryBookRepository books;private final LibraryIssueRepository issues;private final HostelBedRepository beds;private final HostelAllocationRepository allocations;
    public CatalogController(DepartmentRepository d,ProgramRepository p,CourseRepository c,LibraryBookRepository b,LibraryIssueRepository i,HostelBedRepository h,HostelAllocationRepository a){departments=d;programs=p;courses=c;books=b;issues=i;beds=h;allocations=a;}
    @GetMapping("/api/catalog")public Map<String,Object> catalog(){return Map.of("departments",departments.findAll(),"programs",programs.findAll(),"courses",courses.findAll());}
    @GetMapping("/api/staff/dashboard")public Map<String,Object> staff(){return Map.of("totalBooks",books.count(),"activeLoans",issues.countByReturnedAtIsNull(),"hostelBeds",beds.count(),"allocatedBeds",allocations.countByStatus("active"));}
}
