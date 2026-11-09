package com.unicore.controller;
import com.unicore.entity.*;
import com.unicore.repository.*;
import com.unicore.security.BootstrapAccounts;
import java.util.*;
import java.time.Year;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/admin/accounts")
public class AccountsController {
    private final UserRepository users;private final RoleRepository roles;private final UserRoleRepository links;private final StudentRepository students;private final FacultyRepository faculty;private final DepartmentRepository departments;private final ProgramRepository programs;private final PasswordEncoder passwords;
    public AccountsController(UserRepository u,RoleRepository r,UserRoleRepository l,StudentRepository s,FacultyRepository f,DepartmentRepository d,ProgramRepository p,PasswordEncoder encoder){users=u;roles=r;links=l;students=s;faculty=f;departments=d;programs=p;passwords=encoder;}
    @PostMapping @Transactional public Map<String,Object> create(@RequestBody Map<String,String> b){
        String email=b.getOrDefault("email","").strip().toLowerCase(),first=b.getOrDefault("firstName","").strip(),last=b.getOrDefault("lastName","").strip(),role=b.getOrDefault("role","").toLowerCase();
        if(!email.matches("[^\\s@]+@[^\\s@]+\\.[^\\s@]+")||email.length()>254||first.isBlank()||last.isBlank()||first.length()>80||last.length()>80||!Set.of("admin","student","faculty","staff").contains(role))throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Enter a valid email, name and role");
        if(users.findByEmailAndDeletedAtIsNull(email).isPresent())throw new ResponseStatusException(HttpStatus.CONFLICT,"Email is already registered");
        String number=b.getOrDefault("number","").strip(),dept=b.getOrDefault("departmentId","");
        if(Set.of("student","faculty").contains(role)&&(!number.matches("[A-Za-z0-9_-]{2,40}")||!departments.existsById(dept)))throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Select a department and enter a valid student/employee number");
        if(role.equals("student")&&students.findByStudentNo(number).isPresent()||role.equals("faculty")&&faculty.findByEmployeeNoOrUserId(number,number).isPresent())throw new ResponseStatusException(HttpStatus.CONFLICT,"Student/employee number is already registered");
        if(role.equals("student")&&!programs.findById(b.getOrDefault("programId","")).map(p->p.getDepartmentId().equals(dept)).orElse(false))throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Choose a program in this department");
        String password=BootstrapAccounts.randomPassword();var user=users.save(new User(email,first,last,passwords.encode(password),"active"));
        links.save(new UserRole(user.getId(),roles.findByCode(role.toUpperCase()).orElseThrow().getId()));
        if(role.equals("student"))students.save(new Student(user.getId(),number,dept,b.get("programId"),Year.now().getValue(),1));
        if(role.equals("faculty"))faculty.save(new Faculty(user.getId(),number,dept,"Faculty"));
        return Map.of("id",user.getId(),"email",email,"password",password);
    }
    @PostMapping("/{id}/disable") @Transactional public Map<String,Boolean> disable(@PathVariable String id,Authentication a){
        var u=users.findById(id).orElseThrow(()->new ResponseStatusException(HttpStatus.NOT_FOUND));
        if(u.getEmail().equals(a.getName()))throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"You cannot disable your own administrator account");
        u.setStatus("inactive");users.save(u);return Map.of("ok",true);
    }
    @PostMapping("/{id}/reset-password") @Transactional public Map<String,String> reset(@PathVariable String id){
        var u=users.findById(id).orElseThrow(()->new ResponseStatusException(HttpStatus.NOT_FOUND));String password=BootstrapAccounts.randomPassword();u.setPasswordHash(passwords.encode(password));users.save(u);return Map.of("email",u.getEmail(),"password",password);
    }
}
