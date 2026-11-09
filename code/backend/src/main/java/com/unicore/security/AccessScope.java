package com.unicore.security;
import com.unicore.repository.*;
import org.springframework.stereotype.Component;
import org.springframework.security.core.Authentication;
@Component("scope")
public class AccessScope {
    private final UserRepository users;private final StudentRepository students;private final FacultyRepository faculty;
    public AccessScope(UserRepository u,StudentRepository s,FacultyRepository f){users=u;students=s;faculty=f;}
    public boolean admin(Authentication a){return a!=null && a.getAuthorities().stream().anyMatch(x->x.getAuthority().equals("ROLE_ADMIN"));}
    public String userId(Authentication a){return users.findByEmailAndDeletedAtIsNull(a.getName()).map(u->u.getId()).orElse("");}
    public boolean profile(Authentication a,String id){return admin(a)||userId(a).equals(id);}
    public boolean student(Authentication a,String number){return admin(a)||students.findByStudentNoAndDeletedAtIsNull(number).map(s->s.getUserId().equals(userId(a))).orElse(false);}
    public boolean faculty(Authentication a,String id){return admin(a)||faculty.findByEmployeeNoOrUserId(id,id).map(f->f.getUserId().equals(userId(a))).orElse(false);}
}
