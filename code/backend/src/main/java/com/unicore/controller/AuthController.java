package com.unicore.controller;

import com.unicore.repository.*;
import com.unicore.entity.User;
import com.unicore.dto.LoginRequest;
import com.unicore.security.LoginLimits;
import jakarta.servlet.http.*;
import java.util.*;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.*;
import org.springframework.security.core.*;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.security.web.csrf.*;
import org.springframework.security.web.authentication.session.ChangeSessionIdAuthenticationStrategy;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final UserRepository users;private final StudentRepository students;private final FacultyRepository faculty;
    private final AuthenticationManager authentication;private final HttpSessionSecurityContextRepository contexts;
    private final HttpSessionCsrfTokenRepository csrf;private final PasswordEncoder passwords;private final LoginLimits limits;
    @Value("${unicore.sample-data:false}") private boolean sampleData;
    public AuthController(UserRepository u,StudentRepository s,FacultyRepository f,AuthenticationManager a,HttpSessionSecurityContextRepository c,HttpSessionCsrfTokenRepository token,PasswordEncoder p,LoginLimits l){users=u;students=s;faculty=f;authentication=a;contexts=c;csrf=token;passwords=p;limits=l;}
    @GetMapping("/csrf") public Map<String,String> csrf(CsrfToken token){return Map.of("token",token.getToken());}
    public Map<String,Object> profile(User u){
        String role=users.findRoleNameByUserId(u.getId());
        var result=new LinkedHashMap<String,Object>();result.put("id",u.getId());result.put("email",u.getEmail());result.put("name",(u.getFirstName()+" "+u.getLastName()).trim());
        result.put("role",role.substring(0,1).toUpperCase()+role.substring(1).toLowerCase());
        students.findByUserId(u.getId()).ifPresent(s->result.put("rollNo",s.getStudentNo()));
        faculty.findByEmployeeNoOrUserId(u.getId(),u.getId()).ifPresent(f->result.put("employeeNo",f.getEmployeeNo()));return result;
    }
    @PostMapping("/login") public Map<String,Object> login(@RequestBody LoginRequest body,HttpServletRequest q,HttpServletResponse r){
        String email=body.getEmail()==null?"":body.getEmail().strip().toLowerCase();String password=body.getPassword()==null?"":body.getPassword();
        if(email.length()>254 || email.isEmpty() || password.isEmpty() || password.getBytes(StandardCharsets.UTF_8).length>72)throw new ResponseStatusException(HttpStatus.UNAUTHORIZED,"Invalid credentials");
        String ip=Optional.ofNullable(q.getHeader("CF-Connecting-IP")).orElse(q.getRemoteAddr());limits.check(email,ip);
        Authentication auth;
        try{auth=authentication.authenticate(UsernamePasswordAuthenticationToken.unauthenticated(email,password));}
        catch(AuthenticationException ex){throw new ResponseStatusException(HttpStatus.UNAUTHORIZED,"Invalid credentials");}
        var u=users.findByEmailAndDeletedAtIsNull(email).orElseThrow();
        var principal=org.springframework.security.core.userdetails.User.withUsername(email).password(u.getPasswordHash()).authorities(auth.getAuthorities()).build();
        auth=UsernamePasswordAuthenticationToken.authenticated(principal,null,auth.getAuthorities());
        new ChangeSessionIdAuthenticationStrategy().onAuthentication(auth,q,r);
        var context=SecurityContextHolder.createEmptyContext();context.setAuthentication(auth);SecurityContextHolder.setContext(context);contexts.saveContext(context,q,r);csrf.saveToken(null,q,r);
        u.setLastLoginAt(LocalDateTime.now());users.save(u);limits.success(email,ip);
        return Map.of("user",profile(u),"sampleData",sampleData);
    }
    @GetMapping("/me") public Map<String,Object> me(Authentication auth){return Map.of("user",profile(users.findByEmailAndDeletedAtIsNull(auth.getName()).orElseThrow()),"sampleData",sampleData);}
    @GetMapping("/profile/{id}") @PreAuthorize("@scope.profile(authentication,#id)")
    public Map<String,Object> getProfile(@PathVariable("id") String id){return profile(users.findById(id).orElseThrow(()->new ResponseStatusException(HttpStatus.NOT_FOUND)));}
    @PostMapping("/logout") public Map<String,Boolean> logout(HttpServletRequest q,HttpServletResponse r){var s=q.getSession(false);if(s!=null)s.invalidate();SecurityContextHolder.clearContext();r.addHeader("Set-Cookie","__Host-unicore=; Path=/; Max-Age=0; Secure; HttpOnly; SameSite=Strict");return Map.of("ok",true);}
    @PostMapping("/password") public Map<String,Boolean> password(@RequestBody Map<String,String> body,Authentication auth,HttpServletRequest q,HttpServletResponse r){
        var u=users.findByEmailAndDeletedAtIsNull(auth.getName()).orElseThrow();String value=body.getOrDefault("password","");validPassword(value);
        if(!passwords.matches(body.getOrDefault("current",""),u.getPasswordHash()))throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Current password is incorrect");
        u.setPasswordHash(passwords.encode(value));users.save(u);return logout(q,r);
    }
    public static void validPassword(String value){if(value.length()<12||value.getBytes(StandardCharsets.UTF_8).length>72)throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Use 12 or more characters, up to 72 UTF-8 bytes");}
}
