package com.unicore.controller;

import com.unicore.service.SeedService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@org.springframework.boot.autoconfigure.condition.ConditionalOnProperty(name="unicore.seed-endpoint",havingValue="true")
@RestController
@RequestMapping("/api")
public class SeedController {

    private final SeedService seedService;

    public SeedController(SeedService seedService) {
        this.seedService = seedService;
    }

    @PostMapping("/seed")
    public ResponseEntity<Map<String, String>> seedDatabase() {
        seedService.seedAll();
        return ResponseEntity.ok(Map.of("message", "Database seeded successfully"));
    }
}
