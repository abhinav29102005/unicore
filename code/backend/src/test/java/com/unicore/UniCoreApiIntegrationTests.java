package com.unicore;
import com.unicore.repository.*;
import com.unicore.service.SeedService;
import java.util.*;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.*;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockHttpSession;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.*;
import org.springframework.web.context.WebApplicationContext;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.*;
import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;
import static org.hamcrest.Matchers.*;
import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(properties={"unicore.origin=https://unicore.test","unicore.bootstrap-email="})
@ActiveProfiles("h2")
public class UniCoreApiIntegrationTests {
 @TestConfiguration static class FastHash {@Bean @Primary PasswordEncoder testPasswords(){return new BCryptPasswordEncoder(4);}}
 @Autowired WebApplicationContext context;@Autowired SeedService seed;@Autowired UserRepository users;@Autowired PasswordEncoder passwords;
 MockMvc mvc;final String origin="https://unicore.test",password="Testing-password-123!";
 @BeforeEach void setup(){mvc=org.springframework.test.web.servlet.setup.MockMvcBuilders.webAppContextSetup(context).apply(springSecurity()).build();seed.seedAll();String hash=passwords.encode(password);for(var u:users.findAll()){u.setPasswordHash(hash);users.save(u);}}
 MockHttpSession login(String email)throws Exception {
  return (MockHttpSession)mvc.perform(post("/api/auth/login").secure(true).header("Origin",origin).with(csrf()).contentType(MediaType.APPLICATION_JSON).content("{\"email\":\""+email+"\",\"password\":\""+password+"\"}"))
   .andExpect(status().isOk()).andExpect(jsonPath("$.token").doesNotExist()).andReturn().getRequest().getSession(false);
 }
 @Test void anonymousAndForgedBearerAreRejected()throws Exception {
  mvc.perform(get("/api/admin/stats")).andExpect(status().isUnauthorized());
  mvc.perform(get("/api/admin/stats").header("Authorization","Bearer unicore-admin-token")).andExpect(status().isUnauthorized());
  mvc.perform(get("/api/student/1024030440/dashboard")).andExpect(status().isUnauthorized());
 }
 @Test void passwordsCsrfAndOriginAreEnforced()throws Exception {
  String body="{\"email\":\"abhinav@unicore.edu\",\"password\":\"wrong-password\"}";
  mvc.perform(post("/api/auth/login").header("Origin",origin).contentType(MediaType.APPLICATION_JSON).content(body)).andExpect(status().isForbidden());
  mvc.perform(post("/api/auth/login").header("Origin","https://evil.example").with(csrf()).contentType(MediaType.APPLICATION_JSON).content(body)).andExpect(status().isForbidden());
  mvc.perform(post("/api/auth/login").header("Origin",origin).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(body)).andExpect(status().isUnauthorized());
 }
 @Test void studentOnlyReadsOwnRecords()throws Exception {
  var session=login("abhinav@unicore.edu");
  mvc.perform(get("/api/auth/me").session(session)).andExpect(status().isOk()).andExpect(jsonPath("$.user.role",is("Student"))).andExpect(jsonPath("$.user.rollNo",is("1024030440")));
  mvc.perform(get("/api/student/1024030440/dashboard").session(session)).andExpect(status().isOk()).andExpect(jsonPath("$.enrollments",hasSize(greaterThan(0))));
  mvc.perform(get("/api/student/1024030440/attendance").session(session)).andExpect(status().isOk()).andExpect(jsonPath("$.attendance",hasSize(greaterThan(0))));
  mvc.perform(get("/api/student/1024030440/results").session(session)).andExpect(status().isOk()).andExpect(jsonPath("$.summary.totalCredits",greaterThan(0)));
  mvc.perform(get("/api/student/other-student/dashboard").session(session)).andExpect(status().isForbidden());
  mvc.perform(get("/api/admin/users").session(session)).andExpect(status().isForbidden());
  mvc.perform(get("/api/auth/profile/another-user").session(session)).andExpect(status().isForbidden());
  mvc.perform(post("/api/admin/accounts").session(session).header("Origin",origin).with(csrf()).contentType(MediaType.APPLICATION_JSON).content("{\"role\":\"admin\"}")).andExpect(status().isForbidden());
 }
 @Test void facultyAndStaffPermissions()throws Exception {
  var faculty=login("dr.kumar@unicore.edu");
  mvc.perform(get("/api/faculty/FAC001/dashboard").session(faculty)).andExpect(status().isOk()).andExpect(jsonPath("$.faculty.employeeNo",is("FAC001")));
  mvc.perform(get("/api/faculty/FAC002/dashboard").session(faculty)).andExpect(status().isForbidden());
  mvc.perform(get("/api/admin/stats").session(faculty)).andExpect(status().isForbidden());
  var staff=login("staff1@unicore.edu");mvc.perform(get("/api/staff/dashboard").session(staff)).andExpect(status().isOk());
  mvc.perform(get("/api/student/1024030440/dashboard").session(staff)).andExpect(status().isForbidden());
 }
 @Test void administratorReadsRealDataWithoutPasswordHashes()throws Exception {
  var admin=login("admin@unicore.edu");
  mvc.perform(get("/api/admin/stats").session(admin)).andExpect(status().isOk()).andExpect(jsonPath("$.total_students",greaterThan(0)));
  mvc.perform(get("/api/admin/users?limit=5").session(admin)).andExpect(status().isOk()).andExpect(jsonPath("$.users",hasSize(5))).andExpect(jsonPath("$.users[0].passwordHash").doesNotExist());
  mvc.perform(get("/api/admin/users?limit=100000").session(admin)).andExpect(status().isBadRequest());
  mvc.perform(post("/api/seed").session(admin).header("Origin",origin).with(csrf())).andExpect(status().isForbidden());
  mvc.perform(get("/api/admin/departments").session(admin)).andExpect(status().isOk()).andExpect(jsonPath("$",hasSize(5)));
 }
 @Test void disabledAccountsLoseExistingSessions()throws Exception {
  var student=login("abhinav@unicore.edu");var admin=login("admin@unicore.edu");var id=users.findByEmailAndDeletedAtIsNull("abhinav@unicore.edu").orElseThrow().getId();
  mvc.perform(post("/api/admin/accounts/"+id+"/disable").session(admin).header("Origin",origin).with(csrf())).andExpect(status().isOk());
  mvc.perform(get("/api/auth/me").session(student)).andExpect(status().isUnauthorized());
 }
 @Test void passwordResetRevokesSessionsAndOldPassword()throws Exception {
  var student=login("abhinav@unicore.edu");var admin=login("admin@unicore.edu");var id=users.findByEmailAndDeletedAtIsNull("abhinav@unicore.edu").orElseThrow().getId();
  mvc.perform(post("/api/admin/accounts/"+id+"/reset-password").session(admin).header("Origin",origin).with(csrf())).andExpect(status().isOk()).andExpect(jsonPath("$.password",not(emptyString())));
  mvc.perform(get("/api/auth/me").session(student)).andExpect(status().isUnauthorized());
  mvc.perform(post("/api/auth/login").header("Origin",origin).with(csrf()).contentType(MediaType.APPLICATION_JSON).content("{\"email\":\"abhinav@unicore.edu\",\"password\":\""+password+"\"}")).andExpect(status().isUnauthorized());
 }
 @Test void logoutRequiresCsrfAndInvalidatesSession()throws Exception {
  var session=login("abhinav@unicore.edu");mvc.perform(post("/api/auth/logout").header("Origin",origin).session(session)).andExpect(status().isForbidden());
  mvc.perform(post("/api/auth/logout").header("Origin",origin).session(session).with(csrf())).andExpect(status().isOk());assertTrue(session.isInvalid());
 }
 @Test void loginHasRateLimit()throws Exception {
  for(int i=0;i<8;i++)mvc.perform(post("/api/auth/login").header("Origin",origin).with(csrf()).contentType(MediaType.APPLICATION_JSON).content("{\"email\":\"rate-limit@unicore.test\",\"password\":\"wrong-password\"}")).andExpect(status().isUnauthorized());
  mvc.perform(post("/api/auth/login").header("Origin",origin).with(csrf()).contentType(MediaType.APPLICATION_JSON).content("{\"email\":\"rate-limit@unicore.test\",\"password\":\"wrong-password\"}")).andExpect(status().isTooManyRequests());
 }
}
