package com.unicore.security;
import com.unicore.repository.*;
import com.unicore.entity.*;
import com.unicore.service.SeedService;
import java.nio.file.*;
import java.nio.file.attribute.PosixFilePermissions;
import java.security.SecureRandom;
import java.util.*;
import org.springframework.stereotype.Component;
import org.springframework.boot.CommandLineRunner;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;

@Component
public class BootstrapAccounts implements CommandLineRunner {
    private final UserRepository users;private final RoleRepository roles;private final UserRoleRepository userRoles;private final SeedService seed;private final PasswordEncoder passwords;
    @Value("${unicore.bootstrap-email:}")private String email;
    @Value("${unicore.sample-data:false}")private boolean samples;
    @Value("${unicore.data-dir:./data}")private String directory;
    public BootstrapAccounts(UserRepository u,RoleRepository r,UserRoleRepository ur,SeedService s,PasswordEncoder p){users=u;roles=r;userRoles=ur;seed=s;passwords=p;}
    public static String randomPassword(){byte[] value=new byte[24];new SecureRandom().nextBytes(value);return Base64.getUrlEncoder().withoutPadding().encodeToString(value);}
    @Transactional public void run(String... args)throws Exception {
        if(email.isBlank()||users.count()>0)return;
        if(samples)seed.seedAll();
        Properties credentials=new Properties();
        for(var u:users.findAll()){String password=randomPassword();u.setPasswordHash(passwords.encode(password));users.save(u);credentials.setProperty(u.getEmail(),password);}
        for(String role:List.of("admin","student","faculty","staff"))if(roles.findByCode(role.toUpperCase()).isEmpty())roles.save(new Role(role.toUpperCase(),role,role+" access"));
        String password=randomPassword();var owner=users.save(new User(email.toLowerCase(),"Server","Owner",passwords.encode(password),"active"));
        userRoles.save(new UserRole(owner.getId(),roles.findByCode("ADMIN").orElseThrow().getId()));credentials.setProperty(owner.getEmail(),password);
        var path=Path.of(directory);Files.createDirectories(path);Files.setPosixFilePermissions(path,PosixFilePermissions.fromString("rwx------"));
        var file=path.resolve("initial-logins.properties");
        try(var out=Files.newOutputStream(file,StandardOpenOption.CREATE_NEW)){Files.setPosixFilePermissions(file,PosixFilePermissions.fromString("rw-------"));credentials.store(out,"Private initial UniCore passwords. Change these after first sign-in. Never publish this file.");}
    }
}
