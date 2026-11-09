package com.unicore.security;

import com.unicore.repository.UserRepository;
import org.springframework.context.annotation.*;
import org.springframework.security.authentication.*;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.core.userdetails.*;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.*;
import org.springframework.security.web.context.*;
import org.springframework.security.web.csrf.HttpSessionCsrfTokenRepository;
import org.springframework.beans.factory.annotation.Value;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {
    @Bean PasswordEncoder passwords() { return new BCryptPasswordEncoder(12); }
    @Bean UserDetailsService users(UserRepository users) {
        return email -> {
            var user=users.findByEmailAndDeletedAtIsNull(email.toLowerCase()).orElseThrow(()->new UsernameNotFoundException("Invalid credentials"));
            String role=users.findRoleNameByUserId(user.getId());
            if(role==null || !java.util.Set.of("admin","student","faculty","staff").contains(role.toLowerCase()))throw new UsernameNotFoundException("Invalid account");
            return org.springframework.security.core.userdetails.User.withUsername(user.getEmail()).password(user.getPasswordHash())
                .roles(role.toUpperCase()).disabled(!"active".equals(user.getStatus())).build();
        };
    }
    @Bean AuthenticationManager authentication(UserDetailsService users,PasswordEncoder passwords) {
        var provider=new DaoAuthenticationProvider(users);provider.setPasswordEncoder(passwords);return new ProviderManager(provider);
    }
    @Bean HttpSessionSecurityContextRepository contexts() {return new HttpSessionSecurityContextRepository();}
    @Bean HttpSessionCsrfTokenRepository csrfTokens() {return new HttpSessionCsrfTokenRepository();}
    @Bean SecurityFilterChain chain(HttpSecurity http,UserDetailsService users,HttpSessionSecurityContextRepository contexts,
            HttpSessionCsrfTokenRepository csrf,@Value("${unicore.origin}") String origin) throws Exception {
        http.securityContext(c->c.securityContextRepository(contexts))
            .csrf(c->c.csrfTokenRepository(csrf))
            .addFilterAfter(new RequestGuard(origin,users),SecurityContextHolderFilter.class)
            .authorizeHttpRequests(a->a
                .requestMatchers("/api/health","/api/auth/csrf","/api/auth/login").permitAll()
                .requestMatchers("/api/seed","/h2-console/**").denyAll()
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                .requestMatchers("/api/student/**").hasAnyRole("STUDENT","ADMIN")
                .requestMatchers("/api/faculty/**").hasAnyRole("FACULTY","ADMIN")
                .requestMatchers("/api/staff/**").hasAnyRole("STAFF","ADMIN")
                .requestMatchers("/api/**").authenticated().anyRequest().permitAll())
            .exceptionHandling(e->e.authenticationEntryPoint((q,r,x)->{r.setStatus(401);r.setContentType("application/json");r.getWriter().write("{\"error\":\"Sign in to continue\"}");})
                .accessDeniedHandler((q,r,x)->{r.setStatus(403);r.setContentType("application/json");r.getWriter().write("{\"error\":\"Access denied or session check expired\"}");}))
            .requestCache(c->c.disable()).formLogin(c->c.disable()).httpBasic(c->c.disable()).logout(c->c.disable());
        return http.build();
    }
}
