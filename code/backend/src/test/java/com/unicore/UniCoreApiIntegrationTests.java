package com.unicore;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.unicore.dto.LoginRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("h2")
public class UniCoreApiIntegrationTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @BeforeEach
    void setup() throws Exception {
        // Seed the test database before tests
        mockMvc.perform(post("/api/seed"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message", is("Database seeded successfully")));
    }

    @Test
    void testAuthLoginAndProfile() throws Exception {
        // 1. Valid Login
        LoginRequest loginRequest = new LoginRequest("abhinav@unicore.edu", "anyPassword");
        String responseContent = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.user.email", is("abhinav@unicore.edu")))
                .andExpect(jsonPath("$.user.name", is("Abhinav Kumar")))
                .andExpect(jsonPath("$.user.role", is("Student")))
                .andExpect(jsonPath("$.token", startsWith("unicore-jwt-")))
                .andReturn().getResponse().getContentAsString();

        // Extract user ID
        String userId = objectMapper.readTree(responseContent).path("user").path("id").asText();

        // 2. Profile lookup
        mockMvc.perform(get("/api/auth/profile/" + userId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(userId)))
                .andExpect(jsonPath("$.email", is("abhinav@unicore.edu")))
                .andExpect(jsonPath("$.name", is("Abhinav Kumar")))
                .andExpect(jsonPath("$.status", is("active")));
    }

    @Test
    void testStudentDashboard() throws Exception {
        mockMvc.perform(get("/api/student/1024030440/dashboard"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.student.roll", is("1024030440")))
                .andExpect(jsonPath("$.student.name", is("Abhinav Kumar")))
                .andExpect(jsonPath("$.student.department", is("Computer Science & Engineering")))
                .andExpect(jsonPath("$.student.gpa", greaterThanOrEqualTo(0.0)))
                .andExpect(jsonPath("$.hostel.block", is("Tagore Hall")))
                .andExpect(jsonPath("$.hostel.room", is("301")))
                .andExpect(jsonPath("$.enrollments", hasSize(greaterThan(0))))
                .andExpect(jsonPath("$.attendance", hasSize(greaterThan(0))));
    }

    @Test
    void testStudentAttendance() throws Exception {
        mockMvc.perform(get("/api/student/1024030440/attendance"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.attendance", hasSize(greaterThan(0))))
                .andExpect(jsonPath("$.attendance[0].course_code", notNullValue()))
                .andExpect(jsonPath("$.attendance[0].percentage", notNullValue()));
    }

    @Test
    void testStudentResults() throws Exception {
        mockMvc.perform(get("/api/student/1024030440/results"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.results", hasSize(greaterThan(0))))
                .andExpect(jsonPath("$.summary.totalCredits", greaterThan(0)))
                .andExpect(jsonPath("$.summary.cgpa", greaterThan(0.0)));
    }

    @Test
    void testAdminEndpoints() throws Exception {
        // Stats
        mockMvc.perform(get("/api/admin/stats"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.total_students", greaterThan(0)))
                .andExpect(jsonPath("$.total_faculty", greaterThan(0)))
                .andExpect(jsonPath("$.total_courses", greaterThan(0)))
                .andExpect(jsonPath("$.total_departments", greaterThan(0)));

        // Users
        mockMvc.perform(get("/api/admin/users?page=1&limit=5"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.users", hasSize(5)))
                .andExpect(jsonPath("$.pagination.total", greaterThan(0)));

        // Departments
        mockMvc.perform(get("/api/admin/departments"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(5)));
    }

    @Test
    void testFacultyDashboard() throws Exception {
        mockMvc.perform(get("/api/faculty/FAC001/dashboard"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.faculty.employeeNo", is("FAC001")))
                .andExpect(jsonPath("$.faculty.name", is("Dr. Rajesh Kumar")))
                .andExpect(jsonPath("$.faculty.department", is("Computer Science & Engineering")))
                .andExpect(jsonPath("$.departmentStudents", greaterThan(0)));
    }
}
