package com.unicore.controller;

import com.unicore.dto.AuthResponse;
import com.unicore.dto.LoginRequest;
import com.unicore.dto.ProfileResponse;
import com.unicore.entity.User;
import com.unicore.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository userRepository;

    public AuthController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        if (request.getEmail() == null || request.getPassword() == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email and password are required"));
        }

        Optional<User> userOpt = userRepository.findByEmailAndDeletedAtIsNull(request.getEmail());
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Invalid credentials"));
        }

        User user = userOpt.get();
        if (!"active".equalsIgnoreCase(user.getStatus())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", "Account is not active"));
        }

        // Fetch role from DB
        String rawRole = userRepository.findRoleNameByUserId(user.getId());
        String role = mapRoleName(rawRole);

        user.setLastLoginAt(LocalDateTime.now());
        userRepository.save(user);

        String fullName = (user.getFirstName() + " " + user.getLastName()).trim();
        String token = "unicore-jwt-" + user.getId() + "-" + System.currentTimeMillis();

        AuthResponse.UserDto userDto = new AuthResponse.UserDto(user.getId(), fullName, user.getEmail(), role);
        return ResponseEntity.ok(new AuthResponse(userDto, token));
    }

    @GetMapping("/profile/{id}")
    public ResponseEntity<?> getProfile(@PathVariable("id") String id) {
        Optional<User> userOpt = userRepository.findById(id);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "User not found"));
        }

        User user = userOpt.get();
        String rawRole = userRepository.findRoleNameByUserId(user.getId());
        String fullName = (user.getFirstName() + " " + user.getLastName()).trim();

        ProfileResponse profile = new ProfileResponse(
                user.getId(),
                fullName,
                user.getEmail(),
                rawRole != null ? rawRole : "student",
                user.getStatus(),
                user.getLastLoginAt()
        );

        return ResponseEntity.ok(profile);
    }

    private String mapRoleName(String rawRole) {
        if (rawRole == null) return "Student";
        return switch (rawRole.toLowerCase()) {
            case "admin" -> "Admin";
            case "faculty" -> "Faculty";
            case "staff" -> "Staff";
            default -> "Student";
        };
    }
}
